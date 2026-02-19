import React, { useState } from 'react';
import { User } from '@/types';
import { 
  MenuIcon, BellIcon, SearchIcon, ChevronDownIcon, 
  SettingsIcon, LogOutIcon 
} from '@/components/icons/Icons';

interface HeaderProps {
  user: User;
  toggleSidebar: () => void;
  sidebarOpen: boolean;
}

const Header: React.FC<HeaderProps> = ({ user, toggleSidebar, sidebarOpen }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const notifications = [
    { id: 1, title: 'New screenshot captured', message: 'John Smith - 2 minutes ago', unread: true },
    { id: 2, title: 'Late arrival detected', message: 'Emily Chen arrived 15 min late', unread: true },
    { id: 3, title: 'Task completed', message: 'Design homepage mockup completed', unread: false },
    { id: 4, title: 'Break exceeded', message: 'David Miller exceeded break time', unread: false },
  ];

  const unreadCount = notifications.filter(n => n.unread).length;

  return (
    <header className={`fixed top-0 right-0 h-16 bg-white border-b border-slate-200 z-30 transition-all duration-300 ${
      sidebarOpen ? 'left-64' : 'left-0 lg:left-20'
    }`}>
      <div className="flex items-center justify-between h-full px-4 lg:px-6">
        {/* Left side */}
        <div className="flex items-center gap-4">
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <MenuIcon size={24} className="text-slate-600" />
          </button>

          {/* Search */}
          <div className="hidden md:flex items-center gap-2 bg-slate-100 rounded-lg px-3 py-2 w-80">
            <SearchIcon size={18} className="text-slate-400" />
            <input
              type="text"
              placeholder="Search employees, projects, tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent border-none outline-none text-sm text-slate-700 placeholder-slate-400 w-full"
            />
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {/* Live indicator */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-green-50 rounded-full">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-xs font-medium text-green-700">12 Online</span>
          </div>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => {
                setShowNotifications(!showNotifications);
                setShowProfile(false);
              }}
              className="relative p-2 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <BellIcon size={22} className="text-slate-600" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden">
                <div className="p-4 border-b border-slate-100">
                  <h3 className="font-semibold text-slate-800">Notifications</h3>
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {notifications.map(notif => (
                    <div
                      key={notif.id}
                      className={`p-4 border-b border-slate-50 hover:bg-slate-50 cursor-pointer ${
                        notif.unread ? 'bg-indigo-50/50' : ''
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        {notif.unread && (
                          <span className="w-2 h-2 bg-indigo-500 rounded-full mt-2 flex-shrink-0" />
                        )}
                        <div className={notif.unread ? '' : 'ml-5'}>
                          <p className="text-sm font-medium text-slate-800">{notif.title}</p>
                          <p className="text-xs text-slate-500 mt-0.5">{notif.message}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="p-3 border-t border-slate-100">
                  <button className="w-full text-center text-sm text-indigo-600 font-medium hover:text-indigo-700">
                    View all notifications
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Profile */}
          <div className="relative">
            <button
              onClick={() => {
                setShowProfile(!showProfile);
                setShowNotifications(false);
              }}
              className="flex items-center gap-3 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <img
                src={user.avatar_url || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop'}
                alt={`${user.first_name} ${user.last_name}`}
                className="w-9 h-9 rounded-full object-cover"
              />
              <div className="hidden lg:block text-left">
                <p className="text-sm font-medium text-slate-800">
                  {user.first_name} {user.last_name}
                </p>
                <p className="text-xs text-slate-500 capitalize">
                  {user.role.replace('_', ' ')}
                </p>
              </div>
              <ChevronDownIcon size={16} className="text-slate-400 hidden lg:block" />
            </button>

            {showProfile && (
              <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden">
                <div className="p-4 border-b border-slate-100">
                  <p className="font-medium text-slate-800">{user.first_name} {user.last_name}</p>
                  <p className="text-sm text-slate-500">{user.email}</p>
                </div>
                <div className="p-2">
                  <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors">
                    <SettingsIcon size={18} />
                    <span className="text-sm">Settings</span>
                  </button>
                  <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-red-600 hover:bg-red-50 transition-colors">
                    <LogOutIcon size={18} />
                    <span className="text-sm">Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
