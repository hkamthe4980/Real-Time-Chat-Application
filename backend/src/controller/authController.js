import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
// import UserToken from "../models/userTokenModel.js";
// import { verifyToken } from "../middleware/authMiddleware.js";

export const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const existing = await User.findOne({ email });
        if (existing) return res.status(400).json({ message: "User already exists" });

        const passwordHash = await bcrypt.hash(password, 10);
        const newUser = await User.create({ name, email, passwordHash });



        // await UserToken.create({ userId: newUser._id,username:name, planType: "free", tokenBudget: 4000 });


        return res.status(201).json({ message: "User registered", userId: newUser._id });
    } catch (error) {
        res.status(500).json({ error: "Registration failed" });
    }
};

export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: "User not found" });

        const isValid = await bcrypt.compare(password, user.passwordHash);
        if (!isValid) return res.status(401).json({ message: "Invalid credentials" });

        const token = jwt.sign(
            { id: user._id, name: user.name, avatar: user.avatar, planType: user.planType },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
    } catch (error) {
        res.status(500).json({ error: "Login failed" });
    }
};
