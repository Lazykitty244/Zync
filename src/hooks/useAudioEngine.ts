import React, { useState, useRef, useCallback, useEffect } from 'react';
import { AudioState } from '@/types/sync';

export function useAudioEngine() {
  const [audioState, setAudioState] = useState<AudioState>({
    isPlaying: false,
    currentTime: 0,
    duration: 0
  });
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const audioBufferRef = useRef<AudioBuffer | null>(null);
  const sourceNodeRef = useRef<AudioBufferSourceNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const startTimeRef = useRef<number>(0);
  const pauseTimeRef = useRef<number>(0);

  const initAudioContext = useCallback(async () => {
    if (!audioContextRef.current) {
      audioContextRef.current = new AudioContext();
      gainNodeRef.current = audioContextRef.current.createGain();
      gainNodeRef.current.connect(audioContextRef.current.destination);
    }
    
    if (audioContextRef.current.state === 'suspended') {
      await audioContextRef.current.resume();
    }
  }, []);

  const loadAudio = useCallback(async (url: string) => {
    await initAudioContext();
    
    try {
      const response = await fetch(url);
      const arrayBuffer = await response.arrayBuffer();
      const audioBuffer = await audioContextRef.current!.decodeAudioData(arrayBuffer);
      
      audioBufferRef.current = audioBuffer;
      setAudioState(prev => ({
        ...prev,
        duration: audioBuffer.duration,
        audioUrl: url
      }));
    } catch (error) {
      console.error('Failed to load audio:', error);
    }
  }, [initAudioContext]);

  const schedulePlay = useCallback((when: number, offset: number = 0) => {
    if (!audioContextRef.current || !audioBufferRef.current || !gainNodeRef.current) return;
    
    // Stop current playback
    if (sourceNodeRef.current) {
      sourceNodeRef.current.stop();
    }
    
    // Create new source node
    const sourceNode = audioContextRef.current.createBufferSource();
    sourceNode.buffer = audioBufferRef.current;
    sourceNode.connect(gainNodeRef.current);
    
    // Schedule playback
    const contextTime = when / 1000; // Convert to AudioContext time
    sourceNode.start(contextTime, offset);
    
    sourceNodeRef.current = sourceNode;
    startTimeRef.current = when - (offset * 1000);
    pauseTimeRef.current = 0;
    
    setAudioState(prev => ({ ...prev, isPlaying: true }));
    
    sourceNode.onended = () => {
      setAudioState(prev => ({ ...prev, isPlaying: false }));
    };
  }, []);

  const play = useCallback(() => {
    if (!audioState.isPlaying && audioBufferRef.current) {
      const offset = pauseTimeRef.current ? (pauseTimeRef.current - startTimeRef.current) / 1000 : 0;
      schedulePlay(performance.now(), offset);
    }
  }, [audioState.isPlaying, schedulePlay]);

  const pause = useCallback(() => {
    if (sourceNodeRef.current && audioState.isPlaying) {
      sourceNodeRef.current.stop();
      pauseTimeRef.current = performance.now();
      setAudioState(prev => ({ ...prev, isPlaying: false }));
    }
  }, [audioState.isPlaying]);

  const seek = useCallback((time: number) => {
    const wasPlaying = audioState.isPlaying;
    if (wasPlaying) {
      pause();
    }
    
    pauseTimeRef.current = startTimeRef.current + (time * 1000);
    setAudioState(prev => ({ ...prev, currentTime: time }));
    
    if (wasPlaying) {
      schedulePlay(performance.now(), time);
    }
  }, [audioState.isPlaying, pause, schedulePlay]);

  const setVolume = useCallback((volume: number) => {
    if (gainNodeRef.current) {
      gainNodeRef.current.gain.value = Math.max(0, Math.min(1, volume));
    }
  }, []);

  const getCurrentTime = useCallback(() => {
    if (!audioState.isPlaying || !startTimeRef.current) return pauseTimeRef.current ? (pauseTimeRef.current - startTimeRef.current) / 1000 : 0;
    return (performance.now() - startTimeRef.current) / 1000;
  }, [audioState.isPlaying]);

  // Update current time periodically
  useEffect(() => {
    const interval = setInterval(() => {
      setAudioState(prev => ({
        ...prev,
        currentTime: getCurrentTime()
      }));
    }, 100);
    
    return () => clearInterval(interval);
  }, [getCurrentTime]);

  return {
    audioState,
    audioContext: audioContextRef.current,
    gainNode: gainNodeRef.current,
    loadAudio,
    play,
    pause,
    seek,
    schedulePlay,
    setVolume,
    getCurrentTime,
    initAudioContext
  };
}