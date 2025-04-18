import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/layouts/Header';
import Footer from '../components/layouts/Footer';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [role, setRole] = useState('BUY'); // Default role is 'BUY'
  const navigate = useNavigate();

  const handleLogin = () => {
    console.log(`Logged in as: ${email}, Role: ${role}, Remember Me: ${rememberMe}`);
    navigate(role === 'BUY' ? '/buyer-dashboard' : '/seller-dashboard');
  };

  return (
    <div className="page-container login-page">
      <Header />
      <main className="login-page__form">
        <h2>Login</h2>
        <form onSubmit={(e) => e.preventDefault()}>
          <label htmlFor="login-email">Email:</label>
          <input
            type="email"
            id="login-email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <label htmlFor="login-password">Password:</label>
          <input
            type="password"
            id="login-password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <div className="login-page__remember-me">
            <input
              type="checkbox"
              id="remember-me"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
            />
            <label htmlFor="remember-me">Remember Me</label>
          </div>
          {/* Role Toggle */}
          <div className="login-page__role-toggle">
            <span
              className={`toggle-option ${role === 'BUY' ? 'active' : ''}`}
              onClick={() => setRole('BUY')}
            >
              BUY
            </span>
            <span
              className={`toggle-option ${role === 'SELL' ? 'active' : ''}`}
              onClick={() => setRole('SELL')}
            >
              SELL
            </span>
          </div>
          <button type="button" onClick={handleLogin}>
            Login
          </button>
        </form>
      </main>
      <Footer />
    </div>
  );
};

export default Login;
