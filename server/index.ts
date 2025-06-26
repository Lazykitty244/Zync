// Enhanced Bun type declarations
declare module 'bun' {
  export function serve(options: {
    port: number;
    fetch: (req: Request, server: any) => Response | Promise<Response>;
    websocket?: {
      message: (ws: any, message: string | Buffer) => void;
      open?: (ws: any) => void;
      close?: (ws: any) => void;
    };
  }): any;
  
  export interface ServerWebSocket<T> {
    send(data: string): void;
    close(): void;
  }
}

import { serve, ServerWebSocket } from 'bun';

interface SyncMessage {
  type: string;
  timestamp: number;
  sessionId?: string;
  deviceId?: string;  // Added for type compatibility
  sessionName?: string;  // Added for create_session messages
  data?: any;
}

interface Client {
  ws: ServerWebSocket<unknown>;
  deviceId: string;
  sessionId: string;
}

interface SessionInfo {
  sessionId: string;
  name: string;
  createdAt: Date;
  deviceCount: number;
  isActive: boolean;
}

interface CreateSessionMessage {
  type: 'create_session';
  sessionName?: string;
  deviceId: string;
}

const clients = new Map<string, Client>();
// Fixed: sessions should store deviceId strings, not WebSocket objects
const sessions = new Map<string, Set<string>>();
const sessionInfo = new Map<string, SessionInfo>();

function generateSessionId(): string {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

function handleCreateSession(ws: ServerWebSocket<unknown>, message: CreateSessionMessage) {
  const sessionId = generateSessionId();
  const session = new Set([message.deviceId]);
  sessions.set(sessionId, session);
  
  sessionInfo.set(sessionId, {
    sessionId,
    name: message.sessionName || `Session ${sessionId}`,
    createdAt: new Date(),
    deviceCount: 1,
    isActive: true
  });
  
  ws.send(JSON.stringify({
    type: 'session_created',
    sessionId,
    sessionInfo: sessionInfo.get(sessionId)
  }));
}

const server = serve({
  port: 8081,
  fetch(req, server) {
    const url = new URL(req.url);
    
    // Session validation endpoint
    if (url.pathname.startsWith('/session/') && url.pathname.endsWith('/validate')) {
      const sessionId = url.pathname.split('/')[2];
      return new Response(JSON.stringify({ 
        exists: sessionInfo.has(sessionId) 
      }), {
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    if (url.pathname === '/upload' && req.method === 'POST') {
      return handleFileUpload(req);
    }
    
    if (url.pathname === '/audio' && req.method === 'GET') {
      return handleAudioServe(url.searchParams.get('file'));
    }
    
    if (server.upgrade(req)) {
      return;
    }
    
    return new Response('Hello from BeatSync server!');
  },
  websocket: {
    message(ws, message) {
      const data: SyncMessage = JSON.parse(message.toString());
      handleWebSocketMessage(ws, data);
    },
    open(ws) {
      console.log('Client connected');
    },
    close(ws) {
      // Fixed: Remove client from sessions properly
      for (const [clientId, client] of clients.entries()) {
        if (client.ws === ws) {
          const session = sessions.get(client.sessionId);
          session?.delete(clientId);
          clients.delete(clientId);
          break;
        }
      }
    }
  }
});

function handleWebSocketMessage(ws: ServerWebSocket<unknown>, message: SyncMessage) {
  const now = performance.now();
  
  switch (message.type) {
    case 'create_session':
      // Type-safe conversion now works due to updated SyncMessage interface
      if (message.deviceId) {
        handleCreateSession(ws, message as CreateSessionMessage);
      } else {
        console.error('Invalid create_session message: missing deviceId');
      }
      break;
      
    case 'ping':
      ws.send(JSON.stringify({
        type: 'pong',
        timestamp: now,
        data: {
          t1: message.timestamp,
          t2: now,
          t3: now
        }
      }));
      break;
      
    case 'join':
      // Fixed: Add null check for message.data
      const deviceId = message.data?.deviceId;
      const sessionId = message.sessionId || 'default';
      
      if (!deviceId) {
        console.error('No deviceId provided in join message');
        return;
      }
      
      clients.set(deviceId, { ws, deviceId, sessionId });
      
      if (!sessions.has(sessionId)) {
        sessions.set(sessionId, new Set());
      }
      sessions.get(sessionId)!.add(deviceId);
      break;
      
    case 'play':
    case 'pause':
    case 'seek':
    case 'upload':
    case 'position':
      // Broadcast to all clients in the same session
      const client = Array.from(clients.values()).find(c => c.ws === ws);
      if (client) {
        const sessionClients = sessions.get(client.sessionId);
        sessionClients?.forEach(clientId => {
          const targetClient = clients.get(clientId);
          if (targetClient && targetClient.ws !== ws) {
            targetClient.ws.send(JSON.stringify({
              ...message,
              timestamp: now
            }));
          }
        });
      }
      break;
  }
}

async function handleFileUpload(req: Request) {
  const formData = await req.formData();
  const file = formData.get('audio') as File;
  
  if (!file) {
    return new Response('No file uploaded', { status: 400 });
  }
  
  // Save file to uploads directory
  const filename = `${Date.now()}-${file.name}`;
  await Bun.write(`uploads/${filename}`, file);
  
  return new Response(JSON.stringify({ filename, url: `/audio?file=${filename}` }));
}

function handleAudioServe(filename: string | null) {
  if (!filename) {
    return new Response('File not specified', { status: 400 });
  }
  
  const file = Bun.file(`uploads/${filename}`);
  return new Response(file);
}

console.log('BeatSync server running on port 8081');