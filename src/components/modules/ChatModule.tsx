import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
// Remove sonner Toaster for now
import { ThemeProvider, useTheme } from '@/components/providers/theme-provider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { usersService, type User } from '@/lib/services';
import {
	MessageSquare,
	Plus,
	RefreshCw,
	Send,
	Settings,
	Trash2,
	Users,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import '../../styles/index.css';
// Simple toast replacement for now
const toast = {
	success: (message: string) => console.log('✅', message),
	error: (message: string) => console.error('❌', message),
};

function ChatModuleContent() {
	const { theme, toggleTheme } = useTheme();

	// Chat state
	const [chatMessages, setChatMessages] = useState<
		Array<{
			id: string;
			role: 'user' | 'assistant';
			content: string;
			timestamp: Date;
		}>
	>([
		{
			id: '1',
			role: 'assistant' as const,
			content: "Hello! I'm your AI assistant. How can I help you today?",
			timestamp: new Date(),
		},
	]);
	const [chatInput, setChatInput] = useState('');
	const [isProcessing, setIsProcessing] = useState(false);

	// Users state
	const [users, setUsers] = useState<User[]>([]);
	const [loading, setLoading] = useState(false);
	const [newUserName, setNewUserName] = useState('');
	const [newUserEmail, setNewUserEmail] = useState('');

	// Load users on component mount
	useEffect(() => {
		loadUsers();
	}, []);

	// Chat functions
	const sendMessage = async () => {
		if (!chatInput.trim() || isProcessing) return;

		const userMessage = {
			id: Date.now().toString(),
			role: 'user' as const,
			content: chatInput.trim(),
			timestamp: new Date(),
		};

		setChatMessages((prev) => [...prev, userMessage]);
		setChatInput('');
		setIsProcessing(true);

		try {
			// Simulate AI response - replace with actual LLM service call
			setTimeout(() => {
				const aiResponse = {
					id: (Date.now() + 1).toString(),
					role: 'assistant' as const,
					content: `I received your message: "${userMessage.content}". This is a simulated response. The actual LLM integration will be implemented using the background services.`,
					timestamp: new Date(),
				};
				setChatMessages((prev) => [...prev, aiResponse]);
				setIsProcessing(false);
				toast.success('Message processed successfully!');
			}, 1500);
		} catch (error) {
			setIsProcessing(false);
			toast.error('Failed to process message');
		}
	};

	const clearChat = () => {
		setChatMessages([
			{
				id: '1',
				role: 'assistant',
				content:
					"Hello! I'm your AI assistant. How can I help you today?",
				timestamp: new Date(),
			},
		]);
		toast.success('Chat cleared');
	};

	// Users functions
	const loadUsers = async () => {
		setLoading(true);

		try {
			const response = await usersService.getUsers();
			if (response.success && response.data) {
				setUsers(response.data);
				toast.success(`Loaded ${response.data.length} users`);
			} else {
				toast.error(response.error || 'Failed to load users');
			}
		} catch (err) {
			toast.error('Network error occurred');
		} finally {
			setLoading(false);
		}
	};

	const createUser = async () => {
		if (!newUserName.trim() || !newUserEmail.trim()) {
			toast.error('Please fill in both name and email');
			return;
		}

		setLoading(true);

		try {
			const response = await usersService.createUser({
				name: newUserName.trim(),
				email: newUserEmail.trim(),
			});

			if (response.success && response.data) {
				setUsers((prev) => [...prev, response.data]);
				setNewUserName('');
				setNewUserEmail('');
				toast.success('User created successfully!');
			} else {
				toast.error(response.error || 'Failed to create user');
			}
		} catch (err) {
			toast.error('Network error occurred');
		} finally {
			setLoading(false);
		}
	};

	const deleteUser = async (userId: string) => {
		setLoading(true);

		try {
			const response = await usersService.deleteUser(userId);
			if (response.success) {
				setUsers((prev) => prev.filter((user) => user.id !== userId));
				toast.success('User deleted successfully!');
			} else {
				toast.error(response.error || 'Failed to delete user');
			}
		} catch (err) {
			toast.error('Network error occurred');
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className='h-full w-full bg-background text-foreground'>
			<div className='flex h-full flex-col'>
				{/* Header */}
				<div className='border-b border-border bg-card p-4'>
					<div className='flex items-center gap-3'>
						<div className='rounded-lg bg-primary/10 p-2'>
							<MessageSquare className='h-5 w-5 text-primary' />
						</div>
						<div>
							<h1 className='text-lg font-semibold'>
								LLM Extension
							</h1>
							<p className='text-sm text-muted-foreground'>
								AI-powered Chrome extension
							</p>
						</div>
					</div>
				</div>

				{/* Main Content */}
				<div className='flex-1 overflow-hidden'>
					<Tabs defaultValue='chat' className='flex h-full flex-col'>
						<TabsList className='m-4 mb-0 grid w-full grid-cols-3'>
							<TabsTrigger
								value='chat'
								className='flex items-center gap-2'
							>
								<MessageSquare className='h-4 w-4' />
								Chat
							</TabsTrigger>
							<TabsTrigger
								value='users'
								className='flex items-center gap-2'
							>
								<Users className='h-4 w-4' />
								Users
							</TabsTrigger>
							<TabsTrigger
								value='settings'
								className='flex items-center gap-2'
							>
								<Settings className='h-4 w-4' />
								Settings
							</TabsTrigger>
						</TabsList>

						{/* Chat Tab */}
						<TabsContent
							value='chat'
							className='m-4 mt-4 flex flex-1 flex-col'
						>
							<Card className='flex flex-1 flex-col'>
								<CardHeader className='pb-3'>
									<div className='flex items-center justify-between'>
										<div>
											<CardTitle className='text-base'>
												AI Chat
											</CardTitle>
											<CardDescription>
												Chat with our AI assistant
											</CardDescription>
										</div>
										<Button
											variant='outline'
											size='sm'
											onClick={clearChat}
										>
											Clear Chat
										</Button>
									</div>
								</CardHeader>

								<CardContent className='flex flex-1 flex-col gap-4 pt-0'>
									{/* Messages */}
									<div className='min-h-0 flex-1 space-y-4 overflow-y-auto'>
										{chatMessages.map((message) => (
											<div
												key={message.id}
												className={`flex gap-3 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}
											>
												<Avatar className='h-8 w-8'>
													<AvatarFallback>
														{message.role === 'user'
															? '👤'
															: '🤖'}
													</AvatarFallback>
												</Avatar>
												<div
													className={`max-w-[80%] rounded-lg p-3 ${
														message.role === 'user'
															? 'ml-auto bg-primary text-primary-foreground'
															: 'bg-muted'
													}`}
												>
													<p className='text-sm'>
														{message.content}
													</p>
												</div>
											</div>
										))}

										{isProcessing && (
											<div className='flex gap-3'>
												<Avatar className='h-8 w-8'>
													<AvatarFallback>
														🤖
													</AvatarFallback>
												</Avatar>
												<div className='rounded-lg bg-muted p-3'>
													<div className='flex gap-1'>
														<div className='h-2 w-2 animate-bounce rounded-full bg-muted-foreground/40 [animation-delay:-0.3s]'></div>
														<div className='h-2 w-2 animate-bounce rounded-full bg-muted-foreground/40 [animation-delay:-0.15s]'></div>
														<div className='h-2 w-2 animate-bounce rounded-full bg-muted-foreground/40'></div>
													</div>
												</div>
											</div>
										)}
									</div>

									{/* Input */}
									<div className='flex gap-2'>
										<Textarea
											value={chatInput}
											onChange={(e) =>
												setChatInput(e.target.value)
											}
											placeholder='Type your message...'
											className='max-h-[120px] min-h-[40px] resize-none'
											onKeyDown={(e) => {
												if (
													e.key === 'Enter' &&
													!e.shiftKey
												) {
													e.preventDefault();
													sendMessage();
												}
											}}
										/>
										<Button
											onClick={sendMessage}
											disabled={
												!chatInput.trim() ||
												isProcessing
											}
											size='icon'
											className='shrink-0'
										>
											<Send className='h-4 w-4' />
										</Button>
									</div>
								</CardContent>
							</Card>
						</TabsContent>

						{/* Users Tab */}
						<TabsContent value='users' className='m-4 mt-4 flex-1'>
							<div className='space-y-4'>
								{/* Add User Card */}
								<Card>
									<CardHeader>
										<CardTitle className='text-base'>
											Add New User
										</CardTitle>
										<CardDescription>
											Create a new user account
										</CardDescription>
									</CardHeader>
									<CardContent className='space-y-4'>
										<Input
											value={newUserName}
											onChange={(e) =>
												setNewUserName(e.target.value)
											}
											placeholder='Full Name'
											disabled={loading}
										/>
										<Input
											type='email'
											value={newUserEmail}
											onChange={(e) =>
												setNewUserEmail(e.target.value)
											}
											placeholder='Email Address'
											disabled={loading}
										/>
										<Button
											onClick={createUser}
											disabled={
												loading ||
												!newUserName.trim() ||
												!newUserEmail.trim()
											}
											className='w-full'
										>
											{loading ? (
												<RefreshCw className='mr-2 h-4 w-4 animate-spin' />
											) : (
												<Plus className='mr-2 h-4 w-4' />
											)}
											Create User
										</Button>
									</CardContent>
								</Card>

								{/* Users List */}
								<Card>
									<CardHeader>
										<div className='flex items-center justify-between'>
											<div>
												<CardTitle className='text-base'>
													Users
												</CardTitle>
												<CardDescription>
													{users.length} users total
												</CardDescription>
											</div>
											<Button
												variant='outline'
												size='sm'
												onClick={loadUsers}
												disabled={loading}
											>
												<RefreshCw
													className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`}
												/>
												Refresh
											</Button>
										</div>
									</CardHeader>
									<CardContent>
										{users.length === 0 ? (
											<div className='py-8 text-center text-muted-foreground'>
												<Users className='mx-auto mb-2 h-8 w-8 opacity-50' />
												<p>No users found</p>
											</div>
										) : (
											<div className='space-y-2'>
												{users.map((user) => (
													<div
														key={user.id}
														className='flex items-center justify-between rounded-lg border p-3'
													>
														<div className='flex items-center gap-3'>
															<Avatar className='h-8 w-8'>
																<AvatarFallback>
																	{user.name?.[0]?.toUpperCase() ||
																		'?'}
																</AvatarFallback>
															</Avatar>
															<div>
																<p className='text-sm font-medium'>
																	{user.name}
																</p>
																<p className='text-xs text-muted-foreground'>
																	{user.email}
																</p>
															</div>
														</div>
														<Button
															variant='ghost'
															size='sm'
															onClick={() =>
																deleteUser(
																	user.id,
																)
															}
															disabled={loading}
															className='text-destructive hover:text-destructive'
														>
															<Trash2 className='h-4 w-4' />
														</Button>
													</div>
												))}
											</div>
										)}
									</CardContent>
								</Card>
							</div>
						</TabsContent>

						{/* Settings Tab */}
						<TabsContent
							value='settings'
							className='m-4 mt-4 flex-1'
						>
							<Card>
								<CardHeader>
									<CardTitle className='text-base'>
										Settings
									</CardTitle>
									<CardDescription>
										Configure your extension preferences
									</CardDescription>
								</CardHeader>
								<CardContent>
									<div className='space-y-4'>
										<div className='flex items-center justify-between'>
											<div>
												<p className='font-medium'>
													Theme
												</p>
												<p className='text-sm text-muted-foreground'>
													Choose your preferred theme
												</p>
											</div>
											<Button
												variant='outline'
												size='sm'
												onClick={() => {
													toggleTheme();
												}}
											>
												{theme === 'system'
													? 'Auto'
													: theme === 'dark'
														? 'Dark'
														: 'Light'}
											</Button>
										</div>
										<div className='flex items-center justify-between'>
											<div>
												<p className='font-medium'>
													Notifications
												</p>
												<p className='text-sm text-muted-foreground'>
													Enable toast notifications
												</p>
											</div>
											<Button
												variant='outline'
												size='sm'
												disabled
											>
												Enabled
											</Button>
										</div>
									</div>
								</CardContent>
							</Card>
						</TabsContent>
					</Tabs>
				</div>
			</div>
			{/* Toast notifications disabled for now */}
		</div>
	);
}

function ChatModule() {
	return (
		<ThemeProvider>
			<ChatModuleContent />
		</ThemeProvider>
	);
}

export default ChatModule;
