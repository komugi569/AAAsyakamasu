/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Genre,
  QuizFormatMode,
  DeviceLayoutMode,
  SkillId,
  BattleSkillsState,
  ShuffledQuizQuestion,
  BossGimmick,
  BattleLogEntry,
  FloatingDamage,
  GamePhase,
  GameStats,
  StageInfo,
  PlayerProfile,
  MissedQuestionRecord,
  QuizQuestion,
  DungeonEnemy
} from './types/game';
import { STAGES } from './data/stages';
import { getEnemyForFloor } from './data/dungeonData';
import {
  calculatePlayerDamage,
  calculateEnemyDamage,
  determineNextGimmick,
  calculateExpGain,
  applyExpGain,
  shuffleQuestion,
  getRandomSkillName
} from './game/battle';
import { sound } from './utils/sound';
import { storage } from './utils/storage';
import { evaluateShortAnswer, isShortAnswerSuitable } from './utils/answerMatcher';

// Components
import { HeaderNav } from './components/HeaderNav';
import { TitleScreen } from './components/TitleScreen';
import { EnemyArea } from './components/EnemyArea';
import { QuizArea } from './components/QuizArea';
import { PlayerArea } from './components/PlayerArea';
import { BattleLog } from './components/BattleLog';
import { ResultModal } from './components/ResultModal';
import { GuideModal } from './components/GuideModal';
import { StageSelectModal } from './components/StageSelectModal';
import { WeaknessDungeonModal } from './components/WeaknessDungeonModal';
import { AdminQuizModal } from './components/AdminQuizModal';
import { QuestionListModal } from './components/QuestionListModal';
import { KarteModal } from './components/KarteModal';

const MULTIPLE_CHOICE_TIME_LIMIT = 15.0;
const SHORT_ANSWER_TIME_LIMIT = 30.0;
const MULTIPLE_CHOICE_CRIT_SECONDS = 5.0;
const SHORT_ANSWER_CRIT_SECONDS = 12.0;
const TOTAL_DUNGEON_FLOORS = 3;

function createInitialSkillsState(): BattleSkillsState {
  return {
    usesRemaining: {
      binary_eye: 2,
      time_stop: 2,
      last_stand: 2
    },
    activeThisTurn: {
      binaryEye: false,
      timeStop: false,
      lastStand: false
    },
    eliminatedOptionIndices: []
  };
}

function pickTwoWrongIndices(question: ShuffledQuizQuestion): number[] {
  const wrongIndices: number[] = [];
  question.options.forEach((opt, idx) => {
    if (opt !== question.correctAnswer) {
      wrongIndices.push(idx);
    }
  });
  for (let i = wrongIndices.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [wrongIndices[i], wrongIndices[j]] = [wrongIndices[j], wrongIndices[i]];
  }
  return wrongIndices.slice(0, 2);
}

export default function App() {
  // --- Persistent Storage State ---
  const [playerProfile, setPlayerProfile] = useState<PlayerProfile>(() => storage.getPlayerProfile());
  const [missedQuestions, setMissedQuestions] = useState<MissedQuestionRecord[]>(() => storage.getMissedQuestions());
  const [allQuestionsPool, setAllQuestionsPool] = useState<QuizQuestion[]>(() => storage.getAllQuestions());
  const [quizFormatMode, setQuizFormatMode] = useState<QuizFormatMode>(() => storage.getQuizFormatMode());
  const [deviceLayoutMode, setDeviceLayoutMode] = useState<DeviceLayoutMode>(() => storage.getDeviceLayoutMode());

  // --- Stage & Match Setup ---
  const [currentStage, setCurrentStage] = useState<StageInfo>(STAGES[0]);
  const [isWeaknessDungeonMode, setIsWeaknessDungeonMode] = useState<boolean>(false);
  const [weaknessQuestionPool, setWeaknessQuestionPool] = useState<QuizQuestion[]>([]);

  // --- Dungeon Floor State ---
  const [currentFloor, setCurrentFloor] = useState<number>(1);
  const [currentEnemy, setCurrentEnemy] = useState<DungeonEnemy>(() => getEnemyForFloor(1));

  // --- Battle State ---
  const [phase, setPhase] = useState<GamePhase>('title');
  const [turn, setTurn] = useState<number>(1);
  const [playerHp, setPlayerHp] = useState<number>(playerProfile.maxHp);
  const [enemyHp, setEnemyHp] = useState<number>(getEnemyForFloor(1).maxHp);
  const [activeGimmick, setActiveGimmick] = useState<BossGimmick | null>(null);
  const [skillsState, setSkillsState] = useState<BattleSkillsState>(() => createInitialSkillsState());

  // Turn Action State
  const [selectedGenre, setSelectedGenre] = useState<Genre | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState<ShuffledQuizQuestion | null>(null);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [userTextAnswer, setUserTextAnswer] = useState<string>('');
  const [matchedAlias, setMatchedAlias] = useState<string | undefined>(undefined);
  const [timeLeft, setTimeLeft] = useState<number>(
    quizFormatMode === 'short_answer' ? SHORT_ANSWER_TIME_LIMIT : MULTIPLE_CHOICE_TIME_LIMIT
  );
  const [isEvaluating, setIsEvaluating] = useState<boolean>(false);
  const [isAnswerCorrect, setIsAnswerCorrect] = useState<boolean | null>(null);
  const [isCritical, setIsCritical] = useState<boolean>(false);
  const [isGimmickBreak, setIsGimmickBreak] = useState<boolean>(false);
  const [isAffinityWeakness, setIsAffinityWeakness] = useState<boolean>(false);
  const [damageDealt, setDamageDealt] = useState<number>(0);
  const [damageTaken, setDamageTaken] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);
  const [autoAdvanceCountdown, setAutoAdvanceCountdown] = useState<number | null>(null);

  // Visual FX State
  const [isEnemyHit, setIsEnemyHit] = useState<boolean>(false);
  const [isPlayerHit, setIsPlayerHit] = useState<boolean>(false);
  const [isPlayerAttacking, setIsPlayerAttacking] = useState<boolean>(false);
  const [slashType, setSlashType] = useState<'normal' | 'critical' | 'break' | null>(null);
  const [screenFlash, setScreenFlash] = useState<'critical' | 'playerHit' | null>(null);
  const [floatingDamages, setFloatingDamages] = useState<FloatingDamage[]>([]);

  // Post Battle Progression
  const [expGained, setExpGained] = useState<number>(0);
  const [didLevelUp, setDidLevelUp] = useState<boolean>(false);

  // Logs & Stats
  const [logs, setLogs] = useState<BattleLogEntry[]>([]);
  const [stats, setStats] = useState<GameStats>({
    turns: 1,
    totalQuestions: 0,
    correctCount: 0,
    criticalCount: 0,
    affinityHits: 0,
    gimmickBreaks: 0,
    genreBreakdown: {
      "地理": { asked: 0, correct: 0 },
      "日本史": { asked: 0, correct: 0 },
      "公民": { asked: 0, correct: 0 }
    }
  });

  const [reviewList, setReviewList] = useState<Array<{
    question: ShuffledQuizQuestion;
    isCorrect: boolean;
    userAnswer: string;
  }>>([]);

  // Modals
  const [isGuideOpen, setIsGuideOpen] = useState<boolean>(false);
  const [isStageSelectOpen, setIsStageSelectOpen] = useState<boolean>(false);
  const [isWeaknessModalOpen, setIsWeaknessModalOpen] = useState<boolean>(false);
  const [isQuestionListOpen, setIsQuestionListOpen] = useState<boolean>(false);
  const [isKarteOpen, setIsKarteOpen] = useState<boolean>(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(sound.getMuted());

  // Used questions tracker
  const usedQuestionIdsRef = useRef<Set<number>>(new Set());
  const initialWeaknessPoolRef = useRef<QuizQuestion[]>([]);
  const timerIntervalRef = useRef<number | null>(null);
  const autoAdvanceIntervalRef = useRef<number | null>(null);

  const activeQuizTimeLimit =
    quizFormatMode === 'short_answer' ? SHORT_ANSWER_TIME_LIMIT : MULTIPLE_CHOICE_TIME_LIMIT;
  const activeCritSeconds =
    quizFormatMode === 'short_answer' ? SHORT_ANSWER_CRIT_SECONDS : MULTIPLE_CHOICE_CRIT_SECONDS;

  const handleChangeQuizFormatMode = useCallback((nextMode: QuizFormatMode) => {
    setQuizFormatMode(nextMode);
    storage.saveQuizFormatMode(nextMode);
    if (phase === 'quiz' && !isEvaluating) {
      setTimeLeft(nextMode === 'short_answer' ? SHORT_ANSWER_TIME_LIMIT : MULTIPLE_CHOICE_TIME_LIMIT);
    }
  }, [phase, isEvaluating]);

  const handleChangeDeviceLayoutMode = useCallback((nextLayout: DeviceLayoutMode) => {
    setDeviceLayoutMode(nextLayout);
    storage.saveDeviceLayoutMode(nextLayout);
  }, []);

  const handleResetAllProgress = useCallback(() => {
    const { profile, missed } = storage.resetAllProgress();
    setPlayerProfile(profile);
    setMissedQuestions(missed);
    setPlayerHp(profile.maxHp);
  }, []);

  // Compute available genres dynamically based on stage or remaining weakness questions
  const allThreeGenres: Genre[] = ["地理", "日本史", "公民"];
  const activeWeaknessList = weaknessQuestionPool.length > 0 ? weaknessQuestionPool : initialWeaknessPoolRef.current;

  const availableGenres: Genre[] = isWeaknessDungeonMode
    ? allThreeGenres.filter(g => activeWeaknessList.some(q => q.genre === g))
    : currentStage.genre === "ALL"
    ? allThreeGenres
    : [currentStage.genre];

  const weaknessGenreCounts: Partial<Record<Genre, number>> | undefined = isWeaknessDungeonMode
    ? {
        "地理": weaknessQuestionPool.filter(q => q.genre === "地理").length,
        "日本史": weaknessQuestionPool.filter(q => q.genre === "日本史").length,
        "公民": weaknessQuestionPool.filter(q => q.genre === "公民").length
      }
    : undefined;

  // Check URL param ?autostart=1
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('autostart') === '1') {
        startDungeonBattle(STAGES[0], false);
      }
    }
  }, []);

  const handleToggleMute = () => {
    const nextMuted = sound.toggleMute();
    setIsMuted(nextMuted);
  };

  const addFloatingDamage = (damage: FloatingDamage) => {
    setFloatingDamages(prev => [...prev, damage]);
    setTimeout(() => {
      setFloatingDamages(prev => prev.filter(d => d.id !== damage.id));
    }, 1100);
  };

  // Activate one of the 3 Tactical Skills: 『二択の慧眼』, 『時止めの一閃』, 『背水の陣』
  const handleUseSkill = useCallback((skillId: SkillId) => {
    setSkillsState(prev => {
      if (prev.usesRemaining[skillId] <= 0) return prev;
      if (skillId === 'binary_eye' && prev.activeThisTurn.binaryEye) return prev;
      if (skillId === 'time_stop' && prev.activeThisTurn.timeStop) return prev;
      if (skillId === 'last_stand' && prev.activeThisTurn.lastStand) return prev;

      const nextUses = {
        ...prev.usesRemaining,
        [skillId]: prev.usesRemaining[skillId] - 1
      };

      const nextActive = { ...prev.activeThisTurn };
      let nextEliminated = prev.eliminatedOptionIndices;

      if (skillId === 'binary_eye') {
        nextActive.binaryEye = true;
        if (currentQuestion) {
          nextEliminated = pickTwoWrongIndices(currentQuestion);
        }
      } else if (skillId === 'time_stop') {
        nextActive.timeStop = true;
        if (timerIntervalRef.current) {
          clearInterval(timerIntervalRef.current);
          timerIntervalRef.current = null;
        }
      } else if (skillId === 'last_stand') {
        nextActive.lastStand = true;
      }

      return {
        usesRemaining: nextUses,
        activeThisTurn: nextActive,
        eliminatedOptionIndices: nextEliminated
      };
    });

    const skillLogMessages: Record<SkillId, string> = {
      binary_eye: '👁️ スキル『二択の慧眼』発動！誤答選択肢を2つ消去して2択にした！',
      time_stop: '⏱️ スキル『時止めの一閃』発動！このターンの制限時間タイマーを停止した！',
      last_stand: '🔥 スキル『背水の陣』発動！この問題の与ダメージ2倍（不正解時は被ダメージ2倍）！'
    };

    setLogs(prev => [
      ...prev,
      {
        id: `skill-${Date.now()}-${skillId}`,
        turn,
        floor: currentFloor,
        actor: 'player',
        message: skillLogMessages[skillId],
        timestamp: Date.now()
      }
    ]);
  }, [currentQuestion, turn, currentFloor]);

  // Start Dungeon Battle (Floor 1)
  const startDungeonBattle = useCallback((stage: StageInfo, isWeaknessMode: boolean, customQuestions?: QuizQuestion[]) => {
    usedQuestionIdsRef.current.clear();
    setCurrentStage(stage);
    setIsWeaknessDungeonMode(isWeaknessMode);

    let initialEnemy: DungeonEnemy;
    if (isWeaknessMode) {
      const rawPool = (customQuestions && customQuestions.length > 0)
        ? customQuestions
        : storage.getMissedAsQuizQuestions().length > 0
        ? storage.getMissedAsQuizQuestions()
        : initialWeaknessPoolRef.current;

      const seenIds = new Set<number>();
      const pool: QuizQuestion[] = [];
      for (const q of rawPool) {
        if (!seenIds.has(q.id)) {
          seenIds.add(q.id);
          pool.push(q);
        }
      }

      initialWeaknessPoolRef.current = pool;
      setWeaknessQuestionPool(pool);
      const questionCount = Math.max(1, pool.length);
      const targetHp = questionCount * 100;

      initialEnemy = {
        id: "enemy-weakness-boss",
        name: "忘却の幻影王（弱点克服特訓）",
        title: `復習ターゲット：全${questionCount}問`,
        floor: 1,
        maxHp: targetHp,
        affinity: "NONE",
        weakGenre: pool[0]?.genre || "日本史",
        affinityName: `【弱点克服試練：残り${questionCount}問】`,
        avatarType: "archmage_boss"
      };
    } else {
      setWeaknessQuestionPool([]);
      initialEnemy = getEnemyForFloor(1, Boolean(stage.isEndless), stage);
    }

    setCurrentFloor(1);
    setCurrentEnemy(initialEnemy);

    setPhase('command');
    setTurn(1);
    setPlayerHp(playerProfile.maxHp);
    setEnemyHp(initialEnemy.maxHp);
    setActiveGimmick(null);
    setSkillsState(createInitialSkillsState());
    setSelectedGenre(null);
    setCurrentQuestion(null);
    setSelectedOption(null);
    setUserTextAnswer('');
    setMatchedAlias(undefined);
    setIsEvaluating(false);
    setIsAnswerCorrect(null);
    setIsCritical(false);
    setIsGimmickBreak(false);
    setIsAffinityWeakness(false);
    setDamageDealt(0);
    setDamageTaken(0);
    setStreak(0);
    setAutoAdvanceCountdown(null);
    setFloatingDamages([]);
    setReviewList([]);
    setExpGained(0);
    setDidLevelUp(false);
    setLogs([
      {
        id: 'init-1',
        turn: 0,
        floor: 1,
        actor: 'system',
        message: isWeaknessMode
          ? `【弱点克服試練】${initialEnemy.name}が出現！間違えた問題を正解して克服せよ！`
          : `【1F】${initialEnemy.name}が現れた！ ${initialEnemy.affinityName}`,
        timestamp: Date.now()
      }
    ]);
    setStats({
      turns: 1,
      totalQuestions: 0,
      correctCount: 0,
      criticalCount: 0,
      affinityHits: 0,
      gimmickBreaks: 0,
      genreBreakdown: {
        "地理": { asked: 0, correct: 0 },
        "日本史": { asked: 0, correct: 0 },
        "公民": { asked: 0, correct: 0 }
      }
    });

    setIsStageSelectOpen(false);
    setIsWeaknessModalOpen(false);
  }, [playerProfile.maxHp]);

  // When player selects genre to attack
  const handleSelectGenre = (genre: Genre) => {
    setSelectedGenre(genre);

    let candidateQuestions: QuizQuestion[] = [];

    if (isWeaknessDungeonMode) {
      const sourcePool = weaknessQuestionPool.length > 0 ? weaknessQuestionPool : initialWeaknessPoolRef.current;
      candidateQuestions = sourcePool.filter(q => q.genre === genre);
      if (candidateQuestions.length === 0) {
        candidateQuestions = sourcePool;
      }
      if (candidateQuestions.length === 0) {
        completeBattle(true);
        return;
      }
    } else {
      const targetGenre = currentStage.genre !== "ALL" ? currentStage.genre : genre;
      let genreFiltered = allQuestionsPool.filter(q => q.genre === targetGenre);

      if (quizFormatMode === 'short_answer') {
        const shortSuitable = genreFiltered.filter(q => isShortAnswerSuitable(q));
        if (shortSuitable.length > 0) {
          genreFiltered = shortSuitable;
        }
      }

      if (currentStage.id === "stage-japan-all") {
        const regional = genreFiltered.filter(q =>
          /北海道|東北|関東|中部|近畿|中国|四国|九州|県|工業|農業|水産業|美林/.test(q.unit + q.question)
        );
        if (regional.length >= 15) genreFiltered = regional;
      } else if (currentStage.id === "stage-modern") {
        const modern = genreFiltered.filter(q =>
          /明治|大正|昭和|平成|令和|幕末|開国|条約|戦争|内閣|憲法/.test(q.unit + q.question)
        );
        if (modern.length >= 15) genreFiltered = modern;
      } else if (currentStage.id === "stage-economy") {
        const econ = genreFiltered.filter(q =>
          /経済|市場|銀行|税|財政|円高|円安|国際|国連|環境|SDGs|貿易|労働/.test(q.unit + q.question)
        );
        if (econ.length >= 15) genreFiltered = econ;
      }

      candidateQuestions = genreFiltered.length > 0 ? genreFiltered : allQuestionsPool.filter(q => q.genre === genre);
    }

    let available = candidateQuestions.filter(q => !usedQuestionIdsRef.current.has(q.id));
    if (available.length === 0) {
      candidateQuestions.forEach(q => usedQuestionIdsRef.current.delete(q.id));
      available = candidateQuestions;
    }

    const pickedRaw = available[Math.floor(Math.random() * available.length)];
    usedQuestionIdsRef.current.add(pickedRaw.id);

    const shuffled = shuffleQuestion(pickedRaw);
    setCurrentQuestion(shuffled);

    // If 『二択の慧眼』 was pre-activated in Command Phase, compute eliminated options now
    if (skillsState.activeThisTurn.binaryEye) {
      setSkillsState(prev => ({
        ...prev,
        eliminatedOptionIndices: pickTwoWrongIndices(shuffled)
      }));
    }

    setSelectedOption(null);
    setUserTextAnswer('');
    setMatchedAlias(undefined);
    setTimeLeft(activeQuizTimeLimit);
    setIsEvaluating(false);
    setIsAnswerCorrect(null);
    setIsCritical(false);
    setIsGimmickBreak(false);
    setIsAffinityWeakness(false);
    setDamageDealt(0);
    setDamageTaken(0);
    setPhase('quiz');
  };

  // Shared outcome evaluation for both 4-choice and short-answer
  const finalizeTurnEvaluation = useCallback((
    isCorrect: boolean,
    displayAnswerText: string,
    isTimeout: boolean,
    aliasMatched?: string
  ) => {
    if (!currentQuestion || !selectedGenre) return;

    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }

    setIsEvaluating(true);
    setIsAnswerCorrect(isCorrect);
    setMatchedAlias(aliasMatched);

    // If 『時止めの一閃』 is active, treat answer time as instant (0.5s)
    const answeredSecondsTaken = skillsState.activeThisTurn.timeStop
      ? 0.5
      : Math.max(0.1, activeQuizTimeLimit - timeLeft);

    setReviewList(prev => [
      ...prev,
      {
        question: currentQuestion,
        isCorrect,
        userAnswer: displayAnswerText
      }
    ]);

    let nextWeaknessPool = weaknessQuestionPool;
    if (!isCorrect) {
      const canonical = allQuestionsPool.find(q => q.id === currentQuestion.id);
      storage.recordMissedQuestion(
        canonical || {
          id: currentQuestion.id,
          genre: currentQuestion.genre,
          unit: currentQuestion.unit,
          question: currentQuestion.question,
          options: currentQuestion.options,
          answerIndex: currentQuestion.originalAnswerIndex,
          explanation: currentQuestion.explanation
        }
      );
      setMissedQuestions(storage.getMissedQuestions());
    } else if (isWeaknessDungeonMode) {
      storage.removeMissedQuestion(currentQuestion.id);
      setMissedQuestions(storage.getMissedQuestions());
      nextWeaknessPool = weaknessQuestionPool.filter(q => q.id !== currentQuestion.id);
      setWeaknessQuestionPool(nextWeaknessPool);

      if (nextWeaknessPool.length > 0 && !nextWeaknessPool.some(q => q.genre === currentEnemy.weakGenre)) {
        const nextGenre = nextWeaknessPool[0].genre;
        setCurrentEnemy(prev => ({
          ...prev,
          weakGenre: nextGenre,
          affinityName: `【弱点克服試練：残り${nextWeaknessPool.length}問】`
        }));
      } else if (nextWeaknessPool.length > 0) {
        setCurrentEnemy(prev => ({
          ...prev,
          affinityName: `【弱点克服試練：残り${nextWeaknessPool.length}問】`
        }));
      }
      if (activeGimmick && !nextWeaknessPool.some(q => q.genre === activeGimmick.counterGenre)) {
        setActiveGimmick(null);
      }
    }

    setStats(prev => ({
      ...prev,
      totalQuestions: prev.totalQuestions + 1,
      correctCount: isCorrect ? prev.correctCount + 1 : prev.correctCount,
      genreBreakdown: {
        ...prev.genreBreakdown,
        [selectedGenre]: {
          asked: prev.genreBreakdown[selectedGenre].asked + 1,
          correct: prev.genreBreakdown[selectedGenre].correct + (isCorrect ? 1 : 0)
        }
      }
    }));

    const lastStandMultiplier = skillsState.activeThisTurn.lastStand ? 2 : 1;

    if (isCorrect) {
      const isWeakness = activeGimmick !== null && activeGimmick.counterGenre === selectedGenre;
      const calcResult = calculatePlayerDamage({
        answerTimeSeconds: answeredSecondsTaken,
        genre: selectedGenre,
        weakGenre: currentEnemy.weakGenre,
        isGimmickWeakness: isWeakness,
        hasActiveGimmick: activeGimmick !== null,
        streak: streak + 1,
        criticalThresholdSeconds: activeCritSeconds,
        bonusAtkPercent: playerProfile.bonusAtkPercent
      });

      const baseComputedDamage = isWeaknessDungeonMode
        ? (nextWeaknessPool.length === 0 ? Math.max(100, enemyHp) : 100)
        : calcResult.damage;
      const damage = Math.round(baseComputedDamage * lastStandMultiplier);
      const critHit = calcResult.isCritical;
      const weakHit = calcResult.isAffinityWeakness;
      const brokeGimmick = calcResult.isGimmickBreak;
      const isBarrierReduced = isWeaknessDungeonMode ? false : calcResult.isBarrierReduced;

      setDamageDealt(damage);
      setIsCritical(critHit);
      setIsAffinityWeakness(weakHit);
      setIsGimmickBreak(brokeGimmick);
      setStreak(prev => prev + 1);

      if (critHit) {
        setStats(prev => ({ ...prev, criticalCount: prev.criticalCount + 1 }));
        setScreenFlash('critical');
        setTimeout(() => setScreenFlash(null), 300);
      }
      if (weakHit) {
        setStats(prev => ({ ...prev, affinityHits: prev.affinityHits + 1 }));
      }
      if (brokeGimmick) {
        setStats(prev => ({ ...prev, gimmickBreaks: prev.gimmickBreaks + 1 }));
        setActiveGimmick(null);
      }

      setIsPlayerAttacking(true);
      setSlashType(brokeGimmick ? 'break' : critHit ? 'critical' : 'normal');

      sound.playCorrect();
      setTimeout(() => {
        if (brokeGimmick) {
          sound.playBarrierBreak();
        } else if (critHit) {
          sound.playCriticalHit();
        } else {
          sound.playHit();
        }
        setIsEnemyHit(true);
        setTimeout(() => setIsEnemyHit(false), 140);
        setIsPlayerAttacking(false);

        if (isWeaknessDungeonMode) {
          setEnemyHp(nextWeaknessPool.length * 100);
        } else {
          setEnemyHp(prev => Math.max(0, prev - damage));
        }
        addFloatingDamage({
          id: `dmg-${Date.now()}`,
          target: 'enemy',
          amount: damage,
          isCritical: critHit,
          isGimmickBreak: brokeGimmick,
          isAffinityWeakness: weakHit
        });
      }, 35);

      const skillName = getRandomSkillName(selectedGenre);
      setLogs(prev => [
        ...prev,
        {
          id: `log-${Date.now()}`,
          turn,
          floor: currentFloor,
          actor: 'player',
          genre: selectedGenre,
          skillName,
          damage,
          isCritical: critHit,
          isAffinityWeakness: weakHit,
          isGimmickBreak: brokeGimmick,
          message: `探究者の【${skillName}】！ ${damage} ダメージ！${
            lastStandMultiplier > 1 ? '【背水の陣2倍！】' : ''
          }${weakHit ? '【属性弱点特効！】' : ''}${brokeGimmick ? '【結界粉砕！】' : ''}${
            isBarrierReduced ? '【敵の結界によりダメージ半減…！】' : ''
          }`,
          explanation: currentQuestion.explanation,
          timestamp: Date.now()
        }
      ]);
    } else {
      setStreak(0);
      sound.playMiss();

      const baseEnemyDmg = calculateEnemyDamage({
        turn,
        floor: currentFloor,
        hasGimmickActive: activeGimmick !== null
      });
      const enemyDmg = Math.round(baseEnemyDmg * lastStandMultiplier);

      setDamageTaken(enemyDmg);

      setTimeout(() => {
        sound.playEnemyAttack();
        setIsPlayerHit(true);
        setScreenFlash('playerHit');
        setTimeout(() => {
          setIsPlayerHit(false);
          setScreenFlash(null);
        }, 150);

        setPlayerHp(prev => Math.max(0, prev - enemyDmg));
        addFloatingDamage({
          id: `dmg-${Date.now()}`,
          target: 'player',
          amount: enemyDmg
        });
      }, 40);

      setLogs(prev => [
        ...prev,
        {
          id: `log-${Date.now()}`,
          turn,
          floor: currentFloor,
          actor: 'enemy',
          damage: enemyDmg,
          message: `${isTimeout ? '時間切れ！' : '攻撃ミス！'} ${currentEnemy.name}の反撃！ 探究者は ${enemyDmg} ダメージを受けた！${
            lastStandMultiplier > 1 ? '（背水の陣により被ダメージ2倍！）' : ''
          }`,
          explanation: currentQuestion.explanation,
          timestamp: Date.now()
        }
      ]);
    }

    setPlayerProfile(prev => {
      const g = selectedGenre;
      const prevStats = prev.genreStats || {
        "地理": { asked: 0, correct: 0 },
        "日本史": { asked: 0, correct: 0 },
        "公民": { asked: 0, correct: 0 }
      };
      const updatedStats: Record<Genre, { asked: number; correct: number }> = {
        "地理": { asked: prevStats["地理"].asked + (g === "地理" ? 1 : 0), correct: prevStats["地理"].correct + (g === "地理" && isCorrect ? 1 : 0) },
        "日本史": { asked: prevStats["日本史"].asked + (g === "日本史" ? 1 : 0), correct: prevStats["日本史"].correct + (g === "日本史" && isCorrect ? 1 : 0) },
        "公民": { asked: prevStats["公民"].asked + (g === "公民" ? 1 : 0), correct: prevStats["公民"].correct + (g === "公民" && isCorrect ? 1 : 0) }
      };
      const updated: PlayerProfile = {
        ...prev,
        totalAnswers: (prev.totalAnswers || 0) + 1,
        totalCorrect: (prev.totalCorrect || 0) + (isCorrect ? 1 : 0),
        genreStats: updatedStats
      };
      storage.savePlayerProfile(updated);
      return updated;
    });

    setAutoAdvanceCountdown(isCorrect ? 1.5 : null);
  }, [currentQuestion, selectedGenre, skillsState.activeThisTurn, activeQuizTimeLimit, activeCritSeconds, timeLeft, weaknessQuestionPool, allQuestionsPool, isWeaknessDungeonMode, currentEnemy, activeGimmick, streak, playerProfile.bonusAtkPercent, enemyHp, turn, currentFloor]);

  // Process 4-Choice Answer (or timer expiration)
  const processAnswer = useCallback((chosenOptionIndex: number | null) => {
    if (isEvaluating || !currentQuestion || !selectedGenre) return;
    setSelectedOption(chosenOptionIndex);
    const chosenAnswer = chosenOptionIndex !== null ? currentQuestion.options[chosenOptionIndex] : "時間切れ";
    if (chosenOptionIndex === null) {
      setUserTextAnswer('（時間切れ）');
    }
    const isCorrect = chosenOptionIndex !== null && chosenAnswer === currentQuestion.correctAnswer;
    finalizeTurnEvaluation(isCorrect, chosenAnswer, chosenOptionIndex === null);
  }, [isEvaluating, currentQuestion, selectedGenre, finalizeTurnEvaluation]);

  // Process Short-Answer Text Input
  const processShortAnswer = useCallback((rawText: string) => {
    if (isEvaluating || !currentQuestion || !selectedGenre) return;
    const trimmed = rawText.trim();
    setUserTextAnswer(trimmed || '（パス）');
    const evalResult = evaluateShortAnswer(trimmed, currentQuestion);
    finalizeTurnEvaluation(
      evalResult.isCorrect,
      trimmed || '（パス）',
      false,
      evalResult.matchedAlias
    );
  }, [isEvaluating, currentQuestion, selectedGenre, finalizeTurnEvaluation]);

  // Quiz Timer interval (paused when 『時止めの一閃』 timeStop is active!)
  useEffect(() => {
    if (phase !== 'quiz' || isEvaluating || skillsState.activeThisTurn.timeStop) {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
        timerIntervalRef.current = null;
      }
      return;
    }

    const interval = window.setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 0.1) {
          clearInterval(interval);
          processAnswer(null);
          return 0;
        }
        return Math.max(0, parseFloat((prev - 0.1).toFixed(1)));
      });
    }, 100);

    timerIntervalRef.current = interval;

    return () => {
      clearInterval(interval);
    };
  }, [phase, isEvaluating, skillsState.activeThisTurn.timeStop, processAnswer]);

  // Complete battle & award EXP
  const completeBattle = useCallback((isWin: boolean) => {
    if (isWin) {
      sound.playVictory();
    } else {
      sound.playGameOver();
    }

    const gained = calculateExpGain({
      isWin,
      correctCount: stats.correctCount,
      criticalCount: stats.criticalCount,
      gimmickBreaks: stats.gimmickBreaks
    });
    setExpGained(gained);

    const { profile: updatedProfile, leveledUp } = applyExpGain(playerProfile, gained);
    if (isWin) {
      updatedProfile.totalBattlesWon += 1;
    }
    if (currentStage.isEndless) {
      updatedProfile.highestEndlessFloor = Math.max(updatedProfile.highestEndlessFloor || 0, currentFloor);
    }
    setDidLevelUp(leveledUp);
    setPlayerProfile(updatedProfile);
    storage.savePlayerProfile(updatedProfile);

    if (leveledUp) {
      addFloatingDamage({
        id: `lvl-${Date.now()}`,
        target: 'player',
        amount: "LEVEL UP!"
      });
    }

    setPhase(isWin ? 'victory' : 'game_over');
  }, [stats, playerProfile, currentStage.isEndless, currentFloor]);

  // Advance to next turn or next floor in dungeon
  const handleNextTurn = useCallback(() => {
    if (autoAdvanceIntervalRef.current) {
      clearInterval(autoAdvanceIntervalRef.current);
      autoAdvanceIntervalRef.current = null;
    }
    setAutoAdvanceCountdown(null);

    // Reset per-turn active skill flags
    setSkillsState(prev => ({
      ...prev,
      activeThisTurn: {
        binaryEye: false,
        timeStop: false,
        lastStand: false
      },
      eliminatedOptionIndices: []
    }));

    if (playerHp <= 0) {
      completeBattle(false);
      return;
    }

    const stageMaxFloors = currentStage.isEndless ? 9999 : (currentStage.totalFloors || TOTAL_DUNGEON_FLOORS);

    if (enemyHp <= 0 || (isWeaknessDungeonMode && weaknessQuestionPool.length === 0)) {
      if ((currentStage.isEndless || currentFloor < stageMaxFloors) && !isWeaknessDungeonMode) {
        const nextFloorNum = currentFloor + 1;
        const nextEnemy = getEnemyForFloor(nextFloorNum, Boolean(currentStage.isEndless), currentStage);
        setCurrentFloor(nextFloorNum);
        setCurrentEnemy(nextEnemy);
        setEnemyHp(nextEnemy.maxHp);
        setActiveGimmick(null);
        sound.playFloorClear();

        if (currentStage.isEndless) {
          setPlayerHp(prev => Math.min(playerProfile.maxHp, prev + 20));
          setPlayerProfile(prev => {
            const nextBest = Math.max(prev.highestEndlessFloor || 0, nextFloorNum);
            const updated = { ...prev, highestEndlessFloor: nextBest };
            storage.savePlayerProfile(updated);
            return updated;
          });
        }

        setLogs(prev => [
          ...prev,
          {
            id: `floor-${Date.now()}`,
            turn,
            floor: nextFloorNum,
            actor: 'system',
            message: `🚪 【${nextFloorNum}Fへ進撃！】 ${nextEnemy.name}（HP:${nextEnemy.maxHp}）が現れた！（弱点: ${nextEnemy.weakGenre}）`,
            timestamp: Date.now()
          }
        ]);

        setSelectedGenre(null);
        setCurrentQuestion(null);
        setSelectedOption(null);
        setIsEvaluating(false);
        setIsAnswerCorrect(null);
        setIsCritical(false);
        setIsGimmickBreak(false);
        setIsAffinityWeakness(false);
        setDamageDealt(0);
        setDamageTaken(0);
        setPhase('command');
        return;
      } else {
        completeBattle(true);
        return;
      }
    }

    const nextTurn = turn + 1;
    setTurn(nextTurn);
    setStats(prev => ({ ...prev, turns: nextTurn }));

    const gimmickAllowedGenre: Genre | "ALL" = isWeaknessDungeonMode
      ? (weaknessQuestionPool[0]?.genre || currentStage.genre)
      : currentStage.genre;

    const candidateGimmick = determineNextGimmick(
      nextTurn,
      enemyHp,
      currentEnemy.maxHp,
      activeGimmick,
      gimmickAllowedGenre
    );

    const newGimmick =
      candidateGimmick &&
      (!isWeaknessDungeonMode || weaknessQuestionPool.some(q => q.genre === candidateGimmick.counterGenre))
        ? candidateGimmick
        : null;

    if (newGimmick) {
      setActiveGimmick(newGimmick);
      sound.playEnemyAttack();
      setLogs(prev => [
        ...prev,
        {
          id: `gimmick-${Date.now()}`,
          turn: nextTurn,
          floor: currentFloor,
          actor: 'system',
          message: `⚠️ ${currentEnemy.name}の特殊結界！【${newGimmick.name}】が発動！（他分野はダメージ半減・ミス時の反撃激増）【${newGimmick.counterGenre}】で正解して粉砕せよ！`,
          timestamp: Date.now()
        }
      ]);
    }

    setSelectedGenre(null);
    setCurrentQuestion(null);
    setSelectedOption(null);
    setIsEvaluating(false);
    setIsAnswerCorrect(null);
    setIsCritical(false);
    setIsGimmickBreak(false);
    setIsAffinityWeakness(false);
    setDamageDealt(0);
    setDamageTaken(0);
    setPhase('command');
  }, [enemyHp, playerHp, turn, activeGimmick, currentStage, completeBattle, currentFloor, currentEnemy, isWeaknessDungeonMode, weaknessQuestionPool, playerProfile.maxHp]);

  // Auto-advance timer
  useEffect(() => {
    if (autoAdvanceCountdown === null) {
      if (autoAdvanceIntervalRef.current) {
        clearInterval(autoAdvanceIntervalRef.current);
        autoAdvanceIntervalRef.current = null;
      }
      return;
    }

    if (autoAdvanceCountdown <= 0) {
      handleNextTurn();
      return;
    }

    autoAdvanceIntervalRef.current = window.setInterval(() => {
      setAutoAdvanceCountdown(prev => (prev !== null && prev > 0 ? prev - 1 : null));
    }, 1000);

    return () => {
      if (autoAdvanceIntervalRef.current) {
        clearInterval(autoAdvanceIntervalRef.current);
      }
    };
  }, [autoAdvanceCountdown, handleNextTurn]);

  // Watch for HP hitting 0
  useEffect(() => {
    if (isEvaluating) {
      if (playerHp <= 0) {
        const timer = setTimeout(() => {
          completeBattle(false);
        }, 700);
        return () => clearTimeout(timer);
      }
      const stageMaxFloors = currentStage.isEndless ? 9999 : (currentStage.totalFloors || TOTAL_DUNGEON_FLOORS);
      if (
        (enemyHp <= 0 && !currentStage.isEndless && currentFloor >= stageMaxFloors) ||
        (isWeaknessDungeonMode && weaknessQuestionPool.length === 0)
      ) {
        const timer = setTimeout(() => {
          completeBattle(true);
        }, 700);
        return () => clearTimeout(timer);
      }
    }
  }, [enemyHp, playerHp, isEvaluating, completeBattle, currentFloor, currentStage, isWeaknessDungeonMode, weaknessQuestionPool.length]);

  // Keyboard Shortcuts: [1]-[3] for visible genre selection in command phase
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isGuideOpen || isStageSelectOpen || isWeaknessModalOpen || isQuestionListOpen || isKarteOpen || isAdminModalOpen) {
        return;
      }
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement || e.target instanceof HTMLSelectElement) {
        return;
      }

      if (phase === 'command') {
        if (e.key === '1' && availableGenres.length >= 1) {
          e.preventDefault();
          handleSelectGenre(availableGenres[0]);
        } else if (e.key === '2' && availableGenres.length >= 2) {
          e.preventDefault();
          handleSelectGenre(availableGenres[1]);
        } else if (e.key === '3' && availableGenres.length >= 3) {
          e.preventDefault();
          handleSelectGenre(availableGenres[2]);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [phase, availableGenres, isGuideOpen, isStageSelectOpen, isWeaknessModalOpen, isQuestionListOpen, isKarteOpen, isAdminModalOpen]);

  // Reload questions from storage
  const handleReloadQuestions = () => {
    setAllQuestionsPool(storage.getAllQuestions());
  };

  const isQuizOrEvaluating = Boolean(currentQuestion && selectedGenre && (phase === 'quiz' || isEvaluating));
  const totalDisplayFloors = currentStage.isEndless
    ? Math.max(5, Math.ceil(currentFloor / 5) * 5)
    : (currentStage.totalFloors || TOTAL_DUNGEON_FLOORS);

  return (
    <div className="h-dvh w-full bg-fantasy-stage text-slate-100 flex flex-col justify-between font-rpg select-none overflow-hidden relative">
      {/* Screen Flash FX */}
      {screenFlash === 'critical' && (
        <div className="fixed inset-0 z-40 bg-cyan-400/20 pointer-events-none animate-flash-crit" />
      )}
      {screenFlash === 'playerHit' && (
        <div className="fixed inset-0 z-40 bg-rose-600/25 pointer-events-none animate-flash-crit" />
      )}

      {/* Title Screen View */}
      {phase === 'title' ? (
        <div className="h-dvh w-full overflow-y-auto">
          <TitleScreen
            onStart={() => startDungeonBattle(STAGES[0], false)}
            onOpenStageSelect={() => setIsStageSelectOpen(true)}
            onOpenWeaknessDungeon={() => setIsWeaknessModalOpen(true)}
            onOpenEndlessTower={() => {
              const endlessStage = STAGES.find(s => s.isEndless) || STAGES[1];
              startDungeonBattle(endlessStage, false);
            }}
            onOpenKarte={() => setIsKarteOpen(true)}
            onOpenQuestionList={() => setIsQuestionListOpen(true)}
            onOpenAdmin={() => setIsAdminModalOpen(true)}
            onOpenGuide={() => setIsGuideOpen(true)}
            missedCount={missedQuestions.length}
            playerProfile={playerProfile}
            quizFormatMode={quizFormatMode}
            onChangeQuizFormatMode={handleChangeQuizFormatMode}
            deviceLayoutMode={deviceLayoutMode}
            onChangeDeviceLayoutMode={handleChangeDeviceLayoutMode}
          />
        </div>
      ) : (
        <>
          {/* Main Battle Game View: Strictly fits in 100dvh without vertical overflow! */}
          <div className="flex flex-col h-dvh justify-between overflow-hidden">
            {/* Top Navigation with Single Consolidated Menu Button */}
            <HeaderNav
              isMuted={isMuted}
              onToggleMute={handleToggleMute}
              onReset={() =>
                startDungeonBattle(
                  currentStage,
                  isWeaknessDungeonMode,
                  isWeaknessDungeonMode
                    ? (weaknessQuestionPool.length > 0 ? weaknessQuestionPool : initialWeaknessPoolRef.current)
                    : undefined
                )
              }
              onReturnTitle={() => setPhase('title')}
              onResetAllProgress={handleResetAllProgress}
              onOpenGuide={() => setIsGuideOpen(true)}
              onOpenStageSelect={() => setIsStageSelectOpen(true)}
              onOpenWeaknessDungeon={() => setIsWeaknessModalOpen(true)}
              onOpenQuestionList={() => setIsQuestionListOpen(true)}
              onOpenKarte={() => setIsKarteOpen(true)}
              onOpenAdmin={() => setIsAdminModalOpen(true)}
              turn={turn}
              playerProfile={playerProfile}
              missedCount={missedQuestions.length}
              quizFormatMode={quizFormatMode}
              onToggleQuizFormatMode={() =>
                handleChangeQuizFormatMode(
                  quizFormatMode === 'short_answer' ? 'multiple_choice' : 'short_answer'
                )
              }
              deviceLayoutMode={deviceLayoutMode}
              onChangeDeviceLayoutMode={handleChangeDeviceLayoutMode}
            />

            {/* PC Wide 2-Column Layout vs Smartphone Single-Column Layout */}
            {deviceLayoutMode === 'pc' ? (
              <div className="flex-1 w-full max-w-6xl mx-auto px-4 py-2 grid grid-cols-12 gap-4 items-center overflow-hidden">
                {/* Left Column (5 cols): Enemy Arena + Player Status + Log */}
                <div className="col-span-5 flex flex-col justify-between h-full max-h-[calc(100dvh-56px)] py-1 overflow-hidden">
                  <div className="text-xs text-slate-700 font-bold px-2 flex items-center gap-1.5">
                    <span className={`px-2 py-0.5 rounded font-bold text-[10px] border ${currentStage.badgeColor}`}>
                      {isWeaknessDungeonMode
                        ? '特訓'
                        : currentStage.isEndless
                        ? `${currentFloor}F / ∞`
                        : `${currentFloor}F / ${currentStage.totalFloors || TOTAL_DUNGEON_FLOORS}F`}
                    </span>
                    <span className="truncate">{currentStage.title}</span>
                  </div>

                  <EnemyArea
                    enemy={currentEnemy}
                    enemyHp={enemyHp}
                    currentFloor={currentFloor}
                    totalFloors={totalDisplayFloors}
                    activeGimmick={activeGimmick}
                    isEnemyHit={isEnemyHit}
                    isPlayerAttacking={isPlayerAttacking}
                    slashType={slashType}
                    floatingDamages={floatingDamages}
                    compact={false}
                  />

                  <div className="space-y-1.5">
                    {/* Player Status Only in Left Column when in Quiz Phase */}
                    {isQuizOrEvaluating && (
                      <PlayerArea
                        playerHp={playerHp}
                        playerMaxHp={playerProfile.maxHp}
                        isPlayerHit={isPlayerHit}
                        activeGimmick={activeGimmick}
                        weakGenre={currentEnemy.weakGenre}
                        selectedGenre={selectedGenre}
                        isCommandPhase={false}
                        streak={streak}
                        floatingDamages={floatingDamages}
                        availableGenres={availableGenres}
                        genreQuestionCounts={weaknessGenreCounts}
                        skillsState={skillsState}
                        onUseSkill={handleUseSkill}
                        onSelectGenre={handleSelectGenre}
                      />
                    )}
                    <BattleLog logs={logs} />
                  </div>
                </div>

                {/* Right Column (7 cols): Quiz Area OR Command & Skills Deck */}
                <div className="col-span-7 flex flex-col justify-center h-full max-h-[calc(100dvh-56px)] overflow-y-auto py-1">
                  {isQuizOrEvaluating && currentQuestion && selectedGenre ? (
                    <QuizArea
                      question={currentQuestion}
                      genre={selectedGenre}
                      quizFormatMode={quizFormatMode}
                      onToggleFormatMode={handleChangeQuizFormatMode}
                      timeLeft={timeLeft}
                      maxTime={activeQuizTimeLimit}
                      criticalWindowSeconds={activeCritSeconds}
                      selectedOptionIndex={selectedOption}
                      userTextAnswer={userTextAnswer}
                      matchedAlias={matchedAlias}
                      isEvaluating={isEvaluating}
                      isAnswerCorrect={isAnswerCorrect}
                      isCritical={isCritical}
                      isGimmickBreak={isGimmickBreak}
                      damageDealt={damageDealt}
                      damageTaken={damageTaken}
                      skillsState={skillsState}
                      onUseSkill={handleUseSkill}
                      onSelectOption={processAnswer}
                      onSubmitShortAnswer={processShortAnswer}
                      onNextTurn={handleNextTurn}
                      autoAdvanceSeconds={autoAdvanceCountdown}
                    />
                  ) : (
                    <div className="space-y-3">
                      <div className="bg-slate-900/90 border border-indigo-500/30 rounded-2xl p-4 backdrop-blur-sm text-center shadow-xl mx-3">
                        <div className="text-amber-400 text-xs font-bold tracking-wider mb-0.5">
                          YOUR TURN ⚔️（{quizFormatMode === 'short_answer' ? '短答式・制限30秒' : '4択・制限15秒'}）
                        </div>
                        <h3 className="text-base font-bold text-slate-100 mb-0.5">
                          攻撃する分野を選択（{currentEnemy.name}戦）
                        </h3>
                        <p className="text-xs text-slate-300">
                          弱点【<strong className="text-amber-400">{currentEnemy.weakGenre}</strong>】を突くと1.35倍ダメージ！
                        </p>
                      </div>

                      <PlayerArea
                        playerHp={playerHp}
                        playerMaxHp={playerProfile.maxHp}
                        isPlayerHit={isPlayerHit}
                        activeGimmick={activeGimmick}
                        weakGenre={currentEnemy.weakGenre}
                        selectedGenre={selectedGenre}
                        isCommandPhase={true}
                        streak={streak}
                        floatingDamages={floatingDamages}
                        availableGenres={availableGenres}
                        genreQuestionCounts={weaknessGenreCounts}
                        skillsState={skillsState}
                        onUseSkill={handleUseSkill}
                        onSelectGenre={handleSelectGenre}
                      />
                    </div>
                  )}
                </div>
              </div>
            ) : (
              /* Smartphone Portrait Mode: Compact single-screen layout with zero scrolling needed */
              <div className="flex-1 w-full max-w-lg mx-auto flex flex-col justify-between overflow-hidden py-1">
                {/* Top: Enemy Area (automatically switches to compact bar when question opens!) */}
                <EnemyArea
                  enemy={currentEnemy}
                  enemyHp={enemyHp}
                  currentFloor={currentFloor}
                  totalFloors={totalDisplayFloors}
                  activeGimmick={activeGimmick}
                  isEnemyHit={isEnemyHit}
                  isPlayerAttacking={isPlayerAttacking}
                  slashType={slashType}
                  floatingDamages={floatingDamages}
                  compact={isQuizOrEvaluating}
                />

                {/* Center: Quiz Area OR Idle Command Prompt */}
                <div className="my-auto overflow-y-auto max-h-[calc(100dvh-185px)]">
                  {isQuizOrEvaluating && currentQuestion && selectedGenre ? (
                    <QuizArea
                      question={currentQuestion}
                      genre={selectedGenre}
                      quizFormatMode={quizFormatMode}
                      onToggleFormatMode={handleChangeQuizFormatMode}
                      timeLeft={timeLeft}
                      maxTime={activeQuizTimeLimit}
                      criticalWindowSeconds={activeCritSeconds}
                      selectedOptionIndex={selectedOption}
                      userTextAnswer={userTextAnswer}
                      matchedAlias={matchedAlias}
                      isEvaluating={isEvaluating}
                      isAnswerCorrect={isAnswerCorrect}
                      isCritical={isCritical}
                      isGimmickBreak={isGimmickBreak}
                      damageDealt={damageDealt}
                      damageTaken={damageTaken}
                      skillsState={skillsState}
                      onUseSkill={handleUseSkill}
                      onSelectOption={processAnswer}
                      onSubmitShortAnswer={processShortAnswer}
                      onNextTurn={handleNextTurn}
                      autoAdvanceSeconds={autoAdvanceCountdown}
                    />
                  ) : (
                    <div className="w-full px-3 py-1 text-center">
                      <div className="bg-slate-900/85 border border-indigo-500/30 rounded-xl p-2.5 backdrop-blur-sm shadow-lg">
                        <div className="text-amber-400 text-[11px] font-bold tracking-wider">
                          YOUR TURN ⚔️（{quizFormatMode === 'short_answer' ? '短答式・30秒' : '4択・15秒'}）
                        </div>
                        <h3 className="text-xs sm:text-sm font-bold text-slate-100">
                          攻撃する分野を選択（弱点: <span className="text-amber-400">{currentEnemy.weakGenre}</span> 1.35倍）
                        </h3>
                      </div>
                    </div>
                  )}
                </div>

                {/* Bottom: Player Area & Battle Log */}
                <div className="w-full flex flex-col justify-end shrink-0">
                  <PlayerArea
                    playerHp={playerHp}
                    playerMaxHp={playerProfile.maxHp}
                    isPlayerHit={isPlayerHit}
                    activeGimmick={activeGimmick}
                    weakGenre={currentEnemy.weakGenre}
                    selectedGenre={selectedGenre}
                    isCommandPhase={phase === 'command'}
                    streak={streak}
                    floatingDamages={floatingDamages}
                    availableGenres={availableGenres}
                    genreQuestionCounts={weaknessGenreCounts}
                    skillsState={skillsState}
                    onUseSkill={handleUseSkill}
                    onSelectGenre={handleSelectGenre}
                  />
                  <BattleLog logs={logs} />
                </div>
              </div>
            )}
          </div>

          {/* Victory / Game Over Modal */}
          {(phase === 'victory' || phase === 'game_over') && (
            <ResultModal
              type={phase}
              stats={stats}
              reviewList={reviewList}
              expGained={expGained}
              playerProfile={playerProfile}
              didLevelUp={didLevelUp}
              onRestart={() =>
                startDungeonBattle(
                  currentStage,
                  isWeaknessDungeonMode,
                  isWeaknessDungeonMode
                    ? (weaknessQuestionPool.length > 0 ? weaknessQuestionPool : initialWeaknessPoolRef.current)
                    : undefined
                )
              }
              onLaunchWeaknessDungeon={() => {
                const qMap = new Map<number, QuizQuestion>();
                allQuestionsPool.forEach(q => qMap.set(q.id, q));

                const seen = new Set<number>();
                const sessionMissedPool: QuizQuestion[] = [];
                for (const item of reviewList) {
                  if (!item.isCorrect && !seen.has(item.question.id)) {
                    seen.add(item.question.id);
                    const canonical = qMap.get(item.question.id);
                    if (canonical) {
                      sessionMissedPool.push(canonical);
                    } else {
                      sessionMissedPool.push({
                        id: item.question.id,
                        genre: item.question.genre,
                        unit: item.question.unit,
                        question: item.question.question,
                        options: item.question.options,
                        answerIndex: item.question.options.indexOf(item.question.correctAnswer),
                        explanation: item.question.explanation
                      });
                    }
                  }
                }

                const missedPool = sessionMissedPool.length > 0
                  ? sessionMissedPool
                  : storage.getMissedAsQuizQuestions();

                const count = Math.max(1, missedPool.length);
                const weaknessStage: StageInfo = {
                  id: "stage-weakness",
                  title: "弱点復習ダンジョン",
                  subtitle: `間違えた問題の特訓 (${count}問)`,
                  genre: "ALL",
                  badgeColor: "bg-rose-900/80 text-rose-300 border-rose-500/50",
                  bossName: "忘却の幻影王",
                  bossTitle: "弱点の隙を突く幻影",
                  bossHp: count * 100,
                  description: "間違えた問題だけが集中的に出題！",
                  totalFloors: 1
                };
                startDungeonBattle(weaknessStage, true, missedPool);
              }}
            />
          )}
        </>
      )}

      {/* Stage Select Modal */}
      {isStageSelectOpen && (
        <StageSelectModal
          currentStageId={currentStage.id}
          onSelectStage={(stage) => startDungeonBattle(stage, false)}
          onClose={() => setIsStageSelectOpen(false)}
        />
      )}

      {/* Weakness Dungeon Modal */}
      {isWeaknessModalOpen && (
        <WeaknessDungeonModal
          onStartWeaknessDungeon={() => {
            const missedPool = storage.getMissedAsQuizQuestions();
            const count = Math.max(1, missedPool.length);
            const weaknessStage: StageInfo = {
              id: "stage-weakness",
              title: "弱点復習ダンジョン",
              subtitle: `間違えた問題の特訓 (${count}問)`,
              genre: "ALL",
              badgeColor: "bg-rose-900/80 text-rose-300 border-rose-500/50",
              bossName: "忘却の幻影王",
              bossTitle: "弱点の隙を突く幻影",
              bossHp: count * 100,
              description: "間違えた問題だけが集中的に出題！",
              totalFloors: 1
            };
            startDungeonBattle(weaknessStage, true, missedPool);
          }}
          onClose={() => {
            setMissedQuestions(storage.getMissedQuestions());
            setIsWeaknessModalOpen(false);
          }}
        />
      )}

      {/* Question List / Social Studies Encyclopedia Modal */}
      {isQuestionListOpen && (
        <QuestionListModal
          questions={allQuestionsPool}
          onClose={() => setIsQuestionListOpen(false)}
        />
      )}

      {/* Social Studies Karte / Learning Analytics Modal */}
      {isKarteOpen && (
        <KarteModal
          playerProfile={playerProfile}
          missedCount={missedQuestions.length}
          onOpenWeaknessDungeon={() => setIsWeaknessModalOpen(true)}
          onOpenEndlessTower={() => {
            const endlessStage = STAGES.find(s => s.isEndless) || STAGES[1];
            startDungeonBattle(endlessStage, false);
          }}
          onOpenQuestionList={() => setIsQuestionListOpen(true)}
          onClose={() => setIsKarteOpen(false)}
        />
      )}

      {/* Admin Import Tool Modal */}
      {isAdminModalOpen && (
        <AdminQuizModal
          onQuestionsUpdated={handleReloadQuestions}
          onClose={() => setIsAdminModalOpen(false)}
        />
      )}

      {/* Guide Modal */}
      {isGuideOpen && (
        <GuideModal onClose={() => setIsGuideOpen(false)} />
      )}
    </div>
  );
}
