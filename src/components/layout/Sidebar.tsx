import React, { useState } from 'react';
import { UserRole } from '@/types';
import {
  DashboardIcon, UsersIcon, MonitorIcon, ClockIcon, ChartIcon,
  ImageIcon, FolderIcon, TaskIcon, TargetIcon, MessageIcon,
  CalendarIcon, SettingsIcon, ChevronDownIcon, ChevronRightIcon,
  BuildingIcon, ShieldIcon, AwardIcon, LogOutIcon
} from '@/components/icons/Icons';

interface NavItemType {
  id: string;
  label: string;
  icon: React.ReactNode;
  roles?: UserRole[];
  children?: { id: string; label: string; roles?: UserRole[] }[];
}

interface SidebarProps {
  currentView: string;
  setCurrentView: (view: string) => void;
  userRole: UserRole;
  isOpen: boolean;
}

const navItems: NavItemType[] = [
  { id: 'dashboard', label: 'Dashboard', icon: <DashboardIcon size={20} /> },
  { 
    id: 'monitoring', 
    label: 'Monitoring', 
    icon: <MonitorIcon size={20} />,
    roles: ['super_admin', 'company_admin', 'manager'],
    children: [
      { id: 'live-view', label: 'Live View' },
      { id: 'screenshots', label: 'Screenshots' },
      { id: 'activity-timeline', label: 'Activity Timeline' },
      { id: 'app-usage', label: 'App Usage' },
      { id: 'web-usage', label: 'Web Usage' },
    ]
  },
  { 
    id: 'time-attendance', 
    label: 'Time & Attendance', 
    icon: <ClockIcon size={20} />,
    children: [
      { id: 'time-clock', label: 'Time Clock' },
      { id: 'attendance-calendar', label: 'Attendance Calendar' },
      { id: 'attendance-reports', label: 'Reports', roles: ['super_admin', 'company_admin', 'manager'] },
    ]
  },
  { 
    id: 'productivity', 
    label: 'Productivity', 
    icon: <ChartIcon size={20} />,
    children: [
      { id: 'productivity-overview', label: 'Overview' },
      { id: 'productivity-trends', label: 'Trends' },
      { id: 'productivity-comparison', label: 'Team Comparison', roles: ['super_admin', 'company_admin', 'manager'] },
    ]
  },
  { 
    id: 'employees', 
    label: 'Employees', 
    icon: <UsersIcon size={20} />,
    roles: ['super_admin', 'company_admin', 'manager'],
    children: [
      { id: 'employee-list', label: 'All Employees' },
      { id: 'employee-add', label: 'Add Employee' },
      { id: 'departments', label: 'Departments' },
    ]
  },
  { 
    id: 'projects', 
    label: 'Projects', 
    icon: <FolderIcon size={20} />,
    children: [
      { id: 'project-list', label: 'All Projects' },
      { id: 'my-tasks', label: 'My Tasks' },
      { id: 'task-board', label: 'Task Board' },
    ]
  },
  { 
    id: 'kpis', 
    label: 'KPIs', 
    icon: <TargetIcon size={20} />,
    children: [
      { id: 'kpi-dashboard', label: 'KPI Dashboard' },
      { id: 'kpi-settings', label: 'KPI Settings', roles: ['super_admin', 'company_admin'] },
    ]
  },
  { 
    id: 'skills', 
    label: 'Skills & Ranks', 
    icon: <AwardIcon size={20} />,
    children: [
      { id: 'skills-overview', label: 'Skills Overview' },
      { id: 'rankings', label: 'Rankings' },
    ]
  },
  { id: 'messages', label: 'Messages', icon: <MessageIcon size={20} /> },
  { id: 'calendar', label: 'Calendar', icon: <CalendarIcon size={20} /> },
  { 
    id: 'companies', 
    label: 'Companies', 
    icon: <BuildingIcon size={20} />,
    roles: ['super_admin'],
  },
  { 
    id: 'settings', 
    label: 'Settings', 
    icon: <SettingsIcon size={20} />,
    children: [
      { id: 'general-settings', label: 'General' },
      { id: 'monitoring-settings', label: 'Monitoring', roles: ['super_admin', 'company_admin'] },
      { id: 'security-settings', label: 'Security', roles: ['super_admin', 'company_admin'] },
    ]
  },
];

const Sidebar: React.FC<SidebarProps> = ({ currentView, setCurrentView, userRole, isOpen }) => {
  const [expandedItems, setExpandedItems] = useState<string[]>(['monitoring', 'time-attendance']);

  const toggleExpand = (itemId: string) => {
    setExpandedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const canAccess = (roles?: UserRole[]) => {
    if (!roles) return true;
    return roles.includes(userRole);
  };

  const filteredNavItems = navItems.filter(item => canAccess(item.roles));

  return (
    <aside 
      className={`fixed left-0 top-0 h-full bg-slate-900 text-white transition-all duration-300 z-40 ${
        isOpen ? 'w-64' : 'w-0 lg:w-20'
      } overflow-hidden`}
    >
      <div className="flex flex-col h-full">
        {/* Logo */}
        <div className="h-16 flex items-center px-4 border-b border-slate-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
              <ShieldIcon size={24} className="text-white" />
            </div>
            <span className={`font-bold text-lg ${isOpen ? 'block' : 'hidden lg:hidden'}`}>
              WorkPulse
            </span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-2">
          {filteredNavItems.map(item => {
            const hasChildren = item.children && item.children.length > 0;
            const isExpanded = expandedItems.includes(item.id);
            const isActive = currentView === item.id || 
              (item.children?.some(child => currentView === child.id));

            return (
              <div key={item.id} className="mb-1">
                <button
                  onClick={() => {
                    if (hasChildren) {
                      toggleExpand(item.id);
                    } else {
                      setCurrentView(item.id);
                    }
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                    isActive 
                      ? 'bg-indigo-600 text-white' 
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <span className="flex-shrink-0">{item.icon}</span>
                  <span className={`flex-1 text-left text-sm font-medium ${isOpen ? 'block' : 'hidden lg:hidden'}`}>
                    {item.label}
                  </span>
                  {hasChildren && isOpen && (
                    <span className="flex-shrink-0">
                      {isExpanded ? <ChevronDownIcon size={16} /> : <ChevronRightIcon size={16} />}
                    </span>
                  )}
                </button>

                {/* Children */}
                {hasChildren && isExpanded && isOpen && (
                  <div className="ml-4 mt-1 space-y-1">
                    {item.children?.filter(child => canAccess(child.roles)).map(child => (
                      <button
                        key={child.id}
                        onClick={() => setCurrentView(child.id)}
                        className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                          currentView === child.id
                            ? 'bg-indigo-500/20 text-indigo-300'
                            : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                        }`}
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-current" />
                        {child.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-slate-700">
          <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition-colors">
            <LogOutIcon size={20} />
            <span className={`text-sm font-medium ${isOpen ? 'block' : 'hidden lg:hidden'}`}>
              Sign Out
            </span>
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
