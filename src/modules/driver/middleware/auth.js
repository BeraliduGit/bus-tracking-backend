const jwt = require("jsonwebtoken");
const config = require("../config/constants");

const authenticateToken = (req, res, next) => {
  const secret = config.JWT_SECRET;
  if (!secret) {
    console.error("JWT_SECRET is not defined in environment variables or constants");
    return res.status(500).json({ message: "Server configuration error" });
  }

  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Access token required" });
  }

  try {
    const decoded = jwt.verify(token, secret);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ message: "Invalid or expired token" });
  }
};

const generateToken = (userId, role) => {
  const secret = config.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET is not defined in environment variables or constants");
  }

  return jwt.sign({ id: userId, role }, secret, {
    expiresIn: config.JWT_EXPIRE || "7d",
  });
};

module.exports = { authenticateToken, generateToken };
