import { User, Company, AgentDevice, ActivityLog, AppUsage, WebsiteVisit, Screenshot, TimeEntry, ProductivityScore, Project, Task, KPI, Skill, Rank, ChatMessage } from '@/types';

// Mock company
export const mockCompany: Company = {
  id: 'comp-001',
  name: 'TechCorp Solutions',
  slug: 'techcorp',
  logo_url: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=100&h=100&fit=crop',
  timezone: 'America/New_York',
  settings: { screenshot_interval: 10, idle_threshold: 300 },
  subscription_tier: 'enterprise',
  max_employees: 500,
  is_active: true,
  created_at: '2024-01-01T00:00:00Z'
};

// Mock users
export const mockUsers: User[] = [
  {
    id: 'user-001',
    company_id: 'comp-001',
    email: 'admin@techcorp.com',
    first_name: 'Sarah',
    last_name: 'Johnson',
    avatar_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop',
    role: 'company_admin',
    department: 'Management',
    job_title: 'Operations Director',
    timezone: 'America/New_York',
    is_active: true,
    last_login_at: '2026-01-31T09:30:00Z',
    created_at: '2024-01-15T00:00:00Z'
  },
  {
    id: 'user-002',
    company_id: 'comp-001',
    email: 'john.smith@techcorp.com',
    first_name: 'John',
    last_name: 'Smith',
    avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop',
    role: 'employee',
    department: 'Engineering',
    job_title: 'Senior Developer',
    timezone: 'America/New_York',
    is_active: true,
    last_login_at: '2026-01-31T08:45:00Z',
    created_at: '2024-02-01T00:00:00Z'
  },
  {
    id: 'user-003',
    company_id: 'comp-001',
    email: 'emily.chen@techcorp.com',
    first_name: 'Emily',
    last_name: 'Chen',
    avatar_url: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop',
    role: 'employee',
    department: 'Design',
    job_title: 'UI/UX Designer',
    timezone: 'America/New_York',
    is_active: true,
    last_login_at: '2026-01-31T09:00:00Z',
    created_at: '2024-02-15T00:00:00Z'
  },
  {
    id: 'user-004',
    company_id: 'comp-001',
    email: 'michael.brown@techcorp.com',
    first_name: 'Michael',
    last_name: 'Brown',
    avatar_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop',
    role: 'manager',
    department: 'Engineering',
    job_title: 'Engineering Manager',
    timezone: 'America/New_York',
    is_active: true,
    last_login_at: '2026-01-31T08:30:00Z',
    created_at: '2024-01-20T00:00:00Z'
  },
  {
    id: 'user-005',
    company_id: 'comp-001',
    email: 'lisa.wang@techcorp.com',
    first_name: 'Lisa',
    last_name: 'Wang',
    avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop',
    role: 'employee',
    department: 'Marketing',
    job_title: 'Marketing Specialist',
    timezone: 'America/New_York',
    is_active: true,
    last_login_at: '2026-01-31T09:15:00Z',
    created_at: '2024-03-01T00:00:00Z'
  },
  {
    id: 'user-006',
    company_id: 'comp-001',
    email: 'david.miller@techcorp.com',
    first_name: 'David',
    last_name: 'Miller',
    avatar_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop',
    role: 'employee',
    department: 'Engineering',
    job_title: 'Backend Developer',
    timezone: 'America/New_York',
    is_active: true,
    last_login_at: '2026-01-31T08:50:00Z',
    created_at: '2024-03-15T00:00:00Z'
  },
  {
    id: 'user-007',
    company_id: 'comp-001',
    email: 'amanda.taylor@techcorp.com',
    first_name: 'Amanda',
    last_name: 'Taylor',
    avatar_url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop',
    role: 'employee',
    department: 'HR',
    job_title: 'HR Coordinator',
    timezone: 'America/New_York',
    is_active: true,
    last_login_at: '2026-01-31T09:05:00Z',
    created_at: '2024-04-01T00:00:00Z'
  },
  {
    id: 'user-008',
    company_id: 'comp-001',
    email: 'james.wilson@techcorp.com',
    first_name: 'James',
    last_name: 'Wilson',
    avatar_url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop',
    role: 'employee',
    department: 'Sales',
    job_title: 'Sales Representative',
    timezone: 'America/New_York',
    is_active: true,
    last_login_at: '2026-01-31T08:40:00Z',
    created_at: '2024-04-15T00:00:00Z'
  }
];

// Mock agent devices
export const mockDevices: AgentDevice[] = mockUsers.filter(u => u.role !== 'company_admin').map((user, i) => ({
  id: `device-${i + 1}`,
  user_id: user.id,
  device_name: `${user.first_name}'s Workstation`,
  device_id: `WIN-${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
  os_version: 'Windows 11 Pro 23H2',
  agent_version: '2.4.1',
  last_seen_at: new Date(Date.now() - Math.random() * 600000).toISOString(),
  is_online: Math.random() > 0.2,
  ip_address: `192.168.1.${100 + i}`
}));

// Generate activity logs for the past 8 hours
export const generateActivityLogs = (userId: string): ActivityLog[] => {
  const logs: ActivityLog[] = [];
  const now = new Date();
  for (let i = 0; i < 480; i++) { // 8 hours * 60 minutes
    const timestamp = new Date(now.getTime() - (480 - i) * 60000);
    const activity = Math.random();
    logs.push({
      id: `log-${userId}-${i}`,
      user_id: userId,
      device_id: mockDevices.find(d => d.user_id === userId)?.id || '',
      timestamp: timestamp.toISOString(),
      keyboard_count: Math.floor(activity * 200),
      mouse_clicks: Math.floor(activity * 50),
      mouse_movement: Math.floor(activity * 5000),
      scroll_count: Math.floor(activity * 30),
      idle_seconds: Math.floor((1 - activity) * 60),
      active_seconds: Math.floor(activity * 60),
      activity_percentage: Math.round(activity * 100)
    });
  }
  return logs;
};

// Mock app usage
export const mockAppUsage: AppUsage[] = [
  { id: 'app-1', user_id: 'user-002', app_name: 'Visual Studio Code', executable_path: 'C:\\Program Files\\VSCode\\code.exe', window_title: 'index.tsx - project', category: 'Development', is_productive: true, duration_seconds: 7200, started_at: '2026-01-31T08:00:00Z' },
  { id: 'app-2', user_id: 'user-002', app_name: 'Chrome', executable_path: 'C:\\Program Files\\Google\\Chrome\\chrome.exe', window_title: 'Stack Overflow', category: 'Browser', is_productive: true, duration_seconds: 1800, started_at: '2026-01-31T08:30:00Z' },
  { id: 'app-3', user_id: 'user-003', app_name: 'Figma', executable_path: 'C:\\Users\\Emily\\AppData\\Local\\Figma\\Figma.exe', window_title: 'Dashboard Design', category: 'Design', is_productive: true, duration_seconds: 5400, started_at: '2026-01-31T08:15:00Z' },
  { id: 'app-4', user_id: 'user-003', app_name: 'Slack', executable_path: 'C:\\Users\\Emily\\AppData\\Local\\slack\\slack.exe', window_title: 'Design Team', category: 'Communication', is_productive: true, duration_seconds: 900, started_at: '2026-01-31T09:00:00Z' },
  { id: 'app-5', user_id: 'user-005', app_name: 'Microsoft Excel', executable_path: 'C:\\Program Files\\Microsoft Office\\EXCEL.EXE', window_title: 'Q1 Marketing Report.xlsx', category: 'Office', is_productive: true, duration_seconds: 3600, started_at: '2026-01-31T08:00:00Z' },
  { id: 'app-6', user_id: 'user-006', app_name: 'IntelliJ IDEA', executable_path: 'C:\\Program Files\\JetBrains\\idea64.exe', window_title: 'ApiController.java', category: 'Development', is_productive: true, duration_seconds: 6300, started_at: '2026-01-31T08:00:00Z' },
  { id: 'app-7', user_id: 'user-008', app_name: 'Salesforce', executable_path: 'C:\\Program Files\\Google\\Chrome\\chrome.exe', window_title: 'Salesforce - Leads', category: 'CRM', is_productive: true, duration_seconds: 4500, started_at: '2026-01-31T08:30:00Z' },
];

// Mock website visits
export const mockWebsiteVisits: WebsiteVisit[] = [
  { id: 'web-1', user_id: 'user-002', url: 'https://stackoverflow.com/questions/12345', domain: 'stackoverflow.com', page_title: 'How to optimize React performance', category: 'Development', is_productive: true, duration_seconds: 600, visited_at: '2026-01-31T08:45:00Z' },
  { id: 'web-2', user_id: 'user-002', url: 'https://github.com/techcorp/project', domain: 'github.com', page_title: 'TechCorp Project Repository', category: 'Development', is_productive: true, duration_seconds: 1200, visited_at: '2026-01-31T09:00:00Z' },
  { id: 'web-3', user_id: 'user-003', url: 'https://dribbble.com/shots/popular', domain: 'dribbble.com', page_title: 'Popular Designs', category: 'Design', is_productive: true, duration_seconds: 900, visited_at: '2026-01-31T09:15:00Z' },
  { id: 'web-4', user_id: 'user-005', url: 'https://analytics.google.com', domain: 'analytics.google.com', page_title: 'Google Analytics', category: 'Marketing', is_productive: true, duration_seconds: 1800, visited_at: '2026-01-31T08:30:00Z' },
  { id: 'web-5', user_id: 'user-008', url: 'https://linkedin.com/sales', domain: 'linkedin.com', page_title: 'LinkedIn Sales Navigator', category: 'Sales', is_productive: true, duration_seconds: 2400, visited_at: '2026-01-31T08:45:00Z' },
];

// Mock screenshots
export const mockScreenshots: Screenshot[] = [
  { id: 'ss-1', user_id: 'user-002', storage_url: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=1920&h=1080&fit=crop', thumbnail_url: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=300&h=200&fit=crop', file_size: 145000, width: 1920, height: 1080, trigger_type: 'random', active_window: 'Visual Studio Code', active_app: 'code.exe', captured_at: '2026-01-31T08:15:00Z' },
  { id: 'ss-2', user_id: 'user-002', storage_url: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1920&h=1080&fit=crop', thumbnail_url: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=300&h=200&fit=crop', file_size: 132000, width: 1920, height: 1080, trigger_type: 'random', active_window: 'Chrome - GitHub', active_app: 'chrome.exe', captured_at: '2026-01-31T08:45:00Z' },
  { id: 'ss-3', user_id: 'user-003', storage_url: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=1920&h=1080&fit=crop', thumbnail_url: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=300&h=200&fit=crop', file_size: 148000, width: 1920, height: 1080, trigger_type: 'random', active_window: 'Figma', active_app: 'Figma.exe', captured_at: '2026-01-31T09:00:00Z' },
  { id: 'ss-4', user_id: 'user-005', storage_url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1920&h=1080&fit=crop', thumbnail_url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=300&h=200&fit=crop', file_size: 128000, width: 1920, height: 1080, trigger_type: 'random', active_window: 'Google Analytics', active_app: 'chrome.exe', captured_at: '2026-01-31T09:15:00Z' },
  { id: 'ss-5', user_id: 'user-006', storage_url: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1920&h=1080&fit=crop', thumbnail_url: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=300&h=200&fit=crop', file_size: 141000, width: 1920, height: 1080, trigger_type: 'random', active_window: 'IntelliJ IDEA', active_app: 'idea64.exe', captured_at: '2026-01-31T08:30:00Z' },
  { id: 'ss-6', user_id: 'user-008', storage_url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1920&h=1080&fit=crop', thumbnail_url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=300&h=200&fit=crop', file_size: 135000, width: 1920, height: 1080, trigger_type: 'random', active_window: 'Salesforce', active_app: 'chrome.exe', captured_at: '2026-01-31T09:30:00Z' },
];

// Mock time entries
export const mockTimeEntries: TimeEntry[] = mockUsers.filter(u => u.role !== 'company_admin').map((user, i) => ({
  id: `time-${i + 1}`,
  user_id: user.id,
  clock_in: '2026-01-31T08:00:00Z',
  clock_out: undefined,
  scheduled_start: '2026-01-31T08:00:00Z',
  scheduled_end: '2026-01-31T17:00:00Z',
  late_minutes: Math.floor(Math.random() * 15),
  overtime_minutes: 0,
  total_break_minutes: 30,
  total_active_minutes: Math.floor(Math.random() * 60) + 90,
  status: 'active' as const,
  notes: undefined
}));

// Mock productivity scores (last 30 days)
export const generateProductivityScores = (userId: string): ProductivityScore[] => {
  const scores: ProductivityScore[] = [];
  for (let i = 29; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dayOfWeek = date.getDay();
    if (dayOfWeek === 0 || dayOfWeek === 6) continue; // Skip weekends
    
    const baseScore = 70 + Math.random() * 25;
    scores.push({
      id: `prod-${userId}-${i}`,
      user_id: userId,
      score_date: date.toISOString().split('T')[0],
      overall_score: Math.round(baseScore),
      keyboard_score: Math.round(baseScore + (Math.random() - 0.5) * 10),
      mouse_score: Math.round(baseScore + (Math.random() - 0.5) * 10),
      app_score: Math.round(baseScore + (Math.random() - 0.5) * 15),
      website_score: Math.round(baseScore + (Math.random() - 0.5) * 15),
      attendance_score: Math.round(85 + Math.random() * 15),
      total_active_hours: 6 + Math.random() * 2,
      total_idle_hours: 0.5 + Math.random() * 1.5,
      productive_hours: 5 + Math.random() * 2.5,
      unproductive_hours: 0.5 + Math.random() * 1
    });
  }
  return scores;
};

// Mock projects
export const mockProjects: Project[] = [
  { id: 'proj-1', company_id: 'comp-001', name: 'Website Redesign', description: 'Complete overhaul of company website', status: 'active', priority: 'high', start_date: '2026-01-15', due_date: '2026-03-15', budget_hours: 500, actual_hours: 180, created_by: 'user-001', created_at: '2026-01-10T00:00:00Z' },
  { id: 'proj-2', company_id: 'comp-001', name: 'Mobile App Development', description: 'iOS and Android app for customers', status: 'active', priority: 'critical', start_date: '2026-01-01', due_date: '2026-06-30', budget_hours: 2000, actual_hours: 450, created_by: 'user-001', created_at: '2025-12-15T00:00:00Z' },
  { id: 'proj-3', company_id: 'comp-001', name: 'Q1 Marketing Campaign', description: 'Multi-channel marketing initiative', status: 'active', priority: 'high', start_date: '2026-01-01', due_date: '2026-03-31', budget_hours: 300, actual_hours: 120, created_by: 'user-001', created_at: '2025-12-20T00:00:00Z' },
  { id: 'proj-4', company_id: 'comp-001', name: 'API Integration', description: 'Third-party API integrations', status: 'planning', priority: 'medium', start_date: '2026-02-01', due_date: '2026-04-30', budget_hours: 400, actual_hours: 0, created_by: 'user-004', created_at: '2026-01-25T00:00:00Z' },
];

// Mock tasks
export const mockTasks: Task[] = [
  { id: 'task-1', project_id: 'proj-1', assigned_to: 'user-003', title: 'Design homepage mockup', description: 'Create high-fidelity mockup for new homepage', status: 'completed', priority: 'high', estimated_hours: 16, actual_hours: 14, due_date: '2026-01-25', completed_at: '2026-01-24T16:00:00Z' },
  { id: 'task-2', project_id: 'proj-1', assigned_to: 'user-002', title: 'Implement responsive navigation', description: 'Build responsive nav component', status: 'in_progress', priority: 'high', estimated_hours: 8, actual_hours: 4, due_date: '2026-02-01' },
  { id: 'task-3', project_id: 'proj-2', assigned_to: 'user-002', title: 'Setup React Native project', description: 'Initialize project with proper structure', status: 'completed', priority: 'critical', estimated_hours: 4, actual_hours: 3, due_date: '2026-01-10', completed_at: '2026-01-09T12:00:00Z' },
  { id: 'task-4', project_id: 'proj-2', assigned_to: 'user-006', title: 'Build authentication API', description: 'JWT-based auth endpoints', status: 'in_progress', priority: 'critical', estimated_hours: 24, actual_hours: 16, due_date: '2026-02-05' },
  { id: 'task-5', project_id: 'proj-3', assigned_to: 'user-005', title: 'Create social media content calendar', description: 'Plan posts for Q1', status: 'review', priority: 'medium', estimated_hours: 12, actual_hours: 10, due_date: '2026-01-30' },
  { id: 'task-6', project_id: 'proj-1', assigned_to: 'user-003', title: 'Design product page templates', description: 'Create reusable product page designs', status: 'todo', priority: 'medium', estimated_hours: 20, actual_hours: 0, due_date: '2026-02-10' },
];

// Mock KPIs
export const mockKPIs: KPI[] = [
  { id: 'kpi-1', company_id: 'comp-001', name: 'Daily Active Hours', description: 'Minimum 7 hours of active work time', category: 'productivity', kpi_type: 'positive', weight: 1.5, target_value: 7, is_active: true },
  { id: 'kpi-2', company_id: 'comp-001', name: 'On-Time Attendance', description: 'Clock in before scheduled start time', category: 'attendance', kpi_type: 'positive', weight: 1.0, target_value: 100, is_active: true },
  { id: 'kpi-3', company_id: 'comp-001', name: 'Task Completion Rate', description: 'Complete assigned tasks by due date', category: 'productivity', kpi_type: 'positive', weight: 2.0, target_value: 90, is_active: true },
  { id: 'kpi-4', company_id: 'comp-001', name: 'Excessive Idle Time', description: 'More than 2 hours idle per day', category: 'productivity', kpi_type: 'negative', weight: 1.0, target_value: 2, is_active: true },
  { id: 'kpi-5', company_id: 'comp-001', name: 'Unproductive App Usage', description: 'Using non-work apps during work hours', category: 'productivity', kpi_type: 'negative', weight: 0.5, target_value: 30, is_active: true },
];

// Mock skills
export const mockSkills: Skill[] = [
  { id: 'skill-1', company_id: 'comp-001', name: 'React', category: 'Frontend', description: 'React.js development' },
  { id: 'skill-2', company_id: 'comp-001', name: 'Node.js', category: 'Backend', description: 'Node.js development' },
  { id: 'skill-3', company_id: 'comp-001', name: 'UI/UX Design', category: 'Design', description: 'User interface and experience design' },
  { id: 'skill-4', company_id: 'comp-001', name: 'Project Management', category: 'Management', description: 'Project planning and execution' },
  { id: 'skill-5', company_id: 'comp-001', name: 'Data Analysis', category: 'Analytics', description: 'Data analysis and visualization' },
  { id: 'skill-6', company_id: 'comp-001', name: 'Python', category: 'Backend', description: 'Python programming' },
  { id: 'skill-7', company_id: 'comp-001', name: 'SQL', category: 'Database', description: 'SQL and database management' },
  { id: 'skill-8', company_id: 'comp-001', name: 'Communication', category: 'Soft Skills', description: 'Effective communication' },
];

// Mock ranks
export const mockRanks: Rank[] = [
  { id: 'rank-1', company_id: 'comp-001', name: 'Rookie', level: 1, min_score: 0, color: '#9CA3AF' },
  { id: 'rank-2', company_id: 'comp-001', name: 'Rising Star', level: 2, min_score: 60, color: '#10B981' },
  { id: 'rank-3', company_id: 'comp-001', name: 'Performer', level: 3, min_score: 70, color: '#3B82F6' },
  { id: 'rank-4', company_id: 'comp-001', name: 'Expert', level: 4, min_score: 80, color: '#8B5CF6' },
  { id: 'rank-5', company_id: 'comp-001', name: 'Champion', level: 5, min_score: 90, color: '#F59E0B' },
  { id: 'rank-6', company_id: 'comp-001', name: 'Legend', level: 6, min_score: 95, color: '#EF4444' },
];

// Mock chat messages
export const mockChatMessages: ChatMessage[] = [
  { id: 'chat-1', company_id: 'comp-001', sender_id: 'user-001', recipient_id: 'user-002', message: 'Hi John, can you provide an update on the navigation component?', is_read: true, read_at: '2026-01-31T09:00:00Z', created_at: '2026-01-31T08:45:00Z' },
  { id: 'chat-2', company_id: 'comp-001', sender_id: 'user-002', recipient_id: 'user-001', message: 'Sure! I\'m about 50% done. Should be ready by tomorrow.', is_read: true, read_at: '2026-01-31T09:05:00Z', created_at: '2026-01-31T09:02:00Z' },
  { id: 'chat-3', company_id: 'comp-001', sender_id: 'user-004', recipient_id: 'user-006', message: 'David, the auth API looks great. Just a few minor changes needed.', is_read: false, created_at: '2026-01-31T09:30:00Z' },
];

// Dashboard stats
export const getDashboardStats = () => ({
  totalEmployees: mockUsers.filter(u => u.role !== 'company_admin' && u.role !== 'super_admin').length,
  activeNow: mockDevices.filter(d => d.is_online).length,
  avgProductivity: 78,
  totalHoursToday: 42.5,
  onTimeRate: 92,
  screenshotsToday: mockScreenshots.length
});
