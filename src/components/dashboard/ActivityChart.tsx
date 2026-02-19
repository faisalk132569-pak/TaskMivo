import React from 'react';

interface ActivityChartProps {
  data: { time: string; activity: number }[];
  height?: number;
}

const ActivityChart: React.FC<ActivityChartProps> = ({ data, height = 200 }) => {
  const maxActivity = Math.max(...data.map(d => d.activity), 100);
  
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-slate-800">Activity Overview</h3>
          <p className="text-sm text-slate-500">Today's activity levels</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-indigo-500" />
            <span className="text-sm text-slate-600">Active</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-slate-200" />
            <span className="text-sm text-slate-600">Idle</span>
          </div>
        </div>
      </div>
      
      <div className="relative" style={{ height }}>
        {/* Y-axis labels */}
        <div className="absolute left-0 top-0 bottom-6 w-8 flex flex-col justify-between text-xs text-slate-400">
          <span>100%</span>
          <span>75%</span>
          <span>50%</span>
          <span>25%</span>
          <span>0%</span>
        </div>
        
        {/* Chart area */}
        <div className="ml-10 h-full flex items-end gap-1">
          {data.map((item, index) => {
            const barHeight = (item.activity / maxActivity) * 100;
            const isHighActivity = item.activity >= 70;
            const isMediumActivity = item.activity >= 40 && item.activity < 70;
            
            return (
              <div
                key={index}
                className="flex-1 flex flex-col items-center group"
              >
                <div className="relative w-full flex-1 flex items-end">
                  <div
                    className={`w-full rounded-t transition-all duration-300 group-hover:opacity-80 ${
                      isHighActivity 
                        ? 'bg-gradient-to-t from-indigo-600 to-indigo-400' 
                        : isMediumActivity 
                          ? 'bg-gradient-to-t from-amber-500 to-amber-300'
                          : 'bg-gradient-to-t from-slate-300 to-slate-200'
                    }`}
                    style={{ height: `${barHeight}%`, minHeight: '4px' }}
                  />
                  
                  {/* Tooltip */}
                  <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                    <div className="bg-slate-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                      {item.activity}% active
                    </div>
                  </div>
                </div>
                
                {/* X-axis label */}
                {index % 4 === 0 && (
                  <span className="text-xs text-slate-400 mt-2">{item.time}</span>
                )}
              </div>
            );
          })}
        </div>
        
        {/* Grid lines */}
        <div className="absolute left-10 right-0 top-0 bottom-6 pointer-events-none">
          {[0, 25, 50, 75, 100].map((line) => (
            <div
              key={line}
              className="absolute left-0 right-0 border-t border-slate-100"
              style={{ bottom: `${line}%` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ActivityChart;
