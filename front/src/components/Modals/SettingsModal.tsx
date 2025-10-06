import React, { useState } from 'react';
import { X, Users, Lock, Bell, Database, Save, User, Mail, Shield, Globe } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'users' | 'security' | 'notifications' | 'database' | null;
}

export default function SettingsModal({ isOpen, onClose, type }: SettingsModalProps) {
  const [activeTab, setActiveTab] = useState('general');

  if (!isOpen || !type) return null;

  const renderUserManagement = () => (
    <div className="space-y-6">
      <div>
        <h4 className="font-medium text-gray-900 dark:text-white mb-4">Gestion des Utilisateurs</h4>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Nom d'utilisateur
              </label>
              <input
                type="text"
                defaultValue="admin"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email
              </label>
              <input
                type="email"
                defaultValue="admin@internhub.com"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Rôle
            </label>
            <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
              <option value="admin">Administrateur</option>
              <option value="manager">Manager</option>
              <option value="intern">Stagiaire</option>
            </select>
          </div>
          
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <h5 className="font-medium text-gray-900 dark:text-white mb-2">Permissions</h5>
            <div className="space-y-2">
              <label className="flex items-center">
                <input type="checkbox" defaultChecked className="rounded border-gray-300 text-orange-600 focus:ring-orange-500" />
                <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Gérer les stagiaires</span>
              </label>
              <label className="flex items-center">
                <input type="checkbox" defaultChecked className="rounded border-gray-300 text-orange-600 focus:ring-orange-500" />
                <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Gérer les projets</span>
              </label>
              <label className="flex items-center">
                <input type="checkbox" className="rounded border-gray-300 text-orange-600 focus:ring-orange-500" />
                <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Accès aux rapports</span>
              </label>
            </div>
          </div>
          
          <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-4">
            <h5 className="font-medium text-orange-900 dark:text-orange-200 mb-3">Ajouter un Nouveau Stagiaire</h5>
            <p className="text-sm text-orange-700 dark:text-orange-300 mb-3">
              Créer un compte pour un nouveau stagiaire dans le système.
            </p>
            <button 
              onClick={() => {
                onClose();
                // This would open the intern form modal
                window.dispatchEvent(new CustomEvent('openInternForm'));
              }}
              className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-2 rounded-lg hover:from-orange-600 hover:to-red-600 transition-all duration-200"
            >
              Ajouter un Stagiaire
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSecuritySettings = () => (
    <div className="space-y-6">
      <div>
        <h4 className="font-medium text-gray-900 dark:text-white mb-4">Paramètres de Sécurité</h4>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Mot de passe actuel
            </label>
            <input
              type="password"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Nouveau mot de passe
              </label>
              <input
                type="password"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Confirmer le mot de passe
              </label>
              <input
                type="password"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
          </div>
          
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <h5 className="font-medium text-gray-900 dark:text-white mb-2">Authentification à deux facteurs</h5>
            <label className="flex items-center">
              <input type="checkbox" className="rounded border-gray-300 text-orange-600 focus:ring-orange-500" />
              <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Activer l'authentification à deux facteurs</span>
            </label>
          </div>
          
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <h5 className="font-medium text-gray-900 dark:text-white mb-2">Sessions actives</h5>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-700 dark:text-gray-300">Session actuelle (Chrome)</span>
                <span className="text-xs text-green-600">Actif</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-700 dark:text-gray-300">Mobile (Safari)</span>
                <button className="text-xs text-red-600 hover:text-red-700">Déconnecter</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderNotificationSettings = () => (
    <div className="space-y-6">
      <div>
        <h4 className="font-medium text-gray-900 dark:text-white mb-4">Paramètres de Notifications</h4>
        <div className="space-y-4">
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <h5 className="font-medium text-gray-900 dark:text-white mb-3">Notifications Email</h5>
            <div className="space-y-2">
              <label className="flex items-center">
                <input type="checkbox" defaultChecked className="rounded border-gray-300 text-orange-600 focus:ring-orange-500" />
                <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Nouveaux stagiaires</span>
              </label>
              <label className="flex items-center">
                <input type="checkbox" defaultChecked className="rounded border-gray-300 text-orange-600 focus:ring-orange-500" />
                <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Projets en retard</span>
              </label>
              <label className="flex items-center">
                <input type="checkbox" className="rounded border-gray-300 text-orange-600 focus:ring-orange-500" />
                <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Rapports hebdomadaires</span>
              </label>
            </div>
          </div>
          
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <h5 className="font-medium text-gray-900 dark:text-white mb-3">Notifications Push</h5>
            <div className="space-y-2">
              <label className="flex items-center">
                <input type="checkbox" defaultChecked className="rounded border-gray-300 text-orange-600 focus:ring-orange-500" />
                <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Tâches terminées</span>
              </label>
              <label className="flex items-center">
                <input type="checkbox" className="rounded border-gray-300 text-orange-600 focus:ring-orange-500" />
                <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Mentions dans les commentaires</span>
              </label>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Fréquence des résumés
            </label>
            <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
              <option value="daily">Quotidien</option>
              <option value="weekly">Hebdomadaire</option>
              <option value="monthly">Mensuel</option>
              <option value="never">Jamais</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );

  const renderDatabaseSettings = () => (
    <div className="space-y-6">
      <div>
        <h4 className="font-medium text-gray-900 dark:text-white mb-4">Gestion des Données</h4>
        <div className="space-y-4">
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <h5 className="font-medium text-gray-900 dark:text-white mb-2">Sauvegarde Automatique</h5>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700 dark:text-gray-300">Dernière sauvegarde: Il y a 2 heures</span>
              <button className="bg-orange-500 text-white px-3 py-1 rounded text-sm hover:bg-orange-600 transition-colors">
                Sauvegarder maintenant
              </button>
            </div>
          </div>
          
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <h5 className="font-medium text-gray-900 dark:text-white mb-2">Export des Données</h5>
            <div className="space-y-2">
              <button className="w-full text-left px-3 py-2 bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded hover:bg-gray-50 dark:hover:bg-gray-500 transition-colors">
                Exporter les données des stagiaires (CSV)
              </button>
              <button className="w-full text-left px-3 py-2 bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded hover:bg-gray-50 dark:hover:bg-gray-500 transition-colors">
                Exporter les projets (JSON)
              </button>
              <button className="w-full text-left px-3 py-2 bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded hover:bg-gray-50 dark:hover:bg-gray-500 transition-colors">
                Exporter tous les rapports (PDF)
              </button>
            </div>
          </div>
          
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <h5 className="font-medium text-red-900 dark:text-red-200 mb-2">Zone de Danger</h5>
            <p className="text-sm text-red-700 dark:text-red-300 mb-3">
              Ces actions sont irréversibles. Procédez avec prudence.
            </p>
            <div className="space-y-2">
              <button className="bg-red-600 text-white px-3 py-2 rounded text-sm hover:bg-red-700 transition-colors">
                Réinitialiser toutes les données
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const getModalTitle = () => {
    switch (type) {
      case 'users':
        return 'Gestion des Utilisateurs';
      case 'security':
        return 'Paramètres de Sécurité';
      case 'notifications':
        return 'Notifications';
      case 'database':
        return 'Gestion des Données';
      default:
        return 'Paramètres';
    }
  };

  const getModalIcon = () => {
    switch (type) {
      case 'users':
        return <Users className="h-6 w-6 text-orange-500" />;
      case 'security':
        return <Lock className="h-6 w-6 text-orange-500" />;
      case 'notifications':
        return <Bell className="h-6 w-6 text-orange-500" />;
      case 'database':
        return <Database className="h-6 w-6 text-orange-500" />;
      default:
        return null;
    }
  };

  const renderContent = () => {
    switch (type) {
      case 'users':
        return renderUserManagement();
      case 'security':
        return renderSecuritySettings();
      case 'notifications':
        return renderNotificationSettings();
      case 'database':
        return renderDatabaseSettings();
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {getModalIcon()}
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">{getModalTitle()}</h3>
            </div>
            <button 
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>
        
        <div className="p-6">
          {renderContent()}
          
          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200 dark:border-gray-700 mt-6">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              Annuler
            </button>
            <button 
              onClick={() => {
                console.log('Paramètres sauvegardés');
                onClose();
              }}
              className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors flex items-center space-x-2"
            >
              <Save className="h-4 w-4" />
              <span>Sauvegarder</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}