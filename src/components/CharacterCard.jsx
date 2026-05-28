import styles from './CharacterCard.module.css';

export default function CharacterCard({ char, charId, isKP, onDelete }) {
  const combat = char.combat ?? {};
  const hp = combat.hp ?? 0;
  const maxHp = combat.maxHp ?? 1;
  const tempHp = combat.tempHp ?? 0;
  const focus = combat.focus ?? 0;
  const thresholds = combat.chaosThresholds ?? [];

  const hpPct = Math.max(0, Math.min(100, (hp / maxHp) * 100));
  const focusPct = ((focus + 40) / 80) * 100; // -40~+40 → 0~100%

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <span className={styles.name}>{char.name}</span>
        <span className={`${styles.badge} ${char.type === 'npc' ? styles.npc : styles.pc}`}>
          {char.type === 'npc' ? 'NPC' : 'PC'}
        </span>
        {isKP && (
          <button className={styles.deleteBtn} onClick={() => onDelete?.(charId)} title="刪除角色">
            ✕
          </button>
        )}
      </div>

      {/* HP 條 */}
      <div className={styles.barLabel}>
        HP {hp}{tempHp > 0 ? `+${tempHp}` : ''} / {maxHp}
      </div>
      <div className={styles.barTrack}>
        <div
          className={styles.barFill}
          style={{ width: `${hpPct}%`, background: hpColor(hpPct) }}
        />
        {/* 混亂值標記線 */}
        {thresholds.map((t, i) =>
          t > 0 ? (
            <div
              key={i}
              className={styles.threshold}
              style={{ left: `${(t / maxHp) * 100}%` }}
              title={`混亂值 ${t}`}
            />
          ) : null
        )}
      </div>

      {/* 專注力條 */}
      <div className={styles.barLabel}>專注力 {focus}</div>
      <div className={styles.barTrack}>
        <div
          className={styles.focusFill}
          style={{
            left: focus >= 0 ? '50%' : `${focusPct}%`,
            width: focus >= 0
              ? `${(focus / 80) * 100}%`
              : `${(50 - focusPct)}%`,
            background: focus >= 0 ? '#5080e0' : '#c06060',
          }}
        />
        <div className={styles.focusCenter} />
      </div>

      {/* 技能一覽 */}
      <div className={styles.skills}>
        {(char.skills ?? []).filter((s) => s.name).map((skill, i) => (
          <div key={i} className={styles.skillChip}>
            <span>{skill.name}</span>
            <span className={styles.skillPow}>
              {skill.computed?.basePower ?? '?'}
              {skill.computed ? ` / ×${skill.computed.coinCount}` : ''}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function hpColor(pct) {
  if (pct > 60) return '#50c060';
  if (pct > 30) return '#d0a030';
  return '#e04040';
}
