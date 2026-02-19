import React, { useState, useEffect } from 'react';
import { TimeEntry, BreakEntry, User } from '@/types';
import { 
  ClockIcon, PlayIcon, PauseIcon, CoffeeIcon, 
  CheckCircleIcon, AlertCircleIcon 
} from '@/components/icons/Icons';

interface TimeClockProps {
  user: User;
  currentEntry?: TimeEntry;
  onClockIn: () => void;
  onClockOut: () => void;
  onStartBreak: (type: 'lunch' | 'short' | 'personal') => void;
  onEndBreak: () => void;
}

const TimeClock: React.FC<TimeClockProps> = ({
  user,
  currentEntry,
  onClockIn,
  onClockOut,
  onStartBreak,
  onEndBreak
}) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [elapsedTime, setElapsedTime] = useState('00:00:00');
  const [isOnBreak, setIsOnBreak] = useState(false);
  const [showBreakMenu, setShowBreakMenu] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
      
      if (currentEntry?.clock_in) {
        const start = new Date(currentEntry.clock_in);
        const diff = Date.now() - start.getTime();
        const hours = Math.floor(diff / 3600000);
        const minutes = Math.floor((diff % 3600000) / 60000);
        const seconds = Math.floor((diff % 60000) / 1000);
        setElapsedTime(
          `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
        );
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [currentEntry]);

  const isClockedIn = currentEntry?.status === 'active';
  const scheduledStart = currentEntry?.scheduled_start 
    ? new Date(currentEntry.scheduled_start) 
    : new Date(new Date().setHours(8, 0, 0, 0));
  const scheduledEnd = currentEntry?.scheduled_end
    ? new Date(currentEntry.scheduled_end)
    : new Date(new Date().setHours(17, 0, 0, 0));

  const handleBreakStart = (type: 'lunch' | 'short' | 'personal') => {
    setIsOnBreak(true);
    setShowBreakMenu(false);
    onStartBreak(type);
  };

  const handleBreakEnd = () => {
    setIsOnBreak(false);
    onEndBreak();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-slate-800">Time Clock</h2>
        <p className="text-slate-500">Track your work hours and breaks</p>
      </div>

      {/* Main Clock Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="bg-gradient-to-br from-indigo-600 to-purple-700 p-8 text-white">
          <div className="text-center">
            <p className="text-indigo-200 text-sm font-medium mb-2">
              {currentTime.toLocaleDateString('en-US', { 
                weekday: 'long', 
                month: 'long', 
                day: 'numeric',
                year: 'numeric'
              })}
            </p>
            <p className="text-5xl font-bold tracking-tight">
              {currentTime.toLocaleTimeString('en-US', { 
                hour: '2-digit', 
                minute: '2-digit',
                second: '2-digit'
              })}
            </p>
            
            {isClockedIn && (
              <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-white/20 rounded-full">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span className="text-sm font-medium">Working: {elapsedTime}</span>
              </div>
            )}
          </div>
        </div>

        <div className="p-6">
          {/* Schedule info */}
          <div className="flex items-center justify-between mb-6 pb-6 border-b border-slate-100">
            <div>
              <p className="text-sm text-slate-500">Scheduled Hours</p>
              <p className="font-semibold text-slate-800">
                {scheduledStart.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })} - 
                {scheduledEnd.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-slate-500">Status</p>
              <p className={`font-semibold ${isClockedIn ? 'text-green-600' : 'text-slate-400'}`}>
                {isClockedIn ? (isOnBreak ? 'On Break' : 'Clocked In') : 'Not Clocked In'}
              </p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            {!isClockedIn ? (
              <button
                onClick={onClockIn}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors font-semibold text-lg"
              >
                <PlayIcon size={24} />
                Clock In
              </button>
            ) : (
              <>
                {!isOnBreak ? (
                  <>
                    <div className="relative flex-1">
                      <button
                        onClick={() => setShowBreakMenu(!showBreakMenu)}
                        className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-amber-500 text-white rounded-xl hover:bg-amber-600 transition-colors font-semibold"
                      >
                        <CoffeeIcon size={20} />
                        Take Break
                      </button>
                      
                      {showBreakMenu && (
                        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden z-10">
                          <button
                            onClick={() => handleBreakStart('short')}
                            className="w-full px-4 py-3 text-left hover:bg-slate-50 transition-colors"
                          >
                            <p className="font-medium text-slate-800">Short Break</p>
                            <p className="text-sm text-slate-500">15 minutes</p>
                          </button>
                          <button
                            onClick={() => handleBreakStart('lunch')}
                            className="w-full px-4 py-3 text-left hover:bg-slate-50 transition-colors border-t border-slate-100"
                          >
                            <p className="font-medium text-slate-800">Lunch Break</p>
                            <p className="text-sm text-slate-500">1 hour</p>
                          </button>
                          <button
                            onClick={() => handleBreakStart('personal')}
                            className="w-full px-4 py-3 text-left hover:bg-slate-50 transition-colors border-t border-slate-100"
                          >
                            <p className="font-medium text-slate-800">Personal Break</p>
                            <p className="text-sm text-slate-500">Custom duration</p>
                          </button>
                        </div>
                      )}
                    </div>
                    <button
                      onClick={onClockOut}
                      className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors font-semibold"
                    >
                      <PauseIcon size={20} />
                      Clock Out
                    </button>
                  </>
                ) : (
                  <button
                    onClick={handleBreakEnd}
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors font-semibold text-lg"
                  >
                    <PlayIcon size={24} />
                    End Break
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Today's Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 border border-slate-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-50 rounded-lg">
              <ClockIcon size={20} className="text-green-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Active Time</p>
              <p className="text-xl font-bold text-slate-800">
                {currentEntry?.total_active_minutes 
                  ? `${Math.floor(currentEntry.total_active_minutes / 60)}h ${currentEntry.total_active_minutes % 60}m`
                  : '0h 0m'
                }
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-slate-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-50 rounded-lg">
              <CoffeeIcon size={20} className="text-amber-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Break Time</p>
              <p className="text-xl font-bold text-slate-800">
                {currentEntry?.total_break_minutes || 0}m
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-slate-100">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${currentEntry?.late_minutes ? 'bg-red-50' : 'bg-green-50'}`}>
              {currentEntry?.late_minutes ? (
                <AlertCircleIcon size={20} className="text-red-600" />
              ) : (
                <CheckCircleIcon size={20} className="text-green-600" />
              )}
            </div>
            <div>
              <p className="text-sm text-slate-500">Late</p>
              <p className="text-xl font-bold text-slate-800">
                {currentEntry?.late_minutes || 0}m
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
              <p className="text-sm text-slate-500">Overtime</p>
              <p className="text-xl font-bold text-slate-800">
                {currentEntry?.overtime_minutes || 0}m
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-4 border-b border-slate-100">
          <h3 className="font-semibold text-slate-800">Today's Activity Log</h3>
        </div>
        <div className="divide-y divide-slate-100">
          {isClockedIn && currentEntry?.clock_in && (
            <div className="p-4 flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                <PlayIcon size={18} className="text-green-600" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-slate-800">Clocked In</p>
                <p className="text-sm text-slate-500">
                  {new Date(currentEntry.clock_in).toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
              {currentEntry.late_minutes > 0 && (
                <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-medium rounded-full">
                  {currentEntry.late_minutes}m late
                </span>
              )}
            </div>
          )}
          
          {!isClockedIn && (
            <div className="p-8 text-center text-slate-500">
              <ClockIcon size={32} className="mx-auto mb-2 text-slate-300" />
              <p>No activity yet today. Clock in to start tracking.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TimeClock;
