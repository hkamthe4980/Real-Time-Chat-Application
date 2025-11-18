
// export function sendStreamChunk(res, token) {
//   const textChunk = typeof token === "string" ? token : token.text || token;
//   try {
//     res.write(`data: ${JSON.stringify({ text: textChunk })}\n\n`);
//     if (res.flush) res.flush(); // ensure immediate push if available
//   } catch (err) {
//     console.error("⚠️ Stream write failed:", err.message);
//   }
// }


// // src/utils/streamHandler.js
// export function sendStreamChunk(res, data) {
//   // detect type: normal text or metadata
//   const payload = typeof data === "string" ? { text: data } : data;
//   res.write(`data: ${JSON.stringify(payload)}\n\n`);
//   if (res.flush) res.flush();
// }


// src/utils/streamHandler.js

export function sendStreamChunk(res, obj) {
  try {
    const line = `data: ${JSON.stringify(obj)}\n\n`;
    res.write(line);
    // if running with compress middleware, flush if available
    if (typeof res.flush === "function") res.flush();
  } catch (err) {
    // ignore write errors (connection closed)
    console.warn("sendStreamChunk error:", err?.message || err);
  }
}
