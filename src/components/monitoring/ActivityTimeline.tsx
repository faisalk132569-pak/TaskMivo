import React, { useState } from 'react';
import { User, AppUsage, WebsiteVisit, ActivityLog } from '@/types';
import { 
  AppWindowIcon, GlobeIcon, KeyboardIcon, MouseIcon, 
  ClockIcon, FilterIcon, SearchIcon, ChevronRightIcon 
} from '@/components/icons/Icons';

interface ActivityTimelineProps {
  users: User[];
  appUsage: AppUsage[];
  websiteVisits: WebsiteVisit[];
}

const ActivityTimeline: React.FC<ActivityTimelineProps> = ({ users, appUsage, websiteVisits }) => {
  const [selectedUser, setSelectedUser] = useState<string>('all');
  const [activityType, setActivityType] = useState<'all' | 'apps' | 'websites'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const getUser = (userId: string) => users.find(u => u.id === userId);

  // Combine and sort activities
  const allActivities = [
    ...appUsage.map(a => ({ ...a, type: 'app' as const, timestamp: a.started_at })),
    ...websiteVisits.map(w => ({ ...w, type: 'website' as const, timestamp: w.visited_at }))
  ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  const filteredActivities = allActivities.filter(activity => {
    if (selectedUser !== 'all' && activity.user_id !== selectedUser) return false;
    if (activityType !== 'all' && activity.type !== activityType.slice(0, -1)) return false;
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      if (activity.type === 'app') {
        const app = activity as AppUsage;
        if (!app.app_name.toLowerCase().includes(query) && 
            !(app.window_title || '').toLowerCase().includes(query)) return false;
      } else {
        const web = activity as WebsiteVisit;
        if (!web.domain.toLowerCase().includes(query) && 
            !(web.page_title || '').toLowerCase().includes(query)) return false;
      }
    }
    return true;
  });

  const formatDuration = (seconds: number) => {
    if (seconds < 60) return `${seconds}s`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m`;
    return `${Math.floor(seconds / 3600)}h ${Math.floor((seconds % 3600) / 60)}m`;
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Group activities by hour
  const groupedActivities: Record<string, typeof filteredActivities> = {};
  filteredActivities.forEach(activity => {
    const hour = new Date(activity.timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    }).split(':')[0] + ':00';
    if (!groupedActivities[hour]) groupedActivities[hour] = [];
    groupedActivities[hour].push(activity);
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Activity Timeline</h2>
          <p className="text-slate-500">Track application and website usage</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          {/* Search */}
          <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-3 py-2">
            <SearchIcon size={18} className="text-slate-400" />
            <input
              type="text"
              placeholder="Search activities..."
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
          
          {/* Type filter */}
          <div className="flex items-center bg-slate-100 rounded-lg p-1">
            {(['all', 'apps', 'websites'] as const).map(type => (
              <button
                key={type}
                onClick={() => setActivityType(type)}
                className={`px-3 py-1.5 rounded-md text-sm font-medium capitalize transition-colors ${
                  activityType === type 
                    ? 'bg-white text-slate-800 shadow-sm' 
                    : 'text-slate-500'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 border border-slate-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 rounded-lg">
              <AppWindowIcon size={20} className="text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Apps Used</p>
              <p className="text-xl font-bold text-slate-800">
                {new Set(appUsage.map(a => a.app_name)).size}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-4 border border-slate-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-50 rounded-lg">
              <GlobeIcon size={20} className="text-green-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Sites Visited</p>
              <p className="text-xl font-bold text-slate-800">
                {new Set(websiteVisits.map(w => w.domain)).size}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-4 border border-slate-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-50 rounded-lg">
              <ClockIcon size={20} className="text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Total Time</p>
              <p className="text-xl font-bold text-slate-800">
                {formatDuration(appUsage.reduce((acc, a) => acc + a.duration_seconds, 0))}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-4 border border-slate-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-50 rounded-lg">
              <KeyboardIcon size={20} className="text-amber-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Productive</p>
              <p className="text-xl font-bold text-green-600">
                {Math.round((appUsage.filter(a => a.is_productive).length / Math.max(appUsage.length, 1)) * 100)}%
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-4 border-b border-slate-100">
          <h3 className="font-semibold text-slate-800">Today's Activity</h3>
        </div>
        
        <div className="divide-y divide-slate-100">
          {Object.entries(groupedActivities).map(([hour, activities]) => (
            <div key={hour} className="p-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-16 text-sm font-medium text-slate-500">{hour}</div>
                <div className="flex-1 h-px bg-slate-200" />
              </div>
              
              <div className="ml-16 space-y-3">
                {activities.map((activity, idx) => {
                  const user = getUser(activity.user_id);
                  const isApp = activity.type === 'app';
                  const appActivity = activity as AppUsage;
                  const webActivity = activity as WebsiteVisit;
                  
                  return (
                    <div 
                      key={`${activity.type}-${idx}`}
                      className="flex items-start gap-4 p-3 rounded-lg hover:bg-slate-50 transition-colors"
                    >
                      <div className={`p-2 rounded-lg ${
                        isApp ? 'bg-blue-50' : 'bg-green-50'
                      }`}>
                        {isApp ? (
                          <AppWindowIcon size={18} className="text-blue-600" />
                        ) : (
                          <GlobeIcon size={18} className="text-green-600" />
                        )}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-slate-800 truncate">
                            {isApp ? appActivity.app_name : webActivity.domain}
                          </p>
                          {(isApp ? appActivity.is_productive : webActivity.is_productive) && (
                            <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-medium rounded">
                              Productive
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-slate-500 truncate">
                          {isApp ? appActivity.window_title : webActivity.page_title}
                        </p>
                        <div className="flex items-center gap-4 mt-1">
                          <span className="text-xs text-slate-400">
                            {formatTime(activity.timestamp)}
                          </span>
                          <span className="text-xs text-slate-400">
                            {formatDuration(isApp ? appActivity.duration_seconds : webActivity.duration_seconds)}
                          </span>
                          {(isApp ? appActivity.category : webActivity.category) && (
                            <span className="text-xs text-slate-400">
                              {isApp ? appActivity.category : webActivity.category}
                            </span>
                          )}
                        </div>
                      </div>
                      
                      {user && (
                        <div className="flex items-center gap-2">
                          <img
                            src={user.avatar_url || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=24&h=24&fit=crop'}
                            alt={`${user.first_name} ${user.last_name}`}
                            className="w-6 h-6 rounded-full object-cover"
                          />
                          <span className="text-sm text-slate-600">{user.first_name}</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
          
          {Object.keys(groupedActivities).length === 0 && (
            <div className="p-12 text-center">
              <ClockIcon size={48} className="text-slate-300 mx-auto mb-4" />
              <p className="text-lg font-medium text-slate-600">No activities found</p>
              <p className="text-slate-500 mt-2">
                Try adjusting your filters or wait for new activities
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ActivityTimeline;
