import React, { useState } from 'react';
import '../assets/styles/components/_popup.scss';
import { ROLES } from '../constants/roles';
import { useAuth } from '../context/AuthContext'; // Import useAuth
import { useNavigate } from 'react-router-dom';

const LoginPopup = ({ onClose = () => {}, handleLogin: onLoginProp }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [role, setRole] = useState(ROLES.BUYER); // Default role is buyer

  const { login: authLogin } = useAuth(); // Get login function from context
  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    // Pass the login credentials to the provided login handler.
    try {
      await authLogin({ email, password, role });
      // Redirect after login based on role
      if (role === ROLES.BUYER) {
        navigate('/market');
      } else if (role === ROLES.SELLER) {
        navigate('/seller-dashboard');
      }
      onClose();
      // Optionally call onLoginProp for navigation or other side effects
      if (onLoginProp) {
        // onLoginProp(email, password, rememberMe, role);
      }
    } catch (error) {
      console.error("Login failed:", error);
      // Optionally show error to user
    }
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
              className={`toggle-option${role === ROLES.BUYER ? ' active' : ''}`}
              style={{
                flex: 1, textAlign: 'center', padding: '6px 0', cursor: 'pointer',
                background: role === ROLES.BUYER ? '#1caf68' : 'transparent',
                color: role === ROLES.BUYER ? '#fff' : '#177e48',
                fontWeight: 'bold',
                borderRadius: 6,
                transition: 'background 0.14s'
              }}
              onClick={() => setRole(ROLES.BUYER)}
            >
              BUY
            </span>
            <span
              className={`toggle-option${role === ROLES.SELLER ? ' active' : ''}`}
              style={{
                flex: 1, textAlign: 'center', padding: '6px 0', cursor: 'pointer',
                background: role === ROLES.SELLER ? '#1caf68' : 'transparent',
                color: role === ROLES.SELLER ? '#fff' : '#177e48',
                fontWeight: 'bold',
                borderRadius: 6,
                transition: 'background 0.14s'
              }}
              onClick={() => setRole(ROLES.SELLER)}
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
