import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FiSave, FiArrowLeft, FiImage, FiUploadCloud } from 'react-icons/fi';
import toast from 'react-hot-toast';
import productService from '../api/productService';
import categoryService from '../api/categoryService';
import fileService from '../api/fileService';

function ProductForm() {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEdit = Boolean(id);
    const fileInputRef = useRef(null);

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        stock: 0,
        imageUrl: '',
        categoryId: ''
    });
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(false);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        fetchInitialData();
    }, [id]);

    const fetchInitialData = async () => {
        try {
            setFetching(true);
            
            // Fetch categories first
            const catResponse = await categoryService.getAll();
            if (catResponse.success) {
                setCategories(catResponse.data);
            }

            if (isEdit) {
                const response = await productService.getById(id);
                if (response.success) {
                    setFormData({
                        name: response.data.name,
                        description: response.data.description || '',
                        price: response.data.price,
                        stock: response.data.stock,
                        imageUrl: response.data.imageUrl || '',
                        categoryId: response.data.categoryId || ''
                    });
                }
            }
        } catch (error) {
            toast.error('Gagal memuat data');
            navigate('/products');
        } finally {
            setFetching(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Basic validation
        if (!file.type.startsWith('image/')) {
            toast.error('Harap pilih file gambar');
            return;
        }

        setUploading(true);
        try {
            const response = await fileService.uploadImage(file);
            if (response.success) {
                setFormData(prev => ({ ...prev, imageUrl: response.data.imageUrl }));
                toast.success('Gambar berhasil diupload');
            }
        } catch (error) {
            toast.error('Gagal mengupload gambar');
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const payload = {
                ...formData,
                price: parseFloat(formData.price),
                stock: parseInt(formData.stock),
                categoryId: formData.categoryId ? parseInt(formData.categoryId) : null
            };

            if (isEdit) {
                await productService.update(id, payload);
                toast.success('Produk berhasil diupdate');
            } else {
                await productService.create(payload);
                toast.success('Produk berhasil dibuat');
            }
            navigate('/products');
        } catch (error) {
            const errorMsg = error.response?.data?.message ||
                (isEdit ? 'Gagal mengupdate produk' : 'Gagal membuat produk');
            toast.error(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    if (fetching) {
        return (
            <div className="loading-container">
                <div className="spinner"></div>
                <p>Memuat data produk...</p>
            </div>
        );
    }

    return (
        <div className="product-form-page animation-fade">
            <div className="page-header">
                <div>
                    <h1>{isEdit ? 'Edit Produk' : 'Tambah Produk Baru'}</h1>
                    <p className="page-subtitle">{isEdit ? 'Perbarui informasi produk' : 'Isi detail produk baru'}</p>
                </div>
                <button onClick={() => navigate('/products')} className="btn btn-secondary">
                    <FiArrowLeft /> Kembali
                </button>
            </div>

            <div className="form-card">
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="name">Nama Produk <span className="required">*</span></label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            placeholder="Masukkan nama produk"
                            autoFocus
                        />
                    </div>
                    
                    <div className="form-group">
                        <label htmlFor="categoryId">Kategori</label>
                        <select
                            id="categoryId"
                            name="categoryId"
                            value={formData.categoryId}
                            onChange={handleChange}
                            style={{ width: '100%', padding: '9px 12px', background: 'var(--bg-input)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', color: 'var(--text-primary)' }}
                        >
                            <option value="">-- Pilih Kategori --</option>
                            {categories.map(cat => (
                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group">
                        <label htmlFor="description">Deskripsi</label>
                        <textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Masukkan deskripsi produk"
                            rows={4}
                        />
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="price">Harga (Rp) <span className="required">*</span></label>
                            <input
                                type="number"
                                id="price"
                                name="price"
                                value={formData.price}
                                onChange={handleChange}
                                required
                                min="1"
                                step="any"
                                placeholder="0"
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="stock">Stok</label>
                            <input
                                type="number"
                                id="stock"
                                name="stock"
                                value={formData.stock}
                                onChange={handleChange}
                                min="0"
                                placeholder="0"
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>
                            <FiImage style={{ marginRight: '4px', verticalAlign: 'middle' }} />
                            Gambar Produk
                        </label>
                        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginTop: '6px' }}>
                            <button 
                                type="button" 
                                className="btn btn-secondary"
                                onClick={() => fileInputRef.current?.click()}
                                disabled={uploading}
                            >
                                <FiUploadCloud /> {uploading ? 'Mengupload...' : 'Pilih File Gambar'}
                            </button>
                            {formData.imageUrl && <span style={{ fontSize: '0.8rem', color: 'var(--success)' }}>Gambar tersedia</span>}
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                                accept="image/*"
                                style={{ display: 'none' }}
                            />
                        </div>
                        {formData.imageUrl && (
                            <div className="image-preview" style={{ marginTop: '12px' }}>
                                <img
                                    src={formData.imageUrl}
                                    alt="Preview"
                                    onError={(e) => { e.target.style.display = 'none'; }}
                                />
                            </div>
                        )}
                    </div>

                    <div className="form-actions">
                        <button
                            type="button"
                            onClick={() => navigate('/products')}
                            className="btn btn-secondary"
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={loading || uploading}
                        >
                            <FiSave /> {loading ? 'Menyimpan...' : 'Simpan'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default ProductForm;
