import React from 'react';
import { TabType } from '../../types';

interface TabNavigationProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

const tabs = [
  { id: 'calories' as TabType, name: 'Calorie Analysis', icon: '🍎' },
  { id: 'translate' as TabType, name: 'Text Translation', icon: '🌍' },
  { id: 'pdf' as TabType, name: 'PDF Summary', icon: '📄' }
];

const TabNavigation: React.FC<TabNavigationProps> = ({ activeTab, onTabChange }) => {
  return (
    <div className="tab-navigation-container">
      <nav className="tab-navigation-list">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`tab-button ${
              activeTab === tab.id
                ? 'tab-button-active'
                : 'tab-button-inactive'
            }`}
          >
            <span className="tab-icon">{tab.icon}</span>
            <span className="tab-label">{tab.name}</span>
          </button>
        ))}
      </nav>
    </div>
  );
};

export default TabNavigation;