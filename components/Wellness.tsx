
import React from 'react';

const WELLNESS_TIPS = [
  { title: "Maintain a Routine", desc: "Keep a regular sleep-wake schedule and structured work hours for your job search.", icon: "fa-clock" },
  { title: "Physical Activity", desc: "Even 20 minutes of walking can significantly boost your endorphins and clear your head.", icon: "fa-walking" },
  { title: "Micro-Goal Setting", desc: "Break your day into tiny, achievable tasks to keep a sense of progress.", icon: "fa-bullseye" },
  { title: "Social Connection", desc: "Isolation can be tough. Reach out to friends or join community groups regularly.", icon: "fa-users" },
];

export const Wellness: React.FC = () => {
  return (
    <div className="space-y-8">
      <div className="bg-gradient-to-r from-teal-500 to-emerald-600 rounded-3xl p-10 text-white flex flex-col md:flex-row items-center justify-between">
        <div className="max-w-lg mb-8 md:mb-0">
          <h2 className="text-3xl font-bold mb-4">You are more than your job status.</h2>
          <p className="text-emerald-50 opacity-90 leading-relaxed">
            Searching for work is a marathon, not a sprint. Taking care of your mental health is just as important as updating your resume.
          </p>
          <div className="mt-8">
            <button className="bg-white text-emerald-600 px-8 py-3 rounded-2xl font-bold hover:bg-emerald-50 transition-colors shadow-lg">
              Start 5-min Meditation
            </button>
          </div>
        </div>
        <div className="hidden md:block">
          <i className="fas fa-leaf text-9xl text-white/20"></i>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {WELLNESS_TIPS.map((tip, idx) => (
          <div key={idx} className="bg-white border border-slate-200 rounded-3xl p-8 hover:shadow-md transition-shadow">
            <div className="w-14 h-14 bg-teal-50 text-teal-600 rounded-2xl flex items-center justify-center text-2xl mb-6">
              <i className={`fas ${tip.icon}`}></i>
            </div>
            <h4 className="text-xl font-bold text-slate-800 mb-2">{tip.title}</h4>
            <p className="text-slate-500 leading-relaxed">{tip.desc}</p>
          </div>
        ))}
      </div>

      <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
        <h3 className="text-xl font-bold text-slate-800 mb-6">Today's Affirmations</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            "I am capable and talented.",
            "This transition is temporary growth.",
            "I am finding the right opportunity."
          ].map((text, i) => (
            <div key={i} className="p-6 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 flex items-center justify-center text-center text-slate-600 font-medium italic">
              "{text}"
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
