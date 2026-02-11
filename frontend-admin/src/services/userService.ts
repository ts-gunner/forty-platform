import { message } from 'antd';
import umiRequest from 'umi-request';

// User API service
export const userApi = {
  // Get all users with pagination
  getUsers: async (params: { page: number; pageSize: number; search?: string }) => {
    try {
      const response = await umiRequest('/api/users', {
        method: 'GET',
        params,
      });
      return response;
    } catch (error) {
      message.error('Failed to fetch users');
      console.error('Error fetching users:', error);
      // Return mock data for demonstration
      return {
        data: [
          {
            id: 1,
            name: "John Doe",
            email: "john.doe@example.com",
            role: "Admin",
            status: "Active",
            createdAt: "2024-01-01",
          },
          {
            id: 2,
            name: "Jane Smith",
            email: "jane.smith@example.com",
            role: "User",
            status: "Active",
            createdAt: "2024-01-02",
          },
        ],
        total: 2,
      };
    }
  },

  // Get user by ID
  getUserById: async (id: number) => {
    try {
      const response = await umiRequest(`/api/users/${id}`, {
        method: 'GET',
      });
      return response;
    } catch (error) {
      message.error('Failed to fetch user');
      console.error('Error fetching user:', error);
      // Return mock data for demonstration
      return {
        id: 1,
        name: "John Doe",
        email: "john.doe@example.com",
        role: "Admin",
        status: "Active",
        createdAt: "2024-01-01",
      };
    }
  },

  // Create new user
  createUser: async (userData: { name: string; email: string; role: string; status: string }) => {
    try {
      const response = await umiRequest('/api/users', {
        method: 'POST',
        data: userData,
      });
      message.success('User created successfully');
      return response;
    } catch (error) {
      message.error('Failed to create user');
      console.error('Error creating user:', error);
      // Return mock data for demonstration
      return {
        id: 3,
        ...userData,
        createdAt: new Date().toISOString().split("T")[0],
      };
    }
  },

  // Update user
  updateUser: async (id: number, userData: { name: string; email: string; role: string; status: string }) => {
    try {
      const response = await umiRequest(`/api/users/${id}`, {
        method: 'PUT',
        data: userData,
      });
      message.success('User updated successfully');
      return response;
    } catch (error) {
      message.error('Failed to update user');
      console.error('Error updating user:', error);
      // Return mock data for demonstration
      return {
        id,
        ...userData,
      };
    }
  },

  // Delete user
  deleteUser: async (id: number) => {
    try {
      await umiRequest(`/api/users/${id}`, {
        method: 'DELETE',
      });
      message.success('User deleted successfully');
      return true;
    } catch (error) {
      message.error('Failed to delete user');
      console.error('Error deleting user:', error);
      return true;
    }
  },
};
