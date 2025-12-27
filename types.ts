
export enum ThoughtCategory {
  TRAUMA = 'TRAUMA',
  TODO = 'TODO',
  CREATIVE = 'CREATIVE',
  OTHER = 'OTHER',
  UNCATEGORIZED = 'UNCATEGORIZED'
}

export type MoodType = 'sunny' | 'rainy' | 'cloudy' | 'windy' | 'stormy' | 'misty';

export interface BookRecommendation {
  title: string;
  author: string;
  reason: string;
}

export interface Thought {
  id: string;
  content: string;
  timestamp: number;
  category: ThoughtCategory;
  aiAdvice?: string;
  books?: BookRecommendation[];
  isCompleted?: boolean;
  tags?: string[];
  sentiment?: string; 
  mood?: MoodType; // New: Emotional weather
}

export interface AIClassification {
  category: ThoughtCategory;
  advice?: string;
  books?: BookRecommendation[];
  tags?: string[];
  suggestedTaskTitle?: string;
  sentiment?: string; 
  refinedTask?: string;
}
