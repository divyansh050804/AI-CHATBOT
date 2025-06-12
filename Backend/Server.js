const express = require("express");
const cors = require("cors"); // ✅ Add this
const path = require("path");
const dotenv = require("dotenv");
const { OpenAI } = require("openai");

dotenv.config();

const app = express();
const PORT = 5000;

app.use(cors()); // ✅ Enable CORS for all routes
app.use(express.json());
app.use(express.static(path.join(__dirname, "../Frontend")));

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

app.post("/chat", async (req, res) => {
  const userMessage = req.body.message;
  console.log("📩 Incoming:", userMessage);

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: userMessage }],
    });

    const reply = completion.choices[0].message.content;
    res.json({ reply });
  } catch (error) {
    console.error("❌ OpenAI Error:", error.message);
    res.status(500).json({ error: "OpenAI error" });
  }
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../Frontend/index.html"));
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

