import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { 
  Home, Send, Sparkles, MessageSquare, 
  Settings, User, ChevronLeft, Menu, Plus 
} from 'lucide-react';

// 👇 LOCALHOST KE LIYE YE URL SAHI HAI. 
// JAB DEPLOY KAROGE TO ISSE CLOUD RUN URL SE REPLACE KAR DENA.
const API_URL = "http://localhost:5000/api/chat";

export default function Chatbot({ onNavigate }) {
  // --- STATE MANAGEMENT ---
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [history, setHistory] = useState([]);
  const [activeChatId, setActiveChatId] = useState(null); 
  const [usage, setUsage] = useState({ current: 0, limit: 0 });

  const messagesEndRef = useRef(null);

  // 1. Load History on Mount
  useEffect(() => {
    fetchHistory();
  }, []);

  // 2. Scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // --- API FUNCTIONS ---
  
  const fetchHistory = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      
      const { data } = await axios.get(`${API_URL}/history`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setHistory(data);
    } catch (error) {
      console.error("History Error", error);
    }
  };

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
      if (window.innerWidth < 768) setSidebarOpen(false); // Mobile pe sidebar close
    } catch (error) {
      console.error("Load Chat Error", error);
      setIsTyping(false);
    }
  };

  const handleNewChat = () => {
    setActiveChatId(null);
    setMessages([]);
    setInput('');
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    // Optimistic Update (Turant UI me dikhao)
    const userMsg = { role: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      const token = localStorage.getItem('token');
      
      const { data } = await axios.post(`${API_URL}/send`, 
        { prompt: userMsg.text, chatId: activeChatId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // AI Response Update
      setMessages(prev => [...prev, { role: 'assistant', text: data.reply }]);
      setUsage(data.usage);
      
      // Agar ye nayi chat thi, to ID set karo aur history refresh karo
      if (!activeChatId) {
        setActiveChatId(data.chatId);
        fetchHistory(); 
      }

    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        text: err.response?.data?.message || "❌ Connection Error. Backend start hai na?" 
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex h-screen bg-[#09090b] text-zinc-100 font-sans selection:bg-indigo-500/30 overflow-hidden">
      
      {/* --- SIDEBAR --- */}
      <aside className={`${isSidebarOpen ? 'w-80 translate-x-0' : 'w-0 -translate-x-full'} fixed md:relative z-20 h-full transition-all duration-300 bg-[#0c0c0e] border-r border-white/5 flex flex-col`}>
        
        {/* Sidebar Header */}
        <div className="p-4 flex items-center justify-between border-b border-white/5">
          <button onClick={handleNewChat} className="flex-1 flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-all shadow-lg shadow-indigo-900/20">
            <Plus size={18}/> New Chat
          </button>
          <button onClick={() => setSidebarOpen(false)} className="md:hidden ml-2 p-2 hover:bg-white/5 rounded-lg">
            <ChevronLeft size={20}/>
          </button>
        </div>
        
        {/* Chat History List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-1 scrollbar-thin scrollbar-thumb-zinc-800">
          <h3 className="px-3 py-2 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Recent</h3>
          {history.length === 0 && <p className="text-zinc-600 text-xs px-3">No recent chats</p>}
          {history.map(chat => (
            <button 
              key={chat._id} 
              onClick={() => loadChat(chat._id)}
              className={`w-full text-left p-3 rounded-xl text-sm transition-all flex items-center gap-3 group
                ${activeChatId === chat._id ? 'bg-white/10 text-white' : 'text-zinc-400 hover:bg-white/5 hover:text-white'}
              `}
            >
              <MessageSquare size={16} className={`shrink-0 ${activeChatId === chat._id ? 'text-indigo-400' : 'opacity-50'}`}/>
              <span className="truncate">{chat.title}</span>
            </button>
          ))}
        </div>

        {/* Usage Stats Footer */}
        <div className="p-4 border-t border-white/5 bg-zinc-900/50">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400">
              <User size={16}/>
            </div>
            <div>
              <p className="text-sm font-medium text-white">My Plan</p>
              <p className="text-xs text-zinc-500">Free Tier</p>
            </div>
          </div>
          
          <div className="bg-black/40 rounded-lg p-3 border border-white/5">
            <div className="flex justify-between text-[10px] mb-1.5 text-zinc-400 font-semibold uppercase">
              <span>Daily Usage</span>
              <span className={usage.current >= usage.limit ? "text-red-400" : "text-indigo-400"}>
                {usage.current} / {usage.limit || '∞'}
              </span>
            </div>
            <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
              <div 
                className={`h-full transition-all duration-500 ${usage.current >= usage.limit ? 'bg-red-500' : 'bg-indigo-500'}`}
                style={{ width: `${Math.min((usage.current / (usage.limit || 1)) * 100, 100)}%` }}
              />
            </div>
          </div>
        </div>
      </aside>

      {/* --- MAIN CHAT AREA --- */}
      <main className="flex-1 flex flex-col relative w-full h-full bg-[#09090b]">
        
        {/* Top Navbar */}
        <header className="h-16 flex items-center justify-between px-4 md:px-6 border-b border-white/5 bg-[#09090b]/80 backdrop-blur-md z-10">
          <div className="flex items-center gap-3">
            {!isSidebarOpen && (
              <button onClick={() => setSidebarOpen(true)} className="p-2 hover:bg-white/5 rounded-lg text-zinc-400">
                <Menu size={20}/>
              </button>
            )}
            <div className="flex items-center gap-2">
              <Sparkles size={18} className="text-indigo-500"/>
              <span className="font-semibold text-lg tracking-tight">CNEAPEE <span className="text-zinc-500 font-normal">AI</span></span>
            </div>
          </div>
          <button onClick={() => onNavigate('home')} className="p-2 hover:bg-white/5 rounded-full text-zinc-400 hover:text-white transition">
            <Home size={20}/>
          </button>
        </header>

        {/* Messages Container */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center opacity-60 mt-[-50px]">
              <div className="w-20 h-20 bg-gradient-to-tr from-indigo-500/20 to-purple-500/10 rounded-3xl flex items-center justify-center mb-6 border border-white/5 shadow-2xl shadow-indigo-500/10">
                <Sparkles size={40} className="text-indigo-400"/>
              </div>
              <h1 className="text-3xl font-bold text-white mb-3">Hello, Sanskriti.</h1>
              <p className="max-w-md text-zinc-400">I'm ready to help you build CNEAPEE. Ask me about code, design, or strategy.</p>
            </div>
          ) : (
            messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2`}>
                <div className={`max-w-[85%] md:max-w-[70%] flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                  {/* Avatar */}
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border mt-1
                    ${msg.role === 'user' ? 'bg-indigo-600 border-indigo-400 text-white' : 'bg-zinc-800 border-white/10 text-indigo-400'}`}>
                    {msg.role === 'user' ? <User size={16}/> : <Sparkles size={16}/>}
                  </div>
                  
                  {/* Bubble */}
                  <div className={`px-5 py-3.5 rounded-2xl text-[15px] leading-relaxed shadow-sm whitespace-pre-wrap
                    ${msg.role === 'user' 
                      ? 'bg-indigo-600 text-white rounded-tr-sm' 
                      : 'bg-zinc-800/50 border border-white/5 text-zinc-200 rounded-tl-sm'}`}>
                    {msg.text}
                  </div>
                </div>
              </div>
            ))
          )}
          
          {isTyping && (
            <div className="flex justify-start gap-4">
               <div className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center shrink-0"><Sparkles size={16} className="text-indigo-400"/></div>
               <div className="bg-zinc-800/50 border border-white/5 px-4 py-3 rounded-2xl flex items-center gap-1">
                  <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce"/>
                  <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce [animation-delay:0.2s]"/>
                  <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce [animation-delay:0.4s]"/>
               </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 md:p-6 bg-gradient-to-t from-[#09090b] via-[#09090b] to-transparent z-10">
          <div className="max-w-3xl mx-auto relative">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              // 👇 Prevent Default add kiya hai taaki page reload na ho
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleSend())}
              placeholder="Message CNEAPEE AI..."
              className="w-full bg-[#18181b] border border-white/10 rounded-2xl py-4 pl-6 pr-14 focus:outline-none focus:border-indigo-500/50 focus:bg-[#1c1c1f] transition-all text-white placeholder:text-zinc-600 shadow-xl"
              disabled={isTyping}
            />
            <button 
              onClick={handleSend}
              disabled={!input.trim() || isTyping}
              className="absolute right-2 top-2 p-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-500 disabled:opacity-50 disabled:hover:bg-indigo-600 transition-all"
            >
              <Send size={20}/>
            </button>
          </div>
          <p className="text-center text-[10px] text-zinc-600 mt-3">
             Gemini 2.5 Flash Lite can make mistakes. Check important info.
          </p>
        </div>
      </main>
    </div>
  );
}