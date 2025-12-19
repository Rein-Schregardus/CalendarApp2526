import { useLogs } from "../../hooks/useLogs";
import UsersTile from "./UsersTile";
import DataTable from "./DataTable";
import FoldableDataTable from "./FoldableDataTable";
import { GroupUserManager } from "./GroupUserManager";
import { rolesManagementConfig, type Role } from "./Configs/rolesManagementConfig";
import { groupsManagementConfig, type Group } from "./Configs/groupsManagementConfig";

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

  const {
    groups,
    loading: groupsLoading,
    handleAddGroup,
    handleDeleteGroup,
  } = groupsManagementConfig.useGroupsManagement();

  return (
    <div className="flex-1 flex flex-col p-6">
      <button
        className="mb-4 text-blue-600 font-medium hover:underline"
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
              onAdd={handleAddRole}
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
          {groupsLoading && <p>Loading groups...</p>}
          {!groupsLoading && (
            <FoldableDataTable<Group>
              columns={groupsManagementConfig.columns}
              data={groups}
              onAdd={async (group) => {
                await handleAddGroup(group);
                await addLog(`Added group '${group.groupName}'`, adminId);
              }}
              onDelete={async (group) => {
                if (confirm(`Delete group "${group.groupName}"?`)) {
                  await handleDeleteGroup(group);
                  await addLog(`Deleted group '${group.groupName}'`, adminId);
                }
              }}
              renderExpandedContent={(group) => (
                <GroupUserManager group={group} adminId={adminId} />
              )}
            />
          )}
        </>
      )}
    </div>
  );
};

export default ManagementPanel;
