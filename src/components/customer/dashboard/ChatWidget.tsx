import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";

/**
 * ChatWidget Component
 *
 * Floating chat widget with toggle functionality.
 * Provides quick access to customer support chat.
 *
 * @param {Object} props - Component props
 * @param {boolean} props.isOpen - Whether the chat widget is open
 * @param {Function} props.onToggle - Callback to toggle chat widget visibility
 * @returns {JSX.Element} Rendered chat widget (button or expanded overlay)
 */
interface ChatWidgetProps {
  isOpen: boolean;
  onToggle: () => void;
}

const ChatWidget: React.FC<ChatWidgetProps> = ({ isOpen, onToggle }) => {
  if (!isOpen) {
    return (
      <Button
        className="fixed bottom-6 right-6 rounded-full w-14 h-14 shadow-lg transition-all duration-200 hover:scale-110"
        onClick={onToggle}
        aria-label="Open support chat"
      >
        <MessageCircle className="w-6 h-6" />
      </Button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 w-80 h-96 bg-white rounded-lg shadow-xl border z-50">
      <div className="flex items-center justify-between p-4 border-b">
        <h3 className="font-semibold">Support Chat</h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggle}
          aria-label="Close chat"
        >
          ×
        </Button>
      </div>
      <div className="p-4 h-72 flex items-center justify-center text-gray-500">
        <div className="text-center">
          <MessageCircle className="w-12 h-12 mx-auto mb-2 text-gray-300" />
          <p>Chat functionality will be integrated here</p>
          <Link href="/customer/chatbot">
            <Button className="mt-3" size="sm">
              Open Full Chat
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ChatWidget;
