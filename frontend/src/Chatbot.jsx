import React, { useState, useRef, useEffect, memo } from 'react';
import axios from 'axios';
import {
  Menu,
  Plus,
  MessageSquare,
  Send,
  Mic,
  X,
  Sparkles,
  ChevronDown,
  PanelLeftClose,
  PanelLeftOpen,
  Copy,
  Check,
  Moon,
  Sun,
  Volume2,
  RotateCcw,
  StopCircle,
  Code,
  Home
} from 'lucide-react';

/* =========================================
   CONFIG
   ========================================= */
const API_URL = "https://cneapee-backend-703598443794.asia-south1.run.app/api/chat";

/* =========================================
   HELPER: TEXT FORMATTER & PARSING
   ========================================= */

const CodeBlock = ({ language, code }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="my-4 rounded-lg overflow-hidden border border-zinc-700/50 bg-[#1e1e1e] shadow-sm max-w-full">
      <div className="flex items-center justify-between px-4 py-2 bg-[#2d2d2d] border-b border-zinc-700/50">
        <span className="text-xs font-mono text-zinc-400 lowercase">{language || 'code'}</span>
        <button 
          onClick={handleCopy} 
          className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white transition-colors"
        >
           {copied ? <Check size={12} className="text-green-500" /> : <Copy size={12} />}
           <span>{copied ? 'Copied' : 'Copy code'}</span>
        </button>
      </div>
      <div className="p-4 overflow-x-auto touch-scroll">
        <pre className="text-sm font-mono text-zinc-300 whitespace-pre">
          <code>{code}</code>
        </pre>
      </div>
    </div>
  );
};

const formatBoldText = (text) => {
  if (!text) return null;
  const str = String(text);
  
  const parts = str.split(/(\*\*[\s\S]*?\*\*)/g);
  
  return parts.map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**') && part.length >= 4) {
      return <strong key={index} className="font-bold text-zinc-100">{part.slice(2, -2)}</strong>;
    }
    return <span key={index}>{part}</span>;
  });
};

const MessageContentRenderer = ({ text }) => {
  // Defensive: Force string type to prevent "Objects are not valid" error
  let safeText = "";
  if (typeof text === 'string') safeText = text;
  else if (typeof text === 'number') safeText = String(text);
  else if (text && typeof text === 'object') safeText = JSON.stringify(text, null, 2);
  else safeText = "";

  const codeBlockRegex = /```(\w*)\n?([\s\S]*?)```/g;
  const parts = [];
  let lastIndex = 0;
  let match;

  while ((match = codeBlockRegex.exec(safeText)) !== null) {
    if (match.index > lastIndex) {
      parts.push({ type: 'text', content: safeText.slice(lastIndex, match.index) });
    }
    parts.push({ type: 'code', language: match[1], content: match[2] });
    lastIndex = match.index + match[0].length;
  }
  if (lastIndex < safeText.length) {
    parts.push({ type: 'text', content: safeText.slice(lastIndex) });
  }

  return (
    <>
      {parts.map((part, idx) => {
        if (part.type === 'code') {
          return <CodeBlock key={idx} language={part.language} code={part.content} />;
        }
        return <span key={idx} className="whitespace-pre-wrap break-words">{formatBoldText(part.content)}</span>;
      })}
    </>
  );
};

/* =========================================
   COMPONENT: MESSAGE ITEM
   ========================================= */
const ChatMessage = memo(({ msg, onRegenerate }) => {
  const isUser = msg.role === 'user';
  const [copied, setCopied] = useState(false);
  const [speaking, setSpeaking] = useState(false);

  const handleCopy = () => {
    const textToCopy = typeof msg.text === 'string' ? msg.text : JSON.stringify(msg.text || "");
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReadAloud = () => {
    if (speaking) {
        window.speechSynthesis.cancel();
        setSpeaking(false);
        return;
    }
    const cleanText = typeof msg.text === 'string' 
      ? msg.text.replace(/\*\*/g, '').replace(/```[\s\S]*?```/g, 'Code block included.') 
      : '';
      
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.onend = () => setSpeaking(false);
    setSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className={`group flex w-full mb-6 ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`flex max-w-[95%] md:max-w-[85%] gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
        
        <div className={`flex flex-col min-w-0 w-full ${isUser ? 'items-end' : 'items-start'}`}>
            
          {msg.image && (
            <div className="mb-2 rounded-xl overflow-hidden border border-zinc-700/50 bg-[#1e1e1e]">
              <img src={msg.image} alt="Upload" className="max-h-64 max-w-full object-contain" />
            </div>
          )}

          <div className={`relative px-4 py-3 text-[15px] leading-7 font-sans
            ${isUser 
              ? 'bg-[#2f2f2f] text-white rounded-[22px] rounded-tr-md' 
              : 'text-zinc-800 dark:text-zinc-100 px-0 w-full' 
            }
          `}>
            <MessageContentRenderer text={msg.text} />

            {isUser && (
                <button 
                    onClick={handleCopy}
                    className="absolute top-1/2 -translate-y-1/2 -left-10 p-2 text-zinc-400 hover:text-zinc-200 opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Copy"
                >
                    {copied ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
                </button>
            )}
          </div>

          {!isUser && (
              <div className="flex items-center gap-1 mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <button 
                      onClick={handleCopy} 
                      className="p-1.5 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 rounded-md hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
                      title="Copy Response"
                  >
                      {copied ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
                  </button>
                  
                  <button 
                      onClick={handleReadAloud}
                      className={`p-1.5 rounded-md hover:bg-black/5 dark:hover:bg-white/10 transition-colors ${speaking ? 'text-indigo-500' : 'text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200'}`}
                      title={speaking ? "Stop" : "Read Aloud"}
                  >
                      {speaking ? <StopCircle size={14} /> : <Volume2 size={14} />}
                  </button>

                  <button 
                      onClick={onRegenerate}
                      className="p-1.5 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 rounded-md hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
                      title="Regenerate Response"
                  >
                      <RotateCcw size={14} />
                  </button>
              </div>
          )}
        </div>
      </div>
    </div>
  );
});

/* =========================================
   MAIN CHATBOT COMPONENT (No Router Deps)
   ========================================= */
export default function Chatbot() {
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) return savedTheme;
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return 'dark';
    }
    return 'light';
  });

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isSidebarOpen, setSidebarOpen] = useState(false); 
  const [history, setHistory] = useState([]);
  const [activeChatId, setActiveChatId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  
  const [showVersionPopup, setShowVersionPopup] = useState(false);

  // Fix: Add a ref to track if the initial prompt has been processed
  const hasProcessedPrompt = useRef(false);

  const bottomRef = useRef(null);
  const fileInputRef = useRef(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
      setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  // --- 1. INITIAL LOAD & PROMPT HANDLING (Native History API) ---
  useEffect(() => {
    // Access state directly from window.history
    const historyState = window.history.state;
    const initialPrompt = historyState?.usr?.initialPrompt || historyState?.initialPrompt; // Handle both React Router and Native formats

    if (initialPrompt && !hasProcessedPrompt.current) {
        hasProcessedPrompt.current = true;
        handleSend(initialPrompt);
        
        // Clear state safely
        const newState = { ...historyState };
        if (newState.usr) delete newState.usr.initialPrompt;
        delete newState.initialPrompt;
        window.history.replaceState(newState, document.title); 
    }
    fetchHistory();
  }, []);

  useEffect(() => {
    if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
        textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 150) + 'px';
    }
  }, [input]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const fetchHistory = async () => {
    try {
        const token = localStorage.getItem('token');
        if(!token) { setHistory([]); return; }
        const res = await axios.get(`${API_URL}/history`, { headers: { Authorization: `Bearer ${token}` } });
        if (Array.isArray(res.data)) {
            setHistory(res.data);
        } else {
            console.warn("History response is not an array");
            setHistory([]);
        }
    } catch (e) { setHistory([]); }
  };

  const loadChat = async (chatId) => {
      setActiveChatId(chatId);
      if (window.innerWidth < 768) setSidebarOpen(false);
      
      try {
          const token = localStorage.getItem('token');
          const res = await axios.get(`${API_URL}/${chatId}`, { headers: { Authorization: `Bearer ${token}` } });
          if(res.data && res.data.messages) {
              setMessages(res.data.messages);
          }
      } catch (error) {
          console.error("Failed to load chat", error);
      }
  };

  const startNewChat = () => {
      setMessages([]);
      setActiveChatId(null);
      if (window.innerWidth < 768) setSidebarOpen(false);
  };

  const handleImageSelect = (e) => {
      const file = e.target.files[0];
      if (file) {
          const reader = new FileReader();
          reader.onload = (ev) => {
              setImagePreview(ev.target.result); 
              setSelectedImage(ev.target.result); 
          };
          reader.readAsDataURL(file);
      }
  };

  const handleSend = async (textOverride) => {
      const text = typeof textOverride === 'string' ? textOverride : input;
      
      if ((!text || !text.trim()) && !selectedImage) return;

      const newMsg = { role: 'user', text: text, image: imagePreview };
      setMessages(prev => [...prev, newMsg]);
      
      setInput('');
      setImagePreview(null);
      
      const currentImage = selectedImage;
      setSelectedImage(null);
      
      setLoading(true);

      try {
          const token = localStorage.getItem('token');
          const res = await axios.post(
              `${API_URL}/send`, 
              { 
                  prompt: text, 
                  image: currentImage, 
                  chatId: activeChatId 
              },
              { headers: { Authorization: `Bearer ${token}` } }
          );

          const aiResponse = { 
              role: 'assistant', 
              text: res.data.reply || "" // Ensure string
          };
          setMessages(prev => [...prev, aiResponse]);

          if (res.data.chatId && !activeChatId) {
              setActiveChatId(res.data.chatId);
              fetchHistory();
          }

      } catch (error) {
          console.error("Error sending message:", error);
          const errorMsg = error.response?.status === 401 
              ? "Session expired. Please login again." 
              : "Connection error. Please check your internet or try again.";
              
          setMessages(prev => [...prev, { 
              role: 'assistant', 
              text: `❌ ${errorMsg}` 
          }]);
      } finally {
          setLoading(false);
      }
  };

  const handleRegenerate = () => {
      const lastUserMsg = [...messages].reverse().find(m => m.role === 'user');
      if (lastUserMsg) {
          if (messages[messages.length - 1].role === 'assistant') {
              setMessages(prev => prev.slice(0, -1));
          }
          handleSend(lastUserMsg.text);
      }
  };

  const goToHome = () => {
      window.location.href = '/'; // Native Navigation
  };

  return (
    <div className={`flex h-[100dvh] supports-[height:100svh]:h-[100svh] font-sans overflow-hidden transition-colors duration-300 ${theme === 'dark' ? 'bg-[#131314] text-zinc-100' : 'bg-white text-zinc-900'}`}>
      
      {/* --- VERSION POPUP --- */}
      {showVersionPopup && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in p-4">
            <div className={`p-6 rounded-2xl shadow-2xl max-w-sm w-full transform scale-100 transition-all border
                ${theme === 'dark' ? 'bg-[#1e1e20] border-zinc-700' : 'bg-white border-zinc-200'}`}>
                <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-2">
                        <Sparkles className="text-indigo-500" size={20} />
                        <h3 className="text-lg font-bold">Coming Soon</h3>
                    </div>
                    <button onClick={() => setShowVersionPopup(false)} className="text-zinc-500 hover:text-zinc-800 dark:hover:text-white">
                        <X size={20} />
                    </button>
                </div>
                <p className={`mb-4 text-sm ${theme === 'dark' ? 'text-zinc-300' : 'text-zinc-600'}`}>
                    <strong>v1.8 Flow</strong> is currently in development. Expect enhanced reasoning capabilities and UI improvements shortly.
                </p>
                <button 
                    onClick={() => setShowVersionPopup(false)}
                    className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-medium transition-colors"
                >
                    Got it
                </button>
            </div>
        </div>
      )}

      {isSidebarOpen && (
        <div 
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside className={`
        fixed md:relative z-50 h-full w-[280px] flex flex-col transition-all duration-300 ease-in-out transform border-r
        ${theme === 'dark' ? 'bg-[#1e1f20] border-white/5' : 'bg-[#f9f9f9] border-zinc-200'}
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:w-0 md:-translate-x-0 md:overflow-hidden'}
      `}>
         <div className="p-4 flex items-center justify-between">
            <button 
                onClick={() => setSidebarOpen(false)} 
                className={`p-2 rounded-full transition-colors ${theme === 'dark' ? 'hover:bg-[#2f2f2f] text-zinc-400' : 'hover:bg-zinc-200 text-zinc-600'}`}
                title="Close Sidebar"
            >
                <PanelLeftClose size={20} />
            </button>
            <div className={`flex items-center gap-2 px-2 font-medium ${theme === 'dark' ? 'text-zinc-300' : 'text-zinc-700'}`}>
                <span className="tracking-wide text-sm">History</span>
            </div>
         </div>

         <div className="px-4 pb-2">
            <button 
                onClick={startNewChat}
                className={`w-full flex items-center gap-3 p-3 rounded-[18px] text-sm font-medium transition-colors border
                ${theme === 'dark' 
                    ? 'bg-[#1e1f20] hover:bg-[#333537] text-[#e3e3e3] border-transparent hover:border-zinc-700' 
                    : 'bg-white hover:bg-zinc-100 text-zinc-800 border-zinc-200 shadow-sm'}`}
            >
                <Plus size={18} className={theme === 'dark' ? "text-zinc-400" : "text-zinc-500"} />
                <span>New chat</span>
            </button>
         </div>

         <div className="flex-1 overflow-y-auto px-2 py-2 space-y-1 scrollbar-thin scrollbar-thumb-zinc-700">
            <div className={`px-4 py-2 text-xs font-semibold ${theme === 'dark' ? 'text-zinc-500' : 'text-zinc-400'}`}>Recent</div>
            {Array.isArray(history) && history.length > 0 ? history.map((chat, idx) => (
                <button 
                    key={chat._id || chat.id || idx}
                    // Fix: Ensure we check both _id (MongoDB default) and id
                    onClick={() => loadChat(chat._id || chat.id)}
                    className={`w-full flex items-center gap-3 p-2 px-3 rounded-full text-sm truncate group transition-colors
                    ${theme === 'dark' 
                        ? 'hover:bg-[#2f2f2f] text-zinc-300' 
                        : 'hover:bg-zinc-200 text-zinc-700'}`}
                >
                    <MessageSquare size={16} className={theme === 'dark' ? "text-zinc-500 group-hover:text-zinc-300" : "text-zinc-400 group-hover:text-zinc-600"} />
                    <span className="truncate">{chat.title ? String(chat.title) : "Untitled Chat"}</span>
                </button>
            )) : (
                <div className={`text-center text-xs py-10 ${theme === 'dark' ? 'text-zinc-600' : 'text-zinc-400'}`}>No history yet</div>
            )}
         </div>

         <div className={`p-4 border-t ${theme === 'dark' ? 'border-[#2f2f2f]' : 'border-zinc-200'}`}>
             <button 
                onClick={toggleTheme}
                className={`w-full flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-colors
                ${theme === 'dark' ? 'hover:bg-[#2f2f2f]' : 'hover:bg-zinc-200'}`}
             >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${theme === 'dark' ? 'bg-zinc-800 text-yellow-400' : 'bg-zinc-300 text-indigo-600'}`}>
                    {theme === 'dark' ? <Moon size={16} /> : <Sun size={16} />}
                </div>
                <div className="flex-1 text-left">
                    <div className={`text-sm font-medium ${theme === 'dark' ? 'text-zinc-200' : 'text-zinc-800'}`}>
                        {theme === 'dark' ? 'Dark Mode' : 'Light Mode'}
                    </div>
                </div>
             </button>
         </div>
      </aside>

      <main className={`flex-1 flex flex-col min-w-0 relative ${theme === 'dark' ? 'bg-[#131314]' : 'bg-white'}`}>
         
         <header className={`h-16 flex items-center justify-between px-4 sticky top-0 z-30 backdrop-blur-md
            ${theme === 'dark' ? 'bg-[#131314]/90' : 'bg-white/90'}`}>
            <div className="flex items-center gap-3">
                {!isSidebarOpen && (
                    <button 
                        onClick={() => setSidebarOpen(true)} 
                        className={`p-2 rounded-full transition-colors ${theme === 'dark' ? 'hover:bg-[#2f2f2f] text-zinc-400' : 'hover:bg-zinc-100 text-zinc-600'}`}
                        title="Open Sidebar"
                    >
                        <PanelLeftOpen size={20} />
                    </button>
                )}
                
                <button 
                    onClick={() => setSidebarOpen(true)} 
                    className={`md:hidden p-2 rounded-full transition-colors ${theme === 'dark' ? 'hover:bg-[#2f2f2f] text-zinc-400' : 'hover:bg-zinc-100 text-zinc-600'}`}
                >
                    <Menu size={20} />
                </button>

                <button 
                    onClick={() => setShowVersionPopup(true)} 
                    className={`flex items-center gap-2 font-medium px-3 py-1.5 rounded-lg transition-colors
                    ${theme === 'dark' ? 'text-zinc-300 hover:bg-[#1e1f20]' : 'text-zinc-700 hover:bg-zinc-100'}`}
                >
                    <span className="text-lg opacity-90 tracking-tight">CNEAPEE AI v1.2 Neo</span>
                    <ChevronDown size={14} className="opacity-50" />
                </button>
            </div>
            
            <div className="flex items-center gap-2">
                <button 
                    onClick={goToHome}
                    className={`p-2 rounded-full transition-colors ${theme === 'dark' ? 'hover:bg-[#2f2f2f] text-zinc-400' : 'hover:bg-zinc-100 text-zinc-600'}`}
                    title="Go Home"
                >
                    <Home size={20} />
                </button>
            </div>
         </header>

         <div className={`flex-1 overflow-y-auto px-4 md:px-0 scrollbar-thin ${theme === 'dark' ? 'scrollbar-thumb-zinc-700' : 'scrollbar-thumb-zinc-300'}`}>
            <div className="max-w-[800px] mx-auto pt-4 pb-10 min-h-full flex flex-col">
                
                {/* Empty State */}
                {messages.length === 0 && (
                    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center mt-[-100px]">
                        <div className="flex flex-wrap justify-center gap-3 max-w-2xl mt-10">
                            {["Plan a trip to Japan", "Explain Quantum Physics", "Write python code for snake game", "Help me draft an email"].map((suggestion) => (
                                <button 
                                    key={suggestion}
                                    onClick={() => handleSend(suggestion)}
                                    className={`px-4 py-3 rounded-xl text-sm transition-colors border border-transparent
                                    ${theme === 'dark' 
                                        ? 'bg-[#1e1f20] hover:bg-[#2f2f2f] text-zinc-300 hover:border-zinc-700' 
                                        : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-700 hover:border-zinc-300'}`}
                                >
                                    {suggestion}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {messages.map((msg, idx) => (
                    <ChatMessage 
                        key={idx} 
                        msg={msg} 
                        onRegenerate={handleRegenerate}
                    />
                ))}

                {loading && (
                    <div className="flex gap-4 mb-6 animate-in fade-in pl-1">
                        <div className="flex items-center gap-1 mt-2 ml-2">
                            <div className={`w-2 h-2 rounded-full animate-bounce ${theme === 'dark' ? 'bg-zinc-500' : 'bg-zinc-400'}`}></div>
                            <div className={`w-2 h-2 rounded-full animate-bounce delay-100 ${theme === 'dark' ? 'bg-zinc-500' : 'bg-zinc-400'}`}></div>
                            <div className={`w-2 h-2 rounded-full animate-bounce delay-200 ${theme === 'dark' ? 'bg-zinc-500' : 'bg-zinc-400'}`}></div>
                        </div>
                    </div>
                )}
                
                <div ref={bottomRef} className="h-4" />
            </div>
         </div>

         <div className={`w-full px-4 pb-6 pt-2 ${theme === 'dark' ? 'bg-[#131314]' : 'bg-white'}`}>
            <div className="max-w-[800px] mx-auto relative">
                
                {imagePreview && (
                    <div className="absolute bottom-full left-0 mb-3 ml-2 animate-in slide-in-from-bottom-2">
                        <div className="relative inline-block">
                            <img src={imagePreview} alt="Preview" className="h-20 w-auto rounded-lg border border-zinc-700 shadow-xl" />
                            <button 
                                onClick={() => { setImagePreview(null); setSelectedImage(null); }}
                                className="absolute -top-2 -right-2 bg-zinc-800 rounded-full p-1 border border-zinc-600 hover:bg-red-500 transition-colors text-white"
                            >
                                <X size={12} />
                            </button>
                        </div>
                    </div>
                )}

                <div className={`
                    rounded-[28px] p-2 flex items-end gap-2 border transition-all duration-200
                    ${theme === 'dark' 
                        ? `bg-[#1e1f20] ${input || imagePreview ? 'border-zinc-600' : 'border-[#1e1f20] hover:border-zinc-700'}`
                        : `bg-[#f0f0f0] ${input || imagePreview ? 'border-zinc-300' : 'border-[#f0f0f0] hover:border-zinc-300'}`
                    }
                `}>
                    
                    <button 
                        onClick={() => fileInputRef.current?.click()}
                        className={`p-3 rounded-full transition-colors mb-0.5 
                        ${theme === 'dark' ? 'text-zinc-400 hover:text-zinc-200 hover:bg-[#2f2f2f]' : 'text-zinc-500 hover:text-zinc-800 hover:bg-zinc-200'}`}
                    >
                        <Plus size={20} />
                    </button>
                    <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageSelect} />

                    <textarea
                        ref={textareaRef}
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                handleSend();
                            }
                        }}
                        placeholder="Message CNEAPEE v1.4 Neo"
                        rows={1}
                        className={`flex-1 bg-transparent text-[16px] py-3.5 max-h-[150px] resize-none focus:outline-none scrollbar-hide
                        ${theme === 'dark' ? 'text-zinc-100 placeholder-zinc-500' : 'text-zinc-800 placeholder-zinc-400'}`}
                    />

                    {(input.trim() || imagePreview) ? (
                        <button 
                            onClick={() => handleSend()}
                            className={`p-3 rounded-full transition-all mb-0.5 animate-in zoom-in
                            ${theme === 'dark' ? 'bg-zinc-100 text-black hover:bg-white' : 'bg-black text-white hover:bg-zinc-800'}`}
                        >
                            <Send size={18} fill="currentColor" />
                        </button>
                    ) : (
                        <button className={`p-3 rounded-full transition-colors mb-0.5
                        ${theme === 'dark' ? 'text-zinc-400 hover:text-zinc-200 hover:bg-[#2f2f2f]' : 'text-zinc-500 hover:text-zinc-800 hover:bg-zinc-200'}`}>
                            <Mic size={20} />
                        </button>
                    )}
                </div>

                <p className={`text-center text-[11px] mt-3 ${theme === 'dark' ? 'text-zinc-500' : 'text-zinc-400'}`}>
                    CNEAPEE can make mistakes. Check important info.
                </p>
            </div>
         </div>

      </main>
    </div>
  );
}