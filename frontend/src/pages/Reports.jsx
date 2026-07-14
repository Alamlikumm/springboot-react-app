import React, { useState, useEffect } from 'react';
import { reportService } from '../api/reportService';
import toast from 'react-hot-toast';
import { FiTrendingUp, FiShoppingBag, FiDollarSign } from 'react-icons/fi';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const Reports = () => {
    const [reportData, setReportData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchReport();
    }, []);

    const fetchReport = async () => {
        try {
            setLoading(true);
            const response = await reportService.getSales();
            if (response.success) {
                setReportData(response.data);
            }
        } catch (error) {
            toast.error('Gagal memuat laporan penjualan');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="page-container">
                <div className="page-header">
                    <h1>Laporan Penjualan</h1>
                </div>
                <div className="loading-container">
                    <div className="spinner"></div>
                </div>
            </div>
        );
    }

    if (!reportData) return null;

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: {
                display: false,
            },
            title: {
                display: false,
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                grid: {
                    color: 'rgba(255, 255, 255, 0.1)',
                }
            },
            x: {
                grid: {
                    display: false,
                }
            }
        },
        elements: {
            line: {
                tension: 0.4
            }
        }
    };

    const chartData = {
        labels: reportData.dailySales.map(d => new Date(d.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })),
        datasets: [
            {
                fill: true,
                label: 'Pendapatan (Rp)',
                data: reportData.dailySales.map(d => d.totalSales),
                borderColor: '#059669', // Emerald
                backgroundColor: 'rgba(5, 150, 105, 0.1)',
            },
        ],
    };

    return (
        <div className="page-container">
            <div className="page-header">
                <div>
                    <h1>Laporan Penjualan</h1>
                    <p className="page-subtitle">Ringkasan performa penjualan Anda.</p>
                </div>
            </div>

            <div className="dashboard-stats" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', marginBottom: '24px' }}>
                <div className="stat-card">
                    <div className="stat-icon" style={{ backgroundColor: 'var(--success-subtle)', color: 'var(--success)' }}>
                        <FiDollarSign />
                    </div>
                    <div className="stat-details">
                        <h3>Total Pendapatan</h3>
                        <p className="stat-value">Rp {reportData.totalRevenue?.toLocaleString('id-ID') || 0}</p>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon" style={{ backgroundColor: 'var(--accent-subtle)', color: 'var(--accent)' }}>
                        <FiTrendingUp />
                    </div>
                    <div className="stat-details">
                        <h3>Total Transaksi</h3>
                        <p className="stat-value">{reportData.totalTransactions || 0}</p>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon" style={{ backgroundColor: 'var(--warning-subtle)', color: 'var(--warning)' }}>
                        <FiShoppingBag />
                    </div>
                    <div className="stat-details">
                        <h3>Produk Terjual</h3>
                        <p className="stat-value">{reportData.productsSold || 0}</p>
                    </div>
                </div>
            </div>

            <div className="card">
                <div className="card-header">
                    <h2>Tren Penjualan (Harian)</h2>
                </div>
                <div className="card-body" style={{ height: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {reportData.dailySales && reportData.dailySales.length > 0 ? (
                        <Line options={chartOptions} data={chartData} />
                    ) : (
                        <p style={{ color: 'var(--text-muted)' }}>Belum ada data penjualan.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Reports;
