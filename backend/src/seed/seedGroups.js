import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "../models/userModel.js";
import Group from "../models/groupModel.js";

dotenv.config();

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);

  // get existing users (you said you have Hemant etc)
  const users = await User.find().limit(10); // adjust as needed
  if (users.length < 1) {
    console.log("No users found to seed.");
    process.exit(0);
  }

  const group = await Group.create({
    name: "Friends Group",
    description: "Seeded group",
    createdBy: users[0]._id,
    members: users.map(u => u._id)
  });

  console.log("Created group:", group._id);
  process.exit(0);
}

seed().catch(err => {
  console.error(err);
  process.exit(1);
});
