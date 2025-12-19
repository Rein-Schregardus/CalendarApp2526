import { useState } from "react";
import NavSideBar from "../components/NavSideBar";
import DashboardTiles from "../components/Admin/DashboardTiles";
import ManagementPanel from "../components/Admin/ManagementPanel";
import { LogsSidebar } from "../components/Admin/LogsSidebar";
import { useLogsContext } from "../hooks/useLogContext";

interface AdminPageProps {
  adminId: number;
  adminName: string;
}

const AdminPage = ({ adminId, adminName }: AdminPageProps) => {
  const [active, setActive] = useState<string | null>(null);
  const { logs, loading: logsLoading } = useLogsContext();

  console.log("AdminPage logs:", {
  logs,
  length: logs.length,
  logsLoading,
});

  return (
    <div
      className="min-h-screen flex bg-background"
    >
      <NavSideBar />

      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Dashboard / Management Panel */}
        <div className="flex-1 flex flex-col overflow-y-auto p-6 scrollbar-hide">
          {!active ? (
            <>
              <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
              <p className="mb-6 /80">
                Welcome, {adminName}. Quick access to all management tools.
              </p>

              {/* Dashboard Tiles */}
              <DashboardTiles onSelect={setActive} />
            </>
          ) : (
            <ManagementPanel
              active={active}
              onBack={() => setActive(null)}
              adminId={adminId}
            />
          )}
        </div>

        {/* Logs Sidebar */}
        <LogsSidebar logs={logs} loading={logsLoading} />
      </div>
    </div>
  );
};

export default AdminPage;
