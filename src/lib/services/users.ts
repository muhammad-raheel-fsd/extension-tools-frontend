// Frontend Users Service - Communicates with background API service

// User types
export interface User {
	id: string;
	email?: string;
	name?: string;
	createdAt?: string;
	updatedAt?: string;
}

export interface CreateUserRequest {
	email: string;
	name: string;
}

export interface UpdateUserRequest {
	name?: string;
	email?: string;
}

export interface ApiResponse<T = any> {
	success: boolean;
	data?: T;
	error?: string;
	status?: number;
}

// Users service class
export class UsersService {
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
	 * Get all users
	 */
	async getUsers(): Promise<ApiResponse<User[]>> {
		return this.sendToBackground('USERS_GET_ALL');
	}

	/**
	 * Get user by ID
	 */
	async getUserById(id: string): Promise<ApiResponse<User>> {
		return this.sendToBackground('USERS_GET_BY_ID', { id });
	}

	/**
	 * Create new user
	 */
	async createUser(userData: CreateUserRequest): Promise<ApiResponse<User>> {
		return this.sendToBackground('USERS_CREATE', userData);
	}

	/**
	 * Update user
	 */
	async updateUser(
		id: string,
		userData: UpdateUserRequest,
	): Promise<ApiResponse<User>> {
		return this.sendToBackground('USERS_UPDATE', { id, ...userData });
	}

	/**
	 * Delete user
	 */
	async deleteUser(id: string): Promise<ApiResponse<void>> {
		return this.sendToBackground('USERS_DELETE', { id });
	}
}

// Export service instance
export const usersService = new UsersService();
