// Unified Message Hook - Single hook for all background script communication
import { useCallback, useEffect, useState } from 'react';
import type { ApiResponse } from '../types/api';

interface UseMessageState<T> {
	data: T | null;
	loading: boolean;
	error: string | null;
}

interface UseMessageOptions {
	autoLoad?: string;
	autoLoadPayload?: any;
}

interface UseMessageReturn<T> {
	data: T | null;
	loading: boolean;
	error: string | null;
	send: (messageType: string, payload?: any) => Promise<ApiResponse<T>>;
	reload: () => Promise<ApiResponse<T>>;
	reset: () => void;
}

/**
 * Unified hook for sending messages to background script
 * @param options - Options for auto-loading and other behaviors
 * @example
 * // Auto-load on mount
 * const { data, loading, error } = useMessage<Task[]>({
 *   autoLoad: 'TASKS_GET_ALL'
 * });
 *
 * // Manual control
 * const { data, loading, error, send } = useMessage<Task[]>();
 * await send('TASKS_GET_ALL');
 */
export function useMessage<T = any>(
	options?: UseMessageOptions,
): UseMessageReturn<T> {
	const [state, setState] = useState<UseMessageState<T>>({
		data: null,
		loading: false,
		error: null,
	});

	const send = useCallback(
		async (messageType: string, payload?: any): Promise<ApiResponse<T>> => {
			setState((prev) => ({ ...prev, loading: true, error: null }));

			try {
				const response = await sendMessageToBackground<T>(
					messageType,
					payload,
				);

				if (response.success) {
					setState({
						data: response.data || null,
						loading: false,
						error: null,
					});
				} else {
					setState({
						data: null,
						loading: false,
						error: response.error || 'Unknown error',
					});
				}

				return response;
			} catch (error) {
				const errorMessage =
					error instanceof Error ? error.message : 'Unknown error';
				setState({
					data: null,
					loading: false,
					error: errorMessage,
				});

				return {
					success: false,
					error: errorMessage,
				};
			}
		},
		[],
	);

	const reload = useCallback(async (): Promise<ApiResponse<T>> => {
		if (options?.autoLoad) {
			return send(options.autoLoad, options.autoLoadPayload);
		}
		return { success: false, error: 'No autoLoad message configured' };
	}, [send, options?.autoLoad, options?.autoLoadPayload]);

	const reset = useCallback(() => {
		setState({
			data: null,
			loading: false,
			error: null,
		});
	}, []);

	// Auto-load on mount if configured
	useEffect(() => {
		if (options?.autoLoad) {
			send(options.autoLoad, options.autoLoadPayload);
		}
	}, [send, options?.autoLoad, options?.autoLoadPayload]);

	return {
		data: state.data,
		loading: state.loading,
		error: state.error,
		send,
		reload,
		reset,
	};
}

/**
 * Hook for one-off message calls without state management
 * @example
 * const sendMessage = useMessageCall();
 * const response = await sendMessage('TASKS_DELETE', { id: '123' });
 */
export function useMessageCall() {
	return useCallback(
		async <T>(
			messageType: string,
			payload?: any,
		): Promise<ApiResponse<T>> => {
			return sendMessageToBackground<T>(messageType, payload);
		},
		[],
	);
}

/**
 * Send message to background script
 * @param messageType - The message type (e.g., 'USERS_GET_ALL', 'TASKS_CREATE')
 * @param payload - Optional payload data
 * @returns Promise with the response
 */
function sendMessageToBackground<T>(
	messageType: string,
	payload?: any,
): Promise<ApiResponse<T>> {
	return new Promise((resolve) => {
		chrome.runtime.sendMessage(
			{ type: messageType, data: payload },
			(response: ApiResponse<T>) => {
				if (chrome.runtime.lastError) {
					resolve({
						success: false,
						error: chrome.runtime.lastError.message,
					});
				} else {
					resolve(
						response || {
							success: false,
							error: 'No response received',
						},
					);
				}
			},
		);
	});
}
