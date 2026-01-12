import React from 'react';
import { useTransactions } from '../context/TransactionContext';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const Analytics = () => {
    const { transactions } = useTransactions();

    // Process data for charts
    const expenseByCategory = transactions
        .filter(t => t.type === 'expense')
        .reduce((acc, curr) => {
            acc[curr.category] = (acc[curr.category] || 0) + Number(curr.amount);
            return acc;
        }, {});

    const data = Object.keys(expenseByCategory).map(cat => ({
        name: cat,
        value: expenseByCategory[cat]
    }));

    const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#ec4899', '#8b5cf6'];

    return (
        <div className="animate-fade-in">
            <header className="page-header">
                <div>
                    <h1 className="page-title">Analitik Mendalam</h1>
                    <p className="page-subtitle">Pelajari pola pengeluaranmu.</p>
                </div>
            </header>

            <div className="grid-analytics">
                <div className="glass-panel chart-panel">
                    <div className="panel-header">
                        <h3>Distribusi Pengeluaran</h3>
                    </div>
                    <div className="chart-body">
                        <ResponsiveContainer width="100%" height={350}>
                            <PieChart>
                                <Pie
                                    data={data}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                    outerRadius={120}
                                    fill="#8884d8"
                                    dataKey="value"
                                >
                                    {data.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="var(--color-bg)" strokeWidth={2} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--glass-border)', borderRadius: '8px' }}
                                    itemStyle={{ color: 'var(--color-text-main)' }}
                                />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="glass-panel stats-panel">
                    <div className="panel-header">
                        <h3>Statistik Utama</h3>
                    </div>
                    <div className="stats-list">
                        <div className="stat-item">
                            <span className="stat-label">Total Transaksi</span>
                            <span className="stat-value">{transactions.length}</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-label">Rata-rata Pengeluaran</span>
                            <span className="stat-value">
                                {/* Calculate average */}
                                {(transactions.filter(t => t.type === 'expense').reduce((a, b) => a + Number(b.amount), 0) /
                                    (transactions.filter(t => t.type === 'expense').length || 1)).toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}
                            </span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-label">Kategori Terbanyak</span>
                            <span className="stat-value">
                                {/* Calculate mode */}
                                {/* Logic to find top category */}
                                {Object.entries(expenseByCategory).sort((a, b) => b[1] - a[1])[0]?.[0] || '-'}
                            </span>
                        </div>
                    </div>
                    <div className="ai-insight">
                        <h4>💡 AI Insight</h4>
                        <p>Pengeluaran anda untuk <strong>{Object.entries(expenseByCategory).sort((a, b) => b[1] - a[1])[0]?.[0] || '-'}</strong> cukup tinggi bulan ini. Pertimbangkan untuk membuat budget limit.</p>
                    </div>
                </div>
            </div>

            <style>{`
        .grid-analytics {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 1.5rem;
        }
        .chart-body {
          padding: 1.5rem;
        }
        
        .stat-item {
          display: flex;
          justify-content: space-between;
          padding: 1rem;
          border-bottom: 1px solid var(--glass-border);
        }
        .stat-label { color: var(--color-text-muted); }
        .stat-value { font-weight: 600; font-size: 1.1rem; }
        
        .ai-insight {
          padding: 1.5rem;
          background: linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(168, 85, 247, 0.1));
          margin: 1rem;
          border-radius: var(--radius-md);
          border: 1px solid rgba(99, 102, 241, 0.2);
        }
        .ai-insight h4 { margin-bottom: 0.5rem; color: var(--color-primary); }
        .ai-insight p { font-size: 0.9rem; margin: 0; }

        @media (max-width: 768px) {
          .grid-analytics { grid-template-columns: 1fr; }
        }
      `}</style>
        </div >
    );
};

export default Analytics;
