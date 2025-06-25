'use client';

import { useState, useEffect, useCallback } from 'react';
import { SyncMessage, DevicePosition } from '@/types/sync';
import { useClockSync } from '@/hooks/useClockSync';
import { useAudioEngine } from '@/hooks/useAudioEngine';
import AudioControls from '@/components/AudioControls';
import SpatialGrid from '@/components/SpatialGrid';
import FileUpload from '@/components/FileUpload';

export default function Home() {
  const [ws, setWs] = useState<WebSocket | null>(null);






















































































































































  const [sessionId, setSessionId] = useState<string>('');
  const [deviceId] = useState(() => Math.random().toString(36).substr(2, 9));
  const [devices, setDevices] = useState<DevicePosition[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  
  const { clockSync, handlePong, getServerTime } = useClockSync(ws);
  const audioEngine = useAudioEngine();

  useEffect(() => {
    let socket: WebSocket | null = null;
    let reconnectTimeout: NodeJS.Timeout;
    
    const connect = () => {
      try {
        socket = new WebSocket('ws://localhost:8081');
        
        socket.onopen = () => {
          setIsConnected(true);
          setWs(socket);
          
          // Join session
          const joinMessage: SyncMessage = {
            type: 'join',
            timestamp: performance.now(),
            sessionId: sessionId || 'default',
            data: { deviceId }
          };
          socket?.send(JSON.stringify(joinMessage));
        };
        
        socket.onmessage = (event) => {
          const message: SyncMessage = JSON.parse(event.data);
          
          switch (message.type) {
            case 'pong':
              handlePong(message);
              break;
            case 'play':
              const playTime = getServerTime() + 100;
              audioEngine.schedulePlay(playTime, message.data.offset || 0);
              break;
            case 'pause':
              audioEngine.pause();
              break;
            case 'upload':
              audioEngine.loadAudio(message.data.audioUrl);
              break;
            case 'position':
              setDevices(message.data.devices);
              break;
          }
        };
        
        socket.onclose = () => {
          setIsConnected(false);
          setWs(null);
          
          // Attempt to reconnect after 3 seconds
          reconnectTimeout = setTimeout(connect, 3000);
        };
        
        socket.onerror = (error) => {










































































































































































          console.error('WebSocket error:', error);
        };
        
      } catch (error) {
        console.error('Failed to create WebSocket:', error);
        reconnectTimeout = setTimeout(connect, 3000);
      }
    };
    
    connect();
    
    return () => {
      clearTimeout(reconnectTimeout);
      if (socket) {
        socket.close();
      }
    };
  }, [sessionId, deviceId]); // Reduced dependencies
  
  // Remove the connectWebSocket useCallback entirely

  const sendMessage = useCallback((message: Omit<SyncMessage, 'timestamp'>) => {
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({
        ...message,
        timestamp: getServerTime(),
        sessionId
      }));
    }
  }, [ws, getServerTime, sessionId]);

  const handleFileUpload = useCallback(async (file: File) => {
    try {
      const formData = new FormData();
      formData.append('audio', file);
      formData.append('sessionId', sessionId || 'default');
      
      const response = await fetch('http://localhost:8081/upload', {
        method: 'POST',
        body: formData
      });
      
      if (!response.ok) {
        throw new Error(`Upload failed: ${response.statusText}`);
      }
      
      const result = await response.json();
      console.log('File uploaded successfully:', result);
      
      // The server will broadcast the upload message to all connected clients
      // including this one, so we don't need to manually load the audio here
      
    } catch (error) {
      console.error('Error uploading file:', error);
      // You might want to show a user-friendly error message here
    }
  }, [sessionId]);

  // Add this to the return statement around line 120-168
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Header */}
      <div className="bg-gray-800/50 backdrop-blur-sm border-b border-gray-700 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">BeatSync</h1>
                <p className="text-sm text-gray-400">Synchronized Spatial Audio</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm ${
                isConnected 
                  ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                  : 'bg-red-500/20 text-red-400 border border-red-500/30'
              }`}>
                <div className={`w-2 h-2 rounded-full ${
                  isConnected ? 'bg-green-400 animate-pulse' : 'bg-red-400'
                }`} />
                {isConnected ? 'Connected' : 'Disconnected'}
              </div>
              
              <div className="text-xs text-gray-500">
                Device: {deviceId}
              </div>
            </div>
          </div>
        </div>
      </div>
  
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column */}
          <div className="space-y-8">
            <FileUpload onUpload={handleFileUpload} />
            
            <AudioControls
              audioState={audioEngine.audioState}
              onPlay={() => sendMessage({ type: 'play' })}
              onPause={() => sendMessage({ type: 'pause' })}
              onSeek={(time) => sendMessage({ type: 'seek', data: { time } })}
            />
          </div>
          
          {/* Right Column */}
          <div>
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-xl shadow-lg border border-gray-700">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-white">Spatial Audio</h2>
                  <p className="text-sm text-gray-400">Drag to position yourself in the audio space</p>
                </div>
              </div>
              
              <SpatialGrid
                devices={devices}
                currentDeviceId={deviceId}
                onPositionChange={(position) => {
                  sendMessage({
                    type: 'position',
                    data: { deviceId, position }
                  });
                  
                  const distance = Math.sqrt(position.x ** 2 + position.y ** 2);
                  const volume = Math.max(0.1, 1 - distance / 100);
                  audioEngine.setVolume(volume);
                }}
              />
              
              {/* Connected Devices Info */}
              <div className="mt-4 p-3 bg-gray-700/50 rounded-lg">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">Connected Devices:</span>
                  <span className="text-white font-medium">{devices.length}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
