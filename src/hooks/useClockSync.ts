import { useState, useCallback, useEffect } from 'react';
import { ClockSync, SyncMessage } from '@/types/sync';

export function useClockSync(ws: WebSocket | null) {
  const [clockSync, setClockSync] = useState<ClockSync>({
    offset: 0,
    roundTripTime: 0,
    lastSync: 0
  });

  const performSync = useCallback(() => {
    if (!ws || ws.readyState !== WebSocket.OPEN) return;
    
    const t1 = performance.now();
    const message: SyncMessage = {
      type: 'ping',
      timestamp: t1
    };
    ws.send(JSON.stringify(message));
  }, [ws]);

  const handlePong = useCallback((message: SyncMessage) => {
    const t4 = performance.now();
    const t1 = message.data.t1;
    const t2 = message.data.t2;
    const t3 = message.timestamp;
    
    const roundTripTime = t4 - t1;
    const offset = ((t2 - t1) + (t3 - t4)) / 2;
    
    setClockSync({
      offset,
      roundTripTime,
      lastSync: Date.now()
    });
  }, []);

  const getServerTime = useCallback(() => {
    return performance.now() + clockSync.offset;
  }, [clockSync.offset]);

  useEffect(() => {
    // Sync every 5 seconds
    const interval = setInterval(performSync, 5000);
    performSync(); // Initial sync
    
    return () => clearInterval(interval);
  }, [performSync]);

  return { clockSync, handlePong, getServerTime, performSync };
}