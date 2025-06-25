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

  return (
    <div className="bg-gray-800 p-6 rounded-lg">
      <h2 className="text-xl font-semibold mb-4">Audio Controls</h2>
      
      <div className="space-y-4">
        <div className="flex items-center space-x-4">
          <button
            onClick={audioState.isPlaying ? onPause : onPlay}
            className={`px-6 py-2 rounded-lg font-medium ${
              audioState.isPlaying 
                ? 'bg-red-600 hover:bg-red-700' 
                : 'bg-green-600 hover:bg-green-700'
            }`}
            disabled={!audioState.audioUrl}
          >
            {audioState.isPlaying ? 'Pause' : 'Play'}
          </button>
          
          <span className="text-sm text-gray-400">
            {formatTime(audioState.currentTime)} / {formatTime(audioState.duration)}
          </span>
        </div>
        
        <div className="w-full">
          <input
            type="range"
            min={0}
            max={audioState.duration || 100}
            value={audioState.currentTime}
            onChange={(e) => onSeek(parseFloat(e.target.value))}
            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
            disabled={!audioState.audioUrl}
          />
        </div>
      </div>
    </div>
  );
}