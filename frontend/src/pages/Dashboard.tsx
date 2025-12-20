import React from 'react';
export default function Dashboard() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-800 mb-6">Dashboard Overview</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white p-6 rounded-lg shadow-sm border border-slate-100">
             <div className="text-slate-500 text-sm mb-1">Total Inspections</div>
             <div className="text-3xl font-bold text-indigo-600">1,24{i}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
