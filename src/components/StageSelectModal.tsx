import React from 'react';
import { StageInfo, Genre } from '../types/game';
import { STAGES } from '../data/stages';
import { X, Swords, Globe, BookOpen, Scale, Sparkles, ChevronRight } from 'lucide-react';
import { sound } from '../utils/sound';

interface StageSelectModalProps {
  currentStageId: string;
  onSelectStage: (stage: StageInfo) => void;
  onClose: () => void;
}

export const StageSelectModal: React.FC<StageSelectModalProps> = ({
  currentStageId,
  onSelectStage,
  onClose
}) => {
  const getIcon = (genre: Genre | 'ALL') => {
    switch (genre) {
      case '地理': return <Globe className="w-5 h-5 text-emerald-400" />;
      case '日本史': return <span className="text-lg">⚔️</span>;
      case '公民': return <Scale className="w-5 h-5 text-amber-400" />;
      default: return <Sparkles className="w-5 h-5 text-purple-400" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md select-none animate-fadeIn">
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
          <div className="w-8 h-8 rounded-lg bg-indigo-900/60 border border-indigo-500/50 flex items-center justify-center text-indigo-300">
            <Swords className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-100">
              ステージ・単元選択
            </h2>
            <p className="text-xs text-slate-400">
              テスト対策や集中特訓したい単元を選んで挑戦できます
            </p>
          </div>
        </div>

        {/* Stage List */}
        <div className="space-y-2.5 mt-3 overflow-y-auto pr-1 flex-1">
          {STAGES.map((stage) => {
            const isSelected = stage.id === currentStageId;
            return (
              <div
                key={stage.id}
                onClick={() => {
                  sound.playClick();
                  onSelectStage(stage);
                }}
                className={`p-3.5 sm:p-4 rounded-xl border-2 transition-all cursor-pointer flex items-center justify-between gap-3 ${
                  isSelected
                    ? 'bg-indigo-950/70 border-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.3)]'
                    : 'bg-slate-950/60 hover:bg-slate-800/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center shrink-0 mt-0.5">
                    {getIcon(stage.genre)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className={`text-[10px] sm:text-xs font-bold px-2 py-0.5 rounded border ${stage.badgeColor}`}>
                        {stage.genre === 'ALL' ? '全分野総合' : stage.genre}
                      </span>
                      <h3 className="font-bold text-sm sm:text-base text-slate-100">
                        {stage.title}
                      </h3>
                      {isSelected && (
                        <span className="text-[10px] font-bold bg-indigo-500 text-white px-2 py-0.2 rounded-full">
                          選択中
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-300 mb-1">
                      {stage.subtitle}
                    </p>
                    <p className="text-[11px] text-slate-400 line-clamp-2">
                      {stage.description}
                    </p>
                  </div>
                </div>

                <div className="shrink-0 flex items-center text-slate-400 group-hover:text-slate-200">
                  <ChevronRight className="w-5 h-5" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
