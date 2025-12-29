import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import {
  Home, Send, Sparkles, MessageSquare, X, Image as ImageIcon
} from 'lucide-react';

// 🔗 Backend API
const API_URL = "https://cneapee-backend-703598443794.asia-south1.run.app/api/chat";

export default function Chatbot({ onNavigate }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [history, setHistory] = useState([]);
  const [activeChatId, setActiveChatId] = useState(null);
  const [showHistory, setShowHistory] = useState(false);

  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchHistory();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // 🔁 Fetch chat history
  const fetchHistory = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      const { data } = await axios.get(`${API_URL}/history`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setHistory(data);
    } catch (err) {
      console.error("History fetch failed");
    }
  };

  // 📂 Load previous chat
  const loadChat = async (chatId) => {
    try {
      setIsTyping(true);
      setActiveChatId(chatId);
      const token = localStorage.getItem('token');
      const { data } = await axios.get(`${API_URL}/${chatId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessages(data.messages);
      setIsTyping(false);
    } catch (err) {
      setIsTyping(false);
    }
  };

  // ✉️ Send message
  const handleSend = async () => {
    if (!input.trim()) return;
    const token = localStorage.getItem('token');

    const userMsg = { role: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      const { data } = await axios.post(
        `${API_URL}/send`,
        { prompt: userMsg.text, chatId: activeChatId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setMessages(prev => [...prev, { role: 'assistant', text: data.reply }]);

      if (!activeChatId) {
        setActiveChatId(data.chatId);
        fetchHistory();
      }
    } catch (err) {
      let errorText = "❌ Connection error.";
      if (err.response?.status === 429) {
        errorText = "⚠️ Usage limit reached.";
      }
      setMessages(prev => [...prev, { role: 'assistant', text: errorText }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex h-screen bg-[#050505] text-zinc-100 overflow-hidden">

      {/* HISTORY DRAWER */}
      {showHistory && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm">
          <div className="absolute right-0 top-0 h-full w-[320px] bg-[#0c0c0e] border-l border-white/5 p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold">Chat History</h3>
              <button onClick={() => setShowHistory(false)} className="text-zinc-400 hover:text-white">
                <X size={20} />
              </button>
            </div>

            <div className="space-y-1 overflow-y-auto h-full pr-1">
              {history.length === 0 && (
                <p className="text-zinc-500 text-xs italic">No history yet.</p>
              )}

              {history.map(chat => (
                <button
                  key={chat._id}
                  onClick={() => {
                    loadChat(chat._id);
                    setShowHistory(false);
                  }}
                  className="w-full text-left p-3 rounded-xl text-sm text-zinc-400 hover:bg-white/5 hover:text-white transition"
                >
                  {chat.title}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* MAIN */}
      <main className="flex-1 flex flex-col">

        {/* HEADER */}
        <header className="h-16 flex items-center justify-between px-4 border-b border-white/5 bg-[#050505]/80 backdrop-blur-md">
          <div className="flex items-center gap-2">
            <Sparkles size={18} className="text-indigo-500" />
            <span className="font-bold text-lg">CNEAPEE AI</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowHistory(true)}
              className="p-2 hover:bg-white/5 rounded-lg text-zinc-400 hover:text-white"
            >
              <MessageSquare size={20} />
            </button>
            <button
              onClick={() => onNavigate('home')}
              className="p-2 hover:bg-white/5 rounded-lg text-zinc-400 hover:text-white"
            >
              <Home size={20} />
            </button>
          </div>
        </header>

        {/* MESSAGES */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center">
              <Sparkles size={32} className="text-indigo-500 mb-4" />
              <h1 className="text-3xl font-bold mb-2">Hello, Friend.</h1>
              <p className="text-zinc-500 text-sm">
                I am optimized to be concise. Ask me anything.
              </p>
            </div>
          ) : (
            messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[75%] px-5 py-3 rounded-2xl text-sm whitespace-pre-wrap
                    ${msg.role === 'user'
                      ? 'bg-indigo-600 text-white rounded-br-none'
                      : 'bg-[#18181b] border border-white/10 rounded-bl-none'
                    }`}
                >
                  {msg.text}
                </div>
              </div>
            ))
          )}

          {isTyping && (
            <div className="flex justify-start animate-pulse">
              <div className="bg-[#18181b] px-4 py-3 rounded-2xl rounded-bl-none">
                typing…
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* INPUT */}
        <div className="p-4 border-t border-white/5">
          <div className="max-w-3xl mx-auto relative">

            {/* Image Upload */}
            <button
              onClick={() => fileInputRef.current.click()}
              className="absolute left-3 top-3 text-zinc-400 hover:text-white"
            >
              <ImageIcon size={20} />
            </button>

            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              hidden
              onChange={(e) => console.log("Image selected:", e.target.files[0])}
            />

            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Message CNEAPEE AI..."
              className="w-full bg-[#0e0e11] border border-white/10 rounded-2xl py-4 pl-12 pr-14 focus:outline-none focus:border-indigo-500 text-white"
              disabled={isTyping}
            />

            <button
              onClick={handleSend}
              disabled={!input.trim() || isTyping}
              className="absolute right-3 top-3 bg-indigo-600 hover:bg-indigo-500 text-white p-2 rounded-xl disabled:opacity-50"
            >
              <Send size={18} />
            </button>
          </div>

          <p className="text-center text-[10px] text-zinc-600 mt-2">
            AI can make mistakes. Verify important info.
          </p>
        </div>

      </main>
    </div>
  );
}
