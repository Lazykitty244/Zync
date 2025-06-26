export interface SyncMessage {
  type: 'ping' | 'pong' | 'play' | 'pause' | 'stop' | 'seek' | 'upload' | 'join' | 'position';
  timestamp: number;
  sessionId?: string;
  data?: any;
}

export interface ClockSync {
  offset: number;
  roundTripTime: number;
  lastSync: number;
}

export interface AudioState {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  audioUrl?: string;
}

export interface DevicePosition {
  x: number;
  y: number;
  volume: number;
  deviceId: string;
  nickname?: string;
}

// Add to existing types
export interface SessionInfo {
  sessionId: string;
  name: string;
  createdAt: Date;
  deviceCount: number;
  isActive: boolean;
}

export interface JoinSessionMessage {
  type: 'join_session';
  sessionId: string;
  deviceId: string;
  nickname?: string;
}

export interface CreateSessionMessage {
  type: 'create_session';
  sessionName?: string;
  deviceId: string;
}