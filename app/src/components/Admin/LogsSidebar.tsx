import { type TLog } from "../../types/TLog";

interface LogsSidebarProps {
  logs: TLog[];
  loading: boolean;
}

export const LogsSidebar = ({ logs, loading }: LogsSidebarProps) => {
  console.log("LogsSidebar props:", { loading, logs, length: logs.length });
  return (
    <div className="w-80 bg-primary border-l border-[var(--color-secondary)] p-4 flex flex-col overflow-auto scrollbar-hide">
      <h2 className="text-xl font-semibold mb-4">Logs</h2>

      {loading && <p>Loading...</p>}

      {!loading && logs.length === 0 && (
        <p className="text-gray-500 italic">No logs yet.</p>
      )}

      {!loading && logs.length > 0 && (
        <ul className="space-y-2 h-200 overflow-y-auto">
          {logs.map((log, idx) => (
            <li
              key={idx}
              className="border border-[var(--color-secondary)] rounded p-2 text-sm hover:bg-[var(--color-secondary)] transition"
            >
              <div>{log.message}</div>

              {log.time && (
                <div className="text-xs text-gray-500">
                  {new Date(log.time).toLocaleString()}
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
