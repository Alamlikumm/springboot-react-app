import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../api/authService';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Login = () => {
    const [credentials, setCredentials] = useState({ username: '', password: '' });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCredentials(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await authService.login(credentials);
            if (response.success) {
                const { token, ...userData } = response.data;
                login(token, userData);
                toast.success('Login berhasil!');
                navigate('/dashboard');
            }
        } catch (error) {
            console.error('Login error', error);
            const message = error.response?.data?.message || 'Login gagal, silakan coba lagi.';
            toast.error(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <div className="auth-header">
                    <div className="brand-icon">📦</div>
                    <h2>Product Manager</h2>
                    <p>Silakan login ke akun Anda</p>
                </div>

                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="form-group">
                        <label>Username atau Email <span className="required">*</span></label>
                        <input
                            type="text"
                            name="username"
                            value={credentials.username}
                            onChange={handleChange}
                            placeholder="Masukkan username/email"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Password <span className="required">*</span></label>
                        <input
                            type="password"
                            name="password"
                            value={credentials.password}
                            onChange={handleChange}
                            placeholder="Masukkan password"
                            required
                        />
                    </div>

                    <button type="submit" className="btn btn-primary auth-btn" disabled={loading}>
                        {loading ? 'Sedang Login...' : 'Login'}
                    </button>
                </form>

                <div className="auth-footer">
                    <p>Belum punya akun? <Link to="/register">Daftar sekarang</Link></p>
                </div>
            </div>
        </div>
    );
};

export default Login;
