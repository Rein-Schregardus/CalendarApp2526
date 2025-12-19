import UsersTile from "./UsersTile";
import DataTable from "./DataTable";
import { rolesManagementConfig, type Role } from "./Configs/rolesManagementConfig";
import { useLogs } from "../../hooks/useLogs";

interface ManagementPanelProps {
  active: string;
  onBack: () => void;
  adminId: number;
}

const ManagementPanel = ({ active, onBack, adminId }: ManagementPanelProps) => {
  const { addLog } = useLogs();

  const {
    roles,
    loading: rolesLoading,
    error: rolesError,
    handleAddRole,
    handleUpdateRole,
    handleDeleteRole,
  } = rolesManagementConfig.useRolesManagement();

  return (
    <div className="flex-1 flex flex-col p-6 overflow-auto scrollbar-hide">
      <button
        className="mb-4 text-[var(--color-accent)] font-medium hover:underline"
        onClick={onBack}
      >
        &larr; Back to Dashboard
      </button>

      {/* USERS */}
      {active === "users" && <UsersTile adminId={adminId} />}

      {/* ROLES */}
      {active === "roles" && (
        <>
          {rolesLoading && <p>Loading roles...</p>}
          {rolesError && <p className="text-red-500">{rolesError.message}</p>}
          {!rolesLoading && !rolesError && (
            <DataTable<Role>
              columns={rolesManagementConfig.columns}
              data={roles}
              onAdd={async (role) => {
                await handleAddRole(role);
                await addLog(`Added role '${role.roleName}'`, adminId);
              }}
              onUpdate={async (role) => {
                await handleUpdateRole(role);
                await addLog(`Updated role '${role.roleName}'`, adminId);
              }}
              onDelete={async (role) => {
                if (confirm(`Delete role "${role.roleName}"?`)) {
                  await handleDeleteRole(role);
                  await addLog(`Deleted role '${role.roleName}'`, adminId);
                }
              }}
            />
          )}
        </>
      )}

      {/* GROUPS */}
      {active === "groups" && (
        <>
        </>
      )}
    </div>
  );
};

export default ManagementPanel;
