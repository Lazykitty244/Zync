import { useState, useEffect } from 'react';

interface ProgressSliderProps {
  currentTime: number;
  duration: number;
  onSeek: (time: number) => void;
  isPlaying: boolean;
}

export default function ProgressSlider({ currentTime, duration, onSeek, isPlaying }: ProgressSliderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [dragTime, setDragTime] = useState(0);
  
  const displayTime = isDragging ? dragTime : currentTime;
  const progress = duration > 0 ? (displayTime / duration) * 100 : 0;
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  
  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = (parseFloat(e.target.value) / 100) * duration;
    setDragTime(newTime);
    setIsDragging(true);
  };
  
  const handleSliderRelease = () => {
    if (isDragging) {
      onSeek(dragTime);
      setIsDragging(false);
    }
  };
  
  return (
    <div className="w-full space-y-2">
      <div className="relative">
        <input
          type="range"
          min="0"
          max="100"
          value={progress}
          onChange={handleSliderChange}
          onMouseUp={handleSliderRelease}
          onTouchEnd={handleSliderRelease}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
        />
        <div 
          className="absolute top-0 left-0 h-2 bg-blue-500 rounded-lg pointer-events-none"
          style={{ width: `${progress}%` }}
        />
      </div>
      <div className="flex justify-between text-sm text-gray-500">
        <span>{formatTime(displayTime)}</span>
        <span>{formatTime(duration)}</span>
      </div>
    </div>
  );
}