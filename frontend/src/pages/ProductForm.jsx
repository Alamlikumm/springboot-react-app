import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FiSave, FiArrowLeft, FiImage } from 'react-icons/fi';
import toast from 'react-hot-toast';
import productService from '../api/productService';

function ProductForm() {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEdit = Boolean(id);

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        stock: 0,
        imageUrl: '',
    });
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(false);

    useEffect(() => {
        if (isEdit) {
            fetchProduct();
        }
    }, [id]);

    const fetchProduct = async () => {
        try {
            setFetching(true);
            const response = await productService.getById(id);
            if (response.success) {
                setFormData({
                    name: response.data.name,
                    description: response.data.description || '',
                    price: response.data.price,
                    stock: response.data.stock,
                    imageUrl: response.data.imageUrl || '',
                });
            }
        } catch (error) {
            toast.error('Gagal memuat data product');
            navigate('/products');
        } finally {
            setFetching(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const payload = {
                ...formData,
                price: parseFloat(formData.price),
                stock: parseInt(formData.stock),
            };

            if (isEdit) {
                await productService.update(id, payload);
                toast.success('Product berhasil diupdate');
            } else {
                await productService.create(payload);
                toast.success('Product berhasil dibuat');
            }
            navigate('/products');
        } catch (error) {
            const errorMsg = error.response?.data?.message || 
                (isEdit ? 'Gagal mengupdate product' : 'Gagal membuat product');
            toast.error(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    if (fetching) {
        return (
            <div className="loading-container">
                <div className="spinner"></div>
                <p>Memuat data product...</p>
            </div>
        );
    }

    return (
        <div className="product-form-page">
            <div className="page-header">
                <h1>{isEdit ? '✏️ Edit Product' : '➕ Tambah Product Baru'}</h1>
                <button onClick={() => navigate('/products')} className="btn btn-secondary">
                    <FiArrowLeft /> Kembali
                </button>
            </div>

            <div className="form-card">
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="name">Nama Product <span className="required">*</span></label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            placeholder="Masukkan nama product"
                            autoFocus
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="description">Deskripsi</label>
                        <textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Masukkan deskripsi product"
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
                        <label htmlFor="imageUrl">
                            <FiImage style={{ marginRight: '6px', verticalAlign: 'middle' }} />
                            URL Gambar
                        </label>
                        <input
                            type="url"
                            id="imageUrl"
                            name="imageUrl"
                            value={formData.imageUrl}
                            onChange={handleChange}
                            placeholder="https://example.com/image.jpg"
                        />
                        {formData.imageUrl && (
                            <div className="image-preview">
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

export default ProductForm;
