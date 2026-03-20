# @lipun/ai-chat-widget

A floating AI chat bubble widget for Angular applications with a minimal, terminal-inspired dark theme.

![Angular](https://img.shields.io/badge/Angular-19-red)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)
![License](https://img.shields.io/badge/License-MIT-green)

## Features

- 🔮 **Floating chat bubble** fixed to bottom-right corner
- 💬 **Chat window panel** with header, messages, input, and send button
- 📝 **Markdown rendering** for AI responses (via ngx-markdown)
- 🎨 **Code syntax highlighting** (via Prism.js)
- ⚡ **Streaming support** — real-time typewriter effect for AI responses
- 📱 **Fully responsive** — desktop panel + mobile bottom sheet
- 🎭 **Smooth animations** — open/close panel, message appearance
- 💡 **Suggested starter questions** — configurable starter prompts
- 🖥️ **Terminal-inspired theme** — black background, monospace font, minimal design
- 🔍 **Expand/collapse** — resize the chat panel on desktop
- ♿ **Accessible** — ARIA labels, keyboard navigation, focus management

## Installation

```bash
npm install @lipun/ai-chat-widget ngx-markdown marked prismjs
```

### Peer Dependencies

| Package | Version |
|---------|---------|
| `@angular/core` | `^19.0.0` |
| `@angular/common` | `^19.0.0` |
| `@angular/animations` | `^19.0.0` |
| `@angular/forms` | `^19.0.0` |
| `rxjs` | `^7.0.0` |
| `ngx-markdown` | `^19.0.0` |
| `marked` | `^15.0.0` |
| `prismjs` | `^1.29.0` |

## Setup

### 1. Configure App Providers

In your `app.config.ts`:

```typescript
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideMarkdown } from 'ngx-markdown';

export const appConfig: ApplicationConfig = {
  providers: [
    // ... your other providers
    provideAnimations(),
    provideMarkdown(),
  ],
};
```

### 2. Add Prism.js Theme

Add the Prism.js theme CSS to your `angular.json` styles array:

```json
{
  "styles": [
    "node_modules/prismjs/themes/prism-okaidia.css",
    "src/styles.css"
  ]
}
```

### 3. Load Monospace Font (Recommended)

Add JetBrains Mono to your `index.html`:

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&display=swap" rel="stylesheet">
```

## Usage

```typescript
import { Component } from '@angular/core';
import { ChatWidgetComponent } from '@lipun/ai-chat-widget';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ChatWidgetComponent],
  template: `
    <ai-chat-widget
      apiUrl="https://api.example.com/chat"
      title="Ask Lipun AI"
      placeholder="Ask about my experience..."
      welcomeMessage="Hello! Ask me anything about Lipun."
      [suggestedQuestions]="['What technologies do you use?', 'Tell me about your experience']"
    />
  `,
})
export class AppComponent {}
```

## Configuration Inputs

| Input | Type | Default | Description |
|-------|------|---------|-------------|
| `apiUrl` | `string` | **required** | Backend API endpoint URL |
| `title` | `string` | `'AI Assistant'` | Chat window header title |
| `placeholder` | `string` | `'Ask a question...'` | Input field placeholder text |
| `welcomeMessage` | `string` | `'Hello! How can I help you?'` | Initial welcome message |
| `suggestedQuestions` | `string[]` | `[]` | Starter question chips shown before first message |

## API Contract

The widget sends `POST` requests to the configured `apiUrl`.

### Request

```json
POST /chat
Content-Type: application/json

{
  "question": "What technologies does Lipun use?"
}
```

### Standard Response (JSON)

```json
Content-Type: application/json

{
  "answer": "Lipun works with .NET, Angular, SQL Server, and Python..."
}
```

### Streaming Response (SSE)

The widget also supports Server-Sent Events for real-time streaming:

```
Content-Type: text/event-stream

data: {"answer": "Lipun "}
data: {"answer": "works "}
data: {"answer": "with "}
data: [DONE]
```

Each `data:` line contains a JSON object with an `answer` field containing the next text chunk. The stream ends with `data: [DONE]`.

## Design Theme

| Element | Value |
|---------|-------|
| Background | `#000000` |
| Primary text | `#ffffff` |
| Secondary text | `#aaaaaa` |
| Borders | `#2a2a2a` |
| Font | JetBrains Mono / Fira Code / IBM Plex Mono |

## Responsive Behavior

| Viewport | Behavior |
|----------|----------|
| Desktop (≥ 640px) | 380×540px panel (expand button toggles to 520×680px) |
| Mobile (< 640px) | Full-width bottom sheet (85vh height) with backdrop |

## Building from Source

```bash
# Clone and install
git clone <repository-url>
cd ai-chat-workspace
npm install

# Build the library
ng build ai-chat-widget

# Run the demo app
ng serve demo

# Start mock API server (in another terminal)
node mock-server.js           # Standard JSON responses
node mock-server.js --stream  # Streaming SSE responses
```

## Publishing to NPM

```bash
# Build production library
ng build ai-chat-widget

# Navigate to dist
cd dist/ai-chat-widget

# Login to NPM (if not already)
npm login

# Publish (--access public required for scoped packages)
npm publish --access public
```

## License

MIT
