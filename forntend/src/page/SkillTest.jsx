import React from 'react';

const SkillTest = () => (
  <div className="max-w-3xl mx-auto">
    <div className="text-center mb-12">
      <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4">⚡</div>
      <h2 className="text-3xl font-bold">Live Skill Assessment</h2>
      <p className="text-slate-500 mt-2">Choose a domain to start the technical evaluation.</p>
    </div>
    <div className="grid gap-4">
      {['Java Architecture', 'Data Structures', 'System Design'].map((skill) => (
        <button key={skill} className="w-full text-left p-6 bg-white border border-slate-200 rounded-2xl hover:border-blue-500 hover:shadow-md transition-all flex justify-between items-center group">
          <span className="font-bold text-slate-700">{skill}</span>
          <span className="text-blue-600 font-bold opacity-0 group-hover:opacity-100 transition-all">START TEST →</span>
        </button>
      ))}
    </div>
  </div>
);
export default SkillTest;