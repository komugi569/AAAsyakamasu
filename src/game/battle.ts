import { Genre, QuizQuestion, ShuffledQuizQuestion, BossGimmick, PlayerProfile } from '../types/game';
import { GENRE_METADATA } from '../data/quizData';

export interface PlayerDamageResult {
  damage: number;
  isCritical: boolean;
  isAffinityWeakness: boolean;
  isGimmickBreak: boolean;
  isBarrierReduced?: boolean;
}

/**
 * Calculates player damage against the enemy based on speed, streak, level, affinity weakness, and enemy barrier state
 */
export function calculatePlayerDamage(options: {
  answerTimeSeconds: number;
  genre: Genre;
  weakGenre?: Genre;
  isGimmickWeakness: boolean;
  hasActiveGimmick?: boolean;
  streak?: number;
  baseDamage?: number;
  criticalThresholdSeconds?: number;
  bonusAtkPercent?: number;
}): PlayerDamageResult {
  const {
    answerTimeSeconds,
    genre,
    weakGenre,
    isGimmickWeakness,
    hasActiveGimmick = false,
    streak = 0,
    baseDamage = 38,
    criticalThresholdSeconds = 5.0,
    bonusAtkPercent = 0
  } = options;

  const isCritical = answerTimeSeconds <= criticalThresholdSeconds;
  let multiplier = 1.0;

  if (isCritical) {
    multiplier *= 1.45;
  }

  // Streak bonus: +5% per streak above 1, capped at +30%
  if (streak > 1) {
    const streakBonus = Math.min(0.30, (streak - 1) * 0.05);
    multiplier += streakBonus;
  }

  // Player level bonus attack
  if (bonusAtkPercent > 0) {
    multiplier += (bonusAtkPercent / 100);
  }

  // Enemy Attribute / Affinity Weakness (e.g. 地理 against Golem, 日本史 against Samurai, 公民 against Archmage)
  const isAffinityWeakness = Boolean(weakGenre && weakGenre === genre);
  if (isAffinityWeakness) {
    multiplier *= 1.35; // 35% attribute bonus!
  }

  let finalDamage = baseDamage * multiplier;
  let isBarrierReduced = false;

  // Gimmick break bonus: extra flat 50 damage (shatters barrier)
  if (isGimmickWeakness) {
    finalDamage += 50 * (isCritical ? 1.25 : 1.0);
  } else if (hasActiveGimmick) {
    // Active barrier reduces damage by 45% if player ignores the required counter genre!
    finalDamage *= 0.55;
    isBarrierReduced = true;
  }

  return {
    damage: Math.round(finalDamage),
    isCritical,
    isAffinityWeakness,
    isGimmickBreak: isGimmickWeakness,
    isBarrierReduced
  };
}

/**
 * Calculates enemy counterattack damage against the player (Balanced forgiving tuning)
 */
export function calculateEnemyDamage(options: {
  turn: number;
  floor?: number;
  hasGimmickActive: boolean;
  baseDamage?: number;
}): number {
  const { turn, floor = 1, hasGimmickActive, baseDamage = 10 } = options;
  const turnScaling = Math.min(6, Math.floor(turn / 3) * 2);
  const floorScaling = (floor - 1) * 2;
  const gimmickBonus = hasGimmickActive ? 5 : 0;
  return baseDamage + turnScaling + floorScaling + gimmickBonus;
}

/**
 * Determines whether an enemy gimmick / barrier should be summoned
 */
export function determineNextGimmick(
  turn: number,
  bossHp: number,
  bossMaxHp: number,
  currentGimmick: BossGimmick | null,
  allowedGenre?: Genre | "ALL"
): BossGimmick | null {
  if (currentGimmick !== null) {
    return null;
  }

  if (allowedGenre && allowedGenre !== "ALL") {
    if (turn % 2 === 0 || bossHp < bossMaxHp * 0.5) {
      return getGimmickForGenre(allowedGenre, turn);
    }
    return null;
  }

  if (turn === 2) {
    return {
      id: `gimmick-${turn}-civics`,
      name: "悪法結界",
      counterGenre: "公民",
      description: "強固な歪んだ理が展開された（他分野ダメージ半減・反撃強化）！【公民】で正解して結界を粉砕せよ！",
      triggerTurn: turn,
      turnsRemaining: 3
    };
  }

  if (turn === 4) {
    return {
      id: `gimmick-${turn}-geo`,
      name: "地形トラップ",
      counterGenre: "地理",
      description: "大地の混沌が牙を剥く（他分野ダメージ半減・反撃強化）！【地理】で正解してトラップを無力化せよ！",
      triggerTurn: turn,
      turnsRemaining: 3
    };
  }

  if (turn === 6 || (turn >= 3 && bossHp < bossMaxHp * 0.45 && turn % 2 === 1)) {
    return {
      id: `gimmick-${turn}-nihon`,
      name: "歴史改変の結界",
      counterGenre: "日本史",
      description: "歴史の記憶が歪められる（他分野ダメージ半減・反撃強化）！【日本史】で正解して歴史を正せ！",
      triggerTurn: turn,
      turnsRemaining: 3
    };
  }

  if (turn >= 8 && turn % 2 === 0) {
    const cycleGenres: Genre[] = ["公民", "地理", "日本史"];
    const picked = cycleGenres[(turn / 2) % 3];
    return getGimmickForGenre(picked, turn);
  }

  return null;
}

export function getGimmickForGenre(genre: Genre, turn: number): BossGimmick {
  switch (genre) {
    case "公民":
      return {
        id: `gimmick-${turn}-civics`,
        name: "悪法結界",
        counterGenre: "公民",
        description: "悪法結界が発動中（結界中は反撃ダメージ激増）！【公民】で正解して粉砕せよ！",
        triggerTurn: turn,
        turnsRemaining: 3
      };
    case "地理":
      return {
        id: `gimmick-${turn}-geo`,
        name: "地形トラップ",
        counterGenre: "地理",
        description: "地殻変動トラップが発動中（結界中は反撃ダメージ激増）！【地理】で正解して解除せよ！",
        triggerTurn: turn,
        turnsRemaining: 3
      };
    case "日本史":
      return {
        id: `gimmick-${turn}-nihon`,
        name: "歴史改変の結界",
        counterGenre: "日本史",
        description: "歴史改変の呪いが発動中（結界中は反撃ダメージ激増）！【日本史】で正解して粉砕せよ！",
        triggerTurn: turn,
        turnsRemaining: 3
      };
  }
}

/**
 * Calculates EXP earned from a battle
 */
export function calculateExpGain(options: {
  isWin: boolean;
  correctCount: number;
  criticalCount: number;
  gimmickBreaks: number;
}): number {
  const { isWin, correctCount, criticalCount, gimmickBreaks } = options;
  let exp = correctCount * 25;
  exp += criticalCount * 15;
  exp += gimmickBreaks * 30;
  if (isWin) {
    exp += 80;
  }
  return Math.max(10, exp);
}

/**
 * Applies EXP and computes level up
 */
export function applyExpGain(
  profile: PlayerProfile,
  expGained: number
): { profile: PlayerProfile; leveledUp: boolean } {
  let { level, exp, nextExp, maxHp, bonusAtkPercent, totalBattlesWon } = profile;
  exp += expGained;
  let leveledUp = false;

  while (exp >= nextExp) {
    exp -= nextExp;
    level += 1;
    nextExp = Math.round(nextExp * 1.35);
    maxHp += 10;
    bonusAtkPercent += 5;
    leveledUp = true;
  }

  const titles = [
    "見習いの探究者",
    "知識の旅人",
    "歴史の紡ぎ手",
    "叡智の戦士",
    "社会科の英傑",
    "博覧強記の覇王"
  ];
  const title = titles[Math.min(titles.length - 1, level - 1)];

  return {
    profile: {
      ...profile,
      level,
      exp,
      nextExp,
      maxHp,
      bonusAtkPercent,
      totalBattlesWon,
      title
    },
    leveledUp
  };
}

/**
 * Shuffles quiz options deterministically or randomly so answer is not always at index 0
 */
export function shuffleQuestion(
  question: QuizQuestion,
  rng: () => number = Math.random
): ShuffledQuizQuestion {
  const originalCorrect = question.options[question.answerIndex];
  const indexed = question.options.map((opt, i) => ({ opt, isCorrect: i === question.answerIndex }));

  // Fisher-Yates shuffle
  const shuffled = [...indexed];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  return {
    id: question.id,
    genre: question.genre,
    unit: question.unit,
    question: question.question,
    options: shuffled.map(s => s.opt),
    correctAnswer: originalCorrect,
    originalAnswerIndex: question.answerIndex,
    explanation: question.explanation,
    acceptedAnswers: question.acceptedAnswers
  };
}

/**
 * Gets a random skill name for a given genre
 */
export function getRandomSkillName(genre: Genre, index?: number): string {
  const skills = GENRE_METADATA[genre]?.skills || ["知識の光芒！"];
  if (typeof index === 'number' && index >= 0) {
    return skills[index % skills.length];
  }
  return skills[Math.floor(Math.random() * skills.length)];
}
