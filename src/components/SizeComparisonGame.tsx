import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Volume2, RotateCcw, ArrowRight, ChevronLeft, Sparkles, Smile } from 'lucide-react';
import { soundManager } from '../utils/soundEffects';

interface SizeComparisonGameProps {
  onAddStar: () => void;
  onBackToMenu: () => void;
  onCompleteGame: () => void;
}

interface SizeRound {
  id: string;
  category: 'To - Nhỏ' | 'Cao - Thấp' | 'Dài - Ngắn';
  prompt: string;
  audioPrompt: string;
  itemA: { id: string; name: string; emoji: string; sizeClass: string; isTarget: boolean; labelDesc: string };
  itemB: { id: string; name: string; emoji: string; sizeClass: string; isTarget: boolean; labelDesc: string };
  hint: string;
}

const SIZE_ROUNDS: SizeRound[] = [
  {
    id: 'sz-1',
    category: 'To - Nhỏ',
    prompt: 'Bé hãy tìm loại quả TO HƠN trong hai quả dưới đây:',
    audioPrompt: 'Bé hãy tìm loại quả TO HƠN trong hai quả dưới đây:',
    itemA: { id: 'watermelon', name: 'Quả Dưa Hấu', emoji: '🍉', sizeClass: 'text-7xl sm:text-8xl scale-125', isTarget: true, labelDesc: 'To hơn' },
    itemB: { id: 'strawberry', name: 'Quả Dâu Tây', emoji: '🍓', sizeClass: 'text-4xl sm:text-5xl scale-90', isTarget: false, labelDesc: 'Nhỏ hơn' },
    hint: 'Quả dưa hấu to bự ôm không xuể, còn quả dâu nhỏ xinh trên bàn tay!',
  },
  {
    id: 'sz-2',
    category: 'Cao - Thấp',
    prompt: 'Đố bé bạn nào CAO HƠN trong hai bạn dưới đây?',
    audioPrompt: 'Đố bé bạn nào CAO HƠN trong hai bạn dưới đây?',
    itemA: { id: 'giraffe', name: 'Hươu Cao Cổ', emoji: '🦒', sizeClass: 'text-7xl sm:text-8xl h-36 flex items-end', isTarget: true, labelDesc: 'Cao hơn' },
    itemB: { id: 'turtle', name: 'Rùa Con', emoji: '🐢', sizeClass: 'text-4xl sm:text-5xl h-16 flex items-end', isTarget: false, labelDesc: 'Thấp hơn' },
    hint: 'Bạn Hươu có chiếc cổ dài vươn cao tít lên ngọn cây xanh!',
  },
  {
    id: 'sz-3',
    category: 'Dài - Ngắn',
    prompt: 'Bé hãy chỉ vào bạn có thân hình DÀI HƠN nào!',
    audioPrompt: 'Bé hãy chỉ vào bạn có thân hình DÀI HƠN nào!',
    itemA: { id: 'snake', name: 'Chú Rắn Xanh', emoji: '🐍', sizeClass: 'text-6xl sm:text-7xl w-44 flex items-center justify-center', isTarget: true, labelDesc: 'Dài hơn' },
    itemB: { id: 'caterpillar', name: 'Chú Sâu Nhỏ', emoji: '🐛', sizeClass: 'text-4xl sm:text-5xl w-20 flex items-center justify-center', isTarget: false, labelDesc: 'Ngắn hơn' },
    hint: 'Chú rắn uốn lượn có thân hình dài thướt tha!',
  },
  {
    id: 'sz-4',
    category: 'Cao - Thấp',
    prompt: 'Đố bé nhìn xem: Đồ vật nào THẤP HƠN nào?',
    audioPrompt: 'Đố bé nhìn xem: Đồ vật nào THẤP HƠN nào?',
    itemA: { id: 'tree', name: 'Cây Cổ Thụ', emoji: '🌳', sizeClass: 'text-7xl sm:text-8xl', isTarget: false, labelDesc: 'Cao hơn' },
    itemB: { id: 'mushroom', name: 'Cây Nấm Nhỏ', emoji: '🍄', sizeClass: 'text-4xl sm:text-5xl', isTarget: true, labelDesc: 'Thấp hơn' },
    hint: 'Cây nấm nhỏ mọc sát mặt đất nên thấp hơn cây cổ thụ cao!',
  },
  {
    id: 'sz-5',
    category: 'To - Nhỏ',
    prompt: 'Phương tiện nào NHỎ HƠN vậy bé yêu?',
    audioPrompt: 'Phương tiện nào NHỎ HƠN vậy bé yêu?',
    itemA: { id: 'truck', name: 'Xe Tải Lớn', emoji: '🚛', sizeClass: 'text-7xl sm:text-8xl scale-120', isTarget: false, labelDesc: 'To hơn' },
    itemB: { id: 'bike', name: 'Xe Đạp Nhỏ', emoji: '🚲', sizeClass: 'text-4xl sm:text-5xl scale-90', isTarget: true, labelDesc: 'Nhỏ hơn' },
    hint: 'Xe đạp nhỏ gọn bé có thể tự đạp chơi trong sân trường!',
  },
];

export const SizeComparisonGame: React.FC<SizeComparisonGameProps> = ({
  onAddStar,
  onBackToMenu,
  onCompleteGame,
}) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [isFinished, setIsFinished] = useState(false);
  const [shake, setShake] = useState(false);

  const round = SIZE_ROUNDS[currentIdx];

  // Auto speak on round change
  React.useEffect(() => {
    const timer = setTimeout(() => {
      soundManager.speakVietnamese(round.audioPrompt);
    }, 400);
    return () => clearTimeout(timer);
  }, [currentIdx]);

  const handleSpeak = () => {
    soundManager.speakVietnamese(round.audioPrompt);
  };

  const handleSelect = (itemId: string, isTarget: boolean) => {
    if (isCorrect === true) return;

    setSelectedId(itemId);

    if (isTarget) {
      setIsCorrect(true);
      soundManager.playSuccess();
      onAddStar();

      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
      });

      soundManager.speakVietnamese('Đúng rồi! Bé so sánh kích thước rất chính xác!');
    } else {
      setIsCorrect(false);
      setShake(true);
      soundManager.playTryAgain();
      soundManager.speakVietnamese('Chưa đúng rồi bé ơi! Bé nhìn kỹ lại câu hỏi hỏi to hơn, nhỏ hơn, hay cao hơn nhé!');
      setTimeout(() => setShake(false), 500);
    }
  };

  const handleNext = () => {
    soundManager.playClick();
    if (currentIdx < SIZE_ROUNDS.length - 1) {
      setCurrentIdx(prev => prev + 1);
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
      soundManager.speakVietnamese('Hoan hô bé! Bé đã xuất sắc làm chủ toàn bộ các bài toán To - Nhỏ, Cao - Thấp và Dài - Ngắn!');
    }
  };

  const handleRestart = () => {
    soundManager.playClick();
    setCurrentIdx(0);
    setSelectedId(null);
    setIsCorrect(null);
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
            🦒 Câu {currentIdx + 1} / {SIZE_ROUNDS.length} • {round.category}
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
              <span className="text-xl">🦒</span>
              <h2 className="text-base sm:text-xl font-black text-teal-900">
                Toán Mầm Non: To - Nhỏ • Cao - Thấp • Dài - Ngắn
              </h2>
              <span className="text-xl">📏</span>
            </div>
            
            <h3 className="text-xl sm:text-3xl font-black text-stone-900 mt-2 leading-snug">
              {round.prompt}
            </h3>
            
            <p className="text-xs sm:text-sm text-stone-600 font-bold mt-1">
              💡 {round.hint}
            </p>
          </div>

          {/* 2 Big Comparison Cards */}
          <div className={`grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-xl mx-auto my-6 ${shake ? 'animate-shake' : ''}`}>
            
            {/* Item A */}
            {(() => {
              const isSelected = selectedId === round.itemA.id;
              const isOptCorrect = isSelected && isCorrect === true;
              const isOptWrong = isSelected && isCorrect === false;

              return (
                <button
                  onClick={() => handleSelect(round.itemA.id, round.itemA.isTarget)}
                  className={`p-6 rounded-3xl bg-white flex flex-col items-center justify-between min-h-[220px] transition-all transform active:scale-95 border-4 ${
                    isOptCorrect
                      ? 'border-emerald-500 bg-emerald-50 ring-4 ring-emerald-300 scale-105 shadow-xl'
                      : isOptWrong
                      ? 'border-red-400 bg-red-50'
                      : 'border-stone-200 hover:border-teal-400 hover:shadow-md'
                  }`}
                >
                  <div className={`flex-1 flex items-center justify-center ${round.itemA.sizeClass}`}>
                    {round.itemA.emoji}
                  </div>
                  <div className="text-center mt-3">
                    <span className="text-base sm:text-lg font-black text-stone-900 block">
                      {round.itemA.name}
                    </span>
                    <span className="text-xs font-bold text-teal-700 bg-teal-50 px-3 py-0.5 rounded-full mt-1 inline-block border border-teal-200">
                      {round.itemA.labelDesc}
                    </span>
                  </div>
                </button>
              );
            })()}

            {/* Item B */}
            {(() => {
              const isSelected = selectedId === round.itemB.id;
              const isOptCorrect = isSelected && isCorrect === true;
              const isOptWrong = isSelected && isCorrect === false;

              return (
                <button
                  onClick={() => handleSelect(round.itemB.id, round.itemB.isTarget)}
                  className={`p-6 rounded-3xl bg-white flex flex-col items-center justify-between min-h-[220px] transition-all transform active:scale-95 border-4 ${
                    isOptCorrect
                      ? 'border-emerald-500 bg-emerald-50 ring-4 ring-emerald-300 scale-105 shadow-xl'
                      : isOptWrong
                      ? 'border-red-400 bg-red-50'
                      : 'border-stone-200 hover:border-teal-400 hover:shadow-md'
                  }`}
                >
                  <div className={`flex-1 flex items-center justify-center ${round.itemB.sizeClass}`}>
                    {round.itemB.emoji}
                  </div>
                  <div className="text-center mt-3">
                    <span className="text-base sm:text-lg font-black text-stone-900 block">
                      {round.itemB.name}
                    </span>
                    <span className="text-xs font-bold text-teal-700 bg-teal-50 px-3 py-0.5 rounded-full mt-1 inline-block border border-teal-200">
                      {round.itemB.labelDesc}
                    </span>
                  </div>
                </button>
              );
            })()}

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
                        Chính xác! Bé nhận biết kích thước rất chuẩn! 🎉
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
                    <span>{currentIdx < SIZE_ROUNDS.length - 1 ? 'Câu tiếp theo' : 'Xem kết quả'}</span>
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </>
              ) : (
                <div className="flex items-center gap-3 text-rose-800 bg-rose-50 p-2 rounded-xl w-full justify-center">
                  <Smile className="w-6 h-6 text-rose-600" />
                  <span className="font-extrabold text-sm sm:text-base">
                    Chưa đúng rồi bé ơi! Bé nhìn kỹ lại kích thước của từng bạn nhé!
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
            🦒
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-teal-900 mb-2">
            Bé Có Đôi Mắt Quan Sát Siêu Đẳng!
          </h2>

          <p className="text-base sm:text-lg font-bold text-stone-700 max-w-md mx-auto mb-4">
            Bé đã so sánh cực kỳ nhanh và chính xác: Bạn nào To hơn, Nhỏ hơn, Cao hơn, Thấp hơn, Dài hơn và Ngắn hơn!
          </p>

          <div className="bg-white/90 p-4 rounded-2xl max-w-md mx-auto border-2 border-teal-200 shadow-sm mb-6 text-teal-950 font-extrabold">
            🌟 Cô giáo Nguyễn Thị Huyền: "Bé lớp 3 Tuổi C2 tiến bộ vượt bậc, cô rất tự hào về bé!"
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
