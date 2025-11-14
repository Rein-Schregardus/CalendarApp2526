import NavSideBar from "../components/NavSideBar";
import { useState } from "react";
import CrudSection from "../components/Admin/CrudSection";
import { useUserFields } from "../components/Forms/Fields/userFields";
import { roleFields } from "../components/Forms/Fields/roleFields";
import { groupFields } from "../components/Forms/Fields/groupFields";
import { sectionEndpoints } from "../components/Admin/Confic";

const AdminPage = ({ adminName }: { adminName: string }) => {
  const [active, setActive] = useState<string | null>(null);

  return (
    <div className="h-screen flex bg-gray-50 text-gray-800">
      <p>{adminName}, welcome to the admin dashboard.</p>
      <NavSideBar />

      {!active ? (
        <div className="flex-1 p-6">
          <h1 className="text-2xl font-semibold mb-4">Admin Dashboard</h1>
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
        <CrudSection
          title={active === "users" ? "Users" : active === "roles" ? "Roles" : "Groups"}
          fields={active === "users" ? useUserFields : active === "roles" ? roleFields : groupFields}
          endpoints={sectionEndpoints[active as keyof typeof sectionEndpoints]}
          onBack={() => setActive(null)}
        />
      )}
    </div>
  );
};

export default AdminPage;