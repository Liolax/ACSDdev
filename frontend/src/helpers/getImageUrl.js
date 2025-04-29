import defaultImage from '../assets/images/default-product.png';

// Ensure REACT_APP_BACKEND_URL in your .env file is set (e.g., http://localhost:5000)
const backendUrl =
  process.env.REACT_APP_BACKEND_URL ||
  (window.location.hostname === 'localhost' ? 'http://localhost:5000' : '');

const getImageUrl = (imagePath) => {
  if (!imagePath || typeof imagePath !== 'string' || imagePath.trim() === '') {
    return defaultImage;
  }
  // Normalize backslashes to forward slashes
  const normalizedPath = imagePath.replace(/\\/g, '/');
  // If already an absolute URL, return it as is
  if (/^https?:\/\//i.test(normalizedPath)) {
    return normalizedPath;
  }
  // Remove trailing slash from backendUrl if present
  const cleanBackendUrl = backendUrl.endsWith('/')
    ? backendUrl.slice(0, -1)
    : backendUrl;
  // If the imagePath starts with "uploads/"
  if (normalizedPath.startsWith('uploads/')) {
    return `${cleanBackendUrl}/${normalizedPath}`;
  }
  // Otherwise, assume it belongs in the uploads folder
  return `${cleanBackendUrl}/uploads/${normalizedPath}`;
};

export default getImageUrl;
