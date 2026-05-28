import { db } from './config';
import {
  ref,
  set,
  get,
  update,
  onValue,
  off,
  push,
  serverTimestamp,
} from 'firebase/database';

// Generate a readable 6-char room code
function generateRoomCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

export async function createRoom(hostId, hostName) {
  const roomCode = generateRoomCode();
  const roomRef = ref(db, `rooms/${roomCode}`);

  // Check collision (rare but possible)
  const existing = await get(roomRef);
  if (existing.exists()) {
    return createRoom(hostId, hostName);
  }

  const roomData = {
    info: {
      createdAt: serverTimestamp(),
      hostId,
      hostName,
      roomCode,
    },
    battle: {
      currentRound: 0,
      phase: 'waiting', // waiting | start | declare | dex | clash | damage | focus | end
    },
  };

  await set(roomRef, roomData);
  return roomCode;
}

export async function joinRoom(roomCode, userId, userName) {
  const code = roomCode.toUpperCase();
  const roomRef = ref(db, `rooms/${code}`);
  const snapshot = await get(roomRef);

  if (!snapshot.exists()) {
    throw new Error('找不到此房間，請確認房間代碼');
  }

  // Register this user as a participant
  const participantRef = ref(db, `rooms/${code}/participants/${userId}`);
  await set(participantRef, {
    name: userName,
    joinedAt: serverTimestamp(),
  });

  return { roomCode: code, roomData: snapshot.val() };
}

export async function getRoomOnce(roomCode) {
  const snapshot = await get(ref(db, `rooms/${roomCode}`));
  if (!snapshot.exists()) return null;
  return snapshot.val();
}

// Subscribe to room changes; returns unsubscribe function
export function subscribeToRoom(roomCode, callback) {
  const roomRef = ref(db, `rooms/${roomCode}`);
  onValue(roomRef, (snapshot) => {
    callback(snapshot.exists() ? snapshot.val() : null);
  });
  return () => off(roomRef);
}

// Subscribe to a specific path inside a room
export function subscribeToPath(roomCode, path, callback) {
  const pathRef = ref(db, `rooms/${roomCode}/${path}`);
  onValue(pathRef, (snapshot) => {
    callback(snapshot.exists() ? snapshot.val() : null);
  });
  return () => off(pathRef);
}

export async function updateRoomPath(roomCode, path, value) {
  const updates = {};
  updates[`rooms/${roomCode}/${path}`] = value;
  return update(ref(db), updates);
}

export async function pushToRoomPath(roomCode, path, value) {
  const pathRef = ref(db, `rooms/${roomCode}/${path}`);
  return push(pathRef, value);
}
