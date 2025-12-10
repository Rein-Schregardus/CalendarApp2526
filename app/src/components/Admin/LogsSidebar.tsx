import { type LogEntry } from "../../hooks/useLogs";

interface LogsSidebarProps {
  logs: LogEntry[];
  loading: boolean;
}

export function LogsSidebar({ logs, loading }: LogsSidebarProps) {
  return (
    <div className="w-full lg:w-72 bg-gray-100 p-4 overflow-y-auto border-l border-gray-200">
      <h2 className="text-lg font-semibold mb-4">Activity Logs</h2>
      {loading && <p>Loading...</p>}
      <ul className="space-y-3">
        {logs.map((log) => (
          <li key={log.id} className="bg-white rounded-lg shadow p-3">
            <p className="text-sm text-gray-700">{log.message}</p>
            <span className="text-xs text-gray-400">{log.time}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
