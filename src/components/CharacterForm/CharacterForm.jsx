import { useState } from 'react';
import SkillInput from './SkillInput';
import { calcDefenseStats } from '../../utils/calcStats';
import styles from './CharacterForm.module.css';

const DEFAULT_SKILL = {
  name: '',
  weaponType: 'melee',
  proficiency: '',
  coinType: 'normal',
  forfeitExtraCoins: 0,
};

const DEFAULT_STATS = { STR: '', DEX: '', INT: '', CON: '', SIZ: '', LUK: '' };

export default function CharacterForm({ type = 'pc', onSubmit, onCancel, loading }) {
  const isNPC = type === 'npc';

  const [name, setName] = useState('');
  const [stats, setStats] = useState(DEFAULT_STATS);
  const [skills, setSkills] = useState([
    { ...DEFAULT_SKILL },
    { ...DEFAULT_SKILL },
    { ...DEFAULT_SKILL },
  ]);
  const [dodgeProficiency, setDodgeProficiency] = useState('');
  const [maxHp, setMaxHp] = useState('');
  const [error, setError] = useState('');

  function setStat(key, value) {
    setStats((prev) => ({ ...prev, [key]: value }));
  }

  function handleSkillChange(index, newSkill) {
    setSkills((prev) => prev.map((s, i) => (i === index ? newSkill : s)));
  }

  // 防禦技能即時預覽
  const s = {
    STR: Number(stats.STR) || 0,
    DEX: Number(stats.DEX) || 0,
    INT: Number(stats.INT) || 0,
    CON: Number(stats.CON) || 0,
    SIZ: Number(stats.SIZ) || 0,
    LUK: Number(stats.LUK) || 0,
  };
  const guardPreview  = s.SIZ > 0 && s.CON > 0 ? calcDefenseStats({ defenseType: 'guard', stats: s }) : null;
  const dodgePreview  = s.LUK > 0 && Number(dodgeProficiency) > 0
    ? calcDefenseStats({ defenseType: 'dodge', stats: s, dodgeProficiency: Number(dodgeProficiency) })
    : null;

  function validate() {
    if (!name.trim()) return '請輸入角色名稱';
    const attrKeys = ['STR', 'DEX', 'INT', 'CON', 'SIZ', 'LUK'];
    for (const k of attrKeys) {
      if (!stats[k] || Number(stats[k]) < 1) return `請輸入 ${k} 屬性值`;
    }
    if (!dodgeProficiency || Number(dodgeProficiency) < 1) return '請輸入閃避熟練度';
    if (!maxHp || Number(maxHp) < 1) return '請輸入最大 HP';
    if (!skills[0].name.trim()) return '請輸入至少第一個技能名稱';
    if (!skills[0].proficiency) return '請輸入第一個技能熟練度';
    return null;
  }

  function handleSubmit() {
    const err = validate();
    if (err) { setError(err); return; }
    setError('');
    onSubmit({ name: name.trim(), stats, skills, dodgeProficiency, maxHp });
  }

  return (
    <div className={styles.form}>
      <h3 className={styles.formTitle}>
        {isNPC ? '建立 NPC' : '建立角色（PC）'}
      </h3>

      {/* 角色名稱 */}
      <div className={styles.field}>
        <label>角色名稱</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="角色名稱"
          maxLength={20}
        />
      </div>

      {/* COC 屬性值 */}
      <div className={styles.sectionLabel}>COC 屬性值</div>
      <div className={styles.statsGrid}>
        {['STR', 'DEX', 'INT', 'CON', 'SIZ', 'LUK'].map((key) => (
          <div className={styles.statField} key={key}>
            <label>{key}</label>
            <input
              type="number"
              value={stats[key]}
              onChange={(e) => setStat(key, e.target.value)}
              min={1} max={120}
              placeholder="—"
            />
          </div>
        ))}
      </div>

      {/* HP 與閃避 */}
      <div className={styles.row}>
        <div className={styles.field}>
          <label>最大 HP</label>
          <input
            type="number"
            value={maxHp}
            onChange={(e) => setMaxHp(e.target.value)}
            min={1} placeholder="—"
          />
        </div>
        <div className={styles.field}>
          <label>閃避熟練度</label>
          <input
            type="number"
            value={dodgeProficiency}
            onChange={(e) => setDodgeProficiency(e.target.value)}
            min={1} max={120} placeholder="—"
          />
        </div>
      </div>

      {/* 防禦技能預覽 */}
      {(guardPreview || dodgePreview) && (
        <div className={styles.defensePreview}>
          {guardPreview && (
            <span>【防守】基礎威力 {guardPreview.basePower}，硬幣威力 +{guardPreview.coinPower}</span>
          )}
          {dodgePreview && (
            <span>【閃躲】基礎威力 {dodgePreview.basePower}，硬幣威力 +{dodgePreview.coinPower}</span>
          )}
        </div>
      )}

      {/* 三個攻擊技能 */}
      <div className={styles.sectionLabel}>攻擊技能</div>
      {skills.map((skill, i) => (
        <SkillInput
          key={i}
          index={i}
          skill={skill}
          stats={stats}
          onChange={handleSkillChange}
        />
      ))}

      {error && <p className={styles.error}>{error}</p>}

      <div className={styles.btnRow}>
        <button className={styles.cancelBtn} onClick={onCancel} disabled={loading}>
          取消
        </button>
        <button className={styles.submitBtn} onClick={handleSubmit} disabled={loading}>
          {loading ? '儲存中…' : '確認建立'}
        </button>
      </div>
    </div>
  );
}
