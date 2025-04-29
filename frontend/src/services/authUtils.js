import { ROLES } from '../constants/roles';

export const handleLogin = (navigate, email, password, rememberMe, role) => {
  console.log(`Logging in with ${email}, role ${role}, remember: ${rememberMe}`);
  // Save only the user role in local storage
  localStorage.setItem('userRole', role);
  
  if (role === ROLES.BUYER) {
    navigate('/market');
  } else if (role === ROLES.SELLER) {
    navigate('/seller-dashboard');
  } else {
    navigate('/');
  }
};
