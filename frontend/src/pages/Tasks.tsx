import React, { useState, useMemo } from 'react';
import { useTasks } from '../hooks/useTasks';
import { Task, TaskStatus, TaskPriority, CreateTaskInput } from '../types/tasks';
import { formatDistanceToNow } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { he } from 'date-fns/locale';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { 
  LayoutGrid, 
  List as ListIcon, 
  Calendar,
  User,
  Tag,
  Link2,
  Search,
  Table2
} from 'lucide-react';
import { DynamicTable } from '../components/dynamic-columns';
import type { CellValue } from '../types/columns';

type ViewMode = 'kanban' | 'list' | 'table';

const statusConfig = {
  todo: { label: 'לביצוע', color: 'bg-gray-100 text-gray-800', icon: '📋' },
  in_progress: { label: 'בביצוע', color: 'bg-blue-100 text-blue-800', icon: '⏳' },
  done: { label: 'הושלם', color: 'bg-green-100 text-green-800', icon: '✅' },
  cancelled: { label: 'בוטל', color: 'bg-red-100 text-red-800', icon: '❌' },
};

const priorityConfig = {
  low: { label: 'נמוכה', color: 'text-gray-500', badge: 'bg-gray-100 text-gray-700', icon: '🔵' },
  medium: { label: 'בינונית', color: 'text-yellow-500', badge: 'bg-yellow-100 text-yellow-700', icon: '🟡' },
  high: { label: 'גבוהה', color: 'text-orange-500', badge: 'bg-orange-100 text-orange-700', icon: '🟠' },
  urgent: { label: 'דחוף', color: 'text-red-500', badge: 'bg-red-100 text-red-700', icon: '🔴' },
};

export default function Tasks() {
  const navigate = useNavigate();
  const { tasks, loading, createTask, updateTaskStatus } = useTasks();
  const [viewMode, setViewMode] = useState<ViewMode>('kanban');
  const [isCreating, setIsCreating] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<TaskStatus | 'all'>('all');
  const [filterPriority, setFilterPriority] = useState<TaskPriority | 'all'>('all');
  const [sortBy, setSortBy] = useState<'created' | 'priority' | 'dueDate'>('created');
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  
  const [newTask, setNewTask] = useState<CreateTaskInput & { tags?: string[] }>({
    title: '',
    description: '',
    priority: 'medium',
    tags: [],
  });

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.title.trim()) return;

    try {
      await createTask(newTask);
      setNewTask({ 
        title: '', 
        description: '', 
        priority: 'medium',
        tags: [],
      });
      setIsCreating(false);
    } catch (error) {
      console.error('Error creating task:', error);
      alert('שגיאה ביצירת המשימה');
    }
  };

  const handleStatusChange = async (taskId: string, newStatus: TaskStatus) => {
    try {
      await updateTaskStatus(taskId, newStatus);
    } catch (error) {
      console.error('Error updating task status:', error);
      alert('שגיאה בעדכון סטטוס המשימה');
    }
  };

  // Filter and sort tasks
  let filteredTasks = tasks.filter(task => {
    if (filterStatus !== 'all' && task.status !== filterStatus) return false;
    if (filterPriority !== 'all' && task.priority !== filterPriority) return false;
    if (searchTerm && !task.title.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  });

  filteredTasks = [...filteredTasks].sort((a, b) => {
    if (sortBy === 'created') {
      return b.createdAt.toMillis() - a.createdAt.toMillis();
    } else if (sortBy === 'priority') {
      const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    } else if (sortBy === 'dueDate') {
      if (!a.dueDate && !b.dueDate) return 0;
      if (!a.dueDate) return 1;
      if (!b.dueDate) return -1;
      return a.dueDate.toMillis() - b.dueDate.toMillis();
    }
    return 0;
  });

  // Transform tasks to table row format
  const tableData = useMemo(() => {
    return filteredTasks.map(task => ({
      id: task.id,
      title: { type: 'text', value: task.title } as CellValue,
      description: { type: 'text', value: task.description || '' } as CellValue,
      status: { type: 'status', optionId: task.status } as CellValue,
      priority: { type: 'status', optionId: task.priority } as CellValue,
      dueDate: { type: 'date', value: task.dueDate?.toDate?.()?.toISOString() || null } as CellValue,
      createdAt: { type: 'date', value: task.createdAt?.toDate?.()?.toISOString() || null } as CellValue,
    }));
  }, [filteredTasks]);

  const tasksByStatus = filteredTasks.reduce((acc, task) => {
    if (!acc[task.status]) acc[task.status] = [];
    acc[task.status].push(task);
    return acc;
  }, {} as Record<TaskStatus, Task[]>);

  const handleRowClick = (rowId: string) => {
    navigate(`/admin/tasks/${rowId}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-400">טוען משימות...</div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-[#0f172a] min-h-screen">
      {/* Header */}
      <div className="mb-6 flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-white">משימות</h1>
          <p className="text-sm text-gray-400 mt-1">
            ניהול משימות וביצוע פעולות - {tasks.length} משימות בסך הכל
          </p>
        </div>
        <button
          onClick={() => setIsCreating(true)}
          className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors font-medium shadow-lg"
        >
          + משימה חדשה
        </button>
      </div>

      {/* Toolbar */}
      <div className="mb-6 bg-slate-800/50 rounded-lg p-4 border border-slate-700/50">
        <div className="flex flex-wrap gap-4 items-center">
          {/* Search */}
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="חיפוש משימות..."
                className="w-full pr-10 pl-4 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Filter by Status */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as TaskStatus | 'all')}
            className="px-4 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-indigo-500"
          >
            <option value="all">כל הסטטוסים</option>
            <option value="todo">לביצוע</option>
            <option value="in_progress">בביצוע</option>
            <option value="done">הושלם</option>
            <option value="cancelled">בוטל</option>
          </select>

          {/* Filter by Priority */}
          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value as TaskPriority | 'all')}
            className="px-4 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-indigo-500"
          >
            <option value="all">כל העדיפויות</option>
            <option value="urgent">דחוף</option>
            <option value="high">גבוהה</option>
            <option value="medium">בינונית</option>
            <option value="low">נמוכה</option>
          </select>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'created' | 'priority' | 'dueDate')}
            className="px-4 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-indigo-500"
          >
            <option value="created">תאריך יצירה</option>
            <option value="priority">עדיפות</option>
            <option value="dueDate">תאריך יעד</option>
          </select>

          {/* View Toggle */}
          <div className="flex gap-1 border border-slate-600 rounded-lg p-1 bg-slate-900">
            <button
              onClick={() => setViewMode('kanban')}
              className={`p-2 rounded transition-colors ${
                viewMode === 'kanban' 
                  ? 'bg-indigo-600 text-white' 
                  : 'text-gray-400 hover:text-white'
              }`}
              title="תצוגת Kanban"
            >
              <LayoutGrid className="h-5 w-5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded transition-colors ${
                viewMode === 'list' 
                  ? 'bg-indigo-600 text-white' 
                  : 'text-gray-400 hover:text-white'
              }`}
              title="תצוגת רשימה"
            >
              <ListIcon className="h-5 w-5" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-2 rounded transition-colors ${
                viewMode === 'table' 
                  ? 'bg-indigo-600 text-white' 
                  : 'text-gray-400 hover:text-white'
              }`}
              title="תצוגת טבלה דינמית"
            >
              <Table2 className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Create Task Modal */}
      {isCreating && (
        <CreateTaskModal
          newTask={newTask}
          setNewTask={setNewTask}
          onSubmit={handleCreateTask}
          onClose={() => setIsCreating(false)}
        />
      )}

      {/* Content */}
      {viewMode === 'kanban' ? (
        <KanbanView 
          tasksByStatus={tasksByStatus} 
          onStatusChange={handleStatusChange} 
          navigate={navigate}
        />
      ) : viewMode === 'list' ? (
        <ListView 
          tasks={filteredTasks} 
          onStatusChange={handleStatusChange} 
          navigate={navigate}
        />
      ) : (
        <div className="bg-slate-800/50 rounded-lg border border-slate-700 overflow-hidden">
          <DynamicTable
            entityType="task"
            data={tableData}
            loading={loading}
            onRowClick={handleRowClick}
            selectable={true}
            selectedRows={selectedRows}
            onSelectionChange={setSelectedRows}
            emptyMessage="אין משימות להצגה"
            className="!shadow-none !rounded-none"
          />
        </div>
      )}

      {/* Selection info for table view */}
      {viewMode === 'table' && selectedRows.length > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-slate-800 border border-slate-700 rounded-xl px-6 py-3 shadow-xl flex items-center gap-4">
          <span className="text-white">{selectedRows.length} משימות נבחרו</span>
          <button
            onClick={() => setSelectedRows([])}
            className="px-3 py-1 bg-slate-700 text-slate-300 rounded hover:bg-slate-600"
          >
            בטל בחירה
          </button>
          <button
            onClick={() => {/* Bulk action */}}
            className="px-3 py-1 bg-indigo-500/20 text-indigo-400 rounded hover:bg-indigo-500/30"
          >
            פעולה מרוכזת
          </button>
        </div>
      )}
    </div>
  );
}

// Create Task Modal Component
function CreateTaskModal({ newTask, setNewTask, onSubmit, onClose }: any) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-slate-700">
        <h2 className="text-2xl font-bold mb-6 text-white">משימה חדשה</h2>
        <form onSubmit={onSubmit} className="space-y-4">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              כותרת *
            </label>
            <input
              type="text"
              value={newTask.title}
              onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
              className="w-full px-4 py-3 bg-slate-900 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="לדוגמה: בדיקת ציוד כיבוי אש בקומה 3"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              תיאור
            </label>
            <textarea
              value={newTask.description}
              onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
              className="w-full px-4 py-3 bg-slate-900 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              rows={4}
              placeholder="פרטים נוספים על המשימה..."
            />
          </div>

          {/* Priority and Due Date */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                <Tag className="inline h-4 w-4 ml-1" />
                עדיפות
              </label>
              <select
                value={newTask.priority}
                onChange={(e) => setNewTask({ ...newTask, priority: e.target.value as TaskPriority })}
                className="w-full px-4 py-3 bg-slate-900 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="low">🔵 נמוכה</option>
                <option value="medium">🟡 בינונית</option>
                <option value="high">🟠 גבוהה</option>
                <option value="urgent">🔴 דחוף</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                <Calendar className="inline h-4 w-4 ml-1" />
                תאריך יעד
              </label>
              <DatePicker
                selected={newTask.dueDate}
                onChange={(date) => setNewTask({ ...newTask, dueDate: date || undefined })}
                dateFormat="dd/MM/yyyy"
                placeholderText="בחר תאריך"
                className="w-full px-4 py-3 bg-slate-900 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                minDate={new Date()}
              />
            </div>
          </div>

          {/* Assignee (placeholder for now) */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              <User className="inline h-4 w-4 ml-1" />
              הקצה למשתמש
            </label>
            <input
              type="text"
              placeholder="שם המשתמש או מזהה (בקרוב...)"
              className="w-full px-4 py-3 bg-slate-900 border border-slate-600 rounded-lg text-gray-500 placeholder-gray-500 cursor-not-allowed"
              disabled
            />
          </div>

          {/* Related To (placeholder) */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              <Link2 className="inline h-4 w-4 ml-1" />
              קשור ל
            </label>
            <select
              className="w-full px-4 py-3 bg-slate-900 border border-slate-600 rounded-lg text-gray-500 cursor-not-allowed"
              disabled
            >
              <option>בחר ישות קשורה (בקרוב...)</option>
            </select>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              className="flex-1 bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors font-medium"
            >
              יצירה
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-slate-700 text-white px-6 py-3 rounded-lg hover:bg-slate-600 transition-colors font-medium"
            >
              ביטול
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Kanban View Component
function KanbanView({ tasksByStatus, onStatusChange, navigate }: any) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {(['todo', 'in_progress', 'done', 'cancelled'] as TaskStatus[]).map((status) => (
        <div key={status} className="flex flex-col">
          {/* Column Header */}
          <div className={`${statusConfig[status].color} rounded-t-lg p-4 border-b-4 ${
            status === 'todo' ? 'border-gray-400' :
            status === 'in_progress' ? 'border-blue-500' :
            status === 'done' ? 'border-green-500' :
            'border-red-500'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{statusConfig[status].icon}</span>
                <span className="font-semibold">
                  {statusConfig[status].label}
                </span>
              </div>
              <span className="bg-white px-3 py-1 rounded-full text-sm font-bold">
                {tasksByStatus[status]?.length || 0}
              </span>
            </div>
          </div>

          {/* Column Content */}
          <div className="bg-slate-800/30 rounded-b-lg p-3 flex-1 min-h-[500px] border border-slate-700/50 border-t-0">
            <div className="space-y-3">
              {tasksByStatus[status]?.map((task: Task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onStatusChange={onStatusChange}
                  navigate={navigate}
                />
              ))}
              {(!tasksByStatus[status] || tasksByStatus[status].length === 0) && (
                <div className="text-center text-gray-500 py-12">
                  אין משימות
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// List View Component (GitHub Issues style)
function ListView({ tasks, onStatusChange, navigate }: any) {
  return (
    <div className="bg-slate-800/50 rounded-lg border border-slate-700/50 overflow-hidden">
      <table className="w-full">
        <thead className="bg-slate-900/50 border-b border-slate-700">
          <tr>
            <th className="text-right px-6 py-4 text-sm font-semibold text-gray-300">כותרת</th>
            <th className="text-right px-6 py-4 text-sm font-semibold text-gray-300">סטטוס</th>
            <th className="text-right px-6 py-4 text-sm font-semibold text-gray-300">עדיפות</th>
            <th className="text-right px-6 py-4 text-sm font-semibold text-gray-300">תאריך יעד</th>
            <th className="text-right px-6 py-4 text-sm font-semibold text-gray-300">נוצר</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-700">
          {tasks.map((task: Task) => (
            <tr key={task.id} className="hover:bg-slate-800/50 transition-colors">
              <td className="px-6 py-4">
                <div className="font-medium text-white">{task.title}</div>
                {task.description && (
                  <div className="text-sm text-gray-400 mt-1 line-clamp-1">{task.description}</div>
                )}
              </td>
              <td className="px-6 py-4">
                <select
                  value={task.status}
                  onChange={(e) => onStatusChange(task.id, e.target.value as TaskStatus)}
                  className={`px-3 py-1 rounded-full text-xs font-medium ${statusConfig[task.status].color} bg-transparent border-0 cursor-pointer`}
                >
                  {Object.entries(statusConfig).map(([value, config]) => (
                    <option key={value} value={value}>
                      {config.icon} {config.label}
                    </option>
                  ))}
                </select>
              </td>
              <td className="px-6 py-4">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${priorityConfig[task.priority].badge}`}>
                  {priorityConfig[task.priority].icon} {priorityConfig[task.priority].label}
                </span>
              </td>
              <td className="px-6 py-4 text-sm text-gray-400">
                {task.dueDate ? (
                  <span className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {new Date(task.dueDate.toDate()).toLocaleDateString('he-IL')}
                  </span>
                ) : (
                  <span className="text-gray-600">-</span>
                )}
              </td>
              <td className="px-6 py-4 text-sm text-gray-400">
                {formatDistanceToNow(task.createdAt.toDate(), {
                  addSuffix: true,
                  locale: he,
                })}
              </td>
            </tr>
          ))}
          {tasks.length === 0 && (
            <tr>
              <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                אין משימות להצגה
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

// Task Card Component (for Kanban)
function TaskCard({ task, onStatusChange, navigate }: { task: Task; onStatusChange: (id: string, status: TaskStatus) => void; navigate: any }) {
  const [showActions, setShowActions] = useState(false);

  return (
    <div 
        onClick={() => navigate(`/admin/tasks/${task.id}`)}
        className="bg-slate-800 rounded-lg p-4 shadow-md hover:shadow-xl transition-all cursor-pointer border border-slate-700 hover:border-indigo-500"
      >
      <div className="flex items-start justify-between mb-2">
        <h3 className="font-medium text-white flex-1 line-clamp-2">{task.title}</h3>
        <button
          onClick={(e) => { e.stopPropagation(); setShowActions(!showActions); }}
          className="text-gray-400 hover:text-white transition-colors"
        >
          ⋮
        </button>
      </div>

      {task.description && (
        <p className="text-sm text-gray-400 mb-3 line-clamp-2">{task.description}</p>
      )}

      {task.dueDate && (
        <div className="flex items-center gap-1 text-xs text-gray-500 mb-2">
          <Calendar className="h-3 w-3" />
          {new Date(task.dueDate.toDate()).toLocaleDateString('he-IL')}
        </div>
      )}

      <div className="flex items-center justify-between text-xs">
        <span className={`px-2 py-1 rounded-full ${priorityConfig[task.priority].badge}`}>
          {priorityConfig[task.priority].icon} {priorityConfig[task.priority].label}
        </span>
        <span className="text-gray-500">
          {formatDistanceToNow(task.createdAt.toDate(), {
            addSuffix: true,
            locale: he,
          })}
        </span>
      </div>

      {/* Quick Actions */}
      {showActions && (
        <div className="mt-3 pt-3 border-t border-slate-700">
          <div className="text-xs font-medium text-gray-400 mb-2">העבר ל:</div>
          <div className="grid grid-cols-2 gap-2">
            {(['todo', 'in_progress', 'done', 'cancelled'] as TaskStatus[])
              .filter((s) => s !== task.status)
              .map((status) => (
                <button
                  key={status}
                  onClick={(e) => {
                    e.stopPropagation();
                    onStatusChange(task.id, status);
                    setShowActions(false);
                  }}
                  className="text-xs px-2 py-1.5 bg-slate-700 hover:bg-slate-600 text-white rounded transition-colors"
                >
                  {statusConfig[status].icon} {statusConfig[status].label}
                </button>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}
