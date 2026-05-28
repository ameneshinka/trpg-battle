import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useRoom } from '../hooks/useRoom';
import KPView from '../components/KPView';
import PLView from '../components/PLView';
import styles from './RoomPage.module.css';

export default function RoomPage() {
  const { roomCode } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const role = searchParams.get('role'); // 'kp' | 'pl'
  const userId = sessionStorage.getItem('userId') || '';
  const userName = sessionStorage.getItem('userName') || '訪客';

  const { room, loading, error } = useRoom(roomCode);

  if (loading) {
    return (
      <div className={styles.centerScreen}>
        <div className={styles.spinner} />
        <p>連線中…</p>
      </div>
    );
  }

  if (error || !room) {
    return (
      <div className={styles.centerScreen}>
        <p className={styles.errorMsg}>{error || '房間不存在'}</p>
        <button className={styles.backBtn} onClick={() => navigate('/')}>返回首頁</button>
      </div>
    );
  }

  const isKP = role === 'kp' || room.info?.hostId === userId;

  return (
    <div className={styles.roomWrapper}>
      <RoomHeader
        roomCode={roomCode}
        room={room}
        userName={userName}
        isKP={isKP}
        onLeave={() => navigate('/')}
      />
      {isKP
        ? <KPView roomCode={roomCode} room={room} userId={userId} />
        : <PLView roomCode={roomCode} room={room} userId={userId} userName={userName} />
      }
    </div>
  );
}

function RoomHeader({ roomCode, room, userName, isKP, onLeave }) {
  const [copied, setCopied] = useState(false);
  const shareUrl = `${window.location.origin}/room/${roomCode}?role=pl`;

  function copyLink() {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const phase = room?.battle?.phase ?? 'waiting';
  const phaseLabels = {
    waiting: '等待中',
    start: '回合開始',
    declare: '宣告行動',
    dex: 'DEX 攔截',
    clash: '拚點中',
    damage: '傷害結算',
    focus: '專注力結算',
    end: '回合結束',
  };

  return (
    <header className={styles.header}>
      <div className={styles.headerLeft}>
        <span className={styles.roomCode}>#{roomCode}</span>
        <span className={styles.phaseBadge}>{phaseLabels[phase] || phase}</span>
        <span className={styles.roundLabel}>
          {room?.battle?.currentRound > 0 ? `第 ${room.battle.currentRound} 回合` : '戰鬥未開始'}
        </span>
      </div>
      <div className={styles.headerRight}>
        <span className={styles.userTag}>{isKP ? '👁 KP' : '⚔ PL'} · {userName}</span>
        {isKP && (
          <button className={styles.copyBtn} onClick={copyLink}>
            {copied ? '已複製!' : '複製分享連結'}
          </button>
        )}
        <button className={styles.leaveBtn} onClick={onLeave}>離開</button>
      </div>
    </header>
  );
}
