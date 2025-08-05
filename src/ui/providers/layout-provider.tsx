import { Toaster } from '@/ui/shadcnui/sonner';
import { ThemeProvider } from './theme-provider';

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang='en'>
			<head />
			<body>
				<ThemeProvider>
					<main>{children}</main>
				</ThemeProvider>
				<Toaster />
			</body>
		</html>
	);
}
