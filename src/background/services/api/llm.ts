// LLM API Service - Handle LLM-related messages from frontend

import { logError, logInfo } from '../../utils/logger';

// LLM types
export interface ChatMessage {
	role: 'user' | 'assistant' | 'system';
	content: string;
	timestamp?: number;
}

export interface ChatRequest {
	messages: ChatMessage[];
	model?: string;
	temperature?: number;
	maxTokens?: number;
}

export interface ChatResponse {
	message: ChatMessage;
	usage?: {
		promptTokens: number;
		completionTokens: number;
		totalTokens: number;
	};
}

export interface CompletionRequest {
	prompt: string;
	model?: string;
	temperature?: number;
	maxTokens?: number;
}

export interface CompletionResponse {
	completion: string;
	usage?: {
		promptTokens: number;
		completionTokens: number;
		totalTokens: number;
	};
}

export interface ApiResponse<T = any> {
	success: boolean;
	data?: T;
	error?: string;
	status?: number;
}

export class LLMAPIService {
	private readonly baseUrl = 'http://localhost:3000/llm';

	/**
	 * Handle all LLM-related messages from frontend
	 */
	async handleMessage(type: string, data: any): Promise<ApiResponse> {
		switch (type) {
			case 'LLM_CHAT':
				return this.chat(data);

			case 'LLM_COMPLETE':
				return this.complete(data);

			case 'LLM_GET_MODELS':
				return this.getModels();

			case 'LLM_ANALYZE_SENTIMENT':
				return this.analyzeSentiment(data.text);

			case 'LLM_SUMMARIZE':
				return this.summarize(data.text, data.maxLength);

			case 'LLM_EXTRACT_KEYWORDS':
				return this.extractKeywords(data.text);

			default:
				return {
					success: false,
					error: `Unknown LLM operation: ${type}`,
				};
		}
	}

	private async chat(
		request: ChatRequest,
	): Promise<ApiResponse<ChatResponse>> {
		try {
			logInfo('Sending chat request to NestJS');

			const response = await fetch(`${this.baseUrl}/chat`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(request),
			});

			const data = await response.json();

			if (!response.ok) {
				throw new Error(
					`HTTP ${response.status}: ${response.statusText}`,
				);
			}

			return {
				success: true,
				data,
				status: response.status,
			};
		} catch (error) {
			logError('Failed to send chat request', error);
			return {
				success: false,
				error: error instanceof Error ? error.message : 'Unknown error',
			};
		}
	}

	private async complete(
		request: CompletionRequest,
	): Promise<ApiResponse<CompletionResponse>> {
		try {
			logInfo('Sending completion request to NestJS');

			const response = await fetch(`${this.baseUrl}/complete`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(request),
			});

			const data = await response.json();

			if (!response.ok) {
				throw new Error(
					`HTTP ${response.status}: ${response.statusText}`,
				);
			}

			return {
				success: true,
				data,
				status: response.status,
			};
		} catch (error) {
			logError('Failed to send completion request', error);
			return {
				success: false,
				error: error instanceof Error ? error.message : 'Unknown error',
			};
		}
	}

	private async getModels(): Promise<ApiResponse<string[]>> {
		try {
			logInfo('Fetching available models from NestJS');

			const response = await fetch(`${this.baseUrl}/models`);
			const data = await response.json();

			if (!response.ok) {
				throw new Error(
					`HTTP ${response.status}: ${response.statusText}`,
				);
			}

			return {
				success: true,
				data,
				status: response.status,
			};
		} catch (error) {
			logError('Failed to fetch models', error);
			return {
				success: false,
				error: error instanceof Error ? error.message : 'Unknown error',
			};
		}
	}

	private async analyzeSentiment(
		text: string,
	): Promise<ApiResponse<{ sentiment: string; confidence: number }>> {
		try {
			logInfo('Analyzing sentiment');

			const response = await fetch(`${this.baseUrl}/sentiment`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ text }),
			});

			const data = await response.json();

			if (!response.ok) {
				throw new Error(
					`HTTP ${response.status}: ${response.statusText}`,
				);
			}

			return {
				success: true,
				data,
				status: response.status,
			};
		} catch (error) {
			logError('Failed to analyze sentiment', error);
			return {
				success: false,
				error: error instanceof Error ? error.message : 'Unknown error',
			};
		}
	}

	private async summarize(
		text: string,
		maxLength?: number,
	): Promise<ApiResponse<{ summary: string }>> {
		try {
			logInfo('Summarizing text');

			const response = await fetch(`${this.baseUrl}/summarize`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ text, maxLength }),
			});

			const data = await response.json();

			if (!response.ok) {
				throw new Error(
					`HTTP ${response.status}: ${response.statusText}`,
				);
			}

			return {
				success: true,
				data,
				status: response.status,
			};
		} catch (error) {
			logError('Failed to summarize text', error);
			return {
				success: false,
				error: error instanceof Error ? error.message : 'Unknown error',
			};
		}
	}

	private async extractKeywords(
		text: string,
	): Promise<ApiResponse<{ keywords: string[] }>> {
		try {
			logInfo('Extracting keywords');

			const response = await fetch(`${this.baseUrl}/keywords`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ text }),
			});

			const data = await response.json();

			if (!response.ok) {
				throw new Error(
					`HTTP ${response.status}: ${response.statusText}`,
				);
			}

			return {
				success: true,
				data,
				status: response.status,
			};
		} catch (error) {
			logError('Failed to extract keywords', error);
			return {
				success: false,
				error: error instanceof Error ? error.message : 'Unknown error',
			};
		}
	}
}

export const llmAPIService = new LLMAPIService();
