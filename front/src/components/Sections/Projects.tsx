import React from 'react';
import { useState } from 'react';
import { FolderOpen, Plus, Calendar, Users } from 'lucide-react';
import { mockProjects, mockInterns, mockUsers } from '../../data/mockData';
import { useAuth } from '../../contexts/AuthContext';
import ProjectForm from './ProjectForm';
import ProjectDetailModal from '../Modals/ProjectDetailModal';

export default function Projects() {
  const { authUser } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [showProjectDetail, setShowProjectDetail] = useState(false);

  const userRole = authUser?.role || 'stagiaire';
  const currentUser = mockUsers.find(u => u.profile.email === authUser?.profile.email);

  const getFilteredProjects = () => {
    if (userRole === 'responsable_rh') {
      return mockProjects;
    }

    if (userRole === 'encadreur') {
      return mockProjects.filter(project =>
        project.assignedInterns.some(internId => currentUser?.stagiaires?.includes(internId))
      );
    }

    if (userRole === 'stagiaire') {
      return mockProjects.filter(project =>
        project.assignedInterns.includes(currentUser?.id || '')
      );
    }

    return mockProjects;
  };

  const filteredProjects = getFilteredProjects();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'todo':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'in-progress':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      case 'done':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'todo':
        return 'En attente';
      case 'in-progress':
        return 'En cours';
      case 'done':
        return 'Terminé';
      default:
        return status;
    }
  };

  const handleViewProject = (project: any) => {
    setSelectedProject(project);
    setShowProjectDetail(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Projets</h2>
          <p className="text-gray-600 dark:text-gray-300 mt-1">Suivre et gérer les projets des stagiaires</p>
        </div>
        {(userRole === 'responsable_rh' || userRole === 'encadreur') && (
          <button
            onClick={() => setShowForm(true)}
            className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-2 rounded-lg hover:from-orange-600 hover:to-red-600 transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl transform hover:scale-105 w-full sm:w-auto"
          >
            <Plus className="h-4 w-4" />
            <span>Nouveau Projet</span>
          </button>
        )}
      </div>

      {/* Project Form Modal */}
      {showForm && (
        <ProjectForm 
          onClose={() => setShowForm(false)}
          onSubmit={(projectData: any) => {
            console.log('Nouveau projet créé:', projectData);
            setShowForm(false);
          }}
        />
      )}

      {/* Project Details Modal */}
      <ProjectDetailModal 
        project={selectedProject}
        isOpen={showProjectDetail}
        onClose={() => {
          setShowProjectDetail(false);
          setSelectedProject(null);
        }}
      />

      {/* Projects Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredProjects.map((project) => (
          <div key={project.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="bg-orange-100 dark:bg-orange-900 p-2 rounded-lg">
                  <FolderOpen className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">{project.title}</h3>
                  <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium mt-1 ${getStatusColor(project.status)}`}>
                    {getStatusText(project.status)}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600 dark:text-gray-300">Progression</span>
                  <span className="font-medium text-gray-900 dark:text-white">{project.completion}%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-orange-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${project.completion}%` }}
                  />
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
                  <Calendar className="h-4 w-4" />
                  <span>Échéance: {new Date(project.dueDate).toLocaleDateString()}</span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                  <div className="flex -space-x-2">
                    {project.assignedInterns.slice(0, 3).map((internId, index) => {
                      const intern = mockInterns.find(i => i.id === internId);
                      return intern ? (
                        <img
                          key={internId}
                          src={intern.avatar}
                          alt={intern.name}
                          className="h-6 w-6 rounded-full border-2 border-white object-cover"
                          title={intern.name}
                        />
                      ) : null;
                    })}
                    {project.assignedInterns.length > 3 && (
                      <div className="h-6 w-6 rounded-full bg-gray-200 dark:bg-gray-600 border-2 border-white dark:border-gray-800 flex items-center justify-center">
                        <span className="text-xs font-medium text-gray-600 dark:text-gray-300">
                          +{project.assignedInterns.length - 3}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            
            <button 
              onClick={() => handleViewProject(project)}
              className="w-full mt-4 text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300 font-medium text-sm transition-colors"
            >
              Voir le Projet →
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}