import { useState, useEffect } from 'react';
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  addDoc,
  updateDoc,
  doc,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';
import { firestore, auth } from '../firebase';
import { Task, CreateTaskInput, UpdateTaskInput, TaskStatus } from '../types/tasks';

export function useTasks(status?: TaskStatus) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      let q = query(
        collection(firestore, 'tasks'),
        where('tenantId', '==', user.uid),
        orderBy('createdAt', 'desc')
      );

      if (status) {
        q = query(
          collection(firestore, 'tasks'),
          where('tenantId', '==', user.uid),
          where('status', '==', status),
          orderBy('createdAt', 'desc')
        );
      }

      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          const tasksData = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
            createdAt: doc.data().createdAt || Timestamp.now(),
            updatedAt: doc.data().updatedAt || Timestamp.now(),
          })) as Task[];

          setTasks(tasksData);
          setLoading(false);
        },
        (err) => {
          console.error('Error fetching tasks:', err);
          setError(err.message);
          setLoading(false);
        }
      );

      return () => unsubscribe();
    } catch (err) {
      console.error('Error setting up tasks listener:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
      setLoading(false);
    }
  }, [status]);

  const createTask = async (input: CreateTaskInput): Promise<string> => {
    const user = auth.currentUser;
    if (!user) throw new Error('User not authenticated');

    // Build taskData object, only include defined fields
    const taskData: any = {
      tenantId: user.uid,
      title: input.title,
      description: input.description || '',
      status: 'todo' as TaskStatus,
      priority: input.priority || 'medium',
      createdBy: user.uid,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      commentsCount: 0,
      watchers: [user.uid], // Creator is always a watcher
    };

    // Only add assignee if it's defined and not empty
    if (input.assignee) {
      taskData.assignee = input.assignee;
      taskData.assignedBy = user.uid;
      taskData.assignedAt = serverTimestamp();
    }

    // Only add relatedTo if defined
    if (input.relatedTo) {
      taskData.relatedTo = input.relatedTo;
    }

    // Only add dueDate if defined
    if (input.dueDate) {
      taskData.dueDate = Timestamp.fromDate(input.dueDate);
    }

    const docRef = await addDoc(collection(firestore, 'tasks'), taskData);
    return docRef.id;
  };

  const updateTask = async (taskId: string, updates: UpdateTaskInput): Promise<void> => {
    const taskRef = doc(firestore, 'tasks', taskId);
    
    const updateData: any = {
      updatedAt: serverTimestamp(),
    };

    // Only include defined fields
    if (updates.title !== undefined) updateData.title = updates.title;
    if (updates.description !== undefined) updateData.description = updates.description;
    if (updates.status !== undefined) updateData.status = updates.status;
    if (updates.priority !== undefined) updateData.priority = updates.priority;
    if (updates.assignee !== undefined) updateData.assignee = updates.assignee;

    if (updates.dueDate) {
      updateData.dueDate = Timestamp.fromDate(updates.dueDate);
    }

    if (updates.status === 'done') {
      updateData.completedAt = serverTimestamp();
    }

    await updateDoc(taskRef, updateData);
  };

  const updateTaskStatus = async (taskId: string, status: TaskStatus): Promise<void> => {
    await updateTask(taskId, { status });
  };

  const assignTask = async (taskId: string, assignee: string): Promise<void> => {
    const user = auth.currentUser;
    if (!user) throw new Error('User not authenticated');

    await updateDoc(doc(firestore, 'tasks', taskId), {
      assignee,
      assignedBy: user.uid,
      assignedAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  };

  return {
    tasks,
    loading,
    error,
    createTask,
    updateTask,
    updateTaskStatus,
    assignTask,
  };
}
