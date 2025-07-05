// API Service for Authentication
import { logToConsole } from '../utils/helper';

// Mock API endpoints (replace with your actual API URLs)
// const API_BASE_URL = 'https://api.example.com'; // Replace with your actual API URL
const MOCK_API_DELAY = 1000; // Simulate network delay

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Mock user database (in real app, this would be on the server)
let mockUsers = [
  {
    id: 1,
    name: 'John Doe',
    email: 'john@example.com',
    mobile: '1234567890',
    password: 'hashedPassword123' // In real app, passwords are hashed
  }
];

// Authentication API functions
export const authAPI = {
  // Login user
  async login(credentials) {
    logToConsole('API_LOGIN_ATTEMPT', { email: credentials.email });
    
    try {
      await delay(MOCK_API_DELAY); // Simulate network delay
      
      // Find user by email
      const user = mockUsers.find(u => u.email === credentials.email);
      
      if (!user) {
        logToConsole('API_LOGIN_ERROR', 'User not found');
        throw new Error('Invalid email or password');
      }
      
      // In real app, you would hash the password and compare
      if (user.password !== credentials.password) {
        logToConsole('API_LOGIN_ERROR', 'Invalid password');
        throw new Error('Invalid email or password');
      }
      
      // Create session/token (in real app, this would be JWT)
      const session = {
        token: `mock-jwt-token-${Date.now()}`,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          mobile: user.mobile
        }
      };
      
      logToConsole('API_LOGIN_SUCCESS', { userId: user.id, email: user.email });
      return session;
      
    } catch (error) {
      logToConsole('API_LOGIN_ERROR', error.message);
      throw error;
    }
  },

  // Register new user
  async signup(userData) {
    logToConsole('API_SIGNUP_ATTEMPT', { email: userData.email, name: userData.name });
    
    try {
      await delay(MOCK_API_DELAY); // Simulate network delay
      
      // Check if user already exists
      const existingUser = mockUsers.find(u => u.email === userData.email);
      if (existingUser) {
        logToConsole('API_SIGNUP_ERROR', 'User already exists');
        throw new Error('User with this email already exists');
      }
      
      // Create new user
      const newUser = {
        id: mockUsers.length + 1,
        name: userData.name,
        email: userData.email,
        mobile: userData.mobile,
        password: userData.password // In real app, hash this password
      };
      
      // Add to mock database
      mockUsers.push(newUser);
      
      // Log the updated mock database
      logToConsole('MOCK_DATABASE_UPDATED', { 
        totalUsers: mockUsers.length, 
        allUsers: mockUsers.map(u => ({ id: u.id, name: u.name, email: u.email }))
      });
      
      // Create session
      const session = {
        token: `mock-jwt-token-${Date.now()}`,
        user: {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          mobile: newUser.mobile
        }
      };
      
      logToConsole('API_SIGNUP_SUCCESS', { userId: newUser.id, email: newUser.email });
      return session;
      
    } catch (error) {
      logToConsole('API_SIGNUP_ERROR', error.message);
      throw error;
    }
  },

  // Logout user
  async logout() {
    logToConsole('API_LOGOUT', 'User logged out');
    // In real app, you might invalidate the token on the server
    return { success: true };
  },

  // Get current user profile
  async getProfile(token) {
    logToConsole('API_GET_PROFILE', 'Fetching user profile');
    
    try {
      await delay(500);
      
      // In real app, you would verify the token and get user from database
      const user = mockUsers[0]; // Mock current user
      
      if (!user) {
        throw new Error('User not found');
      }
      
      return {
        id: user.id,
        name: user.name,
        email: user.email,
        mobile: user.mobile
      };
      
    } catch (error) {
      logToConsole('API_GET_PROFILE_ERROR', error.message);
      throw error;
    }
  },

  // Update user profile
  async updateProfile(token, updates) {
    logToConsole('API_UPDATE_PROFILE', updates);
    
    try {
      await delay(800);
      
      // In real app, you would update the user in database
      const userIndex = mockUsers.findIndex(u => u.id === 1); // Mock current user
      
      if (userIndex === -1) {
        throw new Error('User not found');
      }
      
      mockUsers[userIndex] = { ...mockUsers[userIndex], ...updates };
      
      return mockUsers[userIndex];
      
    } catch (error) {
      logToConsole('API_UPDATE_PROFILE_ERROR', error.message);
      throw error;
    }
  }
};

// Local storage utilities
export const storageAPI = {
  setToken(token) {
    localStorage.setItem('authToken', token);
    logToConsole('STORAGE_SET_TOKEN', 'Token saved to localStorage');
  },

  getToken() {
    const token = localStorage.getItem('authToken');
    logToConsole('STORAGE_GET_TOKEN', token ? 'Token found' : 'No token found');
    return token;
  },

  removeToken() {
    localStorage.removeItem('authToken');
    logToConsole('STORAGE_REMOVE_TOKEN', 'Token removed from localStorage');
  },

  setUser(user) {
    localStorage.setItem('user', JSON.stringify(user));
    logToConsole('STORAGE_SET_USER', user);
  },

  getUser() {
    const user = localStorage.getItem('user');
    logToConsole('STORAGE_GET_USER', user ? 'User found' : 'No user found');
    return user ? JSON.parse(user) : null;
  },

  removeUser() {
    localStorage.removeItem('user');
    logToConsole('STORAGE_REMOVE_USER', 'User removed from localStorage');
  },

  clearAuth() {
    this.removeToken();
    this.removeUser();
    logToConsole('STORAGE_CLEAR_AUTH', 'All auth data cleared');
  }
};