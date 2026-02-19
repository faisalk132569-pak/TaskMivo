import React, { useState } from 'react';
import { useAppContext } from '@/contexts/AppContext';
import { useIsMobile } from '@/hooks/use-mobile';
import { UserRole, User, TimeEntry } from '@/types';
import { 
  mockUsers, mockDevices, mockScreenshots, mockProjects, 
  mockTasks, mockKPIs, mockTimeEntries, generateProductivityScores,
  mockAppUsage, mockWebsiteVisits, mockChatMessages, mockSkills, mockRanks, mockCompany
} from '@/data/mockData';

// Layout components
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';

// View components
import DashboardView from '@/components/views/DashboardView';
import LiveView from '@/components/monitoring/LiveView';
import ScreenshotGallery from '@/components/monitoring/ScreenshotGallery';
import ActivityTimeline from '@/components/monitoring/ActivityTimeline';
import TimeClock from '@/components/time/TimeClock';
import AttendanceCalendar from '@/components/time/AttendanceCalendar';
import EmployeeList from '@/components/employees/EmployeeList';
import ProjectBoard from '@/components/projects/ProjectBoard';
import KPIDashboard from '@/components/kpi/KPIDashboard';
import ChatInbox from '@/components/messages/ChatInbox';
import SkillsRankings from '@/components/skills/SkillsRankings';
import SettingsPage from '@/components/settings/SettingsPage';


const AppLayout: React.FC = () => {
  const { sidebarOpen, toggleSidebar } = useAppContext();
  const isMobile = useIsMobile();

  // State
  const [currentView, setCurrentView] = useState('dashboard');
  const [userRole, setUserRole] = useState<UserRole>('company_admin');
  const [currentTimeEntry, setCurrentTimeEntry] = useState<TimeEntry | undefined>(
    mockTimeEntries.find(t => t.user_id === 'user-002')
  );

  // Get current user based on role
  const currentUser: User = userRole === 'company_admin' 
    ? mockUsers[0] 
    : mockUsers[1];

  // Generate productivity scores
  const productivityScores = generateProductivityScores(currentUser.id);

  // Handlers
  const handleViewEmployee = (userId: string) => {
    console.log('View employee:', userId);
    setCurrentView('employee-detail');
  };

  const handleClockIn = () => {
    setCurrentTimeEntry({
      id: 'new-entry',
      user_id: currentUser.id,
      clock_in: new Date().toISOString(),
      scheduled_start: new Date(new Date().setHours(8, 0, 0, 0)).toISOString(),
      scheduled_end: new Date(new Date().setHours(17, 0, 0, 0)).toISOString(),
      late_minutes: 0,
      overtime_minutes: 0,
      total_break_minutes: 0,
      total_active_minutes: 0,
      status: 'active'
    });
  };

  const handleClockOut = () => {
    if (currentTimeEntry) {
      setCurrentTimeEntry({
        ...currentTimeEntry,
        clock_out: new Date().toISOString(),
        status: 'completed'
      });
    }
  };

  const handleStartBreak = (type: 'lunch' | 'short' | 'personal') => {
    console.log('Start break:', type);
  };

  const handleEndBreak = () => {
    console.log('End break');
  };

  const handleAddEmployee = () => {
    console.log('Add employee');
  };

  // Render current view
  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return (
          <DashboardView
            users={mockUsers}
            devices={mockDevices}
            screenshots={mockScreenshots}
            productivityScores={productivityScores}
            currentUser={currentUser}
            onViewEmployee={handleViewEmployee}
          />
        );
      
      case 'live-view':
        return (
          <LiveView
            employees={mockUsers.filter(u => u.role === 'employee')}
            devices={mockDevices}
          />
        );
      
      case 'screenshots':
        return (
          <ScreenshotGallery
            screenshots={mockScreenshots}
            users={mockUsers}
          />
        );
      
      case 'activity-timeline':
      case 'app-usage':
      case 'web-usage':
        return (
          <ActivityTimeline
            users={mockUsers}
            appUsage={mockAppUsage}
            websiteVisits={mockWebsiteVisits}
          />
        );
      
      case 'time-clock':
        return (
          <TimeClock
            user={currentUser}
            currentEntry={currentTimeEntry}
            onClockIn={handleClockIn}
            onClockOut={handleClockOut}
            onStartBreak={handleStartBreak}
            onEndBreak={handleEndBreak}
          />
        );
      
      case 'attendance-calendar':
        return (
          <AttendanceCalendar
            user={currentUser}
            timeEntries={mockTimeEntries}
          />
        );
      
      case 'employee-list':
        return (
          <EmployeeList
            employees={mockUsers}
            devices={mockDevices}
            onViewEmployee={handleViewEmployee}
            onAddEmployee={handleAddEmployee}
          />
        );
      
      case 'project-list':
      case 'task-board':
      case 'my-tasks':
        return (
          <ProjectBoard
            projects={mockProjects}
            tasks={mockTasks}
            users={mockUsers}
          />
        );
      
      case 'kpi-dashboard':
        return (
          <KPIDashboard
            kpis={mockKPIs}
            users={mockUsers}
            isAdmin={userRole === 'company_admin' || userRole === 'super_admin'}
          />
        );
      case 'messages':
        return (
          <ChatInbox
            messages={mockChatMessages}
            users={mockUsers}
            currentUser={currentUser}
          />
        );
      
      case 'skills-overview':
      case 'rankings':
        return (
          <SkillsRankings
            skills={mockSkills}
            ranks={mockRanks}
            users={mockUsers}
            currentUser={currentUser}
            isAdmin={userRole === 'company_admin' || userRole === 'super_admin'}
          />
        );
      
      case 'general-settings':
      case 'monitoring-settings':
      case 'security-settings':
        return (
          <SettingsPage
            user={currentUser}
            company={mockCompany}
            isAdmin={userRole === 'company_admin' || userRole === 'super_admin'}
          />
        );
      
      default:
        return (
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-12 text-center">
            <h2 className="text-xl font-semibold text-slate-800 mb-2">
              {currentView.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
            </h2>
            <p className="text-slate-500">This view is under development</p>
          </div>
        );
    }
  };


  return (
    <div className="min-h-screen bg-slate-50">
      {/* Sidebar */}
      <Sidebar
        currentView={currentView}
        setCurrentView={setCurrentView}
        userRole={userRole}
        isOpen={sidebarOpen}
      />

      {/* Header */}
      <Header
        user={currentUser}
        toggleSidebar={toggleSidebar}
        sidebarOpen={sidebarOpen}
      />

      {/* Main Content */}
      <main className={`pt-16 transition-all duration-300 ${
        sidebarOpen ? 'ml-64' : 'ml-0 lg:ml-20'
      }`}>
        <div className="p-4 lg:p-6">
          {/* Role Switcher (for demo purposes) */}
          <div className="mb-6 bg-white rounded-xl shadow-sm border border-slate-100 p-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-semibold text-slate-800">Demo Mode</h3>
                <p className="text-sm text-slate-500">Switch between user roles to see different views</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-500">Current Role:</span>
                <select
                  value={userRole}
                  onChange={(e) => setUserRole(e.target.value as UserRole)}
                  className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm font-medium text-slate-700 outline-none focus:border-indigo-500"
                >
                  <option value="super_admin">Super Admin (Hidden)</option>
                  <option value="company_admin">Company Admin</option>
                  <option value="manager">Manager</option>
                  <option value="employee">Employee</option>
                </select>
              </div>
            </div>
          </div>

          {/* Current View */}
          {renderView()}
        </div>
      </main>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && isMobile && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={toggleSidebar}
        />
      )}
    </div>
  );
};

export default AppLayout;
