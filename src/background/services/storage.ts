// Storage Service - Manages extension storage operations

import { logError, logInfo } from '../utils/logger';

/**
 * Sets up storage and initializes default values
 */
export async function setupStorage(): Promise<void> {
	try {
		// Initialize default storage values if they don't exist
		const defaults = {
			isFirstRun: true,
			settings: {
				theme: 'light',
				notifications: true,
				autoProcess: false,
			},
			userPreferences: {},
			extensionData: {},
		};

		// Check if this is the first run
		const stored = await getStorageData(['isFirstRun']);

		if (stored.isFirstRun !== false) {
			await setStorageData(defaults);
			logInfo('Storage initialized with defaults');
		} else {
			logInfo('Storage already initialized');
		}
	} catch (error) {
		logError('Failed to setup storage', error);
		throw error;
	}
}

/**
 * Get data from Chrome storage
 * @param keys - Keys to retrieve (string or array of strings)
 * @returns Promise with the stored data
 */
export async function getStorageData(
	keys?: string | string[] | null,
): Promise<any> {
	try {
		const result = await chrome.storage.local.get(keys);
		logInfo('Retrieved from storage', {
			keys,
			dataKeys: Object.keys(result),
		});
		return result;
	} catch (error) {
		logError('Failed to get storage data', error);
		throw error;
	}
}

/**
 * Set data in Chrome storage
 * @param data - Object with key-value pairs to store
 */
export async function setStorageData(data: Record<string, any>): Promise<void> {
	try {
		await chrome.storage.local.set(data);
		logInfo('Saved to storage', { keys: Object.keys(data) });
	} catch (error) {
		logError('Failed to set storage data', error);
		throw error;
	}
}

/**
 * Remove data from Chrome storage
 * @param keys - Keys to remove (string or array of strings)
 */
export async function removeStorageData(
	keys: string | string[],
): Promise<void> {
	try {
		await chrome.storage.local.remove(keys);
		logInfo('Removed from storage', keys);
	} catch (error) {
		logError('Failed to remove storage data', error);
		throw error;
	}
}

/**
 * Clear all storage data
 */
export async function clearStorage(): Promise<void> {
	try {
		await chrome.storage.local.clear();
		logInfo('Storage cleared');
	} catch (error) {
		logError('Failed to clear storage', error);
		throw error;
	}
}

/**
 * Get user settings
 * @returns Promise with user settings
 */
export async function getUserSettings(): Promise<any> {
	try {
		const result = await getStorageData(['settings']);
		return result.settings || {};
	} catch (error) {
		logError('Failed to get user settings', error);
		return {};
	}
}

/**
 * Update user settings
 * @param newSettings - Settings to update
 */
export async function updateUserSettings(
	newSettings: Record<string, any>,
): Promise<void> {
	try {
		const currentSettings = await getUserSettings();
		const updatedSettings = { ...currentSettings, ...newSettings };
		await setStorageData({ settings: updatedSettings });
	} catch (error) {
		logError('Failed to update user settings', error);
		throw error;
	}
}

/**
 * Listen for storage changes
 * @param callback - Function to call when storage changes
 */
export function onStorageChanged(
	callback: (changes: Record<string, chrome.storage.StorageChange>) => void,
): void {
	chrome.storage.onChanged.addListener((changes, namespace) => {
		if (namespace === 'local') {
			logInfo('Storage changed', { keys: Object.keys(changes) });
			callback(changes);
		}
	});
}
