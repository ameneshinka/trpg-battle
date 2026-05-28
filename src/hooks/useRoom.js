import { useState, useEffect, useRef } from 'react';
import { subscribeToRoom, subscribeToPath } from '../firebase/roomService';

export function useRoom(roomCode) {
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!roomCode) return;
    setLoading(true);

    const unsubscribe = subscribeToRoom(roomCode, (data) => {
      if (data === null) {
        setError('房間不存在或已關閉');
      } else {
        setRoom(data);
        setError(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, [roomCode]);

  return { room, loading, error };
}

export function useRoomPath(roomCode, path) {
  const [value, setValue] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!roomCode || !path) return;
    setLoading(true);

    const unsubscribe = subscribeToPath(roomCode, path, (data) => {
      setValue(data);
      setLoading(false);
    });

    return unsubscribe;
  }, [roomCode, path]);

  return { value, loading };
}
