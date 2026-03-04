import { useState, useEffect, useRef } from "react";
import landlordAPI from "../../api/landlord";
import {
  MessageCircle,
  Send,
  User,
  Search,
  Loader2,
  AlertCircle,
  ArrowLeft,
  Building2,
} from "lucide-react";

/**
 * Messages Page
 * WhatsApp-style chat interface for landlord to communicate with tenants
 */
const LandlordMessages = () => {
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loadingConversations, setLoadingConversations] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showSidebar, setShowSidebar] = useState(true);
  const messagesEndRef = useRef(null);

  const fetchConversations = async () => {
    setLoadingConversations(true);
    try {
      const { data } = await landlordAPI.getConversations();
      setConversations(data.data || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load conversations");
    } finally {
      setLoadingConversations(false);
    }
  };

  const fetchMessages = async (conversationId) => {
    setLoadingMessages(true);
    try {
      const { data } = await landlordAPI.getMessages(conversationId);
      setMessages(data.data || []);
      scrollToBottom();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load messages");
    } finally {
      setLoadingMessages(false);
    }
  };

  useEffect(() => {
    fetchConversations();
  }, []);

  useEffect(() => {
    if (selectedConversation) {
      fetchMessages(selectedConversation._id);
    }
  }, [selectedConversation]);

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const handleSelectConversation = (conv) => {
    setSelectedConversation(conv);
    setShowSidebar(false);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedConversation) return;

    setSending(true);
    try {
      await landlordAPI.sendMessage(selectedConversation._id, newMessage);
      setNewMessage("");
      fetchMessages(selectedConversation._id);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send message");
    } finally {
      setSending(false);
    }
  };

  const formatTime = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) return "Today";
    if (date.toDateString() === yesterday.toDateString()) return "Yesterday";
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  const groupMessagesByDate = (msgs) => {
    const groups = {};
    msgs.forEach((msg) => {
      const dateKey = new Date(msg.createdAt).toDateString();
      if (!groups[dateKey]) groups[dateKey] = [];
      groups[dateKey].push(msg);
    });
    return groups;
  };

  const filteredConversations = conversations.filter((conv) => {
    const studentName = conv.studentId?.name?.toLowerCase() || "";
    const propertyTitle = conv.propertyId?.title?.toLowerCase() || "";
    const query = searchQuery.toLowerCase();
    return studentName.includes(query) || propertyTitle.includes(query);
  });

  // Get current user ID to determine message sender
  const getCurrentUserId = () => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    return user._id;
  };

  const currentUserId = getCurrentUserId();

  return (
    <div className="flex h-[calc(100vh-8rem)] flex-col overflow-hidden rounded-2xl bg-white shadow-sm">
      {error && (
        <div className="flex items-center gap-2 bg-red-50 p-3 text-sm text-red-700">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {error}
          <button
            onClick={() => setError("")}
            className="ml-auto text-red-500 hover:text-red-700"
          >
            ×
          </button>
        </div>
      )}

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar - Conversations List */}
        <div
          className={`${
            showSidebar ? "flex" : "hidden md:flex"
          } w-full flex-col border-r border-gray-100 md:w-80 lg:w-96`}
        >
          {/* Search Header */}
          <div className="border-b border-gray-100 p-4">
            <h2 className="mb-3 text-lg font-semibold text-gray-800">
              Messages
            </h2>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-4 text-sm transition-all focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
          </div>

          {/* Conversations List */}
          <div className="flex-1 overflow-y-auto">
            {loadingConversations ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
              </div>
            ) : filteredConversations.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <MessageCircle className="mb-3 h-12 w-12 text-gray-300" />
                <p className="text-sm text-gray-500">No conversations yet</p>
              </div>
            ) : (
              filteredConversations.map((conv) => (
                <button
                  key={conv._id}
                  onClick={() => handleSelectConversation(conv)}
                  className={`w-full border-b border-gray-50 p-3 text-left transition-colors hover:bg-gray-50 ${
                    selectedConversation?._id === conv._id ? "bg-blue-50" : ""
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {/* Avatar */}
                    <div className="h-12 w-12 shrink-0 overflow-hidden rounded-full bg-gradient-to-br from-blue-400 to-blue-600">
                      {conv.studentId?.avatar ? (
                        <img
                          src={conv.studentId.avatar}
                          alt={conv.studentId.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-lg font-medium text-white">
                          {conv.studentId?.name?.charAt(0)?.toUpperCase() ||
                            "?"}
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="truncate font-medium text-gray-800">
                          {conv.studentId?.name || "Unknown User"}
                        </h3>
                        <span className="shrink-0 text-xs text-gray-500">
                          {formatDate(conv.lastMessageAt || conv.updatedAt)}
                        </span>
                      </div>
                      <p className="truncate text-sm text-gray-500">
                        {conv.propertyId?.title || "Property"}
                      </p>
                      {conv.lastMessage && (
                        <p className="truncate text-sm text-gray-400">
                          {conv.lastMessage}
                        </p>
                      )}
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Chat Area */}
        <div
          className={`${
            !showSidebar ? "flex" : "hidden md:flex"
          } flex-1 flex-col`}
        >
          {selectedConversation ? (
            <>
              {/* Chat Header */}
              <div className="flex items-center gap-3 border-b border-gray-100 p-4">
                <button
                  onClick={() => setShowSidebar(true)}
                  className="rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100 md:hidden"
                >
                  <ArrowLeft className="h-5 w-5" />
                </button>
                <div className="h-10 w-10 shrink-0 overflow-hidden rounded-full bg-gradient-to-br from-blue-400 to-blue-600">
                  {selectedConversation.studentId?.avatar ? (
                    <img
                      src={selectedConversation.studentId.avatar}
                      alt={selectedConversation.studentId.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-sm font-medium text-white">
                      {selectedConversation.studentId?.name
                        ?.charAt(0)
                        ?.toUpperCase() || "?"}
                    </div>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="truncate font-medium text-gray-800">
                    {selectedConversation.studentId?.name || "Unknown User"}
                  </h3>
                  <div className="flex items-center gap-1 text-sm text-gray-500">
                    <Building2 className="h-3 w-3" />
                    <span className="truncate">
                      {selectedConversation.propertyId?.title || "Property"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto bg-gray-50 p-4">
                {loadingMessages ? (
                  <div className="flex h-full items-center justify-center">
                    <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
                  </div>
                ) : messages.length === 0 ? (
                  <div className="flex h-full flex-col items-center justify-center text-center">
                    <MessageCircle className="mb-3 h-12 w-12 text-gray-300" />
                    <p className="text-sm text-gray-500">No messages yet</p>
                    <p className="text-xs text-gray-400">
                      Start the conversation!
                    </p>
                  </div>
                ) : (
                  <>
                    {Object.entries(groupMessagesByDate(messages)).map(
                      ([dateKey, dateMessages]) => (
                        <div key={dateKey}>
                          {/* Date Divider */}
                          <div className="my-4 flex items-center justify-center">
                            <span className="rounded-full bg-gray-200 px-3 py-1 text-xs text-gray-600">
                              {formatDate(dateMessages[0].createdAt)}
                            </span>
                          </div>

                          {/* Messages for this date */}
                          {dateMessages.map((msg) => {
                            const isMine =
                              msg.senderId === currentUserId ||
                              msg.senderId?._id === currentUserId;
                            return (
                              <div
                                key={msg._id}
                                className={`mb-3 flex ${
                                  isMine ? "justify-end" : "justify-start"
                                }`}
                              >
                                <div
                                  className={`max-w-[75%] rounded-2xl px-4 py-2.5 ${
                                    isMine
                                      ? "bg-blue-600 text-white"
                                      : "bg-white text-gray-800 shadow-sm"
                                  }`}
                                >
                                  <p className="whitespace-pre-wrap break-words text-sm">
                                    {msg.content}
                                  </p>
                                  <p
                                    className={`mt-1 text-right text-xs ${
                                      isMine ? "text-blue-200" : "text-gray-400"
                                    }`}
                                  >
                                    {formatTime(msg.createdAt)}
                                  </p>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      ),
                    )}
                    <div ref={messagesEndRef} />
                  </>
                )}
              </div>

              {/* Message Input */}
              <form
                onSubmit={handleSendMessage}
                className="flex items-center gap-2 border-t border-gray-100 bg-white p-4"
              >
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm transition-all focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
                <button
                  type="submit"
                  disabled={sending || !newMessage.trim()}
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {sending ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <Send className="h-5 w-5" />
                  )}
                </button>
              </form>
            </>
          ) : (
            /* Empty State */
            <div className="flex h-full flex-col items-center justify-center bg-gray-50 p-8 text-center">
              <div className="mb-4 rounded-full bg-blue-100 p-4">
                <MessageCircle className="h-12 w-12 text-blue-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-800">
                Select a Conversation
              </h3>
              <p className="mt-1 max-w-sm text-sm text-gray-500">
                Choose a conversation from the list to start messaging with
                potential tenants
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LandlordMessages;
