import { useState } from 'react';
import CharacterForm from './CharacterForm/CharacterForm';
import CharacterCard from './CharacterCard';
import { createCharacter } from '../firebase/characterService';
import styles from './SharedView.module.css';

export default function PLView({ roomCode, room, userId, userName }) {
  const [showForm, setShowForm] = useState(false);
  const [formLoading, setFormLoading] = useState(false);

  const characters = room?.characters ?? {};
  const myChars = Object.entries(characters).filter(([, c]) => c.ownerId === userId);
  const allChars = Object.entries(characters);
  const battle = room?.battle ?? {};

  async function handleCreate(formData) {
    setFormLoading(true);
    try {
      await createCharacter(roomCode, formData, userId, 'pc');
      setShowForm(false);
    } catch (e) {
      alert('建立失敗：' + e.message);
    } finally {
      setFormLoading(false);
    }
  }

  return (
    <div className={styles.layout}>
      {/* 左欄：我的角色 */}
      <aside className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <h2 className={styles.sectionTitle}>我的角色</h2>
          {myChars.length === 0 && !showForm && (
            <button className={styles.addBtn} onClick={() => setShowForm(true)}>+ 建立</button>
          )}
        </div>

        {myChars.length === 0 && !showForm && (
          <p className={styles.hint}>尚未建立角色</p>
        )}

        {myChars.map(([id, char]) => (
          <CharacterCard key={id} charId={id} char={char} isKP={false} />
        ))}
      </aside>

      {/* 中間：戰鬥狀態 / 建立表單 */}
      <main className={styles.main}>
        {showForm ? (
          <CharacterForm
            type="pc"
            loading={formLoading}
            onSubmit={handleCreate}
            onCancel={() => setShowForm(false)}
          />
        ) : (
          <div className={styles.phaseBox}>
            <h2 className={styles.sectionTitle}>戰鬥狀態（PL：{userName}）</h2>
            <p className={styles.hint}>
              回合：{battle.currentRound > 0 ? `第 ${battle.currentRound} 回合` : '戰鬥未開始'}
            </p>
            <div className={styles.comingSoon}>
              行動宣告與拚點介面（步驟三開發中）
            </div>
          </div>
        )}
      </main>

      {/* 右欄：全場角色狀態 */}
      <aside className={styles.sidebar} style={{ borderLeft: '1px solid #2a2a4a', borderRight: 'none' }}>
        <h2 className={styles.sectionTitle}>全場狀態</h2>
        {allChars.length === 0 && <p className={styles.hint}>尚無角色</p>}
        {allChars.map(([id, char]) => (
          <CharacterCard key={id} charId={id} char={char} isKP={false} />
        ))}
      </aside>
    </div>
  );
}
