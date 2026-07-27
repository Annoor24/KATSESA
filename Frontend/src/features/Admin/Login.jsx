import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const auth = getAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/admin');
    } catch (err) {
      console.error(err);
      setError(err.message || 'Invalid credentials. Please try again.');
    }
  };

  return (
    <div className="login-container">
      <div className="login-card glass-card">
        <h2 className="title">Admin Login</h2>
        <p className="subtitle">Association Executives Only</p>
        
        <form onSubmit={handleLogin}>
          <div className="input-group">
            <label>Email Address</label>
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
            />
          </div>
          
          <div className="input-group">
            <label>Password</label>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
            />
          </div>

          {error && <p className="error-msg">{error}</p>}
          
          <button type="submit" className="login-btn">Sign In</button>
        </form>
        
        <button className="back-link" onClick={() => navigate('/')}>
          ← Back to Site
        </button>
      </div>
    </div>
  );
}

export default Login;
