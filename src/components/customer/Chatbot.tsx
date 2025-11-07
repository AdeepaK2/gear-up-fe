"use client";

import React, { useState, useCallback, useMemo, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Menu, MessageSquare, Plus, Trash2, Calendar, Search, X, ArrowLeft } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Message,
  QuickAction,
  CustomerContext,
  BotResponse,
} from "@/lib/types/Chatbot";
import { ChatHeader } from "@/components/chat/ChatHeader";
import { QuickActionsBar } from "@/components/chat/QuickActionsBar";
import { ChatWindow } from "@/components/chat/ChatWindow";
import { MessageInput } from "@/components/chat/MessageInput";
import { debugLog } from "@/lib/utils/debugLog";
import { chatbotService, type ChatMessage, type ChatSession } from "@/lib/services/chatbotService";

interface ChatbotProps {
  customerContext: CustomerContext;
  onActionClick?: (action: QuickAction) => void;
}

export default function Chatbot({
  customerContext,
  onActionClick,
}: ChatbotProps) {
  const router = useRouter();

  // Chat state
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isEscalated, setIsEscalated] = useState(false);
  const [estimatedWaitTime, setEstimatedWaitTime] = useState<number | null>(null);

  // ChatGPT-like sidebar state
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
  const [loadingSessions, setLoadingSessions] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [sessionToDelete, setSessionToDelete] = useState<string | null>(null);
  const [backendConnected, setBackendConnected] = useState(true);

  /**
   * Start a new chat session
   */
  const startNewChat = useCallback(() => {
    // Don't show "Loading..." in the welcome message
    const displayName = customerContext.name === "Loading..." ? "there" : customerContext.name;

    const welcomeMessage: Message = {
      id: "1",
      content: `Hello ${displayName}! I'm here to help you with your services, appointments, and any questions you might have. How can I assist you today?`,
      sender: "bot",
      timestamp: new Date(),
      type: "text",
    };

    setMessages([welcomeMessage]);
    setCurrentSessionId(null);
    chatbotService.clearSession();
  }, [customerContext.name]);

  // Initialize with welcome message
  useEffect(() => {
    startNewChat();
  }, [startNewChat]);

  // Load chat sessions when component mounts
  useEffect(() => {
    loadChatSessions();
  }, []);

  /**
   * Load chat sessions from backend
   * Uses caching to reduce loading time on subsequent calls
   */
  const loadChatSessions = useCallback(async () => {
    if (loadingSessions) return;

    setLoadingSessions(true);
    try {
      // getChatSessions uses internal caching with 5-minute duration
      const sessions = await chatbotService.getChatSessions(20);
      setChatSessions(sessions);
      setBackendConnected(true);
    } catch (error) {
      console.error('Error loading chat sessions:', error);
      // Only show error message on first load, not on subsequent loads
      if (chatSessions.length === 0) {
        setMessages(prev => [...prev, {
          id: Date.now().toString(),
          content: "Welcome! I'm having trouble loading your chat history, but I can still help you with new questions. How can I assist you today?",
          sender: 'bot',
          timestamp: new Date(),
          type: 'text',
        }]);
      }
      setBackendConnected(false);
      setChatSessions([]); // Set empty array as fallback
    } finally {
      setLoadingSessions(false);
    }
  }, [loadingSessions, chatSessions.length]);

  /**
   * Load a chat session from history
   */
  const loadChatSession = useCallback(async (sessionId: string) => {
    try {
      setMessages([]); // Clear current messages
      setCurrentSessionId(sessionId);
      setSidebarOpen(false); // Close sidebar on mobile
      
      // Load chat history from backend
      const history = await chatbotService.loadChatSession(sessionId);
      
      // Convert chat history to Message format
      const loadedMessages: Message[] = history.map((msg, index) => ({
        id: `${msg.role}-${index}`,
        content: msg.content,
        sender: msg.role === 'user' ? 'customer' : 'bot',
        timestamp: new Date(msg.timestamp || Date.now()),
        type: 'text',
      }));
      
      setMessages(loadedMessages);
    } catch (error) {
      console.error('Error loading chat session:', error);
      // Fallback to new chat
      startNewChat();
    }
  }, [startNewChat]);

  /**
   * Create a new chat session
   */
  const handleNewChat = useCallback(async () => {
    try {
      console.log('Creating new chat session...');
      const newSession = await chatbotService.createChatSession('New Chat');
      console.log('New session created:', newSession);
      
      // Update sessions list with new session at the top
      setChatSessions(prev => {
        console.log('Previous sessions:', prev);
        const updated = [newSession, ...prev];
        console.log('Updated sessions:', updated);
        return updated;
      });
      
      // Start new chat and set current session
      startNewChat();
      setCurrentSessionId(newSession.sessionId);
      console.log('New chat started with session ID:', newSession.sessionId);
    } catch (error) {
      console.error('Error creating new chat:', error);
      // Show error message to user
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        content: `Sorry, I couldn't create a new chat session. Error: ${error instanceof Error ? error.message : 'Unknown error'}. You can still chat without session history.`,
        sender: 'bot',
        timestamp: new Date(),
        type: 'text',
      }]);
      setBackendConnected(false);
      // Continue with local chat without session
      startNewChat();
      setCurrentSessionId(null);
    }
  }, [startNewChat, loadChatSessions]);

  /**
   * Delete a chat session
   */
  const handleDeleteSession = useCallback(async (sessionId: string) => {
    try {
      await chatbotService.deleteChatSession(sessionId);
      setChatSessions(prev => prev.filter(s => s.sessionId !== sessionId));
      
      // If we deleted the current session, start new chat
      if (sessionId === currentSessionId) {
        startNewChat();
      }
    } catch (error) {
      console.error('Error deleting session:', error);
    } finally {
      setDeleteDialogOpen(false);
      setSessionToDelete(null);
    }
  }, [currentSessionId, startNewChat]);

  const confirmDelete = (sessionId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    setSessionToDelete(sessionId);
    setDeleteDialogOpen(true);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return 'Today';
    if (diffDays === 2) return 'Yesterday';
    if (diffDays <= 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  // Filter sessions based on search query with memoization for performance
  const filteredSessions = useMemo(() => {
    if (!searchQuery.trim()) return chatSessions;
    
    const query = searchQuery.toLowerCase();
    return chatSessions.filter(session => {
      const title = session.title?.toLowerCase() || '';
      const sessionId = session.sessionId?.toLowerCase() || '';
      return title.includes(query) || sessionId.includes(query);
    });
  }, [chatSessions, searchQuery]);

  // Memoized quick actions list
  const quickActions: QuickAction[] = useMemo(
    () => [
      {
        id: "1",
        label: "View My Appointments",
        action: "view_appointments",
        icon: "📅",
      },
      {
        id: "2",
        label: "View My Services",
        action: "view_services",
        icon: "🔧",
      },
      {
        id: "3",
        label: "Book Appointment",
        action: "book_appointment",
        icon: "📝",
      },
    ],
    []
  );

  /**
   * Generate bot response based on user message
   * Uses keyword matching for FAQ responses
   */
  const generateBotResponse = useCallback(
    (userMessage: string): BotResponse => {
      const lowerMessage = userMessage.toLowerCase();

      // FAQ responses
      if (
        lowerMessage.includes("appointment") ||
        lowerMessage.includes("booking")
      ) {
        return {
          message:
            "I can help you with appointments! You can view your current appointments, schedule new ones, or modify existing bookings.",
          suggestions: [
            "View my appointments",
            "Schedule new appointment",
            "Cancel appointment",
          ],
          quickActions: [
            {
              id: "qa1",
              label: "View Appointments",
              action: "view_appointments",
              icon: "📅",
            },
          ],
        };
      }

      if (lowerMessage.includes("service") || lowerMessage.includes("repair")) {
        return {
          message:
            "I can assist you with our services! We offer various automotive services including maintenance, repairs, and inspections.",
          suggestions: [
            "View available services",
            "Request new service",
            "Check service status",
          ],
          quickActions: [
            {
              id: "qa2",
              label: "View Services",
              action: "view_services",
              icon: "🔧",
            },
            {
              id: "qa3",
              label: "Request Service",
              action: "request_service",
              icon: "➕",
            },
          ],
        };
      }

      if (
        lowerMessage.includes("profile") ||
        lowerMessage.includes("account")
      ) {
        return {
          message:
            "I can help you manage your profile and account settings. You can update your contact information, preferences, and more.",
          suggestions: [
            "Update profile",
            "Change password",
            "Notification settings",
          ],
          quickActions: [
            {
              id: "qa4",
              label: "Update Profile",
              action: "update_profile",
              icon: "👤",
            },
          ],
        };
      }

      if (lowerMessage.includes("price") || lowerMessage.includes("cost")) {
        return {
          message:
            "Our pricing varies depending on the service type and vehicle requirements. Would you like me to show you our service catalog with pricing information?",
          suggestions: [
            "View service pricing",
            "Get quote",
            "Compare packages",
          ],
        };
      }

      if (lowerMessage.includes("help") || lowerMessage.includes("support")) {
        return {
          message:
            "I'm here to help! You can ask me about services, appointments, your profile, or any general questions. If you need human assistance, I can connect you with our support team.",
          suggestions: [
            "Contact human support",
            "View FAQ",
            "Get started guide",
          ],
          quickActions: [
            {
              id: "qa5",
              label: "Contact Support",
              action: "contact_support",
              icon: "🎧",
            },
          ],
        };
      }

      // Default response
      return {
        message:
          "Thank you for your message! I'm here to help with any questions about your services, appointments, or account. What would you like to know more about?",
        suggestions: [
          "View appointments",
          "Browse services",
          "Update profile",
          "Get help",
        ],
      };
    },
    []
  );

  /**
   * Handle sending a message
   * Calls the real RAG chatbot API through Spring Boot
   */
  const handleSendMessage = useCallback(async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue.trim(),
      sender: "customer",
      timestamp: new Date(),
      type: "text",
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);

    try {
      // Create a new session if we don't have one
      let sessionId = currentSessionId;
      if (!sessionId) {
        console.log('Creating new chat session...');
        const newSession = await chatbotService.createChatSession(userMessage.content.substring(0, 50));
        sessionId = newSession.sessionId;
        setCurrentSessionId(sessionId);
        console.log('Created new session:', sessionId);
        
        // Invalidate cache and reload sessions to show the new one
        chatbotService.invalidateSessionsCache();
        await loadChatSessions();
      }

      // Convert messages to conversation history format
      const conversationHistory: ChatMessage[] = messages.map((msg) => ({
        role: msg.sender === "customer" ? "user" : "assistant",
        content: msg.content,
        timestamp: msg.timestamp.toISOString(),
      }));

      // Send message to RAG chatbot service
      const response = await chatbotService.sendMessage({
        question: userMessage.content,
        sessionId: sessionId,
        conversationHistory,
        context: {
          customerId: customerContext.id, // String id (email)
          currentPage: "/customer/chatbot",
          metadata: {
            customerName: customerContext.name,
            currentProject: customerContext.currentProject,
            currentService: customerContext.currentService,
          },
        },
      });

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response.answer,
        sender: "bot",
        timestamp: new Date(response.timestamp),
        type: "text",
        metadata: {
          sessionId: response.sessionId,
          confidence: response.confidence,
        },
      };

      setMessages((prev) => [...prev, botMessage]);
      setIsTyping(false);

    } catch (error) {
      console.error('Error sending message to chatbot:', error);
      
      // Fallback to mock response if API fails
      const fallbackResponse = generateBotResponse(userMessage.content);
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: `I'm having trouble connecting to the chatbot service. Here's a general response: ${fallbackResponse.message}`,
        sender: "bot",
        timestamp: new Date(),
        type: "text",
        metadata: {
          actions: fallbackResponse.quickActions,
        },
      };

      setMessages((prev) => [...prev, botMessage]);
      setIsTyping(false);
    }
  }, [inputValue, messages, customerContext, generateBotResponse, currentSessionId, loadChatSessions]);

  /**
   * Handle quick action click
   * Routes to appropriate handler or external navigation
   */
  const handleQuickAction = useCallback(
    (action: QuickAction) => {
      // Special handling for book appointment - automatically send the message
      if (action.action === "book_appointment") {
        setInputValue("I need to book an appointment");
        // Use setTimeout to ensure input value is set before sending
        setTimeout(() => {
          handleSendMessage();
        }, 0);
        return;
      }

      const actionMessage: Message = {
        id: Date.now().toString(),
        content: `Selected: ${action.label}`,
        sender: "customer",
        timestamp: new Date(),
        type: "action",
      };

      setMessages((prev) => [...prev, actionMessage]);

      if (action.action === "contact_support") {
        handleEscalateToSupport();
      } else {
        onActionClick?.(action);

        // Simulate bot response for other actions
        setTimeout(() => {
          let response = "";
          switch (action.action) {
            case "view_appointments":
              response =
                "Here are your upcoming appointments. You can click on any appointment to view details or make changes.";
              break;
            case "view_services":
              response =
                "I'll show you our available services. You can browse different categories and see pricing information.";
              break;
            case "request_service":
              response =
                "I'll help you request a new service. Please let me know what type of service you need for your vehicle.";
              break;
            case "update_profile":
              response =
                "I'll take you to your profile settings where you can update your information and preferences.";
              break;
            default:
              response = "I'm processing your request. Please wait a moment.";
          }

          const botMessage: Message = {
            id: (Date.now() + 1).toString(),
            content: response,
            sender: "bot",
            timestamp: new Date(),
            type: "text",
          };

          setMessages((prev) => [...prev, botMessage]);
        }, 1000);
      }
    },
    [onActionClick, handleSendMessage]
  );

  /**
   * Handle escalation to human support
   */
  const handleEscalateToSupport = useCallback(() => {
    setIsEscalated(true);
    setEstimatedWaitTime(5); // 5 minutes estimated wait time

    const escalationMessage: Message = {
      id: Date.now().toString(),
      content:
        "Connecting you to our support team. Estimated wait time: 5 minutes.",
      sender: "bot",
      timestamp: new Date(),
      type: "text",
    };

    setMessages((prev) => [...prev, escalationMessage]);
  }, []);

  /**
   * Handle end chat and show feedback
   */
  const handleEndChat = useCallback(() => {
    setShowFeedback(true);
  }, []);

  return (
    <div className="flex h-screen w-full bg-gradient-to-br from-blue-50/30 via-white to-blue-50/30">
      {/* Chat History Sidebar */}
      {sidebarOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black bg-opacity-30 z-40 lg:hidden transition-opacity duration-300 backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
          />

          {/* Sidebar */}
          <div className={`
            fixed top-0 left-0 h-full w-80 bg-white/95 backdrop-blur-xl border-r border-blue-100 shadow-2xl z-50 transform transition-all duration-300 ease-in-out
            ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
            lg:relative lg:translate-x-0 lg:shadow-xl
          `}>
            {/* Header */}
            <div className="p-5 border-b border-blue-100 bg-gradient-to-r from-blue-50 to-white">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-blue-600" />
                  Chat History
                </h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSidebarOpen(false)}
                  className="text-gray-500 hover:text-gray-700 hover:bg-blue-50 rounded-xl"
                  title="Hide chat history"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Search */}
            <div className="p-4 border-b border-blue-50">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400 w-4 h-4" />
                <Input
                  placeholder="Search chats..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-white border-blue-200 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-xl"
                />
              </div>
            </div>

            {/* Chat Sessions */}
            <div className="flex-1 overflow-y-auto h-[calc(100vh-200px)] bg-gradient-to-b from-white to-blue-50/20">
              {loadingSessions ? (
                <div className="p-4 text-center text-gray-500">
                  Loading...
                </div>
              ) : filteredSessions.length === 0 ? (
                <div className="p-4 text-center text-gray-500">
                  {searchQuery ? 'No chats found' : 'No chat history yet'}
                </div>
              ) : (
                <div className="p-2">
                  {filteredSessions.map((session) => (
                    <div
                      key={session.sessionId}
                      onClick={() => loadChatSession(session.sessionId)}
                      className={`
                        group flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all duration-200 mb-2 shadow-sm hover:shadow-md
                        ${session.sessionId === currentSessionId
                          ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white border border-blue-600'
                          : 'hover:bg-white text-gray-700 border border-blue-100 bg-blue-50/30'
                        }
                      `}
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center mb-1">
                          <MessageSquare className={`w-4 h-4 mr-2 flex-shrink-0 ${
                            session.sessionId === currentSessionId ? 'text-white' : 'text-blue-500'
                          }`} />
                          <h3 className="text-sm font-medium truncate">
                            {session.title}
                          </h3>
                        </div>
                        <div className="flex items-center text-xs opacity-75">
                          <Calendar className="w-3 h-3 mr-1" />
                          {formatDate(session.createdAt)}
                        </div>
                      </div>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => confirmDelete(session.sessionId, e)}
                        className={`opacity-0 group-hover:opacity-100 hover:text-red-500 hover:bg-red-50 p-1 rounded-lg transition-all ${
                          session.sessionId === currentSessionId ? 'text-white/80' : 'text-gray-400'
                        }`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col bg-white/80 backdrop-blur-sm">
        {/* Top Header with Branding and Navigation */}
        <div className="flex-shrink-0">
          <ChatHeader
            customerContext={customerContext}
            isEscalated={isEscalated}
            estimatedWaitTime={estimatedWaitTime}
            sidebarOpen={sidebarOpen}
            onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
            onNewChat={handleNewChat}
            backendConnected={backendConnected}
          />
        </div>

        {/* Quick Actions */}
        <div className="flex-shrink-0">
          <QuickActionsBar
            actions={quickActions}
            onActionClick={handleQuickAction}
          />
        </div>

        {/* Chat Messages - Takes up most space */}
        <div className="flex-1 min-h-0 overflow-hidden">
          <ChatWindow
            messages={messages}
            isTyping={isTyping}
            onQuickAction={handleQuickAction}
          />
        </div>

        {/* Input Area */}
        <div className="flex-shrink-0">
          <MessageInput
            value={inputValue}
            onChange={setInputValue}
            onSend={handleSendMessage}
          />
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteDialogOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-60 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 max-w-sm mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Delete Chat</h3>
            <p className="text-gray-600 mb-4">
              Are you sure you want to delete this chat? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <Button
                variant="outline"
                onClick={() => setDeleteDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={() => sessionToDelete && handleDeleteSession(sessionToDelete)}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Feedback Dialog */}
      <Dialog open={showFeedback} onOpenChange={setShowFeedback}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>How was your chat experience?</DialogTitle>
          </DialogHeader>
          <FeedbackForm onSubmit={() => setShowFeedback(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
}

/**
 * FeedbackForm component
 * Collects user rating and comments about chat experience
 */
function FeedbackForm({ onSubmit }: { onSubmit: () => void }) {
  const [rating, setRating] = useState<number>(0);
  const [comment, setComment] = useState("");

  const handleSubmit = useCallback(() => {
    // In a real app, this would send feedback to backend
    // Removed console.log to prevent PII leakage
    debugLog("Feedback submitted:", { rating, comment });
    onSubmit();
  }, [rating, comment, onSubmit]);

  const handleSkip = useCallback(() => {
    onSubmit();
  }, [onSubmit]);

  return (
    <div className="space-y-4">
      <div>
        <p className="text-sm text-gray-600 mb-3">
          Please rate your experience:
        </p>
        <div className="flex space-x-2" role="group" aria-label="Rating">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onClick={() => setRating(star)}
              className={`text-2xl ${
                star <= rating ? "text-yellow-400" : "text-gray-300"
              } hover:text-yellow-400 transition-colors`}
              aria-label={`Rate ${star} star${star !== 1 ? "s" : ""}`}
              type="button"
            >
              ⭐
            </button>
          ))}
        </div>
      </div>

      <div>
        <label
          htmlFor="feedback-comment"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Additional comments (optional):
        </label>
        <textarea
          id="feedback-comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="w-full p-2 border rounded-md resize-none"
          rows={3}
          placeholder="Tell us how we can improve..."
        />
      </div>

      <div className="flex justify-end space-x-2">
        <Button variant="outline" onClick={handleSkip}>
          Skip
        </Button>
        <Button onClick={handleSubmit} disabled={rating === 0}>
          Submit Feedback
        </Button>
      </div>
    </div>
  );
}
