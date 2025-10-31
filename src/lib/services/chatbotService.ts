import { API_ENDPOINTS } from '../config/api';
import { authService } from './authService';

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp?: string;
}

export interface ChatRequest {
  question: string;
  sessionId?: string;
  userId?: number;
  conversationHistory?: ChatMessage[];
  context?: {
    customerId?: number | string; // Allow both number and string
    currentPage?: string;
    metadata?: Record<string, any>;
  };
}

export interface ChatResponse {
  answer: string;
  sessionId: string;
  timestamp: string;
  confidence?: number;
  sources?: Array<{
    title: string;
    content: string;
    relevance: number;
  }>;
  suggestedActions?: Array<{
    label: string;
    action: string;
  }>;
}

export interface ChatStreamChunk {
  content: string;
  sessionId: string;
  chunkIndex: number;
  isComplete: boolean;
  timestamp: string;
}

export interface ChatHistory {
  id: number;
  sessionId: string;
  userId: number;
  question: string;
  answer: string;
  timestamp: string;
  confidence?: number;
}

class ChatbotService {
  private baseUrl: string;
  private sessionId: string | null = null;

  constructor() {
    this.baseUrl = API_ENDPOINTS.CHAT.BASE;
  }

  /**
   * Get authentication headers with current valid token
   * This method checks token expiration and refreshes if needed
   */
  private async getAuthHeaders(): Promise<HeadersInit> {
    // Check if user is authenticated
    if (!authService.isAuthenticated()) {
      throw new Error('Unauthorized: Please log in to use the chatbot');
    }

    const token = authService.getAccessToken();
    
    if (!token) {
      throw new Error('Unauthorized: No access token found');
    }

    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    };
  }

  /**
   * Send a chat message and get a response
   * Uses authService.authenticatedFetch for automatic token refresh and retry
   */
  async sendMessage(request: ChatRequest): Promise<ChatResponse> {
    try {
      const response = await authService.authenticatedFetch(API_ENDPOINTS.CHAT.SEND, {
        method: 'POST',
        body: JSON.stringify({
          question: request.question,
          sessionId: request.sessionId || this.sessionId,
          conversationHistory: request.conversationHistory || [],
          context: request.context || {},
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      // Store session ID for conversation continuity
      if (data.data?.sessionId) {
        this.sessionId = data.data.sessionId;
      }

      return data.data as ChatResponse;
    } catch (error) {
      console.error('Error sending chat message:', error);
      throw error;
    }
  }

  /**
   * Stream chat response using Server-Sent Events
   * Note: Streaming doesn't use authenticatedFetch since it needs direct stream access
   * Token expiration is checked before starting the stream
   */
  async *streamMessage(request: ChatRequest): AsyncGenerator<ChatStreamChunk> {
    try {
      // Get fresh auth headers (will check expiration and refresh if needed)
      const headers = await this.getAuthHeaders();
      
      const response = await fetch(API_ENDPOINTS.CHAT.STREAM, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          question: request.question,
          sessionId: request.sessionId || this.sessionId,
          conversationHistory: request.conversationHistory || [],
          context: request.context || {},
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) {
        throw new Error('No response body');
      }

      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') continue;

            try {
              const chunk: ChatStreamChunk = JSON.parse(data);
              if (chunk.sessionId) {
                this.sessionId = chunk.sessionId;
              }
              yield chunk;
            } catch (e) {
              console.error('Error parsing SSE data:', e);
            }
          }
        }
      }
    } catch (error) {
      console.error('Error streaming chat message:', error);
      throw error;
    }
  }

  /**
   * Get chat history for a session
   */
  async getChatHistory(sessionId: string): Promise<ChatHistory[]> {
    try {
      const response = await authService.authenticatedFetch(
        `${API_ENDPOINTS.CHAT.HISTORY}/${sessionId}`,
        {
          method: 'GET',
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.data as ChatHistory[];
    } catch (error) {
      console.error('Error fetching chat history:', error);
      throw error;
    }
  }

  /**
   * Get user's chat history
   */
  async getUserChatHistory(): Promise<ChatHistory[]> {
    try {
      const response = await authService.authenticatedFetch(`${this.baseUrl}/chat/history/user`, {
        method: 'GET',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.data as ChatHistory[];
    } catch (error) {
      console.error('Error fetching user chat history:', error);
      throw error;
    }
  }

  /**
   * Clear current session
   */
  clearSession(): void {
    this.sessionId = null;
  }

  /**
   * Get current session ID
   */
  getCurrentSessionId(): string | null {
    return this.sessionId;
  }

  /**
   * Set session ID manually
   */
  setSessionId(sessionId: string): void {
    this.sessionId = sessionId;
  }
}

export const chatbotService = new ChatbotService();
