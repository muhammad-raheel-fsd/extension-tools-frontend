import { Avatar, AvatarFallback } from '@/ui/shadcnui/avatar';
import { Button } from '@/ui/shadcnui/button';
import { Card, CardContent } from '@/ui/shadcnui/card';
// Remove sonner Toaster for now
import { useTheme } from '@/ui/providers/theme-provider';
import { Textarea } from '@/ui/shadcnui/textarea';
import { Send } from 'lucide-react';
import { useState } from 'react';
import '../../styles/index.css';
// Simple toast replacement for now
const toast = {
	success: (message: string) => console.log('✅', message),
	error: (message: string) => console.error('❌', message),
};

const Chatbot = () => {
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

	return (
		<Card className='flex flex-1 flex-col'>
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
									{message.role === 'user' ? '👤' : '🤖'}
								</AvatarFallback>
							</Avatar>
							<div
								className={`max-w-[80%] rounded-lg p-3 ${
									message.role === 'user'
										? 'ml-auto bg-primary text-primary-foreground'
										: 'bg-muted'
								}`}
							>
								<p className='text-sm'>{message.content}</p>
							</div>
						</div>
					))}

					{isProcessing && (
						<div className='flex gap-3'>
							<Avatar className='h-8 w-8'>
								<AvatarFallback>🤖</AvatarFallback>
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
						onChange={(e) => setChatInput(e.target.value)}
						placeholder='Type your message...'
						className='max-h-[120px] min-h-[40px] resize-none'
						onKeyDown={(e) => {
							if (e.key === 'Enter' && !e.shiftKey) {
								e.preventDefault();
								sendMessage();
							}
						}}
					/>
					<Button
						onClick={sendMessage}
						disabled={!chatInput.trim() || isProcessing}
						size='icon'
						className='shrink-0'
					>
						<Send className='h-4 w-4' />
					</Button>
				</div>
			</CardContent>
		</Card>
	);
};

export default Chatbot;
