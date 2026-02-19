import React, { useState } from 'react';
import { Screenshot, User } from '@/types';
import { CloseIcon, ChevronRightIcon } from '@/components/icons/Icons';

interface RecentScreenshotsProps {
  screenshots: Screenshot[];
  users: User[];
}

const RecentScreenshots: React.FC<RecentScreenshotsProps> = ({ screenshots, users }) => {
  const [selectedScreenshot, setSelectedScreenshot] = useState<Screenshot | null>(null);

  const getUserName = (userId: string) => {
    const user = users.find(u => u.id === userId);
    return user ? `${user.first_name} ${user.last_name}` : 'Unknown';
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-100">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-slate-800">Recent Screenshots</h3>
              <p className="text-sm text-slate-500">Latest captured screens</p>
            </div>
            <button className="flex items-center gap-1 text-sm text-indigo-600 font-medium hover:text-indigo-700">
              View All
              <ChevronRightIcon size={16} />
            </button>
          </div>
        </div>
        
        <div className="p-4">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {screenshots.slice(0, 6).map(screenshot => (
              <div
                key={screenshot.id}
                className="group cursor-pointer"
                onClick={() => setSelectedScreenshot(screenshot)}
              >
                <div className="relative aspect-video rounded-lg overflow-hidden bg-slate-100">
                  <img
                    src={screenshot.thumbnail_url || screenshot.storage_url}
                    alt={`Screenshot from ${getUserName(screenshot.user_id)}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="absolute bottom-2 left-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <p className="text-white text-xs font-medium truncate">
                      {screenshot.active_app || 'Unknown App'}
                    </p>
                  </div>
                </div>
                <div className="mt-2">
                  <p className="text-sm font-medium text-slate-700 truncate">
                    {getUserName(screenshot.user_id)}
                  </p>
                  <p className="text-xs text-slate-500">
                    {formatTime(screenshot.captured_at)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Screenshot Modal */}
      {selectedScreenshot && (
        <div 
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedScreenshot(null)}
        >
          <div 
            className="bg-white rounded-xl max-w-5xl w-full max-h-[90vh] overflow-hidden"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-4 border-b border-slate-100">
              <div>
                <h3 className="font-semibold text-slate-800">
                  {getUserName(selectedScreenshot.user_id)}
                </h3>
                <p className="text-sm text-slate-500">
                  {new Date(selectedScreenshot.captured_at).toLocaleString()} • {selectedScreenshot.active_app}
                </p>
              </div>
              <button
                onClick={() => setSelectedScreenshot(null)}
                className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <CloseIcon size={20} className="text-slate-500" />
              </button>
            </div>
            <div className="p-4 bg-slate-900">
              <img
                src={selectedScreenshot.storage_url}
                alt="Screenshot"
                className="w-full h-auto rounded-lg"
              />
            </div>
            <div className="p-4 border-t border-slate-100">
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-slate-500">Window Title</p>
                  <p className="font-medium text-slate-800">{selectedScreenshot.active_window || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-slate-500">Trigger Type</p>
                  <p className="font-medium text-slate-800 capitalize">{selectedScreenshot.trigger_type.replace('_', ' ')}</p>
                </div>
                <div>
                  <p className="text-slate-500">File Size</p>
                  <p className="font-medium text-slate-800">
                    {selectedScreenshot.file_size ? `${(selectedScreenshot.file_size / 1024).toFixed(1)} KB` : 'N/A'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default RecentScreenshots;
