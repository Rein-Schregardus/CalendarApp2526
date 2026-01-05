// import { type ReactNode } from "react";
// import { LogsContext } from "../../hooks/LogsContext";
// import { useLogs } from "../../hooks/useLogs";

// interface LogsProviderProps {
//   children: ReactNode;
// }

// export const LogsProvider = ({ children }: LogsProviderProps) => {
//   const { logs, loading, error, fetchLogs, addLog } = useLogs();

//   return (
//     <LogsContext.Provider value={{ logs, loading, error, fetchLogs, addLog }}>
//       {children}
//     </LogsContext.Provider>
//   );
// };
