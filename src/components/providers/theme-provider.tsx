import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'dark' | 'light' | 'system';

type ThemeProviderContextType = {
	theme: Theme;
	setTheme: (theme: Theme) => void;
	toggleTheme: () => void;
};

const ThemeProviderContext = createContext<
	ThemeProviderContextType | undefined
>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
	const [theme, setTheme] = useState<Theme>('system');

	useEffect(() => {
		const root = window.document.documentElement;

		const getSystemTheme = () =>
			window.matchMedia('(prefers-color-scheme: dark)').matches
				? 'dark'
				: 'light';

		const applyTheme = (newTheme: Theme) => {
			root.classList.remove('light', 'dark');

			if (newTheme === 'system') {
				root.classList.add(getSystemTheme());
			} else {
				root.classList.add(newTheme);
			}
		};

		// Load saved theme
		const savedTheme = (localStorage.getItem('theme') as Theme) || 'system';
		setTheme(savedTheme);
		applyTheme(savedTheme);

		// Listen for system theme changes
		const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
		const handleSystemThemeChange = () => {
			if (theme === 'system') {
				applyTheme('system');
			}
		};

		mediaQuery.addEventListener('change', handleSystemThemeChange);
		return () =>
			mediaQuery.removeEventListener('change', handleSystemThemeChange);
	}, [theme]);

	const updateTheme = (newTheme: Theme) => {
		setTheme(newTheme);
		localStorage.setItem('theme', newTheme);
	};

	const toggleTheme = () => {
		const nextTheme =
			theme === 'light' ? 'dark' : theme === 'dark' ? 'system' : 'light';
		updateTheme(nextTheme);
	};

	return (
		<ThemeProviderContext.Provider
			value={{ theme, setTheme: updateTheme, toggleTheme }}
		>
			{children}
		</ThemeProviderContext.Provider>
	);
}

export const useTheme = () => {
	const context = useContext(ThemeProviderContext);
	if (context === undefined) {
		throw new Error('useTheme must be used within a ThemeProvider');
	}
	return context;
};
