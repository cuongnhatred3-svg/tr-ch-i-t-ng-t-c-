import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Volume2, RotateCcw, ArrowRight, ChevronLeft, Sparkles, Smile } from 'lucide-react';
import { soundManager } from '../utils/soundEffects';

interface ColorShapeGameProps {
  onAddStar: () => void;
  onBackToMenu: () => void;
  onCompleteGame: () => void;
}

interface ColorShapeQuestion {
  id: string;
  targetPrompt: string;
  audioPrompt: string;
  targetShape: 'circle' | 'square' | 'triangle' | 'rectangle';
  targetColorName: string;
  options: Array<{
    id: string;
    shape: 'circle' | 'square' | 'triangle' | 'rectangle';
    colorName: string;
    colorClass: string;
    isCorrect: boolean;
  }>;
  hint: string;
}

const COLOR_SHAPE_ROUNDS: ColorShapeQuestion[] = [
  {
    id: 'cs-1',
    targetPrompt: 'Bé hãy tìm HÌNH TRÒN màu ĐỎ rực rỡ nhé!',
    audioPrompt: 'Bé hãy tìm HÌNH TRÒN màu ĐỎ rực rỡ nhé!',
    targetShape: 'circle',
    targetColorName: 'Đỏ',
    options: [
      { id: 'opt-1', shape: 'circle', colorName: 'Đỏ', colorClass: 'bg-red-500 border-red-700', isCorrect: true },
      { id: 'opt-2', shape: 'square', colorName: 'Vàng', colorClass: 'bg-amber-400 border-amber-600', isCorrect: false },
      { id: 'opt-3', shape: 'triangle', colorName: 'Xanh dương', colorClass: 'bg-blue-500 border-blue-700', isCorrect: false },
    ],
    hint: 'Hình tròn không có góc và có màu đỏ như quả cà chua!',
  },
  {
    id: 'cs-2',
    targetPrompt: 'Đâu là HÌNH VUÔNG màu VÀNG tươi sáng?',
    audioPrompt: 'Đâu là HÌNH VUÔNG màu VÀNG tươi sáng?',
    targetShape: 'square',
    targetColorName: 'Vàng',
    options: [
      { id: 'opt-1', shape: 'circle', colorName: 'Xanh lá', colorClass: 'bg-emerald-500 border-emerald-700', isCorrect: false },
      { id: 'opt-2', shape: 'square', colorName: 'Vàng', colorClass: 'bg-amber-400 border-amber-600', isCorrect: true },
      { id: 'opt-3', shape: 'rectangle', colorName: 'Đỏ', colorClass: 'bg-red-500 border-red-700', isCorrect: false },
    ],
    hint: 'Hình vuông có 4 cạnh bằng nhau và màu vàng như ánh nắng mặt trời!',
  },
  {
    id: 'cs-3',
    targetPrompt: 'Bé hãy chỉ vào HÌNH TAM GIÁC màu XANH LÁ cây!',
    audioPrompt: 'Bé hãy chỉ vào HÌNH TAM GIÁC màu XANH LÁ cây!',
    targetShape: 'triangle',
    targetColorName: 'Xanh lá',
    options: [
      { id: 'opt-1', shape: 'triangle', colorName: 'Xanh lá', colorClass: 'bg-emerald-500 border-emerald-700', isCorrect: true },
      { id: 'opt-2', shape: 'triangle', colorName: 'Đỏ', colorClass: 'bg-red-500 border-red-700', isCorrect: false },
      { id: 'opt-3', shape: 'circle', colorName: 'Vàng', colorClass: 'bg-amber-400 border-amber-600', isCorrect: false },
    ],
    hint: 'Hình tam giác có 3 đỉnh nhọn và màu xanh tươi mát của chiếc lá!',
  },
  {
    id: 'cs-4',
    targetPrompt: 'Đố bé biết HÌNH CHỮ NHẬT màu XANH DƯƠNG ở đâu?',
    audioPrompt: 'Đố bé biết HÌNH CHỮ NHẬT màu XANH DƯƠNG ở đâu?',
    targetShape: 'rectangle',
    targetColorName: 'Xanh dương',
    options: [
      { id: 'opt-1', shape: 'square', colorName: 'Xanh dương', colorClass: 'bg-blue-500 border-blue-700', isCorrect: false },
      { id: 'opt-2', shape: 'circle', colorName: 'Đỏ', colorClass: 'bg-red-500 border-red-700', isCorrect: false },
      { id: 'opt-3', shape: 'rectangle', colorName: 'Xanh dương', colorClass: 'bg-blue-500 border-blue-700', isCorrect: true },
    ],
    hint: 'Hình chữ nhật dài và có màu xanh thẳm như bầu trời!',
  },
];

export const ColorShapeGame: React.FC<ColorShapeGameProps> = ({
  onAddStar,
  onBackToMenu,
  onCompleteGame,
}) => {
  const [roundIdx, setRoundIdx] = useState(0);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [isFinished, setIsFinished] = useState(false);
  const [shake, setShake] = useState(false);

  const currentRound = COLOR_SHAPE_ROUNDS[roundIdx];

  // Auto speak on round change
  React.useEffect(() => {
    const timer = setTimeout(() => {
      soundManager.speakVietnamese(currentRound.audioPrompt);
    }, 400);
    return () => clearTimeout(timer);
  }, [roundIdx]);

  const handleSpeak = () => {
    soundManager.speakVietnamese(currentRound.audioPrompt);
  };

  const handleSelect = (optionId: string, isOptCorrect: boolean) => {
    if (isCorrect === true) return;

    setSelectedId(optionId);

    if (isOptCorrect) {
      setIsCorrect(true);
      soundManager.playSuccess();
      onAddStar();

      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
      });

      soundManager.speakVietnamese(`Đúng rồi! Bé giỏi quá, đây chính là hình bé cần tìm!`);
    } else {
      setIsCorrect(false);
      setShake(true);
      soundManager.playTryAgain();
      soundManager.speakVietnamese(`Chưa đúng rồi bé ơi! Bé nhìn kỹ cả hình dáng và màu sắc nhé!`);
      setTimeout(() => setShake(false), 500);
    }
  };

  const handleNext = () => {
    soundManager.playClick();
    if (roundIdx < COLOR_SHAPE_ROUNDS.length - 1) {
      setRoundIdx(prev => prev + 1);
      setSelectedId(null);
      setIsCorrect(null);
    } else {
      setIsFinished(true);
      soundManager.playFanfare();
      onCompleteGame();
      confetti({
        particleCount: 150,
        spread: 100,
        origin: { y: 0.4 },
      });
      soundManager.speakVietnamese('Chúc mừng bé! Bé đã xuất sắc nhận biết cả hình khối và màu sắc! Cô Huyền khen ngợi bé!');
    }
  };

  const handleRestart = () => {
    soundManager.playClick();
    setRoundIdx(0);
    setSelectedId(null);
    setIsCorrect(null);
    setIsFinished(false);
  };

  const renderShapeIcon = (shape: string, colorClass: string) => {
    if (shape === 'circle') {
      return <div className={`w-20 h-20 sm:w-24 sm:h-24 rounded-full border-4 shadow-lg ${colorClass}`} />;
    }
    if (shape === 'square') {
      return <div className={`w-20 h-20 sm:w-24 sm:h-24 rounded-2xl border-4 shadow-lg ${colorClass}`} />;
    }
    if (shape === 'triangle') {
      return (
        <div className="w-20 h-20 sm:w-24 sm:h-24 flex items-center justify-center">
          <svg viewBox="0 0 100 90" className="w-full h-full drop-shadow-md">
            <polygon points="50,5 95,85 5,85" className={`${colorClass.includes('emerald') ? 'fill-emerald-500 stroke-emerald-700' : colorClass.includes('red') ? 'fill-red-500 stroke-red-700' : 'fill-blue-500 stroke-blue-700'}`} strokeWidth="4" />
          </svg>
        </div>
      );
    }
    return <div className={`w-28 h-18 sm:w-32 sm:h-20 rounded-xl border-4 shadow-lg ${colorClass}`} />;
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
            🎨 Câu {roundIdx + 1} / {COLOR_SHAPE_ROUNDS.length}
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
        <div className="bg-gradient-to-b from-amber-50 via-sky-50 to-emerald-50 rounded-3xl p-5 sm:p-8 shadow-xl border-4 border-amber-300">
          
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-2 bg-white/90 px-4 py-1 rounded-full shadow-xs border border-amber-200 mb-2">
              <span className="text-xl">🎨</span>
              <h2 className="text-base sm:text-xl font-black text-amber-900">
                Ôn Luyện: Hình Khối & Màu Sắc
              </h2>
              <span className="text-xl">🔺</span>
            </div>
            
            <h3 className="text-xl sm:text-3xl font-black text-stone-900 mt-2 leading-snug">
              {currentRound.targetPrompt}
            </h3>
            
            <p className="text-xs sm:text-sm text-stone-600 font-bold mt-1">
              💡 {currentRound.hint}
            </p>
          </div>

          {/* Options Display */}
          <div className={`grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto my-6 ${shake ? 'animate-shake' : ''}`}>
            {currentRound.options.map((opt) => {
              const isSelected = selectedId === opt.id;
              const isOptionCorrect = isSelected && isCorrect === true;
              const isOptionWrong = isSelected && isCorrect === false;

              return (
                <button
                  key={opt.id}
                  onClick={() => handleSelect(opt.id, opt.isCorrect)}
                  className={`p-5 rounded-3xl bg-white flex flex-col items-center justify-center gap-3 transition-all transform active:scale-95 border-4 ${
                    isOptionCorrect
                      ? 'border-emerald-500 ring-4 ring-emerald-300 scale-105 shadow-xl'
                      : isOptionWrong
                      ? 'border-red-400 bg-red-50'
                      : 'border-stone-200 hover:border-amber-400 hover:shadow-md'
                  }`}
                >
                  {renderShapeIcon(opt.shape, opt.colorClass)}
                  <span className="text-sm sm:text-base font-black text-stone-800 mt-1">
                    Màu {opt.colorName}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Feedback Bar */}
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
                        Chính xác tuyệt đối! Bé thật thông minh! 🎉
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
                    <span>{roundIdx < COLOR_SHAPE_ROUNDS.length - 1 ? 'Câu tiếp theo' : 'Xem kết quả'}</span>
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </>
              ) : (
                <div className="flex items-center gap-3 text-rose-800 bg-rose-50 p-2 rounded-xl w-full justify-center">
                  <Smile className="w-6 h-6 text-rose-600" />
                  <span className="font-extrabold text-sm sm:text-base">
                    Chưa đúng rồi bé ơi! Bé nhìn kỹ lại hình dạng và màu sắc nha!
                  </span>
                </div>
              )}
            </div>
          )}

        </div>
      ) : (
        /* Completed Screen */
        <div className="bg-gradient-to-b from-amber-100 via-sky-50 to-emerald-100 rounded-3xl p-6 sm:p-10 shadow-xl border-4 border-amber-300 text-center">
          <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-tr from-amber-400 to-yellow-300 flex items-center justify-center text-5xl shadow-xl mb-4 animate-bounce">
            🎨
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-amber-900 mb-2">
            Bé Rất Giỏi Về Hình Khối & Màu Sắc!
          </h2>

          <p className="text-base sm:text-lg font-bold text-stone-700 max-w-md mx-auto mb-4">
            Bé đã phân biệt và gọi đúng tên các hình Vuông, Tròn, Tam giác, Chữ nhật cùng các màu Đỏ, Vàng, Xanh!
          </p>

          <div className="bg-white/90 p-4 rounded-2xl max-w-md mx-auto border-2 border-amber-200 shadow-sm mb-6 text-emerald-900 font-extrabold">
            🌟 Lời khen từ Cô Huyền: "Bé lớp 3 Tuổi C2 nhận biết màu và hình rất xuất sắc!"
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
