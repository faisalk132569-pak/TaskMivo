import React from 'react';
import { ProductivityScore } from '@/types';

interface ProductivityOverviewProps {
  scores: ProductivityScore[];
}

const ProductivityOverview: React.FC<ProductivityOverviewProps> = ({ scores }) => {
  const latestScore = scores[scores.length - 1];
  const avgScore = scores.length > 0 
    ? Math.round(scores.reduce((acc, s) => acc + s.overall_score, 0) / scores.length)
    : 0;

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-amber-600';
    return 'text-red-600';
  };

  const getScoreGradient = (score: number) => {
    if (score >= 80) return 'from-green-500 to-emerald-400';
    if (score >= 60) return 'from-amber-500 to-yellow-400';
    return 'from-red-500 to-orange-400';
  };

  const metrics = [
    { label: 'Keyboard', value: latestScore?.keyboard_score || 0, color: 'bg-indigo-500' },
    { label: 'Mouse', value: latestScore?.mouse_score || 0, color: 'bg-purple-500' },
    { label: 'Apps', value: latestScore?.app_score || 0, color: 'bg-blue-500' },
    { label: 'Websites', value: latestScore?.website_score || 0, color: 'bg-cyan-500' },
    { label: 'Attendance', value: latestScore?.attendance_score || 0, color: 'bg-green-500' },
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
      <div className="p-6 border-b border-slate-100">
        <h3 className="text-lg font-semibold text-slate-800">Productivity Overview</h3>
        <p className="text-sm text-slate-500">Your performance metrics</p>
      </div>
      
      <div className="p-6">
        {/* Main score */}
        <div className="flex items-center justify-center mb-8">
          <div className="relative w-40 h-40">
            {/* Background circle */}
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="80"
                cy="80"
                r="70"
                fill="none"
                stroke="#e2e8f0"
                strokeWidth="12"
              />
              <circle
                cx="80"
                cy="80"
                r="70"
                fill="none"
                stroke="url(#scoreGradient)"
                strokeWidth="12"
                strokeLinecap="round"
                strokeDasharray={`${(avgScore / 100) * 440} 440`}
              />
              <defs>
                <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" className={`${avgScore >= 80 ? 'stop-green-500' : avgScore >= 60 ? 'stop-amber-500' : 'stop-red-500'}`} style={{ stopColor: avgScore >= 80 ? '#22c55e' : avgScore >= 60 ? '#f59e0b' : '#ef4444' }} />
                  <stop offset="100%" className={`${avgScore >= 80 ? 'stop-emerald-400' : avgScore >= 60 ? 'stop-yellow-400' : 'stop-orange-400'}`} style={{ stopColor: avgScore >= 80 ? '#34d399' : avgScore >= 60 ? '#facc15' : '#fb923c' }} />
                </linearGradient>
              </defs>
            </svg>
            
            {/* Score text */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className={`text-4xl font-bold ${getScoreColor(avgScore)}`}>
                {avgScore}
              </span>
              <span className="text-sm text-slate-500">Avg Score</span>
            </div>
          </div>
        </div>

        {/* Metric bars */}
        <div className="space-y-4">
          {metrics.map((metric) => (
            <div key={metric.label}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-slate-600">{metric.label}</span>
                <span className="text-sm font-semibold text-slate-800">{Math.round(metric.value)}%</span>
              </div>
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${metric.color}`}
                  style={{ width: `${metric.value}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Hours summary */}
        <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-slate-100">
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">
              {latestScore?.productive_hours.toFixed(1) || '0'}h
            </p>
            <p className="text-sm text-slate-500">Productive</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-slate-400">
              {latestScore?.total_idle_hours.toFixed(1) || '0'}h
            </p>
            <p className="text-sm text-slate-500">Idle</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductivityOverview;
