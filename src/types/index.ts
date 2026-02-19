// User roles
export type UserRole = 'super_admin' | 'company_admin' | 'manager' | 'employee';

// User interface
export interface User {
  id: string;
  company_id: string;
  email: string;
  first_name: string;
  last_name: string;
  avatar_url?: string;
  role: UserRole;
  department?: string;
  job_title?: string;
  timezone: string;
  is_active: boolean;
  last_login_at?: string;
  created_at: string;
}

// Company interface
export interface Company {
  id: string;
  name: string;
  slug: string;
  logo_url?: string;
  timezone: string;
  settings: Record<string, any>;
  subscription_tier: string;
  max_employees: number;
  is_active: boolean;
  created_at: string;
}

// Agent device
export interface AgentDevice {
  id: string;
  user_id: string;
  device_name: string;
  device_id: string;
  os_version?: string;
  agent_version?: string;
  last_seen_at?: string;
  is_online: boolean;
  ip_address?: string;
}

// Activity log
export interface ActivityLog {
  id: string;
  user_id: string;
  device_id: string;
  timestamp: string;
  keyboard_count: number;
  mouse_clicks: number;
  mouse_movement: number;
  scroll_count: number;
  idle_seconds: number;
  active_seconds: number;
  activity_percentage: number;
}

// App usage
export interface AppUsage {
  id: string;
  user_id: string;
  app_name: string;
  executable_path?: string;
  window_title?: string;
  category?: string;
  is_productive?: boolean;
  duration_seconds: number;
  started_at: string;
  ended_at?: string;
}

// Website visit
export interface WebsiteVisit {
  id: string;
  user_id: string;
  url: string;
  domain: string;
  page_title?: string;
  category?: string;
  is_productive?: boolean;
  duration_seconds: number;
  visited_at: string;
}

// Screenshot
export interface Screenshot {
  id: string;
  user_id: string;
  storage_url: string;
  thumbnail_url?: string;
  file_size?: number;
  width?: number;
  height?: number;
  trigger_type: 'random' | 'admin_triggered' | 'scheduled';
  active_window?: string;
  active_app?: string;
  ocr_text?: string;
  captured_at: string;
}

// Time entry
export interface TimeEntry {
  id: string;
  user_id: string;
  clock_in: string;
  clock_out?: string;
  scheduled_start?: string;
  scheduled_end?: string;
  late_minutes: number;
  overtime_minutes: number;
  total_break_minutes: number;
  total_active_minutes: number;
  status: 'active' | 'completed' | 'auto_closed';
  notes?: string;
}

// Break entry
export interface BreakEntry {
  id: string;
  time_entry_id: string;
  user_id: string;
  break_start: string;
  break_end?: string;
  break_type: 'lunch' | 'short' | 'personal';
  duration_minutes: number;
}

// Productivity score
export interface ProductivityScore {
  id: string;
  user_id: string;
  score_date: string;
  overall_score: number;
  keyboard_score: number;
  mouse_score: number;
  app_score: number;
  website_score: number;
  attendance_score: number;
  total_active_hours: number;
  total_idle_hours: number;
  productive_hours: number;
  unproductive_hours: number;
}

// Project
export interface Project {
  id: string;
  company_id: string;
  name: string;
  description?: string;
  status: 'planning' | 'active' | 'on_hold' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'critical';
  start_date?: string;
  due_date?: string;
  budget_hours?: number;
  actual_hours: number;
  created_by: string;
  created_at: string;
}

// Task
export interface Task {
  id: string;
  project_id: string;
  assigned_to?: string;
  title: string;
  description?: string;
  status: 'todo' | 'in_progress' | 'review' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'critical';
  estimated_hours?: number;
  actual_hours: number;
  due_date?: string;
  completed_at?: string;
}

// KPI
export interface KPI {
  id: string;
  company_id: string;
  name: string;
  description?: string;
  category: 'productivity' | 'attendance' | 'quality' | 'teamwork' | 'custom';
  kpi_type: 'positive' | 'negative';
  weight: number;
  target_value?: number;
  is_active: boolean;
}

// KPI Score
export interface KPIScore {
  id: string;
  kpi_id: string;
  user_id: string;
  score_date: string;
  score_value: number;
  notes?: string;
  scored_by: string;
}

// Skill
export interface Skill {
  id: string;
  company_id: string;
  name: string;
  category?: string;
  description?: string;
}

// Employee skill
export interface EmployeeSkill {
  id: string;
  user_id: string;
  skill_id: string;
  proficiency_level: number;
  verified_by?: string;
  verified_at?: string;
}

// Rank
export interface Rank {
  id: string;
  company_id: string;
  name: string;
  level: number;
  min_score?: number;
  badge_url?: string;
  color?: string;
}

// Chat message
export interface ChatMessage {
  id: string;
  company_id: string;
  sender_id: string;
  recipient_id: string;
  message: string;
  is_read: boolean;
  read_at?: string;
  created_at: string;
}

// Dashboard stats
export interface DashboardStats {
  totalEmployees: number;
  activeNow: number;
  avgProductivity: number;
  totalHoursToday: number;
  onTimeRate: number;
  screenshotsToday: number;
}

// Navigation item
export interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  path?: string;
  children?: NavItem[];
  roles?: UserRole[];
}
