import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import {
  Home,
  Send,
  Sparkles,
  MessageSquare,
  X,
  Image as ImageIcon
} from 'lucide-react';

// 🔗 Backend API
const API_URL = "https://cneapee-backend-703598443794.asia-south1.run.app/api/chat";

// 🟣 DEFAULT GREETING
const DEFAULT_GREETING = {
  role: "assistant",
  text: "Hello 👋 This is CNEAPEE AI v1.2. You can ask me anything."
};

export default function Chatbot({ onNavigate }) {
  const [messages, setMessages] = useState([DEFAULT_GREETING]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [history, setHistory] = useState([]);
  const [activeChatId, setActiveChatId] = useState(null);
  const [showHistory, setShowHistory] = useState(false);

  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  /* ===========================
     AUTO SCROLL
  =========================== */
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  /* ===========================
     FETCH HISTORY ON LOAD
  =========================== */
  useEffect(() => {
    fetchHistory();
  }, []);

  /* ===========================
     FETCH HISTORY
  =========================== */
  const fetchHistory = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const { data } = await axios.get(`${API_URL}/history`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setHistory(data);
    } catch {
      console.log("History fetch failed");
    }
  };

  /* ===========================
     LOAD OLD CHAT
  =========================== */
  const loadChat = async (chatId) => {
    try {
      setIsTyping(true);
      setActiveChatId(chatId);

      const token = localStorage.getItem("token");
      const { data } = await axios.get(`${API_URL}/${chatId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setMessages(data.messages);
      setIsTyping(false);
    } catch {
      setIsTyping(false);
    }
  };

  /* ===========================
     NEW CHAT
  =========================== */
  const startNewChat = () => {
    setActiveChatId(null);
    setMessages([DEFAULT_GREETING]);
  };

  /* ===========================
     SEND MESSAGE
  =========================== */
  const handleSend = async () => {
    if (!input.trim()) return;

    const token = localStorage.getItem("token");
    const userText = input;

    setMessages(prev => [...prev, { role: "user", text: userText }]);
    setInput('');
    setIsTyping(true);

    try {
      const { data } = await axios.post(
        `${API_URL}/send`,
        { prompt: userText, chatId: activeChatId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setMessages(prev => [...prev, { role: "assistant", text: data.reply }]);

      if (!activeChatId) {
        setActiveChatId(data.chatId);
        fetchHistory();
      }
    } catch (err) {
      let msg = "❌ Connection error.";
      if (err.response?.status === 429) {
        msg = "⚠️ Usage limit reached.";
      }
      setMessages(prev => [...prev, { role: "assistant", text: msg }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex h-screen bg-[#050505] text-zinc-100 overflow-hidden">

      {/* HISTORY PANEL */}
      {showHistory && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm">
          <div className="absolute right-0 top-0 h-full w-[320px] bg-[#0c0c0e] border-l border-white/5 p-4">
            <div className="flex justify-between mb-4">
              <h3 className="text-sm font-bold">Chat History</h3>
              <button onClick={() => setShowHistory(false)}>
                <X size={18} />
              </button>
            </div>

            {history.map(chat => (
              <button
                key={chat._id}
                onClick={() => {
                  loadChat(chat._id);
                  setShowHistory(false);
                }}
                className="w-full text-left p-3 rounded-xl text-sm text-zinc-400 hover:bg-white/5"
              >
                {chat.title}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* MAIN */}
      <main className="flex-1 flex flex-col">

        {/* HEADER */}
        <header className="h-16 flex items-center justify-between px-4 border-b border-white/5">
          <div className="flex items-center gap-2">
            <Sparkles size={18} className="text-indigo-500" />
            <span className="font-bold">CNEAPEE AI</span>
          </div>

          <div className="flex gap-2">
            <button onClick={() => setShowHistory(true)}>
              <MessageSquare size={20} />
            </button>
            <button onClick={() => onNavigate("home")}>
              <Home size={20} />
            </button>
          </div>
        </header>

        {/* MESSAGES */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`px-4 py-2 rounded-xl max-w-[75%]
                ${m.role === "user"
                  ? "bg-indigo-600 text-white"
                  : "bg-[#18181b] border border-white/10"}`}>
                {m.text}
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="text-zinc-500 text-sm">typing…</div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* INPUT */}
        <div className="p-4 border-t border-white/5">
          <div className="relative max-w-3xl mx-auto">
            <button
              onClick={() => fileInputRef.current.click()}
              className="absolute left-3 top-3 text-zinc-400"
            >
              <ImageIcon size={20} />
            </button>

            <input
              type="file"
              ref={fileInputRef}
              hidden
            />

            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Message CNEAPEE AI..."
              className="w-full bg-[#0e0e11] rounded-xl py-3 pl-12 pr-14 border border-white/10"
            />

            <button
              onClick={handleSend}
              className="absolute right-3 top-3 bg-indigo-600 p-2 rounded-lg"
            >
              <Send size={16} />
            </button>
          </div>
        </div>

      </main>
    </div>
  );
}
