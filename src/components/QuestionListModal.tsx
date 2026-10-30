import React, { useState, useMemo } from 'react';
import { QuizQuestion, Genre } from '../types/game';
import { X, Search, BookOpen, CheckCircle2, Lightbulb, ChevronDown } from 'lucide-react';
import { sound } from '../utils/sound';
import { getQuestionHintInfo } from '../utils/answerMatcher';

interface QuestionListModalProps {
  questions: QuizQuestion[];
  onClose: () => void;
}

export const QuestionListModal: React.FC<QuestionListModalProps> = ({
  questions,
  onClose
}) => {
  const [selectedGenre, setSelectedGenre] = useState<Genre | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [displayCount, setDisplayCount] = useState<number>(50);

  const genreCounts = useMemo(() => {
    const counts = { "地理": 0, "日本史": 0, "公民": 0 };
    questions.forEach(q => {
      if (counts[q.genre] !== undefined) {
        counts[q.genre]++;
      }
    });
    return counts;
  }, [questions]);

  const filteredQuestions = useMemo(() => {
    let list = questions;
    if (selectedGenre !== 'ALL') {
      list = list.filter(q => q.genre === selectedGenre);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      list = list.filter(item =>
        item.question.toLowerCase().includes(q) ||
        item.unit.toLowerCase().includes(q) ||
        item.options.some(opt => opt.toLowerCase().includes(q)) ||
        item.explanation.toLowerCase().includes(q)
      );
    }
    return list;
  }, [questions, selectedGenre, searchQuery]);

  const displayedList = useMemo(() => {
    return filteredQuestions.slice(0, displayCount);
  }, [filteredQuestions, displayCount]);

  const getGenreBadge = (genre: Genre) => {
    switch (genre) {
      case '地理':
        return 'bg-emerald-950/80 text-emerald-300 border-emerald-500/50';
      case '日本史':
        return 'bg-rose-950/80 text-rose-300 border-rose-500/50';
      case '公民':
        return 'bg-amber-950/80 text-amber-300 border-amber-500/50';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md select-none animate-fadeIn">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl max-w-3xl w-full p-4 sm:p-6 shadow-2xl relative max-h-[92vh] flex flex-col">
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
        <div className="flex items-center gap-2.5 mb-3">
          <div className="w-9 h-9 rounded-xl bg-indigo-950 border border-indigo-500/60 flex items-center justify-center text-indigo-400">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg sm:text-xl font-bold text-slate-100">
                問題一覧・社会科事典
              </h2>
              <span className="text-xs font-bold text-amber-300 bg-amber-950/80 px-2 py-0.5 rounded border border-amber-500/50">
                全 {questions.length} 問
              </span>
            </div>
            <p className="text-xs text-slate-400">
              収録されているすべての問題・正解・要点解説を分野別に閲覧・学習できます
            </p>
          </div>
        </div>

        {/* Filter Tabs & Search Bar */}
        <div className="space-y-2 mb-3">
          {/* Genre Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
            <button
              onClick={() => {
                sound.playClick();
                setSelectedGenre('ALL');
                setDisplayCount(50);
              }}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer whitespace-nowrap ${
                selectedGenre === 'ALL'
                  ? 'bg-indigo-600 text-white shadow'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              すべて ({questions.length})
            </button>
            <button
              onClick={() => {
                sound.playClick();
                setSelectedGenre('地理');
                setDisplayCount(50);
              }}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer whitespace-nowrap ${
                selectedGenre === '地理'
                  ? 'bg-emerald-600 text-white shadow'
                  : 'bg-slate-800 text-emerald-300 hover:bg-slate-700'
              }`}
            >
              🌍 地理 ({genreCounts['地理']})
            </button>
            <button
              onClick={() => {
                sound.playClick();
                setSelectedGenre('日本史');
                setDisplayCount(50);
              }}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer whitespace-nowrap ${
                selectedGenre === '日本史'
                  ? 'bg-rose-600 text-white shadow'
                  : 'bg-slate-800 text-rose-300 hover:bg-slate-700'
              }`}
            >
              ⚔️ 日本史 ({genreCounts['日本史']})
            </button>
            <button
              onClick={() => {
                sound.playClick();
                setSelectedGenre('公民');
                setDisplayCount(50);
              }}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer whitespace-nowrap ${
                selectedGenre === '公民'
                  ? 'bg-amber-600 text-white shadow'
                  : 'bg-slate-800 text-amber-300 hover:bg-slate-700'
              }`}
            >
              ⚖️ 公民 ({genreCounts['公民']})
            </button>
          </div>

          {/* Search Input */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setDisplayCount(50);
              }}
              placeholder="問題文・単元名・キーワードで検索..."
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Count Indicator */}
        <div className="text-[11px] text-slate-400 px-1 mb-2 flex justify-between">
          <span>検索結果: <strong className="text-amber-400 font-bold">{filteredQuestions.length}</strong> 問</span>
          <span>表示中: 1〜{Math.min(displayCount, filteredQuestions.length)} 問</span>
        </div>

        {/* Questions List */}
        <div className="flex-1 overflow-y-auto space-y-3 pr-1">
          {displayedList.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-sm">
              該当する問題が見つかりませんでした。
            </div>
          ) : (
            displayedList.map((q, idx) => (
              <div
                key={q.id || idx}
                className="p-3.5 bg-slate-950/80 border border-slate-800 rounded-xl space-y-2 text-xs transition-all hover:border-slate-700"
              >
                {/* Meta Header */}
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className={`px-2 py-0.5 rounded font-bold text-[10px] border ${getGenreBadge(q.genre)}`}>
                      {q.genre}
                    </span>
                    <span className="text-[11px] text-slate-300 font-medium">
                      {q.unit}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono">
                    #{q.id}
                  </span>
                </div>

                {/* Question Text */}
                <p className="font-bold text-slate-100 text-xs sm:text-sm leading-relaxed">
                  {q.question}
                </p>

                {/* Options Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pt-1">
                  {q.options.map((opt, optIdx) => {
                    const isCorrect = optIdx === q.answerIndex;
                    return (
                      <div
                        key={optIdx}
                        className={`px-2.5 py-1.5 rounded-lg border flex items-center justify-between text-xs ${
                          isCorrect
                            ? 'bg-emerald-950/70 border-emerald-500/70 text-emerald-300 font-bold'
                            : 'bg-slate-900/60 border-slate-800 text-slate-300'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className={`w-4 h-4 rounded text-[10px] flex items-center justify-center font-mono ${
                            isCorrect ? 'bg-emerald-600 text-white font-black' : 'bg-slate-800 text-slate-400'
                          }`}>
                            {optIdx + 1}
                          </span>
                          <span>{opt}</span>
                        </div>
                        {isCorrect && (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 ml-1" />
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Explanation & Accepted Aliases */}
                {(() => {
                  const hint = getQuestionHintInfo(q);
                  return (
                    <>
                      {hint.displayAliases.length > 0 && (
                        <div className="text-[11px] text-emerald-300 bg-emerald-950/40 border border-emerald-800/40 rounded-lg px-2.5 py-1.5 flex items-center gap-1.5 flex-wrap">
                          <span className="font-bold">短答式で許容される別名・同義語:</span>
                          <span className="text-slate-200">{hint.displayAliases.join(' ／ ')} など</span>
                        </div>
                      )}
                      {q.explanation && (
                        <div className="bg-amber-950/30 border border-amber-900/40 rounded-lg p-2 text-[11px] text-amber-200/90 flex items-start gap-1.5 leading-relaxed">
                          <Lightbulb className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                          <span>{q.explanation}</span>
                        </div>
                      )}
                    </>
                  );
                })()}
              </div>
            ))
          )}

          {/* Load More Button */}
          {displayCount < filteredQuestions.length && (
            <div className="py-2 text-center">
              <button
                onClick={() => setDisplayCount(prev => prev + 50)}
                className="px-6 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 cursor-pointer inline-flex items-center gap-1.5 transition-colors"
              >
                <span>さらに表示する（残り {filteredQuestions.length - displayCount} 問）</span>
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
