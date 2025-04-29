import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'our-secret-key';
const DUMMY_BUYER_ID = "60b8d2958b26c41f5c7ceee1";
const DUMMY_SELLER_ID = "60b8d2958b26c41f5c7ceee2";

export default function auth(req, res, next) {
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.slice(7);
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      req.user = { _id: decoded.id, role: decoded.role };
      next();
    } catch (err) {
      console.error("Invalid token provided. Using dummy user for testing.", err);
      req.user = getDummyUser(req.headers['x-dummy-role']);
      next();
    }
  } else {
    console.log("No token provided. Using dummy user for testing.");
    req.user = getDummyUser(req.headers['x-dummy-role']);
    next();
  }
}

// Helper function to assign dummy users in development/testing mode.
function getDummyUser(role) {
  return {
    _id: role === "seller" ? DUMMY_SELLER_ID : DUMMY_BUYER_ID,
    role: role || "buyer",
  };
}

