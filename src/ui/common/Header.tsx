import { MessageSquare } from 'lucide-react';

const Header = () => {
	return (
		<div className='border-b border-border pb-2'>
			<div className='flex items-center gap-3'>
				<div className='rounded-lg bg-primary/10 p-2'>
					<MessageSquare className='h-5 w-5 text-primary' />
				</div>
				<div>
					<h1 className='text-lg font-semibold'>
						LLM tools Extension
					</h1>
					<p className='text-sm text-muted-foreground'>
						AI-powered Chrome extension
					</p>
				</div>
			</div>
		</div>
	);
};

export default Header;
