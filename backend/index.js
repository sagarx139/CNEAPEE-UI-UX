import express from "express";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("CNEAPEE Backend Running 🚀");
});

// ⚠️ CLOUD RUN SAFE PORT
const PORT = process.env.PORT || 8080; // Cloud Run default port 8080 use karta hai
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}`);
});