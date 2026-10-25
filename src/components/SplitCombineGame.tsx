import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Volume2, ChevronLeft, ArrowRight, RotateCcw, Sparkles, Smile } from 'lucide-react';
import { soundManager } from '../utils/soundEffects';

interface SplitCombineGameProps {
  onAddStar: () => void;
  onBackToMenu: () => void;
  onCompleteGame: () => void;
}

interface SplitRound {
  id: string;
  type: 'tach' | 'gop';
  title: string;
  prompt: string;
  audioPrompt: string;
  totalEmoji: string;
  totalCount: number;
  plate1Emoji: string;
  plate1Count: number;
  plate2Count: number; // The correct answer
  options: number[];
  hint: string;
}

const SPLIT_ROUNDS: SplitRound[] = [
  {
    id: 'sp-1',
    type: 'tach',
    title: 'Tách 3 chiếc kẹo',
    prompt: 'Cô có 3 chiếc kẹo ngọt. Cô tách 1 chiếc vào đĩa Xanh. Đố bé đĩa Hồng còn mấy chiếc kẹo?',
    audioPrompt: 'Cô có ba chiếc kẹo ngọt. Cô tách một chiếc vào đĩa Xanh. Đố bé đĩa Hồng còn mấy chiếc kẹo?',
    totalEmoji: '🍬',
    totalCount: 3,
    plate1Emoji: '🍬',
    plate1Count: 1,
    plate2Count: 2,
    options: [1, 2, 3],
    hint: '3 bớt 1 thì còn 2 chiếc kẹo đó bé!',
  },
  {
    id: 'sp-2',
    type: 'tach',
    title: 'Tách 4 quả táo đỏ',
    prompt: 'Có 4 quả táo. Cô để 2 quả vào đĩa Xanh rồi. Đĩa Hồng còn lại mấy quả táo vậy bé?',
    audioPrompt: 'Có bốn quả táo. Cô để hai quả vào đĩa Xanh rồi. Đĩa Hồng còn lại mấy quả táo vậy bé?',
    totalEmoji: '🍎',
    totalCount: 4,
    plate1Emoji: '🍎',
    plate1Count: 2,
    plate2Count: 2,
    options: [1, 2, 3],
    hint: '4 quả táo chia đều: 2 quả đĩa Xanh và 2 quả đĩa Hồng!',
  },
  {
    id: 'sp-3',
    type: 'gop',
    title: 'Gộp quả dâu tây',
    prompt: 'Đĩa Xanh có 1 quả dâu, đĩa Hồng có 2 quả dâu. Khi gộp chung lại có tất cả mấy quả dâu?',
    audioPrompt: 'Đĩa Xanh có một quả dâu, đĩa Hồng có hai quả dâu. Khi gộp chung lại có tất cả mấy quả dâu?',
    totalEmoji: '🍓',
    totalCount: 3,
    plate1Emoji: '🍓',
    plate1Count: 1,
    plate2Count: 3, // Target total
    options: [2, 3, 4],
    hint: '1 quả dâu gộp với 2 quả dâu là được 3 quả dâu thơm ngọt!',
  },
];

export const SplitCombineGame: React.FC<SplitCombineGameProps> = ({
  onAddStar,
  onBackToMenu,
  onCompleteGame,
}) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedNum, setSelectedNum] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [isFinished, setIsFinished] = useState(false);
  const [shake, setShake] = useState(false);

  const round = SPLIT_ROUNDS[currentIdx];

  useEffect(() => {
    setSelectedNum(null);
    setIsCorrect(null);
    const timer = setTimeout(() => {
      soundManager.speakVietnamese(round.audioPrompt);
    }, 400);
    return () => clearTimeout(timer);
  }, [currentIdx]);

  const handleSpeak = () => {
    soundManager.speakVietnamese(round.audioPrompt);
  };

  const handleSelect = (num: number) => {
    if (isCorrect === true) return;

    setSelectedNum(num);

    if (num === round.plate2Count) {
      setIsCorrect(true);
      soundManager.playSuccess();
      onAddStar();

      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
      });

      soundManager.speakVietnamese('Tuyệt vời! Bé tính phép tách gộp quá chuẩn xác!');
    } else {
      setIsCorrect(false);
      setShake(true);
      soundManager.playTryAgain();
      soundManager.speakVietnamese('Chưa đúng rồi bé ơi! Bé đếm lại số lượng kẹo trên từng đĩa nhé!');
      setTimeout(() => setShake(false), 500);
    }
  };

  const handleNext = () => {
    soundManager.playClick();
    if (currentIdx < SPLIT_ROUNDS.length - 1) {
      setCurrentIdx(prev => prev + 1);
    } else {
      setIsFinished(true);
      soundManager.playFanfare();
      onCompleteGame();
      confetti({
        particleCount: 150,
        spread: 100,
        origin: { y: 0.4 },
      });
      soundManager.speakVietnamese('Chúc mừng bé! Bé đã hoàn thành xuất sắc các bài học Bếp Tách Gộp!');
    }
  };

  const handleRestart = () => {
    soundManager.playClick();
    setCurrentIdx(0);
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
          <span className="text-xs sm:text-sm font-bold bg-pink-100 text-pink-900 px-3 py-1 rounded-full border border-pink-300">
            🍬 Bài {currentIdx + 1} / {SPLIT_ROUNDS.length} • Bếp Tách Gộp
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
        <div className="bg-gradient-to-b from-pink-50 via-purple-50 to-amber-50 rounded-3xl p-5 sm:p-8 shadow-xl border-4 border-pink-300">
          
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-2 bg-white/90 px-4 py-1 rounded-full shadow-xs border border-pink-200 mb-2">
              <span className="text-xl">🍬</span>
              <h2 className="text-base sm:text-xl font-black text-pink-950">
                Trạm 4: Bếp Tách – Gộp Số Lượng
              </h2>
              <span className="text-xl">✨</span>
            </div>

            <h3 className="text-xl sm:text-3xl font-black text-stone-900 mt-2 leading-snug">
              {round.prompt}
            </h3>

            <p className="text-xs sm:text-sm text-stone-600 font-bold mt-1">
              💡 {round.hint}
            </p>
          </div>

          {/* Interactive Plates Scene */}
          <div className="bg-white/90 rounded-3xl p-6 sm:p-8 mb-6 border-3 border-pink-200 shadow-sm flex flex-col md:flex-row items-center justify-around gap-6">
            
            {/* Plate 1 (Đĩa Xanh) */}
            <div className="flex flex-col items-center">
              <span className="text-xs font-black uppercase text-sky-800 bg-sky-100 px-3 py-1 rounded-full border border-sky-300 mb-2">
                Đĩa Màu Xanh ({round.plate1Count})
              </span>
              <div className="w-36 sm:w-44 h-36 sm:h-44 rounded-full bg-gradient-to-tr from-sky-200 to-blue-100 border-4 border-sky-400 shadow-md flex items-center justify-center gap-2 flex-wrap p-4">
                {Array.from({ length: round.plate1Count }).map((_, i) => (
                  <span key={i} className="text-4xl sm:text-5xl animate-bounce-slow">
                    {round.plate1Emoji}
                  </span>
                ))}
              </div>
            </div>

            <div className="text-3xl font-black text-pink-400">
              {round.type === 'tach' ? '👉' : '➕'}
            </div>

            {/* Plate 2 (Đĩa Hồng - Dấu hỏi hoặc Kết quả) */}
            <div className="flex flex-col items-center">
              <span className="text-xs font-black uppercase text-pink-800 bg-pink-100 px-3 py-1 rounded-full border border-pink-300 mb-2">
                Đĩa Màu Hồng (❓)
              </span>
              <div className="w-36 sm:w-44 h-36 sm:h-44 rounded-full bg-gradient-to-tr from-pink-200 to-rose-100 border-4 border-dashed border-pink-400 shadow-md flex items-center justify-center p-4">
                {isCorrect ? (
                  <div className="flex flex-wrap items-center justify-center gap-2">
                    {Array.from({ length: round.plate2Count }).map((_, i) => (
                      <span key={i} className="text-4xl sm:text-5xl animate-bounce">
                        {round.totalEmoji}
                      </span>
                    ))}
                  </div>
                ) : (
                  <span className="text-5xl font-black text-pink-700 animate-pulse">❓</span>
                )}
              </div>
            </div>

          </div>

          {/* Options Selection */}
          <div className="text-center mb-2">
            <span className="text-xs sm:text-sm font-black text-stone-700 uppercase tracking-wide">
              👇 Bé hãy chọn số lượng kẹo phù hợp nhé:
            </span>
          </div>

          <div className={`grid grid-cols-3 gap-3 sm:gap-4 max-w-md mx-auto ${shake ? 'animate-shake' : ''}`}>
            {round.options.map((num) => {
              const isSelected = selectedNum === num;
              const isOptionCorrect = isSelected && isCorrect === true;
              const isOptionWrong = isSelected && isCorrect === false;

              return (
                <button
                  key={num}
                  onClick={() => handleSelect(num)}
                  className={`p-4 sm:p-5 rounded-2xl bg-white border-4 transition-all transform active:scale-95 flex flex-col items-center justify-center ${
                    isOptionCorrect
                      ? 'border-emerald-500 bg-emerald-50 ring-4 ring-emerald-300 scale-105'
                      : isOptionWrong
                      ? 'border-red-400 bg-red-50'
                      : 'border-stone-200 hover:border-pink-400 shadow-sm'
                  }`}
                >
                  <span className="text-3xl sm:text-4xl font-black text-stone-900">{num}</span>
                  <span className="text-xs font-bold text-stone-500 mt-1">{num} chiếc</span>
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
                        Chính xác rồi! Bé tách gộp số rất nhanh nhẹn! 🎉
                      </p>
                      <p className="text-xs sm:text-sm font-bold text-emerald-700">
                        Cô Nguyễn Thị Huyền tặng bé 1 Ngôi sao vàng!
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={handleNext}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-black px-6 py-3 rounded-2xl shadow-lg border-2 border-white active:scale-95 text-base transition-all"
                  >
                    <span>{currentIdx < SPLIT_ROUNDS.length - 1 ? 'Bài tiếp theo' : 'Xem kết quả'}</span>
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </>
              ) : (
                <div className="flex items-center gap-3 text-rose-800 bg-rose-50 p-2 rounded-xl w-full justify-center">
                  <Smile className="w-6 h-6 text-rose-600" />
                  <span className="font-extrabold text-sm sm:text-base">
                    Chưa đúng rồi bé ơi! Bé đếm lại xem tổng số lượng là mấy nhé!
                  </span>
                </div>
              )}
            </div>
          )}

        </div>
      ) : (
        /* Completed */
        <div className="bg-gradient-to-b from-pink-100 via-purple-50 to-amber-100 rounded-3xl p-6 sm:p-10 shadow-xl border-4 border-pink-300 text-center">
          <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-tr from-pink-500 to-purple-400 text-white flex items-center justify-center text-5xl shadow-xl mb-4 animate-bounce">
            🍬
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-pink-950 mb-2">
            Đầu Bếp Nhí Tách Gộp Xuất Sắc!
          </h2>

          <p className="text-base sm:text-lg font-bold text-stone-700 max-w-md mx-auto mb-4">
            Bé đã biết cách tách một nhóm thành hai phần và gộp hai phần lại thành nhóm ban đầu!
          </p>

          <div className="bg-white/90 p-4 rounded-2xl max-w-md mx-auto border-2 border-pink-200 shadow-sm mb-6 text-emerald-900 font-extrabold">
            🌟 Cô giáo Nguyễn Thị Huyền: "Bé lớp 3 Tuổi C2 tư duy toán học rất tốt!"
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={handleRestart}
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-pink-500 hover:bg-pink-600 text-white font-black px-6 py-3 rounded-2xl shadow-md border-2 border-white active:scale-95 transition-all"
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
