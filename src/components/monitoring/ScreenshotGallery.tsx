import React, { useState } from 'react';
import { Screenshot, User } from '@/types';
import { 
  CloseIcon, ChevronRightIcon, FilterIcon, 
  DownloadIcon, SearchIcon, CalendarIcon,
  ImageIcon
} from '@/components/icons/Icons';

interface ScreenshotGalleryProps {
  screenshots: Screenshot[];
  users: User[];
}

const ScreenshotGallery: React.FC<ScreenshotGalleryProps> = ({ screenshots, users }) => {
  const [selectedScreenshot, setSelectedScreenshot] = useState<Screenshot | null>(null);
  const [selectedUser, setSelectedUser] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFilter, setDateFilter] = useState('today');

  const getUserName = (userId: string) => {
    const user = users.find(u => u.id === userId);
    return user ? `${user.first_name} ${user.last_name}` : 'Unknown';
  };

  const getUser = (userId: string) => users.find(u => u.id === userId);

  const filteredScreenshots = screenshots.filter(ss => {
    if (selectedUser !== 'all' && ss.user_id !== selectedUser) return false;
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const user = getUser(ss.user_id);
      const userName = user ? `${user.first_name} ${user.last_name}`.toLowerCase() : '';
      const app = (ss.active_app || '').toLowerCase();
      const window = (ss.active_window || '').toLowerCase();
      if (!userName.includes(query) && !app.includes(query) && !window.includes(query)) {
        return false;
      }
    }
    return true;
  });

  const formatDateTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Screenshots</h2>
          <p className="text-slate-500">View and manage captured screenshots</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          {/* Search */}
          <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-3 py-2">
            <SearchIcon size={18} className="text-slate-400" />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent border-none outline-none text-sm text-slate-700 placeholder-slate-400 w-40"
            />
          </div>
          
          {/* User filter */}
          <select
            value={selectedUser}
            onChange={(e) => setSelectedUser(e.target.value)}
            className="bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 outline-none focus:border-indigo-500"
          >
            <option value="all">All Employees</option>
            {users.filter(u => u.role === 'employee').map(user => (
              <option key={user.id} value={user.id}>
                {user.first_name} {user.last_name}
              </option>
            ))}
          </select>
          
          {/* Date filter */}
          <select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 outline-none focus:border-indigo-500"
          >
            <option value="today">Today</option>
            <option value="yesterday">Yesterday</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
          </select>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 border border-slate-100">
          <p className="text-sm text-slate-500">Total Screenshots</p>
          <p className="text-2xl font-bold text-slate-800 mt-1">{filteredScreenshots.length}</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-slate-100">
          <p className="text-sm text-slate-500">Employees Captured</p>
          <p className="text-2xl font-bold text-slate-800 mt-1">
            {new Set(filteredScreenshots.map(s => s.user_id)).size}
          </p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-slate-100">
          <p className="text-sm text-slate-500">Random Captures</p>
          <p className="text-2xl font-bold text-slate-800 mt-1">
            {filteredScreenshots.filter(s => s.trigger_type === 'random').length}
          </p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-slate-100">
          <p className="text-sm text-slate-500">Admin Triggered</p>
          <p className="text-2xl font-bold text-slate-800 mt-1">
            {filteredScreenshots.filter(s => s.trigger_type === 'admin_triggered').length}
          </p>
        </div>
      </div>

      {/* Gallery Grid */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <p className="font-medium text-slate-700">
            {filteredScreenshots.length} screenshots
          </p>
          <button className="flex items-center gap-2 text-sm text-indigo-600 font-medium hover:text-indigo-700">
            <DownloadIcon size={16} />
            Export All
          </button>
        </div>
        
        {filteredScreenshots.length > 0 ? (
          <div className="p-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {filteredScreenshots.map(screenshot => {
              const user = getUser(screenshot.user_id);
              
              return (
                <div
                  key={screenshot.id}
                  className="group cursor-pointer"
                  onClick={() => setSelectedScreenshot(screenshot)}
                >
                  <div className="relative aspect-video rounded-lg overflow-hidden bg-slate-100 border border-slate-200">
                    <img
                      src={screenshot.thumbnail_url || screenshot.storage_url}
                      alt={`Screenshot from ${getUserName(screenshot.user_id)}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    
                    {/* Hover overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <p className="text-white text-xs font-medium truncate">
                        {screenshot.active_app || 'Unknown App'}
                      </p>
                      <p className="text-white/70 text-xs truncate">
                        {screenshot.active_window}
                      </p>
                    </div>
                    
                    {/* Trigger type badge */}
                    <div className={`absolute top-2 right-2 px-2 py-0.5 rounded text-xs font-medium ${
                      screenshot.trigger_type === 'admin_triggered'
                        ? 'bg-red-500 text-white'
                        : 'bg-slate-800/70 text-white'
                    }`}>
                      {screenshot.trigger_type === 'admin_triggered' ? 'Manual' : 'Auto'}
                    </div>
                  </div>
                  
                  <div className="mt-2 flex items-center gap-2">
                    <img
                      src={user?.avatar_url || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=24&h=24&fit=crop'}
                      alt={getUserName(screenshot.user_id)}
                      className="w-6 h-6 rounded-full object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-700 truncate">
                        {user?.first_name}
                      </p>
                      <p className="text-xs text-slate-500">
                        {formatDateTime(screenshot.captured_at)}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-12 text-center">
            <ImageIcon size={48} className="text-slate-300 mx-auto mb-4" />
            <p className="text-lg font-medium text-slate-600">No screenshots found</p>
            <p className="text-slate-500 mt-2">
              Try adjusting your filters or wait for new screenshots to be captured
            </p>
          </div>
        )}
      </div>

      {/* Screenshot Modal */}
      {selectedScreenshot && (
        <div 
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedScreenshot(null)}
        >
          <div 
            className="bg-white rounded-xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <img
                  src={getUser(selectedScreenshot.user_id)?.avatar_url || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop'}
                  alt={getUserName(selectedScreenshot.user_id)}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <h3 className="font-semibold text-slate-800">
                    {getUserName(selectedScreenshot.user_id)}
                  </h3>
                  <p className="text-sm text-slate-500">
                    {new Date(selectedScreenshot.captured_at).toLocaleString()}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="flex items-center gap-2 px-3 py-2 bg-slate-100 rounded-lg text-slate-600 hover:bg-slate-200 transition-colors">
                  <DownloadIcon size={18} />
                  Download
                </button>
                <button
                  onClick={() => setSelectedScreenshot(null)}
                  className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
                >
                  <CloseIcon size={20} className="text-slate-500" />
                </button>
              </div>
            </div>
            
            <div className="flex-1 overflow-auto p-4 bg-slate-900">
              <img
                src={selectedScreenshot.storage_url}
                alt="Screenshot"
                className="w-full h-auto rounded-lg"
              />
            </div>
            
            <div className="p-4 border-t border-slate-100 bg-slate-50">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <p className="text-slate-500">Application</p>
                  <p className="font-medium text-slate-800">{selectedScreenshot.active_app || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-slate-500">Window Title</p>
                  <p className="font-medium text-slate-800 truncate">{selectedScreenshot.active_window || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-slate-500">Trigger Type</p>
                  <p className="font-medium text-slate-800 capitalize">{selectedScreenshot.trigger_type.replace('_', ' ')}</p>
                </div>
                <div>
                  <p className="text-slate-500">File Size</p>
                  <p className="font-medium text-slate-800">
                    {selectedScreenshot.file_size ? `${(selectedScreenshot.file_size / 1024).toFixed(1)} KB` : 'N/A'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ScreenshotGallery;
