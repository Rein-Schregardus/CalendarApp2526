import { useEffect, useState, useMemo } from "react";
import { type Group } from "./Configs/groupsManagementConfig";
import { type User, userManagementConfig } from "./Configs/userManagementConfig";
// import { useLogs } from "../../hooks/useLogs";
import Modal from "../Modal/Modal";

interface GroupDetailsDrawerProps {
  group: Group;
  adminId: number | undefined;
  onClose: () => void;
  onSave: (group: Group) => Promise<void>;
  onDelete: (group: Group) => Promise<void>;
}

export default function GroupDetailsDrawer({
  group,
  // adminId,
  onClose,
  onSave,
  onDelete,
}: GroupDetailsDrawerProps) {
  // const { addLog } = useLogs();
  const { users: allUsers } = userManagementConfig.useUserManagement(); // all users for selection

  const [edit, setEdit] = useState<Group>({ ...group, users: group.users ?? [] });
  const [saving, setSaving] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Track changes
  const [hasChanges, setHasChanges] = useState(false);
  useEffect(() => {
    setHasChanges(
      edit.groupName.trim() !== group.groupName.trim() ||
      JSON.stringify(edit.users?.map(u => u.id).sort()) !==
        JSON.stringify(group.users?.map(u => u.id).sort())
    );
  }, [edit, group]);

  // Filter users for search
  const availableUsers = useMemo(
    () => allUsers.filter(u =>
      !edit.users?.some(gu => gu.id === u.id) &&
      (u.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
       u.email.toLowerCase().includes(searchQuery.toLowerCase()))
    ),
    [allUsers, edit.users, searchQuery]
  );

  const handleSave = async () => {
    if (!hasChanges || saving) return;
    setSaving(true);
    try {
      await onSave(edit);
      // await addLog(`Updated group '${edit.groupName}'`, adminId);
      onClose();
    } catch (err) {
      console.error("Failed to save group:", err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      await onDelete(edit);
      // await addLog(`Deleted group '${edit.groupName}'`, adminId);
      onClose();
    } catch (err) {
      console.error("Failed to delete group:", err);
    } finally {
      setShowDeleteModal(false);
    }
  };

  const addUser = (user: User) => {
    setEdit(prev => ({ ...prev, users: [...(prev.users ?? []), user] }));
  };

  const removeUser = (user: User) => {
    setEdit(prev => ({
      ...prev,
      users: prev.users?.filter(u => u.id !== user.id),
    }));
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/30 flex justify-end z-50">
        <div className="w-full max-w-md bg-[var(--color-primary)] p-6 overflow-y-auto scrollbar-hide rounded-l-xl shadow-lg">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">{group.id === 0 ? "Add Group" : "Edit Group"}</h2>
            <button
              onClick={onClose}
              className="text-[var(--color-accent)] font-bold hover:opacity-80 transition"
            >
              ✕
            </button>
          </div>

          {/* Group Name */}
          <section className="mb-6">
            <label className="block">
              <span className="text-sm font-medium">Group Name</span>
              <input
                className="border border-[var(--color-secondary)] rounded-lg p-2 w-full bg-[var(--color-background)]"
                value={edit.groupName}
                onChange={(e) =>
                  setEdit(prev => ({ ...prev, groupName: e.target.value }))
                }
              />
            </label>
          </section>

          {/* Users */}
          <section className="mb-6">
            <span className="block text-sm font-medium mb-2">Group Members</span>
            <div className="flex flex-col gap-1 max-h-40 overflow-y-auto border border-[var(--color-secondary)] p-2 rounded bg-[var(--color-background)]">
              {(edit.users ?? []).map(u => (
                <div key={u.id} className="flex justify-between items-center px-2 py-1 bg-[var(--color-primary)] rounded hover:bg-[var(--color-secondary)] transition">
                  <span>{u.userName} ({u.email})</span>
                  <button
                    className="text-red-600 hover:opacity-80 text-sm"
                    onClick={() => removeUser(u)}
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </section>

          {/* Add Users */}
          <section className="mb-6">
            <span className="block text-sm font-medium mb-1">Add Users</span>
            <input
              placeholder="Search by username or email..."
              className="border border-[var(--color-secondary)] rounded-lg p-2 w-full bg-[var(--color-background)] mb-2"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <div className="flex flex-col gap-1 max-h-40 overflow-y-auto">
              {availableUsers.map(u => (
                <button
                  key={u.id}
                  className="text-left px-2 py-1 rounded hover:bg-[var(--color-secondary)] transition"
                  onClick={() => addUser(u)}
                >
                  {u.userName} ({u.email})
                </button>
              ))}
            </div>
          </section>

          {/* Actions */}
          <div className="flex justify-between items-center">
            {group.id !== 0 && (
              <button
                className="text-red-600 font-medium hover:opacity-80 transition text-sm px-3 py-1"
                onClick={() => setShowDeleteModal(true)}
              >
                Delete Group
              </button>
            )}
            <button
              className={`px-4 py-2 rounded-xl font-medium text-white transition ${
                hasChanges
                  ? "bg-[var(--color-accent)] hover:opacity-90"
                  : "bg-[var(--color-secondary)] cursor-not-allowed"
              }`}
              onClick={handleSave}
              disabled={!hasChanges || saving}
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <Modal title="Delete Group" size="sm">
          <p>Are you sure you want to delete the group "{edit.groupName}"?</p>
          <div className="mt-4 flex justify-end gap-2">
            <button
              className="px-3 py-1 rounded-lg bg-[var(--color-secondary)] hover:opacity-80 transition text-sm"
              onClick={() => setShowDeleteModal(false)}
            >
              Cancel
            </button>
            <button
              className="px-3 py-1 rounded-lg bg-red-600 text-white hover:opacity-90 transition text-sm"
              onClick={handleDelete}
            >
              Delete
            </button>
          </div>
        </Modal>
      )}
    </>
  );
}
