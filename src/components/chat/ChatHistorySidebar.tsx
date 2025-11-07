import React, { useState, useEffect } from 'react';
import { 
  MessageSquare, 
  Plus, 
  Trash2, 
  Calendar,
  Search,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { chatbotService, type ChatSession } from '@/lib/services/chatbotService';

interface ChatHistorySidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onSessionSelect: (sessionId: string) => void;
  onNewChat: () => void;
  currentSessionId: string | null;
}

export const ChatHistorySidebar: React.FC<ChatHistorySidebarProps> = ({
  isOpen,
  onClose,
  onSessionSelect,
  onNewChat,
  currentSessionId
}) => {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [sessionToDelete, setSessionToDelete] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      loadSessions();
    }
  }, [isOpen]);

  const loadSessions = async () => {
    setLoading(true);
    try {
      const chatSessions = await chatbotService.getChatSessions(50);
      setSessions(chatSessions);
    } catch (error) {
      console.error('Error loading chat sessions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleNewChat = async () => {
    try {
      const newSession = await chatbotService.createChatSession();
      setSessions(prev => [newSession, ...prev]);
      onNewChat();
      onSessionSelect(newSession.sessionId);
    } catch (error) {
      console.error('Error creating new chat:', error);
    }
  };

  const handleDeleteSession = async (sessionId: string) => {
    try {
      await chatbotService.deleteChatSession(sessionId);
      setSessions(prev => prev.filter(s => s.sessionId !== sessionId));
      
      // If we deleted the current session, trigger new chat
      if (sessionId === currentSessionId) {
        onNewChat();
      }
    } catch (error) {
      console.error('Error deleting session:', error);
    } finally {
      setDeleteDialogOpen(false);
      setSessionToDelete(null);
    }
  };

  const confirmDelete = (sessionId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    setSessionToDelete(sessionId);
    setDeleteDialogOpen(true);
  };

  const filteredSessions = sessions.filter(session =>
    session.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return 'Today';
    if (diffDays === 2) return 'Yesterday';
    if (diffDays <= 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
        onClick={onClose}
      />
      
      {/* Sidebar */}
      <div className={`
        fixed top-0 left-0 h-full w-80 bg-gray-900 text-white z-50 transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        md:relative md:translate-x-0
      `}>
        {/* Header */}
        <div className="p-4 border-b border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Chat History</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-gray-400 hover:text-white md:hidden"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
          
          {/* New Chat Button */}
          <Button
            onClick={handleNewChat}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            title="New Chat"
          >
            <Plus className="w-5 h-5" />
          </Button>
        </div>

        {/* Search */}
        <div className="p-4 border-b border-gray-700">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search chats..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-gray-800 border-gray-600 text-white placeholder-gray-400"
            />
          </div>
        </div>

        {/* Chat Sessions */}
        <div className="flex-1 overflow-y-auto h-[calc(100vh-200px)]">
          {loading ? (
            <div className="p-4 text-center text-gray-400">
              Loading...
            </div>
          ) : filteredSessions.length === 0 ? (
            <div className="p-4 text-center text-gray-400">
              {searchQuery ? 'No chats found' : 'No chat history yet'}
            </div>
          ) : (
            <div className="p-2">
              {filteredSessions.map((session) => (
                <div
                  key={session.sessionId}
                  onClick={() => {
                    onSessionSelect(session.sessionId);
                    onClose(); // Close sidebar on mobile after selection
                  }}
                  className={`
                    group flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors mb-1
                    ${session.sessionId === currentSessionId 
                      ? 'bg-blue-600 text-white' 
                      : 'hover:bg-gray-800 text-gray-200'
                    }
                  `}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center mb-1">
                      <MessageSquare className="w-4 h-4 mr-2 flex-shrink-0" />
                      <h3 className="text-sm font-medium truncate">
                        {session.title}
                      </h3>
                    </div>
                    <div className="flex items-center text-xs opacity-75">
                      <Calendar className="w-3 h-3 mr-1" />
                      {formatDate(session.createdAt)}
                    </div>
                  </div>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => confirmDelete(session.sessionId, e)}
                    className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-400 p-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Simple Delete Confirmation Modal */}
      {deleteDialogOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-60 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 max-w-sm mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Delete Chat</h3>
            <p className="text-gray-600 mb-4">
              Are you sure you want to delete this chat? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <Button
                variant="outline"
                onClick={() => setDeleteDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={() => sessionToDelete && handleDeleteSession(sessionToDelete)}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};