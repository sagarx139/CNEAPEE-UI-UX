import express from 'express';
import { GoogleGenerativeAI } from "@google/generative-ai";
import User from '../models/user.js';
import Chat from '../models/Chat.js';
import auth from '../middleware/auth.js';

const router = express.Router();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// ✅ Vision ke liye ye model best hai
const MODEL_NAME = "gemini-1.5-flash"; 

const PLAN_LIMITS = {
  free:    { daily: 4000,   monthly: 120000 },
  student: { daily: 27000,  monthly: 810000 },
  working: { daily: 60000,  monthly: 1800000 },
  coder:   { daily: 200000, monthly: 6000000 }
};

const estimateTokens = (text = "") => Math.ceil(text.length / 4);

const SYSTEM_INSTRUCTION = `
You are CNEAPEE AI.
Never mention Google, Gemini, GPT, LLMs, or training sources.
You are a proprietary AI assistant.
Current Year: 2025.
`;

router.post('/send', auth, async (req, res) => {
  try {
    // 1️⃣ IMAGE KO YAHAN RECEIVE KARNA ZAROORI HAI
    const { prompt, image, chatId } = req.body; 
    const raw = (prompt || "").trim();

    /* --- USER & LIMITS CHECK --- */
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

    /* --- AI GENERATION --- */
    const model = genAI.getGenerativeModel({ 
        model: MODEL_NAME, 
        systemInstruction: SYSTEM_INSTRUCTION 
    });

    let aiText = "";

    // 2️⃣ AGAR IMAGE HAI TOH YE WALA CODE CHALEGA
    if (image) {
        // Base64 header remove karna (data:image/png;base64,)
        const base64Data = image.includes("base64,") ? image.split(",")[1] : image;
        
        const imagePart = {
            inlineData: {
                data: base64Data,
                mimeType: "image/png"
            }
        };

        // Text + Image bhejo
        const result = await model.generateContent([raw, imagePart]);
        aiText = result.response.text();
    } 
    // 3️⃣ AGAR IMAGE NAHI HAI TOH YE CHALEGA (Chat History ke saath)
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

    /* --- SAVE & RESPOND --- */
    const outputTokens = estimateTokens(aiText);
    user.usage.dailyTokens += inputTokens + outputTokens;
    user.usage.monthlyTokens += inputTokens + outputTokens;
    await user.save();

    let chat;
    if (chatId) chat = await Chat.findOne({ _id: chatId, userId: req.user.id });

    // Note: Image database mein save nahi kar rahe taaki DB slow na ho
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
    console.error("AI Error:", err);
    res.status(500).json({ reply: "Error processing request. Try again." });
  }
});

// History Routes same rahenge...
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