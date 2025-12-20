const express = require("express");
const path = require("path");
const cors = require("cors");

require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

// 🔹 Serve public folder
app.use(express.static(path.join(__dirname, "../public")));

// 🔹 Home (index.html)
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/index.html"));
});

// 🔹 STUDYHUB ROUTE (IMPORTANT)
app.get("/studyhub", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/studyhub.html"));
});

// 🔹 Gemini summarize API
app.post("/api/summarize", async (req, res) => {
  try {
    const { title, content } = req.body;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `Summarize this topic for study:\n\nTitle: ${title}\n\n${content}`
            }]
          }]
        })
      }
    );

    const data = await response.json();
    res.json(data);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Gemini failed" });
  }
});

app.listen(3000, () => {
  console.log("Server running at http://localhost:3000");
});
