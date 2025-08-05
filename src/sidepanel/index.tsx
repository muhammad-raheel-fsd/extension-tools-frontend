import '@/styles/index.css';
import SidepanelPage from '@/ui/pages/SidepanelPage';
import { ThemeProvider } from '@/ui/providers/theme-provider';

const SidePanelPage = () => {
	return (
		<ThemeProvider>
			{/* <ExtensionChatbot /> */}
			<SidepanelPage />
		</ThemeProvider>
	);
};

export default SidePanelPage;
