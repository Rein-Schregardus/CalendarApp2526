import { useState } from "react";

type LogEntry = { id: number; message: string; time: string };

const LogsSidebar = () => {
  const [logs] = useState<LogEntry[]>([
    { id: 1, message: "AdminUser1 changed user role", time: "10:23 AM" },
    { id: 2, message: "AdminUser2 deleted a group", time: "11:05 AM" },
  ]);

  return (
    <div className="w-full lg:w-72 bg-gray-100 p-4 overflow-y-auto border-l border-gray-200">
      <h2 className="text-lg font-semibold mb-4">Activity Logs</h2>
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
};

export default LogsSidebar;