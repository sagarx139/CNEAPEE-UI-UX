import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import {
  Home,
  Send,
  Sparkles,
  MessageSquare,
  X,
  Image as ImageIcon,
  Mic,
  MicOff,
  Paperclip,
  Palette 
} from 'lucide-react';

// 🔗 Backend API Base URL
const API_BASE = "https://cneapee-backend-703598443794.asia-south1.run.app/api";

const DEFAULT_GREETING = {
  role: "assistant",
  text: "Hello 👋 This is CNEAPEE AI v1.2. Ask me anything, paste an image to analyze, or switch modes to generate images!"
};

export default function Chatbot({ onNavigate }) {
  const [messages, setMessages] = useState([DEFAULT_GREETING]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [history, setHistory] = useState([]);
  const [activeChatId, setActiveChatId] = useState(null);
  const [showHistory, setShowHistory] = useState(false);

  // 🖼️ Media States
  const [selectedImage, setSelectedImage] = useState(null); 
  const [imagePreview, setImagePreview] = useState(null);   
  const [isListening, setIsListening] = useState(false);    

  // 🎨 Image Generation State (New Feature)
  const [isGenMode, setIsGenMode] = useState(false);

  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  /* ===========================
      1. AUTO SCROLL
  =========================== */
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping, imagePreview]);

  /* ===========================
      2. FETCH HISTORY
  =========================== */
  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      
      const { data } = await axios.get(`${API_BASE}/chat/history`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setHistory(data);
    } catch { console.log("History fetch failed"); }
  };

  /* ===========================
      3. LOAD OLD CHAT
  =========================== */
  const loadChat = async (chatId) => {
    try {
      setIsTyping(true);
      setActiveChatId(chatId);
      const token = localStorage.getItem("token");
      
      const { data } = await axios.get(`${API_BASE}/chat/${chatId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessages(data.messages);
      setIsTyping(false);
    } catch { setIsTyping(false); }
  };

  /* ===========================
      4. IMAGE COMPRESSION
  =========================== */
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
          resolve(canvas.toDataURL('image/jpeg', 0.7));
        };
      };
    });
  };

  /* ===========================
      5. IMAGE HANDLER (Upload)
  =========================== */
  const handleImageFile = async (file) => {
    if (!file) return;
    // If user uploads an image, ensure we are NOT in Gen Mode
    if (isGenMode) setIsGenMode(false); 
    try {
        const compressedBase64 = await compressImage(file);
        setSelectedImage(compressedBase64);
        setImagePreview(compressedBase64);  
    } catch (e) { alert("Image loading failed"); }
  };

  const handlePaste = (e) => {
    const items = e.clipboardData.items;
    for (let item of items) {
        if (item.type.startsWith("image")) {
            e.preventDefault();
            const file = item.getAsFile();
            handleImageFile(file);
            return;
        }
    }
  };

  const clearImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    if(fileInputRef.current) fileInputRef.current.value = "";
  };

  /* ===========================
      6. VOICE INPUT
  =========================== */
  const toggleListening = () => {
    if (isListening) {
      window.speechRecognition?.stop();
      setIsListening(false);
      return;
    }
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return alert("Browser not supported");

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

  /* ===========================
      7. SEND MESSAGE (Logic for Both Modes)
  =========================== */
  const handleSend = async () => {
    if (!input.trim() && !selectedImage) return;

    const token = localStorage.getItem("token");
    const userText = input;
    const userImage = selectedImage;
    
    // Optimistic UI Update
    setMessages(prev => [
        ...prev, 
        { 
            role: "user", 
            text: userText,
            image: userImage 
        }
    ]);

    setInput('');
    clearImage();
    setIsTyping(true);

    try {
      let response;
      
      // 🔥 BRANCH A: IMAGE GENERATION MODE
      if (isGenMode) {
          response = await axios.post(
            `${API_BASE}/chat/generate-image`, 
            { prompt: userText, chatId: activeChatId },
            { headers: { Authorization: `Bearer ${token}` } }
          );
          
          // Add AI Response with Generated Image
          setMessages(prev => [...prev, { 
              role: "assistant", 
              text: response.data.reply || "Here is your generated image:",
              generatedImage: response.data.imageUrl // Expecting URL from backend
          }]);
      } 
      
      // 💬 BRANCH B: NORMAL CHAT / VISION
      else {
          response = await axios.post(
            `${API_BASE}/chat/send`,
            { prompt: userText, image: userImage, chatId: activeChatId },
            { headers: { Authorization: `Bearer ${token}` } }
          );
          
          setMessages(prev => [...prev, { role: "assistant", text: response.data.reply }]);
      }

      if (!activeChatId && response.data.chatId) {
        setActiveChatId(response.data.chatId);
        fetchHistory(); // Refresh history list
      }

    } catch (err) {
      let msg = "❌ Connection error.";
      if (err.response?.status === 429) {
          // Check specific error message from backend
          msg = err.response.data?.reply || "⚠️ Usage limit reached. Upgrade plan.";
      }
      if (err.response?.status === 403) {
          msg = "⛔ Plan Required: " + (err.response.data?.reply || "Purchase a plan.");
      }
      setMessages(prev => [...prev, { role: "assistant", text: msg }]);
    } finally {
      setIsTyping(false);
    }
  };

  /* ===========================
      RENDER UI
  =========================== */
  return (
    <div className="flex h-screen bg-[#050505] text-zinc-100 overflow-hidden font-sans">

      {/* --- HISTORY SIDEBAR --- */}
      {showHistory && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm" onClick={() => setShowHistory(false)}>
          <div className="absolute right-0 top-0 h-full w-[320px] bg-[#0c0c0e] border-l border-white/5 p-4" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between mb-4">
              <h3 className="text-sm font-bold">Chat History</h3>
              <button onClick={() => setShowHistory(false)}><X size={18} /></button>
            </div>
            <div className="space-y-1 overflow-y-auto h-[90%]">
                {history.map(chat => (
                <button key={chat._id} onClick={() => { loadChat(chat._id); setShowHistory(false); }} className="w-full text-left p-3 rounded-xl text-sm text-zinc-400 hover:bg-white/5 truncate transition">
                    {chat.title}
                </button>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* --- MAIN CHAT AREA --- */}
      <main className="flex-1 flex flex-col">

        {/* Header */}
        <header className="h-16 flex items-center justify-between px-4 border-b border-white/5">
          <div className="flex items-center gap-2">
            <Sparkles size={18} className="text-indigo-500" />
            <span className="font-bold tracking-tight">CNEAPEE AI</span>
            {isGenMode && <span className="text-[10px] bg-purple-500/20 text-purple-400 px-2 py-0.5 rounded-full border border-purple-500/30">IMAGE GEN MODE</span>}
          </div>
          <div className="flex gap-2">
            <button onClick={() => setShowHistory(true)} className="p-2 hover:bg-white/5 rounded-lg transition"><MessageSquare size={20} /></button>
            <button onClick={() => onNavigate("home")} className="p-2 hover:bg-white/5 rounded-lg transition"><Home size={20} /></button>
          </div>
        </header>

        {/* Messages List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`flex flex-col gap-2 max-w-[85%] md:max-w-[70%]`}>
                
                {/* 1. User Uploaded Image (Vision) */}
                {m.image && (
                    <img src={m.image} alt="User Upload" className="rounded-2xl border border-white/10 max-h-64 object-contain bg-black self-end" />
                )}

                {/* 2. AI Generated Image (DALL-E / Imagen) */}
                {m.generatedImage && (
                    <div className="relative group">
                        <img src={m.generatedImage} alt="AI Generated" className="rounded-2xl border border-purple-500/30 shadow-2xl shadow-purple-500/10 max-h-80 w-full object-cover" />
                        <div className="absolute bottom-2 right-2 bg-black/60 backdrop-blur px-2 py-1 rounded text-xs text-white">Generated by AI</div>
                    </div>
                )}

                {/* 3. Text Message */}
                {m.text && (
                    <div className={`px-5 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap shadow-sm
                    ${m.role === "user"
                        ? "bg-indigo-600 text-white rounded-tr-sm"
                        : "bg-[#18181b] border border-white/10 text-zinc-300 rounded-tl-sm"}`}>
                    {m.text}
                    </div>
                )}
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex justify-start animate-pulse">
               <div className="px-5 py-3 bg-[#18181b] border border-white/10 rounded-2xl text-xs text-zinc-500">
                  {isGenMode ? "Generating Image..." : "Thinking..."}
               </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* --- INPUT BAR --- */}
        <div className="p-4 bg-[#050505] border-t border-white/5">
          <div className={`max-w-3xl mx-auto rounded-2xl border p-2 relative shadow-2xl transition-colors duration-300
              ${isGenMode ? 'bg-[#0f0a15] border-purple-500/30' : 'bg-[#0e0e11] border-white/10'}`}>
            
            {/* Preview Overlay */}
            {imagePreview && (
                <div className="absolute bottom-full left-0 mb-3 ml-2 animate-in slide-in-from-bottom-2 fade-in">
                    <div className="relative group">
                        <img src={imagePreview} alt="Preview" className="h-24 w-24 object-cover rounded-xl border border-white/20 shadow-lg" />
                        <button onClick={clearImage} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1.5 shadow-md hover:bg-red-600 transition"><X size={12} /></button>
                    </div>
                </div>
            )}

            <div className="flex items-end gap-2">
                
                {/* A. Mode Switcher (Palette Icon) */}
                <button 
                    onClick={() => { setIsGenMode(!isGenMode); clearImage(); }}
                    className={`p-3 rounded-xl transition tooltip
                    ${isGenMode ? "bg-purple-600 text-white shadow-lg shadow-purple-500/20" : "text-zinc-400 hover:text-white hover:bg-white/5"}`}
                    title={isGenMode ? "Switch to Chat" : "Switch to Image Gen"}
                >
                    <Palette size={20} />
                </button>

                {/* B. File Upload (Disabled in Gen Mode) */}
                {!isGenMode && (
                    <>
                        <input type="file" ref={fileInputRef} accept="image/*" onChange={(e) => handleImageFile(e.target.files[0])} hidden />
                        <button onClick={() => fileInputRef.current.click()} className="p-3 text-zinc-400 hover:text-white hover:bg-white/5 rounded-xl transition" title="Upload Image">
                            <Paperclip size={20} />
                        </button>
                    </>
                )}

                {/* C. Input Field */}
                <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                    onPaste={handlePaste}
                    placeholder={isGenMode ? "Describe the image to generate..." : "Ask me anything..."}
                    className="flex-1 bg-transparent text-white placeholder-zinc-600 text-sm py-3 focus:outline-none resize-none max-h-32"
                    rows="1"
                    style={{minHeight: "44px"}}
                />

                {/* D. Voice Input */}
                <button onClick={toggleListening} className={`p-3 rounded-xl transition-all duration-300 ${isListening ? "bg-red-500/10 text-red-500 animate-pulse" : "text-zinc-400 hover:text-white hover:bg-white/5"}`}>
                    {isListening ? <MicOff size={20} /> : <Mic size={20} />}
                </button>

                {/* E. Send Button */}
                <button
                    onClick={handleSend}
                    disabled={!input.trim() && !selectedImage}
                    className={`p-3 text-white rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition shadow-lg
                    ${isGenMode ? "bg-purple-600 hover:bg-purple-500 shadow-purple-500/20" : "bg-indigo-600 hover:bg-indigo-500 shadow-indigo-500/20"}`}
                >
                    {isGenMode ? <ImageIcon size={18} /> : <Send size={18} />}
                </button>
            </div>
          </div>
          
          <p className="text-center text-[10px] text-zinc-600 mt-3 font-medium">
            {isGenMode ? "AI Image Generation Mode Active" : "AI can make mistakes. Please verify important information."}
          </p>
        </div>

      </main>
    </div>
  );
}