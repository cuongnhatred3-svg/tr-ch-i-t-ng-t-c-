/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { TopicLesson } from './components/TopicLesson';
import { RabbitCarrotGame } from './components/RabbitCarrotGame';
import { ShapePuzzleGame } from './components/ShapePuzzleGame';
import { ShadowMatchGame } from './components/ShadowMatchGame';
import { ColorShapeGame } from './components/ColorShapeGame';
import { PatternTrainGame } from './components/PatternTrainGame';
import { SizeComparisonGame } from './components/SizeComparisonGame';
import { RewardsView } from './components/RewardsView';
import { ClassroomTvMode } from './components/ClassroomTvMode';
import { BasketAddGame } from './components/BasketAddGame';
import { MatchLineGame } from './components/MatchLineGame';
import { SplitCombineGame } from './components/SplitCombineGame';
import { PairFriendsGame } from './components/PairFriendsGame';
import { MeasureWormGame } from './components/MeasureWormGame';
import { DayTimeGame } from './components/DayTimeGame';
import { TeacherRiddleGame } from './components/TeacherRiddleGame';
import { CURRICULUM_QUESTIONS, INITIAL_STICKERS } from './data/mathCurriculum';
import { TopicId, Sticker } from './types';
import { soundManager } from './utils/soundEffects';
import { RotateCcw, Heart, School, User, Sparkles } from 'lucide-react';

export default function App() {
  const [currentView, setCurrentView] = useState<TopicId | 'dashboard'>('dashboard');
  
  // Progress states with localStorage fallback
  const [stars, setStars] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('mn_thachthat2_stars');
      return saved ? parseInt(saved, 10) : 0;
    } catch {
      return 0;
    }
  });

  const [carrots, setCarrots] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('mn_thachthat2_carrots');
      return saved ? parseInt(saved, 10) : 0;
    } catch {
      return 0;
    }
  });

  const [completedTopics, setCompletedTopics] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem('mn_thachthat2_completed');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const [stickers, setStickers] = useState<Sticker[]>(() => {
    return INITIAL_STICKERS;
  });

  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [speechEnabled, setSpeechEnabled] = useState<boolean>(true);

  // Sync to local storage
  useEffect(() => {
    try {
      localStorage.setItem('mn_thachthat2_stars', stars.toString());
      localStorage.setItem('mn_thachthat2_carrots', carrots.toString());
      localStorage.setItem('mn_thachthat2_completed', JSON.stringify(completedTopics));
    } catch {
      // ignore
    }
  }, [stars, carrots, completedTopics]);

  const handleAddStar = () => {
    setStars(prev => prev + 1);
  };

  const handleAddCarrot = () => {
    setCarrots(prev => prev + 1);
  };

  const handleTopicComplete = (topicId: TopicId) => {
    setCompletedTopics(prev => ({
      ...prev,
      [topicId]: true,
    }));
  };

  const handleToggleSound = () => {
    const nextState = !soundEnabled;
    setSoundEnabled(nextState);
    soundManager.enabled = nextState;
  };

  const handleToggleSpeech = () => {
    const nextState = !speechEnabled;
    setSpeechEnabled(nextState);
    soundManager.speechEnabled = nextState;
  };

  const handleResetProgress = () => {
    if (window.confirm('Bé hoặc Cô giáo có muốn làm mới lại toàn bộ điểm và bài học không?')) {
      setStars(0);
      setCarrots(0);
      setCompletedTopics({});
      try {
        localStorage.removeItem('mn_thachthat2_stars');
        localStorage.removeItem('mn_thachthat2_carrots');
        localStorage.removeItem('mn_thachthat2_completed');
      } catch {
        // ignore
      }
      soundManager.playClick();
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-['Baloo_2',sans-serif] text-stone-800">
      
      {/* Preschool App Header with Brand Info */}
      <Header
        stars={stars}
        carrots={carrots}
        soundEnabled={soundEnabled}
        speechEnabled={speechEnabled}
        onToggleSound={handleToggleSound}
        onToggleSpeech={handleToggleSpeech}
        onGoHome={() => setCurrentView('dashboard')}
        onOpenRewards={() => setCurrentView('rewards')}
      />

      {/* Main Interactive Screen Content */}
      <main className="flex-1 flex flex-col items-center justify-start w-full">
        {currentView === 'dashboard' && (
          <Dashboard
            onSelectTopic={(topicId) => setCurrentView(topicId)}
            onOpenClassTv={() => setCurrentView('class-tv' as TopicId)}
            stars={stars}
            carrots={carrots}
          />
        )}

        {currentView === ('class-tv' as TopicId) && (
          <ClassroomTvMode
            onBackToMenu={() => setCurrentView('dashboard')}
            onAddStar={handleAddStar}
          />
        )}

        {/* Trạm 1 & Bài học đếm số */}
        {(currentView === 'dem' || currentView === 'count') && (
          <TopicLesson
            topicId="count"
            questions={CURRICULUM_QUESTIONS.filter(q => q.topicId === 'count')}
            onAddStar={handleAddStar}
            onBackToMenu={() => setCurrentView('dashboard')}
            onTopicComplete={() => handleTopicComplete('dem')}
          />
        )}

        {/* Trạm 2: Giỏ quà đủ số */}
        {currentView === 'them' && (
          <BasketAddGame
            onAddStar={handleAddStar}
            onBackToMenu={() => setCurrentView('dashboard')}
            onCompleteGame={() => {
              handleTopicComplete('them');
              handleAddStar();
              handleAddStar();
            }}
          />
        )}

        {/* Trạm 3: Cầu nối số */}
        {currentView === 'noi' && (
          <MatchLineGame
            onAddStar={handleAddStar}
            onBackToMenu={() => setCurrentView('dashboard')}
            onCompleteGame={() => {
              handleTopicComplete('noi');
              handleAddStar();
              handleAddStar();
            }}
          />
        )}

        {/* Trạm 4: Bếp tách - gộp */}
        {currentView === 'tach-gop' && (
          <SplitCombineGame
            onAddStar={handleAddStar}
            onBackToMenu={() => setCurrentView('dashboard')}
            onCompleteGame={() => {
              handleTopicComplete('tach-gop');
              handleAddStar();
              handleAddStar();
            }}
          />
        )}

        {/* Trạm 5: So sánh kích thước (To - Nhỏ, Cao - Thấp, Dài - Ngắn) */}
        {(currentView === 'so-sanh' || currentView === 'size' || currentView === 'game-sizefun') && (
          <SizeComparisonGame
            onAddStar={handleAddStar}
            onBackToMenu={() => setCurrentView('dashboard')}
            onCompleteGame={() => {
              handleTopicComplete('so-sanh');
              handleAddStar();
              handleAddStar();
            }}
          />
        )}

        {/* Trạm 6: Đôi bạn thân */}
        {currentView === 'ghep-cap' && (
          <PairFriendsGame
            onAddStar={handleAddStar}
            onBackToMenu={() => setCurrentView('dashboard')}
            onCompleteGame={() => {
              handleTopicComplete('ghep-cap');
              handleAddStar();
              handleAddStar();
            }}
          />
        )}

        {/* Trạm 7: Ghép bóng với hình */}
        {currentView === 'game-shadow' && (
          <ShadowMatchGame
            onAddStar={handleAddStar}
            onBackToMenu={() => setCurrentView('dashboard')}
            onCompleteGame={() => {
              handleTopicComplete('game-shadow');
              handleAddStar();
              handleAddStar();
            }}
          />
        )}

        {/* Trạm 8: Chuỗi hạt quy tắc & Đoàn tàu */}
        {(currentView === 'quy-tac' || currentView === 'pattern' || currentView === 'game-train') && (
          <PatternTrainGame
            onAddStar={handleAddStar}
            onBackToMenu={() => setCurrentView('dashboard')}
            onCompleteGame={() => {
              handleTopicComplete('quy-tac');
              handleAddStar();
              handleAddStar();
            }}
          />
        )}

        {/* Trạm 9: Đo chú sâu */}
        {currentView === 'do' && (
          <MeasureWormGame
            onAddStar={handleAddStar}
            onBackToMenu={() => setCurrentView('dashboard')}
            onCompleteGame={() => {
              handleTopicComplete('do');
              handleAddStar();
              handleAddStar();
            }}
          />
        )}

        {/* Trạm 10: Xưởng hình khối & Màu sắc */}
        {(currentView === 'khoi' || currentView === 'shapes' || currentView === 'game-colorshape') && (
          <ColorShapeGame
            onAddStar={handleAddStar}
            onBackToMenu={() => setCurrentView('dashboard')}
            onCompleteGame={() => {
              handleTopicComplete('khoi');
              handleAddStar();
              handleAddStar();
            }}
          />
        )}

        {/* Trạm 11: Định hướng không gian (Gấu bông ở đâu?) */}
        {(currentView === 'vi-tri' || currentView === 'space') && (
          <TopicLesson
            topicId="space"
            questions={CURRICULUM_QUESTIONS.filter(q => q.topicId === 'space')}
            onAddStar={handleAddStar}
            onBackToMenu={() => setCurrentView('dashboard')}
            onTopicComplete={() => handleTopicComplete('vi-tri')}
          />
        )}

        {/* Trạm 12: Thời gian của bé */}
        {currentView === 'thoi-gian' && (
          <DayTimeGame
            onAddStar={handleAddStar}
            onBackToMenu={() => setCurrentView('dashboard')}
            onCompleteGame={() => {
              handleTopicComplete('thoi-gian');
              handleAddStar();
              handleAddStar();
            }}
          />
        )}

        {/* Trạm 13: Bé thỏ hái cà rốt */}
        {currentView === 'game-rabbit' && (
          <RabbitCarrotGame
            onAddStar={handleAddStar}
            onAddCarrot={handleAddCarrot}
            onBackToMenu={() => setCurrentView('dashboard')}
            onCompleteGame={() => {
              handleTopicComplete('game-rabbit');
              handleAddStar();
            }}
          />
        )}

        {/* Trạm 14: Câu đố của cô Huyền */}
        {currentView === 'cau-do' && (
          <TeacherRiddleGame
            onAddStar={handleAddStar}
            onBackToMenu={() => setCurrentView('dashboard')}
            onCompleteGame={() => {
              handleTopicComplete('cau-do');
              handleAddStar();
              handleAddStar();
            }}
          />
        )}

        {/* Trò chơi bổ sung: Ghép hình ngôi nhà */}
        {currentView === 'game-puzzle' && (
          <ShapePuzzleGame
            onAddStar={handleAddStar}
            onBackToMenu={() => setCurrentView('dashboard')}
            onCompleteGame={() => {
              handleTopicComplete('game-puzzle');
              handleAddStar();
              handleAddStar();
            }}
          />
        )}

        {/* Khen thưởng & Sticker Album */}
        {currentView === 'rewards' && (
          <RewardsView
            stars={stars}
            carrots={carrots}
            stickers={stickers}
            onBackToMenu={() => setCurrentView('dashboard')}
          />
        )}
      </main>

      {/* Cheerful Preschool Footer with Teacher and School Details */}
      <footer className="mt-auto bg-gradient-to-r from-amber-200 via-rose-200 to-emerald-200 border-t-4 border-amber-300 py-4 px-4 select-none">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3 text-center md:text-left text-xs sm:text-sm font-bold text-stone-800">
          
          <div className="flex flex-col gap-0.5">
            <div className="flex items-center justify-center md:justify-start gap-1.5 text-amber-950 font-black">
              <School className="w-4 h-4 text-amber-700" />
              <span>TRƯỜNG MẦM NON THẠCH THẤT 2</span>
              <span>•</span>
              <span className="text-rose-700 font-extrabold">LỚP: 3 TUỔI C2</span>
            </div>
            <div className="flex items-center justify-center md:justify-start gap-1.5 text-emerald-900 font-extrabold">
              <User className="w-4 h-4 text-emerald-700" />
              <span>Giáo viên phụ trách: <strong>Nguyễn Thị Huyền</strong></span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-stone-600 hidden sm:inline">
              Môi trường giáo dục mầm non an toàn, thân thiện và tràn ngập tình yêu thương! 💖
            </span>

            {/* Reset button for testing or new student */}
            <button
              onClick={handleResetProgress}
              className="flex items-center gap-1 bg-white/80 hover:bg-white text-stone-600 hover:text-rose-600 px-3 py-1 rounded-xl text-xs font-bold border border-stone-300 transition-all active:scale-95 shadow-xs"
              title="Đặt lại điểm số cho lượt chơi mới"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Làm mới điểm</span>
            </button>
          </div>

        </div>
      </footer>

    </div>
  );
}
