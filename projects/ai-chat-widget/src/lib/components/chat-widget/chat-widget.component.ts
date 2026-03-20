import {
  Component,
  input,
  signal,
  ViewEncapsulation,
  OnDestroy,
  viewChild,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { ChatMessage } from '../../models/message.model';
import { ChatService } from '../../services/chat.service';
import { ChatBubbleComponent } from '../chat-bubble/chat-bubble.component';
import { ChatWindowComponent } from '../chat-window/chat-window.component';

@Component({
  selector: 'ai-chat-widget',
  standalone: true,
  imports: [ChatBubbleComponent, ChatWindowComponent],
  providers: [ChatService],
  encapsulation: ViewEncapsulation.None,
  styleUrl: './chat-widget.component.scss',
  templateUrl: './chat-widget.component.html',
})
export class ChatWidgetComponent implements OnDestroy {
  // ── Public inputs (configurable by consumer) ──
  apiUrl = input.required<string>();
  title = input<string>('AI Assistant');
  placeholder = input<string>('Type a message...');
  welcomeMessage = input<string>(
    'Hello! I\u2019m your AI assistant. Ask me anything.'
  );
  suggestedQuestions = input<string[]>([]);

  // ── Internal state ──
  isOpen = signal(false);
  messages = signal<ChatMessage[]>([]);
  isLoading = signal(false);

  private chatWindow = viewChild(ChatWindowComponent);
  private streamSub: Subscription | null = null;

  constructor(private chatService: ChatService) {}

  ngOnDestroy(): void {
    this.streamSub?.unsubscribe();
  }

  openChat(): void {
    this.isOpen.set(true);
  }

  closeChat(): void {
    this.isOpen.set(false);
  }

  onMessageSent(text: string): void {
    // Add user message
    const userMsg: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content: text,
      timestamp: new Date(),
    };

    // Add placeholder AI message
    const aiMsg: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'ai',
      content: '',
      timestamp: new Date(),
      isStreaming: true,
    };

    this.messages.update((msgs) => [...msgs, userMsg, aiMsg]);
    this.isLoading.set(true);

    // Scroll after messages update
    setTimeout(() => this.chatWindow()?.scrollToBottom(), 0);

    // Start streaming
    this.streamSub?.unsubscribe();
    this.streamSub = this.chatService
      .sendMessage(this.apiUrl(), text)
      .subscribe({
        next: (chunk) => {
          this.messages.update((msgs) => {
            const updated = [...msgs];
            const idx = updated.findIndex((m) => m.id === aiMsg.id);
            if (idx !== -1) {
              updated[idx] = {
                ...updated[idx],
                content: updated[idx].content + chunk,
              };
            }
            return updated;
          });
          setTimeout(() => this.chatWindow()?.scrollToBottom(), 0);
        },
        error: (err) => {
          this.messages.update((msgs) => {
            const updated = [...msgs];
            const idx = updated.findIndex((m) => m.id === aiMsg.id);
            if (idx !== -1) {
              updated[idx] = {
                ...updated[idx],
                content: `Error: ${err.message}`,
                isStreaming: false,
              };
            }
            return updated;
          });
          this.isLoading.set(false);
        },
        complete: () => {
          this.messages.update((msgs) => {
            const updated = [...msgs];
            const idx = updated.findIndex((m) => m.id === aiMsg.id);
            if (idx !== -1) {
              updated[idx] = {
                ...updated[idx],
                isStreaming: false,
              };
            }
            return updated;
          });
          this.isLoading.set(false);
        },
      });
  }
}
