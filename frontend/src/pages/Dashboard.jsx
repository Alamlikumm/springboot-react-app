import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiPackage, FiBox, FiDollarSign, FiLayers, FiPlus, FiArrowRight, FiAlertCircle } from 'react-icons/fi';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import dashboardService from '../api/dashboardService';

function Dashboard() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            setLoading(true);
            const response = await dashboardService.getStats();
            if (response.success) {
                setStats(response.data);
            }
        } catch (error) {
            console.error('Failed to fetch stats', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading || !stats) {
        return (
            <div className="loading-container">
                <div className="spinner"></div>
                <p>Memuat dashboard...</p>
            </div>
        );
    }

    const COLORS = ['#3b82f6', '#22c55e', '#eab308', '#a855f7', '#ef4444', '#f97316', '#06b6d4'];

    return (
        <div className="dashboard">
            <div className="page-header">
                <div>
                    <h1>Dashboard</h1>
                    <p className="page-subtitle">Ringkasan data produk Anda</p>
                </div>
            </div>

            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-card-header">
                        <span className="stat-card-label">Total Produk</span>
                        <div className="stat-card-icon blue"><FiPackage /></div>
                    </div>
                    <div className="stat-card-value">{stats.totalProducts}</div>
                    <div className="stat-card-sub">produk terdaftar</div>
                </div>

                <div className="stat-card">
                    <div className="stat-card-header">
                        <span className="stat-card-label">Total Stok</span>
                        <div className="stat-card-icon green"><FiBox /></div>
                    </div>
                    <div className="stat-card-value">{stats.totalStock.toLocaleString('id-ID')}</div>
                    <div className="stat-card-sub">unit tersedia</div>
                </div>

                <div className="stat-card">
                    <div className="stat-card-header">
                        <span className="stat-card-label">Rata-rata Harga</span>
                        <div className="stat-card-icon yellow"><FiDollarSign /></div>
                    </div>
                    <div className="stat-card-value">Rp {Math.round(stats.avgPrice).toLocaleString('id-ID')}</div>
                    <div className="stat-card-sub">per produk</div>
                </div>

                <div className="stat-card">
                    <div className="stat-card-header">
                        <span className="stat-card-label">Kategori</span>
                        <div className="stat-card-icon purple"><FiLayers /></div>
                    </div>
                    <div className="stat-card-value">{stats.totalCategories}</div>
                    <div className="stat-card-sub">kategori aktif</div>
                </div>
            </div>

            {/* Low Stock Alert */}
            {stats.lowStockProducts && stats.lowStockProducts.length > 0 && (
                <div className="dashboard-section">
                    <div className="dashboard-section-header">
                        <span className="dashboard-section-title" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--danger)' }}>
                            <FiAlertCircle /> Peringatan Stok Menipis
                        </span>
                    </div>
                    <div className="recent-table" style={{ borderColor: 'var(--danger-subtle)' }}>
                        <table>
                            <thead>
                                <tr>
                                    <th>Nama Produk</th>
                                    <th>Kategori</th>
                                    <th>Sisa Stok</th>
                                    <th style={{ width: '100px' }}>Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {stats.lowStockProducts.map((product) => (
                                    <tr key={product.id}>
                                        <td className="td-name">{product.name}</td>
                                        <td>{product.categoryName || '-'}</td>
                                        <td style={{ color: 'var(--danger)', fontWeight: 'bold' }}>{product.stock}</td>
                                        <td>
                                            <Link to={`/products/edit/${product.id}`} className="btn btn-secondary" style={{ padding: '4px 8px', fontSize: '0.75rem' }}>
                                                Restock
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            <div className="dashboard-section">
                <div className="form-row" style={{ alignItems: 'stretch' }}>
                    <div className="form-card" style={{ flex: 1 }}>
                        <h3 style={{ marginBottom: '20px', fontSize: '0.9rem' }}>Stok per Kategori</h3>
                        <div style={{ width: '100%', height: 300 }}>
                            <ResponsiveContainer>
                                <BarChart data={stats.categoryStats} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                                    <XAxis dataKey="categoryName" stroke="#71717a" fontSize={12} tickLine={false} axisLine={false} />
                                    <YAxis stroke="#71717a" fontSize={12} tickLine={false} axisLine={false} />
                                    <Tooltip 
                                        cursor={{ fill: '#27272a' }}
                                        contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: '8px', color: '#fafafa' }}
                                    />
                                    <Bar dataKey="totalStock" name="Total Stok" fill="var(--accent)" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                    
                    <div className="form-card" style={{ flex: 1 }}>
                        <h3 style={{ marginBottom: '20px', fontSize: '0.9rem' }}>Distribusi Produk</h3>
                        <div style={{ width: '100%', height: 300 }}>
                            <ResponsiveContainer>
                                <PieChart>
                                    <Pie
                                        data={stats.categoryStats}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={100}
                                        paddingAngle={5}
                                        dataKey="productCount"
                                        nameKey="categoryName"
                                    >
                                        {stats.categoryStats.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip 
                                        contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: '8px', color: '#fafafa' }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            </div>

            {/* Recent Products */}
            {stats.recentProducts && stats.recentProducts.length > 0 && (
                <div className="dashboard-section">
                    <div className="dashboard-section-header">
                        <span className="dashboard-section-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <FiPackage /> Produk Terbaru
                        </span>
                        <Link to="/products" style={{ fontSize: '0.85rem', color: 'var(--accent)', textDecoration: 'none' }}>Lihat Semua <FiArrowRight style={{ verticalAlign: 'middle' }}/></Link>
                    </div>
                    <div className="recent-table">
                        <table>
                            <thead>
                                <tr>
                                    <th>Nama Produk</th>
                                    <th>Kategori</th>
                                    <th>Harga</th>
                                    <th>Stok</th>
                                </tr>
                            </thead>
                            <tbody>
                                {stats.recentProducts.map((product) => (
                                    <tr key={product.id}>
                                        <td>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                {product.imageUrl ? (
                                                    <img src={product.imageUrl} alt={product.name} style={{ width: '32px', height: '32px', borderRadius: '4px', objectFit: 'cover' }} onError={(e) => { e.target.style.display = 'none'; }} />
                                                ) : (
                                                    <div style={{ width: '32px', height: '32px', borderRadius: '4px', backgroundColor: 'var(--bg-input)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)' }}>
                                                        <FiPackage />
                                                    </div>
                                                )}
                                                <span className="td-name">{product.name}</span>
                                            </div>
                                        </td>
                                        <td>{product.categoryName || '-'}</td>
                                        <td style={{ color: 'var(--accent)', fontWeight: '500' }}>Rp {product.price?.toLocaleString('id-ID')}</td>
                                        <td>{product.stock}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            <div className="dashboard-section">
                <div className="dashboard-section-header">
                    <span className="dashboard-section-title">Aksi Cepat</span>
                </div>
                <div className="quick-actions">
                    <Link to="/products/create" className="quick-action-btn">
                        <FiPlus /> Tambah Produk Baru
                    </Link>
                    <Link to="/categories/create" className="quick-action-btn">
                        <FiLayers /> Tambah Kategori
                    </Link>
                    <Link to="/products" className="quick-action-btn">
                        <FiPackage /> Lihat Semua Produk
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;
