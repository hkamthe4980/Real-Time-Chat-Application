
import OpenAI from "openai";

import https from "https";
import dotenv from "dotenv";
dotenv.config();
const agent = new https.Agent({ keepAlive: true })
const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY, httpAgent: agent });
export const getLLMStream = async function* (prompt) {
  try {
    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are a helpful assistant for a chat application." },
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








// import OpenAI from "openai";
// import https from "https";
// import dotenv from "dotenv";
// dotenv.config();

// const agent = new https.Agent({ keepAlive: true });
// const client = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY,
//   httpAgent: agent,
// });

// /**
//  * Sleep helper
//  */
// const wait = (ms) => new Promise((res) => setTimeout(res, ms));

// /**
//  * Given an OpenAI error, return retry delay (ms)
//  */
// function getRetryDelay(error, attempt) {
//   if (error.status === 429) {
//     // Use Retry-After header
//     const retryAfter = parseInt(
//       error.response?.headers?.["retry-after"] || "0"
//     );

//     if (retryAfter > 0) return retryAfter * 1000;
//     return Math.min(2000 * Math.pow(2, attempt), 30000); // exponential backoff up to 30s
//   }

//   if (error.status === 500 || error.status === 503) {
//     return Math.min(1000 * Math.pow(2, attempt), 15000); // up to 15s
//   }

//   return 0; // no retry needed
// }

// /**
//  * STREAMED LLM RESPONSE with full error handling + retries
//  */
// export const getLLMStream = async function* (prompt) {
//   const maxRetries = 5;
//   let lastError = null;

//   for (let attempt = 0; attempt <= maxRetries; attempt++) {
//     try {
//       // Try streaming call
//       const response = await client.chat.completions.create({
//         model: "gpt-4o-mini",
//         messages: [{ role: "user", content: prompt }],
//         stream: true,
//       });

//       // If streaming succeeds, stream tokens to backend
//       for await (const chunk of response) {
//         const token = chunk?.choices?.[0]?.delta?.content || "";
//         if (token) yield { text: token };
//       }

//       return; // SUCCESS, stop retrying

//     } catch (error) {
//       lastError = error;
//       console.error(`❌ LLM API ERROR (attempt ${attempt + 1}):`, error.status, error.message);

//       // ===========================
//       // 🔥 HANDLE ERROR TYPES
//       // ===========================

//       // ----- 400 Bad Request -----
//       if (error.status === 400) {
//         yield { error: "Invalid request. Please check your message and try again." };
//         return;
//       }

//       // ----- 403 Forbidden -----
//       if (error.status === 403) {
//         yield { error: "Service authentication failed. Contact support or check API key." };
//         return;
//       }

//       // ----- 429 Rate Limit -----
//       if (error.status === 429) {
//         const delay = getRetryDelay(error, attempt);
//         if (attempt === maxRetries) {
//           yield { error: "Rate limit reached. Please wait and try again." };
//           return;
//         }

//         yield {
//           warning: `Service busy. Retrying in ${Math.round(delay / 1000)} seconds...`,
//         };

//         await wait(delay);
//         continue;
//       }

//       // ----- 500 / 503 Server Errors -----
//       if (error.status === 500 || error.status === 503) {
//         if (attempt === maxRetries) {
//           yield { error: "AI service temporarily unavailable. Try again later." };
//           return;
//         }

//         const delay = getRetryDelay(error, attempt);
//         yield {
//           warning: `AI service unavailable. Retrying in ${Math.round(delay / 1000)}s...`,
//         };

//         await wait(delay);
//         continue;
//       }

//       // ----- Unknown errors -----
//       yield { error: "Unexpected error occurred while calling AI service." };
//       return;
//     }
//   }

//   // If all retries fail
//   yield {
//     error: "Failed to fetch AI response after multiple attempts.",
//     details: lastError?.message,
//   };
// };
