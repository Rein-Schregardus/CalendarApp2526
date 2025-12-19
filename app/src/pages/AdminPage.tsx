import { useState } from "react";
import NavSideBar from "../components/NavSideBar";
import DashboardTiles from "../components/Admin/DashboardTiles";
import ManagementPanel from "../components/Admin/ManagementPanel";
import { LogsSidebar } from "../components/Admin/LogsSidebar";
import { useLogs } from "../hooks/useLogs";

interface AdminPageProps {
  adminId: number;
  adminName: string;
}

const AdminPage = ({ adminId, adminName }: AdminPageProps) => {
  const [active, setActive] = useState<string | null>(null);
  const { logs, loading: logsLoading } = useLogs();

  return (
    <div className="min-h-screen flex bg-gray-50 text-gray-800">
      <NavSideBar />

      <div className="flex-1 flex flex-col lg:flex-row">
        {!active ? (
          <div className="flex-1 p-6 flex flex-col">
            <h1 className="text-2xl font-semibold mb-4">Admin Dashboard</h1>
            <p className="mb-6">{adminName}, welcome to the admin dashboard.</p>
            <DashboardTiles onSelect={setActive} />
          </div>
        ) : (
          <ManagementPanel
            active={active}
            onBack={() => setActive(null)}
            adminId={adminId}
          />
        )}

        <LogsSidebar logs={logs} loading={logsLoading} />
      </div>
    </div>
  );
};

export default AdminPage;
