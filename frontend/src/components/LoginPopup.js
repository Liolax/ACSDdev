import React, { useState } from 'react';
import '../assets/styles/components/_popup.scss';

const LoginPopup = ({ onClose = () => {}, handleLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [role, setRole] = useState('buyer'); // Default role is buyer

  const onSubmit = (e) => {
    e.preventDefault();
    // Pass the login credentials to the provided login handler.
    handleLogin(email, password, rememberMe, role);
    onClose();
  };

  return (
    <div className="popup-overlay" onClick={onClose}>
      <div className="popup" onClick={(e) => e.stopPropagation()}>
        <h2 className="popup__title">Please Log In</h2>
        <p style={{ textAlign: 'center', color: '#177e48', marginBottom: 12 }}>
          Choose your role: <strong>BUY</strong> or <strong>SELL</strong>.
        </p>
        <form className="popup__form" onSubmit={onSubmit}>
          <label className="popup__label" htmlFor="login-email">Email</label>
          <input
            type="email"
            id="login-email"
            className="popup__input"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <label className="popup__label" htmlFor="login-pass">Password</label>
          <input
            type="password"
            id="login-pass"
            className="popup__input"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <input
              type="checkbox"
              id="remember-me"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              style={{ width: 16, height: 16 }}
            />
            <label htmlFor="remember-me" style={{ fontSize: 14, color: '#177e48' }}>
              Remember Me
            </label>
          </div>
          <div style={{
            display: 'flex', margin: '10px 0 0 0', padding: '7px 0',
            background: '#f5fbe6', borderRadius: 8, justifyContent: 'center'
          }}>
            <span
              className={`toggle-option${role === 'buyer' ? ' active' : ''}`}
              style={{
                flex: 1, textAlign: 'center', padding: '6px 0', cursor: 'pointer',
                background: role === 'buyer' ? '#1caf68' : 'transparent',
                color: role === 'buyer' ? '#fff' : '#177e48',
                fontWeight: 'bold',
                borderRadius: 6,
                transition: 'background 0.14s'
              }}
              onClick={() => setRole('buyer')}
            >
              BUY
            </span>
            <span
              className={`toggle-option${role === 'seller' ? ' active' : ''}`}
              style={{
                flex: 1, textAlign: 'center', padding: '6px 0', cursor: 'pointer',
                background: role === 'seller' ? '#1caf68' : 'transparent',
                color: role === 'seller' ? '#fff' : '#177e48',
                fontWeight: 'bold',
                borderRadius: 6,
                transition: 'background 0.14s'
              }}
              onClick={() => setRole('seller')}
            >
              SELL
            </span>
          </div>
          <button type="submit" className="popup__button" style={{ marginTop: 12 }}>
            Login
          </button>
        </form>
        <button className="popup__close" onClick={onClose} aria-label="Close">
          &times;
        </button>
      </div>
    </div>
  );
};

export default LoginPopup;
