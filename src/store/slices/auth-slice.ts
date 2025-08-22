import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { AuthState, User, LoginCredentials, RegisterCredentials, AuthResponse } from '@/types/auth';
import { AUTH_CONFIG } from '@/constants';

// Async thunks for authentication
export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials: LoginCredentials, { rejectWithValue }) => {
    try {
      // This would be replaced with actual API call
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        const error = await response.json();
        return rejectWithValue(error.message || 'Login failed');
      }

      const data: AuthResponse = await response.json();
      
      // Store token and user data
      localStorage.setItem(AUTH_CONFIG.tokenKey, data.token);
      localStorage.setItem(AUTH_CONFIG.userKey, JSON.stringify(data.user));
      
      return data;
    } catch (error) {
      return rejectWithValue('Network error occurred');
    }
  }
);

export const registerUser = createAsyncThunk(
  'auth/register',
  async (credentials: RegisterCredentials, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        const error = await response.json();
        return rejectWithValue(error.message || 'Registration failed');
      }

      const data: AuthResponse = await response.json();
      
      localStorage.setItem(AUTH_CONFIG.tokenKey, data.token);
      localStorage.setItem(AUTH_CONFIG.userKey, JSON.stringify(data.user));
      
      return data;
    } catch (error) {
      return rejectWithValue('Network error occurred');
    }
  }
);

export const logoutUser = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem(AUTH_CONFIG.tokenKey)}`,
        },
      });
    } catch (error) {
      console.error('Logout API call failed:', error);
    } finally {
      // Clear local storage regardless of API call success
      localStorage.removeItem(AUTH_CONFIG.tokenKey);
      localStorage.removeItem(AUTH_CONFIG.userKey);
      localStorage.removeItem(AUTH_CONFIG.refreshTokenKey);
    }
  }
);

export const refreshToken = createAsyncThunk(
  'auth/refreshToken',
  async (_, { rejectWithValue }) => {
    try {
      const refreshToken = localStorage.getItem(AUTH_CONFIG.refreshTokenKey);
      if (!refreshToken) {
        return rejectWithValue('No refresh token available');
      }

      const response = await fetch('/api/auth/refresh', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken }),
      });

      if (!response.ok) {
        return rejectWithValue('Token refresh failed');
      }

      const data: AuthResponse = await response.json();
      
      localStorage.setItem(AUTH_CONFIG.tokenKey, data.token);
      localStorage.setItem(AUTH_CONFIG.userKey, JSON.stringify(data.user));
      
      return data;
    } catch (error) {
      return rejectWithValue('Network error occurred');
    }
  }
);

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  token: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    clearAuth: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.token = null;
      state.error = null;
    },
    initializeAuth: (state) => {
      const token = localStorage.getItem(AUTH_CONFIG.tokenKey);
      const userData = localStorage.getItem(AUTH_CONFIG.userKey);
      
      if (token && userData) {
        try {
          state.user = JSON.parse(userData);
          state.token = token;
          state.isAuthenticated = true;
        } catch (error) {
          // Clear corrupted data
          localStorage.removeItem(AUTH_CONFIG.tokenKey);
          localStorage.removeItem(AUTH_CONFIG.userKey);
        }
      }
    },
  },
  extraReducers: (builder) => {
    // Login
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        state.isAuthenticated = false;
      });

    // Register
    builder
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        state.isAuthenticated = false;
      });

    // Logout
    builder
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.error = null;
        state.isLoading = false;
      });

    // Refresh Token
    builder
      .addCase(refreshToken.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(refreshToken.rejected, (state) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
      });
  },
});

export const { clearError, setUser, clearAuth, initializeAuth } = authSlice.actions;
export default authSlice.reducer;
