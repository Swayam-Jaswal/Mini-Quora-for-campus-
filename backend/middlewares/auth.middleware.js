// middlewares/auth.middleware.js
const jwt = require("jsonwebtoken");

// ✅ Verify Token
const verifyToken = (req, res, next) => {
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
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

// ✅ Check for single role
const checkRole = (role) => (req, res, next) => {
  if (!req.user?.role) {
    return res.status(401).json({ message: "Not authenticated" });
  }
  if (req.user.role !== role) {
    return res.status(403).json({ message: `${role} access required` });
  }
  next();
};

// ✅ Allow multiple roles
const allowRoles = (...roles) => (req, res, next) => {
  if (!req.user?.role) {
    return res.status(401).json({ message: "Not authenticated" });
  }
  if (!roles.includes(req.user.role)) {
    return res.status(403).json({ message: "Forbidden" });
  }
  next();
};

module.exports = {
  verifyToken,
  checkRole,
  allowRoles,
};
