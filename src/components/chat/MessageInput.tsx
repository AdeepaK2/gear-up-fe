import React, { useRef, useState, useCallback, KeyboardEvent, useEffect } from "react";
import { Send, Mic, MicOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// Web Speech API types
declare global {
  interface Window {
    SpeechRecognition: typeof SpeechRecognition;
    webkitSpeechRecognition: typeof SpeechRecognition;
  }
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  abort(): void;
  onstart: ((this: SpeechRecognition, ev: Event) => any) | null;
  onend: ((this: SpeechRecognition, ev: Event) => any) | null;
  onerror: ((this: SpeechRecognition, ev: SpeechRecognitionErrorEvent) => any) | null;
  onresult: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => any) | null;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
  message: string;
}

interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

interface SpeechRecognitionResultList {
  readonly length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  readonly length: number;
  item(index: number): SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
  isFinal: boolean;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

declare var SpeechRecognition: {
  prototype: SpeechRecognition;
  new(): SpeechRecognition;
};

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
    const [isRecording, setIsRecording] = useState(false);
    const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);
    const [isSupported, setIsSupported] = useState(false);

    // Initialize Speech Recognition
    useEffect(() => {
      if (typeof window !== 'undefined') {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (SpeechRecognition) {
          const recognitionInstance = new SpeechRecognition();
          recognitionInstance.continuous = true;
          recognitionInstance.interimResults = true;
          recognitionInstance.lang = 'en-US';

          recognitionInstance.onstart = () => {
            setIsRecording(true);
          };

          recognitionInstance.onend = () => {
            setIsRecording(false);
          };

          recognitionInstance.onerror = (event) => {
            console.error('Speech recognition error:', event.error);
            setIsRecording(false);
          };

          recognitionInstance.onresult = (event) => {
            let finalTranscript = '';
            let interimTranscript = '';

            for (let i = event.resultIndex; i < event.results.length; i++) {
              const transcript = event.results[i][0].transcript;
              if (event.results[i].isFinal) {
                finalTranscript += transcript;
              } else {
                interimTranscript += transcript;
              }
            }

            // Update the input value with final transcript
            if (finalTranscript) {
              onChange(value + finalTranscript);
            }
          };

          setRecognition(recognitionInstance);
          setIsSupported(true);
        } else {
          console.warn('Speech Recognition not supported in this browser');
          setIsSupported(false);
        }
      }
    }, [value, onChange]);

    const startRecording = useCallback(() => {
      if (recognition && !isRecording) {
        try {
          recognition.start();
        } catch (error) {
          console.error('Error starting speech recognition:', error);
        }
      }
    }, [recognition, isRecording]);

    const stopRecording = useCallback(() => {
      if (recognition && isRecording) {
        recognition.stop();
      }
    }, [recognition, isRecording]);

    const toggleRecording = useCallback(() => {
      if (isRecording) {
        stopRecording();
      } else {
        startRecording();
      }
    }, [isRecording, startRecording, stopRecording]);

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
              className={`w-full py-4 px-5 text-base border-2 rounded-2xl focus:ring-4 transition-all duration-200 shadow-sm hover:shadow-md bg-white ${
                isRecording 
                  ? 'border-red-500 focus:border-red-500 focus:ring-red-100' 
                  : 'border-gray-200 focus:border-blue-500 focus:ring-blue-100'
              }`}
              aria-label="Message input"
              autoFocus
            />
            {isRecording && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                  <span className="text-xs text-red-500 font-medium">Listening...</span>
                </div>
              </div>
            )}
          </div>

          {/* Voice Button */}
          {isSupported && (
            <Button
              onClick={toggleRecording}
              disabled={disabled}
              aria-label={isRecording ? "Stop recording" : "Start voice input"}
              className={`px-4 py-4 h-auto rounded-2xl shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105 disabled:transform-none ${
                isRecording
                  ? 'bg-red-600 hover:bg-red-700 text-white'
                  : 'bg-gray-600 hover:bg-gray-700 text-white'
              }`}
            >
              {isRecording ? (
                <MicOff className="w-5 h-5" aria-hidden="true" />
              ) : (
                <Mic className="w-5 h-5" aria-hidden="true" />
              )}
            </Button>
          )}

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
            Press Enter to send {isSupported && "• Click microphone for voice input"}
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
