import React, { useState } from 'react';
import { X, Search, Users, FolderOpen, CheckSquare } from 'lucide-react';
import { mockInterns, mockProjects, mockTasks } from '../../data/mockData';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [searchTerm, setSearchTerm] = useState('');

  if (!isOpen) return null;

  const filteredInterns = mockInterns.filter(intern => 
    intern.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    intern.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredProjects = mockProjects.filter(project => 
    project.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredTasks = mockTasks.filter(task => 
    task.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-start justify-center pt-20 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl max-w-2xl w-full max-h-[70vh] overflow-hidden">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Recherche</h3>
            <button 
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Rechercher stagiaires, projets, tâches..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              autoFocus
            />
          </div>
        </div>
        
        <div className="max-h-96 overflow-y-auto p-6 space-y-6">
          {searchTerm && (
            <>
              {filteredInterns.length > 0 && (
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                    <Users className="h-4 w-4 mr-2 text-orange-500" />
                    Stagiaires ({filteredInterns.length})
                  </h4>
                  <div className="space-y-2">
                    {filteredInterns.map(intern => (
                      <button 
                        key={intern.id} 
                        onClick={() => {
                          onClose();
                          // Navigate to interns section
                          window.dispatchEvent(new CustomEvent('navigate', { detail: 'interns' }));
                        }}
                        className="w-full flex items-center space-x-3 p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg text-left"
                      >
                        <img src={intern.avatar} alt={intern.name} className="h-8 w-8 rounded-full" />
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">{intern.name}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">{intern.department}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {filteredProjects.length > 0 && (
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                    <FolderOpen className="h-4 w-4 mr-2 text-orange-500" />
                    Projets ({filteredProjects.length})
                  </h4>
                  <div className="space-y-2">
                    {filteredProjects.map(project => (
                      <button 
                        key={project.id} 
                        onClick={() => {
                          onClose();
                          window.dispatchEvent(new CustomEvent('navigate', { detail: 'projects' }));
                        }}
                        className="w-full p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg text-left"
                      >
                        <p className="font-medium text-gray-900 dark:text-white">{project.title}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{project.completion}% complété</p>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {filteredTasks.length > 0 && (
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                    <CheckSquare className="h-4 w-4 mr-2 text-orange-500" />
                    Tâches ({filteredTasks.length})
                  </h4>
                  <div className="space-y-2">
                    {filteredTasks.map(task => (
                      <button 
                        key={task.id} 
                        onClick={() => {
                          onClose();
                          window.dispatchEvent(new CustomEvent('navigate', { detail: 'kanban' }));
                        }}
                        className="w-full p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg text-left"
                      >
                        <p className="font-medium text-gray-900 dark:text-white">{task.title}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{task.status}</p>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {searchTerm && filteredInterns.length === 0 && filteredProjects.length === 0 && filteredTasks.length === 0 && (
                <div className="text-center py-8">
                  <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 dark:text-gray-400">Aucun résultat trouvé pour "{searchTerm}"</p>
                </div>
              )}
            </>
          )}

          {!searchTerm && (
            <div className="text-center py-8">
              <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400">Commencez à taper pour rechercher...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}