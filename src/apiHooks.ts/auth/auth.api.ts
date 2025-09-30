/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/components/ui/toast";
import { signinData, signUpData } from "./auth.types";
import { request } from "@/utils/requestFunction";
const ENDPOINTS = {
  signin: "/auth/sign-in",
  signUp: "/auth/sign-up",
  logout: "/auth/logout",
};

export const useLogin = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: signinData) =>
      request<{ id: string; [key: string]: any }>(
        ENDPOINTS.signin,
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
      request<{ id: string; [key: string]: any }>(
        ENDPOINTS.signUp,
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
    mutationFn: () => request(ENDPOINTS.logout, "GET"),
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: ["user"] });
      toast.success("Logged out", "You have been logged out successfully");
    },
    onError: (error: any) => {
      const message = (error as Error)?.message || "Logout failed";
      toast.error("Logout failed", message);
    },
  });
};
