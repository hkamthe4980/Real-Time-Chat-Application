import express from "express";
import { verifyToken } from "../middleware/authMiddleware.js";
import User from "../models/userModel.js"; // ⭐ Import User model

const router = express.Router();

// ⭐ Store all clients by group
let clients = [];
// each entry = { id, groupId, userId, userName, userAvatar, res }

// -------------------------------------------------------
// ⭐ SSE Stream Route (with Presence)
// -------------------------------------------------------
router.get("/stream/:groupId", verifyToken, async (req, res) => {
  //? Extract the group ID and user details from the request body
  const groupId = req.params.groupId;
  const { _id, name: userName, avatar: userAvatar } = req.user;
  const userId = _id.toString();

  // Required SSE headers
  //? The res.setHeader(...) calls are mandatory for SSE
  res.setHeader("Content-Type", "text/event-stream");
  //? Do not cache this response. The data will always be new.
  res.setHeader("Cache-Control", "no-cache");
  //? Keeps the connection alive after the initial request. Keep it open indefinitely.
  res.setHeader("Connection", "keep-alive");
  //? Sends these headers to the client immediately. The connection is now officially open.
  res.flushHeaders();

  // --- PRESENCE LOGIC: ON CONNECTION ---

  //* Update DB: User is Online
  try {
    // await User.findByIdAndUpdate(userId, { isOnline: true }, {
    //   // Ensures schema rules applied
    //   runValidators: true 
    // });
    await User.findByIdAndUpdate(userId, { isOnline: true });
  } catch (error) {
    console.error('Failed to update user online status:', error);
  }

  // 1. Find who is already online in this group, ensuring unique users.
  //? Get only client/user in this group
  const groupClients = clients.filter((c) => c.groupId === groupId);
  //? Create unique users/client list, using Map to avoid duplicates
  const onlineUsersMap = new Map();
  //? Check if the user/client is already in the map - if not then add the user/client
  groupClients.forEach((c) => {
    if (!onlineUsersMap.has(c.userId)) {
      onlineUsersMap.set(c.userId, {
        userId: c.userId,
        userName: c.userName,
        userAvatar: c.userAvatar,
      });
    }
  })
  //? Convert Map values to arr[] -> array of objs, good-to-go data format for frontend
  const onlineUsers = Array.from(onlineUsersMap.values());

  // 2. Send the initial list of online users ONLY to the new client.
  res.write(`event: initial_presence_state\ndata: ${JSON.stringify(onlineUsers)}\n\n`);

  // 3. Create the new client object and add it to the list.
  const newClient = {
    //! can collide if two connections occur in the same millisecond
    id: Date.now(),
    groupId,
    userId,
    userName,
    userAvatar,
    res,
  };
  clients.push(newClient);
  console.log(`💚 Client connected to group ${groupId} → User: ${userName} (ID: ${newClient.id})`);

  // 4. Announce the new user's arrival to EVERYONE in the group.
  broadcastToGroup(groupId, "user_joined", { userId, userName, userAvatar });

  // --- PRESENCE LOGIC: ON DISCONNECTION ---
  //? The callback function filters the clients array, creating a new array that includes everyone except the client that just disconnected. This is essential for cleanup and preventing memory leaks.
  req.on("close", async () => {
    // First, remove the client from the list.
    clients = clients.filter((c) => c.id !== newClient.id);
    console.log(`❌ Client ${newClient.id} disconnected (User: ${userName})`);

    // Check if this was the user's last connection to this specific group.
    // This prevents sending a "user_left" event if they just closed one of multiple tabs.
    //? Can use `filter()` but it needs full scan of the array so lil slower compare to `some()` --  meanwhile `some()` stops after first match
    const isUserStillConnected = clients.some(
      (c) => c.userId === userId && c.groupId === groupId
    );

    //? If the user is completely gone from the group, announce their departure to the remaining clients.
    if (!isUserStillConnected) {
      broadcastToGroup(groupId, "user_left", { userId });

      //? Update DB: User is Offline + Last Seen
      try {
        await User.findByIdAndUpdate(userId, {
          isOnline: false,
          lastSeen: new Date()
        });
      } catch (error) {
        console.error('Failed to update user online status:', error);
      }
    }
  });
});


// -------------------------------------------------------
// ⭐ Broadcast any data with a named event to a group - filters clients by groupId and writes a named SSE event to each client’s res.
// -------------------------------------------------------
export const broadcastToGroup = (groupId, eventName, data) => {
  //? filter group members
  const groupClients = clients.filter(
    (c) => c.groupId.toString() === groupId.toString()
  );

  //? send data to each client/user
  groupClients.forEach((client) => {
    client.res.write(`event: ${eventName}\ndata: ${JSON.stringify(data)}\n\n`);
  });

  if (groupClients.length > 0) {
    console.log(`📢 Broadcast [${eventName}] to group ${groupId} (to ${groupClients.length} clients):`, data);
  }
};

// -------------------------------------------------------
// ⭐ Example: Send new message event (Updated for named events) - broadcasts a named event to a specific group.
// -------------------------------------------------------
export const sendEventToGroup = (groupId, message) => {
  broadcastToGroup(groupId, "new_message", message);
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
