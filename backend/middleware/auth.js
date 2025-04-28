export default function auth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    // In production, would verify the token here.
    req.user = { _id: 'dummyUserId' };
    return next();
  }
  // For development only, provide a fallback:
  if (process.env.NODE_ENV === 'development') {
    req.user = { _id: 'dummyUserId' };
    return next();
  }
  return res.status(401).json({ error: 'Unauthorized' });
}
