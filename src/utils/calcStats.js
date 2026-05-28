// ── 所有計算遇到小數點一律無條件退位 ──

export function floor(n) {
  return Math.floor(n);
}

// ── 基礎威力表（依技能熟練度）──
export function getBasePower(proficiency) {
  if (proficiency <= 30) return 1;
  if (proficiency <= 45) return 2;
  if (proficiency <= 60) return 3;
  if (proficiency <= 75) return 5;
  if (proficiency <= 90) return 7;
  if (proficiency <= 99) return 9;
  return 12; // 100+
}

// ── 硬幣威力表（依屬性值）──
export function getCoinPower(attrValue) {
  if (attrValue <= 40) return 3;
  if (attrValue <= 50) return 4;
  if (attrValue <= 60) return 5;
  if (attrValue <= 70) return 6;
  if (attrValue <= 80) return 9;
  if (attrValue <= 90) return 12;
  if (attrValue <= 99) return 15;
  return 20; // 100+
}

// ── 硬幣數量規則（依技能熟練度）──
// 回傳 { baseCoins, maxCoins, extraOptions }
// extraOptions: 可額外增加的硬幣數（0 / 1 / 2）
export function getCoinOptions(proficiency) {
  if (proficiency <= 40) return { baseCoins: 1, maxExtraCoins: 0 };
  if (proficiency <= 65) return { baseCoins: 1, maxExtraCoins: 1 };
  return { baseCoins: 1, maxExtraCoins: 2 }; // 66-90（91+ 同規則）
}

// ── 計算單一攻擊技能的完整數值 ──
// weaponType: 'melee' | 'ranged'
// stats: { STR, DEX, INT, CON, SIZ, LUK }
// forfeitExtraCoins: 放棄幾枚額外硬幣（0 = 全部拿，1 or 2 = 放棄幾枚）
export function calcSkillStats({ proficiency, weaponType, coinType, forfeitExtraCoins = 0, stats }) {
  const basePower = getBasePower(proficiency);

  // 硬幣威力依武器類型
  const attrForCoin = weaponType === 'melee' ? stats.STR : stats.INT;
  const originalCoinPower = getCoinPower(attrForCoin);

  const { maxExtraCoins } = getCoinOptions(proficiency);

  // 放棄枚數不能超過可增加的上限
  const actualForfeit = Math.min(forfeitExtraCoins, maxExtraCoins);

  // 最終硬幣數
  const coinCount = 1 + (maxExtraCoins - actualForfeit);

  // 放棄硬幣換威力：每放棄一枚，所有硬幣威力 += floor(原始硬幣威力 × 50%)
  const bonusPerForfeit = floor(originalCoinPower * 0.5);
  const finalCoinPower = originalCoinPower + bonusPerForfeit * actualForfeit;

  // 額外硬幣的威力懲罰（第2枚 -2，第3枚 -3）
  // 存成陣列，index 0 = 第1枚（無懲罰），index 1 = 第2枚，index 2 = 第3枚
  const coinPenalties = [0, -2, -3];
  const coins = Array.from({ length: coinCount }, (_, i) => ({
    index: i + 1,
    type: i === 0 ? coinType : 'normal', // 只有第1枚套用選擇的硬幣類型
    coinPower: Math.max(0, finalCoinPower + (coinPenalties[i] ?? 0)),
  }));

  return {
    basePower,
    originalCoinPower,
    finalCoinPower,
    coinCount,
    maxExtraCoins,
    actualForfeit,
    coins,
  };
}

// ── 計算防禦型技能數值 ──
// defenseType: 'guard' | 'dodge'
// guardBasePower: SIZ → 基礎威力；guardCoinPower: CON → 硬幣威力
// dodgeBasePower: 閃避熟練度 → 基礎威力；dodgeCoinPower: LUK → 硬幣威力
export function calcDefenseStats({ defenseType, stats, dodgeProficiency }) {
  if (defenseType === 'guard') {
    return {
      basePower: getBasePower(stats.SIZ),
      coinPower: getCoinPower(stats.CON),
      coinCount: 1,
    };
  }
  // dodge
  return {
    basePower: getBasePower(dodgeProficiency),
    coinPower: getCoinPower(stats.LUK),
    coinCount: 1,
  };
}

// ── 初始混亂值計算 ──
export function calcChaosThresholds(maxHp) {
  return [floor(maxHp * 0.6), 0];
}
