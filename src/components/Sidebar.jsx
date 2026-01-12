import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Wallet, Settings, PieChart, ArrowRightLeft, Building2, Plus, ChevronDown, Check } from 'lucide-react';
import { useTransactions } from '../context/TransactionContext';
import { motion, AnimatePresence } from 'framer-motion';

const Sidebar = () => {
  const { activeWorkspace, workspaces, switchWorkspace, addWorkspace } = useTransactions();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isAddingOrg, setIsAddingOrg] = useState(false);
  const [newOrgName, setNewOrgName] = useState('');

  const navItems = [
    { icon: LayoutDashboard, label: 'Ringkasan', path: '/' },
    { icon: ArrowRightLeft, label: 'Transaksi', path: '/transactions' },
    { icon: PieChart, label: 'Analitik', path: '/analytics' },
    { icon: Settings, label: 'Pengaturan', path: '/settings' },
  ];

  const handleAddOrg = (e) => {
    e.preventDefault();
    if (newOrgName.trim()) {
      const newId = addWorkspace(newOrgName, 'organization');
      switchWorkspace(newId);
      setNewOrgName('');
      setIsAddingOrg(false);
      setIsDropdownOpen(false);
    }
  };

  return (
    <aside className="sidebar-panel">
      {/* Workspace Switcher */}
      <div className="workspace-switcher" onClick={() => !isAddingOrg && setIsDropdownOpen(!isDropdownOpen)}>
        <div className="logo-icon" style={{ background: activeWorkspace.themeColor }}>
          {activeWorkspace.type === 'personal' ? <Wallet size={24} color="white" /> : <Building2 size={24} color="white" />}
        </div>
        <div className="workspace-info">
          <span className="workspace-label">Dompet Aktif</span>
          <h2 className="workspace-name">
            {activeWorkspace.name}
            <ChevronDown size={14} className={`chevron ${isDropdownOpen ? 'rotate' : ''}`} />
          </h2>
        </div>
      </div>

      <AnimatePresence>
        {isDropdownOpen && (
          <>
            <div className="dropdown-backdrop" onClick={() => { setIsDropdownOpen(false); setIsAddingOrg(false); }}></div>
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="workspace-dropdown glass-panel"
            >
              {!isAddingOrg ? (
                <>
                  <div className="dropdown-section">
                    <span className="section-label">Pribadi</span>
                    {workspaces.filter(w => w.type === 'personal').map(w => (
                      <button
                        key={w.id}
                        className={`dropdown-item ${activeWorkspace.id === w.id ? 'active' : ''}`}
                        onClick={() => { switchWorkspace(w.id); setIsDropdownOpen(false); }}
                      >
                        <Wallet size={16} />
                        <span>{w.name}</span>
                        {activeWorkspace.id === w.id && <Check size={14} className="check-icon" />}
                      </button>
                    ))}
                  </div>

                  <div className="dropdown-section">
                    <span className="section-label">Organisasi & Acara</span>
                    {workspaces.filter(w => w.type === 'organization').map(w => (
                      <button
                        key={w.id}
                        className={`dropdown-item ${activeWorkspace.id === w.id ? 'active' : ''}`}
                        onClick={() => { switchWorkspace(w.id); setIsDropdownOpen(false); }}
                      >
                        <Building2 size={16} />
                        <span>{w.name}</span>
                        {activeWorkspace.id === w.id && <Check size={14} className="check-icon" />}
                      </button>
                    ))}
                  </div>

                  <button className="add-workspace-btn" onClick={(e) => { e.stopPropagation(); setIsAddingOrg(true); }}>
                    <Plus size={16} />
                    Buat Organisasi Baru
                  </button>
                </>
              ) : (
                <div className="add-org-form" onClick={(e) => e.stopPropagation()}>
                  <h4>Organisasi Baru</h4>
                  <input
                    autoFocus
                    placeholder="Nama Organisasi / Acara"
                    value={newOrgName}
                    onChange={(e) => setNewOrgName(e.target.value)}
                    className="dropdown-input"
                  />
                  <div className="add-org-actions">
                    <button className="btn-xs btn-ghost" onClick={() => setIsAddingOrg(false)}>Batal</button>
                    <button className="btn-xs btn-primary" onClick={handleAddOrg}>Buat</button>
                  </div>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <nav className="nav-menu">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            style={({ isActive }) => isActive ? { background: activeWorkspace.themeColor, boxShadow: `0 4px 12px ${activeWorkspace.themeColor}40` } : {}}
          >
            <item.icon size={20} />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="user-profile">
          <div className="avatar">B</div>
          <div className="user-info">
            <span className="name">Bendahara</span>
            <span className="role">{activeWorkspace.type === 'personal' ? 'Akun Pribadi' : 'Akun Organisasi'}</span>
          </div>
        </div>
      </div>

    </aside>
  );
};

export default Sidebar;
