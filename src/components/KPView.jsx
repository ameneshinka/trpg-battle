import styles from './SharedView.module.css';

export default function KPView({ roomCode, room, userId }) {
  const participants = room?.participants ?? {};
  const characters = room?.characters ?? {};

  return (
    <div className={styles.layout}>
      {/* 左欄：角色列表 */}
      <aside className={styles.sidebar}>
        <h2 className={styles.sectionTitle}>角色</h2>
        <p className={styles.hint}>（角色建立功能開發中）</p>
        {Object.entries(characters).map(([id, char]) => (
          <div key={id} className={styles.charCard}>
            <span className={styles.charName}>{char.name}</span>
            <span className={styles.charType}>{char.type === 'npc' ? 'NPC' : 'PC'}</span>
          </div>
        ))}
      </aside>

      {/* 中間：戰鬥流程 */}
      <main className={styles.main}>
        <div className={styles.phaseBox}>
          <h2 className={styles.sectionTitle}>戰鬥控制台 (KP)</h2>
          <p className={styles.hint}>
            房間代碼：<strong>{roomCode}</strong>
          </p>
          <p className={styles.hint}>
            目前在線玩家：{Object.keys(participants).length} 人
          </p>
          {Object.entries(participants).map(([uid, p]) => (
            <div key={uid} className={styles.participant}>
              {p.name}
            </div>
          ))}
          <div className={styles.comingSoon}>
            回合推進系統（開發中）
          </div>
        </div>
      </main>

      {/* 右欄：狀態追蹤 */}
      <aside className={styles.sidebar}>
        <h2 className={styles.sectionTitle}>狀態追蹤</h2>
        <p className={styles.hint}>（狀態追蹤開發中）</p>
      </aside>
    </div>
  );
}
