import React, { useState, useRef, useEffect } from 'react';
import { ArrowRight, Cpu, Send, User, Sparkles } from 'lucide-react';

export default function Chatbot({ onBack }) {
  const [messages, setMessages] = useState([
    { role: 'assistant', text: 'Hello! I am Neuro+. How can I help you today?' }
  ]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;

    // Add User Message
    const userMsg = { role: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');

    // Simulate AI Response (Placeholder)
    setTimeout(() => {
      const aiMsg = { role: 'assistant', text: "I'm currently in demo mode. Connect me to a backend to get real responses!" };
      setMessages(prev => [...prev, aiMsg]);
    }, 1000);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSend();
  };

  return (
    <div className="flex h-screen bg-zinc-50 dark:bg-[#030305] text-zinc-800 dark:text-zinc-200 animate-fade-in font-sans">
      
      {/* Sidebar (Desktop Only) */}
      <aside className="w-64 border-r border-zinc-200 dark:border-white/10 p-4 hidden md:flex flex-col bg-white dark:bg-[#050507]">
        <button onClick={onBack} className="flex items-center gap-2 mb-8 hover:text-indigo-500 font-bold transition-colors">
          <ArrowRight className="rotate-180" size={18} /> Back to Home
        </button>
        
        <button 
          onClick={() => setMessages([{ role: 'assistant', text: 'Hello! I am Neuro+. How can I help you today?' }])}
          className="bg-indigo-600 hover:bg-indigo-700 text-white p-3 rounded-xl text-sm mb-6 font-medium shadow-md transition-all flex items-center justify-center gap-2"
        >
          <Cpu size={16} /> New Chat
        </button>
        
        <div className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-3">Recent History</div>
        <div className="space-y-1 flex-1 overflow-y-auto">
          {['Project Planning', 'Health tips & Diet', 'React Code Debug'].map((t, i) => (
            <div key={i} className="text-sm p-3 rounded-lg hover:bg-zinc-100 dark:hover:bg-white/5 cursor-pointer truncate transition-colors text-zinc-600 dark:text-zinc-400">
              {t}
            </div>
          ))}
        </div>
        
        <div className="text-xs text-zinc-500 mt-auto pt-4 border-t border-zinc-200 dark:border-white/10">
          Neuro 1.1 Model • Stable
        </div>
      </aside>

      {/* Main Chat Area */}
      <main className="flex-1 flex flex-col relative bg-white/50 dark:bg-[#030305]">
        
        {/* Mobile Header */}
        <div className="md:hidden p-4 border-b border-zinc-200 dark:border-white/10 flex items-center gap-3 bg-white dark:bg-[#030305] sticky top-0 z-10">
          <button onClick={onBack} className="p-1"><ArrowRight className="rotate-180" size={20} /></button>
          <span className="font-bold">Neuro+ AI</span>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex gap-4 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              
              {/* Avatar for AI */}
              {msg.role === 'assistant' && (
                <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center shrink-0 mt-1">
                  <Sparkles size={16} className="text-white" />
                </div>
              )}

              {/* Message Bubble */}
              <div className={`max-w-[80%] p-4 rounded-2xl text-sm leading-relaxed ${
                msg.role === 'user' 
                  ? 'bg-zinc-900 dark:bg-white text-white dark:text-black rounded-tr-none' 
                  : 'bg-white dark:bg-white/10 border border-zinc-200 dark:border-white/5 rounded-tl-none'
              }`}>
                {msg.text}
              </div>

              {/* Avatar for User */}
              {msg.role === 'user' && (
                <div className="w-8 h-8 rounded-lg bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center shrink-0 mt-1">
                  <User size={16} className="text-zinc-500" />
                </div>
              )}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 md:p-6 bg-white dark:bg-[#030305] border-t border-zinc-200 dark:border-white/5">
          <div className="max-w-3xl mx-auto relative">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Message Neuro..." 
              className="w-full bg-zinc-50 dark:bg-[#0A0A0C] border border-zinc-200 dark:border-white/10 rounded-full py-4 pl-6 pr-14 focus:ring-2 ring-indigo-500/50 outline-none shadow-sm dark:text-white transition-all placeholder:text-zinc-400" 
            />
            <button 
              onClick={handleSend}
              className="absolute right-2 top-2 bottom-2 aspect-square bg-indigo-600 rounded-full text-white hover:bg-indigo-700 transition flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!input.trim()}
            >
              <Send size={18} />
            </button>
          </div>
          <div className="text-center text-[10px] text-zinc-400 mt-3">
            Neuro can make mistakes. Consider checking important information.
          </div>
        </div>
      </main>
    </div>
  );
}