import React from 'react';
import { useState, useEffect, useRef } from 'react';
import { Settings as SettingsIcon, Users, Lock, Bell, Database, Camera } from 'lucide-react';
import SettingsModal from '../Modals/SettingsModal';
import InternFormModal from '../Modals/InternFormModal';

export default function Settings() {
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<'users' | 'security' | 'notifications' | 'database' | null>(null);
  const [showInternForm, setShowInternForm] = useState(false);
  const [profileImage, setProfileImage] = useState<string>('https://api.dicebear.com/7.x/avataaars/svg?seed=Admin');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result as string);
        localStorage.setItem('profileImage', reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    const savedImage = localStorage.getItem('profileImage');
    if (savedImage) {
      setProfileImage(savedImage);
    }
  }, []);

  const handleOpenModal = (type: 'users' | 'security' | 'notifications' | 'database') => {
    setModalType(type);
    setShowModal(true);
  };

  useEffect(() => {
    const handleOpenInternForm = () => {
      setShowInternForm(true);
    };
    
    window.addEventListener('openInternForm', handleOpenInternForm);
    return () => window.removeEventListener('openInternForm', handleOpenInternForm);
  }, []);

  const settingsSections = [
    {
      id: 'users',
      title: 'Gestion des Utilisateurs',
      description: 'Gérer les comptes utilisateurs et les permissions',
      icon: Users,
      color: 'bg-orange-100 dark:bg-orange-900/50 text-orange-600 dark:text-orange-400'
    },
    {
      id: 'security',
      title: 'Paramètres de Sécurité',
      description: 'Configurer l\'authentification et les contrôles d\'accès',
      icon: Lock,
      color: 'bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-400'
    },
    {
      id: 'notifications',
      title: 'Notifications',
      description: 'Configurer les notifications email et système',
      icon: Bell,
      color: 'bg-yellow-100 dark:bg-yellow-900/50 text-yellow-600 dark:text-yellow-400'
    },
    {
      id: 'database',
      title: 'Gestion des Données',
      description: 'Paramètres de sauvegarde et d\'export des données',
      icon: Database,
      color: 'bg-green-100 dark:bg-green-900/50 text-green-600 dark:text-green-400'
    }
  ];

  return (
    <>
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Paramètres</h2>
        <p className="text-gray-600 dark:text-gray-300 mt-1">Configurer votre espace de travail InternHub</p>
      </div>

      {/* Profile Section */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Photo de Profil</h3>
        <div className="flex items-center space-x-6">
          <div className="relative">
            <img
              src={profileImage}
              alt="Profile"
              className="h-24 w-24 rounded-full object-cover border-4 border-gray-200 dark:border-gray-700"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="absolute bottom-0 right-0 bg-orange-500 hover:bg-orange-600 text-white p-2 rounded-full shadow-lg transition-colors"
            >
              <Camera className="h-4 w-4" />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
          </div>
          <div>
            <h4 className="font-medium text-gray-900 dark:text-white">Administrateur</h4>
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
              Cliquez sur l'icône de caméra pour changer votre photo de profil
            </p>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="mt-3 text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300 font-medium text-sm transition-colors"
            >
              Changer la photo →
            </button>
          </div>
        </div>
      </div>

      {/* Settings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {settingsSections.map((section) => {
          const Icon = section.icon;
          return (
            <div key={section.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 hover:shadow-md transition-shadow duration-200">
              <div className="flex items-start space-x-4">
                <div className={`p-3 rounded-lg ${section.color}`}>
                  <Icon className="h-6 w-6" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 dark:text-white">{section.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{section.description}</p>
                  <button 
                    onClick={() => handleOpenModal(section.id as 'users' | 'security' | 'notifications' | 'database')}
                    className="text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300 font-medium text-sm mt-3 transition-colors"
                  >
                    Configurer →
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* System Info */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Informations Système</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-600 dark:text-gray-300">Version:</span>
            <span className="ml-2 font-medium text-gray-900 dark:text-white">1.0.0</span>
          </div>
          <div>
            <span className="text-gray-600 dark:text-gray-300">Dernière mise à jour:</span>
            <span className="ml-2 font-medium text-gray-900 dark:text-white">15 Février 2024</span>
          </div>
          <div>
            <span className="text-gray-600 dark:text-gray-300">Base de données:</span>
            <span className="ml-2 font-medium text-green-600 dark:text-green-400">Connectée</span>
          </div>
          <div>
            <span className="text-gray-600 dark:text-gray-300">Stockage:</span>
            <span className="ml-2 font-medium text-gray-900 dark:text-white">2.4 GB / 10 GB</span>
          </div>
        </div>
      </div>
    </div>
    
    {/* Settings Modal */}
    <SettingsModal 
      isOpen={showModal}
      onClose={() => {
        setShowModal(false);
        setModalType(null);
      }}
      type={modalType}
    />
    
    <InternFormModal 
      isOpen={showInternForm}
      onClose={() => setShowInternForm(false)}
      onSubmit={(internData) => {
        console.log('Nouveau stagiaire créé:', internData);
        setShowInternForm(false);
      }}
    />
    </>
  );
}