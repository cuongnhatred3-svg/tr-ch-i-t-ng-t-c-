import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Volume2, RotateCcw, ArrowRight, Award, CheckCircle2, Sparkles, HelpCircle } from 'lucide-react';
import { soundManager } from '../utils/soundEffects';

interface ShapePuzzleGameProps {
  onAddStar: () => void;
  onBackToMenu: () => void;
  onCompleteGame: () => void;
}

interface PuzzleSlot {
  id: string;
  name: string;
  shapeType: 'triangle' | 'square' | 'circle' | 'rectangle';
  title: string;
  colorClass: string;
  borderColorClass: string;
  svgPath: string; // Representation for SVG outline
  icon: string;
  description: string;
}

const PUZZLE_PIECES: PuzzleSlot[] = [
  {
    id: 'roof',
    name: 'Mái nhà ngói đỏ',
    shapeType: 'triangle',
    title: 'Hình Tam Giác',
    colorClass: 'bg-rose-500 text-white',
    borderColorClass: 'border-rose-400',
    svgPath: 'M 10 90 L 50 10 L 90 90 Z',
    icon: '🔺',
    description: 'Mái nhà che mưa che nắng hình tam giác',
  },
  {
    id: 'house-body',
    name: 'Thân nhà xinh xắn',
    shapeType: 'square',
    title: 'Hình Vuông',
    colorClass: 'bg-amber-400 text-amber-950',
    borderColorClass: 'border-amber-400',
    svgPath: 'M 10 10 L 90 10 L 90 90 L 10 90 Z',
    icon: '🟨',
    description: 'Thân nhà 4 cạnh vuông vắn',
  },
  {
    id: 'main-door',
    name: 'Cửa ra vào',
    shapeType: 'rectangle',
    title: 'Hình Chữ Nhật',
    colorClass: 'bg-emerald-500 text-white',
    borderColorClass: 'border-emerald-400',
    svgPath: 'M 20 5 L 80 5 L 80 95 L 20 95 Z',
    icon: '🚪',
    description: 'Cánh cửa 2 cạnh dài 2 cạnh ngắn',
  },
  {
    id: 'window',
    name: 'Cửa sổ tròn ngắm hoa',
    shapeType: 'circle',
    title: 'Hình Tròn',
    colorClass: 'bg-sky-400 text-white',
    borderColorClass: 'border-sky-400',
    svgPath: '',
    icon: '🔵',
    description: 'Cửa sổ tròn xoe đón gió mát',
  },
  {
    id: 'sun',
    name: 'Ông mặt trời tỏa nắng',
    shapeType: 'circle',
    title: 'Hình Tròn',
    colorClass: 'bg-yellow-400 text-yellow-950',
    borderColorClass: 'border-yellow-400',
    svgPath: '',
    icon: '☀️',
    description: 'Mặt trời tròn xoe chiếu sáng trường mầm non',
  },
];

export const ShapePuzzleGame: React.FC<ShapePuzzleGameProps> = ({
  onAddStar,
  onBackToMenu,
  onCompleteGame,
}) => {
  const [placedPieces, setPlacedPieces] = useState<Record<string, boolean>>({});
  const [selectedPieceId, setSelectedPieceId] = useState<string | null>(null);
  const [hintMessage, setHintMessage] = useState<string>('Bé hãy chọn một hình khối ở khay dưới rồi chạm vào ô bóng mờ tương ứng nhé!');
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  // Remaining pieces in tray
  const remainingPieces = PUZZLE_PIECES.filter(p => !placedPieces[p.id]);

  // Auto speak instruction on mount
  React.useEffect(() => {
    const timer = setTimeout(() => {
      soundManager.speakVietnamese(hintMessage);
    }, 400);
    return () => clearTimeout(timer);
  }, []);

  const handleSpeakInstruction = () => {
    soundManager.speakVietnamese(hintMessage);
  };

  const handleSelectPieceInTray = (pieceId: string) => {
    soundManager.playClick();
    setSelectedPieceId(pieceId);
    const piece = PUZZLE_PIECES.find(p => p.id === pieceId);
    if (piece) {
      const msg = `Bé đã chọn ${piece.title} (${piece.name}). Bây giờ bé hãy chạm vào khung bóng mờ ${piece.title} trên ngôi nhà nhé!`;
      setHintMessage(msg);
      soundManager.speakVietnamese(`Bé hãy ghép ${piece.title} vào ngôi nhà nào!`);
    }
  };

  const handleTargetSlotClick = (slotId: string) => {
    if (placedPieces[slotId]) return; // already placed

    if (!selectedPieceId) {
      // User tapped slot first without selecting piece
      const slot = PUZZLE_PIECES.find(p => p.id === slotId);
      if (slot) {
        soundManager.playClick();
        setHintMessage(`Đây là khung ${slot.title} (${slot.name}). Bé hãy chạm vào miếng ghép ${slot.title} ở khay bên dưới nào!`);
        soundManager.speakVietnamese(`Bé tìm ${slot.title} ở khay dưới để ghép vào đây nhé!`);
      }
      return;
    }

    // Checking match
    if (selectedPieceId === slotId) {
      // MATCH!
      const piece = PUZZLE_PIECES.find(p => p.id === slotId)!;
      soundManager.playSuccess();
      const updatedPlaced = { ...placedPieces, [slotId]: true };
      setPlacedPieces(updatedPlaced);
      setSelectedPieceId(null);
      onAddStar();

      confetti({
        particleCount: 40,
        spread: 50,
        origin: { y: 0.6 },
      });

      const successMsg = `Đúng rồi! Bé đã ghép chuẩn xác ${piece.title} cho ${piece.name}!`;
      setHintMessage(successMsg);
      soundManager.speakVietnamese(`Bé giỏi quá! Ghép đúng ${piece.title} rồi!`);

      // Check if all placed
      if (Object.keys(updatedPlaced).length === PUZZLE_PIECES.length) {
        setTimeout(() => {
          setIsCompleted(true);
          soundManager.playFanfare();
          onCompleteGame();
          confetti({
            particleCount: 150,
            spread: 90,
            origin: { y: 0.4 },
          });
          soundManager.speakVietnamese('Tuyệt vời! Bé đã hoàn thành bức tranh Ngôi Nhà Mơ Ước Lớp 3 Tuổi C2 thật rực rỡ!');
        }, 600);
      }

    } else {
      // Mismatch
      soundManager.playTryAgain();
      const selected = PUZZLE_PIECES.find(p => p.id === selectedPieceId);
      const target = PUZZLE_PIECES.find(p => p.id === slotId);
      setHintMessage(`Chưa đúng hình rồi bé ơi! Đây là khung ${target?.title}, còn bé đang cầm ${selected?.title}. Bé thử lại nhé!`);
      soundManager.speakVietnamese('Chưa khớp rồi, bé thử chọn lại khung phù hợp nhé!');
    }
  };

  const handleRestart = () => {
    soundManager.playClick();
    setPlacedPieces({});
    setSelectedPieceId(null);
    setIsCompleted(false);
    setHintMessage('Bé hãy chọn một hình khối ở khay dưới rồi chạm vào ô bóng mờ tương ứng nhé!');
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-3 sm:px-4 py-4 sm:py-6 select-none">
      
      {/* Top bar */}
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
          <span className="text-xs sm:text-sm font-bold bg-indigo-100 text-indigo-900 px-3 py-1 rounded-full border border-indigo-300">
            🧩 Đã ghép: {Object.keys(placedPieces).length} / {PUZZLE_PIECES.length}
          </span>
          <button
            onClick={handleSpeakInstruction}
            className="flex items-center gap-1 bg-amber-400 hover:bg-amber-500 text-amber-950 font-bold px-3 py-1 rounded-2xl shadow-sm text-xs sm:text-sm active:scale-95 transition-all"
            title="Đọc hướng dẫn"
          >
            <Volume2 className="w-4 h-4" />
            <span>Nghe hướng dẫn</span>
          </button>
        </div>
      </div>

      {!isCompleted ? (
        <div className="bg-gradient-to-b from-sky-50 via-teal-50 to-indigo-50 rounded-3xl p-4 sm:p-6 shadow-xl border-4 border-indigo-300 relative">
          
          {/* Title & Guidance */}
          <div className="text-center mb-4">
            <div className="inline-flex items-center gap-2 bg-white/85 px-4 py-1 rounded-full shadow-sm border border-indigo-200 mb-2">
              <span className="text-xl">🏡</span>
              <h2 className="text-base sm:text-xl font-black text-indigo-900">
                Trò chơi 2: Ghép Hình Vui Nhộn
              </h2>
              <span className="text-xl">🔺</span>
            </div>
            <p className="text-sm sm:text-base font-extrabold text-stone-700 max-w-xl mx-auto">
              {hintMessage}
            </p>
          </div>

          {/* Puzzle Canvas - "Ngôi Nhà Mơ Ước Lớp 3 Tuổi C2" */}
          <div className="bg-gradient-to-b from-sky-200 via-sky-100 to-emerald-200 rounded-3xl p-4 sm:p-8 shadow-inner border-4 border-white relative min-h-[340px] sm:min-h-[380px] flex flex-col justify-between overflow-hidden">
            
            {/* Top row: Sun & Clouds */}
            <div className="flex justify-between items-start">
              {/* Sun Slot */}
              <div
                onClick={() => handleTargetSlotClick('sun')}
                className={`cursor-pointer transition-all transform active:scale-95 relative flex flex-col items-center justify-center ${
                  placedPieces['sun']
                    ? 'w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-yellow-400 text-yellow-900 shadow-lg border-4 border-white animate-spin-slow'
                    : 'w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-yellow-200/50 border-4 border-dashed border-yellow-500 hover:bg-yellow-200/80'
                }`}
                title="Khung Mặt Trời Hình Tròn"
              >
                {placedPieces['sun'] ? (
                  <span className="text-4xl sm:text-5xl">☀️</span>
                ) : (
                  <div className="text-center p-1">
                    <span className="text-xs font-black text-yellow-800">Hình Tròn</span>
                    <div className="text-[10px] font-bold text-yellow-700">Mặt trời</div>
                  </div>
                )}
              </div>

              {/* Cloud decoration */}
              <div className="text-3xl sm:text-4xl pointer-events-none opacity-80">
                ☁️ 🕊️
              </div>
            </div>

            {/* Middle: The House Assemblage */}
            <div className="flex flex-col items-center justify-center my-2">
              
              {/* Roof Slot (Triangle) */}
              <div
                onClick={() => handleTargetSlotClick('roof')}
                className={`cursor-pointer transition-all transform active:scale-95 w-48 sm:w-64 h-24 sm:h-32 flex flex-col items-center justify-center relative ${
                  placedPieces['roof']
                    ? 'drop-shadow-lg'
                    : 'border-b-0'
                }`}
                title="Khung Mái Nhà Hình Tam Giác"
              >
                {placedPieces['roof'] ? (
                  <div className="w-full h-full relative flex items-center justify-center">
                    <svg viewBox="0 0 100 60" className="w-full h-full drop-shadow-md">
                      <polygon points="50,5 95,55 5,55" fill="#f43f5e" stroke="#be123c" strokeWidth="2" />
                    </svg>
                    <span className="absolute bottom-3 text-xs sm:text-sm font-black text-white bg-rose-700/60 px-2 py-0.5 rounded-full">
                      Mái Nhà Tam Giác
                    </span>
                  </div>
                ) : (
                  <div className="w-full h-full relative flex items-center justify-center">
                    <svg viewBox="0 0 100 60" className="w-full h-full">
                      <polygon
                        points="50,5 95,55 5,55"
                        fill="rgba(244, 63, 94, 0.2)"
                        stroke="#f43f5e"
                        strokeWidth="2.5"
                        strokeDasharray="4 3"
                      />
                    </svg>
                    <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-xs font-black text-rose-800 bg-white/70 px-2 py-0.5 rounded-full">
                      Hình Tam Giác 🔺
                    </span>
                  </div>
                )}
              </div>

              {/* House Body (Square) with Window & Door inside */}
              <div
                onClick={() => handleTargetSlotClick('house-body')}
                className={`relative w-44 sm:w-56 h-40 sm:h-52 rounded-2xl flex items-center justify-center transition-all ${
                  placedPieces['house-body']
                    ? 'bg-amber-300 border-4 border-amber-500 shadow-md'
                    : 'bg-amber-100/60 border-4 border-dashed border-amber-500 hover:bg-amber-100'
                }`}
                title="Khung Thân Nhà Hình Vuông"
              >
                {!placedPieces['house-body'] && (
                  <span className="absolute top-2 text-xs font-black text-amber-900 bg-white/80 px-2 py-0.5 rounded-full z-0">
                    Thân Nhà Hình Vuông 🟨
                  </span>
                )}

                {/* Sub-elements inside House Body */}
                <div className="w-full h-full flex flex-col justify-between p-3 relative z-10 pointer-events-auto">
                  
                  {/* Round Window (Circle) */}
                  <div className="flex justify-center">
                    <div
                      onClick={(e) => {
                        e.stopPropagation();
                        handleTargetSlotClick('window');
                      }}
                      className={`cursor-pointer w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center transition-all active:scale-90 ${
                        placedPieces['window']
                          ? 'bg-sky-400 border-4 border-white shadow-md text-white'
                          : 'bg-sky-100/70 border-3 border-dashed border-sky-500 hover:bg-sky-100'
                      }`}
                      title="Khung Cửa Sổ Hình Tròn"
                    >
                      {placedPieces['window'] ? (
                        <div className="text-center">
                          <span className="text-xl sm:text-2xl">🪟</span>
                        </div>
                      ) : (
                        <span className="text-[10px] font-black text-sky-800 text-center">
                          Hình Tròn 🔵
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Main Door (Rectangle) */}
                  <div className="flex justify-center">
                    <div
                      onClick={(e) => {
                        e.stopPropagation();
                        handleTargetSlotClick('main-door');
                      }}
                      className={`cursor-pointer w-16 sm:w-20 h-20 sm:h-24 rounded-t-xl flex flex-col items-center justify-center transition-all active:scale-90 ${
                        placedPieces['main-door']
                          ? 'bg-emerald-500 border-3 border-emerald-700 shadow-md text-white'
                          : 'bg-emerald-100/70 border-3 border-dashed border-emerald-600 hover:bg-emerald-100'
                      }`}
                      title="Khung Cửa Chính Hình Chữ Nhật"
                    >
                      {placedPieces['main-door'] ? (
                        <div className="text-center">
                          <span className="text-2xl">🚪</span>
                          <span className="text-[10px] font-bold block">Cửa Chữ Nhật</span>
                        </div>
                      ) : (
                        <span className="text-[10px] font-black text-emerald-900 text-center px-1">
                          Hình Chữ Nhật 🚪
                        </span>
                      )}
                    </div>
                  </div>

                </div>
              </div>

            </div>

            {/* Bottom garden flora */}
            <div className="flex justify-between items-center text-sm sm:text-base font-extrabold text-emerald-900 pointer-events-none">
              <span>🌸 Trường MN Thạch Thất 2</span>
              <span>Lớp 3 Tuổi C2 🌼</span>
            </div>

          </div>

          {/* Tray of Pieces to Pick */}
          <div className="mt-5 bg-white/90 p-4 rounded-2xl border-2 border-indigo-200 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs sm:text-sm font-extrabold text-stone-700 uppercase tracking-wide flex items-center gap-1.5">
                <span>🎨 Khay các miếng ghép hình:</span>
                <span className="text-indigo-600">({remainingPieces.length} miếng còn lại)</span>
              </span>
              {selectedPieceId && (
                <span className="text-xs font-bold bg-amber-100 text-amber-900 px-2.5 py-0.5 rounded-full border border-amber-300 animate-pulse">
                  Đang chọn 1 miếng!
                </span>
              )}
            </div>

            {remainingPieces.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 sm:gap-3">
                {remainingPieces.map((piece) => {
                  const isSelected = selectedPieceId === piece.id;
                  return (
                    <button
                      key={piece.id}
                      onClick={() => handleSelectPieceInTray(piece.id)}
                      className={`p-3 rounded-2xl flex flex-col items-center justify-center gap-1.5 transition-all transform active:scale-95 border-3 ${
                        isSelected
                          ? 'ring-4 ring-indigo-400 scale-105 shadow-lg bg-indigo-50 border-indigo-500'
                          : 'bg-white hover:bg-stone-50 border-stone-200 hover:border-indigo-300 shadow-sm'
                      }`}
                    >
                      <span className="text-3xl drop-shadow-sm">{piece.icon}</span>
                      <span className="text-xs font-black text-stone-900 leading-tight">
                        {piece.title}
                      </span>
                      <span className="text-[10px] font-bold text-stone-500">
                        {piece.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-2 text-emerald-700 font-black text-sm">
                🎉 Bé đã ghép hết tất cả các miếng vào ngôi nhà rồi!
              </div>
            )}
          </div>

        </div>
      ) : (
        /* Completed Screen */
        <div className="bg-gradient-to-b from-teal-50 via-sky-50 to-amber-100 rounded-3xl p-6 sm:p-10 shadow-xl border-4 border-emerald-300 text-center relative overflow-hidden">
          
          <div className="w-24 h-24 sm:w-28 sm:h-28 mx-auto rounded-full bg-gradient-to-tr from-emerald-400 to-teal-300 flex items-center justify-center text-5xl sm:text-6xl shadow-xl border-4 border-white mb-4 animate-bounce">
            🏰
          </div>

          <div className="inline-block bg-white/90 px-4 py-1 rounded-full text-xs sm:text-sm font-extrabold text-emerald-900 border border-emerald-300 mb-2">
            ⭐ Lớp 3 Tuổi C2 - Trường Mầm non Thạch Thất 2 ⭐
          </div>

          <h2 className="text-2xl sm:text-4xl font-black text-emerald-800 mb-2">
            Bé Là Kiến Trúc Sư Nhí Xuất Sắc!
          </h2>

          <p className="text-base sm:text-lg font-bold text-stone-700 max-w-lg mx-auto mb-5">
            Bé đã nhận biết và lắp ghép hoàn hảo cả 4 hình khối cơ bản: Hình Vuông, Hình Tròn, Hình Tam Giác và Hình Chữ Nhật để xây nên Ngôi Nhà Mơ Ước!
          </p>

          <div className="bg-white/90 p-4 rounded-2xl max-w-md mx-auto border-2 border-emerald-200 shadow-sm mb-6 text-emerald-950 font-extrabold">
            🌟 Cô giáo Nguyễn Thị Huyền tặng bé 1 Huy Hiệu Ngôi Nhà Mầm Non và 2 Ngôi Sao Vàng!
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={handleRestart}
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-indigo-500 hover:bg-indigo-600 text-white font-black px-6 py-3 rounded-2xl shadow-md border-2 border-white active:scale-95 transition-all"
            >
              <RotateCcw className="w-5 h-5" />
              <span>Ghép lại bức tranh</span>
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
