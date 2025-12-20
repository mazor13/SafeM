import React from 'react';
import { Link } from 'react-router-dom';

const sampleInspections = [
  { id: '1', date: '2025-12-18', client: 'Intel Haifa', status: 'Completed', signed: true },
  { id: '2', date: '2025-12-19', client: 'Teva Pharm', status: 'Draft', signed: false },
  { id: '3', date: '2025-12-20', client: 'Elbit Systems', status: 'In Progress', signed: false },
];

export default function InspectionsDashboard() {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Field Inspections</h1>
        <button className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 shadow-sm transition-all font-medium">
          + New Inspection
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Client</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Signature</th>
              <th className="px-6 py-3 text-right"></th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-200">
            {sampleInspections.map((ins) => (
              <tr key={ins.id} className="hover:bg-slate-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">{ins.date}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">{ins.client}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    ins.status === 'Completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {ins.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {ins.signed ? (
                    <span className="text-emerald-600 flex items-center gap-1">
                       ✓ Signed
                    </span>
                  ) : (
                    <span className="text-slate-400">Pending</span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <a href="#" className="text-indigo-600 hover:text-indigo-900">View</a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
