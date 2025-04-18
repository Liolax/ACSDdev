import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/layouts/Header/Header';
import Footer from '../components/layouts/Footer/Footer';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (role) => {
    console.log(`Logged in as: ${email}, Role: ${role}, Remember Me: ${rememberMe}`);
    navigate(role === 'BUY' ? '/buyer-dashboard' : '/seller-dashboard');
  };

  return (
    <div className="page-container login-page">
      <Header />
      <main className="login-page__form">
        <h2>Login</h2>
        <form>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
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
          <div className="login-page__role-selection">
            <button type="button" onClick={() => handleLogin('BUY')}>
              BUY
            </button>
            <button type="button" onClick={() => handleLogin('SELL')}>
              SELL
            </button>
          </div>
        </form>
      </main>
      <Footer />
    </div>
  );
};

export default Login;
