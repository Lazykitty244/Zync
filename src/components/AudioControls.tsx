import React from 'react';
import { AudioState } from '@/types/sync';

interface AudioControlsProps {
  audioState: AudioState;
  onPlay: () => void;
  onPause: () => void;
  onSeek: (time: number) => void;
}

export default function AudioControls({ audioState, onPlay, onPause, onSeek }: AudioControlsProps) {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = audioState.duration > 0 ? (audioState.currentTime / audioState.duration) * 100 : 0;

  return (
    <div className="space-y-4">
      {/* Timeline */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm text-slate-400">
          <span>{formatTime(audioState.currentTime)}</span>
          <span>{formatTime(audioState.duration)}</span>
        </div>
        
        <div className="relative">
          <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-150"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <input
            type="range"
            min={0}
            max={audioState.duration || 100}
            value={audioState.currentTime}
            onChange={(e) => onSeek(parseFloat(e.target.value))}
            className="absolute inset-0 w-full h-2 opacity-0 cursor-pointer"
            disabled={!audioState.audioUrl}
          />
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center space-x-4">
        {/* Previous */}
        <button
          className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-800 hover:bg-slate-700 transition-colors disabled:opacity-50"
          disabled={!audioState.audioUrl}
          onClick={() => onSeek(Math.max(0, audioState.currentTime - 10))}
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M8.445 14.832A1 1 0 0010 14v-2.798l5.445 3.63A1 1 0 0017 14V6a1 1 0 00-1.555-.832L10 8.798V6a1 1 0 00-1.555-.832l-6 4a1 1 0 000 1.664l6 4z" />
          </svg>
        </button>

        {/* Play/Pause */}
        <button
          onClick={audioState.isPlaying ? onPause : onPlay}
          className="w-12 h-12 flex items-center justify-center rounded-full bg-blue-600 hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={!audioState.audioUrl}
        >
          {audioState.isPlaying ? (
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          ) : (
            <svg className="w-6 h-6 ml-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
            </svg>
          )}
        </button>

        {/* Next */}
        <button
          className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-800 hover:bg-slate-700 transition-colors disabled:opacity-50"
          disabled={!audioState.audioUrl}
          onClick={() => onSeek(Math.min(audioState.duration, audioState.currentTime + 10))}
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M4.555 5.168A1 1 0 003 6v8a1 1 0 001.555.832L10 11.202V14a1 1 0 001.555.832l6-4a1 1 0 000-1.664l-6-4A1 1 0 0010 6v2.798l-5.445-3.63z" />
          </svg>
        </button>
      </div>
    </div>
  );
}