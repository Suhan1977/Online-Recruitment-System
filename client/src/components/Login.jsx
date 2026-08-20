import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

function Login({ onLoginSuccess }) {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [message, setMessage] = useState('');
    const [isError, setIsError] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setIsError(false);

        try {
            const res = await axios.post('http://localhost:5000/api/auth/login', formData);
            
            // Save token and user details to localStorage
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('user', JSON.stringify(res.data.user));

            if (onLoginSuccess) onLoginSuccess(res.data.user);

            setMessage('Login successful!');
            setTimeout(() => navigate('/'), 1000);
        } catch (err) {
            setIsError(true);
            setMessage(err.response?.data?.message || 'Invalid email or password.');
        }
    };

    return (
        <div className="job-card" style={{ maxWidth: '400px', margin: '40px auto' }}>
            <h2>Account Login</h2>
            {message && <div className={`message ${isError ? 'error' : ''}`}>{message}</div>}
            
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Email Address</label>
                    <input type="email" name="email" onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label>Password</label>
                    <input type="password" name="password" onChange={handleChange} required />
                </div>
                <button type="submit" className="btn" style={{ width: '100%' }}>Login</button>
            </form>
            <p style={{ marginTop: '15px', textAlign: 'center' }}>
                Don't have an account? <Link to="/register">Register here</Link>
            </p>
        </div>
    );
}

export default Login;