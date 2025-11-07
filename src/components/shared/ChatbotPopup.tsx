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
        className="fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-500 text-white rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center justify-center group z-50 hover:scale-110 active:scale-95"
        aria-label="Open chat"
      >
        <MessageCircle className="w-7 h-7 group-hover:rotate-12 transition-transform" />
        <span className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-br from-red-500 to-red-600 rounded-full animate-pulse shadow-lg"></span>
      </button>
    );
  }

  return (
    <div
      className={`fixed bottom-6 right-6 bg-white rounded-2xl shadow-2xl transition-all duration-300 z-50 border border-blue-100 ${
        isMinimized ? "w-80 h-16" : "w-96 h-[600px]"
      }`}
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 via-blue-500 to-blue-600 text-white p-4 rounded-t-lg flex items-center justify-between shadow-lg">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-md">
            <MessageCircle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-sm flex items-center gap-1.5">
              GearUp Assistant
              <span className="text-xs">✨</span>
            </h3>
            <p className="text-xs text-blue-100">Here to help you!</p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="hover:bg-white/20 p-2 rounded-xl transition-all hover:scale-110"
            aria-label={isMinimized ? "Maximize" : "Minimize"}
          >
            {isMinimized ? (
              <Maximize2 className="w-4 h-4" />
            ) : (
              <Minimize2 className="w-4 h-4" />
            )}
          </button>
          <button
            onClick={() => {
              setIsOpen(false);
              setIsMinimized(false);
            }}
            className="hover:bg-white/20 p-2 rounded-xl transition-all hover:scale-110"
            aria-label="Close chat"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Messages */}
          <div className="h-[440px] overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-blue-50/30 to-white">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-3 shadow-sm ${
                    message.role === "user"
                      ? "bg-gradient-to-r from-blue-600 to-blue-500 text-white"
                      : "bg-white text-gray-800 border border-blue-100"
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
                <div className="bg-white rounded-2xl px-4 py-3 border border-blue-100 shadow-sm">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                    <div
                      className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
                      style={{ animationDelay: "0.1s" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="border-t border-blue-100 p-4 bg-gradient-to-r from-white to-blue-50/30 rounded-b-lg">
            {!isAuthenticated ? (
              <div className="text-center py-2">
                <p className="text-sm text-gray-600 mb-3 font-medium">
                  🔒 Please log in to use the chatbot
                </p>
                <a
                  href="/login"
                  className="inline-flex items-center justify-center px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-xl hover:from-blue-700 hover:to-blue-600 transition-all shadow-md hover:shadow-lg text-sm font-medium"
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
                    className="flex-1 border-2 border-blue-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-xl"
                    disabled={isTyping}
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={!inputValue.trim() || isTyping}
                    size="icon"
                    className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 rounded-xl shadow-md hover:shadow-lg transition-all"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
                <p className="text-xs text-gray-400 mt-2 text-center">
                  Powered by GearUp AI ✨
                </p>
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
}
