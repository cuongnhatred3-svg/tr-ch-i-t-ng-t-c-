import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Volume2, ChevronLeft, ArrowRight, RotateCcw, HelpCircle, Sparkles, Smile } from 'lucide-react';
import { soundManager } from '../utils/soundEffects';

interface TeacherRiddleGameProps {
  onAddStar: () => void;
  onBackToMenu: () => void;
  onCompleteGame: () => void;
}

interface Riddle {
  id: string;
  riddleText: string;
  audioPrompt: string;
  options: Array<{ id: string; label: string; icon: string; isCorrect: boolean }>;
  hint: string;
  praise: string;
}

const RIDDLES: Riddle[] = [
  {
    id: 'rd-1',
    riddleText: '«Tôi có bốn cạnh bằng nhau, vuông vắn ngay ngắn, giống như chiếc hộp quà sinh nhật. Đố bé tôi là hình gì?»',
    audioPrompt: 'Tôi có bốn cạnh bằng nhau, vuông vắn ngay ngắn, giống như chiếc hộp quà sinh nhật. Đố bé tôi là hình gì?',
    options: [
      { id: 'square', label: 'Hình Vuông', icon: '🟨', isCorrect: true },
      { id: 'circle', label: 'Hình Tròn', icon: '🔴', isCorrect: false },
      { id: 'triangle', label: 'Hình Tam Giác', icon: '🔺', isCorrect: false },
    ],
    hint: 'Bốn cạnh đều dài bằng nhau chính là Hình Vuông!',
    praise: 'Đúng rồi! Đó chính là HÌNH VUÔNG xinh xắn!',
  },
  {
    id: 'rd-2',
    riddleText: '«Một chú thỏ có hai cái tai dài. Vậy hai chú thỏ có tất cả mấy cái tai dài vậy bé ơi?»',
    audioPrompt: 'Một chú thỏ có hai cái tai dài. Vậy hai chú thỏ có tất cả mấy cái tai dài vậy bé ơi?',
    options: [
      { id: 'opt-2', label: '2 Cái tai', icon: '2️⃣', isCorrect: false },
      { id: 'opt-4', label: '4 Cái tai', icon: '4️⃣', isCorrect: true },
      { id: 'opt-5', label: '5 Cái tai', icon: '5️⃣', isCorrect: false },
    ],
    hint: '2 tai cộng thêm 2 tai là bằng 4 cái tai!',
    praise: 'Bé thông minh tuyệt đỉnh! Hai chú thỏ có tất cả 4 chiếc tai dài!',
  },
  {
    id: 'rd-3',
    riddleText: '«Tôi không có góc nhọn nào, tròn xoe lăn bon bon trên thảm cỏ cho các bạn đá bóng. Đố bé tôi là đồ vật gì?»',
    audioPrompt: 'Tôi không có góc nhọn nào, tròn xoe lăn bon bon trên thảm cỏ cho các bạn đá bóng. Đố bé tôi là đồ vật gì?',
    options: [
      { id: 'ball', label: 'Quả bóng tròn', icon: '⚽', isCorrect: true },
      { id: 'box', label: 'Hộp bánh quy', icon: '📦', isCorrect: false },
      { id: 'book', label: 'Cuốn sách vở', icon: '📕', isCorrect: false },
    ],
    hint: 'Quả bóng hình tròn lăn bon bon trên sân cỏ!',
    praise: 'Chính xác! Đó chính là QUẢ BÓNG TRÒN xoe!',
  },
];

export const TeacherRiddleGame: React.FC<TeacherRiddleGameProps> = ({
  onAddStar,
  onBackToMenu,
  onCompleteGame,
}) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [isFinished, setIsFinished] = useState(false);
  const [shake, setShake] = useState(false);

  const riddle = RIDDLES[currentIdx];

  useEffect(() => {
    setSelectedId(null);
    setIsCorrect(null);
    const timer = setTimeout(() => {
      soundManager.speakVietnamese(riddle.audioPrompt);
    }, 400);
    return () => clearTimeout(timer);
  }, [currentIdx]);

  const handleSpeak = () => {
    soundManager.speakVietnamese(riddle.audioPrompt);
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

      soundManager.speakVietnamese(riddle.praise);
    } else {
      setIsCorrect(false);
      setShake(true);
      soundManager.playTryAgain();
      soundManager.speakVietnamese('Chưa đúng rồi bé ơi! Bé nghe kỹ lại câu đố của cô Huyền một lần nữa nhé!');
      setTimeout(() => setShake(false), 500);
    }
  };

  const handleNext = () => {
    soundManager.playClick();
    if (currentIdx < RIDDLES.length - 1) {
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
      soundManager.speakVietnamese('Hoan hô bé! Bé đã giải đúng tất cả câu đố toán học của cô giáo Huyền!');
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
            ❓ Câu đố {currentIdx + 1} / {RIDDLES.length}
          </span>
          <button
            onClick={handleSpeak}
            className="flex items-center gap-1 bg-amber-400 hover:bg-amber-500 text-amber-950 font-black px-3.5 py-1.5 rounded-2xl shadow-sm text-xs sm:text-sm active:scale-95 transition-all"
          >
            <Volume2 className="w-4 h-4" />
            <span>Nghe câu đố</span>
          </button>
        </div>
      </div>

      {!isFinished ? (
        <div className="bg-gradient-to-b from-amber-50 via-yellow-50 to-orange-50 rounded-3xl p-5 sm:p-8 shadow-xl border-4 border-amber-300">
          
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-2 bg-white/90 px-4 py-1 rounded-full shadow-xs border border-amber-200 mb-2">
              <span className="text-xl">👩‍🏫</span>
              <h2 className="text-base sm:text-xl font-black text-amber-950">
                Trạm 14: Câu Đố Toán Vui Của Cô Huyền
              </h2>
              <span className="text-xl">❓</span>
            </div>

            {/* Riddle parchment box */}
            <div className="bg-white/95 p-5 rounded-2xl border-2 border-amber-300 shadow-sm max-w-xl mx-auto my-3">
              <p className="text-lg sm:text-2xl font-black text-rose-700 leading-relaxed italic">
                {riddle.riddleText}
              </p>
            </div>

            <p className="text-xs sm:text-sm text-stone-600 font-bold mt-1">
              💡 {riddle.hint}
            </p>
          </div>

          {/* Options */}
          <div className="text-center mb-2">
            <span className="text-xs sm:text-sm font-black text-stone-700 uppercase tracking-wide">
              👇 Bé hãy chọn câu trả lời đúng nhé:
            </span>
          </div>

          <div className={`grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 max-w-xl mx-auto ${shake ? 'animate-shake' : ''}`}>
            {riddle.options.map((opt) => {
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
                  <span className="text-4xl">{opt.icon}</span>
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
                        {riddle.praise} 🎉
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
                    <span>{currentIdx < RIDDLES.length - 1 ? 'Câu đố tiếp theo' : 'Xem kết quả'}</span>
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </>
              ) : (
                <div className="flex items-center gap-3 text-rose-800 bg-rose-50 p-2 rounded-xl w-full justify-center">
                  <Smile className="w-6 h-6 text-rose-600" />
                  <span className="font-extrabold text-sm sm:text-base">
                    Chưa đúng rồi bé ơi! Bé suy nghĩ thêm một chút nhé!
                  </span>
                </div>
              )}
            </div>
          )}

        </div>
      ) : (
        /* Completed */
        <div className="bg-gradient-to-b from-amber-100 via-yellow-50 to-orange-100 rounded-3xl p-6 sm:p-10 shadow-xl border-4 border-amber-300 text-center">
          <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-tr from-amber-400 to-orange-400 text-white flex items-center justify-center text-5xl shadow-xl mb-4 animate-bounce">
            💡
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-amber-950 mb-2">
            Bé Là Thần Đồng Giải Đố Lớp 3 Tuổi C2!
          </h2>

          <p className="text-base sm:text-lg font-bold text-stone-700 max-w-md mx-auto mb-4">
            Bé đã lắng nghe và giải đáp xuất sắc tất cả câu đố toán học vui nhộn của cô giáo Nguyễn Thị Huyền!
          </p>

          <div className="bg-white/90 p-4 rounded-2xl max-w-md mx-auto border-2 border-amber-200 shadow-sm mb-6 text-emerald-900 font-extrabold">
            🌟 Cô giáo Nguyễn Thị Huyền: "Bé rất tài năng và đáng yêu, cô yêu bé rất nhiều!"
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={handleRestart}
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-amber-400 hover:bg-amber-500 text-amber-950 font-black px-6 py-3 rounded-2xl shadow-md border-2 border-white active:scale-95 transition-all"
            >
              <RotateCcw className="w-5 h-5" />
              <span>Giải đố lại lần nữa</span>
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
