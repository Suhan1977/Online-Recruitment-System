import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

function Register() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
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
            const res = await axios.post('http://localhost:5000/api/auth/register', formData);
            setMessage(res.data.message);
            setTimeout(() => navigate('/login'), 1500);
        } catch (err) {
            setIsError(true);
            setMessage(err.response?.data?.message || 'Registration failed.');
        }
    };

    return (
        <div className="job-card" style={{ maxWidth: '400px', margin: '40px auto' }}>
            <h2>Create an Account</h2>
            {message && <div className={`message ${isError ? 'error' : ''}`}>{message}</div>}
            
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Full Name</label>
                    <input type="text" name="name" onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label>Email Address</label>
                    <input type="email" name="email" onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label>Password</label>
                    <input type="password" name="password" onChange={handleChange} required />
                </div>
                <button type="submit" className="btn" style={{ width: '100%' }}>Register</button>
            </form>
            <p style={{ marginTop: '15px', textAlign: 'center' }}>
                Already have an account? <Link to="/login">Login here</Link>
            </p>
        </div>
    );
}

export default Register;