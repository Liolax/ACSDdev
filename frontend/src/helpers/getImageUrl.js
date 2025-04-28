import defaultImage from '../assets/images/default-product.png';

const backendUrl =
  process.env.REACT_APP_BACKEND_URL ||
  (window.location.hostname === 'localhost' ? 'http://localhost:5000' : '');

export const getImageUrl = (image) => {
  if (!image || image.trim() === '') return defaultImage;
  const imgPath = image.replace(/\\/g, '/');
  if (/^https?:\/\//i.test(imgPath)) return imgPath;
  if (imgPath.startsWith('uploads/')) {
    const slash = backendUrl.endsWith('/') ? '' : '/';
    return `${backendUrl}${slash}${imgPath}`;
  }
  return defaultImage;
};
