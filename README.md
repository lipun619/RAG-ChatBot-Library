# RAG-ChatBot-Library

An Angular workspace containing **`@caplipun/ai-chat-widget`** — a floating AI chat bubble widget with a terminal-inspired dark theme — and a **demo application** to test it.

## Workspace Structure

```
RAG-ChatBot-Library/
├── angular.json              # Angular workspace config (library + demo)
├── package.json              # Root dependencies
├── tsconfig.json             # Base TypeScript config
├── mock-server.js            # Mock API server for local testing
├── projects/
│   ├── ai-chat-widget/       # 📦 The NPM library (@caplipun/ai-chat-widget)
│   │   ├── src/
│   │   │   ├── public-api.ts
│   │   │   └── lib/
│   │   │       ├── components/
│   │   │       │   ├── chat-widget/       # Root component (entry point)
│   │   │       │   ├── chat-window/       # Chat panel with header, messages, input
│   │   │       │   ├── chat-message/      # Individual message (markdown + cursor)
│   │   │       │   ├── chat-bubble/       # Floating trigger button
│   │   │       │   └── typing-indicator/  # "Thinking..." animation
│   │   │       ├── services/
│   │   │       │   └── chat.service.ts    # API communication + streaming
│   │   │       ├── models/
│   │   │       │   ├── message.model.ts   # ChatMessage, ChatRequest, ChatResponse
│   │   │       │   └── chat-config.model.ts
│   │   │       ├── animations/
│   │   │       │   └── chat.animations.ts
│   │   │       └── styles/
│   │   │           └── _variables.scss    # Theme tokens
│   │   ├── ng-package.json
│   │   └── package.json
│   └── demo/                 # 🖥️ Test application
│       └── src/
│           ├── app/
│           │   ├── app.component.ts
│           │   ├── app.component.html
│           │   └── app.config.ts
│           └── index.html
└── dist/                     # Build output (gitignored)
```

## Prerequisites

- **Node.js** ≥ 18
- **Angular CLI** 19.x (`npm install -g @angular/cli`)

## Getting Started

```bash
# Install dependencies
npm install

# Build the library
ng build ai-chat-widget

# Start the mock API server (in a separate terminal)
node mock-server.js            # Standard JSON responses
node mock-server.js --stream   # Streaming SSE responses

# Run the demo app
ng serve demo
```

Open `http://localhost:4200` — click the chat bubble in the bottom-right corner.

## Available Scripts

| Command | Description |
|---------|-------------|
| `ng build ai-chat-widget` | Build the library to `dist/ai-chat-widget/` |
| `ng build ai-chat-widget --watch` | Rebuild on file changes |
| `ng serve demo` | Start the demo app on port 4200 |
| `ng test ai-chat-widget` | Run library unit tests |
| `node mock-server.js` | Start mock API (JSON mode) on port 3000 |
| `node mock-server.js --stream` | Start mock API (SSE streaming mode) |

## Mock Server

The included `mock-server.js` is a zero-dependency Node.js server that simulates a chat API:

- **Endpoint:** `POST /api/chat`
- **Request body:** `{ "question": "..." }`
- **JSON mode:** returns `{ "answer": "..." }` after a 500ms delay
- **Streaming mode (`--stream`):** returns SSE chunks at 50ms/word, ending with `data: [DONE]`

Responds to keywords about technologies, experience, and projects.

## Library Public API

Exported from `@caplipun/ai-chat-widget`:

| Export | Type | Description |
|--------|------|-------------|
| `ChatWidgetComponent` | Component | The main `<ai-chat-widget>` component |
| `ChatService` | Service | API communication service (for advanced use) |
| `ChatMessage` | Interface | `{ id, role, content, timestamp, isStreaming? }` |
| `ChatRequest` | Interface | `{ question: string }` |
| `ChatResponse` | Interface | `{ answer: string }` |
| `ChatConfig` | Interface | Configuration shape for the widget |

## Publishing to NPM

```bash
# Build production library
ng build ai-chat-widget

# Navigate to dist
cd dist/ai-chat-widget

# Publish (--access public required for scoped packages)
npm publish --access public
```

## License

MIT
