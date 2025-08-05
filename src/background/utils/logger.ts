// Logger Utility - Centralized logging with different levels

type LogLevel = 'info' | 'warn' | 'error' | 'debug';

/**
 * Log an info message
 * @param message - The message to log
 * @param data - Optional additional data
 */
export function logInfo(message: string, data?: any): void {
	log('info', message, data);
}

/**
 * Log a warning message
 * @param message - The message to log
 * @param data - Optional additional data
 */
export function logWarn(message: string, data?: any): void {
	log('warn', message, data);
}

/**
 * Log an error message
 * @param message - The message to log
 * @param error - Optional error object
 */
export function logError(message: string, error?: any): void {
	log('error', message, error);
}

/**
 * Log a debug message (only in development)
 * @param message - The message to log
 * @param data - Optional additional data
 */
export function logDebug(message: string, data?: any): void {
	if (process.env.NODE_ENV === 'development') {
		log('debug', message, data);
	}
}

/**
 * Internal logging function
 * @param level - Log level
 * @param message - The message to log
 * @param data - Optional additional data
 */
function log(level: LogLevel, message: string, data?: any): void {
	const timestamp = new Date().toISOString();
	const prefix = `[${timestamp}] [${level.toUpperCase()}] [Background]`;

	const logMessage = `${prefix} ${message}`;

	switch (level) {
		case 'info':
			console.log(logMessage, data || '');
			break;
		case 'warn':
			console.warn(logMessage, data || '');
			break;
		case 'error':
			console.error(logMessage, data || '');
			if (data instanceof Error) {
				console.error(data.stack);
			}
			break;
		case 'debug':
			console.debug(logMessage, data || '');
			break;
	}
}
