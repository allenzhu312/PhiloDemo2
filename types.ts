export interface Comment {
  id: string;
  author: string;
  text: string;
  timestamp: number;
}

export interface Philosopher {
  id: string;
  name: string;
  dates: string;
  school: string;
  shortBio: string;
  fullBio?: string;
  keyIdeas: string[];
  famousQuotes: string[];
  imageUrl: string;
  comments: Comment[];
}

export interface ChatMessage {
  role: 'user' | 'model';
  content: string;
}

export enum ViewState {
  GRID = 'GRID',
  DETAIL = 'DETAIL',
}