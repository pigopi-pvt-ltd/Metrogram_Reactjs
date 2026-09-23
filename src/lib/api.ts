import axios, { AxiosError } from "axios";
import { toast } from "sonner";

export const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3000/api";

export const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Automatically sends & receives HTTP-only cookies
  headers: {
    "Content-Type": "application/json",
  },
});

// Response Interceptor for Error Handling & 401 Redirection
api.interceptors.response.use(
  (response) => response,
  (
    error: AxiosError<{ success?: boolean; message?: string; error?: string }>,
  ) => {
    const isAuthMeCheck = error.config?.url?.includes("/auth/me");
    const status = error.response?.status;
    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      "An unexpected error occurred";

    // Don't trigger error toasts or forced logout during the silent bootup check (/auth/me)
    if (!isAuthMeCheck) {
      toast.error(message);

      if (status === 401) {
        if (window.location.pathname !== "/login") {
          window.location.href = "/login";
        }
      }
    }

    return Promise.reject(error);
  },
);

export default api;
