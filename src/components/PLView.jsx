import styles from './SharedView.module.css';

export default function PLView({ roomCode, room, userId, userName }) {
  const battle = room?.battle ?? {};
  const characters = room?.characters ?? {};

  const myChars = Object.entries(characters).filter(
    ([, c]) => c.ownerId === userId
  );

  return (
    <div className={styles.layout}>
      <aside className={styles.sidebar}>
        <h2 className={styles.sectionTitle}>我的角色</h2>
        {myChars.length === 0 ? (
          <p className={styles.hint}>（等待 KP 分配或建立角色）</p>
        ) : (
          myChars.map(([id, char]) => (
            <div key={id} className={styles.charCard}>
              <span className={styles.charName}>{char.name}</span>
            </div>
          ))
        )}
      </aside>

      <main className={styles.main}>
        <div className={styles.phaseBox}>
          <h2 className={styles.sectionTitle}>戰鬥狀態 (PL: {userName})</h2>
          <p className={styles.hint}>回合：{battle.currentRound || '戰鬥未開始'}</p>
          <div className={styles.comingSoon}>
            行動宣告與拚點介面（開發中）
          </div>
        </div>
      </main>

      <aside className={styles.sidebar}>
        <h2 className={styles.sectionTitle}>全場狀態</h2>
        <p className={styles.hint}>（狀態一覽開發中）</p>
      </aside>
    </div>
  );
}
