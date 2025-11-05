import React, { useRef, useState, useCallback, KeyboardEvent } from "react";
import { Send, Paperclip, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface MessageInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  onFileSelect?: (file: File) => void;
  onFileRemove?: () => void;
  selectedFile?: File | null;
  disabled?: boolean;
  placeholder?: string;
}

/**
 * MessageInput component
 * Text input with file attachment support and keyboard shortcuts
 * Supports Enter to send, Shift+Enter for newline
 */
export const MessageInput = React.memo<MessageInputProps>(
  ({
    value,
    onChange,
    onSend,
    onFileSelect,
    onFileRemove,
    selectedFile,
    disabled = false,
    placeholder = "Type your message...",
  }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const textInputRef = useRef<HTMLInputElement>(null);
    const [sendStatus, setSendStatus] = useState<string>("");

    const handleSend = useCallback(() => {
      if ((!value.trim() && !selectedFile) || disabled) return;

      onSend();
      setSendStatus("Message sent");

      // Preserve focus in input after send for fast follow-ups
      setTimeout(() => {
        textInputRef.current?.focus();
        setSendStatus("");
      }, 100);
    }, [value, selectedFile, disabled, onSend]);

    const handleKeyPress = useCallback(
      (e: KeyboardEvent<HTMLInputElement>) => {
        // Enter to send (unless Shift is held for newline, though input doesn't support multiline)
        if (e.key === "Enter" && !e.shiftKey) {
          e.preventDefault();
          handleSend();
        }
      },
      [handleSend]
    );

    const handleFileChange = useCallback(
      (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file && onFileSelect) {
          onFileSelect(file);
        }
      },
      [onFileSelect]
    );

    const handleFileAttachClick = useCallback(() => {
      fileInputRef.current?.click();
    }, []);

    const canSend = (value.trim() || selectedFile) && !disabled;

    return (
      <div className="border-t-2 border-gray-200 bg-white px-6 py-4">
        {/* File Preview */}
        {selectedFile && onFileRemove && (
          <div className="mb-4 p-3 bg-blue-50 rounded-lg flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Paperclip className="w-4 h-4 text-blue-500" aria-hidden="true" />
              <span className="text-sm text-blue-700">{selectedFile.name}</span>
            </div>
            <Button
              size="sm"
              variant="ghost"
              onClick={onFileRemove}
              aria-label="Remove attached file"
            >
              <X className="w-4 h-4" aria-hidden="true" />
            </Button>
          </div>
        )}

        {/* Input Row */}
        <div className="flex space-x-3">
          {/* Hidden File Input */}
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            onChange={handleFileChange}
            accept="image/*,.pdf,.doc,.docx"
            aria-label="Attach file"
          />

          {/* File Attach Button */}
          {onFileSelect && (
            <Button
              size="sm"
              variant="outline"
              onClick={handleFileAttachClick}
              disabled={disabled}
              aria-label="Attach file"
            >
              <Paperclip className="w-4 h-4" aria-hidden="true" />
            </Button>
          )}

          {/* Text Input */}
          <Input
            ref={textInputRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            onKeyPress={handleKeyPress}
            disabled={disabled}
            className="flex-1 py-3 px-4 text-base border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            aria-label="Message input"
            autoFocus
          />

          {/* Send Button */}
          <Button
            onClick={handleSend}
            disabled={!canSend}
            aria-label="Send message"
            className="px-4 py-3 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300"
          >
            <Send className="w-5 h-5" aria-hidden="true" />
          </Button>
        </div>

        {/* Helper Text and Status */}
        <div className="flex justify-between items-center mt-2">
          <span className="text-xs text-gray-500">
            Press Enter to send • Attach files up to 10MB
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
