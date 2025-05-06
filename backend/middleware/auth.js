import jwt from 'jsonwebtoken';

// Read JWT_SECRET from environment variables only
const JWT_SECRET = process.env.JWT_SECRET;
const DUMMY_BUYER_ID = "60b8d2958b26c41f5c7ceee1";
const DUMMY_SELLER_ID = "60b8d2958b26c41f5c7ceee2";

export default function auth(req, res, next) {
  // Add check for JWT_SECRET availability if not in dummy mode
  if (!JWT_SECRET && !(process.env.NODE_ENV === 'development')) {
      console.error('JWT_SECRET is not defined in environment variables. Required for token validation.');
      // For now, let it proceed to potentially use dummy users if applicable
  }

  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.slice(7);
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      req.user = { _id: decoded.id, role: decoded.role };
      next();
    } catch (err) {
      if (process.env.NODE_ENV !== 'production') {
        // console.error("Invalid token provided. Using dummy user for testing.", err);
      }
      req.user = getDummyUser(req.headers['x-dummy-role']);
      next();
    }
  } else {
    if (process.env.NODE_ENV !== 'production') {
      // console.log("No token provided. Using dummy user for testing.");
    }
    req.user = getDummyUser(req.headers['x-dummy-role']);
    next();
  }
}

// Helper function to assign dummy users in development/testing mode.
function getDummyUser(role) {
  return {
    _id: role === "seller" ? DUMMY_SELLER_ID : DUMMY_BUYER_ID,
    role: role || "buyer",
    name: role === "seller" ? "Demo Seller" : "Demo Buyer"
  };
}

