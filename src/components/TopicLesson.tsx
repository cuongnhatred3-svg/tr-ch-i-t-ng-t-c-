import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Volume2, ChevronLeft, ArrowRight, CheckCircle2, RotateCcw, HelpCircle, Star, Sparkles, Smile } from 'lucide-react';
import { Question, TopicId } from '../types';
import { TOPIC_LIST } from '../data/mathCurriculum';
import { soundManager } from '../utils/soundEffects';

interface TopicLessonProps {
  topicId: TopicId;
  questions: Question[];
  onAddStar: () => void;
  onBackToMenu: () => void;
  onTopicComplete?: (topicId: TopicId) => void;
}

export const TopicLesson: React.FC<TopicLessonProps> = ({
  topicId,
  questions,
  onAddStar,
  onBackToMenu,
  onTopicComplete,
}) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOptId, setSelectedOptId] = useState<string | number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [tappedItems, setTappedItems] = useState<Record<string, boolean>>({});
  const [isTopicFinished, setIsTopicFinished] = useState(false);
  const [shakeCard, setShakeCard] = useState(false);

  const topicInfo = TOPIC_LIST.find(t => t.id === topicId);
  const question = questions[currentIdx];

  if (!question) {
    return (
      <div className="text-center p-8">
        <p>Không tìm thấy câu hỏi bài học.</p>
        <button onClick={onBackToMenu} className="mt-4 px-4 py-2 bg-emerald-500 text-white rounded-xl">
          Quay lại
        </button>
      </div>
    );
  }

  // Auto speak question when opening or changing question
  React.useEffect(() => {
    if (question) {
      const timer = setTimeout(() => {
        soundManager.speakVietnamese(question.audioPrompt || question.prompt);
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [currentIdx, question]);

  // Speak the question prompt
  const handleSpeak = () => {
    soundManager.speakVietnamese(question.audioPrompt || question.prompt);
  };

  // Toggle item counting by tapping on it
  const handleItemTap = (itemId: string) => {
    soundManager.playClick();
    setTappedItems(prev => ({
      ...prev,
      [itemId]: !prev[itemId],
    }));
  };

  const handleSelectOption = (optId: string | number, isCorrectOption: boolean) => {
    if (isCorrect === true) return; // already solved

    setSelectedOptId(optId);

    if (isCorrectOption) {
      setIsCorrect(true);
      soundManager.playSuccess();
      onAddStar();

      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#38bdf8', '#fbbf24', '#f43f5e', '#4ade80'],
      });

      soundManager.speakVietnamese(question.congratsMessage);
    } else {
      setIsCorrect(false);
      setShakeCard(true);
      soundManager.playTryAgain();
      soundManager.speakVietnamese('Bé quan sát kỹ lại một chút nhé! Bé làm được mà!');
      setTimeout(() => setShakeCard(false), 500);
    }
  };

  const handleNextQuestion = () => {
    soundManager.playClick();
    if (currentIdx < questions.length - 1) {
      setCurrentIdx(prev => prev + 1);
      setSelectedOptId(null);
      setIsCorrect(null);
      setTappedItems({});
    } else {
      setIsTopicFinished(true);
      soundManager.playFanfare();
      if (onTopicComplete) {
        onTopicComplete(topicId);
      }
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.4 },
      });
      soundManager.speakVietnamese(`Hoan hô! Bé đã hoàn thành xuất sắc ${topicInfo?.title}! Cô giáo Nguyễn Thị Huyền khen ngợi bé yêu!`);
    }
  };

  const handleRestartTopic = () => {
    soundManager.playClick();
    setCurrentIdx(0);
    setSelectedOptId(null);
    setIsCorrect(null);
    setTappedItems({});
    setIsTopicFinished(false);
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-3 sm:px-4 py-4 sm:py-6 select-none">
      
      {/* Top Bar Navigation */}
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <button
          onClick={() => {
            soundManager.playClick();
            onBackToMenu();
          }}
          className="flex items-center gap-1.5 bg-white/95 hover:bg-white text-stone-700 font-extrabold px-3.5 py-1.5 rounded-2xl shadow-sm border border-stone-300 text-sm active:scale-95 transition-all"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Chọn bài khác</span>
        </button>

        {/* Progress indicator */}
        <div className="flex items-center gap-2">
          <span className="text-xs sm:text-sm font-bold bg-white/90 text-stone-700 px-3 py-1 rounded-full border border-stone-200 shadow-xs">
            Bài {currentIdx + 1} / {questions.length}
          </span>
          <button
            onClick={handleSpeak}
            className="flex items-center gap-1.5 bg-amber-400 hover:bg-amber-500 text-amber-950 font-black px-3.5 py-1.5 rounded-2xl shadow-sm text-xs sm:text-sm active:scale-95 transition-all"
            title="Nghe cô Huyền đọc câu hỏi"
          >
            <Volume2 className="w-4 h-4" />
            <span>Nghe câu hỏi</span>
          </button>
        </div>
      </div>

      {!isTopicFinished ? (
        <div className={`bg-white rounded-3xl p-4 sm:p-7 shadow-xl border-4 ${
          topicId === 'count' ? 'border-amber-300' :
          topicId === 'shapes' ? 'border-sky-300' :
          topicId === 'size' ? 'border-emerald-300' :
          topicId === 'pattern' ? 'border-rose-300' : 'border-purple-300'
        } relative overflow-hidden`}>
          
          {/* Topic header banner */}
          <div className="flex items-center justify-between border-b pb-3 mb-4 border-stone-100 flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <span className="text-2xl sm:text-3xl">{topicInfo?.icon}</span>
              <div>
                <span className="text-xs font-bold text-stone-500 uppercase tracking-wider block">
                  Lớp 3 Tuổi C2 • Trường MN Thạch Thất 2
                </span>
                <h3 className="text-base sm:text-lg font-black text-stone-800">
                  {topicInfo?.title}
                </h3>
              </div>
            </div>

            <div className="flex gap-1.5">
              {questions.map((_, idx) => (
                <div
                  key={idx}
                  className={`w-3 h-3 rounded-full transition-all ${
                    idx === currentIdx
                      ? 'bg-amber-500 scale-125'
                      : idx < currentIdx
                      ? 'bg-emerald-500'
                      : 'bg-stone-200'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Question Prompt */}
          <div className="text-center mb-5">
            <h2 className="text-lg sm:text-2xl font-black text-stone-900 leading-snug">
              {question.prompt}
            </h2>
            <p className="text-xs sm:text-sm text-stone-500 font-semibold mt-1">
              💡 {question.hint}
            </p>
          </div>

          {/* ================= VISUAL AREA DEPENDING ON TOPIC ================= */}
          <div className="bg-gradient-to-b from-stone-50 to-amber-50/50 rounded-2xl p-4 sm:p-6 mb-6 border-2 border-stone-200 min-h-[180px] flex items-center justify-center">
            
            {/* 1. COUNT ITEMS */}
            {question.visualType === 'count-items' && question.items && (
              <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 py-2">
                {question.items.map((item, idx) => {
                  const isTapped = tappedItems[item.id];
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleItemTap(item.id)}
                      className={`relative group flex flex-col items-center p-3 rounded-2xl transition-all transform active:scale-90 ${
                        isTapped
                          ? 'bg-amber-200/90 shadow-md scale-110'
                          : 'bg-white hover:bg-amber-50 shadow-sm border border-stone-200'
                      }`}
                      title="Bé bấm để đếm nhé!"
                    >
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black shadow-sm mb-1 ${
                        isTapped ? 'bg-amber-500 text-white' : 'bg-stone-100 text-stone-600'
                      }`}>
                        {idx + 1}
                      </div>
                      <span className="text-5xl sm:text-6xl drop-shadow-sm group-hover:scale-105 transition-transform">
                        {item.emoji}
                      </span>
                      <span className="text-xs font-bold text-stone-600 mt-1">
                        {item.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}

            {/* 2. SHAPE IDENTIFY */}
            {question.visualType === 'shape-identify' && question.shapeData && (
              <div className="flex flex-col items-center justify-center text-center py-2">
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-sky-100 border-4 border-sky-400 flex items-center justify-center shadow-md mb-2">
                  {question.shapeData.shapeType === 'circle' && (
                    <div className="w-16 h-16 rounded-full bg-rose-500 border-4 border-white shadow flex items-center justify-center text-white text-2xl font-black">
                      ⚪
                    </div>
                  )}
                  {question.shapeData.shapeType === 'square' && (
                    <div className="w-16 h-16 rounded-lg bg-amber-400 border-4 border-white shadow flex items-center justify-center text-white text-2xl font-black">
                      🟨
                    </div>
                  )}
                  {question.shapeData.shapeType === 'triangle' && (
                    <div className="w-16 h-16 flex items-center justify-center">
                      <svg viewBox="0 0 100 80" className="w-16 h-16 drop-shadow">
                        <polygon points="50,5 95,75 5,75" fill="#f43f5e" stroke="#fff" strokeWidth="6" />
                      </svg>
                    </div>
                  )}
                  {question.shapeData.shapeType === 'rectangle' && (
                    <div className="w-20 h-14 rounded-md bg-emerald-500 border-4 border-white shadow flex items-center justify-center text-white text-2xl font-black">
                      🟩
                    </div>
                  )}
                </div>
                <span className="text-base sm:text-lg font-black text-sky-950">
                  {question.shapeData.realWorldName}
                </span>
                <span className="text-xs sm:text-sm text-stone-600 font-semibold max-w-sm">
                  {question.shapeData.description}
                </span>
              </div>
            )}

            {/* 3. SIZE COMPARE */}
            {question.visualType === 'size-compare' && question.sizeData && (
              <div className="flex items-center justify-around w-full max-w-md py-2 gap-4">
                {/* Item A */}
                <div className="flex flex-col items-center bg-white p-4 rounded-2xl shadow-sm border border-stone-200 flex-1">
                  <div className={`flex items-center justify-center ${
                    question.sizeData.attribute === 'to-nho' ? 'text-6xl sm:text-7xl' :
                    question.sizeData.attribute === 'dai-ngan' ? 'text-6xl' : 'text-6xl sm:text-7xl'
                  }`}>
                    {question.sizeData.itemA.emoji}
                  </div>
                  <span className="text-sm sm:text-base font-black text-stone-800 mt-2">
                    {question.sizeData.itemA.name}
                  </span>
                </div>

                <div className="text-2xl font-black text-stone-400">vs</div>

                {/* Item B */}
                <div className="flex flex-col items-center bg-white p-4 rounded-2xl shadow-sm border border-stone-200 flex-1">
                  <div className={`flex items-center justify-center ${
                    question.sizeData.attribute === 'to-nho' ? 'text-3xl sm:text-4xl' :
                    question.sizeData.attribute === 'dai-ngan' ? 'text-3xl' : 'text-3xl sm:text-4xl'
                  }`}>
                    {question.sizeData.itemB.emoji}
                  </div>
                  <span className="text-sm sm:text-base font-black text-stone-800 mt-2">
                    {question.sizeData.itemB.name}
                  </span>
                </div>
              </div>
            )}

            {/* 4. PATTERN COMPLETE */}
            {question.visualType === 'pattern-complete' && question.patternData && (
              <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 py-2">
                {question.patternData.sequence.map((item, idx) => (
                  <div
                    key={idx}
                    className={`w-14 h-16 sm:w-20 sm:h-22 rounded-2xl flex flex-col items-center justify-center p-2 shadow-sm ${item.color}`}
                  >
                    <span className="text-3xl sm:text-4xl">{item.emoji}</span>
                    <span className="text-[10px] sm:text-xs font-bold text-stone-700 mt-1">
                      {item.name}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* 5. SPATIAL POSITION */}
            {question.visualType === 'spatial-position' && question.spatialData && (
              <div className="w-full max-w-md bg-sky-100/70 p-4 rounded-2xl border border-sky-200 flex flex-col items-center text-center">
                
                {/* Scene 1: Top / Bottom */}
                {question.spatialData.type === 'tren-duoi' && (
                  <div className="w-full flex flex-col items-center gap-4">
                    <div className="flex items-center gap-2 bg-sky-200 px-4 py-2 rounded-xl border border-sky-300">
                      <span className="text-4xl">🕊️</span>
                      <span className="text-xs sm:text-sm font-black text-sky-900">
                        Chú chim én đậu ở TRÊN cành cây cao
                      </span>
                    </div>
                    <div className="w-full border-b-2 border-dashed border-emerald-400 my-1" />
                    <div className="flex items-center gap-2 bg-emerald-100 px-4 py-2 rounded-xl border border-emerald-300">
                      <span className="text-4xl">🐶</span>
                      <span className="text-xs sm:text-sm font-black text-emerald-900">
                        Chú cún con nằm ở DƯỚI mặt đất
                      </span>
                    </div>
                  </div>
                )}

                {/* Scene 2: Front / Back */}
                {question.spatialData.type === 'truoc-sau' && (
                  <div className="relative flex items-center justify-center py-4">
                    <div className="text-6xl text-rose-500 opacity-60">🍄</div>
                    <div className="text-7xl -ml-6 -mb-2 z-10 drop-shadow-md">🐰</div>
                    <div className="ml-4 text-left">
                      <div className="text-xs sm:text-sm font-black text-stone-800">
                        Bé thỏ trắng đứng ở PHÍA TRƯỚC!
                      </div>
                      <div className="text-xs font-semibold text-stone-500">
                        Cây nấm ở PHÍA SAU bé thỏ!
                      </div>
                    </div>
                  </div>
                )}

                {/* Scene 3: In / Out */}
                {question.spatialData.type === 'trong-ngoai' && (
                  <div className="flex items-center justify-center gap-4 py-2">
                    <div className="relative flex items-center justify-center">
                      <div className="text-7xl">📦</div>
                      <div className="text-5xl absolute -top-1 animate-bounce-slow">🐱</div>
                    </div>
                    <div className="text-left">
                      <div className="text-sm font-black text-emerald-900">
                        Bé mèo con ở BÊN TRONG!
                      </div>
                      <div className="text-xs font-semibold text-stone-600">
                        Chiếc hộp các-tông ấm áp
                      </div>
                    </div>
                  </div>
                )}

                {/* Scene 4: Left / Right (if used) */}
                {question.spatialData.type === 'trai-phai' && (
                  <div className="flex items-center justify-around w-full py-2">
                    <div className="text-center p-2 rounded-xl bg-blue-50 border border-blue-200">
                      <div className="text-xs font-bold text-blue-700">TAY TRÁI 👈</div>
                      <div className="text-4xl mt-1">🧺</div>
                      <div className="text-[10px] font-bold text-stone-600">Giỏ hoa quả</div>
                    </div>
                    <div className="text-6xl">🧸</div>
                    <div className="text-center p-2 rounded-xl bg-rose-50 border border-rose-200">
                      <div className="text-xs font-bold text-rose-700">👉 TAY PHẢI</div>
                      <div className="text-4xl mt-1">🎈</div>
                      <div className="text-[10px] font-bold text-stone-600">Quả bóng bay</div>
                    </div>
                  </div>
                )}

              </div>
            )}

          </div>

          {/* ================= OPTIONS SELECTION ================= */}
          <div className="text-center mb-2">
            <span className="text-xs sm:text-sm font-black text-stone-700 uppercase tracking-wider">
              👇 Bé hãy chọn câu trả lời đúng nhé:
            </span>
          </div>

          <div className={`grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-2xl mx-auto ${shakeCard ? 'animate-shake' : ''}`}>
            {question.options.map((opt) => {
              const isSelected = selectedOptId === opt.id;
              const isSelectedCorrect = isSelected && isCorrect === true;
              const isSelectedWrong = isSelected && isCorrect === false;

              return (
                <button
                  key={opt.id}
                  onClick={() => handleSelectOption(opt.id, opt.isCorrect)}
                  className={`p-3.5 sm:p-4 rounded-2xl font-black text-base sm:text-lg shadow-md border-3 transition-all transform active:scale-95 flex flex-col items-center justify-center gap-1.5 ${
                    isSelectedCorrect
                      ? 'bg-emerald-500 text-white border-emerald-600 scale-105 shadow-emerald-200'
                      : isSelectedWrong
                      ? 'bg-rose-200 text-rose-800 border-rose-400'
                      : `${opt.color || 'bg-white hover:bg-stone-50 border-stone-200'} text-stone-800`
                  }`}
                >
                  {opt.icon && <span className="text-3xl">{opt.icon}</span>}
                  <span>{opt.label}</span>
                </button>
              );
            })}
          </div>

          {/* Feedback Bar when answered */}
          {isCorrect !== null && (
            <div className="mt-5 p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 shadow-md border-2 animate-fade-in text-center sm:text-left transition-all">
              {isCorrect ? (
                <>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-emerald-500 text-white flex items-center justify-center text-2xl shadow">
                      ⭐
                    </div>
                    <div>
                      <p className="text-base sm:text-lg font-black text-emerald-900">
                        {question.congratsMessage}
                      </p>
                      <p className="text-xs sm:text-sm font-bold text-emerald-700">
                        Cô Nguyễn Thị Huyền tặng bé 1 Ngôi sao vàng sáng lấp lánh!
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={handleNextQuestion}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-black px-6 py-3 rounded-2xl shadow-lg border-2 border-white active:scale-95 text-base transition-all"
                  >
                    <span>{currentIdx < questions.length - 1 ? 'Câu tiếp theo' : 'Hoàn thành bài'}</span>
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </>
              ) : (
                <div className="flex items-center gap-3 text-rose-800 bg-rose-50 p-2 rounded-xl w-full justify-center">
                  <Smile className="w-6 h-6 text-rose-600" />
                  <span className="font-extrabold text-sm sm:text-base">
                    Chưa đúng rồi bé ơi! Bé bấm vào hình để quan sát lại nhé!
                  </span>
                </div>
              )}
            </div>
          )}

        </div>
      ) : (
        /* Topic Finished Screen */
        <div className="bg-gradient-to-b from-amber-50 via-yellow-50 to-emerald-50 rounded-3xl p-6 sm:p-10 shadow-xl border-4 border-amber-300 text-center relative overflow-hidden">
          
          <div className="w-24 h-24 sm:w-28 sm:h-28 mx-auto rounded-full bg-gradient-to-tr from-amber-400 to-yellow-300 flex items-center justify-center text-5xl sm:text-6xl shadow-xl border-4 border-white mb-4 animate-bounce">
            🌟
          </div>

          <div className="inline-block bg-white/90 px-4 py-1 rounded-full text-xs sm:text-sm font-extrabold text-amber-900 border border-amber-300 mb-2">
            ⭐ Lớp 3 Tuổi C2 - Trường Mầm non Thạch Thất 2 ⭐
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-rose-600 mb-2">
            Chúc Mừng Bé Đã Hoàn Thành Bài Học!
          </h2>

          <p className="text-base sm:text-lg font-bold text-stone-700 max-w-lg mx-auto mb-4">
            Bé đã trả lời xuất sắc tất cả các câu hỏi của <strong>{topicInfo?.title}</strong>. Bé đã tích lũy thêm thật nhiều ngôi sao vàng!
          </p>

          <div className="bg-white/90 p-4 rounded-2xl max-w-md mx-auto border-2 border-amber-200 shadow-sm mb-6 text-emerald-900 font-extrabold">
            👩‍🏫 Lời khen từ Cô giáo Nguyễn Thị Huyền: "Bé rất chăm chú và thông minh, cô tặng bé một tràng pháo tay thật lớn!"
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={handleRestartTopic}
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-amber-400 hover:bg-amber-500 text-amber-950 font-black px-6 py-3 rounded-2xl shadow-md border-2 border-white active:scale-95 transition-all"
            >
              <RotateCcw className="w-5 h-5" />
              <span>Ôn tập lại</span>
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
