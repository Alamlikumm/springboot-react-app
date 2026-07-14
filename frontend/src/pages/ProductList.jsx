import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiPlus, FiEdit, FiTrash2, FiSearch, FiPackage, FiChevronUp, FiChevronDown, FiGrid, FiList, FiDownload, FiPrinter } from 'react-icons/fi';
import toast from 'react-hot-toast';
import productService from '../api/productService';
import Pagination from '../components/Pagination';
import ConfirmModal from '../components/ConfirmModal';
import BarcodePrintModal from '../components/BarcodePrintModal';

function ProductList() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchKeyword, setSearchKeyword] = useState('');
    const [viewMode, setViewMode] = useState('table'); // 'table' or 'grid'

    // Pagination & Sorting state
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);
    const [barcodeProduct, setBarcodeProduct] = useState(null);
    const [pageSize] = useState(10);
    const [sortConfig, setSortConfig] = useState({ key: 'id', direction: 'desc' });

    // Bulk delete state
    const [selectedIds, setSelectedIds] = useState([]);

    // Delete confirmation modal
    const [deleteModal, setDeleteModal] = useState({ open: false, id: null, name: '', isBulk: false });

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
                setSelectedIds([]); // reset selection
            }
        } catch (error) {
            toast.error('Gagal memuat data produk');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        try {
            if (deleteModal.isBulk) {
                await productService.deleteBulk(selectedIds);
                toast.success('Produk terpilih berhasil dihapus');
            } else if (deleteModal.id) {
                await productService.delete(deleteModal.id);
                toast.success('Produk berhasil dihapus');
            }
            setDeleteModal({ open: false, id: null, name: '', isBulk: false });
            fetchProducts();
        } catch (error) {
            toast.error('Gagal menghapus produk');
        }
    };

    const openDeleteModal = (product) => {
        setDeleteModal({ open: true, id: product.id, name: product.name, isBulk: false });
    };
    
    const openBulkDeleteModal = () => {
        if (selectedIds.length === 0) return;
        setDeleteModal({ open: true, id: null, name: `${selectedIds.length} produk`, isBulk: true });
    };

    const handleSearch = (e) => {
        e.preventDefault();
        setCurrentPage(0);
        fetchProducts();
    };

    const handleSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const handleSelectAll = (e) => {
        if (e.target.checked) {
            setSelectedIds(products.map(p => p.id));
        } else {
            setSelectedIds([]);
        }
    };

    const handleSelectOne = (e, id) => {
        if (e.target.checked) {
            setSelectedIds([...selectedIds, id]);
        } else {
            setSelectedIds(selectedIds.filter(itemId => itemId !== id));
        }
    };

    const handleExportCSV = async () => {
        try {
            const blob = await productService.exportCSV();
            const url = window.URL.createObjectURL(new Blob([blob]));
            const link = document.createElement('url');
            link.href = url;
            link.setAttribute('download', 'products.csv');
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
            toast.success('File CSV berhasil diunduh');
        } catch (error) {
            toast.error('Gagal export CSV');
        }
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
        <div className="product-list animation-fade">
            <div className="page-header">
                <div>
                    <h1>Daftar Produk</h1>
                    <p className="page-subtitle">{totalElements} produk terdaftar</p>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <button onClick={handleExportCSV} className="btn btn-secondary">
                        <FiDownload /> Export CSV
                    </button>
                    <Link to="/products/create" className="btn btn-primary">
                        <FiPlus /> Tambah Produk
                    </Link>
                </div>
            </div>

            <div className="toolbar">
                <form className="search-bar" onSubmit={handleSearch}>
                    <div className="search-input-wrapper">
                        <FiSearch className="search-icon" />
                        <input
                            type="text"
                            placeholder="Cari produk..."
                            value={searchKeyword}
                            onChange={(e) => setSearchKeyword(e.target.value)}
                        />
                    </div>
                    <button type="submit" className="btn btn-search">Cari</button>
                </form>

                {selectedIds.length > 0 && (
                    <button onClick={openBulkDeleteModal} className="btn btn-danger" style={{ height: '36px' }}>
                        <FiTrash2 /> Hapus {selectedIds.length} Terpilih
                    </button>
                )}

                <div className="view-toggle">
                    <button
                        className={`view-toggle-btn ${viewMode === 'table' ? 'active' : ''}`}
                        onClick={() => setViewMode('table')}
                        title="Tampilan tabel"
                    >
                        <FiList />
                    </button>
                    <button
                        className={`view-toggle-btn ${viewMode === 'grid' ? 'active' : ''}`}
                        onClick={() => setViewMode('grid')}
                        title="Tampilan kartu"
                    >
                        <FiGrid />
                    </button>
                </div>
            </div>

            {products.length === 0 ? (
                <div className="empty-state">
                    <FiPackage className="empty-icon" />
                    <h3>Belum ada produk</h3>
                    <p>Mulai dengan menambahkan produk pertama Anda.</p>
                    <Link to="/products/create" className="btn btn-primary">
                        <FiPlus /> Tambah Produk
                    </Link>
                </div>
            ) : viewMode === 'table' ? (
                <div className="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th style={{ width: '40px', textAlign: 'center' }}>
                                    <input 
                                        type="checkbox" 
                                        onChange={handleSelectAll} 
                                        checked={products.length > 0 && selectedIds.length === products.length}
                                    />
                                </th>
                                <th
                                    className={`sortable ${sortConfig.key === 'name' ? 'active' : ''}`}
                                    onClick={() => handleSort('name')}
                                >
                                    Produk <SortIcon columnKey="name" />
                                </th>
                                <th>Kategori</th>
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
                            {products.map((product) => (
                                <tr key={product.id} className={selectedIds.includes(product.id) ? 'selected' : ''}>
                                    <td className="td-center">
                                        <input 
                                            type="checkbox" 
                                            checked={selectedIds.includes(product.id)}
                                            onChange={(e) => handleSelectOne(e, product.id)}
                                        />
                                    </td>
                                    <td>
                                        <div className="td-product">
                                            {product.imageUrl ? (
                                                <img
                                                    src={product.imageUrl}
                                                    alt={product.name}
                                                    className="td-thumb"
                                                    onError={(e) => { e.target.style.display = 'none'; }}
                                                />
                                            ) : (
                                                <div className="td-thumb-placeholder"><FiPackage /></div>
                                            )}
                                            <span className="td-name">{product.name}</span>
                                        </div>
                                    </td>
                                    <td className="td-desc">
                                        {product.categoryName || '—'}
                                    </td>
                                    <td className="td-price">
                                        Rp {product.price?.toLocaleString('id-ID')}
                                    </td>
                                    <td className={`td-center td-stock ${product.stock < 10 ? 'low' : ''}`}>
                                        {product.stock}
                                    </td>
                                    <td className="td-actions">
                                        <Link
                                            to={`/products/edit/${product.id}`}
                                            className="btn-icon btn-edit"
                                            title="Edit"
                                        >
                                            <FiEdit />
                                        </Link>
                                        <button
                                            onClick={() => openDeleteModal(product)}
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
            ) : (
                <div className="product-grid">
                    {products.map((product) => (
                        <div className="product-card" key={product.id}>
                            {product.imageUrl ? (
                                <img
                                    src={product.imageUrl}
                                    alt={product.name}
                                    className="product-card-img"
                                    onError={(e) => { e.target.style.display = 'none'; }}
                                />
                            ) : (
                                <div className="product-card-img-placeholder">
                                    <FiPackage />
                                </div>
                            )}
                            <div className="product-card-body">
                                <div className="product-card-name" style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    {product.name}
                                    <input 
                                        type="checkbox" 
                                        checked={selectedIds.includes(product.id)}
                                        onChange={(e) => handleSelectOne(e, product.id)}
                                    />
                                </div>
                                <div className="product-card-desc">
                                    Kategori: {product.categoryName || '—'}
                                </div>
                                <div className="product-card-meta">
                                    <span className="product-card-price">
                                        Rp {product.price?.toLocaleString('id-ID')}
                                    </span>
                                    <span className={`product-card-stock ${product.stock < 10 ? 'low' : ''}`}>Stok: {product.stock}</span>
                                </div>
                                <div className="product-card-actions">
                                    <button className="btn-icon" title="Cetak Barcode" onClick={() => setBarcodeProduct(product)}>
                                        <FiPrinter />
                                    </button>
                                    <Link to={`/products/edit/${product.id}`} className="btn-icon" title="Edit">
                                        <FiEdit2 />
                                    </Link>
                                    <button className="btn-icon danger" onClick={() => setDeleteModal({ show: true, id: product.id, isBulk: false })} title="Hapus">
                                        <FiTrash2 />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
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
                Menampilkan {products.length} dari total <strong>{totalElements}</strong> produk
            </div>

            {deleteModal.show && (
                <ConfirmModal 
                    title={deleteModal.isBulk ? "Hapus Beberapa Produk" : "Hapus Produk"}
                    message={deleteModal.isBulk ? `Apakah Anda yakin ingin menghapus ${selectedIds.length} produk yang dipilih?` : "Apakah Anda yakin ingin menghapus produk ini?"}
                    onConfirm={handleDelete}
                    onCancel={() => setDeleteModal({ show: false, id: null, isBulk: false })}
                />
            )}

            {barcodeProduct && (
                <BarcodePrintModal 
                    product={barcodeProduct} 
                    onClose={() => setBarcodeProduct(null)} 
                />
            )}
        </div>
    );
}

export default ProductList;
