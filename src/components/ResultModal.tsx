import React, { useState } from 'react';
import { GameStats, ShuffledQuizQuestion, PlayerProfile } from '../types/game';
import {
  Trophy,
  Skull,
  RotateCcw,
  CheckCircle,
  XCircle,
  Lightbulb,
  Zap,
  Shield,
  Award,
  Flame,
  ArrowRight
} from 'lucide-react';
import { sound } from '../utils/sound';

interface ResultModalProps {
  type: 'victory' | 'game_over';
  stats: GameStats;
  reviewList: Array<{
    question: ShuffledQuizQuestion;
    isCorrect: boolean;
    userAnswer: string;
  }>;
  expGained: number;
  playerProfile: PlayerProfile;
  didLevelUp: boolean;
  onRestart: () => void;
  onLaunchWeaknessDungeon: () => void;
}

export const ResultModal: React.FC<ResultModalProps> = ({
  type,
  stats,
  reviewList,
  expGained,
  playerProfile,
  didLevelUp,
  onRestart,
  onLaunchWeaknessDungeon
}) => {
  const [filterMode, setFilterMode] = useState<'all' | 'missed'>('all');
  const isVictory = type === 'victory';

  const missedItems = reviewList.filter(item => !item.isCorrect);
  const displayedItems = filterMode === 'missed' ? missedItems : reviewList;

  const accuracyPercent = stats.totalQuestions > 0
    ? Math.round((stats.correctCount / stats.totalQuestions) * 100)
    : 0;

  // Title rank based on accuracy and crits
  const getRank = () => {
    if (!isVictory) return { rank: "C", title: "修行中の探究者", color: "text-slate-400" };
    if (accuracyPercent === 100 && stats.criticalCount >= 3) return { rank: "SSS", title: "博覧強記の覇王", color: "text-yellow-300" };
    if (accuracyPercent >= 85) return { rank: "S", title: "社会科の英傑", color: "text-amber-400" };
    if (accuracyPercent >= 70) return { rank: "A", title: "歴戦の探究者", color: "text-cyan-400" };
    return { rank: "B", title: "合格圏の知恵者", color: "text-emerald-400" };
  };

  const rankInfo = getRank();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto animate-fadeIn select-none">
      <div className="bg-slate-900 border border-indigo-500/40 rounded-2xl max-w-xl w-full p-4 sm:p-6 shadow-2xl relative my-auto">
        {/* Header Icon & Title */}
        <div className="flex flex-col items-center text-center mb-4 sm:mb-5">
          <div className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center mb-2 sm:mb-3 shadow-lg ${
            isVictory
              ? 'bg-amber-950/90 border-2 border-amber-400 text-amber-400 shadow-amber-500/40'
              : 'bg-rose-950/90 border-2 border-rose-500 text-rose-500 shadow-rose-600/40'
          }`}>
            {isVictory ? <Trophy className="w-7 h-7 sm:w-8 sm:h-8" /> : <Skull className="w-7 h-7 sm:w-8 sm:h-8" />}
          </div>

          <h2 className={`text-2xl sm:text-3xl font-black font-cinzel tracking-wider ${
            isVictory ? 'text-amber-400 drop-shadow-[0_2px_10px_rgba(245,158,11,0.5)]' : 'text-rose-500'
          }`}>
            {isVictory ? 'VICTORY!' : 'GAME OVER'}
          </h2>
          <p className="text-slate-300 text-xs sm:text-sm mt-0.5">
            {isVictory
              ? '見事ボスを討伐し、失われた社会の記憶を取り戻した！'
              : '探究者のHPが尽きた... 弱点を復習して再挑戦しよう！'}
          </p>

          {/* Level Up & EXP Gain Banner */}
          <div className="mt-3 flex items-center gap-2 flex-wrap justify-center">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-950 border border-amber-500/50 text-xs font-bold text-amber-300">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>獲得EXP: +{expGained}</span>
            </div>

            {didLevelUp && (
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 text-xs font-black shadow-lg animate-bounce">
                <Award className="w-4 h-4" />
                <span>LEVEL UP! Lv.{playerProfile.level}（最大HP & 攻撃力上昇！）</span>
              </div>
            )}

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-950 border border-slate-800 text-xs">
              <span className={`font-black font-cinzel ${rankInfo.color}`}>
                Rank {rankInfo.rank}
              </span>
              <span className="text-slate-300 font-bold">
                {rankInfo.title}
              </span>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
          <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-2 text-center">
            <span className="text-[11px] text-slate-400 block mb-0.5">経過ターン</span>
            <span className="font-mono font-bold text-base text-slate-200">
              {stats.turns}
            </span>
          </div>
          <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-2 text-center">
            <span className="text-[11px] text-slate-400 block mb-0.5">正解率</span>
            <span className="font-mono font-bold text-base text-emerald-400">
              {accuracyPercent}%
            </span>
          </div>
          <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-2 text-center">
            <span className="text-[11px] text-slate-400 block mb-0.5">会心の一撃</span>
            <span className="font-mono font-bold text-base text-amber-400 flex items-center justify-center gap-1">
              <Zap className="w-3.5 h-3.5" />
              {stats.criticalCount}
            </span>
          </div>
          <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-2 text-center">
            <span className="text-[11px] text-slate-400 block mb-0.5">結界粉砕</span>
            <span className="font-mono font-bold text-base text-yellow-400 flex items-center justify-center gap-1">
              <Shield className="w-3.5 h-3.5" />
              {stats.gimmickBreaks}
            </span>
          </div>
        </div>

        {/* Review Section with Filter Tabs */}
        {reviewList.length > 0 && (
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-300">
                出題問題と1行要点解説の復習
              </span>

              {/* Tabs */}
              <div className="flex items-center gap-1 bg-slate-950 p-0.5 rounded-lg border border-slate-800 text-[11px]">
                <button
                  onClick={() => setFilterMode('all')}
                  className={`px-2 py-0.5 rounded cursor-pointer ${
                    filterMode === 'all'
                      ? 'bg-indigo-600 text-white font-bold'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  全問 ({reviewList.length})
                </button>
                <button
                  onClick={() => setFilterMode('missed')}
                  className={`px-2 py-0.5 rounded cursor-pointer flex items-center gap-1 ${
                    filterMode === 'missed'
                      ? 'bg-rose-600 text-white font-bold'
                      : 'text-slate-400 hover:text-rose-300'
                  }`}
                >
                  <span>間違えた問題</span>
                  {missedItems.length > 0 && (
                    <span className="bg-rose-950 text-rose-300 px-1 rounded-full text-[10px]">
                      {missedItems.length}
                    </span>
                  )}
                </button>
              </div>
            </div>

            {/* Questions List */}
            <div className="max-h-44 sm:max-h-52 overflow-y-auto space-y-2 pr-1">
              {displayedItems.length === 0 ? (
                <div className="p-4 text-center text-xs text-emerald-400 bg-emerald-950/30 rounded-xl border border-emerald-900/40">
                  🎉 間違えた問題はありません！パーフェクトクリアです！
                </div>
              ) : (
                displayedItems.map((item, idx) => (
                  <div
                    key={idx}
                    className={`p-2.5 rounded-xl border text-xs leading-relaxed ${
                      item.isCorrect
                        ? 'bg-slate-950/70 border-emerald-900/50'
                        : 'bg-rose-950/40 border-rose-800/60'
                    }`}
                  >
                    <div className="flex items-start gap-1.5 mb-1 font-semibold text-slate-100">
                      {item.isCorrect ? (
                        <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      ) : (
                        <XCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                      )}
                      <span>
                        [{item.question.genre}・{item.question.unit}] {item.question.question}
                      </span>
                    </div>

                    <div className="ml-5 text-slate-300 text-[11px] sm:text-xs">
                      <span className="text-emerald-400 font-bold">正解: {item.question.correctAnswer}</span>
                      {!item.isCorrect && (
                        <span className="text-rose-400 ml-2">(あなたの解答: {item.userAnswer})</span>
                      )}
                    </div>

                    <div className="ml-5 mt-1 text-[11px] text-amber-200 bg-amber-950/40 p-1.5 rounded border border-amber-800/40 flex items-start gap-1">
                      <Lightbulb className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                      <span>{item.question.explanation}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-2.5 justify-center">
          {/* If there are missed questions, offer immediate Weakness Dungeon Launch! */}
          {missedItems.length > 0 && (
            <button
              onClick={() => {
                sound.playClick();
                onLaunchWeaknessDungeon();
              }}
              className="w-full sm:w-auto px-5 py-3 rounded-xl bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white font-bold text-xs sm:text-sm shadow-lg shadow-rose-600/30 transition-all cursor-pointer flex items-center justify-center gap-1.5"
            >
              <Flame className="w-4 h-4" />
              <span>間違えた問題を特訓する ({missedItems.length}問)</span>
            </button>
          )}

          <button
            onClick={() => {
              sound.playClick();
              onRestart();
            }}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-300 hover:to-yellow-300 text-slate-950 font-black text-xs sm:text-sm shadow-lg shadow-amber-500/25 transition-all cursor-pointer transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-1.5"
          >
            <RotateCcw className="w-4 h-4" />
            <span>{isVictory ? 'もう一度戦う' : '再挑戦する'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
