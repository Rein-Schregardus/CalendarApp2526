import NavSideBar from "../components/NavSideBar";
import { useState } from "react";

import LogsSidebar from "../components/Admin/LogSidebar";
import DashboardTiles from "../components/Admin/DashboardTiles"
import ManagementPanel from "../components/Admin/ManagementPanel";

const AdminPage = ({ adminName }: { adminName: string }) => {
  const [active, setActive] = useState<string | null>(null);

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
          <ManagementPanel active={active} onBack={() => setActive(null)} />
        )}

        <LogsSidebar />
      </div>
    </div>
  );
};

export default AdminPage;
