// import express from "express";
// import Message from "../models/messageModel.js";

// const router = express.Router();

// // Store all connected clients
// let clients = [];

// router.get("/stream/:groupId", (req, res) => {
//   const groupId = req.params.groupId;

//   res.setHeader("Content-Type", "text/event-stream");
//   res.setHeader("Cache-Control", "no-cache");
//   res.setHeader("Connection", "keep-alive");
//   res.flushHeaders();

//   const client = { id: Date.now(), groupId, res };
//   clients.push(client);

//   console.log("💚 Client connected:", client.id);

//   req.on("close", () => {
//     console.log("❌ Client disconnected:", client.id);
//     clients = clients.filter(c => c.id !== client.id);
//   });
// });

// export const sendEventToGroup = (groupId, message) => {
//   clients
//     .filter(c => c.groupId === groupId.toString())
//     .forEach(c => {
//       c.res.write(`data: ${JSON.stringify(message)}\n\n`);
//     });
// };

// export default router;


import express from "express";
import Message from "../models/messageModel.js";

const router = express.Router();

// ⭐ Store all clients by group
let clients = []; 
// each entry = { id, groupId, res }

// -------------------------------------------------------
// ⭐ SSE Stream Route
// -------------------------------------------------------
router.get("/stream/:groupId", (req, res) => {
  const groupId = req.params.groupId;

  // Required SSE headers
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders();

  const client = { id: Date.now(), groupId, res };
  clients.push(client);

  console.log(`💚 Client connected to group ${groupId} → ID: ${client.id}`);

  // Remove client on disconnect
  req.on("close", () => {
    console.log(`❌ Client ${client.id} disconnected`);
    clients = clients.filter(c => c.id !== client.id);
  });
});


// -------------------------------------------------------
// ⭐ Broadcast any data (message, typing, alerts) to a group
// -------------------------------------------------------
export const broadcastToGroup = (groupId, data) => {
  const groupClients = clients.filter(
    (c) => c.groupId.toString() === groupId.toString()
  );

  groupClients.forEach((client) => {
    client.res.write(`data: ${JSON.stringify(data)}\n\n`);
  });

  console.log(`📢 Broadcast to group ${groupId}:`, data);
};

// -------------------------------------------------------
// ⭐ (Optional) Example: Send new message event
// -------------------------------------------------------
export const sendEventToGroup = (groupId, message) => {
  broadcastToGroup(groupId, message);
};

export default router;

