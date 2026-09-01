const express = require("express");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();

app.use(express.json());

const genAI = new GoogleGenerativeAI(
  process.env.GEMINI_API_KEY
);

// Test backend
app.get("/", (req, res) => {
  res.json({
    status: "Aaradhya backend is running"
  });
});

// Chat API
app.post("/chat", async (req, res) => {

  try {

    const message = req.body.message;

    if (!message || !message.trim()) {
      return res.status(400).json({
        error: "Message is required"
      });
    }

    console.log("User message:", message);

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash"
    });

    const prompt = `
You are Aaradhya, a friendly female AI companion.

Your main goal is to understand the user's COMPLETE message correctly.

Do not guess what the user means.

If the user asks about Boeing and Airbus,
answer about Boeing and Airbus.

If the user asks about a movie,
answer about that movie.

Do not change the topic.

If the user speaks Telugu, reply in natural conversational Telugu.

Use simple, clear Telugu that sounds natural when spoken aloud.

Do not unnecessarily use English words.

If the user asks in English, answer in English.

Keep answers reasonably short unless the user asks for detailed information.

User message:
${message}
`;

    const result =
      await model.generateContent(prompt);

    const reply =
      result.response.text();

    console.log("AI reply:", reply);

    return res.status(200).json({
      reply: reply
    });

  } catch (error) {

    console.error("Gemini error:", error);

    return res.status(500).json({
      error: "Gemini request failed",
      details: error.message
    });
  }
});

const PORT =
  process.env.PORT || 3000;

app.listen(PORT, () => {

  console.log(
    `Aaradhya backend running on port ${PORT}`
  );

});
