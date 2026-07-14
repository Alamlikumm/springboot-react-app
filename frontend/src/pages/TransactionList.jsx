import { useState, useEffect } from 'react';
import { FiFileText } from 'react-icons/fi';
import toast from 'react-hot-toast';
import transactionService from '../api/transactionService';

function TransactionList() {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchTransactions();
    }, []);

    const fetchTransactions = async () => {
        try {
            setLoading(true);
            const response = await transactionService.getAll();
            if (response.success) {
                setTransactions(response.data);
            }
        } catch (error) {
            toast.error('Gagal memuat riwayat transaksi');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="loading-container">
                <div className="spinner"></div>
                <p>Memuat riwayat transaksi...</p>
            </div>
        );
    }

    return (
        <div className="animation-fade">
            <div className="page-header">
                <div>
                    <h1>Riwayat Transaksi</h1>
                    <p className="page-subtitle">Daftar transaksi penjualan yang telah berhasil</p>
                </div>
            </div>

            {transactions.length === 0 ? (
                <div className="empty-state">
                    <FiFileText className="empty-icon" />
                    <h3>Belum ada transaksi</h3>
                    <p>Mulai penjualan di menu Kasir untuk melihat riwayat.</p>
                </div>
            ) : (
                <div className="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>No. Invoice</th>
                                <th>Tanggal</th>
                                <th>Kasir</th>
                                <th>Jml Item</th>
                                <th style={{ textAlign: 'right' }}>Total (Rp)</th>
                            </tr>
                        </thead>
                        <tbody>
                            {transactions.map(trx => (
                                <tr key={trx.id}>
                                    <td className="td-name">{trx.invoiceNumber}</td>
                                    <td>{new Date(trx.transactionDate).toLocaleString('id-ID')}</td>
                                    <td>{trx.cashierName}</td>
                                    <td>{trx.items.length} jenis barang</td>
                                    <td style={{ textAlign: 'right', fontWeight: 'bold' }}>
                                        {trx.totalAmount.toLocaleString('id-ID')}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

export default TransactionList;
