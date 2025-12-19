import { useEffect, useMemo, useRef, useState } from "react";
import { type User, type ColumnOption } from "./Configs/userManagementConfig";
import { useApi } from "../../hooks/useApi";
import Modal from "../Modal/Modal";

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

  // Edit state
  const [edit, setEdit] = useState<Partial<User>>(() => ({ ...user }));
  const [newPassword, setNewPassword] = useState("");
  const [groups, setGroups] = useState<Group[]>([]);
  const [saving, setSaving] = useState(false);
  const [noGroups, setNoGroups] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Keep a stable initial snapshot for dirty checking
  const initialRef = useRef<Partial<User>>({ ...user });

  /** -----------------------------
   * Sync roleId from roleName
   ------------------------------ */
  useEffect(() => {
    if (!roles.length) return;

    const role = roles.find((r) => r.value === user.roleName);
    if (!role) return;

    setEdit((prev) => {
      if (prev.roleId === role.id) return prev;
      return { ...prev, roleId: role.id };
    });

    // Keep baseline snapshot in sync
    initialRef.current = {
      ...initialRef.current,
      roleId: role.id,
    };
  }, [roles, user.roleName]);

  /** -----------------------------
   * Load groups
   ------------------------------ */
  useEffect(() => {
    callApi<Group[]>({ endpoint: `/admin/groups/user/${user.id}` })
      .then((res) => {
        if (res.data?.length) {
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

  /** -----------------------------
   * Dirty check (includes roleId)
   ------------------------------ */
  const hasChanges = useMemo(() => {
    const initial = initialRef.current;
    for (const key of Object.keys(initial) as (keyof User)[]) {
      if (edit[key] !== initial[key]) return true;
    }
    return newPassword.length > 0;
  }, [edit, newPassword]);

  /** -----------------------------
   * Group toggle
   ------------------------------ */
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

  /** -----------------------------
   * Save
   ------------------------------ */
  const handleSave = async () => {
    if (!hasChanges || saving) return;

    setSaving(true);
    try {
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

  /** -----------------------------
   * Delete
   ------------------------------ */
  const handleDeleteConfirmed = async () => {
    setShowDeleteModal(false);
    await onDelete(user);
    await addLog?.(`Deleted user '${user.userName}'`, adminId);
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/30 flex justify-end z-50">
        <div className="w-full max-w-md bg-primary p-6 overflow-y-auto scrollbar-hide rounded-l-xl shadow-lg">
          {/* HEADER */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Edit User</h2>
            <button
              onClick={onClose}
              className="text-accent font-bold hover:opacity-80 transition"
            >
              ✕
            </button>
          </div>

          {/* PROFILE */}
          <section className="space-y-3 mb-6">
            {editableFields.map(({ label, key }) => (
              <label key={key} className="block">
                <span className="text-sm font-medium">{label}</span>
                <input
                  className="border border-secondary rounded-lg p-2 w-full bg-background"
                  value={edit[key] ?? ""}
                  onChange={(e) =>
                    setEdit((prev) => ({ ...prev, [key]: e.target.value }))
                  }
                />
              </label>
            ))}

            {/* ROLE SELECT */}
            <label className="block">
              <span className="text-sm font-medium">Role</span>
              <select
                value={edit.roleId ?? ""}
                onChange={(e) =>
                  setEdit((prev) => ({ ...prev, roleId: Number(e.target.value) }))
                }
                className="border border-secondary rounded-lg p-2 w-full bg-background"
              >
                <option value="" disabled>
                  Select role
                </option>
                {roles.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.value}
                  </option>
                ))}
              </select>
            </label>
          </section>

          {/* GROUPS */}
          <section className="mb-6">
            <h3 className="font-medium mb-2">Groups</h3>
            {noGroups ? (
              <p className="italic opacity-70">This user isn't in any group(s)</p>
            ) : (
              <div className="space-y-2">
                {groups.map((g) => (
                  <label
                    key={g.id}
                    className="flex items-center gap-2 border border-secondary rounded p-2 cursor-pointer hover:bg-secondary transition"
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
              className="border border-secondary rounded-lg p-2 w-full bg-background"
              placeholder="Set new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </section>

          {/* ACTIONS */}
          <div className="flex justify-between items-center">
            {/* Subtle delete button */}
            <button
              onClick={() => setShowDeleteModal(true)}
              className="text-red-600 font-medium text-sm hover:underline transition"
            >
              Delete User
            </button>

            {/* Save button */}
            <button
              onClick={handleSave}
              disabled={!hasChanges || saving || !edit.roleId}
              className={`
                px-4 py-2 rounded-xl font-medium transition
                ${
                  !hasChanges || saving || !edit.roleId
                    ? "bg-secondary text-text/50 cursor-not-allowed"
                    : "bg-accent text-white hover:opacity-90"
                }
              `}
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      </div>

      {/* DELETE CONFIRMATION MODAL */}
      {showDeleteModal && (
        <Modal setOpenModal={setShowDeleteModal} title="Confirm Deletion" size="sm">
          <p className="mb-4">Are you sure you want to delete user '{user.userName}'?</p>
          <div className="flex justify-end gap-2">
            <button
              onClick={() => setShowDeleteModal(false)}
              className="px-4 py-2 rounded-lg border border-secondary bg-background hover:bg-secondary transition"
            >
              Cancel
            </button>
            <button
              onClick={handleDeleteConfirmed}
              className="px-4 py-2 rounded-lg bg-red-600 text-white hover:opacity-90 transition"
            >
              Delete
            </button>
          </div>
        </Modal>
      )}
    </>
  );
}
