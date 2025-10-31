"use client";

import React, { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Minimize2, Maximize2, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { chatbotService, ChatMessage } from "@/lib/services/chatbotService";

interface Message extends ChatMessage {
  id: string;
  isLoading?: boolean;
}

export default function ChatbotPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        "Hello! 👋 I'm your GearUp AI assistant. How can I help you today? You can ask me about our services, book appointments, or get information about vehicle maintenance.",
      timestamp: new Date().toISOString(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Check authentication status
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('accessToken'); // Changed from 'token' to 'accessToken'
      setIsAuthenticated(!!token);
    };
    
    checkAuth();
    
    // Check auth when window gains focus
    window.addEventListener('focus', checkAuth);
    
    return () => {
      window.removeEventListener('focus', checkAuth);
    };
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isTyping) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: inputValue.trim(),
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);

    try {
      // Get conversation history
      const conversationHistory: ChatMessage[] = messages.map((msg) => ({
        role: msg.role,
        content: msg.content,
        timestamp: msg.timestamp,
      }));

      // Send message to backend
      const response = await chatbotService.sendMessage({
        question: userMessage.content,
        conversationHistory,
        context: {
          currentPage: window.location.pathname,
        },
      });

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: response.answer,
        timestamp: response.timestamp,
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Error sending message:", error);
      
      // Check if it's an authentication error
      const errorMessage = error instanceof Error ? error.message : String(error);
      const isAuthError = errorMessage.includes('Unauthorized') || errorMessage.includes('401');
      
      // Show appropriate error message
      const botErrorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: isAuthError
          ? "🔒 You need to be logged in to use the chatbot. Please log in and try again."
          : "I apologize, but I'm having trouble connecting right now. Please try again in a moment or contact our support team for immediate assistance.",
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, botErrorMessage]);
      
      // Update auth status if it was an auth error
      if (isAuthError) {
        setIsAuthenticated(false);
      }
    } finally {
      setIsTyping(false);
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-r from-primary to-primary/90 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center group z-50"
        aria-label="Open chat"
      >
        <MessageCircle className="w-7 h-7 group-hover:scale-110 transition-transform" />
        <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full animate-pulse"></span>
      </button>
    );
  }

  return (
    <div
      className={`fixed bottom-6 right-6 bg-white rounded-lg shadow-2xl transition-all duration-300 z-50 ${
        isMinimized ? "w-80 h-16" : "w-96 h-[600px]"
      }`}
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-primary/90 text-white p-4 rounded-t-lg flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
            <MessageCircle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-semibold text-sm">GearUp Assistant</h3>
            <p className="text-xs text-white/80">Online • Here to help</p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="hover:bg-white/20 p-1 rounded transition-colors"
            aria-label={isMinimized ? "Maximize" : "Minimize"}
          >
            {isMinimized ? (
              <Maximize2 className="w-5 h-5" />
            ) : (
              <Minimize2 className="w-5 h-5" />
            )}
          </button>
          <button
            onClick={() => {
              setIsOpen(false);
              setIsMinimized(false);
            }}
            className="hover:bg-white/20 p-1 rounded transition-colors"
            aria-label="Close chat"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Messages */}
          <div className="h-[440px] overflow-y-auto p-4 space-y-4 bg-gray-50">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[80%] rounded-lg px-4 py-2 ${
                    message.role === "user"
                      ? "bg-primary text-white"
                      : "bg-white text-gray-800 border border-gray-200"
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  {message.timestamp && (
                    <p
                      className={`text-xs mt-1 ${
                        message.role === "user"
                          ? "text-blue-100"
                          : "text-gray-500"
                      }`}
                    >
                      {formatTime(message.timestamp)}
                    </p>
                  )}
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white rounded-lg px-4 py-3 border border-gray-200">
                  <div className="flex space-x-2">
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
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="border-t p-4 bg-white rounded-b-lg">
            {!isAuthenticated ? (
              <div className="text-center py-2">
                <p className="text-sm text-gray-600 mb-3">
                  🔒 Please log in to use the chatbot
                </p>
                <a
                  href="/login"
                  className="inline-flex items-center justify-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors text-sm"
                >
                  <LogIn className="w-4 h-4 mr-2" />
                  Log In
                </a>
              </div>
            ) : (
              <>
                <div className="flex space-x-2">
                  <Input
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Type your message..."
                    onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                    className="flex-1"
                    disabled={isTyping}
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={!inputValue.trim() || isTyping}
                    size="icon"
                    className="bg-primary hover:bg-primary/90"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
                <p className="text-xs text-gray-500 mt-2 text-center">
                  Powered by GearUp AI
                </p>
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
}
