import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { 
  ChevronLeft, 
  Volume2, 
  ArrowRight, 
  RotateCcw, 
  Sparkles, 
  Tv, 
  Users, 
  Star, 
  Hand, 
  CheckCircle2, 
  Smile, 
  Heart,
  HelpCircle
} from 'lucide-react';
import { soundManager } from '../utils/soundEffects';

interface ClassroomTvModeProps {
  onBackToMenu: () => void;
  onAddStar: () => void;
}

export type TvActivityType = 'drag-drop' | 'interactive-choice';

export interface TvActivity {
  id: string;
  type: TvActivityType;
  title: string;
  category: 'Số lượng' | 'Hình khối' | 'Kích thước' | 'Quy tắc' | 'Không gian' | 'Đôi bạn thân';
  prompt: string;
  audioPrompt: string;
  hint: string;
  congratsText: string;
  // Drag & drop specific configuration
  dragConfig?: {
    targetZoneLabel: string;
    targetZoneIcon: string;
    requiredCount?: number; // for counting
    items: Array<{
      id: string;
      label: string;
      emoji: string;
      isTarget?: boolean;
    }>;
  };
  // Interactive choice specific configuration
  choiceConfig?: {
    visualDisplay: React.ReactNode;
    options: Array<{
      id: string;
      label: string;
      icon: string;
      isCorrect: boolean;
      bgClass: string;
    }>;
  };
}

export const CLASSROOM_ACTIVITIES: TvActivity[] = [
  // 1. KÉO THẢ SỐ LƯỢNG 1
  {
    id: 'tv-1',
    type: 'drag-drop',
    category: 'Số lượng',
    title: 'Kéo 1 quả táo vào giỏ quà',
    prompt: 'Cô mời một bạn lên bảng kéo đúng 1 QUẢ TÁO ĐỎ vào giỏ quà nhé!',
    audioPrompt: 'Cô mời một bạn lên bảng kéo đúng một quả táo đỏ vào giỏ quà nhé!',
    hint: 'Bé chạm hoặc kéo một quả táo đỏ chín mọng thả vào trong giỏ quà!',
    congratsText: 'Bé giỏi quá! Bé đã kéo đúng 1 quả táo vào giỏ rồi!',
    dragConfig: {
      targetZoneLabel: 'Giỏ quà của Cô Huyền',
      targetZoneIcon: '🧺',
      requiredCount: 1,
      items: [
        { id: 'apple-1', label: 'Quả táo đỏ', emoji: '🍎', isTarget: true },
        { id: 'apple-2', label: 'Quả táo đỏ', emoji: '🍎', isTarget: true },
        { id: 'apple-3', label: 'Quả táo đỏ', emoji: '🍎', isTarget: true },
      ],
    },
  },

  // 2. CHẠM CHỌN SỐ LƯỢNG 2
  {
    id: 'tv-2',
    type: 'interactive-choice',
    category: 'Số lượng',
    title: 'Đếm số lượng 2 chú cún',
    prompt: 'Bé hãy đếm xem trên màn hình có MẤY CHÚ CÚN CON đáng yêu?',
    audioPrompt: 'Bé hãy đếm xem trên màn hình có mấy chú cún con đáng yêu?',
    hint: 'Bé chạm tay đếm cùng cả lớp: Một chú cún, hai chú cún con!',
    congratsText: 'Chính xác! Có đúng 2 chú cún con, cả lớp cùng vỗ tay khen bạn nào!',
    choiceConfig: {
      visualDisplay: (
        <div className="flex items-center justify-center gap-6 sm:gap-10 py-2">
          <div className="flex flex-col items-center animate-bounce-slow">
            <span className="text-7xl sm:text-8xl filter drop-shadow-md">🐶</span>
            <span className="text-xs sm:text-sm font-extrabold text-amber-300 mt-2 bg-blue-900/90 px-3 py-1 rounded-full">
              Chú cún số 1
            </span>
          </div>
          <div className="flex flex-col items-center animate-bounce-slow">
            <span className="text-7xl sm:text-8xl filter drop-shadow-md">🐶</span>
            <span className="text-xs sm:text-sm font-extrabold text-amber-300 mt-2 bg-blue-900/90 px-3 py-1 rounded-full">
              Chú cún số 2
            </span>
          </div>
        </div>
      ),
      options: [
        { id: 'opt-1', label: '1 Chú cún', icon: '1️⃣', isCorrect: false, bgClass: 'from-amber-500 to-orange-500' },
        { id: 'opt-2', label: '2 Chú cún', icon: '2️⃣', isCorrect: true, bgClass: 'from-emerald-500 to-teal-500' },
        { id: 'opt-3', label: '3 Chú cún', icon: '3️⃣', isCorrect: false, bgClass: 'from-rose-500 to-pink-500' },
      ],
    },
  },

  // 3. KÉO THẢ SỐ LƯỢNG 3
  {
    id: 'tv-3',
    type: 'drag-drop',
    category: 'Số lượng',
    title: 'Thả 3 chú vịt vàng xuống hồ nước',
    prompt: 'Bé hãy kéo 3 CHÚ VỊT VÀNG xuống hồ nước mát để bơi lội nào!',
    audioPrompt: 'Bé hãy kéo ba chú vịt vàng xuống hồ nước mát để bơi lội nào!',
    hint: 'Bé đếm từng chú vịt khi kéo xuống hồ: Một, hai, ba chú vịt!',
    congratsText: 'Hoan hô bé! Đủ 3 chú vịt vàng đang quác quác bơi lội vui vẻ!',
    dragConfig: {
      targetZoneLabel: 'Hồ nước xanh mát',
      targetZoneIcon: '🌊',
      requiredCount: 3,
      items: [
        { id: 'duck-1', label: 'Chú vịt vàng', emoji: '🦆', isTarget: true },
        { id: 'duck-2', label: 'Chú vịt vàng', emoji: '🦆', isTarget: true },
        { id: 'duck-3', label: 'Chú vịt vàng', emoji: '🦆', isTarget: true },
        { id: 'duck-4', label: 'Chú vịt vàng', emoji: '🦆', isTarget: true },
      ],
    },
  },

  // 4. KÉO THẢ HÌNH KHỐI - HÌNH TRÒN
  {
    id: 'tv-4',
    type: 'drag-drop',
    category: 'Hình khối',
    title: 'Kéo bánh xe hình tròn vào ô tô',
    prompt: 'Bé hãy kéo BÁNH XE HÌNH TRÒN lăn bon bon lắp vào ô tô nhé!',
    audioPrompt: 'Bé hãy kéo bánh xe hình tròn lăn bon bon lắp vào ô tô nhé!',
    hint: 'Hình tròn cong tròn xoe, không có góc cạnh, lăn tròn trên đường!',
    congratsText: 'Xuất sắc! Bánh xe HÌNH TRÒN đã giúp chiếc ô tô chạy bon bon!',
    dragConfig: {
      targetZoneLabel: 'Khung bánh xe tròn 🚗',
      targetZoneIcon: '⭕',
      requiredCount: 1,
      items: [
        { id: 'shape-wheel', label: 'Bánh xe tròn', emoji: '🚲', isTarget: true },
        { id: 'shape-box', label: 'Hộp quà vuông', emoji: '🎁', isTarget: false },
        { id: 'shape-roof', label: 'Mái nhà nhọn', emoji: '🔺', isTarget: false },
      ],
    },
  },

  // 5. CHẠM CHỌN HÌNH VUÔNG
  {
    id: 'tv-5',
    type: 'interactive-choice',
    category: 'Hình khối',
    title: 'Nhận biết Hình Vuông',
    prompt: 'Đồ vật nào dưới đây có dạng HÌNH VUÔNG có 4 cạnh đều nhau?',
    audioPrompt: 'Đồ vật nào dưới đây có dạng hình vuông có bốn cạnh đều nhau?',
    hint: 'Hộp quà sinh nhật xinh xắn có 4 cạnh dài bằng nhau ngay ngắn!',
    congratsText: 'Rất thông minh! Hộp quà sinh nhật có mặt HÌNH VUÔNG vắn!',
    choiceConfig: {
      visualDisplay: (
        <div className="flex flex-col items-center justify-center py-2">
          <div className="w-24 h-24 sm:w-28 sm:h-28 bg-amber-400 border-4 border-amber-200 rounded-2xl flex items-center justify-center text-4xl shadow-lg">
            🟨
          </div>
          <span className="text-base sm:text-lg font-black text-amber-200 mt-2">
            Hình Vuông có 4 cạnh bằng nhau
          </span>
        </div>
      ),
      options: [
        { id: 'opt-ball', label: 'Quả bóng tròn', icon: '⚽', isCorrect: false, bgClass: 'from-sky-500 to-blue-500' },
        { id: 'opt-gift', label: 'Hộp quà sinh nhật', icon: '🎁', isCorrect: true, bgClass: 'from-amber-500 to-yellow-500' },
        { id: 'opt-pizza', label: 'Miếng bánh pizza', icon: '🍕', isCorrect: false, bgClass: 'from-rose-500 to-pink-500' },
      ],
    },
  },

  // 6. KÉO THẢ HÌNH TAM GIÁC
  {
    id: 'tv-6',
    type: 'drag-drop',
    category: 'Hình khối',
    title: 'Ghép mái nhà hình tam giác',
    prompt: 'Bé hãy kéo MÁI NHÀ HÌNH TAM GIÁC màu đỏ lên nóc ngôi nhà nhé!',
    audioPrompt: 'Bé hãy kéo mái nhà hình tam giác màu đỏ lên nóc ngôi nhà nhé!',
    hint: 'Hình tam giác có 3 góc nhọn xinh xắn như chiếc mái nhà che nắng mưa!',
    congratsText: 'Hoan hô bé! Ngôi nhà đã có chiếc MÁI NHÀ TAM GIÁC đỏ tươi tuyệt đẹp!',
    dragConfig: {
      targetZoneLabel: 'Nóc ngôi nhà mầm non 🏠',
      targetZoneIcon: '🏡',
      requiredCount: 1,
      items: [
        { id: 'triangle-roof', label: 'Mái nhà tam giác', emoji: '🔺', isTarget: true },
        { id: 'square-window', label: 'Viên gạch vuông', emoji: '🟨', isTarget: false },
        { id: 'circle-clock', label: 'Đĩa tròn', emoji: '⚪', isTarget: false },
      ],
    },
  },

  // 7. KÉO THẢ TO - NHỎ
  {
    id: 'tv-7',
    type: 'drag-drop',
    category: 'Kích thước',
    title: 'Kéo con vật TO HƠN vào bục số 1',
    prompt: 'Bé hãy kéo bạn nào TO HƠN (chú Voi khổng lồ) lên bục số 1 nhé!',
    audioPrompt: 'Bé hãy kéo bạn nào to hơn, chú voi khổng lồ, lên bục số một nhé!',
    hint: 'Chú voi có thân hình to lớn khổng lồ và đôi tai to như chiếc quạt!',
    congratsText: 'Bé giỏi quá! Chú Voi TO HƠN nhiều so với chú Chuột nhỏ bé!',
    dragConfig: {
      targetZoneLabel: 'Bục danh dự số 1 🥇',
      targetZoneIcon: '🏆',
      requiredCount: 1,
      items: [
        { id: 'size-elephant', label: 'Chú Voi (To hơn)', emoji: '🐘', isTarget: true },
        { id: 'size-mouse', label: 'Chú Chuột (Nhỏ hơn)', emoji: '🐭', isTarget: false },
      ],
    },
  },

  // 8. CHẠM CHỌN CAO - THẤP
  {
    id: 'tv-8',
    type: 'interactive-choice',
    category: 'Kích thước',
    title: 'Ai cao hơn: Hươu cao cổ hay Thỏ con?',
    prompt: 'Bé hãy nhìn hai bạn và chọn xem ai CAO HƠN nào!',
    audioPrompt: 'Bé hãy nhìn hai bạn và chọn xem ai cao hơn nào!',
    hint: 'Bạn Hươu có cái cổ dài vươn cao tít lên tận ngọn cây ăn lá!',
    congratsText: 'Bé thật tinh mắt! Hươu cao cổ CAO HƠN chú thỏ trắng thấp bé!',
    choiceConfig: {
      visualDisplay: (
        <div className="flex items-end justify-center gap-10 py-2">
          <div className="flex flex-col items-center">
            <span className="text-8xl filter drop-shadow-md">🦒</span>
            <span className="text-sm font-extrabold text-amber-300 mt-1">Hươu cao cổ</span>
          </div>
          <span className="text-3xl font-black text-yellow-400 mb-6">vs</span>
          <div className="flex flex-col items-center">
            <span className="text-5xl filter drop-shadow-md">🐇</span>
            <span className="text-sm font-extrabold text-blue-200 mt-1">Thỏ trắng</span>
          </div>
        </div>
      ),
      options: [
        { id: 'opt-giraffe', label: 'Hươu cao cổ (Cao hơn)', icon: '🦒', isCorrect: true, bgClass: 'from-amber-500 to-orange-500' },
        { id: 'opt-rabbit', label: 'Thỏ trắng (Thấp hơn)', icon: '🐇', isCorrect: false, bgClass: 'from-rose-500 to-pink-500' },
      ],
    },
  },

  // 9. KÉO THẢ ĐÔI BẠN THÂN (CHO THỎ ĂN)
  {
    id: 'tv-9',
    type: 'drag-drop',
    category: 'Đôi bạn thân',
    title: 'Cho Thỏ Mimi ăn cà rốt',
    prompt: 'Bạn Thỏ trắng đang đói bụng, bé hãy kéo CỦ CÀ RỐT cho Thỏ ăn nào!',
    audioPrompt: 'Bạn thỏ trắng đang đói bụng, bé hãy kéo củ cà rốt cho thỏ ăn nào!',
    hint: 'Thỏ thích gặm cà rốt giòn ngọt màu cam tươi!',
    congratsText: 'Bé đáng yêu quá! Thỏ Mimi đã ăn củ cà rốt no căng bụng rồi!',
    dragConfig: {
      targetZoneLabel: 'Đĩa ăn của Bạn Thỏ 🐰',
      targetZoneIcon: '🍽️',
      requiredCount: 1,
      items: [
        { id: 'food-carrot', label: 'Củ cà rốt tươi', emoji: '🥕', isTarget: true },
        { id: 'food-bone', label: 'Khúc xương', emoji: '🦴', isTarget: false },
        { id: 'food-fish', label: 'Con cá nhỏ', emoji: '🐟', isTarget: false },
      ],
    },
  },

  // 10. KÉO THẢ ĐOÀN TÀU QUY TẮC
  {
    id: 'tv-10',
    type: 'drag-drop',
    category: 'Quy tắc',
    title: 'Xếp tiếp đoàn tàu hoa quả',
    prompt: 'Đoàn tàu xếp: 🍎 Táo - 🍊 Cam - 🍎 Táo. Bé kéo quả tiếp theo vào toa tàu nhé!',
    audioPrompt: 'Đoàn tàu xếp: Táo, Cam, Táo. Bé kéo quả tiếp theo vào toa tàu nhé!',
    hint: 'Quy luật lặp lại: Táo rồi Cam, Táo rồi lại đến Cam!',
    congratsText: 'Bé nhận biết quy luật quá siêu! Tiếp theo chính là QUẢ CAM VÀNG!',
    dragConfig: {
      targetZoneLabel: 'Toa tàu còn thiếu [ ? ] 🚂',
      targetZoneIcon: '❓',
      requiredCount: 1,
      items: [
        { id: 'rule-orange', label: 'Quả cam vàng', emoji: '🍊', isTarget: true },
        { id: 'rule-melon', label: 'Quả dưa hấu', emoji: '🍉', isTarget: false },
        { id: 'rule-banana', label: 'Nải chuối', emoji: '🍌', isTarget: false },
      ],
    },
  },

  // 11. KÉO THẢ KHÔNG GIAN (PHÍA TRÊN CÀNH CÂY)
  {
    id: 'tv-11',
    type: 'drag-drop',
    category: 'Không gian',
    title: 'Chú chim ở phía trên cành cây',
    prompt: 'Bé hãy kéo CHÚ CHIM bay lên đậu ở PHÍA TRÊN cành cây cao nhé!',
    audioPrompt: 'Bé hãy kéo chú chim bay lên đậu ở phía trên cành cây nhé!',
    hint: 'Phía trên là hướng ngọn cây và bầu trời xanh cao!',
    congratsText: 'Tuyệt đỉnh! Chú chim sẻ đang hót líu lo ở PHÍA TRÊN cành cây cao!',
    dragConfig: {
      targetZoneLabel: 'Phía TRÊN cành cây cao 🌳',
      targetZoneIcon: '⬆️',
      requiredCount: 1,
      items: [
        { id: 'bird-sparrow', label: 'Chú chim sẻ', emoji: '🕊️', isTarget: true },
      ],
    },
  },

  // 12. CHẠM CHỌN KHÔNG GIAN (BÊN TRONG CHIẾC HỘP)
  {
    id: 'tv-12',
    type: 'interactive-choice',
    category: 'Không gian',
    title: 'Mèo con ở bên trong chiếc hộp',
    prompt: 'Chú mèo con cuộn tròn đang nằm ở BÊN TRONG hay BÊN NGOÀI chiếc hộp?',
    audioPrompt: 'Chú mèo con cuộn tròn đang nằm ở bên trong hay bên ngoài chiếc hộp?',
    hint: 'Bé nhìn xem chú mèo chui trọn người vào lòng chiếc hộp ấm áp!',
    congratsText: 'Bé quan sát rất chuẩn! Chú mèo con đang ngủ ở BÊN TRONG chiếc hộp!',
    choiceConfig: {
      visualDisplay: (
        <div className="flex items-center justify-center gap-4 py-3">
          <div className="relative flex items-center justify-center">
            <span className="text-8xl filter drop-shadow-md">📦</span>
            <span className="text-6xl absolute -top-1 animate-bounce-slow">🐱</span>
          </div>
          <div className="text-left text-blue-100">
            <div className="text-lg font-black text-yellow-300">Chú mèo con</div>
            <div className="text-sm font-semibold">đang cuộn tròn ngủ say</div>
          </div>
        </div>
      ),
      options: [
        { id: 'opt-inside', label: 'BÊN TRONG chiếc hộp', icon: '📦', isCorrect: true, bgClass: 'from-emerald-500 to-teal-500' },
        { id: 'opt-outside', label: 'BÊN NGOÀI chiếc hộp', icon: '🚪', isCorrect: false, bgClass: 'from-blue-500 to-indigo-500' },
      ],
    },
  },

  // 13. KÉO THẢ 1 VÀ NHIỀU
  {
    id: 'tv-13',
    type: 'drag-drop',
    category: 'Số lượng',
    title: 'Kéo NHIỀU bông hoa vào bình',
    prompt: 'Bình hoa đang trống, bé hãy kéo NHIỀU BÔNG HOA (3 bông) cắm vào bình hoa lớp mình nhé!',
    audioPrompt: 'Bình hoa đang trống, bé hãy kéo nhiều bông hoa, ba bông, cắm vào bình hoa lớp mình nhé!',
    hint: '1 bình hoa và có NHIỀU bông hoa thơm ngát cắm bên trong!',
    congratsText: 'Đẹp quá! Lọ hoa của Lớp 3 Tuổi C2 đã có NHIỀU bông hoa rực rỡ!',
    dragConfig: {
      targetZoneLabel: 'Lọ hoa tươi Lớp 3 Tuổi C2',
      targetZoneIcon: '🏺',
      requiredCount: 3,
      items: [
        { id: 'flower-1', label: 'Bông hoa hồng', emoji: '🌸', isTarget: true },
        { id: 'flower-2', label: 'Bông hoa cúc', emoji: '🌻', isTarget: true },
        { id: 'flower-3', label: 'Bông hoa sen', emoji: '🪷', isTarget: true },
        { id: 'flower-4', label: 'Bông hoa tulip', emoji: '🌷', isTarget: true },
      ],
    },
  },

  // 14. CHẠM CHỌN DÀI - NGẮN
  {
    id: 'tv-14',
    type: 'interactive-choice',
    category: 'Kích thước',
    title: 'So sánh Dài - Ngắn',
    prompt: 'Bé hãy chọn bạn nào DÀI HƠN: Chú Rắn xanh dài hay Chú Sâu nhỏ ngắn?',
    audioPrompt: 'Bé hãy chọn bạn nào dài hơn: Chú rắn xanh dài hay Chú sâu nhỏ ngắn?',
    hint: 'Chú Rắn uốn lượn có thân mình rất dài đó bé!',
    congratsText: 'Hoan hô bé! Chú Rắn xanh thân mình DÀI HƠN chú sâu nhỏ ngắn!',
    choiceConfig: {
      visualDisplay: (
        <div className="flex items-center justify-center gap-8 py-2">
          <div className="flex flex-col items-center">
            <span className="text-7xl sm:text-8xl filter drop-shadow-md">🐍</span>
            <span className="text-sm font-extrabold text-emerald-300 mt-2">Chú Rắn Xanh</span>
          </div>
          <span className="text-3xl font-black text-yellow-400">vs</span>
          <div className="flex flex-col items-center">
            <span className="text-5xl filter drop-shadow-md">🐛</span>
            <span className="text-sm font-extrabold text-lime-300 mt-2">Chú Sâu Nhỏ</span>
          </div>
        </div>
      ),
      options: [
        { id: 'opt-snake', label: 'Chú Rắn (Dài hơn)', icon: '🐍', isCorrect: true, bgClass: 'from-emerald-500 to-teal-500' },
        { id: 'opt-caterpillar', label: 'Chú Sâu (Ngắn hơn)', icon: '🐛', isCorrect: false, bgClass: 'from-lime-600 to-emerald-600' },
      ],
    },
  },
];

export const ClassroomTvMode: React.FC<ClassroomTvModeProps> = ({
  onBackToMenu,
  onAddStar,
}) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [placedItems, setPlacedItems] = useState<string[]>([]);
  const [selectedDraggable, setSelectedDraggable] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [wrongShakeId, setWrongShakeId] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<'all' | 'drag' | 'choice'>('all');

  const filteredActivities = CLASSROOM_ACTIVITIES.filter(act => {
    if (activeFilter === 'drag') return act.type === 'drag-drop';
    if (activeFilter === 'choice') return act.type === 'interactive-choice';
    return true;
  });

  const activity = filteredActivities[currentIdx] || CLASSROOM_ACTIVITIES[0];

  // Auto speak question when activity loads
  useEffect(() => {
    setPlacedItems([]);
    setSelectedDraggable(null);
    setIsSuccess(false);
    setShowHint(false);
    setWrongShakeId(null);

    const timer = setTimeout(() => {
      soundManager.speakVietnamese(
        `Cô Huyền mời cả lớp cùng chú ý lên bảng nhé: ${activity.audioPrompt}`
      );
    }, 450);

    return () => clearTimeout(timer);
  }, [currentIdx, activeFilter]);

  const handleSpeakQuestion = () => {
    soundManager.playClick();
    soundManager.speakVietnamese(activity.audioPrompt);
  };

  const triggerSuccessPraise = (congratsMsg: string) => {
    setIsSuccess(true);
    soundManager.playSuccess();
    soundManager.playApplause();
    onAddStar();

    confetti({
      particleCount: 120,
      spread: 90,
      origin: { y: 0.5 },
    });

    soundManager.speakVietnamese(congratsMsg);
  };

  // Whole class cheer button
  const handleClassCheer = () => {
    soundManager.playApplause();
    soundManager.playSuccess();
    confetti({
      particleCount: 150,
      spread: 100,
      origin: { y: 0.5 },
    });
    soundManager.speakVietnamese(
      'Cả lớp hoan hô bạn nào! Bé trả lời rất chính xác, cô Huyền khen cả lớp 3 Tuổi C2!'
    );
  };

  // Drag and Drop Logic: supports both standard drag and touch-to-select -> touch-to-drop
  const handleItemClick = (itemId: string) => {
    if (isSuccess) return;
    soundManager.playClick();
    if (selectedDraggable === itemId) {
      setSelectedDraggable(null);
    } else {
      setSelectedDraggable(itemId);
      soundManager.speakVietnamese('Bé hãy chạm vào ô đích để thả vào nhé!');
    }
  };

  const handleDropIntoTarget = (droppedItemId?: string) => {
    if (isSuccess || !activity.dragConfig) return;
    const itemIdToPlace = droppedItemId || selectedDraggable;
    if (!itemIdToPlace) return;

    const item = activity.dragConfig.items.find(i => i.id === itemIdToPlace);
    if (!item) return;

    if (item.isTarget === false) {
      // Wrong item
      soundManager.playWrong();
      setWrongShakeId(itemIdToPlace);
      setTimeout(() => setWrongShakeId(null), 800);
      soundManager.speakVietnamese('Chưa chính xác rồi, bé hãy quan sát kỹ và chọn lại nhé!');
      setSelectedDraggable(null);
      return;
    }

    // Correct item placed
    soundManager.playCorrect();
    const newPlaced = [...placedItems, itemIdToPlace];
    setPlacedItems(newPlaced);
    setSelectedDraggable(null);

    const required = activity.dragConfig.requiredCount || 1;
    if (newPlaced.length >= required) {
      triggerSuccessPraise(activity.congratsText);
    }
  };

  // Interactive Choice Logic
  const handleSelectChoice = (option: { id: string; label: string; isCorrect: boolean }) => {
    if (isSuccess) return;
    soundManager.playClick();

    if (option.isCorrect) {
      triggerSuccessPraise(activity.congratsText);
    } else {
      soundManager.playWrong();
      setWrongShakeId(option.id);
      setTimeout(() => setWrongShakeId(null), 800);
      soundManager.speakVietnamese('Chưa đúng rồi, bé hãy quan sát lại và chọn lại nhé!');
    }
  };

  const handleResetCurrent = () => {
    soundManager.playClick();
    setPlacedItems([]);
    setSelectedDraggable(null);
    setIsSuccess(false);
    setShowHint(false);
    setWrongShakeId(null);
    soundManager.speakVietnamese('Chúng mình cùng làm lại lượt này nhé!');
  };

  const handleNext = () => {
    soundManager.playClick();
    if (currentIdx < filteredActivities.length - 1) {
      setCurrentIdx(prev => prev + 1);
    } else {
      setCurrentIdx(0);
    }
  };

  const handlePrev = () => {
    soundManager.playClick();
    if (currentIdx > 0) {
      setCurrentIdx(prev => prev - 1);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-3 sm:px-6 py-4 select-none">
      
      {/* Top TV Header Bar */}
      <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
        <button
          onClick={() => {
            soundManager.playClick();
            onBackToMenu();
          }}
          className="flex items-center gap-1.5 bg-white hover:bg-stone-50 text-stone-700 font-black px-4 py-2 rounded-2xl shadow-sm border border-stone-300 text-sm active:scale-95 transition-all"
        >
          <ChevronLeft className="w-5 h-5 text-rose-500" />
          <span>Về trang chủ</span>
        </button>

        {/* Filter Tabs for Smartboard TV */}
        <div className="flex items-center bg-white p-1 rounded-2xl border border-stone-200 shadow-xs gap-1 text-xs font-black">
          <button
            onClick={() => {
              setActiveFilter('all');
              setCurrentIdx(0);
            }}
            className={`px-3 py-1.5 rounded-xl transition-all ${
              activeFilter === 'all'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-stone-600 hover:bg-stone-100'
            }`}
          >
            Tất cả ({CLASSROOM_ACTIVITIES.length})
          </button>
          <button
            onClick={() => {
              setActiveFilter('drag');
              setCurrentIdx(0);
            }}
            className={`px-3 py-1.5 rounded-xl flex items-center gap-1 transition-all ${
              activeFilter === 'drag'
                ? 'bg-orange-500 text-white shadow-xs'
                : 'text-stone-600 hover:bg-stone-100'
            }`}
          >
            <Hand className="w-3.5 h-3.5" />
            <span>Kéo thả bé tương tác</span>
          </button>
          <button
            onClick={() => {
              setActiveFilter('choice');
              setCurrentIdx(0);
            }}
            className={`px-3 py-1.5 rounded-xl flex items-center gap-1 transition-all ${
              activeFilter === 'choice'
                ? 'bg-purple-600 text-white shadow-xs'
                : 'text-stone-600 hover:bg-stone-100'
            }`}
          >
            <span>Chạm chọn trên TV</span>
          </button>
        </div>

        <div className="text-xs sm:text-sm font-black bg-white px-3.5 py-1.5 rounded-2xl border border-stone-200 text-blue-950 flex items-center gap-1.5">
          <Tv className="w-4 h-4 text-blue-600" />
          <span>Bài {currentIdx + 1} / {filteredActivities.length}</span>
        </div>
      </div>

      {/* Main Jumbo TV Smartboard Card */}
      <div className="bg-gradient-to-b from-blue-950 via-indigo-950 to-slate-950 text-white rounded-3xl p-4 sm:p-8 shadow-2xl border-4 border-blue-400 relative overflow-hidden text-center mb-4">
        
        {/* Decorative corner status lights */}
        <div className="absolute top-3 left-4 flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-400 animate-pulse" />
          <div className="w-3 h-3 rounded-full bg-yellow-400 animate-pulse" />
          <div className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse" />
        </div>

        {/* Activity Category Badge */}
        <div className="inline-flex items-center gap-2 bg-blue-800/80 text-yellow-300 px-4 py-1.5 rounded-full text-xs sm:text-sm font-black mb-3 border border-blue-600 shadow-xs">
          <span>✨</span>
          <span>CHỦ ĐỀ: {activity.category.toUpperCase()} • LỚP 3 TUỔI C2</span>
          {activity.type === 'drag-drop' ? (
            <span className="bg-orange-500 text-white px-2 py-0.5 rounded-full text-[10px] font-black uppercase">
              🖐️ Kéo thả
            </span>
          ) : (
            <span className="bg-purple-500 text-white px-2 py-0.5 rounded-full text-[10px] font-black uppercase">
              👆 Chạm chọn
            </span>
          )}
        </div>

        {/* Question Prompt */}
        <h2 className="text-xl sm:text-3xl lg:text-4xl font-black text-yellow-300 drop-shadow-md mb-4 max-w-3xl mx-auto leading-snug">
          {activity.prompt}
        </h2>

        {/* Interactive Play Canvas Area */}
        <div className="bg-white/10 backdrop-blur-md rounded-3xl p-4 sm:p-6 max-w-3xl mx-auto border-2 border-white/20 shadow-inner min-h-[260px] flex flex-col items-center justify-center relative">
          
          {/* ================= MODE 1: DRAG & DROP INTERACTION ================= */}
          {activity.type === 'drag-drop' && activity.dragConfig && (
            <div className="w-full flex flex-col items-center gap-5">
              
              {/* Target Drop Zone */}
              <div
                onClick={() => handleDropIntoTarget()}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  const droppedId = e.dataTransfer.getData('text/plain');
                  handleDropIntoTarget(droppedId);
                }}
                className={`w-full max-w-md p-4 sm:p-5 rounded-3xl border-4 border-dashed transition-all cursor-pointer flex flex-col items-center justify-center relative ${
                  isSuccess
                    ? 'bg-emerald-500/40 border-yellow-300 scale-105'
                    : selectedDraggable
                    ? 'bg-amber-400/30 border-yellow-300 animate-pulse scale-102'
                    : 'bg-white/15 border-white/40 hover:bg-white/20'
                }`}
              >
                <div className="text-5xl sm:text-6xl mb-1 filter drop-shadow-md">
                  {activity.dragConfig.targetZoneIcon}
                </div>
                <div className="text-base sm:text-lg font-black text-yellow-200">
                  {activity.dragConfig.targetZoneLabel}
                </div>

                {/* Placed items inside target zone */}
                <div className="flex flex-wrap items-center justify-center gap-3 mt-3 min-h-[44px]">
                  {placedItems.length === 0 ? (
                    <span className="text-xs sm:text-sm font-bold text-white/70 italic">
                      {selectedDraggable
                        ? '👉 Chạm vào đây để thả vào!'
                        : 'Bé kéo hoặc chạm đồ vật thả vào đây nhé!'}
                    </span>
                  ) : (
                    placedItems.map((pId, idx) => {
                      const item = activity.dragConfig?.items.find(i => i.id === pId);
                      return (
                        <div
                          key={idx}
                          className="w-12 h-12 sm:w-14 sm:h-14 bg-white/90 rounded-2xl flex items-center justify-center text-3xl shadow-md border-2 border-yellow-300 animate-bounce-slow"
                        >
                          {item?.emoji}
                        </div>
                      );
                    })
                  )}
                </div>

                {/* Counter progress if requiredCount > 1 */}
                {(activity.dragConfig.requiredCount || 1) > 1 && (
                  <div className="mt-2 text-xs font-black bg-blue-900/90 text-yellow-300 px-3 py-1 rounded-full border border-blue-700">
                    Đã có: {placedItems.length} / {activity.dragConfig.requiredCount}
                  </div>
                )}
              </div>

              {/* Source Draggable Items */}
              <div className="w-full">
                <div className="text-xs font-bold text-blue-200 mb-2">
                  👇 Bé chạm vào đồ vật để kéo/chọn:
                </div>
                <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
                  {activity.dragConfig.items.map((item) => {
                    const isPlaced = placedItems.includes(item.id);
                    const isSelected = selectedDraggable === item.id;
                    const isShaking = wrongShakeId === item.id;

                    if (isPlaced) {
                      return (
                        <div
                          key={item.id}
                          className="w-16 h-20 sm:w-20 sm:h-24 rounded-2xl bg-white/10 border border-white/20 flex flex-col items-center justify-center opacity-40 cursor-not-allowed"
                        >
                          <span className="text-3xl filter grayscale">{item.emoji}</span>
                          <span className="text-[10px] text-white/50 mt-1">Đã dùng</span>
                        </div>
                      );
                    }

                    return (
                      <div
                        key={item.id}
                        draggable
                        onDragStart={(e) => {
                          e.dataTransfer.setData('text/plain', item.id);
                        }}
                        onClick={() => handleItemClick(item.id)}
                        className={`w-16 h-20 sm:w-20 sm:h-24 rounded-2xl flex flex-col items-center justify-center p-2 cursor-pointer transition-all active:scale-95 shadow-md border-3 select-none ${
                          isShaking
                            ? 'bg-rose-500/80 border-rose-300 animate-wiggle'
                            : isSelected
                            ? 'bg-yellow-400 text-stone-900 border-white scale-110 shadow-xl animate-bounce-slow'
                            : 'bg-white/90 hover:bg-white text-stone-900 border-yellow-400 hover:scale-105'
                        }`}
                      >
                        <span className="text-3xl sm:text-4xl filter drop-shadow-xs">
                          {item.emoji}
                        </span>
                        <span className="text-[10px] sm:text-[11px] font-black text-center mt-1 leading-tight line-clamp-1">
                          {item.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>
          )}

          {/* ================= MODE 2: INTERACTIVE CHOICE TOUCH CARDS ================= */}
          {activity.type === 'interactive-choice' && activity.choiceConfig && (
            <div className="w-full flex flex-col items-center gap-5">
              
              {/* Visual Display */}
              <div className="w-full">
                {activity.choiceConfig.visualDisplay}
              </div>

              {/* Jumbo Touch Cards for Smartboard TV */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 w-full max-w-2xl">
                {activity.choiceConfig.options.map((opt) => {
                  const isCorrect = opt.isCorrect;
                  const isShaking = wrongShakeId === opt.id;

                  return (
                    <button
                      key={opt.id}
                      onClick={() => handleSelectChoice(opt)}
                      className={`p-4 sm:p-5 rounded-2xl font-black text-lg sm:text-xl border-4 transition-all flex items-center justify-center gap-3 shadow-lg active:scale-95 ${
                        isShaking
                          ? 'bg-rose-500 text-white border-rose-300 animate-wiggle'
                          : isSuccess && isCorrect
                          ? 'bg-emerald-500 text-white border-yellow-300 scale-105 shadow-2xl animate-pulse'
                          : `bg-gradient-to-r ${opt.bgClass} text-white border-white/60 hover:scale-103 hover:border-white`
                      }`}
                    >
                      <span className="text-3xl sm:text-4xl filter drop-shadow-xs">{opt.icon}</span>
                      <span>{opt.label}</span>
                    </button>
                  );
                })}
              </div>

            </div>
          )}

          {/* Success Banner Overlay */}
          {isSuccess && (
            <div className="mt-4 inline-flex items-center gap-2 bg-emerald-500 text-white font-black px-5 py-2 rounded-full border-2 border-yellow-300 shadow-lg text-sm sm:text-base animate-bounce-slow">
              <Sparkles className="w-5 h-5 text-yellow-300" />
              <span>{activity.congratsText}</span>
            </div>
          )}

          {/* Teacher Hint Dropdown */}
          {showHint && (
            <div className="mt-3 bg-amber-400 text-amber-950 px-4 py-2 rounded-2xl text-xs sm:text-sm font-bold border border-amber-300 shadow-md animate-fade-in flex items-center gap-2">
              <HelpCircle className="w-4 h-4 flex-shrink-0" />
              <span>💡 {activity.hint}</span>
            </div>
          )}

        </div>

      </div>

      {/* Classroom TV Controls for Teacher Nguyen Thi Huyen */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 shadow-lg border-2 border-stone-200 flex flex-wrap items-center justify-between gap-3">
        
        {/* Quick Teacher Actions */}
        <div className="flex flex-wrap items-center gap-2">
          
          {/* Read aloud button */}
          <button
            onClick={handleSpeakQuestion}
            className="flex items-center gap-1.5 bg-amber-400 hover:bg-amber-500 text-amber-950 font-black px-4 py-2.5 rounded-2xl shadow-sm text-xs sm:text-sm active:scale-95 transition-all"
            title="Cô đọc to câu hỏi cho cả lớp"
          >
            <Volume2 className="w-4 h-4" />
            <span>Cô đọc to</span>
          </button>

          {/* Cheer Button */}
          <button
            onClick={handleClassCheer}
            className="flex items-center gap-1.5 bg-rose-500 hover:bg-rose-600 text-white font-black px-4 py-2.5 rounded-2xl shadow-sm text-xs sm:text-sm active:scale-95 transition-all"
            title="Cả lớp vỗ tay khen ngợi"
          >
            <span>👏 Cả lớp hoan hô!</span>
          </button>

          {/* Hint button */}
          <button
            onClick={() => {
              soundManager.playClick();
              setShowHint(!showHint);
              soundManager.speakVietnamese(`Cô Huyền gợi ý cho bé nè: ${activity.hint}`);
            }}
            className="flex items-center gap-1.5 bg-blue-100 hover:bg-blue-200 text-blue-900 font-black px-3.5 py-2.5 rounded-2xl shadow-xs text-xs sm:text-sm active:scale-95 transition-all"
            title="Gợi ý của cô Huyền"
          >
            <HelpCircle className="w-4 h-4 text-blue-600" />
            <span>Gợi ý</span>
          </button>

          {/* Reset current question */}
          <button
            onClick={handleResetCurrent}
            className="flex items-center gap-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold px-3 py-2.5 rounded-2xl shadow-xs text-xs active:scale-95 transition-all"
            title="Làm lại câu này cho bạn khác lên bảng"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Làm lại</span>
          </button>

        </div>

        {/* Navigation Next / Prev */}
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrev}
            disabled={currentIdx === 0}
            className="p-2.5 rounded-2xl border border-stone-300 font-bold disabled:opacity-40 hover:bg-stone-100 active:scale-95 transition-all"
            title="Câu trước"
          >
            <ChevronLeft className="w-5 h-5 text-stone-700" />
          </button>

          <button
            onClick={handleNext}
            className="flex items-center gap-1.5 bg-emerald-500 hover:bg-emerald-600 text-white font-black px-5 py-2.5 rounded-2xl shadow-md text-xs sm:text-sm active:scale-95 transition-all"
          >
            <span>Bài tiếp theo</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>

    </div>
  );
};
