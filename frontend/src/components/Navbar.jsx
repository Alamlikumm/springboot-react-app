import React from "react";
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
    const { isAuthenticated, logout, user } = useAuth();
    const navigate = useNavigate();
    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="navbar">
            <div className="navbar-inner">
                <div className="navbar-brand">
                    <span className="brand-icon">📦</span>
                    <h2>Product Manager</h2>
                </div>
                <div className="navbar-info" style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <span className="badge">Spring Boot + React</span>
                    {isAuthenticated && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <span className="user-info"> Halo {user?.username || 'admin'}</span>
                            <button onClick={handleLogout} style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.2)', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontWeight: '500', transition: ' all 0.2s' }} onMouseOver={(e) => e.target.style.background = 'rgba(239, 68, 68, 0.2)'} onMouseOut={(e) => e.target.style.background = 'rgba(239, 68, 68, 0.1)'}>Logout</button>
                        </div>
                    )}
                </div>
            </div>
        </nav>

    );
};

export default Navbar;