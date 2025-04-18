import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Login.module.scss';

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
    <div className={styles["login-container"]}>
      <header className={styles.header}>
        <h1>ÉireCraft</h1>
        <p>Artisan Market</p>
        <nav>
          <a href="/">Home</a>
          <a href="/contact">Contact</a>
        </nav>
      </header>
      
      <main className={styles["login-form"]}>
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
          <div className={styles["remember-me"]}>
            <input 
              type="checkbox" 
              id="remember-me" 
              checked={rememberMe} 
              onChange={(e) => setRememberMe(e.target.checked)} 
            />
            <label htmlFor="remember-me">Remember Me</label>
          </div>
          <div className={styles["role-selection"]}>
            <button type="button" onClick={() => handleLogin('BUY')}>
              BUY
            </button>
            <button type="button" onClick={() => handleLogin('SELL')}>
              SELL
            </button>
          </div>
        </form>
      </main>
      
      <footer className={styles.footer}>
        <p>Contact Info | Privacy Policy</p>
      </footer>
    </div>
  );
};

export default Login;
