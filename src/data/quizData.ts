import { Genre, QuizQuestion } from '../types/game';
import quizDatabase from './quizDatabase.json';

export const INITIAL_QUIZ_DATA: QuizQuestion[] = quizDatabase as QuizQuestion[];

export const GENRE_METADATA: Record<Genre, {
  name: Genre;
  icon: string;
  themeColor: string;
  bgClass: string;
  borderClass: string;
  textClass: string;
  hoverClass: string;
  glowColor: string;
  skills: string[];
}> = {
  "地理": {
    name: "地理",
    icon: "🌍",
    themeColor: "emerald",
    bgClass: "from-emerald-900/70 to-emerald-950/90 border-emerald-500/50 text-emerald-300",
    borderClass: "border-emerald-500 hover:border-emerald-400",
    textClass: "text-emerald-400",
    hoverClass: "hover:bg-emerald-900/50 hover:shadow-emerald-500/30",
    glowColor: "rgba(16, 185, 129, 0.4)",
    skills: ["偏西風ストーム！", "プレートテクトニクス・スマッシュ！", "モンスーン・タイフーン！", "扇状地グランドスラム！"]
  },
  "日本史": {
    name: "日本史",
    icon: "⚔️",
    themeColor: "rose",
    bgClass: "from-rose-900/70 to-rose-950/90 border-rose-500/50 text-rose-300",
    borderClass: "border-rose-500 hover:border-rose-400",
    textClass: "text-rose-400",
    hoverClass: "hover:bg-rose-900/50 hover:shadow-rose-500/30",
    glowColor: "rgba(244, 63, 94, 0.4)",
    skills: ["天下布武の一撃！", "明治維新バースト！", "大化の改新スラッシュ！", "源平合戦アロー！"]
  },
  "公民": {
    name: "公民",
    icon: "⚖️",
    themeColor: "amber",
    bgClass: "from-amber-900/70 to-amber-950/90 border-amber-500/50 text-amber-300",
    borderClass: "border-amber-500 hover:border-amber-400",
    textClass: "text-amber-400",
    hoverClass: "hover:bg-amber-900/50 hover:shadow-amber-500/30",
    glowColor: "rgba(245, 158, 11, 0.4)",
    skills: ["違憲立法審査砲！", "独占禁止法クラッシュ！", "ハイパーインフレ・バースト！", "三権分立ブレイク！"]
  }
};

