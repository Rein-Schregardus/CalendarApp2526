import DataTable from "./DataTable";
import FoldableDataTable from "./FoldableDataTable";
import { GroupUserManager } from "./GroupUserManager";
import {
  userManagementConfig,
  type User,
  type ColumnOption,
} from "./Configs/userManagementConfig";
import { rolesManagementConfig, type Role } from "./Configs/rolesManagementConfig";
import { groupsManagementConfig, type Group } from "./Configs/groupsManagementConfig";

interface ManagementPanelProps {
  active: string;
  onBack: () => void;
  adminName: string;
  addLog?: (message: string, adminName: string) => void | undefined;
}

const ManagementPanel = ({ active, onBack, adminName }: ManagementPanelProps) => {
  // Users management
  const {
    users,
    roles,
    loading: usersLoading,
    error: usersError,
    handleAddUser,
    handleUpdateUser,
    handleDeleteUser,
  } = userManagementConfig.useUserManagement();

  // Roles management
  const {
    roles: rolesList,
    loading: rolesLoading,
    error: rolesError,
    handleAddRole,
    handleUpdateRole,
    handleDeleteRole,
  } = rolesManagementConfig.useRolesManagement();

  // Map roles to ColumnOption for users table
  const roleOptions: ColumnOption[] = roles.map((r) => ({
    id: r.id,
    label: r.label,
    value: r.value,
  }));

  const userTableColumns = userManagementConfig.columns.map((col) =>
    col.optionsKey === "roles" ? { ...col, options: roleOptions } : col
  );

  // Groups management
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
      {active === "users" && (
        <>
          {usersLoading && <p>Loading users...</p>}
          {usersError && <p className="text-red-500">Error: {usersError.message}</p>}
          {!usersLoading && !usersError && (
            <DataTable<User>
              columns={userTableColumns}
              data={users}
              onAdd={async (user: Partial<User>) => {
                if (!user.password || !user.fullName || !user.email || !user.userName || !user.role) {
                  alert("Full name, username, email, password, and role are required");
                  return;
                }
                await handleAddUser(user as Partial<User> & { password: string });
                // addLog(`Added user "${user.userName}"`, adminName);
              }}
              onUpdate={async (user: Partial<User> & { id: number }) => {
                await handleUpdateUser(user);
                // addLog(`Updated user ID ${user.id}`, adminName);
              }}
              onDelete={async (user: User) => {
                if (confirm(`Are you sure you want to delete user "${user.userName}"?`)) {
                  await handleDeleteUser(user);
                  // addLog(`Deleted user "${user.userName}"`, adminName);
                }
              }}
            />
          )}
        </>
      )}

      {/* ROLES */}
      {active === "roles" && (
        <>
          {rolesLoading && <p>Loading roles...</p>}
          {rolesError && <p className="text-red-500">Error: {rolesError.message}</p>}
          {!rolesLoading && !rolesError && (
            <DataTable<Role>
              columns={rolesManagementConfig.columns}
              data={rolesList}
              onAdd={async (role: Partial<Role>) => {
                await handleAddRole(role);
                // addLog(`Added role "${role.roleName}"`, adminName);
              }}
              onUpdate={async (role: Partial<Role> & { id: number }) => {
                await handleUpdateRole(role);
                // addLog(`Updated role ID ${role.id}`, adminName);
              }}
              onDelete={async (role: Role) => {
                if (confirm(`Are you sure you want to delete role "${role.roleName}"?`)) {
                  await handleDeleteRole(role);
                  // addLog(`Deleted role "${role.roleName}"`, adminName);
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
              columns={groupsManagementConfig.columns.map((col) => ({
                ...col,
                header: col.header === "Name" ? "Name / Members" : col.header,
              }))}
              data={groups}
              onAdd={async (group: Partial<Group>) => {
                await handleAddGroup(group);
                // addLog(`Added group "${group.groupName}"`, adminName);
              }}
              onDelete={async (group: Group) => {
                if (confirm(`Are you sure you want to delete group "${group.groupName}"?`)) {
                  await handleDeleteGroup(group);
                  // addLog(`Deleted group "${group.groupName}"`, adminName);
                }
              }}
              renderExpandedContent={(group) => (
                <GroupUserManager
                  group={group}
                  adminName={adminName}
                  // addLog={addLog}
                />
              )}
            />
          )}
        </>
      )}
    </div>
  );
};

export default ManagementPanel;
