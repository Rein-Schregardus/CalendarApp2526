import { useState, useCallback } from "react";
import { useApi } from "./useApi";
import { type TLog } from "../types/TLog";

interface ApiResponse<T> {
  data: T;
}

export function useLogs() {
  const { callApi } = useApi();
  const [logs, setLogs] = useState<TLog[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchLogs = useCallback(async (): Promise<void> => {
    setLoading(true);
    try {
      const res = await callApi<TLog[]>({ endpoint: "/admin/logs" });
      setLogs(res.data ?? []);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Unknown error"));
    } finally {
      setLoading(false);
    }
  }, [callApi]);

  const addLog = useCallback(
    async (message: string, adminId: number): Promise<void> => {
      if (!adminId) return;
      try {
        await callApi<ApiResponse<TLog>>({
          endpoint: "/admin/logs",
          method: "POST",
          data: { adminId, message },
        });
        await fetchLogs(); // refresh logs after adding
      } catch (err) {
        console.error("Failed to add log:", err);
      }
    },
    [callApi, fetchLogs]
  );

  return { logs, loading, error, fetchLogs, addLog };
}
