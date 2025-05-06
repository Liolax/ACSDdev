import defaultImage from '../assets/images/default-product.png';

// Ensure REACT_APP_BACKEND_URL in your .env file is set (e.g., http://localhost:5000)
const backendUrl =
  process.env.REACT_APP_BACKEND_URL ||
  (window.location.hostname === 'localhost' ? 'http://localhost:5000' : '');

const getImageUrl = (imagePath) => {
  if (!imagePath || typeof imagePath !== 'string' || imagePath.trim() === '') {
    return defaultImage;
  }
  const normalizedPath = imagePath.replace(/\\/g, '/');
  if (/^https?:\/\//i.test(normalizedPath)) {
    return normalizedPath;
  }
  const cleanBackendUrl = backendUrl.endsWith('/')
    ? backendUrl.slice(0, -1)
    : backendUrl;
  if (normalizedPath.startsWith('uploads/')) {
    return `${cleanBackendUrl}/${normalizedPath}`;
  }
  return defaultImage;
};

export default getImageUrl;
