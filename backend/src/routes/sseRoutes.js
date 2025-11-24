import express from "express";
import Message from "../models/messageModel.js";

const router = express.Router();

// Store all connected clients
let clients = [];

router.get("/stream/:groupId", (req, res) => {
  const groupId = req.params.groupId;

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders();

  const client = { id: Date.now(), groupId, res };
  clients.push(client);

  console.log("💚 Client connected:", client.id);

  req.on("close", () => {
    console.log("❌ Client disconnected:", client.id);
    clients = clients.filter(c => c.id !== client.id);
  });
});

export const sendEventToGroup = (groupId, message) => {
  clients
    .filter(c => c.groupId === groupId.toString())
    .forEach(c => {
      c.res.write(`data: ${JSON.stringify(message)}\n\n`);
    });
};

export default router;
