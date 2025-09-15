const jwt = require("jsonwebtoken");
const User = require("../models/user");

const roleHierarchy = {
  superadmin: 3,
  admin: 2,
  moderator: 1,
  user: 0,
};

const verifyToken = async (req, res, next) => {
  try {
    let token = null;

    const authHeader = req.headers["authorization"];
    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    }
    if (!token && req.cookies?.access_token) {
      token = req.cookies.access_token;
    }
    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // ✅ Fetch fresh user from DB (to include anonymousMode, privateProfile, etc.)
    const user = await User.findById(decoded.id || decoded._id).select(
      "-password -verificationTokenHash -verificationExpires"
    );
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    req.user = user; // ✅ attach full user document
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

// ✅ Require minimum role (superadmin always allowed)
const checkRole = (role) => (req, res, next) => {
  if (!req.user?.role) {
    return res.status(401).json({ message: "Not authenticated" });
  }
  if (roleHierarchy[req.user.role] < roleHierarchy[role]) {
    return res.status(403).json({ message: `${role} access required` });
  }
  next();
};

// ✅ Allow multiple roles (superadmin always allowed)
const allowRoles = (...roles) => (req, res, next) => {
  if (!req.user?.role) {
    return res.status(401).json({ message: "Not authenticated" });
  }
  if (!roles.includes(req.user.role) && req.user.role !== "superadmin") {
    return res.status(403).json({ message: "Forbidden" });
  }
  next();
};

module.exports = {
  verifyToken,
  checkRole,
  allowRoles,
};
