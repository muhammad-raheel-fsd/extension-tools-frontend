import Header from '../common/Header';
import ChatbotTabs from '../modules/ChatbotTabs';

const SidepanelPage = () => {
	return (
		<div className='flex min-h-screen w-full flex-col gap-3 p-4'>
			<Header />
			<ChatbotTabs />
		</div>
	);
};

export default SidepanelPage;
