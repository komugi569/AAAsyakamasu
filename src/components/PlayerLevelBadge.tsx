import React from 'react';
import { PlayerProfile } from '../types/game';
import { Award, Zap } from 'lucide-react';

interface PlayerLevelBadgeProps {
  profile: PlayerProfile;
}

export const PlayerLevelBadge: React.FC<PlayerLevelBadgeProps> = ({ profile }) => {
  const expPercent = Math.max(0, Math.min(100, Math.round((profile.exp / profile.nextExp) * 100)));

  return (
    <div className="flex items-center gap-2 bg-slate-900/90 border border-amber-500/30 rounded-lg px-2.5 py-1 text-xs shadow">
      {/* Level Crest */}
      <div className="flex items-center gap-1 font-bold font-cinzel text-amber-400">
        <Award className="w-3.5 h-3.5 text-amber-400" />
        <span>Lv.{profile.level}</span>
      </div>

      {/* Title */}
      <span className="hidden sm:inline-block text-[11px] text-slate-300 font-medium">
        {profile.title}
      </span>

      {/* Mini EXP Bar */}
      <div className="w-14 sm:w-16 h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800 p-0.5">
        <div
          className="h-full bg-gradient-to-r from-amber-400 to-yellow-300 rounded-full transition-all duration-300"
          style={{ width: `${expPercent}%` }}
        />
      </div>

      {/* Bonus ATK indicator */}
      {profile.bonusAtkPercent > 0 && (
        <span className="text-[10px] text-amber-300 font-bold bg-amber-950/80 px-1.5 py-0.2 rounded border border-amber-600/40 flex items-center gap-0.5">
          <Zap className="w-2.5 h-2.5" />
          +{profile.bonusAtkPercent}%
        </span>
      )}
    </div>
  );
};
