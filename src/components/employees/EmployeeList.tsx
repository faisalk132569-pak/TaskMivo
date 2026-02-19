import React, { useState } from 'react';
import { User, AgentDevice } from '@/types';
import { 
  SearchIcon, FilterIcon, PlusIcon, MoreVerticalIcon,
  WifiIcon, WifiOffIcon, EyeIcon, MessageIcon, ChartIcon
} from '@/components/icons/Icons';

interface EmployeeListProps {
  employees: User[];
  devices: AgentDevice[];
  onViewEmployee: (userId: string) => void;
  onAddEmployee: () => void;
}

const EmployeeList: React.FC<EmployeeListProps> = ({
  employees,
  devices,
  onViewEmployee,
  onAddEmployee
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'online' | 'offline'>('all');
  const [selectedEmployees, setSelectedEmployees] = useState<string[]>([]);

  const departments = [...new Set(employees.map(e => e.department).filter(Boolean))];

  const getDeviceStatus = (userId: string) => {
    return devices.find(d => d.user_id === userId);
  };

  const filteredEmployees = employees.filter(emp => {
    if (emp.role === 'company_admin' || emp.role === 'super_admin') return false;
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const fullName = `${emp.first_name} ${emp.last_name}`.toLowerCase();
      const email = emp.email.toLowerCase();
      if (!fullName.includes(query) && !email.includes(query)) return false;
    }
    
    if (departmentFilter !== 'all' && emp.department !== departmentFilter) return false;
    
    if (statusFilter !== 'all') {
      const device = getDeviceStatus(emp.id);
      const isOnline = device?.is_online ?? false;
      if (statusFilter === 'online' && !isOnline) return false;
      if (statusFilter === 'offline' && isOnline) return false;
    }
    
    return true;
  });

  const toggleSelectAll = () => {
    if (selectedEmployees.length === filteredEmployees.length) {
      setSelectedEmployees([]);
    } else {
      setSelectedEmployees(filteredEmployees.map(e => e.id));
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedEmployees(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Employees</h2>
          <p className="text-slate-500">Manage your team members</p>
        </div>
        
        <button
          onClick={onAddEmployee}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
        >
          <PlusIcon size={20} />
          Add Employee
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 flex items-center gap-2 bg-slate-50 rounded-lg px-3 py-2">
            <SearchIcon size={18} className="text-slate-400" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent border-none outline-none text-sm text-slate-700 placeholder-slate-400 w-full"
            />
          </div>
          
          {/* Department filter */}
          <select
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
            className="bg-slate-50 border-none rounded-lg px-3 py-2 text-sm text-slate-700 outline-none"
          >
            <option value="all">All Departments</option>
            {departments.map(dept => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>
          
          {/* Status filter */}
          <div className="flex items-center bg-slate-50 rounded-lg p-1">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                statusFilter === 'all' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setStatusFilter('online')}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                statusFilter === 'online' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500'
              }`}
            >
              Online
            </button>
            <button
              onClick={() => setStatusFilter('offline')}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                statusFilter === 'offline' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500'
              }`}
            >
              Offline
            </button>
          </div>
        </div>
      </div>

      {/* Employee Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="px-4 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedEmployees.length === filteredEmployees.length && filteredEmployees.length > 0}
                    onChange={toggleSelectAll}
                    className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                  />
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Employee
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Department
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Activity
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Last Active
                </th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredEmployees.map(employee => {
                const device = getDeviceStatus(employee.id);
                const isOnline = device?.is_online ?? false;
                const activityLevel = isOnline ? Math.floor(Math.random() * 40) + 60 : 0;
                
                return (
                  <tr 
                    key={employee.id}
                    className="hover:bg-slate-50 transition-colors"
                  >
                    <td className="px-4 py-4">
                      <input
                        type="checkbox"
                        checked={selectedEmployees.includes(employee.id)}
                        onChange={() => toggleSelect(employee.id)}
                        className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                      />
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
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
                        <div>
                          <p className="font-medium text-slate-800">
                            {employee.first_name} {employee.last_name}
                          </p>
                          <p className="text-sm text-slate-500">{employee.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div>
                        <p className="text-sm font-medium text-slate-700">{employee.department || 'N/A'}</p>
                        <p className="text-xs text-slate-500">{employee.job_title || 'N/A'}</p>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        {isOnline ? (
                          <>
                            <WifiIcon size={16} className="text-green-500" />
                            <span className="text-sm font-medium text-green-600">Online</span>
                          </>
                        ) : (
                          <>
                            <WifiOffIcon size={16} className="text-slate-400" />
                            <span className="text-sm text-slate-500">Offline</span>
                          </>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      {isOnline ? (
                        <div className="w-24">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-medium text-slate-700">{activityLevel}%</span>
                          </div>
                          <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                            <div 
                              className={`h-full rounded-full ${
                                activityLevel >= 70 ? 'bg-green-500' : 
                                activityLevel >= 40 ? 'bg-amber-500' : 'bg-red-500'
                              }`}
                              style={{ width: `${activityLevel}%` }}
                            />
                          </div>
                        </div>
                      ) : (
                        <span className="text-sm text-slate-400">-</span>
                      )}
                    </td>
                    <td className="px-4 py-4">
                      <span className="text-sm text-slate-500">
                        {device?.last_seen_at 
                          ? new Date(device.last_seen_at).toLocaleTimeString('en-US', {
                              hour: '2-digit',
                              minute: '2-digit'
                            })
                          : 'Never'
                        }
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => onViewEmployee(employee.id)}
                          className="p-2 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-indigo-600 transition-colors"
                          title="View Profile"
                        >
                          <EyeIcon size={18} />
                        </button>
                        <button
                          className="p-2 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-indigo-600 transition-colors"
                          title="View Stats"
                        >
                          <ChartIcon size={18} />
                        </button>
                        <button
                          className="p-2 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-indigo-600 transition-colors"
                          title="Send Message"
                        >
                          <MessageIcon size={18} />
                        </button>
                        <button
                          className="p-2 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
                        >
                          <MoreVerticalIcon size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        
        {filteredEmployees.length === 0 && (
          <div className="p-12 text-center">
            <p className="text-lg font-medium text-slate-600">No employees found</p>
            <p className="text-slate-500 mt-2">Try adjusting your search or filters</p>
          </div>
        )}
        
        {/* Pagination */}
        <div className="px-4 py-3 border-t border-slate-100 flex items-center justify-between">
          <p className="text-sm text-slate-500">
            Showing {filteredEmployees.length} of {employees.filter(e => e.role === 'employee').length} employees
          </p>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
              Previous
            </button>
            <button className="px-3 py-1.5 text-sm font-medium bg-indigo-600 text-white rounded-lg">
              1
            </button>
            <button className="px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
              2
            </button>
            <button className="px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeList;
