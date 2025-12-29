import express from 'express';
import { GoogleGenerativeAI } from "@google/generative-ai";
import User from '../models/user.js';
import Chat from '../models/Chat.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// 🔑 API Key Setup
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// 📊 Plan Limits Configuration
const PLAN_LIMITS = {
  free:    { daily: 5,   monthly: 50,   tokens: 400 },
  student: { daily: 30,  monthly: 900,  tokens: 800 },
  working: { daily: 50,  monthly: 1500, tokens: 1200 },
  coder:   { daily: 85,  monthly: 2500, tokens: 2000 }
};

// 1. GET ALL CHATS (Sidebar ke liye)
router.get('/history', auth, async (req, res) => {
  try {
    const chats = await Chat.find({ userId: req.user.id }).sort({ updatedAt: -1 });
    res.json(chats);
  } catch (error) {
    res.status(500).json({ message: "History load nahi hui" });
  }
});

// 2. SEND MESSAGE & SAVE (Main Logic)
router.post('/send', auth, async (req, res) => {
  try {
    const { prompt, chatId } = req.body; // Agar chatId hai toh purani chat, nahi toh nayi
    const user = await User.findById(req.user.id);

    // --- A. LIMIT CHECK LOGIC ---
    const limits = PLAN_LIMITS[user.role === 'admin' ? 'coder' : (user.plan || 'free')];
    
    // Reset Daily if new day
    const now = new Date();
    if (now.toDateString() !== new Date(user.usage.lastRequestDate).toDateString()) {
      user.usage.dailyCount = 0;
    }

    if (user.usage.dailyCount >= limits.daily) {
      return res.status(429).json({ message: `Daily limit (${limits.daily}) reached. Upgrade plan!` });
    }

    // --- B. GEMINI AI CALL ---
    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.5-flash-lite", // Latest Lite Model
      generationConfig: { maxOutputTokens: limits.tokens }
    });

    const result = await model.generateContent(prompt);
    const aiResponse = result.response.text();

    // --- C. SAVE HISTORY ---
    let chat;
    if (chatId) {
      // Purani chat update karo
      chat = await Chat.findOne({ _id: chatId, userId: req.user.id });
      chat.messages.push({ role: 'user', text: prompt });
      chat.messages.push({ role: 'assistant', text: aiResponse });
    } else {
      // Nayi chat banao
      // Title generate karo (first 5 words of prompt)
      const title = prompt.split(' ').slice(0, 5).join(' ') + "...";
      chat = new Chat({
        userId: req.user.id,
        title: title,
        messages: [
          { role: 'user', text: prompt },
          { role: 'assistant', text: aiResponse }
        ]
      });
    }
    await chat.save();

    // --- D. UPDATE USER USAGE ---
    user.usage.dailyCount += 1;
    user.usage.monthlyCount += 1;
    user.usage.lastRequestDate = now;
    await user.save();

    res.json({ 
      reply: aiResponse, 
      chatId: chat._id, 
      usage: { current: user.usage.dailyCount, limit: limits.daily },
      historyTitle: chat.title
    });

  } catch (error) {
    console.error("AI Error:", error);
    res.status(500).json({ message: "Server Error: AI connect nahi ho raha." });
  }
});

// 3. GET SPECIFIC CHAT MESSAGES
router.get('/:id', auth, async (req, res) => {
  try {
    const chat = await Chat.findOne({ _id: req.params.id, userId: req.user.id });
    if (!chat) return res.status(404).json({ message: "Chat not found" });
    res.json(chat);
  } catch (error) {
    res.status(500).json({ message: "Error loading chat" });
  }
});

export default router;