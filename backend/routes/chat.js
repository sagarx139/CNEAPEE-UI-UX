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
   PLAN LIMITS (UPDATED)
   Free: 4000
   Neo: 27000
   Working: 60000
   Coder: 204000
============================ */
const PLAN_LIMITS = {
  free:    { daily: 4000,   monthly: 120000 },
  neo:     { daily: 27000,  monthly: 810000 },
  working: { daily: 60000,  monthly: 1800000 },
  coder:   { daily: 204000, monthly: 6120000 }
};

const estimateTokens = (text = "") => Math.ceil(text.length / 4);

/* ============================
   SYSTEM PROMPT
============================ */
const SYSTEM_INSTRUCTION = `
You are CNEAPEE AI.
Never mention Google, Gemini, GPT, LLMs, or training sources.
You are a proprietary AI assistant.
Current Date: 2025.
`;

/* ============================
   CHAT SEND ROUTE
============================ */
router.post('/send', auth, async (req, res) => {
  try {
    // 1. Receive Data (Text + Image)
    const { prompt, image, chatId } = req.body;
    const raw = (prompt || "").trim();
    const lower = raw.toLowerCase();

    /* --- USER CHECK --- */
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ reply: "User not found" });

    if (!user.usage) {
      user.usage = { dailyTokens: 0, monthlyTokens: 0, lastDailyReset: new Date(), lastMonthlyReset: new Date() };
      if (!user.plan) user.plan = "free";
      await user.save();
    }

    const limits = PLAN_LIMITS[user.plan || "free"];
    const imageCost = image ? 300 : 0;
    const inputTokens = estimateTokens(raw) + imageCost;

    if (user.usage.dailyTokens + inputTokens > limits.daily) {
      return res.status(429).json({ reply: "Daily usage limit reached. Please upgrade your plan." });
    }

    /* --- HARD GUARDS (Skip if Image is there) --- */
    if (!image) {
        // Date/Time
        if (lower.includes("date") || lower.includes("time") || lower.includes("today")) {
            const ist = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" }));
            const formatted = ist.toLocaleString("en-IN", {
                day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit", hour12: false
            });
            return res.json({ reply: `Today's date and time is ${formatted} IST.`, chatId });
        }
        // Identity
        if (lower.includes("who are you") || lower === "cneapee") {
            return res.json({ reply: "CNEAPEE AI brings together knowledge, creativity, and holiday cheer into a single, unified ecosystem.", chatId });
        }
        // Model Identity
        if (lower.includes("model") || lower.includes("google") || lower.includes("gemini")) {
            return res.json({ reply: "CNEAPEE AI v1.2. Version v1.8 is coming soon.", chatId });
        }
    }

    /* --- AI GENERATION --- */
    const model = genAI.getGenerativeModel({ 
        model: MODEL_NAME, 
        systemInstruction: SYSTEM_INSTRUCTION 
    });

    let aiText = "";

    // 🔥 CASE A: IMAGE + TEXT (Vision Handling)
    if (image) {
        // Base64 cleaning
        const base64Data = image.includes("base64,") ? image.split(",")[1] : image;
        
        const imagePart = {
            inlineData: {
                data: base64Data,
                mimeType: "image/png"
            }
        };

        // Send Prompt + Image
        const result = await model.generateContent([raw, imagePart]);
        const response = await result.response;
        aiText = response.text();
    } 
    // 💬 CASE B: TEXT ONLY (History Support)
    else {
        let history = [];
        if (chatId) {
            const chatDoc = await Chat.findOne({ _id: chatId, userId: req.user.id });
            if (chatDoc?.messages) {
                history = chatDoc.messages.map(m => ({
                    role: m.role === "user" ? "user" : "model",
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

    /* --- SAVE CHAT --- */
    let chat;
    if (chatId) chat = await Chat.findOne({ _id: chatId, userId: req.user.id });

    const userMsg = { role: "user", text: raw };
    const aiMsg = { role: "assistant", text: aiText };

    if (chat) {
      chat.messages.push(userMsg, aiMsg);
      await chat.save();
    } else {
      chat = new Chat({
        userId: req.user.id,
        title: raw.split(" ").slice(0, 5).join(" ") + "...",
        messages: [userMsg, aiMsg]
      });
      await chat.save();
    }

    res.json({ reply: aiText, chatId: chat._id });

  } catch (err) {
    console.error("❌ AI Error:", err);
    res.status(500).json({ reply: "Server error. If using 2.5-flash-lite, check model availability." });
  }
});

/* ============================
   HISTORY ROUTES
============================ */
router.get('/history', auth, async (req, res) => {
  try {
      const chats = await Chat.find({ userId: req.user.id }).sort({ updatedAt: -1 });
      res.json(chats);
  } catch(e) { res.status(500).json({message: "Error"}); }
});

router.get('/:id', auth, async (req, res) => {
  try {
      const chat = await Chat.findOne({ _id: req.params.id, userId: req.user.id });
      if (!chat) return res.status(404).json({ message: "Chat not found" });
      res.json(chat);
  } catch(e) { res.status(500).json({message: "Error"}); }
});

export default router;