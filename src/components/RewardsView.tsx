import React, { useState } from 'react';
import { 
  Star, 
  Trophy, 
  Award, 
  Heart, 
  CheckCircle2, 
  ChevronLeft, 
  Sparkles, 
  School, 
  User, 
  Printer, 
  FileText 
} from 'lucide-react';
import { Sticker } from '../types';
import { soundManager } from '../utils/soundEffects';
import { WorksheetPrintView } from './WorksheetPrintView';

interface RewardsViewProps {
  stars: number;
  carrots: number;
  stickers: Sticker[];
  onBackToMenu: () => void;
}

export const RewardsView: React.FC<RewardsViewProps> = ({
  stars,
  carrots,
  stickers,
  onBackToMenu,
}) => {
  const [activeTab, setActiveTab] = useState<'worksheets' | 'certificate'>('worksheets');

  const handleStickerClick = (sticker: Sticker) => {
    if (stars >= sticker.unlockedAtStars) {
      soundManager.playStar();
      soundManager.speakVietnamese(`Huy hiệu ${sticker.name}: ${sticker.description}!`);
    } else {
      soundManager.playClick();
      soundManager.speakVietnamese(`Bé cần thêm ${sticker.unlockedAtStars - stars} ngôi sao nữa để mở khóa huy hiệu này nhé!`);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-3 sm:px-4 py-4 sm:py-6 select-none">
      
      {/* Top Header Switcher between Worksheets and Certificate (Hidden on print) */}
      <div className="no-print flex items-center justify-between mb-4 flex-wrap gap-2">
        <button
          onClick={() => {
            soundManager.playClick();
            onBackToMenu();
          }}
          className="flex items-center gap-1.5 bg-white/90 hover:bg-white text-stone-700 font-extrabold px-4 py-2 rounded-2xl shadow-sm border border-stone-300 text-sm active:scale-95 transition-all"
        >
          <ChevronLeft className="w-4 h-4 text-rose-500" />
          <span>Về màn hình chính</span>
        </button>

        {/* Tab Switcher */}
        <div className="flex items-center bg-white p-1 rounded-2xl border border-stone-200 shadow-sm gap-1">
          <button
            onClick={() => {
              soundManager.playClick();
              setActiveTab('worksheets');
            }}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-black flex items-center gap-2 transition-all ${
              activeTab === 'worksheets'
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-xs'
                : 'text-stone-600 hover:bg-stone-100'
            }`}
          >
            <Printer className="w-4 h-4" />
            <span>Phiếu In Màu Cho Bé (6 Phiếu A4)</span>
          </button>

          <button
            onClick={() => {
              soundManager.playClick();
              setActiveTab('certificate');
            }}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-black flex items-center gap-2 transition-all ${
              activeTab === 'certificate'
                ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-xs'
                : 'text-stone-600 hover:bg-stone-100'
            }`}
          >
            <Trophy className="w-4 h-4" />
            <span>Giấy Khen & Huy Hiệu Bé Ngoan</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-yellow-400 text-yellow-950 font-black px-3 py-1.5 rounded-2xl shadow-sm text-xs sm:text-sm">
            <Star className="w-4 h-4 fill-yellow-950" />
            <span>{stars} Sao</span>
          </div>
          <div className="flex items-center gap-1 bg-orange-400 text-orange-950 font-black px-3 py-1.5 rounded-2xl shadow-sm text-xs sm:text-sm">
            <span>🥕 {carrots} Cà rốt</span>
          </div>
        </div>
      </div>

      {/* ================= TAB 1: WORKSHEETS PRINT VIEW ================= */}
      {activeTab === 'worksheets' && (
        <WorksheetPrintView
          stars={stars}
          carrots={carrots}
          onBack={onBackToMenu}
        />
      )}

      {/* ================= TAB 2: CERTIFICATE & STICKERS ================= */}
      {activeTab === 'certificate' && (
        <div className="animate-fade-in">
          
          {/* Certificate of Merit (Giấy khen bé ngoan mầm non) */}
          <div className="bg-gradient-to-b from-amber-50 via-yellow-50 to-orange-50 rounded-3xl p-5 sm:p-8 shadow-xl border-8 border-double border-amber-400 mb-8 relative overflow-hidden text-center">
            
            {/* Ribbon decoration */}
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-red-500 to-rose-600 text-white font-black px-6 py-1.5 rounded-full shadow-md text-sm sm:text-base uppercase tracking-wider mb-3">
              <span>🌟 GIẤY KHEN BÉ NGOAN HỌC GIỎI 🌟</span>
            </div>

            {/* School & Class header */}
            <div className="mb-4">
              <h2 className="text-xl sm:text-3xl font-black text-amber-950 uppercase tracking-wide">
                TRƯỜNG MẦM NON THẠCH THẤT 2
              </h2>
              <div className="text-base sm:text-xl font-extrabold text-rose-600 mt-1">
                Lớp: 3 Tuổi C2
              </div>
            </div>

            {/* Certificate text */}
            <div className="bg-white/85 p-5 rounded-2xl border-2 border-amber-200 shadow-sm max-w-xl mx-auto mb-5 text-stone-800">
              <p className="text-sm sm:text-base font-bold text-stone-600 mb-2">
                Tuyên dương bé yêu đã hoàn thành xuất sắc các nội dung ôn luyện toán:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs sm:text-sm font-black text-emerald-800 text-left my-2">
                <div className="flex items-center gap-1.5 bg-emerald-50 p-2 rounded-xl border border-emerald-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>Đếm số 1 đến 5 & 1 và Nhiều</span>
                </div>
                <div className="flex items-center gap-1.5 bg-sky-50 p-2 rounded-xl border border-sky-200">
                  <CheckCircle2 className="w-4 h-4 text-sky-600 flex-shrink-0" />
                  <span>Hình khối & Màu sắc</span>
                </div>
                <div className="flex items-center gap-1.5 bg-amber-50 p-2 rounded-xl border border-amber-200">
                  <CheckCircle2 className="w-4 h-4 text-amber-600 flex-shrink-0" />
                  <span>So sánh To-Nhỏ, Cao-Thấp</span>
                </div>
                <div className="flex items-center gap-1.5 bg-purple-50 p-2 rounded-xl border border-purple-200">
                  <CheckCircle2 className="w-4 h-4 text-purple-600 flex-shrink-0" />
                  <span>Quy tắc & Định hướng không gian</span>
                </div>
              </div>
              <p className="text-sm sm:text-base font-extrabold text-amber-900 mt-3">
                Bé đạt thành tích: <strong className="text-rose-600">{stars} Ngôi Sao Vàng</strong> & <strong className="text-orange-600">{carrots} Củ Cà Rốt</strong>
              </p>
            </div>

            {/* Teacher Signature & Photo */}
            <div className="flex justify-between items-center max-w-lg mx-auto pt-2 px-4 text-xs sm:text-sm font-bold text-stone-700">
              <div className="text-left">
                <p className="text-stone-500">Năm học 2026 - 2027</p>
                <p className="text-stone-700 font-extrabold">Trường MN Thạch Thất 2</p>
                <p className="text-rose-600 font-black">Lớp 3 Tuổi C2</p>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-2xl overflow-hidden border-2 border-amber-400 shadow-sm p-0.5 bg-white">
                  <img
                    src="/assets/aistudio/1792848527954_6298271864911581485_6298271864911581485_fd702d730039135d5d1b8c9e2f72ad86_73054ade.jpg"
                    alt="Cô giáo Nguyễn Thị Huyền"
                    className="w-full h-full object-cover rounded-xl"
                  />
                </div>
                <div className="text-center">
                  <p className="text-stone-500 italic text-[11px]">Giáo viên chủ nhiệm</p>
                  <div className="font-['Caveat',cursive] text-xl sm:text-2xl font-extrabold text-blue-700">
                    Nguyễn Thị Huyền
                  </div>
                  <p className="font-black text-emerald-900 text-xs">Cô Nguyễn Thị Huyền</p>
                </div>
              </div>
            </div>

          </div>

          {/* Sticker Album Collection */}
          <div className="bg-white rounded-3xl p-5 sm:p-7 shadow-xl border-4 border-rose-300">
            
            <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-2xl bg-rose-100 flex items-center justify-center text-2xl">
                  🎁
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-black text-rose-950">
                    Bộ Sưu Tập Huy Hiệu Của Bé
                  </h3>
                  <p className="text-xs text-stone-500 font-bold">
                    Chạm vào từng huy hiệu để nghe lời khen ngợi của cô Huyền!
                  </p>
                </div>
              </div>

              <span className="text-xs font-black bg-rose-100 text-rose-900 px-3 py-1 rounded-full border border-rose-200">
                {stickers.filter(s => stars >= s.unlockedAtStars).length} / {stickers.length} Đã mở khóa
              </span>
            </div>

            {/* Sticker Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
              {stickers.map((stk) => {
                const isUnlocked = stars >= stk.unlockedAtStars;
                return (
                  <div
                    key={stk.id}
                    onClick={() => handleStickerClick(stk)}
                    className={`p-3 sm:p-4 rounded-2xl flex flex-col items-center text-center cursor-pointer transition-all transform active:scale-95 border-2 ${
                      isUnlocked
                        ? 'bg-gradient-to-b from-amber-50 to-yellow-100 border-amber-300 shadow-md hover:scale-105'
                        : 'bg-stone-100/70 border-stone-200 opacity-60'
                    }`}
                  >
                    <div className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center text-3xl sm:text-4xl shadow-inner mb-2 ${
                      isUnlocked ? 'bg-white' : 'bg-stone-200 grayscale'
                    }`}>
                      {isUnlocked ? stk.emoji : '🔒'}
                    </div>

                    <div className="text-xs sm:text-sm font-black text-stone-900 leading-tight">
                      {stk.name}
                    </div>

                    <div className="text-[10px] text-stone-500 font-semibold mt-1">
                      {isUnlocked ? (
                        <span className="text-emerald-700 font-bold">Đã đạt được! ⭐</span>
                      ) : (
                        <span>Cần {stk.unlockedAtStars} sao ⭐</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

          </div>

        </div>
      )}

    </div>
  );
};
