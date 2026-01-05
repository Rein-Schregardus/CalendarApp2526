import { useEffect, useMemo, useState } from "react";
import { type User, type ColumnOption } from "./Configs/userManagementConfig";
import { useApi } from "../../hooks/useApi";
import Modal from "../Modal/Modal";
import SmallButton from "../SmallButton";

interface Group {
  id: number;
  groupName: string;
  users?: { id: number }[];
}

interface Props {
  user: User & { groups?: Group[] };
  roles: ColumnOption[];
  adminId: number | undefined;
  isAddMode: boolean;
  onClose: () => void;
  onSave: (user: User & { password?: string; groups?: Group[] }) => Promise<void>;
  onDelete: (user: User) => Promise<void>;
}

export default function UserDetailsDrawer({
  user,
  roles,
  isAddMode,
  onClose,
  onSave,
  onDelete,
}: Props) {
  const { callApi } = useApi();

  const [edit, setEdit] = useState<User & { groups?: Group[] }>({
    ...user,
    roleId: user.roleId ?? 0,
    groups: user.groups ?? [],
  });
  const [newPassword, setNewPassword] = useState("");
  const [groups, setGroups] = useState<Group[]>([]);
  const [groupSearch, setGroupSearch] = useState("");
  const [saving, setSaving] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Load all groups for selection
  useEffect(() => {
    callApi<Group[]>({ endpoint: `/admin/groups` })
      .then((res) => setGroups(res.data ?? []))
      .catch(() => setGroups([]));
  }, []);

  // Check if form has changes / is valid
  const hasChanges = useMemo(() => {
    if (isAddMode) {
      // In Add mode, must fill all fields + password + roleId
      return Boolean(
        edit.fullName?.trim() &&
        edit.userName?.trim() &&
        edit.email?.trim() &&
        edit.roleId &&
        newPassword
      );
    } else {
      return Boolean(
        edit.fullName !== user.fullName ||
        edit.userName !== user.userName ||
        edit.email !== user.email ||
        edit.roleId !== user.roleId ||
        newPassword.length > 0 ||
        JSON.stringify(edit.groups?.map(g => g.id).sort()) !==
          JSON.stringify(user.groups?.map(g => g.id).sort())
      );
    }
  }, [edit, newPassword, user, isAddMode]);

  // Add / remove group
  const addGroup = (g: Group) =>
    setEdit(prev => ({ ...prev, groups: [...(prev.groups ?? []), g] }));

  const removeGroup = (g: Group) =>
    setEdit(prev => ({ ...prev, groups: prev.groups?.filter(grp => grp.id !== g.id) }));

  // Save user
  const handleSave = async () => {
    if (!hasChanges || saving) return;
    setSaving(true);
    try {
      await onSave({
        ...edit,
        ...(newPassword ? { password: newPassword } : {}),
      });
      onClose();
    } finally {
      setSaving(false);
    }
  };

  // Delete user
  const handleDeleteConfirmed = async () => {
    setShowDeleteModal(false);
    await onDelete(user);
  };

  // Filter available groups for search
  const filteredGroups = useMemo(() => {
    return groups.filter(
      g => !(edit.groups ?? []).some(ug => ug.id === g.id) &&
           g.groupName.toLowerCase().includes(groupSearch.toLowerCase())
    );
  }, [groups, edit.groups, groupSearch]);

  return (
    <>
      <div className="fixed inset-0 bg-black/30 flex justify-end z-50">
        <div className="w-full max-w-md bg-[var(--color-background)] p-6 overflow-y-auto scrollbar-hide rounded-l-xl shadow-lg">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-[var(--color-text)]">
              {isAddMode ? "Add User" : "Edit User"}
            </h2>
            <SmallButton onClick={onClose}>✕</SmallButton>
          </div>

          {/* User fields */}
          <section className="space-y-3 mb-6">
            {["Full Name", "Username", "Email"].map((label, idx) => {
              const key = ["fullName", "userName", "email"][idx] as keyof User;
              return (
                <label key={key} className="block">
                  <span className="text-sm font-medium text-[var(--color-text)]">{label}</span>
                  <input
                    value={edit[key] ?? ""}
                    onChange={e => setEdit(prev => ({ ...prev, [key]: e.target.value }))}
                    className="border border-[var(--color-secondary)] rounded-lg p-2 w-full bg-[var(--color-background)]"
                  />
                </label>
              );
            })}

            {/* Role */}
            <label className="block">
              <span className="text-sm font-medium text-[var(--color-text)]">Role</span>
              <select
                value={edit.roleId ?? ""}
                onChange={e => setEdit(prev => ({ ...prev, roleId: Number(e.target.value) }))}
                className="border border-[var(--color-secondary)] rounded-lg p-2 w-full bg-[var(--color-background)]"
              >
                <option value={0} disabled>Select role</option>
                {roles.map(r => (
                  <option key={r.id} value={r.id}>{r.value}</option>
                ))}
              </select>
            </label>
          </section>

          {/* Groups */}
          <section className="mb-6">
            <span className="block text-sm font-medium mb-1">Groups</span>
            <input
              type="text"
              placeholder="Search groups..."
              className="mb-2 border border-[var(--color-secondary)] rounded-lg p-2 w-full bg-[var(--color-background)]"
              value={groupSearch}
              onChange={e => setGroupSearch(e.target.value)}
            />
            <div className="flex flex-col gap-1 max-h-40 overflow-y-auto">
              {(edit.groups ?? []).map(g => (
                <div key={g.id} className="flex justify-between items-center px-2 py-1 bg-[var(--color-primary)] rounded hover:bg-[var(--color-secondary)] transition">
                  <span>{g.groupName}</span>
                  <button
                    className="text-red-600 hover:opacity-80 text-sm"
                    onClick={() => removeGroup(g)}
                  >Remove</button>
                </div>
              ))}
              {filteredGroups.map(g => (
                <button
                  key={g.id}
                  className="text-left px-2 py-1 rounded hover:bg-[var(--color-secondary)] transition"
                  onClick={() => addGroup(g)}
                >{g.groupName}</button>
              ))}
            </div>
          </section>

          {/* Password */}
          <section className="mb-6">
            <span className="block text-sm font-medium mb-1">Password</span>
            <input
              type="password"
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
              placeholder={isAddMode ? "Set password" : "Change password"}
              className="border border-[var(--color-secondary)] rounded-lg p-2 w-full bg-[var(--color-background)]"
            />
          </section>

          {/* Actions */}
          <div className="flex justify-between items-center">
            {!isAddMode && (
              <SmallButton className="text-[var(--color-text)] text-sm" onClick={() => setShowDeleteModal(true)}>
                Delete User
              </SmallButton>
            )}
            <SmallButton
              className={`px-4 py-2 rounded-xl text-[var(--color-text)] text-sm ${
                !hasChanges || saving ? "bg-[var(--color-secondary)] text-text/50 cursor-not-allowed" :
                "bg-[var(--color-accent)] hover:opacity-90"
              }`}
              onClick={handleSave}
              disabled={!hasChanges || saving}
            >
              {saving ? "Saving..." : isAddMode ? "Add User" : "Save Changes"}
            </SmallButton>
          </div>
        </div>
      </div>

      {/* Delete modal */}
      {showDeleteModal && (
        <Modal title="Confirm Deletion" size="sm">
          <p className="mb-4">Are you sure you want to delete user '{user.userName}'?</p>
          <div className="flex justify-end gap-2">
            <SmallButton className="border border-secondary" onClick={() => setShowDeleteModal(false)}>Cancel</SmallButton>
            <SmallButton className="bg-red-600 text-white" onClick={handleDeleteConfirmed}>Delete</SmallButton>
          </div>
        </Modal>
      )}
    </>
  );
}
