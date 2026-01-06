import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  flexRender,
  ColumnDef,
  SortingState,
} from '@tanstack/react-table';
import { Tenant } from '../../types/safety';
import { Search, ChevronDown, ChevronUp, MoreHorizontal, Globe, AlertCircle } from 'lucide-react';

const StatusBadge = ({ status }: { status: string }) => {
  const styles = {
    active: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    suspended: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
    onboarding: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  };
  const labels = { active: 'פעיל', suspended: 'מושהה', onboarding: 'בהקמה' };
  const key = status as keyof typeof styles;
  return (
    <span className={`px-2.5 py-0.5 rounded-lg text-[10px] font-bold border ${styles[key] || styles.onboarding}`}>
      {labels[key] || status}
    </span>
  );
};

const HealthBar = ({ score }: { score: number }) => (
  <div className="w-24 h-1.5 bg-slate-700 rounded-full overflow-hidden">
    <div 
      className={`h-full rounded-full ${score > 80 ? 'bg-emerald-400' : score > 50 ? 'bg-amber-400' : 'bg-rose-500'}`} 
      style={{ width: `${score}%` }}
    />
  </div>
);

export default function ClientsTable({ data }: { data: Tenant[] }) {
  const navigate = useNavigate();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState('');

  const columns = useMemo<ColumnDef<Tenant>[]>(() => [
    {
      header: 'לקוח',
      accessorKey: 'name',
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center text-indigo-300 font-bold border border-indigo-500/30">
            {row.original.branding?.logoUrl ? (
                <img src={row.original.branding?.logoUrl} alt="" className="w-full h-full object-cover rounded-xl" />
            ) : (
                row.original.name[0]
            )}
          </div>
          <div>
            <div className="font-bold text-white text-sm">{row.original.name}</div>
            <div className="text-xs text-slate-400 flex items-center gap-1">
                <Globe size={10} /> {row.original.domain}
            </div>
          </div>
        </div>
      ),
    },
    {
      header: 'סטטוס',
      accessorKey: 'status',
      cell: ({ getValue }) => <StatusBadge status={getValue() as string} />,
    },
    {
      header: 'חבילה',
      accessorKey: 'plan',
      cell: ({ row }) => (
        <div className="text-xs">
            <span className="text-slate-300 capitalize font-medium">{row.original.plan}</span>
            <div className="text-slate-500 text-[10px] mt-0.5">
                {row.original.usersCount} / {row.original.usersLimit} משתמשים
            </div>
        </div>
      ),
    },
    {
      header: 'בריאות (Health)',
      accessorKey: 'healthScore',
      cell: ({ getValue }) => <HealthBar score={getValue() as number} />,
    },
    {
      id: 'actions',
      cell: () => (
        <button className="p-2 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white transition-colors">
          <MoreHorizontal size={16} />
        </button>
      ),
    },
  ], []);

  const table = useReactTable({
    data,
    columns,
    state: { sorting, globalFilter },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex justify-between items-center bg-slate-800/50 p-3 rounded-2xl border border-white/5 backdrop-blur-sm">
        <div className="relative">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
                value={globalFilter ?? ''}
                onChange={e => setGlobalFilter(e.target.value)}
                placeholder="חיפוש לקוח..." 
                className="bg-slate-900/50 border border-slate-700 text-white text-sm rounded-xl py-2 pr-10 pl-4 focus:ring-2 focus:ring-indigo-500 outline-none w-64 transition-all"
            />
        </div>
        <div className="text-slate-400 text-xs font-mono">
            מציג {table.getRowModel().rows.length} מתוך {data.length} לקוחות
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-white/5 bg-slate-900/40 backdrop-blur-xl shadow-xl">
        <table className="w-full text-right">
          <thead className="bg-slate-900/80 text-xs uppercase text-slate-400 font-bold tracking-wider">
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <th key={header.id} className="px-6 py-4 border-b border-white/5 cursor-pointer hover:text-white transition-colors" onClick={header.column.getToggleSortingHandler()}>
                    <div className="flex items-center gap-2">
                        {flexRender(header.column.columnDef.header, header.getContext())}
                        {{
                          asc: <ChevronUp size={14} />,
                          desc: <ChevronDown size={14} />,
                        }[header.column.getIsSorted() as string] ?? null}
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="divide-y divide-white/5">
            {table.getRowModel().rows.length > 0 ? (
                table.getRowModel().rows.map(row => (
                <tr 
                    key={row.id} 
                    onClick={() => navigate(`/admin/clients/${row.original.id}`)} 
                    className="hover:bg-indigo-500/10 hover:border-l-4 hover:border-l-indigo-500 transition-all cursor-pointer group"
                >
                    {row.getVisibleCells().map(cell => (
                    <td key={cell.id} className="px-6 py-4 transition-colors">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                    ))}
                </tr>
                ))
            ) : (
                <tr>
                    <td colSpan={columns.length} className="px-6 py-12 text-center text-slate-500">
                        <div className="flex flex-col items-center gap-2">
                            <AlertCircle size={32} className="text-slate-600" />
                            <p>לא נמצאו לקוחות התואמים את החיפוש</p>
                        </div>
                    </td>
                </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
