import { Component, output, ViewEncapsulation } from '@angular/core';
import { bubbleAnimation } from '../../animations/chat.animations';

@Component({
  selector: 'ai-chat-bubble',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  styleUrl: './chat-bubble.component.scss',
  animations: [bubbleAnimation],
  templateUrl: './chat-bubble.component.html',
})
export class ChatBubbleComponent {
  toggle = output<void>();
}
