import React, { useState } from 'react';
import { User, Company } from '@/types';
import { 
  SettingsIcon, ShieldIcon, MonitorIcon, BellIcon,
  UsersIcon, ClockIcon, ImageIcon, SaveIcon
} from '@/components/icons/Icons';

// Custom SaveIcon
const SaveIconCustom: React.FC<{ size?: number; className?: string }> = ({ size = 24, className = '' }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
    <polyline points="17 21 17 13 7 13 7 21" />
    <polyline points="7 3 7 8 15 8" />
  </svg>
);

interface SettingsPageProps {
  user: User;
  company: Company;
  isAdmin?: boolean;
}

const SettingsPage: React.FC<SettingsPageProps> = ({ user, company, isAdmin = false }) => {
  const [activeSection, setActiveSection] = useState('general');
  const [settings, setSettings] = useState({
    // General
    companyName: company.name,
    timezone: company.timezone,
    dateFormat: 'MM/DD/YYYY',
    language: 'en',
    
    // Monitoring
    screenshotInterval: 10,
    screenshotQuality: 'medium',
    blurScreenshots: false,
    captureActiveWindow: true,
    idleThreshold: 300,
    trackWebsites: true,
    trackApplications: true,
    
    // Security
    requireMFA: false,
    sessionTimeout: 30,
    ipWhitelist: '',
    auditLogging: true,
    
    // Notifications
    emailNotifications: true,
    lateArrivalAlerts: true,
    lowActivityAlerts: true,
    dailyReports: true,
    weeklyReports: true
  });

  const sections = [
    { id: 'general', label: 'General', icon: <SettingsIcon size={20} /> },
    { id: 'monitoring', label: 'Monitoring', icon: <MonitorIcon size={20} />, adminOnly: true },
    { id: 'security', label: 'Security', icon: <ShieldIcon size={20} />, adminOnly: true },
    { id: 'notifications', label: 'Notifications', icon: <BellIcon size={20} /> },
  ];

  const handleSave = () => {
    console.log('Saving settings:', settings);
    // In a real app, this would save to the backend
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Settings</h2>
          <p className="text-slate-500">Manage your account and company settings</p>
        </div>
        
        <button
          onClick={handleSave}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
        >
          <SaveIconCustom size={20} />
          Save Changes
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar */}
        <div className="lg:w-64 flex-shrink-0">
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
            <nav className="p-2">
              {sections
                .filter(s => !s.adminOnly || isAdmin)
                .map(section => (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                      activeSection === section.id
                        ? 'bg-indigo-50 text-indigo-600'
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {section.icon}
                    <span className="font-medium">{section.label}</span>
                  </button>
                ))}
            </nav>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 bg-white rounded-xl shadow-sm border border-slate-100 p-6">
          {activeSection === 'general' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-slate-800">General Settings</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Company Name
                  </label>
                  <input
                    type="text"
                    value={settings.companyName}
                    onChange={(e) => setSettings({ ...settings, companyName: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg outline-none focus:border-indigo-500"
                    disabled={!isAdmin}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Timezone
                  </label>
                  <select
                    value={settings.timezone}
                    onChange={(e) => setSettings({ ...settings, timezone: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg outline-none focus:border-indigo-500"
                  >
                    <option value="America/New_York">Eastern Time (ET)</option>
                    <option value="America/Chicago">Central Time (CT)</option>
                    <option value="America/Denver">Mountain Time (MT)</option>
                    <option value="America/Los_Angeles">Pacific Time (PT)</option>
                    <option value="UTC">UTC</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Date Format
                  </label>
                  <select
                    value={settings.dateFormat}
                    onChange={(e) => setSettings({ ...settings, dateFormat: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg outline-none focus:border-indigo-500"
                  >
                    <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                    <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                    <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Language
                  </label>
                  <select
                    value={settings.language}
                    onChange={(e) => setSettings({ ...settings, language: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg outline-none focus:border-indigo-500"
                  >
                    <option value="en">English</option>
                    <option value="es">Spanish</option>
                    <option value="fr">French</option>
                    <option value="de">German</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'monitoring' && isAdmin && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-slate-800">Monitoring Settings</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Screenshot Interval (minutes)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="60"
                    value={settings.screenshotInterval}
                    onChange={(e) => setSettings({ ...settings, screenshotInterval: parseInt(e.target.value) })}
                    className="w-full max-w-xs px-4 py-2 border border-slate-200 rounded-lg outline-none focus:border-indigo-500"
                  />
                  <p className="text-sm text-slate-500 mt-1">
                    How often to capture random screenshots (1-60 minutes)
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Screenshot Quality
                  </label>
                  <select
                    value={settings.screenshotQuality}
                    onChange={(e) => setSettings({ ...settings, screenshotQuality: e.target.value })}
                    className="w-full max-w-xs px-4 py-2 border border-slate-200 rounded-lg outline-none focus:border-indigo-500"
                  >
                    <option value="low">Low (faster upload)</option>
                    <option value="medium">Medium (balanced)</option>
                    <option value="high">High (best quality)</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Idle Threshold (seconds)
                  </label>
                  <input
                    type="number"
                    min="60"
                    max="900"
                    value={settings.idleThreshold}
                    onChange={(e) => setSettings({ ...settings, idleThreshold: parseInt(e.target.value) })}
                    className="w-full max-w-xs px-4 py-2 border border-slate-200 rounded-lg outline-none focus:border-indigo-500"
                  />
                  <p className="text-sm text-slate-500 mt-1">
                    Time without activity before marking as idle
                  </p>
                </div>
                
                <div className="space-y-3 pt-4 border-t border-slate-100">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.blurScreenshots}
                      onChange={(e) => setSettings({ ...settings, blurScreenshots: e.target.checked })}
                      className="w-5 h-5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <div>
                      <p className="font-medium text-slate-700">Blur Screenshots</p>
                      <p className="text-sm text-slate-500">Apply blur to captured screenshots for privacy</p>
                    </div>
                  </label>
                  
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.captureActiveWindow}
                      onChange={(e) => setSettings({ ...settings, captureActiveWindow: e.target.checked })}
                      className="w-5 h-5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <div>
                      <p className="font-medium text-slate-700">Capture Active Window Only</p>
                      <p className="text-sm text-slate-500">Only capture the active window instead of full screen</p>
                    </div>
                  </label>
                  
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.trackWebsites}
                      onChange={(e) => setSettings({ ...settings, trackWebsites: e.target.checked })}
                      className="w-5 h-5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <div>
                      <p className="font-medium text-slate-700">Track Website Usage</p>
                      <p className="text-sm text-slate-500">Monitor websites visited in browsers</p>
                    </div>
                  </label>
                  
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.trackApplications}
                      onChange={(e) => setSettings({ ...settings, trackApplications: e.target.checked })}
                      className="w-5 h-5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <div>
                      <p className="font-medium text-slate-700">Track Application Usage</p>
                      <p className="text-sm text-slate-500">Monitor applications used during work hours</p>
                    </div>
                  </label>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'security' && isAdmin && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-slate-800">Security Settings</h3>
              
              <div className="space-y-4">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.requireMFA}
                    onChange={(e) => setSettings({ ...settings, requireMFA: e.target.checked })}
                    className="w-5 h-5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <div>
                    <p className="font-medium text-slate-700">Require Multi-Factor Authentication</p>
                    <p className="text-sm text-slate-500">All users must enable MFA to access the system</p>
                  </div>
                </label>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Session Timeout (minutes)
                  </label>
                  <input
                    type="number"
                    min="5"
                    max="480"
                    value={settings.sessionTimeout}
                    onChange={(e) => setSettings({ ...settings, sessionTimeout: parseInt(e.target.value) })}
                    className="w-full max-w-xs px-4 py-2 border border-slate-200 rounded-lg outline-none focus:border-indigo-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    IP Whitelist
                  </label>
                  <textarea
                    value={settings.ipWhitelist}
                    onChange={(e) => setSettings({ ...settings, ipWhitelist: e.target.value })}
                    placeholder="Enter IP addresses, one per line"
                    rows={4}
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg outline-none focus:border-indigo-500"
                  />
                  <p className="text-sm text-slate-500 mt-1">
                    Leave empty to allow all IPs
                  </p>
                </div>
                
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.auditLogging}
                    onChange={(e) => setSettings({ ...settings, auditLogging: e.target.checked })}
                    className="w-5 h-5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <div>
                    <p className="font-medium text-slate-700">Enable Audit Logging</p>
                    <p className="text-sm text-slate-500">Log all administrative actions for compliance</p>
                  </div>
                </label>
              </div>
            </div>
          )}

          {activeSection === 'notifications' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-slate-800">Notification Settings</h3>
              
              <div className="space-y-4">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.emailNotifications}
                    onChange={(e) => setSettings({ ...settings, emailNotifications: e.target.checked })}
                    className="w-5 h-5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <div>
                    <p className="font-medium text-slate-700">Email Notifications</p>
                    <p className="text-sm text-slate-500">Receive notifications via email</p>
                  </div>
                </label>
                
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.lateArrivalAlerts}
                    onChange={(e) => setSettings({ ...settings, lateArrivalAlerts: e.target.checked })}
                    className="w-5 h-5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <div>
                    <p className="font-medium text-slate-700">Late Arrival Alerts</p>
                    <p className="text-sm text-slate-500">Get notified when employees arrive late</p>
                  </div>
                </label>
                
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.lowActivityAlerts}
                    onChange={(e) => setSettings({ ...settings, lowActivityAlerts: e.target.checked })}
                    className="w-5 h-5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <div>
                    <p className="font-medium text-slate-700">Low Activity Alerts</p>
                    <p className="text-sm text-slate-500">Get notified when activity drops below threshold</p>
                  </div>
                </label>
                
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.dailyReports}
                    onChange={(e) => setSettings({ ...settings, dailyReports: e.target.checked })}
                    className="w-5 h-5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <div>
                    <p className="font-medium text-slate-700">Daily Reports</p>
                    <p className="text-sm text-slate-500">Receive daily summary reports</p>
                  </div>
                </label>
                
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.weeklyReports}
                    onChange={(e) => setSettings({ ...settings, weeklyReports: e.target.checked })}
                    className="w-5 h-5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <div>
                    <p className="font-medium text-slate-700">Weekly Reports</p>
                    <p className="text-sm text-slate-500">Receive weekly summary reports</p>
                  </div>
                </label>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
