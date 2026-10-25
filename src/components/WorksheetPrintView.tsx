import React, { useState } from 'react';
import { 
  Printer, 
  Download, 
  ChevronLeft, 
  FileText, 
  Star, 
  Sparkles, 
  CheckCircle2, 
  User, 
  School, 
  Calendar, 
  Heart, 
  Palette, 
  Shapes, 
  Maximize2, 
  Layers, 
  Compass, 
  Award,
  Volume2
} from 'lucide-react';
import { soundManager } from '../utils/soundEffects';

interface WorksheetPrintViewProps {
  onBack: () => void;
  stars: number;
  carrots: number;
}

export const WorksheetPrintView: React.FC<WorksheetPrintViewProps> = ({
  onBack,
  stars,
  carrots,
}) => {
  const [activeSheet, setActiveSheet] = useState<number>(1);
  const [studentName, setStudentName] = useState<string>('');
  const [sheetDate, setSheetDate] = useState<string>(() => {
    const today = new Date();
    return `${today.getDate().toString().padStart(2, '0')}/${(today.getMonth() + 1).toString().padStart(2, '0')}/${today.getFullYear()}`;
  });

  const handlePrint = () => {
    soundManager.playClick();
    soundManager.speakVietnamese('Bố mẹ chuẩn bị in phiếu bài tập cho bé nhé!');
    setTimeout(() => {
      window.print();
    }, 300);
  };

  const handleTeacherGuidance = (text: string) => {
    soundManager.speakVietnamese(`Cô Huyền hướng dẫn bố mẹ: ${text}`);
  };

  const teacherAvatarPath = '/assets/aistudio/1792848527954_6298271864911581485_6298271864911581485_fd702d730039135d5d1b8c9e2f72ad86_73054ade.jpg';

  const sheetTabs = [
    { id: 1, title: 'Phiếu 1: Ôn Số Đếm (1 - 5)', icon: '🔢', color: 'border-amber-400 bg-amber-50 text-amber-900' },
    { id: 2, title: 'Phiếu 2: Hình Khối & Màu Sắc', icon: '🎨', color: 'border-sky-400 bg-sky-50 text-sky-900' },
    { id: 3, title: 'Phiếu 3: So Sánh Kích Thước', icon: '🦒', color: 'border-emerald-400 bg-emerald-50 text-emerald-900' },
    { id: 4, title: 'Phiếu 4: Sắp Xếp Quy Tắc', icon: '🚂', color: 'border-rose-400 bg-rose-50 text-rose-900' },
    { id: 5, title: 'Phiếu 5: Định Hướng Không Gian', icon: '🧭', color: 'border-purple-400 bg-purple-50 text-purple-900' },
    { id: 6, title: 'Phiếu 6: Giấy Khen Bé Ngoan', icon: '🏆', color: 'border-yellow-500 bg-yellow-50 text-yellow-950' },
  ];

  return (
    <div className="w-full max-w-5xl mx-auto px-2 sm:px-4 py-4 select-none">
      
      {/* Top action header (Hidden on print) */}
      <div className="no-print flex items-center justify-between mb-4 flex-wrap gap-2">
        <button
          onClick={() => {
            soundManager.playClick();
            onBack();
          }}
          className="flex items-center gap-1.5 bg-white hover:bg-stone-50 text-stone-700 font-black px-4 py-2 rounded-2xl shadow-sm border border-stone-300 text-sm active:scale-95 transition-all"
        >
          <ChevronLeft className="w-5 h-5 text-rose-500" />
          <span>Quay lại</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => handleTeacherGuidance('Bố mẹ có thể nhập tên bé hoặc để trống để in ra giấy cho bé tự cầm bút làm bài tập và tô màu nhé!')}
            className="flex items-center gap-1.5 bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold px-3 py-2 rounded-2xl text-xs active:scale-95 transition-all border border-amber-300"
            title="Nghe cô Huyền hướng dẫn"
          >
            <Volume2 className="w-4 h-4 text-amber-700" />
            <span className="hidden sm:inline">Lời nhắn của cô</span>
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-black px-5 py-2.5 rounded-2xl shadow-md text-sm active:scale-95 transition-all"
            title="In phiếu màu sắc nét hoặc Lưu dưới dạng PDF"
          >
            <Printer className="w-4 h-4" />
            <span>In Phiếu Này (Khổ A4)</span>
          </button>
        </div>
      </div>

      {/* Parental Info Banner (Hidden on print) */}
      <div className="no-print bg-gradient-to-r from-amber-100 via-orange-100 to-rose-100 p-4 rounded-3xl border-2 border-amber-300 shadow-sm mb-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-2xl shadow-xs border border-amber-200 flex-shrink-0">
              🖨️
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-black text-amber-950">
                Góc Phụ Huynh: Phiếu In Màu Ôn Tập Toán Mầm Non Cho Bé
              </h2>
              <p className="text-xs text-stone-600 font-bold mt-0.5">
                Thiết kế chuẩn tỉ lệ A4 màu sắc tươi sáng, hình ảnh sắc nét, có chỗ ghi tên bé và lớp học!
              </p>
            </div>
          </div>

          {/* Quick Name Input to autofill onto sheet */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <span className="text-xs font-bold text-stone-700 whitespace-nowrap">Tên bé:</span>
            <input
              type="text"
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
              placeholder="Nhập tên bé (tuỳ chọn)..."
              className="bg-white px-3 py-1.5 rounded-xl border border-stone-300 text-xs font-bold focus:outline-none focus:border-amber-500 w-full sm:w-48 shadow-inner"
            />
          </div>
        </div>

        {/* Tab Switcher for Sheets */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 mt-3 pt-3 border-t border-amber-200/80">
          {sheetTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                soundManager.playClick();
                setActiveSheet(tab.id);
              }}
              className={`p-2 rounded-2xl border-2 text-left transition-all active:scale-95 flex items-center gap-2 shadow-xs ${
                activeSheet === tab.id
                  ? 'border-rose-500 bg-white ring-2 ring-rose-400 font-black shadow-sm'
                  : `${tab.color} opacity-85 hover:opacity-100 font-bold`
              }`}
            >
              <span className="text-xl">{tab.icon}</span>
              <div className="text-[11px] leading-tight line-clamp-2">
                {tab.title}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* ================= THE PRINTABLE A4 SHEET CONTAINER ====================== */}
      {/* ========================================================================= */}
      <div className="print-area bg-white rounded-3xl p-6 sm:p-10 shadow-xl border-4 border-amber-300 max-w-4xl mx-auto my-2 text-stone-900 relative">
        
        {/* Printable Sheet Header with School & Teacher Branding */}
        <div className="border-b-3 border-amber-300 pb-4 mb-4">
          <div className="flex items-start justify-between gap-3">
            
            {/* School details */}
            <div>
              <div className="flex items-center gap-1.5 text-xs sm:text-sm font-black text-amber-950 uppercase">
                <School className="w-4 h-4 text-amber-600" />
                <span>TRƯỜNG MẦM NON THẠCH THẤT 2</span>
              </div>
              <div className="text-xs sm:text-sm font-extrabold text-rose-600 mt-0.5">
                LỚP: 3 TUỔI C2 • ĐỘ TUỔI 3–4 TUỔI
              </div>
              <div className="text-[11px] sm:text-xs font-bold text-emerald-800 mt-0.5">
                Giáo viên phụ trách: <strong>Cô Nguyễn Thị Huyền</strong>
              </div>
            </div>

            {/* Official Badge & Teacher Image */}
            <div className="flex items-center gap-2">
              <div className="w-12 h-12 rounded-xl overflow-hidden border-2 border-amber-400 p-0.5 bg-amber-50 hidden sm:block flex-shrink-0">
                <img
                  src={teacherAvatarPath}
                  alt="Cô giáo Huyền"
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
              <div className="bg-amber-100 text-amber-950 px-3 py-1 rounded-xl text-center border border-amber-300">
                <div className="text-[10px] font-bold uppercase tracking-wider">Phiếu ôn tập</div>
                <div className="text-xs font-black text-rose-700">MẦM NON 3-4 TUỔI</div>
              </div>
            </div>

          </div>

          {/* Student Name & Class Fill-in Line */}
          <div className="mt-3 pt-2 border-t border-dashed border-amber-200 flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm font-bold text-stone-800">
            <div className="flex items-center gap-1.5 min-w-[240px]">
              <span className="text-rose-700 font-extrabold">Họ và tên bé:</span>
              <span className="font-black text-blue-900 border-b-2 border-stone-400 border-dashed pb-0.5 flex-1 min-w-[140px]">
                {studentName ? studentName : '...................................................'}
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="text-rose-700 font-extrabold">Lớp:</span>
              <span className="font-black text-stone-900 border-b-2 border-stone-400 border-dashed pb-0.5 px-2">
                3 Tuổi C2
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="text-stone-600">Ngày làm:</span>
              <span className="font-bold text-stone-900 border-b-2 border-stone-400 border-dashed pb-0.5 px-2">
                {sheetDate}
              </span>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* SHEET 1: ÔN SỐ ĐẾM (1 ĐẾN 5 & 1 VÀ NHIỀU) */}
        {/* ========================================================================= */}
        {activeSheet === 1 && (
          <div className="space-y-4">
            
            {/* Sheet Title */}
            <div className="text-center bg-amber-50 p-2.5 rounded-2xl border-2 border-amber-200">
              <h3 className="text-base sm:text-lg font-black text-amber-950 uppercase">
                BÀI ÔN TẬP TOÁN: NHẬN BIẾT SỐ LƯỢNG & ĐẾM TRONG PHẠM VI 5
              </h3>
              <p className="text-xs text-stone-600 font-semibold mt-0.5">
                Bố mẹ hướng dẫn bé chạm tay đếm to từng đồ vật và nối với chữ số tương ứng nhé!
              </p>
            </div>

            {/* Task 1: Connect quantity with number */}
            <div className="bg-white p-3.5 rounded-2xl border-2 border-stone-200">
              <div className="text-xs sm:text-sm font-black text-rose-700 mb-3 flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-rose-500 text-white flex items-center justify-center text-xs">1</span>
                <span>Bài 1: Bé hãy đếm số lượng các bạn và NỐI VỚI CHỮ SỐ ĐÚNG (1, 2, 3, 4, 5):</span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs sm:text-sm">
                
                {/* Left: Items list */}
                <div className="space-y-2.5">
                  <div className="p-2 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-between">
                    <span className="text-3xl">🐶</span>
                    <span className="font-bold text-stone-700">1 Chú cún</span>
                    <span className="w-3.5 h-3.5 rounded-full border-2 border-amber-400 bg-white" />
                  </div>

                  <div className="p-2 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between">
                    <span className="text-3xl">🍓🍓</span>
                    <span className="font-bold text-stone-700">2 Quả dâu</span>
                    <span className="w-3.5 h-3.5 rounded-full border-2 border-emerald-400 bg-white" />
                  </div>

                  <div className="p-2 rounded-xl bg-sky-50 border border-sky-200 flex items-center justify-between">
                    <span className="text-3xl">🦆🦆🦆</span>
                    <span className="font-bold text-stone-700">3 Chú vịt</span>
                    <span className="w-3.5 h-3.5 rounded-full border-2 border-sky-400 bg-white" />
                  </div>

                  <div className="p-2 rounded-xl bg-orange-50 border border-orange-200 flex items-center justify-between">
                    <span className="text-2xl">🌻🌻🌻🌻</span>
                    <span className="font-bold text-stone-700">4 Bông hoa</span>
                    <span className="w-3.5 h-3.5 rounded-full border-2 border-orange-400 bg-white" />
                  </div>

                  <div className="p-2 rounded-xl bg-pink-50 border border-pink-200 flex items-center justify-between">
                    <span className="text-2xl">🐰🐰🐰🐰🐰</span>
                    <span className="font-bold text-stone-700">5 Chú thỏ</span>
                    <span className="w-3.5 h-3.5 rounded-full border-2 border-pink-400 bg-white" />
                  </div>
                </div>

                {/* Right: Numbers list (scrambled) */}
                <div className="space-y-2.5 flex flex-col justify-around">
                  {[
                    { num: 3, label: 'Số 3', color: 'bg-sky-100 text-sky-950 border-sky-300' },
                    { num: 1, label: 'Số 1', color: 'bg-amber-100 text-amber-950 border-amber-300' },
                    { num: 5, label: 'Số 5', color: 'bg-pink-100 text-pink-950 border-pink-300' },
                    { num: 2, label: 'Số 2', color: 'bg-emerald-100 text-emerald-950 border-emerald-300' },
                    { num: 4, label: 'Số 4', color: 'bg-orange-100 text-orange-950 border-orange-300' },
                  ].map((n, i) => (
                    <div key={i} className={`p-2 rounded-xl border-2 ${n.color} flex items-center justify-between font-black text-base sm:text-lg`}>
                      <span className="w-3.5 h-3.5 rounded-full border-2 border-stone-400 bg-white" />
                      <span>{n.num}</span>
                      <span className="text-xs font-bold">{n.label}</span>
                    </div>
                  ))}
                </div>

              </div>
            </div>

            {/* Task 2: Nhận biết 1 và nhiều */}
            <div className="bg-white p-3.5 rounded-2xl border-2 border-stone-200">
              <div className="text-xs sm:text-sm font-black text-rose-700 mb-2 flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-rose-500 text-white flex items-center justify-center text-xs">2</span>
                <span>Bài 2: Bé hãy khoanh tròn vào nhóm có NHIỀU BÔNG HOA NHẤT và tô màu cho hoa thật đẹp:</span>
              </div>

              <div className="grid grid-cols-2 gap-4 py-2 text-center">
                <div className="p-3 rounded-2xl border-2 border-dashed border-stone-300 bg-stone-50 flex flex-col items-center">
                  <div className="text-5xl my-2">🌸</div>
                  <span className="text-xs font-bold text-stone-600">1 Bông hoa</span>
                </div>

                <div className="p-3 rounded-2xl border-2 border-dashed border-rose-300 bg-rose-50/50 flex flex-col items-center">
                  <div className="text-4xl my-2 flex gap-1">🌸 🌸 🌸 🌸</div>
                  <span className="text-xs font-black text-rose-700">NHIỀU bông hoa (Khoanh tròn)</span>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* ========================================================================= */}
        {/* SHEET 2: NHẬN BIẾT HÌNH KHỐI CƠ BẢN & MÀU SẮC */}
        {/* ========================================================================= */}
        {activeSheet === 2 && (
          <div className="space-y-4">
            
            <div className="text-center bg-sky-50 p-2.5 rounded-2xl border-2 border-sky-200">
              <h3 className="text-base sm:text-lg font-black text-sky-950 uppercase">
                BÀI ÔN TẬP: HÌNH VUÔNG, HÌNH TRÒN, HÌNH TAM GIÁC, HÌNH CHỮ NHẬT
              </h3>
              <p className="text-xs text-stone-600 font-semibold mt-0.5">
                Nhận biết đặc điểm hình học và liên hệ với các đồ vật xung quanh bé
              </p>
            </div>

            {/* Task 1: Color shapes according to rule */}
            <div className="bg-white p-3.5 rounded-2xl border-2 border-stone-200">
              <div className="text-xs sm:text-sm font-black text-rose-700 mb-3 flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-rose-500 text-white flex items-center justify-center text-xs">1</span>
                <span>Bài 1: Bé hãy cầm bút sáp màu TÔ MÀU CÁC HÌNH KHỐI theo hướng dẫn của cô:</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                
                {/* Circle */}
                <div className="p-3 rounded-2xl border-2 border-red-300 bg-red-50 flex flex-col items-center">
                  <div className="w-16 h-16 rounded-full border-4 border-dashed border-red-500 bg-white flex items-center justify-center text-xs font-bold text-red-600 my-1">
                    Tròn
                  </div>
                  <span className="text-xs font-black text-red-700 mt-1">HÌNH TRÒN</span>
                  <span className="text-[11px] font-bold text-stone-600">👉 Tô màu ĐỎ</span>
                </div>

                {/* Square */}
                <div className="p-3 rounded-2xl border-2 border-yellow-300 bg-yellow-50 flex flex-col items-center">
                  <div className="w-16 h-16 border-4 border-dashed border-yellow-500 bg-white flex items-center justify-center text-xs font-bold text-yellow-700 my-1">
                    Vuông
                  </div>
                  <span className="text-xs font-black text-yellow-800 mt-1">HÌNH VUÔNG</span>
                  <span className="text-[11px] font-bold text-stone-600">👉 Tô màu VÀNG</span>
                </div>

                {/* Triangle */}
                <div className="p-3 rounded-2xl border-2 border-emerald-300 bg-emerald-50 flex flex-col items-center">
                  <div className="w-16 h-16 flex items-center justify-center my-1 relative">
                    <svg viewBox="0 0 100 100" className="w-full h-full">
                      <polygon points="50,15 90,85 10,85" fill="white" stroke="#10b981" strokeWidth="4" strokeDasharray="4 3" />
                    </svg>
                  </div>
                  <span className="text-xs font-black text-emerald-800 mt-1">HÌNH TAM GIÁC</span>
                  <span className="text-[11px] font-bold text-stone-600">👉 Tô XANH LÁ</span>
                </div>

                {/* Rectangle */}
                <div className="p-3 rounded-2xl border-2 border-blue-300 bg-blue-50 flex flex-col items-center">
                  <div className="w-20 h-14 border-4 border-dashed border-blue-500 bg-white flex items-center justify-center text-xs font-bold text-blue-600 my-2">
                    Chữ nhật
                  </div>
                  <span className="text-xs font-black text-blue-800 mt-1">HÌNH CHỮ NHẬT</span>
                  <span className="text-[11px] font-bold text-stone-600">👉 Tô XANH DƯƠNG</span>
                </div>

              </div>
            </div>

            {/* Task 2: Match shapes with real-world items */}
            <div className="bg-white p-3.5 rounded-2xl border-2 border-stone-200">
              <div className="text-xs sm:text-sm font-black text-rose-700 mb-3 flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-rose-500 text-white flex items-center justify-center text-xs">2</span>
                <span>Bài 2: Bé hãy NỐI HÌNH KHỐI với ĐỒ VẬT THỰC TẾ tương ứng:</span>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs sm:text-sm">
                
                <div className="space-y-2">
                  <div className="p-2 rounded-xl bg-red-100 flex items-center justify-between font-black text-red-900">
                    <span>⚪ Hình Tròn</span>
                    <span className="w-3 h-3 rounded-full border-2 border-red-500 bg-white" />
                  </div>
                  <div className="p-2 rounded-xl bg-amber-100 flex items-center justify-between font-black text-amber-900">
                    <span>🟨 Hình Vuông</span>
                    <span className="w-3 h-3 rounded-full border-2 border-amber-500 bg-white" />
                  </div>
                  <div className="p-2 rounded-xl bg-emerald-100 flex items-center justify-between font-black text-emerald-900">
                    <span>🔺 Hình Tam Giác</span>
                    <span className="w-3 h-3 rounded-full border-2 border-emerald-500 bg-white" />
                  </div>
                  <div className="p-2 rounded-xl bg-blue-100 flex items-center justify-between font-black text-blue-900">
                    <span>🟦 Hình Chữ Nhật</span>
                    <span className="w-3 h-3 rounded-full border-2 border-blue-500 bg-white" />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="p-2 rounded-xl bg-stone-100 flex items-center justify-between font-bold text-stone-800">
                    <span className="w-3 h-3 rounded-full border-2 border-stone-500 bg-white" />
                    <span>🍕 Miếng bánh pizza</span>
                  </div>
                  <div className="p-2 rounded-xl bg-stone-100 flex items-center justify-between font-bold text-stone-800">
                    <span className="w-3 h-3 rounded-full border-2 border-stone-500 bg-white" />
                    <span>🚲 Bánh xe đạp tròn</span>
                  </div>
                  <div className="p-2 rounded-xl bg-stone-100 flex items-center justify-between font-bold text-stone-800">
                    <span className="w-3 h-3 rounded-full border-2 border-stone-500 bg-white" />
                    <span>🚪 Cánh cửa lớp học</span>
                  </div>
                  <div className="p-2 rounded-xl bg-stone-100 flex items-center justify-between font-bold text-stone-800">
                    <span className="w-3 h-3 rounded-full border-2 border-stone-500 bg-white" />
                    <span>🎁 Hộp quà sinh nhật</span>
                  </div>
                </div>

              </div>
            </div>

          </div>
        )}

        {/* ========================================================================= */}
        {/* SHEET 3: SO SÁNH KÍCH THƯỚC (TO - NHỎ, CAO - THẤP, DÀI - NGẮN) */}
        {/* ========================================================================= */}
        {activeSheet === 3 && (
          <div className="space-y-4">
            
            <div className="text-center bg-emerald-50 p-2.5 rounded-2xl border-2 border-emerald-200">
              <h3 className="text-base sm:text-lg font-black text-emerald-950 uppercase">
                BÀI ÔN TẬP: SO SÁNH KÍCH THƯỚC (TO - NHỎ • CAO - THẤP • DÀI - NGẮN)
              </h3>
              <p className="text-xs text-stone-600 font-semibold mt-0.5">
                Rèn luyện khả năng quan sát và phân biệt độ chênh lệch kích thước
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm">
              
              {/* Task 1: To - Nho */}
              <div className="bg-white p-3.5 rounded-2xl border-2 border-stone-200">
                <div className="font-black text-rose-700 mb-2">
                  1. Bé hãy KHOANH TRÒN con vật TO HƠN:
                </div>
                <div className="flex items-center justify-around py-3 bg-amber-50 rounded-xl">
                  <div className="flex flex-col items-center">
                    <span className="text-6xl">🐘</span>
                    <span className="font-black text-amber-900 mt-1">Chú Voi</span>
                  </div>
                  <span className="text-xl font-bold text-stone-400">vs</span>
                  <div className="flex flex-col items-center">
                    <span className="text-3xl">🐭</span>
                    <span className="font-bold text-stone-600 mt-2">Chú Chuột</span>
                  </div>
                </div>
              </div>

              {/* Task 2: Cao - Thap */}
              <div className="bg-white p-3.5 rounded-2xl border-2 border-stone-200">
                <div className="font-black text-rose-700 mb-2">
                  2. Bé hãy KHOANH TRÒN bạn CAO HƠN:
                </div>
                <div className="flex items-end justify-around py-3 bg-sky-50 rounded-xl">
                  <div className="flex flex-col items-center">
                    <span className="text-6xl">🦒</span>
                    <span className="font-black text-sky-900 mt-1">Hươu cao cổ</span>
                  </div>
                  <span className="text-xl font-bold text-stone-400 mb-3">vs</span>
                  <div className="flex flex-col items-center">
                    <span className="text-3xl">🐇</span>
                    <span className="font-bold text-stone-600 mt-1">Thỏ trắng</span>
                  </div>
                </div>
              </div>

              {/* Task 3: Dai - Ngan */}
              <div className="bg-white p-3.5 rounded-2xl border-2 border-stone-200">
                <div className="font-black text-rose-700 mb-2">
                  3. Bé hãy ĐÁNH DẤU ✔ VÀO BẠN DÀI HƠN:
                </div>
                <div className="flex items-center justify-around py-3 bg-emerald-50 rounded-xl">
                  <div className="flex flex-col items-center">
                    <span className="text-5xl">🐍</span>
                    <span className="font-black text-emerald-900 mt-1">Chú Rắn xanh</span>
                  </div>
                  <span className="text-xl font-bold text-stone-400">vs</span>
                  <div className="flex flex-col items-center">
                    <span className="text-3xl">🐛</span>
                    <span className="font-bold text-stone-600 mt-1">Chú Sâu nhỏ</span>
                  </div>
                </div>
              </div>

              {/* Task 4: To - Nho hoa qua */}
              <div className="bg-white p-3.5 rounded-2xl border-2 border-stone-200">
                <div className="font-black text-rose-700 mb-2">
                  4. Bé hãy KHOANH TRÒN quả NHỎ HƠN:
                </div>
                <div className="flex items-center justify-around py-3 bg-rose-50 rounded-xl">
                  <div className="flex flex-col items-center">
                    <span className="text-5xl">🍉</span>
                    <span className="font-bold text-stone-700 mt-1">Quả Dưa Hấu</span>
                  </div>
                  <span className="text-xl font-bold text-stone-400">vs</span>
                  <div className="flex flex-col items-center">
                    <span className="text-3xl">🍓</span>
                    <span className="font-black text-rose-900 mt-1">Quả Dâu Tây</span>
                  </div>
                </div>
              </div>

            </div>

          </div>
        )}

        {/* ========================================================================= */}
        {/* SHEET 4: SẮP XẾP THEO QUY TẮC & MÀU SẮC */}
        {/* ========================================================================= */}
        {activeSheet === 4 && (
          <div className="space-y-4">
            
            <div className="text-center bg-rose-50 p-2.5 rounded-2xl border-2 border-rose-200">
              <h3 className="text-base sm:text-lg font-black text-rose-950 uppercase">
                BÀI ÔN TẬP: QUY TẮC SẮP XẾP XEN KẼ (A - B - A - B)
              </h3>
              <p className="text-xs text-stone-600 font-semibold mt-0.5">
                Bé phát hiện nhịp điệu lặp lại của hoa quả và các con vật
              </p>
            </div>

            {/* Task 1: Fruit train sequence */}
            <div className="bg-white p-3.5 rounded-2xl border-2 border-stone-200">
              <div className="text-xs sm:text-sm font-black text-rose-700 mb-3 flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-rose-500 text-white flex items-center justify-center text-xs">1</span>
                <span>Bài 1: Bé hãy KHOANH TRÒN vào quả còn thiếu trong chuỗi đoàn tàu hoa quả:</span>
              </div>

              {/* Train Row */}
              <div className="flex flex-wrap items-center justify-center gap-2 p-3 bg-amber-50 rounded-2xl border border-amber-200 my-2">
                <div className="p-2 rounded-xl bg-white border border-stone-200 text-3xl">🍎</div>
                <span className="font-bold text-stone-400">→</span>
                <div className="p-2 rounded-xl bg-white border border-stone-200 text-3xl">🍊</div>
                <span className="font-bold text-stone-400">→</span>
                <div className="p-2 rounded-xl bg-white border border-stone-200 text-3xl">🍎</div>
                <span className="font-bold text-stone-400">→</span>
                <div className="w-12 h-12 rounded-xl border-3 border-dashed border-rose-400 bg-rose-100 flex items-center justify-center text-xl font-black text-rose-700">
                  ?
                </div>
              </div>

              <div className="flex items-center justify-center gap-6 mt-3">
                <span className="text-xs font-bold text-stone-600">Lựa chọn:</span>
                <div className="flex items-center gap-2 border-2 border-dashed border-stone-300 p-2 rounded-xl">
                  <span className="text-3xl">🍊 Quả Cam</span>
                </div>
                <div className="flex items-center gap-2 border-2 border-dashed border-stone-300 p-2 rounded-xl">
                  <span className="text-3xl">🍌 Nải Chuối</span>
                </div>
              </div>
            </div>

            {/* Task 2: Vehicle sequence */}
            <div className="bg-white p-3.5 rounded-2xl border-2 border-stone-200">
              <div className="text-xs sm:text-sm font-black text-rose-700 mb-3 flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-rose-500 text-white flex items-center justify-center text-xs">2</span>
                <span>Bài 2: Chuỗi phương tiện: Ô tô - Máy bay - Ô tô - ...? Tiếp theo là gì nào:</span>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-2 p-3 bg-sky-50 rounded-2xl border border-sky-200 my-2">
                <div className="p-2 rounded-xl bg-white border border-stone-200 text-3xl">🚗</div>
                <span className="font-bold text-stone-400">→</span>
                <div className="p-2 rounded-xl bg-white border border-stone-200 text-3xl">✈️</div>
                <span className="font-bold text-stone-400">→</span>
                <div className="p-2 rounded-xl bg-white border border-stone-200 text-3xl">🚗</div>
                <span className="font-bold text-stone-400">→</span>
                <div className="w-12 h-12 rounded-xl border-3 border-dashed border-sky-400 bg-sky-100 flex items-center justify-center text-xl font-black text-sky-700">
                  ?
                </div>
              </div>

              <div className="flex items-center justify-center gap-6 mt-3">
                <span className="text-xs font-bold text-stone-600">Lựa chọn:</span>
                <div className="flex items-center gap-2 border-2 border-dashed border-stone-300 p-2 rounded-xl">
                  <span className="text-3xl">✈️ Máy bay</span>
                </div>
                <div className="flex items-center gap-2 border-2 border-dashed border-stone-300 p-2 rounded-xl">
                  <span className="text-3xl">🚢 Tàu thủy</span>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* ========================================================================= */}
        {/* SHEET 5: ĐỊNH HƯỚNG KHÔNG GIAN (TRÊN - DƯỚI, TRƯỚC - SAU, TRONG - NGOÀI) */}
        {/* ========================================================================= */}
        {activeSheet === 5 && (
          <div className="space-y-4">
            
            <div className="text-center bg-purple-50 p-2.5 rounded-2xl border-2 border-purple-200">
              <h3 className="text-base sm:text-lg font-black text-purple-950 uppercase">
                BÀI ÔN TẬP: ĐỊNH HƯỚNG KHÔNG GIAN ĐƠN GIẢN
              </h3>
              <p className="text-xs text-stone-600 font-semibold mt-0.5">
                Xác định vị trí Trên - Dưới, Trước - Sau, Bên Trong - Bên Ngoài
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs sm:text-sm">
              
              {/* Top / Bottom */}
              <div className="bg-white p-3.5 rounded-2xl border-2 border-stone-200 text-center">
                <div className="font-black text-rose-700 mb-2">
                  1. Bé hãy khoanh tròn chú chim ở PHÍA TRÊN cành cây:
                </div>
                <div className="bg-sky-50 p-3 rounded-xl flex flex-col items-center gap-2 my-2">
                  <div className="p-1 rounded-full border-2 border-dashed border-sky-400 text-4xl">🕊️</div>
                  <div className="w-full border-b-2 border-amber-500 my-1 font-bold text-[10px] text-amber-800">
                    🌿 Cành cây cao 🌿
                  </div>
                  <div className="text-3xl opacity-60">🐶</div>
                </div>
                <span className="text-[11px] font-bold text-stone-500">Chim ở Trên • Cún ở Dưới</span>
              </div>

              {/* In / Out */}
              <div className="bg-white p-3.5 rounded-2xl border-2 border-stone-200 text-center">
                <div className="font-black text-rose-700 mb-2">
                  2. Bé hãy tô màu chú mèo ở BÊN TRONG chiếc hộp:
                </div>
                <div className="bg-emerald-50 p-3 rounded-xl flex items-center justify-center gap-2 my-2">
                  <div className="relative flex items-center justify-center">
                    <span className="text-6xl">📦</span>
                    <span className="text-4xl absolute -top-1">🐱</span>
                  </div>
                </div>
                <span className="text-[11px] font-bold text-emerald-800 font-black">Mèo ở BÊN TRONG hộp</span>
              </div>

              {/* Front / Back */}
              <div className="bg-white p-3.5 rounded-2xl border-2 border-stone-200 text-center">
                <div className="font-black text-rose-700 mb-2">
                  3. Bé hãy đánh dấu ✔ bạn thỏ đứng PHÍA TRƯỚC cây nấm:
                </div>
                <div className="bg-rose-50 p-3 rounded-xl flex items-center justify-center gap-2 my-2">
                  <div className="flex items-center justify-center">
                    <span className="text-4xl opacity-50">🍄</span>
                    <span className="text-5xl -ml-4 z-10">🐰</span>
                  </div>
                </div>
                <span className="text-[11px] font-bold text-rose-800 font-black">Thỏ đứng PHÍA TRƯỚC</span>
              </div>

            </div>

          </div>
        )}

        {/* ========================================================================= */}
        {/* SHEET 6: GIẤY KHEN BÉ NGOAN TOÁN MẦM NON (BẢN IN SẮC NÉT KHỔ A4) */}
        {/* ========================================================================= */}
        {activeSheet === 6 && (
          <div className="bg-gradient-to-b from-amber-50 via-yellow-50 to-orange-50 p-6 sm:p-8 rounded-3xl border-8 border-double border-amber-400 text-center relative overflow-hidden">
            
            {/* Top Certificate Ribbon */}
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-red-600 via-rose-600 to-red-600 text-white font-black px-6 py-2 rounded-full shadow-md text-sm sm:text-base uppercase tracking-wider mb-4 border border-yellow-300">
              <span>🌟 GIẤY KHEN BÉ NGOAN HỌC TỐT 🌟</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-amber-950 uppercase tracking-wide">
              TRƯỜNG MẦM NON THẠCH THẤT 2
            </h2>
            <div className="text-base sm:text-lg font-black text-rose-600 mt-0.5">
              Lớp: 3 Tuổi C2
            </div>

            {/* Commendation Body */}
            <div className="my-6 max-w-xl mx-auto bg-white/90 p-5 rounded-2xl border-2 border-amber-300 shadow-sm">
              <p className="text-sm font-bold text-stone-600 mb-1">
                Ban Giám Hiệu & Cô Giáo Chủ Nhiệm Khen Tặng Bé:
              </p>
              
              <div className="text-2xl sm:text-3xl font-black text-blue-900 my-2 tracking-wide font-['Caveat',cursive]">
                {studentName ? studentName : 'Bé Yêu Lớp 3 Tuổi C2'}
              </div>

              <p className="text-xs sm:text-sm font-semibold text-stone-700 leading-relaxed">
                Đã chăm chỉ, thông minh và hoàn thành xuất sắc các nội dung ôn tập toán học:
                <br />
                <strong>Đếm số 1-5 • Hình khối mầm non • So sánh kích thước • Quy tắc & Không gian</strong>
              </p>

              <div className="mt-4 flex items-center justify-center gap-2 text-amber-500 text-2xl">
                ⭐⭐⭐⭐⭐
              </div>
            </div>

            {/* Signature Area */}
            <div className="flex items-center justify-between max-w-md mx-auto pt-2 text-xs sm:text-sm font-bold text-stone-700">
              <div className="text-left">
                <p className="text-stone-500">Năm học 2026 - 2027</p>
                <p className="text-stone-800 font-extrabold">Trường MN Thạch Thất 2</p>
                <p className="text-rose-600 font-black">Lớp 3 Tuổi C2</p>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-amber-400 shadow-sm p-0.5 bg-white flex-shrink-0">
                  <img
                    src={teacherAvatarPath}
                    alt="Cô giáo Nguyễn Thị Huyền"
                    className="w-full h-full object-cover rounded-xl"
                  />
                </div>
                <div className="text-center">
                  <p className="text-stone-500 italic text-[11px]">Giáo viên chủ nhiệm</p>
                  <div className="font-['Caveat',cursive] text-2xl font-black text-blue-700">
                    Nguyễn Thị Huyền
                  </div>
                  <p className="font-black text-emerald-900 text-xs">Cô Nguyễn Thị Huyền</p>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* ========================================================================= */}
        {/* SHEET FOOTER: ĐÁNH GIÁ CỦA CÔ HOẶC PHỤ HUYNH */}
        {/* ========================================================================= */}
        {activeSheet !== 6 && (
          <div className="mt-5 pt-3 border-t-2 border-amber-200 flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm font-bold text-stone-700">
            
            {/* 5-Star Grading */}
            <div className="flex items-center gap-1.5">
              <span className="text-amber-800 font-extrabold">⭐ Đánh giá của Cô / Bố mẹ:</span>
              <div className="flex text-amber-400 text-lg sm:text-xl">
                <span className="cursor-pointer hover:scale-125 transition-transform">⭐</span>
                <span className="cursor-pointer hover:scale-125 transition-transform">⭐</span>
                <span className="cursor-pointer hover:scale-125 transition-transform">⭐</span>
                <span className="cursor-pointer hover:scale-125 transition-transform">⭐</span>
                <span className="cursor-pointer hover:scale-125 transition-transform">⭐</span>
              </div>
            </div>

            {/* Praise line */}
            <div className="text-stone-500 italic">
              Lời nhận xét: <span className="border-b border-stone-400 border-dashed pb-0.5 inline-block min-w-[160px] text-stone-800">Bé học rất giỏi và ngoan ngoãn!</span>
            </div>

            {/* Teacher Signoff */}
            <div className="text-right">
              <span className="text-emerald-900 font-black">Cô giáo: </span>
              <strong className="text-blue-900">Nguyễn Thị Huyền</strong>
            </div>

          </div>
        )}

      </div>

      {/* Guide for Parents to Download as PDF (Hidden on print) */}
      <div className="no-print mt-4 bg-sky-50 p-4 rounded-3xl border-2 border-sky-200 text-center max-w-4xl mx-auto shadow-xs text-xs sm:text-sm text-sky-950">
        <p className="font-bold">
          💡 <strong>Mẹo cho Bố Mẹ:</strong> Bấm nút <strong>"In Phiếu Này (Khổ A4)"</strong> ở trên. Trong hộp thoại in của máy tính hoặc điện thoại, tại mục <em>Máy in (Destination)</em>, bố mẹ có thể chọn <strong>"Lưu dưới dạng PDF" (Save as PDF)</strong> để tải file phiếu bài tập về máy lưu trữ hoặc gửi qua Zalo nhé!
        </p>
      </div>

    </div>
  );
};
