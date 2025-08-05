// LLM Service - Handle LLM and AI-related API operations

// Base response interface
export interface ApiResponse<T = any> {
	success: boolean;
	data?: T;
	error?: string;
	status?: number;
}

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

// LLM service class
export class LLMService {
	/**
	 * Send message to background script
	 */
	private async sendToBackground(type: string, data?: any): Promise<any> {
		return new Promise((resolve) => {
			chrome.runtime.sendMessage({ type, data }, (response) => {
				if (chrome.runtime.lastError) {
					resolve({
						success: false,
						error: chrome.runtime.lastError.message,
					});
				} else {
					resolve(response);
				}
			});
		});
	}

	/**
	 * Send chat messages and get response
	 */
	async chat(request: ChatRequest): Promise<ApiResponse<ChatResponse>> {
		return this.sendToBackground('LLM_CHAT', request);
	}

	/**
	 * Get text completion
	 */
	async complete(
		request: CompletionRequest,
	): Promise<ApiResponse<CompletionResponse>> {
		return this.sendToBackground('LLM_COMPLETE', request);
	}

	/**
	 * Get available models
	 */
	async getModels(): Promise<ApiResponse<string[]>> {
		return this.sendToBackground('LLM_GET_MODELS');
	}

	/**
	 * Analyze text sentiment
	 */
	async analyzeSentiment(
		text: string,
	): Promise<ApiResponse<{ sentiment: string; confidence: number }>> {
		return this.sendToBackground('LLM_ANALYZE_SENTIMENT', { text });
	}

	/**
	 * Summarize text
	 */
	async summarize(
		text: string,
		maxLength?: number,
	): Promise<ApiResponse<{ summary: string }>> {
		return this.sendToBackground('LLM_SUMMARIZE', { text, maxLength });
	}

	/**
	 * Extract keywords from text
	 */
	async extractKeywords(
		text: string,
	): Promise<ApiResponse<{ keywords: string[] }>> {
		return this.sendToBackground('LLM_EXTRACT_KEYWORDS', { text });
	}
}

// Export service instance
export const llmService = new LLMService();
