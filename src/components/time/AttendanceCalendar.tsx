import React, { useState } from 'react';
import { TimeEntry, User } from '@/types';
import { 
  ChevronRightIcon, CheckCircleIcon, AlertCircleIcon, 
  ClockIcon, CoffeeIcon 
} from '@/components/icons/Icons';

interface AttendanceCalendarProps {
  user: User;
  timeEntries: TimeEntry[];
}

const AttendanceCalendar: React.FC<AttendanceCalendarProps> = ({ user, timeEntries }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();
    
    return { daysInMonth, startingDay, year, month };
  };

  const { daysInMonth, startingDay, year, month } = getDaysInMonth(currentMonth);

  const prevMonth = () => {
    setCurrentMonth(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(year, month + 1, 1));
  };

  // Generate mock attendance data
  const getAttendanceStatus = (day: number) => {
    const date = new Date(year, month, day);
    const dayOfWeek = date.getDay();
    
    // Weekend
    if (dayOfWeek === 0 || dayOfWeek === 6) return 'weekend';
    
    // Future dates
    if (date > new Date()) return 'future';
    
    // Random status for past dates
    const random = Math.random();
    if (random > 0.9) return 'absent';
    if (random > 0.8) return 'late';
    if (random > 0.7) return 'half-day';
    return 'present';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'present': return 'bg-green-100 text-green-700 border-green-200';
      case 'late': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'absent': return 'bg-red-100 text-red-700 border-red-200';
      case 'half-day': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'weekend': return 'bg-slate-50 text-slate-400';
      case 'future': return 'bg-white text-slate-300';
      default: return 'bg-white text-slate-700';
    }
  };

  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Calculate summary stats
  const totalWorkDays = Array.from({ length: daysInMonth }, (_, i) => {
    const date = new Date(year, month, i + 1);
    return date.getDay() !== 0 && date.getDay() !== 6 && date <= new Date();
  }).filter(Boolean).length;

  const presentDays = Math.floor(totalWorkDays * 0.85);
  const lateDays = Math.floor(totalWorkDays * 0.1);
  const absentDays = totalWorkDays - presentDays - lateDays;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Attendance Calendar</h2>
          <p className="text-slate-500">Track your attendance history</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 border border-slate-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-50 rounded-lg">
              <CheckCircleIcon size={20} className="text-green-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Present</p>
              <p className="text-xl font-bold text-green-600">{presentDays} days</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-4 border border-slate-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-50 rounded-lg">
              <ClockIcon size={20} className="text-amber-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Late</p>
              <p className="text-xl font-bold text-amber-600">{lateDays} days</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-4 border border-slate-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-50 rounded-lg">
              <AlertCircleIcon size={20} className="text-red-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Absent</p>
              <p className="text-xl font-bold text-red-600">{absentDays} days</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-4 border border-slate-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-50 rounded-lg">
              <CoffeeIcon size={20} className="text-indigo-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">On-Time Rate</p>
              <p className="text-xl font-bold text-indigo-600">
                {Math.round((presentDays / totalWorkDays) * 100)}%
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
          {/* Calendar Header */}
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <button
              onClick={prevMonth}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <ChevronRightIcon size={20} className="text-slate-600 rotate-180" />
            </button>
            <h3 className="text-lg font-semibold text-slate-800">
              {monthNames[month]} {year}
            </h3>
            <button
              onClick={nextMonth}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <ChevronRightIcon size={20} className="text-slate-600" />
            </button>
          </div>
          
          {/* Days of Week */}
          <div className="grid grid-cols-7 border-b border-slate-100">
            {days.map(day => (
              <div key={day} className="p-3 text-center text-sm font-medium text-slate-500">
                {day}
              </div>
            ))}
          </div>
          
          {/* Calendar Grid */}
          <div className="grid grid-cols-7">
            {/* Empty cells for days before the first of the month */}
            {Array.from({ length: startingDay }).map((_, i) => (
              <div key={`empty-${i}`} className="p-2 min-h-[80px] border-b border-r border-slate-100" />
            ))}
            
            {/* Days of the month */}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const status = getAttendanceStatus(day);
              const isToday = new Date().getDate() === day && 
                new Date().getMonth() === month && 
                new Date().getFullYear() === year;
              
              return (
                <div
                  key={day}
                  onClick={() => setSelectedDate(new Date(year, month, day))}
                  className={`p-2 min-h-[80px] border-b border-r border-slate-100 cursor-pointer hover:bg-slate-50 transition-colors ${
                    isToday ? 'bg-indigo-50' : ''
                  }`}
                >
                  <div className="flex flex-col h-full">
                    <span className={`text-sm font-medium ${
                      isToday ? 'text-indigo-600' : 'text-slate-700'
                    }`}>
                      {day}
                    </span>
                    
                    {status !== 'future' && status !== 'weekend' && (
                      <div className={`mt-auto px-2 py-1 rounded text-xs font-medium text-center ${getStatusColor(status)}`}>
                        {status === 'present' && 'Present'}
                        {status === 'late' && 'Late'}
                        {status === 'absent' && 'Absent'}
                        {status === 'half-day' && 'Half Day'}
                      </div>
                    )}
                    
                    {status === 'weekend' && (
                      <span className="mt-auto text-xs text-slate-400 text-center">Weekend</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Legend & Details */}
        <div className="space-y-4">
          {/* Legend */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4">
            <h3 className="font-semibold text-slate-800 mb-4">Legend</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <span className="w-4 h-4 rounded bg-green-500" />
                <span className="text-sm text-slate-600">Present</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="w-4 h-4 rounded bg-amber-500" />
                <span className="text-sm text-slate-600">Late Arrival</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="w-4 h-4 rounded bg-red-500" />
                <span className="text-sm text-slate-600">Absent</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="w-4 h-4 rounded bg-purple-500" />
                <span className="text-sm text-slate-600">Half Day</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="w-4 h-4 rounded bg-slate-200" />
                <span className="text-sm text-slate-600">Weekend</span>
              </div>
            </div>
          </div>

          {/* Selected Date Details */}
          {selectedDate && (
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4">
              <h3 className="font-semibold text-slate-800 mb-4">
                {selectedDate.toLocaleDateString('en-US', { 
                  weekday: 'long',
                  month: 'long', 
                  day: 'numeric' 
                })}
              </h3>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-500">Clock In</span>
                  <span className="text-sm font-medium text-slate-800">8:05 AM</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-500">Clock Out</span>
                  <span className="text-sm font-medium text-slate-800">5:30 PM</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-500">Total Hours</span>
                  <span className="text-sm font-medium text-slate-800">9h 25m</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-500">Break Time</span>
                  <span className="text-sm font-medium text-slate-800">1h 0m</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-500">Status</span>
                  <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-xs font-medium rounded">
                    5 min late
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Monthly Stats */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4">
            <h3 className="font-semibold text-slate-800 mb-4">Monthly Summary</h3>
            <div className="space-y-3">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-slate-500">Attendance Rate</span>
                  <span className="text-sm font-medium text-slate-800">
                    {Math.round(((presentDays + lateDays) / totalWorkDays) * 100)}%
                  </span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-green-500 rounded-full"
                    style={{ width: `${((presentDays + lateDays) / totalWorkDays) * 100}%` }}
                  />
                </div>
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-slate-500">Punctuality Rate</span>
                  <span className="text-sm font-medium text-slate-800">
                    {Math.round((presentDays / (presentDays + lateDays)) * 100)}%
                  </span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-indigo-500 rounded-full"
                    style={{ width: `${(presentDays / (presentDays + lateDays)) * 100}%` }}
                  />
                </div>
              </div>
              
              <div className="pt-3 border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-500">Total Hours</span>
                  <span className="text-sm font-bold text-slate-800">
                    {(presentDays + lateDays) * 8}h
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttendanceCalendar;
