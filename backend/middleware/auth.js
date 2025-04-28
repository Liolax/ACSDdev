import mongoose from 'mongoose';

export default function auth(req, res, next) {
  console.log("Running in environment:", process.env.NODE_ENV);
  const authHeader = req.headers.authorization;
  
  // For demonstration, we use a fixed, valid ObjectId as a dummy user.
  // Replace "60b8d2958b26c41f5c7ceee1" with any valid 24-character hex string.
  const validDummyUserId = mongoose.Types.ObjectId("60b8d2958b26c41f5c7ceee1");
  
  if (authHeader) {
    // In production, verify the token and set req.user accordingly.
    req.user = { _id: validDummyUserId };
    return next();
  }
  
  // For development, allow a fallback when no token is provided.
  if (process.env.NODE_ENV === 'development') {
    req.user = { _id: validDummyUserId };
    return next();
  }
  
  return res.status(401).json({ error: 'Unauthorized' });
}
