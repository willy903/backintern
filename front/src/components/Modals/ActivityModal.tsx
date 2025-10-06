import React from 'react';
import { X, Clock, FileText, CheckSquare, Users, Calendar } from 'lucide-react';
import { mockActivities } from '../../data/mockData';

interface ActivityModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const activityIcons = {
  project: FileText,
  task: CheckSquare,
  intern: Users
};

const activityColors = {
  project: 'bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400',
  task: 'bg-green-100 text-green-600 dark:bg-green-900/50 dark:text-green-400',
  intern: 'bg-purple-100 text-purple-600 dark:bg-purple-900/50 dark:text-purple-400'
};

export default function ActivityModal({ isOpen, onClose }: ActivityModalProps) {
  if (!isOpen) return null;

  // Extended activities for the modal
  const extendedActivities = [
    ...mockActivities,
    {
      id: "4",
      user: {
        name: "Emma Wilson",
        avatar: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=64&h=64&dpr=1"
      },
      action: "a créé un nouveau projet: Mobile App",
      target: "",
      timestamp: "Il y a 2 jours",
      type: "project" as const
    },
    {
      id: "5",
      user: {
        name: "John Smith",
        avatar: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=64&h=64&dpr=1"
      },
      action: "a mis à jour la tâche: Database Setup",
      target: "",
      timestamp: "Il y a 3 jours",
      type: "task" as const
    },
    {
      id: "6",
      user: {
        name: "Sarah Johnson",
        avatar: "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=64&h=64&dpr=1"
      },
      action: "a rejoint le département Design",
      target: "",
      timestamp: "Il y a 4 jours",
      type: "intern" as const
    }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl max-w-3xl w-full max-h-[90vh] overflow-hidden">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Clock className="h-6 w-6 text-orange-500" />
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Toutes les Activités</h3>
            </div>
            <button 
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>
        
        <div className="max-h-96 overflow-y-auto p-6">
          <div className="space-y-4">
            {extendedActivities.map((activity) => {
              const Icon = activityIcons[activity.type];
              const colorClass = activityColors[activity.type];
              
              return (
                <div key={activity.id} className="flex items-start space-x-4 p-4 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200 border border-gray-100 dark:border-gray-700">
                  <img
                    src={activity.user.avatar}
                    alt={activity.user.name}
                    className="h-12 w-12 rounded-full object-cover flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-2">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {activity.user.name}
                      </p>
                      <div className={`p-1 rounded-full ${colorClass}`}>
                        <Icon className="h-3 w-3" />
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {activity.action}
                    </p>
                    <div className="flex items-center space-x-2 mt-2">
                      <Calendar className="h-3 w-3 text-gray-400" />
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {activity.timestamp}
                      </p>
                    </div>
                  </div>
                  <button className="text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300 text-sm font-medium">
                    Voir détails
                  </button>
                </div>
              );
            })}
          </div>
        </div>
        
        <div className="p-6 border-t border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {extendedActivities.length} activités au total
            </p>
            <button 
              onClick={onClose}
              className="px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg hover:from-orange-600 hover:to-red-600 transition-all duration-200"
            >
              Fermer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}