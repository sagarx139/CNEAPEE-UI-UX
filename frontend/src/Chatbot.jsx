import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import {
  Home, Send, Sparkles, MessageSquare, X,
  Image as ImageIcon, Mic, MicOff, Paperclip
} from 'lucide-react';

// Backend URL
const API_URL = "https://cneapee-backend-703598443794.asia-south1.run.app/api/chat";

const DEFAULT_GREETING = {
  role: "assistant",
  text: "Hello 👋 This is CNEAPEE AI v1.2. Ask me anything or analyze an image!"
};

export default function Chatbot({ onNavigate }) {
  const [messages, setMessages] = useState([DEFAULT_GREETING]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [history, setHistory] = useState([]);
  const [activeChatId, setActiveChatId] = useState(null);
  const [showHistory, setShowHistory] = useState(false);

  // Media States
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isListening, setIsListening] = useState(false);

  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  // Auto Scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping, imagePreview]);

  // Load History
  useEffect(() => { fetchHistory(); }, []);

  const fetchHistory = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      const { data } = await axios.get(`${API_URL}/history`, { headers: { Authorization: `Bearer ${token}` } });
      setHistory(data);
    } catch (e) {}
  };

  const loadChat = async (chatId) => {
    try {
      setIsTyping(true);
      setActiveChatId(chatId);
      const token = localStorage.getItem("token");
      const { data } = await axios.get(`${API_URL}/${chatId}`, { headers: { Authorization: `Bearer ${token}` } });
      setMessages(data.messages);
      setIsTyping(false);
    } catch { setIsTyping(false); }
  };

  // --- 📷 IMAGE COMPRESSION LOGIC ---
  const compressImage = (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;
        img.onload = () => {
          const MAX_WIDTH = 800; // Resize to max 800px width
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
          
          // Compress to JPEG 70% quality
          const dataUrl = canvas.toDataURL('image/jpeg', 0.7);
          resolve(dataUrl);
        };
      };
    });
  };

  // --- 🖼️ IMAGE HANDLER ---
  const handleImageFile = async (file) => {
    if (!file) return;
    try {
        const compressedBase64 = await compressImage(file);
        setSelectedImage(compressedBase64);
        setImagePreview(compressedBase64);
    } catch (e) {
        alert("Image failed to load");
    }
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

  // --- 🎤 VOICE INPUT ---
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
    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onresult = (e) => setInput(prev => prev + " " + e.results[0][0].transcript);
    
    window.speechRecognition = recognition;
    recognition.start();
  };

  // --- 🚀 SEND MESSAGE ---
  const handleSend = async () => {
    if (!input.trim() && !selectedImage) return;

    const token = localStorage.getItem("token");
    const userText = input;
    const userImage = selectedImage;

    // UI Update
    setMessages(prev => [...prev, { role: "user", text: userText, image: userImage }]);
    setInput('');
    clearImage();
    setIsTyping(true);

    try {
      const { data } = await axios.post(
        `${API_URL}/send`,
        { prompt: userText, image: userImage, chatId: activeChatId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setMessages(prev => [...prev, { role: "assistant", text: data.reply }]);
      if (!activeChatId) {
        setActiveChatId(data.chatId);
        fetchHistory();
      }
    } catch (err) {
      let msg = "❌ Error sending message.";
      if(err.message === "Network Error") msg = "❌ Network Error (Check CORS/Backend)";
      if (err.response?.status === 429) msg = "⚠️ Usage limit reached.";
      setMessages(prev => [...prev, { role: "assistant", text: msg }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex h-screen bg-[#050505] text-zinc-100 overflow-hidden font-sans">
      
      {/* HISTORY SIDEBAR */}
      {showHistory && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm" onClick={() => setShowHistory(false)}>
          <div className="absolute right-0 top-0 h-full w-[300px] bg-[#0c0c0e] border-l border-white/5 p-4" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between mb-4">
              <h3 className="font-bold">History</h3>
              <button onClick={() => setShowHistory(false)}><X size={18}/></button>
            </div>
            {history.map(chat => (
              <button key={chat._id} onClick={() => { loadChat(chat._id); setShowHistory(false); }} className="w-full text-left p-3 rounded-lg text-sm text-zinc-400 hover:bg-white/5 truncate mb-1">
                {chat.title}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* MAIN CHAT */}
      <main className="flex-1 flex flex-col">
        <header className="h-16 flex items-center justify-between px-4 border-b border-white/5">
          <div className="flex items-center gap-2 text-indigo-500 font-bold"><Sparkles size={18}/> CNEAPEE AI</div>
          <div className="flex gap-2">
            <button onClick={() => setShowHistory(true)} className="p-2 hover:bg-white/5 rounded"><MessageSquare size={20}/></button>
            <button onClick={() => onNavigate("home")} className="p-2 hover:bg-white/5 rounded"><Home size={20}/></button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
              <div className="flex flex-col gap-2 max-w-[85%] md:max-w-[70%]">
                {m.image && <img src={m.image} alt="Upload" className="rounded-xl border border-white/10 max-h-64 object-contain bg-black" />}
                <div className={`px-5 py-3 rounded-2xl text-sm whitespace-pre-wrap ${m.role === "user" ? "bg-indigo-600 text-white" : "bg-[#18181b] border border-white/10 text-zinc-300"}`}>
                  {m.text}
                </div>
              </div>
            </div>
          ))}
          {isTyping && <div className="text-xs text-zinc-500 animate-pulse px-4">Thinking...</div>}
          <div ref={messagesEndRef} />
        </div>

        {/* INPUT BAR */}
        <div className="p-4 bg-[#050505] border-t border-white/5">
          <div className="max-w-3xl mx-auto bg-[#0e0e11] rounded-2xl border border-white/10 p-2 relative shadow-xl">
            {imagePreview && (
              <div className="absolute bottom-full left-0 mb-2 ml-2">
                <div className="relative group">
                  <img src={imagePreview} className="h-20 w-20 object-cover rounded-lg border border-white/20"/>
                  <button onClick={clearImage} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"><X size={10}/></button>
                </div>
              </div>
            )}
            <div className="flex items-end gap-2">
              <input type="file" ref={fileInputRef} accept="image/*" onChange={e => handleImageFile(e.target.files[0])} hidden />
              <button onClick={() => fileInputRef.current.click()} className="p-3 text-zinc-400 hover:text-white hover:bg-white/5 rounded-xl"><Paperclip size={20}/></button>
              
              <textarea 
                value={input} 
                onChange={e => setInput(e.target.value)} 
                onKeyDown={e => { if(e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); }}}
                onPaste={handlePaste}
                placeholder="Message CNEAPEE (Paste image Ctrl+V)..." 
                className="flex-1 bg-transparent text-white text-sm py-3 focus:outline-none resize-none max-h-32 placeholder:text-zinc-600" 
                rows="1"
              />
              
              <button onClick={toggleListening} className={`p-3 rounded-xl transition ${isListening ? "text-red-500 animate-pulse" : "text-zinc-400 hover:text-white"}`}>
                {isListening ? <MicOff size={20}/> : <Mic size={20}/>}
              </button>
              
              <button onClick={handleSend} disabled={!input.trim() && !selectedImage} className="p-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl disabled:opacity-50">
                <Send size={18}/>
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}