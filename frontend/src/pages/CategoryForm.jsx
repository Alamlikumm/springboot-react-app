import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FiSave, FiArrowLeft } from 'react-icons/fi';
import toast from 'react-hot-toast';
import categoryService from '../api/categoryService';

function CategoryForm() {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEdit = Boolean(id);

    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(false);

    useEffect(() => {
        if (isEdit) {
            fetchCategory();
        }
    }, [id]);

    const fetchCategory = async () => {
        try {
            setFetching(true);
            // Since we don't have getById for category, we'll just fetch all and find it
            const response = await categoryService.getAll();
            if (response.success) {
                const category = response.data.find(c => c.id === parseInt(id));
                if (category) {
                    setName(category.name);
                } else {
                    toast.error('Kategori tidak ditemukan');
                    navigate('/categories');
                }
            }
        } catch (error) {
            toast.error('Gagal memuat data kategori');
            navigate('/categories');
        } finally {
            setFetching(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!name.trim()) {
            toast.error('Nama kategori wajib diisi');
            return;
        }

        setLoading(true);
        try {
            if (isEdit) {
                await categoryService.update(id, { name });
                toast.success('Kategori berhasil diupdate');
            } else {
                await categoryService.create({ name });
                toast.success('Kategori berhasil dibuat');
            }
            navigate('/categories');
        } catch (error) {
            const errorMsg = error.response?.data?.message || 'Gagal menyimpan kategori';
            toast.error(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    if (fetching) {
        return (
            <div className="loading-container">
                <div className="spinner"></div>
                <p>Memuat data kategori...</p>
            </div>
        );
    }

    return (
        <div className="animation-fade">
            <div className="page-header">
                <div>
                    <h1>{isEdit ? 'Edit Kategori' : 'Tambah Kategori Baru'}</h1>
                    <p className="page-subtitle">{isEdit ? 'Perbarui nama kategori' : 'Buat kategori baru untuk produk'}</p>
                </div>
                <button onClick={() => navigate('/categories')} className="btn btn-secondary">
                    <FiArrowLeft /> Kembali
                </button>
            </div>

            <div className="form-card" style={{ maxWidth: '500px' }}>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="name">Nama Kategori <span className="required">*</span></label>
                        <input
                            type="text"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            placeholder="Masukkan nama kategori"
                            autoFocus
                        />
                    </div>

                    <div className="form-actions">
                        <button
                            type="button"
                            onClick={() => navigate('/categories')}
                            className="btn btn-secondary"
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={loading}
                        >
                            <FiSave /> {loading ? 'Menyimpan...' : 'Simpan'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default CategoryForm;
