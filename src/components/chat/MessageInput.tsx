import React, { useRef, useState, useCallback, KeyboardEvent } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface MessageInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  disabled?: boolean;
  placeholder?: string;
}

/**
 * MessageInput component
 * Modern text input with keyboard shortcuts
 * Supports Enter to send
 */
export const MessageInput = React.memo<MessageInputProps>(
  ({
    value,
    onChange,
    onSend,
    disabled = false,
    placeholder = "Type your message...",
  }) => {
    const textInputRef = useRef<HTMLInputElement>(null);
    const [sendStatus, setSendStatus] = useState<string>("");

    const handleSend = useCallback(() => {
      if (!value.trim() || disabled) return;

      onSend();
      setSendStatus("Message sent");

      // Preserve focus in input after send for fast follow-ups
      setTimeout(() => {
        textInputRef.current?.focus();
        setSendStatus("");
      }, 100);
    }, [value, disabled, onSend]);

    const handleKeyPress = useCallback(
      (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
          e.preventDefault();
          handleSend();
        }
      },
      [handleSend]
    );

    const canSend = value.trim() && !disabled;

    return (
      <div className="border-t border-gray-100 bg-gradient-to-r from-white to-blue-50/30 px-6 py-5 shadow-lg">
        {/* Input Row */}
        <div className="flex items-center space-x-3 max-w-5xl mx-auto">
          {/* Text Input */}
          <div className="flex-1 relative">
            <Input
              ref={textInputRef}
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder={placeholder}
              onKeyPress={handleKeyPress}
              disabled={disabled}
              className="w-full py-4 px-5 text-base border-2 border-gray-200 rounded-2xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 shadow-sm hover:shadow-md bg-white"
              aria-label="Message input"
              autoFocus
            />
          </div>

          {/* Send Button */}
          <Button
            onClick={handleSend}
            disabled={!canSend}
            aria-label="Send message"
            className="px-6 py-4 h-auto bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 disabled:from-gray-300 disabled:to-gray-300 rounded-2xl shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105 disabled:transform-none"
          >
            <Send className="w-5 h-5" aria-hidden="true" />
          </Button>
        </div>

        {/* Helper Text */}
        <div className="flex justify-center items-center mt-3">
          <span className="text-xs text-gray-400">
            Press Enter to send
          </span>

          {/* Live region for send status (for screen readers) */}
          {sendStatus && (
            <span className="sr-only" role="status" aria-live="polite">
              {sendStatus}
            </span>
          )}
        </div>
      </div>
    );
  }
);

MessageInput.displayName = "MessageInput";
