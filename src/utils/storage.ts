import { DeviceLayoutMode, MissedQuestionRecord, PlayerProfile, QuizFormatMode, QuizQuestion } from '../types/game';
import { INITIAL_QUIZ_DATA } from '../data/quizData';

const MISSED_STORAGE_KEY = 'chronicle_missed_questions';
const PROFILE_STORAGE_KEY = 'chronicle_player_profile';
const CUSTOM_QUIZ_STORAGE_KEY = 'chronicle_custom_quiz_data';
const QUIZ_FORMAT_MODE_KEY = 'chronicle_quiz_format_mode';
const DEVICE_LAYOUT_MODE_KEY = 'chronicle_device_layout_mode';
const DB_VERSION_KEY = 'chronicle_db_version';
const CURRENT_DB_VERSION = 'v10_fresh_start_lv1_missed0';
const QUIZ_DATA_PATCH_KEY = 'chronicle_quiz_patch_version';
const CURRENT_QUIZ_DATA_PATCH = 'patch_2026_1205_shimanami';

function ensureCleanStorageVersion() {
  try {
    const savedVersion = localStorage.getItem(DB_VERSION_KEY);
    if (savedVersion !== CURRENT_DB_VERSION) {
      localStorage.removeItem(CUSTOM_QUIZ_STORAGE_KEY);
      localStorage.removeItem(MISSED_STORAGE_KEY);
      localStorage.removeItem(PROFILE_STORAGE_KEY);
      localStorage.setItem(DB_VERSION_KEY, CURRENT_DB_VERSION);
    }
    const savedPatch = localStorage.getItem(QUIZ_DATA_PATCH_KEY);
    if (savedPatch !== CURRENT_QUIZ_DATA_PATCH) {
      localStorage.removeItem(CUSTOM_QUIZ_STORAGE_KEY);
      localStorage.setItem(QUIZ_DATA_PATCH_KEY, CURRENT_QUIZ_DATA_PATCH);
    }
  } catch {
    // ignore storage errors
  }
}

export const DEFAULT_PLAYER_PROFILE: PlayerProfile = {
  level: 1,
  exp: 0,
  nextExp: 100,
  maxHp: 100,
  bonusAtkPercent: 0,
  totalBattlesWon: 0,
  title: "見習いの探究者",
  highestEndlessFloor: 0,
  totalAnswers: 0,
  totalCorrect: 0,
  genreStats: {
    "地理": { asked: 0, correct: 0 },
    "日本史": { asked: 0, correct: 0 },
    "公民": { asked: 0, correct: 0 }
  }
};

export const storage = {
  // --- Quiz Format Mode (4択 or 短答式) ---
  getQuizFormatMode(): QuizFormatMode {
    ensureCleanStorageVersion();
    try {
      const saved = localStorage.getItem(QUIZ_FORMAT_MODE_KEY);
      if (saved === 'short_answer' || saved === 'multiple_choice') {
        return saved;
      }
    } catch {
      // fallback
    }
    return 'short_answer';
  },

  saveQuizFormatMode(mode: QuizFormatMode) {
    try {
      localStorage.setItem(QUIZ_FORMAT_MODE_KEY, mode);
    } catch {
      // ignore
    }
  },

  // --- Device Layout Mode (PCモード or スマホモード) ---
  getDeviceLayoutMode(): DeviceLayoutMode {
    ensureCleanStorageVersion();
    try {
      const saved = localStorage.getItem(DEVICE_LAYOUT_MODE_KEY);
      if (saved === 'pc' || saved === 'smartphone') {
        return saved;
      }
    } catch {
      // fallback
    }
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      return 'smartphone';
    }
    return 'pc';
  },

  saveDeviceLayoutMode(mode: DeviceLayoutMode) {
    try {
      localStorage.setItem(DEVICE_LAYOUT_MODE_KEY, mode);
    } catch {
      // ignore
    }
  },

  // --- Quiz Database (Initial + Custom Imported) ---
  getAllQuestions(): QuizQuestion[] {
    ensureCleanStorageVersion();
    try {
      const customData = localStorage.getItem(CUSTOM_QUIZ_STORAGE_KEY);
      if (customData) {
        const parsed = JSON.parse(customData);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.filter((q: any) => q.genre !== "世界史");
        }
      }
    } catch {
      // fallback
    }
    return INITIAL_QUIZ_DATA;
  },

  saveCustomQuestions(questions: QuizQuestion[]) {
    try {
      localStorage.setItem(CUSTOM_QUIZ_STORAGE_KEY, JSON.stringify(questions));
      localStorage.setItem(DB_VERSION_KEY, CURRENT_DB_VERSION);
    } catch {
      // ignore
    }
  },

  resetQuestionsToDefault() {
    try {
      localStorage.removeItem(CUSTOM_QUIZ_STORAGE_KEY);
      localStorage.setItem(DB_VERSION_KEY, CURRENT_DB_VERSION);
    } catch {
      // ignore
    }
  },

  // --- Missed Questions ---
  getMissedQuestions(): MissedQuestionRecord[] {
    ensureCleanStorageVersion();
    try {
      const data = localStorage.getItem(MISSED_STORAGE_KEY);
      if (data) {
        const list: MissedQuestionRecord[] = JSON.parse(data);
        return list.filter(item => (item.genre as string) !== "世界史");
      }
      return [];
    } catch {
      return [];
    }
  },

  getMissedAsQuizQuestions(): QuizQuestion[] {
    const missed = this.getMissedQuestions();
    const all = this.getAllQuestions();
    const qMap = new Map<number, QuizQuestion>();
    all.forEach(q => qMap.set(q.id, q));

    const result: QuizQuestion[] = [];
    missed.forEach(m => {
      const found = qMap.get(m.questionId);
      if (found) {
        result.push(found);
      } else {
        result.push({
          id: m.questionId,
          genre: m.genre,
          unit: m.unit,
          question: m.questionText,
          options: ["選択肢A", "選択肢B", "選択肢C", "選択肢D"],
          answerIndex: 0,
          explanation: m.explanation
        });
      }
    });
    return result;
  },

  recordMissedQuestion(q: QuizQuestion) {
    try {
      const list = this.getMissedQuestions();
      const existing = list.find(item => item.questionId === q.id);
      if (existing) {
        existing.missCount += 1;
        existing.lastMissedAt = Date.now();
      } else {
        list.push({
          questionId: q.id,
          genre: q.genre,
          unit: q.unit,
          questionText: q.question,
          explanation: q.explanation
        });
      }
      localStorage.setItem(MISSED_STORAGE_KEY, JSON.stringify(list));
    } catch {
      // ignore
    }
  },

  removeMissedQuestion(questionId: number) {
    try {
      const list = this.getMissedQuestions().filter(item => item.questionId !== questionId);
      localStorage.setItem(MISSED_STORAGE_KEY, JSON.stringify(list));
    } catch {
      // ignore
    }
  },

  clearMissedQuestions() {
    try {
      localStorage.removeItem(MISSED_STORAGE_KEY);
    } catch {
      // ignore
    }
  },

  // --- Player Profile & Progression ---
  getPlayerProfile(): PlayerProfile {
    ensureCleanStorageVersion();
    try {
      const data = localStorage.getItem(PROFILE_STORAGE_KEY);
      if (data) {
        const parsed = JSON.parse(data);
        return {
          level: parsed.level || 1,
          exp: parsed.exp || 0,
          nextExp: parsed.nextExp || 100,
          maxHp: parsed.maxHp || 100,
          bonusAtkPercent: parsed.bonusAtkPercent || 0,
          totalBattlesWon: parsed.totalBattlesWon || 0,
          title: parsed.title || "見習いの探究者",
          highestEndlessFloor: parsed.highestEndlessFloor || 0,
          totalAnswers: parsed.totalAnswers || 0,
          totalCorrect: parsed.totalCorrect || 0,
          genreStats: parsed.genreStats || {
            "地理": { asked: 0, correct: 0 },
            "日本史": { asked: 0, correct: 0 },
            "公民": { asked: 0, correct: 0 }
          }
        };
      }
    } catch {
      // fallback
    }

    return {
      ...DEFAULT_PLAYER_PROFILE,
      genreStats: {
        "地理": { asked: 0, correct: 0 },
        "日本史": { asked: 0, correct: 0 },
        "公民": { asked: 0, correct: 0 }
      }
    };
  },

  savePlayerProfile(profile: PlayerProfile) {
    try {
      localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profile));
    } catch {
      // ignore
    }
  },

  resetAllProgress(): { profile: PlayerProfile; missed: MissedQuestionRecord[] } {
    try {
      localStorage.removeItem(MISSED_STORAGE_KEY);
      localStorage.removeItem(PROFILE_STORAGE_KEY);
      localStorage.setItem(DB_VERSION_KEY, CURRENT_DB_VERSION);
    } catch {
      // ignore
    }
    return {
      profile: {
        ...DEFAULT_PLAYER_PROFILE,
        genreStats: {
          "地理": { asked: 0, correct: 0 },
          "日本史": { asked: 0, correct: 0 },
          "公民": { asked: 0, correct: 0 }
        }
      },
      missed: []
    };
  }
};
