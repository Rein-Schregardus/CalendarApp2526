import { useEffect, useMemo, useRef, useState } from "react";
import { type User, type ColumnOption } from "./Configs/userManagementConfig";
import { useApi } from "../../hooks/useApi";
import Modal from "../Modal/Modal";
import SmallButton from "../SmallButton";

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

const editableFields: Array<{ label: string; key: keyof User }> = [
  { label: "Full name", key: "fullName" },
  { label: "Username", key: "userName" },
  { label: "Email", key: "email" },
];

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
  const [groupSearch, setGroupSearch] = useState("");
  const [saving, setSaving] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const initialRef = useRef<Partial<User>>({ ...user });

  /** Sync roleId from roleName */
  useEffect(() => {
    if (!roles.length) return;

    const role = roles.find((r) => r.value === user.roleName);
    if (!role) return;

    setEdit((prev) => ({ ...prev, roleId: role.id }));
    initialRef.current.roleId = role.id;
  }, [roles, user.roleName]);

  /** Load all groups */
  useEffect(() => {
    callApi<Group[]>({ endpoint: `/admin/groups` })
      .then((res) => setGroups(res.data ?? []))
      .catch(() => setGroups([]));
  }, [user.id]);

  /** Dirty check */
  const hasChanges = useMemo(() => {
    const initial = initialRef.current;
    for (const key of Object.keys(initial) as (keyof User)[]) {
      if (edit[key] !== initial[key]) return true;
    }
    return newPassword.length > 0;
  }, [edit, newPassword]);

  /** Group membership toggle */
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

  const filteredGroups = useMemo(() => {
    return groups.filter(
      (g) =>
        g.groupName.toLowerCase().includes(groupSearch.toLowerCase())
    );
  }, [groups, groupSearch]);

  /** Save user */
  const handleSave = async () => {
    if (!hasChanges || saving || !edit.roleId) return;

    setSaving(true);
    try {
      await onSave({
        ...edit,
        id: user.id,
        ...(newPassword ? { password: newPassword } : {}),
      });
      await addLog?.(`Updated user '${user.userName}'`, adminId);
      onClose();
    } finally {
      setSaving(false);
    }
  };

  /** Delete user */
  const handleDeleteConfirmed = async () => {
    setShowDeleteModal(false);
    await onDelete(user);
    await addLog?.(`Deleted user '${user.userName}'`, adminId);
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/30 flex justify-end z-50">
        <div className="w-full max-w-md bg-[var(--color-primary)] p-6 overflow-y-auto scrollbar-hide rounded-l-xl shadow-lg">
          {/* HEADER */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-[var(--color-text)]">Edit User</h2>
            <SmallButton onClick={onClose}>✕</SmallButton>
          </div>

          {/* USER DETAILS */}
          <section className="space-y-3 mb-6">
            {editableFields.map(({ label, key }) => (
              <label key={key} className="block">
                <span className="text-sm font-medium text-[var(--color-text)]">{label}</span>
                <input
                  className="border border-[var(--color-secondary)] rounded-lg p-2 w-full bg-[var(--color-background)]"
                  value={edit[key] ?? ""}
                  onChange={(e) => setEdit((prev) => ({ ...prev, [key]: e.target.value }))}
                />
              </label>
            ))}

            {/* ROLE SELECT */}
            <label className="block">
              <span className="text-sm font-medium text-[var(--color-text)]">Role</span>
              <select
                value={edit.roleId ?? ""}
                onChange={(e) => setEdit((prev) => ({ ...prev, roleId: Number(e.target.value) }))}
                className="border border-[var(--color-secondary)] rounded-lg p-2 w-full bg-[var(--color-background)]"
              >
                <option value="" disabled>Select role</option>
                {roles.map((r) => (
                  <option key={r.id} value={r.id}>{r.value}</option>
                ))}
              </select>
            </label>
          </section>

          {/* GROUPS */}
          <section className="mb-6">
            <h3 className="font-medium text-[var(--color-text)] mb-2">Groups</h3>
            <input
              type="text"
              placeholder="Search groups..."
              className="mb-2 border border-[var(--color-secondary)] rounded-lg p-2 w-full bg-[var(--color-background)]"
              value={groupSearch}
              onChange={(e) => setGroupSearch(e.target.value)}
            />
            <div className="flex flex-col gap-1 max-h-40 overflow-y-auto">
              {filteredGroups.map((g) => (
                <label
                  key={g.id}
                  className="flex items-center gap-2 border border-[var(--color-secondary)] rounded p-2 cursor-pointer hover:bg-[var(--color-secondary)] transition"
                >
                  <input
                    type="checkbox"
                    checked={isMember(g)}
                    onChange={() => toggleGroup(g)}
                  />
                  <span className="text-[var(--color-text)]">{g.groupName}</span>
                </label>
              ))}
              {filteredGroups.length === 0 && <p className="text-sm italic opacity-70">No groups found</p>}
            </div>
          </section>

          {/* PASSWORD */}
          <section className="mb-6">
            <h3 className="font-medium text-[var(--color-text)] mb-2">Security</h3>
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
            <SmallButton
              className="text-red-600 text-sm"
              onClick={() => setShowDeleteModal(true)}
            >
              Delete User
            </SmallButton>

            <SmallButton
              className={`px-4 py-2 rounded-xl text-white text-sm ${
                !hasChanges || saving || !edit.roleId
                  ? "bg-[var(--color-secondary)] text-text/50 cursor-not-allowed"
                  : "bg-[var(--color-accent)] hover:opacity-90"
              }`}
              onClick={handleSave}
              disabled={!hasChanges || saving || !edit.roleId}
            >
              {saving ? "Saving..." : "Save Changes"}
            </SmallButton>
          </div>
        </div>
      </div>

      {/* DELETE MODAL */}
      {showDeleteModal && (
        <Modal setOpenModal={setShowDeleteModal} title="Confirm Deletion" size="sm">
          <p className="mb-4">Are you sure you want to delete user '{user.userName}'?</p>
          <div className="flex justify-end gap-2">
            <SmallButton className="border border-[var(--color-secondary)] bg-[var(--color-background)]" onClick={() => setShowDeleteModal(false)}>Cancel</SmallButton>
            <SmallButton className="bg-red-600 text-white" onClick={handleDeleteConfirmed}>Delete</SmallButton>
          </div>
        </Modal>
      )}
    </>
  );
}
