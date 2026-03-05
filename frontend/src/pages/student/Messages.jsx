import { useState, useEffect, useRef } from "react";
import { useAuth } from "../../context/AuthContext";
import studentAPI from "../../api/student";
import {
  MessageCircle,
  Send,
  User,
  Loader2,
  AlertTriangle,
  Search,
  Check,
  CheckCheck,
  ArrowLeft,
} from "lucide-react";

/**
 * Student Messages Page
 * Chat interface for messaging landlords
 */
const StudentMessages = () => {
  const { user } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [error, setError] = useState("");
  const [newMessage, setNewMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const messagesEndRef = useRef(null);

  // Fetch conversations
  const fetchConversations = async () => {
    setLoading(true);
    setError("");
    try {
      const { data } = await studentAPI.getConversations();
      if (data.success) {
        setConversations(data.data || []);
      }
    } catch (err) {
      console.error("Error fetching conversations:", err);
      setError(err.response?.data?.message || "Failed to load conversations");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConversations();
  }, []);

  // Fetch messages for selected conversation
  const fetchMessages = async (conversationId) => {
    setMessagesLoading(true);
    try {
      const { data } = await studentAPI.getMessages(conversationId);
      if (data.success) {
        setMessages(data.data || []);
      }
    } catch (err) {
      console.error("Error fetching messages:", err);
    } finally {
      setMessagesLoading(false);
    }
  };

  // Select conversation
  const handleSelectConversation = async (conversation) => {
    setSelectedConversation(conversation);
    await fetchMessages(conversation._id);
  };

  // Send message
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedConversation) return;

    setSending(true);
    try {
      const { data } = await studentAPI.sendMessage(
        selectedConversation._id,
        newMessage.trim(),
      );

      if (data.success) {
        setMessages((prev) => [...prev, data.data]);
        setNewMessage("");
        // Update conversation's last message
        setConversations((prev) =>
          prev.map((c) =>
            c._id === selectedConversation._id
              ? { ...c, lastMessage: data.data, lastMessageAt: new Date() }
              : c,
          ),
        );
      }
    } catch (err) {
      alert(err.response?.data?.message || "Failed to send message");
    } finally {
      setSending(false);
    }
  };

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Get other participant in conversation
  const getOtherParticipant = (conversation) => {
    return conversation.participants?.find((p) => p._id !== user?._id);
  };

  // Filter conversations
  const filteredConversations = conversations.filter((conv) => {
    const other = getOtherParticipant(conv);
    const name = other?.name || "";
    return name.toLowerCase().includes(searchTerm.toLowerCase());
  });

  // Format time
  const formatTime = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) {
      return date.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });
    } else if (days === 1) {
      return "Yesterday";
    } else if (days < 7) {
      return date.toLocaleDateString("en-US", { weekday: "short" });
    } else {
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center">
        <AlertTriangle className="h-16 w-16 text-red-300" />
        <h3 className="mt-4 text-xl font-semibold text-gray-900">
          Failed to load messages
        </h3>
        <p className="mt-2 text-gray-600">{error}</p>
        <button
          onClick={fetchConversations}
          className="mt-4 rounded-lg bg-blue-600 px-6 py-2 text-white hover:bg-blue-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-180px)] min-h-[500px] overflow-hidden rounded-2xl bg-white shadow-sm">
      {/* Conversations List */}
      <div
        className={`flex w-full flex-col border-r border-gray-100 md:w-80 lg:w-96 ${
          selectedConversation ? "hidden md:flex" : "flex"
        }`}
      >
        {/* Search */}
        <div className="border-b border-gray-100 p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2 pl-9 pr-4 text-sm text-gray-900 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Conversations */}
        <div className="flex-1 overflow-y-auto">
          {filteredConversations.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-8 text-center">
              <MessageCircle className="h-12 w-12 text-gray-300" />
              <p className="mt-3 text-sm text-gray-500">
                {conversations.length === 0
                  ? "No conversations yet"
                  : "No matching conversations"}
              </p>
            </div>
          ) : (
            filteredConversations.map((conversation) => {
              const other = getOtherParticipant(conversation);
              const isSelected = selectedConversation?._id === conversation._id;

              return (
                <button
                  key={conversation._id}
                  onClick={() => handleSelectConversation(conversation)}
                  className={`flex w-full items-center gap-3 border-b border-gray-50 p-4 text-left transition-colors hover:bg-gray-50 ${
                    isSelected ? "bg-blue-50" : ""
                  }`}
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-blue-600 text-lg font-semibold text-white">
                    {other?.name?.charAt(0)?.toUpperCase() || "U"}
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <div className="flex items-center justify-between">
                      <p className="font-semibold text-gray-900 truncate">
                        {other?.name || "User"}
                      </p>
                      <span className="shrink-0 text-xs text-gray-400">
                        {formatTime(conversation.lastMessageAt)}
                      </span>
                    </div>
                    <p className="mt-0.5 truncate text-sm text-gray-500">
                      {conversation.lastMessage?.text || "No messages yet"}
                    </p>
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* Messages Area */}
      <div
        className={`flex flex-1 flex-col ${
          selectedConversation ? "flex" : "hidden md:flex"
        }`}
      >
        {selectedConversation ? (
          <>
            {/* Chat Header */}
            <div className="flex items-center gap-3 border-b border-gray-100 p-4">
              <button
                onClick={() => setSelectedConversation(null)}
                className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 md:hidden"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-blue-600 font-semibold text-white">
                {getOtherParticipant(selectedConversation)
                  ?.name?.charAt(0)
                  ?.toUpperCase() || "U"}
              </div>
              <div>
                <p className="font-semibold text-gray-900">
                  {getOtherParticipant(selectedConversation)?.name || "User"}
                </p>
                <p className="text-xs text-gray-500">Landlord</p>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4">
              {messagesLoading ? (
                <div className="flex h-full items-center justify-center">
                  <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
                </div>
              ) : messages.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center text-center">
                  <MessageCircle className="h-12 w-12 text-gray-300" />
                  <p className="mt-3 text-gray-500">
                    No messages yet. Start the conversation!
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {messages.map((message) => (
                    <MessageBubble
                      key={message._id}
                      message={message}
                      isOwn={
                        message.senderId?._id === user?._id ||
                        message.senderId === user?._id
                      }
                    />
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              )}
            </div>

            {/* Message Input */}
            <form
              onSubmit={handleSendMessage}
              className="border-t border-gray-100 p-4"
            >
              <div className="flex items-center gap-3">
                <input
                  type="text"
                  placeholder="Type a message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  className="flex-1 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-900 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                <button
                  type="submit"
                  disabled={!newMessage.trim() || sending}
                  className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
                >
                  {sending ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <Send className="h-5 w-5" />
                  )}
                </button>
              </div>
            </form>
          </>
        ) : (
          <div className="flex h-full flex-col items-center justify-center text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gray-100">
              <MessageCircle className="h-10 w-10 text-gray-400" />
            </div>
            <h3 className="mt-4 text-lg font-semibold text-gray-900">
              Your Messages
            </h3>
            <p className="mt-1 max-w-xs text-gray-500">
              Select a conversation to start messaging or contact a landlord
              from a property page
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

/**
 * Message Bubble Component
 */
const MessageBubble = ({ message, isOwn }) => {
  const formatMessageTime = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <div className={`flex ${isOwn ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[70%] rounded-2xl px-4 py-2.5 ${
          isOwn ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-900"
        }`}
      >
        <p className="whitespace-pre-wrap break-words">{message.text}</p>
        <div
          className={`mt-1 flex items-center justify-end gap-1 text-xs ${
            isOwn ? "text-blue-100" : "text-gray-400"
          }`}
        >
          <span>{formatMessageTime(message.createdAt)}</span>
          {isOwn &&
            (message.readBy?.length > 1 ? (
              <CheckCheck className="h-3.5 w-3.5" />
            ) : (
              <Check className="h-3.5 w-3.5" />
            ))}
        </div>
      </div>
    </div>
  );
};

export default StudentMessages;
