import React, { useState } from 'react';
import { MissedQuestionRecord } from '../types/game';
import { storage } from '../utils/storage';
import { Flame, Trash2, X, Swords, CheckCircle2, Lightbulb, BookX } from 'lucide-react';
import { sound } from '../utils/sound';

interface WeaknessDungeonModalProps {
  onStartWeaknessDungeon: (missedQuestions: MissedQuestionRecord[]) => void;
  onClose: () => void;
}

export const WeaknessDungeonModal: React.FC<WeaknessDungeonModalProps> = ({
  onStartWeaknessDungeon,
  onClose
}) => {
  const [missedList, setMissedList] = useState<MissedQuestionRecord[]>(() =>
    storage.getMissedQuestions()
  );

  const handleClear = () => {
    sound.playClick();
    if (window.confirm("これまでに間違えた問題の履歴をリセットしますか？")) {
      storage.clearMissedQuestions();
      setMissedList([]);
    }
  };

  const handleRemoveSingle = (id: number) => {
    sound.playClick();
    storage.removeMissedQuestion(id);
    setMissedList(prev => prev.filter(q => q.questionId !== id));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md select-none animate-fadeIn">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl max-w-xl w-full p-5 sm:p-6 shadow-2xl relative max-h-[90vh] flex flex-col">
        {/* Close Button */}
        <button
          onClick={() => {
            sound.playClick();
            onClose();
          }}
          className="absolute top-4 right-4 p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
          aria-label="閉じる"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-2.5 mb-2">
          <div className="w-9 h-9 rounded-xl bg-rose-950/80 border border-rose-500/60 flex items-center justify-center text-rose-400">
            <Flame className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg sm:text-xl font-bold text-slate-100">
                弱点復習ダンジョン
              </h2>
              <span className="text-xs bg-rose-950 text-rose-300 font-bold px-2 py-0.5 rounded border border-rose-700/50">
                ミス克服モード
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              過去のバトルで間違えた問題だけが集中的に出現する特訓ステージです
            </p>
          </div>
        </div>

        {/* Content */}
        {missedList.length === 0 ? (
          <div className="my-auto py-10 flex flex-col items-center text-center">
            <div className="w-14 h-14 rounded-full bg-emerald-950/80 border border-emerald-500/40 flex items-center justify-center text-emerald-400 mb-3 shadow">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <h3 className="font-bold text-slate-200 text-base mb-1">
              現在、間違えた問題のストックはありません！
            </h3>
            <p className="text-xs text-slate-400 max-w-sm mb-6 leading-relaxed">
              通常バトルでクイズを解くと、間違えた問題が自動的にここに記録されます。弱点が見つかったらここで集中特訓しましょう！
            </p>
            <button
              onClick={() => {
                sound.playClick();
                onClose();
              }}
              className="px-6 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-bold border border-slate-700 cursor-pointer"
            >
              通常バトルへ戻る
            </button>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between text-xs text-slate-400 px-1 my-2">
              <span>登録された弱点問題: <strong className="text-rose-400">{missedList.length} 問</strong></span>
              <button
                onClick={handleClear}
                className="flex items-center gap-1 text-slate-400 hover:text-rose-400 transition-colors cursor-pointer"
                title="履歴を全消去"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>履歴リセット</span>
              </button>
            </div>

            {/* List */}
            <div className="space-y-2.5 overflow-y-auto pr-1 flex-1 my-2">
              {missedList.map((item) => (
                <div
                  key={item.questionId}
                  className="p-3 bg-slate-950/70 border border-rose-900/40 rounded-xl relative text-xs"
                >
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="font-bold text-slate-200 bg-slate-900 px-2 py-0.5 rounded border border-slate-700">
                        {item.genre}
                      </span>
                      <span className="text-[11px] text-slate-400">
                        {item.unit}
                      </span>
                      <span className="text-[10px] text-rose-400 bg-rose-950/70 px-1.5 py-0.2 rounded border border-rose-800/40">
                        ミス {item.missCount} 回
                      </span>
                    </div>

                    <button
                      onClick={() => handleRemoveSingle(item.questionId)}
                      className="p-1 text-slate-500 hover:text-slate-300 transition-colors cursor-pointer"
                      title="この問題を復習リストから除外"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <p className="font-medium text-slate-200 mb-2 leading-relaxed">
                    {item.questionText}
                  </p>

                  <div className="text-[11px] text-amber-300/90 bg-amber-950/30 p-2 rounded border border-amber-900/30 flex items-start gap-1.5">
                    <Lightbulb className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                    <span>{item.explanation}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Launch Button */}
            <div className="pt-3 border-t border-slate-800 flex justify-center">
              <button
                onClick={() => {
                  sound.playClick();
                  onStartWeaknessDungeon(missedList);
                }}
                className="w-full sm:w-auto px-8 py-3 rounded-xl bg-gradient-to-r from-rose-500 via-rose-600 to-red-600 hover:from-rose-400 hover:to-rose-500 text-white font-bold text-sm sm:text-base shadow-lg shadow-rose-600/30 transition-all cursor-pointer transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
              >
                <Swords className="w-4 h-4" />
                <span>弱点復習ダンジョンに出撃する ({missedList.length}問)</span>
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
