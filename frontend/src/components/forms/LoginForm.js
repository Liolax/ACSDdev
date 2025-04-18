import React, { useState } from 'react';

const LoginForm = () => {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [role, setRole] = useState('BUY'); // Default role is 'BUY'

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Logging in with credentials:', credentials, 'Role:', role);
  };

  return (
    <div className="login-form">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="login-email">Email:</label>
        <input
          type="email"
          id="login-email"
          name="email"
          value={credentials.email}
          onChange={handleChange}
          required
        />

        <label htmlFor="login-password">Password:</label>
        <input
          type="password"
          id="login-password"
          name="password"
          value={credentials.password}
          onChange={handleChange}
          required
        />

        {/* Role Selection Toggle */}
        <div className="login-form__role-toggle">
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

        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default LoginForm;
