import React from "react";
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { FiGrid, FiPackage, FiPlusCircle, FiLogOut, FiMenu, FiX, FiLayers, FiUsers, FiUser, FiShoppingCart, FiFileText, FiTrendingUp } from 'react-icons/fi';
import { useState } from 'react';

const Sidebar = () => {
    const { isAuthenticated, logout, user } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [mobileOpen, setMobileOpen] = useState(false);

    if (!isAuthenticated) return null;

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const isActive = (path) => {
        return location.pathname.startsWith(path) && (path !== '/' || location.pathname === '/dashboard');
    };

    const navItems = [
        { path: '/dashboard', label: 'Dashboard', icon: <FiGrid /> },
        { path: '/pos', label: 'Kasir (POS)', icon: <FiShoppingCart /> },
        { path: '/transactions', label: 'Riwayat Transaksi', icon: <FiFileText /> },
        { path: '/reports', label: 'Laporan Penjualan', icon: <FiTrendingUp /> },
        { path: '/products', label: 'Produk', icon: <FiPackage /> },
        { path: '/categories', label: 'Kategori', icon: <FiLayers /> },
    ];
    
    if (user?.role === 'ADMIN') {
        navItems.push({ path: '/users', label: 'Users', icon: <FiUsers /> });
    }

    const initials = user?.username ? user.username.substring(0, 2) : 'AD';

    const closeMobile = () => setMobileOpen(false);

    return (
        <>
            <button
                className="sidebar-toggle"
                onClick={() => setMobileOpen(!mobileOpen)}
                aria-label="Toggle sidebar"
            >
                {mobileOpen ? <FiX /> : <FiMenu />}
            </button>

            <div
                className={`sidebar-overlay ${mobileOpen ? 'visible' : ''}`}
                onClick={closeMobile}
            />

            <aside className={`sidebar ${mobileOpen ? 'open' : ''}`}>
                <div className="sidebar-header">
                    <Link to="/dashboard" className="sidebar-brand" onClick={closeMobile}>
                        <div className="sidebar-brand-icon">📦</div>
                        <div>
                            <h2>Product Manager</h2>
                            <span className="sidebar-brand-sub">Management System</span>
                        </div>
                    </Link>
                </div>

                <nav className="sidebar-nav">
                    <div className="sidebar-section-label">Menu Utama</div>
                    {navItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`sidebar-link ${isActive(item.path) ? 'active' : ''}`}
                            onClick={closeMobile}
                        >
                            {item.icon}
                            {item.label}
                        </Link>
                    ))}
                    
                    <div className="sidebar-section-label" style={{ marginTop: '16px' }}>Pengaturan</div>
                    <Link
                        to="/profile"
                        className={`sidebar-link ${isActive('/profile') ? 'active' : ''}`}
                        onClick={closeMobile}
                    >
                        <FiUser />
                        Profil Saya
                    </Link>
                </nav>

                <div className="sidebar-footer">
                    <div className="sidebar-user">
                        <div className="sidebar-avatar">{initials}</div>
                        <div className="sidebar-user-info">
                            <div className="sidebar-user-name">{user?.username || 'Admin'}</div>
                            <div className="sidebar-user-role">{user?.role || 'User'}</div>
                        </div>
                    </div>
                    <button className="sidebar-logout" onClick={handleLogout}>
                        <FiLogOut size={14} />
                        Logout
                    </button>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;
