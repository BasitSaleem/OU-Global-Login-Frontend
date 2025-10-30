/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ResendOtpData, signinData, signUpData, VerifyOtpData } from "./auth.types";
import { request } from "@/utils/requestFunction";
import { toast } from "@/hooks/useToast";
const ENDPOINTS = {
  SIGN_IN: "/auth/sign-in",
  SIGN_UP: "/auth/sign-up",
  LOG_OUT: "/auth/logout",
  VERIFY_OTP: "/auth/verify-email",
  RESENT_OTP: "/auth/resend-otp"
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
    onSuccess: (user, data) => {
      queryClient.setQueryData(["user", user.id], user);
      console.log(data, "response dataaa");
      toast.success(
        "Verification Email sent",
        `Verification email sent successfully to ${data.email}`
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

export const useVerifyOtp = () => {
  return useMutation({
    mutationFn: (data: VerifyOtpData) =>
      request(ENDPOINTS.VERIFY_OTP, "POST", {}, data),
    onSuccess: (data) => {
      toast.success("OTP verified ", data.message || "OTP verification successful")
    },
    onError: (error) => {
      const message = (error as Error)?.message || "OTP verification failed";
      toast.error("OTP verification failed", message);
    }
  });
};

export const useResendOtp = () => {
  return useMutation({
    mutationFn: (data: ResendOtpData) =>
      request(ENDPOINTS.RESENT_OTP, "POST", {}, data),
    onSuccess: (data) => {
      toast.success("OTP resent  ", data.message || "OTP resent successfully")

    },
    onError: (error) => {
      const message = (error as Error)?.message || "Resent otp failed";
      toast.error("Resent failed", message);
    }
  });
};
