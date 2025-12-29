import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { 
  Home, Send, Sparkles, MessageSquare, 
  Settings, User, ChevronLeft, Menu, Plus 
} from 'lucide-react';

// ✅ STEP 1: Cloud URL Hardcode karo (Localhost hatao)
const API_URL = "https://cneapee-backend-703598443794.asia-south1.run.app/api/chat";

export default function Chatbot({ onNavigate }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [history, setHistory] = useState([]);
  const [activeChatId, setActiveChatId] = useState(null); 
  const [usage, setUsage] = useState({ current: 0, limit: 0 });

  const messagesEndRef = useRef(null);

  // Load History
  useEffect(() => {
    fetchHistory();
  }, []);

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const fetchHistory = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return; // Token nahi hai to shant raho
      
      const { data } = await axios.get(`${API_URL}/history`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setHistory(data);
    } catch (error) {
      console.error("History Error");
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
      if (window.innerWidth < 768) setSidebarOpen(false);
    } catch (error) {
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

    // ✅ STEP 2: Token Check (Sabse Zaroori)
    const token = localStorage.getItem('token');
    
    // Agar Token nahi hai, to User ko batao aur roko (Null token nahi bhejenge)
    if (!token) {
        setMessages(prev => [...prev, { 
            role: 'assistant', 
            text: "⚠️ You are not logged in. Please Logout and Login again." 
        }]);
        return;
    }

    const userMsg = { role: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      // ✅ STEP 3: Cloud URL use karo
      const { data } = await axios.post(`${API_URL}/send`, 
        { prompt: userMsg.text, chatId: activeChatId },
        { headers: { Authorization: `Bearer ${token}` } } // Ab ye 'Bearer null' nahi hoga
      );

      setMessages(prev => [...prev, { role: 'assistant', text: data.reply }]);
      setUsage(data.usage);
      
      if (!activeChatId) {
        setActiveChatId(data.chatId);
        fetchHistory(); 
      }

    } catch (err) {
      console.error("Chat Error:", err);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        text: "❌ Error: AI connect nahi ho raha. Shayad Plan limit ya Server issue." 
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  // ... (Baaki UI code same rahega tera) ...
  return (
    <div className="flex h-screen bg-[#09090b] text-zinc-100 font-sans selection:bg-indigo-500/30 overflow-hidden">
      {/* SIDEBAR CODE SAME AS BEFORE */}
      <aside className={`${isSidebarOpen ? 'w-80 translate-x-0' : 'w-0 -translate-x-full'} fixed md:relative z-20 h-full transition-all duration-300 bg-[#0c0c0e] border-r border-white/5 flex flex-col`}>
        <div className="p-4 flex items-center justify-between border-b border-white/5">
          <button onClick={handleNewChat} className="flex-1 flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-all shadow-lg shadow-indigo-900/20">
            <Plus size={18}/> New Chat
          </button>
          <button onClick={() => setSidebarOpen(false)} className="md:hidden ml-2 p-2 hover:bg-white/5 rounded-lg">
            <ChevronLeft size={20}/>
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-3 space-y-1 scrollbar-thin scrollbar-thumb-zinc-800">
          <h3 className="px-3 py-2 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Recent</h3>
          {history.map(chat => (
            <button key={chat._id} onClick={() => loadChat(chat._id)} className={`w-full text-left p-3 rounded-xl text-sm transition-all flex items-center gap-3 group ${activeChatId === chat._id ? 'bg-white/10 text-white' : 'text-zinc-400 hover:bg-white/5 hover:text-white'}`}>
              <MessageSquare size={16} className={`shrink-0 ${activeChatId === chat._id ? 'text-indigo-400' : 'opacity-50'}`}/>
              <span className="truncate">{chat.title}</span>
            </button>
          ))}
        </div>
        <div className="p-4 border-t border-white/5 bg-zinc-900/50">
           <div className="bg-black/40 rounded-lg p-3 border border-white/5">
             <div className="flex justify-between text-[10px] mb-1.5 text-zinc-400 font-semibold uppercase"><span>Daily Usage</span><span>{usage.current}/{usage.limit || '∞'}</span></div>
             <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden"><div className="h-full bg-indigo-500" style={{ width: `${Math.min((usage.current / (usage.limit || 1)) * 100, 100)}%` }}/></div>
           </div>
        </div>
      </aside>

      {/* MAIN CHAT AREA */}
      <main className="flex-1 flex flex-col relative w-full h-full bg-[#09090b]">
        <header className="h-16 flex items-center justify-between px-4 md:px-6 border-b border-white/5 bg-[#09090b]/80 backdrop-blur-md z-10">
          <div className="flex items-center gap-3">
            {!isSidebarOpen && <button onClick={() => setSidebarOpen(true)} className="p-2 hover:bg-white/5 rounded-lg text-zinc-400"><Menu size={20}/></button>}
            <div className="flex items-center gap-2"><Sparkles size={18} className="text-indigo-500"/><span className="font-semibold text-lg tracking-tight">CNEAPEE AI</span></div>
          </div>
          <button onClick={() => onNavigate('home')} className="p-2 hover:bg-white/5 rounded-full text-zinc-400 hover:text-white transition"><Home size={20}/></button>
        </header>

        <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center opacity-60 mt-[-50px]">
              <h1 className="text-3xl font-bold text-white mb-3">Hello, Friend.</h1>
              <p className="max-w-md text-zinc-400">Ask CNEAPEE anything.</p>
            </div>
          ) : (
            messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] md:max-w-[70%] px-5 py-3.5 rounded-2xl text-[15px] leading-relaxed shadow-sm whitespace-pre-wrap ${msg.role === 'user' ? 'bg-indigo-600 text-white' : 'bg-zinc-800/50 border border-white/5 text-zinc-200'}`}>{msg.text}</div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="p-4 md:p-6 bg-gradient-to-t from-[#09090b] via-[#09090b] to-transparent z-10">
          <div className="max-w-3xl mx-auto relative">
            <input type="text" value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleSend())} placeholder="Message CNEAPEE AI..." className="w-full bg-[#18181b] border border-white/10 rounded-2xl py-4 pl-6 pr-14 focus:outline-none focus:border-indigo-500/50 text-white" disabled={isTyping} />
            <button onClick={handleSend} disabled={!input.trim() || isTyping} className="absolute right-2 top-2 p-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-500 transition-all"><Send size={20}/></button>
          </div>
        </div>
      </main>
    </div>
  );
}