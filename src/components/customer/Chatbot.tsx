"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Send,
  Paperclip,
  User,
  Bot,
  Clock,
  AlertCircle,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
  ChatSession,
  BotResponse,
  ChatFeedback,
} from "@/lib/types/Chatbot";

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

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const quickActions: QuickAction[] = [
    {
      id: "1",
      label: "View My Appointments",
      action: "view_appointments",
      icon: "📅",
    },
    { id: "2", label: "View My Services", action: "view_services", icon: "🔧" },
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
  ];

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const generateBotResponse = (userMessage: string): BotResponse => {
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

    if (lowerMessage.includes("profile") || lowerMessage.includes("account")) {
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
        suggestions: ["View service pricing", "Get quote", "Compare packages"],
      };
    }

    if (lowerMessage.includes("help") || lowerMessage.includes("support")) {
      return {
        message:
          "I'm here to help! You can ask me about services, appointments, your profile, or any general questions. If you need human assistance, I can connect you with our support team.",
        suggestions: ["Contact human support", "View FAQ", "Get started guide"],
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
  };

  const handleSendMessage = async () => {
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

    // Simulate bot response delay
    setTimeout(() => {
      const botResponse = generateBotResponse(userMessage.content);
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: botResponse.message,
        sender: "bot",
        timestamp: new Date(),
        type: "text",
        metadata: {
          actions: botResponse.quickActions,
        },
      };

      setMessages((prev) => [...prev, botMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const handleQuickAction = (action: QuickAction) => {
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
  };

  const handleEscalateToSupport = () => {
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
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFilePreview(file);
    }
  };

  const handleEndChat = () => {
    setShowFeedback(true);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const MessageBubble = ({ message }: { message: Message }) => {
    const isCustomer = message.sender === "customer";

    return (
      <div
        className={`flex ${isCustomer ? "justify-end" : "justify-start"} mb-4`}
      >
        <div
          className={`flex items-start space-x-2 max-w-[80%] ${
            isCustomer ? "flex-row-reverse space-x-reverse" : ""
          }`}
        >
          <div
            className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
              isCustomer
                ? "bg-blue-500"
                : message.sender === "bot"
                ? "bg-gray-200"
                : "bg-green-500"
            }`}
          >
            {isCustomer ? (
              <User className="w-4 h-4 text-white" />
            ) : message.sender === "bot" ? (
              <Bot className="w-4 h-4 text-gray-600" />
            ) : (
              <User className="w-4 h-4 text-white" />
            )}
          </div>

          <div
            className={`rounded-lg px-4 py-2 ${
              isCustomer
                ? "bg-blue-500 text-white"
                : "bg-gray-100 text-gray-800 border"
            }`}
          >
            <p className="text-sm">{message.content}</p>

            {message.metadata?.fileName && (
              <div className="mt-2 p-2 bg-white bg-opacity-20 rounded flex items-center space-x-2">
                <Paperclip className="w-4 h-4" />
                <span className="text-xs">{message.metadata.fileName}</span>
              </div>
            )}

            {message.metadata?.actions && (
              <div className="mt-3 space-y-2">
                {message.metadata.actions.map((action) => (
                  <Button
                    key={action.id}
                    size="sm"
                    variant="outline"
                    className="mr-2 mb-2 text-xs"
                    onClick={() => handleQuickAction(action)}
                  >
                    {action.icon} {action.label}
                  </Button>
                ))}
              </div>
            )}

            <p
              className={`text-xs mt-1 ${
                isCustomer ? "text-blue-100" : "text-gray-500"
              }`}
            >
              {formatTime(message.timestamp)}
            </p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full max-w-6xl mx-auto bg-white rounded-lg shadow-lg">
      {/* Context Header */}
      <div className="bg-gradient-to-r from-primary to-primary/90 text-white p-4 rounded-t-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold">{customerContext.name}</h3>
              <div className="flex items-center space-x-4 text-sm text-white/80">
                {customerContext.currentProject && (
                  <span>Project: {customerContext.currentProject.name}</span>
                )}
                {customerContext.currentService && (
                  <span>Service: {customerContext.currentService.name}</span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Badge
              variant={
                customerContext.onlineStatus === "online"
                  ? "default"
                  : "secondary"
              }
            >
              {customerContext.onlineStatus === "online"
                ? "🟢 Online"
                : "🔴 Offline"}
            </Badge>
            {isEscalated && estimatedWaitTime && (
              <Badge
                variant="outline"
                className="text-yellow-300 border-yellow-300"
              >
                <Clock className="w-3 h-3 mr-1" />
                Wait: {estimatedWaitTime}min
              </Badge>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="p-4 border-b bg-gray-50">
        <div className="flex flex-wrap gap-2">
          {quickActions.map((action) => (
            <Button
              key={action.id}
              size="sm"
              variant="outline"
              className="text-xs"
              onClick={() => handleQuickAction(action)}
            >
              {action.icon} {action.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))}

        {isTyping && (
          <div className="flex justify-start mb-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                <Bot className="w-4 h-4 text-gray-600" />
              </div>
              <div className="bg-gray-100 rounded-lg px-4 py-2">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0.1s" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0.2s" }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="border-t p-4">
        {filePreview && (
          <div className="mb-3 p-2 bg-blue-50 rounded-lg flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Paperclip className="w-4 h-4 text-blue-500" />
              <span className="text-sm text-blue-700">{filePreview.name}</span>
            </div>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setFilePreview(null)}
            >
              ✕
            </Button>
          </div>
        )}

        <div className="flex space-x-2">
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            onChange={handleFileUpload}
            accept="image/*,.pdf,.doc,.docx"
          />

          <Button
            size="sm"
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
          >
            <Paperclip className="w-4 h-4" />
          </Button>

          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Type your message..."
            onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
            className="flex-1"
          />

          <Button
            onClick={handleSendMessage}
            disabled={!inputValue.trim() && !filePreview}
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>

        <div className="flex justify-between items-center mt-2">
          <span className="text-xs text-gray-500">
            Press Enter to send • Attach files up to 10MB
          </span>
          <Button
            size="sm"
            variant="ghost"
            onClick={handleEndChat}
            className="text-xs text-gray-500 hover:text-gray-700"
          >
            End Chat & Feedback
          </Button>
        </div>
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

// Feedback Form Component
function FeedbackForm({ onSubmit }: { onSubmit: () => void }) {
  const [rating, setRating] = useState<number>(0);
  const [comment, setComment] = useState("");

  const handleSubmit = () => {
    // Here you would typically save the feedback
    console.log("Feedback submitted:", { rating, comment });
    onSubmit();
  };

  return (
    <div className="space-y-4">
      <div>
        <p className="text-sm text-gray-600 mb-3">
          Please rate your experience:
        </p>
        <div className="flex space-x-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onClick={() => setRating(star)}
              className={`text-2xl ${
                star <= rating ? "text-yellow-400" : "text-gray-300"
              } hover:text-yellow-400 transition-colors`}
            >
              <Star className="w-6 h-6 fill-current" />
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Additional comments (optional):
        </label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="w-full p-2 border rounded-md resize-none"
          rows={3}
          placeholder="Tell us how we can improve..."
        />
      </div>

      <div className="flex justify-end space-x-2">
        <Button variant="outline" onClick={onSubmit}>
          Skip
        </Button>
        <Button onClick={handleSubmit} disabled={rating === 0}>
          Submit Feedback
        </Button>
      </div>
    </div>
  );
}
