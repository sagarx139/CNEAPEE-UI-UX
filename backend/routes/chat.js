import express from 'express';
import { GoogleGenerativeAI } from "@google/generative-ai";
import User from '../models/user.js';
import Chat from '../models/Chat.js';
import auth from '../middleware/auth.js';
import dotenv from 'dotenv';

dotenv.config();
const router = express.Router();

// ✅ Google Gemini Config (Sirf Text ke liye)
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// 🤖 Models Config
const TEXT_MODEL_NAME = "gemini-2.5-flash-lite"; 

/* ============================
   1. TEXT PLAN LIMITS
============================ */
const TEXT_PLAN_LIMITS = {
  free:    { daily: 4000,   monthly: 120000 },
  neo:     { daily: 27000,  monthly: 810000 },
  working: { daily: 60000,  monthly: 1800000 },
  coder:   { daily: 204000, monthly: 6120000 }
};

/* ============================
   2. IMAGE GENERATION LIMITS
============================ */
const IMAGE_PLAN_LIMITS = {
  none:          0,   
  gen_ai_first:  25, 
  lite:          99,  
  excess:        199, 
  max:           499  
};

const TEXT_TOKEN_DIVISOR = 4;
const IMAGE_UPLOAD_COST = 300; 
const estimateTokens = (text = "") => Math.ceil(text.length / TEXT_TOKEN_DIVISOR);

const SYSTEM_INSTRUCTION = `You are CNEAPEE AI. Never mention Google, Gemini, GPT, LLMs, or training sources.`;

/* ============================
   ROUTE 1: TEXT CHAT
============================ */
router.post('/send', auth, async (req, res) => {
  try {
    const { prompt, image, chatId } = req.body;
    const raw = (prompt || "").trim();
    const wordCount = raw.split(/\s+/).length;

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ reply: "User not found" });

    // Initialize usage if missing
    if (!user.usage) {
      user.usage = { dailyTokens: 0, monthlyTokens: 0, generatedImages: 0 };
      if (!user.plan) user.plan = "free";
      if (!user.imagePlan) user.imagePlan = "none";
      await user.save();
    }

    const limits = TEXT_PLAN_LIMITS[user.plan || "free"] || TEXT_PLAN_LIMITS["free"];
    const imageCost = image ? IMAGE_UPLOAD_COST : 0;
    const inputTokens = estimateTokens(raw) + imageCost;

    if (user.usage.dailyTokens + inputTokens > limits.daily) {
      return res.status(429).json({ reply: "Daily text limit reached. Upgrade plan." });
    }

    // Hard Guards
    if (!image && wordCount <= 15) {
        const lower = raw.toLowerCase();
        if (lower.includes("model") || lower.includes("training")) {
            return res.json({ reply: "CNEAPEE AI v1.2.", chatId });
        }
    }

    const model = genAI.getGenerativeModel({ model: TEXT_MODEL_NAME, systemInstruction: SYSTEM_INSTRUCTION });
    let aiText = "";

    if (image) {
        const base64Data = image.includes("base64,") ? image.split(",")[1] : image;
        const imagePart = { inlineData: { data: base64Data, mimeType: "image/png" } };
        const result = await model.generateContent([raw, imagePart]);
        aiText = result.response.text();
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

    if (chat) { chat.messages.push(userMsg, aiMsg); await chat.save(); } 
    else { chat = new Chat({ userId: req.user.id, title: raw.substring(0, 20), messages: [userMsg, aiMsg] }); await chat.save(); }

    res.json({ reply: aiText, chatId: chat._id });

  } catch (err) {
    console.error("Chat Error:", err);
    res.status(500).json({ reply: "Server Busy." });
  }
});

/* ============================
   ROUTE 2: IMAGE GENERATION (FIXED 500 ERROR)
   Uses: Pollinations.ai (No Key Required, Very Fast)
============================ */
router.post('/generate-image', auth, async (req, res) => {
  try {
    const { prompt, chatId } = req.body;
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ reply: "User not found" });

    // Initialize usage/plan if missing
    if (!user.usage) user.usage = { generatedImages: 0 };
    if (!user.imagePlan) user.imagePlan = "none";

    const userImagePlan = (user.imagePlan || "none").toLowerCase();
    const allowedImages = IMAGE_PLAN_LIMITS[userImagePlan] || 0;
    const currentImages = user.usage.generatedImages || 0;

    // 1. Check Plan (This triggers 403 if plan is none)
    if (userImagePlan === 'none' || allowedImages === 0) {
        return res.status(403).json({ reply: "Please purchase an Image Plan (Gen AI First) to start creating." });
    }

    // 2. Check Limits
    if (currentImages >= allowedImages) {
       return res.status(429).json({ reply: `Monthly limit reached (${currentImages}/${allowedImages}). Upgrade Plan.` });
    }

    // 3. Generate Image URL (Pollinations AI - Fast & Reliable)
    // We append a random seed to ensure uniqueness
    const seed = Math.floor(Math.random() * 1000000);
    const encodedPrompt = encodeURIComponent(prompt);
    // Using 'flux' model for high quality
    const imageUrl = `https://pollinations.ai/p/${encodedPrompt}?width=1024&height=1024&seed=${seed}&model=flux`;

    // 4. Update Usage
    user.usage.generatedImages = currentImages + 1;
    await user.save();

    // 5. Save Chat
    let chat;
    if (chatId) chat = await Chat.findOne({ _id: chatId, userId: req.user.id });
    const userMsg = { role: "user", text: `Generate: ${prompt}` };
    // Save image URL in DB
    const aiMsg = { role: "model", text: "Here is your generated image:", image: imageUrl };

    if (chat) { chat.messages.push(userMsg, aiMsg); await chat.save(); }
    else { chat = new Chat({ userId: req.user.id, title: `Img: ${prompt.substring(0, 15)}`, messages: [userMsg, aiMsg] }); await chat.save(); }

    res.json({ reply: "Image Generated Successfully!", imageUrl, chatId: chat._id });

  } catch (err) {
    console.error("Image Gen Error:", err);
    res.status(500).json({ reply: "Image Generation Failed. Please try again later." });
  }
});

/* ============================
   3. HISTORY ROUTES
============================ */
router.get('/history', auth, async (req, res) => {
  try { const chats = await Chat.find({ userId: req.user.id }).sort({ updatedAt: -1 }); res.json(chats); } 
  catch(e) { res.status(500).json({message: "Error"}); }
});

router.get('/:id', auth, async (req, res) => {
  try { const chat = await Chat.findOne({ _id: req.params.id, userId: req.user.id }); res.json(chat); } 
  catch(e) { res.status(500).json({message: "Error"}); }
});

export default router;