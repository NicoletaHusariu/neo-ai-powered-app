import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="app-header">
      <div className="header-content">
        <div className="header-inner">
          <div className="header-logo-container">
            <div className="header-logo">
              <h1 className="app-title">AI Assistant</h1>
            </div>
          </div>
          <div className="header-badge-container">
            <div className="powered-by-badge">
              AI Powered
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;