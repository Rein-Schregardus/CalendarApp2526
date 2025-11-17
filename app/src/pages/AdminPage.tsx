import NavSideBar from "../components/NavSideBar";
import { useState } from "react";

const AdminPage = ({ adminName }: { adminName: string }) => {
  const [active, setActive] = useState<string | null>(null);

  return (
    <div className="h-screen flex bg-gray-50 text-gray-800">
      <NavSideBar />

      {!active ? (
        <div className="flex-1 p-6">
          <h1 className="text-2xl font-semibold mb-4">Admin Dashboard</h1>
          <p>{adminName}, welcome to the admin dashboard.</p>
          <div className="grid grid-cols-3 gap-4">
            <button className="p-4 bg-white rounded shadow" onClick={() => setActive("users")}>
              Manage Users
            </button>
            <button className="p-4 bg-white rounded shadow" onClick={() => setActive("roles")}>
              Manage Roles
            </button>
            <button className="p-4 bg-white rounded shadow" onClick={() => setActive("groups")}>
              Manage Groups
            </button>
          </div>
        </div>
      ) : (
        <>
        <div className="flex-1 p-6">
          <button className="mb-4 text-blue-500" onClick={() => setActive(null)}>
            &larr; Back to Dashboard
          </button>
        </div>
        </>
      )}
    </div>
  );
};

export default AdminPage;