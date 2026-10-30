import React from 'react';
import { BossGimmick, FloatingDamage, Genre, DungeonEnemy } from '../types/game';
import { Shield, Zap } from 'lucide-react';

interface EnemyAreaProps {
  enemy: DungeonEnemy;
  enemyHp: number;
  currentFloor: number;
  totalFloors: number;
  activeGimmick: BossGimmick | null;
  isEnemyHit: boolean;
  isPlayerAttacking: boolean;
  slashType?: 'normal' | 'critical' | 'break' | null;
  floatingDamages: FloatingDamage[];
  compact?: boolean;
}

export const EnemyArea: React.FC<EnemyAreaProps> = ({
  enemy,
  enemyHp,
  currentFloor,
  totalFloors,
  activeGimmick,
  isEnemyHit,
  isPlayerAttacking,
  slashType,
  floatingDamages,
  compact = false
}) => {
  const hpPercent = Math.max(0, Math.min(100, Math.round((enemyHp / enemy.maxHp) * 100)));

  const getHpBarColor = () => {
    if (hpPercent > 50) return 'from-emerald-400 via-teal-400 to-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.5)]';
    if (hpPercent > 25) return 'from-amber-400 via-yellow-400 to-amber-500 shadow-[0_0_12px_rgba(245,158,11,0.5)]';
    return 'from-rose-500 via-red-500 to-rose-600 shadow-[0_0_12px_rgba(244,63,94,0.6)]';
  };

  const enemyDamages = floatingDamages.filter(d => d.target === 'enemy');

  const getWeaknessBadgeColor = (genre: Genre) => {
    switch (genre) {
      case '地理': return 'bg-emerald-950 text-emerald-300 border-emerald-500/60';
      case '日本史': return 'bg-rose-950 text-rose-300 border-rose-500/60';
      case '公民': return 'bg-amber-950 text-amber-300 border-amber-500/60';
    }
  };

  // Render SVG avatar based on floor enemy type
  const renderEnemySvg = (sizeClass: string) => {
    switch (enemy.avatarType) {
      case 'geo_golem':
        return (
          <svg viewBox="0 0 240 220" className={`${sizeClass} drop-shadow-[0_10px_20px_rgba(16,185,129,0.4)]`}>
            <defs>
              <linearGradient id="rockGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#065f46" />
                <stop offset="50%" stopColor="#047857" />
                <stop offset="100%" stopColor="#064e3b" />
              </linearGradient>
            </defs>
            <path d="M 40,110 L 80,60 L 160,60 L 200,110 L 170,195 L 70,195 Z" fill="url(#rockGrad)" stroke="#34d399" strokeWidth="3" />
            <polygon points="120,70 145,110 95,110" fill="#022c22" stroke="#10b981" strokeWidth="2" />
            <polygon points="90,120 120,180 60,160" fill="#047857" opacity="0.8" />
            <polygon points="150,120 180,160 120,180" fill="#047857" opacity="0.8" />
            <circle cx="120" cy="140" r="18" fill="#34d399" className="animate-pulse" />
            <circle cx="120" cy="140" r="10" fill="#ecfdf5" />
            <circle cx="100" cy="85" r="5" fill="#6ee7b7" />
            <circle cx="140" cy="85" r="5" fill="#6ee7b7" />
          </svg>
        );

      case 'samurai_ghost':
        return (
          <svg viewBox="0 0 240 220" className={`${sizeClass} drop-shadow-[0_10px_20px_rgba(244,63,94,0.4)]`}>
            <defs>
              <linearGradient id="samuraiGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#881337" />
                <stop offset="50%" stopColor="#4c0519" />
                <stop offset="100%" stopColor="#1e1b4b" />
              </linearGradient>
            </defs>
            <path d="M 70,70 L 40,20 L 75,45 L 120,10 L 165,45 L 200,20 L 170,70 Z" fill="#e11d48" stroke="#f43f5e" strokeWidth="2.5" />
            <path d="M 50,110 L 80,75 L 160,75 L 190,110 L 180,195 L 60,195 Z" fill="url(#samuraiGrad)" stroke="#fb7185" strokeWidth="2.5" />
            <rect x="75" y="125" width="90" height="15" rx="3" fill="#be123c" stroke="#f43f5e" />
            <rect x="80" y="150" width="80" height="15" rx="3" fill="#9f1239" stroke="#f43f5e" />
            <ellipse cx="120" cy="95" rx="25" ry="8" fill="#030712" />
            <ellipse cx="108" cy="95" rx="6" ry="3" fill="#fda4af" />
            <ellipse cx="132" cy="95" rx="6" ry="3" fill="#fda4af" />
          </svg>
        );

      case 'archmage_boss':
      default:
        return (
          <svg viewBox="0 0 240 220" className={`${sizeClass} drop-shadow-[0_10px_20px_rgba(99,102,241,0.5)]`}>
            <defs>
              <linearGradient id="robeGrad3" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#4338ca" />
                <stop offset="50%" stopColor="#312e81" />
                <stop offset="100%" stopColor="#0f172a" />
              </linearGradient>
              <linearGradient id="coreGlow3" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#f43f5e" />
                <stop offset="50%" stopColor="#c084fc" />
                <stop offset="100%" stopColor="#38bdf8" />
              </linearGradient>
            </defs>
            <path d="M 85,55 L 70,25 L 95,45 L 120,15 L 145,45 L 170,25 L 155,55 Z" fill="#312e81" stroke="#a5b4fc" strokeWidth="2.5" />
            <path d="M 75,90 L 120,40 L 165,90 L 195,195 L 45,195 Z" fill="url(#robeGrad3)" stroke="#818cf8" strokeWidth="2.5" />
            <circle cx="120" cy="140" r="26" fill="url(#coreGlow3)" opacity="0.9" className="animate-pulse" />
            <circle cx="120" cy="140" r="16" fill="#0f172a" />
            <ellipse cx="106" cy="84" rx="5" ry="3" fill="#fb7185" />
            <ellipse cx="134" cy="84" rx="5" ry="3" fill="#fb7185" />
          </svg>
        );
    }
  };

  if (compact) {
    return (
      <section
        aria-label="敵ステータスエリア（コンパクト）"
        className="relative w-full max-w-2xl mx-auto px-3 pt-1 pb-1 select-none shrink-0"
      >
        <div className="w-full bg-slate-900/95 border border-indigo-500/30 rounded-xl px-3 py-2 shadow-lg flex items-center gap-3 relative overflow-hidden">
          {/* Mini Avatar */}
          <div className={`relative shrink-0 ${isEnemyHit ? 'animate-shake' : ''}`}>
            {renderEnemySvg('w-11 h-11')}
          </div>

          {/* Info & HP Bar */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2 mb-1">
              <div className="flex items-center gap-1.5 truncate">
                <span className="px-1.5 py-0.5 rounded text-[10px] font-black bg-indigo-900/90 text-indigo-200 border border-indigo-400/50 shrink-0">
                  {enemy.floor === totalFloors ? 'BOSS' : `${currentFloor}F`}
                </span>
                <span className="font-bold text-xs sm:text-sm text-slate-100 truncate">
                  {enemy.name}
                </span>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${getWeaknessBadgeColor(enemy.weakGenre)}`}>
                  弱点:{enemy.weakGenre}
                </span>
                <span className="text-xs font-mono tabular-nums font-bold text-emerald-300">
                  {enemyHp}/{enemy.maxHp}
                </span>
              </div>
            </div>

            <div className="relative w-full h-2 bg-slate-950 rounded-full border border-slate-700/80 overflow-hidden">
              <div
                className={`h-full rounded-full bg-gradient-to-r ${getHpBarColor()} transition-all duration-300`}
                style={{ width: `${hpPercent}%` }}
              />
            </div>

            {activeGimmick && (
              <div className="mt-1 flex items-center justify-between text-[10px] text-amber-300 font-bold">
                <span>⚠️ 結界【{activeGimmick.name}】発動中</span>
                <span className="bg-amber-500 text-slate-950 px-1.5 rounded font-black">
                  {activeGimmick.counterGenre}で粉砕
                </span>
              </div>
            )}
          </div>

          {/* Floating Damage in Compact View */}
          {enemyDamages.length > 0 && (
            <div className="absolute right-4 top-1 z-30 pointer-events-none">
              {enemyDamages.map((dmg) => (
                <div
                  key={dmg.id}
                  className="font-black font-cinzel text-amber-300 text-xl animate-pop-damage drop-shadow"
                >
                  {typeof dmg.amount === 'number' ? `-${dmg.amount}` : dmg.amount}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    );
  }

  return (
    <section
      aria-label="敵ステータスエリア"
      className="relative w-full mx-auto px-3 pt-1 pb-1 select-none flex flex-col items-center shrink-0"
    >
      {/* Floor & Enemy Info Card */}
      <div className="w-full max-w-md bg-slate-900/90 border border-indigo-500/30 rounded-xl px-3.5 py-2 shadow-xl backdrop-blur-md relative overflow-hidden">
        <div className="flex items-center justify-between mb-1 relative z-10">
          <div className="flex items-center gap-2 min-w-0">
            <span className={`inline-flex items-center justify-center px-1.5 py-0.5 rounded-md text-[10px] font-black border shrink-0 ${
              enemy.floor === totalFloors
                ? 'bg-purple-900/90 text-purple-200 border-purple-400/60'
                : 'bg-indigo-900/90 text-indigo-200 border-indigo-400/60'
            }`}>
              {enemy.floor === totalFloors ? 'BOSS' : `${currentFloor}F / ${totalFloors}F`}
            </span>
            <div className="truncate">
              <h2 className="text-xs sm:text-sm font-bold text-slate-100 tracking-wide truncate">
                {enemy.name}
              </h2>
              <span className="text-[10px] text-slate-400 block -mt-0.5 truncate">
                {enemy.title}
              </span>
            </div>
          </div>

          <div className="text-right shrink-0 ml-2">
            <div className="text-xs sm:text-sm font-mono tabular-nums font-bold">
              HP: <span className={enemyHp <= enemy.maxHp * 0.25 ? "text-rose-400 animate-pulse" : "text-emerald-300"}>{enemyHp}</span> / {enemy.maxHp}
            </div>
          </div>
        </div>

        {/* HP Bar */}
        <div className="relative w-full h-2.5 sm:h-3 bg-slate-950 rounded-full border border-slate-700/80 overflow-hidden shadow-inner p-0.5">
          <div
            className={`h-full rounded-full bg-gradient-to-r ${getHpBarColor()} transition-all duration-300 ease-out`}
            style={{ width: `${hpPercent}%` }}
          />
        </div>

        {/* Weakness Attribute Prompt */}
        <div className="mt-1 flex items-center justify-between text-[11px]">
          <span className="text-slate-400 flex items-center gap-1">
            <Zap className="w-3 h-3 text-amber-400" />
            <span>属性弱点:</span>
          </span>
          <span className={`font-bold px-2 py-0.2 rounded border ${getWeaknessBadgeColor(enemy.weakGenre)}`}>
            【{enemy.weakGenre}】特効（威力1.35倍！）
          </span>
        </div>
      </div>

      {/* Avatar & Battle Stage */}
      <div className="relative w-28 h-24 sm:w-36 sm:h-32 flex items-center justify-center my-0.5">
        {/* Floating Combat Text / Damage Numbers */}
        <div className="absolute top-0 z-30 pointer-events-none flex flex-col items-center">
          {enemyDamages.map((dmg) => (
            <div
              key={dmg.id}
              className={`font-black font-cinzel text-center animate-pop-damage drop-shadow-[0_4px_12px_rgba(0,0,0,0.95)] ${
                dmg.isGimmickBreak
                  ? 'text-yellow-300 text-2xl sm:text-3xl'
                  : dmg.isAffinityWeakness
                  ? 'text-amber-300 text-xl sm:text-2xl'
                  : dmg.isCritical
                  ? 'text-amber-400 text-xl sm:text-2xl'
                  : 'text-rose-400 text-lg sm:text-xl'
              }`}
            >
              {dmg.isGimmickBreak && (
                <div className="text-[10px] font-rpg font-bold text-yellow-200 bg-yellow-950/90 px-2 py-0.5 rounded border border-yellow-400 tracking-wider mb-0.5">
                  結界粉砕 BONUS!!
                </div>
              )}
              {dmg.isAffinityWeakness && !dmg.isGimmickBreak && (
                <div className="text-[10px] font-rpg font-bold text-amber-300 tracking-wider">
                  属性弱点特効 1.35倍!!
                </div>
              )}
              {typeof dmg.amount === 'number' ? `-${dmg.amount}` : dmg.amount}
            </div>
          ))}
        </div>

        {/* Slash Attack Animation */}
        {isPlayerAttacking && (
          <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none">
            <div className={`w-40 sm:w-48 h-3 rounded-full animate-slash shadow-xl ${
              slashType === 'break'
                ? 'bg-gradient-to-r from-yellow-200 via-white to-amber-400 shadow-yellow-400/90'
                : slashType === 'critical'
                ? 'bg-gradient-to-r from-cyan-300 via-white to-sky-400 shadow-sky-400/90'
                : 'bg-gradient-to-r from-rose-400 via-white to-red-500 shadow-rose-500/90'
            }`} />
          </div>
        )}

        {/* Dynamic Enemy Graphic */}
        <div className={`relative transition-transform duration-200 ${isEnemyHit ? 'animate-shake' : 'animate-float-slow'}`}>
          {renderEnemySvg('w-24 h-24 sm:w-32 sm:h-32')}
        </div>
      </div>

      {/* Barrier Alert */}
      {activeGimmick && (
        <div className="w-full max-w-md bg-gradient-to-r from-amber-950/90 via-slate-900/90 to-amber-950/90 border border-amber-400/80 rounded-xl px-3 py-1.5 shadow-lg flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 min-w-0">
            <Shield className="w-4 h-4 text-amber-400 shrink-0" />
            <span className="text-xs font-bold text-amber-200 truncate">
              結界【{activeGimmick.name}】（他分野半減）
            </span>
          </div>
          <span className="shrink-0 text-[11px] font-black bg-amber-500 text-slate-950 px-2 py-0.5 rounded">
            【{activeGimmick.counterGenre}】で破壊
          </span>
        </div>
      )}
    </section>
  );
};
