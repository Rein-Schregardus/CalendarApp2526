import { useState, useEffect } from "react";
import { useApi } from "./useApi";

export type LogEntry = {
  id: number;
  adminId: number;
  message: string;
  time: string;
};

export function useLogs() {
  const { callApi } = useApi();
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch all logs from backend
  const fetchLogs = async () => {
    setLoading(true);
    try {
      const res = await callApi<LogEntry[]>({ endpoint: "/admin/logs" });
      if (res.data) setLogs(res.data.sort((a, b) => +new Date(b.time) - +new Date(a.time)));
    } catch (err) {
      console.error("Failed to fetch logs", err);
    } finally {
      setLoading(false);
    }
  };

  // Add a new log entry
  const addLog = async (message: string, adminId: number) => {
    try {
      const res = await callApi<LogEntry>({
        endpoint: "/admin/logs",
        method: "POST",
        data: { message, adminId },
      });
      if (res.data) {
        setLogs((prev) => [res.data!, ...prev]);
      }
    } catch (err) {
      console.error("Failed to add log", err);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  return { logs, loading, fetchLogs, addLog };
}
