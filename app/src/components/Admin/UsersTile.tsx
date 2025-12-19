import { useState, useEffect } from "react";
import { type User } from "./Configs/userManagementConfig";
import { useApi } from "../../hooks/useApi";
import { useLogs } from "../../hooks/useLogs";
import UserDetailsDrawer from "./UserDetailsDrawer";

interface UsersTileProps {
  adminId: number;
}

export default function UsersTile({ adminId }: UsersTileProps) {
  const { callApi } = useApi();
  const { addLog } = useLogs();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await callApi<User[]>({ endpoint: "/admin/users" });
      setUsers(res.data ?? []);
    } catch (err) {
      console.error("Failed to fetch users:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSaveUser = async (user: Partial<User> & { id: number; password?: string }) => {
    try {
      await callApi({
        endpoint: `/admin/users/${user.id}`,
        method: "PUT",
        data: user,
      });
      await fetchUsers();
      await addLog(`Updated user '${user.userName}'`, adminId);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteUser = async (user: User) => {
    try {
      await callApi({
        endpoint: `/admin/users/${user.id}`,
        method: "DELETE",
      });
      await fetchUsers();
      await addLog(`Deleted user '${user.userName}'`, adminId);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      {loading && <p>Loading users...</p>}
      {!loading && (
        <ul className="space-y-2">
          {users.map((user) => (
            <li key={user.id} className="flex justify-between items-center border p-2 rounded">
              <span>{user.userName}</span>
              <button
                className="text-blue-600 hover:underline"
                onClick={() => setSelectedUser(user)}
              >
                Edit
              </button>
            </li>
          ))}
        </ul>
      )}

      {selectedUser && (
        <UserDetailsDrawer
          user={selectedUser}
          roles={[]} // assume roles are fetched inside drawer or passed
          onClose={() => setSelectedUser(null)}
          onSave={handleSaveUser}
          onDelete={handleDeleteUser}
          adminId={adminId}
        />
      )}
    </div>
  );
}
