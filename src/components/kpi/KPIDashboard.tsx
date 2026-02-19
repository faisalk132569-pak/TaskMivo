import React, { useState } from 'react';
import { KPI, User } from '@/types';
import { 
  TargetIcon, TrendingUpIcon, TrendingDownIcon, 
  PlusIcon, ChartIcon, AwardIcon 
} from '@/components/icons/Icons';

interface KPIDashboardProps {
  kpis: KPI[];
  users: User[];
  isAdmin?: boolean;
}

const KPIDashboard: React.FC<KPIDashboardProps> = ({ kpis, users, isAdmin = false }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedPeriod, setSelectedPeriod] = useState<'daily' | 'weekly' | 'monthly'>('weekly');

  const categories = ['all', ...new Set(kpis.map(k => k.category))];

  const filteredKPIs = kpis.filter(kpi => 
    selectedCategory === 'all' || kpi.category === selectedCategory
  );

  // Mock KPI scores for employees
  const getEmployeeKPIScore = (userId: string, kpiId: string) => {
    // Generate consistent random score based on user and KPI ID
    const hash = (userId + kpiId).split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0);
      return a & a;
    }, 0);
    return Math.abs(hash % 40) + 60; // 60-100 range
  };

  const getOverallScore = (userId: string) => {
    const scores = kpis.map(kpi => getEmployeeKPIScore(userId, kpi.id));
    return Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
  };

  const topPerformers = users
    .filter(u => u.role === 'employee')
    .map(u => ({ ...u, score: getOverallScore(u.id) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">KPI Dashboard</h2>
          <p className="text-slate-500">Track performance indicators and goals</p>
        </div>
        
        <div className="flex items-center gap-3">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 outline-none focus:border-indigo-500"
          >
            {categories.map(cat => (
              <option key={cat} value={cat} className="capitalize">
                {cat === 'all' ? 'All Categories' : cat}
              </option>
            ))}
          </select>
          
          <div className="flex items-center bg-slate-100 rounded-lg p-1">
            {(['daily', 'weekly', 'monthly'] as const).map(period => (
              <button
                key={period}
                onClick={() => setSelectedPeriod(period)}
                className={`px-3 py-1.5 rounded-md text-sm font-medium capitalize transition-colors ${
                  selectedPeriod === period 
                    ? 'bg-white text-slate-800 shadow-sm' 
                    : 'text-slate-500'
                }`}
              >
                {period}
              </button>
            ))}
          </div>
          
          {isAdmin && (
            <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium">
              <PlusIcon size={20} />
              Add KPI
            </button>
          )}
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-indigo-100 text-sm">Overall Score</p>
              <p className="text-4xl font-bold mt-1">82%</p>
              <div className="flex items-center gap-1 mt-2">
                <TrendingUpIcon size={16} />
                <span className="text-sm">+5% from last week</span>
              </div>
            </div>
            <div className="p-3 bg-white/20 rounded-xl">
              <TargetIcon size={32} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-slate-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-500 text-sm">Positive KPIs Met</p>
              <p className="text-3xl font-bold text-green-600 mt-1">
                {kpis.filter(k => k.kpi_type === 'positive').length - 1}/{kpis.filter(k => k.kpi_type === 'positive').length}
              </p>
            </div>
            <div className="p-3 bg-green-50 rounded-xl">
              <TrendingUpIcon size={24} className="text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-slate-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-500 text-sm">Negative KPIs Avoided</p>
              <p className="text-3xl font-bold text-amber-600 mt-1">
                {kpis.filter(k => k.kpi_type === 'negative').length - 1}/{kpis.filter(k => k.kpi_type === 'negative').length}
              </p>
            </div>
            <div className="p-3 bg-amber-50 rounded-xl">
              <TrendingDownIcon size={24} className="text-amber-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-slate-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-500 text-sm">Active KPIs</p>
              <p className="text-3xl font-bold text-slate-800 mt-1">{kpis.filter(k => k.is_active).length}</p>
            </div>
            <div className="p-3 bg-slate-100 rounded-xl">
              <ChartIcon size={24} className="text-slate-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* KPI List */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-4 border-b border-slate-100">
            <h3 className="font-semibold text-slate-800">Key Performance Indicators</h3>
          </div>
          
          <div className="divide-y divide-slate-100">
            {filteredKPIs.map(kpi => {
              const currentValue = Math.floor(Math.random() * 30) + 70;
              const targetValue = kpi.target_value || 100;
              const progress = (currentValue / targetValue) * 100;
              const isPositive = kpi.kpi_type === 'positive';
              const isMet = isPositive ? currentValue >= targetValue : currentValue <= targetValue;
              
              return (
                <div key={kpi.id} className="p-4 hover:bg-slate-50 transition-colors">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-lg ${
                        isPositive ? 'bg-green-50' : 'bg-red-50'
                      }`}>
                        {isPositive ? (
                          <TrendingUpIcon size={20} className="text-green-600" />
                        ) : (
                          <TrendingDownIcon size={20} className="text-red-600" />
                        )}
                      </div>
                      <div>
                        <h4 className="font-medium text-slate-800">{kpi.name}</h4>
                        <p className="text-sm text-slate-500">{kpi.description}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`px-2 py-0.5 rounded text-xs font-medium capitalize ${
                            kpi.category === 'productivity' ? 'bg-blue-100 text-blue-700' :
                            kpi.category === 'attendance' ? 'bg-purple-100 text-purple-700' :
                            kpi.category === 'quality' ? 'bg-green-100 text-green-700' :
                            'bg-slate-100 text-slate-700'
                          }`}>
                            {kpi.category}
                          </span>
                          <span className="text-xs text-slate-400">
                            Weight: {kpi.weight}x
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <p className={`text-2xl font-bold ${isMet ? 'text-green-600' : 'text-red-600'}`}>
                        {currentValue}
                        {kpi.target_value && <span className="text-sm text-slate-400">/{targetValue}</span>}
                      </p>
                      <span className={`text-xs font-medium ${isMet ? 'text-green-600' : 'text-red-600'}`}>
                        {isMet ? 'Target Met' : 'Below Target'}
                      </span>
                    </div>
                  </div>
                  
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all ${
                        isMet ? 'bg-green-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${Math.min(progress, 100)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Top Performers */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-4 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <AwardIcon size={20} className="text-amber-500" />
              <h3 className="font-semibold text-slate-800">Top Performers</h3>
            </div>
          </div>
          
          <div className="p-4 space-y-4">
            {topPerformers.map((performer, index) => (
              <div key={performer.id} className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                  index === 0 ? 'bg-amber-100 text-amber-700' :
                  index === 1 ? 'bg-slate-200 text-slate-700' :
                  index === 2 ? 'bg-orange-100 text-orange-700' :
                  'bg-slate-100 text-slate-500'
                }`}>
                  {index + 1}
                </div>
                
                <img
                  src={performer.avatar_url || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop'}
                  alt={`${performer.first_name} ${performer.last_name}`}
                  className="w-10 h-10 rounded-full object-cover"
                />
                
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-slate-800 truncate">
                    {performer.first_name} {performer.last_name}
                  </p>
                  <p className="text-sm text-slate-500 truncate">{performer.department}</p>
                </div>
                
                <div className="text-right">
                  <p className="font-bold text-slate-800">{performer.score}%</p>
                  <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-indigo-500 rounded-full"
                      style={{ width: `${performer.score}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="p-4 border-t border-slate-100">
            <button className="w-full text-center text-sm text-indigo-600 font-medium hover:text-indigo-700">
              View Full Leaderboard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KPIDashboard;
