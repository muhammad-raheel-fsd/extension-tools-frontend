// Background Service Worker - Main Entry Point
// This file orchestrates all background functionality

import { setupMessaging } from './services/messaging';
import { setupSidepanel } from './services/sidepanel';
import { setupStorage } from './services/storage';
import { logError, logInfo } from './utils/logger';

// Initialize extension on startup
chrome.runtime.onStartup.addListener(() => {
	logInfo('Extension started');
});

// Initialize extension on installation
chrome.runtime.onInstalled.addListener(async (details) => {
	logInfo('Extension installed/updated', details);

	try {
		// Setup sidepanel configuration
		await setupSidepanel();

		// Initialize storage
		await setupStorage();

		// Setup messaging handlers
		setupMessaging();

		logInfo('Background services initialized successfully');
	} catch (error) {
		logError('Failed to initialize background services', error);
	}
});

// Handle extension updates
chrome.runtime.onUpdateAvailable.addListener(() => {
	logInfo('Extension update available');
});

// Export for other modules if needed
export {};
