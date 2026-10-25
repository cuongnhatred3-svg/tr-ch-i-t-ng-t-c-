import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Volume2, ChevronLeft, ArrowRight, RotateCcw, Link, Sparkles } from 'lucide-react';
import { soundManager } from '../utils/soundEffects';

interface MatchLineGameProps {
  onAddStar: () => void;
  onBackToMenu: () => void;
  onCompleteGame: () => void;
}

interface MatchPair {
  id: string;
  name: string;
  emoji: string;
  count: number;
}

const ROUND_PAIRS: MatchPair[] = [
  { id: 'p1', name: '1 Chú Gấu', emoji: '🧸', count: 1 },
  { id: 'p2', name: '2 Chú Vịt', emoji: '🦆🦆', count: 2 },
  { id: 'p3', name: '3 Quả Dâu', emoji: '🍓🍓🍓', count: 3 },
  { id: 'p4', name: '4 Bông Hoa', emoji: '🌸🌸🌸🌸', count: 4 },
];

export const MatchLineGame: React.FC<MatchLineGameProps> = ({
  onAddStar,
  onBackToMenu,
  onCompleteGame,
}) => {
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
  const [matchedPairs, setMatchedPairs] = useState<Record<string, boolean>>({});
  const [isFinished, setIsFinished] = useState(false);

  // Numbers on right side (jumbled)
  const rightNumbers = [3, 1, 4, 2];

  const questionPrompt = 'Bé hãy đếm số lượng ở cột bên trái rồi chạm vào số tương ứng ở cột bên phải để nối lại nhé!';

  useEffect(() => {
    const timer = setTimeout(() => {
      soundManager.speakVietnamese(questionPrompt);
    }, 400);
    return () => clearTimeout(timer);
  }, []);

  const handleSpeak = () => {
    soundManager.speakVietnamese(questionPrompt);
  };

  const handleSelectLeft = (id: string) => {
    if (matchedPairs[id]) return;
    soundManager.playClick();
    setSelectedLeft(id);
    const item = ROUND_PAIRS.find(p => p.id === id);
    if (item) {
      soundManager.speakVietnamese(`Bé hãy tìm số ${item.count} ở bên phải để nối với ${item.name} nhé!`);
    }
  };

  const handleSelectRight = (num: number) => {
    if (!selectedLeft) {
      soundManager.playClick();
      soundManager.speakVietnamese(`Đây là số ${num}. Bé hãy chạm vào nhóm đồ vật bên trái có số lượng là ${num} nhé!`);
      return;
    }

    const currentItem = ROUND_PAIRS.find(p => p.id === selectedLeft);
    if (!currentItem) return;

    if (currentItem.count === num) {
      // MATCH!
      soundManager.playSuccess();
      const updated = { ...matchedPairs, [selectedLeft]: true };
      setMatchedPairs(updated);
      setSelectedLeft(null);
      onAddStar();

      confetti({
        particleCount: 40,
        spread: 50,
        origin: { y: 0.6 },
      });

      soundManager.speakVietnamese(`Đúng rồi! Nối ${currentItem.name} với số ${num} rất chính xác!`);

      if (Object.keys(updated).length === ROUND_PAIRS.length) {
        setTimeout(() => {
          setIsFinished(true);
          soundManager.playFanfare();
          onCompleteGame();
          confetti({
            particleCount: 150,
            spread: 90,
            origin: { y: 0.4 },
          });
          soundManager.speakVietnamese('Hoan hô bé! Bé đã nối đúng tất cả các cây cầu số lượng với chữ số rồi!');
        }, 600);
      }
    } else {
      // WRONG
      soundManager.playTryAgain();
      soundManager.speakVietnamese(`Chưa khớp rồi bé ơi! ${currentItem.name} có ${currentItem.count} bạn, không phải số ${num}. Bé thử lại nhé!`);
    }
  };

  const handleRestart = () => {
    soundManager.playClick();
    setMatchedPairs({});
    setSelectedLeft(null);
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
          <span className="text-xs sm:text-sm font-bold bg-sky-100 text-sky-900 px-3 py-1 rounded-full border border-sky-300">
            🔗 Đã nối: {Object.keys(matchedPairs).length} / {ROUND_PAIRS.length} Cặp
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
        <div className="bg-gradient-to-b from-sky-50 via-indigo-50 to-emerald-50 rounded-3xl p-5 sm:p-8 shadow-xl border-4 border-sky-300">
          
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-2 bg-white/90 px-4 py-1 rounded-full shadow-xs border border-sky-200 mb-2">
              <span className="text-xl">🔗</span>
              <h2 className="text-base sm:text-xl font-black text-sky-950">
                Trạm 3: Cầu Nối Số (Nối Đồ Vật Với Chữ Số)
              </h2>
              <span className="text-xl">✨</span>
            </div>

            <h3 className="text-lg sm:text-2xl font-black text-stone-900 mt-2 leading-snug">
              {questionPrompt}
            </h3>

            <p className="text-xs sm:text-sm text-stone-600 font-bold mt-1">
              💡 Chạm nhóm đồ vật bên trái trước, rồi chạm chữ số tương ứng bên phải nhé!
            </p>
          </div>

          {/* Interactive 2-Column Bridge Match */}
          <div className="grid grid-cols-2 gap-4 sm:gap-8 max-w-2xl mx-auto my-6">
            
            {/* Left Column: Groups of Items */}
            <div className="flex flex-col gap-3">
              <div className="text-center text-xs font-black uppercase text-stone-600">
                👈 NHÓM ĐỒ VẬT
              </div>

              {ROUND_PAIRS.map((item) => {
                const isMatched = matchedPairs[item.id];
                const isSelected = selectedLeft === item.id;

                return (
                  <button
                    key={item.id}
                    disabled={isMatched}
                    onClick={() => handleSelectLeft(item.id)}
                    className={`p-3.5 sm:p-4 rounded-2xl flex flex-col items-center justify-center transition-all transform active:scale-95 border-3 ${
                      isMatched
                        ? 'bg-emerald-100 border-emerald-400 opacity-80'
                        : isSelected
                        ? 'bg-amber-100 border-amber-500 ring-4 ring-amber-300 scale-103 shadow-md'
                        : 'bg-white hover:bg-stone-50 border-stone-200 shadow-sm'
                    }`}
                  >
                    <span className="text-3xl sm:text-4xl drop-shadow">{item.emoji}</span>
                    <span className="text-xs font-black text-stone-800 mt-1">
                      {item.name} {isMatched ? '✓ Đã nối' : ''}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Right Column: Numbers */}
            <div className="flex flex-col gap-3">
              <div className="text-center text-xs font-black uppercase text-stone-600">
                👉 CHỮ SỐ TƯƠNG ỨNG
              </div>

              {rightNumbers.map((num) => {
                const matchedItem = ROUND_PAIRS.find(p => p.count === num && matchedPairs[p.id]);

                return (
                  <button
                    key={num}
                    disabled={!!matchedItem}
                    onClick={() => handleSelectRight(num)}
                    className={`p-3.5 sm:p-4 rounded-2xl flex flex-col items-center justify-center transition-all transform active:scale-95 border-3 ${
                      matchedItem
                        ? 'bg-emerald-100 border-emerald-400 opacity-80'
                        : 'bg-white hover:bg-sky-50 border-stone-200 shadow-sm hover:border-sky-400'
                    }`}
                  >
                    <span className="text-3xl sm:text-4xl font-black text-sky-800">
                      {num === 1 ? '1️⃣' : num === 2 ? '2️⃣' : num === 3 ? '3️⃣' : '4️⃣'}
                    </span>
                    <span className="text-xs font-black text-stone-700 mt-1">
                      Số {num} {matchedItem ? '✓ Đã nối' : ''}
                    </span>
                  </button>
                );
              })}
            </div>

          </div>

        </div>
      ) : (
        /* Completed */
        <div className="bg-gradient-to-b from-sky-100 via-indigo-50 to-emerald-100 rounded-3xl p-6 sm:p-10 shadow-xl border-4 border-sky-300 text-center">
          <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-tr from-sky-500 to-indigo-400 text-white flex items-center justify-center text-5xl shadow-xl mb-4 animate-bounce">
            🔗
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-sky-950 mb-2">
            Bé Xây Cầu Nối Số Quá Giỏi!
          </h2>

          <p className="text-base sm:text-lg font-bold text-stone-700 max-w-md mx-auto mb-4">
            Bé đã nhận biết thành thạo mối liên hệ giữa số lượng vật phẩm và chữ số từ 1 đến 4!
          </p>

          <div className="bg-white/90 p-4 rounded-2xl max-w-md mx-auto border-2 border-sky-200 shadow-sm mb-6 text-emerald-900 font-extrabold">
            🌟 Cô giáo Nguyễn Thị Huyền: "Bé lớp 3 Tuổi C2 nối số rất chuẩn xác!"
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={handleRestart}
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-sky-500 hover:bg-sky-600 text-white font-black px-6 py-3 rounded-2xl shadow-md border-2 border-white active:scale-95 transition-all"
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
