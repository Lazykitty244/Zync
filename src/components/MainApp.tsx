import React, { useState, useEffect } from 'react';
import { useAudioEngine } from '@/hooks/useAudioEngine';
import { useClockSync } from '@/hooks/useClockSync';
import { useSpatialAudio } from '@/hooks/useSpatialAudio';
import { DevicePosition } from '@/types/sync';
import AudioControls from './AudioControls';
import FileUpload from './FileUpload';
import SpatialGrid from './SpatialGrid';
import DeviceList from './DeviceList';

interface MainAppProps {
  sessionId: string;
  nickname: string;
}

export default function MainApp({ sessionId, nickname }: MainAppProps) {
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [deviceId, setDeviceId] = useState<string>('');
  const [devices, setDevices] = useState<DevicePosition[]>([]);
  const [myPosition, setMyPosition] = useState({ x: 50, y: 50 });
  const [isConnected, setIsConnected] = useState(false);
  const [showSpatialGrid, setShowSpatialGrid] = useState(false);
  const [currentFile, setCurrentFile] = useState<string | null>(null);
  
  // Generate deviceId only on client side to avoid hydration mismatch
  useEffect(() => {
    setDeviceId(Math.random().toString(36).substr(2, 9));
  }, []);
  
  const { clockSync, handlePong, getServerTime } = useClockSync(ws);
  const audioEngine = useAudioEngine();
  
  const { updateSpatialAudio } = useSpatialAudio({
    audioContext: audioEngine.audioContext,
    gainNode: audioEngine.gainNode,
    myPosition: {
      x: myPosition.x,
      y: myPosition.y,
      deviceId: deviceId,
      volume: 1
    },
    referencePosition: { x: 50, y: 50, deviceId: 'center', volume: 1 },
    maxDistance: 70
  });

  // Don't render WebSocket connection until deviceId is set
  if (!deviceId) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-950">
        <div className="text-lg text-slate-400">Initializing...</div>
      </div>
    );
  }

  // WebSocket connection logic
  useEffect(() => {
    const connectWebSocket = () => {
      const socket = new WebSocket('ws://localhost:8081');
      
      socket.onopen = () => {
        setIsConnected(true);
        setWs(socket);
        
        socket.send(JSON.stringify({
          type: 'join',
          sessionId,
          data: { deviceId, nickname }
        }));
      };
      
      socket.onmessage = (event) => {
        const message = JSON.parse(event.data);
        
        switch (message.type) {
          case 'pong':
            handlePong(message);
            break;
          case 'play':
            audioEngine.play();
            break;
          case 'pause':
            audioEngine.pause();
            break;
          case 'seek':
            audioEngine.seek(message.data.time);
            break;
          case 'position':
            setDevices(prev => {
              const updated = prev.filter(d => d.deviceId !== message.data.deviceId);
              return [...updated, message.data];
            });
            break;
        }
      };
      
      socket.onclose = () => {
        setIsConnected(false);
        setWs(null);
      };
      
      socket.onerror = (error) => {
        console.error('WebSocket error:', error);
        setIsConnected(false);
      };
    };
    
    connectWebSocket();
    
    return () => {
      ws?.close();
    };
  }, [sessionId, deviceId, nickname, handlePong, audioEngine]);

  // Send position updates when position changes
  useEffect(() => {
    if (ws && isConnected) {
      ws.send(JSON.stringify({
        type: 'position',
        sessionId,
        data: {
          deviceId,
          x: myPosition.x,
          y: myPosition.y,
          nickname,
          volume: 1
        }
      }));
    }
  }, [myPosition, ws, isConnected, sessionId, deviceId, nickname]);

  const handleFileUpload = async (file: File) => {
    const formData = new FormData();
    formData.append('audio', file);
    
    try {
      const response = await fetch('http://localhost:8081/upload', {
        method: 'POST',
        body: formData
      });
      
      if (!response.ok) {
        throw new Error(`Upload failed: ${response.statusText}`);
      }
      
      const result = await response.json();
      setCurrentFile(result.filename);
      await audioEngine.loadAudio(`http://localhost:8081${result.url}`);
      
      if (ws) {
        ws.send(JSON.stringify({
          type: 'upload',
          sessionId,
          data: { url: result.url, filename: result.filename }
        }));
      }
    } catch (error) {
      console.error('Upload failed:', error);
    }
  };

  const copySessionLink = () => {
    const link = `${window.location.origin}/session/${sessionId}`;
    navigator.clipboard.writeText(link);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Fixed Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-slate-900/95 backdrop-blur-sm border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-sm font-bold">Z</span>
                </div>
                <span className="text-xl font-semibold">Zync</span>
              </div>
              <div className="hidden sm:block h-6 w-px bg-slate-700"></div>
              <div className="hidden sm:flex items-center space-x-2">
                <span className="text-sm text-slate-400">Session:</span>
                <code className="px-2 py-1 bg-slate-800 rounded text-sm font-mono">{sessionId}</code>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm ${
                isConnected ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
              }`}>
                <div className={`w-2 h-2 rounded-full ${
                  isConnected ? 'bg-emerald-400' : 'bg-red-400'
                }`}></div>
                <span>{isConnected ? 'Connected' : 'Disconnected'}</span>
              </div>
              
              <button
                onClick={copySessionLink}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-medium transition-colors"
              >
                Copy Link
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Welcome Section */}
          <div className="py-6">
            <h1 className="text-2xl font-bold text-white">Welcome, {nickname}!</h1>
            <p className="text-slate-400 mt-1">Synchronized audio playback session</p>
          </div>

          {/* Main Dashboard Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* Left Column - Controls */}
            <div className="xl:col-span-2 space-y-6">
              {/* Upload Card */}
              <div className="bg-slate-900/50 backdrop-blur-sm rounded-xl border border-slate-800 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold">Audio File</h2>
                  {currentFile && (
                    <button
                      onClick={() => document.getElementById('file-input')?.click()}
                      className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
                    >
                      Change File
                    </button>
                  )}
                </div>
                
                {currentFile ? (
                  <div className="flex items-center space-x-3 p-4 bg-slate-800/50 rounded-lg">
                    <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v9.114A4.369 4.369 0 005 14c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V7.82l8-1.6v5.894A4.369 4.369 0 0015 12c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V3z" />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white truncate">{currentFile}</p>
                      <p className="text-xs text-slate-400">Ready to play</p>
                    </div>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-slate-700 rounded-lg p-8 text-center">
                    <input
                      id="file-input"
                      type="file"
                      accept="audio/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file && file.type.startsWith('audio/')) {
                          handleFileUpload(file);
                        }
                      }}
                      className="hidden"
                    />
                    <label htmlFor="file-input" className="cursor-pointer block">
                      <div className="w-12 h-12 bg-slate-800 rounded-lg flex items-center justify-center mx-auto mb-3">
                        <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                      </div>
                      <p className="text-sm text-slate-300 font-medium">Upload Audio File</p>
                      <p className="text-xs text-slate-500 mt-1">MP3, WAV, OGG supported</p>
                    </label>
                  </div>
                )}
              </div>

              {/* Audio Timeline & Controls */}
              <div className="bg-slate-900/50 backdrop-blur-sm rounded-xl border border-slate-800 p-6">
                <h2 className="text-lg font-semibold mb-4">Playback Controls</h2>
                <AudioControls 
                  audioState={audioEngine.audioState}
                  onPlay={() => {
                    audioEngine.play();
                    if (ws) {
                      ws.send(JSON.stringify({
                        type: 'play',
                        sessionId,
                        data: { time: audioEngine.audioState.currentTime }
                      }));
                    }
                  }}
                  onPause={() => {
                    audioEngine.pause();
                    if (ws) {
                      ws.send(JSON.stringify({
                        type: 'pause',
                        sessionId
                      }));
                    }
                  }}
                  onSeek={(time) => {
                    audioEngine.seek(time);
                    if (ws) {
                      ws.send(JSON.stringify({
                        type: 'seek',
                        sessionId,
                        data: { time }
                      }));
                    }
                  }}
                />
              </div>

              {/* Spatial Grid (Optional) */}
              {showSpatialGrid && (
                <div className="bg-slate-900/50 backdrop-blur-sm rounded-xl border border-slate-800 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold">Spatial Audio Grid</h2>
                    <button
                      onClick={() => setShowSpatialGrid(false)}
                      className="text-slate-400 hover:text-slate-300 transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                  <SpatialGrid 
                    devices={devices}
                    currentDeviceId={deviceId}
                    onPositionChange={setMyPosition}
                  />
                </div>
              )}
            </div>

            {/* Right Column - Device List */}
            <div className="space-y-6">
              <div className="bg-slate-900/50 backdrop-blur-sm rounded-xl border border-slate-800 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold">Connected Devices</h2>
                  <span className="text-sm text-slate-400">{devices.length + 1} online</span>
                </div>
                
                <DeviceList 
                  devices={[
                    {
                      id: deviceId,
                      nickname: nickname,
                      isConnected: true,
                      lastSeen: new Date(),
                      position: myPosition,
                      syncStatus: 'synced' as const
                    },
                    ...devices.map(d => ({
                      id: d.deviceId,
                      nickname: d.nickname || 'Unknown',
                      isConnected: true,
                      lastSeen: new Date(),
                      position: { x: d.x, y: d.y },
                      syncStatus: 'synced' as const
                    }))
                  ]}
                  currentDeviceId={deviceId}
                />
              </div>

              {/* Spatial Audio Toggle */}
              {!showSpatialGrid && (
                <div className="bg-slate-900/50 backdrop-blur-sm rounded-xl border border-slate-800 p-6">
                  <h3 className="text-lg font-semibold mb-3">Spatial Audio</h3>
                  <p className="text-sm text-slate-400 mb-4">
                    Enable spatial audio to position devices in 3D space for surround sound simulation.
                  </p>
                  <button
                    onClick={() => setShowSpatialGrid(true)}
                    className="w-full px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-sm font-medium transition-colors"
                  >
                    Enable Spatial Grid
                  </button>
                </div>
              )}

              {/* Sync Status */}
              <div className="bg-slate-900/50 backdrop-blur-sm rounded-xl border border-slate-800 p-6">
                <h3 className="text-lg font-semibold mb-3">Sync Status</h3>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Clock Offset:</span>
                    <span className="font-mono">{clockSync.offset.toFixed(2)}ms</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Round Trip:</span>
                    <span className="font-mono">{clockSync.roundTripTime.toFixed(2)}ms</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Last Sync:</span>
                    <span className="font-mono">
                      {clockSync.lastSync ? new Date(clockSync.lastSync).toLocaleTimeString() : 'Never'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}