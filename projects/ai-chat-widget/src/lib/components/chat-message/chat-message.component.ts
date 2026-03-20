import { Component, input, ViewEncapsulation } from '@angular/core';
import { MarkdownComponent } from 'ngx-markdown';
import { ChatMessage } from '../../models/message.model';
import { messageAnimation } from '../../animations/chat.animations';

@Component({
  selector: 'ai-chat-message',
  standalone: true,
  imports: [MarkdownComponent],
  encapsulation: ViewEncapsulation.None,
  styleUrl: './chat-message.component.scss',
  animations: [messageAnimation],
  templateUrl: './chat-message.component.html',
})
export class ChatMessageComponent {
  message = input.required<ChatMessage>();
}
