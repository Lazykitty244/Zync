import { useState, useCallback } from 'react';
import { DevicePosition } from '@/types/sync';

interface SpatialGridProps {
  devices: DevicePosition[];
  currentDeviceId: string;
  onPositionChange: (position: { x: number; y: number }) => void;
}

export default function SpatialGrid({ devices, currentDeviceId, onPositionChange }: SpatialGridProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [currentPosition, setCurrentPosition] = useState({ x: 50, y: 50 });

  const handleMouseDown = useCallback(() => {
    setIsDragging(true);
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    const clampedX = Math.max(0, Math.min(100, x));
    const clampedY = Math.max(0, Math.min(100, y));
    
    setCurrentPosition({ x: clampedX, y: clampedY });
    onPositionChange({ x: clampedX, y: clampedY });
  }, [isDragging, onPositionChange]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  return (
    <div className="w-full h-64 bg-gray-700 rounded-lg relative overflow-hidden"
         onMouseMove={handleMouseMove}
         onMouseUp={handleMouseUp}
         onMouseLeave={handleMouseUp}>
      
      {/* Grid lines */}
      <div className="absolute inset-0 opacity-20">
        {[...Array(10)].map((_, i) => (
          <div key={`v-${i}`} className="absolute bg-gray-500" 
               style={{ left: `${i * 10}%`, width: '1px', height: '100%' }} />
        ))}
        {[...Array(10)].map((_, i) => (
          <div key={`h-${i}`} className="absolute bg-gray-500" 
               style={{ top: `${i * 10}%`, height: '1px', width: '100%' }} />
        ))}
      </div>
      
      {/* Other devices */}
      {devices.filter(d => d.deviceId !== currentDeviceId).map((device) => (
        <div
          key={device.deviceId}
          className="absolute w-4 h-4 bg-blue-500 rounded-full transform -translate-x-2 -translate-y-2"
          style={{ left: `${device.x}%`, top: `${device.y}%` }}
          title={`Device ${device.deviceId}`}
        />
      ))}
      
      {/* Current device */}
      <div
        className="absolute w-6 h-6 bg-green-500 rounded-full transform -translate-x-3 -translate-y-3 cursor-move border-2 border-white"
        style={{ left: `${currentPosition.x}%`, top: `${currentPosition.y}%` }}
        onMouseDown={handleMouseDown}
        title="Your device (drag to move)"
      />
      
      <div className="absolute bottom-2 left-2 text-xs text-gray-400">
        Position: ({currentPosition.x.toFixed(0)}, {currentPosition.y.toFixed(0)})
      </div>
    </div>
  );
}