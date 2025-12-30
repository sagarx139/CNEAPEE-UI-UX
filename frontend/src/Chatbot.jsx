import React, { useState, useRef, useEffect, memo } from 'react';
import axios from 'axios';
import {
  Home,
  Send,
  Sparkles,
  MessageSquare,
  X,
  Mic,
  MicOff,
  Paperclip,
  ChevronLeft,
  Cpu,
  Image as ImageIcon
} from 'lucide-react';

/* =========================================
   CONSTANTS & CONFIG
   ========================================= */
const API_URL = "https://cneapee-backend-703598443794.asia-south1.run.app/api/chat";

const DEFAULT_GREETING = {
  role: "assistant",
  text: "Hello 👋 This is CNEAPEE AI v1.2. Ready to help you with code, creativity, or analysis!",
  id: "init-1" // Added ID for list keys
};

/* =========================================
   COMPONENT: MEMOIZED MESSAGE BUBBLE
   (Ye performance ka secret hai - prevents re-renders)
   ========================================= */
const MessageBubble = memo(({ m }) => {
  const isUser = m.role === "user";
  
  return (
    <div className={`flex w-full ${isUser ? "justify-end" : "justify-start"} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
      <div className={`flex flex-col gap-1 max-w-[85%] md:max-w-[70%] ${isUser ? "items-end" : "items-start"}`}>
        
        {/* Role Label (Optional style touch) */}
        <span className={`text-[10px] font-bold tracking-wider opacity-50 ${isUser ? "mr-1" : "ml-1"}`}>
          {isUser ? "YOU" : "CNEAPEE"}
        </span>

        {/* Image Display */}
        {m.image && (
          <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-black/50 shadow-lg mb-1">
            <img
              src={m.image}
              alt="Attachment"
              loading="lazy"
              className="max-h-64 w-auto object-contain"
            />
          </div>
        )}

        {/* Text Message */}
        {m.text && (
          <div className={`px-5 py-3.5 rounded-2xl text-[15px] leading-relaxed whitespace-pre-wrap shadow-md backdrop-blur-sm
            ${isUser 
              ? "bg-gradient-to-br from-indigo-600 to-violet-600 text-white rounded-tr-sm" 
              : "bg-[#1e1e22] border border-white/5 text-zinc-200 rounded-tl-sm"
            }`}>
            {m.text}
          </div>
        )}
      </div>
    </div>
  );
});

/* =========================================
   MAIN CHATBOT COMPONENT
   ========================================= */
export default function Chatbot({ onNavigate }) {
  // --- States ---
  const [messages, setMessages] = useState([DEFAULT_GREETING]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [history, setHistory] = useState([]);
  const [activeChatId, setActiveChatId] = useState(null);
  const [showHistory, setShowHistory] = useState(false);
  
  // --- Media States ---
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isListening, setIsListening] = useState(false);

  // --- Refs ---
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const textareaRef = useRef(null); // For auto-resize

  /* 1. AUTO SCROLL & RESIZE */
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, imagePreview]);

  // Auto-resize textarea height
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [input]);

  /* 2. FETCH HISTORY */
  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      const { data } = await axios.get(`${API_URL}/history`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setHistory(data);
    } catch (e) { console.log("History error", e); }
  };

  /* 3. LOAD CHAT */
  const loadChat = async (chatId) => {
    try {
      setIsTyping(true);
      setActiveChatId(chatId);
      const token = localStorage.getItem("token");
      const { data } = await axios.get(`${API_URL}/${chatId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Ensure messages have IDs for keys if missing
      const processedMsgs = data.messages.map((m, i) => ({...m, id: m._id || `${chatId}-${i}`}));
      setMessages(processedMsgs);
      setShowHistory(false);
    } catch {
    } finally {
      setIsTyping(false);
    }
  };

  /* 4. IMAGE COMPRESSION (Your logic preserved) */
  const compressImage = (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;
        img.onload = () => {
          const MAX_WIDTH = 800;
          let width = img.width;
          let height = img.height;

          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }

          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          
          const dataUrl = canvas.toDataURL('image/jpeg', 0.7);
          resolve(dataUrl);
        };
      };
    });
  };

  /* 5. HANDLERS */
  const handleImageFile = async (file) => {
    if (!file) return;
    try {
        const compressedBase64 = await compressImage(file);
        setSelectedImage(compressedBase64);
        setImagePreview(compressedBase64);
    } catch (e) {
        alert("Image failed");
    }
  };

  const handlePaste = (e) => {
    const items = e.clipboardData.items;
    for (let item of items) {
        if (item.type.startsWith("image")) {
            e.preventDefault();
            handleImageFile(item.getAsFile());
            return;
        }
    }
  };

  const clearImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    if(fileInputRef.current) fileInputRef.current.value = "";
  };

  /* 6. VOICE INPUT */
  const toggleListening = () => {
    if (isListening) {
      window.speechRecognition?.stop();
      setIsListening(false);
      return;
    }
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Voice input not supported.");
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.continuous = false;
    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInput(prev => prev + " " + transcript);
    };
    window.speechRecognition = recognition;
    recognition.start();
  };

  /* 7. SEND LOGIC */
  const handleSend = async () => {
    if (!input.trim() && !selectedImage) return;

    const userText = input;
    const userImage = selectedImage;
    const tempId = Date.now();

    // Optimistic Update
    setMessages(prev => [
        ...prev,
        { role: "user", text: userText, image: userImage, id: tempId }
    ]);

    setInput('');
    if(textareaRef.current) textareaRef.current.style.height = 'auto'; // Reset height
    clearImage();
    setIsTyping(true);

    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.post(
        `${API_URL}/send`,
        { prompt: userText, image: userImage, chatId: activeChatId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setMessages(prev => [...prev, { role: "assistant", text: data.reply, id: Date.now() + 1 }]);

      if (!activeChatId) {
        setActiveChatId(data.chatId);
        fetchHistory();
      }
    } catch (err) {
      let msg = "❌ Connection error.";
      if (err.response?.status === 429) msg = "⚠️ Upgrade plan.";
      setMessages(prev => [...prev, { role: "assistant", text: msg, id: Date.now() + 2 }]);
    } finally {
      setIsTyping(false);
    }
  };

  /* =========================================
     RENDER UI
     ========================================= */
  return (
    <div className="flex h-[100dvh] bg-[#09090b] text-zinc-100 overflow-hidden font-sans selection:bg-indigo-500/30">
      
      {/* --- SIDEBAR OVERLAY (Optimized for Mobile) --- */}
      {showHistory && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm transition-opacity" onClick={() => setShowHistory(false)}>
          <div 
            className="absolute left-0 top-0 h-full w-[80%] max-w-[300px] bg-[#121214] border-r border-white/5 shadow-2xl p-4 transform transition-transform animate-in slide-in-from-left duration-200"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-2">
                <Sparkles size={18} className="text-indigo-400" />
                <h3 className="font-bold text-lg tracking-tight">History</h3>
              </div>
              <button onClick={() => setShowHistory(false)} className="p-1 text-zinc-400 hover:text-white">
                <X size={20} />
              </button>
            </div>

            <div className="space-y-2 overflow-y-auto h-[90%] pr-2 scrollbar-thin scrollbar-thumb-zinc-800">
                {history.map(chat => (
                <button
                    key={chat._id}
                    onClick={() => loadChat(chat._id)}
                    className={`w-full text-left p-3.5 rounded-xl text-sm transition-all border border-transparent
                      ${activeChatId === chat._id 
                        ? "bg-indigo-500/10 text-indigo-300 border-indigo-500/20" 
                        : "text-zinc-400 hover:bg-white/5 hover:text-zinc-200"}`}
                >
                    <div className="font-medium truncate">{chat.title || "New Conversation"}</div>
                    <div className="text-[10px] opacity-60 mt-1">{new Date(chat.createdAt || Date.now()).toLocaleDateString()}</div>
                </button>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* --- MAIN AREA --- */}
      <main className="flex-1 flex flex-col relative w-full max-w-[100vw]">

        {/* 1. Header (Glassmorphism Lite) */}
        <header className="h-14 flex items-center justify-between px-4 md:px-6 border-b border-white/5 bg-[#09090b]/80 backdrop-blur-md sticky top-0 z-10">
          <div className="flex items-center gap-3">
             <button onClick={() => onNavigate("home")} className="md:hidden text-zinc-400">
               <ChevronLeft size={22} />
             </button>
             <div className="flex items-center gap-2.5">
               <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                 <Cpu size={18} className="text-white" />
               </div>
               <div>
                 <h1 className="font-bold text-sm leading-none">CNEAPEE AI</h1>
                 <span className="text-[10px] text-zinc-500 font-medium">Online • v1.2</span>
               </div>
             </div>
          </div>

          <div className="flex gap-1">
            <button onClick={() => setShowHistory(true)} className="p-2.5 text-zinc-400 hover:bg-white/5 rounded-xl transition">
              <MessageSquare size={20} />
            </button>
            <button onClick={() => onNavigate("home")} className="hidden md:block p-2.5 text-zinc-400 hover:bg-white/5 rounded-xl transition">
              <Home size={20} />
            </button>
          </div>
        </header>

        {/* 2. Chat Area (Scrollable) */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6 scroll-smooth scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent">
          {/* Mapping optimized Memoized Bubbles */}
          {messages.map((m, i) => (
            <MessageBubble key={m.id || i} m={m} />
          ))}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex justify-start animate-pulse">
               <div className="flex items-center gap-2 px-4 py-3 bg-[#1e1e22] border border-white/5 rounded-2xl rounded-tl-sm">
                 <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce" style={{animationDelay: '0ms'}} />
                 <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce" style={{animationDelay: '150ms'}} />
                 <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce" style={{animationDelay: '300ms'}} />
               </div>
            </div>
          )}
          
          {/* Spacer for bottom bar */}
          <div ref={messagesEndRef} className="h-2" />
        </div>

        {/* 3. Input Area (Solid & Stable) */}
        <div className="w-full bg-[#09090b] border-t border-white/5 p-3 md:p-5 pb-safe">
          <div className="max-w-4xl mx-auto relative group">
            
            {/* Image Preview Tag */}
            {imagePreview && (
                <div className="absolute bottom-full left-0 mb-3 animate-in slide-in-from-bottom-2 fade-in">
                    <div className="relative inline-block">
                        <img src={imagePreview} alt="Preview" className="h-20 w-20 object-cover rounded-xl border border-white/20 shadow-xl bg-zinc-900" />
                        <button
                            onClick={clearImage}
                            className="absolute -top-2 -right-2 bg-zinc-800 text-white rounded-full p-1 border border-white/10 hover:bg-red-500 transition-colors"
                        >
                            <X size={12} />
                        </button>
                    </div>
                </div>
            )}

            <div className="flex items-end gap-2 bg-[#18181b] p-2 rounded-[24px] border border-white/10 focus-within:border-indigo-500/50 focus-within:ring-1 focus-within:ring-indigo-500/20 transition-all shadow-xl">
               
               {/* Tools Left */}
               <div className="flex gap-1 mb-0.5">
                   <input type="file" ref={fileInputRef} accept="image/*" onChange={(e) => handleImageFile(e.target.files[0])} hidden />
                   <button 
                     onClick={() => fileInputRef.current.click()} 
                     className="p-3 text-zinc-400 hover:text-indigo-400 hover:bg-indigo-500/10 rounded-full transition"
                   >
                     <Paperclip size={20} />
                   </button>
               </div>

               {/* Textarea */}
               <textarea
                   ref={textareaRef}
                   value={input}
                   onChange={(e) => setInput(e.target.value)}
                   onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && (e.preventDefault(), handleSend())}
                   onPaste={handlePaste}
                   placeholder="Ask me anything..."
                   className="flex-1 bg-transparent text-white placeholder-zinc-500 text-[15px] py-3 max-h-32 focus:outline-none resize-none leading-relaxed"
                   rows={1}
               />

               {/* Tools Right */}
               <div className="flex gap-2 mb-0.5">
                   <button
                       onClick={toggleListening}
                       className={`p-3 rounded-full transition-all duration-300 ${isListening ? "bg-red-500/20 text-red-400 animate-pulse" : "text-zinc-400 hover:bg-white/5 hover:text-white"}`}
                   >
                       {isListening ? <MicOff size={20} /> : <Mic size={20} />}
                   </button>

                   <button
                       onClick={handleSend}
                       disabled={!input.trim() && !selectedImage}
                       className="p-3 bg-indigo-600 hover:bg-indigo-500 disabled:bg-zinc-800 disabled:text-zinc-600 text-white rounded-full transition-all shadow-lg shadow-indigo-600/20 active:scale-95"
                   >
                       <Send size={18} className={!input.trim() && !selectedImage ? "" : "ml-0.5"} />
                   </button>
               </div>
            </div>
            
            <p className="text-center text-[10px] text-zinc-600 mt-2">
              Powered by CNEAPEE AI. Logic intact.
            </p>
          </div>
        </div>

      </main>
    </div>
  );
}