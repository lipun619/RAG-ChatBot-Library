export interface ChatConfig {
  apiUrl: string;
  title?: string;
  placeholder?: string;
  welcomeMessage?: string;
  suggestedQuestions?: string[];
  theme?: 'terminal' | 'light';
}
