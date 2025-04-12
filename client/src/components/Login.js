import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   setLoading(true);
  //   setError('');
  //   try {
  //     // const { data } = await axios.post('http://localhost:5000/api/auth/login', { email, password });
  //     const { data } = await axios.post('/.netlify/functions/auth-login', { email, password });
  //     localStorage.setItem('token', data.token);
  //     window.location.href = '/dashboard'; // Ensure redirect works
  //   } catch (err) {
  //     setError(err.response?.data?.msg || 'Something went wrong');
  //     setLoading(false); // Ensure loading stops on error
  //   }
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const { data } = await axios.post('/.netlify/functions/auth-login', { email, password });
      localStorage.setItem('token', data.token);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setError(err.response?.data?.msg || 'Something went wrong');
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <h2>Habits Tracker</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="Email"
          required
        />
        <input
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder="Password"
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Loading...' : 'Login'}
        </button>
      </form>
    </div>
  );
};

export default Login;