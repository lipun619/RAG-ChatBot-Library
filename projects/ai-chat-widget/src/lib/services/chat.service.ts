import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { ChatRequest, ChatResponse } from '../models/message.model';

@Injectable()
export class ChatService {

  /**
   * Sends a question to the backend API and returns an Observable that emits
   * partial content chunks as they stream in. If the backend returns a standard
   * JSON response (non-streaming), the full answer is emitted as a single chunk.
   *
   * @param apiUrl  The backend endpoint URL
   * @param question  The user's question
   * @returns Observable<string> emitting content chunks, completing when done
   */
  sendMessage(apiUrl: string, question: string): Observable<string> {
    const subject = new Subject<string>();

    this.fetchStream(apiUrl, question, subject);

    return subject.asObservable();
  }

  private async fetchStream(
    apiUrl: string,
    question: string,
    subject: Subject<string>
  ): Promise<void> {
    try {
      const request: ChatRequest = { question };

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'text/event-stream, application/json',
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const contentType = response.headers.get('Content-Type') || '';

      // ── Standard JSON response (non-streaming) ──
      if (contentType.includes('application/json')) {
        const data: ChatResponse = await response.json();
        subject.next(data.answer);
        subject.complete();
        return;
      }

      // ── Streaming response (SSE or chunked text) ──
      if (!response.body) {
        throw new Error('ReadableStream not supported by this browser.');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder('utf-8');
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();

        if (done) {
          // Flush any remaining buffer
          if (buffer.trim()) {
            const parsed = this.parseChunk(buffer);
            if (parsed) {
              subject.next(parsed);
            }
          }
          subject.complete();
          break;
        }

        buffer += decoder.decode(value, { stream: true });

        // Process complete lines from the buffer
        const lines = buffer.split('\n');
        // Keep the last (possibly incomplete) line in the buffer
        buffer = lines.pop() || '';

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed || trimmed === '') continue;

          const parsed = this.parseChunk(trimmed);
          if (parsed) {
            subject.next(parsed);
          }
        }
      }
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'An unexpected error occurred.';
      subject.error(new Error(message));
    }
  }

  /**
   * Parses a single chunk line from the stream.
   * Supports:
   *   - SSE format: "data: {...}"
   *   - Raw JSON: '{"answer": "..."}'
   *   - Plain text
   */
  private parseChunk(chunk: string): string | null {
    // SSE format: "data: ..."
    if (chunk.startsWith('data:')) {
      const data = chunk.slice(5).trim();

      // SSE stream done signal
      if (data === '[DONE]') {
        return null;
      }

      try {
        const parsed = JSON.parse(data);
        return parsed.answer || parsed.content || parsed.text || data;
      } catch {
        // Not JSON — return as plain text
        return data;
      }
    }

    // Raw JSON line
    if (chunk.startsWith('{')) {
      try {
        const parsed = JSON.parse(chunk);
        return parsed.answer || parsed.content || parsed.text || null;
      } catch {
        return chunk;
      }
    }

    // Plain text chunk
    return chunk;
  }
}
