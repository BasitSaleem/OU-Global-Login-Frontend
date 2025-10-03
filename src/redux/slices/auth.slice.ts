import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AuthState, User } from "@/types/auth.types";
import { AUTH_CONFIG } from "@/constants";

const initialState: AuthState = {
  user: {
    id: "",
    first_name: "",
    last_name: "",
    email: "",
    role_id: "",
    status: "",
    role: null,
    profile_url: "",
  },
  isAuthenticated: false,
  organization: null,
  isLoading: false,
  error: null,
  refreshToken: null,
};

const authSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setAuth: (state, action: PayloadAction<AuthState>) => {
      state.user = action.payload.user;
      state.organization = action.payload.organization;
      state.isAuthenticated = true;
      state.refreshToken = action.payload.refreshToken;
    },
    clearAuth: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.error = null;
    },
    initializeAuth: (state) => {
      const token = localStorage.getItem(AUTH_CONFIG.tokenKey);
      const userData = localStorage.getItem(AUTH_CONFIG.userKey);

      if (token && userData) {
        try {
          state.user = JSON.parse(userData);
          state.isAuthenticated = true;
        } catch (error) {
          localStorage.removeItem(AUTH_CONFIG.tokenKey);
          localStorage.removeItem(AUTH_CONFIG.userKey);
        }
      }
    },
  },
});
export const { setAuth, clearAuth, initializeAuth } = authSlice.actions;
export default authSlice.reducer;
