import React from 'react';
import { PlayerProfile, Genre } from '../types/game';
import { X, Award, BarChart3, TrendingUp, Flame, Swords, BookOpen, CheckCircle2, AlertTriangle, ShieldCheck } from 'lucide-react';
import { sound } from '../utils/sound';

interface KarteModalProps {
  playerProfile: PlayerProfile;
  missedCount: number;
  onOpenWeaknessDungeon: () => void;
  onOpenEndlessTower: () => void;
  onOpenQuestionList: () => void;
  onClose: () => void;
}

export const KarteModal: React.FC<KarteModalProps> = ({
  playerProfile,
  missedCount,
  onOpenWeaknessDungeon,
  onOpenEndlessTower,
  onOpenQuestionList,
  onClose
}) => {
  const stats = playerProfile.genreStats || {
    "地理": { asked: 0, correct: 0 },
    "日本史": { asked: 0, correct: 0 },
    "公民": { asked: 0, correct: 0 }
  };

  const totalAsked = (stats["地理"].asked || 0) + (stats["日本史"].asked || 0) + (stats["公民"].asked || 0);
  const totalCorrect = (stats["地理"].correct || 0) + (stats["日本史"].correct || 0) + (stats["公民"].correct || 0);
  const overallRate = totalAsked > 0 ? Math.round((totalCorrect / totalAsked) * 100) : 0;

  // Grade evaluation
  let rank = "C";
  let rankColor = "text-amber-600 bg-amber-100 border-amber-300";
  let rankTitle = "修行中の探究者";

  if (totalAsked >= 20) {
    if (overallRate >= 90) {
      rank = "S";
      rankColor = "text-yellow-700 bg-yellow-100 border-yellow-400";
      rankTitle = "社会科マスター";
    } else if (overallRate >= 80) {
      rank = "A";
      rankColor = "text-emerald-700 bg-emerald-100 border-emerald-400";
      rankTitle = "歴戦の賢者";
    } else if (overallRate >= 65) {
      rank = "B";
      rankColor = "text-sky-700 bg-sky-100 border-sky-400";
      rankTitle = "知識の冒険家";
    } else {
      rank = "C";
      rankColor = "text-rose-700 bg-rose-100 border-rose-300";
      rankTitle = "発展途上の学徒";
    }
  }

  const getGenreRate = (genre: Genre) => {
    const s = stats[genre];
    if (!s || s.asked === 0) return 0;
    return Math.round((s.correct / s.asked) * 100);
  };

  const geoRate = getGenreRate("地理");
  const hisRate = getGenreRate("日本史");
  const civRate = getGenreRate("公民");

  // Advice logic
  let advice = "まずはバトルや各単元の特訓で問題を解いていきましょう！回答履歴がここに記録されます。";
  if (totalAsked >= 5) {
    const minRate = Math.min(geoRate, hisRate, civRate);
    if (minRate === geoRate && stats["地理"].asked > 0) {
      advice = "地理分野のミスがやや目立ちます。「大地の息吹と気候」や「日本列島縦断回廊」で地形・気候区分・都道府県の統計を重点復習するのがオススメです！";
    } else if (minRate === hisRate && stats["日本史"].asked > 0) {
      advice = "日本史分野の正解率を伸ばすチャンスです！特に近現代（明治〜戦後）の条約や出来事の並び替え問題を問題一覧で確認してみましょう！";
    } else if (minRate === civRate && stats["公民"].asked > 0) {
      advice = "公民分野で点数を底上げしましょう！日本国憲法の三大原理、国会・内閣・裁判所の三権分立、日本銀行の金融政策が重要攻略ポイントです！";
    } else {
      advice = "全分野バランスよく好成績です！『無限の知識塔』で限界まで階層を登り、実力を試してみましょう！";
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm select-none animate-fadeIn">
      <div className="bg-[#FAF7EE] border-2 border-amber-300/80 rounded-2xl max-w-2xl w-full p-5 sm:p-6 shadow-2xl relative max-h-[92vh] flex flex-col text-slate-800">
        {/* Close Button */}
        <button
          onClick={() => {
            sound.playClick();
            onClose();
          }}
          className="absolute top-4 right-4 p-1.5 rounded-xl bg-amber-100 hover:bg-amber-200 text-slate-600 hover:text-slate-900 transition-colors cursor-pointer border border-amber-300/60"
          aria-label="閉じる"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-amber-200/80 border border-amber-400 flex items-center justify-center text-amber-800 shadow-sm">
            <BarChart3 className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-black text-slate-900 tracking-wide">
                社会科カルテ（学習診断）
              </h2>
              <span className="text-[11px] font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full border border-amber-300">
                実力診断・自己分析
              </span>
            </div>
            <p className="text-xs text-slate-600 mt-0.5">
              あなたのこれまでの解答傾向と分野別習熟度を可視化します
            </p>
          </div>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-1">
          {/* Top Summary Card */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {/* Rank */}
            <div className={`p-3 rounded-xl border flex flex-col items-center justify-center shadow-sm ${rankColor}`}>
              <span className="text-[10px] font-bold tracking-wider uppercase text-slate-600">総合ランク</span>
              <span className="text-3xl font-black font-rpg my-0.5">{rank}</span>
              <span className="text-[10px] font-bold">{rankTitle}</span>
            </div>

            {/* Accuracy */}
            <div className="p-3 bg-white/90 rounded-xl border border-amber-200 flex flex-col items-center justify-center shadow-sm">
              <span className="text-[10px] font-bold text-slate-500">通算正解率</span>
              <span className="text-2xl font-black text-amber-700 my-0.5">{overallRate}%</span>
              <span className="text-[10px] text-slate-500">{totalCorrect} / {totalAsked} 問</span>
            </div>

            {/* Endless Floor Record */}
            <div className="p-3 bg-white/90 rounded-xl border border-amber-200 flex flex-col items-center justify-center shadow-sm">
              <span className="text-[10px] font-bold text-slate-500">無限塔最高記録</span>
              <span className="text-2xl font-black text-indigo-700 my-0.5">
                {playerProfile.highestEndlessFloor ? `${playerProfile.highestEndlessFloor}F` : "未挑戦"}
              </span>
              <span className="text-[10px] text-slate-500">限界サバイバル</span>
            </div>

            {/* Weakness Count */}
            <div className="p-3 bg-white/90 rounded-xl border border-amber-200 flex flex-col items-center justify-center shadow-sm">
              <span className="text-[10px] font-bold text-slate-500">要復習ストック</span>
              <span className={`text-2xl font-black my-0.5 ${missedCount > 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
                {missedCount} 問
              </span>
              <span className="text-[10px] text-slate-500">{missedCount > 0 ? "克服特訓可能" : "弱点ゼロ！"}</span>
            </div>
          </div>

          {/* Subject Breakdown Bars */}
          <div className="bg-white/90 border border-amber-200 rounded-xl p-4 shadow-sm space-y-3.5">
            <h3 className="text-xs font-bold text-slate-700 flex items-center gap-1.5 border-b border-amber-100 pb-2">
              <TrendingUp className="w-4 h-4 text-amber-600" />
              <span>3教科別 正解率・解答数</span>
            </h3>

            {/* Geography */}
            <div className="space-y-1">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-emerald-800 flex items-center gap-1">
                  <span>🌍 地理</span>
                  <span className="text-[11px] text-slate-500 font-normal">
                    ({stats["地理"].correct || 0} / {stats["地理"].asked || 0}問)
                  </span>
                </span>
                <span className="font-mono font-bold text-emerald-700">{geoRate}%</span>
              </div>
              <div className="w-full h-2.5 bg-emerald-100 rounded-full overflow-hidden border border-emerald-200">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all duration-500"
                  style={{ width: `${geoRate}%` }}
                />
              </div>
            </div>

            {/* History */}
            <div className="space-y-1">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-rose-800 flex items-center gap-1">
                  <span>⚔️ 日本史</span>
                  <span className="text-[11px] text-slate-500 font-normal">
                    ({stats["日本史"].correct || 0} / {stats["日本史"].asked || 0}問)
                  </span>
                </span>
                <span className="font-mono font-bold text-rose-700">{hisRate}%</span>
              </div>
              <div className="w-full h-2.5 bg-rose-100 rounded-full overflow-hidden border border-rose-200">
                <div
                  className="h-full bg-gradient-to-r from-rose-500 to-pink-500 rounded-full transition-all duration-500"
                  style={{ width: `${hisRate}%` }}
                />
              </div>
            </div>

            {/* Civics */}
            <div className="space-y-1">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-amber-800 flex items-center gap-1">
                  <span>⚖️ 公民</span>
                  <span className="text-[11px] text-slate-500 font-normal">
                    ({stats["公民"].correct || 0} / {stats["公民"].asked || 0}問)
                  </span>
                </span>
                <span className="font-mono font-bold text-amber-700">{civRate}%</span>
              </div>
              <div className="w-full h-2.5 bg-amber-100 rounded-full overflow-hidden border border-amber-200">
                <div
                  className="h-full bg-gradient-to-r from-amber-500 to-yellow-500 rounded-full transition-all duration-500"
                  style={{ width: `${civRate}%` }}
                />
              </div>
            </div>
          </div>

          {/* AI / System Advice Box */}
          <div className="bg-amber-100/70 border border-amber-300 rounded-xl p-3.5 shadow-sm flex items-start gap-2.5">
            <ShieldCheck className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
            <div className="space-y-1 text-xs">
              <span className="font-black text-amber-900 block">💡 カルテ診断アドバイス:</span>
              <p className="text-slate-700 leading-relaxed font-medium">
                {advice}
              </p>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
            <button
              onClick={() => {
                sound.playClick();
                onClose();
                onOpenWeaknessDungeon();
              }}
              className="py-2.5 px-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow transition-colors cursor-pointer"
            >
              <Flame className="w-4 h-4" />
              <span>弱点特訓ダンジョン ({missedCount})</span>
            </button>

            <button
              onClick={() => {
                sound.playClick();
                onClose();
                onOpenEndlessTower();
              }}
              className="py-2.5 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow transition-colors cursor-pointer"
            >
              <Swords className="w-4 h-4" />
              <span>無限の知識塔に挑戦</span>
            </button>

            <button
              onClick={() => {
                sound.playClick();
                onClose();
                onOpenQuestionList();
              }}
              className="py-2.5 px-3 rounded-xl bg-amber-700 hover:bg-amber-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow transition-colors cursor-pointer"
            >
              <BookOpen className="w-4 h-4" />
              <span>全問題事典で復習</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
