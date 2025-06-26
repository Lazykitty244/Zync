import React from 'react';

interface Device {
  id: string;
  nickname: string;
  isConnected: boolean;
  lastSeen: Date;
  position?: { x: number; y: number };
  syncStatus: 'synced' | 'syncing' | 'disconnected';
}

interface DeviceListProps {
  devices: Device[];
  currentDeviceId: string;
}

export default function DeviceList({ devices, currentDeviceId }: DeviceListProps) {
  const getSyncStatusColor = (status: Device['syncStatus']) => {
    switch (status) {
      case 'synced': return 'text-emerald-400';
      case 'syncing': return 'text-yellow-400';
      case 'disconnected': return 'text-red-400';
    }
  };
  
  const getSyncStatusIcon = (status: Device['syncStatus']) => {
    switch (status) {
      case 'synced': return (
        <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
      );
      case 'syncing': return (
        <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
      );
      case 'disconnected': return (
        <div className="w-2 h-2 bg-red-400 rounded-full"></div>
      );
    }
  };
  
  return (
    <div className="space-y-3">
      {devices.map((device) => (
        <div 
          key={device.id}
          className={`p-4 rounded-lg border transition-all ${
            device.id === currentDeviceId 
              ? 'bg-blue-500/10 border-blue-500/30' 
              : 'bg-slate-800/50 border-slate-700 hover:border-slate-600'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-slate-700 rounded-full flex items-center justify-center">
                <span className="text-sm font-medium">
                  {device.nickname.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2">
                  <p className="text-sm font-medium text-white truncate">
                    {device.nickname}
                  </p>
                  {device.id === currentDeviceId && (
                    <span className="px-2 py-0.5 bg-blue-500/20 text-blue-400 text-xs rounded-full">
                      You
                    </span>
                  )}
                </div>
                <div className="flex items-center space-x-2 mt-1">
                  {getSyncStatusIcon(device.syncStatus)}
                  <span className={`text-xs ${getSyncStatusColor(device.syncStatus)}`}>
                    {device.syncStatus.charAt(0).toUpperCase() + device.syncStatus.slice(1)}
                  </span>
                </div>
              </div>
            </div>
            
            {device.position && (
              <div className="text-xs text-slate-400 font-mono">
                ({device.position.x.toFixed(0)}, {device.position.y.toFixed(0)})
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}