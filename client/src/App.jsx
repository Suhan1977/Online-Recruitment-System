import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import JobList from './components/JobList';
import ApplyJob from './components/ApplyJob';
import Login from './components/Login';
import Register from './components/Register';
import './App.css';

function App() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
            setUser(JSON.parse(savedUser));
        }
        setLoading(false);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
    };

    if (loading) return <div>Loading Application...</div>;

    return (
        <Router>
            <div className="container">
                <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                    <Link to="/" style={{ textDecoration: 'none', color: '#333' }}>
                        <h1 style={{ margin: 0 }}>Online Recruitment System</h1>
                    </Link>
                    
                    <nav style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                        {user ? (
                            <>
                                <span>Welcome, <strong>{user.name}</strong></span>
                                <button onClick={handleLogout} className="btn" style={{ backgroundColor: '#dc3545' }}>Logout</button>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="btn" style={{ backgroundColor: '#007bff' }}>Login</Link>
                                <Link to="/register" className="btn" style={{ backgroundColor: '#28a745' }}>Register</Link>
                            </>
                        )}
                    </nav>
                </header>

                <Routes>
                    {/* Protected Routes: If no user, redirect to login */}
                    <Route path="/" element={user ? <JobList user={user} /> : <Navigate to="/login" />} />
                    <Route path="/apply/:jobId" element={user ? <ApplyJob user={user} /> : <Navigate to="/login" />} />
                    
                    {/* Public Routes: If user exists, redirect to home so they can't login again */}
                    <Route path="/login" element={!user ? <Login onLoginSuccess={(u) => setUser(u)} /> : <Navigate to="/" />} />
                    <Route path="/register" element={!user ? <Register /> : <Navigate to="/" />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;