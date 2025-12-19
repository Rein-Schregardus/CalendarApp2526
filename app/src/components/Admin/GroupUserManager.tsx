import { useEffect, useState } from "react";
import { useApi } from "../../hooks/useApi";
import { useLogs } from "../../hooks/useLogs";

interface Group {
  id: number;
  groupName: string;
  users?: { id: number; userName: string }[];
}

interface GroupUserManagerProps {
  group: Group;
  adminId: number;
}

export function GroupUserManager({ group, adminId }: GroupUserManagerProps) {
  const { callApi } = useApi();
  const { addLog } = useLogs();
  const [users, setUsers] = useState<{ id: number; userName: string }[]>([]);

  useEffect(() => {
    if (group.users) setUsers(group.users);
  }, [group]);

  const removeUser = async (userId: number, userName: string) => {
    try {
      await callApi({
        endpoint: `/admin/groups/${group.id}/users/${userId}`,
        method: "DELETE",
      });
      setUsers((prev) => prev.filter((u) => u.id !== userId));
      await addLog(`Removed user '${userName}' from group '${group.groupName}'`, adminId);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-2">
      {users.length === 0 ? (
        <p className="italic text-gray-500">No users in this group.</p>
      ) : (
        <ul className="space-y-1">
          {users.map((u) => (
            <li key={u.id} className="flex justify-between items-center">
              {u.userName}
              <button
                className="text-red-600 hover:underline"
                onClick={() => removeUser(u.id, u.userName)}
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
