import { create } from 'zustand';
import { authAPI } from '../api/endpoints';
import toast from 'react-hot-toast';

const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  // Login action
  login: async (credentials) => {
        set({ isLoading: true, error: null });
        try {
          const response = await authAPI.login(credentials);
          const { user, access, refresh } = response.data;
          
          localStorage.setItem('access_token', access);
          localStorage.setItem('refresh_token', refresh);
          
          set({ user, isAuthenticated: true, isLoading: false });
          toast.success(`Welcome back, ${user.username}!`);
          return { success: true };
        } catch (error) {
          const errorMsg = error.response?.data?.error || 'Login failed';
          set({ error: errorMsg, isLoading: false });
          toast.error(errorMsg);
          return { success: false, error: errorMsg };
        }
      },

      // Register action
      register: async (userData) => {
        set({ isLoading: true, error: null });
        try {
          const response = await authAPI.register(userData);
          const { user, access, refresh } = response.data;
          
          localStorage.setItem('access_token', access);
          localStorage.setItem('refresh_token', refresh);
          
          set({ user, isAuthenticated: true, isLoading: false });
          toast.success('Registration successful!');
          return { success: true };
        } catch (error) {
          const errorData = error.response?.data || {};
          const errorMsg = errorData.error || 'Registration failed';
          set({ error: errorData, isLoading: false });
          toast.error(errorMsg);
          return { success: false, error: errorData };
        }
      },

      // Logout action
      logout: async () => {
        try {
          await authAPI.logout();
        } catch (error) {
          console.error('Logout error:', error);
        } finally {
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          set({ user: null, isAuthenticated: false });
          toast.success('Logged out successfully');
        }
      },

      // Fetch user profile
      fetchUser: async () => {
        try {
          const response = await authAPI.getProfile();
          set({ user: response.data, isAuthenticated: true });
        } catch (error) {
          set({ user: null, isAuthenticated: false });
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
        }
      },

      // Update user profile
      updateUser: async (data) => {
        set({ isLoading: true });
        try {
          const response = await authAPI.updateProfile(data);
          set({ user: response.data, isLoading: false });
          toast.success('Profile updated successfully');
          return { success: true };
        } catch (error) {
          set({ isLoading: false });
          toast.error('Failed to update profile');
          return { success: false };
        }
      },

      // Clear error
      clearError: () => set({ error: null }),
    })
);

export default useAuthStore;
