import { ROLES } from '../constants/roles';

// Login function with validation and user feedback.
export const handleLogin = (navigate, email, password, rememberMe, role) => {
  // Validate required fields before proceeding.
  if (!email || !password) {
    alert("Email and password are required.");
    console.error("Login failed: Missing email or password.");
    return;
  }
  if (!Object.values(ROLES).includes(role)) {
    alert("Invalid role selection.");
    console.error("Login failed: Invalid role.");
    return;
  }

  console.log(`Logging in with ${email}, role ${role}, remember: ${rememberMe}`);
  
  // Generate a dummy token for session management.
  const dummyToken = "dummy.jwt.token"; 
  localStorage.setItem('authToken', dummyToken);
  localStorage.setItem('userRole', role);
  
  // Redirect users based on role.
  if (role === ROLES.BUYER) {
    navigate('/market');
  } else if (role === ROLES.SELLER) {
    navigate('/seller-dashboard');
  } else {
    navigate('/');
  }
};

// Improved logout function that fully clears session data.
export const handleLogout = (navigate) => {
  // Confirm logout before proceeding.
  if (!window.confirm("Are you sure you want to log out?")) return;

  console.log("User logged out.");
  localStorage.removeItem('authToken');
  localStorage.removeItem('userRole');

  // Redirect users to the home page after logout.
  navigate('/');
};
