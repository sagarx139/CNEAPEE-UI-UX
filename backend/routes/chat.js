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

// 🤖 Models Config
const TEXT_MODEL_NAME = "gemini-2.5-flash-lite"; 
const IMAGE_MODEL_NAME = "imagen-4.0-fast-generate-001"; // Latest Fast Model

/* ============================
   1. TEXT PLAN LIMITS (Tokens)
============================ */
const TEXT_PLAN_LIMITS = {
  free:    { daily: 4000,   monthly: 120000 },
  neo:     { daily: 27000,  monthly: 810000 },
  working: { daily: 60000,  monthly: 1800000 },
  coder:   { daily: 204000, monthly: 6120000 }
};

/* ============================
   2. IMAGE GENERATION LIMITS (Count)
============================ */
const IMAGE_PLAN_LIMITS = {
  none:          0,   
  gen_ai_first:  25, 
  lite:          99,  
  excess:        199, 
  max:           499  
};

// 💰 Token Costs
const TEXT_TOKEN_DIVISOR = 4;
const IMAGE_UPLOAD_COST = 300; 

const estimateTokens = (text = "") => Math.ceil(text.length / TEXT_TOKEN_DIVISOR);

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
   ROUTE 1: CHAT SEND (Text/Vision)
============================ */
router.post('/send', auth, async (req, res) => {
  try {
    const { prompt, image, chatId } = req.body;
    const raw = (prompt || "").trim();
    const lower = raw.toLowerCase();
    const wordCount = raw.split(/\s+/).length;

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ reply: "User not found" });

    // Initialize usage
    if (!user.usage) {
      user.usage = { dailyTokens: 0, monthlyTokens: 0, generatedImages: 0, lastDailyReset: new Date(), lastMonthlyReset: new Date() };
      if (!user.plan) user.plan = "free";
      if (!user.imagePlan) user.imagePlan = "none";
      await user.save();
    }

    const limits = TEXT_PLAN_LIMITS[user.plan || "free"];
    const imageCost = image ? IMAGE_UPLOAD_COST : 0;
    const inputTokens = estimateTokens(raw) + imageCost;

    if (user.usage.dailyTokens + inputTokens > limits.daily) {
      return res.status(429).json({ reply: "Daily text usage limit reached. Please upgrade your Text Plan." });
    }

    /* --- HARD GUARDS --- */
    if (!image && wordCount <= 15) {
        if (lower.includes("what") && (lower.includes("date") || lower.includes("time"))) {
            const ist = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" }));
            const formatted = ist.toLocaleString("en-IN", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit", hour12: false });
            return res.json({ reply: `Today's date and time is ${formatted} IST.`, chatId });
        }
        if (lower.includes("who are you") || lower === "cneapee" || lower.includes("who made you")) {
            return res.json({ reply: "CNEAPEE AI brings together knowledge, creativity, and holiday cheer into a single, unified ecosystem.", chatId });
        }
        if (lower.includes("which model") || lower.includes("base model") || (lower.includes("what") && lower.includes("model")) || (lower.includes("using") && lower.includes("gemini"))) {
            return res.json({ reply: "CNEAPEE AI v1.2. Version v1.8 is coming soon.", chatId });
        }
    }

    const model = genAI.getGenerativeModel({ model: TEXT_MODEL_NAME, systemInstruction: SYSTEM_INSTRUCTION });
    let aiText = "";

    if (image) {
        const base64Data = image.includes("base64,") ? image.split(",")[1] : image;
        const imagePart = { inlineData: { data: base64Data, mimeType: "image/png" } };
        const result = await model.generateContent([raw, imagePart]);
        const response = await result.response;
        aiText = response.text();
    } else {
        let history = [];
        if (chatId) {
            const chatDoc = await Chat.findOne({ _id: chatId, userId: req.user.id });
            if (chatDoc?.messages) {
                history = chatDoc.messages.map(m => ({ role: m.role === "user" ? "user" : "model", parts: [{ text: m.text }] }));
            }
        }
        const session = model.startChat({ history });
        const result = await session.sendMessage(raw);
        aiText = result.response.text();
    }

    const outputTokens = estimateTokens(aiText);
    user.usage.dailyTokens += inputTokens + outputTokens;
    user.usage.monthlyTokens += inputTokens + outputTokens;
    await user.save();

    let chat;
    if (chatId) chat = await Chat.findOne({ _id: chatId, userId: req.user.id });

    const userMsg = { role: "user", text: raw };
    const aiMsg = { role: "model", text: aiText };

    if (chat) {
      chat.messages.push(userMsg, aiMsg);
      await chat.save();
    } else {
      chat = new Chat({ userId: req.user.id, title: raw.split(" ").slice(0, 5).join(" ") + "...", messages: [userMsg, aiMsg] });
      await chat.save();
    }

    res.json({ reply: aiText, chatId: chat._id });
  } catch (err) {
    console.error("❌ AI Error:", err);
    res.status(500).json({ reply: "Server error. Please try again later." });
  }
});

/* ============================
   ROUTE 2: IMAGE GENERATION
============================ */
router.post('/generate-image', auth, async (req, res) => {
  try {
    const { prompt, chatId } = req.body;
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ reply: "User not found" });

    if (!user.usage) user.usage = { dailyTokens: 0, monthlyTokens: 0, generatedImages: 0 };
    if (!user.imagePlan) user.imagePlan = "none";

    const userImagePlan = user.imagePlan;
    const allowedImages = IMAGE_PLAN_LIMITS[userImagePlan] || 0;
    const currentImages = user.usage.generatedImages || 0;

    if (userImagePlan === 'none' || allowedImages === 0) {
        return res.status(403).json({ reply: "Image Generation is not included. Purchase an Image Plan." });
    }

    if (currentImages >= allowedImages) {
       return res.status(429).json({ reply: `Image limit reached (${currentImages}/${allowedImages}). Upgrade Plan.` });
    }

    const imagenModel = genAI.getGenerativeModel({ model: IMAGE_MODEL_NAME });
    const result = await imagenModel.generateContent(prompt);
    const response = await result.response;
    
    let imageUrl = "";
    if (response.candidates && response.candidates[0].content.parts[0].inlineData) {
        const base64 = response.candidates[0].content.parts[0].inlineData.data;
        const mimeType = response.candidates[0].content.parts[0].inlineData.mimeType || "image/png";
        imageUrl = `data:${mimeType};base64,${base64}`;
    } else {
        throw new Error("No image data returned.");
    }

    user.usage.generatedImages = currentImages + 1;
    await user.save();

    let chat;
    if (chatId) chat = await Chat.findOne({ _id: chatId, userId: req.user.id });

    const userMsg = { role: "user", text: `Generate image: ${prompt}` };
    const aiMsg = { role: "model", text: "Here is your generated image:", image: imageUrl };

    if (chat) {
        chat.messages.push(userMsg, aiMsg);
        await chat.save();
    } else {
        chat = new Chat({ userId: req.user.id, title: `Image: ${prompt.substring(0, 20)}...`, messages: [userMsg, aiMsg] });
        await chat.save();
    }

    res.json({ reply: "Image Generated Successfully", imageUrl, chatId: chat._id });
  } catch (err) {
    console.error("❌ Image Gen Error:", err);
    res.status(500).json({ reply: "Image Generation Failed. Please try again." });
  }
});

/* ============================
   3. HISTORY ROUTES
============================ */
router.get('/history', auth, async (req, res) => {
  try {
      const chats = await Chat.find({ userId: req.user.id }).sort({ updatedAt: -1 });
      res.json(chats);
  } catch(e) { res.status(500).json({message: "Error fetching history"}); }
});

router.get('/:id', auth, async (req, res) => {
  try {
      const chat = await Chat.findOne({ _id: req.params.id, userId: req.user.id });
      if (!chat) return res.status(404).json({ message: "Chat not found" });
      res.json(chat);
  } catch(e) { res.status(500).json({message: "Error loading chat"}); }
});

export default router;