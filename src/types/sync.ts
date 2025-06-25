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
}