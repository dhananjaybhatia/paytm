import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
  try {
    // Extract token from Authorization header
    const authHeader = req.header("Authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ msg: "Access denied. No token provided." });
    }

    const token = authHeader.split(" ")[1]; // Get the token part

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { _id: decoded.id }; // Wrap the user ID in an object with _id

    next(); // Proceed to the next middleware/route handler
  } catch (error) {
    res.status(401).json({ msg: "Invalid or expired token" });
  }
};

export default authMiddleware;
