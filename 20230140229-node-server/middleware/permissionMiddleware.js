const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET || 'INI_ADALAH_KUNCI_RAHASIA_ANDA_YANG_SANGAT_AMAN';

exports.authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  console.log("Debug - Authorization Header:", authHeader);
  console.log("Debug - Extracted Token:", token ? token.substring(0, 20) + "..." : "null");

  if (token == null) {
    return res
      .status(401)
      .json({ message: "Akses ditolak. Token tidak disediakan." });
  }

  jwt.verify(token, JWT_SECRET, (err, userPayload) => {
    if (err) {
      console.log("JWT Error:", err.message);
      return res
        .status(403)
        .json({ message: "Token tidak valid atau kedaluwarsa.", error: err.message });
    }
    req.user = userPayload;
    next();
  });
};

// Middleware 'isAdmin' sekarang akan memeriksa 'role' dari token
exports.isAdmin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    return res
      .status(403)
      .json({ message: "Akses ditolak. Hanya untuk admin." });
  }
};