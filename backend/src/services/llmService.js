
import OpenAI from "openai";

import https from "https";
import dotenv from "dotenv";
dotenv.config();
const agent = new https.Agent({ keepAlive: true })
const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY, httpAgent: agent });
// Generator function for token streaming
export const getLLMStream = async function* (prompt) {
  try {
    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        // { role: "system", content: "You are a helpful assistant for a chat application." },
        { role: "user", content: prompt },
      ],
      stream: true,
    });

    for await (const chunk of response) {
      const token = chunk.choices?.[0]?.delta?.content || "";
      if (token) yield { text: token };
      console.log("🔹 Stream chunk:", token);
    }
  } catch (error) {
    console.error("❌ LLM Stream Error:", error);
    yield { error: "Failed to stream response from OpenAI" };
  }
};
