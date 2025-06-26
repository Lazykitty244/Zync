import { useCallback, useEffect } from 'react';
import { DevicePosition } from '@/types/sync';

interface UseSpatialAudioProps {
  audioContext: AudioContext | null;
  gainNode: GainNode | null;
  myPosition: DevicePosition;
  referencePosition?: DevicePosition; // Center point or main speaker
  maxDistance?: number;
}

export function useSpatialAudio({
  audioContext,
  gainNode,
  myPosition,
  referencePosition = { x: 50, y: 50, deviceId: 'center', volume: 1 }, // Center of grid
  maxDistance = 70 // Maximum distance for audio falloff
}: UseSpatialAudioProps) {
  
  const calculateDistance = useCallback((pos1: DevicePosition, pos2: DevicePosition) => {
    return Math.sqrt(Math.pow(pos1.x - pos2.x, 2) + Math.pow(pos1.y - pos2.y, 2));
  }, []);
  
  const calculateVolume = useCallback((distance: number) => {
    if (distance === 0) return 1;
    if (distance >= maxDistance) return 0.1; // Minimum volume
    
    // Inverse square law for realistic audio falloff
    const normalizedDistance = distance / maxDistance;
    return Math.max(0.1, 1 - Math.pow(normalizedDistance, 2));
  }, [maxDistance]);
  
  const updateSpatialAudio = useCallback(() => {
    if (!gainNode || !audioContext) return;
    
    const distance = calculateDistance(myPosition, referencePosition);
    const volume = calculateVolume(distance);
    
    // Smooth volume transition
    gainNode.gain.setTargetAtTime(volume, audioContext.currentTime, 0.1);
  }, [gainNode, audioContext, myPosition, referencePosition, calculateDistance, calculateVolume]);
  
  useEffect(() => {
    updateSpatialAudio();
  }, [updateSpatialAudio]);
  
  return { updateSpatialAudio, calculateVolume, calculateDistance };
}