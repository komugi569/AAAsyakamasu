import React from 'react';
import { X, Swords, Zap, Shield, BookOpen, Keyboard, Sparkles } from 'lucide-react';
import { sound } from '../utils/sound';

interface GuideModalProps {
  onClose: () => void;
}

export const GuideModal: React.FC<GuideModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm select-none">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-lg w-full p-5 shadow-2xl relative max-h-[90vh] overflow-y-auto">
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

        <div className="flex items-center gap-2 mb-4">
          <BookOpen className="w-5 h-5 text-amber-400" />
          <h2 className="text-lg font-bold text-slate-100">バトルの極意（遊び方・スキル）</h2>
        </div>

        <div className="space-y-3 text-xs sm:text-sm text-slate-300 leading-relaxed">
          {/* Rule 1: Skills */}
          <div className="p-3 bg-slate-950/70 border border-amber-500/40 rounded-xl">
            <div className="flex items-center gap-2 font-bold text-amber-300 mb-1.5">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>1. 戦況を覆す3つの戦術スキル！</span>
            </div>
            <ul className="space-y-1 text-slate-300 text-xs">
              <li>・<strong className="text-cyan-300">『二択の慧眼』</strong>：誤答選択肢を2つ消去して2択にします（短答式モードで使用した場合もその問題が2択ボタンになります）。</li>
              <li>・<strong className="text-indigo-300">『時止めの一閃』</strong>：そのターンの制限時間タイマーを停止し、じっくり考えても即答クリティカル扱いになります。</li>
              <li>・<strong className="text-rose-300">『背水の陣』</strong>：その問題の与ダメージが2倍になります（ただし不正解だと被ダメージも2倍）。</li>
            </ul>
          </div>

          {/* Rule 2 */}
          <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl">
            <div className="flex items-center gap-2 font-bold text-slate-100 mb-1">
              <Keyboard className="w-4 h-4 text-emerald-400" />
              <span>2. 「短答式（記述）」と「4択」＆「PC / スマホモード」</span>
            </div>
            <p className="text-slate-400 text-xs">
              短答式では「二十一ヵ条の要求⇔対華21箇条」「間接民主制⇔代議制⇔議会制民主主義」「聖徳太子⇔厩戸王子」「関ヶ原/関ケ原/関が原」「リアス(式)海岸」など、別名・数字変換・表記ゆれもすべて正解になります。画面右上の「メニュー」からPCワイド表示・スマホ縦表示も切り替え可能です。
            </p>
          </div>

          {/* Rule 3 */}
          <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl">
            <div className="flex items-center gap-2 font-bold text-slate-100 mb-1">
              <Swords className="w-4 h-4 text-rose-400" />
              <span>3. 弱点特効（1.35倍）と即答会心（1.45倍）！</span>
            </div>
            <p className="text-slate-400 text-xs">
              敵の弱点分野で正解すると1.35倍ダメージ！さらに短答式は12秒以内、4択は5秒以内に即答するとクリティカルヒット（1.45倍）が発動します。
            </p>
          </div>

          {/* Rule 4 */}
          <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl">
            <div className="flex items-center gap-2 font-bold text-slate-100 mb-1">
              <Shield className="w-4 h-4 text-purple-400" />
              <span>4. 敵のギミック結界を破壊せよ！</span>
            </div>
            <p className="text-slate-400 text-xs">
              敵が展開する「悪法結界（公民で解除）」や「地形トラップ（地理で解除）」は、指定された分野で正解すると結界粉砕ボーナスで特大ダメージを与えられます！
            </p>
          </div>
        </div>

        <div className="mt-4 text-center">
          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-sm border border-slate-700 cursor-pointer"
          >
            理解した
          </button>
        </div>
      </div>
    </div>
  );
};
