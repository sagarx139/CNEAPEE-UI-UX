import React, { useState, useRef, useEffect } from 'react';
import config from './config';
import { 
  Home as HomeIcon, ChevronDown, Send, Sparkles, 
  Paperclip, Mic, Trash2, Check, X, 
  Gift, Snowflake, Trees
} from 'lucide-react';

// --- SNOW COMPONENT (Simplified for Chat) ---
const ChatSnow = () => (
  <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
    {[...Array(20)].map((_, i) => (
      <div 
        key={i}
        className="absolute bg-white rounded-full opacity-30 animate-fall"
        style={{
          left: `${Math.random() * 100}%`,
          top: -10,
          width: `${Math.random() * 4 + 2}px`,
          height: `${Math.random() * 4 + 2}px`,
          animationDuration: `${Math.random() * 10 + 5}s`,
          animationDelay: `-${Math.random() * 5}s`
        }}
      />
    ))}
    <style>{`
      @keyframes fall {
        to { transform: translateY(100vh); }
      }
      .animate-fall { animation: fall linear infinite; }
    `}</style>
  </div>
);

export default function Chatbot({ onNavigate }) {
  // --- STATE ---
  const [messages, setMessages] = useState([
    { id: 1, role: 'assistant', text: "Ho ho ho! I'm Flare+ (Holiday Edition). I'm ready to help you wrap up your tasks." }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [model, setModel] = useState('Flare 0.5 Holiday');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  // --- REFS ---
  const messagesEndRef = useRef(null);
  const containerRef = useRef(null);
  const dropdownRef = useRef(null);

  // --- SCROLL LOGIC ---
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // --- SPOTLIGHT EFFECT ---
  const handleMouseMove = (e) => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      containerRef.current.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
      containerRef.current.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
    }
  };

  // --- HANDLERS ---
  const handleSend = () => {
    if (!input.trim()) return;
    const userMsg = { id: Date.now(), role: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true); 

    // Simulate AI Response
    setTimeout(() => {
      setIsTyping(false);
      setMessages(prev => [...prev, { 
        id: Date.now() + 1, 
        role: 'assistant', 
        text: "Checking my list twice... here is the information you requested." 
      }]);
    }, 2000);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  return (
    <div 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="flex flex-col h-screen bg-[#050507] text-zinc-300 font-sans overflow-hidden relative selection:bg-red-500/30"
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');
        .font-sans { font-family: 'Plus Jakarta Sans', sans-serif; }
        
        /* Festive Spotlight */
        .spotlight-bg {
          background: radial-gradient(600px circle at var(--mouse-x) var(--mouse-y), rgba(220, 38, 38, 0.08), transparent 40%);
        }

        /* Holiday Aurora Wave Animation */
        .neural-wave {
          position: fixed;
          bottom: -100px;
          left: 0;
          right: 0;
          height: 300px;
          /* Red and Green Gradient */
          background: linear-gradient(180deg, transparent, rgba(220, 38, 38, 0.15), rgba(22, 163, 74, 0.2));
          filter: blur(60px);
          opacity: 0;
          transition: opacity 1s ease, transform 1s ease;
          transform: translateY(100px) scaleY(0.5);
          z-index: 10;
          pointer-events: none;
        }

        .neural-wave.active {
          opacity: 1;
          transform: translateY(0) scaleY(1);
          animation: pulseWave 4s infinite alternate;
        }

        @keyframes pulseWave {
          0% { filter: blur(60px) hue-rotate(0deg); }
          50% { filter: blur(70px) hue-rotate(20deg); } 
          100% { filter: blur(80px) hue-rotate(-20deg); }
        }

        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #333; border-radius: 10px; }
      `}</style>

      {/* --- BACKGROUNDS --- */}
      <div className="absolute inset-0 pointer-events-none spotlight-bg z-0" />
      <div className="fixed inset-0 opacity-[0.03] z-0 pointer-events-none" 
           style={{ backgroundImage: `linear-gradient(#333 1px, transparent 1px), linear-gradient(90deg, #333 1px, transparent 1px)`, backgroundSize: '40px 40px' }} />
      
      {/* Background Snow for Chat */}
      <ChatSnow />

      {/* --- THE AURORA WAVE (Activates when isTyping is true) --- */}
      <div className={`neural-wave ${isTyping ? 'active' : ''}`} />

      {/* --- NAVBAR --- */}
      <nav className="fixed top-6 left-0 right-0 z-50 flex justify-center px-4">
        <div className="backdrop-blur-xl bg-zinc-900/80 border border-white/10 rounded-full p-1.5 flex items-center gap-1 shadow-2xl">
          <button onClick={() => onNavigate('home')} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/10 text-zinc-400 hover:text-white transition">
            <HomeIcon size={18} />
          </button>

          <div className="w-px h-4 mx-1 bg-white/10" />

          {/* Model Selector */}
          <div className="relative" ref={dropdownRef}>
            <button 
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-2 px-4 py-2 rounded-full hover:bg-white/5 text-white transition min-w-[140px] justify-between text-sm font-semibold"
            >
              <span className="flex items-center gap-2 text-red-400">
                <Gift size={14} className="animate-bounce" /> {model}
              </span>
              <ChevronDown size={14} className="opacity-60" />
            </button>
            {isDropdownOpen && (
              <div className="absolute top-full left-0 mt-2 w-52 bg-zinc-900 border border-white/10 rounded-2xl shadow-xl p-1.5 z-50 animate-in fade-in zoom-in duration-200">
                {['Flare 0.5 Holiday', 'Flare Frost Ace'].map((m) => (
                  <button key={m} onClick={() => { setModel(m); setIsDropdownOpen(false); }} className="w-full text-left px-3 py-2 rounded-xl text-sm font-medium text-zinc-400 hover:bg-white/5 hover:text-white transition flex justify-between">
                    {m} {model === m && <Check size={14} className="text-red-500" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="w-px h-4 mx-1 bg-white/10" />
          <button onClick={() => setMessages([])} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/10 text-zinc-400 hover:text-red-400 transition">
            <Trash2 size={16} />
          </button>
        </div>
      </nav>

      {/* --- CHAT AREA --- */}
      <main className="flex-1 overflow-y-auto pt-28 pb-4 px-4 z-20">
        <div className="max-w-3xl mx-auto space-y-6">
          {messages.length === 0 && (
            <div className="text-center py-20 opacity-50">
              <div className="w-16 h-16 mx-auto bg-red-500/10 rounded-2xl flex items-center justify-center mb-4 border border-red-500/20">
                <Snowflake size={32} className="text-red-400 animate-spin-slow" />
              </div>
              <p className="text-lg font-medium text-zinc-400">Holiday System Ready.</p>
            </div>
          )}

          {messages.map((msg) => (
            <div key={msg.id} className={`flex gap-4 animate-in fade-in slide-in-from-bottom-2 duration-300 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] px-5 py-3.5 rounded-2xl text-[15px] leading-relaxed shadow-sm backdrop-blur-sm
                ${msg.role === 'user' 
                  ? 'bg-red-600 text-white rounded-tr-none shadow-red-500/20' 
                  : 'bg-zinc-800/80 border border-white/5 text-zinc-200 rounded-tl-none'
                }`}>
                {msg.text}
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex gap-4 justify-start animate-pulse">
              <div className="bg-zinc-800/80 border border-white/5 px-4 py-3 rounded-2xl rounded-tl-none flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-bounce delay-0" />
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-bounce delay-150" />
                <div className="w-1.5 h-1.5 bg-white rounded-full animate-bounce delay-300" />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} className="h-4" />
        </div>
      </main>

      {/* --- INPUT AREA --- */}
      <footer className="p-4 z-30">
        <div className="max-w-3xl mx-auto">
          <div className="relative flex items-end gap-2 p-2 rounded-[28px] border border-white/10 bg-zinc-900/90 shadow-2xl backdrop-blur-xl focus-within:border-red-500/50 transition-colors">
            
            <button className="p-3 rounded-full text-zinc-400 hover:text-white hover:bg-white/10 transition shrink-0">
              <Paperclip size={20} />
            </button>

            <textarea
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                e.target.style.height = 'auto';
                e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px';
              }}
              onKeyDown={handleKeyDown}
              placeholder="Ask Cneapee for holiday plans..."
              className="w-full bg-transparent border-none outline-none resize-none py-3.5 max-h-[120px] text-[15px] placeholder:text-zinc-500 text-white"
              rows={1}
            />

            {input.trim() ? (
              <button onClick={handleSend} className="p-3 rounded-full bg-red-600 text-white hover:bg-red-500 transition shrink-0 shadow-lg shadow-red-500/20">
                <Send size={18} />
              </button>
            ) : (
              <button className="p-3 rounded-full text-zinc-400 hover:text-white hover:bg-white/10 transition shrink-0">
                <Mic size={20} />
              </button>
            )}
          </div>
          <p className="text-center text-[10px] text-zinc-600 mt-3 flex items-center justify-center gap-1">
             Flare can make mistakes. <Trees size={10} /> Happy Holidays.
          </p>
        </div>
      </footer>

      <style>{`
        .animate-spin-slow { animation: spin 8s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}