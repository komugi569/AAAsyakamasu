import React, { useState } from 'react';
import { QuizQuestion, Genre } from '../types/game';
import { storage } from '../utils/storage';
import { Lock, Unlock, FileText, Upload, Download, RefreshCw, CheckCircle2, AlertTriangle, X, Database } from 'lucide-react';
import { sound } from '../utils/sound';

interface AdminQuizModalProps {
  onQuestionsUpdated: () => void;
  onClose: () => void;
}

const DEFAULT_ADMIN_PASSCODE = 'admin2026';

export const AdminQuizModal: React.FC<AdminQuizModalProps> = ({
  onQuestionsUpdated,
  onClose
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [passcodeInput, setPasscodeInput] = useState<string>('');
  const [passcodeError, setPasscodeError] = useState<boolean>(false);

  const [rawText, setRawText] = useState<string>('');
  const [importMode, setImportMode] = useState<'append' | 'replace'>('append');
  const [activeTab, setActiveTab] = useState<'import' | 'list'>('import');
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [selectedFilterGenre, setSelectedFilterGenre] = useState<Genre | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [displayLimit, setDisplayLimit] = useState<number>(60);

  const currentQuestions = storage.getAllQuestions();

  const genreCounts: Record<string, number> = {
    "日本史": 0,
    "公民": 0,
    "地理": 0
  };
  currentQuestions.forEach(q => {
    if (genreCounts[q.genre] !== undefined) {
      genreCounts[q.genre]++;
    }
  });

  // Handle Passcode check
  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcodeInput.trim() === DEFAULT_ADMIN_PASSCODE) {
      sound.playCorrect();
      setIsAuthenticated(true);
      setPasscodeError(false);
    } else {
      sound.playMiss();
      setPasscodeError(true);
    }
  };

  // Insert CSV Sample
  const handleInsertCsvSample = () => {
    sound.playClick();
    const sample = `科目,単元,問題文,正解,誤答1,誤答2,誤答3,解説
日本史,戦国時代,1575年に織田・徳川連合軍が武田勝頼の騎馬隊を鉄砲戦術で破った戦いは？,長篠の戦い,桶狭間の戦い,姉川の戦い,三方ヶ原の戦い,武田氏を壊滅的打撃に追い込み鉄砲の威力を天下に知らしめた合戦。
地理,日本の気候,冬の日本海側に大雪をもたらす季節風の風向は？,北西,南東,南西,北東,シベリア高気圧から日本海を渡る際に水蒸気を含んで山脈にぶつかる。
世界史,古代ギリシャ,古代ギリシャのアテネなどで直接民主政の最高議決機関とされた市民集会は？,民会,元老院,三部会,護民官,成年男子市民全員が参加して政策や戦争を討議・決定した。
公民,国際平和,1945年に設立された国際平和維持機関「国際連合」の本部がある都市は？,ニューヨーク,ジュネーブ,ロンドン,パリ,国際連盟の反省から創設され安全保障理事会に拒否権が与えられた。`;
    setRawText(sample);
  };

  // Insert JSON Sample
  const handleInsertJsonSample = () => {
    sound.playClick();
    const sample = `[
  {
    "genre": "公民",
    "unit": "地方自治",
    "question": "地方公共団体の住民が直接首長や議員の解職を請求する権利を何と呼ぶ？",
    "options": ["解職請求権（リコール）", "住民投票権", "請願権", "請求権"],
    "answerIndex": 0,
    "explanation": "直接請求権の一つで、有権者の一定数以上の署名をもって請求する。"
  }
]`;
    setRawText(sample);
  };

  // Parse and execute import
  const handleExecuteImport = () => {
    sound.playClick();
    setStatusMessage(null);
    const trimmed = rawText.trim();
    if (!trimmed) {
      setStatusMessage({ type: 'error', text: 'インポートするテキストを入力してください。' });
      return;
    }

    const validGenres: Genre[] = ["地理", "日本史", "公民"];
    const parsedQuestions: QuizQuestion[] = [];

    // Try parsing as JSON first
    if (trimmed.startsWith('[') || trimmed.startsWith('{')) {
      try {
        const json = JSON.parse(trimmed);
        const arrayData = Array.isArray(json) ? json : [json];
        for (let i = 0; i < arrayData.length; i++) {
          const item = arrayData[i];
          if (!validGenres.includes(item.genre)) {
            throw new Error(`${i + 1}件目: 科目は「地理」「日本史」「公民」のいずれかを指定してください。`);
          }
          if (!item.question || !Array.isArray(item.options) || item.options.length < 2) {
            throw new Error(`${i + 1}件目: 問題文と選択肢配列が必要です。`);
          }
          parsedQuestions.push({
            id: Date.now() + i,
            genre: item.genre,
            unit: item.unit || "総合特訓",
            question: item.question,
            options: item.options,
            answerIndex: typeof item.answerIndex === 'number' ? item.answerIndex : 0,
            explanation: item.explanation || "解説なし"
          });
        }
      } catch (err: unknown) {
        setStatusMessage({ type: 'error', text: `JSON解析エラー: ${(err as Error).message}` });
        return;
      }
    } else {
      // Parse as CSV
      const lines = trimmed.split('\n').map(l => l.trim()).filter(l => l.length > 0);
      let startIndex = 0;
      // Skip header if present
      if (lines[0].includes('科目') || lines[0].includes('ジャンル') || lines[0].includes('genre')) {
        startIndex = 1;
      }

      for (let i = startIndex; i < lines.length; i++) {
        const parts = lines[i].split(',').map(p => p.trim());
        if (parts.length < 6) {
          setStatusMessage({
            type: 'error',
            text: `CSV ${i + 1}行目の項目数が不足しています。（最低でも 科目,単元,問題文,正解,誤答1,誤答2 が必要です）`
          });
          return;
        }

        const [genreRaw, unit, question, ans, opt1, opt2, opt3, explanation] = parts;
        if (!validGenres.includes(genreRaw as Genre)) {
          setStatusMessage({
            type: 'error',
            text: `CSV ${i + 1}行目: 科目「${genreRaw}」は無効です。「地理」「日本史」「公民」で指定してください。`
          });
          return;
        }

        const options = [ans, opt1, opt2, opt3 || "該当なし"].filter(Boolean);
        parsedQuestions.push({
          id: Date.now() + i,
          genre: genreRaw as Genre,
          unit: unit || "総合特訓",
          question,
          options,
          answerIndex: 0,
          explanation: explanation || "重要事項を確認しておきましょう。"
        });
      }
    }

    if (parsedQuestions.length === 0) {
      setStatusMessage({ type: 'error', text: '有効な問題データを読み取れませんでした。' });
      return;
    }

    let finalQuestions: QuizQuestion[] = [];
    if (importMode === 'replace') {
      finalQuestions = parsedQuestions;
    } else {
      // Append mode (avoid exact duplicate questions by text)
      const existingText = new Set(currentQuestions.map(q => q.question));
      const newlyAdded = parsedQuestions.filter(q => !existingText.has(q.question));
      finalQuestions = [...currentQuestions, ...newlyAdded];
    }

    storage.saveCustomQuestions(finalQuestions);
    onQuestionsUpdated();
    sound.playCorrect();
    setStatusMessage({
      type: 'success',
      text: `🎉 インポート完了！ ${parsedQuestions.length} 問の問題を登録しました。（現在合計: ${finalQuestions.length} 問）`
    });
    setRawText('');
  };

  // Copy all questions to clipboard as CSV or JSON
  const handleExport = (format: 'csv' | 'json') => {
    sound.playClick();
    if (format === 'json') {
      navigator.clipboard.writeText(JSON.stringify(currentQuestions, null, 2));
      alert("全問題データをJSON形式でクリップボードにコピーしました！");
    } else {
      let csv = "科目,単元,問題文,正解,誤答1,誤答2,誤答3,解説\n";
      currentQuestions.forEach(q => {
        const correct = q.options[q.answerIndex] || q.options[0];
        const wrongs = q.options.filter((_, i) => i !== q.answerIndex);
        csv += `"${q.genre}","${q.unit}","${q.question}","${correct}","${wrongs[0] || ''}","${wrongs[1] || ''}","${wrongs[2] || ''}","${q.explanation}"\n`;
      });
      navigator.clipboard.writeText(csv);
      alert("全問題データをCSV形式でクリップボードにコピーしました！");
    }
  };

  // Reset to original default questions
  const handleResetToDefault = () => {
    sound.playClick();
    if (window.confirm("問題データを初期状態（20問）にリセットしますか？")) {
      storage.resetQuestionsToDefault();
      onQuestionsUpdated();
      sound.playCorrect();
      setStatusMessage({ type: 'success', text: '問題データを初期状態に戻しました。' });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md select-none animate-fadeIn">
      <div className="bg-slate-900 border border-indigo-500/50 rounded-2xl max-w-2xl w-full p-4 sm:p-6 shadow-2xl relative max-h-[92vh] flex flex-col">
        {/* Close button */}
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

        {/* Passcode Authentication Screen */}
        {!isAuthenticated ? (
          <div className="my-auto py-8 text-center flex flex-col items-center max-w-sm mx-auto">
            <div className="w-14 h-14 rounded-2xl bg-indigo-950 border border-indigo-500/60 flex items-center justify-center text-indigo-400 mb-3 shadow">
              <Lock className="w-7 h-7" />
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-100 mb-1">
              管理者専用ツール
            </h2>
            <p className="text-xs text-slate-400 mb-5 leading-relaxed">
              問題データの大量追加・編集は教員・管理者のみに制限されています。管理者パスコードを入力してください。
            </p>

            <form onSubmit={handleAuth} className="w-full space-y-3">
              <div>
                <input
                  type="password"
                  placeholder="管理者パスコード"
                  value={passcodeInput}
                  onChange={(e) => setPasscodeInput(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-sm text-center tracking-widest text-slate-100"
                  autoFocus
                />
                {passcodeError && (
                  <p className="text-xs text-rose-400 mt-1 font-bold">
                    パスコードが正しくありません。
                  </p>
                )}
                <p className="text-[11px] text-slate-500 mt-1">
                  （デフォルトパスコード: <span className="font-mono text-indigo-300">admin2026</span>）
                </p>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-400 hover:to-indigo-500 text-white font-bold text-sm shadow-lg shadow-indigo-600/30 transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Unlock className="w-4 h-4" />
                <span>認証して管理画面を開く</span>
              </button>
            </form>
          </div>
        ) : (
          /* Authenticated Admin Dashboard */
          <>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-indigo-950 border border-indigo-500/60 flex items-center justify-center text-indigo-400">
                <Database className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base sm:text-lg font-bold text-slate-100">
                    問題データ一括インポート・管理
                  </h2>
                  <span className="text-[10px] font-bold bg-emerald-950 text-emerald-300 px-2 py-0.5 rounded border border-emerald-700/60">
                    管理者認証済み
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-0.5 text-xs text-slate-300 flex-wrap">
                  <span>現在 <strong className="text-amber-400 font-bold">{currentQuestions.length}問</strong> 収録中</span>
                  <span className="text-slate-600 hidden sm:inline">|</span>
                  <span className="text-rose-400 text-[11px] font-bold">日本史: {genreCounts['日本史'] || 0}問</span>
                  <span className="text-amber-400 text-[11px] font-bold">公民: {genreCounts['公民'] || 0}問</span>
                  <span className="text-emerald-400 text-[11px] font-bold">地理: {genreCounts['地理'] || 0}問</span>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex items-center gap-2 border-b border-slate-800 pb-2 mb-3 text-xs">
              <button
                onClick={() => setActiveTab('import')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'import'
                    ? 'bg-indigo-600 text-white shadow'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Upload className="w-3.5 h-3.5" />
                <span>CSV / JSON 一括インポート</span>
              </button>
              <button
                onClick={() => setActiveTab('list')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'list'
                    ? 'bg-indigo-600 text-white shadow'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>収録問題一覧 & エクスポート</span>
              </button>
            </div>

            {/* Status Feedback */}
            {statusMessage && (
              <div className={`p-2.5 rounded-xl mb-3 text-xs font-medium flex items-center gap-2 ${
                statusMessage.type === 'success'
                  ? 'bg-emerald-950/80 border border-emerald-500/60 text-emerald-200'
                  : 'bg-rose-950/80 border border-rose-500/60 text-rose-200'
              }`}>
                {statusMessage.type === 'success' ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                )}
                <span>{statusMessage.text}</span>
              </div>
            )}

            {/* Tab 1: Import */}
            {activeTab === 'import' && (
              <div className="flex flex-col flex-1 overflow-y-auto space-y-3">
                <div className="flex items-center justify-between gap-2 flex-wrap text-xs">
                  <div className="flex items-center gap-2 text-slate-300">
                    <span>テンプレート挿入:</span>
                    <button
                      onClick={handleInsertCsvSample}
                      className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-indigo-300 border border-slate-700 cursor-pointer"
                    >
                      CSV形式サンプル
                    </button>
                    <button
                      onClick={handleInsertJsonSample}
                      className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700 cursor-pointer"
                    >
                      JSON形式サンプル
                    </button>
                  </div>

                  <div className="flex items-center gap-2 text-slate-300">
                    <span>登録方式:</span>
                    <label className="flex items-center gap-1 cursor-pointer">
                      <input
                        type="radio"
                        checked={importMode === 'append'}
                        onChange={() => setImportMode('append')}
                      />
                      <span>既存に追加</span>
                    </label>
                    <label className="flex items-center gap-1 cursor-pointer">
                      <input
                        type="radio"
                        checked={importMode === 'replace'}
                        onChange={() => setImportMode('replace')}
                      />
                      <span>全置換</span>
                    </label>
                  </div>
                </div>

                <div className="flex-1 flex flex-col">
                  <textarea
                    rows={8}
                    value={rawText}
                    onChange={(e) => setRawText(e.target.value)}
                    placeholder="ここにCSVテキスト（科目,単元,問題文,正解,誤答1,誤答2,誤答3,解説）またはJSONを貼り付けてください..."
                    className="w-full h-44 sm:h-52 p-3 rounded-xl bg-slate-950 border border-slate-700 text-xs font-rpg text-slate-100 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 resize-none leading-relaxed"
                  />
                  <p className="text-[11px] text-slate-500 mt-1">
                    ※ CSV形式の並び順: <strong>科目,単元,問題文,正解,誤答1,誤答2,誤答3,1行解説</strong>（カンマ区切り、改行で複数問一括）
                  </p>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    onClick={handleExecuteImport}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-xs sm:text-sm shadow-lg shadow-emerald-500/25 transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <Upload className="w-4 h-4" />
                    <span>一括インポートを実行する</span>
                  </button>
                </div>
              </div>
            )}

            {/* Tab 2: Question List & Export */}
            {activeTab === 'list' && (() => {
              const filteredQuestions = currentQuestions.filter(q => {
                if (selectedFilterGenre !== 'ALL' && q.genre !== selectedFilterGenre) return false;
                if (searchQuery.trim()) {
                  const query = searchQuery.trim().toLowerCase();
                  return q.question.toLowerCase().includes(query) || q.unit.toLowerCase().includes(query);
                }
                return true;
              });

              return (
                <div className="flex flex-col flex-1 overflow-y-auto space-y-2.5">
                  <div className="flex items-center justify-between gap-2 flex-wrap text-xs">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleExport('csv')}
                        className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-indigo-300 border border-slate-700 cursor-pointer flex items-center gap-1"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>全問題をCSVコピー</span>
                      </button>
                      <button
                        onClick={() => handleExport('json')}
                        className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700 cursor-pointer flex items-center gap-1"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>全問題をJSONコピー</span>
                      </button>
                    </div>

                    <button
                      onClick={handleResetToDefault}
                      className="px-3 py-1.5 rounded-lg bg-rose-950/80 hover:bg-rose-900 text-rose-300 border border-rose-700/60 cursor-pointer flex items-center gap-1"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>初期データに戻す</span>
                    </button>
                  </div>

                  {/* Filter and Search Bar */}
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 pt-1">
                    <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0 text-xs shrink-0">
                      {(['ALL', '日本史', '公民', '地理'] as const).map(genre => (
                        <button
                          key={genre}
                          onClick={() => {
                            sound.playClick();
                            setSelectedFilterGenre(genre);
                            setDisplayLimit(60);
                          }}
                          className={`px-2.5 py-1 rounded-md font-bold transition-colors cursor-pointer text-[11px] whitespace-nowrap ${
                            selectedFilterGenre === genre
                              ? 'bg-indigo-600 text-white shadow'
                              : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                          }`}
                        >
                          {genre === 'ALL' ? `すべて (${currentQuestions.length})` : `${genre} (${genreCounts[genre] || 0})`}
                        </button>
                      ))}
                    </div>

                    <input
                      type="text"
                      placeholder="キーワード・単元名で絞り込み..."
                      value={searchQuery}
                      onChange={(e) => {
                        setSearchQuery(e.target.value);
                        setDisplayLimit(60);
                      }}
                      className="flex-1 px-3 py-1 rounded-lg bg-slate-950 border border-slate-700 focus:border-indigo-500 text-xs text-slate-200"
                    />
                  </div>

                  <div className="text-[11px] text-slate-400 flex items-center justify-between">
                    <span>
                      表示中: {Math.min(filteredQuestions.length, displayLimit)} / {filteredQuestions.length}問
                    </span>
                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery('')}
                        className="text-amber-400 hover:underline cursor-pointer"
                      >
                        検索クリア
                      </button>
                    )}
                  </div>

                  {/* Question Cards List */}
                  <div className="max-h-72 overflow-y-auto space-y-2 pr-1">
                    {filteredQuestions.slice(0, displayLimit).map((q, idx) => (
                      <div
                        key={q.id || idx}
                        className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800 text-xs"
                      >
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <span className={`font-bold px-2 py-0.5 rounded text-[10px] border ${
                            q.genre === '日本史' ? 'bg-rose-950/80 text-rose-300 border-rose-600/50' :
                            q.genre === '公民' ? 'bg-amber-950/80 text-amber-300 border-amber-600/50' :
                            q.genre === '地理' ? 'bg-emerald-950/80 text-emerald-300 border-emerald-600/50' :
                            'bg-blue-950/80 text-blue-300 border-blue-600/50'
                          }`}>
                            {q.genre}
                          </span>
                          <span className="text-[11px] text-slate-300 font-medium">
                            {q.unit}
                          </span>
                          <span className="font-mono text-[10px] text-slate-500 ml-auto">
                            #{q.id}
                          </span>
                        </div>
                        <p className="font-medium text-slate-200 mb-1 leading-snug">
                          {q.question}
                        </p>
                        <div className="text-emerald-400 text-[11px] font-bold">
                          正解: {q.options[q.answerIndex] || q.options[0]}
                        </div>
                        {q.explanation && (
                          <div className="text-slate-400 text-[10px] mt-0.5 leading-snug line-clamp-2">
                            {q.explanation}
                          </div>
                        )}
                      </div>
                    ))}

                    {filteredQuestions.length > displayLimit && (
                      <div className="pt-2 text-center">
                        <button
                          onClick={() => setDisplayLimit(prev => prev + 60)}
                          className="px-4 py-2 rounded-xl bg-indigo-950/80 hover:bg-indigo-900 border border-indigo-700/60 text-indigo-300 text-xs font-bold transition-colors cursor-pointer"
                        >
                          さらに60問表示（残り {filteredQuestions.length - displayLimit}問）
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })()}
          </>
        )}
      </div>
    </div>
  );
};
