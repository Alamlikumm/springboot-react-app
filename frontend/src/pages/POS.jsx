import { useState, useEffect, useRef } from 'react';
import { FiShoppingCart, FiSearch, FiPackage, FiTrash2, FiPlus, FiMinus, FiPrinter } from 'react-icons/fi';
import toast from 'react-hot-toast';
import productService from '../api/productService';
import transactionService from '../api/transactionService';
import { useAuth } from '../context/AuthContext';

function POS() {
    const { user } = useAuth();
    const [products, setProducts] = useState([]);
    const [searchKeyword, setSearchKeyword] = useState('');
    const [loading, setLoading] = useState(true);

    // Cart state
    const [cart, setCart] = useState([]);

    // Checkout state
    const [isCheckingOut, setIsCheckingOut] = useState(false);
    const [lastTransaction, setLastTransaction] = useState(null);

    const printRef = useRef(null);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async (keyword = '') => {
        try {
            setLoading(true);
            let response;
            if (keyword.trim()) {
                response = await productService.search(keyword, 0, 50); // Get top 50 matches for POS
            } else {
                response = await productService.getAll(0, 50, 'name,asc');
            }
            if (response.success) {
                setProducts(response.data.content);
            }
        } catch (error) {
            toast.error('Gagal memuat produk');
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        fetchProducts(searchKeyword);
    };

    const addToCart = (product) => {
        if (product.stock <= 0) {
            toast.error('Stok produk habis!');
            return;
        }

        const existingItem = cart.find(item => item.product.id === product.id);

        if (existingItem) {
            if (existingItem.quantity >= product.stock) {
                toast.error(`Stok maksimal untuk ${product.name} adalah ${product.stock}`);
                return;
            }
            setCart(cart.map(item =>
                item.product.id === product.id
                    ? { ...item, quantity: item.quantity + 1, subtotal: (item.quantity + 1) * item.product.price }
                    : item
            ));
        } else {
            setCart([...cart, {
                product,
                quantity: 1,
                subtotal: product.price
            }]);
        }
    };

    const updateQuantity = (productId, newQuantity) => {
        if (newQuantity < 1) {
            removeFromCart(productId);
            return;
        }

        const item = cart.find(item => item.product.id === productId);
        if (newQuantity > item.product.stock) {
            toast.error(`Stok maksimal untuk ${item.product.name} adalah ${item.product.stock}`);
            return;
        }

        setCart(cart.map(item =>
            item.product.id === productId
                ? { ...item, quantity: newQuantity, subtotal: newQuantity * item.product.price }
                : item
        ));
    };

    const removeFromCart = (productId) => {
        setCart(cart.filter(item => item.product.id !== productId));
    };

    const clearCart = () => {
        if (cart.length === 0) return;
        if (window.confirm('Kosongkan keranjang?')) {
            setCart([]);
        }
    };

    const handleCheckout = async () => {
        if (cart.length === 0) return;

        setIsCheckingOut(true);
        try {
            const payload = {
                items: cart.map(item => ({
                    productId: item.product.id,
                    quantity: item.quantity
                }))
            };

            const response = await transactionService.create(payload);
            if (response.success) {
                toast.success('Transaksi berhasil!');
                setLastTransaction(response.data);
                setCart([]); // Clear cart
                fetchProducts(); // Refresh products stock
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Transaksi gagal');
        } finally {
            setIsCheckingOut(false);
        }
    };

    const handlePrint = () => {
        window.print();
    };

    const closeInvoice = () => {
        setLastTransaction(null);
    };

    const totalCartAmount = cart.reduce((sum, item) => sum + item.subtotal, 0);
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

    return (
        <div className="pos-page animation-fade">
            <div className="page-header no-print">
                <div>
                    <h1>Kasir (POS)</h1>
                    <p className="page-subtitle">Sistem Kasir Penjualan</p>
                </div>
            </div>

            {/* Split Screen Layout */}
            <div className="pos-layout no-print">
                {/* Left: Product Catalog */}
                <div className="pos-catalog">
                    <form className="search-bar" onSubmit={handleSearch} style={{ marginBottom: '20px' }}>
                        <div className="search-input-wrapper">
                            <FiSearch className="search-icon" />
                            <input
                                type="text"
                                placeholder="Cari nama produk / scan barcode..."
                                value={searchKeyword}
                                onChange={(e) => setSearchKeyword(e.target.value)}
                                autoFocus
                            />
                        </div>
                        <button type="submit" className="btn btn-search">Cari</button>
                    </form>

                    {loading ? (
                        <div className="loading-container" style={{ minHeight: '300px' }}>
                            <div className="spinner"></div>
                        </div>
                    ) : (
                        <div className="pos-grid">
                            {products.map(product => (
                                <div
                                    key={product.id}
                                    className={`pos-product-card ${product.stock <= 0 ? 'out-of-stock' : ''}`}
                                    onClick={() => addToCart(product)}
                                >
                                        {product.stock <= 0 && (
                                            <div style={{ position: 'absolute', top: '8px', right: '8px', backgroundColor: 'var(--danger)', color: 'white', padding: '2px 8px', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 'bold' }}>
                                                Habis
                                            </div>
                                        )}
                                    <div className="pos-product-info">
                                        <div className="pos-product-name">{product.name}</div>
                                        <div className="pos-product-price">Rp {product.price?.toLocaleString('id-ID')}</div>
                                        <div className="pos-product-stock">Stok: {product.stock}</div>
                                    </div>
                                </div>
                            ))}
                            {products.length === 0 && (
                                <div className="empty-state" style={{ gridColumn: '1 / -1', minHeight: '200px' }}>
                                    <p>Produk tidak ditemukan.</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Right: Cart */}
                <div className="pos-cart-panel">
                    <div className="pos-cart-header">
                        <h2 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <FiShoppingCart /> Keranjang
                        </h2>
                        <span className="cart-badge">{totalItems} Item</span>
                    </div>

                    <div className="pos-cart-items">
                        {cart.length === 0 ? (
                            <div className="empty-cart">
                                <FiShoppingCart className="empty-cart-icon" />
                                <p>Keranjang masih kosong</p>
                            </div>
                        ) : (
                            cart.map(item => (
                                <div key={item.product.id} className="cart-item">
                                    <div className="cart-item-details">
                                        <div className="cart-item-name">{item.product.name}</div>
                                        <div className="cart-item-price">Rp {item.product.price.toLocaleString('id-ID')}</div>
                                    </div>
                                    <div className="cart-item-controls">
                                        <div className="quantity-control">
                                            <button type="button" onClick={() => updateQuantity(item.product.id, item.quantity - 1)}>
                                                <FiMinus />
                                            </button>
                                            <span>{item.quantity}</span>
                                            <button type="button" onClick={() => updateQuantity(item.product.id, item.quantity + 1)}>
                                                <FiPlus />
                                            </button>
                                        </div>
                                        <div className="cart-item-subtotal">
                                            Rp {item.subtotal.toLocaleString('id-ID')}
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    <div className="pos-cart-footer">
                        <div className="cart-total-row">
                            <span>Total</span>
                            <span className="cart-total-amount">Rp {totalCartAmount.toLocaleString('id-ID')}</span>
                        </div>
                        <div className="cart-actions">
                            <button
                                className="btn btn-secondary"
                                onClick={clearCart}
                                disabled={cart.length === 0 || isCheckingOut}
                            >
                                <FiTrash2 /> Kosongkan
                            </button>
                            <button
                                className="btn btn-primary"
                                style={{ flex: 1, padding: '12px', fontSize: '1rem' }}
                                onClick={handleCheckout}
                                disabled={cart.length === 0 || isCheckingOut}
                            >
                                {isCheckingOut ? 'Memproses...' : 'Bayar Sekarang'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Print Modal / Invoice */}
            {lastTransaction && (
                <>
                    <div className="modal-overlay no-print"></div>
                    <div className="invoice-modal no-print" style={{ zIndex: 1000, position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', background: 'var(--bg-card)', padding: '30px', borderRadius: '12px', width: '400px', maxWidth: '90%', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)' }}>
                        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                            <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'var(--success-subtle)', color: 'var(--success)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', fontSize: '24px' }}>
                                ✓
                            </div>
                            <h2 style={{ marginBottom: '8px' }}>Transaksi Berhasil</h2>
                            <p style={{ color: 'var(--text-secondary)' }}>{lastTransaction.invoiceNumber}</p>
                        </div>

                        <div style={{ display: 'flex', gap: '10px', marginTop: '30px' }}>
                            <button className="btn btn-secondary" style={{ flex: 1 }} onClick={closeInvoice}>Tutup</button>
                            <button className="btn btn-primary" style={{ flex: 1 }} onClick={handlePrint}><FiPrinter /> Cetak Struk</button>
                        </div>
                    </div>

                    {/* Printable Area (Hidden normally, shown in @media print) */}
                    <div className="print-area">
                        <div className="receipt">
                            <div className="receipt-header">
                                <h2>PRODUCT MANAGER</h2>
                                <p>Jl. Cengkareng  No. 123</p>
                                <p>Telp: 08123456789</p>
                                <div className="receipt-divider"></div>
                            </div>
                            <div className="receipt-info">
                                <div><span className="label">No. Invoice:</span> {lastTransaction.invoiceNumber}</div>
                                <div><span className="label">Tanggal:</span> {new Date(lastTransaction.transactionDate).toLocaleString('id-ID')}</div>
                                <div><span className="label">Kasir:</span> {lastTransaction.cashierName}</div>
                            </div>
                            <div className="receipt-divider"></div>
                            <table className="receipt-items">
                                <thead>
                                    <tr>
                                        <th style={{ textAlign: 'left' }}>Item</th>
                                        <th style={{ textAlign: 'center' }}>Qty</th>
                                        <th style={{ textAlign: 'right' }}>Harga</th>
                                        <th style={{ textAlign: 'right' }}>Total</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {lastTransaction.items.map(item => (
                                        <tr key={item.id}>
                                            <td style={{ textAlign: 'left' }}>{item.productName}</td>
                                            <td style={{ textAlign: 'center' }}>{item.quantity}</td>
                                            <td style={{ textAlign: 'right' }}>{item.unitPrice.toLocaleString('id-ID')}</td>
                                            <td style={{ textAlign: 'right' }}>{item.subtotal.toLocaleString('id-ID')}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            <div className="receipt-divider"></div>
                            <div className="receipt-total">
                                <span>TOTAL BELANJA</span>
                                <span>Rp {lastTransaction.totalAmount.toLocaleString('id-ID')}</span>
                            </div>
                            <div className="receipt-footer">
                                <p>Terima Kasih Atas Kunjungan Anda</p>
                                <p>Barang yang sudah dibeli tidak dapat ditukar/dikembalikan</p>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}

export default POS;
