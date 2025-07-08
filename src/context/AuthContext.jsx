// import React, { createContext, useContext, useState, useEffect } from 'react';
// import { authAPI, storageAPI } from '../services/api.service';
// import { logToConsole } from '../utils/helper';

// const AuthContext = createContext();

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (!context) {
//     throw new Error('useAuth must be used within an AuthProvider');
//   }
//   return context;
// };

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [token, setToken] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   // Initialize auth state from localStorage
//   useEffect(() => {
//     const initializeAuth = () => {
//       try {
//         const savedToken = storageAPI.getToken();
//         const savedUser = storageAPI.getUser();
        
//         if (savedToken && savedUser) {
//           setToken(savedToken);
//           setUser(savedUser);
//           logToConsole('AUTH_INITIALIZED', { user: savedUser.name, email: savedUser.email });
//         }
//       } catch (error) {
//         logToConsole('AUTH_INIT_ERROR', error.message);
//         storageAPI.clearAuth();
//       } finally {
//         setLoading(false);
//       }
//     };

//     initializeAuth();
//   }, []);

//   // Login function
//   const login = async (credentials) => {
//     try {
//       setLoading(true);
//       setError(null);
      
//       logToConsole('AUTH_LOGIN_START', { email: credentials.email });
      
//       const session = await authAPI.login(credentials);
      
//       // Save to state and localStorage
//       setToken(session.token);
//       setUser(session.user);
//       storageAPI.setToken(session.token);
//       storageAPI.setUser(session.user);
      
//       logToConsole('AUTH_LOGIN_SUCCESS', { user: session.user.name, email: session.user.email });
      
//       return { success: true, user: session.user };
      
//     } catch (error) {
//       setError(error.message);
//       logToConsole('AUTH_LOGIN_ERROR', error.message);
//       throw error;
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Signup function
//   const signup = async (userData) => {
//     try {
//       setLoading(true);
//       setError(null);
      
//       logToConsole('AUTH_SIGNUP_START', { email: userData.email, name: userData.name });
      
//       const session = await authAPI.signup(userData);
      
//       // Save to state and localStorage
//       setToken(session.token);
//       setUser(session.user);
//       storageAPI.setToken(session.token);
//       storageAPI.setUser(session.user);
      
//       logToConsole('AUTH_SIGNUP_SUCCESS', { user: session.user.name, email: session.user.email });
      
//       return { success: true, user: session.user };
      
//     } catch (error) {
//       setError(error.message);
//       logToConsole('AUTH_SIGNUP_ERROR', error.message);
//       throw error;
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Logout function
//   const logout = async () => {
//     try {
//       logToConsole('AUTH_LOGOUT_START', { user: user?.name });
      
//       await authAPI.logout();
      
//       // Clear state and localStorage
//       setToken(null);
//       setUser(null);
//       setError(null);
//       storageAPI.clearAuth();
      
//       logToConsole('AUTH_LOGOUT_SUCCESS', 'User logged out successfully');
      
//     } catch (error) {
//       logToConsole('AUTH_LOGOUT_ERROR', error.message);
//       // Even if API call fails, clear local state
//       setToken(null);
//       setUser(null);
//       setError(null);
//       storageAPI.clearAuth();
//     }
//   };

//   // Update user profile
//   const updateProfile = async (updates) => {
//     try {
//       setLoading(true);
//       setError(null);
      
//       logToConsole('AUTH_UPDATE_PROFILE_START', updates);
      
//       const updatedUser = await authAPI.updateProfile(token, updates);
      
//       // Update state and localStorage
//       setUser(updatedUser);
//       storageAPI.setUser(updatedUser);
      
//       logToConsole('AUTH_UPDATE_PROFILE_SUCCESS', updatedUser);
      
//       return { success: true, user: updatedUser };
      
//     } catch (error) {
//       setError(error.message);
//       logToConsole('AUTH_UPDATE_PROFILE_ERROR', error.message);
//       throw error;
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Clear error
//   const clearError = () => {
//     setError(null);
//   };

//   const value = {
//     user,
//     token,
//     loading,
//     error,
//     isAuthenticated: !!user && !!token,
//     login,
//     signup,
//     logout,
//     updateProfile,
//     clearError
//   };

//   return (
//     <AuthContext.Provider value={value}>
//       {children}
//     </AuthContext.Provider>
//   );
// }; 