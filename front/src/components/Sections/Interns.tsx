import React, { useState, useEffect } from 'react';
import { Users, Plus, Search, MoreVertical } from 'lucide-react';
import InternDetailModal from '../Modals/InternDetailModal';
import InternFormModal from '../Modals/InternFormModal';
import { internService, InternDTO } from '../../services/internService';
import { encadreurService } from '../../services/encadreurService';
import { useApiError } from '../../hooks/useApiError';
import { useAuth } from '../../contexts/AuthContext';

export default function Interns() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIntern, setSelectedIntern] = useState<InternDTO | null>(null);
  const [showInternDetail, setShowInternDetail] = useState(false);
  const [showInternForm, setShowInternForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [filterDepartment, setFilterDepartment] = useState('');
  const [interns, setInterns] = useState<InternDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const handleApiError = useApiError();
  const { authUser } = useAuth();

  useEffect(() => {
    loadInterns();
  }, [authUser]);

  const loadInterns = async () => {
    try {
      setLoading(true);

      let internsData: InternDTO[];

      if (authUser?.role === 'ENCADREUR') {
        const storedUser = localStorage.getItem('auth_user');
        if (storedUser) {
          const userData = JSON.parse(storedUser);
          const encadreur = await encadreurService.getEncadreurByUserId(userData.id);
          console.log(encadreur.id)
          internsData = await encadreurService.getEncadreurInterns(userData.id);
        } else {
          internsData = [];
        }
      } else {
        internsData = await internService.getAllInterns();
      }

      const encadreursData = await encadreurService.getAllEncadreurs();

      const internsWithEncadreur = internsData.map(intern => {
        const encadreur = encadreursData.find(e => e.id === intern.encadreurId);
        return {
          ...intern,
          encadreurNom: encadreur?.nom,
          encadreurPrenom: encadreur?.prenom
        };
      });

      setInterns(internsWithEncadreur);
    } catch (error: any) {
      handleApiError(error, 'Erreur lors du chargement des stagiaires');
    } finally {
      setLoading(false);
    }
  };

  const filteredInterns = interns.filter(intern => {
    const matchesSearch =
      `${intern.prenom} ${intern.nom}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      intern.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = !filterDepartment || intern.department === filterDepartment;
    return matchesSearch && matchesDepartment;
  });

  const departments = [...new Set(interns.map(intern => intern.department))];

  const handleViewIntern = (intern: any) => {
    setSelectedIntern(intern);
    setShowInternDetail(true);
  };

  const handleAddIntern = async (internData: any) => {
    await loadInterns();
    setShowInternForm(false);
  };

  const getProgressPercentage = (startDate: string, endDate: string): number => {
    const start = new Date(startDate).getTime();
    const end = new Date(endDate).getTime();
    const now = new Date().getTime();

    if (now < start) return 0;
    if (now > end) return 100;

    return Math.round(((now - start) / (end - start)) * 100);
  };

  const getStatusBadgeClass = (status: string): string => {
    switch (status.toUpperCase()) {
      case 'ACTIVE':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'COMPLETED':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'CANCELLED':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Stagiaires</h2>
          <p className="text-gray-600 dark:text-gray-300 mt-1">Gérer et suivre vos stagiaires</p>
        </div>
        {(authUser?.role === 'ADMIN' || authUser?.role === 'ENCADREUR') && (
          <button
            onClick={() => setShowInternForm(true)}
            className="mt-4 sm:mt-0 bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-2 rounded-lg hover:from-orange-600 hover:to-red-600 transition-all duration-200 flex items-center space-x-2 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <Plus className="h-4 w-4" />
            <span>Ajouter un stagiaire</span>
          </button>
        )}
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 md:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 h-4 w-4" />
              <input
                type="text"
                placeholder="Rechercher des stagiaires..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
          </div>
          <select
            value={filterDepartment}
            onChange={(e) => setFilterDepartment(e.target.value)}
            className="w-full sm:w-auto px-4 py-2 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <option value="">Tous les départements</option>
            {departments.map(dept => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Interns Grid */}
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : filteredInterns.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-12 text-center">
          <Users className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">Aucun stagiaire trouvé</h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {searchTerm ? 'Essayez de modifier votre recherche.' : 'Commencez par ajouter un nouveau stagiaire.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredInterns.map((intern) => {
            const progress = getProgressPercentage(intern.startDate, intern.endDate);
            const prenomInitial = intern.prenom && intern.prenom.length > 0 ? intern.prenom[0].toUpperCase() : 'S';
            const nomInitial = intern.nom && intern.nom.length > 0 ? intern.nom[0].toUpperCase() : 'T';
            return (
              <div key={intern.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 hover:shadow-md transition-shadow duration-200">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="h-12 w-12 rounded-full bg-gradient-to-br from-orange-400 to-red-400 flex items-center justify-center text-white font-semibold">
                      {prenomInitial}{nomInitial}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">{intern.prenom} {intern.nom}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300">{intern.department}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600 dark:text-gray-300">Progression</span>
                      <span className="font-medium text-gray-900 dark:text-white">{progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-orange-600 dark:bg-orange-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-300">École</span>
                    <span className="font-medium text-gray-900 dark:text-white">{intern.school}</span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-300">Encadreur</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {intern.encadreurPrenom && intern.encadreurNom
                        ? `${intern.encadreurPrenom} ${intern.encadreurNom}`
                        : 'Non assigné'}
                    </span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-300">Date de début</span>
                    <span className="font-medium text-gray-900 dark:text-white">{new Date(intern.startDate).toLocaleDateString()}</span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-300">Statut</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(intern.status)}`}>
                      {intern.status}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => handleViewIntern(intern)}
                  className="w-full mt-4 text-orange-600 hover:text-orange-700 font-medium text-sm transition-colors"
                >
                  Voir détails →
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Intern Detail Modal */}
      <InternDetailModal
        intern={selectedIntern}
        isOpen={showInternDetail}
        onClose={() => {
          setShowInternDetail(false);
          setSelectedIntern(null);
        }}
        onUpdate={loadInterns}
      />

      {/* Intern Form Modal */}
      <InternFormModal
        isOpen={showInternForm}
        onClose={() => setShowInternForm(false)}
        onSubmit={handleAddIntern}
      />
    </div>
  );
}