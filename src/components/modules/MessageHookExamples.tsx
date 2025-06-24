// Examples of different useMessage patterns
import { useState } from 'react';
import { useMessage, useMessageCall } from '../../hooks/useMessage';
import type { Task } from '../../types/api';

// Quick User type for demo
interface User {
	name: string;
	email: string;
}

export function MessageHookExamples() {
	const [selectedExample, setSelectedExample] = useState<string>('tasks');

	return (
		<div className='mx-auto max-w-4xl p-6'>
			<h1 className='mb-6 text-3xl font-bold'>
				useMessage Hook Examples
			</h1>

			{/* Example Selector */}
			<div className='mb-6 flex space-x-2'>
				<button
					onClick={() => setSelectedExample('tasks')}
					className={`rounded px-4 py-2 ${selectedExample === 'tasks' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
				>
					Auto-load Tasks
				</button>
				<button
					onClick={() => setSelectedExample('users')}
					className={`rounded px-4 py-2 ${selectedExample === 'users' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
				>
					Manual Users
				</button>
				<button
					onClick={() => setSelectedExample('oneoff')}
					className={`rounded px-4 py-2 ${selectedExample === 'oneoff' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
				>
					One-off Calls
				</button>
			</div>

			{selectedExample === 'tasks' && <AutoLoadTasksExample />}
			{selectedExample === 'users' && <ManualUsersExample />}
			{selectedExample === 'oneoff' && <OneOffCallsExample />}
		</div>
	);
}

// Example 1: Auto-load data on mount
function AutoLoadTasksExample() {
	// ✨ Auto-loads TASKS_GET_ALL on mount - no useEffect needed!
	const {
		data: tasks,
		loading,
		error,
		reload,
	} = useMessage<Task[]>({
		autoLoad: 'TASKS_GET_ALL',
	});

	return (
		<div className='rounded-lg bg-white p-6 shadow-md'>
			<h2 className='mb-4 text-xl font-semibold'>Auto-load Example</h2>
			<p className='mb-4 text-gray-600'>
				Tasks are automatically loaded on mount. No useEffect required!
			</p>

			<div className='mb-4'>
				<button
					onClick={reload}
					disabled={loading}
					className='rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50'
				>
					{loading ? 'Loading...' : 'Reload Tasks'}
				</button>
			</div>

			{error && <div className='mb-4 text-red-600'>Error: {error}</div>}

			<div className='space-y-2'>
				{tasks?.map((task) => (
					<div key={task.id} className='rounded border p-3'>
						<div className='flex items-center space-x-2'>
							<input
								type='checkbox'
								checked={task.completed}
								readOnly
							/>
							<span
								className={
									task.completed
										? 'text-gray-500 line-through'
										: ''
								}
							>
								{task.title}
							</span>
							<span
								className={`rounded px-2 py-1 text-xs ${
									task.priority === 'high'
										? 'bg-red-100 text-red-800'
										: task.priority === 'medium'
											? 'bg-yellow-100 text-yellow-800'
											: 'bg-green-100 text-green-800'
								}`}
							>
								{task.priority}
							</span>
						</div>
					</div>
				))}
			</div>

			<div className='mt-4 rounded bg-gray-100 p-3'>
				<h4 className='font-semibold'>Code:</h4>
				<pre className='mt-2 text-sm'>
					{`const { data: tasks, loading, error, reload } = useMessage<Task[]>({
  autoLoad: 'TASKS_GET_ALL'  // ✨ Auto-loads on mount!
});`}
				</pre>
			</div>
		</div>
	);
}

// Example 2: Manual control
function ManualUsersExample() {
	// Manual control - load when you want
	const { data: users, loading, error, send, reset } = useMessage<User[]>();

	const loadUsers = () => send('USERS_GET_ALL');
	const loadUsersWithFilter = () => send('USERS_GET_ALL', { active: true });

	return (
		<div className='rounded-lg bg-white p-6 shadow-md'>
			<h2 className='mb-4 text-xl font-semibold'>
				Manual Control Example
			</h2>
			<p className='mb-4 text-gray-600'>
				Load data manually when you need it.
			</p>

			<div className='mb-4 space-x-2'>
				<button
					onClick={loadUsers}
					disabled={loading}
					className='rounded bg-green-600 px-4 py-2 text-white hover:bg-green-700 disabled:opacity-50'
				>
					Load All Users
				</button>
				<button
					onClick={loadUsersWithFilter}
					disabled={loading}
					className='rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50'
				>
					Load Active Users
				</button>
				<button
					onClick={reset}
					className='rounded bg-gray-600 px-4 py-2 text-white hover:bg-gray-700'
				>
					Clear
				</button>
			</div>

			{loading && <div className='text-blue-600'>Loading...</div>}
			{error && <div className='text-red-600'>Error: {error}</div>}

			{users && (
				<div className='space-y-2'>
					<p className='font-medium'>Users ({users.length}):</p>
					{users.map((user, index) => (
						<div key={index} className='rounded border p-3'>
							{user.name} - {user.email}
						</div>
					))}
				</div>
			)}

			<div className='mt-4 rounded bg-gray-100 p-3'>
				<h4 className='font-semibold'>Code:</h4>
				<pre className='mt-2 text-sm'>
					{`const { data: users, loading, error, send } = useMessage<User[]>();

const loadUsers = () => send('USERS_GET_ALL');
const loadActive = () => send('USERS_GET_ALL', { active: true });`}
				</pre>
			</div>
		</div>
	);
}

// Example 3: One-off calls
function OneOffCallsExample() {
	const sendMessage = useMessageCall();
	const [result, setResult] = useState<any>(null);
	const [loading, setLoading] = useState(false);

	const createTask = async () => {
		setLoading(true);
		const response = await sendMessage('TASKS_CREATE', {
			title: `New task ${Date.now()}`,
			priority: 'medium',
		});
		setResult(response);
		setLoading(false);
	};

	const deleteTask = async () => {
		setLoading(true);
		const response = await sendMessage('TASKS_DELETE', {
			id: 'some-task-id',
		});
		setResult(response);
		setLoading(false);
	};

	const createUser = async () => {
		setLoading(true);
		const response = await sendMessage('USERS_CREATE', {
			name: `User ${Date.now()}`,
			email: `user${Date.now()}@example.com`,
		});
		setResult(response);
		setLoading(false);
	};

	return (
		<div className='rounded-lg bg-white p-6 shadow-md'>
			<h2 className='mb-4 text-xl font-semibold'>
				One-off Calls Example
			</h2>
			<p className='mb-4 text-gray-600'>
				For actions that don't need state management.
			</p>

			<div className='mb-4 space-x-2'>
				<button
					onClick={createTask}
					disabled={loading}
					className='rounded bg-purple-600 px-4 py-2 text-white hover:bg-purple-700 disabled:opacity-50'
				>
					Create Task
				</button>
				<button
					onClick={deleteTask}
					disabled={loading}
					className='rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700 disabled:opacity-50'
				>
					Delete Task
				</button>
				<button
					onClick={createUser}
					disabled={loading}
					className='rounded bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700 disabled:opacity-50'
				>
					Create User
				</button>
			</div>

			{loading && <div className='text-blue-600'>Processing...</div>}

			{result && (
				<div className='rounded bg-gray-100 p-3'>
					<h4 className='font-semibold'>Response:</h4>
					<pre className='mt-2 overflow-auto text-sm'>
						{JSON.stringify(result, null, 2)}
					</pre>
				</div>
			)}

			<div className='mt-4 rounded bg-gray-100 p-3'>
				<h4 className='font-semibold'>Code:</h4>
				<pre className='mt-2 text-sm'>
					{`const sendMessage = useMessageCall();

const createTask = async () => {
  const response = await sendMessage('TASKS_CREATE', {
    title: 'New task',
    priority: 'medium'
  });
  // Handle response...
};`}
				</pre>
			</div>
		</div>
	);
}
