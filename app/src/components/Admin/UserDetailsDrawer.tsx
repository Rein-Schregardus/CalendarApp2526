import { useEffect, useState } from "react";
import { type User, type ColumnOption } from "./Configs/userManagementConfig";
import { useApi } from "../../hooks/useApi";

interface Props {
  user: User;
  roles: ColumnOption[];
  onClose: () => void;
  onSave: (u: Partial<User> & { id: number; password?: string }) => Promise<void>;
  onDelete: (u: User) => Promise<void>;
  addLog?: (message: string, adminId: number) => void | Promise<void>;
  adminId: number;
}

type Group = {
  id: number;
  groupName: string;
  users?: { id: number }[];
};

export default function UserDetailsDrawer({
  user,
  roles,
  onClose,
  onSave,
  onDelete,
  addLog,
  adminId,
}: Props) {
  const { callApi } = useApi();
  const [edit, setEdit] = useState<Partial<User>>({ ...user });
  const [newPassword, setNewPassword] = useState("");
  const [groups, setGroups] = useState<Group[]>([]);
  const [saving, setSaving] = useState(false);
  const [noGroups, setNoGroups] = useState(false);

  // Sync roleId
  useEffect(() => {
    if (!roles.length) return;
    setEdit((prev) => {
      if (prev.roleId) return prev;
      const role = roles.find((r) => r.value === user.roleName);
      return role ? { ...prev, roleId: role.id } : prev;
    });
  }, [roles, user.roleName]);

  // Load groups for this user
  useEffect(() => {
    callApi<Group[]>({ endpoint: `/admin/groups/user/${user.id}` })
      .then((res) => {
        if (res.data && res.data.length > 0) {
          setGroups(res.data);
          setNoGroups(false);
        } else {
          setGroups([]);
          setNoGroups(true);
        }
      })
      .catch((err) => {
        if (err.response?.status === 404) {
          setGroups([]);
          setNoGroups(true);
        } else console.error("Failed to load groups:", err);
      });
  }, [user.id]);

  const isMember = (group: Group) => group.users?.some((u) => u.id === user.id);

  const toggleGroup = async (group: Group) => {
    const member = isMember(group);
    await callApi({
      endpoint: member
        ? `/admin/groups/${group.id}/users/${user.id}`
        : `/admin/groups/${group.id}/users`,
      method: member ? "DELETE" : "POST",
      data: member ? undefined : { userId: user.id },
    });

    setGroups((prev) =>
      prev.map((g) =>
        g.id === group.id
          ? {
              ...g,
              users: member
                ? g.users?.filter((u) => u.id !== user.id)
                : [...(g.users ?? []), { id: user.id }],
            }
          : g
      )
    );

    await addLog?.(
      `${member ? "Removed" : "Added"} user '${user.userName}' ${
        member ? "from" : "to"
      } group '${group.groupName}'`,
      adminId
    );
  };

  const handleSave = async () => {
    if (saving) return;
    setSaving(true);

    try {
      if (!edit.roleId) {
        const role = roles.find((r) => r.value === user.roleName);
        if (role) edit.roleId = role.id;
      }

      onClose();

      await onSave({
        ...edit,
        id: user.id,
        ...(newPassword ? { password: newPassword } : {}),
      });

      await addLog?.(`Updated user '${user.userName}'`, adminId);
    } catch (err) {
      console.error("Failed to save user:", err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Delete this user?")) return;

    await onDelete(user);
    await addLog?.(`Deleted user '${user.userName}'`, adminId);
  };

  return (
    <div className="fixed inset-0 bg-black/30 flex justify-end z-50">
      <div className="w-full max-w-md bg-[var(--color-primary)] p-6 overflow-y-auto scrollbar-hide rounded-l-xl shadow-lg">
        {/* HEADER */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Edit User</h2>
          <button
            onClick={onClose}
            className="text-[var(--color-accent)] font-bold hover:opacity-80 transition"
          >
            ✕
          </button>
        </div>

        {/* PROFILE */}
        <section className="space-y-3 mb-6">
          <label className="block">
            <span className="text-sm font-medium">Full name</span>
            <input
              className="border border-[var(--color-secondary)] rounded-lg p-2 w-full bg-[var(--color-background)]"
              value={edit.fullName ?? ""}
              onChange={(e) =>
                setEdit((prev) => ({ ...prev, fullName: e.target.value }))
              }
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium">Username</span>
            <input
              className="border border-[var(--color-secondary)] rounded-lg p-2 w-full bg-[var(--color-background)]"
              value={edit.userName ?? ""}
              onChange={(e) =>
                setEdit((prev) => ({ ...prev, userName: e.target.value }))
              }
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium">Email</span>
            <input
              className="border border-[var(--color-secondary)] rounded-lg p-2 w-full bg-[var(--color-background)]"
              value={edit.email ?? ""}
              onChange={(e) =>
                setEdit((prev) => ({ ...prev, email: e.target.value }))
              }
            />
          </label>
        </section>

        {/* GROUPS */}
        <section className="mb-6">
          <h3 className="font-medium mb-2">Groups</h3>
          {noGroups ? (
            <p className="text-gray-500 italic">This user isn't in any group(s)</p>
          ) : (
            <div className="space-y-2">
              {groups.map((g) => (
                <label
                  key={g.id}
                  className="flex items-center gap-2 border border-[var(--color-secondary)] rounded p-2 cursor-pointer hover:bg-[var(--color-accent)] hover:text-white transition"
                >
                  <input
                    type="checkbox"
                    checked={isMember(g)}
                    onChange={() => toggleGroup(g)}
                  />
                  {g.groupName}
                </label>
              ))}
            </div>
          )}
        </section>

        {/* SECURITY */}
        <section className="mb-6">
          <h3 className="font-medium mb-2">Security</h3>
          <input
            type="password"
            className="border border-[var(--color-secondary)] rounded-lg p-2 w-full bg-[var(--color-background)]"
            placeholder="Set new password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </section>

        {/* ACTIONS */}
        <div className="flex justify-between items-center">
          <button
            className="text-red-600 font-medium hover:opacity-80 transition"
            onClick={handleDelete}
          >
            Delete User
          </button>

          <button
            className="bg-[var(--color-accent)] text-white px-4 py-2 rounded-xl font-medium hover:opacity-90 transition"
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}
