"use client";

import React, { useState, useCallback, useMemo } from "react";
import { Button } from "@/components/ui/button";
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
import { chatbotService, type ChatMessage } from "@/lib/services/chatbotService";

interface ChatbotProps {
  customerContext: CustomerContext;
  onActionClick?: (action: QuickAction) => void;
}

export default function Chatbot({
  customerContext,
  onActionClick,
}: ChatbotProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: `Hello ${customerContext.name}! I'm here to help you with your services, appointments, and any questions you might have. How can I assist you today?`,
      sender: "bot",
      timestamp: new Date(),
      type: "text",
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isEscalated, setIsEscalated] = useState(false);
  const [estimatedWaitTime, setEstimatedWaitTime] = useState<number | null>(
    null
  );
  const [filePreview, setFilePreview] = useState<File | null>(null);

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
        label: "Request a New Service",
        action: "request_service",
        icon: "➕",
      },
      {
        id: "4",
        label: "Update My Profile",
        action: "update_profile",
        icon: "👤",
      },
      {
        id: "5",
        label: "Contact Support",
        action: "contact_support",
        icon: "🎧",
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
    if (!inputValue.trim() && !filePreview) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue.trim(),
      sender: "customer",
      timestamp: new Date(),
      type: filePreview ? "file" : "text",
      metadata: filePreview
        ? {
            fileName: filePreview.name,
            fileUrl: URL.createObjectURL(filePreview),
          }
        : undefined,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setFilePreview(null);
    setIsTyping(true);

    try {
      // Convert messages to conversation history format
      const conversationHistory: ChatMessage[] = messages.map((msg) => ({
        role: msg.sender === "customer" ? "user" : "assistant",
        content: msg.content,
        timestamp: msg.timestamp.toISOString(),
      }));

      // Send message to RAG chatbot service
      const response = await chatbotService.sendMessage({
        question: userMessage.content,
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
          sources: response.sources,
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
  }, [inputValue, filePreview, messages, customerContext, generateBotResponse]);

  /**
   * Handle quick action click
   * Routes to appropriate handler or external navigation
   */
  const handleQuickAction = useCallback(
    (action: QuickAction) => {
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
    [onActionClick]
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
   * Handle file selection
   */
  const handleFileSelect = useCallback((file: File) => {
    setFilePreview(file);
  }, []);

  /**
   * Handle file removal
   */
  const handleFileRemove = useCallback(() => {
    setFilePreview(null);
  }, []);

  /**
   * Handle end chat and show feedback
   */
  const handleEndChat = useCallback(() => {
    setShowFeedback(true);
  }, []);

  return (
    <div className="flex flex-col h-screen w-full bg-white">
      {/* Context Header */}
      <div className="flex-shrink-0">
        <ChatHeader
          customerContext={customerContext}
          isEscalated={isEscalated}
          estimatedWaitTime={estimatedWaitTime}
        />
      </div>

      {/* Quick Actions */}
      <div className="flex-shrink-0">
        <QuickActionsBar
          actions={quickActions}
          onActionClick={handleQuickAction}
        />
      </div>

      {/* Chat Messages - This should take up most of the space */}
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
          onFileSelect={handleFileSelect}
          onFileRemove={handleFileRemove}
          selectedFile={filePreview}
        />
      </div>

      {/* Footer Actions */}
      <div className="flex-shrink-0 px-4 pb-2 flex justify-end">
        <Button
          size="sm"
          variant="ghost"
          onClick={handleEndChat}
          className="text-xs text-gray-500 hover:text-gray-700"
          aria-label="End chat and provide feedback"
        >
          End Chat & Feedback
        </Button>
      </div>

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
