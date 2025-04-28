import mongoose from 'mongoose';

console.log("auth middleware loaded");

export default function auth(req, res, next) {
  console.log("Running in environment:", process.env.NODE_ENV);
  const authHeader = req.headers.authorization;
  const dummyUserIdString = "60b8d2958b26c41f5c7ceee1";

  let dummyUserId;
  try {
    // Always use 'new' to construct the ObjectId:
    dummyUserId = new mongoose.Types.ObjectId(dummyUserIdString);
  } catch (error) {
    console.error("Failed to instantiate dummy ObjectId:", error);
    return res.status(500).json({ error: "Internal Server Error: Invalid dummy user ID." });
  }

  // For demonstration, if a token is provided, assign dummy user
  if (authHeader) {
    console.log("Auth Middleware: Token provided, assigning dummy user.");
    req.user = { _id: dummyUserId };
    return next();
  }

  // In development, also assign the dummy user even if token is missing.
  if (process.env.NODE_ENV === 'development') {
    console.warn("Auth Middleware: No token found, assigning dummy user for DEVELOPMENT.");
    req.user = { _id: dummyUserId };
    return next();
  }

  // In production, if no token is provided, return Unauthorized.
  console.warn("Auth Middleware: No token provided in a non-development environment.");
  return res.status(401).json({ error: 'Unauthorized: Access token is required.' });
}
