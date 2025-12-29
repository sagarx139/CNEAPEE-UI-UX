import express from 'express';
import { GoogleGenerativeAI } from "@google/generative-ai";
import User from '../models/user.js';
import Chat from '../models/Chat.js';
import auth from '../middleware/auth.js';

const router = express.Router();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/* ============================
   PLAN LIMITS
============================ */
const PLAN_LIMITS = {
  free:    { daily: 4000,   monthly: 120000 },
  student: { daily: 27000,  monthly: 810000 },
  working: { daily: 60000,  monthly: 1800000 },
  coder:   { daily: 200000, monthly: 6000000 }
};

const estimateTokens = (text = "") => Math.ceil(text.length / 4);

/* ============================
   SYSTEM PROMPT (HIDDEN)
============================ */
const SYSTEM_INSTRUCTION = `
You are CNEAPEE AI.
Never mention Google, Gemini, GPT, LLMs, or training sources.
You are a proprietary AI assistant.
`;

/* ============================
   CHAT SEND
============================ */
router.post('/send', auth, async (req, res) => {
  try {
    const { prompt, chatId } = req.body;
    const raw = (prompt || "").trim();
    const lower = raw.toLowerCase();

    /* ============================
       USER
    ============================ */
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ reply: "User not found" });

    if (!user.usage) {
      user.usage = {
        dailyTokens: 0,
        monthlyTokens: 0,
        lastDailyReset: new Date(),
        lastMonthlyReset: new Date()
      };
      if (!user.plan) user.plan = "free";
      await user.save();
    }

    const limits = PLAN_LIMITS[user.plan || "free"];
    const inputTokens = estimateTokens(raw);

    if (user.usage.dailyTokens + inputTokens > limits.daily) {
      return res.status(429).json({
        reply: "Daily usage limit reached. Please upgrade your plan."
      });
    }

    /* ============================
       🔒 HARD GUARDS (NO AI)
    ============================ */

    // 👉 DATE / TIME (IST)
    if (
      lower === "date" ||
      lower === "time" ||
      lower.includes("date") ||
      lower.includes("time") ||
      lower.includes("today")
    ) {
      const ist = new Date(
        new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" })
      );

      const formatted = ist.toLocaleString("en-IN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false
      });

      return res.json({
        reply: `Today's date and time is ${formatted} IST.`,
        chatId
      });
    }

    // 👉 WHO ARE YOU / CNEAPEE
    if (
      lower.includes("who are you") ||
      lower.includes("what is cneapee") ||
      lower.includes("about cneapee") ||
      lower === "cneapee"
    ) {
      return res.json({
        reply:
          "CNEAPEE AI brings together knowledge, creativity, and holiday cheer into a single, unified ecosystem. Smarter tools, faster insights, zero clutter.",
        chatId
      });
    }

    // 👉 MODEL / GOOGLE / GEMINI
    if (
      lower.includes("model") ||
      lower.includes("google") ||
      lower.includes("gemini") ||
      lower.includes("gpt") ||
      lower.includes("llm") ||
      lower.includes("trained")
    ) {
      return res.json({
        reply: "CNEAPEE AI v1.2. Version v1.8 is coming soon.",
        chatId
      });
    }

    /* ============================
       LOAD HISTORY
    ============================ */
    let history = [];
    let chat;

    if (chatId) {
      chat = await Chat.findOne({ _id: chatId, userId: req.user.id });
      if (chat?.messages?.length) {
        history = chat.messages.map(m => ({
          role: m.role === "user" ? "user" : "model",
          parts: [{ text: m.text }]
        }));
      }
    }

    /* ============================
       GEMINI CALL (ONLY HERE)
    ============================ */
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash-lite",
      systemInstruction: SYSTEM_INSTRUCTION
    });

    const session = model.startChat({ history });
    const result = await session.sendMessage(raw);
    const aiText = result.response.text();

    /* ============================
       USAGE
    ============================ */
    const outputTokens = estimateTokens(aiText);
    user.usage.dailyTokens += inputTokens + outputTokens;
    user.usage.monthlyTokens += inputTokens + outputTokens;
    await user.save();

    /* ============================
       SAVE CHAT
    ============================ */
    if (chat) {
      chat.messages.push({ role: "user", text: raw });
      chat.messages.push({ role: "assistant", text: aiText });
      await chat.save();
    } else {
      chat = new Chat({
        userId: req.user.id,
        title: raw.split(" ").slice(0, 5).join(" ") + "...",
        messages: [
          { role: "user", text: raw },
          { role: "assistant", text: aiText }
        ]
      });
      await chat.save();
    }

    return res.json({
      reply: aiText,
      chatId: chat._id
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ reply: "Server error" });
  }
});

/* ============================
   HISTORY
============================ */
router.get('/history', auth, async (req, res) => {
  const chats = await Chat.find({ userId: req.user.id }).sort({ updatedAt: -1 });
  res.json(chats);
});

router.get('/:id', auth, async (req, res) => {
  const chat = await Chat.findOne({ _id: req.params.id, userId: req.user.id });
  if (!chat) return res.status(404).json({ message: "Chat not found" });
  res.json(chat);
});

export default router;