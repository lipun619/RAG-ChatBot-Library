import {
  Component,
  input,
  output,
  signal,
  ViewEncapsulation,
  ElementRef,
  viewChild,
  AfterViewChecked,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ChatMessage } from '../../models/message.model';
import { ChatMessageComponent } from '../chat-message/chat-message.component';
import { TypingIndicatorComponent } from '../typing-indicator/typing-indicator.component';
import { chatWindowAnimation } from '../../animations/chat.animations';

@Component({
  selector: 'ai-chat-window',
  standalone: true,
  imports: [FormsModule, ChatMessageComponent, TypingIndicatorComponent],
  encapsulation: ViewEncapsulation.None,
  styleUrl: './chat-window.component.scss',
  animations: [chatWindowAnimation],
  templateUrl: './chat-window.component.html',
})
export class ChatWindowComponent implements AfterViewChecked {
  // Inputs
  title = input<string>('AI Assistant');
  placeholder = input<string>('Type a message...');
  welcomeMessage = input<string>(
    'Hello! I\u2019m your AI assistant. Ask me anything.'
  );
  suggestedQuestions = input<string[]>([]);
  messages = input.required<ChatMessage[]>();
  isLoading = input<boolean>(false);

  // Outputs
  close = output<void>();
  messageSent = output<string>();

  // Local state
  userInput = '';
  isExpanded = signal(false);

  toggleExpand(): void {
    this.isExpanded.update((v) => !v);
  }

  // Auto-scroll
  private messagesContainer = viewChild<ElementRef>('messagesContainer');
  private shouldScroll = false;

  ngAfterViewChecked(): void {
    if (this.shouldScroll) {
      this.scrollToBottom();
      this.shouldScroll = false;
    }
  }

  send(): void {
    const text = this.userInput.trim();
    if (!text) return;
    this.messageSent.emit(text);
    this.userInput = '';
    this.shouldScroll = true;
  }

  sendSuggestion(question: string): void {
    this.messageSent.emit(question);
    this.shouldScroll = true;
  }

  scrollToBottom(): void {
    const el = this.messagesContainer()?.nativeElement;
    if (el) {
      el.scrollTop = el.scrollHeight;
    }
  }
}
