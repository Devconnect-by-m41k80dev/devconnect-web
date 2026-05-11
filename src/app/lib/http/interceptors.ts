import { AxiosResponse } from "axios";
import { httpClient } from "./http-client";
import { ApiSuccess } from "@/app/types/api/api.types";
import { useAuthStore } from "@/app/store/auth.store";

export const setupInterceptors = () => {
  httpClient.interceptors.response.use(
    (response: AxiosResponse<ApiSuccess<unknown>>) => {
      if (response.data?.success) {
        response.data = response.data.data as ApiSuccess<unknown>;
      }
      return response;
    },
    async (error) => {
      const original = error.config as typeof error.config & {
        _retry?: boolean;
      };

      if (error.response?.status === 401 && !original._retry) {
        original._retry = true;

        try {
          await httpClient.post("/auth/refresh");
          return httpClient(original);
        } catch {
          const logout = useAuthStore.getState().logout;
          logout();
          localStorage.removeItem("dc-auth");

          if (typeof window !== "undefined") {
            window.dispatchEvent(
              new CustomEvent("open-auth-modal", { detail: { mode: "login" } }),
            );
          }
        }
      }

      return Promise.reject(error);
    },
  );
};

setupInterceptors();
