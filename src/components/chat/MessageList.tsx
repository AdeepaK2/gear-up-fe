import React from "react";
import { MessageItem } from "./MessageItem";
import type { Message, QuickAction } from "@/lib/types/Chatbot";

interface MessageListProps {
  messages: Message[];
  onQuickAction?: (action: QuickAction) => void;
}

/**
 * MessageList component
 * Renders a list of chat messages with ARIA live region for accessibility
 */
export const MessageList = React.memo<MessageListProps>(
  ({ messages, onQuickAction }) => {
    if (messages.length === 0) {
      return (
        <div
          className="flex items-center justify-center min-h-[300px] text-gray-500"
          role="status"
        >
          <div className="text-center">
            <p className="text-lg font-medium mb-2">No messages yet</p>
            <p className="text-sm">
              Start a conversation by typing a message or selecting a quick
              action above
            </p>
          </div>
        </div>
      );
    }

    return (
      <div
        role="log"
        aria-live="polite"
        aria-relevant="additions"
        aria-label="Chat messages"
        className="space-y-6 pb-4 min-h-[200px]"
      >
        {messages.map((message) => (
          <MessageItem
            key={message.id}
            message={message}
            onQuickAction={onQuickAction}
          />
        ))}
      </div>
    );
  }
);

MessageList.displayName = "MessageList";
