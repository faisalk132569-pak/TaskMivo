import React, { useState } from 'react';
import { ChatMessage, User } from '@/types';
import { 
  SearchIcon, PlusIcon, SendIcon, MoreVerticalIcon,
  MessageIcon
} from '@/components/icons/Icons';

// Custom SendIcon since we don't have it
const SendIconCustom: React.FC<{ size?: number; className?: string }> = ({ size = 24, className = '' }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="22" y1="2" x2="11" y2="13" />
    <polygon points="22 2 15 22 11 13 2 9 22 2" />
  </svg>
);

interface ChatInboxProps {
  messages: ChatMessage[];
  users: User[];
  currentUser: User;
}

const ChatInbox: React.FC<ChatInboxProps> = ({ messages, users, currentUser }) => {
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [newMessage, setNewMessage] = useState('');
  const [chatMessages, setChatMessages] = useState(messages);

  const getUser = (userId: string) => users.find(u => u.id === userId);

  // Get unique conversations
  const conversations = users
    .filter(u => u.id !== currentUser.id)
    .map(user => {
      const userMessages = chatMessages.filter(
        m => (m.sender_id === user.id && m.recipient_id === currentUser.id) ||
             (m.sender_id === currentUser.id && m.recipient_id === user.id)
      );
      const lastMessage = userMessages.sort((a, b) => 
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      )[0];
      const unreadCount = userMessages.filter(
        m => m.sender_id === user.id && !m.is_read
      ).length;
      
      return {
        user,
        lastMessage,
        unreadCount
      };
    })
    .filter(c => {
      if (!searchQuery) return true;
      const name = `${c.user.first_name} ${c.user.last_name}`.toLowerCase();
      return name.includes(searchQuery.toLowerCase());
    })
    .sort((a, b) => {
      if (!a.lastMessage) return 1;
      if (!b.lastMessage) return -1;
      return new Date(b.lastMessage.created_at).getTime() - new Date(a.lastMessage.created_at).getTime();
    });

  const selectedConversation = selectedChat 
    ? conversations.find(c => c.user.id === selectedChat)
    : null;

  const conversationMessages = selectedChat
    ? chatMessages
        .filter(m => 
          (m.sender_id === selectedChat && m.recipient_id === currentUser.id) ||
          (m.sender_id === currentUser.id && m.recipient_id === selectedChat)
        )
        .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
    : [];

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedChat) return;
    
    const message: ChatMessage = {
      id: `msg-${Date.now()}`,
      company_id: currentUser.company_id,
      sender_id: currentUser.id,
      recipient_id: selectedChat,
      message: newMessage,
      is_read: false,
      created_at: new Date().toISOString()
    };
    
    setChatMessages(prev => [...prev, message]);
    setNewMessage('');
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    
    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Messages</h2>
          <p className="text-slate-500">Chat with your team members</p>
        </div>
        
        <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium">
          <PlusIcon size={20} />
          New Message
        </button>
      </div>

      {/* Chat Container */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden h-[calc(100vh-250px)] min-h-[500px] flex">
        {/* Conversation List */}
        <div className="w-80 border-r border-slate-100 flex flex-col">
          {/* Search */}
          <div className="p-4 border-b border-slate-100">
            <div className="flex items-center gap-2 bg-slate-50 rounded-lg px-3 py-2">
              <SearchIcon size={18} className="text-slate-400" />
              <input
                type="text"
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent border-none outline-none text-sm text-slate-700 placeholder-slate-400 w-full"
              />
            </div>
          </div>
          
          {/* Conversations */}
          <div className="flex-1 overflow-y-auto">
            {conversations.map(({ user, lastMessage, unreadCount }) => (
              <button
                key={user.id}
                onClick={() => setSelectedChat(user.id)}
                className={`w-full p-4 flex items-start gap-3 hover:bg-slate-50 transition-colors text-left ${
                  selectedChat === user.id ? 'bg-indigo-50' : ''
                }`}
              >
                <div className="relative flex-shrink-0">
                  <img
                    src={user.avatar_url || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop'}
                    alt={`${user.first_name} ${user.last_name}`}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="font-medium text-slate-800 truncate">
                      {user.first_name} {user.last_name}
                    </p>
                    {lastMessage && (
                      <span className="text-xs text-slate-400">
                        {formatTime(lastMessage.created_at)}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-slate-500 truncate">
                    {lastMessage?.message || 'No messages yet'}
                  </p>
                </div>
                
                {unreadCount > 0 && (
                  <span className="w-5 h-5 bg-indigo-600 text-white text-xs rounded-full flex items-center justify-center flex-shrink-0">
                    {unreadCount}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          {selectedConversation ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={selectedConversation.user.avatar_url || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop'}
                    alt={`${selectedConversation.user.first_name} ${selectedConversation.user.last_name}`}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-medium text-slate-800">
                      {selectedConversation.user.first_name} {selectedConversation.user.last_name}
                    </p>
                    <p className="text-sm text-green-600">Online</p>
                  </div>
                </div>
                
                <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                  <MoreVerticalIcon size={20} className="text-slate-500" />
                </button>
              </div>
              
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {conversationMessages.map(message => {
                  const isSent = message.sender_id === currentUser.id;
                  
                  return (
                    <div
                      key={message.id}
                      className={`flex ${isSent ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-[70%] ${isSent ? 'order-2' : ''}`}>
                        <div
                          className={`px-4 py-2 rounded-2xl ${
                            isSent
                              ? 'bg-indigo-600 text-white rounded-br-md'
                              : 'bg-slate-100 text-slate-800 rounded-bl-md'
                          }`}
                        >
                          <p className="text-sm">{message.message}</p>
                        </div>
                        <p className={`text-xs text-slate-400 mt-1 ${isSent ? 'text-right' : ''}`}>
                          {formatTime(message.created_at)}
                        </p>
                      </div>
                    </div>
                  );
                })}
                
                {conversationMessages.length === 0 && (
                  <div className="flex-1 flex items-center justify-center text-slate-400">
                    <div className="text-center">
                      <MessageIcon size={48} className="mx-auto mb-2 opacity-50" />
                      <p>No messages yet. Start the conversation!</p>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Message Input */}
              <div className="p-4 border-t border-slate-100">
                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    placeholder="Type a message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-sm text-slate-700 placeholder-slate-400 outline-none focus:border-indigo-500"
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim()}
                    className="p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <SendIconCustom size={20} />
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-slate-400">
              <div className="text-center">
                <MessageIcon size={64} className="mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium">Select a conversation</p>
                <p className="text-sm">Choose a team member to start chatting</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatInbox;
