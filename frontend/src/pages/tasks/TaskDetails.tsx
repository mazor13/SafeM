import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, updateDoc, collection, addDoc, query, orderBy, onSnapshot, serverTimestamp } from 'firebase/firestore';
import { firestore, auth } from '../../firebase';
import { Task, TaskStatus, TaskPriority } from '../../types/tasks';
import { formatDistanceToNow } from 'date-fns';
import { he } from 'date-fns/locale';
import DatePicker from 'react-datepicker';
import { 
  ArrowLeft, 
  Calendar, 
  User, 
  Tag, 
  MessageSquare,
  Clock,
  Edit2,
  Save,
  X,
  Trash2
} from 'lucide-react';

const statusConfig = {
  todo: { label: 'לביצוע', color: 'bg-gray-100 text-gray-800', icon: '📋' },
  in_progress: { label: 'בביצוע', color: 'bg-blue-100 text-blue-800', icon: '⏳' },
  done: { label: 'הושלם', color: 'bg-green-100 text-green-800', icon: '✅' },
  cancelled: { label: 'בוטל', color: 'bg-red-100 text-red-800', icon: '❌' },
};

const priorityConfig = {
  low: { label: 'נמוכה', badge: 'bg-gray-100 text-gray-700', icon: '🔵' },
  medium: { label: 'בינונית', badge: 'bg-yellow-100 text-yellow-700', icon: '🟡' },
  high: { label: 'גבוהה', badge: 'bg-orange-100 text-orange-700', icon: '🟠' },
  urgent: { label: 'דחוף', badge: 'bg-red-100 text-red-700', icon: '🔴' },
};

interface Comment {
  id: string;
  taskId: string;
  userId: string;
  userName: string;
  text: string;
  createdAt: any;
}

export default function TaskDetails() {
  const { taskId } = useParams<{ taskId: string }>();
  const navigate = useNavigate();
  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  
  const [editData, setEditData] = useState<Partial<Task>>({});

  // Load task
  useEffect(() => {
    if (!taskId) return;

    const loadTask = async () => {
      try {
        const taskDoc = await getDoc(doc(firestore, 'tasks', taskId));
        if (taskDoc.exists()) {
          const taskData = { id: taskDoc.id, ...taskDoc.data() } as Task;
          setTask(taskData);
          setEditData(taskData);
        }
        setLoading(false);
      } catch (error) {
        console.error('Error loading task:', error);
        setLoading(false);
      }
    };

    loadTask();
  }, [taskId]);

  // Load comments
  useEffect(() => {
    if (!taskId) return;

    const q = query(
      collection(firestore, 'tasks', taskId, 'comments'),
      orderBy('createdAt', 'asc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const commentsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Comment[];
      setComments(commentsData);
    });

    return () => unsubscribe();
  }, [taskId]);

  const handleSave = async () => {
    if (!taskId) return;

    try {
      const updateData: any = {
        title: editData.title,
        description: editData.description,
        status: editData.status,
        priority: editData.priority,
        updatedAt: serverTimestamp(),
      };

      if (editData.dueDate) {
        updateData.dueDate = editData.dueDate;
      }

      await updateDoc(doc(firestore, 'tasks', taskId), updateData);
      
      // Reload task
      const taskDoc = await getDoc(doc(firestore, 'tasks', taskId));
      if (taskDoc.exists()) {
        setTask({ id: taskDoc.id, ...taskDoc.data() } as Task);
      }
      
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating task:', error);
      alert('שגיאה בעדכון המשימה');
    }
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskId || !newComment.trim()) return;

    const user = auth.currentUser;
    if (!user) return;

    try {
      await addDoc(collection(firestore, 'tasks', taskId, 'comments'), {
        taskId,
        userId: user.uid,
        userName: user.displayName || user.email || 'Anonymous',
        text: newComment,
        createdAt: serverTimestamp(),
      });

      // Update comments count
      await updateDoc(doc(firestore, 'tasks', taskId), {
        commentsCount: comments.length + 1,
      });

      setNewComment('');
    } catch (error) {
      console.error('Error adding comment:', error);
      alert('שגיאה בהוספת תגובה');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#0f172a]">
        <div className="text-gray-400">טוען משימה...</div>
      </div>
    );
  }

  if (!task) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-[#0f172a]">
        <div className="text-gray-400 mb-4">משימה לא נמצאה</div>
        <button
          onClick={() => navigate('/admin/tasks')}
          className="text-indigo-400 hover:text-indigo-300"
        >
          חזרה למשימות
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f172a] p-6">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => navigate('/admin/tasks')}
          className="flex items-center gap-2 text-gray-400 hover:text-white mb-4 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          חזרה למשימות
        </button>

        <div className="flex items-start justify-between">
          <div className="flex-1">
            {isEditing ? (
              <input
                type="text"
                value={editData.title}
                onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                className="text-3xl font-bold bg-slate-800 text-white px-4 py-2 rounded-lg border border-slate-600 w-full mb-2"
              />
            ) : (
              <h1 className="text-3xl font-bold text-white mb-2">{task.title}</h1>
            )}
            
            <div className="flex items-center gap-3 text-sm text-gray-400">
              <span>נוצר {formatDistanceToNow(task.createdAt.toDate(), { addSuffix: true, locale: he })}</span>
              <span>•</span>
              <span>{comments.length} תגובות</span>
            </div>
          </div>

          <div className="flex gap-2">
            {isEditing ? (
              <>
                <button
                  onClick={handleSave}
                  className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  <Save className="h-4 w-4" />
                  שמור
                </button>
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setEditData(task);
                  }}
                  className="flex items-center gap-2 bg-slate-700 text-white px-4 py-2 rounded-lg hover:bg-slate-600 transition-colors"
                >
                  <X className="h-4 w-4" />
                  ביטול
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2 bg-slate-700 text-white px-4 py-2 rounded-lg hover:bg-slate-600 transition-colors"
              >
                <Edit2 className="h-4 w-4" />
                עריכה
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Description */}
          <div className="bg-slate-800/50 rounded-lg p-6 border border-slate-700/50">
            <h2 className="text-lg font-semibold text-white mb-4">תיאור</h2>
            {isEditing ? (
              <textarea
                value={editData.description || ''}
                onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                className="w-full bg-slate-900 text-white px-4 py-3 rounded-lg border border-slate-600 focus:ring-2 focus:ring-indigo-500"
                rows={6}
                placeholder="הוסף תיאור למשימה..."
              />
            ) : (
              <p className="text-gray-300 whitespace-pre-wrap">
                {task.description || 'אין תיאור'}
              </p>
            )}
          </div>

          {/* Comments */}
          <div className="bg-slate-800/50 rounded-lg p-6 border border-slate-700/50">
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              תגובות ({comments.length})
            </h2>

            {/* Comment Form */}
            <form onSubmit={handleAddComment} className="mb-6">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="w-full bg-slate-900 text-white px-4 py-3 rounded-lg border border-slate-600 focus:ring-2 focus:ring-indigo-500 mb-2"
                rows={3}
                placeholder="הוסף תגובה..."
              />
              <button
                type="submit"
                disabled={!newComment.trim()}
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                שלח תגובה
              </button>
            </form>

            {/* Comments List */}
            <div className="space-y-4">
              {comments.map((comment) => (
                <div key={comment.id} className="bg-slate-900/50 rounded-lg p-4 border border-slate-700/30">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-white">{comment.userName}</span>
                    <span className="text-xs text-gray-500">
                      {comment.createdAt && formatDistanceToNow(comment.createdAt.toDate(), { 
                        addSuffix: true, 
                        locale: he 
                      })}
                    </span>
                  </div>
                  <p className="text-gray-300 whitespace-pre-wrap">{comment.text}</p>
                </div>
              ))}
              {comments.length === 0 && (
                <div className="text-center text-gray-500 py-8">
                  אין תגובות עדיין
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Status */}
          <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700/50">
            <label className="block text-sm font-medium text-gray-300 mb-2">סטטוס</label>
            {isEditing ? (
              <select
                value={editData.status}
                onChange={(e) => setEditData({ ...editData, status: e.target.value as TaskStatus })}
                className="w-full bg-slate-900 text-white px-3 py-2 rounded-lg border border-slate-600"
              >
                {Object.entries(statusConfig).map(([value, config]) => (
                  <option key={value} value={value}>
                    {config.icon} {config.label}
                  </option>
                ))}
              </select>
            ) : (
              <span className={`inline-block px-3 py-2 rounded-lg ${statusConfig[task.status].color} font-medium`}>
                {statusConfig[task.status].icon} {statusConfig[task.status].label}
              </span>
            )}
          </div>

          {/* Priority */}
          <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700/50">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              <Tag className="inline h-4 w-4 ml-1" />
              עדיפות
            </label>
            {isEditing ? (
              <select
                value={editData.priority}
                onChange={(e) => setEditData({ ...editData, priority: e.target.value as TaskPriority })}
                className="w-full bg-slate-900 text-white px-3 py-2 rounded-lg border border-slate-600"
              >
                {Object.entries(priorityConfig).map(([value, config]) => (
                  <option key={value} value={value}>
                    {config.icon} {config.label}
                  </option>
                ))}
              </select>
            ) : (
              <span className={`inline-block px-3 py-2 rounded-lg ${priorityConfig[task.priority].badge} font-medium`}>
                {priorityConfig[task.priority].icon} {priorityConfig[task.priority].label}
              </span>
            )}
          </div>

          {/* Due Date */}
          <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700/50">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              <Calendar className="inline h-4 w-4 ml-1" />
              תאריך יעד
            </label>
            {isEditing ? (
              <DatePicker
                selected={editData.dueDate ? editData.dueDate.toDate() : null}
                onChange={(date) => setEditData({ 
                  ...editData, 
                  dueDate: date ? { toDate: () => date } as any : undefined 
                })}
                dateFormat="dd/MM/yyyy"
                placeholderText="בחר תאריך"
                className="w-full bg-slate-900 text-white px-3 py-2 rounded-lg border border-slate-600"
                minDate={new Date()}
              />
            ) : (
              <div className="text-white">
                {task.dueDate ? (
                  new Date(task.dueDate.toDate()).toLocaleDateString('he-IL')
                ) : (
                  <span className="text-gray-500">לא הוגדר</span>
                )}
              </div>
            )}
          </div>

          {/* Assignee */}
          <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700/50">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              <User className="inline h-4 w-4 ml-1" />
              מוקצה ל
            </label>
            <div className="text-gray-500">לא הוקצה</div>
          </div>

          {/* Metadata */}
          <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700/50">
            <h3 className="text-sm font-medium text-gray-300 mb-3">מידע נוסף</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2 text-gray-400">
                <Clock className="h-4 w-4" />
                <span>נוצר: {new Date(task.createdAt.toDate()).toLocaleDateString('he-IL')}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-400">
                <Clock className="h-4 w-4" />
                <span>עודכן: {new Date(task.updatedAt.toDate()).toLocaleDateString('he-IL')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
