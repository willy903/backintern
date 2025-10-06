import React from 'react';
import {
  Home,
  Users,
  FolderOpen,
  Trello,
  FileText,
  Settings,
  HelpCircle,
  Moon,
  Sun,
  UserCog
} from 'lucide-react';
import clsx from 'clsx';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';

interface SidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const getNavigation = (userRole: string) => {
  const baseNavigation = [
    { id: 'dashboard', name: 'Dashboard', icon: Home, roles: ['ADMIN', 'ENCADREUR', 'STAGIAIRE'] },
    { id: 'interns', name: 'Stagiaires', icon: Users, roles: ['ADMIN', 'ENCADREUR'] },
    { id: 'encadreurs', name: 'Encadreurs', icon: UserCog, roles: ['ADMIN'] },
    { id: 'projects', name: 'Projets', icon: FolderOpen, roles: ['ADMIN', 'ENCADREUR', 'STAGIAIRE'] },
    { id: 'kanban', name: 'Kanban', icon: Trello, roles: ['ADMIN', 'ENCADREUR', 'STAGIAIRE'] },
    { id: 'reports', name: 'Rapports', icon: FileText, roles: ['ADMIN', 'ENCADREUR','STAGIAIRE'] },
    { id: 'settings', name: 'Paramètres', icon: Settings, roles: ['ADMIN', 'ENCADREUR', 'STAGIAIRE'] },
  ];

  return baseNavigation.filter(item => item.roles.includes(userRole));
};

export default function Sidebar({ activeSection, onSectionChange }: SidebarProps) {
  const { isDark, toggleTheme } = useTheme();
  const { authUser } = useAuth();
  const navigation = getNavigation(authUser?.role || 'stagiaire');

  return (
    <div className="hidden md:block bg-white dark:bg-gray-900 h-screen shadow-sm border-r border-gray-100 dark:border-gray-800 fixed left-0 top-0 z-30 overflow-y-auto w-64">
      <div className="flex items-center justify-between px-6 py-6 border-b border-gray-100 dark:border-gray-800">
        <div className="flex items-center">
          <div className="bg-gradient-to-br from-orange-500 to-red-500 rounded-lg p-2 mr-3">
            <Users className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">Stagiaire360</h1>
        </div>
      </div>

      {/* Navigation */}
      <nav className="mt-6 px-3">
        <div className="space-y-1">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => onSectionChange(item.id)}
                className={clsx(
                  'w-full flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200',
                  isActive
                    ? 'bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 text-orange-700 dark:text-orange-400'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
                )}
              >
                <Icon className={clsx(
                  'mr-3 h-5 w-5 flex-shrink-0',
                  isActive ? 'text-orange-600 dark:text-orange-400' : 'text-gray-400 dark:text-gray-500'
                )} />
                {item.name}
              </button>
            );
          })}
        </div>
      </nav>

      {/* Theme Toggle */}
      <div className="mt-6 px-3">
        <button
          onClick={toggleTheme}
          className="w-full flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white"
        >
          {isDark ? <Sun className="mr-3 h-5 w-5 flex-shrink-0 text-gray-400 dark:text-gray-500" /> : <Moon className="mr-3 h-5 w-5 flex-shrink-0 text-gray-400 dark:text-gray-500" />}
          {isDark ? 'Mode Sombre' : 'Mode Clair'}
        </button>
      </div>

      <div className="mt-8 mb-6 mx-3">
        <div className="bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-lg p-4 border border-orange-200 dark:border-orange-800">
          <div className="flex items-start">
            <HelpCircle className="h-5 w-5 text-orange-600 dark:text-orange-400 mt-0.5 mr-2 flex-shrink-0" />
            <div>
              <h3 className="text-sm font-medium text-orange-900 dark:text-orange-100">Besoin d'aide?</h3>
              <p className="text-xs text-orange-700 dark:text-orange-300 mt-1">
                Consultez notre documentation.
              </p>
              <button
                onClick={() => alert('Documentation bientôt disponible!')}
                className="text-xs text-orange-600 dark:text-orange-400 font-medium mt-2 hover:text-orange-700 dark:hover:text-orange-300 transition-colors cursor-pointer"
              >
                En savoir plus →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}