import React from 'react';
import { useTransactions } from '../context/TransactionContext';
import { formatCurrency } from '../utils/format';
import { exportToPDF, exportToExcel } from '../utils/export';
import { ArrowUpRight, ArrowDownRight, Wallet, TrendingUp, Download, FileText, Table } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useState } from 'react';

const Dashboard = () => {
  const { transactions, getSummary, activeWorkspace } = useTransactions();
  const { income, expense, balance } = getSummary();
  const [isExportOpen, setIsExportOpen] = useState(false);

  const handleExportPDF = () => {
    exportToPDF(transactions, { income, expense, balance }, activeWorkspace.name);
    setIsExportOpen(false);
  };

  const handleExportExcel = () => {
    exportToExcel(transactions, { income, expense, balance }, activeWorkspace.name);
    setIsExportOpen(false);
  };

  // Prepare data for chart (simplified: last 7 transactions or grouped by day)
  // For demo purposes, we just map recent transactions or create a mock trend
  const sortedTransactions = [...transactions].sort((a, b) => new Date(a.date) - new Date(b.date));
  const data = sortedTransactions.map(t => ({
    name: t.date,
    amount: t.amount,
    type: t.type
  }));

  const recentTransactions = [...transactions].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5);

  return (
    <div className="animate-fade-in">
      <header className="page-header">
        <div>
          <h1 className="page-title">Ringkasan Keuangan</h1>
          <p className="page-subtitle">Selamat datang kembali, lihat ringkasan keuanganmu.</p>
        </div>
        <div style={{ position: 'relative' }}>
          <button className="btn btn-primary" onClick={() => setIsExportOpen(!isExportOpen)}>
            <Download size={18} />
            Unduh Laporan
          </button>
          {isExportOpen && (
            <div className="export-menu glass-panel">
              <button onClick={handleExportPDF} className="export-item">
                <FileText size={16} />
                PDF
              </button>
              <button onClick={handleExportExcel} className="export-item">
                <Table size={16} />
                Excel
              </button>
            </div>
          )}
        </div>
      </header>

      <div className="summary-grid">
        <SummaryCard
          title="Total Saldo"
          amount={balance}
          icon={Wallet}
          trend="+20.1% dari bulan lalu"
          color="primary"
        />
        <SummaryCard
          title="Pemasukan"
          amount={income}
          icon={ArrowUpRight}
          trend="+12.5% dari bulan lalu" // Mock trend
          color="success"
        />
        <SummaryCard
          title="Pengeluaran"
          amount={expense}
          icon={ArrowDownRight}
          trend="+5.4% dari bulan lalu" // Mock trend
          color="danger"
        />
      </div>

      <div className="main-grid">
        <div className="glass-panel chart-section">
          <div className="panel-header">
            <h3>Analisis Keuangan</h3>
            <select className="select-input">
              <option>Bulan Ini</option>
              <option>Tahun Ini</option>
            </select>
          </div>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--glass-border)" vertical={false} />
                <XAxis dataKey="name" stroke="var(--color-text-muted)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--color-text-muted)" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `${val / 1000}k`} />
                <Tooltip
                  contentStyle={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--glass-border)', borderRadius: '8px' }}
                  itemStyle={{ color: 'var(--color-text-main)' }}
                />
                <Area type="monotone" dataKey="amount" stroke="var(--color-primary)" fillOpacity={1} fill="url(#colorAmount)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-panel transactions-section">
          <div className="panel-header">
            <h3>Transaksi Terakhir</h3>
            <button className="btn btn-ghost btn-sm">Lihat Semua</button>
          </div>
          <div className="transaction-list">
            {recentTransactions.map(t => (
              <div key={t.id} className="transaction-item">
                <div className={`transaction-icon ${t.type}`}>
                  {t.type === 'income' ? <ArrowUpRight size={18} /> : <ArrowDownRight size={18} />}
                </div>
                <div className="transaction-info">
                  <div className="transaction-desc">{t.description}</div>
                  <div className="transaction-meta">{t.category} • {t.date}</div>
                </div>
                <div className={`transaction-amount ${t.type}`}>
                  {t.type === 'income' ? '+' : '-'}{formatCurrency(t.amount)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        .page-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          margin-bottom: 2.5rem;
        }
        .page-title { margin: 0; }
        .page-subtitle { margin: 0; font-size: 1.1rem; }

        .export-menu {
          position: absolute;
          top: 100%;
          right: 0;
          margin-top: 0.5rem;
          min-width: 150px;
          padding: 0.5rem;
          z-index: 10;
          background: #18181b;
        }
        .export-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          width: 100%;
          padding: 0.75rem;
          border: none;
          background: transparent;
          color: var(--color-text-main);
          text-align: left;
          cursor: pointer;
          border-radius: var(--radius-md);
          font-size: 0.9rem;
        }
        .export-item:hover {
          background: var(--color-surface-hover);
        }

        .summary-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        .summary-card {
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        .summary-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
        }
        .icon-box {
          padding: 0.75rem;
          border-radius: 12px;
          color: white;
        }
        .icon-box.primary { background: linear-gradient(135deg, var(--color-primary), #818cf8); }
        .icon-box.success { background: linear-gradient(135deg, var(--color-success), #34d399); }
        .icon-box.danger { background: linear-gradient(135deg, var(--color-danger), #f87171); }

        .summary-amount {
          font-size: 2rem;
          font-weight: 700;
          color: var(--color-text-main);
        }
        .summary-trend {
          font-size: 0.9rem;
          color: var(--color-success); /* Simplified for now */
        }

        .main-grid {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 1.5rem;
        }

        .panel-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.5rem;
          border-bottom: 1px solid var(--glass-border);
        }
        .panel-header h3 { margin: 0; font-size: 1.1rem; }

        .select-input {
          background: var(--color-bg);
          border: 1px solid var(--color-border);
          color: var(--color-text-main);
          padding: 0.5rem 1rem;
          border-radius: var(--radius-md);
          outline: none;
        }

        .chart-container {
          padding: 1.5rem;
        }

        .transaction-list {
          padding: 1rem;
        }
        .transaction-item {
          display: flex;
          align-items: center;
          padding: 1rem;
          border-bottom: 1px solid var(--glass-border);
          transition: background 0.2s;
          border-radius: var(--radius-md);
        }
        .transaction-item:hover {
          background: rgba(255,255,255,0.02);
        }
        .transaction-item:last-child { border-bottom: none; }
        
        .transaction-icon {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-right: 1rem;
        }
        .transaction-icon.income { background: rgba(16, 185, 129, 0.2); color: var(--color-success); }
        .transaction-icon.expense { background: rgba(239, 68, 68, 0.2); color: var(--color-danger); }

        .transaction-info { flex: 1; }
        .transaction-desc { font-weight: 500; color: var(--color-text-main); }
        .transaction-meta { font-size: 0.85rem; color: var(--color-text-muted); }

        .transaction-amount { font-weight: 600; }
        .transaction-amount.income { color: var(--color-success); }
        .transaction-amount.expense { color: var(--color-text-main); }

        @media (max-width: 1024px) {
          .main-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
};

const SummaryCard = ({ title, amount, icon: Icon, trend, color }) => (
  <div className="glass-panel summary-card">
    <div className="summary-header">
      <div className={`icon-box ${color}`}>
        <Icon size={24} />
      </div>
      <span className="summary-trend">{trend}</span>
    </div>
    <div>
      <p style={{ marginBottom: '0.25rem' }}>{title}</p>
      <div className="summary-amount">{formatCurrency(amount)}</div>
    </div>
  </div>
);

export default Dashboard;
