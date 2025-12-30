import express from 'express';
import { GoogleGenerativeAI } from "@google/generative-ai";
import User from '../models/user.js';
import Chat from '../models/Chat.js';
import auth from '../middleware/auth.js';
import dotenv from 'dotenv';

dotenv.config();
const router = express.Router();

// ✅ Google Gemini Config
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const MODEL_NAME = "gemini-2.5-flash-lite"; 

/* ============================
   PLAN LIMITS
============================ */
const PLAN_LIMITS = {
  free:    { daily: 4000,   monthly: 120000 },
  neo:     { daily: 27000,  monthly: 810000 },
  working: { daily: 60000,  monthly: 1800000 },
  coder:   { daily: 204000, monthly: 6120000 }
};

// Simple token estimation
const estimateTokens = (text = "") => Math.ceil(text.length / 4);

/* ============================
   SYSTEM PROMPT
============================ */
const SYSTEM_INSTRUCTION = `
You are CNEAPEE AI.
Never mention Google, Gemini, GPT, LLMs, or training sources.
You are a proprietary AI assistant.
Current Date: ${new Date().getFullYear()}.
`;

/* ============================
   CHAT SEND ROUTE
============================ */
router.post('/send', auth, async (req, res) => {
  try {
    // 1. Receive Data
    const { prompt, image, chatId } = req.body;
    const raw = (prompt || "").trim();
    const lower = raw.toLowerCase();

    // Word Count
    const wordCount = raw ? raw.split(/\s+/).length : 0;

    /* --- USER CHECK --- */
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ reply: "User not found" });

    // Initialize usage if missing
    if (!user.usage) {
      user.usage = { dailyTokens: 0, monthlyTokens: 0, lastDailyReset: new Date(), lastMonthlyReset: new Date() };
      if (!user.plan) user.plan = "free";
      await user.save();
    }

    const limits = PLAN_LIMITS[user.plan || "free"];
    const imageCost = image ? 300 : 0; // Cost for image processing
    const inputTokens = estimateTokens(raw) + imageCost;

    if (user.usage.dailyTokens + inputTokens > limits.daily) {
      return res.status(429).json({ reply: "Daily usage limit reached. Please upgrade your plan." });
    }

    /* ============================
       HARD GUARDS (Fast Response)
       Skips AI call for simple queries to save tokens/time
    ============================ */
    if (!image && wordCount <= 15 && wordCount > 0) {
        
        // 1. Date/Time Check
        if (lower.includes("what") && (lower.includes("date") || lower.includes("time"))) {
            const ist = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" }));
            const formatted = ist.toLocaleString("en-IN", {
                day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit", hour12: false
            });
            // Note: Hum yahan DB save skip kar rahe hain speed ke liye, 
            // agar history mein dikhana hai to niche wala AI logic use karna padega.
            return res.json({ reply: `Today's date and time is ${formatted} IST.`, chatId });
        }

        // 2. Identity Check
        if (lower.includes("who are you") || lower === "cneapee" || lower.includes("who made you")) {
            return res.json({ reply: "I am CNEAPEE AI v1.2, your intelligent assistant.", chatId });
        }

        // 3. Model Check
        if (lower.includes("which model") || lower.includes("base model")) {
            return res.json({ reply: "CNEAPEE AI v1.2 (Running on Flash-Lite Architecture).", chatId });
        }
    }

    /* --- AI GENERATION --- */
    const model = genAI.getGenerativeModel({ 
        model: MODEL_NAME, 
        systemInstruction: SYSTEM_INSTRUCTION 
    });

    let aiText = "";

    // 🔥 CASE A: IMAGE + TEXT (Multimodal)
    if (image) {
        // Robust Base64 extraction for Ctrl+V
        // Frontend sends: "data:image/jpeg;base64,....."
        const base64Data = image.includes("base64,") ? image.split("base64,")[1] : image;
        
        const imagePart = {
            inlineData: { data: base64Data, mimeType: "image/jpeg" } // Defaulting to jpeg works for most
        };

        const result = await model.generateContent([raw || "Analyze this image", imagePart]);
        const response = await result.response;
        aiText = response.text();
    } 
    // 💬 CASE B: TEXT ONLY (Chat History)
    else {
        let history = [];
        if (chatId) {
            const chatDoc = await Chat.findOne({ _id: chatId, userId: req.user.id });
            if (chatDoc?.messages) {
                // CRITICAL FIX: Map DB 'assistant' -> Gemini 'model'
                // DB stores: 'user' / 'assistant'
                // Gemini wants: 'user' / 'model'
                history = chatDoc.messages.map(m => ({
                    role: m.role === "assistant" ? "model" : "user",
                    parts: [{ text: m.text }]
                }));
            }
        }
        
        const session = model.startChat({ history });
        const result = await session.sendMessage(raw);
        aiText = result.response.text();
    }

    /* --- UPDATE USAGE --- */
    const outputTokens = estimateTokens(aiText);
    user.usage.dailyTokens += inputTokens + outputTokens;
    user.usage.monthlyTokens += inputTokens + outputTokens;
    await user.save();

    /* --- SAVE CHAT HISTORY --- */
    let chat;
    if (chatId) chat = await Chat.findOne({ _id: chatId, userId: req.user.id });

    const userMsg = { role: "user", text: raw, image: image ? image : undefined }; // Save image string if needed (warning: heavy for DB)
    
    // CRITICAL: Save as 'assistant' for Frontend compatibility
    const aiMsg = { role: "assistant", text: aiText };

    if (chat) {
      // Don't save full base64 image string to DB array if it makes doc too large, 
      // but for now keeping logic simple as per request.
      chat.messages.push({ role: "user", text: raw }, aiMsg);
      await chat.save();
    } else {
      chat = new Chat({
        userId: req.user.id,
        title: raw.split(" ").slice(0, 5).join(" ") + "...",
        messages: [{ role: "user", text: raw }, aiMsg]
      });
      await chat.save();
    }

    // Return 'assistant' role to frontend
    res.json({ reply: aiText, chatId: chat._id });

  } catch (err) {
    console.error("❌ AI Error:", err);
    
    // Safety handling for image errors
    if(err.message?.includes("image")) {
        return res.status(400).json({ reply: "Unable to process this image format." });
    }

    res.status(500).json({ reply: "Server error. Please try again later." });
  }
});

/* ============================
   HISTORY ROUTES
============================ */

// 1. Get All Chats
router.get('/history', auth, async (req, res) => {
  try {
      const chats = await Chat.find({ userId: req.user.id })
          .select('title createdAt updatedAt') // Select specific fields for lighter load
          .sort({ updatedAt: -1 });
      res.json(chats);
  } catch(e) { 
      res.status(500).json({message: "Error fetching history"}); 
  }
});

// 2. Get Single Chat
router.get('/:id', auth, async (req, res) => {
  try {
      const chat = await Chat.findOne({ _id: req.params.id, userId: req.user.id });
      if (!chat) return res.status(404).json({ message: "Chat not found" });
      res.json(chat);
  } catch(e) { 
      res.status(500).json({message: "Error loading chat"}); 
  }
});

export default router;