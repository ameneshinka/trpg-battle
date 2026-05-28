import { useState } from 'react';
import CharacterForm from './CharacterForm/CharacterForm';
import CharacterCard from './CharacterCard';
import { createCharacter, deleteCharacter } from '../firebase/characterService';
import styles from './SharedView.module.css';

export default function KPView({ roomCode, room, userId }) {
  const [showForm, setShowForm] = useState(false);
  const [formLoading, setFormLoading] = useState(false);

  const characters = room?.characters ?? {};
  const participants = room?.participants ?? {};

  async function handleCreate(formData) {
    setFormLoading(true);
    try {
      await createCharacter(roomCode, formData, userId, 'npc');
      setShowForm(false);
    } catch (e) {
      alert('建立失敗：' + e.message);
    } finally {
      setFormLoading(false);
    }
  }

  async function handleDelete(charId) {
    if (!confirm(`確定要刪除此角色嗎？`)) return;
    await deleteCharacter(roomCode, charId);
  }

  return (
    <div className={styles.layout}>
      {/* 左欄：角色列表 */}
      <aside className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <h2 className={styles.sectionTitle}>角色</h2>
          <button className={styles.addBtn} onClick={() => setShowForm(true)}>+ NPC</button>
        </div>

        {Object.keys(characters).length === 0 && (
          <p className={styles.hint}>尚無角色，點右上角建立 NPC</p>
        )}

        {Object.entries(characters).map(([id, char]) => (
          <CharacterCard
            key={id}
            charId={id}
            char={char}
            isKP={true}
            onDelete={handleDelete}
          />
        ))}
      </aside>

      {/* 中間：戰鬥流程 */}
      <main className={styles.main}>
        {showForm ? (
          <CharacterForm
            type="npc"
            loading={formLoading}
            onSubmit={handleCreate}
            onCancel={() => setShowForm(false)}
          />
        ) : (
          <div className={styles.phaseBox}>
            <h2 className={styles.sectionTitle}>KP 控制台</h2>
            <p className={styles.hint}>
              房間代碼：<strong style={{ color: '#b8a9e8', letterSpacing: '0.1em' }}>{roomCode}</strong>
            </p>

            <div className={styles.participantList}>
              <div className={styles.sectionTitle} style={{ marginTop: '1rem' }}>在線玩家</div>
              {Object.keys(participants).length === 0
                ? <p className={styles.hint}>等待玩家加入…</p>
                : Object.entries(participants).map(([uid, p]) => (
                    <div key={uid} className={styles.participant}>⚔ {p.name}</div>
                  ))
              }
            </div>

            <div className={styles.comingSoon}>
              回合推進系統（步驟三開發中）
            </div>
          </div>
        )}
      </main>

      {/* 右欄：狀態追蹤 */}
      <aside className={styles.sidebar} style={{ borderLeft: '1px solid #2a2a4a', borderRight: 'none' }}>
        <h2 className={styles.sectionTitle}>狀態追蹤</h2>
        {Object.entries(characters).map(([id, char]) => (
          <div key={id} className={styles.statusRow}>
            <span className={styles.statusName}>{char.name}</span>
            <span className={styles.statusEmpty}>—</span>
          </div>
        ))}
        {Object.keys(characters).length === 0 && (
          <p className={styles.hint}>尚無角色</p>
        )}
      </aside>
    </div>
  );
}
