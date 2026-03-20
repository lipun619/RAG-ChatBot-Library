import { Component } from '@angular/core';
import { ChatWidgetComponent } from '@lipun/ai-chat-widget';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ChatWidgetComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  technologies = [
    '.NET', 'Angular', 'TypeScript', 'C#', 'SQL Server',
    'Python', 'Azure', 'Docker', 'Git', 'REST APIs',
  ];

  suggestedQuestions = [
    'What technologies does Lipun use?',
    'Tell me about his experience',
    'What projects has he worked on?',
  ];
}
