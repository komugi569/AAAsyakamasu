export type Genre = "地理" | "日本史" | "公民";

export type QuizFormatMode = "multiple_choice" | "short_answer";

export type DeviceLayoutMode = "pc" | "smartphone";

export type SkillId = "binary_eye" | "time_stop" | "last_stand";

export interface BattleSkillsState {
  usesRemaining: Record<SkillId, number>;
  activeThisTurn: {
    binaryEye: boolean;
    timeStop: boolean;
    lastStand: boolean;
  };
  eliminatedOptionIndices: number[];
}

export type EnemyAffinity = "GEOGRAPHY_WEAK" | "JAPAN_HISTORY_WEAK" | "CIVICS_WEAK" | "NONE";

export interface QuizQuestion {
  id: number;
  genre: Genre;
  unit: string;
  question: string;
  options: string[];
  answerIndex: number;
  explanation: string;
  acceptedAnswers?: string[];
}

export interface ShuffledQuizQuestion {
  id: number;
  genre: Genre;
  unit: string;
  question: string;
  options: string[];
  correctAnswer: string;
  originalAnswerIndex: number;
  explanation: string;
  acceptedAnswers?: string[];
}

export interface DungeonEnemy {
  id: string;
  name: string;
  title: string;
  floor: number;
  maxHp: number;
  affinity: EnemyAffinity;
  weakGenre: Genre;
  affinityName: string;
  avatarType: "geo_golem" | "samurai_ghost" | "archmage_boss";
}

export interface BossGimmick {
  id: string;
  name: string;
  counterGenre: Genre;
  description: string;
  triggerTurn: number;
  turnsRemaining: number;
  damageMultiplier?: number;
}

export interface BattleLogEntry {
  id: string;
  turn: number;
  floor?: number;
  actor: "player" | "enemy" | "system";
  genre?: Genre;
  skillName?: string;
  damage?: number;
  isCritical?: boolean;
  isAffinityWeakness?: boolean;
  isGimmickBreak?: boolean;
  message: string;
  explanation?: string;
  timestamp: number;
}

export interface FloatingDamage {
  id: string;
  target: "player" | "enemy";
  amount: number | "MISS" | "LEVEL UP!";
  isCritical?: boolean;
  isGimmickBreak?: boolean;
  isAffinityWeakness?: boolean;
}

export type GamePhase = "title" | "stage_select" | "command" | "quiz" | "evaluating" | "victory" | "game_over";

export interface GameStats {
  turns: number;
  totalQuestions: number;
  correctCount: number;
  criticalCount: number;
  affinityHits: number;
  gimmickBreaks: number;
  genreBreakdown: Record<Genre, { asked: number; correct: number }>;
}

export interface PlayerProfile {
  level: number;
  exp: number;
  nextExp: number;
  maxHp: number;
  bonusAtkPercent: number;
  totalBattlesWon: number;
  title: string;
  highestEndlessFloor?: number;
  totalAnswers?: number;
  totalCorrect?: number;
  genreStats?: Record<Genre, { asked: number; correct: number }>;
}

export interface MissedQuestionRecord {
  questionId: number;
  missCount: number;
  lastMissedAt: number;
  genre: Genre;
  unit: string;
  questionText: string;
  explanation: string;
}

export interface StageInfo {
  id: string;
  title: string;
  subtitle: string;
  genre: Genre | "ALL";
  badgeColor: string;
  bossName: string;
  bossTitle: string;
  bossHp: number;
  description: string;
  totalFloors: number;
  isEndless?: boolean;
}

