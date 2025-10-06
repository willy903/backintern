import React, { useState } from 'react';
import { FileText, Download, Calendar, TrendingUp, BarChart3, PieChart } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { progressData, departmentData, mockInterns, mockProjects, mockTasks } from '../../data/mockData';

export default function Reports() {
  const [generatingReport, setGeneratingReport] = useState(false);

  const generateGlobalReport = () => {
    setGeneratingReport(true);

    const totalInterns = mockInterns.length;
    const activeInterns = mockInterns.filter(i => i.status === 'active').length;
    const totalProjects = mockProjects.length;
    const completedProjects = mockProjects.filter(p => p.status === 'done').length;
    const totalTasks = mockTasks.length;
    const completedTasks = mockTasks.filter(t => t.status === 'done').length;
    const pendingTasks = mockTasks.filter(t => t.status === 'todo').length;
    const inProgressTasks = mockTasks.filter(t => t.status === 'in-progress').length;
    const bugTasks = mockTasks.filter(t => t.status === 'bug').length;

    const reportContent = `
RAPPORT GLOBAL DES STAGIAIRES
Généré le: ${new Date().toLocaleString('fr-FR')}

========================================
RÉSUMÉ GLOBAL
========================================

STAGIAIRES:
- Total: ${totalInterns}
- Actifs: ${activeInterns}
- Inactifs: ${totalInterns - activeInterns}

PROJETS:
- Total: ${totalProjects}
- Terminés: ${completedProjects}
- En cours: ${totalProjects - completedProjects}
- Taux de complétion: ${Math.round((completedProjects / totalProjects) * 100)}%

TÂCHES:
- Total: ${totalTasks}
- Terminées: ${completedTasks}
- En cours: ${inProgressTasks}
- En attente: ${pendingTasks}
- Bugs: ${bugTasks}
- Taux de complétion: ${Math.round((completedTasks / totalTasks) * 100)}%

========================================
DÉTAILS PAR STAGIAIRE
========================================

${mockInterns.map(intern => {
  const internTasks = mockTasks.filter(t => t.assignedTo === intern.id);
  const completedInternTasks = internTasks.filter(t => t.status === 'done').length;
  const internProjects = mockProjects.filter(p => p.assignedInterns.includes(intern.id));

  return `
NOM: ${intern.name}
Email: ${intern.email}
Département: ${intern.department}
Statut: ${intern.status === 'active' ? 'Actif' : 'Inactif'}
Progression: ${intern.progress}%
Tâches assignées: ${internTasks.length}
Tâches terminées: ${completedInternTasks}
Projets assignés: ${internProjects.length}
`;
}).join('\n---\n')}

========================================
DÉTAILS PAR PROJET
========================================

${mockProjects.map(project => {
  const projectTasks = mockTasks.filter(t => t.projectId === project.id);
  const completedProjectTasks = projectTasks.filter(t => t.status === 'done').length;
  const pendingProjectTasks = projectTasks.filter(t => t.status === 'todo').length;
  const inProgressProjectTasks = projectTasks.filter(t => t.status === 'in-progress').length;
  const bugProjectTasks = projectTasks.filter(t => t.status === 'bug').length;

  return `
PROJET: ${project.title}
Statut: ${project.status === 'done' ? 'Terminé' : project.status === 'in-progress' ? 'En cours' : 'En attente'}
Complétion: ${project.completion}%
Échéance: ${new Date(project.dueDate).toLocaleDateString('fr-FR')}
Stagiaires assignés: ${project.assignedInterns.length}

TÂCHES:
- Total: ${projectTasks.length}
- Terminées: ${completedProjectTasks}
- En cours: ${inProgressProjectTasks}
- En attente: ${pendingProjectTasks}
- Bugs: ${bugProjectTasks}
`;
}).join('\n---\n')}

========================================
CONCLUSION
========================================

Taux de réussite global: ${Math.round((completedTasks / totalTasks) * 100)}%
Performance des stagiaires: Bonne
Recommandations: Continuer le suivi régulier des tâches et projets.

========================================
FIN DU RAPPORT
========================================
    `;

    const blob = new Blob([reportContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Rapport_Global_${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setTimeout(() => {
      setGeneratingReport(false);
      alert('Rapport généré avec succès!');
    }, 1000);
  };

  const reports = [
    {
      id: 1,
      name: 'Rapport de Performance Mensuel',
      description: 'Comprehensive analysis of intern performance and progress',
      lastGenerated: '2024-02-15',
      type: 'Performance',
      downloads: 156
    },
    {
      id: 2,
      name: 'Aperçu du Statut des Projets',
      description: 'Status and completion rates of all active projects',
      lastGenerated: '2024-02-14',
      type: 'Projets',
      downloads: 89
    },
    {
      id: 3,
      name: 'Analyses par Département',
      description: 'Intern distribution and productivity by department',
      lastGenerated: '2024-02-13',
      type: 'Analyses',
      downloads: 234
    }
  ];

  const monthlyStats = [
    { month: 'Jan', reports: 12, downloads: 45 },
    { month: 'Fév', reports: 18, downloads: 67 },
    { month: 'Mar', reports: 15, downloads: 52 },
    { month: 'Avr', reports: 22, downloads: 89 },
    { month: 'Mai', reports: 19, downloads: 76 },
    { month: 'Jun', reports: 25, downloads: 98 }
  ];

  return (
    <div className="space-y-6 mt-0">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Rapports</h2>
        <p className="text-gray-600 dark:text-gray-300 mt-1">Générer et consulter des rapports complets</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
          <div className="flex items-center">
            <div className="bg-orange-100 dark:bg-orange-900/50 p-3 rounded-lg">
              <TrendingUp className="h-6 w-6 text-orange-600 dark:text-orange-400" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">94%</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">Taux de Réussite Moyen</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
          <div className="flex items-center">
            <div className="bg-green-100 dark:bg-green-900/50 p-3 rounded-lg">
              <FileText className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">156</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">Rapports Générés</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
          <div className="flex items-center">
            <div className="bg-purple-100 dark:bg-purple-900/50 p-3 rounded-lg">
              <Calendar className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Mensuel</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">Fréquence des Rapports</p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Reports Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
          <div className="mb-6">
            <div className="flex items-center space-x-2 mb-2">
              <BarChart3 className="h-5 w-5 text-orange-500" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Rapports Mensuels</h3>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300">Génération et téléchargements par mois</p>
          </div>
          
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyStats}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="month" 
                  stroke="#6b7280"
                  fontSize={12}
                />
                <YAxis 
                  stroke="#6b7280"
                  fontSize={12}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Bar 
                  dataKey="reports" 
                  fill="#f97316" 
                  radius={[4, 4, 0, 0]}
                  name="Rapports générés"
                />
                <Bar 
                  dataKey="downloads" 
                  fill="#fb923c" 
                  radius={[4, 4, 0, 0]}
                  name="Téléchargements"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Performance Trend */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
          <div className="mb-6">
            <div className="flex items-center space-x-2 mb-2">
              <TrendingUp className="h-5 w-5 text-orange-500" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Tendance des Performances</h3>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300">Évolution des performances dans le temps</p>
          </div>
          
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={progressData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="month" 
                  stroke="#6b7280"
                  fontSize={12}
                />
                <YAxis 
                  stroke="#6b7280"
                  fontSize={12}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="progress" 
                  stroke="#f97316" 
                  strokeWidth={3}
                  dot={{ fill: '#f97316', strokeWidth: 2, r: 4 }}
                  name="Progression moyenne"
                />
                <Line 
                  type="monotone" 
                  dataKey="performance" 
                  stroke="#fb923c" 
                  strokeWidth={3}
                  dot={{ fill: '#fb923c', strokeWidth: 2, r: 4 }}
                  name="Performance"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Reports List */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
        <div className="p-6 border-b border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-gray-900 dark:text-white">Rapports Disponibles</h3>
            <button
              onClick={generateGlobalReport}
              disabled={generatingReport}
              className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-2 rounded-lg hover:from-orange-600 hover:to-red-600 transition-all duration-200 text-sm font-medium shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              {generatingReport ? (
                <>
                  <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                  <span>Génération...</span>
                </>
              ) : (
                <>
                  <FileText className="h-4 w-4" />
                  <span>Générer un Nouveau Rapport</span>
                </>
              )}
            </button>
          </div>
        </div>
        
        <div className="divide-y divide-gray-100 dark:divide-gray-700">
          {reports.map((report) => (
            <div key={report.id} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200">
              <div className="flex items-center justify-between">
                <div className="flex items-start space-x-4">
                  <div className="bg-orange-100 dark:bg-orange-900/50 p-2 rounded-lg">
                    <FileText className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">{report.name}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{report.description}</p>
                    <div className="flex items-center space-x-4 mt-2">
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        Type: {report.type}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        Dernière génération: {new Date(report.lastGenerated).toLocaleDateString()}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {report.downloads} téléchargements
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button 
                    onClick={() => console.log(`Télécharger ${report.name}`)}
                    className="text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                  >
                    <Download className="h-4 w-4" />
                  </button>
                  <button 
                    onClick={() => console.log(`Générer ${report.name}`)}
                    className="text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300 font-medium text-sm transition-colors"
                  >
                    Générer
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}