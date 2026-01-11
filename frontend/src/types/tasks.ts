import { Timestamp } from 'firebase/firestore';

export type TaskStatus = 'todo' | 'in_progress' | 'done' | 'cancelled';
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface Task {
  id: string;
  tenantId: string;
  
  // Basic Info
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  
  // Assignment
  assignee?: string;        // User ID
  assignedBy?: string;      // User ID
  assignedAt?: Timestamp;
  
  // Relations
  relatedTo?: {
    type: 'finding' | 'inspection' | 'client' | 'equipment';
    id: string;
  };
  
  // Metadata
  createdBy: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  dueDate?: Timestamp;
  completedAt?: Timestamp;
  
  // Comments & Watchers
  commentsCount: number;
  watchers: string[];       // User IDs
}

export interface CreateTaskInput {
  title: string;
  description?: string;
  priority?: TaskPriority;
  assignee?: string;
  dueDate?: Date;
  relatedTo?: {
    type: 'finding' | 'inspection' | 'client' | 'equipment';
    id: string;
  };
}

export interface UpdateTaskInput {
  title?: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  assignee?: string;
  dueDate?: Date;
}
