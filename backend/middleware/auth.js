export default function auth(req, res, next) {
  console.log("Running in environment:", process.env.NODE_ENV);

  // Read the Authorization header from the request
  const authHeader = req.headers.authorization;

  // If the header exists, would normally verify the token here.
  // For now, we set a dummy user.
  if (authHeader) {
    // In production, verify the token and extract user data from it.
    req.user = { _id: 'dummyUserId' };
    return next();
  }

  // For development purposes, allow a fallback when no token is provided.
  if (process.env.NODE_ENV === 'development') {
    req.user = { _id: 'dummyUserId' };
    return next();
  }

  // If no token is provided and we're not in development, return "Unauthorized"
  return res.status(401).json({ error: 'Unauthorized' });
}
