import { useState, useCallback } from "react";
import axios, { type AxiosRequestConfig, type Method } from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5005";

let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

function subscribeTokenRefresh(cb: (token: string) => void) {
  refreshSubscribers.push(cb);
}

function onRefreshed(token: string) {
  refreshSubscribers.forEach((cb) => cb(token));
  refreshSubscribers = [];
}

export function useApi() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const refreshAccessToken = useCallback(async (): Promise<string> => {
    try {
      const res = await axios.post(
        `${API_BASE_URL}/auth/refresh`,
        {},
        { withCredentials: true }
      );
      return res.data.accessToken;
    } catch (err) {
      throw new Error("Failed to refresh token" + (err instanceof Error ? `: ${err.message}` : ""));
    }
  }, []);

  const callApi = useCallback(
    async <ResponseData = unknown, RequestData = Record<string, unknown>>(
      { endpoint, method = "GET", data, params }: {
        endpoint: string;
        method?: Method;
        data?: RequestData;
        params?: Record<string, string | number | boolean>;
      }
    ): Promise<{ data?: ResponseData; error?: Error; loading: boolean }> => {
      setLoading(true);
      setError(null);

      let token = localStorage.getItem("accessToken"); // or wherever you store it

      const makeRequest = async (): Promise<ResponseData> => {
        const config: AxiosRequestConfig = {
          url: `${API_BASE_URL}${endpoint}`,
          method,
          data,
          params,
          withCredentials: true,
          headers: { 
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        };

        const response = await axios<ResponseData>(config);
        return response.data;
      };

      try {
        return { data: await makeRequest(), loading: false };
      } catch (err: unknown) {
        // If 401 → try refreshing
        if (axios.isAxiosError(err) && err.response?.status === 401) {
          if (!isRefreshing) {
            isRefreshing = true;
            try {
              token = await refreshAccessToken();
              localStorage.setItem("accessToken", token);
              isRefreshing = false;
              onRefreshed(token);
            } catch (refreshErr) {
              isRefreshing = false;
              throw refreshErr;
            }
          } else {
            // Wait for ongoing refresh
            token = await new Promise<string>((resolve) => subscribeTokenRefresh(resolve));
          }

          try {
            return { data: await makeRequest(), loading: false }; // Retry original request
          } catch (retryErr: unknown) {
            const typedError = new Error(retryErr instanceof Error ? retryErr.message : "Retry failed");
            setError(typedError);
            setLoading(false);
            return { error: typedError, loading: false };
          }
        }

        // Any other error
        const typedError = axios.isAxiosError(err)
          ? new Error(err.response?.data?.message || err.message)
          : err instanceof Error
          ? err
          : new Error("An unexpected error occurred");

        setError(typedError);
        setLoading(false);
        return { error: typedError, loading: false };
      }
    },
    [refreshAccessToken]
  );

  return { callApi, loading, error };
}
