import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../api/authService';
import toast from 'react-hot-toast';

const Register = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (formData.password !== formData.confirmPassword) {
            toast.error('Password dan konfirmasi password tidak cocok!');
            return;
        }

        setLoading(true);

        try {
            const { confirmPassword, ...registerData } = formData;
            const response = await authService.register(registerData);
            if (response.success) {
                toast.success('Registrasi berhasil! Silakan login.');
                navigate('/login');
            }
        } catch (error) {
            console.error('Register error', error);
            const message = error.response?.data?.message || 'Registrasi gagal, silakan coba lagi.';
            toast.error(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <div className="auth-header">
                    <span className="brand-icon">📦</span>
                    <h2>Product Manager</h2>
                    <p>Buat akun baru</p>
                </div>

                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="form-group">
                        <label>Username <span className="required">*</span></label>
                        <input
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            placeholder="Masukkan username"
                            required
                            minLength="3"
                        />
                    </div>

                    <div className="form-group">
                        <label>Email <span className="required">*</span></label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Masukkan email"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Password <span className="required">*</span></label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Masukkan password (min 6 karakter)"
                            required
                            minLength="6"
                        />
                    </div>
                    
                    <div className="form-group">
                        <label>Konfirmasi Password <span className="required">*</span></label>
                        <input
                            type="password"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            placeholder="Ketik ulang password"
                            required
                            minLength="6"
                        />
                    </div>

                    <button type="submit" className="btn btn-primary auth-btn" disabled={loading}>
                        {loading ? 'Sedang Mendaftar...' : 'Daftar Sekarang'}
                    </button>
                </form>

                <div className="auth-footer">
                    <p>Sudah punya akun? <Link to="/login">Login di sini</Link></p>
                </div>
            </div>
        </div>
    );
};

export default Register;
