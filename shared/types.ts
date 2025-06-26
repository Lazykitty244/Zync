// Create a shared types file
export interface SyncMessage {
  type: 'ping' | 'pong' | 'join' | 'play' | 'pause' | 'seek' | 'upload' | 'position' | 'join_session' | 'create_session';
  timestamp?: number;
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
}

export interface Device {
  id: string;
  nickname: string;
  position: DevicePosition;
  isConnected: boolean;
  lastSeen: Date;
  syncStatus: 'synced' | 'syncing' | 'disconnected';
}

export interface SessionInfo {
  sessionId: string;
  name: string;
  createdAt: Date;
  deviceCount: number;
  isActive: boolean;
  devices: Device[];
}