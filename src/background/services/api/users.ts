// Users API Service - Handle user-related messages from frontend

import { logError, logInfo } from '../../utils/logger';

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

export class UsersAPIService {
	private readonly baseUrl = 'http://localhost:3000/users';

	/**
	 * Handle all user-related messages from frontend
	 */
	async handleMessage(type: string, data: any): Promise<ApiResponse> {
		switch (type) {
			case 'USERS_GET_ALL':
				return this.getUsers();

			case 'USERS_GET_BY_ID':
				return this.getUserById(data.id);

			case 'USERS_CREATE':
				return this.createUser(data);

			case 'USERS_UPDATE':
				return this.updateUser(data.id, data);

			case 'USERS_DELETE':
				return this.deleteUser(data.id);

			default:
				return {
					success: false,
					error: `Unknown users operation: ${type}`,
				};
		}
	}

	private async getUsers(): Promise<ApiResponse<User[]>> {
		try {
			logInfo('Fetching users from NestJS');

			const response = await fetch(this.baseUrl);
			const data = await response.json();

			if (!response.ok) {
				throw new Error(
					`HTTP ${response.status}: ${response.statusText}`,
				);
			}

			logInfo('Users fetched successfully', { count: data.length });

			return {
				success: true,
				data,
				status: response.status,
			};
		} catch (error) {
			logError('Failed to fetch users', error);
			return {
				success: false,
				error: error instanceof Error ? error.message : 'Unknown error',
			};
		}
	}

	private async getUserById(id: string): Promise<ApiResponse<User>> {
		try {
			logInfo('Fetching user by ID', { id });

			const response = await fetch(`${this.baseUrl}/${id}`);
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
			logError('Failed to fetch user', error);
			return {
				success: false,
				error: error instanceof Error ? error.message : 'Unknown error',
			};
		}
	}

	private async createUser(
		userData: CreateUserRequest,
	): Promise<ApiResponse<User>> {
		try {
			logInfo('Creating user', { email: userData.email });

			const response = await fetch(this.baseUrl, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(userData),
			});

			const data = await response.json();

			if (!response.ok) {
				throw new Error(
					`HTTP ${response.status}: ${response.statusText}`,
				);
			}

			logInfo('User created successfully', { id: data.id });

			return {
				success: true,
				data,
				status: response.status,
			};
		} catch (error) {
			logError('Failed to create user', error);
			return {
				success: false,
				error: error instanceof Error ? error.message : 'Unknown error',
			};
		}
	}

	private async updateUser(
		id: string,
		userData: UpdateUserRequest,
	): Promise<ApiResponse<User>> {
		try {
			logInfo('Updating user', { id });

			const { id: _, ...updateData } = userData as any; // Remove id from update data

			const response = await fetch(`${this.baseUrl}/${id}`, {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(updateData),
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
			logError('Failed to update user', error);
			return {
				success: false,
				error: error instanceof Error ? error.message : 'Unknown error',
			};
		}
	}

	private async deleteUser(id: string): Promise<ApiResponse<void>> {
		try {
			logInfo('Deleting user', { id });

			const response = await fetch(`${this.baseUrl}/${id}`, {
				method: 'DELETE',
			});

			if (!response.ok) {
				throw new Error(
					`HTTP ${response.status}: ${response.statusText}`,
				);
			}

			return {
				success: true,
				status: response.status,
			};
		} catch (error) {
			logError('Failed to delete user', error);
			return {
				success: false,
				error: error instanceof Error ? error.message : 'Unknown error',
			};
		}
	}
}

export const usersAPIService = new UsersAPIService();
