import mongoose from 'mongoose';

/**
 * Authentication Middleware
 *
 * This middleware checks for an Authorization header.
 * - If found (even in production for now), it assigns a dummy user ID to req.user.
 *   (TODO: Replace with JWT verification in a real production environment)
 * - In development, it falls back to the dummy user if no token is provided.
 * - Otherwise, it responds with a 401 Unauthorized error.
 *
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 * @param {function} next - Express next middleware function
 */
export default function auth(req, res, next) {
  console.log("Running in environment:", process.env.NODE_ENV);
  const authHeader = req.headers.authorization;

  // For demonstration, we use a fixed, valid ObjectId as a dummy user.
  const dummyUserIdString = "60b8d2958b26c41f5c7ceee1";
  
  let dummyUserId;
  try {
    // Use the 'new' keyword to instantiate ObjectId
    dummyUserId = new mongoose.Types.ObjectId(dummyUserIdString);
  } catch (error) {
    console.error("Failed to instantiate dummy ObjectId:", error);
    return res.status(500).json({ error: "Internal Server Error: Invalid dummy user ID." });
  }

  // Scenario 1: If an Authorization header exists, add the dummy user to req.user.
  if (authHeader) {
    console.log("Auth Middleware: Token provided, assigning dummy user.");
    req.user = { _id: dummyUserId };
    return next();
  }

  // Scenario 2: In development, assign the dummy user even if no token is provided.
  if (process.env.NODE_ENV === 'development') {
    console.warn("Auth Middleware: No token found, assigning dummy user for DEVELOPMENT.");
    req.user = { _id: dummyUserId };
    return next();
  }

  // Scenario 3: In production (or non-development), if no token is provided, respond with Unauthorized.
  console.warn("Auth Middleware: No token provided in a non-development environment.");
  return res.status(401).json({ error: 'Unauthorized: Access token is required.' });
}
