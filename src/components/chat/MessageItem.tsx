import React from "react";
import { User, Bot, Paperclip } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Message, QuickAction } from "@/lib/types/Chatbot";

interface MessageItemProps {
  message: Message;
  onQuickAction?: (action: QuickAction) => void;
}

/**
 * MessageItem component
 * Displays a single chat message bubble with appropriate styling
 */
export const MessageItem = React.memo<MessageItemProps>(
  ({ message, onQuickAction }) => {
    const isCustomer = message.sender === "customer";

    const formatTime = (date: Date) => {
      return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    };

    return (
      <div
        className={`flex ${isCustomer ? "justify-end" : "justify-start"} mb-4`}
        role="article"
        aria-label={`Message from ${message.sender} at ${formatTime(
          message.timestamp
        )}`}
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
            aria-hidden="true"
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
            <p className="text-sm whitespace-pre-wrap">{message.content}</p>

            {message.metadata?.fileName && (
              <div className="mt-2 p-2 bg-white bg-opacity-20 rounded flex items-center space-x-2">
                <Paperclip className="w-4 h-4" aria-hidden="true" />
                <span className="text-xs">{message.metadata.fileName}</span>
              </div>
            )}

            {message.metadata?.actions && onQuickAction && (
              <div
                className="mt-3 space-y-2"
                role="group"
                aria-label="Quick actions"
              >
                {message.metadata.actions.map((action) => (
                  <Button
                    key={action.id}
                    size="sm"
                    variant="outline"
                    className="mr-2 mb-2 text-xs"
                    onClick={() => onQuickAction(action)}
                    aria-label={action.label}
                  >
                    <span aria-hidden="true">{action.icon}</span> {action.label}
                  </Button>
                ))}
              </div>
            )}

            <p
              className={`text-xs mt-1 ${
                isCustomer ? "text-blue-100" : "text-gray-500"
              }`}
              aria-label={`Sent at ${formatTime(message.timestamp)}`}
            >
              {formatTime(message.timestamp)}
            </p>
          </div>
        </div>
      </div>
    );
  }
);

MessageItem.displayName = "MessageItem";
