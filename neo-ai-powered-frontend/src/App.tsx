import React, { useState } from 'react';
import { TabType } from './types';
import Header from './components/Layout/Header';
import TabNavigation from './components/Layout/TabNavigation';
import Footer from './components/Layout/Footer';
import CalorieAnalysis from './components/CalorieAnalysis/CalorieAnalysis';
import TextTranslation from './components/TextTranslation/TextTranslation';
import PDFSummarization from './components/PDFSummarization/PDFSummarization';
import ErrorMessage from './components/common/ErrorMessage';
import './App.css';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('calories');
  const [globalError, setGlobalError] = useState<string | null>(null);

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    setGlobalError(null);
  };

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'calories':
        return <CalorieAnalysis />;
      case 'translate':
        return <TextTranslation />;
      case 'pdf':
        return <PDFSummarization />;
      default:
        return <CalorieAnalysis />;
    }
  };

  return (
    <div className="app-container">
      <Header />
      
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content-wrapper">
          <div className="hero-content-container">
            <main className="hero-main-content">
              <div className="hero-text-container">
                <h2 className="hero-title">
                  <span className="hero-title-primary">AI-Powered</span>{' '}
                  <span className="hero-title-accent">Assistant</span>
                </h2>
                <p className="hero-description">
                  Get instant calorie analysis, text translation, and PDF summarization with advanced AI technology.
                </p>
              </div>
            </main>
          </div>
        </div>
        <div className="hero-image-container">
          <img
            className="hero-image"
            src="https://images.unsplash.com/photo-1716436329475-4c55d05383bb?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzF8MHwxfHNlYXJjaHwyfHxBSSUyMHRlY2hub2xvZ3l8ZW58MHx8fHwxNzUyNTA0MzQ5fDA&ixlib=rb-4.1.0&q=85"
            alt="AI Technology"
          />
        </div>
      </section>

      {/* Main Content */}
      <div className="main-content-container">
        <TabNavigation activeTab={activeTab} onTabChange={handleTabChange} />
        
        {globalError && (
          <ErrorMessage message={globalError} onDismiss={() => setGlobalError(null)} />
        )}
        
        <div className="tab-content-area">
          {renderActiveTab()}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default App;