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
    role:null,
    profile_url: "",
  },
  isAuthenticated: false,
  isLoading: false,
  error: null,
  token: null,
  refreshToken: null,
};

const authSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setAuth: (state, action: PayloadAction<User>) => {
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
          localStorage.removeItem(AUTH_CONFIG.tokenKey);
          localStorage.removeItem(AUTH_CONFIG.userKey);
        }
      }
    },
  },
});
export const { setAuth, clearAuth, initializeAuth } = authSlice.actions;
export default authSlice.reducer;
