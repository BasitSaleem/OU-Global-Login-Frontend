/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ResendOtpData, signinData, signUpData, userProfile, VerifyOtpData } from "./auth.types";
import { request } from "@/utils/requestFunction";
import { toast } from "@/hooks/useToast";
import { UserInfo } from "os";
import { signInResponse } from "@/types/auth.types";
import { PermissionTypeGenerator } from "@/utils/permissionTypeGenerator";
const ENDPOINTS = {
  SIGN_IN: "/auth/sign-in",
  SIGN_UP: "/auth/sign-up",
  LOG_OUT: "/auth/logout",
  VERIFY_OTP: "/auth/verify-email",
  RESENT_OTP: "/auth/resend-otp",
  GET_ME: "/auth/me",
  PROFILE: "/profile/complete-profile",
  PERMISSIONS: "/auth/permissions"
};

export const useLogin = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: signinData) =>
      request<signInResponse>(
        ENDPOINTS.SIGN_IN,
        "POST",
        {},
        data
      ),
    onSuccess: async (response) => {
      queryClient.setQueryData(["user", response?.data?.user.id], response?.data?.user);
      if (process.env.NODE_ENV === 'development') {
        await PermissionTypeGenerator.processSignInResponse(response?.data?.user!);
      }

      toast.success("Login successful!", `Welcome back ${response?.data?.user?.first_name} to Owners Universe`);
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
      if (process.env.NODE_ENV === 'development') {
        PermissionTypeGenerator.clearPermissions();
      }

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

export const useGetMe = () => {
  return useQuery({
    queryKey: ["me"],
    queryFn: () =>
      request(ENDPOINTS.GET_ME, "GET", {}),
    retry: false
  });
};

export const useUpdateProfile = () => {
  return useMutation({
    mutationFn: (profileData: userProfile) => {
      return request(ENDPOINTS.PROFILE, "POST", {}, { userData: profileData })
    },
    onSuccess: () => { toast.success("Profile updated successfully") },
    onError: () => {
      toast.error("Error updating profile")
    }
  })
}
export const useGetAllPermissions = (role_id: string) => {
  return useQuery({
    queryKey: ["permissions", role_id],
    queryFn: () => request(ENDPOINTS.PERMISSIONS, "GET"),
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    retry: 2,
  });
};
