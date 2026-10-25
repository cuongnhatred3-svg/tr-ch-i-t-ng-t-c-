import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Volume2, RotateCcw, ArrowRight, Award, Heart, Sparkles, Smile } from 'lucide-react';
import { soundManager } from '../utils/soundEffects';

interface RabbitCarrotGameProps {
  onAddStar: () => void;
  onAddCarrot: () => void;
  onBackToMenu: () => void;
  onCompleteGame: () => void;
}

interface GameRound {
  targetCount: number;
  questionText: string;
  options: number[];
  hint: string;
}

const GAME_ROUNDS: GameRound[] = [
  {
    targetCount: 1,
    questionText: 'Bé hãy nhìn xem trên luống đất có mấy củ cà rốt nào?',
    options: [1, 2, 3],
    hint: 'Bé đếm cùng chú thỏ: Có 1 củ cà rốt mập mạp!',
  },
  {
    targetCount: 2,
    questionText: 'Thỏ Mimi nhìn thấy mấy củ cà rốt đang nhô lên vậy bé?',
    options: [1, 2, 4],
    hint: 'Bé chạm tay vào từng củ cà rốt để đếm: Một, hai củ cà rốt!',
  },
  {
    targetCount: 3,
    questionText: 'Ôi vườn nhiều cà rốt quá! Có tất cả mấy củ cà rốt đây bé ơi?',
    options: [2, 3, 5],
    hint: 'Bé đếm nhé: 1, 2, 3 củ cà rốt cam tươi ngon!',
  },
  {
    targetCount: 4,
    questionText: 'Bé đếm giúp thỏ Mimi xem có bao nhiêu củ cà rốt trên luống đất này?',
    options: [3, 4, 5],
    hint: 'Bé đếm từ trái sang phải: 1, 2, 3, 4 củ cà rốt!',
  },
  {
    targetCount: 5,
    questionText: 'Vòng cuối cùng rồi! Đố bé biết có bao nhiêu củ cà rốt tất cả?',
    options: [3, 4, 5],
    hint: 'Đếm thật kỹ cả 5 củ cà rốt giúp thỏ no bụng nhé!',
  },
];

export const RabbitCarrotGame: React.FC<RabbitCarrotGameProps> = ({
  onAddStar,
  onAddCarrot,
  onBackToMenu,
  onCompleteGame,
}) => {
  const [currentRoundIdx, setCurrentRoundIdx] = useState(0);
  const [tappedCarrots, setTappedCarrots] = useState<Record<number, boolean>>({});
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswerCorrect, setIsAnswerCorrect] = useState<boolean | null>(null);
  const [isJumping, setIsJumping] = useState(false);
  const [gameFinished, setGameFinished] = useState(false);
  const [shakeWrong, setShakeWrong] = useState(false);

  const round = GAME_ROUNDS[currentRoundIdx];

  // Auto speak question when opening or changing round
  React.useEffect(() => {
    const timer = setTimeout(() => {
      soundManager.speakVietnamese(round.questionText);
    }, 400);
    return () => clearTimeout(timer);
  }, [currentRoundIdx]);

  // Speak prompt helper
  const handleSpeak = () => {
    soundManager.speakVietnamese(round.questionText);
  };

  // Tapping individual carrot on the soil bed
  const handleCarrotTap = (index: number) => {
    soundManager.playClick();
    setTappedCarrots(prev => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const handleSelectOption = (num: number) => {
    if (isAnswerCorrect === true) return; // already answered correctly for this round

    setSelectedOption(num);
    if (num === round.targetCount) {
      // CORRECT!
      setIsAnswerCorrect(true);
      setIsJumping(true);
      soundManager.playSuccess();
      onAddStar();
      onAddCarrot();

      // Confetti burst
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#f97316', '#fbbf24', '#22c55e', '#ec4899'],
      });

      // Voice praise
      soundManager.speakVietnamese(`Đúng rồi! Có ${round.targetCount} củ cà rốt! Bé giỏi quá!`);

      setTimeout(() => {
        setIsJumping(false);
      }, 1200);

    } else {
      // INCORRECT - Gentle encouragement
      setIsAnswerCorrect(false);
      setShakeWrong(true);
      soundManager.playTryAgain();
      soundManager.speakVietnamese('Chưa đúng rồi, bé hãy đếm lại từng củ cà rốt nhé!');
      setTimeout(() => setShakeWrong(false), 600);
    }
  };

  const handleNextRound = () => {
    soundManager.playClick();
    if (currentRoundIdx < GAME_ROUNDS.length - 1) {
      setCurrentRoundIdx(prev => prev + 1);
      setSelectedOption(null);
      setIsAnswerCorrect(null);
      setTappedCarrots({});
    } else {
      // GAME COMPLETED!
      setGameFinished(true);
      soundManager.playFanfare();
      onCompleteGame();
      confetti({
        particleCount: 150,
        spread: 100,
        origin: { y: 0.4 },
      });
      soundManager.speakVietnamese('Chúc mừng bé đã hái trọn vẹn giỏ cà rốt cho thỏ Mimi! Cô Huyền khen bé rất ngoan và giỏi toán!');
    }
  };

  const handleRestart = () => {
    soundManager.playClick();
    setCurrentRoundIdx(0);
    setSelectedOption(null);
    setIsAnswerCorrect(null);
    setTappedCarrots({});
    setGameFinished(false);
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-3 sm:px-4 py-4 sm:py-6 select-none">
      
      {/* Top Navigation bar */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => {
            soundManager.playClick();
            onBackToMenu();
          }}
          className="flex items-center gap-1.5 bg-white/90 hover:bg-white text-stone-700 font-bold px-3 py-1.5 rounded-2xl shadow-sm border border-stone-300 text-sm active:scale-95 transition-all"
        >
          <span>👈 Về bài học</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="text-xs sm:text-sm font-bold bg-orange-100 text-orange-900 px-3 py-1 rounded-full border border-orange-300">
            🥕 Cấp độ: {currentRoundIdx + 1} / {GAME_ROUNDS.length}
          </span>
          <button
            onClick={handleSpeak}
            className="flex items-center gap-1 bg-amber-400 hover:bg-amber-500 text-amber-950 font-bold px-3 py-1 rounded-2xl shadow-sm text-xs sm:text-sm active:scale-95 transition-all"
            title="Đọc to câu hỏi cho bé nghe"
          >
            <Volume2 className="w-4 h-4" />
            <span>Nghe câu hỏi</span>
          </button>
        </div>
      </div>

      {/* Main Game Container */}
      {!gameFinished ? (
        <div className="bg-gradient-to-b from-sky-100 via-emerald-50 to-amber-100 rounded-3xl p-4 sm:p-7 shadow-xl border-4 border-orange-300 relative overflow-hidden">
          
          {/* Header title */}
          <div className="text-center mb-4">
            <div className="inline-flex items-center gap-2 bg-white/80 px-4 py-1 rounded-full shadow-sm border border-orange-200 mb-2">
              <span className="text-xl">🐰</span>
              <h2 className="text-base sm:text-xl font-black text-orange-900">
                Trò chơi: Bé Thỏ Hái Cà Rốt
              </h2>
              <span className="text-xl">🥕</span>
            </div>
            <p className="text-base sm:text-2xl font-black text-emerald-900 leading-snug">
              {round.questionText}
            </p>
            <p className="text-xs sm:text-sm text-stone-600 font-semibold mt-1">
              👉 {round.hint} (Bé có thể chạm trực tiếp vào củ cà rốt để đếm)
            </p>
          </div>

          {/* Interactive Garden Scene */}
          <div className="relative bg-gradient-to-b from-sky-200/60 to-emerald-200/80 rounded-2xl p-4 sm:p-6 mb-6 shadow-inner border-2 border-emerald-300 overflow-hidden min-h-[220px] sm:min-h-[260px] flex flex-col justify-between">
            
            {/* Sky, Sun & Clouds */}
            <div className="flex justify-between items-start pointer-events-none">
              <div className="text-3xl animate-bounce-slow">☁️</div>
              <div className="text-4xl animate-spin-slow">☀️</div>
              <div className="text-3xl">☁️</div>
            </div>

            {/* Bunny Mimi & Carrot Garden Bed */}
            <div className="flex flex-col sm:flex-row items-center justify-around gap-6 my-2 relative z-10">
              
              {/* Bunny Mimi */}
              <div className="flex flex-col items-center">
                <div 
                  className={`text-6xl sm:text-7xl transition-transform duration-300 ${
                    isJumping ? '-translate-y-6 scale-110 animate-bounce' : 'hover:scale-105'
                  }`}
                >
                  🐰
                </div>
                <div className="mt-1 bg-white/90 px-3 py-0.5 rounded-full text-xs font-black text-orange-800 shadow-sm border border-orange-200">
                  Thỏ Mimi
                </div>
              </div>

              {/* Carrot Bed / Soil */}
              <div className="flex-1 max-w-md bg-amber-800/20 backdrop-blur-xs p-3 sm:p-4 rounded-3xl border-2 border-amber-700/30 flex items-center justify-center gap-3 sm:gap-4 flex-wrap">
                {Array.from({ length: round.targetCount }).map((_, idx) => {
                  const isTapped = tappedCarrots[idx];
                  return (
                    <button
                      key={idx}
                      onClick={() => handleCarrotTap(idx)}
                      className={`relative group flex flex-col items-center p-2 rounded-2xl transition-all active:scale-90 ${
                        isTapped
                          ? 'bg-amber-300/80 shadow-md scale-110'
                          : 'bg-white/60 hover:bg-white/80'
                      }`}
                      title={`Bấm để đếm cà rốt số ${idx + 1}`}
                    >
                      {/* Count badge indicator when clicked */}
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center font-black text-xs shadow-sm mb-1 transition-all ${
                        isTapped ? 'bg-orange-500 text-white scale-110' : 'bg-white/90 text-orange-900'
                      }`}>
                        {idx + 1}
                      </div>

                      {/* Carrot Emoji */}
                      <span className="text-4xl sm:text-5xl drop-shadow-md group-hover:rotate-6 transition-transform">
                        🥕
                      </span>

                      {/* Soil mound */}
                      <span className="w-10 h-2 bg-amber-900/50 rounded-full mt-1" />
                    </button>
                  );
                })}
              </div>

              {/* Basket */}
              <div className="flex flex-col items-center">
                <div className="text-5xl sm:text-6xl">🧺</div>
                <div className="mt-1 bg-white/90 px-2.5 py-0.5 rounded-full text-xs font-bold text-amber-900 shadow-sm border border-amber-200">
                  Giỏ cà rốt
                </div>
              </div>

            </div>

            {/* Grass and wildflowers footer inside garden */}
            <div className="flex justify-between items-center text-xl sm:text-2xl pt-2 pointer-events-none select-none opacity-80">
              <span>🌱🌼</span>
              <span>🌾🌸🌾</span>
              <span>🌻🌱</span>
            </div>

          </div>

          {/* Answer Option Buttons */}
          <div className="text-center mb-2">
            <span className="text-xs sm:text-sm font-extrabold text-stone-700 uppercase tracking-wider">
              👇 Bé hãy chạm vào số tương ứng nhé:
            </span>
          </div>

          <div className={`grid grid-cols-3 gap-3 sm:gap-5 max-w-lg mx-auto ${shakeWrong ? 'animate-shake' : ''}`}>
            {round.options.map((optNum) => {
              const isSelected = selectedOption === optNum;
              const isCorrectBtn = isSelected && isAnswerCorrect === true;
              const isWrongBtn = isSelected && isAnswerCorrect === false;

              return (
                <button
                  key={optNum}
                  onClick={() => handleSelectOption(optNum)}
                  className={`py-3.5 sm:py-5 px-3 rounded-3xl font-black text-3xl sm:text-4xl shadow-md border-4 transition-all transform active:scale-95 flex flex-col items-center justify-center gap-1 ${
                    isCorrectBtn
                      ? 'bg-emerald-400 text-white border-emerald-600 scale-105 shadow-emerald-200'
                      : isWrongBtn
                      ? 'bg-rose-200 text-rose-800 border-rose-400'
                      : 'bg-white hover:bg-orange-50 text-orange-950 border-orange-300 hover:border-orange-400'
                  }`}
                >
                  <span>{optNum}</span>
                  <span className="text-xs sm:text-sm font-bold text-stone-600">
                    {optNum} củ cà rốt
                  </span>
                </button>
              );
            })}
          </div>

          {/* Feedback Modal / Bar */}
          {isAnswerCorrect !== null && (
            <div className="mt-5 p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 shadow-md border-2 animate-fade-in text-center sm:text-left transition-all">
              {isAnswerCorrect ? (
                <>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-emerald-500 text-white flex items-center justify-center text-2xl shadow">
                      ⭐
                    </div>
                    <div>
                      <p className="text-base sm:text-lg font-black text-emerald-900">
                        Tuyệt vời! Bé đếm hoàn toàn chính xác! 🥕🎉
                      </p>
                      <p className="text-xs sm:text-sm font-bold text-emerald-700">
                        Thỏ Mimi tặng bé 1 Ngôi sao vàng & 1 Cà rốt tươi ngon!
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={handleNextRound}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-extrabold px-6 py-3 rounded-2xl shadow-lg border-2 border-white active:scale-95 text-base transition-all"
                  >
                    <span>{currentRoundIdx < GAME_ROUNDS.length - 1 ? 'Màn tiếp theo' : 'Xem kết quả'}</span>
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </>
              ) : (
                <div className="flex items-center gap-3 text-rose-800 bg-rose-50 p-2 rounded-xl w-full justify-center">
                  <Smile className="w-6 h-6 text-rose-600" />
                  <span className="font-extrabold text-sm sm:text-base">
                    Chưa đúng rồi bé ơi! Bé chạm vào từng củ cà rốt để đếm lại nhé!
                  </span>
                </div>
              )}
            </div>
          )}

        </div>
      ) : (
        /* Game Finished / Trophy Screen */
        <div className="bg-gradient-to-b from-amber-100 via-yellow-50 to-orange-100 rounded-3xl p-6 sm:p-10 shadow-xl border-4 border-amber-300 text-center relative overflow-hidden">
          
          <div className="w-24 h-24 sm:w-28 sm:h-28 mx-auto rounded-full bg-gradient-to-tr from-amber-400 to-yellow-300 flex items-center justify-center text-5xl sm:text-6xl shadow-xl border-4 border-white mb-4 animate-bounce">
            🏆
          </div>

          <div className="inline-block bg-white/90 px-4 py-1 rounded-full text-xs sm:text-sm font-extrabold text-amber-900 border border-amber-300 mb-2">
            ⭐ Lớp 3 Tuổi C2 - Trường Mầm non Thạch Thất 2 ⭐
          </div>

          <h2 className="text-2xl sm:text-4xl font-black text-rose-600 mb-2">
            Hoan Hô Bé Yêu Đã Chiến Thắng!
          </h2>

          <p className="text-base sm:text-xl font-bold text-amber-950 max-w-lg mx-auto mb-4">
            Bé đã xuất sắc thu hoạch đầy cả giỏ 5 củ cà rốt cho thỏ Mimi! Bé thật thông minh và đếm số siêu cừ!
          </p>

          <div className="bg-white/80 p-4 rounded-2xl max-w-md mx-auto border-2 border-amber-200 shadow-sm mb-6 text-emerald-900 font-extrabold flex items-center justify-center gap-2">
            <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
            <span>Lời khen từ Cô giáo Nguyễn Thị Huyền: "Cô tự hào về bé lắm!"</span>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={handleRestart}
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-amber-400 hover:bg-amber-500 text-amber-950 font-black px-6 py-3 rounded-2xl shadow-md border-2 border-white active:scale-95 transition-all"
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
