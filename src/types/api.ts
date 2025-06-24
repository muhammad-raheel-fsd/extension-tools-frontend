// Shared API Types - Used by both frontend and backend

// Common API Response wrapper
export interface ApiResponse<T = any> {
	success: boolean;
	data?: T;
	error?: string;
	message?: string;
}

// Task-related types
export interface Task {
	id: string;
	title: string;
	description?: string;
	completed: boolean;
	priority: 'low' | 'medium' | 'high';
	createdAt: string;
	updatedAt: string;
}

export interface CreateTaskRequest {
	title: string;
	description?: string;
	priority?: 'low' | 'medium' | 'high';
}

export interface UpdateTaskRequest {
	title?: string;
	description?: string;
	completed?: boolean;
	priority?: 'low' | 'medium' | 'high';
}

export interface GetTasksQuery {
	completed?: boolean;
	priority?: 'low' | 'medium' | 'high';
	limit?: number;
	offset?: number;
}

// Generic API message structure
export interface ApiMessage<T = any> {
	type: string;
	data?: T;
}

// API Error types
export interface ApiError {
	code: string;
	message: string;
	details?: any;
}
