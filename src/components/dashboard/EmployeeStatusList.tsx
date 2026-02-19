import React from 'react';
import { User, AgentDevice } from '@/types';
import { WifiIcon, WifiOffIcon, EyeIcon, MicIcon } from '@/components/icons/Icons';

interface EmployeeStatusListProps {
  employees: User[];
  devices: AgentDevice[];
  onViewEmployee: (userId: string) => void;
  onStartLiveView?: (userId: string) => void;
}

const EmployeeStatusList: React.FC<EmployeeStatusListProps> = ({ 
  employees, 
  devices, 
  onViewEmployee,
  onStartLiveView 
}) => {
  const getDeviceStatus = (userId: string) => {
    return devices.find(d => d.user_id === userId);
  };

  const getActivityLevel = () => {
    return Math.floor(Math.random() * 40) + 60; // 60-100%
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
      <div className="p-6 border-b border-slate-100">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-slate-800">Employee Status</h3>
            <p className="text-sm text-slate-500">Real-time monitoring status</p>
          </div>
          <button className="text-sm text-indigo-600 font-medium hover:text-indigo-700">
            View All
          </button>
        </div>
      </div>
      
      <div className="divide-y divide-slate-100">
        {employees.slice(0, 6).map(employee => {
          const device = getDeviceStatus(employee.id);
          const isOnline = device?.is_online ?? false;
          const activityLevel = isOnline ? getActivityLevel() : 0;
          
          return (
            <div
              key={employee.id}
              className="p-4 hover:bg-slate-50 transition-colors cursor-pointer"
              onClick={() => onViewEmployee(employee.id)}
            >
              <div className="flex items-center gap-4">
                {/* Avatar with status */}
                <div className="relative">
                  <img
                    src={employee.avatar_url || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop'}
                    alt={`${employee.first_name} ${employee.last_name}`}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <span 
                    className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
                      isOnline ? 'bg-green-500' : 'bg-slate-300'
                    }`}
                  />
                </div>
                
                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-slate-800 truncate">
                      {employee.first_name} {employee.last_name}
                    </p>
                    {isOnline ? (
                      <WifiIcon size={14} className="text-green-500 flex-shrink-0" />
                    ) : (
                      <WifiOffIcon size={14} className="text-slate-300 flex-shrink-0" />
                    )}
                  </div>
                  <p className="text-sm text-slate-500 truncate">
                    {employee.job_title} • {employee.department}
                  </p>
                </div>
                
                {/* Activity indicator */}
                <div className="hidden sm:flex items-center gap-3">
                  {isOnline && (
                    <>
                      <div className="w-24">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs text-slate-500">Activity</span>
                          <span className="text-xs font-medium text-slate-700">{activityLevel}%</span>
                        </div>
                        <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full transition-all ${
                              activityLevel >= 70 ? 'bg-green-500' : 
                              activityLevel >= 40 ? 'bg-amber-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${activityLevel}%` }}
                          />
                        </div>
                      </div>
                      
                      {/* Quick actions */}
                      <div className="flex items-center gap-1">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onStartLiveView?.(employee.id);
                          }}
                          className="p-1.5 rounded-lg hover:bg-indigo-50 text-slate-400 hover:text-indigo-600 transition-colors"
                          title="Live View"
                        >
                          <EyeIcon size={16} />
                        </button>
                        <button
                          onClick={(e) => e.stopPropagation()}
                          className="p-1.5 rounded-lg hover:bg-indigo-50 text-slate-400 hover:text-indigo-600 transition-colors"
                          title="Listen"
                        >
                          <MicIcon size={16} />
                        </button>
                      </div>
                    </>
                  )}
                  
                  {!isOnline && (
                    <span className="text-sm text-slate-400">
                      Last seen {device?.last_seen_at ? new Date(device.last_seen_at).toLocaleTimeString() : 'Never'}
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default EmployeeStatusList;
