const express = require('express');
const path = require('path');
const cors = require('cors');
const app = express();
const PORT = 3000;

const DEEPSEEK_API_KEY = 'sk-cb72ac3fc77a483996e16a240d1788b4'; // keep secure in production

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

// Dynamic import fetch for CommonJS:
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

app.post('/chat', async (req, res) => {
    const userMessage = req.body.message;

    try {
        const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${DEEPSEEK_API_KEY}`
            },
            body: JSON.stringify({
                model: 'deepseek-chat',
                messages: [
                    { role: 'system', content: 'You are a helpful assistant.' },
                    { role: 'user', content: userMessage }
                ],
                max_tokens: 500,
                temperature: 0.7
            })
        });

        const data = await response.json();

        if (response.ok) {
            res.json({ reply: data.choices[0].message.content });
        } else {
            console.error(data);
            res.status(500).json({ error: data.error?.message || 'DeepSeek API error' });
        }
    } catch (err) {
        console.error('Server Error:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
