// Tasks API Service - Backend handler for task operations
import type {
	ApiResponse,
	CreateTaskRequest,
	GetTasksQuery,
	Task,
	UpdateTaskRequest,
} from '../../../types/api';
import type { APIService } from './registry';

/**
 * Tasks API Service
 * Handles all TASKS_ prefixed messages
 */
class TasksAPIService implements APIService {
	// In-memory storage for demo (replace with real storage)
	private tasks: Map<string, Task> = new Map();

	async handleMessage(type: string, data: any): Promise<ApiResponse> {
		try {
			switch (type) {
				case 'TASKS_GET_ALL':
					return this.getAllTasks(data);
				case 'TASKS_GET_BY_ID':
					return this.getTaskById(data);
				case 'TASKS_CREATE':
					return this.createTask(data);
				case 'TASKS_UPDATE':
					return this.updateTask(data);
				case 'TASKS_DELETE':
					return this.deleteTask(data);
				case 'TASKS_TOGGLE':
					return this.toggleTask(data);
				default:
					return {
						success: false,
						error: `Unknown tasks message type: ${type}`,
					};
			}
		} catch (error) {
			return {
				success: false,
				error: error instanceof Error ? error.message : 'Unknown error',
			};
		}
	}

	private async getAllTasks(
		query?: GetTasksQuery,
	): Promise<ApiResponse<Task[]>> {
		let tasks = Array.from(this.tasks.values());

		// Apply filters
		if (query?.completed !== undefined) {
			tasks = tasks.filter((task) => task.completed === query.completed);
		}

		if (query?.priority) {
			tasks = tasks.filter((task) => task.priority === query.priority);
		}

		// Apply pagination
		if (query?.offset) {
			tasks = tasks.slice(query.offset);
		}

		if (query?.limit) {
			tasks = tasks.slice(0, query.limit);
		}

		// Sort by creation date (newest first)
		tasks.sort(
			(a, b) =>
				new Date(b.createdAt).getTime() -
				new Date(a.createdAt).getTime(),
		);

		return {
			success: true,
			data: tasks,
			message: `Found ${tasks.length} tasks`,
		};
	}

	private async getTaskById(data: {
		id: string;
	}): Promise<ApiResponse<Task>> {
		const task = this.tasks.get(data.id);

		if (!task) {
			return {
				success: false,
				error: `Task with ID ${data.id} not found`,
			};
		}

		return {
			success: true,
			data: task,
		};
	}

	private async createTask(
		data: CreateTaskRequest,
	): Promise<ApiResponse<Task>> {
		if (!data.title?.trim()) {
			return {
				success: false,
				error: 'Task title is required',
			};
		}

		const now = new Date().toISOString();
		const task: Task = {
			id: `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
			title: data.title.trim(),
			description: data.description?.trim() || '',
			completed: false,
			priority: data.priority || 'medium',
			createdAt: now,
			updatedAt: now,
		};

		this.tasks.set(task.id, task);

		// Save to chrome storage for persistence
		await this.saveToStorage();

		return {
			success: true,
			data: task,
			message: 'Task created successfully',
		};
	}

	private async updateTask(
		data: { id: string } & UpdateTaskRequest,
	): Promise<ApiResponse<Task>> {
		const task = this.tasks.get(data.id);

		if (!task) {
			return {
				success: false,
				error: `Task with ID ${data.id} not found`,
			};
		}

		// Update task properties
		const updatedTask: Task = {
			...task,
			title: data.title?.trim() ?? task.title,
			description: data.description?.trim() ?? task.description,
			completed: data.completed ?? task.completed,
			priority: data.priority ?? task.priority,
			updatedAt: new Date().toISOString(),
		};

		// Validate title is not empty
		if (!updatedTask.title.trim()) {
			return {
				success: false,
				error: 'Task title cannot be empty',
			};
		}

		this.tasks.set(data.id, updatedTask);

		// Save to chrome storage for persistence
		await this.saveToStorage();

		return {
			success: true,
			data: updatedTask,
			message: 'Task updated successfully',
		};
	}

	private async deleteTask(data: { id: string }): Promise<ApiResponse<void>> {
		const task = this.tasks.get(data.id);

		if (!task) {
			return {
				success: false,
				error: `Task with ID ${data.id} not found`,
			};
		}

		this.tasks.delete(data.id);

		// Save to chrome storage for persistence
		await this.saveToStorage();

		return {
			success: true,
			message: 'Task deleted successfully',
		};
	}

	private async toggleTask(data: { id: string }): Promise<ApiResponse<Task>> {
		const task = this.tasks.get(data.id);

		if (!task) {
			return {
				success: false,
				error: `Task with ID ${data.id} not found`,
			};
		}

		const updatedTask: Task = {
			...task,
			completed: !task.completed,
			updatedAt: new Date().toISOString(),
		};

		this.tasks.set(data.id, updatedTask);

		// Save to chrome storage for persistence
		await this.saveToStorage();

		return {
			success: true,
			data: updatedTask,
			message: `Task ${updatedTask.completed ? 'completed' : 'reopened'}`,
		};
	}

	/**
	 * Save tasks to Chrome storage for persistence
	 */
	private async saveToStorage(): Promise<void> {
		try {
			const tasksArray = Array.from(this.tasks.entries());
			await chrome.storage.local.set({ tasks: tasksArray });
		} catch (error) {
			console.error('Failed to save tasks to storage:', error);
		}
	}

	/**
	 * Load tasks from Chrome storage
	 */
	private async loadFromStorage(): Promise<void> {
		try {
			const result = await chrome.storage.local.get(['tasks']);
			if (result.tasks && Array.isArray(result.tasks)) {
				this.tasks = new Map(result.tasks);
			}
		} catch (error) {
			console.error('Failed to load tasks from storage:', error);
		}
	}

	/**
	 * Initialize the service (load data from storage)
	 */
	async initialize(): Promise<void> {
		await this.loadFromStorage();

		// Add some demo tasks if storage is empty
		if (this.tasks.size === 0) {
			await this.createDemoTasks();
		}
	}

	/**
	 * Create demo tasks for testing
	 */
	private async createDemoTasks(): Promise<void> {
		const demoTasks: CreateTaskRequest[] = [
			{
				title: 'Welcome to Tasks!',
				description: 'This is a demo task to get you started.',
				priority: 'high',
			},
			{
				title: 'Try creating a new task',
				description: 'Click the + button to add your own task.',
				priority: 'medium',
			},
			{
				title: 'Mark tasks as complete',
				description: 'Click the checkbox to complete tasks.',
				priority: 'low',
			},
		];

		for (const taskData of demoTasks) {
			await this.createTask(taskData);
		}
	}
}

// Create and export the service instance
export const tasksAPIService = new TasksAPIService();

// Initialize the service
tasksAPIService.initialize().catch(console.error);
