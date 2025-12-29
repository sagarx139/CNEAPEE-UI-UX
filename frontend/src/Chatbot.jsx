import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import {
  Home,
  Send,
  Sparkles,
  MessageSquare,
  X,
  Image as ImageIcon, // Icon for Image
  Mic,                // Icon for Mic
  MicOff,             // Icon for Mic Off
  Paperclip           // Icon for Attachment
} from 'lucide-react';

// 🔗 Backend API
const API_URL = "https://cneapee-backend-703598443794.asia-south1.run.app/api/chat";

// 🟣 DEFAULT GREETING
const DEFAULT_GREETING = {
  role: "assistant",
  text: "Hello 👋 This is CNEAPEE AI v1.2. You can ask me anything, or paste an image to analyze!"
};

export default function Chatbot({ onNavigate }) {
  const [messages, setMessages] = useState([DEFAULT_GREETING]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [history, setHistory] = useState([]);
  const [activeChatId, setActiveChatId] = useState(null);
  const [showHistory, setShowHistory] = useState(false);

  // 🖼️ Media States (New Features)
  const [selectedImage, setSelectedImage] = useState(null); // Stores Base64
  const [imagePreview, setImagePreview] = useState(null);   // Stores Preview URL
  const [isListening, setIsListening] = useState(false);    // Voice State

  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  /* ===========================
     1. AUTO SCROLL
  =========================== */
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping, imagePreview]);

  /* ===========================
     2. FETCH HISTORY ON LOAD
  =========================== */
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
    } catch {
      console.log("History fetch failed");
    }
  };

  /* ===========================
     3. LOAD OLD CHAT
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
     4. IMAGE COMPRESSION LOGIC (Crucial for Speed)
  =========================== */
  const compressImage = (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;
        img.onload = () => {
          // Resize Logic (Max Width 800px)
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
          
          // Convert to JPEG with 70% Quality
          const dataUrl = canvas.toDataURL('image/jpeg', 0.7);
          resolve(dataUrl);
        };
      };
    });
  };

  /* ===========================
     5. IMAGE HANDLER (Upload + Paste)
  =========================== */
  const handleImageFile = async (file) => {
    if (!file) return;
    try {
        const compressedBase64 = await compressImage(file);
        setSelectedImage(compressedBase64); // Send Compressed Version
        setImagePreview(compressedBase64);  // Show Compressed Version
    } catch (e) {
        alert("Image loading failed");
    }
  };

  // Handle Ctrl+V (Paste)
  const handlePaste = (e) => {
    const items = e.clipboardData.items;
    for (let item of items) {
        if (item.type.startsWith("image")) {
            e.preventDefault();
            const file = item.getAsFile();
            handleImageFile(file); // Reuse compression logic
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
     6. VOICE INPUT (Speech to Text)
  =========================== */
  const toggleListening = () => {
    if (isListening) {
      window.speechRecognition?.stop();
      setIsListening(false);
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Your browser does not support voice input.");
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

  /* ===========================
     7. SEND MESSAGE
  =========================== */
  const handleSend = async () => {
    // Prevent empty send unless there is an image
    if (!input.trim() && !selectedImage) return;

    const token = localStorage.getItem("token");
    const userText = input;
    const userImage = selectedImage; // Store locally before clearing

    // A. Show User Message Immediately (Optimistic UI)
    setMessages(prev => [
        ...prev, 
        { 
            role: "user", 
            text: userText,
            image: userImage // Save local preview in message
        }
    ]);

    // B. Clear Inputs
    setInput('');
    clearImage();
    setIsTyping(true);

    try {
      // C. Send to Backend
      const { data } = await axios.post(
        `${API_URL}/send`,
        { 
            prompt: userText, 
            image: userImage, // Sending Base64
            chatId: activeChatId 
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // D. Show AI Response
      setMessages(prev => [...prev, { role: "assistant", text: data.reply }]);

      if (!activeChatId) {
        setActiveChatId(data.chatId);
        fetchHistory();
      }
    } catch (err) {
      let msg = "❌ Connection error.";
      if (err.response?.status === 429) {
        msg = "⚠️ Usage limit reached. Upgrade plan.";
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
              <button onClick={() => setShowHistory(false)}>
                <X size={18} />
              </button>
            </div>

            <div className="space-y-1 overflow-y-auto h-[90%]">
                {history.map(chat => (
                <button
                    key={chat._id}
                    onClick={() => {
                        loadChat(chat._id);
                        setShowHistory(false);
                    }}
                    className="w-full text-left p-3 rounded-xl text-sm text-zinc-400 hover:bg-white/5 truncate transition"
                >
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
          </div>

          <div className="flex gap-2">
            <button onClick={() => setShowHistory(true)} className="p-2 hover:bg-white/5 rounded-lg transition">
              <MessageSquare size={20} />
            </button>
            <button onClick={() => onNavigate("home")} className="p-2 hover:bg-white/5 rounded-lg transition">
              <Home size={20} />
            </button>
          </div>
        </header>

        {/* Messages List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`flex flex-col gap-2 max-w-[85%] md:max-w-[70%]`}>
                
                {/* User Image Display in Chat */}
                {m.image && (
                    <img 
                        src={m.image} 
                        alt="User Upload" 
                        className="rounded-2xl border border-white/10 max-h-64 object-contain bg-black self-end"
                    />
                )}

                {/* Text Message */}
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
                  Thinking...
               </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* --- INPUT BAR --- */}
        <div className="p-4 bg-[#050505] border-t border-white/5">
          <div className="max-w-3xl mx-auto bg-[#0e0e11] rounded-2xl border border-white/10 p-2 relative shadow-2xl">
            
            {/* Image Preview Overlay */}
            {imagePreview && (
                <div className="absolute bottom-full left-0 mb-3 ml-2 animate-in slide-in-from-bottom-2 fade-in">
                    <div className="relative group">
                        <img src={imagePreview} alt="Preview" className="h-24 w-24 object-cover rounded-xl border border-white/20 shadow-lg" />
                        <button 
                            onClick={clearImage}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1.5 shadow-md hover:bg-red-600 transition"
                        >
                            <X size={12} />
                        </button>
                    </div>
                </div>
            )}

            <div className="flex items-end gap-2">
                
                {/* 1. File Upload Button */}
                <input 
                    type="file" 
                    ref={fileInputRef} 
                    accept="image/*" 
                    onChange={(e) => handleImageFile(e.target.files[0])} 
                    hidden 
                />
                <button 
                    onClick={() => fileInputRef.current.click()}
                    className="p-3 text-zinc-400 hover:text-white hover:bg-white/5 rounded-xl transition tooltip"
                    title="Upload Image"
                >
                    <Paperclip size={20} />
                </button>

                {/* 2. Text Input Area */}
                <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            handleSend();
                        }
                    }}
                    onPaste={handlePaste} // 👈 Paste Logic Handle Here
                    placeholder="Message CNEAPEE (Paste images Ctrl+V)..."
                    className="flex-1 bg-transparent text-white placeholder-zinc-600 text-sm py-3 focus:outline-none resize-none max-h-32"
                    rows="1"
                    style={{minHeight: "44px"}}
                />

                {/* 3. Voice Button */}
                <button 
                    onClick={toggleListening}
                    className={`p-3 rounded-xl transition-all duration-300
                    ${isListening 
                        ? "bg-red-500/10 text-red-500 animate-pulse" 
                        : "text-zinc-400 hover:text-white hover:bg-white/5"}`}
                    title="Voice Input"
                >
                    {isListening ? <MicOff size={20} /> : <Mic size={20} />}
                </button>

                {/* 4. Send Button */}
                <button
                    onClick={handleSend}
                    disabled={!input.trim() && !selectedImage}
                    className="p-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition shadow-lg shadow-indigo-500/20"
                >
                    <Send size={18} />
                </button>
            </div>
          </div>
          
          <p className="text-center text-[10px] text-zinc-600 mt-3 font-medium">
            AI can make mistakes. Please verify important information.
          </p>
        </div>

      </main>
    </div>
  );
}