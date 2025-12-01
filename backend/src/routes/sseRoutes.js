import express from "express";
import { verifyToken } from "../middleware/authMiddleware.js";

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
  //? The res.setHeader(...) calls are mandatory for SSE
  res.setHeader("Content-Type", "text/event-stream");
  //? Do not cache this response. The data will always be new.
  res.setHeader("Cache-Control", "no-cache");
  //? Keeps the connection alive after the initial request. Keep it open indefinitely.
  res.setHeader("Connection", "keep-alive");
  //? Sends these headers to the client immediately. The connection is now officially open.
  res.flushHeaders();

  const client = { id: Date.now(), groupId, res };
  clients.push(client);

  console.log(`💚 Client connected to group ${groupId} → ID: ${client.id}`);

  // Remove client on disconnect
  //? This sets up a crucial event listener. This event automatically fires when the client closes the connection (e.g., closes the browser tab, navigates away).
  req.on("close", () => {
    console.log(`❌ Client ${client.id} disconnected`);
    //? The callback function filters the clients array, creating a new array that includes everyone except the client that just disconnected. This is essential for cleanup and preventing memory leaks.
    clients = clients.filter(c => c.id !== client.id);
  });
});

// -------------------------------------------------------
// ⭐ Broadcast any data (message, typing, alerts) to a group
// -------------------------------------------------------
//? This function sends data to all clients in a specific group.
export const broadcastToGroup = (groupId, data) => {
  //? find relevant clients
  const groupClients = clients.filter(
    (c) => c.groupId.toString() === groupId.toString()
  );

  //? send data to each client
  groupClients.forEach((client) => {
    //? returns RAW SSE in frontend
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



//* Notification Routes
// ⭐ Store user clients(connections) for global notifications
// Map<userId, res>
const userClients = new Map();

// -------------------------------------------------------
// ⭐ Global Notification Stream
// -------------------------------------------------------
router.get("/notifications", verifyToken, (req, res) => {
  const userId = req.user._id.toString();

  // Required SSE headers
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders();

  // Store the connection
  userClients.set(userId, res);
  console.log(`🔔 User connected to notifications: ${userId}`);

  // Remove client on disconnect
  req.on("close", () => {
    console.log(`❌ User disconnected from notifications: ${userId}`);
    userClients.delete(userId);
  });
});

// -------------------------------------------------------
// ⭐ Send notification to specific user
// -------------------------------------------------------
export const sendNotificationToUser = (userId, notification) => {
  // extract user connection based on userID
  const clientRes = userClients.get(userId.toString());

  // Write data to the stream if found.
  if (clientRes) {
    clientRes.write(`data: ${JSON.stringify(notification)}\n\n`);
    console.log(`📨 Notification sent to user ${userId}:`, notification);
  }
};

export default router;
