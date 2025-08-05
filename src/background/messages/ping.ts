// Example Message Handler - Ping/Pong for health checks and communication testing

import type { PlasmoMessaging } from '@plasmohq/messaging';
import { logInfo } from '../utils/logger';

// Request body type
export interface PingRequest {
	message?: string;
	timestamp?: number;
}

// Response body type
export interface PingResponse {
	pong: string;
	serverTime: number;
	receivedMessage?: string;
}

// Message handler for 'ping' messages
const handler: PlasmoMessaging.MessageHandler<
	PingRequest,
	PingResponse
> = async (req, res) => {
	logInfo('Ping message received', req.body);

	// Process the ping request
	const response: PingResponse = {
		pong: 'Hello from LLM Chrome Extension background!',
		serverTime: Date.now(),
		receivedMessage: req.body?.message,
	};

	// You can add more complex logic here:
	// - Database operations
	// - API calls (no CORS restrictions)
	// - Complex computations
	// - File system access
	// - Chrome API calls

	res.send(response);
};

export default handler;
