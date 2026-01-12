import React, { useState } from 'react';
import { useTransactions } from '../context/TransactionContext';
import { formatCurrency } from '../utils/format';
import { Search, Filter, Plus, X, Pencil } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Transactions = () => {
  const { transactions, addTransaction, deleteTransaction, editTransaction } = useTransactions();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [editingTransaction, setEditingTransaction] = useState(null);

  const handleEdit = (t) => {
    setEditingTransaction(t);
    setIsModalOpen(true);
  };

  const handleAddClick = () => {
    setEditingTransaction(null);
    setIsModalOpen(true);
  };

  const filteredTransactions = transactions.filter(t => {
    const matchesSearch = t.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || t.type === filterType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="animate-fade-in">
      <header className="page-header">
        <div>
          <h1 className="page-title">Riwayat Transaksi</h1>
          <p className="page-subtitle">Kelola semua pemasukan dan pengeluaranmu.</p>
        </div>
        <button className="btn btn-primary" onClick={handleAddClick}>
          <Plus size={18} />
          Tambah Transaksi
        </button>
      </header>

      <div className="glass-panel">
        <div className="toolbar">
          <div className="search-box">
            <Search size={18} className="search-icon" />
            <input
              type="text"
              placeholder="Cari transaksi..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="filters">
            <button
              className={`filter-btn ${filterType === 'all' ? 'active' : ''}`}
              onClick={() => setFilterType('all')}
            >
              Semua
            </button>
            <button
              className={`filter-btn ${filterType === 'income' ? 'active' : ''}`}
              onClick={() => setFilterType('income')}
            >
              Pemasukan
            </button>
            <button
              className={`filter-btn ${filterType === 'expense' ? 'active' : ''}`}
              onClick={() => setFilterType('expense')}
            >
              Pengeluaran
            </button>
          </div>
        </div>

        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>Deskripsi</th>
                <th>Kategori</th>
                <th>Tanggal</th>
                <th>Jumlah</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.map(t => (
                <tr key={t.id}>
                  <td>
                    <div className="fw-600">{t.description}</div>
                  </td>
                  <td>
                    <span className="badge">{t.category}</span>
                  </td>
                  <td>{t.date}</td>
                  <td className={t.type === 'income' ? 'text-success' : ''}>
                    {t.type === 'income' ? '+' : '-'}{formatCurrency(t.amount)}
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button
                        className="btn-icon-sm"
                        onClick={() => handleEdit(t)}
                        title="Edit"
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        className="btn-icon-sm"
                        onClick={() => deleteTransaction(t.id)}
                        title="Hapus"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredTransactions.length === 0 && (
            <div className="empty-state">
              <p>Tidak ada transaksi ditemukan.</p>
            </div>
          )}
        </div>
      </div>

      <AddTransactionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={addTransaction}
        onEdit={editTransaction}
        editingTransaction={editingTransaction}
      />

      <style>{`
        .page-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          margin-bottom: 2rem;
        }

        .toolbar {
          padding: 1.5rem;
          border-bottom: 1px solid var(--glass-border);
          display: flex;
          justify-content: space-between;
          gap: 1rem;
          flex-wrap: wrap;
        }

        .search-box {
          position: relative;
          min-width: 300px;
        }
        .search-box input {
          width: 100%;
          padding: 0.75rem 1rem 0.75rem 2.5rem;
          background: var(--color-bg);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-md);
          color: white;
          outline: none;
        }
        .search-icon {
          position: absolute;
          left: 1rem;
          top: 50%;
          transform: translateY(-50%);
          color: var(--color-text-muted);
        }

        .filters {
          display: flex;
          gap: 0.5rem;
          background: var(--color-bg);
          padding: 0.25rem;
          border-radius: var(--radius-md);
          border: 1px solid var(--color-border);
        }
        .filter-btn {
          padding: 0.5rem 1rem;
          border: none;
          background: transparent;
          color: var(--color-text-muted);
          border-radius: var(--radius-sm);
          cursor: pointer;
          font-size: 0.9rem;
          transition: all 0.2s;
        }
        .filter-btn.active {
          background: var(--color-surface-hover);
          color: var(--color-text-main);
          font-weight: 500;
        }

        .table-responsive {
          overflow-x: auto;
        }
        .table {
          width: 100%;
          border-collapse: collapse;
        }
        .table th, .table td {
          padding: 1rem 1.5rem;
          text-align: left;
          border-bottom: 1px solid var(--glass-border);
        }
        .table th {
          color: var(--color-text-muted);
          font-weight: 500;
          font-size: 0.9rem;
        }
        .table tr:last-child td { border-bottom: none; }
        .fw-600 { font-weight: 600; }
        .text-success { color: var(--color-success); }
        
        .badge {
          background: rgba(255, 255, 255, 0.1);
          padding: 0.25rem 0.75rem;
          border-radius: var(--radius-full);
          font-size: 0.85rem;
        }

        .btn-icon-sm {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          border: 1px solid var(--color-border);
          background: transparent;
          color: var(--color-text-muted);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s;
        }
        .btn-icon-sm:hover {
          background: var(--color-danger);
          border-color: var(--color-danger);
          color: white;
        }

        .empty-state {
          padding: 3rem;
          text-align: center;
          color: var(--color-text-muted);
        }
      `}</style>
    </div>
  );
};

const AddTransactionModal = ({ isOpen, onClose, onAdd, onEdit, editingTransaction }) => {
  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    const data = {
      type: formData.get('type'),
      amount: formData.get('amount'),
      description: formData.get('description'),
      category: formData.get('category'),
      date: formData.get('date'),
    };

    if (editingTransaction) {
      onEdit(editingTransaction.id, data);
    } else {
      onAdd(data);
    }
    onClose();
  };

  return (
    <div className="modal-overlay">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="modal-content glass-panel"
      >
        <div className="modal-header">
          <h3>{editingTransaction ? 'Edit Transaksi' : 'Tambah Transaksi Baru'}</h3>
          <button onClick={onClose} className="close-btn"><X size={20} /></button>
        </div>
        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label>Tipe Transaksi</label>
            <select name="type" className="form-input" defaultValue={editingTransaction?.type || 'income'}>
              <option value="income">Pemasukan</option>
              <option value="expense">Pengeluaran</option>
            </select>
          </div>
          <div className="form-group">
            <label>Jumlah (IDR)</label>
            <input name="amount" type="number" className="form-input" required defaultValue={editingTransaction?.amount || ''} />
          </div>
          <div className="form-group">
            <label>Deskripsi</label>
            <input name="description" type="text" className="form-input" required defaultValue={editingTransaction?.description || ''} />
          </div>
          <div className="form-group">
            <label>Kategori</label>
            <input name="category" type="text" className="form-input" list="categories" required defaultValue={editingTransaction?.category || ''} />
            <datalist id="categories">
              <option value="Gaji" />
              <option value="Makanan" />
              <option value="Transportasi" />
              <option value="Belanja" />
              <option value="Hiburan" />
            </datalist>
          </div>
          <div className="form-group">
            <label>Tanggal</label>
            <input name="date" type="date" className="form-input" required defaultValue={editingTransaction?.date || new Date().toISOString().split('T')[0]} />
          </div>
          <div className="modal-footer">
            <button type="button" onClick={onClose} className="btn btn-secondary">Batal</button>
            <button type="submit" className="btn btn-primary">{editingTransaction ? 'Simpan Perubahan' : 'Simpan'}</button>
          </div>
        </form>
      </motion.div>
      <style>{`
        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.7);
          backdrop-filter: blur(4px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }
        .modal-content {
          width: 100%;
          max-width: 500px;
          background: #18181b;
          border: 1px solid var(--color-border);
        }
        .modal-header {
          padding: 1.5rem;
          border-bottom: 1px solid var(--color-border);
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .close-btn {
          background: transparent;
          border: none;
          color: var(--color-text-muted);
          cursor: pointer;
        }
        .modal-form {
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }
        .form-group label {
          display: block;
          margin-bottom: 0.5rem;
          font-size: 0.9rem;
          color: var(--color-text-muted);
        }
        .form-input {
          width: 100%;
          padding: 0.75rem;
          background: var(--color-bg);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-md);
          color: white;
          outline: none;
        }
        .form-input:focus {
          border-color: var(--color-primary);
        }
        .modal-footer {
          display: flex;
          justify-content: flex-end;
          gap: 1rem;
          margin-top: 1rem;
        }
      `}</style>
    </div>
  );
};

export default Transactions;
