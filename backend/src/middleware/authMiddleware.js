


import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import UserToken from "../models/userTokenModel.js";

export const verifyToken = async (req, res, next) => {
  try {
    let token = null;

    // ✅ Support header-based token
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
    }

    // ✅ Support query-based token (for EventSource)
    if (!token && req.query.token) {
      token = req.query.token;
    }

    if (!token) {
      return res.status(401).json({ message: "Not authorized, token missing" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select("-password");

    // Load user token limits if applicable
    req.userToken = await UserToken.findOne({ userId: req.user._id });
    if (!req.userToken) {
      req.userToken = await UserToken.create({
        userId: req.user._id,
        planType: "free",
        tokenBudget: 4000,
        tokensUsed: 0,
      });
    }

    next();
  } catch (error) {
    console.error("Auth error:", error.message);
    res.status(401).json({ message: "Not authorized, invalid token" });
  }
};
