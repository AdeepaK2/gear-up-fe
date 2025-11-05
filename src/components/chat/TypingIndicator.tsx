import React from "react";
import { Bot } from "lucide-react";

/**
 * TypingIndicator component
 * Displays animated typing indicator when bot is "thinking"
 */
export const TypingIndicator = React.memo(() => {
  return (
    <div
      className="flex justify-start mb-4"
      role="status"
      aria-live="polite"
      aria-label="Bot is typing"
    >
      <div className="flex items-center space-x-2">
        <div
          className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center"
          aria-hidden="true"
        >
          <Bot className="w-4 h-4 text-gray-600" />
        </div>
        <div className="bg-gray-100 rounded-lg px-4 py-2">
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
            <div
              className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
              style={{ animationDelay: "0.1s" }}
            />
            <div
              className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
              style={{ animationDelay: "0.2s" }}
            />
          </div>
        </div>
      </div>
    </div>
  );
});

TypingIndicator.displayName = "TypingIndicator";
