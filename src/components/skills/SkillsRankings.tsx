import React, { useState } from 'react';
import { Skill, Rank, User } from '@/types';
import { 
  AwardIcon, StarIcon, TrendingUpIcon, PlusIcon,
  ChartIcon
} from '@/components/icons/Icons';

interface SkillsRankingsProps {
  skills: Skill[];
  ranks: Rank[];
  users: User[];
  currentUser: User;
  isAdmin?: boolean;
}

const SkillsRankings: React.FC<SkillsRankingsProps> = ({ 
  skills, 
  ranks, 
  users, 
  currentUser,
  isAdmin = false 
}) => {
  const [activeTab, setActiveTab] = useState<'skills' | 'rankings'>('skills');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = ['all', ...new Set(skills.map(s => s.category).filter(Boolean))];

  // Mock skill levels for users
  const getUserSkillLevel = (userId: string, skillId: string) => {
    const hash = (userId + skillId).split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0);
      return a & a;
    }, 0);
    return (Math.abs(hash) % 5) + 1;
  };

  // Calculate user rank based on average skill level
  const getUserRank = (userId: string) => {
    const avgLevel = skills.reduce((acc, skill) => 
      acc + getUserSkillLevel(userId, skill.id), 0
    ) / skills.length;
    const score = avgLevel * 20; // Convert to 0-100 scale
    return ranks.find(r => score >= (r.min_score || 0)) || ranks[0];
  };

  // Get ranked users
  const rankedUsers = users
    .filter(u => u.role === 'employee')
    .map(user => ({
      ...user,
      rank: getUserRank(user.id),
      avgScore: Math.round(skills.reduce((acc, skill) => 
        acc + getUserSkillLevel(user.id, skill.id), 0
      ) / skills.length * 20)
    }))
    .sort((a, b) => b.avgScore - a.avgScore);

  const filteredSkills = skills.filter(skill => 
    selectedCategory === 'all' || skill.category === selectedCategory
  );

  const renderStars = (level: number) => {
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map(i => (
          <StarIcon
            key={i}
            size={16}
            className={i <= level ? 'text-amber-400 fill-amber-400' : 'text-slate-200'}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Skills & Rankings</h2>
          <p className="text-slate-500">Track skills development and team rankings</p>
        </div>
        
        {isAdmin && (
          <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium">
            <PlusIcon size={20} />
            Add Skill
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-4 border-b border-slate-200">
        <button
          onClick={() => setActiveTab('skills')}
          className={`pb-3 px-1 font-medium transition-colors relative ${
            activeTab === 'skills' 
              ? 'text-indigo-600' 
              : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          Skills Matrix
          {activeTab === 'skills' && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600" />
          )}
        </button>
        <button
          onClick={() => setActiveTab('rankings')}
          className={`pb-3 px-1 font-medium transition-colors relative ${
            activeTab === 'rankings' 
              ? 'text-indigo-600' 
              : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          Team Rankings
          {activeTab === 'rankings' && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600" />
          )}
        </button>
      </div>

      {activeTab === 'skills' && (
        <>
          {/* Category Filter */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                  selectedCategory === cat
                    ? 'bg-indigo-600 text-white'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {cat === 'all' ? 'All Skills' : cat}
              </button>
            ))}
          </div>

          {/* Skills Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredSkills.map(skill => {
              const userLevel = getUserSkillLevel(currentUser.id, skill.id);
              const teamAvg = Math.round(
                users.filter(u => u.role === 'employee')
                  .reduce((acc, u) => acc + getUserSkillLevel(u.id, skill.id), 0) 
                / users.filter(u => u.role === 'employee').length
              );
              
              return (
                <div 
                  key={skill.id}
                  className="bg-white rounded-xl shadow-sm border border-slate-100 p-5 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-slate-800">{skill.name}</h3>
                      {skill.category && (
                        <span className="text-xs text-slate-500">{skill.category}</span>
                      )}
                    </div>
                    <div className="p-2 bg-indigo-50 rounded-lg">
                      <ChartIcon size={18} className="text-indigo-600" />
                    </div>
                  </div>
                  
                  {skill.description && (
                    <p className="text-sm text-slate-500 mb-4">{skill.description}</p>
                  )}
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-600">Your Level</span>
                      {renderStars(userLevel)}
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-600">Team Average</span>
                      {renderStars(teamAvg)}
                    </div>
                    
                    <div className="pt-3 border-t border-slate-100">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-500">Proficiency</span>
                        <span className="font-medium text-slate-800">{userLevel * 20}%</span>
                      </div>
                      <div className="h-2 bg-slate-100 rounded-full mt-2 overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
                          style={{ width: `${userLevel * 20}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {activeTab === 'rankings' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Leaderboard */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="p-4 border-b border-slate-100">
              <h3 className="font-semibold text-slate-800">Team Leaderboard</h3>
            </div>
            
            <div className="divide-y divide-slate-100">
              {rankedUsers.map((user, index) => (
                <div 
                  key={user.id}
                  className={`p-4 flex items-center gap-4 ${
                    user.id === currentUser.id ? 'bg-indigo-50' : 'hover:bg-slate-50'
                  } transition-colors`}
                >
                  {/* Position */}
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                    index === 0 ? 'bg-amber-100 text-amber-700' :
                    index === 1 ? 'bg-slate-200 text-slate-700' :
                    index === 2 ? 'bg-orange-100 text-orange-700' :
                    'bg-slate-100 text-slate-500'
                  }`}>
                    {index + 1}
                  </div>
                  
                  {/* User */}
                  <img
                    src={user.avatar_url || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop'}
                    alt={`${user.first_name} ${user.last_name}`}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-slate-800">
                        {user.first_name} {user.last_name}
                      </p>
                      {user.id === currentUser.id && (
                        <span className="px-2 py-0.5 bg-indigo-100 text-indigo-700 text-xs font-medium rounded">
                          You
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-slate-500">{user.department}</p>
                  </div>
                  
                  {/* Rank Badge */}
                  <div 
                    className="px-3 py-1.5 rounded-full text-sm font-medium"
                    style={{ 
                      backgroundColor: `${user.rank.color}20`,
                      color: user.rank.color
                    }}
                  >
                    {user.rank.name}
                  </div>
                  
                  {/* Score */}
                  <div className="text-right">
                    <p className="text-lg font-bold text-slate-800">{user.avgScore}</p>
                    <p className="text-xs text-slate-500">points</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Rank Tiers */}
          <div className="space-y-4">
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4">
              <h3 className="font-semibold text-slate-800 mb-4">Rank Tiers</h3>
              <div className="space-y-3">
                {ranks.sort((a, b) => b.level - a.level).map(rank => (
                  <div 
                    key={rank.id}
                    className="flex items-center gap-3 p-3 rounded-lg"
                    style={{ backgroundColor: `${rank.color}10` }}
                  >
                    <div 
                      className="w-10 h-10 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: rank.color }}
                    >
                      <AwardIcon size={20} className="text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium" style={{ color: rank.color }}>
                        {rank.name}
                      </p>
                      <p className="text-xs text-slate-500">
                        {rank.min_score}+ points required
                      </p>
                    </div>
                    <span className="text-sm font-medium text-slate-500">
                      Lvl {rank.level}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Your Progress */}
            <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl p-6 text-white">
              <div className="flex items-center gap-3 mb-4">
                <AwardIcon size={24} />
                <h3 className="font-semibold">Your Progress</h3>
              </div>
              
              <div className="text-center mb-4">
                <p className="text-4xl font-bold">
                  {rankedUsers.find(u => u.id === currentUser.id)?.avgScore || 0}
                </p>
                <p className="text-indigo-200">Total Points</p>
              </div>
              
              <div className="bg-white/20 rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm">Current Rank</span>
                  <span className="font-medium">
                    {getUserRank(currentUser.id).name}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Team Position</span>
                  <span className="font-medium">
                    #{rankedUsers.findIndex(u => u.id === currentUser.id) + 1} of {rankedUsers.length}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SkillsRankings;
