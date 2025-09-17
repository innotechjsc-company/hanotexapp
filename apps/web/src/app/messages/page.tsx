'use client';

import { useState } from 'react';
import { MessageSquare, Send, Search, MoreVertical, Star, Reply } from 'lucide-react';

export default function MessagesPage() {
  const [selectedConversation, setSelectedConversation] = useState(0);
  const [newMessage, setNewMessage] = useState('');

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      // TODO: Implement send message functionality
      console.log('Sending message:', newMessage);
      setNewMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const conversations = [
    {
      id: 1,
      name: 'Công ty TNHH ABC',
      avatar: 'AB',
      lastMessage: 'Chúng tôi quan tâm đến công nghệ xử lý nước thải của bạn...',
      time: '10:30',
      unread: 2,
      isOnline: true
    },
    {
      id: 2,
      name: 'Viện Nghiên cứu XYZ',
      avatar: 'XY',
      lastMessage: 'Cảm ơn bạn đã quan tâm đến nhu cầu của chúng tôi',
      time: '09:15',
      unread: 0,
      isOnline: false
    },
    {
      id: 3,
      name: 'Startup Tech Solutions',
      avatar: 'ST',
      lastMessage: 'Bạn có thể gửi thêm tài liệu kỹ thuật không?',
      time: 'Yesterday',
      unread: 1,
      isOnline: true
    }
  ];

  const messages = [
    {
      id: 1,
      sender: 'Công ty TNHH ABC',
      content: 'Xin chào, tôi quan tâm đến công nghệ xử lý nước thải mà bạn đã đăng. Bạn có thể cung cấp thêm thông tin chi tiết không?',
      time: '09:30',
      isOwn: false
    },
    {
      id: 2,
      sender: 'Bạn',
      content: 'Chào bạn! Cảm ơn bạn đã quan tâm. Tôi sẽ gửi thêm tài liệu kỹ thuật chi tiết qua email.',
      time: '09:35',
      isOwn: true
    },
    {
      id: 3,
      sender: 'Công ty TNHH ABC',
      content: 'Tuyệt vời! Chúng tôi cũng muốn biết về giá cả và thời gian triển khai.',
      time: '10:30',
      isOwn: false
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <MessageSquare className="h-8 w-8 text-blue-600 mr-3" />
            Tin nhắn
          </h1>
          <p className="text-gray-600 mt-2">
            Quản lý tin nhắn và giao tiếp với các đối tác
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
          {/* Conversations List */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-4 border-b border-gray-200">
              <div className="relative">
                <Search className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Tìm kiếm tin nhắn..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div className="overflow-y-auto">
              {conversations.map((conversation, index) => (
                <div
                  key={conversation.id}
                  onClick={() => setSelectedConversation(index)}
                  className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 ${
                    selectedConversation === index ? 'bg-blue-50 border-blue-200' : ''
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold">
                        {conversation.avatar}
                      </div>
                      {conversation.isOnline && (
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-semibold text-gray-900 truncate">
                          {conversation.name}
                        </h3>
                        <span className="text-xs text-gray-500">
                          {conversation.time}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 truncate mt-1">
                        {conversation.lastMessage}
                      </p>
                    </div>
                    {conversation.unread > 0 && (
                      <div className="bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {conversation.unread}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Chat Area */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow flex flex-col">
            {selectedConversation !== null ? (
              <>
                {/* Chat Header */}
                <div className="p-4 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold">
                        {conversations[selectedConversation]?.avatar}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {conversations[selectedConversation]?.name}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {conversations[selectedConversation]?.isOnline ? 'Đang hoạt động' : 'Không hoạt động'}
                        </p>
                      </div>
                    </div>
                    <button className="p-2 text-gray-400 hover:text-gray-600">
                      <MoreVertical className="h-5 w-5" />
                    </button>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.isOwn ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                        message.isOwn
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-900'
                      }`}>
                        <p className="text-sm">{message.content}</p>
                        <p className={`text-xs mt-1 ${
                          message.isOwn ? 'text-blue-100' : 'text-gray-500'
                        }`}>
                          {message.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Message Input */}
                <div className="p-4 border-t border-gray-200">
                  <div className="flex items-center space-x-3">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Nhập tin nhắn..."
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <button 
                      onClick={handleSendMessage}
                      className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg transition-colors"
                    >
                      <Send className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Chọn cuộc trò chuyện
                  </h3>
                  <p className="text-gray-600">
                    Chọn một cuộc trò chuyện từ danh sách để bắt đầu
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
