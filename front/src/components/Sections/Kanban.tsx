import React, { useState } from 'react';
import { Trello, Plus, Calendar, User, Tag, ChevronDown, AlertTriangle } from 'lucide-react';
import { mockTasks, mockInterns, mockProjects } from '../../data/mockData';
import { Task } from '../../types';
import TaskFormModal from '../Modals/TaskFormModal';

export default function Kanban() {
  const [selectedProject, setSelectedProject] = useState<string>('1');
  const [showProjectDropdown, setShowProjectDropdown] = useState(false);
  const [tasks, setTasks] = useState(mockTasks);
  const [draggedTask, setDraggedTask] = useState<Task | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<string | null>(null);
  const [showTaskForm, setShowTaskForm] = useState(false);

  const selectedProjectData = mockProjects.find(p => p.id === selectedProject);
  const projectTasks = tasks.filter(task => task.projectId === selectedProject);

  const todoTasks = projectTasks.filter(task => task.status === 'todo');
  const inProgressTasks = projectTasks.filter(task => task.status === 'in-progress');
  const doneTasks = projectTasks.filter(task => task.status === 'done');
  const bugTasks = projectTasks.filter(task => task.status === 'bug');

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-200';
      case 'low':
        return 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
  };

  const handleDragStart = (e: React.DragEvent, task: Task) => {
    setDraggedTask(task);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', ''); // For Firefox compatibility
  };

  const handleDragOver = (e: React.DragEvent, columnStatus: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverColumn(columnStatus);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    // Only clear if we're leaving the column entirely
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setDragOverColumn(null);
    }
  };

  const handleDrop = (e: React.DragEvent, newStatus: 'todo' | 'in-progress' | 'done' | 'bug') => {
    e.preventDefault();
    setDragOverColumn(null);
    
    if (draggedTask) {
      setTasks(prevTasks => 
        prevTasks.map(task => 
          task.id === draggedTask.id 
            ? { ...task, status: newStatus }
            : task
        )
      );
      setDraggedTask(null);
    }
  };

  const handleDragEnd = () => {
    setDraggedTask(null);
    setDragOverColumn(null);
  };

  const TaskCard = ({ task }: { task: Task }) => {
    const assignedIntern = mockInterns.find(intern => intern.id === task.assignedTo);
    const isDragging = draggedTask?.id === task.id;

    return (
      <div 
        draggable
        onDragStart={(e) => handleDragStart(e, task)}
        onDragEnd={handleDragEnd}
        className={`bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all duration-200 cursor-move ${
          isDragging ? 'opacity-50 rotate-2 scale-105' : ''
        }`}
      >
        <div className="flex items-start justify-between mb-3">
          <h4 className="font-medium text-gray-900 dark:text-white text-sm">{task.title}</h4>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
            {task.priority}
          </span>
        </div>
        
        {task.description && (
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">{task.description}</p>
        )}
        
        {task.labels && task.labels.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {task.labels.map((label, index) => (
              <span key={index} className="px-2 py-1 bg-orange-100 dark:bg-orange-900/50 text-orange-800 dark:text-orange-200 text-xs rounded-full">
                {label}
              </span>
            ))}
          </div>
        )}
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Calendar className="h-3 w-3 text-gray-400" />
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {new Date(task.dueDate).toLocaleDateString('fr-FR')}
            </span>
          </div>
          
          {assignedIntern && (
            <div className="flex items-center space-x-1">
              <img
                src={assignedIntern.avatar}
                alt={assignedIntern.name}
                className="h-6 w-6 rounded-full object-cover"
                title={assignedIntern.name}
              />
            </div>
          )}
        </div>
      </div>
    );
  };

  const KanbanColumn = ({ 
    title, 
    tasks, 
    count, 
    bgColor, 
    status,
    icon: Icon 
  }: { 
    title: string; 
    tasks: Task[]; 
    count: number;
    bgColor: string;
    status: 'todo' | 'in-progress' | 'done' | 'bug';
    icon: React.ElementType;
  }) => (
    <div className="flex-1 min-w-80">
      <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${bgColor}`} />
            <Icon className="h-4 w-4 text-gray-600 dark:text-gray-400" />
            <h3 className="font-semibold text-gray-900 dark:text-white">{title}</h3>
            <span className="bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-1 rounded-full text-xs">
              {count}
            </span>
          </div>
          <button 
            onClick={() => setShowTaskForm(true)}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
        
        <div 
          className={`space-y-3 max-h-96 overflow-y-auto min-h-[200px] p-2 rounded-lg border-2 border-dashed transition-all duration-200 ${
            dragOverColumn === status 
              ? 'border-orange-400 bg-orange-50 dark:bg-orange-900/20' 
              : 'border-transparent'
          }`}
          onDragOver={(e) => handleDragOver(e, status)}
          onDragLeave={handleDragLeave}
          onDrop={(e) => handleDrop(e, status)}
        >
          {tasks.map(task => (
            <TaskCard key={task.id} task={task} />
          ))}
          
          {tasks.length === 0 && (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              <Icon className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">Aucune tâche</p>
              {dragOverColumn === status && (
                <p className="text-xs mt-1 text-orange-500">Déposez la tâche ici</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Kanban Board</h2>
          <p className="text-gray-600 dark:text-gray-300 mt-1">Gérer les tâches par projet (glisser-déposer)</p>
        </div>
        
        {/* Project Selector */}
        <div className="relative mt-4 sm:mt-0">
          <div className="grid grid-cols-2 gap-4">
  <button
    onClick={() => setShowProjectDropdown(!showProjectDropdown)}
    className="flex items-center justify-between bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
  >
    <span className="font-medium text-gray-900 dark:text-white">
      {selectedProjectData?.title || 'Sélectionner un projet'}
    </span>
    <ChevronDown className="h-4 w-4 text-gray-500" />
  </button>

  <button 
    onClick={() => setShowTaskForm(true)}
    className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-2 rounded-lg hover:from-orange-600 hover:to-red-600 transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl transform hover:scale-105"
  >
    <Plus className="h-4 w-4" />
    <span>Ajouter une Tâche</span>
  </button>
</div>

          
          {showProjectDropdown && (
            <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-10">
              {mockProjects.map(project => (
                <button
                  key={project.id}
                  onClick={() => {
                    setSelectedProject(project.id);
                    setShowProjectDropdown(false);
                  }}
                  className="w-full text-left px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors first:rounded-t-lg last:rounded-b-lg"
                >
                  <div className="font-medium text-gray-900 dark:text-white">{project.title}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {project.assignedInterns.length} stagiaires • {project.completion}% complété
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {selectedProjectData && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{selectedProjectData.title}</h3>
              <p className="text-gray-600 dark:text-gray-300 mt-1">
                {selectedProjectData.assignedInterns.length} stagiaires assignés •
                Échéance: {new Date(selectedProjectData.dueDate).toLocaleDateString('fr-FR')}
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {Math.round((doneTasks.length / Math.max(projectTasks.length, 1)) * 100)}%
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Complété</div>
            </div>
          </div>

          <div className="mt-4">
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                className="bg-green-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(doneTasks.length / Math.max(projectTasks.length, 1)) * 100}%` }}
              />
            </div>
            <div className="flex items-center justify-between mt-2 text-xs text-gray-600 dark:text-gray-400">
              <span>Terminé: {doneTasks.length}</span>
              <span>En cours: {inProgressTasks.length}</span>
              <span>En attente: {todoTasks.length}</span>
              <span>Bug: {bugTasks.length}</span>
            </div>
          </div>
        </div>
      )}

      {/* Kanban Board */}
      <div className="flex space-x-6 overflow-x-auto pb-4">
        <KanbanColumn 
          title="En attente" 
          tasks={todoTasks} 
          count={todoTasks.length}
          bgColor="bg-yellow-500"
          status="todo"
          icon={Trello}
        />
        <KanbanColumn 
          title="En cours" 
          tasks={inProgressTasks} 
          count={inProgressTasks.length}
          bgColor="bg-orange-500"
          status="in-progress"
          icon={User}
        />
        <KanbanColumn 
          title="Terminé" 
          tasks={doneTasks} 
          count={doneTasks.length}
          bgColor="bg-green-500"
          status="done"
          icon={Tag}
        />
        <KanbanColumn 
          title="Bug" 
          tasks={bugTasks} 
          count={bugTasks.length}
          bgColor="bg-red-500"
          status="bug"
          icon={AlertTriangle}
        />
      </div>

      {/* Task Form Modal */}
      <TaskFormModal 
        isOpen={showTaskForm}
        onClose={() => setShowTaskForm(false)}
        onSubmit={(taskData) => {
          const newTask = {
            ...taskData,
            id: (tasks.length + 1).toString(),
            status: 'todo' as const
          };
          setTasks(prev => [...prev, newTask]);
          setShowTaskForm(false);
        }}
        projectId={selectedProject}
      />
    </div>
  );
}