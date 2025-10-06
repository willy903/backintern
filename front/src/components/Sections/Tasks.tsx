import React from 'react';
import { CheckSquare, Plus, Calendar, AlertCircle } from 'lucide-react';
import { mockTasks, mockInterns, mockProjects } from '../../data/mockData';

export default function Tasks() {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'todo':
        return 'bg-yellow-100 text-yellow-800';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800';
      case 'done':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'text-red-600';
      case 'medium':
        return 'text-yellow-600';
      case 'low':
        return 'text-green-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Tâches</h2>
          <p className="text-gray-600 dark:text-gray-300 mt-1">Gérer et suivre la progression des tâches</p>
        </div>
        <button 
          onClick={() => alert('Create new task form')}
          className="mt-4 sm:mt-0 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Nouvelle Tâche</span>
        </button>
      </div>

      {/* Tasks List */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div className="p-6 border-b border-gray-100 dark:border-gray-700">
          <h3 className="font-semibold text-gray-900 dark:text-white">Toutes les Tâches</h3>
        </div>
        
        <div className="divide-y divide-gray-100 dark:divide-gray-700">
          {mockTasks.map((task) => {
            const assignedIntern = mockInterns.find(intern => intern.id === task.assignedTo);
            const project = mockProjects.find(p => p.id === task.projectId);
            
            return (
              <div key={task.id} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4 flex-1">
                    <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-lg">
                      <CheckSquare className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-3 mb-2">
                        <h4 className="font-medium text-gray-900 dark:text-white">{task.title}</h4>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
                          {task.status.replace('-', ' ')}
                        </span>
                        <div className="flex items-center space-x-1">
                          <AlertCircle className={`h-3 w-3 ${getPriorityColor(task.priority)}`} />
                          <span className={`text-xs font-medium ${getPriorityColor(task.priority)}`}>
                            Priorité {task.priority === 'high' ? 'haute' : task.priority === 'medium' ? 'moyenne' : 'basse'}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-300">
                        {project && (
                          <span>Projet: {project.title}</span>
                        )}
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-4 w-4" />
                          <span>Échéance: {new Date(task.dueDate).toLocaleDateString('fr-FR')}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3 ml-4">
                    {assignedIntern && (
                      <div className="flex items-center space-x-2">
                        <img
                          src={assignedIntern.avatar}
                          alt={assignedIntern.name}
                          className="h-8 w-8 rounded-full object-cover"
                        />
                        <span className="text-sm font-medium text-gray-900">
                          {assignedIntern.name}
                        </span>
                      </div>
                    )}
                    
                    <button 
                      onClick={() => alert(`Edit task: ${task.title}`)}
                      className="text-blue-600 hover:text-blue-700 font-medium text-sm transition-colors"
                    >
                      Edit
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}