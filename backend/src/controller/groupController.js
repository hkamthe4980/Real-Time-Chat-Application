import Group from "../models/groupModel.js";
import User from "../models/userModel.js";


export const createGroup = async (req, res) => {
  try {
    const { name, description, createdBy, members } = req.body;

    const group = await Group.create({
      name,
      description,
      createdBy,
      members,
    });

    res.status(201).json(group);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


export const getGroupMembers = async (req, res) => {
  try {
    const group = await Group.findById(req.params.id).populate(
      "members",
      "name email"
    );

    if (!group) return res.status(404).json({ error: "Group not found" });

    res.json(group.members);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


 export const searchGroupMembers = async (req, res) => {
  try {
    let query = req.query.q || "";
    query = query.trim(); 
    console.log("Clean search query:", query);

    const group = await Group.findById(req.params.id);
    if (!group) return res.status(404).json({ error: "Group not found" });

    const members = await User.find({
      _id: { $in: group.members },
      name: { $regex: query, $options: "i" },
    }).select("name email");

    console.log("members:", members);
    res.json(members);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
