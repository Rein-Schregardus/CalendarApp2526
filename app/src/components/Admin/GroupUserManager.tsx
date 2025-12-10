import { useState, useEffect } from "react";
import { useApi } from "../../hooks/useApi";
import { type User } from "./Configs/userManagementConfig";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faMinus } from "@fortawesome/free-solid-svg-icons";

export interface GroupUserManagerProps {
  group: { id: number; groupName: string; users?: User[] };
  adminId: number; // current admin for logging
  addLog: (message: string, adminId: number) => void; // logging function
}

export function GroupUserManager({ group, adminId, addLog }: GroupUserManagerProps) {
  const { callApi } = useApi();
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [groupUsers, setGroupUsers] = useState<User[]>(group.users ?? []);
  const [search, setSearch] = useState("");

  // Fetch all users
  useEffect(() => {
    const fetchUsers = async () => {
      const res = await callApi<User[]>({ endpoint: "/admin/users" });
      if (res.data) setAllUsers(res.data);
    };
    fetchUsers();
  }, []);

  const handleAddUser = async (user: User) => {
    await callApi({
      endpoint: `/admin/groups/${group.id}/users`,
      method: "POST",
      data: { userId: user.id },
    });
    setGroupUsers((prev) => [...prev, user]);
    addLog(`Added user "${user.userName}" to group "${group.groupName}"`, adminId);
  };

  const handleRemoveUser = async (user: User) => {
    await callApi({
      endpoint: `/admin/groups/${group.id}/users/${user.id}`,
      method: "DELETE",
    });
    setGroupUsers((prev) => prev.filter((u) => u.id !== user.id));
    addLog(`Removed user "${user.userName}" from group "${group.groupName}"`, adminId);
  };

  const availableUsers = allUsers.filter(
    (u) =>
      !groupUsers.some((gu) => gu.id === u.id) &&
      (u.userName.toLowerCase().includes(search.toLowerCase()) ||
        u.fullName.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="flex flex-col gap-2 max-h-64 overflow-y-auto border p-2 bg-white rounded">
      <input
        type="text"
        placeholder="Search users..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="border rounded p-1 w-full"
      />

      <div className="flex flex-col gap-1">
        <strong>Group Users:</strong>
        {groupUsers.map((user) => (
          <div
            key={user.id}
            className="flex justify-between items-center border rounded p-1"
          >
            <span>{user.fullName} ({user.userName})</span>
            <button
              className="text-red-500 hover:text-red-700"
              onClick={() => handleRemoveUser(user)}
            >
              <FontAwesomeIcon icon={faMinus} />
            </button>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-1 mt-2">
        <strong>Add Users:</strong>
        {availableUsers.map((user) => (
          <div
            key={user.id}
            className="flex justify-between items-center border rounded p-1"
          >
            <span>{user.fullName} ({user.userName})</span>
            <button
              className="text-green-500 hover:text-green-700"
              onClick={() => handleAddUser(user)}
            >
              <FontAwesomeIcon icon={faPlus} />
            </button>
          </div>
        ))}
        {availableUsers.length === 0 && <p className="text-gray-400">No users found</p>}
      </div>
    </div>
  );
}
