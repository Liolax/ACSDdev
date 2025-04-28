export const handleLogin = (navigate, email, password, rememberMe, role) => {
  console.log(`Logging in with ${email}, role ${role}, remember: ${rememberMe}`);

  // Save user role for persistent header rendering.
  localStorage.setItem('userRole', role);

  // Redirect based on role:
  if (role === 'buyer') {
    navigate('/market');
  } else if (role === 'seller') {
    navigate('/seller-dashboard');
  } else {
    navigate('/');
  }
};
