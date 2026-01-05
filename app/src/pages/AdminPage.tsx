import { useContext, useState } from "react";
import NavSideBar from "../components/NavSideBar";
import DashboardTiles from "../components/Admin/DashboardTiles";
import ManagementPanel from "../components/Admin/ManagementPanel";
import { UserContext } from "@/hooks/UserContext";
// import { LogsSidebar } from "../components/Admin/LogsSidebar";
// import { useLogsContext } from "../hooks/useLogContext";


const AdminPage = () => {
  const [active, setActive] = useState<string | null>(null);

  const { getCurrUser } = useContext(UserContext);
  const user = getCurrUser();

  // const { logs, loading: logsLoading } = useLogsContext();

  // console.log("AdminPage logs:", {
  // logs,
  // length: logs.length,
  // logsLoading,
// });

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
                Welcome, {user?.fullName}. Quick access to all management tools.
              </p>

              {/* Dashboard Tiles */}
              <DashboardTiles onSelect={setActive} />
            </>
          ) : (
            <ManagementPanel
              active={active}
              onBack={() => setActive(null)}
              adminId={user?.id}
            />
          )}
        </div>

        {/* Logs Sidebar */}
        {/* <LogsSidebar logs={logs} loading={logsLoading} /> */}
      </div>
    </div>
  );
};

export default AdminPage;
