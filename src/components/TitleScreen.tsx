import React from 'react';
import { Play, BookOpen, Zap, Flame, Map, Sparkles, Settings, FileText, Keyboard, ListChecks, Monitor, Smartphone } from 'lucide-react';
import { sound } from '../utils/sound';
import { DeviceLayoutMode, PlayerProfile, QuizFormatMode } from '../types/game';
import { PlayerLevelBadge } from './PlayerLevelBadge';

interface TitleScreenProps {
  onStart: () => void;
  onOpenStageSelect: () => void;
  onOpenWeaknessDungeon: () => void;
  onOpenEndlessTower: () => void;
  onOpenKarte: () => void;
  onOpenQuestionList: () => void;
  onOpenAdmin: () => void;
  onOpenGuide: () => void;
  missedCount: number;
  playerProfile: PlayerProfile;
  quizFormatMode: QuizFormatMode;
  onChangeQuizFormatMode: (mode: QuizFormatMode) => void;
  deviceLayoutMode: DeviceLayoutMode;
  onChangeDeviceLayoutMode: (mode: DeviceLayoutMode) => void;
}

export const TitleScreen: React.FC<TitleScreenProps> = ({
  onStart,
  onOpenStageSelect,
  onOpenWeaknessDungeon,
  onOpenEndlessTower,
  onOpenKarte,
  onOpenQuestionList,
  onOpenAdmin,
  onOpenGuide,
  missedCount,
  playerProfile,
  quizFormatMode,
  onChangeQuizFormatMode,
  deviceLayoutMode,
  onChangeDeviceLayoutMode
}) => {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-3 sm:p-4 relative overflow-hidden bg-fantasy-stage select-none">
      {/* Background magical ambient rings */}
      <div className="absolute inset-0 pointer-events-none opacity-40">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[680px] h-[680px] rounded-full border border-amber-400/40 animate-pulse" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full border border-dashed border-amber-500/30 animate-spin" style={{ animationDuration: '45s' }} />
      </div>

      <div className="relative z-10 max-w-xl w-full flex flex-col items-center text-center">
        {/* Profile Level at top */}
        <div className="mb-1.5">
          <PlayerLevelBadge profile={playerProfile} />
        </div>

        {/* Sub-badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-100/90 border border-amber-300 text-amber-900 text-xs font-bold tracking-wider mb-1.5 shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-amber-600" />
          <span>社会科特化型ターン制クイズバトルRPG（全1,449問収録！）</span>
        </div>

        {/* Main Title Section */}
        <div className="relative inline-block mb-2.5 px-4">
          <h1 className="text-5xl sm:text-7xl font-black font-rpg tracking-wider text-transparent bg-clip-text bg-gradient-to-b from-amber-600 via-amber-700 to-amber-900 drop-shadow-[0_4px_15px_rgba(217,119,6,0.35)] leading-none">
            シャカマス
          </h1>
          <div className="text-right mt-1 flex justify-end">
            <span className="text-[11px] font-bold text-amber-900 tracking-wider bg-amber-100/90 px-2.5 py-0.5 rounded-lg border border-amber-300 shadow-sm">
              シャカイマスター 〜知識で戦う冒険譚〜
            </span>
          </div>
        </div>

        {/* Quiz Format Mode & PC/Smartphone Mode Selector Card */}
        <div className="w-full max-w-md bg-white/95 border-2 border-amber-400/80 rounded-2xl p-2.5 sm:p-3 mb-3 shadow-md text-left space-y-2">
          {/* Format Mode Row */}
          <div>
            <div className="flex items-center justify-between gap-2 mb-1">
              <span className="text-xs font-black text-slate-800">
                1. 出題モード選択
              </span>
              <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded">
                {quizFormatMode === 'short_answer' ? '制限30秒・別名や表記ゆれ完全OK' : '制限15秒・テンポ重視'}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-1.5">
              <button
                type="button"
                data-testid="mode-select-short-answer"
                onClick={() => {
                  sound.playClick();
                  onChangeQuizFormatMode('short_answer');
                }}
                className={`py-2 px-2.5 rounded-xl border-2 font-bold text-xs transition-all cursor-pointer flex items-center justify-center gap-1.5 whitespace-nowrap ${
                  quizFormatMode === 'short_answer'
                    ? 'bg-slate-900 border-amber-500 text-amber-300 shadow-sm'
                    : 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-600'
                }`}
              >
                <Keyboard className="w-3.5 h-3.5 shrink-0" />
                <span>短答式（記述入力）</span>
              </button>

              <button
                type="button"
                data-testid="mode-select-multiple-choice"
                onClick={() => {
                  sound.playClick();
                  onChangeQuizFormatMode('multiple_choice');
                }}
                className={`py-2 px-2.5 rounded-xl border-2 font-bold text-xs transition-all cursor-pointer flex items-center justify-center gap-1.5 whitespace-nowrap ${
                  quizFormatMode === 'multiple_choice'
                    ? 'bg-indigo-700 border-indigo-400 text-white shadow-sm'
                    : 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-600'
                }`}
              >
                <ListChecks className="w-3.5 h-3.5 shrink-0" />
                <span>4択クイズモード</span>
              </button>
            </div>
          </div>

          {/* Device Layout Mode Row (PC Mode vs Smartphone Mode) */}
          <div className="pt-1.5 border-t border-slate-200">
            <div className="flex items-center justify-between gap-2 mb-1">
              <span className="text-xs font-black text-slate-800">
                2. 画面レイアウト選択（1画面に収まる快適設計）
              </span>
            </div>
            <div className="grid grid-cols-2 gap-1.5">
              <button
                type="button"
                data-testid="layout-select-pc"
                onClick={() => {
                  sound.playClick();
                  onChangeDeviceLayoutMode('pc');
                }}
                className={`py-1.5 px-2.5 rounded-xl border-2 font-bold text-xs transition-all cursor-pointer flex items-center justify-center gap-1.5 whitespace-nowrap ${
                  deviceLayoutMode === 'pc'
                    ? 'bg-sky-700 border-sky-400 text-white shadow-sm'
                    : 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-600'
                }`}
              >
                <Monitor className="w-3.5 h-3.5 shrink-0" />
                <span>PCモード（横ワイド）</span>
              </button>

              <button
                type="button"
                data-testid="layout-select-smartphone"
                onClick={() => {
                  sound.playClick();
                  onChangeDeviceLayoutMode('smartphone');
                }}
                className={`py-1.5 px-2.5 rounded-xl border-2 font-bold text-xs transition-all cursor-pointer flex items-center justify-center gap-1.5 whitespace-nowrap ${
                  deviceLayoutMode === 'smartphone'
                    ? 'bg-emerald-700 border-emerald-400 text-white shadow-sm'
                    : 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-600'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5 shrink-0" />
                <span>スマホモード（縦画面）</span>
              </button>
            </div>
          </div>
        </div>

        {/* Action Buttons Grid */}
        <div className="flex flex-col gap-2 w-full max-w-md">
          {/* Main Action: Start Game (3-Floor Wave Dungeon) */}
          <button
            onClick={() => {
              sound.playClick();
              onStart();
            }}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 via-amber-600 to-yellow-600 hover:from-amber-400 hover:to-amber-500 text-white font-black text-base sm:text-lg tracking-wider shadow-lg shadow-amber-600/30 transition-all cursor-pointer transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
          >
            <Play className="w-5 h-5 fill-white" />
            <span>
              全3階層ダンジョンへ出撃（{quizFormatMode === 'short_answer' ? '短答式' : '4択'}）
            </span>
          </button>

          {/* Endless Mode & Karte Row */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => {
                sound.playClick();
                onOpenEndlessTower();
              }}
              className="py-2.5 px-2 rounded-xl bg-gradient-to-r from-indigo-700 via-purple-700 to-indigo-800 hover:from-indigo-600 hover:to-purple-600 text-white font-bold text-xs transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-md"
            >
              <Zap className="w-4 h-4 text-amber-300" />
              <span>無限の知識塔（エンドレス）</span>
            </button>

            <button
              onClick={() => {
                sound.playClick();
                onOpenKarte();
              }}
              className="py-2.5 px-2 rounded-xl bg-white hover:bg-amber-50 border-2 border-amber-400 text-amber-900 font-bold text-xs transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-sm"
            >
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span>社会科カルテ（診断）</span>
            </button>
          </div>

          {/* Sub Row 1: Stage Select, Weakness Dungeon, Question Browser */}
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => {
                sound.playClick();
                onOpenStageSelect();
              }}
              className="py-2 px-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-300 text-slate-800 font-bold text-xs transition-all cursor-pointer flex flex-col items-center justify-center gap-1 shadow-sm"
            >
              <Map className="w-4 h-4 text-indigo-600" />
              <span>単元別特訓</span>
            </button>

            <button
              onClick={() => {
                sound.playClick();
                onOpenWeaknessDungeon();
              }}
              className={`py-2 px-2 rounded-xl border font-bold text-xs transition-all cursor-pointer flex flex-col items-center justify-center gap-1 shadow-sm ${
                missedCount > 0
                  ? 'bg-rose-50 hover:bg-rose-100 border-rose-400 text-rose-800 ring-1 ring-rose-400/50'
                  : 'bg-white hover:bg-slate-50 border-slate-300 text-slate-700'
              }`}
            >
              <div className="flex items-center gap-1">
                <Flame className="w-4 h-4 text-rose-600" />
                {missedCount > 0 && (
                  <span className="text-[10px] bg-rose-600 text-white font-black px-1.5 rounded-full">
                    {missedCount}
                  </span>
                )}
              </div>
              <span>弱点復習</span>
            </button>

            <button
              onClick={() => {
                sound.playClick();
                onOpenQuestionList();
              }}
              className="py-2 px-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-300 text-slate-800 font-bold text-xs transition-all cursor-pointer flex flex-col items-center justify-center gap-1 shadow-sm"
            >
              <FileText className="w-4 h-4 text-sky-600" />
              <span>問題事典</span>
            </button>
          </div>

          {/* Sub Row 2: Rules & Admin */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => {
                sound.playClick();
                onOpenGuide();
              }}
              className="py-2 px-3 rounded-xl bg-white/80 hover:bg-white border border-slate-300 text-slate-700 font-medium text-xs transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-sm"
            >
              <BookOpen className="w-3.5 h-3.5 text-sky-600" />
              <span>バトルの極意・スキル</span>
            </button>

            <button
              onClick={() => {
                sound.playClick();
                onOpenAdmin();
              }}
              className="py-2 px-3 rounded-xl bg-white/80 hover:bg-white border border-slate-300 text-slate-600 hover:text-slate-900 text-xs transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-sm"
            >
              <Settings className="w-3.5 h-3.5 text-slate-500" />
              <span>管理者ツール</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
