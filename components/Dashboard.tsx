
import React from 'react';
import { Job } from '../types';

const MOCK_JOBS: Job[] = [
  { id: '1', title: 'Frontend Developer', company: 'TechNova', location: 'Remote', salary: '$90k - $120k', type: 'Full-time', posted: '2 days ago' },
  { id: '2', title: 'Product Designer', company: 'Creatio', location: 'New York', salary: '$100k - $140k', type: 'Contract', posted: '5 hours ago' },
  { id: '3', title: 'Marketing Manager', company: 'Growthly', location: 'Chicago', salary: '$85k - $110k', type: 'Full-time', posted: '1 day ago' },
];

export const Dashboard: React.FC = () => {
  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-br from-indigo-600 to-violet-700 rounded-3xl p-8 text-white relative overflow-hidden">
        <div className="relative z-10">
          <h2 className="text-3xl font-bold mb-2">Good morning, Alex!</h2>
          <p className="text-indigo-100 max-w-md">
            "Your limitation—it's only your imagination." Today is a new day to build your future.
          </p>
          <div className="mt-6 flex space-x-4">
            <button className="bg-white text-indigo-600 px-6 py-2 rounded-xl font-semibold hover:bg-indigo-50 transition-colors">
              Continue Applications
            </button>
          </div>
        </div>
        <i className="fas fa-rocket absolute -right-4 -bottom-4 text-9xl text-white/10 rotate-12"></i>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <span className="text-slate-500 font-medium">Applications Sent</span>
            <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center">
              <i className="fas fa-paper-plane"></i>
            </div>
          </div>
          <div className="text-3xl font-bold text-slate-800">24</div>
          <div className="text-sm text-green-600 mt-2">
            <i className="fas fa-arrow-up mr-1"></i>
            12% from last week
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <span className="text-slate-500 font-medium">Interviews Scheduled</span>
            <div className="w-10 h-10 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center">
              <i className="fas fa-calendar-check"></i>
            </div>
          </div>
          <div className="text-3xl font-bold text-slate-800">3</div>
          <div className="text-sm text-slate-500 mt-2">1 pending confirmation</div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <span className="text-slate-500 font-medium">Skill Progress</span>
            <div className="w-10 h-10 bg-amber-100 text-amber-600 rounded-lg flex items-center justify-center">
              <i className="fas fa-graduation-cap"></i>
            </div>
          </div>
          <div className="text-3xl font-bold text-slate-800">65%</div>
          <div className="w-full bg-slate-100 h-2 rounded-full mt-4">
            <div className="bg-amber-500 h-full rounded-full" style={{ width: '65%' }}></div>
          </div>
        </div>
      </div>

      {/* Suggested Jobs */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-slate-800">Recommended for You</h3>
          <button className="text-indigo-600 font-semibold hover:underline">View All</button>
        </div>
        <div className="grid grid-cols-1 gap-4">
          {MOCK_JOBS.map((job) => (
            <div key={job.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between hover:border-indigo-300 transition-colors group">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center text-xl text-slate-600">
                  <i className="fas fa-briefcase"></i>
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">{job.title}</h4>
                  <div className="text-sm text-slate-500 flex items-center space-x-3 mt-1">
                    <span>{job.company}</span>
                    <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                    <span>{job.location}</span>
                  </div>
                </div>
              </div>
              <div className="mt-4 md:mt-0 flex items-center space-x-6">
                <div className="text-right hidden sm:block">
                  <div className="font-semibold text-slate-800">{job.salary}</div>
                  <div className="text-xs text-slate-500">{job.type}</div>
                </div>
                <button className="bg-slate-100 text-slate-700 px-6 py-2 rounded-xl font-semibold group-hover:bg-indigo-600 group-hover:text-white transition-all">
                  Apply Now
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
