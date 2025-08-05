// API Services Index - Central router for all API messages

import { logError } from '../../utils/logger';
import { getRegisteredPrefixes, getServiceForMessage } from './registry';

/**
 * Handle API-related messages from frontend
 * Routes messages to appropriate API service using the registry
 */
export async function handleAPIMessage(
	type: string,
	data: any,
	sendResponse: (response?: any) => void,
): Promise<void> {
	try {
		// Get the appropriate service from the registry
		const service = getServiceForMessage(type);

		let result;
		if (service) {
			result = await service.handleMessage(type, data);
		} else {
			result = {
				success: false,
				error: `Unknown API message type: ${type}. Supported prefixes: ${getRegisteredPrefixes().join(', ')}`,
			};
		}

		sendResponse(result);
	} catch (error) {
		logError('API message handling failed', error);
		sendResponse({
			success: false,
			error: error instanceof Error ? error.message : 'Unknown error',
		});
	}
}

// Check if message type is API-related
export function isAPIMessage(type: string): boolean {
	// Check against all registered service prefixes
	const registeredPrefixes = getRegisteredPrefixes();
	return registeredPrefixes.some((prefix) => type.startsWith(prefix));
}

// Export registry and services for direct use if needed
export { llmAPIService } from './llm';
export {
	getRegisteredPrefixes,
	getServiceForMessage,
	registerAPIService,
} from './registry';
export { usersAPIService } from './users';
