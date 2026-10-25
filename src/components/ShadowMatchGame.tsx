import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Volume2, RotateCcw, ArrowRight, CheckCircle2, ChevronLeft, Sparkles } from 'lucide-react';
import { soundManager } from '../utils/soundEffects';

interface ShadowMatchGameProps {
  onAddStar: () => void;
  onBackToMenu: () => void;
  onCompleteGame: () => void;
}

interface ShadowItem {
  id: string;
  name: string;
  emoji: string;
  hint: string;
  colorBg: string;
}

const SHADOW_ITEMS: ShadowItem[] = [
  { id: 'elephant', name: 'Chú Voi Khổng Lồ', emoji: '🐘', hint: 'Chú voi có chiếc vòi dài và đôi tai to như cái quạt', colorBg: 'bg-blue-100 border-blue-300' },
  { id: 'rabbit', name: 'Chú Thỏ Trắng', emoji: '🐇', hint: 'Chú thỏ có đôi tai dài dựng đứng và chiếc đuôi tròn ngắn', colorBg: 'bg-rose-100 border-rose-300' },
  { id: 'butterfly', name: 'Chú Bướm Xinh', emoji: '🦋', hint: 'Chú bướm có đôi cánh xòe rộng bay lượn trên vườn hoa', colorBg: 'bg-purple-100 border-purple-300' },
  { id: 'apple', name: 'Quả Táo Đỏ', emoji: '🍎', hint: 'Quả táo tròn trịa có cuống và chiếc lá nhỏ ở trên', colorBg: 'bg-red-100 border-red-300' },
  { id: 'dog', name: 'Chú Cún Con', emoji: '🐶', hint: 'Chú cún vẫy đuôi mừng bé đi học về', colorBg: 'bg-amber-100 border-amber-300' },
];

export const ShadowMatchGame: React.FC<ShadowMatchGameProps> = ({
  onAddStar,
  onBackToMenu,
  onCompleteGame,
}) => {
  const [matchedIds, setMatchedIds] = useState<Record<string, boolean>>({});
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [hintText, setHintText] = useState<string>('Bé hãy chọn một hình con vật ở khay dưới, rồi chạm vào chiếc bóng đen tương ứng nhé!');
  const [isCompleted, setIsCompleted] = useState(false);

  const remainingItems = SHADOW_ITEMS.filter(item => !matchedIds[item.id]);

  // Auto speak on mount
  React.useEffect(() => {
    const timer = setTimeout(() => {
      soundManager.speakVietnamese(hintText);
    }, 400);
    return () => clearTimeout(timer);
  }, []);

  const handleSpeak = () => {
    soundManager.speakVietnamese(hintText);
  };

  const handleSelectItem = (id: string) => {
    soundManager.playClick();
    setSelectedId(id);
    const item = SHADOW_ITEMS.find(i => i.id === id);
    if (item) {
      const msg = `Bé đã chọn ${item.name}! Bây giờ bé hãy chạm vào chiếc bóng của bạn ấy nhé!`;
      setHintText(msg);
      soundManager.speakVietnamese(`Bé tìm chiếc bóng của ${item.name} nào!`);
    }
  };

  const handleSlotClick = (targetId: string) => {
    if (matchedIds[targetId]) return;

    if (!selectedId) {
      const target = SHADOW_ITEMS.find(i => i.id === targetId);
      if (target) {
        soundManager.playClick();
        setHintText(`Đây là chiếc bóng của ${target.name}. Bé hãy chạm vào hình ${target.name} ở khay dưới để ghép nhé!`);
        soundManager.speakVietnamese(`Bé tìm hình ${target.name} ở dưới để ghép vào bóng này nhé!`);
      }
      return;
    }

    if (selectedId === targetId) {
      // MATCH!
      const target = SHADOW_ITEMS.find(i => i.id === targetId)!;
      soundManager.playSuccess();
      const updated = { ...matchedIds, [targetId]: true };
      setMatchedIds(updated);
      setSelectedId(null);
      onAddStar();

      confetti({
        particleCount: 45,
        spread: 60,
        origin: { y: 0.6 },
      });

      const congrats = `Đúng rồi! Bé đã tìm chuẩn xác chiếc bóng cho ${target.name}!`;
      setHintText(congrats);
      soundManager.speakVietnamese(`Bé giỏi quá! Ghép đúng bóng của ${target.name} rồi nè!`);

      if (Object.keys(updated).length === SHADOW_ITEMS.length) {
        setTimeout(() => {
          setIsCompleted(true);
          soundManager.playFanfare();
          onCompleteGame();
          confetti({
            particleCount: 150,
            spread: 90,
            origin: { y: 0.4 },
          });
          soundManager.speakVietnamese('Hoan hô bé! Bé đã tìm đúng tất cả chiếc bóng cho các bạn nhỏ rồi! Cô Huyền tặng bé điểm 10!');
        }, 600);
      }

    } else {
      // Wrong match
      soundManager.playTryAgain();
      const sel = SHADOW_ITEMS.find(i => i.id === selectedId);
      const tar = SHADOW_ITEMS.find(i => i.id === targetId);
      setHintText(`Chưa đúng bóng rồi bé ơi! Chiếc bóng này là của ${tar?.name}, còn bé đang cầm ${sel?.name}. Bé quan sát kỹ lại nhé!`);
      soundManager.speakVietnamese('Chưa đúng bóng rồi bé yêu, bé nhìn kỹ lại hình dáng xem nào!');
    }
  };

  const handleRestart = () => {
    soundManager.playClick();
    setMatchedIds({});
    setSelectedId(null);
    setIsCompleted(false);
    setHintText('Bé hãy chọn một hình con vật ở khay dưới, rồi chạm vào chiếc bóng đen tương ứng nhé!');
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
          <span className="text-xs sm:text-sm font-bold bg-purple-100 text-purple-900 px-3 py-1 rounded-full border border-purple-300">
            👥 Đã ghép: {Object.keys(matchedIds).length} / {SHADOW_ITEMS.length}
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

      {!isCompleted ? (
        <div className="bg-gradient-to-b from-purple-50 via-pink-50 to-amber-50 rounded-3xl p-4 sm:p-7 shadow-xl border-4 border-purple-300">
          
          <div className="text-center mb-5">
            <div className="inline-flex items-center gap-2 bg-white/90 px-4 py-1 rounded-full shadow-xs border border-purple-200 mb-2">
              <span className="text-xl">👥</span>
              <h2 className="text-base sm:text-xl font-black text-purple-900">
                Trò Chơi: Ghép Bóng Với Hình (Shadow Matching)
              </h2>
              <span className="text-xl">✨</span>
            </div>
            <p className="text-sm sm:text-base font-extrabold text-stone-700 max-w-xl mx-auto leading-relaxed">
              {hintText}
            </p>
          </div>

          {/* Upper Stage: The Shadows (Bóng đen mờ) */}
          <div className="bg-white/80 rounded-2xl p-4 sm:p-6 mb-6 border-3 border-purple-200 shadow-inner">
            <div className="text-xs font-black uppercase text-purple-800 tracking-wider text-center mb-3">
              🌑 HÀNG BÓNG ĐEN BÍ MẬT (Chạm vào bóng để ghép)
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 sm:gap-4">
              {SHADOW_ITEMS.map((item) => {
                const isMatched = matchedIds[item.id];
                return (
                  <div
                    key={item.id}
                    onClick={() => handleSlotClick(item.id)}
                    className={`h-32 sm:h-36 rounded-2xl flex flex-col items-center justify-center p-2 cursor-pointer transition-all transform active:scale-95 border-3 ${
                      isMatched
                        ? `${item.colorBg} shadow-md scale-102`
                        : 'bg-stone-900/10 hover:bg-stone-900/20 border-dashed border-stone-500'
                    }`}
                  >
                    {isMatched ? (
                      <>
                        <span className="text-5xl sm:text-6xl animate-bounce-slow drop-shadow">
                          {item.emoji}
                        </span>
                        <span className="text-xs font-black text-stone-800 mt-2 text-center">
                          {item.name}
                        </span>
                        <span className="text-[10px] text-emerald-600 font-bold">
                          ✓ Đã tìm đúng
                        </span>
                      </>
                    ) : (
                      <>
                        {/* Shadow representation: Silhouetted filter */}
                        <div className="relative">
                          <span
                            className="text-5xl sm:text-6xl select-none pointer-events-none block"
                            style={{
                              filter: 'brightness(0) opacity(0.85)',
                            }}
                          >
                            {item.emoji}
                          </span>
                        </div>
                        <span className="text-[11px] font-black text-stone-600 mt-2 bg-white/70 px-2 py-0.5 rounded-full">
                          Bóng ai đây?
                        </span>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Lower Tray: The Colorful Characters */}
          <div className="bg-white p-4 rounded-2xl border-2 border-stone-200 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs sm:text-sm font-black text-stone-700 uppercase tracking-wide">
                🎨 KHAY CÁC BẠN NHỎ ĐẦY MÀU SẮC:
              </span>
              {selectedId && (
                <span className="text-xs font-bold bg-amber-100 text-amber-900 px-3 py-0.5 rounded-full border border-amber-300 animate-pulse">
                  Đang chọn 1 bạn!
                </span>
              )}
            </div>

            {remainingItems.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                {remainingItems.map((item) => {
                  const isSelected = selectedId === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleSelectItem(item.id)}
                      className={`p-3 rounded-2xl flex flex-col items-center justify-center gap-1 transition-all transform active:scale-95 border-3 ${
                        isSelected
                          ? 'ring-4 ring-purple-400 bg-purple-50 border-purple-500 scale-105 shadow-md'
                          : 'bg-stone-50 hover:bg-stone-100 border-stone-200 shadow-xs'
                      }`}
                    >
                      <span className="text-4xl sm:text-5xl drop-shadow">{item.emoji}</span>
                      <span className="text-xs font-black text-stone-800 text-center leading-tight">
                        {item.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-3 text-emerald-700 font-black text-sm">
                🎉 Bé đã tìm hết bóng cho tất cả các bạn rồi!
              </div>
            )}
          </div>

        </div>
      ) : (
        /* Completed Screen */
        <div className="bg-gradient-to-b from-purple-100 via-pink-50 to-amber-100 rounded-3xl p-6 sm:p-10 shadow-xl border-4 border-purple-300 text-center">
          <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-tr from-purple-500 to-pink-400 text-white flex items-center justify-center text-5xl shadow-xl mb-4 animate-bounce">
            🏆
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-purple-900 mb-2">
            Mắt Bé Tinh Như Chú Mèo!
          </h2>

          <p className="text-base sm:text-lg font-bold text-stone-700 max-w-md mx-auto mb-4">
            Bé đã nhìn ra và ghép chính xác tất cả các chiếc bóng đen với hình các bạn nhỏ đáng yêu!
          </p>

          <div className="bg-white/90 p-4 rounded-2xl max-w-md mx-auto border-2 border-purple-200 shadow-sm mb-6 text-purple-950 font-extrabold">
            🌟 Cô giáo Nguyễn Thị Huyền tặng bé 2 Ngôi Sao Vàng!
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={handleRestart}
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-purple-500 hover:bg-purple-600 text-white font-black px-6 py-3 rounded-2xl shadow-md border-2 border-white active:scale-95 transition-all"
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
