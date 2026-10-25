import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Volume2, ChevronLeft, ArrowRight, RotateCcw, Plus, Minus, Sparkles, Smile } from 'lucide-react';
import { soundManager } from '../utils/soundEffects';

interface BasketAddGameProps {
  onAddStar: () => void;
  onBackToMenu: () => void;
  onCompleteGame: () => void;
}

interface AddRound {
  id: string;
  targetCount: number;
  initialCount: number;
  itemName: string;
  itemEmoji: string;
  prompt: string;
  audioPrompt: string;
  hint: string;
}

const ADD_ROUNDS: AddRound[] = [
  {
    id: 'add-1',
    targetCount: 3,
    initialCount: 1,
    itemName: 'Quả Cam',
    itemEmoji: '🍊',
    prompt: 'Trong giỏ đang có 1 quả cam. Bé hãy thêm quả vào giỏ để có đúng 3 quả cam nhé!',
    audioPrompt: 'Trong giỏ đang có một quả cam. Bé hãy thêm quả vào giỏ để có đúng ba quả cam nhé!',
    hint: 'Bé chạm vào đĩa cam bên ngoài để cho cam vào giỏ nhé!',
  },
  {
    id: 'add-2',
    targetCount: 4,
    initialCount: 2,
    itemName: 'Quả Táo Đỏ',
    itemEmoji: '🍎',
    prompt: 'Trong giỏ có 2 quả táo rồi. Bé cần thêm mấy quả nữa để giỏ có đúng 4 quả táo?',
    audioPrompt: 'Trong giỏ có hai quả táo rồi. Bé cần thêm mấy quả nữa để giỏ có đúng bốn quả táo?',
    hint: 'Có 2 quả táo, thêm 1 là 3, thêm 1 nữa là 4 quả táo!',
  },
  {
    id: 'add-3',
    targetCount: 5,
    initialCount: 3,
    itemName: 'Quả Dâu Tây',
    itemEmoji: '🍓',
    prompt: 'Bé hãy thêm quả dâu tây vào giỏ cho đủ 5 quả dâu chín mọng nào!',
    audioPrompt: 'Bé hãy thêm quả dâu tây vào giỏ cho đủ năm quả dâu chín mọng nào!',
    hint: 'Đang có 3 quả dâu, bé thêm 2 quả nữa là đủ 5 quả!',
  },
];

export const BasketAddGame: React.FC<BasketAddGameProps> = ({
  onAddStar,
  onBackToMenu,
  onCompleteGame,
}) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const round = ADD_ROUNDS[currentIdx];
  const [basketItems, setBasketItems] = useState<number>(round.initialCount);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [isFinished, setIsFinished] = useState(false);
  const [shake, setShake] = useState(false);

  // Auto read question when opening or changing round
  useEffect(() => {
    setBasketItems(round.initialCount);
    setIsCorrect(null);
    const timer = setTimeout(() => {
      soundManager.speakVietnamese(round.audioPrompt);
    }, 400);
    return () => clearTimeout(timer);
  }, [currentIdx]);

  const handleSpeak = () => {
    soundManager.speakVietnamese(round.audioPrompt);
  };

  const handleAddItem = () => {
    if (basketItems < 6) {
      soundManager.playClick();
      setBasketItems(prev => prev + 1);
      setIsCorrect(null);
    }
  };

  const handleRemoveItem = () => {
    if (basketItems > round.initialCount) {
      soundManager.playClick();
      setBasketItems(prev => prev - 1);
      setIsCorrect(null);
    }
  };

  const handleCheck = () => {
    if (basketItems === round.targetCount) {
      setIsCorrect(true);
      soundManager.playSuccess();
      onAddStar();

      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
      });

      const added = round.targetCount - round.initialCount;
      soundManager.speakVietnamese(`Đúng rồi! Đang có ${round.initialCount} quả, bé thêm ${added} quả là vừa đủ ${round.targetCount} quả! Bé giỏi quá!`);
    } else {
      setIsCorrect(false);
      setShake(true);
      soundManager.playTryAgain();
      if (basketItems < round.targetCount) {
        soundManager.speakVietnamese(`Vẫn chưa đủ ${round.targetCount} quả rồi, bé chạm đĩa quả để thêm vào giỏ nhé!`);
      } else {
        soundManager.speakVietnamese(`Bị thừa rồi bé ơi, giỏ chỉ cần đúng ${round.targetCount} quả thôi! Bé bấm nút bớt ra nhé!`);
      }
      setTimeout(() => setShake(false), 500);
    }
  };

  const handleNext = () => {
    soundManager.playClick();
    if (currentIdx < ADD_ROUNDS.length - 1) {
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
      soundManager.speakVietnamese('Tuyệt vời! Bé đã thêm quả vào giỏ vô cùng chuẩn xác! Cô Huyền khen ngợi bé!');
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
            🧺 Bài {currentIdx + 1} / {ADD_ROUNDS.length} • Giỏ Quà Đủ Số
          </span>
          <button
            onClick={handleSpeak}
            className="flex items-center gap-1 bg-amber-400 hover:bg-amber-500 text-amber-950 font-black px-3.5 py-1.5 rounded-2xl shadow-sm text-xs sm:text-sm active:scale-95 transition-all"
          >
            <Volume2 className="w-4 h-4" />
            <span>Nghe cô dặn</span>
          </button>
        </div>
      </div>

      {!isFinished ? (
        <div className="bg-gradient-to-b from-amber-50 via-orange-50 to-emerald-50 rounded-3xl p-5 sm:p-8 shadow-xl border-4 border-amber-300">
          
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-2 bg-white/90 px-4 py-1 rounded-full shadow-xs border border-amber-200 mb-2">
              <span className="text-xl">🧺</span>
              <h2 className="text-base sm:text-xl font-black text-amber-900">
                Trạm 2: Giỏ Quà Đủ Số (Thêm Cho Đủ Số Lượng)
              </h2>
              <span className="text-xl">🍎</span>
            </div>

            <h3 className="text-xl sm:text-3xl font-black text-stone-900 mt-2 leading-snug">
              {round.prompt}
            </h3>

            <p className="text-xs sm:text-sm text-stone-600 font-bold mt-1">
              💡 {round.hint}
            </p>
          </div>

          {/* Interactive Basket Stage */}
          <div className="bg-gradient-to-b from-sky-100 to-amber-100 rounded-3xl p-6 sm:p-8 mb-6 border-3 border-amber-300 shadow-inner flex flex-col md:flex-row items-center justify-around gap-6">
            
            {/* The Basket (Giỏ) */}
            <div className={`flex flex-col items-center p-4 bg-white/80 rounded-3xl border-3 border-amber-400 shadow-md min-w-[200px] sm:min-w-[240px] ${shake ? 'animate-shake' : ''}`}>
              <div className="text-xs font-black uppercase text-amber-800 tracking-wider mb-2">
                🧺 GIỎ CỦA BÉ (Cần {round.targetCount} quả)
              </div>

              {/* Items in basket */}
              <div className="w-48 sm:w-56 h-32 bg-amber-800/10 rounded-2xl border-2 border-dashed border-amber-600 p-2 flex flex-wrap items-center justify-center gap-2 overflow-hidden shadow-inner">
                {Array.from({ length: basketItems }).map((_, idx) => (
                  <span key={idx} className="text-4xl sm:text-5xl animate-bounce-slow drop-shadow">
                    {round.itemEmoji}
                  </span>
                ))}
              </div>

              {/* Counter Badge */}
              <div className="mt-3 flex items-center gap-2 font-black text-base sm:text-lg">
                <span className="bg-amber-400 text-amber-950 px-3 py-1 rounded-xl shadow-xs">
                  Hiện có: {basketItems} quả
                </span>
                {basketItems > round.initialCount && (
                  <button
                    onClick={handleRemoveItem}
                    className="p-1 rounded-xl bg-red-100 hover:bg-red-200 text-red-700 text-xs font-bold border border-red-300 flex items-center gap-0.5 active:scale-95"
                    title="Bớt ra 1 quả"
                  >
                    <Minus className="w-3.5 h-3.5" />
                    <span>Bớt ra</span>
                  </button>
                )}
              </div>
            </div>

            {/* Outside Plate of Fruits (Đĩa quả bên ngoài để bé chạm thêm) */}
            <div className="flex flex-col items-center">
              <div className="text-xs font-black uppercase text-stone-600 tracking-wider mb-2">
                👉 CHẠM ĐỂ THÊM VÀO GIỎ:
              </div>

              <button
                onClick={handleAddItem}
                className="group p-5 bg-white rounded-3xl border-4 border-orange-400 hover:border-orange-500 shadow-lg active:scale-95 transition-all flex flex-col items-center justify-center gap-2"
                title="Bấm để cho quả vào giỏ"
              >
                <span className="text-6xl sm:text-7xl group-hover:scale-110 transition-transform drop-shadow">
                  {round.itemEmoji}
                </span>
                <span className="flex items-center gap-1 text-xs sm:text-sm font-black bg-orange-500 text-white px-3 py-1 rounded-xl">
                  <Plus className="w-4 h-4" />
                  <span>Thêm 1 quả</span>
                </span>
              </button>
            </div>

          </div>

          {/* Action Check Button */}
          <div className="flex justify-center mb-4">
            <button
              onClick={handleCheck}
              className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-black text-lg px-8 py-3.5 rounded-2xl shadow-lg border-2 border-white active:scale-95 transition-all flex items-center gap-2"
            >
              <Sparkles className="w-5 h-5" />
              <span>Kiểm Tra Giỏ Quà</span>
            </button>
          </div>

          {/* Feedback */}
          {isCorrect !== null && (
            <div className="mt-4 p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 shadow-md border-2 animate-fade-in text-center sm:text-left">
              {isCorrect ? (
                <>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-emerald-500 text-white flex items-center justify-center text-2xl shadow">
                      ⭐
                    </div>
                    <div>
                      <p className="text-base sm:text-lg font-black text-emerald-900">
                        Chính xác! Giỏ đã có đúng {round.targetCount} quả rồi! 🎉
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
                    <span>{currentIdx < ADD_ROUNDS.length - 1 ? 'Bài tiếp theo' : 'Xem kết quả'}</span>
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </>
              ) : (
                <div className="flex items-center gap-3 text-rose-800 bg-rose-50 p-2 rounded-xl w-full justify-center">
                  <Smile className="w-6 h-6 text-rose-600" />
                  <span className="font-extrabold text-sm sm:text-base">
                    Số lượng trong giỏ chưa bằng {round.targetCount} quả rồi bé ơi! Bé bấm thêm hoặc bớt ra nhé!
                  </span>
                </div>
              )}
            </div>
          )}

        </div>
      ) : (
        /* Completed */
        <div className="bg-gradient-to-b from-amber-100 via-orange-50 to-emerald-100 rounded-3xl p-6 sm:p-10 shadow-xl border-4 border-amber-300 text-center">
          <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-tr from-orange-400 to-amber-300 text-white flex items-center justify-center text-5xl shadow-xl mb-4 animate-bounce">
            🧺
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-amber-950 mb-2">
            Bé Thu Hoạch Giỏ Quà Siêu Xuất Sắc!
          </h2>

          <p className="text-base sm:text-lg font-bold text-stone-700 max-w-md mx-auto mb-4">
            Bé đã biết thêm bớt đồ vật để tạo thành nhóm số lượng đúng theo yêu cầu của cô!
          </p>

          <div className="bg-white/90 p-4 rounded-2xl max-w-md mx-auto border-2 border-amber-200 shadow-sm mb-6 text-emerald-900 font-extrabold">
            🌟 Cô giáo Nguyễn Thị Huyền tặng bé 2 Ngôi Sao Vàng!
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
