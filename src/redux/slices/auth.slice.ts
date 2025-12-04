import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AuthState, User } from "@/types/auth.types";
import { AUTH_CONFIG } from "@/constants";
const initialState: AuthState = {
  user: {
    id: "",
    first_name: "",
    last_name: "",
    email: "",
    contact: "",
    street_address: "",
    city: "",
    state: "",
    zip_code: "",
    country: "",
    tax_vat_number: "",
    emergency_contact_name: "",
    emergency_contact_no: "",
    profile_url: "",
    role_id: "",
    status: "",
    role: null,
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
    setProfile: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
    },
    setOrganization: (state, action: PayloadAction<any>) => {
      state.organization = action.payload;
    },
    clearAuth: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.error = null;
      state.organization = null
      state.refreshToken = null
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
export const { setAuth, clearAuth, setProfile, setOrganization, initializeAuth } = authSlice.actions;
export default authSlice.reducer;
