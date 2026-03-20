export interface ChatMessage {
  id: string;
  role: 'user' | 'ai';
  content: string;
  timestamp: Date;
  isStreaming?: boolean;
}

export interface ChatRequest {
  question: string;
}

export interface ChatResponse {
  answer: string;
}
