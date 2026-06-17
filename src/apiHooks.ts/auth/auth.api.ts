/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ResendOtpData,
  signinData,
  signUpData,
  userProfile,
  VerifyOtpData,
} from "./auth.types";
import { request } from "@/utils/requestFunction";
import { toast } from "@/hooks/useToast";
import {
  changePasswordData,
  forgotPasswordData,
  resetPasswordData,
  signInResponse,
} from "@/types/auth.types";
import { PermissionTypeGenerator } from "@/utils/permissionTypeGenerator";
import { CreatePasswordSchemaType } from "@/schemas/auth.schemas";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/redux/store";
import { setAuth } from "@/redux/slices/auth.slice";

const ENDPOINTS = {
  SIGN_IN: "/og/auth/sign-in",
  SIGN_UP: "/og/auth/sign-up",
  LOG_OUT: "/og/auth/logout",
  VERIFY_OTP: "/og/auth/verify-email",
  RESENT_OTP: "/og/auth/resend-otp",
  GET_ME: "/og/auth/me",
  PROFILE: "/og/profile/complete-profile",
  PERMISSIONS: "/og/auth/permissions",
  DELETE_ACCOUNT: "/og/auth/delete-account",
  REMOVE_IMAGE: "/og/profile/remove-image",
  UPLOAD_IMAGE: "/og/profile/upload-image",
  CHANGE_PASSWORD: "/og/auth/change-password",
  FORGOT_PASSWORD: "/og/auth/forgot-password",
  RESET_PASSWORD: "/og/auth/reset-password",
  // ACCEPT_EMAIL_CHANGE: "/auth/send-otp-for-change-email",
  VALIDATE_ACCEPT_EMAIL_TOKEN: "/og/auth/verify-change-email-token",
  VERIFY_PASSWORD: "/og/auth/verify-password",
  CHANGE_EMAIL: "/og/auth/change-email-final",
  SEND_CHANGE_EMAIL_VERIFICATION: "/og/auth/send-change-email-verification",
  SEND_OTP_FOR_CHANGE_EMAIL: "/og/auth/send-otp-for-change-email",
  DECLINE_CHANGE_EMAIL: "/og/auth/decline-change-email",
  LOGIN_WITH_GOOGLE: "/og/auth/google",
  CHECK_PASSWORD: "/og/auth/check-password",
  CREATE_PASSWORD: "/og/auth/create-password",
  GET_ALL_IDENTITIES: "/og/auth/identities",
  REMOVE_IDENTITY: "/og/auth/identity",
  IMPERSONATE_LOGIN: "/og/auth/impersonate-login",
};
//=================API HOOKS==================
//1.LOGIN
export const useLogin = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: signinData) =>
      request<signInResponse>(ENDPOINTS.SIGN_IN, "POST", {}, data),
    onSuccess: async (response) => {
      queryClient.setQueryData(
        ["user", response?.data?.user.id],
        response?.data?.user,
      );

      toast.success(
        "Login successful!",
        `Welcome back ${response?.data?.user?.first_name} to Owners Inventory`,
      );
    },
    onError: (error: any) => {
      const message = (error as Error)?.message || "Invalid credentials";
      toast.error("Login failed", message);
    },
  });
};

export const useImpersonateLogin = () => {
  const queryClient = useQueryClient();
  const navigate = useRouter();
  //set the user data in the redux store
  const dispatch = useAppDispatch();
  return useMutation({
    mutationFn: (data: { token: string }) =>
      request<signInResponse>(ENDPOINTS.IMPERSONATE_LOGIN, "POST", {}, data),

    onSuccess: async (response) => {
      queryClient.setQueryData(
        ["user", response?.data?.user.id],
        response?.data?.user,
      );

      dispatch(
        setAuth({
          user: response.data?.user!,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        }),
      );

      toast.success(
        "Impersonation Login successful!",
        `You are now impersonating ${response?.data?.user?.first_name}`,
      );
      navigate.replace("/");
    },
    onError: (error: any) => {
      const message = (error as Error)?.message || "Impersonation login failed";
      toast.error("Impersonation failed", message);
    },
  });
};
//2.SIGN UP
export const useSignUp = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: signUpData) =>
      request<{ id: string; [key: string]: any }>(
        ENDPOINTS.SIGN_UP,
        "POST",
        {},
        data,
      ),
    onSuccess: (user, data) => {
      queryClient.setQueryData(["user", user.id], user);
      toast.success(
        "Verification Email sent",
        `Verification email sent successfully to ${data.email}`,
      );
    },
    onError: (error: any) => {
      const message = (error as Error)?.message || "Signup failed";
      toast.error("Signup failed", message);
    },
  });
};
//3.LOG OUT
export const useLogout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => request(ENDPOINTS.LOG_OUT, "GET"),
    onSuccess: () => {
      queryClient.clear();
      if (process.env.NODE_ENV === "development") {
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
//4.VERIFY OTP
export const useVerifyOtp = () => {
  return useMutation({
    mutationFn: (data: VerifyOtpData) =>
      request(ENDPOINTS.VERIFY_OTP, "POST", {}, data),
    onSuccess: (data) => {
      toast.success(
        "OTP verified ",
        data.message || "OTP verification successful",
      );
    },
    onError: (error) => {
      const message = (error as Error)?.message || "OTP verification failed";
      toast.error("OTP verification failed", message);
    },
  });
};
//5.RESEND OTP
export const useResendOtp = () => {
  return useMutation({
    mutationFn: (data: ResendOtpData) =>
      request(ENDPOINTS.RESENT_OTP, "POST", {}, data),
    onSuccess: (data) => {
      // toast.success("OTP resent  ", data.message || "OTP resent successfully");
      toast.success("OTP resend successfully.", "Check your email for the OTP");
    },
    onError: (error) => {
      const message = (error as Error)?.message || "Resent otp failed";
      toast.error("Resent failed", message);
    },
  });
};
//6.GET ME
export const useGetMe = (options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: ["me"],
    queryFn: () => request(ENDPOINTS.GET_ME, "GET", {}),
    retry: false,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5, // 5 minutes
    ...options,
  });
};
//7.UPDATE PROFILE
export const useUpdateProfile = () => {
  return useMutation({
    mutationFn: (profileData: userProfile) => {
      return request(ENDPOINTS.PROFILE, "POST", {}, { userData: profileData });
    },
    onSuccess: () => {
      toast.success("Profile updated successfully");
    },
    onError: () => {
      toast.error("Error updating profile");
    },
  });
};

//8.GET ALL PERMISSIONS
export const useGetAllPermissions = (role_id: string) => {
  return useQuery({
    queryKey: ["permissions", role_id],
    queryFn: () => request(ENDPOINTS.PERMISSIONS, "GET"),
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    retry: 2,
  });
};
//9.DELETE ACCOUNT
export const useDeleteAccount = () => {
  return useMutation({
    mutationFn: () => request(ENDPOINTS.DELETE_ACCOUNT, "DELETE"),
    onSuccess: () => {
      toast.success("Account deleted successfully");
    },
    onError: (error: any) => {
      const message = (error as Error)?.message || "Account deletion failed";
      toast.error("Account deletion failed", message);
    },
  });
};

//10.REMOVE PROFILE IMAGE
export const useRemoveProfileImage = () => {
  return useMutation({
    mutationFn: () => request(ENDPOINTS.REMOVE_IMAGE, "DELETE"),
    onSuccess: () => {
      toast.success("Profile image removed successfully");
    },
    onError: (error: any) => {
      const message =
        (error as Error)?.message || "Failed to remove profile image";
      toast.error("Profile image removal failed", message);
    },
  });
};
//11.UPLOAD PROFILE IMAGE
export const useUploadProfileImage = () => {
  return useMutation({
    mutationFn: (formData: FormData) =>
      request<{ success: boolean; url?: string; error?: string }>(
        ENDPOINTS.UPLOAD_IMAGE,
        "POST",
        {},
        formData,
      ),
    onSuccess: () => {
      toast.success("Profile image uploaded successfully");
    },
    onError: (error: any) => {
      const message =
        (error as Error)?.message || "Failed to upload profile image";
      toast.error("Profile image upload failed", message);
    },
  });
};
//12.CHANGE PASSWORD
export const useChangePassword = () => {
  return useMutation({
    mutationFn: (data: changePasswordData) =>
      request(ENDPOINTS.CHANGE_PASSWORD, "POST", {}, data),
    onSuccess: () => {
      toast.success("Password changed successfully");
    },
    onError: (error: any) => {
      const message = (error as Error)?.message || "Failed to change password";
      toast.error("Password change failed", message);
    },
  });
};
//13.FORGOT PASSWORD
export const useForgotPassword = () => {
  return useMutation({
    mutationFn: (data: forgotPasswordData) =>
      request(ENDPOINTS.FORGOT_PASSWORD, "POST", {}, data),
    onSuccess: () => {
      toast.success("Password reset email sent successfully");
    },
    onError: (error: any) => {
      const message =
        (error as Error)?.message || "Failed to send password reset email";
      toast.error("Password reset failed", message);
    },
  });
};
//14.RESET PASSWORD
export const useResetPassword = () => {
  return useMutation({
    mutationFn: (data: resetPasswordData) =>
      request(ENDPOINTS.RESET_PASSWORD, "POST", {}, data),
    onSuccess: () => {
      toast.success("Password reset successfully");
    },
    onError: (error: any) => {
      const message = (error as Error)?.message || "Failed to reset password";
      toast.error("Password reset failed", message);
    },
  });
};
//15 SEND EMAIL FOR CHANGE EMAIL
export const useSendChangeEmailVerification = () => {
  return useMutation({
    mutationFn: (data: { newEmail: string }) =>
      request(ENDPOINTS.SEND_CHANGE_EMAIL_VERIFICATION, "POST", {}, data),
    onSuccess: () => {
      toast.success("Email verification sent successfully");
    },
    onError: (error: any) => {
      const message =
        (error as Error)?.message || "Failed to send email verification";
      toast.error("Email send failed", message);
    },
  });
};
//16.SEND OTP FOR CHANGE EMAIL
export const useSendOtpForChangeEmail = () => {
  return useMutation({
    mutationFn: (data: { token: string }) =>
      request(ENDPOINTS.SEND_OTP_FOR_CHANGE_EMAIL, "POST", {}, data),
    mutationKey: ["send-otp-for-change-email"],
    onSuccess: () => {
      toast.success("OTP sent successfully");
    },
    onError: (error: any) => {
      const message = (error as Error)?.message || "Failed to send OTP";
      toast.error("OTP send failed", message);
    },
  });
};
//17.VALIDATE ACCEPT EMAIL TOKEN
export const useValidateAcceptEmailToken = () => {
  return useMutation({
    mutationFn: (data: { token: string }) =>
      request(ENDPOINTS.VALIDATE_ACCEPT_EMAIL_TOKEN, "POST", {}, data),
    mutationKey: ["validate-accept-email-token"],
  });
};
//18.VERIFY PASSWORD
export const useVerifyPassword = () => {
  return useMutation({
    mutationFn: (data: { email: string; password: string }) =>
      request(ENDPOINTS.VERIFY_PASSWORD, "POST", {}, data),
    mutationKey: ["verify-password"],
  });
};
//20.CHANGE EMAIL FINAL
export const useChangeEmailFinal = () => {
  return useMutation({
    mutationFn: (data: { token: string; otp: string }) =>
      request(ENDPOINTS.CHANGE_EMAIL, "POST", {}, data),
    mutationKey: ["change-email"],
    onSuccess: () => {
      toast.success("Email changed successfully");
    },
    onError: (error: any) => {
      const message = (error as Error)?.message || "Failed to change email";
      toast.error("Email change failed", message);
    },
  });
};
export const useDeclineChangeEmail = () => {
  return useMutation({
    mutationKey: ["decline-change-email"],
    mutationFn: (data: { token: string }) =>
      request(ENDPOINTS.DECLINE_CHANGE_EMAIL, "POST", {}, data),
    onSuccess: () => {
      toast.success("Email change declined successfully");
    },
    onError: (error: any) => {
      const message =
        (error as Error)?.message || "Failed to decline email change";
      toast.error(message);
    },
  });
};
export const useLoginWithGoogle = () => {
  return useMutation({
    mutationFn: (data: { code: string }) =>
      request(ENDPOINTS.LOGIN_WITH_GOOGLE, "POST", {}, data),
    mutationKey: ["login-with-google"],
    onSuccess: () => {
      toast.success("Login successful");
    },
    onError: (error: any) => {
      const message = (error as Error)?.message || "Failed to login";
      toast.error("Login failed", message);
    },
  });
};
export const useCheckPassword = () => {
  return useQuery({
    queryKey: ["check-password"],
    queryFn: () => request(ENDPOINTS.CHECK_PASSWORD, "GET"),
    retry: false,
    select: (data: any) => data?.data,
    refetchOnWindowFocus: false,
  });
};
export const useCreatePassword = () => {
  return useMutation({
    mutationFn: (data: { password: string }) =>
      request(ENDPOINTS.CREATE_PASSWORD, "POST", {}, data),
    mutationKey: ["create-password"],
    onSuccess: () => {
      toast.success("Password created successfully");
    },
    onError: (error: any) => {
      const message = (error as Error)?.message || "Failed to create password";
      toast.error("Password creation failed", message);
    },
  });
};
export const getAllIdentities = () => {
  return useQuery({
    queryKey: ["all-identities"],
    queryFn: () => request(ENDPOINTS.GET_ALL_IDENTITIES, "GET"),
    retry: false,
    select: (data: any) => data?.data,
    refetchOnWindowFocus: false,
  });
};

export const useRemoveIdentity = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (identityId: string) =>
      request(
        `${ENDPOINTS.REMOVE_IDENTITY}`,
        "DELETE",
        {},
        { token: identityId },
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["all-identities"] });
      toast.success("Account removed successfully");
    },
    onError: (error: any) => {
      const message = (error as Error)?.message || "Failed to remove account";
      toast.error("Error", message);
    },
  });
};
