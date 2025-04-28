import defaultImage from '../assets/images/default-product.png';

const backendUrl =
  process.env.REACT_APP_BACKEND_URL ||
  (window.location.hostname === 'localhost' ? 'http://localhost:5000' : '');

export const getImageUrl = (image) => {
  if (!image || typeof image !== 'string' || image.trim() === '') {
    return defaultImage;
  }
  
  const imgPath = image.replace(/\\/g, '/');
  
  // If image is already a full URL, return it directly.
  if (/^https?:\/\//i.test(imgPath)) {
    return imgPath;
  }
  
  // If the image starts with 'uploads/', prepend the backend URL.
  if (imgPath.startsWith('uploads/')) {
    const slash = backendUrl.endsWith('/') ? '' : '/';
    return `${backendUrl}${slash}${imgPath}`;
  }
  
  return defaultImage;
};

export default getImageUrl;
