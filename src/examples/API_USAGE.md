# Complete End-to-End API Example

This guide shows how to create a complete API flow from frontend to background script with shared types and reusable hooks.

## 🏗️ Architecture Overview

```
Frontend Component
      ↓
 React Hook (useTasks)
      ↓
 Generic Hook (useAPI)
      ↓
chrome.runtime.sendMessage
      ↓
Background Script (messaging.ts)
      ↓
Service Registry (registry.ts)
      ↓
Tasks API Service (tasks.ts)
      ↓
Chrome Storage
```

## 📝 Complete Example: Tasks API

### 1. **Shared Types** (`/src/types/api.ts`)

```typescript
// Shared between frontend and backend
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

export interface ApiResponse<T = any> {
	success: boolean;
	data?: T;
	error?: string;
	message?: string;
}
```

### 2. **Generic API Hook** (`/src/hooks/useAPI.ts`)

```typescript
// Reusable hook for any API call
export function useAPI<T = any>(): UseAPIReturn<T> {
	const [state, setState] = useState<UseAPIState<T>>({
		data: null,
		loading: false,
		error: null,
	});

	const execute = useCallback(async (messageType: string, payload?: any) => {
		setState((prev) => ({ ...prev, loading: true, error: null }));

		const response = await sendMessageToBackground<T>(messageType, payload);

		if (response.success) {
			setState({
				data: response.data || null,
				loading: false,
				error: null,
			});
		} else {
			setState({
				data: null,
				loading: false,
				error: response.error || 'Unknown error',
			});
		}

		return response;
	}, []);

	return { data: state.data, loading, error, execute, reset };
}
```

### 3. **Domain-Specific Hook** (`/src/hooks/useTasks.ts`)

```typescript
// Specific hook for tasks
export function useTasks(): UseTasksReturn {
	const { data: tasks, loading, error, execute, reset } = useAPI<Task[]>();
	const apiCall = useAPICall();

	const getTasks = useCallback(
		async (query?: GetTasksQuery) => {
			return execute('TASKS_GET_ALL', query);
		},
		[execute],
	);

	const createTask = useCallback(
		async (task: CreateTaskRequest) => {
			const response = await apiCall<Task>('TASKS_CREATE', task);
			if (response.success) {
				await getTasks(); // Refresh list
			}
			return response;
		},
		[apiCall, getTasks],
	);

	return {
		tasks,
		loading,
		error,
		getTasks,
		createTask,
		updateTask,
		deleteTask,
		toggleTask,
		reset,
	};
}
```

### 4. **Backend Service** (`/src/background/services/api/tasks.ts`)

```typescript
// Backend service handling TASKS_ messages
class TasksAPIService implements APIService {
	private tasks: Map<string, Task> = new Map();

	async handleMessage(type: string, data: any): Promise<ApiResponse> {
		switch (type) {
			case 'TASKS_GET_ALL':
				return this.getAllTasks(data);
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
	}

	private async createTask(
		data: CreateTaskRequest,
	): Promise<ApiResponse<Task>> {
		const task: Task = {
			id: `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
			title: data.title.trim(),
			description: data.description?.trim() || '',
			completed: false,
			priority: data.priority || 'medium',
			createdAt: new Date().toISOString(),
			updatedAt: new Date().toISOString(),
		};

		this.tasks.set(task.id, task);
		await this.saveToStorage();

		return {
			success: true,
			data: task,
			message: 'Task created successfully',
		};
	}
}
```

### 5. **Service Registry** (`/src/background/services/api/registry.ts`)

```typescript
// Clean service registration
const serviceRegistry = new Map<string, APIService>([
	['USERS_', usersAPIService],
	['LLM_', llmAPIService],
	['TASKS_', tasksAPIService], // ← Add new services here
]);

export function getServiceForMessage(messageType: string): APIService | null {
	for (const [prefix, service] of serviceRegistry) {
		if (messageType.startsWith(prefix)) {
			return service;
		}
	}
	return null;
}
```

### 6. **React Component Usage** (`/src/components/modules/TasksExample.tsx`)

```typescript
export function TasksExample() {
  // Use the hook
  const { tasks, loading, error, getTasks, createTask, toggleTask, deleteTask } = useTasks();

  // Load tasks on mount
  useEffect(() => {
    getTasks();
  }, [getTasks]);

  // Handle form submission
  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();

    const taskData: CreateTaskRequest = {
      title: newTaskTitle,
      description: newTaskDescription,
      priority: newTaskPriority,
    };

    const response = await createTask(taskData);

    if (response.success) {
      // Clear form
      setNewTaskTitle('');
      setNewTaskDescription('');
    }
  };

  return (
    <div>
      {/* Create form */}
      <form onSubmit={handleCreateTask}>
        <input
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
          placeholder="Task title..."
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Creating...' : 'Create Task'}
        </button>
      </form>

      {/* Tasks list */}
      {loading && <div>Loading...</div>}
      {error && <div>Error: {error}</div>}
      {tasks?.map(task => (
        <div key={task.id}>
          <input
            type="checkbox"
            checked={task.completed}
            onChange={() => toggleTask(task.id)}
          />
          <span>{task.title}</span>
          <button onClick={() => deleteTask(task.id)}>Delete</button>
        </div>
      ))}
    </div>
  );
}
```

## 🚀 **Message Flow Example**

When you call `createTask()`:

1. **Frontend Hook**: `createTask({ title: "New Task", priority: "high" })`
2. **Generic Hook**: `sendMessageToBackground('TASKS_CREATE', data)`
3. **Chrome Message**: `{ type: 'TASKS_CREATE', data: { title: "New Task", priority: "high" } }`
4. **Background Handler**: `handleMessage('TASKS_CREATE', data)`
5. **Service Registry**: `getServiceForMessage('TASKS_CREATE')` → returns `tasksAPIService`
6. **Tasks Service**: `tasksAPIService.handleMessage('TASKS_CREATE', data)`
7. **Business Logic**: Create task, save to storage
8. **Response**: `{ success: true, data: newTask, message: "Task created successfully" }`
9. **Frontend Update**: Hook updates state, triggers re-render

## ✨ **Key Benefits**

1. **Type Safety**: Shared types ensure consistency
2. **Reusability**: Generic hooks can be used for any API
3. **Scalability**: Easy to add new services
4. **Maintainability**: Clean separation of concerns
5. **Error Handling**: Consistent error handling throughout
6. **State Management**: Automatic loading/error states
7. **Persistence**: Chrome storage integration

## 📦 **Adding New Services**

To add a new service (e.g., "NOTES\_"):

1. **Add types** to `/types/api.ts`
2. **Create service** in `/background/services/api/notes.ts`
3. **Register service** in `/registry.ts`: `['NOTES_', notesAPIService]`
4. **Create hook** in `/hooks/useNotes.ts`
5. **Use in components**

That's it! The system will automatically route all `NOTES_*` messages to your service.

## 🔧 **Usage Patterns**

### Simple one-off call:

```typescript
const apiCall = useAPICall();
const response = await apiCall('TASKS_GET_BY_ID', { id: 'task123' });
```

### State management:

```typescript
const { data, loading, error, execute } = useAPI<Task[]>();
await execute('TASKS_GET_ALL');
```

### Domain-specific operations:

```typescript
const { tasks, createTask, deleteTask } = useTasks();
```

The system is designed to be extremely scalable and maintainable while providing excellent developer experience with full type safety! 🎉
