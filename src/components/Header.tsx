import React from 'react';
import { Volume2, VolumeX, Sparkles, Star, Trophy, School, User } from 'lucide-react';
import { soundManager } from '../utils/soundEffects';

interface HeaderProps {
  stars: number;
  carrots: number;
  soundEnabled: boolean;
  speechEnabled: boolean;
  onToggleSound: () => void;
  onToggleSpeech: () => void;
  onGoHome: () => void;
  onOpenRewards: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  stars,
  carrots,
  soundEnabled,
  speechEnabled,
  onToggleSound,
  onToggleSpeech,
  onGoHome,
  onOpenRewards,
}) => {
  return (
    <header className="relative bg-gradient-to-r from-amber-300 via-rose-300 to-emerald-300 shadow-lg border-b-4 border-amber-400 overflow-hidden select-none">
      {/* Decorative cartoon clouds & bubbles in the background */}
      <div className="absolute top-1 left-8 w-16 h-8 bg-white/50 rounded-full blur-[1px] pointer-events-none" />
      <div className="absolute top-2 right-20 w-24 h-10 bg-white/40 rounded-full blur-[1px] pointer-events-none" />
      <div className="absolute -bottom-3 left-1/3 w-28 h-12 bg-white/35 rounded-full pointer-events-none" />

      <div className="max-w-6xl mx-auto px-3 sm:px-6 py-2.5 sm:py-3.5 flex flex-col md:flex-row items-center justify-between gap-3 relative z-10">
        
        {/* School & Teacher Information Brand */}
        <div 
          onClick={onGoHome}
          className="cursor-pointer group flex items-center gap-3 bg-white/90 hover:bg-white backdrop-blur-sm px-3.5 py-1.5 sm:py-2 rounded-2xl shadow-md border-2 border-amber-300 transition-all transform hover:scale-[1.02]"
        >
          <div className="w-12 h-12 sm:w-13 sm:h-13 rounded-2xl overflow-hidden border-2 border-amber-400 p-0.5 bg-gradient-to-tr from-amber-300 to-rose-300 shadow-sm flex-shrink-0">
            <img
              src="/assets/aistudio/1792848527954_6298271864911581485_6298271864911581485_fd702d730039135d5d1b8c9e2f72ad86_73054ade.jpg"
              alt="Cô giáo Nguyễn Thị Huyền"
              className="w-full h-full object-cover rounded-xl"
            />
          </div>
          <div>
            <div className="flex items-center gap-1.5 text-xs sm:text-sm font-bold text-amber-900 uppercase tracking-wide">
              <School className="w-3.5 h-3.5 text-amber-600 inline" />
              <span>Trường Mầm non Thạch Thất 2</span>
            </div>
            <div className="text-base sm:text-xl font-extrabold text-rose-600 flex items-center gap-1.5 leading-tight">
              <span>Lớp: 3 Tuổi C2</span>
              <span className="text-xs bg-rose-100 text-rose-700 px-2 py-0.5 rounded-full font-bold border border-rose-300">
                Toán Mầm Non
              </span>
            </div>
            <div className="text-xs sm:text-sm font-semibold text-emerald-800 flex items-center gap-1">
              <User className="w-3.5 h-3.5 text-emerald-600 inline" />
              <span>Giáo viên: <strong className="text-emerald-900 font-extrabold">Nguyễn Thị Huyền</strong></span>
            </div>
          </div>
        </div>

        {/* Center Title for Small Screens or Tagline */}
        <div className="hidden lg:flex flex-col items-center text-center">
          <span className="text-xs font-bold text-amber-950 uppercase tracking-wider bg-amber-100/90 px-3 py-0.5 rounded-full border border-amber-300">
            🌻 Bé Vui Học Toán 🌻
          </span>
          <span className="text-lg font-black text-amber-900 drop-shadow-sm">
            Học Vui - Đếm Giỏi - Tự Tin Khôn Lớn
          </span>
        </div>

        {/* Counters & Settings Controls */}
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap justify-center">
          {/* Star Counter */}
          <div 
            onClick={onOpenRewards}
            className="flex items-center gap-1.5 bg-yellow-400/95 hover:bg-yellow-400 text-yellow-950 font-black px-3 py-1.5 rounded-2xl shadow-md border-2 border-white cursor-pointer active:scale-95 transition-transform"
            title="Ngôi sao vàng bé đã đạt được"
          >
            <Star className="w-5 h-5 fill-yellow-100 text-yellow-800 animate-spin-slow" />
            <span className="text-base sm:text-lg">{stars}</span>
            <span className="text-xs hidden sm:inline font-bold">Sao</span>
          </div>

          {/* Carrot Counter */}
          <div 
            className="flex items-center gap-1 bg-orange-400/95 text-orange-950 font-black px-3 py-1.5 rounded-2xl shadow-md border-2 border-white"
            title="Cà rốt bé đã thu hoạch cho thỏ"
          >
            <span className="text-lg">🥕</span>
            <span className="text-base sm:text-lg">{carrots}</span>
          </div>

          {/* Rewards Album Button */}
          <button
            onClick={() => {
              soundManager.playClick();
              onOpenRewards();
            }}
            className="flex items-center gap-1.5 bg-rose-500 hover:bg-rose-600 text-white font-extrabold px-3 py-1.5 rounded-2xl shadow-md border-2 border-rose-300 active:scale-95 transition-all text-sm"
          >
            <Trophy className="w-4 h-4" />
            <span className="hidden sm:inline">Khen thưởng</span>
          </button>

          {/* Sound Toggle */}
          <button
            onClick={() => {
              onToggleSound();
              soundManager.playClick();
            }}
            aria-label="Bật/Tắt âm thanh hiệu ứng"
            className={`p-2 rounded-2xl border-2 shadow-sm transition-all ${
              soundEnabled
                ? 'bg-emerald-500 hover:bg-emerald-600 text-white border-white'
                : 'bg-stone-300 text-stone-600 border-stone-400'
            }`}
            title={soundEnabled ? 'Âm thanh: Bật' : 'Âm thanh: Tắt'}
          >
            {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
          </button>

          {/* Speech Voice Toggle */}
          <button
            onClick={() => {
              onToggleSpeech();
              soundManager.playClick();
            }}
            aria-label="Bật/Tắt giọng đọc cô Huyền"
            className={`px-2.5 py-1.5 rounded-2xl border-2 shadow-sm font-bold text-xs flex items-center gap-1 transition-all ${
              speechEnabled
                ? 'bg-purple-500 hover:bg-purple-600 text-white border-white'
                : 'bg-stone-300 text-stone-600 border-stone-400'
            }`}
            title={speechEnabled ? 'Giọng đọc câu hỏi: Bật' : 'Giọng đọc câu hỏi: Tắt'}
          >
            <Sparkles className="w-4 h-4" />
            <span className="hidden sm:inline">Giọng đọc</span>
          </button>
        </div>

      </div>
    </header>
  );
};
