import Group from "../models/groupModel.js";
import User from "../models/userModel.js";
import mongoose from "mongoose";

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


//? get grp profile info
export const getGroupProfile = async (req, resp) => {
  try {
    const groupId = req.params.id;

    // Validate groupId
    if (!groupId) return resp.status(400).json({ error: "❌ No group ID provided" });

    // Validate ObjectId format
    // Checks if the ID is a valid MongoDB ObjectId.
    if (!mongoose.isValidObjectId(groupId)) return resp.status(400).json({ error: "❌ Invalid group ID" });

    //? Assigns ObjectId constructor for later use in aggregation.
    const ObjectId = mongoose.Types.ObjectId;


    const result = await Group.aggregate([
      //? Match group by _id
      { $match: { _id: new ObjectId(groupId) } },

      //? Create a normalized array _memberObjectIds where each member is an ObjectId.
      /* * Below code explantion: 
        If memberIds is missing → replaces with empty array.
        Loops over each member ID.
        For each ID:
        - If it’s already an objectId, keep it.
        - Otherwise convert the string to an ObjectId.
        Stores the result in _memberObjectIds.
        This guarantees the lookup will not break.
      */
      {
        $addFields: {
          _memberObjectIds: {
            $map: {
              input: { $ifNull: ["$members", []] },
              as: "m",
              in: {
                $cond: [
                  { $eq: [{ $type: "$$m" }, "objectId"] },
                  "$$m",
                  { $toObjectId: "$$m" }
                ]
              }
            }
          }
        }
      },

      //? Lookup users where _id is in the converted array.
      {
        $lookup: {
          //? target collection
          from: "waybeyondusers",
          let: { memberObjIds: "$_memberObjectIds" },
          pipeline: [
            {
              $match: {
                $expr: { $in: ["$_id", "$$memberObjIds"] }
              }
            },
            { $project: { _id: 1, name: 1, avatar: 1, isOnline: 1 } }
          ],
          //? new `members` field
          as: "membersInfo"
        }
      },

      //? remove the temporary conversion field
      { $project: { _memberObjectIds: 0 } }
    ]);

    if (!result || result.length === 0) {
      console.log("❌ Group not found for ID:", groupId);
      return resp.status(404).json({ error: "Group not found" });
    }
    console.log("✅ Group found:", result[0].name);

    return resp.status(200).json(result[0]);
    // console.log("result: ", JSON.stringify(result, null, 2));
    // const doc = result[0];

    // doc.memberCount = doc.memberIds ? doc.memberIds.length : 0;
    // doc.membersPreview = (doc.members || []).slice(0, 12);

    // //? delete `memberIds` field
    // delete doc.memberIds;


    // // return resp.status(200).json(result[0]);
    // return resp.status(200).json({
    //     id: String(doc._id),
    //     //? grp name
    //     name: doc.name,
    //     //? grp pfp
    //     avatar: doc.avatar,
    //     description: doc.description,
    //     isOnline: !!doc.isOnline,
    //     adminId: doc.adminId,
    //     memberCount: doc.memberCount,
    //     members: doc.membersPreview, // only name & avatar per member
    //     createdAt: doc.createdAt,
    //     updatedAt: doc.updatedAt

    // });
  }
  catch (err) {
    console.log(`❌ Error form Backend > controllers > group.controller.js: ${err}`);
    resp.status(500).send({ msg: err.message });
  }
}
