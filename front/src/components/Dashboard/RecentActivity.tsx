import React from 'react';
import { useState } from 'react';
import { Clock, FileText, CheckSquare, Users } from 'lucide-react';
import { mockActivities } from '../../data/mockData';
import ActivityModal from '../Modals/ActivityModal';

const activityIcons = {
  project: FileText,
  task: CheckSquare,
  intern: Users
};

const activityColors = {
  project: 'bg-blue-100 text-blue-600',
  task: 'bg-green-100 text-green-600',
  intern: 'bg-purple-100 text-purple-600'
};

export default function RecentActivity() {
  const [showAllActivities, setShowAllActivities] = useState(false);

  return (
    <>
    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Activité Récente</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Dernières mises à jour de votre équipe</p>
        </div>
        <Clock className="h-5 w-5 text-gray-400 dark:text-gray-500" />
      </div>

      <div className="space-y-3">
        {mockActivities.map((activity) => {
          const Icon = activityIcons[activity.type];
          const colorClass = activityColors[activity.type];

          return (
            <div key={activity.id} className="flex items-start space-x-3 p-3 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200">
              <img
                src={activity.user.avatar}
                alt={activity.user.name}
                className="h-10 w-10 rounded-full object-cover flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {activity.user.name}
                  </p>
                  <div className={`p-1 rounded-full ${colorClass} dark:opacity-80`}>
                    <Icon className="h-3 w-3" />
                  </div>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                  {activity.action}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {activity.timestamp}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <button
        onClick={() => setShowAllActivities(true)}
        className="w-full mt-4 text-sm text-orange-600 dark:text-orange-400 font-medium hover:text-orange-700 dark:hover:text-orange-300 transition-colors py-2"
      >
        Voir toutes les activités →
      </button>
    </div>
    
    <ActivityModal 
      isOpen={showAllActivities}
      onClose={() => setShowAllActivities(false)}
    />
    </>
  );
}