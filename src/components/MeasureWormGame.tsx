import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Volume2, ChevronLeft, ArrowRight, RotateCcw, Sparkles, Smile } from 'lucide-react';
import { soundManager } from '../utils/soundEffects';

interface MeasureWormGameProps {
  onAddStar: () => void;
  onBackToMenu: () => void;
  onCompleteGame: () => void;
}

interface WormRound {
  id: string;
  segments: number; // Correct length
  title: string;
  prompt: string;
  audioPrompt: string;
  hint: string;
}

const WORM_ROUNDS: WormRound[] = [
  {
    id: 'wm-1',
    segments: 2,
    title: 'Đo chú sâu nhỏ',
    prompt: 'Bé hãy đếm xem chú sâu xanh dài bằng mấy đốt ô vuông thước đo nhé?',
    audioPrompt: 'Bé hãy đếm xem chú sâu xanh dài bằng mấy đốt ô vuông thước đo nhé?',
    hint: 'Bé đếm các đốt ô: Một, hai đốt ô vuông!',
  },
  {
    id: 'wm-2',
    segments: 3,
    title: 'Chú sâu lớn hơn',
    prompt: 'Chú sâu này dài bằng bao nhiêu đốt ô vậy bé ơi?',
    audioPrompt: 'Chú sâu này dài bằng bao nhiêu đốt ô vậy bé ơi?',
    hint: 'Bé đếm từng đốt ô thẳng hàng dưới thân chú sâu nhé: 1, 2, 3 đốt!',
  },
  {
    id: 'wm-3',
    segments: 4,
    title: 'Chú sâu dài thướt tha',
    prompt: 'Đố bé biết chú sâu dài này có độ dài bằng mấy đốt ô vuông?',
    audioPrompt: 'Đố bé biết chú sâu dài này có độ dài bằng mấy đốt ô vuông?',
    hint: 'Đếm từ đầu đến đuôi chú sâu nào: 1, 2, 3, 4 đốt ô vuông!',
  },
];

export const MeasureWormGame: React.FC<MeasureWormGameProps> = ({
  onAddStar,
  onBackToMenu,
  onCompleteGame,
}) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedNum, setSelectedNum] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [isFinished, setIsFinished] = useState(false);
  const [shake, setShake] = useState(false);

  const round = WORM_ROUNDS[currentIdx];

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

    if (num === round.segments) {
      setIsCorrect(true);
      soundManager.playSuccess();
      onAddStar();

      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
      });

      soundManager.speakVietnamese(`Chính xác! Chú sâu dài bằng đúng ${round.segments} đốt ô! Bé đo siêu quá!`);
    } else {
      setIsCorrect(false);
      setShake(true);
      soundManager.playTryAgain();
      soundManager.speakVietnamese('Chưa đúng rồi bé ơi! Bé chạm vào từng đốt ô dưới thân chú sâu để đếm lại nhé!');
      setTimeout(() => setShake(false), 500);
    }
  };

  const handleNext = () => {
    soundManager.playClick();
    if (currentIdx < WORM_ROUNDS.length - 1) {
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
      soundManager.speakVietnamese('Tuyệt vời! Bé đã xuất sắc làm chủ kỹ năng đo độ dài bằng đơn vị que tính!');
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
          <span className="text-xs sm:text-sm font-bold bg-teal-100 text-teal-900 px-3 py-1 rounded-full border border-teal-300">
            📏 Bài {currentIdx + 1} / {WORM_ROUNDS.length} • Đo Chú Sâu
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
        <div className="bg-gradient-to-b from-teal-50 via-emerald-50 to-amber-50 rounded-3xl p-5 sm:p-8 shadow-xl border-4 border-teal-300">
          
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-2 bg-white/90 px-4 py-1 rounded-full shadow-xs border border-teal-200 mb-2">
              <span className="text-xl">📏</span>
              <h2 className="text-base sm:text-xl font-black text-teal-950">
                Trạm 8: Đo Chú Sâu (Đo Độ Dài Đơn Vị Mầm Non)
              </h2>
              <span className="text-xl">🐛</span>
            </div>

            <h3 className="text-lg sm:text-2xl font-black text-stone-900 mt-2 leading-snug">
              {round.prompt}
            </h3>

            <p className="text-xs sm:text-sm text-stone-600 font-bold mt-1">
              💡 {round.hint}
            </p>
          </div>

          {/* Interactive Worm Measuring Scene */}
          <div className="bg-gradient-to-b from-sky-100 to-emerald-100 rounded-3xl p-6 sm:p-8 mb-6 border-3 border-teal-300 shadow-inner flex flex-col items-center justify-center">
            
            {/* The Caterpillar (Chú sâu xanh uốn lượn) */}
            <div className="flex items-center justify-center mb-4 min-h-[80px]">
              {/* Head */}
              <div className="w-14 h-14 rounded-full bg-emerald-500 border-3 border-emerald-700 shadow-md flex items-center justify-center text-2xl z-10 -mr-2">
                🐛
              </div>
              {/* Body segments */}
              {Array.from({ length: round.segments }).map((_, i) => (
                <div
                  key={i}
                  className="w-12 sm:w-14 h-12 sm:h-14 rounded-full bg-gradient-to-tr from-lime-400 to-emerald-400 border-3 border-emerald-600 shadow-sm flex items-center justify-center -mr-2 font-black text-xs text-emerald-950 animate-bounce-slow"
                  style={{ animationDelay: `${i * 0.15}s` }}
                >
                  {i + 1}
                </div>
              ))}
              {/* Tail */}
              <div className="w-8 h-8 rounded-full bg-lime-500 border-2 border-emerald-600 -ml-1" />
            </div>

            {/* Tree Branch branch under the worm */}
            <div className="w-full max-w-md h-4 bg-amber-800 rounded-full shadow-sm mb-4 relative">
              <div className="absolute right-2 -top-2 text-sm">🍃</div>
              <div className="absolute left-4 -bottom-1 text-sm">🌱</div>
            </div>

            {/* Ruler Units (Thước đo ô vuông mầm non) */}
            <div className="w-full max-w-md bg-white/90 p-3 rounded-2xl border-2 border-teal-300 shadow-sm flex flex-col items-center">
              <span className="text-[11px] font-black uppercase text-teal-800 mb-2">
                📐 THƯỚC ĐO Ô VUÔNG CỦA BÉ
              </span>
              <div className="flex items-center justify-center gap-1 sm:gap-2">
                {Array.from({ length: 5 }).map((_, idx) => {
                  const isUnderWorm = idx < round.segments;
                  return (
                    <div
                      key={idx}
                      className={`w-12 sm:w-14 h-10 sm:h-12 rounded-xl flex flex-col items-center justify-center font-black text-sm border-2 transition-all ${
                        isUnderWorm
                          ? 'bg-teal-200 border-teal-500 text-teal-950 scale-102 shadow-xs'
                          : 'bg-stone-100 border-stone-300 text-stone-400'
                      }`}
                    >
                      <span>{idx + 1}</span>
                      <span className="text-[9px] font-bold">đốt</span>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>

          {/* Answer Options */}
          <div className="text-center mb-2">
            <span className="text-xs sm:text-sm font-black text-stone-700 uppercase tracking-wide">
              👇 Bé chọn độ dài chú sâu nhé:
            </span>
          </div>

          <div className={`grid grid-cols-3 gap-3 sm:gap-4 max-w-md mx-auto ${shake ? 'animate-shake' : ''}`}>
            {[2, 3, 4].map((num) => {
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
                      : 'border-stone-200 hover:border-teal-400 shadow-sm'
                  }`}
                >
                  <span className="text-3xl sm:text-4xl font-black text-stone-900">{num}</span>
                  <span className="text-xs font-bold text-stone-500 mt-1">{num} đốt ô</span>
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
                        Chính xác! Chú sâu dài {round.segments} đốt ô vuông! 🎉
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
                    <span>{currentIdx < WORM_ROUNDS.length - 1 ? 'Bài tiếp theo' : 'Xem kết quả'}</span>
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </>
              ) : (
                <div className="flex items-center gap-3 text-rose-800 bg-rose-50 p-2 rounded-xl w-full justify-center">
                  <Smile className="w-6 h-6 text-rose-600" />
                  <span className="font-extrabold text-sm sm:text-base">
                    Chưa đúng rồi bé ơi! Bé đếm lại các ô vuông xem nào!
                  </span>
                </div>
              )}
            </div>
          )}

        </div>
      ) : (
        /* Completed */
        <div className="bg-gradient-to-b from-teal-100 via-emerald-50 to-amber-100 rounded-3xl p-6 sm:p-10 shadow-xl border-4 border-teal-300 text-center">
          <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-tr from-teal-500 to-emerald-400 text-white flex items-center justify-center text-5xl shadow-xl mb-4 animate-bounce">
            📏
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-teal-950 mb-2">
            Bé Đo Độ Dài Thật Chuẩn Xác!
          </h2>

          <p className="text-base sm:text-lg font-bold text-stone-700 max-w-md mx-auto mb-4">
            Bé đã biết đặt thước đo và đếm số đốt ô vuông để đo chiều dài của đồ vật!
          </p>

          <div className="bg-white/90 p-4 rounded-2xl max-w-md mx-auto border-2 border-teal-200 shadow-sm mb-6 text-emerald-900 font-extrabold">
            🌟 Cô giáo Nguyễn Thị Huyền tặng bé 2 Ngôi Sao Vàng!
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={handleRestart}
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-teal-500 hover:bg-teal-600 text-white font-black px-6 py-3 rounded-2xl shadow-md border-2 border-white active:scale-95 transition-all"
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
