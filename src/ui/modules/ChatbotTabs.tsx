import { tabs } from '@/constants';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../shadcnui/tabs';
import Chatbot from './Chatbot';

const ChatbotTabs = () => {
	return (
		<Tabs defaultValue='chat' className='flex grow flex-col gap-3'>
			<TabsList className='flex w-full gap-1'>
				{tabs.map((tab) => (
					<TabsTrigger
						value={tab.value}
						className='text-md flex grow gap-1'
					>
						<tab.icon className='h-4 w-4' />
						{tab.label}
					</TabsTrigger>
				))}
			</TabsList>

			{/* Chat Tab */}
			<TabsContent value='chat' className='m-0 flex flex-1 flex-col'>
				<Chatbot />
			</TabsContent>
		</Tabs>
	);
};

export default ChatbotTabs;
