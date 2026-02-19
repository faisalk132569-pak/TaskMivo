import React, { useState } from 'react';
import { Project, Task, User } from '@/types';
import { 
  PlusIcon, MoreVerticalIcon, ClockIcon, 
  FolderIcon, CheckCircleIcon, AlertCircleIcon 
} from '@/components/icons/Icons';

interface ProjectBoardProps {
  projects: Project[];
  tasks: Task[];
  users: User[];
}

const ProjectBoard: React.FC<ProjectBoardProps> = ({ projects, tasks, users }) => {
  const [selectedProject, setSelectedProject] = useState<string | null>(projects[0]?.id || null);
  const [draggedTask, setDraggedTask] = useState<string | null>(null);
  const [taskStatuses, setTaskStatuses] = useState<Record<string, Task['status']>>({});

  const columns: { id: Task['status']; title: string; color: string }[] = [
    { id: 'todo', title: 'To Do', color: 'bg-slate-100' },
    { id: 'in_progress', title: 'In Progress', color: 'bg-blue-100' },
    { id: 'review', title: 'Review', color: 'bg-amber-100' },
    { id: 'completed', title: 'Completed', color: 'bg-green-100' },
  ];

  const getUser = (userId?: string) => users.find(u => u.id === userId);

  const getTaskStatus = (taskId: string, originalStatus: Task['status']) => {
    return taskStatuses[taskId] || originalStatus;
  };

  const projectTasks = tasks.filter(t => t.project_id === selectedProject);

  const handleDragStart = (taskId: string) => {
    setDraggedTask(taskId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (status: Task['status']) => {
    if (draggedTask) {
      setTaskStatuses(prev => ({
        ...prev,
        [draggedTask]: status
      }));
      setDraggedTask(null);
    }
  };

  const getPriorityColor = (priority: Task['priority']) => {
    switch (priority) {
      case 'critical': return 'bg-red-100 text-red-700';
      case 'high': return 'bg-orange-100 text-orange-700';
      case 'medium': return 'bg-amber-100 text-amber-700';
      case 'low': return 'bg-slate-100 text-slate-700';
    }
  };

  const selectedProjectData = projects.find(p => p.id === selectedProject);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Projects & Tasks</h2>
          <p className="text-slate-500">Manage your team's work</p>
        </div>
        
        <div className="flex items-center gap-3">
          <select
            value={selectedProject || ''}
            onChange={(e) => setSelectedProject(e.target.value)}
            className="bg-white border border-slate-200 rounded-lg px-4 py-2 text-sm font-medium text-slate-700 outline-none focus:border-indigo-500"
          >
            {projects.map(project => (
              <option key={project.id} value={project.id}>{project.name}</option>
            ))}
          </select>
          
          <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium">
            <PlusIcon size={20} />
            New Task
          </button>
        </div>
      </div>

      {/* Project Info */}
      {selectedProjectData && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-indigo-100 rounded-xl">
                <FolderIcon size={24} className="text-indigo-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-800">{selectedProjectData.name}</h3>
                <p className="text-sm text-slate-500">{selectedProjectData.description}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-slate-800">
                  {projectTasks.filter(t => getTaskStatus(t.id, t.status) === 'completed').length}
                </p>
                <p className="text-xs text-slate-500">Completed</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-slate-800">
                  {projectTasks.filter(t => getTaskStatus(t.id, t.status) === 'in_progress').length}
                </p>
                <p className="text-xs text-slate-500">In Progress</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-slate-800">
                  {projectTasks.filter(t => getTaskStatus(t.id, t.status) === 'todo').length}
                </p>
                <p className="text-xs text-slate-500">To Do</p>
              </div>
              
              <div className="w-32">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-slate-500">Progress</span>
                  <span className="text-xs font-medium text-slate-700">
                    {Math.round((projectTasks.filter(t => getTaskStatus(t.id, t.status) === 'completed').length / Math.max(projectTasks.length, 1)) * 100)}%
                  </span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-indigo-600 rounded-full transition-all"
                    style={{ 
                      width: `${(projectTasks.filter(t => getTaskStatus(t.id, t.status) === 'completed').length / Math.max(projectTasks.length, 1)) * 100}%` 
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Kanban Board */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {columns.map(column => {
          const columnTasks = projectTasks.filter(t => getTaskStatus(t.id, t.status) === column.id);
          
          return (
            <div
              key={column.id}
              className="bg-slate-50 rounded-xl p-4"
              onDragOver={handleDragOver}
              onDrop={() => handleDrop(column.id)}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className={`w-3 h-3 rounded-full ${column.color}`} />
                  <h3 className="font-semibold text-slate-700">{column.title}</h3>
                  <span className="px-2 py-0.5 bg-white rounded-full text-xs font-medium text-slate-500">
                    {columnTasks.length}
                  </span>
                </div>
                <button className="p-1 hover:bg-slate-200 rounded transition-colors">
                  <PlusIcon size={18} className="text-slate-400" />
                </button>
              </div>
              
              <div className="space-y-3">
                {columnTasks.map(task => {
                  const assignee = getUser(task.assigned_to);
                  
                  return (
                    <div
                      key={task.id}
                      draggable
                      onDragStart={() => handleDragStart(task.id)}
                      className={`bg-white rounded-lg p-4 shadow-sm border border-slate-100 cursor-move hover:shadow-md transition-shadow ${
                        draggedTask === task.id ? 'opacity-50' : ''
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <span className={`px-2 py-0.5 rounded text-xs font-medium ${getPriorityColor(task.priority)}`}>
                          {task.priority}
                        </span>
                        <button className="p-1 hover:bg-slate-100 rounded transition-colors">
                          <MoreVerticalIcon size={16} className="text-slate-400" />
                        </button>
                      </div>
                      
                      <h4 className="font-medium text-slate-800 mb-2">{task.title}</h4>
                      
                      {task.description && (
                        <p className="text-sm text-slate-500 mb-3 line-clamp-2">{task.description}</p>
                      )}
                      
                      <div className="flex items-center justify-between">
                        {assignee && (
                          <div className="flex items-center gap-2">
                            <img
                              src={assignee.avatar_url || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=24&h=24&fit=crop'}
                              alt={`${assignee.first_name} ${assignee.last_name}`}
                              className="w-6 h-6 rounded-full object-cover"
                            />
                            <span className="text-xs text-slate-500">{assignee.first_name}</span>
                          </div>
                        )}
                        
                        {task.due_date && (
                          <div className="flex items-center gap-1 text-xs text-slate-500">
                            <ClockIcon size={12} />
                            {new Date(task.due_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                          </div>
                        )}
                      </div>
                      
                      {task.estimated_hours && (
                        <div className="mt-3 pt-3 border-t border-slate-100">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-slate-500">
                              {task.actual_hours}h / {task.estimated_hours}h
                            </span>
                            <span className="text-slate-500">
                              {Math.round((task.actual_hours / task.estimated_hours) * 100)}%
                            </span>
                          </div>
                          <div className="h-1 bg-slate-100 rounded-full mt-1 overflow-hidden">
                            <div 
                              className={`h-full rounded-full ${
                                task.actual_hours > task.estimated_hours ? 'bg-red-500' : 'bg-indigo-500'
                              }`}
                              style={{ width: `${Math.min((task.actual_hours / task.estimated_hours) * 100, 100)}%` }}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
                
                {columnTasks.length === 0 && (
                  <div className="text-center py-8 text-slate-400 text-sm">
                    No tasks
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProjectBoard;
