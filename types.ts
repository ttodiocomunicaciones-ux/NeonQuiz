export type ViewState = 'HOME' | 'LOGIN' | 'REGISTER' | 'THEME_SELECT' | 'LEVEL_SELECT' | 'GAME' | 'RESULT' | 'PROFILE' | 'CHAT';

export interface Question {
  id: string;
  text: string;
  options: string[];
  correctIndex: number;
}

export interface Theme {
  id: string;
  name: string;
  icon: string;
  color: string;
  description: string;
  isHardcore?: boolean; // New flag for premium content
}

export interface GameProgress {
  [themeId: string]: number; // Value is the highest unlocked level (1-6)
}

export interface UserStats {
  totalScore: number;
  totalQuestionsAnswered: number;
  totalCorrect: number;
  totalWrong: number;
  totalTimePlayedSeconds: number;
  gamesPlayed: number;
  highestIQ: number;
}

export interface UserProfile {
  uid?: string; // Firebase UID
  name: string;
  email?: string;
  isPremium: boolean;
  avatarId: number;
  createdAt?: any;
}

export interface GameSession {
  themeId: string;
  level: number; // 1-6
  score: number;
  correctCount: number;
  questions: Question[];
  currentQuestionIndex: number;
  lives: number;
  timeLeft: number;
  isPaused: boolean;
}

export interface ChatMessage {
  id: string;
  uid: string;
  name: string;
  text: string;
  isPremium: boolean;
  avatarId: number;
  createdAt: any; // Firestore Timestamp
}