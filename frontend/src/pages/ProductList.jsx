import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiPlus, FiEdit, FiTrash2, FiSearch, FiPackage, FiChevronUp, FiChevronDown } from 'react-icons/fi';
import toast from 'react-hot-toast';
import productService from '../api/productService';
import Pagination from '../components/Pagination';

function ProductList() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchKeyword, setSearchKeyword] = useState('');
    
    // Pagination & Sorting state
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [sortConfig, setSortConfig] = useState({ key: 'id', direction: 'desc' });

    useEffect(() => {
        fetchProducts();
    }, [currentPage, pageSize, sortConfig]);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            let response;
            const sortParam = `${sortConfig.key},${sortConfig.direction}`;
            
            if (searchKeyword.trim()) {
                response = await productService.search(searchKeyword, currentPage, pageSize, sortParam);
            } else {
                response = await productService.getAll(currentPage, pageSize, sortParam);
            }
            
            if (response.success) {
                setProducts(response.data.content);
                setTotalPages(response.data.totalPages);
                setTotalElements(response.data.totalElements);
            }
        } catch (error) {
            toast.error('Gagal memuat data products');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Yakin ingin menghapus product ini?')) {
            try {
                await productService.delete(id);
                toast.success('Product berhasil dihapus');
                fetchProducts();
            } catch (error) {
                toast.error('Gagal menghapus product');
            }
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        setCurrentPage(0); // Reset to first page on search
        fetchProducts();
    };

    const handleSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const SortIcon = ({ columnKey }) => {
        if (sortConfig.key !== columnKey) return <span className="sort-icon">↕</span>;
        return sortConfig.direction === 'asc' ? <FiChevronUp className="sort-icon active" /> : <FiChevronDown className="sort-icon active" />;
    };

    if (loading && products.length === 0) {
        return (
            <div className="loading-container">
                <div className="spinner"></div>
                <p>Memuat data...</p>
            </div>
        );
    }

    return (
        <div className="product-list">
            <div className="page-header">
                <div className="page-title">
                    <FiPackage className="page-icon" />
                    <h1>Daftar Products</h1>
                </div>
                <Link to="/products/create" className="btn btn-primary">
                    <FiPlus /> Tambah Product
                </Link>
            </div>

            <form className="search-bar" onSubmit={handleSearch}>
                <div className="search-input-wrapper">
                    <FiSearch className="search-icon" />
                    <input
                        type="text"
                        placeholder="Cari product..."
                        value={searchKeyword}
                        onChange={(e) => setSearchKeyword(e.target.value)}
                    />
                </div>
                <button type="submit" className="btn btn-search">Cari</button>
            </form>

            {products.length === 0 ? (
                <div className="empty-state">
                    <FiPackage className="empty-icon" />
                    <h3>Belum ada product</h3>
                    <p>Mulai dengan menambahkan product pertama Anda atau gunakan kata kunci lain.</p>
                </div>
            ) : (
                <div className="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>No</th>
                                <th 
                                    className={`sortable ${sortConfig.key === 'name' ? 'active' : ''}`}
                                    onClick={() => handleSort('name')}
                                >
                                    Nama <SortIcon columnKey="name" />
                                </th>
                                <th>Deskripsi</th>
                                <th 
                                    className={`sortable ${sortConfig.key === 'price' ? 'active' : ''}`}
                                    onClick={() => handleSort('price')}
                                >
                                    Harga <SortIcon columnKey="price" />
                                </th>
                                <th 
                                    className={`sortable ${sortConfig.key === 'stock' ? 'active' : ''}`}
                                    onClick={() => handleSort('stock')}
                                >
                                    Stok <SortIcon columnKey="stock" />
                                </th>
                                <th>Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map((product, index) => (
                                <tr key={product.id}>
                                    <td className="td-center">{currentPage * pageSize + index + 1}</td>
                                    <td className="td-name">{product.name}</td>
                                    <td className="td-desc">
                                        {product.description
                                            ? product.description.length > 60
                                                ? product.description.substring(0, 60) + '...'
                                                : product.description
                                            : '-'}
                                    </td>
                                    <td className="td-price">
                                        Rp {product.price?.toLocaleString('id-ID')}
                                    </td>
                                    <td className="td-center">{product.stock}</td>
                                    <td className="td-actions">
                                        <Link
                                            to={`/products/edit/${product.id}`}
                                            className="btn-icon btn-edit"
                                            title="Edit"
                                        >
                                            <FiEdit />
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(product.id)}
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

            {totalPages > 1 && (
                <Pagination 
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={(page) => setCurrentPage(page)}
                />
            )}

            <div className="product-count">
                Menampilkan {products.length} dari total <strong>{totalElements}</strong> product
            </div>
        </div>
    );
}

export default ProductList;
