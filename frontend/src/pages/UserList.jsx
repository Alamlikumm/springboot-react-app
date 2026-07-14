import { useState, useEffect } from 'react';
import { FiUsers, FiTrash2, FiShield } from 'react-icons/fi';
import toast from 'react-hot-toast';
import userService from '../api/userService';
import ConfirmModal from '../components/ConfirmModal';

function UserList() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deleteModal, setDeleteModal] = useState({ open: false, id: null, username: '' });

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const response = await userService.getAllUsers();
            if (response.success) {
                setUsers(response.data);
            }
        } catch (error) {
            toast.error('Gagal memuat data user');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!deleteModal.id) return;
        try {
            await userService.deleteUser(deleteModal.id);
            toast.success('User berhasil dihapus');
            setDeleteModal({ open: false, id: null, username: '' });
            fetchUsers();
        } catch (error) {
            toast.error('Gagal menghapus user');
        }
    };

    const openDeleteModal = (user) => {
        setDeleteModal({ open: true, id: user.id, username: user.username });
    };

    if (loading) {
        return (
            <div className="loading-container">
                <div className="spinner"></div>
                <p>Memuat pengguna...</p>
            </div>
        );
    }

    return (
        <div className="animation-fade">
            <div className="page-header">
                <div>
                    <h1>Manajemen Pengguna</h1>
                    <p className="page-subtitle">Kelola akun dan akses pengguna</p>
                </div>
            </div>

            {users.length === 0 ? (
                <div className="empty-state">
                    <FiUsers className="empty-icon" />
                    <h3>Belum ada pengguna</h3>
                </div>
            ) : (
                <div className="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>No</th>
                                <th>Username</th>
                                <th>Email</th>
                                <th>Role</th>
                                <th style={{ width: '120px', textAlign: 'center' }}>Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user, index) => (
                                <tr key={user.id}>
                                    <td className="td-center">{index + 1}</td>
                                    <td className="td-name">{user.username}</td>
                                    <td>{user.email}</td>
                                    <td>
                                        <span className={`product-card-stock ${user.role === 'ADMIN' ? 'low' : ''}`} style={user.role === 'ADMIN' ? {color: 'var(--accent)', background: 'var(--accent-subtle)'} : {}}>
                                            {user.role === 'ADMIN' && <FiShield style={{marginRight: '4px', verticalAlign: 'text-top'}}/>}
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="td-actions" style={{ justifyContent: 'center' }}>
                                        {user.role !== 'ADMIN' && (
                                            <button
                                                onClick={() => openDeleteModal(user)}
                                                className="btn-icon btn-delete"
                                                title="Hapus"
                                            >
                                                <FiTrash2 />
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            <ConfirmModal
                isOpen={deleteModal.open}
                title="Hapus Pengguna"
                message={`Yakin ingin menghapus pengguna "${deleteModal.username}"?`}
                confirmLabel="Ya, Hapus"
                onConfirm={handleDelete}
                onCancel={() => setDeleteModal({ open: false, id: null, username: '' })}
            />
        </div>
    );
}

export default UserList;
