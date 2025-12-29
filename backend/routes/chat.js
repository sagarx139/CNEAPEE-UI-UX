import express from 'express';
import { GoogleGenerativeAI } from "@google/generative-ai";
import User from '../models/user.js';
import Chat from '../models/Chat.js';
import auth from '../middleware/auth.js';

const router = express.Router();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// 📊 PLAN LIMITS (Tokens per Day)
const PLAN_LIMITS = {
  free:    { daily: 4000,   monthly: 120000 },
  student: { daily: 27000,  monthly: 810000 },
  working: { daily: 60000,  monthly: 1800000 },
  coder:   { daily: 200000, monthly: 6000000 }
};

// Helper: Estimate Token Count (1 token ≈ 4 chars)
const estimateTokens = (text) => Math.ceil((text || "").length / 4);

// 🤖 System Instruction for Concise Answers
const SYSTEM_INSTRUCTION = `
You are CNEAPEE, a helpful and precise AI assistant.
RULES:
1. Provide SHORT, direct answers (2-3 sentences max) for general queries.
2. Only provide long explanations or code if explicitly asked.
3. Be efficient to save user tokens.
`;

router.post('/send', auth, async (req, res) => {
  try {
    const { prompt, chatId } = req.body;
    
    // 1. User Fetch
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // ⭐⭐⭐ FIX: OLD USER SCHEMA UPDATE ⭐⭐⭐
    if (!user.usage || !user.usage.lastDailyReset) {
       user.usage = {
         dailyTokens: 0,
         monthlyTokens: 0,
         lastDailyReset: new Date(),
         lastMonthlyReset: new Date()
       };
       if (!user.plan) user.plan = 'free';
       await user.save();
       console.log(`Schema updated for old user: ${user.email}`);
    }
    // ⭐⭐⭐ END FIX ⭐⭐⭐

    // 2. LIMITS & RESET LOGIC
    const now = new Date();
    const limits = PLAN_LIMITS[user.role === 'admin' ? 'coder' : (user.plan || 'free')];

    // Daily Reset
    if (new Date(user.usage.lastDailyReset).toDateString() !== now.toDateString()) {
      user.usage.dailyTokens = 0;
      user.usage.lastDailyReset = now;
    }

    // Monthly Reset
    const lastMonth = new Date(user.usage.lastMonthlyReset);
    if (now.getMonth() !== lastMonth.getMonth()) {
      user.usage.monthlyTokens = 0;
      user.usage.lastMonthlyReset = now;
    }

    // 3. CHECK USAGE
    const inputTokens = estimateTokens(prompt);
    if ((user.usage.dailyTokens || 0) + inputTokens >= limits.daily) {
      return res.status(429).json({ message: "Daily Limit Reached. Upgrade Plan." });
    }

    // 4. AI GENERATION (Using 2.5 Flash Lite for Credits/Speed)
    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.5-flash-lite", 
      systemInstruction: SYSTEM_INSTRUCTION 
    });

    const result = await model.generateContent(prompt);
    const aiResponse = result.response.text();

    // 5. UPDATE DB
    const outputTokens = estimateTokens(aiResponse);
    const totalCost = inputTokens + outputTokens;

    user.usage.dailyTokens = (user.usage.dailyTokens || 0) + totalCost;
    user.usage.monthlyTokens = (user.usage.monthlyTokens || 0) + totalCost;
    await user.save();

    // Save Chat History
    let chat;
    if (chatId) {
      chat = await Chat.findOne({ _id: chatId, userId: req.user.id });
      if (chat) {
        chat.messages.push({ role: 'user', text: prompt });
        chat.messages.push({ role: 'assistant', text: aiResponse });
        await chat.save();
      }
    } else {
      const title = prompt.split(' ').slice(0, 5).join(' ') + "...";
      chat = new Chat({
        userId: req.user.id,
        title: title,
        messages: [{ role: 'user', text: prompt }, { role: 'assistant', text: aiResponse }]
      });
      await chat.save();
    }

    // Calculate Percentage for Frontend
    const percentage = Math.min((user.usage.dailyTokens / limits.daily) * 100, 100);

    res.json({ 
      reply: aiResponse, 
      chatId: chat._id, 
      usagePercent: percentage.toFixed(1), // Send % to update UI
      historyTitle: chat.title
    });

  } catch (error) {
    console.error("AI Error:", error);
    res.status(500).json({ message: "Server Error: AI busy or connection failed." });
  }
});

// GET HISTORY
router.get('/history', auth, async (req, res) => {
  try {
    const chats = await Chat.find({ userId: req.user.id }).sort({ updatedAt: -1 });
    res.json(chats);
  } catch (error) { res.status(500).json({ message: "History Error" }); }
});

// GET SINGLE CHAT
router.get('/:id', auth, async (req, res) => {
  try {
    const chat = await Chat.findOne({ _id: req.params.id, userId: req.user.id });
    if (!chat) return res.status(404).json({ message: "Chat not found" });
    res.json(chat);
  } catch (error) { res.status(500).json({ message: "Chat Error" }); }
});

export default router;