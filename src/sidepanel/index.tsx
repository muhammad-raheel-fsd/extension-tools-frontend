import ChatModule from '@/components/modules/ChatModule';
import { ThemeProvider } from '@/components/providers/theme-provider';

const SidePanelPage = () => {
	return (
		<ThemeProvider>
			<ChatModule />
		</ThemeProvider>
	);
};

export default SidePanelPage;
