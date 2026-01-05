import { useState } from "react";
import axios, { type AxiosResponse, type Method } from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5005";

type ApiRequest<RequestData, QueryParams> = {
  endpoint: string;
  method?: Method;
  data?: RequestData;
  params?: QueryParams;
};

type ApiResult<ResponseData> = {
  data?: ResponseData;
  error?: Error;
  loading: boolean;
};

export function useApi() {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  async function callApi<
    ResponseData,
    RequestData = Record<string, unknown>,
    QueryParams = Record<string, string | number | boolean>
  >(
    request: ApiRequest<RequestData, QueryParams>
  ): Promise<ApiResult<ResponseData>> {
    setLoading(true);
    setError(null);

    const { endpoint, method = "GET", data, params } = request;

    try {
      const response: AxiosResponse<ResponseData> = await axios({
        url: `${API_BASE_URL}${endpoint}`,
        method,
        data,
        params,
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      });

      return { data: response.data, loading: false };
    } catch (err) {
      let typedErr: Error;

      if (axios.isAxiosError(err)) {
        const message =
          (err.response?.data as { message?: string })?.message ??
          err.message ??
          "Request failed";

        typedErr = new Error(message);
      } else {
        typedErr = new Error("Unknown error");
      }

      setError(typedErr);
      setLoading(false);

      return { error: typedErr, loading: false };
    }
  }

  return { callApi, loading, error };
}
