import { useState } from "react";
import { type Role } from "./Configs/rolesManagementConfig";
import { rolesManagementConfig } from "./Configs/rolesManagementConfig";
import DataTable from "./DataTable";
import RoleDetailsDrawer from "./RoleDetailsDrawer";
// import { useLogs } from "../../hooks/useLogs";

interface RolesTileProps {
  adminId: number | undefined;
}

export default function RolesTile({ adminId }: RolesTileProps) {
  // const { addLog } = useLogs();

  const {
    roles,
    loading,
    error,
    handleAddRole,
    handleUpdateRole,
    handleDeleteRole,
  } = rolesManagementConfig.useRolesManagement();

  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isAddMode, setIsAddMode] = useState(false);

  const openDrawerForEdit = (role: Role) => {
    setSelectedRole(role);
    setIsAddMode(false);
    setDrawerOpen(true);
  };

  const openDrawerForAdd = () => {
    setSelectedRole(null);
    setIsAddMode(true);
    setDrawerOpen(true);
  };

  return (
    <div className="flex-1 flex flex-col p-6 bg-[var(--color-background)] rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold text-[var(--color-text)]">Roles</h2>
        <button
          className="px-4 py-2 rounded-lg bg-[var(--color-accent)] text-[var(--color-primary)] hover:bg-[var(--color-accent)]/80 transition"
          onClick={openDrawerForAdd}
        >
          Add Role
        </button>
      </div>

      {loading && <p className="text-[var(--color-text)]">Loading roles...</p>}
      {error && <p className="text-red-500">{error.message}</p>}

      {!loading && !error && (
        <DataTable<Role>
          columns={rolesManagementConfig.columns}
          data={roles}
          onRowClick={openDrawerForEdit}
          onDelete={async (role) => {
            if (confirm(`Delete role "${role.roleName}"?`)) {
              await handleDeleteRole(role);
              // await addLog(`Deleted role '${role.roleName}'`, adminId);
            }
          }}
        />
      )}

      {drawerOpen && (
        <RoleDetailsDrawer
          role={selectedRole ?? { id: 0, roleName: "" }}
          adminId={adminId}
          onClose={() => setDrawerOpen(false)}
          onSave={async (role) => {
            if (isAddMode) {
              await handleAddRole(role);
              // await addLog(`Added role '${role.roleName}'`, adminId);
            } else {
              await handleUpdateRole(role);
              // await addLog(`Updated role '${role.roleName}'`, adminId);
            }
            setDrawerOpen(false);
          }}
          onDelete={async (role) => {
            if (confirm(`Delete role "${role.roleName}"?`)) {
              await handleDeleteRole(role);
              // await addLog(`Deleted role '${role.roleName}'`, adminId);
              setDrawerOpen(false);
            }
          }}
        />
      )}
    </div>
  );
}
