import React from 'react';
import { User, AgentDevice, Screenshot, ProductivityScore } from '@/types';
import StatCard from '@/components/dashboard/StatCard';
import ActivityChart from '@/components/dashboard/ActivityChart';
import EmployeeStatusList from '@/components/dashboard/EmployeeStatusList';
import RecentScreenshots from '@/components/dashboard/RecentScreenshots';
import ProductivityOverview from '@/components/dashboard/ProductivityOverview';
import { 
  UsersIcon, WifiIcon, ChartIcon, ClockIcon, 
  CheckCircleIcon, ImageIcon 
} from '@/components/icons/Icons';

interface DashboardViewProps {
  users: User[];
  devices: AgentDevice[];
  screenshots: Screenshot[];
  productivityScores: ProductivityScore[];
  currentUser: User;
  onViewEmployee: (userId: string) => void;
}

const DashboardView: React.FC<DashboardViewProps> = ({
  users,
  devices,
  screenshots,
  productivityScores,
  currentUser,
  onViewEmployee
}) => {
  const isAdmin = currentUser.role === 'company_admin' || currentUser.role === 'super_admin' || currentUser.role === 'manager';
  const employees = users.filter(u => u.role === 'employee');
  const onlineCount = devices.filter(d => d.is_online).length;
  const avgProductivity = productivityScores.length > 0
    ? Math.round(productivityScores.reduce((acc, s) => acc + s.overall_score, 0) / productivityScores.length)
    : 0;

  // Generate activity data for chart
  const activityData = Array.from({ length: 24 }, (_, i) => ({
    time: `${i.toString().padStart(2, '0')}:00`,
    activity: i >= 8 && i <= 17 ? Math.floor(Math.random() * 40) + 50 : Math.floor(Math.random() * 20)
  }));

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-6 text-white">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">
              Welcome back, {currentUser.first_name}!
            </h1>
            <p className="text-indigo-100 mt-1">
              {new Date().toLocaleDateString('en-US', { 
                weekday: 'long', 
                month: 'long', 
                day: 'numeric',
                year: 'numeric'
              })}
            </p>
          </div>
          
          {isAdmin && (
            <div className="flex items-center gap-4">
              <div className="text-center">
                <p className="text-3xl font-bold">{employees.length}</p>
                <p className="text-indigo-200 text-sm">Total Employees</p>
              </div>
              <div className="w-px h-12 bg-white/20" />
              <div className="text-center">
                <p className="text-3xl font-bold">{onlineCount}</p>
                <p className="text-indigo-200 text-sm">Currently Online</p>
              </div>
              <div className="w-px h-12 bg-white/20" />
              <div className="text-center">
                <p className="text-3xl font-bold">{avgProductivity}%</p>
                <p className="text-indigo-200 text-sm">Avg Productivity</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Stats Grid */}
      {isAdmin && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          <StatCard
            title="Total Employees"
            value={employees.length}
            icon={<UsersIcon size={24} />}
            color="indigo"
          />
          <StatCard
            title="Online Now"
            value={onlineCount}
            icon={<WifiIcon size={24} />}
            trend={{ value: 12, isPositive: true }}
            color="green"
          />
          <StatCard
            title="Avg Productivity"
            value={`${avgProductivity}%`}
            icon={<ChartIcon size={24} />}
            trend={{ value: 5, isPositive: true }}
            color="purple"
          />
          <StatCard
            title="Hours Today"
            value="42.5h"
            icon={<ClockIcon size={24} />}
            color="blue"
          />
          <StatCard
            title="On-Time Rate"
            value="92%"
            icon={<CheckCircleIcon size={24} />}
            trend={{ value: 3, isPositive: true }}
            color="green"
          />
          <StatCard
            title="Screenshots"
            value={screenshots.length}
            icon={<ImageIcon size={24} />}
            color="amber"
          />
        </div>
      )}

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Activity Chart - Full width on admin, 2/3 on employee */}
        <div className={isAdmin ? 'lg:col-span-2' : 'lg:col-span-2'}>
          <ActivityChart data={activityData} height={250} />
        </div>

        {/* Productivity Overview */}
        <div className="lg:col-span-1">
          <ProductivityOverview scores={productivityScores} />
        </div>
      </div>

      {/* Admin-only sections */}
      {isAdmin && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Employee Status */}
          <EmployeeStatusList
            employees={employees}
            devices={devices}
            onViewEmployee={onViewEmployee}
          />

          {/* Recent Screenshots */}
          <RecentScreenshots
            screenshots={screenshots}
            users={users}
          />
        </div>
      )}

      {/* Quick Actions for Employee */}
      {!isAdmin && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="bg-white rounded-xl p-6 border border-slate-100 hover:shadow-md transition-shadow text-left">
            <div className="p-3 bg-indigo-50 rounded-xl w-fit mb-4">
              <ClockIcon size={24} className="text-indigo-600" />
            </div>
            <h3 className="font-semibold text-slate-800">Time Clock</h3>
            <p className="text-sm text-slate-500 mt-1">Clock in/out and manage breaks</p>
          </button>
          
          <button className="bg-white rounded-xl p-6 border border-slate-100 hover:shadow-md transition-shadow text-left">
            <div className="p-3 bg-green-50 rounded-xl w-fit mb-4">
              <ChartIcon size={24} className="text-green-600" />
            </div>
            <h3 className="font-semibold text-slate-800">My Productivity</h3>
            <p className="text-sm text-slate-500 mt-1">View your performance stats</p>
          </button>
          
          <button className="bg-white rounded-xl p-6 border border-slate-100 hover:shadow-md transition-shadow text-left">
            <div className="p-3 bg-purple-50 rounded-xl w-fit mb-4">
              <UsersIcon size={24} className="text-purple-600" />
            </div>
            <h3 className="font-semibold text-slate-800">My Tasks</h3>
            <p className="text-sm text-slate-500 mt-1">View assigned tasks and projects</p>
          </button>
        </div>
      )}
    </div>
  );
};

export default DashboardView;
