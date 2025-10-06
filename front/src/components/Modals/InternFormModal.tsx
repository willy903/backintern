import React, { useState, useEffect } from 'react';
import { X, User, Mail, Building, Calendar, GraduationCap } from 'lucide-react';
import { internService } from '../../services/internService';
import { encadreurService } from '../../services/encadreurService';
import { useApiError } from '../../hooks/useApiError';
import { useAuth } from '../../contexts/AuthContext';

interface InternFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (internData: any) => void;
}

export default function InternFormModal({ isOpen, onClose, onSubmit }: InternFormModalProps) {
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    phone: '',
    departement: '',
    school: '',
    startDate: '',
    endDate: '',
    encadreurId: 0
  });
  const [encadreurs, setEncadreurs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const handleApiError = useApiError();
  const { authUser } = useAuth();

  useEffect(() => {
    if (isOpen) {
      loadEncadreurs();
    }
  }, [isOpen]);

  const loadEncadreurs = async () => {
    try {
      const data = await encadreurService.getAllEncadreurs();

      console.log('=== ENCADREURS CHARGÉS ===');
      console.log('Nombre d\'encadreurs:', data.length);
      data.forEach(enc => {
        console.log(`Encadreur: ${enc.prenom} ${enc.nom} - ID: ${enc.id} - encadreurId: ${enc.encadreurId}`);
      });

      if (authUser?.role === 'ENCADREUR') {
        const storedUser = localStorage.getItem('auth_user');
        if (storedUser) {
          const userData = JSON.parse(storedUser);
          const currentEncadreur = data.find(e => e.encadreurId === userData.id);
          if (currentEncadreur) {
            setEncadreurs([currentEncadreur]);
            setFormData(prev => ({ ...prev, encadreurId: currentEncadreur.encadreurId }));
          }
        }
      } else {
        setEncadreurs(data);
      }
    } catch (error: any) {
      handleApiError(error, 'Erreur lors du chargement des encadreurs');
    }
  };

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.nom || !formData.prenom || !formData.email || !formData.phone ||
        !formData.departement || !formData.school ||
        !formData.startDate || !formData.endDate || !formData.encadreurId) {
      alert('Tous les champs sont obligatoires');
      return;
    }

    try {
      setLoading(true);
      const requestData = {
        email: formData.email,
        firstName: formData.prenom,
        lastName: formData.nom,
        phone: formData.phone,
        school: formData.school,
        department: formData.departement,
        startDate: formData.startDate,
        endDate: formData.endDate,
        encadreurId: Number(formData.encadreurId)
      };

      console.log('=== CRÉATION STAGIAIRE ===');
      console.log('Données envoyées:', requestData);
      console.log('encadreurId type:', typeof requestData.encadreurId);
      console.log('encadreurId value:', requestData.encadreurId);

      await internService.createIntern(requestData);
      onSubmit(formData);
      setFormData({
        nom: '',
        prenom: '',
        email: '',
        phone: '',
        departement: '',
        school: '',
        startDate: '',
        endDate: '',
        encadreurId: 0
      });
      onClose();
    } catch (error: any) {
      handleApiError(error, 'Erreur lors de la création du stagiaire');
    } finally {
      setLoading(false);
    }
  };

  const departments = ['Informatique', 'Marketing', 'Ressources Humaines', 'Finance', 'Ventes', 'Support'];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Nouveau Stagiaire</h3>
            <button 
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <User className="h-4 w-4 inline mr-1" />
                Prénom *
              </label>
              <input
                type="text"
                required
                value={formData.prenom}
                onChange={(e) => setFormData(prev => ({ ...prev, prenom: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="Ex: Jean"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <User className="h-4 w-4 inline mr-1" />
                Nom *
              </label>
              <input
                type="text"
                required
                value={formData.nom}
                onChange={(e) => setFormData(prev => ({ ...prev, nom: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="Ex: Dupont"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <Mail className="h-4 w-4 inline mr-1" />
                Email *
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="jean.dupont@email.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <Mail className="h-4 w-4 inline mr-1" />
                Téléphone *
              </label>
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="+212 6 12 34 56 78"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <GraduationCap className="h-4 w-4 inline mr-1" />
              École *
            </label>
            <input
              type="text"
              required
              value={formData.school}
              onChange={(e) => setFormData(prev => ({ ...prev, school: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="Ex: Université Mohammed V"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <Building className="h-4 w-4 inline mr-1" />
              Département *
            </label>
            <select
              required
              value={formData.departement}
              onChange={(e) => setFormData(prev => ({ ...prev, departement: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="">Sélectionner un département</option>
              {departments.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <User className="h-4 w-4 inline mr-1" />
              Encadreur *
            </label>
            <select
              required
              value={formData.encadreurId}
              onChange={(e) => setFormData(prev => ({ ...prev, encadreurId: Number(e.target.value) }))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="0">Sélectionner un encadreur</option>
              {encadreurs.map(enc => (
                <option key={enc.encadreurId} value={enc.encadreurId}>{enc.prenom} {enc.nom}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <Calendar className="h-4 w-4 inline mr-1" />
                Date de début *
              </label>
              <input
                type="date"
                required
                value={formData.startDate}
                onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <Calendar className="h-4 w-4 inline mr-1" />
                Date de fin *
              </label>
              <input
                type="date"
                required
                value={formData.endDate}
                onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg hover:from-orange-600 hover:to-red-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Création en cours...' : 'Ajouter le Stagiaire'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}