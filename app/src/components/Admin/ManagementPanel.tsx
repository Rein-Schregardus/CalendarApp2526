import DataTable from "./DataTable";
import {
  userManagementConfig,
  type User,
  type ColumnOption,
} from "./Configs/userManagementConfig";
import { rolesManagementConfig, type Role } from "./Configs/rolesManagementConfig";

interface ManagementPanelProps {
  active: string;
  onBack: () => void;
}

const ManagementPanel = ({ active, onBack }: ManagementPanelProps) => {
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

  return (
    <div className="flex-1 flex flex-col p-6">
      <button
        className="mb-4 text-blue-600 font-medium hover:underline"
        onClick={onBack}
      >
        &larr; Back to Dashboard
      </button>

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
              }}
              onUpdate={async (user: Partial<User> & { id: number }) => {
                await handleUpdateUser(user);
              }}
              onDelete={async (user: User) => {
                if (confirm(`Are you sure you want to delete user "${user.userName}"?`)) {
                  await handleDeleteUser(user);
                }
              }}
            />
          )}
        </>
      )}

      {active === "roles" && (
        <>
          {rolesLoading && <p>Loading roles...</p>}
          {rolesError && <p className="text-red-500">Error: {rolesError.message}</p>}
          {!rolesLoading && !rolesError && (
            <DataTable<Role>
              columns={rolesManagementConfig.columns}
              data={rolesList}
              onAdd={handleAddRole}
              onUpdate={handleUpdateRole}
              onDelete={handleDeleteRole}
            />
          )}
        </>
      )}

      {active === "groups" && <div>Group management table goes here</div>}
    </div>
  );
};

export default ManagementPanel;
