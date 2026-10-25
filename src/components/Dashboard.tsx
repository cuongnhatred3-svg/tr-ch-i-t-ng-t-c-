import React, { useState } from 'react';
import { Volume2, BookOpen, Maximize2, Shield, WifiOff, Camera, Mic, Lock, Sparkles, Clapperboard, ChevronRight } from 'lucide-react';
import { TopicId } from '../types';
import { soundManager } from '../utils/soundEffects';

interface DashboardProps {
  onSelectTopic: (topicId: TopicId) => void;
  onOpenClassTv: () => void;
  stars: number;
  carrots: number;
}

export const Dashboard: React.FC<DashboardProps> = ({
  onSelectTopic,
  onOpenClassTv,
  stars,
  carrots,
}) => {
  const [showStationsModal, setShowStationsModal] = useState(false);
  const [showGamesModal, setShowGamesModal] = useState(false);
  const [showGuideModal, setShowGuideModal] = useState(false);

  // Female preschool teacher voice greeting
  const handleTeacherGreeting = () => {
    soundManager.speakVietnamese(
      'Cô Huyền chào các con yêu của Lớp 3 Tuổi C2 Trường Mầm non Thạch Thất 2 nha! Hôm nay chúng mình cùng học toán thật là vui nhé!'
    );
  };

  const handleToggleFullscreen = () => {
    soundManager.playClick();
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  const teacherAvatarPath = '/assets/aistudio/1792848527954_6298271864911581485_6298271864911581485_fd702d730039135d5d1b8c9e2f72ad86_73054ade.jpg';

  return (
    <div className="w-full max-w-md sm:max-w-xl mx-auto px-4 py-3 select-none flex flex-col items-center">
      
      {/* Top Header Row matching screenshot */}
      <div className="w-full flex items-center justify-between py-2 text-stone-800">
        <button 
          onClick={handleTeacherGreeting}
          className="text-stone-700 font-bold text-xl hover:text-stone-900 active:scale-95 transition-transform"
          title="Chào mừng"
        >
          &lt;
        </button>
        <span className="font-extrabold text-base sm:text-lg text-stone-900 tracking-tight">
          Bé Vui Học Toán
        </span>
        <button 
          onClick={() => setShowGuideModal(true)}
          className="text-stone-700 font-black text-xl hover:text-stone-900 active:scale-95 transition-transform"
          title="Thông tin lớp"
        >
          •••
        </button>
      </div>

      {/* Mini App Pill Badge */}
      <div className="w-full flex items-center justify-between mt-1 mb-3">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-amber-600 to-amber-500 text-white font-black text-xs flex items-center justify-center shadow-sm border border-amber-300">
            123
          </div>
          <div>
            <div className="text-xs sm:text-sm font-black text-orange-700 uppercase tracking-wide leading-tight">
              BÉ VUI HỌC TOÁN
            </div>
            <div className="text-[11px] font-extrabold text-stone-500">
              BÉ 3–4 TUỔI • LỚP 3 TUỔI C2
            </div>
          </div>
        </div>

        {/* Action circle buttons */}
        <div className="flex items-center gap-2">
          {/* Sound/Voice test button */}
          <button
            onClick={() => {
              soundManager.playClick();
              handleTeacherGreeting();
            }}
            className="w-9 h-9 rounded-full bg-white/90 hover:bg-white text-stone-700 flex items-center justify-center shadow-sm border border-stone-200 active:scale-90 transition-all"
            title="Nghe cô Huyền chào bé"
          >
            <span className="text-sm">🔊</span>
          </button>

          {/* Book / Guide button */}
          <button
            onClick={() => {
              soundManager.playClick();
              setShowGuideModal(true);
            }}
            className="w-9 h-9 rounded-full bg-orange-500 hover:bg-orange-600 text-white flex items-center justify-center shadow-sm border border-orange-400 active:scale-90 transition-all"
            title="Sổ tay phụ huynh & giáo viên"
          >
            <span className="text-sm">📘</span>
          </button>

          {/* Fullscreen toggle button */}
          <button
            onClick={handleToggleFullscreen}
            className="w-9 h-9 rounded-full bg-white/90 hover:bg-white text-stone-700 flex items-center justify-center shadow-sm border border-stone-200 active:scale-90 transition-all"
            title="Toàn màn hình"
          >
            <Maximize2 className="w-4 h-4 text-stone-600" />
          </button>
        </div>
      </div>

      {/* Big Title Section */}
      <div className="w-full text-left mt-2 mb-3">
        <h1 className="text-3xl sm:text-4xl font-black text-[#96371a] leading-none tracking-tight">
          Bé Vui<br />Học Toán
        </h1>

        <div className="flex items-center gap-1.5 text-xs sm:text-sm font-extrabold text-[#96371a]/90 mt-2">
          <span className="text-base">🌰</span>
          <span>«Học mà chơi – Chơi mà học» • bé 3–4 tuổi • 14 trạm cùng Cô Huyền</span>
        </div>

        <div className="mt-2 inline-flex items-center gap-1 bg-white/95 text-sky-700 px-3 py-1 rounded-full text-xs font-bold border border-sky-200 shadow-xs">
          <span>🌐</span>
          <span>Bản online • Sẵn sàng học</span>
        </div>
      </div>

      {/* Cute Mascot with waving animation */}
      <div className="w-full flex flex-col items-center justify-center my-2 relative">
        <div className="relative group cursor-pointer" onClick={handleTeacherGreeting}>
          {/* Animated cute mascot SVG/Illustration */}
          <div className="w-40 h-44 sm:w-48 sm:h-52 relative flex items-center justify-center">
            {/* SVG Squirrel / Cartoon character with waving hands and big smile */}
            <svg viewBox="0 0 200 220" className="w-full h-full drop-shadow-md">
              {/* Squirrel bushy tail */}
              <path
                d="M 120 180 C 180 180 200 90 150 40 C 130 18 105 30 115 65 C 122 90 140 120 120 160 Z"
                fill="#d97706"
                stroke="#b45309"
                strokeWidth="4"
              />
              <path
                d="M 125 170 C 165 170 180 100 145 60 C 130 45 118 55 125 80 C 130 100 140 125 125 155 Z"
                fill="#fef3c7"
              />

              {/* Squirrel body */}
              <ellipse cx="100" cy="150" rx="45" ry="50" fill="#d97706" stroke="#b45309" strokeWidth="4" />
              <ellipse cx="100" cy="155" rx="30" ry="36" fill="#fef3c7" />

              {/* Ears */}
              <polygon points="65,85 55,45 85,70" fill="#d97706" stroke="#b45309" strokeWidth="3" />
              <polygon points="67,80 60,55 80,72" fill="#fca5a5" />

              <polygon points="135,85 145,45 115,70" fill="#d97706" stroke="#b45309" strokeWidth="3" />
              <polygon points="133,80 140,55 120,72" fill="#fca5a5" />

              {/* Squirrel head */}
              <ellipse cx="100" cy="95" rx="46" ry="42" fill="#d97706" stroke="#b45309" strokeWidth="4" />

              {/* Eyes */}
              <ellipse cx="85" cy="88" rx="8" ry="9" fill="#1e293b" />
              <circle cx="83" cy="85" r="3" fill="#ffffff" />

              <ellipse cx="115" cy="88" rx="8" ry="9" fill="#1e293b" />
              <circle cx="113" cy="85" r="3" fill="#ffffff" />

              {/* Rosy cheeks */}
              <ellipse cx="73" cy="98" rx="7" ry="5" fill="#f87171" opacity="0.8" />
              <ellipse cx="127" cy="98" rx="7" ry="5" fill="#f87171" opacity="0.8" />

              {/* Snout & Nose */}
              <ellipse cx="100" cy="97" rx="14" ry="10" fill="#fef3c7" />
              <ellipse cx="100" cy="93" rx="6" ry="4.5" fill="#78350f" />

              {/* Cute 2 buck teeth */}
              <rect x="94" y="100" width="5" height="7" rx="1" fill="#ffffff" stroke="#78350f" strokeWidth="1" />
              <rect x="101" y="100" width="5" height="7" rx="1" fill="#ffffff" stroke="#78350f" strokeWidth="1" />

              {/* Smile */}
              <path d="M 90 99 Q 100 109 110 99" fill="none" stroke="#78350f" strokeWidth="2.5" strokeLinecap="round" />

              {/* Left Waving Arm (up) */}
              <g className="animate-bounce-slow origin-bottom-right">
                <path d="M 60 140 C 45 120 40 105 45 95 C 49 88 58 92 65 110" fill="#d97706" stroke="#b45309" strokeWidth="3" />
                <circle cx="45" cy="95" r="7" fill="#fcd34d" />
              </g>

              {/* Right Waving Arm (up) */}
              <g className="animate-bounce-slow origin-bottom-left">
                <path d="M 140 140 C 155 120 160 105 155 95 C 151 88 142 92 135 110" fill="#d97706" stroke="#b45309" strokeWidth="3" />
                <circle cx="155" cy="95" r="7" fill="#fcd34d" />
              </g>

              {/* Feet */}
              <ellipse cx="80" cy="195" rx="15" ry="9" fill="#b45309" />
              <ellipse cx="120" cy="195" rx="15" ry="9" fill="#b45309" />
            </svg>
          </div>
        </div>

        {/* Mascot Speech Button: "👋 Cô Huyền chào bé! 🔊" */}
        <button
          onClick={() => {
            soundManager.playClick();
            handleTeacherGreeting();
          }}
          className="mt-1 flex items-center gap-2 bg-white/95 hover:bg-white text-stone-900 font-black px-5 py-2.5 rounded-full shadow-md border-2 border-amber-300 text-sm sm:text-base active:scale-95 transition-all group"
        >
          <span className="text-xl">👋</span>
          <span className="text-stone-800">Cô Huyền chào bé!</span>
          <span className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-xs ml-1 group-hover:scale-110">
            🔊
          </span>
        </button>
      </div>

      {/* Safety & Privacy Badges (Matching Screenshot 1) */}
      <div className="w-full flex flex-wrap justify-center gap-2 my-3 text-[11px] sm:text-xs font-bold text-stone-700">
        <div className="flex items-center gap-1 bg-white/90 px-3 py-1.5 rounded-full border border-stone-200 shadow-xs">
          <span>🔒</span>
          <span>Không lưu tên bé</span>
        </div>
        <div className="flex items-center gap-1 bg-white/90 px-3 py-1.5 rounded-full border border-stone-200 shadow-xs">
          <span>📵</span>
          <span>Không cần mạng</span>
        </div>
        <div className="flex items-center gap-1 bg-white/90 px-3 py-1.5 rounded-full border border-stone-200 shadow-xs">
          <span>🎥</span>
          <span>Camera không lưu ảnh</span>
        </div>
        <div className="flex items-center gap-1 bg-white/90 px-3 py-1.5 rounded-full border border-stone-200 shadow-xs">
          <span>🎤</span>
          <span>Micro không ghi âm</span>
        </div>
        <div className="flex items-center gap-1 bg-white/90 px-3 py-1.5 rounded-full border border-stone-200 shadow-xs">
          <span>🔐</span>
          <span>Kết quả mã hoá</span>
        </div>
      </div>

      {/* Author Card: Cô Nguyễn Thị Huyền (Matching Screenshot 2 exactly with real photo) */}
      <div className="w-full bg-white rounded-3xl p-3.5 sm:p-4 shadow-md border-2 border-stone-200/80 mb-3 relative overflow-hidden">
        <div className="flex items-center gap-3">
          
          {/* Teacher Photo with rounded frame & acorn/flower badge */}
          <div className="relative flex-shrink-0">
            <div className="w-20 h-20 sm:w-22 sm:h-22 rounded-2xl overflow-hidden border-3 border-amber-400 p-0.5 bg-gradient-to-tr from-amber-200 to-rose-200 shadow-md">
              <img
                src={teacherAvatarPath}
                alt="Cô giáo Nguyễn Thị Huyền"
                className="w-full h-full object-cover rounded-xl"
              />
            </div>
            {/* Small corner badge */}
            <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-amber-500 text-white flex items-center justify-center text-xs shadow-sm border border-white">
              🌰
            </div>
          </div>

          {/* Author Details */}
          <div className="flex-1 min-w-0">
            <div className="text-[10px] font-black uppercase tracking-wider text-amber-700 flex items-center gap-1">
              <span>✨</span>
              <span>TÁC GIẢ</span>
            </div>
            
            <h2 className="text-base sm:text-lg font-black text-[#96371a] leading-tight truncate">
              Nguyễn Thị Huyền
            </h2>

            <div className="text-xs font-black text-[#96371a]/90 mt-1 flex items-center gap-1 leading-tight">
              <span>🏫</span>
              <span className="truncate">Trường Mầm non Thạch Thất 2</span>
            </div>

            <div className="text-[11px] font-bold text-stone-500 mt-0.5 flex items-start gap-1 leading-tight">
              <span className="text-rose-600 mt-0.5">📍</span>
              <span className="line-clamp-2">Lớp: 3 Tuổi C2 • Xã Thạch Thất, Huyện Thạch Thất, TP. Hà Nội</span>
            </div>
          </div>

        </div>
      </div>

      {/* Quick Experience Bar: "🎬 Trải nghiệm nhanh (dữ liệu mẫu, không cần PIN)" */}
      <button
        onClick={() => {
          soundManager.playClick();
          onSelectTopic('count');
        }}
        className="w-full bg-white hover:bg-stone-50 text-indigo-700 font-black py-2.5 px-4 rounded-2xl shadow-sm border-2 border-indigo-200 mb-4 flex items-center justify-center gap-2 text-xs sm:text-sm active:scale-98 transition-all"
      >
        <span className="text-base">🎬</span>
        <span>Trải nghiệm nhanh (học ngay, không cần PIN)</span>
      </button>

      {/* ================= 4 LARGE ACTION CARDS (MATCHING SCREENSHOTS 2 & 3) ================= */}
      <div className="w-full flex flex-col gap-3.5 mb-6">
        
        {/* CARD 1: Bé Vào Chơi (Coral/Pink-Orange Gradient) */}
        <div
          onClick={() => {
            soundManager.playClick();
            setShowStationsModal(true);
          }}
          className="cursor-pointer group bg-gradient-to-r from-[#f95368] to-[#ff7854] text-white rounded-3xl p-4 sm:p-5 shadow-lg active:scale-98 transition-all relative overflow-hidden flex items-center gap-4"
        >
          {/* Subtle curved background circle */}
          <div className="absolute right-0 top-0 w-36 h-36 bg-white/10 rounded-full translate-x-10 -translate-y-6 pointer-events-none" />

          {/* Icon */}
          <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center text-3xl flex-shrink-0 group-hover:scale-110 transition-transform">
            👧
          </div>

          <div className="flex-1">
            <h3 className="text-lg sm:text-xl font-black tracking-tight leading-tight">
              Bé vào chơi
            </h3>
            <p className="text-xs sm:text-sm font-bold text-white/95 mt-0.5">
              14 Trạm ôn luyện toán • Đếm số, giỏ quà, hình khối, đo lường
            </p>
          </div>

          <ChevronRight className="w-6 h-6 text-white/80 group-hover:translate-x-1 transition-transform" />
        </div>

        {/* CARD 2: Cả Lớp Cùng Chơi (Blue Gradient) */}
        <div
          onClick={() => {
            soundManager.playClick();
            onOpenClassTv();
          }}
          className="cursor-pointer group bg-gradient-to-r from-[#3a8bfd] to-[#60b5ff] text-white rounded-3xl p-4 sm:p-5 shadow-lg active:scale-98 transition-all relative overflow-hidden flex items-center gap-4"
        >
          <div className="absolute right-0 top-0 w-36 h-36 bg-white/10 rounded-full translate-x-10 -translate-y-6 pointer-events-none" />

          <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center text-3xl flex-shrink-0 group-hover:scale-110 transition-transform">
            🏫
          </div>

          <div className="flex-1">
            <h3 className="text-lg sm:text-xl font-black tracking-tight leading-tight">
              Cả lớp cùng chơi
            </h3>
            <p className="text-xs sm:text-sm font-bold text-white/95 mt-0.5">
              Cô điều khiển trên TV • Màn hình lớp 3 Tuổi C2
            </p>
          </div>

          <ChevronRight className="w-6 h-6 text-white/80 group-hover:translate-x-1 transition-transform" />
        </div>

        {/* CARD 3: Trò Chơi Tương Tác (Purple Gradient) */}
        <div
          onClick={() => {
            soundManager.playClick();
            setShowGamesModal(true);
          }}
          className="cursor-pointer group bg-gradient-to-r from-[#7b46f6] to-[#9b6ef9] text-white rounded-3xl p-4 sm:p-5 shadow-lg active:scale-98 transition-all relative overflow-hidden flex items-center gap-4"
        >
          <div className="absolute right-0 top-0 w-36 h-36 bg-white/10 rounded-full translate-x-10 -translate-y-6 pointer-events-none" />

          <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center text-3xl flex-shrink-0 group-hover:scale-110 transition-transform">
            🐰
          </div>

          <div className="flex-1">
            <h3 className="text-lg sm:text-xl font-black tracking-tight leading-tight">
              Trò chơi vui nhộn
            </h3>
            <p className="text-xs sm:text-sm font-bold text-white/95 mt-0.5">
              6 Trò chơi: Ghép bóng, Màu sắc, Quy tắc, To-nhỏ, Cà rốt
            </p>
          </div>

          <ChevronRight className="w-6 h-6 text-white/80 group-hover:translate-x-1 transition-transform" />
        </div>

        {/* CARD 4: Phụ Huynh & Khen Thưởng (Emerald Gradient) */}
        <div
          onClick={() => {
            soundManager.playClick();
            onSelectTopic('rewards');
          }}
          className="cursor-pointer group bg-gradient-to-r from-[#00c982] to-[#26e3a6] text-white rounded-3xl p-4 sm:p-5 shadow-lg active:scale-98 transition-all relative overflow-hidden flex items-center gap-4"
        >
          <div className="absolute right-0 top-0 w-36 h-36 bg-white/10 rounded-full translate-x-10 -translate-y-6 pointer-events-none" />

          <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center text-3xl flex-shrink-0 group-hover:scale-110 transition-transform">
            🏆
          </div>

          <div className="flex-1">
            <h3 className="text-lg sm:text-xl font-black tracking-tight leading-tight">
              Phụ huynh & Khen thưởng
            </h3>
            <p className="text-xs sm:text-sm font-bold text-white/95 mt-0.5">
              Phiếu in màu A4 tải về • Bảng sao • Sticker • Lời nhắn cô Huyền
            </p>
          </div>

          <ChevronRight className="w-6 h-6 text-white/80 group-hover:translate-x-1 transition-transform" />
        </div>

      </div>

      {/* Official Teacher Approved Footer Tag */}
      <div className="w-full text-center pb-4 text-xs font-bold text-stone-600">
        <div className="inline-flex items-center gap-1.5 bg-emerald-100/90 text-emerald-900 px-3.5 py-1 rounded-full border border-emerald-300 shadow-xs">
          <span>✅ BẢN CHÍNH THỨC — Cô giáo Nguyễn Thị Huyền • Trường Mầm non Thạch Thất 2</span>
        </div>
      </div>

      {/* ================= MODAL: 5 MATH STATIONS CHO BÉ VÀO CHƠI ================= */}
      {showStationsModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl p-5 sm:p-6 w-full max-w-lg shadow-2xl border-4 border-rose-300 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b pb-3 mb-4">
              <div className="flex items-center gap-2">
                <span className="text-2xl">👧</span>
                <h3 className="text-lg sm:text-xl font-black text-rose-700">
                  14 Trạm Học Toán Cùng Cô Huyền
                </h3>
              </div>
              <button
                onClick={() => setShowStationsModal(false)}
                className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 font-bold flex items-center justify-center"
              >
                ✕
              </button>
            </div>

            <div className="flex flex-col gap-2.5">
              {[
                { id: 'dem', title: 'Trạm 1: Vườn đếm quả (1 đến 5)', desc: 'Chạm đếm từng quả ngọt chín mọng', icon: '🍎', color: 'from-amber-400 to-orange-400' },
                { id: 'them', title: 'Trạm 2: Giỏ quà đủ số', desc: 'Thêm bớt quả vào giỏ cho đủ số yêu cầu', icon: '🧺', color: 'from-orange-400 to-amber-500' },
                { id: 'noi', title: 'Trạm 3: Cầu nối số', desc: 'Nối nhóm đồ vật với chữ số tương ứng', icon: '🔗', color: 'from-sky-400 to-blue-500' },
                { id: 'tach-gop', title: 'Trạm 4: Bếp tách – gộp', desc: 'Tách đĩa kẹo thành 2 phần và gộp lại', icon: '🍬', color: 'from-pink-400 to-rose-500' },
                { id: 'so-sanh', title: 'Trạm 5: Chợ so sánh kích thước', desc: 'To - Nhỏ, Cao - Thấp, Dài - Ngắn', icon: '⚖️', color: 'from-teal-400 to-emerald-500' },
                { id: 'ghep-cap', title: 'Trạm 6: Đôi bạn thân', desc: 'Ghép cặp con vật với thức ăn yêu thích', icon: '💞', color: 'from-rose-400 to-pink-500' },
                { id: 'game-shadow', title: 'Trạm 7: Ghép bóng với hình', desc: 'Tìm bóng đen bí mật cho các bạn thú', icon: '👥', color: 'from-purple-400 to-indigo-500' },
                { id: 'quy-tac', title: 'Trạm 8: Chuỗi hạt quy tắc & Đoàn tàu', desc: 'Quy luật lặp lại vui nhộn AB, AAB', icon: '🚂', color: 'from-red-400 to-orange-500' },
                { id: 'do', title: 'Trạm 9: Đo chú sâu', desc: 'Đo chiều dài bằng đốt ô vuông mầm non', icon: '📏', color: 'from-teal-400 to-cyan-500' },
                { id: 'khoi', title: 'Trạm 10: Xưởng hình khối & Màu sắc', desc: 'Hình Vuông, Tròn, Tam giác, Chữ nhật', icon: '🎨', color: 'from-amber-400 to-yellow-500' },
                { id: 'vi-tri', title: 'Trạm 11: Gấu bông ở đâu?', desc: 'Định hướng không gian Trên - Dưới, Trước - Sau', icon: '🧸', color: 'from-purple-400 to-pink-500' },
                { id: 'thoi-gian', title: 'Trạm 12: Thời gian của bé', desc: 'Nhận biết Buổi Sáng, Buổi Trưa, Buổi Tối', icon: '⏰', color: 'from-blue-400 to-indigo-500' },
                { id: 'game-rabbit', title: 'Trạm 13: Bé thỏ hái cà rốt', desc: 'Đếm số lượng cà rốt giúp thỏ Mimi', icon: '🐰', color: 'from-orange-400 to-amber-500' },
                { id: 'cau-do', title: 'Trạm 14: Câu đố của cô Huyền', desc: 'Ngân hàng câu đố toán mầm non dí dỏm', icon: '❓', color: 'from-rose-400 to-purple-500' },
              ].map((station) => (
                <button
                  key={station.id}
                  onClick={() => {
                    soundManager.playClick();
                    setShowStationsModal(false);
                    onSelectTopic(station.id as TopicId);
                  }}
                  className="p-3 rounded-2xl border-2 border-stone-200 hover:border-rose-400 hover:bg-rose-50/50 flex items-center gap-3 text-left transition-all active:scale-98 shadow-xs"
                >
                  <div className={`w-11 h-11 rounded-xl bg-gradient-to-tr ${station.color} text-white flex items-center justify-center text-2xl flex-shrink-0 shadow-sm`}>
                    {station.icon}
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-black text-stone-900">{station.title}</div>
                    <div className="text-xs text-stone-500 font-bold">{station.desc}</div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-stone-400" />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL: 2 MINIGAMES ================= */}
      {showGamesModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl p-5 sm:p-6 w-full max-w-lg shadow-2xl border-4 border-purple-300">
            <div className="flex items-center justify-between border-b pb-3 mb-4">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🎮</span>
                <h3 className="text-lg sm:text-xl font-black text-purple-800">
                  2 Trò Chơi Tương Tác Vui Học
                </h3>
              </div>
              <button
                onClick={() => setShowGamesModal(false)}
                className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 font-bold flex items-center justify-center"
              >
                ✕
              </button>
            </div>

            <div className="flex flex-col gap-3">
              <button
                onClick={() => {
                  soundManager.playClick();
                  setShowGamesModal(false);
                  onSelectTopic('game-rabbit');
                }}
                className="p-4 rounded-2xl bg-gradient-to-r from-orange-100 to-amber-50 border-3 border-orange-300 hover:border-orange-400 flex items-center gap-4 text-left transition-all active:scale-98 shadow-sm"
              >
                <div className="w-14 h-14 rounded-2xl bg-white shadow-sm flex items-center justify-center text-4xl border border-orange-200 flex-shrink-0">
                  🐰🥕
                </div>
                <div>
                  <div className="text-base font-black text-orange-950">
                    Trò chơi 1: Bé Thỏ Hái Cà Rốt
                  </div>
                  <div className="text-xs text-stone-600 font-bold mt-0.5">
                    Đếm số lượng cà rốt để thỏ Mimi no bụng và nhận sao vàng
                  </div>
                </div>
              </button>

              <button
                onClick={() => {
                  soundManager.playClick();
                  setShowGamesModal(false);
                  onSelectTopic('game-puzzle');
                }}
                className="p-3.5 rounded-2xl bg-gradient-to-r from-indigo-100 to-sky-50 border-2 border-indigo-300 hover:border-indigo-400 flex items-center gap-3.5 text-left transition-all active:scale-98 shadow-sm"
              >
                <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-3xl border border-indigo-200 flex-shrink-0">
                  🧩🏠
                </div>
                <div>
                  <div className="text-sm sm:text-base font-black text-indigo-950">
                    Trò chơi 2: Ghép Hình Ngôi Nhà
                  </div>
                  <div className="text-xs text-stone-600 font-bold">
                    Lắp ghép Mái nhà tam giác, Thân nhà vuông, Cửa sổ tròn
                  </div>
                </div>
              </button>

              <button
                onClick={() => {
                  soundManager.playClick();
                  setShowGamesModal(false);
                  onSelectTopic('game-shadow');
                }}
                className="p-3.5 rounded-2xl bg-gradient-to-r from-purple-100 to-pink-50 border-2 border-purple-300 hover:border-purple-400 flex items-center gap-3.5 text-left transition-all active:scale-98 shadow-sm"
              >
                <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-3xl border border-purple-200 flex-shrink-0">
                  👥🐘
                </div>
                <div>
                  <div className="text-sm sm:text-base font-black text-purple-950">
                    Trò chơi 3: Ghép Bóng Với Hình
                  </div>
                  <div className="text-xs text-stone-600 font-bold">
                    Tìm bóng đen bí mật cho chú voi, chú thỏ, chú bướm, quả táo
                  </div>
                </div>
              </button>

              <button
                onClick={() => {
                  soundManager.playClick();
                  setShowGamesModal(false);
                  onSelectTopic('game-colorshape');
                }}
                className="p-3.5 rounded-2xl bg-gradient-to-r from-amber-100 to-yellow-50 border-2 border-amber-300 hover:border-amber-400 flex items-center gap-3.5 text-left transition-all active:scale-98 shadow-sm"
              >
                <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-3xl border border-amber-200 flex-shrink-0">
                  🎨🔺
                </div>
                <div>
                  <div className="text-sm sm:text-base font-black text-amber-950">
                    Trò chơi 4: Hình Khối & Màu Sắc
                  </div>
                  <div className="text-xs text-stone-600 font-bold">
                    Ôn luyện hình Tròn, Vuông, Tam giác cùng màu Đỏ, Vàng, Xanh
                  </div>
                </div>
              </button>

              <button
                onClick={() => {
                  soundManager.playClick();
                  setShowGamesModal(false);
                  onSelectTopic('game-train');
                }}
                className="p-3.5 rounded-2xl bg-gradient-to-r from-rose-100 to-red-50 border-2 border-rose-300 hover:border-rose-400 flex items-center gap-3.5 text-left transition-all active:scale-98 shadow-sm"
              >
                <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-3xl border border-rose-200 flex-shrink-0">
                  🚂🍎
                </div>
                <div>
                  <div className="text-sm sm:text-base font-black text-rose-950">
                    Trò chơi 5: Đoàn Tàu Quy Tắc
                  </div>
                  <div className="text-xs text-stone-600 font-bold">
                    Khám phá chuỗi quy luật lặp hoa quả, con vật và hình khối
                  </div>
                </div>
              </button>

              <button
                onClick={() => {
                  soundManager.playClick();
                  setShowGamesModal(false);
                  onSelectTopic('game-sizefun');
                }}
                className="p-3.5 rounded-2xl bg-gradient-to-r from-teal-100 to-emerald-50 border-2 border-teal-300 hover:border-teal-400 flex items-center gap-3.5 text-left transition-all active:scale-98 shadow-sm"
              >
                <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-3xl border border-teal-200 flex-shrink-0">
                  🦒📏
                </div>
                <div>
                  <div className="text-sm sm:text-base font-black text-teal-950">
                    Trò chơi 6: To - Nhỏ • Cao - Thấp
                  </div>
                  <div className="text-xs text-stone-600 font-bold">
                    So sánh kích thước trực quan cực vui nhộn cho bé 3-4 tuổi
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL: SỔ TAY THÔNG TIN GIÁO VIÊN & LỚP HỌC ================= */}
      {showGuideModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl p-5 sm:p-6 w-full max-w-md shadow-2xl border-4 border-amber-300">
            <div className="flex items-center justify-between border-b pb-3 mb-3">
              <div className="flex items-center gap-2">
                <span className="text-2xl">📘</span>
                <h3 className="text-base sm:text-lg font-black text-amber-950">
                  Thông Tin Ứng Dụng Mầm Non
                </h3>
              </div>
              <button
                onClick={() => setShowGuideModal(false)}
                className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 font-bold flex items-center justify-center"
              >
                ✕
              </button>
            </div>

            <div className="text-xs sm:text-sm text-stone-700 space-y-2">
              <div className="bg-amber-50 p-3 rounded-2xl border border-amber-200">
                <p><strong>🏫 Trường:</strong> Trường Mầm non Thạch Thất 2</p>
                <p><strong>🏷️ Lớp:</strong> 3 Tuổi C2 (Độ tuổi: 3-4 tuổi)</p>
                <p><strong>👩‍🏫 Giáo viên:</strong> Nguyễn Thị Huyền</p>
              </div>

              <p className="font-semibold text-stone-600">
                Ứng dụng được thiết kế riêng nhằm hỗ trợ cô giáo và phụ huynh rèn luyện tư duy toán học mầm non trực quan, an toàn, không chứa quảng cáo và có giọng đọc nữ ngọt ngào, ấm áp như cô giáo mầm non!
              </p>
            </div>

            <button
              onClick={() => setShowGuideModal(false)}
              className="mt-4 w-full bg-amber-400 hover:bg-amber-500 text-amber-950 font-black py-2 rounded-2xl shadow-sm text-sm"
            >
              Đã hiểu
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
