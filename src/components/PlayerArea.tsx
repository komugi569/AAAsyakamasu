import React from 'react';
import { Genre, BossGimmick, FloatingDamage, BattleSkillsState, SkillId } from '../types/game';
import { Heart, Flame, ShieldAlert, Swords, Zap, Eye, Clock, Skull } from 'lucide-react';
import { sound } from '../utils/sound';

interface PlayerAreaProps {
  playerHp: number;
  playerMaxHp: number;
  isPlayerHit: boolean;
  activeGimmick: BossGimmick | null;
  weakGenre?: Genre;
  selectedGenre: Genre | null;
  isCommandPhase: boolean;
  streak: number;
  floatingDamages: FloatingDamage[];
  availableGenres?: Genre[];
  genreQuestionCounts?: Partial<Record<Genre, number>>;
  skillsState: BattleSkillsState;
  onUseSkill: (skillId: SkillId) => void;
  onSelectGenre: (genre: Genre) => void;
  hideStatusOnly?: boolean;
}

export const PlayerArea: React.FC<PlayerAreaProps> = ({
  playerHp,
  playerMaxHp,
  isPlayerHit,
  activeGimmick,
  weakGenre,
  selectedGenre,
  isCommandPhase,
  streak,
  floatingDamages,
  availableGenres = ["地理", "日本史", "公民"],
  genreQuestionCounts,
  skillsState,
  onUseSkill,
  onSelectGenre
}) => {
  const hpPercent = Math.max(0, Math.min(100, Math.round((playerHp / playerMaxHp) * 100)));
  const playerDamages = floatingDamages.filter(d => d.target === 'player');

  const allGenres: Array<{
    genre: Genre;
    label: string;
    sublabel: string;
    icon: string;
    colorClasses: string;
    borderGlow: string;
    bgGradient: string;
  }> = [
    {
      genre: "地理",
      label: "地理で攻める",
      sublabel: "自然・産業・世界と日本の地理",
      icon: "🌍",
      colorClasses: "border-emerald-500/80 text-emerald-300 hover:border-emerald-400",
      borderGlow: "shadow-emerald-500/20",
      bgGradient: "from-emerald-950/90 via-slate-900/95 to-emerald-900/80"
    },
    {
      genre: "日本史",
      label: "日本史で攻める",
      sublabel: "古代〜近現代・政治・外交・文化",
      icon: "⚔️",
      colorClasses: "border-rose-500/80 text-rose-300 hover:border-rose-400",
      borderGlow: "shadow-rose-500/20",
      bgGradient: "from-rose-950/90 via-slate-900/95 to-rose-900/80"
    },
    {
      genre: "公民",
      label: "公民で攻める",
      sublabel: "憲法・政治・経済・国際社会",
      icon: "⚖️",
      colorClasses: "border-amber-500/80 text-amber-300 hover:border-amber-400",
      borderGlow: "shadow-amber-500/20",
      bgGradient: "from-amber-950/90 via-slate-900/95 to-amber-900/80"
    }
  ];

  const visibleGenres = allGenres.filter(g => availableGenres.includes(g.genre));

  const gridColsClass =
    visibleGenres.length === 1
      ? 'grid-cols-1 max-w-md mx-auto'
      : visibleGenres.length === 2
      ? 'grid-cols-2 max-w-2xl mx-auto'
      : 'grid-cols-3';

  const skillDefs: Array<{
    id: SkillId;
    name: string;
    desc: string;
    icon: React.FC<{ className?: string }>;
    isActive: boolean;
    colorClass: string;
  }> = [
    {
      id: 'binary_eye',
      name: '二択の慧眼',
      desc: '誤答を2つ消去して2択化',
      icon: Eye,
      isActive: skillsState.activeThisTurn.binaryEye,
      colorClass: 'border-cyan-500/70 text-cyan-300 bg-cyan-950/60 hover:bg-cyan-900/70'
    },
    {
      id: 'time_stop',
      name: '時止めの一閃',
      desc: '制限時間タイマーを停止',
      icon: Clock,
      isActive: skillsState.activeThisTurn.timeStop,
      colorClass: 'border-indigo-400/70 text-indigo-200 bg-indigo-950/60 hover:bg-indigo-900/70'
    },
    {
      id: 'last_stand',
      name: '背水の陣',
      desc: '与ダメ2倍（ミス時被ダメ2倍）',
      icon: Skull,
      isActive: skillsState.activeThisTurn.lastStand,
      colorClass: 'border-rose-500/70 text-rose-300 bg-rose-950/60 hover:bg-rose-900/70'
    }
  ];

  return (
    <section
      aria-label="プレイヤーコマンドエリア"
      className="w-full max-w-4xl mx-auto px-3 pt-1 pb-1.5 select-none relative shrink-0"
    >
      {/* Floating Damage on Player */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 z-30 pointer-events-none">
        {playerDamages.map((dmg) => (
          <div
            key={dmg.id}
            className="font-black font-cinzel text-center animate-pop-damage drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)] text-rose-500 text-2xl"
          >
            {typeof dmg.amount === 'number' ? `-${dmg.amount}` : dmg.amount}
          </div>
        ))}
      </div>

      {/* Player Status Bar (Always visible, sleek and compact) */}
      <div className={`w-full bg-slate-900/95 border border-slate-700/80 rounded-xl px-3 py-1.5 shadow-lg backdrop-blur-md transition-all duration-300 ${
        isPlayerHit ? 'animate-shake border-rose-500/80 bg-rose-950/30' : ''
      }`}>
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-indigo-950 border border-indigo-500/60 flex items-center justify-center text-indigo-300 font-bold text-xs shadow">
              探
            </div>
            <span className="font-bold text-slate-100 text-xs sm:text-sm">探究者</span>

            {streak > 1 && (
              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-300 bg-amber-950/80 border border-amber-500/50 px-1.5 py-0.5 rounded-full">
                <Flame className="w-3 h-3 text-amber-400" />
                {streak}連勝
              </span>
            )}

            {/* Active Skill Indicators */}
            {skillsState.activeThisTurn.binaryEye && (
              <span className="text-[10px] font-bold text-cyan-200 bg-cyan-950 border border-cyan-400 px-1.5 py-0.5 rounded">
                二択の慧眼発動中
              </span>
            )}
            {skillsState.activeThisTurn.timeStop && (
              <span className="text-[10px] font-bold text-indigo-200 bg-indigo-950 border border-indigo-400 px-1.5 py-0.5 rounded">
                時止めの一閃発動中
              </span>
            )}
            {skillsState.activeThisTurn.lastStand && (
              <span className="text-[10px] font-bold text-rose-200 bg-rose-950 border border-rose-400 px-1.5 py-0.5 rounded animate-pulse">
                背水の陣（与ダメ・被ダメ2倍）
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Heart className={`w-3.5 h-3.5 ${playerHp <= playerMaxHp * 0.3 ? 'text-rose-500 animate-pulse' : 'text-rose-400'}`} />
            <div className="text-right font-mono tabular-nums">
              <span className={`font-bold text-xs sm:text-sm ${
                playerHp <= playerMaxHp * 0.3 ? 'text-rose-400 animate-pulse' : 'text-slate-100'
              }`}>
                {playerHp}
              </span>
              <span className="text-[11px] text-slate-400"> / {playerMaxHp}</span>
            </div>
          </div>
        </div>

        {/* Player HP Gauge */}
        <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800 mt-1 p-0.5">
          <div
            className={`h-full rounded-full transition-all duration-300 ${
              hpPercent > 50
                ? 'bg-gradient-to-r from-emerald-500 to-teal-400'
                : hpPercent > 25
                ? 'bg-gradient-to-r from-amber-500 to-yellow-400'
                : 'bg-gradient-to-r from-rose-600 to-red-500'
            }`}
            style={{ width: `${hpPercent}%` }}
          />
        </div>
      </div>

      {/* ONLY render Skills & Genre Command Buttons during Command Phase so Quiz Phase fits on 1 screen! */}
      {isCommandPhase && (
        <div className="mt-2 space-y-2">
          {/* 3 Tactical Skills Row */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-2">
            <div className="flex items-center justify-between text-[11px] text-slate-400 px-1 mb-1.5">
              <span className="font-bold text-amber-300">戦術スキル（出題前・出題中に使用可能）</span>
              <span>各スキル1バトル2回まで</span>
            </div>
            <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
              {skillDefs.map((sk) => {
                const remaining = skillsState.usesRemaining[sk.id];
                const disabled = sk.isActive || remaining <= 0;
                const Icon = sk.icon;
                return (
                  <button
                    key={sk.id}
                    type="button"
                    data-testid={`skill-btn-${sk.id}`}
                    disabled={disabled}
                    onClick={() => {
                      sound.playClick();
                      onUseSkill(sk.id);
                    }}
                    className={`p-2 rounded-lg border text-left transition-all cursor-pointer disabled:opacity-45 disabled:cursor-not-allowed ${
                      sk.isActive
                        ? 'bg-amber-500/20 border-amber-400 ring-1 ring-amber-400 text-amber-200'
                        : sk.colorClass
                    }`}
                  >
                    <div className="flex items-center justify-between gap-1 mb-0.5">
                      <span className="inline-flex items-center gap-1 font-bold text-[11px] sm:text-xs whitespace-nowrap">
                        <Icon className="w-3.5 h-3.5 shrink-0" />
                        <span>{sk.name}</span>
                      </span>
                      <span className="text-[10px] font-mono tabular-nums bg-slate-950/80 px-1.5 py-0.2 rounded text-slate-300 shrink-0">
                        {sk.isActive ? '発動中' : `残${remaining}`}
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-300/90 leading-tight truncate">
                      {sk.desc}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Filtered Genre Command Buttons */}
          <div className={`grid ${gridColsClass} gap-2`}>
            {visibleGenres.map(({ genre, label, sublabel, icon, colorClasses, borderGlow, bgGradient }, idx) => {
              const isGimmickWeakness = activeGimmick?.counterGenre === genre;
              const isAffinityWeakness = weakGenre === genre;
              const isSelected = selectedGenre === genre;
              const remainingCount = genreQuestionCounts ? genreQuestionCounts[genre] : undefined;

              let effectBadge = {
                label: "通常 1.0x",
                icon: Swords,
                className: "bg-slate-800 text-slate-300 border-slate-600"
              };

              if (isGimmickWeakness) {
                effectBadge = {
                  label: "結界粉砕!",
                  icon: ShieldAlert,
                  className: "bg-amber-500 text-slate-950 font-black border-amber-300 animate-bounce"
                };
              } else if (isAffinityWeakness) {
                effectBadge = {
                  label: "弱点 1.35x",
                  icon: Zap,
                  className: "bg-yellow-400 text-slate-950 font-black border-yellow-200"
                };
              }

              return (
                <button
                  key={genre}
                  type="button"
                  onClick={() => {
                    sound.playClick();
                    onSelectGenre(genre);
                  }}
                  className={`relative group p-2.5 sm:p-3 rounded-xl border-2 text-left transition-all duration-150 cursor-pointer shadow-lg bg-gradient-to-b ${bgGradient} ${colorClasses} ${borderGlow} ${
                    isGimmickWeakness || isAffinityWeakness
                      ? 'ring-2 ring-amber-400 shadow-[0_0_12px_rgba(245,158,11,0.35)]'
                      : ''
                  } ${
                    isSelected ? 'ring-2 ring-white' : 'hover:scale-[1.01] active:scale-[0.99]'
                  }`}
                >
                  <div className="flex items-center justify-between gap-1 mb-1 flex-wrap">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-slate-950/90 border border-slate-700 text-amber-300">
                        {idx + 1}
                      </span>
                      <span className="text-lg sm:text-xl">{icon}</span>
                      <span className="font-bold text-xs sm:text-sm tracking-wide text-slate-100 whitespace-nowrap">
                        {label}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      {typeof remainingCount === 'number' && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-rose-600 text-white font-black">
                          残{remainingCount}
                        </span>
                      )}
                      <div className={`text-[10px] px-1.5 py-0.5 rounded border flex items-center gap-0.5 whitespace-nowrap ${effectBadge.className}`}>
                        <effectBadge.icon className="w-2.5 h-2.5" />
                        <span>{effectBadge.label}</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-[10px] text-slate-300 truncate hidden sm:block">
                    {sublabel}
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
};
