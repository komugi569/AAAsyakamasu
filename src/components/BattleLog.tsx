import React, { useState } from 'react';
import { BattleLogEntry } from '../types/game';
import { ScrollText, ChevronDown, ChevronUp, Swords, Shield, AlertCircle } from 'lucide-react';

interface BattleLogProps {
  logs: BattleLogEntry[];
}

export const BattleLog: React.FC<BattleLogProps> = ({ logs }) => {
  const [isOpen, setIsOpen] = useState(false);

  // Latest 1 entry for ticker display
  const latestLog = logs[logs.length - 1];

  return (
    <div className="w-full max-w-4xl mx-auto px-4 pb-2">
      {/* Ticker / Quick View */}
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="bg-slate-900/90 border border-slate-800 rounded-lg px-3 py-1.5 flex items-center justify-between text-xs cursor-pointer hover:border-slate-700 transition-colors"
      >
        <div className="flex items-center gap-2 overflow-hidden mr-2">
          <ScrollText className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          <span className="text-slate-400 font-mono text-[11px] shrink-0">LOG:</span>
          <span className="text-slate-200 truncate font-medium">
            {latestLog ? latestLog.message : "冒険が始まった..."}
          </span>
        </div>
        <button 
          className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-slate-200 shrink-0 font-medium"
          aria-expanded={isOpen}
        >
          <span>履歴 ({logs.length})</span>
          {isOpen ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
        </button>
      </div>

      {/* Expanded History Drawer */}
      {isOpen && (
        <div className="mt-1.5 bg-slate-950/95 border border-slate-800 rounded-lg p-3 max-h-48 overflow-y-auto space-y-2 text-xs shadow-inner">
          {logs.length === 0 ? (
            <div className="text-slate-500 text-center py-2">ログはまだありません</div>
          ) : (
            [...logs].reverse().map((entry) => (
              <div
                key={entry.id}
                className={`p-2 rounded border flex flex-col gap-1 ${
                  entry.actor === 'player'
                    ? 'bg-slate-900/70 border-indigo-900/60 text-slate-200'
                    : entry.actor === 'enemy'
                    ? 'bg-rose-950/30 border-rose-900/50 text-rose-200'
                    : 'bg-amber-950/20 border-amber-900/40 text-amber-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    {entry.actor === 'player' && <Swords className="w-3.5 h-3.5 text-indigo-400" />}
                    {entry.actor === 'enemy' && <AlertCircle className="w-3.5 h-3.5 text-rose-400" />}
                    {entry.actor === 'system' && <Shield className="w-3.5 h-3.5 text-amber-400" />}
                    <span className="font-bold">
                      {entry.turn > 0 ? `Turn ${entry.turn}` : 'System'}:
                    </span>
                    <span>{entry.message}</span>
                  </div>
                  {entry.damage && (
                    <span className="font-bold">
                      {entry.isCritical && <span className="text-amber-400 mr-1">CRIT!</span>}
                      {entry.damage} dmg
                    </span>
                  )}
                </div>
                {entry.explanation && (
                  <div className="text-[11px] text-slate-400 bg-slate-950/60 p-1.5 rounded border border-slate-800/80">
                    💡 {entry.explanation}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};
