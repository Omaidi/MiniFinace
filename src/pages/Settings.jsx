import React from 'react';
import { useTransactions } from '../context/TransactionContext';
import { Save } from 'lucide-react';

const Settings = () => {
  const { activeWorkspace, updateActiveWorkspaceSettings } = useTransactions();

  const [localSettings, setLocalSettings] = React.useState(activeWorkspace);

  React.useEffect(() => {
    setLocalSettings(activeWorkspace);
  }, [activeWorkspace]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLocalSettings(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    updateActiveWorkspaceSettings(localSettings);
    alert('Pengaturan berhasil disimpan!');
  };

  return (
    <div className="animate-fade-in">
      <header className="page-header">
        <div>
          <h1 className="page-title">Pengaturan</h1>
          <p className="page-subtitle">Sesuaikan aplikasi dengan kebutuhanmu.</p>
        </div>
      </header>

      <div className="glass-panel" style={{ maxWidth: '800px' }}>
        <form onSubmit={handleSave} className="settings-form">
          <div className="form-section">
            <h3 className="section-title">Profil Umum</h3>

            <div className="form-group">
              <label>Nama Organisasi / Pribadi</label>
              <input
                name="orgName"
                value={localSettings.orgName || ''}
                onChange={handleChange}
                className="form-input"
              />
              <span className="help-text">Nama yang akan muncul di sidebar dan laporan.</span>
            </div>

            <div className="form-group">
              <label>Tipe Penggunaan</label>
              <div className="radio-group">
                <label className={`radio-card ${localSettings.type === 'personal' ? 'active' : ''}`}>
                  <input
                    type="radio"
                    name="type"
                    value="personal"
                    checked={localSettings.type === 'personal'}
                    onChange={handleChange}
                  />
                  <div className="radio-content">
                    <span className="radio-title">Pribadi</span>
                    <span className="radio-desc">Untuk manajemen keuangan diri sendiri atau keluarga.</span>
                  </div>
                </label>
                <label className={`radio-card ${localSettings.type === 'organization' ? 'active' : ''}`}>
                  <input
                    type="radio"
                    name="type"
                    value="organization"
                    checked={localSettings.type === 'organization'}
                    onChange={handleChange}
                  />
                  <div className="radio-content">
                    <span className="radio-title">Organisasi / Bisnis</span>
                    <span className="radio-desc">Fitur lengkap untuk UMKM, startup, atau organisasi.</span>
                  </div>
                </label>
              </div>
            </div>
          </div>

          <div className="form-section">
            <h3 className="section-title">Personalisasi</h3>
            <div className="form-group">
              <label>Warna Tema Utama</label>
              <div className="color-picker text-white">
                <input
                  type="color"
                  name="themeColor"
                  value={localSettings.themeColor}
                  onChange={handleChange}
                />
                <span>Pilih warna brand anda</span>
              </div>
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" className="btn btn-primary">
              <Save size={18} />
              Simpan Perubahan
            </button>
          </div>
        </form>
      </div>

      <style>{`
        .settings-form {
          padding: 2rem;
        }
        .form-section {
          margin-bottom: 2.5rem;
          border-bottom: 1px solid var(--glass-border);
          padding-bottom: 2rem;
        }
        .form-section:last-child {
          border-bottom: none;
          margin-bottom: 0;
        }
        .section-title {
          margin-bottom: 1.5rem;
          font-size: 1.1rem;
        }
        
        .form-group { margin-bottom: 1.5rem; }
        .form-input {
          width: 100%;
          padding: 0.75rem;
          background: var(--color-bg);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-md);
          color: white;
          margin-top: 0.5rem;
        }
        .help-text {
          font-size: 0.8rem;
          color: var(--color-text-muted);
          margin-top: 0.25rem;
          display: block;
        }

        .radio-group {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
          margin-top: 0.5rem;
        }
        .radio-card {
          border: 1px solid var(--color-border);
          padding: 1rem;
          border-radius: var(--radius-md);
          cursor: pointer;
          transition: all 0.2s;
        }
        .radio-card:hover {
          background: rgba(255,255,255,0.02);
        }
        .radio-card.active {
          border-color: var(--color-primary);
          background: rgba(99, 102, 241, 0.1);
        }
        .radio-card input { display: none; }
        .radio-title {
          display: block;
          font-weight: 600;
          margin-bottom: 0.25rem;
        }
        .radio-desc {
          font-size: 0.8rem;
          color: var(--color-text-muted);
        }

        .color-picker {
          display: flex;
          align-items: center;
          gap: 1rem;
        }
        .color-picker input {
          width: 50px;
          height: 50px;
          border-radius: var(--radius-md);
          border: none;
          cursor: pointer;
          background: none;
        }
      `}</style>
    </div>
  );
};

export default Settings;
