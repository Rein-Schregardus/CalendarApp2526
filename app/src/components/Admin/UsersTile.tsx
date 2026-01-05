import { useState } from "react";
import { type User } from "./Configs/userManagementConfig";
import { userManagementConfig } from "./Configs/userManagementConfig";
import DataTable from "./DataTable";
import UserDetailsDrawer from "./UserDetailsDrawer";

interface UsersTileProps {
  adminId: number | undefined;
}

export default function UsersTile({ adminId }: UsersTileProps) {
  const {
    users,
    roles,
    loading,
    error,
    handleAddUser,
    handleUpdateUser,
    handleDeleteUser,
  } = userManagementConfig.useUserManagement();

  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isAddMode, setIsAddMode] = useState(false);

  const openDrawerForEdit = (user: User) => {
    setSelectedUser(user);
    setIsAddMode(false);
    setDrawerOpen(true);
  };

  const openDrawerForAdd = () => {
    setSelectedUser(null);
    setIsAddMode(true);
    setDrawerOpen(true);
  };

  return (
    <div className="flex-1 flex flex-col p-6 bg-background rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold text-text">Users</h2>
        <button
          className="px-4 py-2 rounded-lg bg-accent text-primary hover:bg-accent/80 transition"
          onClick={openDrawerForAdd}
        >
          Add User
        </button>
      </div>

      {loading && <p className="text-text">Loading users...</p>}
      {error && <p className="text-red-500">{error.message}</p>}

      {!loading && !error && (
        <DataTable<User>
          columns={userManagementConfig.columns.filter(c => c.accessor !== "password")}
          data={users}
          onDelete={async (user) => {
            if (confirm(`Delete user "${user.userName}"?`)) {
              await handleDeleteUser(user);
            }
          }}
          onRowClick={openDrawerForEdit}
        />
      )}

      {drawerOpen && (
        <UserDetailsDrawer
          user={
            selectedUser ?? {
              id: 0,
              fullName: "",
              userName: "",
              email: "",
              roleName: "",
              roleId: 0,
              groups: [],
            }
          }
          roles={roles}
          adminId={adminId}
          isAddMode={isAddMode}
          onClose={() => setDrawerOpen(false)}
          onSave={async (user) => {
            if (isAddMode) {
              await handleAddUser(user as User & { password: string });
            } else {
              await handleUpdateUser(user);
            }
            setDrawerOpen(false);
          }}
          onDelete={async (user) => {
            if (confirm(`Delete user "${user.userName}"?`)) {
              await handleDeleteUser(user);
              setDrawerOpen(false);
            }
          }}
        />
      )}
    </div>
  );
}
