export type Stage = 'Discover' | 'Learn' | 'Practice' | 'Demonstrate' | 'Master' | 'Expand';

export interface QuizQuestion {
  id: string;
  prompt: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  hint: string;
  visualEmoji?: string;
}

export interface SongLyricLine {
  text: string;
  timeSec: number;
}

export interface MusicalNote {
  pitch: string; // e.g., 'C4', 'E4', 'G4', 'C5'
  duration: number; // in seconds
  timeOffset: number; // in seconds from start
}

export interface Song {
  id: string;
  title: string;
  artist: string;
  subjectId: string;
  durationSeconds: number;
  tempoBpm: number;
  mood: string;
  lyrics: SongLyricLine[];
  notes: MusicalNote[];
  albumArtColor: string;
  emoji: string;
  description: string;
  isFavorite?: boolean;
}

export interface SkillNode {
  id: string;
  title: string;
  stage: Stage;
  status: 'locked' | 'available' | 'in_progress' | 'mastered';
  description: string;
  icon: string;
  prerequisiteId?: string;
}

export interface Lesson {
  id: string;
  subjectId: string;
  title: string;
  stage: Stage;
  ageRecommendation: string;
  shortDesc: string;
  conceptIntro: string;
  educationalTip: string;
  song: Song;
  miniGameId?: string;
  questions: QuizQuestion[];
  starsReward: number;
}

export interface Subject {
  id: string;
  name: string;
  tagline: string;
  colorGradient: string;
  textColor: string;
  borderColor: string;
  badgeBg: string;
  icon: string;
  description: string;
  lessons: Lesson[];
  playlistName: string;
  skills: SkillNode[];
}

export interface MiniGame {
  id: string;
  title: string;
  type: 'matching' | 'rhythm' | 'memory' | 'sorting' | 'creative_lab';
  subjectId: string;
  difficulty: 'easy' | 'medium' | 'hard';
  instructions: string;
  gameData: any;
}

export interface Badge {
  id: string;
  title: string;
  category: string;
  description: string;
  icon: string;
  unlockedAt?: string;
  starsRequired?: number;
}

export interface Goal {
  id: string;
  title: string;
  target: number;
  current: number;
  unit: string;
  completed: boolean;
  isDaily: boolean;
  parentCreated?: boolean;
}

export interface MascotOutfit {
  hat?: 'crown' | 'headphones' | 'wizard' | 'flower' | 'none';
  glasses?: 'star_shades' | 'round_specs' | 'cool_sunglasses' | 'none';
  accessory?: 'gold_medal' | 'cape' | 'wand' | 'sparkles' | 'none';
}

export interface LearnerProfile {
  id: string;
  anonymousId: string;
  name: string;
  age: number;
  gradeLevel: string;
  avatarSeed: string;
  avatarEmoji: string;
  interests: string[];
  stars: number;
  streakDays: number;
  favoriteSongIds: string[];
  unlockedItems: string[];
  outfit: MascotOutfit;
  completedLessonIds: string[];
  completedGameIds: string[];
  masteredSkillIds: string[];
  goals: Goal[];
  timeSpentMinutes: number;
  soundEnabled: boolean;
  narrationVoiceEnabled: boolean;
  difficultyMode: 'easy' | 'normal' | 'challenge';
}

export interface AnalyticsSummary {
  totalEvents: number;
  totalSessions: number;
  uniqueLearners: number;
  subjectCounts: Record<string, number>;
  songPlays: Record<string, number>;
  gameStats: Record<string, { attempts: number; completions: number; hints: number }>;
  lessonCompletionRate: number;
  recentEvents: any[];
  googleSheetsConnected: boolean;
}
