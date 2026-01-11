
import React, { useState } from 'react';
import { Layout } from './components/Layout';
import { Dashboard } from './components/Dashboard';
import { CareerCoach } from './components/CareerCoach';
import { MockInterview } from './components/MockInterview';
import { ResumeOptimizer } from './components/ResumeOptimizer';
import { Wellness } from './components/Wellness';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'coach':
        return <CareerCoach />;
      case 'interview':
        return <MockInterview />;
      case 'resume':
        return <ResumeOptimizer />;
      case 'wellness':
        return <Wellness />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
      <div className="animate-in fade-in duration-500">
        {renderContent()}
      </div>
    </Layout>
  );
};

export default App;
