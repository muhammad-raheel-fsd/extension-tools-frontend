// Messaging Service - Handles communication between extension components

import { logError, logInfo } from '../utils/logger';
import { handleAPIMessage, isAPIMessage } from './api';

/**
 * Sets up messaging listeners and handlers
 */
export function setupMessaging(): void {
	// Listen for messages from content scripts, popup, options, etc.
	chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
		handleMessage(message, sender, sendResponse);
		// Return true to indicate we'll respond asynchronously
		return true;
	});

	// Listen for connections (ports) for long-lived connections
	chrome.runtime.onConnect.addListener((port) => {
		handleConnection(port);
	});

	logInfo('Messaging service initialized');
}

/**
 * Handle incoming messages
 * @param message - The message data
 * @param sender - Message sender information
 * @param sendResponse - Function to send response back
 */
async function handleMessage(
	message: any,
	sender: chrome.runtime.MessageSender,
	sendResponse: (response?: any) => void,
): Promise<void> {
	try {
		logInfo('Received message', {
			type: message.type,
			from: sender.tab?.url || 'extension',
		});

		// Check if it's an API-related message
		if (isAPIMessage(message.type)) {
			await handleAPIMessage(message.type, message.data, sendResponse);
			return;
		}

		// Handle non-API messages
		switch (message.type) {
			case 'GET_TAB_INFO':
				await handleGetTabInfo(sendResponse);
				break;

			case 'PROCESS_DATA':
				await handleProcessData(message.data, sendResponse);
				break;

			case 'HEALTH_CHECK':
				sendResponse({ status: 'healthy', timestamp: Date.now() });
				break;

			default:
				logError('Unknown message type', message.type);
				sendResponse({ error: 'Unknown message type' });
		}
	} catch (error) {
		logError('Error handling message', error);
		sendResponse({ error: 'Internal error' });
	}
}

/**
 * Handle long-lived connections (ports)
 * @param port - The connection port
 */
function handleConnection(port: chrome.runtime.Port): void {
	logInfo('New connection established', port.name);

	port.onMessage.addListener((message) => {
		logInfo('Port message received', { port: port.name, message });
		// Handle port messages here
	});

	port.onDisconnect.addListener(() => {
		logInfo('Port disconnected', port.name);
	});
}

/**
 * Get current tab information
 * @param sendResponse - Response callback
 */
async function handleGetTabInfo(
	sendResponse: (response?: any) => void,
): Promise<void> {
	try {
		const [tab] = await chrome.tabs.query({
			active: true,
			currentWindow: true,
		});
		sendResponse({ tab });
	} catch (error) {
		logError('Failed to get tab info', error);
		sendResponse({ error: 'Failed to get tab info' });
	}
}

/**
 * Process data (example handler)
 * @param data - Data to process
 * @param sendResponse - Response callback
 */
async function handleProcessData(
	data: any,
	sendResponse: (response?: any) => void,
): Promise<void> {
	try {
		// Simulate data processing
		logInfo('Processing data', data);

		// Here you could:
		// - Make API calls (no CORS restrictions in background)
		// - Process complex computations
		// - Access storage
		// - Manipulate tabs/windows

		const result = {
			processed: true,
			data: data,
			timestamp: Date.now(),
		};

		sendResponse({ result });
	} catch (error) {
		logError('Failed to process data', error);
		sendResponse({ error: 'Failed to process data' });
	}
}
