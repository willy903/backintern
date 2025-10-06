import React from 'react';
import { X, Calendar, Users, BarChart3, Clock } from 'lucide-react';
import { Project } from '../../types';
import { mockInterns } from '../../data/mockData';

interface ProjectDetailModalProps {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function ProjectDetailModal({ project, isOpen, onClose }: ProjectDetailModalProps) {
  if (!isOpen || !project) return null;

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

  const assignedInterns = mockInterns.filter(intern => 
    project.assignedInterns.includes(intern.id)
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">{project.title}</h3>
            <button 
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>
        
        <div className="p-6 space-y-6">
          {/* Status and Progress */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <BarChart3 className="h-5 w-5 text-orange-500" />
                <h4 className="font-medium text-gray-900 dark:text-white">Statut</h4>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(project.status)}`}>
                {getStatusText(project.status)}
              </span>
            </div>
            
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Clock className="h-5 w-5 text-orange-500" />
                <h4 className="font-medium text-gray-900 dark:text-white">Progression</h4>
              </div>
              <div className="flex items-center space-x-3">
                <div className="flex-1 bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                  <div 
                    className="bg-orange-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${project.completion}%` }}
                  />
                </div>
                <span className="text-sm font-medium text-gray-900 dark:text-white">{project.completion}%</span>
              </div>
            </div>
          </div>

          {/* Description */}
          {project.description && (
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">Description</h4>
              <p className="text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                {project.description}
              </p>
            </div>
          )}

          {/* Due Date */}
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Calendar className="h-5 w-5 text-orange-500" />
              <h4 className="font-medium text-gray-900 dark:text-white">Date d'échéance</h4>
            </div>
            <p className="text-gray-600 dark:text-gray-300">
              {new Date(project.dueDate).toLocaleDateString('fr-FR', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
          </div>

          {/* Assigned Interns */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Users className="h-5 w-5 text-orange-500" />
              <h4 className="font-medium text-gray-900 dark:text-white">
                Stagiaires assignés ({assignedInterns.length})
              </h4>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {assignedInterns.map(intern => (
                <div key={intern.id} className="flex items-center space-x-3 bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                  <img
                    src={intern.avatar}
                    alt={intern.name}
                    className="h-10 w-10 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{intern.name}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{intern.department}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              Fermer
            </button>
            <button className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors">
              Modifier le projet
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}