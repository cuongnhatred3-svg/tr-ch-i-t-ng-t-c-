// Type definitions for the Preschool Math App

export type TopicId = 
  | 'dem' 
  | 'them' 
  | 'noi' 
  | 'tach-gop' 
  | 'so-sanh' 
  | 'ghep-cap' 
  | 'quy-tac' 
  | 'do' 
  | 'khoi' 
  | 'vi-tri' 
  | 'thoi-gian' 
  | 'cau-do' 
  | 'game-rabbit' 
  | 'game-puzzle' 
  | 'game-shadow' 
  | 'game-colorshape' 
  | 'game-train' 
  | 'game-sizefun' 
  | 'rewards'
  // Legacy aliases
  | 'count'
  | 'shapes'
  | 'size'
  | 'pattern'
  | 'space';

export interface QuestionOption {
  id: string | number;
  label: string;
  subLabel?: string;
  icon?: string;
  image?: string;
  color?: string;
  isCorrect: boolean;
}

export interface Question {
  id: string;
  topicId: TopicId;
  title: string;
  prompt: string;
  audioPrompt: string;
  visualType: 'count-items' | 'shape-identify' | 'size-compare' | 'pattern-complete' | 'spatial-position';
  items?: Array<{ id: string; emoji: string; name: string; size?: 'small' | 'large' }>;
  shapeData?: {
    shapeType: 'circle' | 'square' | 'triangle' | 'rectangle';
    realWorldName: string;
    description: string;
  };
  sizeData?: {
    attribute: 'to-nho' | 'dai-ngan' | 'cao-thap';
    promptSub: string;
    itemA: { id: string; name: string; emoji: string; dimension: 'to' | 'dai' | 'cao'; visualClass: string };
    itemB: { id: string; name: string; emoji: string; dimension: 'nho' | 'ngan' | 'thap'; visualClass: string };
    target: 'to' | 'nho' | 'dai' | 'ngan' | 'cao' | 'thap';
  };
  patternData?: {
    sequence: Array<{ id: string; emoji: string; name: string; color: string }>;
    missingIndex: number;
    options: Array<{ id: string; emoji: string; name: string; isCorrect: boolean }>;
  };
  spatialData?: {
    type: 'tren-duoi' | 'truoc-sau' | 'trai-phai' | 'trong-ngoai';
    sceneDescription: string;
    targetName: string;
    imageSvg?: string;
  };
  options: QuestionOption[];
  hint: string;
  congratsMessage: string;
}

export interface Sticker {
  id: string;
  name: string;
  emoji: string;
  description: string;
  unlockedAtStars: number;
  unlocked: boolean;
}

export interface UserProgress {
  stars: number;
  carrots: number;
  completedQuestions: Record<string, boolean>;
  gameRabbitHighscore: number;
  gamePuzzleCompleted: boolean;
  unlockedStickers: string[];
}
