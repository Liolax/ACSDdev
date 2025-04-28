import mongoose from 'mongoose';

/**
 * Authentication Middleware (Demo Version)
 *
 * For demonstration purposes, if no token is provided,
 * this middleware assigns a dummy user. In a real production environment,
 * you should replace this logic with proper JWT verification.
 *
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 * @param {function} next - Express next middleware function
 */
export default function auth(req, res, next) {
  console.log("Running in environment:", process.env.NODE_ENV);
  const authHeader = req.headers.authorization;
  const dummyUserIdString = "60b8d2958b26c41f5c7ceee1";

  let dummyUserId;
  try {
    // Always using 'new' to construct the ObjectId.
    dummyUserId = new mongoose.Types.ObjectId(dummyUserIdString);
  } catch (error) {
    console.error("Failed to instantiate dummy ObjectId:", error);
    return res.status(500).json({ error: "Internal Server Error: Invalid dummy user ID." });
  }

  // For demonstration/testing, if there is a token use it,
  // otherwise, always assign the dummy user.
  if (authHeader) {
    console.log("Auth Middleware: Token provided, assigning dummy user for demonstration.");
    req.user = { _id: dummyUserId };
    return next();
  }

  // Always assign dummy user if no token provided (demo override).
  console.warn("Auth Middleware: No token provided. For demo purposes, assigning dummy user.");
  req.user = { _id: dummyUserId };
  return next();
}
