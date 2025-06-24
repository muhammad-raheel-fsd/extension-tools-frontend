import { TasksSimpleExample } from '@/components/modules/TasksSimpleExample';
import { ThemeProvider } from '@/components/providers/theme-provider';

const SidePanelPage = () => {
	return (
		<ThemeProvider>
			<TasksSimpleExample />
			{/* <ChatModule /> */}
		</ThemeProvider>
	);
};

export default SidePanelPage;
