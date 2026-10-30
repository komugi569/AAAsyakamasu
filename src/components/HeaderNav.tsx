import React, { useState, useRef, useEffect } from 'react';
import {
  Volume2,
  VolumeX,
  RotateCcw,
  BookOpen,
  Flame,
  Map,
  Settings,
  FileText,
  BarChart3,
  Keyboard,
  ListChecks,
  Menu,
  X,
  Monitor,
  Smartphone,
  Home,
  Trash2
} from 'lucide-react';
import { sound } from '../utils/sound';
import { DeviceLayoutMode, PlayerProfile, QuizFormatMode } from '../types/game';

interface HeaderNavProps {
  isMuted: boolean;
  onToggleMute: () => void;
  onReset: () => void;
  onReturnTitle: () => void;
  onResetAllProgress: () => void;
  onOpenGuide: () => void;
  onOpenStageSelect: () => void;
  onOpenWeaknessDungeon: () => void;
  onOpenQuestionList: () => void;
  onOpenKarte: () => void;
  onOpenAdmin: () => void;
  turn: number;
  playerProfile: PlayerProfile;
  missedCount: number;
  quizFormatMode: QuizFormatMode;
  onToggleQuizFormatMode: () => void;
  deviceLayoutMode: DeviceLayoutMode;
  onChangeDeviceLayoutMode: (mode: DeviceLayoutMode) => void;
}

export const HeaderNav: React.FC<HeaderNavProps> = ({
  isMuted,
  onToggleMute,
  onReset,
  onReturnTitle,
  onResetAllProgress,
  onOpenGuide,
  onOpenStageSelect,
  onOpenWeaknessDungeon,
  onOpenQuestionList,
  onOpenKarte,
  onOpenAdmin,
  turn,
  playerProfile,
  missedCount,
  quizFormatMode,
  onToggleQuizFormatMode,
  deviceLayoutMode,
  onChangeDeviceLayoutMode
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  // Close menu when clicking outside
  useEffect(() => {
    if (!isMenuOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    window.addEventListener('mousedown', handleClickOutside);
    return () => window.removeEventListener('mousedown', handleClickOutside);
  }, [isMenuOpen]);

  return (
    <header className="w-full bg-slate-900/95 backdrop-blur border-b border-indigo-950/60 px-3 sm:px-4 py-1.5 flex items-center justify-between text-xs sm:text-sm select-none z-30 shrink-0 relative">
      {/* Zone 1: Brand & Compact Status */}
      <div className="flex items-center gap-2 sm:gap-3">
        <button
          type="button"
          onClick={() => {
            sound.playClick();
            onReturnTitle();
          }}
          className="font-rpg font-black tracking-wider text-amber-400 text-base sm:text-lg hover:text-amber-300 transition-colors cursor-pointer whitespace-nowrap"
          title="タイトル画面へ戻る"
        >
          シャカマス
        </button>

        <div className="flex items-center gap-2 text-xs text-slate-300 font-mono tabular-nums">
          <span>Lv.{playerProfile.level}</span>
          <span aria-hidden="true" className="text-slate-600">·</span>
          <span>
            TURN <strong className="text-amber-400">{turn}</strong>
          </span>
          <span aria-hidden="true" className="text-slate-600 hidden sm:inline">·</span>
          <span className="hidden sm:inline text-slate-400">
            {quizFormatMode === 'short_answer' ? '短答式' : '4択'}
          </span>
          <span aria-hidden="true" className="text-slate-600 hidden sm:inline">·</span>
          <span className="hidden sm:inline text-slate-400">
            {deviceLayoutMode === 'pc' ? 'PC表示' : 'スマホ表示'}
          </span>
        </div>
      </div>

      {/* Zone 3: Single Consolidated Menu Button */}
      <div className="relative" ref={menuRef}>
        <button
          type="button"
          data-testid="unified-menu-button"
          onClick={() => {
            sound.playClick();
            setIsMenuOpen(prev => !prev);
          }}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-100 font-bold text-xs transition-colors cursor-pointer whitespace-nowrap shadow-sm"
          aria-expanded={isMenuOpen}
          aria-label="メニューを開く"
        >
          {isMenuOpen ? <X className="w-4 h-4 text-amber-400" /> : <Menu className="w-4 h-4 text-amber-400" />}
          <span>メニュー</span>
          {missedCount > 0 && (
            <span className="text-[10px] bg-rose-600 text-white font-black px-1.5 rounded-full">
              {missedCount}
            </span>
          )}
        </button>

        {/* Consolidated Dropdown Panel */}
        {isMenuOpen && (
          <div className="absolute right-0 mt-2 w-72 sm:w-80 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-3 z-50 space-y-3 text-xs animate-fadeIn">
            {/* Section 1: Mode & Display Toggles */}
            <div className="space-y-2 pb-2.5 border-b border-slate-800">
              <div className="text-[11px] font-bold text-slate-400 px-1">
                出題形式・画面モード切替
              </div>

              {/* Quiz Format Toggle */}
              <div className="grid grid-cols-2 gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800">
                <button
                  type="button"
                  onClick={() => {
                    sound.playClick();
                    if (quizFormatMode !== 'short_answer') onToggleQuizFormatMode();
                  }}
                  className={`py-1.5 px-2 rounded-lg font-bold flex items-center justify-center gap-1 cursor-pointer transition-colors whitespace-nowrap ${
                    quizFormatMode === 'short_answer'
                      ? 'bg-amber-500 text-slate-950'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Keyboard className="w-3.5 h-3.5" />
                  <span>短答式（記述）</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    sound.playClick();
                    if (quizFormatMode !== 'multiple_choice') onToggleQuizFormatMode();
                  }}
                  className={`py-1.5 px-2 rounded-lg font-bold flex items-center justify-center gap-1 cursor-pointer transition-colors whitespace-nowrap ${
                    quizFormatMode === 'multiple_choice'
                      ? 'bg-indigo-600 text-white'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <ListChecks className="w-3.5 h-3.5" />
                  <span>4択モード</span>
                </button>
              </div>

              {/* PC / Smartphone Layout Toggle */}
              <div className="grid grid-cols-2 gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800">
                <button
                  type="button"
                  onClick={() => {
                    sound.playClick();
                    onChangeDeviceLayoutMode('pc');
                  }}
                  className={`py-1.5 px-2 rounded-lg font-bold flex items-center justify-center gap-1 cursor-pointer transition-colors whitespace-nowrap ${
                    deviceLayoutMode === 'pc'
                      ? 'bg-sky-500 text-slate-950'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Monitor className="w-3.5 h-3.5" />
                  <span>PCモード</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    sound.playClick();
                    onChangeDeviceLayoutMode('smartphone');
                  }}
                  className={`py-1.5 px-2 rounded-lg font-bold flex items-center justify-center gap-1 cursor-pointer transition-colors whitespace-nowrap ${
                    deviceLayoutMode === 'smartphone'
                      ? 'bg-emerald-500 text-slate-950'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Smartphone className="w-3.5 h-3.5" />
                  <span>スマホモード</span>
                </button>
              </div>
            </div>

            {/* Section 2: Main Navigation & Learning */}
            <div className="grid grid-cols-2 gap-1.5">
              <button
                type="button"
                onClick={() => {
                  sound.playClick();
                  setIsMenuOpen(false);
                  onOpenWeaknessDungeon();
                }}
                className="p-2 rounded-xl bg-slate-800/90 hover:bg-slate-700 border border-slate-700 text-left flex items-center justify-between cursor-pointer"
              >
                <span className="flex items-center gap-1.5 font-bold text-rose-300 whitespace-nowrap">
                  <Flame className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                  <span>弱点復習</span>
                </span>
                <span className="text-[10px] font-mono bg-slate-950 text-slate-300 px-1.5 py-0.5 rounded">
                  {missedCount}問
                </span>
              </button>

              <button
                type="button"
                onClick={() => {
                  sound.playClick();
                  setIsMenuOpen(false);
                  onOpenStageSelect();
                }}
                className="p-2 rounded-xl bg-slate-800/90 hover:bg-slate-700 border border-slate-700 text-left flex items-center gap-1.5 font-bold text-slate-200 cursor-pointer whitespace-nowrap"
              >
                <Map className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                <span>単元選択</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  sound.playClick();
                  setIsMenuOpen(false);
                  onOpenQuestionList();
                }}
                className="p-2 rounded-xl bg-slate-800/90 hover:bg-slate-700 border border-slate-700 text-left flex items-center gap-1.5 font-bold text-slate-200 cursor-pointer whitespace-nowrap"
              >
                <FileText className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <span>問題事典</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  sound.playClick();
                  setIsMenuOpen(false);
                  onOpenKarte();
                }}
                className="p-2 rounded-xl bg-slate-800/90 hover:bg-slate-700 border border-slate-700 text-left flex items-center gap-1.5 font-bold text-amber-300 cursor-pointer whitespace-nowrap"
              >
                <BarChart3 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>社会科カルテ</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  sound.playClick();
                  setIsMenuOpen(false);
                  onOpenGuide();
                }}
                className="p-2 rounded-xl bg-slate-800/90 hover:bg-slate-700 border border-slate-700 text-left flex items-center gap-1.5 font-bold text-slate-200 cursor-pointer whitespace-nowrap"
              >
                <BookOpen className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                <span>ルール説明</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  onToggleMute();
                }}
                className="p-2 rounded-xl bg-slate-800/90 hover:bg-slate-700 border border-slate-700 text-left flex items-center gap-1.5 font-bold text-slate-200 cursor-pointer whitespace-nowrap"
              >
                {isMuted ? (
                  <>
                    <VolumeX className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                    <span>音: OFF</span>
                  </>
                ) : (
                  <>
                    <Volume2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>音: ON</span>
                  </>
                )}
              </button>
            </div>

            {/* Section 3: Battle Actions & System */}
            <div className="pt-2 border-t border-slate-800 flex flex-col gap-1.5">
              <div className="grid grid-cols-2 gap-1.5">
                <button
                  type="button"
                  onClick={() => {
                    sound.playClick();
                    setIsMenuOpen(false);
                    onReset();
                  }}
                  className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-bold flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
                  <span>最初からやり直す</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    sound.playClick();
                    setIsMenuOpen(false);
                    onReturnTitle();
                  }}
                  className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-bold flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap"
                >
                  <Home className="w-3.5 h-3.5 text-indigo-400" />
                  <span>タイトルへ戻る</span>
                </button>
              </div>

              <div className="grid grid-cols-2 gap-1.5">
                <button
                  type="button"
                  onClick={() => {
                    sound.playClick();
                    setIsMenuOpen(false);
                    onResetAllProgress();
                  }}
                  className="p-2 rounded-xl bg-rose-950/60 hover:bg-rose-900/70 border border-rose-800/60 text-rose-200 font-bold flex items-center justify-center gap-1 cursor-pointer whitespace-nowrap"
                >
                  <Trash2 className="w-3.5 h-3.5 text-rose-400" />
                  <span>Lv.1・復習0に初期化</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    sound.playClick();
                    setIsMenuOpen(false);
                    onOpenAdmin();
                  }}
                  className="p-2 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-slate-200 font-bold flex items-center justify-center gap-1 cursor-pointer whitespace-nowrap"
                >
                  <Settings className="w-3.5 h-3.5" />
                  <span>管理者ツール</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
