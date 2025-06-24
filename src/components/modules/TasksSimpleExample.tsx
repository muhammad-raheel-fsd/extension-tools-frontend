// Tasks Simple Example - Using only the unified useMessage hook
import React, { useState } from 'react';
import { useMessage, useMessageCall } from '../../hooks/useMessage';
import type { CreateTaskRequest, Task } from '../../types/api';

interface TasksSimpleExampleProps {
	className?: string;
}

export function TasksSimpleExample({ className }: TasksSimpleExampleProps) {
	// Single hook with auto-loading - no useEffect needed!
	const {
		data: tasks,
		loading,
		error,
		send,
		reload,
		reset,
	} = useMessage<Task[]>({
		autoLoad: 'TASKS_GET_ALL',
	});
	const sendMessage = useMessageCall();

	// Form state
	const [newTaskTitle, setNewTaskTitle] = useState('');
	const [newTaskDescription, setNewTaskDescription] = useState('');
	const [newTaskPriority, setNewTaskPriority] = useState<
		'low' | 'medium' | 'high'
	>('medium');

	// Load all tasks (now just calls reload)
	const loadTasks = async () => {
		await reload();
	};

	// Create new task
	const handleCreateTask = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!newTaskTitle.trim()) return;

		const taskData: CreateTaskRequest = {
			title: newTaskTitle,
			description: newTaskDescription || undefined,
			priority: newTaskPriority,
		};

		const response = await sendMessage('TASKS_CREATE', taskData);

		if (response.success) {
			// Clear form and reload tasks
			setNewTaskTitle('');
			setNewTaskDescription('');
			setNewTaskPriority('medium');
			await loadTasks();
		}
	};

	// Toggle task completion
	const handleToggleTask = async (taskId: string) => {
		const response = await sendMessage('TASKS_TOGGLE', { id: taskId });
		if (response.success) {
			await loadTasks();
		}
	};

	// Delete task
	const handleDeleteTask = async (taskId: string) => {
		if (confirm('Are you sure you want to delete this task?')) {
			const response = await sendMessage('TASKS_DELETE', { id: taskId });
			if (response.success) {
				await loadTasks();
			}
		}
	};

	// Get priority color
	const getPriorityColor = (priority: string) => {
		switch (priority) {
			case 'high':
				return 'text-red-600 bg-red-100';
			case 'medium':
				return 'text-yellow-600 bg-yellow-100';
			case 'low':
				return 'text-green-600 bg-green-100';
			default:
				return 'text-gray-600 bg-gray-100';
		}
	};

	return (
		<div className={`mx-auto max-w-4xl p-6 ${className}`}>
			<div className='mb-8'>
				<h1 className='mb-2 text-3xl font-bold text-gray-900'>
					Tasks Manager (Simple)
				</h1>
				<p className='text-gray-600'>
					Using single <code>useMessage</code> hook for all operations
				</p>
			</div>

			{/* Create Task Form */}
			<div className='mb-6 rounded-lg bg-white p-6 shadow-md'>
				<h2 className='mb-4 text-xl font-semibold'>Create New Task</h2>
				<form onSubmit={handleCreateTask} className='space-y-4'>
					<div>
						<label className='mb-1 block text-sm font-medium text-gray-700'>
							Title *
						</label>
						<input
							type='text'
							value={newTaskTitle}
							onChange={(e) => setNewTaskTitle(e.target.value)}
							className='w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
							placeholder='Enter task title...'
							required
						/>
					</div>

					<div>
						<label className='mb-1 block text-sm font-medium text-gray-700'>
							Description
						</label>
						<textarea
							value={newTaskDescription}
							onChange={(e) =>
								setNewTaskDescription(e.target.value)
							}
							className='w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
							rows={3}
							placeholder='Enter task description...'
						/>
					</div>

					<div>
						<label className='mb-1 block text-sm font-medium text-gray-700'>
							Priority
						</label>
						<select
							value={newTaskPriority}
							onChange={(e) =>
								setNewTaskPriority(
									e.target.value as 'low' | 'medium' | 'high',
								)
							}
							className='rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
						>
							<option value='low'>Low</option>
							<option value='medium'>Medium</option>
							<option value='high'>High</option>
						</select>
					</div>

					<button
						type='submit'
						disabled={loading || !newTaskTitle.trim()}
						className='w-full rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50'
					>
						{loading ? 'Creating...' : 'Create Task'}
					</button>
				</form>
			</div>

			{/* Controls */}
			<div className='mb-6 flex items-center justify-between'>
				<h2 className='text-xl font-semibold'>
					Tasks ({tasks?.length || 0})
				</h2>

				<div className='space-x-2'>
					<button
						onClick={loadTasks}
						disabled={loading}
						className='rounded-md bg-gray-600 px-4 py-2 text-white hover:bg-gray-700 disabled:opacity-50'
					>
						{loading ? 'Loading...' : 'Refresh'}
					</button>

					<button
						onClick={reset}
						className='rounded-md bg-gray-400 px-4 py-2 text-white hover:bg-gray-500'
					>
						Clear
					</button>
				</div>
			</div>

			{/* Error Display */}
			{error && (
				<div className='mb-6 rounded border border-red-400 bg-red-100 px-4 py-3 text-red-700'>
					Error: {error}
				</div>
			)}

			{/* Tasks List */}
			<div className='rounded-lg bg-white shadow-md'>
				{loading && (!tasks || tasks.length === 0) ? (
					<div className='p-8 text-center text-gray-500'>
						Loading tasks...
					</div>
				) : !tasks || tasks.length === 0 ? (
					<div className='p-8 text-center text-gray-500'>
						No tasks found. Create your first task!
					</div>
				) : (
					<div className='divide-y divide-gray-200'>
						{tasks.map((task) => (
							<div key={task.id} className='p-4 hover:bg-gray-50'>
								<div className='flex items-start space-x-3'>
									<input
										type='checkbox'
										checked={task.completed}
										onChange={() =>
											handleToggleTask(task.id)
										}
										className='mt-1 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500'
									/>

									<div className='min-w-0 flex-1'>
										<div className='mb-1 flex items-center space-x-2'>
											<h3
												className={`text-lg font-medium ${
													task.completed
														? 'text-gray-500 line-through'
														: 'text-gray-900'
												}`}
											>
												{task.title}
											</h3>
											<span
												className={`rounded-full px-2 py-1 text-xs ${getPriorityColor(task.priority)}`}
											>
												{task.priority}
											</span>
										</div>

										{task.description && (
											<p
												className={`text-sm ${
													task.completed
														? 'text-gray-400'
														: 'text-gray-600'
												}`}
											>
												{task.description}
											</p>
										)}

										<div className='mt-2 flex items-center space-x-4 text-xs text-gray-500'>
											<span>
												Created:{' '}
												{new Date(
													task.createdAt,
												).toLocaleDateString()}
											</span>
											<span>
												Updated:{' '}
												{new Date(
													task.updatedAt,
												).toLocaleDateString()}
											</span>
										</div>
									</div>

									<button
										onClick={() =>
											handleDeleteTask(task.id)
										}
										className='p-1 text-red-600 hover:text-red-800'
										title='Delete task'
									>
										<svg
											className='h-5 w-5'
											fill='none'
											stroke='currentColor'
											viewBox='0 0 24 24'
										>
											<path
												strokeLinecap='round'
												strokeLinejoin='round'
												strokeWidth={2}
												d='M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16'
											/>
										</svg>
									</button>
								</div>
							</div>
						))}
					</div>
				)}
			</div>

			{/* Usage Examples */}
			<div className='mt-8 rounded-lg bg-gray-100 p-4'>
				<h3 className='mb-2 font-semibold'>Usage Examples:</h3>
				<pre className='space-y-1 text-sm text-gray-700'>
					{`// Load tasks
await send('TASKS_GET_ALL');

// Create task
await sendMessage('TASKS_CREATE', { 
  title: 'New task', 
  priority: 'high' 
});

// Update task
await sendMessage('TASKS_UPDATE', { 
  id: 'task123', 
  completed: true 
});

// Delete task
await sendMessage('TASKS_DELETE', { id: 'task123' });

// Get users
await send('USERS_GET_ALL');

// Create user
await sendMessage('USERS_CREATE', { 
  name: 'John', 
  email: 'john@example.com' 
});`}
				</pre>
			</div>
		</div>
	);
}
