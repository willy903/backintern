import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { progressData } from '../../data/mockData';

export default function ProgressChart() {
  return (
    <div className="bg-gradient-to-br from-orange-50 to-red-50 dark:from-gray-800 dark:to-gray-900 rounded-xl shadow-sm border border-orange-200 dark:border-gray-700 p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Progression des Stagiaires</h3>
        <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">Progression moyenne et indicateurs de performance</p>
      </div>
      
      <div className="h-80">
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
              name="Progression Moyenne"
            />
            <Line
              type="monotone"
              dataKey="performance"
              stroke="#fb923c"
              strokeWidth={3}
              dot={{ fill: '#fb923c', strokeWidth: 2, r: 4 }}
              name="Meilleurs Performances"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}