import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Volume2, RotateCcw, ArrowRight, ChevronLeft, Sparkles, Smile } from 'lucide-react';
import { soundManager } from '../utils/soundEffects';

interface PatternTrainGameProps {
  onAddStar: () => void;
  onBackToMenu: () => void;
  onCompleteGame: () => void;
}

interface TrainRound {
  id: string;
  title: string;
  prompt: string;
  audioPrompt: string;
  carriages: Array<{ id: string; emoji: string; name: string }>;
  options: Array<{ id: string; emoji: string; name: string; isCorrect: boolean }>;
  hint: string;
}

const TRAIN_ROUNDS: TrainRound[] = [
  {
    id: 'tr-1',
    title: 'Toa tàu Trái Cây',
    prompt: 'Bé hãy nhìn: Táo đỏ - Cam vàng - Táo đỏ - Cam vàng. Toa tiếp theo bé sẽ chở quả gì?',
    audioPrompt: 'Bé hãy nhìn: Táo đỏ, Cam vàng, Táo đỏ, Cam vàng. Toa tiếp theo bé sẽ chở quả gì?',
    carriages: [
      { id: 'c1', emoji: '🍎', name: 'Táo' },
      { id: 'c2', emoji: '🍊', name: 'Cam' },
      { id: 'c3', emoji: '🍎', name: 'Táo' },
      { id: 'c4', emoji: '🍊', name: 'Cam' },
    ],
    options: [
      { id: 'opt-apple', emoji: '🍎', name: 'Quả Táo Đỏ', isCorrect: true },
      { id: 'opt-banana', emoji: '🍌', name: 'Quả Chuối', isCorrect: false },
      { id: 'opt-grape', emoji: '🍇', name: 'Chùm Nho', isCorrect: false },
    ],
    hint: 'Bé đọc to nhịp điệu: Táo rồi Cam, Táo rồi Cam, tiếp theo lại là Táo!',
  },
  {
    id: 'tr-2',
    title: 'Toa tàu Ngôi Sao & Trái Tim',
    prompt: 'Quy tắc: Ngôi sao - Trái tim - Ngôi sao - Trái tim. Tiếp theo là hình gì nào bé ơi?',
    audioPrompt: 'Quy tắc: Ngôi sao, Trái tim, Ngôi sao, Trái tim. Tiếp theo là hình gì nào bé ơi?',
    carriages: [
      { id: 'c1', emoji: '⭐', name: 'Sao' },
      { id: 'c2', emoji: '💖', name: 'Tim' },
      { id: 'c3', emoji: '⭐', name: 'Sao' },
      { id: 'c4', emoji: '💖', name: 'Tim' },
    ],
    options: [
      { id: 'opt-star', emoji: '⭐', name: 'Ngôi Sao Vàng', isCorrect: true },
      { id: 'opt-heart', emoji: '💖', name: 'Trái Tim Hồng', isCorrect: false },
      { id: 'opt-moon', emoji: '🌙', name: 'Mặt Trăng', isCorrect: false },
    ],
    hint: 'Sau bạn Trái tim hồng thì bạn Ngôi sao vàng sẽ lên tàu nhé!',
  },
  {
    id: 'tr-3',
    title: 'Toa tàu Thú Cưng',
    prompt: 'Các bạn thú lên tàu: Cún con - Mèo con - Cún con - Mèo con. Toa trống là bạn nào?',
    audioPrompt: 'Các bạn thú lên tàu: Cún con, Mèo con, Cún con, Mèo con. Toa trống là bạn nào?',
    carriages: [
      { id: 'c1', emoji: '🐶', name: 'Cún' },
      { id: 'c2', emoji: '🐱', name: 'Mèo' },
      { id: 'c3', emoji: '🐶', name: 'Cún' },
      { id: 'c4', emoji: '🐱', name: 'Mèo' },
    ],
    options: [
      { id: 'opt-dog', emoji: '🐶', name: 'Chú Cún Con', isCorrect: true },
      { id: 'opt-duck', emoji: '🦆', name: 'Chú Vịt Vàng', isCorrect: false },
      { id: 'opt-cat', emoji: '🐱', name: 'Chú Mèo Con', isCorrect: false },
    ],
    hint: 'Cún rồi Mèo, lặp lại: Cún rồi Mèo, vậy tiếp theo là chú Cún!',
  },
];

export const PatternTrainGame: React.FC<PatternTrainGameProps> = ({
  onAddStar,
  onBackToMenu,
  onCompleteGame,
}) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [isFinished, setIsFinished] = useState(false);
  const [trainMoving, setTrainMoving] = useState(false);
  const [shake, setShake] = useState(false);

  const round = TRAIN_ROUNDS[currentIdx];

  // Auto speak on round change
  React.useEffect(() => {
    const timer = setTimeout(() => {
      soundManager.speakVietnamese(round.audioPrompt);
    }, 400);
    return () => clearTimeout(timer);
  }, [currentIdx]);

  const handleSpeak = () => {
    soundManager.speakVietnamese(round.audioPrompt);
  };

  const handleSelectOption = (optId: string, isOptCorrect: boolean) => {
    if (isCorrect === true) return;

    setSelectedId(optId);

    if (isOptCorrect) {
      setIsCorrect(true);
      setTrainMoving(true);
      soundManager.playSuccess();
      onAddStar();

      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
      });

      soundManager.speakVietnamese('Đúng rồi! Bé đã tìm đúng quy luật, đoàn tàu píp píp khởi hành nào!');
    } else {
      setIsCorrect(false);
      setShake(true);
      soundManager.playTryAgain();
      soundManager.speakVietnamese('Chưa đúng rồi bé ơi! Bé đọc to nhịp điệu từ đầu để tìm quy luật nhé!');
      setTimeout(() => setShake(false), 500);
    }
  };

  const handleNext = () => {
    soundManager.playClick();
    if (currentIdx < TRAIN_ROUNDS.length - 1) {
      setCurrentIdx(prev => prev + 1);
      setSelectedId(null);
      setIsCorrect(null);
      setTrainMoving(false);
    } else {
      setIsFinished(true);
      soundManager.playFanfare();
      onCompleteGame();
      confetti({
        particleCount: 150,
        spread: 100,
        origin: { y: 0.4 },
      });
      soundManager.speakVietnamese('Hoan hô bé! Bé đã xếp đúng tất cả toa tàu theo quy tắc rất tuyệt vời!');
    }
  };

  const handleRestart = () => {
    soundManager.playClick();
    setCurrentIdx(0);
    setSelectedId(null);
    setIsCorrect(null);
    setTrainMoving(false);
    setIsFinished(false);
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-3 sm:px-4 py-4 select-none">
      
      {/* Top Header */}
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <button
          onClick={() => {
            soundManager.playClick();
            onBackToMenu();
          }}
          className="flex items-center gap-1.5 bg-white hover:bg-stone-50 text-stone-700 font-extrabold px-4 py-2 rounded-2xl shadow-sm border border-stone-300 text-sm active:scale-95 transition-all"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Về trang chủ</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="text-xs sm:text-sm font-bold bg-rose-100 text-rose-900 px-3 py-1 rounded-full border border-rose-300">
            🚂 Toa {currentIdx + 1} / {TRAIN_ROUNDS.length}
          </span>
          <button
            onClick={handleSpeak}
            className="flex items-center gap-1 bg-amber-400 hover:bg-amber-500 text-amber-950 font-black px-3.5 py-1.5 rounded-2xl shadow-sm text-xs sm:text-sm active:scale-95 transition-all"
          >
            <Volume2 className="w-4 h-4" />
            <span>Nghe câu hỏi</span>
          </button>
        </div>
      </div>

      {!isFinished ? (
        <div className="bg-gradient-to-b from-rose-50 via-amber-50 to-emerald-50 rounded-3xl p-5 sm:p-7 shadow-xl border-4 border-rose-300">
          
          <div className="text-center mb-5">
            <div className="inline-flex items-center gap-2 bg-white/90 px-4 py-1 rounded-full shadow-xs border border-rose-200 mb-2">
              <span className="text-xl">🚂</span>
              <h2 className="text-base sm:text-xl font-black text-rose-900">
                Trò Chơi: Đoàn Tàu Quy Tắc (Pattern Train)
              </h2>
              <span className="text-xl">✨</span>
            </div>
            
            <h3 className="text-lg sm:text-2xl font-black text-stone-900 mt-1 leading-snug">
              {round.prompt}
            </h3>
            
            <p className="text-xs sm:text-sm text-stone-600 font-bold mt-1">
              💡 {round.hint}
            </p>
          </div>

          {/* Train Railway Scene */}
          <div className="bg-gradient-to-b from-sky-200 to-emerald-100 rounded-3xl p-4 sm:p-6 mb-6 shadow-inner border-2 border-emerald-300 overflow-x-auto">
            <div className={`flex items-center gap-2 sm:gap-3 py-2 transition-transform duration-700 min-w-max ${trainMoving ? 'translate-x-2' : ''}`}>
              
              {/* Locomotive (Đầu tàu) */}
              <div className="flex flex-col items-center">
                <div className="w-20 sm:w-24 h-24 sm:h-28 bg-gradient-to-tr from-rose-600 to-red-500 text-white rounded-t-3xl rounded-b-xl border-4 border-amber-300 shadow-md flex flex-col items-center justify-between p-2">
                  <span className="text-2xl sm:text-3xl animate-bounce-slow">💨</span>
                  <span className="text-2xl sm:text-3xl">🚂</span>
                  <span className="text-[10px] font-black bg-white/30 px-2 rounded-full">Đầu tàu</span>
                </div>
                <div className="flex gap-4 -mt-2">
                  <div className="w-5 h-5 rounded-full bg-stone-800 border-2 border-stone-400" />
                  <div className="w-5 h-5 rounded-full bg-stone-800 border-2 border-stone-400" />
                </div>
              </div>

              {/* Fixed Carriages */}
              {round.carriages.map((c, i) => (
                <div key={c.id} className="flex flex-col items-center">
                  <div className="w-18 sm:w-22 h-20 sm:h-24 bg-white/90 border-4 border-amber-400 rounded-2xl shadow-sm flex flex-col items-center justify-center p-2">
                    <span className="text-3xl sm:text-4xl drop-shadow">{c.emoji}</span>
                    <span className="text-[10px] font-bold text-stone-600 mt-1">{c.name}</span>
                  </div>
                  <div className="flex gap-4 -mt-2">
                    <div className="w-4 h-4 rounded-full bg-stone-700 border border-stone-300" />
                    <div className="w-4 h-4 rounded-full bg-stone-700 border border-stone-300" />
                  </div>
                </div>
              ))}

              {/* Missing Carriage Slot [ ? ] */}
              <div className="flex flex-col items-center">
                <div className={`w-20 sm:w-24 h-20 sm:h-24 rounded-2xl border-4 border-dashed shadow-sm flex flex-col items-center justify-center p-2 transition-all ${
                  isCorrect
                    ? 'bg-emerald-100 border-emerald-500 scale-105'
                    : 'bg-amber-100/80 border-amber-500 animate-pulse'
                }`}>
                  {isCorrect ? (
                    <>
                      <span className="text-4xl sm:text-5xl animate-bounce">
                        {round.options.find(o => o.isCorrect)?.emoji}
                      </span>
                      <span className="text-[10px] font-black text-emerald-800">Chuẩn luôn!</span>
                    </>
                  ) : (
                    <>
                      <span className="text-3xl font-black text-amber-800">❓</span>
                      <span className="text-[10px] font-black text-amber-900">Toa còn thiếu</span>
                    </>
                  )}
                </div>
                <div className="flex gap-4 -mt-2">
                  <div className="w-4 h-4 rounded-full bg-stone-700 border border-stone-300" />
                  <div className="w-4 h-4 rounded-full bg-stone-700 border border-stone-300" />
                </div>
              </div>

            </div>

            {/* Railway tracks */}
            <div className="w-full border-b-4 border-stone-600 mt-2 flex justify-between">
              {Array.from({ length: 14 }).map((_, idx) => (
                <div key={idx} className="w-2 h-3 bg-stone-700" />
              ))}
            </div>
          </div>

          {/* Options to Choose */}
          <div className="text-center mb-2">
            <span className="text-xs sm:text-sm font-black text-stone-700 uppercase tracking-wide">
              👇 Bé hãy chọn đồ vật tiếp theo cho toa tàu nhé:
            </span>
          </div>

          <div className={`grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-xl mx-auto ${shake ? 'animate-shake' : ''}`}>
            {round.options.map((opt) => {
              const isSelected = selectedId === opt.id;
              const isOptCorrect = isSelected && isCorrect === true;
              const isOptWrong = isSelected && isCorrect === false;

              return (
                <button
                  key={opt.id}
                  onClick={() => handleSelectOption(opt.id, opt.isCorrect)}
                  className={`p-4 rounded-2xl bg-white border-3 transition-all transform active:scale-95 flex flex-col items-center justify-center gap-1 ${
                    isOptCorrect
                      ? 'border-emerald-500 bg-emerald-50 ring-4 ring-emerald-300 scale-105 shadow-md'
                      : isOptWrong
                      ? 'border-red-400 bg-red-50'
                      : 'border-stone-200 hover:border-rose-400 hover:shadow-sm'
                  }`}
                >
                  <span className="text-4xl sm:text-5xl drop-shadow">{opt.emoji}</span>
                  <span className="text-xs sm:text-sm font-black text-stone-800 mt-1">
                    {opt.name}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Feedback */}
          {isCorrect !== null && (
            <div className="mt-5 p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 shadow-md border-2 animate-fade-in text-center sm:text-left">
              {isCorrect ? (
                <>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-emerald-500 text-white flex items-center justify-center text-2xl shadow">
                      ⭐
                    </div>
                    <div>
                      <p className="text-base sm:text-lg font-black text-emerald-900">
                        Tuyệt vời! Bé sắp xếp quy tắc quá siêu! 🎉
                      </p>
                      <p className="text-xs sm:text-sm font-bold text-emerald-700">
                        Đoàn tàu píp píp khởi hành chở đầy ngôi sao vàng!
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={handleNext}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-black px-6 py-3 rounded-2xl shadow-lg border-2 border-white active:scale-95 text-base transition-all"
                  >
                    <span>{currentIdx < TRAIN_ROUNDS.length - 1 ? 'Toa tiếp theo' : 'Xem kết quả'}</span>
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </>
              ) : (
                <div className="flex items-center gap-3 text-rose-800 bg-rose-50 p-2 rounded-xl w-full justify-center">
                  <Smile className="w-6 h-6 text-rose-600" />
                  <span className="font-extrabold text-sm sm:text-base">
                    Chưa đúng rồi bé ơi! Bé nhìn lại nhịp điệu lặp lại nhé!
                  </span>
                </div>
              )}
            </div>
          )}

        </div>
      ) : (
        /* Completed */
        <div className="bg-gradient-to-b from-rose-100 via-amber-50 to-emerald-100 rounded-3xl p-6 sm:p-10 shadow-xl border-4 border-rose-300 text-center">
          <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-tr from-rose-500 to-orange-400 text-white flex items-center justify-center text-5xl shadow-xl mb-4 animate-bounce">
            🚂
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-rose-900 mb-2">
            Bé Là Lái Tàu Quy Tắc Xuất Sắc!
          </h2>

          <p className="text-base sm:text-lg font-bold text-stone-700 max-w-md mx-auto mb-4">
            Bé đã nhận biết và sắp xếp chuẩn xác mọi quy luật lặp của hoa quả, hình khối và con vật!
          </p>

          <div className="bg-white/90 p-4 rounded-2xl max-w-md mx-auto border-2 border-rose-200 shadow-sm mb-6 text-rose-950 font-extrabold">
            🌟 Cô giáo Nguyễn Thị Huyền tặng bé 2 Ngôi Sao Vàng!
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={handleRestart}
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-rose-500 hover:bg-rose-600 text-white font-black px-6 py-3 rounded-2xl shadow-md border-2 border-white active:scale-95 transition-all"
            >
              <RotateCcw className="w-5 h-5" />
              <span>Chơi lại lần nữa</span>
            </button>

            <button
              onClick={() => {
                soundManager.playClick();
                onBackToMenu();
              }}
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white font-black px-6 py-3 rounded-2xl shadow-md border-2 border-white active:scale-95 transition-all"
            >
              <span>Về màn hình chính</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
