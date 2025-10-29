import axios, { AxiosError } from "axios";
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";

const BASE_URL = "http://localhost:5005/";

interface ApiError {
  message: string;
  status?: number;
  details?: unknown;
}

interface ApiResult<T> {
  data?: T;
  error?: ApiError;
}

type HttpMethod = "get" | "post" | "put" | "delete";

const api: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

async function request<TResponse, TBody = undefined>(
  method: HttpMethod,
  endpoint: string,
  body?: TBody,
  options?: AxiosRequestConfig<TBody>
): Promise<ApiResult<TResponse>> {
  try {
    let response: AxiosResponse<TResponse>;

    if (method === "get" || method === "delete") {
      response = await api[method]<TResponse>(endpoint, {
        ...options,
        params: body,
      });
    } else {
      response = await api[method]<TResponse>(endpoint, body, options);
    }

    return { data: response.data };
  } catch (err) {
    const error = err as AxiosError<unknown>;
    const status = error.response?.status;
    const message =
      (error.response?.data as { message?: string })?.message ??
      error.message ??
      "An unexpected error occurred.";
    const details = error.response?.data;

    return { error: { message, status, details } };
  }
}

const apiClient = {
  get: <TResponse>(
    endpoint: string,
    params?: Record<string, unknown>,
    options?: AxiosRequestConfig
  ) => request<TResponse, typeof params>("get", endpoint, params, options),

  post: <TResponse, TBody>(
    endpoint: string,
    body: TBody,
    options?: AxiosRequestConfig<TBody>
  ) => request<TResponse, TBody>("post", endpoint, body, options),

  put: <TResponse, TBody>(
    endpoint: string,
    body: TBody,
    options?: AxiosRequestConfig<TBody>
  ) => request<TResponse, TBody>("put", endpoint, body, options),

  delete: <TResponse>(
    endpoint: string,
    params?: Record<string, unknown>,
    options?: AxiosRequestConfig
  ) => request<TResponse, typeof params>("delete", endpoint, params, options),
};

export default apiClient;
