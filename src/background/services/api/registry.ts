// API Service Registry - Maps message prefixes to their handlers

import { llmAPIService } from './llm';
import { tasksAPIService } from './tasks';
import { usersAPIService } from './users';

// Define the service interface
export interface APIService {
	handleMessage(type: string, data: any): Promise<any>;
}

// Registry of all API services
const serviceRegistry = new Map<string, APIService>([
	['USERS_', usersAPIService],
	['LLM_', llmAPIService],
	['TASKS_', tasksAPIService],
	// Add new services here:
	// ['DOCUMENTS_', documentsAPIService],
	// ['AUTH_', authAPIService],
	// ['STORAGE_', storageAPIService],
]);

/**
 * Get the appropriate service for a message type
 * @param messageType - The message type to route
 * @returns The service that handles this message type, or null if not found
 */
export function getServiceForMessage(messageType: string): APIService | null {
	for (const [prefix, service] of serviceRegistry) {
		if (messageType.startsWith(prefix)) {
			return service;
		}
	}
	return null;
}

/**
 * Register a new API service
 * @param prefix - The message prefix this service handles
 * @param service - The service implementation
 */
export function registerAPIService(prefix: string, service: APIService): void {
	serviceRegistry.set(prefix, service);
}

/**
 * Get all registered prefixes
 * @returns Array of all registered message prefixes
 */
export function getRegisteredPrefixes(): string[] {
	return Array.from(serviceRegistry.keys());
}
