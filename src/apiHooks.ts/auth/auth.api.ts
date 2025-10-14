/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { signinData, signUpData } from "./auth.types";
import { request } from "@/utils/requestFunction";
import { toast } from "@/hooks/useToast";
const ENDPOINTS = {
  SIGN_IN: "/auth/sign-in",
  SIGN_UP: "/auth/sign-up",
  LOG_OUT: "/auth/logout",
};

export const useLogin = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: signinData) =>
      request<{ id: string;[key: string]: any }>(
        ENDPOINTS.SIGN_IN,
        "POST",
        {},
        data
      ),
    onSuccess: (user) => {
      queryClient.setQueryData(["user", user.id], user);
      toast.success("Login successful!", "Welcome back to Owners Universe");
    },
    onError: (error: any) => {
      const message = (error as Error)?.message || "Invalid credentials";
      toast.error("Login failed", message);
    },
  });
};

export const useSignUp = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: signUpData) =>
      request<{ id: string;[key: string]: any }>(
        ENDPOINTS.SIGN_UP,
        "POST",
        {},
        data
      ),
    onSuccess: (user) => {
      queryClient.setQueryData(["user", user.id], user);
      toast.success(
        "Account created!",
        "Welcome to Owners Universe! Your account has been created successfully."
      );
    },
    onError: (error: any) => {
      const message = (error as Error)?.message || "Signup failed";
      toast.error("Signup failed", message);
    },
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => request(ENDPOINTS.LOG_OUT, "GET"),
    onSuccess: () => {
      queryClient.clear();
      document.cookie = "";
      localStorage.clear();
      sessionStorage.clear();
      toast.success("Logged out", "You have been logged out successfully");
    },
    onError: (error: any) => {
      const message = (error as Error)?.message || "Logout failed";
      toast.error("Logout failed", message);
    },
  });
};
