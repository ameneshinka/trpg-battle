import { db } from './config';
import { ref, push, set, update, remove, serverTimestamp } from 'firebase/database';
import { calcSkillStats, calcDefenseStats, calcChaosThresholds } from '../utils/calcStats';

// 將表單資料整理成 Firebase 存入格式
export function buildCharacterData({ formData, ownerId, type }) {
  const { name, stats, skills, dodgeProficiency, maxHp } = formData;

  // 計算每個技能的完整數值
  const computedSkills = skills.map((skill) => ({
    ...skill,
    computed: calcSkillStats({
      proficiency: Number(skill.proficiency),
      weaponType: skill.weaponType,
      coinType: skill.coinType,
      forfeitExtraCoins: Number(skill.forfeitExtraCoins ?? 0),
      stats: {
        STR: Number(stats.STR),
        INT: Number(stats.INT),
      },
    }),
  }));

  // 計算防禦技能
  const guardStats = calcDefenseStats({
    defenseType: 'guard',
    stats: { SIZ: Number(stats.SIZ), CON: Number(stats.CON) },
    dodgeProficiency: Number(dodgeProficiency),
  });

  const dodgeStats = calcDefenseStats({
    defenseType: 'dodge',
    stats: { LUK: Number(stats.LUK) },
    dodgeProficiency: Number(dodgeProficiency),
  });

  const hp = Number(maxHp);

  return {
    name,
    type, // 'pc' | 'npc'
    ownerId,
    stats: {
      STR: Number(stats.STR),
      DEX: Number(stats.DEX),
      INT: Number(stats.INT),
      CON: Number(stats.CON),
      SIZ: Number(stats.SIZ),
      LUK: Number(stats.LUK),
    },
    skills: computedSkills,
    dodgeProficiency: Number(dodgeProficiency),
    defenseSkills: { guard: guardStats, dodge: dodgeStats },
    combat: {
      hp,
      maxHp: hp,
      tempHp: 0,
      focus: 0,
      chaosThresholds: calcChaosThresholds(hp),
      statuses: {},
      isPanicked: false,
      isChaos: false,
    },
    createdAt: serverTimestamp(),
  };
}

export async function createCharacter(roomCode, formData, ownerId, type) {
  const charData = buildCharacterData({ formData, ownerId, type });
  const charsRef = ref(db, `rooms/${roomCode}/characters`);
  const newRef = await push(charsRef, charData);
  return newRef.key;
}

export async function deleteCharacter(roomCode, charId) {
  await remove(ref(db, `rooms/${roomCode}/characters/${charId}`));
}
