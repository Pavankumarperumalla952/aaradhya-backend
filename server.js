const express = require("express");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();

app.use(express.json());

const genAI = new GoogleGenerativeAI(
  process.env.GEMINI_API_KEY
);

app.get("/", (req, res) => {
  res.json({
    status: "Aaradhya backend is running"
  });
});

app.post("/chat", async (req, res) => {

  try {

    const message = req.body.message;

    if (!message) {
      return res.status(400).json({
        error: "Message is required"
      });
    }

    const model =
      genAI.getGenerativeModel({
        model: "gemini-3.5-flash"
      });

    const prompt = `
You are Aaradhya, a friendly female AI companion.

The user is speaking Telugu.

Always reply in natural, fluent, conversational Telugu.

Use clear and pleasant Indian Telugu.

Your Telugu should sound natural when spoken aloud by a Telugu text-to-speech voice.

Do not use an English accent style.

Do not unnecessarily translate Telugu into English.

Avoid robotic, bookish, or unnatural Telugu.

Use simple everyday Telugu that a Telugu-speaking person would naturally understand.

If the user asks a question in English, you may answer in English.

If the user speaks Telugu, answer in Telugu.

User message:
${message}
`;

    const result =
      await model.generateContent(prompt);

    const reply =
      result.response.text();

    res.json({
      reply: reply
    });

  } catch (error) {

    console.error(
      "Gemini error:",
      error
    );

    res.status(500).json({
      error: "Something went wrong"
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
