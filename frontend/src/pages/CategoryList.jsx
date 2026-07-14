import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiPlus, FiEdit, FiTrash2, FiLayers } from 'react-icons/fi';
import toast from 'react-hot-toast';
import categoryService from '../api/categoryService';
import ConfirmModal from '../components/ConfirmModal';

function CategoryList() {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deleteModal, setDeleteModal] = useState({ open: false, id: null, name: '' });

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            setLoading(true);
            const response = await categoryService.getAll();
            if (response.success) {
                setCategories(response.data);
            }
        } catch (error) {
            toast.error('Gagal memuat data kategori');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!deleteModal.id) return;
        try {
            await categoryService.delete(deleteModal.id);
            toast.success('Kategori berhasil dihapus');
            setDeleteModal({ open: false, id: null, name: '' });
            fetchCategories();
        } catch (error) {
            const errorMsg = error.response?.data?.message || 'Gagal menghapus kategori';
            toast.error(errorMsg);
        }
    };

    const openDeleteModal = (category) => {
        setDeleteModal({ open: true, id: category.id, name: category.name });
    };

    if (loading) {
        return (
            <div className="loading-container">
                <div className="spinner"></div>
                <p>Memuat kategori...</p>
            </div>
        );
    }

    return (
        <div className="category-list animation-fade">
            <div className="page-header">
                <div>
                    <h1>Daftar Kategori</h1>
                    <p className="page-subtitle">Kelola kategori produk Anda</p>
                </div>
                <Link to="/categories/create" className="btn btn-primary">
                    <FiPlus /> Tambah Kategori
                </Link>
            </div>

            {categories.length === 0 ? (
                <div className="empty-state">
                    <FiLayers className="empty-icon" />
                    <h3>Belum ada kategori</h3>
                    <p>Mulai dengan menambahkan kategori pertama Anda.</p>
                    <Link to="/categories/create" className="btn btn-primary">
                        <FiPlus /> Tambah Kategori
                    </Link>
                </div>
            ) : (
                <div className="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>No</th>
                                <th>Nama Kategori</th>
                                <th style={{ width: '120px', textAlign: 'center' }}>Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {categories.map((category, index) => (
                                <tr key={category.id}>
                                    <td className="td-center">{index + 1}</td>
                                    <td className="td-name">{category.name}</td>
                                    <td className="td-actions" style={{ justifyContent: 'center' }}>
                                        <Link
                                            to={`/categories/edit/${category.id}`}
                                            className="btn-icon btn-edit"
                                            title="Edit"
                                        >
                                            <FiEdit />
                                        </Link>
                                        <button
                                            onClick={() => openDeleteModal(category)}
                                            className="btn-icon btn-delete"
                                            title="Hapus"
                                        >
                                            <FiTrash2 />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            <ConfirmModal
                isOpen={deleteModal.open}
                title="Hapus Kategori"
                message={`Yakin ingin menghapus kategori "${deleteModal.name}"? Pastikan tidak ada produk yang menggunakan kategori ini.`}
                confirmLabel="Ya, Hapus"
                onConfirm={handleDelete}
                onCancel={() => setDeleteModal({ open: false, id: null, name: '' })}
            />
        </div>
    );
}

export default CategoryList;
