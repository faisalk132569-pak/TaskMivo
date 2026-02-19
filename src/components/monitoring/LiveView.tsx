import React, { useState } from 'react';
import { User, AgentDevice } from '@/types';
import { 
  PlayIcon, PauseIcon, RefreshIcon, MicIcon, 
  VideoIcon, EyeIcon, AlertCircleIcon, WifiIcon 
} from '@/components/icons/Icons';

interface LiveViewProps {
  employees: User[];
  devices: AgentDevice[];
}

const LiveView: React.FC<LiveViewProps> = ({ employees, devices }) => {
  const [selectedEmployee, setSelectedEmployee] = useState<string | null>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [isMicActive, setIsMicActive] = useState(false);
  const [gridView, setGridView] = useState<'grid' | 'single'>('grid');

  const onlineEmployees = employees.filter(emp => {
    const device = devices.find(d => d.user_id === emp.id);
    return device?.is_online;
  });

  const getDevice = (userId: string) => devices.find(d => d.user_id === userId);

  const handleStartStream = (userId: string) => {
    setSelectedEmployee(userId);
    setIsStreaming(true);
  };

  const handleStopStream = () => {
    setIsStreaming(false);
    setIsMicActive(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Live Monitoring</h2>
          <p className="text-slate-500">Real-time screen and audio monitoring</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 rounded-full">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-sm font-medium text-green-700">
              {onlineEmployees.length} Online
            </span>
          </div>
          
          <div className="flex items-center bg-slate-100 rounded-lg p-1">
            <button
              onClick={() => setGridView('grid')}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                gridView === 'grid' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500'
              }`}
            >
              Grid
            </button>
            <button
              onClick={() => setGridView('single')}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                gridView === 'single' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500'
              }`}
            >
              Single
            </button>
          </div>
        </div>
      </div>

      {/* Warning Banner */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
        <AlertCircleIcon size={20} className="text-amber-600 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-medium text-amber-800">
            Live Monitoring Notice
          </p>
          <p className="text-sm text-amber-700 mt-1">
            Employees are notified when screen or microphone monitoring is active. 
            A visible indicator appears on their desktop during monitoring sessions.
          </p>
        </div>
      </div>

      {/* Grid View */}
      {gridView === 'grid' && !selectedEmployee && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {onlineEmployees.map(employee => {
            const device = getDevice(employee.id);
            
            return (
              <div
                key={employee.id}
                className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-md transition-shadow"
              >
                {/* Preview placeholder */}
                <div className="relative aspect-video bg-slate-800">
                  <img
                    src={`https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=225&fit=crop&q=80`}
                    alt="Screen preview"
                    className="w-full h-full object-cover opacity-50"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <button
                      onClick={() => handleStartStream(employee.id)}
                      className="p-4 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-colors"
                    >
                      <PlayIcon size={24} className="text-white" />
                    </button>
                  </div>
                  
                  {/* Status badge */}
                  <div className="absolute top-2 right-2 flex items-center gap-1 px-2 py-1 bg-green-500 rounded-full">
                    <WifiIcon size={12} className="text-white" />
                    <span className="text-xs font-medium text-white">Live</span>
                  </div>
                </div>
                
                {/* Info */}
                <div className="p-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={employee.avatar_url || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop'}
                      alt={`${employee.first_name} ${employee.last_name}`}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-slate-800 truncate">
                        {employee.first_name} {employee.last_name}
                      </p>
                      <p className="text-sm text-slate-500 truncate">
                        {device?.device_name || 'Unknown Device'}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 mt-4">
                    <button
                      onClick={() => handleStartStream(employee.id)}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium"
                    >
                      <EyeIcon size={16} />
                      View Screen
                    </button>
                    <button
                      className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
                      title="Listen to microphone"
                    >
                      <MicIcon size={18} className="text-slate-500" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Single View / Streaming View */}
      {(gridView === 'single' || selectedEmployee) && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
          {selectedEmployee ? (
            <>
              {/* Stream header */}
              <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {(() => {
                    const emp = employees.find(e => e.id === selectedEmployee);
                    return (
                      <>
                        <img
                          src={emp?.avatar_url || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop'}
                          alt={`${emp?.first_name} ${emp?.last_name}`}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        <div>
                          <p className="font-medium text-slate-800">
                            {emp?.first_name} {emp?.last_name}
                          </p>
                          <p className="text-sm text-slate-500">
                            {getDevice(selectedEmployee)?.device_name}
                          </p>
                        </div>
                      </>
                    );
                  })()}
                  
                  {isStreaming && (
                    <div className="flex items-center gap-2 px-3 py-1 bg-red-100 rounded-full">
                      <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                      <span className="text-sm font-medium text-red-700">Recording</span>
                    </div>
                  )}
                </div>
                
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsMicActive(!isMicActive)}
                    className={`p-2 rounded-lg transition-colors ${
                      isMicActive 
                        ? 'bg-red-100 text-red-600' 
                        : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                    }`}
                    title={isMicActive ? 'Stop listening' : 'Start listening'}
                  >
                    <MicIcon size={20} />
                  </button>
                  <button
                    className="p-2 bg-slate-100 rounded-lg text-slate-500 hover:bg-slate-200 transition-colors"
                    title="Refresh"
                  >
                    <RefreshIcon size={20} />
                  </button>
                  {isStreaming ? (
                    <button
                      onClick={handleStopStream}
                      className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                      <PauseIcon size={18} />
                      Stop
                    </button>
                  ) : (
                    <button
                      onClick={() => setIsStreaming(true)}
                      className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                      <PlayIcon size={18} />
                      Start
                    </button>
                  )}
                </div>
              </div>
              
              {/* Stream content */}
              <div className="aspect-video bg-slate-900 relative">
                <img
                  src="https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=1920&h=1080&fit=crop"
                  alt="Live screen"
                  className="w-full h-full object-contain"
                />
                
                {!isStreaming && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <div className="text-center">
                      <VideoIcon size={48} className="text-white/50 mx-auto mb-4" />
                      <p className="text-white/70">Click Start to begin live viewing</p>
                    </div>
                  </div>
                )}
                
                {isMicActive && (
                  <div className="absolute bottom-4 left-4 flex items-center gap-2 px-3 py-2 bg-red-600 rounded-lg">
                    <MicIcon size={16} className="text-white" />
                    <span className="text-sm font-medium text-white">Microphone Active</span>
                    <div className="flex gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <div
                          key={i}
                          className="w-1 bg-white rounded-full animate-pulse"
                          style={{ 
                            height: `${Math.random() * 16 + 4}px`,
                            animationDelay: `${i * 0.1}s`
                          }}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              {/* Employee selector */}
              <div className="p-4 border-t border-slate-100">
                <p className="text-sm font-medium text-slate-600 mb-3">Switch Employee</p>
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {onlineEmployees.map(emp => (
                    <button
                      key={emp.id}
                      onClick={() => setSelectedEmployee(emp.id)}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-colors flex-shrink-0 ${
                        selectedEmployee === emp.id
                          ? 'border-indigo-500 bg-indigo-50'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <img
                        src={emp.avatar_url || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop'}
                        alt={`${emp.first_name} ${emp.last_name}`}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                      <span className="text-sm font-medium text-slate-700">
                        {emp.first_name}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div className="p-12 text-center">
              <EyeIcon size={48} className="text-slate-300 mx-auto mb-4" />
              <p className="text-lg font-medium text-slate-600">Select an employee to start monitoring</p>
              <p className="text-slate-500 mt-2">Choose from the online employees below</p>
              
              <div className="flex flex-wrap justify-center gap-3 mt-6">
                {onlineEmployees.map(emp => (
                  <button
                    key={emp.id}
                    onClick={() => setSelectedEmployee(emp.id)}
                    className="flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors"
                  >
                    <img
                      src={emp.avatar_url || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop'}
                      alt={`${emp.first_name} ${emp.last_name}`}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <span className="text-sm font-medium text-slate-700">
                      {emp.first_name} {emp.last_name}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {onlineEmployees.length === 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-12 text-center">
          <WifiIcon size={48} className="text-slate-300 mx-auto mb-4" />
          <p className="text-lg font-medium text-slate-600">No employees online</p>
          <p className="text-slate-500 mt-2">
            Employees will appear here when they clock in and their agent is running
          </p>
        </div>
      )}
    </div>
  );
};

export default LiveView;
