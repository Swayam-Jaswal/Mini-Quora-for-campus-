const jwt = require('jsonwebtoken');

const verifyToken =(req,res,next)=>{
    try {
      const token = req.cookies.access_token;

      if (!token) {
        return res.status(401).json({ message: "Access Denied. No token found" });
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
      next();
    } catch (error) {
      return res.status(403).json({ message: "invalid or expired token" });
    }
}

const verifyAdmin =(req,res,next)=>{
        if(req.user?.role !== "admin"){
            return res.status(403).json({message:"Admin access required"});
        }
        next();
}

module.exports = {verifyToken,verifyAdmin};