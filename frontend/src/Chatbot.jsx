import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import {
  Home, Send, Sparkles, MessageSquare, X,
  Image as ImageIcon, Mic, MicOff, Paperclip, Palette,
  Copy, Check, Download, Bot, User
} from 'lucide-react';

// 🔗 Backend API Base URL
const API_BASE = "https://cneapee-backend-703598443794.asia-south1.run.app/api";

const DEFAULT_GREETING = {
  role: "assistant",
  text: "Hello! 👋 I am CNEAPEE AI v1.2. \n\nI can write code, analyze photos, and generate stunning AI art. \n\nHow can I help you today?"
};

/* =========================================
   HELPER: TYPING ANIMATION
========================================= */
const TypingIndicator = ({ isGenMode }) => (
  <div className="flex items-center gap-1.5 p-4 bg-[#18181b] border border-white/5 rounded-2xl w-fit animate-in fade-in slide-in-from-bottom-2">
    <div className={`w-2 h-2 rounded-full animate-bounce ${isGenMode ? 'bg-purple-500' : 'bg-indigo-500'}`} style={{ animationDelay: '0s' }}></div>
    <div className={`w-2 h-2 rounded-full animate-bounce ${isGenMode ? 'bg-purple-500' : 'bg-indigo-500'}`} style={{ animationDelay: '0.2s' }}></div>
    <div className={`w-2 h-2 rounded-full animate-bounce ${isGenMode ? 'bg-purple-500' : 'bg-indigo-500'}`} style={{ animationDelay: '0.4s' }}></div>
    <span className="text-xs text-zinc-500 font-medium ml-2">
        {isGenMode ? "Creating masterpiece..." : "Thinking..."}
    </span>
  </div>
);

/* =========================================
   MAIN COMPONENT
========================================= */
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

  // 🎨 Image Generation State
  const [isGenMode, setIsGenMode] = useState(false);

  // 📋 Copy Feedback State
  const [copiedId, setCopiedId] = useState(null);

  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping, imagePreview]);

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

  const compressImage = (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const scale = 800 / img.width;
          canvas.width = 800;
          canvas.height = img.height * scale;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          resolve(canvas.toDataURL('image/jpeg', 0.7));
        };
      };
    });
  };

  const handleImageFile = async (file) => {
    if (!file) return;
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

  const handleCopy = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // ✅ FIXED DOWNLOAD FUNCTION FOR BASE64
  const handleDownload = (imageUrl) => {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `cneapee-ai-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // ✅ FIXED VOICE INPUT
  const toggleListening = () => {
    if (isListening) {
      window.speechRecognition?.stop();
      setIsListening(false);
      return;
    }
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return alert("Browser does not support Voice Input.");

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US'; 
    recognition.continuous = false;
    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInput(prev => (prev ? prev + " " + transcript : transcript));
    };
    window.speechRecognition = recognition;
    recognition.start();
  };

  const handleSend = async () => {
    if (!input.trim() && !selectedImage) return;

    const token = localStorage.getItem("token");
    const userText = input;
    const userImage = selectedImage;
    
    setMessages(prev => [
        ...prev, 
        { role: "user", text: userText, image: userImage }
    ]);

    setInput('');
    clearImage();
    setIsTyping(true);

    try {
      let response;
      
      // 🔥 IMAGE GENERATION (With Base64 Return)
      if (isGenMode) {
          response = await axios.post(
            `${API_BASE}/chat/generate-image`, 
            { prompt: userText, chatId: activeChatId },
            { headers: { Authorization: `Bearer ${token}` } }
          );
          
          setMessages(prev => [...prev, { 
              role: "assistant", 
              text: response.data.reply || "Here is your image:",
              generatedImage: response.data.imageUrl // Backend sends Base64
          }]);
      } 
      // 💬 NORMAL CHAT (Text & Vision)
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
        fetchHistory(); 
      }

    } catch (err) {
      let msg = "❌ Connection error.";
      if (err.response?.status === 429) msg = err.response.data?.reply;
      if (err.response?.status === 403) msg = "⛔ " + err.response.data?.reply;
      if (err.response?.status === 500) msg = "⚠️ Server Error. Please try again later.";
      
      setMessages(prev => [...prev, { role: "assistant", text: msg }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex h-screen bg-[#050505] text-zinc-100 overflow-hidden font-sans selection:bg-indigo-500/30">

      {/* --- HISTORY SIDEBAR --- */}
      {showHistory && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200" onClick={() => setShowHistory(false)}>
          <div className="absolute right-0 top-0 h-full w-[320px] bg-[#0c0c0e] border-l border-white/10 p-4 shadow-2xl flex flex-col" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6 pb-4 border-b border-white/5">
              <h3 className="text-sm font-bold flex items-center gap-2"><MessageSquare size={16}/> Chat History</h3>
              <button onClick={() => setShowHistory(false)} className="hover:text-red-400 transition"><X size={18} /></button>
            </div>
            <div className="flex-1 overflow-y-auto space-y-2 pr-2 scrollbar-thin scrollbar-thumb-zinc-800">
                {history.map(chat => (
                <button key={chat._id} onClick={() => { loadChat(chat._id); setShowHistory(false); }} className="w-full text-left p-3 rounded-xl text-xs text-zinc-400 hover:bg-white/5 hover:text-white truncate transition-all border border-transparent hover:border-white/5">
                    {chat.title}
                </button>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* --- MAIN CHAT AREA --- */}
      <main className="flex-1 flex flex-col relative">

        {/* Header */}
        <header className="h-16 flex items-center justify-between px-6 border-b border-white/5 bg-[#050505]/80 backdrop-blur-md sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-xl bg-gradient-to-tr ${isGenMode ? 'from-purple-600 to-pink-600' : 'from-indigo-600 to-blue-600'}`}>
                <Sparkles size={18} className="text-white" />
            </div>
            <div className="flex flex-col">
                <span className="font-bold tracking-tight text-sm">CNEAPEE AI</span>
                {isGenMode && <span className="text-[10px] text-purple-400 font-bold uppercase tracking-widest">Image Mode Active</span>}
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={() => setShowHistory(true)} className="p-2 hover:bg-white/10 rounded-xl transition text-zinc-400 hover:text-white"><MessageSquare size={20} /></button>
            <button onClick={() => onNavigate("home")} className="p-2 hover:bg-white/10 rounded-xl transition text-zinc-400 hover:text-white"><Home size={20} /></button>
          </div>
        </header>

        {/* Messages List */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-8 scrollbar-thin scrollbar-thumb-zinc-800">
          {messages.map((m, i) => (
            <div key={i} className={`flex gap-4 ${m.role === "user" ? "flex-row-reverse" : "flex-row"} group animate-in slide-in-from-bottom-2 duration-300`}>
              
              {/* Avatar */}
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1 shadow-lg
                  ${m.role === "user" 
                    ? "bg-zinc-800 border border-zinc-700" 
                    : isGenMode && i === messages.length - 1 ? "bg-purple-600" : "bg-indigo-600"}`}>
                  {m.role === "user" ? <User size={16} className="text-zinc-400"/> : <Bot size={16} className="text-white"/>}
              </div>

              {/* Message Content */}
              <div className={`flex flex-col gap-2 max-w-[85%] md:max-w-[70%] items-${m.role === "user" ? "end" : "start"}`}>
                
                {/* User Image */}
                {m.image && (
                    <img src={m.image} alt="User Upload" className="rounded-2xl border border-white/10 max-h-64 object-contain bg-black shadow-xl" />
                )}

                {/* AI Generated Image (Base64 Fixed) */}
                {m.generatedImage && (
                    <div className="relative group/img">
                        <img 
                            src={m.generatedImage} 
                            alt="AI Generated" 
                            className="rounded-2xl border border-purple-500/30 shadow-2xl shadow-purple-500/10 w-full max-h-96 object-cover bg-black"
                        />
                        <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover/img:opacity-100 transition-all duration-300">
                            <button 
                                onClick={() => handleDownload(m.generatedImage)} 
                                className="bg-black/60 hover:bg-black/80 text-white p-2 rounded-xl backdrop-blur-md border border-white/10 shadow-lg"
                                title="Download Image"
                            >
                                <Download size={16}/>
                            </button>
                        </div>
                    </div>
                )}

                {/* Text Message */}
                {m.text && (
                    <div className={`relative px-5 py-3.5 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap shadow-sm
                    ${m.role === "user"
                        ? "bg-[#27272a] text-white rounded-tr-sm"
                        : "bg-transparent text-zinc-200 pl-0 pt-1"}`}>
                    
                    {m.text}

                    {/* Copy Button */}
                    {m.role === "assistant" && (
                        <div className="flex gap-2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <button 
                                onClick={() => handleCopy(m.text, i)} 
                                className="p-1.5 text-zinc-500 hover:text-white hover:bg-white/10 rounded-lg transition flex items-center gap-1.5 text-xs font-medium"
                                title="Copy Text"
                            >
                                {copiedId === i ? <><Check size={14} className="text-green-500"/> Copied</> : <><Copy size={14}/> Copy</>}
                            </button>
                        </div>
                    )}
                    </div>
                )}
              </div>
            </div>
          ))}

          {/* Typing Animation */}
          {isTyping && (
            <div className="flex gap-4">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1 ${isGenMode ? 'bg-purple-600' : 'bg-indigo-600'}`}>
                    <Bot size={16} className="text-white"/>
                </div>
                <TypingIndicator isGenMode={isGenMode} />
            </div>
          )}
          
          <div ref={messagesEndRef} className="h-4" />
        </div>

        {/* --- INPUT BAR --- */}
        <div className="p-4 bg-[#050505] z-10">
          <div className={`max-w-3xl mx-auto rounded-3xl border p-2 relative shadow-2xl transition-all duration-500
              ${isGenMode 
                ? 'bg-[#0f0a15] border-purple-500/40 shadow-[0_0_30px_-5px_rgba(168,85,247,0.15)]' 
                : 'bg-[#0e0e11] border-white/10'}`}>
            
            {/* Preview Overlay */}
            {imagePreview && (
                <div className="absolute bottom-full left-0 mb-4 ml-2 animate-in slide-in-from-bottom-2 fade-in">
                    <div className="relative group">
                        <img src={imagePreview} alt="Preview" className="h-20 w-20 object-cover rounded-xl border border-white/20 shadow-lg" />
                        <button onClick={clearImage} className="absolute -top-2 -right-2 bg-zinc-800 text-white rounded-full p-1 border border-white/10 hover:bg-red-500 transition"><X size={12} /></button>
                    </div>
                </div>
            )}

            <div className="flex items-end gap-2">
                
                {/* A. Mode Switcher */}
                <button 
                    onClick={() => { setIsGenMode(!isGenMode); clearImage(); }}
                    className={`p-3.5 rounded-2xl transition-all duration-300 group relative
                    ${isGenMode ? "bg-purple-600 text-white shadow-lg shadow-purple-500/20" : "bg-transparent text-zinc-400 hover:text-white hover:bg-white/5"}`}
                    title={isGenMode ? "Switch to Chat" : "Switch to Image Gen"}
                >
                    <Palette size={20} />
                    <span className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 text-[10px] bg-zinc-800 text-white px-2 py-1 rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap transition">
                        {isGenMode ? "Chat Mode" : "Art Mode"}
                    </span>
                </button>

                {/* B. File Upload */}
                {!isGenMode && (
                    <>
                        <input type="file" ref={fileInputRef} accept="image/*" onChange={(e) => handleImageFile(e.target.files[0])} hidden />
                        <button onClick={() => fileInputRef.current.click()} className="p-3.5 text-zinc-400 hover:text-white hover:bg-white/5 rounded-2xl transition" title="Upload Image">
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
                    placeholder={isGenMode ? "Describe what you want to see..." : "Message Cneapee AI..."}
                    className="flex-1 bg-transparent text-white placeholder-zinc-500 text-sm py-3.5 focus:outline-none resize-none max-h-32 scrollbar-hide"
                    rows="1"
                    style={{minHeight: "48px"}}
                />

                {/* D. Voice Input */}
                <button onClick={toggleListening} className={`p-3.5 rounded-2xl transition-all duration-300 ${isListening ? "bg-red-500/20 text-red-500 animate-pulse" : "text-zinc-400 hover:text-white hover:bg-white/5"}`}>
                    {isListening ? <MicOff size={20} /> : <Mic size={20} />}
                </button>

                {/* E. Send Button */}
                <button
                    onClick={handleSend}
                    disabled={!input.trim() && !selectedImage}
                    className={`p-3.5 text-white rounded-2xl disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-300 shadow-lg
                    ${isGenMode 
                        ? "bg-purple-600 hover:bg-purple-500 hover:shadow-purple-500/20" 
                        : "bg-white text-black hover:bg-zinc-200"}`}
                >
                    {isGenMode ? <ImageIcon size={20} /> : <Send size={20} />}
                </button>
            </div>
          </div>
          
          <p className="text-center text-[10px] text-zinc-600 mt-4 font-medium tracking-wide">
            {isGenMode ? "✨ AI Art Generation Mode Active" : "CNEAPEE AI can make mistakes. Consider checking important information."}
          </p>
        </div>

      </main>
    </div>
  );
}