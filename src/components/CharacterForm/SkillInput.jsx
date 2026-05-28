import { calcSkillStats, getCoinOptions } from '../../utils/calcStats';
import styles from './CharacterForm.module.css';

const COIN_TYPES = [
  { value: 'normal', label: '普通' },
  { value: 'red',    label: '紅色' },
  { value: 'green',  label: '綠色' },
];

const SKILL_LABELS = ['第一技能', '第二技能', '第三技能'];

export default function SkillInput({ index, skill, stats, onChange }) {
  const prof = Number(skill.proficiency) || 0;
  const str  = Number(stats.STR) || 0;
  const int_ = Number(stats.INT) || 0;
  const { maxExtraCoins } = getCoinOptions(prof);

  // 即時計算預覽
  const computed = prof > 0
    ? calcSkillStats({
        proficiency: prof,
        weaponType: skill.weaponType,
        coinType: skill.coinType,
        forfeitExtraCoins: Number(skill.forfeitExtraCoins ?? 0),
        stats: { STR: str, INT: int_ },
      })
    : null;

  function set(field, value) {
    onChange(index, { ...skill, [field]: value });
  }

  return (
    <div className={styles.skillBlock}>
      <div className={styles.skillTitle}>{SKILL_LABELS[index]}</div>

      <div className={styles.row}>
        <div className={styles.field}>
          <label>技能名稱</label>
          <input
            type="text"
            value={skill.name}
            onChange={(e) => set('name', e.target.value)}
            placeholder="例：手槍射擊"
            maxLength={20}
          />
        </div>

        <div className={styles.field}>
          <label>武器類型</label>
          <select value={skill.weaponType} onChange={(e) => set('weaponType', e.target.value)}>
            <option value="melee">格鬥類（依 STR）</option>
            <option value="ranged">射擊類（依 INT）</option>
          </select>
        </div>
      </div>

      <div className={styles.row}>
        <div className={styles.field}>
          <label>熟練度</label>
          <input
            type="number"
            value={skill.proficiency}
            onChange={(e) => set('proficiency', e.target.value)}
            min={1} max={120} placeholder="1–120"
          />
        </div>

        <div className={styles.field}>
          <label>硬幣類型（第1枚）</label>
          <select value={skill.coinType} onChange={(e) => set('coinType', e.target.value)}>
            {COIN_TYPES.map((c) => (
              <option key={c.value} value={c.value}>{c.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* 放棄額外硬幣 */}
      {maxExtraCoins > 0 && (
        <div className={styles.field}>
          <label>放棄額外硬幣換威力</label>
          <select
            value={skill.forfeitExtraCoins ?? 0}
            onChange={(e) => set('forfeitExtraCoins', Number(e.target.value))}
          >
            <option value={0}>不放棄（取最多硬幣）</option>
            {Array.from({ length: maxExtraCoins }, (_, i) => i + 1).map((n) => (
              <option key={n} value={n}>放棄 {n} 枚</option>
            ))}
          </select>
        </div>
      )}

      {/* 即時預覽 */}
      {computed && (
        <div className={styles.preview}>
          <span>基礎威力 <strong>{computed.basePower}</strong></span>
          <span className={styles.dot}>·</span>
          <span>硬幣數 <strong>{computed.coinCount}</strong></span>
          {computed.coins.map((c, i) => (
            <span key={i} className={styles.dot}>
              · 第{i + 1}枚 威力+<strong>{c.coinPower}</strong>
              {c.type !== 'normal' && <span className={c.type === 'red' ? styles.red : styles.green}> ({c.type === 'red' ? '紅' : '綠'})</span>}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
