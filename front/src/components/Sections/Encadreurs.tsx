import React, { useState, useEffect } from 'react';
import { Search, Plus, Mail, Phone, Users, CreditCard as Edit, Trash2 } from 'lucide-react';
import EncadreurFormModal from '../Modals/EncadreurFormModal';
import { encadreurService } from '../../services/encadreurService';
import { useApiError } from '../../hooks/useApiError';

export default function Encadreurs() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('');
  const [showFormModal, setShowFormModal] = useState(false);
  const [selectedEncadreur, setSelectedEncadreur] = useState<number | null>(null);
  const [encadreurs, setEncadreurs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const handleApiError = useApiError();

  useEffect(() => {
    loadEncadreurs();
  }, []);

  const loadEncadreurs = async () => {
    try {
      setLoading(true);
      const data = await encadreurService.getAllEncadreurs();

      const encadreursWithCount = await Promise.all(
        data.map(async (enc) => {
          try {
            const count = await encadreurService.getEncadreurInternCount(enc.id);
            return { ...enc, stagiaireCount: count };
          } catch {
            return { ...enc, stagiaireCount: 0 };
          }
        })
      );

      setEncadreurs(encadreursWithCount);
    } catch (error: any) {
      handleApiError(error, 'Erreur lors du chargement des encadreurs');
    } finally {
      setLoading(false);
    }
  };

  const filteredEncadreurs = encadreurs.filter(encadreur => {
    const matchesSearch =
      encadreur.nom.toLowerCase().includes(searchQuery.toLowerCase()) ||
      encadreur.prenom.toLowerCase().includes(searchQuery.toLowerCase()) ||
      encadreur.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      encadreur.department.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDepartment = !filterDepartment || encadreur.department === filterDepartment;
    return matchesSearch && matchesDepartment;
  });

  const departments = [...new Set(encadreurs.map(enc => enc.department))];

  const handleAddEncadreur = () => {
    setSelectedEncadreur(null);
    setShowFormModal(true);
  };

  const handleEditEncadreur = (id: number) => {
    setSelectedEncadreur(id);
    setShowFormModal(true);
  };

  const handleDeleteEncadreur = async (id: number, nom: string, prenom: string) => {
    if (!confirm(`Êtes-vous sûr de vouloir supprimer ${prenom} ${nom}?`)) return;

    try {
      await encadreurService.deleteEncadreur(id);
      await loadEncadreurs();
    } catch (error: any) {
      handleApiError(error, 'Erreur lors de la suppression');
    }
  };

  const handleModalClose = () => {
    setShowFormModal(false);
    setSelectedEncadreur(null);
    loadEncadreurs();
  };

  return (
    <>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Gestion des Encadreurs</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {filteredEncadreurs.length} encadreur{filteredEncadreurs.length > 1 ? 's' : ''} trouvé{filteredEncadreurs.length > 1 ? 's' : ''}
            </p>
          </div>

          <button
            onClick={handleAddEncadreur}
            className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-2 rounded-lg hover:from-orange-600 hover:to-red-600 transition-all duration-200 flex items-center space-x-2"
          >
            <Plus className="h-5 w-5" />
            <span>Ajouter un Encadreur</span>
          </button>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Rechercher un encadreur..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <select
                value={filterDepartment}
                onChange={(e) => setFilterDepartment(e.target.value)}
                className="w-full sm:w-auto px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
              >
                <option value="">Tous les départements</option>
                {departments.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : (
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Encadreur
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Département
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Stagiaires
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {filteredEncadreurs.map((encadreur) => (
                  <tr key={encadreur.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-orange-400 to-red-400 flex items-center justify-center text-white font-semibold">
                          {encadreur.prenom[0]}{encadreur.nom[0]}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {encadreur.prenom} {encadreur.nom}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {encadreur.specialization || 'Non spécifié'}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="space-y-1">
                        <div className="flex items-center text-sm text-gray-900 dark:text-white">
                          <Mail className="h-4 w-4 mr-2 text-gray-400" />
                          {encadreur.email}
                        </div>
                        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                          <Phone className="h-4 w-4 mr-2 text-gray-400" />
                          {encadreur.phone}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
                        {encadreur.department}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-900 dark:text-white">
                        <Users className="h-4 w-4 mr-2 text-gray-400" />
                        {encadreur.stagiaireCount === 0 ? (
                          <span className="text-gray-400 dark:text-gray-500 italic">Aucun stagiaire</span>
                        ) : (
                          <span>{encadreur.stagiaireCount} stagiaire{encadreur.stagiaireCount > 1 ? 's' : ''}</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleEditEncadreur(encadreur.id)}
                        className="text-orange-600 hover:text-orange-900 dark:text-orange-400 dark:hover:text-orange-300 mr-3"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteEncadreur(encadreur.id, encadreur.nom, encadreur.prenom)}
                        className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            )}

            {!loading && filteredEncadreurs.length === 0 && (
              <div className="text-center py-12">
                <Users className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">Aucun encadreur trouvé</h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  {searchQuery ? 'Essayez de modifier votre recherche.' : 'Commencez par ajouter un nouvel encadreur.'}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <EncadreurFormModal
        isOpen={showFormModal}
        onClose={handleModalClose}
        encadreurId={selectedEncadreur}
      />
    </>
  );
}
