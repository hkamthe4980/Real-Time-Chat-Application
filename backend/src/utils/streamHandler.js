

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




export const sendBudgetEvent = (res, payload) => {
  // payload is an object describing the budget situation
  // e.g. { type: 'budget_exhausted', message: 'Token budget exhausted', options: [...] }
  res.write(`data: ${JSON.stringify(payload)}\n\n`);
  // res.flush && res.flush();
};