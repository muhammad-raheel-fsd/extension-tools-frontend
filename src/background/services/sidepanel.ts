// Sidepanel Service - Manages sidepanel behavior and configuration

import { logError, logInfo } from '../utils/logger';

/**
 * Sets up the sidepanel configuration
 * Configures the panel to open when extension button is clicked
 */
export async function setupSidepanel(): Promise<void> {
	try {
		// Configure the side panel to open when the extension icon is clicked
		await chrome.sidePanel.setPanelBehavior({
			openPanelOnActionClick: true,
		});

		// Set up the side panel on installation with proper configuration
		await chrome.sidePanel.setOptions({
			path: 'sidepanel.html',
			enabled: true,
		});

		logInfo('Sidepanel configured successfully');
	} catch (error) {
		logError('Failed to setup sidepanel', error);
		throw error;
	}
}

/**
 * Opens the sidepanel programmatically
 * @param windowId - The window ID to open the panel in
 */
export async function openSidepanel(windowId?: number): Promise<void> {
	try {
		if (windowId) {
			await chrome.sidePanel.open({ windowId });
		}
		logInfo('Sidepanel opened');
	} catch (error) {
		logError('Failed to open sidepanel', error);
		throw error;
	}
}

/**
 * Updates sidepanel options
 * @param options - Panel options to update
 */
export async function updateSidepanelOptions(
	options: chrome.sidePanel.PanelOptions,
): Promise<void> {
	try {
		await chrome.sidePanel.setOptions(options);
		logInfo('Sidepanel options updated', options);
	} catch (error) {
		logError('Failed to update sidepanel options', error);
		throw error;
	}
}
