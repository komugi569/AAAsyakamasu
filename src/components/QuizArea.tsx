import React, { useState, useEffect, useRef, useMemo } from 'react';
import { ShuffledQuizQuestion, Genre, QuizFormatMode, BattleSkillsState, SkillId } from '../types/game';
import { GENRE_METADATA } from '../data/quizData';
import {
  CheckCircle2,
  XCircle,
  Clock,
  Lightbulb,
  ArrowRight,
  Zap,
  Award,
  Keyboard,
  ListChecks,
  HelpCircle,
  Send,
  SkipForward,
  Eye,
  Skull
} from 'lucide-react';
import { sound } from '../utils/sound';
import { formatQuestionPromptForMode, getQuestionHintInfo, isShortAnswerSuitable } from '../utils/answerMatcher';

interface QuizAreaProps {
  question: ShuffledQuizQuestion;
  genre: Genre;
  quizFormatMode: QuizFormatMode;
  onToggleFormatMode: (mode: QuizFormatMode) => void;
  timeLeft: number;
  maxTime: number;
  criticalWindowSeconds: number;
  selectedOptionIndex: number | null;
  userTextAnswer: string;
  matchedAlias?: string;
  isEvaluating: boolean;
  isAnswerCorrect: boolean | null;
  isCritical: boolean;
  isGimmickBreak: boolean;
  damageDealt: number;
  damageTaken: number;
  skillsState: BattleSkillsState;
  onUseSkill: (skillId: SkillId) => void;
  onSelectOption: (index: number) => void;
  onSubmitShortAnswer: (text: string) => void;
  onNextTurn: () => void;
  autoAdvanceSeconds: number | null;
}

export const QuizArea: React.FC<QuizAreaProps> = ({
  question,
  genre,
  quizFormatMode,
  onToggleFormatMode,
  timeLeft,
  maxTime,
  criticalWindowSeconds,
  selectedOptionIndex,
  userTextAnswer,
  matchedAlias,
  isEvaluating,
  isAnswerCorrect,
  isCritical,
  isGimmickBreak,
  damageDealt,
  damageTaken,
  skillsState,
  onUseSkill,
  onSelectOption,
  onSubmitShortAnswer,
  onNextTurn,
  autoAdvanceSeconds
}) => {
  const [inputText, setInputText] = useState<string>('');
  const [showFirstCharHint, setShowFirstCharHint] = useState<boolean>(false);
  const isComposingRef = useRef<boolean>(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const genreMeta = GENRE_METADATA[genre];
  const timePercent = Math.max(0, Math.min(100, (timeLeft / maxTime) * 100));

  const suitableForShort = useMemo(() => isShortAnswerSuitable(question), [question]);
  // If 『二択の慧眼』 (binaryEye) is activated, show 2-choice options even if in short_answer mode!
  const effectiveMode: QuizFormatMode =
    skillsState.activeThisTurn.binaryEye
      ? 'multiple_choice'
      : quizFormatMode === 'short_answer' && suitableForShort
      ? 'short_answer'
      : 'multiple_choice';

  const hintInfo = useMemo(() => getQuestionHintInfo(question), [question]);

  const displayedQuestionText = useMemo(
    () =>
      formatQuestionPromptForMode(
        question.question,
        effectiveMode,
        hintInfo.isAlphabetQuestion,
        hintInfo.availableLetters
      ),
    [question.question, effectiveMode, hintInfo.isAlphabetQuestion, hintInfo.availableLetters]
  );

  // Reset input & hint when question changes
  useEffect(() => {
    setInputText('');
    setShowFirstCharHint(false);
    isComposingRef.current = false;
    if (effectiveMode === 'short_answer') {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 30);
    }
  }, [question.id, effectiveMode]);

  // Keyboard shortcut listener for 4-choice options (1, 2, 3, 4) and Next Turn (Enter / Space)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isEvaluating) {
        if (e.key === 'Enter' || e.key === ' ') {
          if (isComposingRef.current || e.isComposing) return;
          e.preventDefault();
          sound.playClick();
          onNextTurn();
        }
        return;
      }

      if (effectiveMode === 'multiple_choice') {
        if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
          return;
        }
        const key = e.key;
        if (['1', '2', '3', '4'].includes(key)) {
          const idx = parseInt(key, 10) - 1;
          if (
            idx >= 0 &&
            idx < question.options.length &&
            !skillsState.eliminatedOptionIndices.includes(idx)
          ) {
            sound.playClick();
            onSelectOption(idx);
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isEvaluating, effectiveMode, onSelectOption, onNextTurn, question.options.length, skillsState.eliminatedOptionIndices]);

  const handleShortAnswerKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      if (e.nativeEvent.isComposing || isComposingRef.current) {
        return;
      }
      e.preventDefault();
      if (!isEvaluating && inputText.trim().length > 0) {
        sound.playClick();
        onSubmitShortAnswer(inputText);
      }
    }
  };

  return (
    <section
      aria-label="クイズ・戦闘展開エリア"
      className="w-full max-w-4xl mx-auto px-3 my-auto flex flex-col justify-center shrink-0"
    >
      <div className="bg-slate-900/95 border border-indigo-500/30 rounded-2xl p-3 sm:p-4 shadow-2xl backdrop-blur-md relative overflow-hidden">
        {/* Header / Genre, Unit, Mode Switch & Timer */}
        <div className="flex items-center justify-between gap-2 mb-1.5 sm:mb-2 flex-wrap">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold border ${genreMeta.bgClass} shadow-sm`}>
              <span>{genreMeta.icon}</span>
              <span>{genre}</span>
            </span>

            {question.unit && (
              <span className="text-[11px] font-medium text-slate-300 bg-slate-800/90 border border-slate-700 px-2 py-0.5 rounded-md truncate max-w-[180px] sm:max-w-xs">
                {question.unit}
              </span>
            )}

            {skillsState.activeThisTurn.lastStand && (
              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-rose-200 bg-rose-950/90 border border-rose-500 px-2 py-0.5 rounded-full">
                <Skull className="w-3 h-3 text-rose-400" />
                背水の陣(2倍)
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 ml-auto">
            {/* Mode Switcher (短答式 / 4択) */}
            <div className="inline-flex items-center bg-slate-950 p-0.5 rounded-lg border border-slate-800 text-[10px] sm:text-[11px]">
              <button
                type="button"
                onClick={() => {
                  sound.playClick();
                  onToggleFormatMode('short_answer');
                }}
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded font-bold transition-colors cursor-pointer whitespace-nowrap ${
                  quizFormatMode === 'short_answer'
                    ? 'bg-amber-500 text-slate-950'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Keyboard className="w-3 h-3" />
                <span>短答式</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  sound.playClick();
                  onToggleFormatMode('multiple_choice');
                }}
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded font-bold transition-colors cursor-pointer whitespace-nowrap ${
                  quizFormatMode === 'multiple_choice'
                    ? 'bg-indigo-600 text-white'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <ListChecks className="w-3 h-3" />
                <span>4択</span>
              </button>
            </div>

            {/* Timer Display */}
            <div className="flex items-center gap-1">
              <Clock className={`w-3.5 h-3.5 ${
                skillsState.activeThisTurn.timeStop
                  ? 'text-cyan-400'
                  : timeLeft <= 5
                  ? 'text-rose-400 animate-spin'
                  : 'text-slate-400'
              }`} />
              <span className={`font-mono tabular-nums font-bold text-xs sm:text-sm ${
                skillsState.activeThisTurn.timeStop
                  ? 'text-cyan-300 font-black'
                  : timeLeft <= 5
                  ? 'text-rose-400 font-extrabold animate-pulse'
                  : 'text-slate-200'
              }`}>
                {skillsState.activeThisTurn.timeStop ? 'STOP' : `${timeLeft.toFixed(1)}s`}
              </span>
            </div>
          </div>
        </div>

        {/* Timer Bar */}
        <div className="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800 mb-2">
          <div
            className={`h-full transition-all duration-100 ease-linear rounded-full ${
              skillsState.activeThisTurn.timeStop
                ? 'bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.8)]'
                : timeLeft <= 5
                ? 'bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.8)]'
                : timeLeft <= maxTime * 0.45
                ? 'bg-amber-400'
                : 'bg-gradient-to-r from-emerald-400 to-sky-400'
            }`}
            style={{ width: `${timePercent}%` }}
          />
        </div>

        {/* In-Quiz Tactical Skills Bar (when answering) */}
        {!isEvaluating && (
          <div className="grid grid-cols-3 gap-1.5 mb-2.5">
            <button
              type="button"
              data-testid="quiz-skill-binary_eye"
              disabled={skillsState.activeThisTurn.binaryEye || skillsState.usesRemaining.binary_eye <= 0}
              onClick={() => {
                sound.playClick();
                onUseSkill('binary_eye');
              }}
              className={`py-1 px-2 rounded-lg border text-[11px] font-bold flex items-center justify-between gap-1 transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${
                skillsState.activeThisTurn.binaryEye
                  ? 'bg-cyan-500/25 border-cyan-400 text-cyan-200'
                  : 'bg-slate-950/90 hover:bg-cyan-950/60 border-cyan-500/50 text-cyan-300'
              }`}
              title="誤答選択肢を2つ消去して2択にします（短答式でも2択ボタンが出現します）"
            >
              <span className="inline-flex items-center gap-1 truncate">
                <Eye className="w-3 h-3 shrink-0" />
                <span className="truncate">二択の慧眼</span>
              </span>
              <span className="text-[10px] font-mono bg-slate-900 px-1 rounded shrink-0">
                {skillsState.activeThisTurn.binaryEye ? '発動' : `残${skillsState.usesRemaining.binary_eye}`}
              </span>
            </button>

            <button
              type="button"
              data-testid="quiz-skill-time_stop"
              disabled={skillsState.activeThisTurn.timeStop || skillsState.usesRemaining.time_stop <= 0}
              onClick={() => {
                sound.playClick();
                onUseSkill('time_stop');
              }}
              className={`py-1 px-2 rounded-lg border text-[11px] font-bold flex items-center justify-between gap-1 transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${
                skillsState.activeThisTurn.timeStop
                  ? 'bg-indigo-500/25 border-indigo-400 text-indigo-200'
                  : 'bg-slate-950/90 hover:bg-indigo-950/60 border-indigo-400/50 text-indigo-300'
              }`}
              title="このターンの制限時間タイマーを停止します"
            >
              <span className="inline-flex items-center gap-1 truncate">
                <Clock className="w-3 h-3 shrink-0" />
                <span className="truncate">時止めの一閃</span>
              </span>
              <span className="text-[10px] font-mono bg-slate-900 px-1 rounded shrink-0">
                {skillsState.activeThisTurn.timeStop ? '停止中' : `残${skillsState.usesRemaining.time_stop}`}
              </span>
            </button>

            <button
              type="button"
              data-testid="quiz-skill-last_stand"
              disabled={skillsState.activeThisTurn.lastStand || skillsState.usesRemaining.last_stand <= 0}
              onClick={() => {
                sound.playClick();
                onUseSkill('last_stand');
              }}
              className={`py-1 px-2 rounded-lg border text-[11px] font-bold flex items-center justify-between gap-1 transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${
                skillsState.activeThisTurn.lastStand
                  ? 'bg-rose-500/25 border-rose-400 text-rose-200'
                  : 'bg-slate-950/90 hover:bg-rose-950/60 border-rose-500/50 text-rose-300'
              }`}
              title="この問題の与ダメージが2倍になります（不正解時は被ダメージ2倍）"
            >
              <span className="inline-flex items-center gap-1 truncate">
                <Skull className="w-3 h-3 shrink-0" />
                <span className="truncate">背水の陣</span>
              </span>
              <span className="text-[10px] font-mono bg-slate-900 px-1 rounded shrink-0">
                {skillsState.activeThisTurn.lastStand ? '2倍中' : `残${skillsState.usesRemaining.last_stand}`}
              </span>
            </button>
          </div>
        )}

        {/* Question Text */}
        <div className="mb-2.5">
          <h3 className="text-xs sm:text-sm md:text-base font-bold text-slate-100 leading-snug tracking-wide">
            {displayedQuestionText}
          </h3>
        </div>

        {/* --- SHORT-ANSWER (短答式) MODE UI --- */}
        {effectiveMode === 'short_answer' ? (
          <div className="space-y-2">
            {/* Hint / Format Bar */}
            <div className="flex items-center justify-between gap-2 flex-wrap bg-slate-950/90 border border-amber-500/30 rounded-xl px-3 py-1.5 text-xs shadow-inner">
              <div className="flex items-center gap-2 flex-wrap">
                {hintInfo.isAlphabetQuestion ? (
                  <>
                    <span className="font-mono tabular-nums font-black text-cyan-200 bg-cyan-950/90 border border-cyan-400 px-2.5 py-0.5 rounded-lg text-xs">
                      記号回答：【 {hintInfo.availableLetters.join(' / ')} 】
                    </span>
                    <span className="text-slate-200 text-[11px] font-medium">
                      {hintInfo.availableLetters.join('・')} の1文字（または語句）を入力
                    </span>
                  </>
                ) : hintInfo.isHardDescriptive ? (
                  <>
                    <span className="text-[11px] font-bold text-amber-300 bg-amber-950/80 border border-amber-500/40 px-2 py-0.5 rounded">
                      記述穴埋め
                    </span>
                    <div className="inline-flex items-center gap-1 text-xs sm:text-sm font-black tracking-wider text-slate-100 bg-slate-900/90 border border-slate-700 px-2.5 py-0.5 rounded-lg">
                      {hintInfo.visiblePrefix && (
                        <span className="text-slate-200">{hintInfo.visiblePrefix}</span>
                      )}
                      <span className="px-2 py-0.5 rounded bg-amber-500/20 border-2 border-amber-400 text-amber-300 font-mono">
                        {showFirstCharHint
                          ? `${Array.from(hintInfo.blankTarget)[0] || ''}${'〇'.repeat(
                              Math.max(0, hintInfo.blankLength - 1)
                            )}`
                          : '〇'.repeat(Math.max(1, hintInfo.blankLength))}
                      </span>
                      {hintInfo.visibleSuffix && (
                        <span className="text-slate-200">{hintInfo.visibleSuffix}</span>
                      )}
                    </div>
                    <span className="text-slate-300 text-[11px]">
                      空欄（{hintInfo.blankLength}文字）のみ・語句全体いずれも◯
                    </span>
                  </>
                ) : (
                  <>
                    <span className="font-mono tabular-nums font-bold text-indigo-200 bg-indigo-950/80 border border-indigo-500/40 px-2 py-0.5 rounded">
                      目安: {hintInfo.primaryLength}文字
                    </span>
                    <span className="text-slate-300 text-[11px]">
                      （別名・数字変換・表記ゆれOK）
                    </span>
                  </>
                )}
              </div>

              {!isEvaluating && (
                <button
                  type="button"
                  onClick={() => {
                    sound.playClick();
                    setShowFirstCharHint(true);
                  }}
                  disabled={showFirstCharHint}
                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[11px] font-bold transition-colors cursor-pointer whitespace-nowrap ${
                    showFirstCharHint
                      ? 'bg-amber-950/80 border border-amber-500/50 text-amber-200 cursor-default'
                      : 'bg-slate-800 hover:bg-slate-700 border border-slate-700 text-amber-300'
                  }`}
                >
                  <HelpCircle className="w-3 h-3 text-amber-400" />
                  <span>
                    {showFirstCharHint
                      ? hintInfo.isAlphabetQuestion
                        ? `ヒント: ${hintInfo.firstCharHint}`
                        : hintInfo.isHardDescriptive
                        ? `空欄の頭文字を表示中`
                        : `ヒント: 「${hintInfo.firstCharHint}」から始まる`
                      : '頭文字ヒント'}
                  </span>
                </button>
              )}
            </div>

            {/* Text Input & Submit Row */}
            {!isEvaluating ? (
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                <div className="relative flex-1">
                  <input
                    ref={inputRef}
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onCompositionStart={() => {
                      isComposingRef.current = true;
                    }}
                    onCompositionEnd={() => {
                      isComposingRef.current = false;
                    }}
                    onKeyDown={handleShortAnswerKeyDown}
                    placeholder={
                      hintInfo.isAlphabetQuestion
                        ? `${hintInfo.availableLetters.join(' / ')} を入力（または語句を入力）...`
                        : hintInfo.isHardDescriptive
                        ? `空欄の${hintInfo.blankLength}文字（または語句全体）を入力...`
                        : '答えを入力（別名・数字変換・表記ゆれOK）...'
                    }
                    aria-label="短答式の解答入力欄"
                    data-testid="short-answer-input"
                    autoComplete="off"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border-2 border-indigo-500/50 focus:border-amber-400 focus:outline-none text-slate-100 font-bold text-sm sm:text-base tracking-wide placeholder:text-slate-500 placeholder:font-normal shadow-inner"
                  />
                  {inputText.length > 0 && (
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-mono tabular-nums text-slate-400 bg-slate-900 px-1.5 py-0.5 rounded">
                      {Array.from(inputText.trim()).length}字
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    type="button"
                    data-testid="short-answer-submit"
                    onClick={() => {
                      if (inputText.trim().length > 0) {
                        sound.playClick();
                        onSubmitShortAnswer(inputText);
                      }
                    }}
                    disabled={inputText.trim().length === 0}
                    className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 disabled:from-slate-800 disabled:to-slate-800 disabled:text-slate-500 text-slate-950 font-black text-xs sm:text-sm shadow-lg shadow-amber-500/20 transition-all cursor-pointer disabled:cursor-not-allowed inline-flex items-center justify-center gap-1.5 whitespace-nowrap"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>回答して攻撃！</span>
                  </button>

                  <button
                    type="button"
                    data-testid="short-answer-pass"
                    onClick={() => {
                      sound.playClick();
                      onSubmitShortAnswer('');
                    }}
                    className="px-3 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 font-bold text-xs transition-colors cursor-pointer inline-flex items-center justify-center gap-1 whitespace-nowrap"
                    title="分からない場合にパスして正解と解説を確認します"
                  >
                    <SkipForward className="w-3.5 h-3.5" />
                    <span>答えを見る</span>
                  </button>
                </div>
              </div>
            ) : (
              /* Evaluated Short Answer Display */
              <div
                className={`px-3 py-2 rounded-xl border flex items-center justify-between gap-2 flex-wrap ${
                  isAnswerCorrect
                    ? 'bg-emerald-950/80 border-emerald-400 text-emerald-100'
                    : 'bg-rose-950/80 border-rose-500 text-rose-100'
                }`}
              >
                <div className="flex items-center gap-2 flex-wrap text-xs sm:text-sm">
                  {isAnswerCorrect ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  ) : (
                    <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                  )}
                  <span className="text-slate-300">あなたの解答:</span>
                  <span className="font-bold px-2 py-0.5 rounded bg-slate-950/70 border border-slate-700">
                    {userTextAnswer || '（パス / 時間切れ）'}
                  </span>
                  {isAnswerCorrect && matchedAlias && matchedAlias !== question.correctAnswer && (
                    <span className="text-xs text-emerald-300 font-bold">
                      ✓ 正解！（標準表記: {hintInfo.isAlphabetQuestion ? hintInfo.primaryAnswer : question.correctAnswer}）
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        ) : (
          /* --- 4-CHOICE MODE UI (or 2-Choice when 『二択の慧眼』 is active!) --- */
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 sm:gap-2">
            {question.options.map((option, idx) => {
              const isEliminated = skillsState.eliminatedOptionIndices.includes(idx);
              const isSelected = selectedOptionIndex === idx;
              const isCorrectOption = option === question.correctAnswer;

              let btnStyle =
                'bg-slate-800/90 hover:bg-slate-700/90 border-slate-700 text-slate-100 hover:border-indigo-400';

              if (isEliminated && !isEvaluating) {
                btnStyle =
                  'bg-slate-950/40 border-slate-800/40 text-slate-600 line-through opacity-35 cursor-not-allowed';
              } else if (isEvaluating) {
                if (isCorrectOption) {
                  btnStyle =
                    'bg-emerald-950/95 border-emerald-400 text-emerald-100 ring-2 ring-emerald-400/60';
                } else if (isSelected && !isCorrectOption) {
                  btnStyle =
                    'bg-rose-950/95 border-rose-500 text-rose-100 ring-2 ring-rose-500/60';
                } else {
                  btnStyle = 'bg-slate-900/40 border-slate-800/60 text-slate-500 opacity-50';
                }
              }

              return (
                <button
                  key={idx}
                  data-testid={`quiz-option-${idx}`}
                  aria-label={`選択肢 ${idx + 1}: ${option}`}
                  onClick={() => {
                    if (!isEvaluating && !isEliminated) {
                      sound.playClick();
                      onSelectOption(idx);
                    }
                  }}
                  disabled={isEvaluating || isEliminated}
                  className={`w-full py-2 px-3 rounded-xl border text-left font-medium text-xs sm:text-sm flex items-center justify-between transition-all duration-150 cursor-pointer shadow-sm disabled:cursor-default ${btnStyle}`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span
                      className={`w-5 h-5 rounded flex items-center justify-center text-xs font-mono font-bold shrink-0 ${
                        isSelected
                          ? 'bg-indigo-600 text-white'
                          : 'bg-slate-950/80 border border-slate-700 text-slate-300'
                      }`}
                    >
                      {idx + 1}
                    </span>
                    <span className="leading-snug truncate">{option}</span>
                  </div>

                  {isEvaluating && isCorrectOption && (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 ml-1" />
                  )}
                  {isEvaluating && isSelected && !isCorrectOption && (
                    <XCircle className="w-4 h-4 text-rose-400 shrink-0 ml-1" />
                  )}
                </button>
              );
            })}
          </div>
        )}

        {/* Post-Answer Feedback Banner & 1-Line Explanation Card */}
        {isEvaluating && (
          <div className="mt-2 pt-2 border-t border-slate-800/90 flex flex-col gap-1.5 animate-fadeIn">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-1.5 flex-wrap">
                {isAnswerCorrect ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-emerald-950/90 border border-emerald-400 text-emerald-300 font-bold text-xs">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    正解！ {damageDealt} ダメージ！
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-rose-950/90 border border-rose-400 text-rose-300 font-bold text-xs">
                    <XCircle className="w-3.5 h-3.5 text-rose-400" />
                    {timeLeft <= 0 ? '時間切れ！' : 'ミス！'} 反撃 -{damageTaken} HP！
                  </span>
                )}

                {isCritical && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-amber-950/80 border border-amber-400 text-amber-300 text-[11px] font-bold">
                    <Zap className="w-3 h-3 text-amber-400" />
                    即答会心！
                  </span>
                )}

                {skillsState.activeThisTurn.lastStand && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-rose-950/80 border border-rose-400 text-rose-200 text-[11px] font-bold">
                    <Skull className="w-3 h-3 text-rose-400" />
                    背水の陣2倍！
                  </span>
                )}

                {isGimmickBreak && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-yellow-950/80 border border-yellow-400 text-yellow-300 text-[11px] font-bold">
                    <Award className="w-3 h-3 text-yellow-400" />
                    結界粉砕！
                  </span>
                )}
              </div>

              <button
                onClick={() => {
                  sound.playClick();
                  onNextTurn();
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-xs shadow-md transition-all cursor-pointer"
              >
                <span>次へ [Enter]</span>
                <ArrowRight className="w-3.5 h-3.5" />
                {autoAdvanceSeconds !== null && (
                  <span className="text-[10px] font-mono bg-slate-950/25 px-1 rounded font-bold">
                    {autoAdvanceSeconds}s
                  </span>
                )}
              </button>
            </div>

            {/* Correct Answer & Accepted Aliases Banner */}
            {(!isAnswerCorrect || hintInfo.displayAliases.length > 0 || hintInfo.isAlphabetQuestion) && (
              <div className="bg-slate-950/85 border border-slate-800 rounded-lg px-2.5 py-1.5 flex items-center justify-between gap-2 flex-wrap text-xs">
                <div className="flex items-center gap-1.5">
                  <span className="text-slate-400 font-bold">正解:</span>
                  <span className="font-black text-emerald-300">
                    {hintInfo.isAlphabetQuestion ? hintInfo.primaryAnswer : question.correctAnswer}
                  </span>
                </div>
                {hintInfo.displayAliases.length > 0 && (
                  <div className="text-[11px] text-slate-300 truncate">
                    <span className="text-amber-300 font-bold mr-1">別名OK:</span>
                    <span>{hintInfo.displayAliases.join(' ／ ')}</span>
                  </div>
                )}
              </div>
            )}

            {/* 1-Line Explanation Card */}
            <div className="rounded-lg px-2.5 py-1.5 bg-slate-950/90 border border-amber-500/40 flex items-start gap-2 text-xs">
              <Lightbulb className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div className="text-slate-100 leading-snug">
                <span className="font-bold text-amber-300 mr-1">解説:</span>
                {question.explanation}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
