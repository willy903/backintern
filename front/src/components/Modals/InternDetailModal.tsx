import React, { useState } from 'react';
import { X, Calendar, Mail, Building, TrendingUp, Award, GraduationCap, Phone, User, CreditCard as Edit2 } from 'lucide-react';
import { InternDTO, internService, UpdateInternRequest } from '../../services/internService';
import { encadreurService } from '../../services/encadreurService';
import { useApiError } from '../../hooks/useApiError';
import { useAuth } from '../../contexts/AuthContext';

interface InternDetailModalProps {
  intern: InternDTO | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdate?: () => void;
}

export default function InternDetailModal({ intern, isOpen, onClose, onUpdate }: InternDetailModalProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<UpdateInternRequest>({});
  const [encadreurs, setEncadreurs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const handleApiError = useApiError();
  const { authUser } = useAuth();


  React.useEffect(() => {
    if (isOpen && isEditing) {
      loadEncadreurs();
      if (intern) {
        setEditData({
          phone: intern.phone,
          school: intern.school,
          department: intern.department,
          startDate: intern.startDate,
          endDate: intern.endDate,
          encadreurId: intern.encadreurId
        });
      }
    }
  }, [isOpen, isEditing, intern]);

  const loadEncadreurs = async () => {
    try {
      const data = await encadreurService.getAllEncadreurs();

      if (authUser?.role === 'ENCADREUR') {
        const storedUser = localStorage.getItem('auth_user');
        if (storedUser) {
          const userData = JSON.parse(storedUser);
          const currentEncadreur = data.find(e => e.encadreurid === userData.id);
          if (currentEncadreur) {
            setEncadreurs([currentEncadreur]);
          }
        }
      } else {
        setEncadreurs(data);
      }
    } catch (error: any) {
      handleApiError(error, 'Erreur lors du chargement des encadreurs');
    }
  };

  const handleSave = async () => {
    if (!intern) return;

    try {
      setLoading(true);
      await internService.updateIntern(intern.id, editData);
      setIsEditing(false);
      if (onUpdate) onUpdate();
      onClose();
    } catch (error: any) {
      handleApiError(error, 'Erreur lors de la modification du stagiaire');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !intern) return null;

  const departments = ['Informatique', 'Marketing', 'Ressources Humaines', 'Finance', 'Ventes', 'Support'];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="h-16 w-16 rounded-full bg-gradient-to-br from-orange-400 to-red-400 flex items-center justify-center text-white font-semibold text-xl">
                {intern.firstName && intern.firstName[0]}{intern.lastName && intern.lastName[0]}
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">{intern.firstName} {intern.lastName}</h3>
                <p className="text-gray-600 dark:text-gray-300">{intern.department}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {!isEditing ? (
            <>
              {/* View Mode */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Mail className="h-5 w-5 text-orange-500" />
                    <h4 className="font-medium text-gray-900 dark:text-white">Email</h4>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300">{intern.email}</p>
                </div>

                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Phone className="h-5 w-5 text-orange-500" />
                    <h4 className="font-medium text-gray-900 dark:text-white">Téléphone</h4>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300">{intern.phone}</p>
                </div>

                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Building className="h-5 w-5 text-orange-500" />
                    <h4 className="font-medium text-gray-900 dark:text-white">Département</h4>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300">{intern.department}</p>
                </div>

                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <GraduationCap className="h-5 w-5 text-orange-500" />
                    <h4 className="font-medium text-gray-900 dark:text-white">École</h4>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300">{intern.school}</p>
                </div>

                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <User className="h-5 w-5 text-orange-500" />
                    <h4 className="font-medium text-gray-900 dark:text-white">Encadreur</h4>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300">
                    {intern.encadreurPrenom && intern.encadreurNom
                      ? `${intern.encadreurPrenom} ${intern.encadreurNom}`
                      : 'Non assigné'}
                  </p>
                </div>
              </div>

              {/* Dates */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Calendar className="h-5 w-5 text-orange-500" />
                    <h4 className="font-medium text-gray-900 dark:text-white">Date de début</h4>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300">
                    {new Date(intern.startDate).toLocaleDateString('fr-FR', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>

                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Calendar className="h-5 w-5 text-orange-500" />
                    <h4 className="font-medium text-gray-900 dark:text-white">Date de fin</h4>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300">
                    {new Date(intern.endDate).toLocaleDateString('fr-FR', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              </div>

              {/* Status */}
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Award className="h-5 w-5 text-orange-500" />
                  <h4 className="font-medium text-gray-900 dark:text-white">Statut</h4>
                </div>
                <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                  intern.status === 'ACTIVE'
                    ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-200'
                    : intern.status === 'PENDING'
                    ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-200'
                    : intern.status === 'COMPLETED'
                    ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-200'
                    : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                }`}>
                  {intern.status}
                </span>
              </div>

              {/* Notes */}
              {intern.notes && (
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <TrendingUp className="h-5 w-5 text-orange-500" />
                    <h4 className="font-medium text-gray-900 dark:text-white">Notes</h4>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300">{intern.notes}</p>
                </div>
              )}
            </>
          ) : (
            <>
              {/* Edit Mode */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Téléphone
                  </label>
                  <input
                    type="tel"
                    value={editData.phone || ''}
                    onChange={(e) => setEditData({ ...editData, phone: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    École
                  </label>
                  <input
                    type="text"
                    value={editData.school || ''}
                    onChange={(e) => setEditData({ ...editData, school: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Département
                  </label>
                  <select
                    value={editData.department || ''}
                    onChange={(e) => setEditData({ ...editData, department: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    {departments.map(dept => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Encadreur
                  </label>
                  <select
                    value={editData.encadreurId || 0}
                    onChange={(e) => setEditData({ ...editData, encadreurId: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="0">Sélectionner un encadreur</option>
                    {encadreurs.map(enc => (
                      <option key={enc.id} value={enc.id}>{enc.prenom} {enc.nom}</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Date de début
                    </label>
                    <input
                      type="date"
                      value={editData.startDate || ''}
                      onChange={(e) => setEditData({ ...editData, startDate: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Date de fin
                    </label>
                    <input
                      type="date"
                      value={editData.endDate || ''}
                      onChange={(e) => setEditData({ ...editData, endDate: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            {!isEditing ? (
              <>
                <button
                  onClick={onClose}
                  className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  Fermer
                </button>
                {(authUser?.role === 'ADMIN' || authUser?.role === 'ENCADREUR') && (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg hover:from-orange-600 hover:to-red-600 transition-all duration-200 flex items-center gap-2"
                  >
                    <Edit2 className="h-4 w-4" />
                    Modifier le stagiaire
                  </button>
                )}
              </>
            ) : (
              <>
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  Annuler
                </button>
                <button
                  onClick={handleSave}
                  disabled={loading}
                  className="px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg hover:from-orange-600 hover:to-red-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Enregistrement...' : 'Enregistrer'}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
