// Options Page - Extension settings and configuration

import { useEffect, useState } from 'react';
import '../styles/index.css';

interface Settings {
	theme: 'light' | 'dark';
	notifications: boolean;
	autoProcess: boolean;
}

function OptionsPage() {
	const [settings, setSettings] = useState<Settings>({
		theme: 'light',
		notifications: true,
		autoProcess: false,
	});
	const [loading, setLoading] = useState(true);
	const [saving, setSaving] = useState(false);
	const [message, setMessage] = useState('');

	// Load settings on component mount
	useEffect(() => {
		loadSettings();
	}, []);

	const loadSettings = async () => {
		try {
			const result = await chrome.storage.local.get(['settings']);
			if (result.settings) {
				setSettings(result.settings);
			}
		} catch (error) {
			console.error('Failed to load settings:', error);
			showMessage('Failed to load settings', 'error');
		} finally {
			setLoading(false);
		}
	};

	const saveSettings = async () => {
		setSaving(true);
		try {
			await chrome.storage.local.set({ settings });
			showMessage('Settings saved successfully!', 'success');
		} catch (error) {
			console.error('Failed to save settings:', error);
			showMessage('Failed to save settings', 'error');
		} finally {
			setSaving(false);
		}
	};

	const showMessage = (text: string, type: 'success' | 'error') => {
		setMessage(text);
		setTimeout(() => setMessage(''), 3000);
	};

	const updateSetting = (key: keyof Settings, value: any) => {
		setSettings((prev) => ({ ...prev, [key]: value }));
	};

	if (loading) {
		return (
			<div className='flex min-h-screen items-center justify-center bg-gray-50'>
				<div className='text-center'>
					<div className='mx-auto h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600'></div>
					<p className='mt-2 text-gray-600'>Loading settings...</p>
				</div>
			</div>
		);
	}

	return (
		<div className='min-h-screen bg-gray-50 py-8'>
			<div className='mx-auto max-w-2xl rounded-lg bg-white p-6 shadow-sm'>
				<div className='mb-6 border-b border-gray-200 pb-4'>
					<h1 className='text-2xl font-bold text-gray-900'>
						🚀 LLM Chrome Extension Settings
					</h1>
					<p className='mt-1 text-gray-600'>
						Configure your extension preferences
					</p>
				</div>

				{/* Message Display */}
				{message && (
					<div
						className={`mb-4 rounded-md p-3 ${
							message.includes('success')
								? 'border border-green-200 bg-green-50 text-green-800'
								: 'border border-red-200 bg-red-50 text-red-800'
						}`}
					>
						{message}
					</div>
				)}

				<div className='space-y-6'>
					{/* Theme Setting */}
					<div>
						<label className='mb-2 block text-sm font-medium text-gray-700'>
							Theme
						</label>
						<select
							value={settings.theme}
							onChange={(e) =>
								updateSetting('theme', e.target.value)
							}
							className='w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
						>
							<option value='light'>Light</option>
							<option value='dark'>Dark</option>
						</select>
					</div>

					{/* Notifications Setting */}
					<div className='flex items-center justify-between'>
						<div>
							<label className='block text-sm font-medium text-gray-700'>
								Enable Notifications
							</label>
							<p className='text-sm text-gray-500'>
								Receive notifications for important events
							</p>
						</div>
						<button
							onClick={() =>
								updateSetting(
									'notifications',
									!settings.notifications,
								)
							}
							className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
								settings.notifications
									? 'bg-blue-600'
									: 'bg-gray-200'
							}`}
						>
							<span
								className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
									settings.notifications
										? 'translate-x-6'
										: 'translate-x-1'
								}`}
							/>
						</button>
					</div>

					{/* Auto Process Setting */}
					<div className='flex items-center justify-between'>
						<div>
							<label className='block text-sm font-medium text-gray-700'>
								Auto Process
							</label>
							<p className='text-sm text-gray-500'>
								Automatically process content when detected
							</p>
						</div>
						<button
							onClick={() =>
								updateSetting(
									'autoProcess',
									!settings.autoProcess,
								)
							}
							className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
								settings.autoProcess
									? 'bg-blue-600'
									: 'bg-gray-200'
							}`}
						>
							<span
								className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
									settings.autoProcess
										? 'translate-x-6'
										: 'translate-x-1'
								}`}
							/>
						</button>
					</div>
				</div>

				{/* Save Button */}
				<div className='mt-8 flex justify-end'>
					<button
						onClick={saveSettings}
						disabled={saving}
						className='flex items-center rounded-md bg-blue-600 px-4 py-2 font-medium text-white transition-colors duration-200 hover:bg-blue-700 disabled:bg-blue-400'
					>
						{saving && (
							<div className='mr-2 h-4 w-4 animate-spin rounded-full border-b-2 border-white'></div>
						)}
						{saving ? 'Saving...' : 'Save Settings'}
					</button>
				</div>

				{/* Reset Button */}
				<div className='mt-4 text-center'>
					<button
						onClick={() => {
							const defaultSettings = {
								theme: 'light' as const,
								notifications: true,
								autoProcess: false,
							};
							setSettings(defaultSettings);
						}}
						className='text-sm text-gray-500 underline hover:text-gray-700'
					>
						Reset to Defaults
					</button>
				</div>
			</div>
		</div>
	);
}

export default OptionsPage;
