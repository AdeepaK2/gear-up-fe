import React, { useRef, useEffect, useState, useCallback } from "react";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MessageList } from "./MessageList";
import { TypingIndicator } from "./TypingIndicator";
import type { Message, QuickAction } from "@/lib/types/Chatbot";

interface ChatWindowProps {
  messages: Message[];
  isTyping: boolean;
  onQuickAction?: (action: QuickAction) => void;
}

/**
 * ChatWindow component
 * Scrollable container for chat messages with auto-scroll and jump-to-latest functionality
 */
export const ChatWindow = React.memo<ChatWindowProps>(
  ({ messages, isTyping, onQuickAction }) => {
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [showJumpToLatest, setShowJumpToLatest] = useState(false);
    const [userHasScrolled, setUserHasScrolled] = useState(false);

    // Scroll to bottom when new messages arrive (if user hasn't manually scrolled up)
    useEffect(() => {
      if (!userHasScrolled) {
        scrollToBottom();
      }
    }, [messages, isTyping, userHasScrolled]);

    const scrollToBottom = useCallback((smooth = true) => {
      messagesEndRef.current?.scrollIntoView({
        behavior: smooth ? "smooth" : "auto",
      });
    }, []);

    const handleScroll = useCallback(() => {
      const container = scrollContainerRef.current;
      if (!container) return;

      const { scrollTop, scrollHeight, clientHeight } = container;
      const distanceFromBottom = scrollHeight - scrollTop - clientHeight;

      // Show jump button if user has scrolled more than 100px from bottom
      const shouldShowJump = distanceFromBottom > 100;
      setShowJumpToLatest(shouldShowJump);

      // Track if user has manually scrolled up
      setUserHasScrolled(shouldShowJump);
    }, []);

    const handleJumpToLatest = useCallback(() => {
      scrollToBottom();
      setUserHasScrolled(false);
      setShowJumpToLatest(false);
    }, [scrollToBottom]);

    return (
      <div
        className="h-full overflow-y-auto px-6 py-6 relative bg-gray-100"
        ref={scrollContainerRef}
        onScroll={handleScroll}
        style={{ minHeight: '400px' }}
      >
        <div className="max-w-4xl mx-auto">
          <MessageList messages={messages} onQuickAction={onQuickAction} />

          {isTyping && <TypingIndicator />}
        </div>

        <div ref={messagesEndRef} />

        {/* Jump to Latest Button */}
        {showJumpToLatest && (
          <div className="sticky bottom-4 flex justify-center">
            <Button
              size="sm"
              variant="outline"
              className="bg-white shadow-lg hover:bg-gray-50"
              onClick={handleJumpToLatest}
              aria-label="Jump to latest message"
            >
              <ChevronDown className="w-4 h-4 mr-1" aria-hidden="true" />
              Jump to Latest
            </Button>
          </div>
        )}
      </div>
    );
  }
);

ChatWindow.displayName = "ChatWindow";
