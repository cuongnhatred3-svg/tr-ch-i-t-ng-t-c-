import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Volume2, ChevronLeft, ArrowRight, RotateCcw, Clock, Sparkles, Smile } from 'lucide-react';
import { soundManager } from '../utils/soundEffects';

interface DayTimeGameProps {
  onAddStar: () => void;
  onBackToMenu: () => void;
  onCompleteGame: () => void;
}

interface TimeRound {
  id: string;
  timePeriod: string;
  emoji: string;
  prompt: string;
  audioPrompt: string;
  options: Array<{ id: string; label: string; icon: string; isCorrect: boolean }>;
  hint: string;
}

const TIME_ROUNDS: TimeRound[] = [
  {
    id: 'tm-1',
    timePeriod: 'Buổi Sáng',
    emoji: '☀️',
    prompt: 'Ông mặt trời thức dậy, bé đánh răng, ăn sáng rồi đến trường mầm non với cô Huyền là vào BUỔI NÀO?',
    audioPrompt: 'Ông mặt trời thức dậy, bé đánh răng, ăn sáng rồi đến trường mầm non với cô Huyền là vào BUỔI NÀO?',
    options: [
      { id: 'sang', label: 'Buổi Sáng', icon: '🌅', isCorrect: true },
      { id: 'toi', label: 'Buổi Tối', icon: '🌙', isCorrect: false },
      { id: 'chieu', label: 'Buổi Chiều', icon: '🌇', isCorrect: false },
    ],
    hint: 'Mặt trời mọc chào đón ngày mới chính là Buổi Sáng!',
  },
  {
    id: 'tm-2',
    timePeriod: 'Buổi Trưa',
    emoji: '🍚',
    prompt: 'Bé cùng các bạn lớp 3 Tuổi C2 ăn cơm ngon miệng và chuẩn bị đi ngủ trưa là vào BUỔI NÀO?',
    audioPrompt: 'Bé cùng các bạn lớp 3 Tuổi C2 ăn cơm ngon miệng và chuẩn bị đi ngủ trưa là vào BUỔI NÀO?',
    options: [
      { id: 'trua', label: 'Buổi Trưa', icon: '🍱', isCorrect: true },
      { id: 'sang', label: 'Buổi Sáng', icon: '🌅', isCorrect: false },
      { id: 'toi', label: 'Buổi Tối', icon: '🌙', isCorrect: false },
    ],
    hint: 'Sau giờ học buổi sáng là đến giờ ăn trưa và ngủ trưa!',
  },
  {
    id: 'tm-3',
    timePeriod: 'Buổi Tối',
    emoji: '🌙',
    prompt: 'Bầu trời tối đen, ông trăng và ngàn ngôi sao lấp lánh, bé ngủ say giấc nồng là vào BUỔI NÀO?',
    audioPrompt: 'Bầu trời tối đen, ông trăng và ngàn ngôi sao lấp lánh, bé ngủ say giấc nồng là vào BUỔI NÀO?',
    options: [
      { id: 'sang', label: 'Buổi Sáng', icon: '☀️', isCorrect: false },
      { id: 'toi', label: 'Buổi Tối', icon: '🌙', isCorrect: true },
      { id: 'trua', label: 'Buổi Trưa', icon: '🍱', isCorrect: false },
    ],
    hint: 'Đêm về có trăng và sao ru bé ngủ ngon là Buổi Tối!',
  },
];

export const DayTimeGame: React.FC<DayTimeGameProps> = ({
  onAddStar,
  onBackToMenu,
  onCompleteGame,
}) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [isFinished, setIsFinished] = useState(false);
  const [shake, setShake] = useState(false);

  const round = TIME_ROUNDS[currentIdx];

  useEffect(() => {
    setSelectedId(null);
    setIsCorrect(null);
    const timer = setTimeout(() => {
      soundManager.speakVietnamese(round.audioPrompt);
    }, 400);
    return () => clearTimeout(timer);
  }, [currentIdx]);

  const handleSpeak = () => {
    soundManager.speakVietnamese(round.audioPrompt);
  };

  const handleSelect = (id: string, isOptCorrect: boolean) => {
    if (isCorrect === true) return;

    setSelectedId(id);

    if (isOptCorrect) {
      setIsCorrect(true);
      soundManager.playSuccess();
      onAddStar();

      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
      });

      soundManager.speakVietnamese(`Đúng rồi! Đó chính là ${round.timePeriod}! Bé rất nhớ các buổi trong ngày!`);
    } else {
      setIsCorrect(false);
      setShake(true);
      soundManager.playTryAgain();
      soundManager.speakVietnamese('Chưa đúng rồi bé ơi! Bé nghe lại xem hoạt động đó diễn ra lúc nào nhé!');
      setTimeout(() => setShake(false), 500);
    }
  };

  const handleNext = () => {
    soundManager.playClick();
    if (currentIdx < TIME_ROUNDS.length - 1) {
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
      soundManager.speakVietnamese('Tuyệt vời! Bé đã nắm rất rõ thời gian và các buổi trong ngày của bé ngoan!');
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
          <span className="text-xs sm:text-sm font-bold bg-amber-100 text-amber-900 px-3 py-1 rounded-full border border-amber-300">
            ⏰ Bài {currentIdx + 1} / {TIME_ROUNDS.length} • Thời Gian Của Bé
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
        <div className="bg-gradient-to-b from-amber-50 via-sky-50 to-indigo-50 rounded-3xl p-5 sm:p-8 shadow-xl border-4 border-amber-300">
          
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-2 bg-white/90 px-4 py-1 rounded-full shadow-xs border border-amber-200 mb-2">
              <span className="text-xl">⏰</span>
              <h2 className="text-base sm:text-xl font-black text-amber-950">
                Trạm 11: Thời Gian & Các Buổi Trong Ngày
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

          {/* Visual Scene */}
          <div className="bg-white/90 rounded-3xl p-6 sm:p-8 mb-6 border-3 border-amber-200 shadow-sm flex flex-col items-center justify-center">
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-amber-100 flex items-center justify-center text-6xl sm:text-7xl shadow-md border-3 border-amber-300 animate-bounce-slow mb-3">
              {round.emoji}
            </div>
            <span className="text-sm sm:text-base font-black text-stone-800">
              Hoạt động thường ngày của bé yêu
            </span>
          </div>

          {/* Options */}
          <div className="text-center mb-2">
            <span className="text-xs sm:text-sm font-black text-stone-700 uppercase tracking-wide">
              👇 Bé hãy chọn buổi phù hợp nhé:
            </span>
          </div>

          <div className={`grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 max-w-xl mx-auto ${shake ? 'animate-shake' : ''}`}>
            {round.options.map((opt) => {
              const isSelected = selectedId === opt.id;
              const isOptionCorrect = isSelected && isCorrect === true;
              const isOptionWrong = isSelected && isCorrect === false;

              return (
                <button
                  key={opt.id}
                  onClick={() => handleSelect(opt.id, opt.isCorrect)}
                  className={`p-4 sm:p-5 rounded-2xl bg-white border-4 transition-all transform active:scale-95 flex flex-col items-center justify-center gap-1.5 ${
                    isOptionCorrect
                      ? 'border-emerald-500 bg-emerald-50 ring-4 ring-emerald-300 scale-105'
                      : isOptionWrong
                      ? 'border-red-400 bg-red-50'
                      : 'border-stone-200 hover:border-amber-400 shadow-sm'
                  }`}
                >
                  <span className="text-3xl sm:text-4xl">{opt.icon}</span>
                  <span className="text-base font-black text-stone-900">{opt.label}</span>
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
                        Chính xác! Đó chính là {round.timePeriod}! 🎉
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
                    <span>{currentIdx < TIME_ROUNDS.length - 1 ? 'Bài tiếp theo' : 'Xem kết quả'}</span>
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </>
              ) : (
                <div className="flex items-center gap-3 text-rose-800 bg-rose-50 p-2 rounded-xl w-full justify-center">
                  <Smile className="w-6 h-6 text-rose-600" />
                  <span className="font-extrabold text-sm sm:text-base">
                    Chưa đúng rồi bé ơi! Bé nhớ lại xem lúc đó là buổi sáng, trưa hay tối nhé!
                  </span>
                </div>
              )}
            </div>
          )}

        </div>
      ) : (
        /* Completed */
        <div className="bg-gradient-to-b from-amber-100 via-sky-50 to-indigo-100 rounded-3xl p-6 sm:p-10 shadow-xl border-4 border-amber-300 text-center">
          <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-tr from-amber-400 to-yellow-300 text-white flex items-center justify-center text-5xl shadow-xl mb-4 animate-bounce">
            ⏰
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-amber-950 mb-2">
            Bé Rất Hiểu Biết Về Thời Gian!
          </h2>

          <p className="text-base sm:text-lg font-bold text-stone-700 max-w-md mx-auto mb-4">
            Bé đã phân biệt rành rọt Buổi Sáng thức dậy đi học, Buổi Trưa ăn cơm ngủ trưa, và Buổi Tối ấm cúng bên gia đình!
          </p>

          <div className="bg-white/90 p-4 rounded-2xl max-w-md mx-auto border-2 border-amber-200 shadow-sm mb-6 text-emerald-900 font-extrabold">
            🌟 Cô giáo Nguyễn Thị Huyền: "Bé rất ngoan và có thói quen sinh hoạt đúng giờ!"
          </div>

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
