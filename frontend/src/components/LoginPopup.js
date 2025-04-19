import React, { useState } from 'react';

const LoginPopup = ({ closePopup, handleLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [role, setRole] = useState('buyer'); // Default role is "buyer"

  const onSubmit = (e) => {
    e.preventDefault();
    handleLogin(email, password, rememberMe, role);
    closePopup();
  };

  return (
    <div className="login-popup-overlay">
      <div className="login-popup">
        <h2 style={{ marginBottom: 'calc(var(--spacing-unit) * 1.5)' }}>
          Please Log In:
        </h2>
        <form className="login-page__form" onSubmit={onSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
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
          <div className="login-page__role-toggle">
            <span
              className={`toggle-option ${role === 'buyer' ? 'active' : ''}`}
              onClick={() => setRole('buyer')}
            >
              BUY
            </span>
            <span
              className={`toggle-option ${role === 'seller' ? 'active' : ''}`}
              onClick={() => setRole('seller')}
            >
              SELL
            </span>
          </div>
          <button type="submit" className="login-button">
            Login
          </button>
        </form>
        <button className="login-popup__close" onClick={closePopup}>
          &times;
        </button>
      </div>
    </div>
  );
};

export default LoginPopup;
