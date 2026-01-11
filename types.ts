
export interface NavItem {
  id: string;
  label: string;
  icon: string;
}

export interface Message {
  role: 'user' | 'model' | 'system';
  text: string;
  timestamp: Date;
}

export interface ResumeAnalysis {
  score: number;
  strengths: string[];
  weaknesses: string[];
  suggestions: string[];
}

export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  salary: string;
  type: string;
  posted: string;
}
