import { useState, useEffect } from 'react';
import { FiSave, FiLock, FiUser } from 'react-icons/fi';
import toast from 'react-hot-toast';
import userService from '../api/userService';
import { useAuth } from '../context/AuthContext';

function Profile() {
    const { user, login, token } = useAuth(); // We need login to update context user info
    
    const [profileData, setProfileData] = useState({
        username: '',
        email: ''
    });
    
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    const [loadingProfile, setLoadingProfile] = useState(false);
    const [loadingPassword, setLoadingPassword] = useState(false);

    useEffect(() => {
        if (user) {
            setProfileData({
                username: user.username,
                email: user.email
            });
        }
    }, [user]);

    const handleProfileChange = (e) => {
        setProfileData({ ...profileData, [e.target.name]: e.target.value });
    };

    const handlePasswordChange = (e) => {
        setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
    };

    const handleProfileSubmit = async (e) => {
        e.preventDefault();
        setLoadingProfile(true);
        try {
            const response = await userService.updateProfile(profileData);
            if (response.success) {
                toast.success('Profil berhasil diupdate');
                // Update local context
                login(token, { ...user, username: profileData.username, email: profileData.email });
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Gagal update profil');
        } finally {
            setLoadingProfile(false);
        }
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            toast.error('Konfirmasi password tidak cocok');
            return;
        }
        
        setLoadingPassword(true);
        try {
            const response = await userService.changePassword({
                currentPassword: passwordData.currentPassword,
                newPassword: passwordData.newPassword
            });
            if (response.success) {
                toast.success('Password berhasil diubah');
                setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Gagal ganti password');
        } finally {
            setLoadingPassword(false);
        }
    };

    return (
        <div className="animation-fade">
            <div className="page-header">
                <div>
                    <h1>Profil Saya</h1>
                    <p className="page-subtitle">Kelola informasi akun Anda</p>
                </div>
            </div>

            <div className="product-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))' }}>
                
                {/* Profile Form */}
                <div className="form-card">
                    <h3 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <FiUser className="text-accent" /> Informasi Dasar
                    </h3>
                    <form onSubmit={handleProfileSubmit}>
                        <div className="form-group">
                            <label>Username</label>
                            <input
                                type="text"
                                name="username"
                                value={profileData.username}
                                onChange={handleProfileChange}
                                required
                                minLength="3"
                            />
                        </div>
                        <div className="form-group">
                            <label>Email</label>
                            <input
                                type="email"
                                name="email"
                                value={profileData.email}
                                onChange={handleProfileChange}
                                required
                            />
                        </div>
                        <div className="form-actions" style={{ marginTop: '16px', paddingTop: '16px' }}>
                            <button type="submit" className="btn btn-primary" disabled={loadingProfile}>
                                <FiSave /> {loadingProfile ? 'Menyimpan...' : 'Update Profil'}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Password Form */}
                <div className="form-card">
                    <h3 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <FiLock className="text-accent" /> Ganti Password
                    </h3>
                    <form onSubmit={handlePasswordSubmit}>
                        <div className="form-group">
                            <label>Password Saat Ini</label>
                            <input
                                type="password"
                                name="currentPassword"
                                value={passwordData.currentPassword}
                                onChange={handlePasswordChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Password Baru</label>
                            <input
                                type="password"
                                name="newPassword"
                                value={passwordData.newPassword}
                                onChange={handlePasswordChange}
                                required
                                minLength="6"
                            />
                        </div>
                        <div className="form-group">
                            <label>Konfirmasi Password Baru</label>
                            <input
                                type="password"
                                name="confirmPassword"
                                value={passwordData.confirmPassword}
                                onChange={handlePasswordChange}
                                required
                                minLength="6"
                            />
                        </div>
                        <div className="form-actions" style={{ marginTop: '16px', paddingTop: '16px' }}>
                            <button type="submit" className="btn btn-primary" disabled={loadingPassword}>
                                <FiSave /> {loadingPassword ? 'Menyimpan...' : 'Ganti Password'}
                            </button>
                        </div>
                    </form>
                </div>

            </div>
        </div>
    );
}

export default Profile;
