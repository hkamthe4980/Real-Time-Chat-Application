import Message from "../models/groupMessageModel.js";
import Group from "../models/groupModel.js";
import { sendEventToGroup, sendNotificationToUser } from "../routes/sseRoutes.js";

/**
 * Send a message in a group
 */
export const sendMessage = async (req, res) => {
  try {
    console.log(
      "req body", req.body
    )
    const { groupId, sender, text, mentions, name } = req.body;
    console.log("name comes from frontend side", name)

    const group = await Group.findById(groupId);
    if (!group) return res.status(404).json({ error: "Group not found" });

    const message = await Message.create({
      groupId,
      sender,
      text,
      mentions,
    });

    // The message is broadcast to the Group Chat. (Only people currently inside that group see this).
    sendEventToGroup(groupId, {
      _id: message._id,
      groupId,
      name,
      sender,
      text,
      mentions,
      createdAt: message.createdAt
    });
    //- Lines 1-36: The message is saved to MongoDB.

    // 2. Send global notifications to mentioned users
    //? check if mentions array is not empty
    if (mentions && mentions.length > 0) {
      //? loop through each mentioned user
      mentions.forEach((userId) => {
        //? trigger notification - pass userId & notification object/data
        sendNotificationToUser(userId, {
          //? type of notification to tell frontend that this is not a chat msg but a notification 
          //? ans payload contains actual notification data
          type: "TAG_NOTIFICATION",
          payload: {
            messageId: message._id,
            groupId,
            groupName: group.name,
            senderName: name,
            text,
            createdAt: message.createdAt,
          },
        });
        console.log(`notification sent to user ${userId} form ${name}`);
      });
    }

    res.status(201).json(message);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * Get all messages in a group
 */
export const getGroupMessages = async (req, res) => {
  try {
    const groupId = req.params.groupId.trim();
    const msgs = await Message.find({ groupId })
      .populate("sender", "name email avatar")
      .populate("mentions", "name email");
    //  console.log("messages" , msgs)
    res.json(msgs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



export const getUserGroupsWithLastMessage = async (req, res) => {
  try {
    const userId = req.user.id; // Decoded from JWT middleware
    console.log("User id from getUserGroupMessage", userId)

    // 1️⃣ Fetch all groups where user is a member
    const groups = await Group.find({ members: userId })
      .populate("members", "name email")
      .sort({ updatedAt: -1 });

    if (!groups.length) {
      return res.json([]);
    }

    // 2️⃣ For each group, fetch the latest message (newest)
    const result = await Promise.all(
      groups.map(async (group) => {
        const lastMessage = await Message.findOne({ groupId: group._id })
          .populate("sender", "name email")
          .sort({ createdAt: -1 }) // latest message
          .lean();

        return {
          groupId: group._id,
          name: group.name,
          avatar: group.avatar,
          members: group.members,
          lastMessage: lastMessage
            ? {
              text: lastMessage.text,
              sender: lastMessage.sender?.name || "Unknown",
              createdAt: lastMessage.createdAt,
            }
            : null,
        };
      })
    );

    res.json(result);
  } catch (err) {
    console.error("Error fetching groups:", err);
    res.status(500).json({ error: err.message });
  }
};
