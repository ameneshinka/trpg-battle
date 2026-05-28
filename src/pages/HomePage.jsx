import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createRoom, joinRoom } from '../firebase/roomService';
import styles from './HomePage.module.css';

function generateUserId() {
  return 'user_' + Math.random().toString(36).slice(2, 10);
}

function getOrCreateUserId() {
  let id = sessionStorage.getItem('userId');
  if (!id) {
    id = generateUserId();
    sessionStorage.setItem('userId', id);
  }
  return id;
}

export default function HomePage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState(null); // 'kp' | 'pl'
  const [name, setName] = useState('');
  const [roomCode, setRoomCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleCreateRoom() {
    if (!name.trim()) { setError('請輸入你的名稱'); return; }
    setLoading(true);
    setError('');
    try {
      const userId = getOrCreateUserId();
      const code = await createRoom(userId, name.trim());
      sessionStorage.setItem('userName', name.trim());
      navigate(`/room/${code}?role=kp`);
    } catch (e) {
      setError('建立房間失敗：' + e.message);
      setLoading(false);
    }
  }

  async function handleJoinRoom() {
    if (!name.trim()) { setError('請輸入你的名稱'); return; }
    if (!roomCode.trim()) { setError('請輸入房間代碼'); return; }
    setLoading(true);
    setError('');
    try {
      const userId = getOrCreateUserId();
      await joinRoom(roomCode.trim(), userId, name.trim());
      sessionStorage.setItem('userName', name.trim());
      navigate(`/room/${roomCode.toUpperCase().trim()}?role=pl`);
    } catch (e) {
      setError(e.message || '加入房間失敗');
      setLoading(false);
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>拚點系統</h1>
        <p className={styles.subtitle}>COC TRPG 戰鬥追蹤</p>

        {!mode && (
          <div className={styles.roleSelect}>
            <button className={styles.roleBtn} onClick={() => setMode('kp')}>
              <span className={styles.roleIcon}>👁</span>
              <span className={styles.roleLabel}>KP</span>
              <span className={styles.roleDesc}>主持人，建立戰鬥房間</span>
            </button>
            <button className={styles.roleBtn} onClick={() => setMode('pl')}>
              <span className={styles.roleIcon}>⚔</span>
              <span className={styles.roleLabel}>PL</span>
              <span className={styles.roleDesc}>玩家，加入現有房間</span>
            </button>
          </div>
        )}

        {mode && (
          <div className={styles.form}>
            <button className={styles.backBtn} onClick={() => { setMode(null); setError(''); }}>
              ← 返回
            </button>

            <div className={styles.field}>
              <label>你的名稱</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={mode === 'kp' ? 'KP 名稱' : '玩家名稱'}
                maxLength={20}
                onKeyDown={(e) => e.key === 'Enter' && (mode === 'kp' ? handleCreateRoom() : handleJoinRoom())}
              />
            </div>

            {mode === 'pl' && (
              <div className={styles.field}>
                <label>房間代碼</label>
                <input
                  type="text"
                  value={roomCode}
                  onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                  placeholder="6 碼房間代碼"
                  maxLength={6}
                  onKeyDown={(e) => e.key === 'Enter' && handleJoinRoom()}
                />
              </div>
            )}

            {error && <p className={styles.error}>{error}</p>}

            <button
              className={styles.submitBtn}
              onClick={mode === 'kp' ? handleCreateRoom : handleJoinRoom}
              disabled={loading}
            >
              {loading ? '處理中…' : mode === 'kp' ? '建立房間' : '加入房間'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
