import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Volume2, ChevronLeft, ArrowRight, RotateCcw, Heart, Sparkles } from 'lucide-react';
import { soundManager } from '../utils/soundEffects';

interface PairFriendsGameProps {
  onAddStar: () => void;
  onBackToMenu: () => void;
  onCompleteGame: () => void;
}

interface BestFriendPair {
  id: string;
  charName: string;
  charEmoji: string;
  itemName: string;
  itemEmoji: string;
  relationDesc: string;
}

const FRIEND_PAIRS: BestFriendPair[] = [
  { id: 'f1', charName: 'Chú Thỏ', charEmoji: '🐇', itemName: 'Củ Cà Rốt', itemEmoji: '🥕', relationDesc: 'Thỏ thích ăn cà rốt' },
  { id: 'f2', charName: 'Chú Mèo', charEmoji: '🐱', itemName: 'Con Cá Vàng', itemEmoji: '🐟', relationDesc: 'Mèo thích ăn cá' },
  { id: 'f3', charName: 'Chú Cún', charEmoji: '🐶', itemName: 'Khúc Xương', itemEmoji: '🦴', relationDesc: 'Cún thích gặm xương' },
  { id: 'f4', charName: 'Bông Hoa', charEmoji: '🌸', itemName: 'Chú Bướm Xinh', itemEmoji: '🦋', relationDesc: 'Bướm bay lượn trên hoa' },
];

export const PairFriendsGame: React.FC<PairFriendsGameProps> = ({
  onAddStar,
  onBackToMenu,
  onCompleteGame,
}) => {
  const [selectedCharId, setSelectedCharId] = useState<string | null>(null);
  const [matchedPairs, setMatchedPairs] = useState<Record<string, boolean>>({});
  const [isFinished, setIsFinished] = useState(false);

  // Shuffled items on right
  const rightItems = [
    { id: 'f2', name: 'Con Cá Vàng', emoji: '🐟' },
    { id: 'f4', name: 'Chú Bướm Xinh', emoji: '🦋' },
    { id: 'f1', name: 'Củ Cà Rốt', emoji: '🥕' },
    { id: 'f3', name: 'Khúc Xương', emoji: '🦴' },
  ];

  const promptText = 'Bé hãy tìm thức ăn và bạn bè tương ứng để ghép thành Đôi Bạn Thân cho các con vật nhé!';

  useEffect(() => {
    const timer = setTimeout(() => {
      soundManager.speakVietnamese(promptText);
    }, 400);
    return () => clearTimeout(timer);
  }, []);

  const handleSpeak = () => {
    soundManager.speakVietnamese(promptText);
  };

  const handleSelectChar = (id: string) => {
    if (matchedPairs[id]) return;
    soundManager.playClick();
    setSelectedCharId(id);
    const item = FRIEND_PAIRS.find(p => p.id === id);
    if (item) {
      soundManager.speakVietnamese(`Bé đã chọn ${item.charName}. Đố bé biết bạn ấy thích gì ở cột bên phải?`);
    }
  };

  const handleSelectItem = (itemId: string) => {
    if (!selectedCharId) {
      soundManager.playClick();
      const it = rightItems.find(r => r.id === itemId);
      soundManager.speakVietnamese(`Đây là ${it?.name}. Bé hãy chọn bạn nhỏ ở cột bên trái trước nhé!`);
      return;
    }

    if (selectedCharId === itemId) {
      // MATCH!
      const current = FRIEND_PAIRS.find(p => p.id === itemId)!;
      soundManager.playSuccess();
      const updated = { ...matchedPairs, [itemId]: true };
      setMatchedPairs(updated);
      setSelectedCharId(null);
      onAddStar();

      confetti({
        particleCount: 40,
        spread: 50,
        origin: { y: 0.6 },
      });

      soundManager.speakVietnamese(`Tuyệt vời! ${current.relationDesc}! Hai bạn đã tìm thấy nhau rồi!`);

      if (Object.keys(updated).length === FRIEND_PAIRS.length) {
        setTimeout(() => {
          setIsFinished(true);
          soundManager.playFanfare();
          onCompleteGame();
          confetti({
            particleCount: 150,
            spread: 90,
            origin: { y: 0.4 },
          });
          soundManager.speakVietnamese('Hoan hô bé! Bé đã tìm đúng tất cả các Đôi Bạn Thân rất là tài ba!');
        }, 600);
      }
    } else {
      // WRONG
      soundManager.playTryAgain();
      const sel = FRIEND_PAIRS.find(p => p.id === selectedCharId);
      const tar = rightItems.find(r => r.id === itemId);
      soundManager.speakVietnamese(`Chưa đúng rồi bé ơi! ${sel?.charName} không thích ${tar?.name} đâu, bé chọn lại nhé!`);
    }
  };

  const handleRestart = () => {
    soundManager.playClick();
    setMatchedPairs({});
    setSelectedCharId(null);
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
            🤝 Đã ghép: {Object.keys(matchedPairs).length} / {FRIEND_PAIRS.length} Đôi bạn
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
        <div className="bg-gradient-to-b from-rose-50 via-pink-50 to-amber-50 rounded-3xl p-5 sm:p-8 shadow-xl border-4 border-rose-300">
          
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-2 bg-white/90 px-4 py-1 rounded-full shadow-xs border border-rose-200 mb-2">
              <span className="text-xl">🤝</span>
              <h2 className="text-base sm:text-xl font-black text-rose-900">
                Trạm 6: Đôi Bạn Thân (Ghép Cặp Tương Ứng)
              </h2>
              <span className="text-xl">💖</span>
            </div>

            <h3 className="text-lg sm:text-2xl font-black text-stone-900 mt-2 leading-snug">
              {promptText}
            </h3>

            <p className="text-xs sm:text-sm text-stone-600 font-bold mt-1">
              💡 Chạm vào con vật bên trái, sau đó chạm thức ăn tương ứng ở bên phải nhé!
            </p>
          </div>

          {/* Interactive 2-Column Friendship Match */}
          <div className="grid grid-cols-2 gap-4 sm:gap-8 max-w-2xl mx-auto my-6">
            
            {/* Left: Characters */}
            <div className="flex flex-col gap-3">
              <div className="text-center text-xs font-black uppercase text-stone-600">
                👈 CÁC BẠN NHỎ
              </div>

              {FRIEND_PAIRS.map((pair) => {
                const isMatched = matchedPairs[pair.id];
                const isSelected = selectedCharId === pair.id;

                return (
                  <button
                    key={pair.id}
                    disabled={isMatched}
                    onClick={() => handleSelectChar(pair.id)}
                    className={`p-3.5 sm:p-4 rounded-2xl flex flex-col items-center justify-center transition-all transform active:scale-95 border-3 ${
                      isMatched
                        ? 'bg-emerald-100 border-emerald-400 opacity-80'
                        : isSelected
                        ? 'bg-rose-100 border-rose-500 ring-4 ring-rose-300 scale-103 shadow-md'
                        : 'bg-white hover:bg-stone-50 border-stone-200 shadow-sm'
                    }`}
                  >
                    <span className="text-4xl sm:text-5xl drop-shadow">{pair.charEmoji}</span>
                    <span className="text-xs font-black text-stone-800 mt-1">
                      {pair.charName} {isMatched ? '✓ Đã có bạn' : ''}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Right: Items / Food */}
            <div className="flex flex-col gap-3">
              <div className="text-center text-xs font-black uppercase text-stone-600">
                👉 MÓN YÊU THÍCH
              </div>

              {rightItems.map((item) => {
                const isMatched = matchedPairs[item.id];

                return (
                  <button
                    key={item.id}
                    disabled={isMatched}
                    onClick={() => handleSelectItem(item.id)}
                    className={`p-3.5 sm:p-4 rounded-2xl flex flex-col items-center justify-center transition-all transform active:scale-95 border-3 ${
                      isMatched
                        ? 'bg-emerald-100 border-emerald-400 opacity-80'
                        : 'bg-white hover:bg-amber-50 border-stone-200 shadow-sm hover:border-amber-400'
                    }`}
                  >
                    <span className="text-4xl sm:text-5xl drop-shadow">{item.emoji}</span>
                    <span className="text-xs font-black text-stone-800 mt-1">
                      {item.name} {isMatched ? '✓ Đã ghép' : ''}
                    </span>
                  </button>
                );
              })}
            </div>

          </div>

        </div>
      ) : (
        /* Completed */
        <div className="bg-gradient-to-b from-rose-100 via-pink-50 to-amber-100 rounded-3xl p-6 sm:p-10 shadow-xl border-4 border-rose-300 text-center">
          <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-tr from-rose-500 to-pink-400 text-white flex items-center justify-center text-5xl shadow-xl mb-4 animate-bounce">
            💖
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-rose-950 mb-2">
            Bé Nối Vòng Tay Bạn Bè Tuyệt Vời!
          </h2>

          <p className="text-base sm:text-lg font-bold text-stone-700 max-w-md mx-auto mb-4">
            Bé đã biết Thỏ thích cà rốt, Mèo thích cá, Cún thích xương và Bướm vờn bên hoa!
          </p>

          <div className="bg-white/90 p-4 rounded-2xl max-w-md mx-auto border-2 border-rose-200 shadow-sm mb-6 text-emerald-900 font-extrabold">
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
