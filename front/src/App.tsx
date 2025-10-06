import React, { useState } from 'react';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Sidebar from './components/Layout/Sidebar';
import Header from './components/Layout/Header';
import MobileMenu from './components/Layout/MobileMenu';
import MobileNavbar from './components/Layout/MobileNavbar';
import Dashboard from './components/Dashboard/Dashboard';
import Interns from './components/Sections/Interns';
import Encadreurs from './components/Sections/Encadreurs';
import Projects from './components/Sections/Projects';
import Kanban from './components/Sections/Kanban';
import Reports from './components/Sections/Reports';
import Settings from './components/Sections/Settings';
import Login from './pages/Login';
import Register from './pages/Register';

function AppContent() {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const { user, loading } = useAuth();

  React.useEffect(() => {
    const handleNavigate = (event: any) => {
      setActiveSection(event.detail);
    };

    const checkRegisterRoute = () => {
      if (window.location.pathname === '/register') {
        setShowRegister(true);
      }
    };

    window.addEventListener('navigate', handleNavigate);
    checkRegisterRoute();

    return () => window.removeEventListener('navigate', handleNavigate);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600 dark:text-slate-400">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    if (showRegister) {
      return <Register />;
    }
    return <Login />;
  }

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return <Dashboard />;
      case 'interns':
        return <Interns />;
      case 'encadreurs':
        return <Encadreurs />;
      case 'projects':
        return <Projects />;
      case 'kanban':
        return <Kanban />;
      case 'reports':
        return <Reports />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 dark:from-gray-900 dark:to-gray-800">
      <MobileMenu
        isOpen={isMobileMenuOpen}
        onToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      />

      <MobileNavbar
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        activeSection={activeSection}
        onSectionChange={setActiveSection}
      />

      <Sidebar
        activeSection={activeSection}
        onSectionChange={setActiveSection}
      />

      <Header onNavigate={setActiveSection} />

      <main className="pt-20 md:pt-24 px-4 md:px-6 pb-6 ml-0 md:ml-64">
        {renderContent()}
      </main>
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;