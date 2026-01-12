import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

const Layout = () => {
    return (
        <div className="layout">
            <Sidebar />
            <main className="main-content">
                <Outlet />
            </main>

            <style>{`
        .layout {
          display: flex;
          min-height: 100vh;
          background: var(--color-bg);
        }

        .main-content {
          flex: 1;
          margin-left: 280px; /* Sidebar width */
          padding: 2rem;
          min-height: 100vh;
        }

        @media (max-width: 768px) {
          .main-content {
            margin-left: 0;
            padding-bottom: 80px; /* Bottom nav space if we had one */
          }
          /* We would add a mobile responsive menu here usually */
        }
      `}</style>
        </div>
    );
};

export default Layout;
