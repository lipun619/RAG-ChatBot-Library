/*
 * Public API Surface of @lipun/ai-chat-widget
 */

// Main component (primary public API)
export { ChatWidgetComponent } from './lib/components/chat-widget/chat-widget.component';

// Models (for consumers who need the types)
export type { ChatMessage, ChatRequest, ChatResponse } from './lib/models/message.model';
export type { ChatConfig } from './lib/models/chat-config.model';

// Service (for advanced usage / testing)
export { ChatService } from './lib/services/chat.service';
