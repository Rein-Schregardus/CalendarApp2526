import { useEffect, useState } from "react";
import { type Role } from "./Configs/rolesManagementConfig";
import Modal from "../Modal/Modal";

interface RoleDetailsDrawerProps {
  role: Role;
  adminId: number | undefined;
  isAddMode: boolean;
  onClose: () => void;
  onSave: (role: Role) => Promise<void>;
  onDelete: (role: Role) => Promise<void>;
}

export default function RoleDetailsDrawer({
  role,
  // adminId,
  isAddMode,
  onClose,
  onSave,
  onDelete,
}: RoleDetailsDrawerProps) {
  const [edit, setEdit] = useState<Role>({ ...role });
  const [saving, setSaving] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Track changes
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    if (isAddMode) {
      // In Add mode, hasChanges is true if roleName is non-empty
      setHasChanges(Boolean(edit.roleName.trim()));
    } else {
      // Edit mode: check if name changed
      setHasChanges(edit.roleName.trim() !== role.roleName.trim());
    }
  }, [edit, role, isAddMode]);

  const handleSave = async () => {
    if (!hasChanges || saving) return;
    setSaving(true);
    try {
      await onSave(edit);
      onClose();
    } catch (err) {
      console.error("Failed to save role:", err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      await onDelete(edit);
      onClose();
    } catch (err) {
      console.error("Failed to delete role:", err);
    } finally {
      setShowDeleteModal(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/30 flex justify-end z-50">
        <div className="w-full max-w-md bg-[var(--color-primary)] p-6 overflow-y-auto scrollbar-hide rounded-l-xl shadow-lg">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-[var(--color-text)]">
              {isAddMode ? "Add Role" : "Edit Role"}
            </h2>
            <button
              onClick={onClose}
              className="text-[var(--color-accent)] font-bold hover:opacity-80 transition"
            >
              ✕
            </button>
          </div>

          {/* Role Name */}
          <section className="mb-6">
            <label className="block">
              <span className="text-sm font-medium">Role Name</span>
              <input
                className="border border-[var(--color-secondary)] rounded-lg p-2 w-full bg-[var(--color-background)]"
                value={edit.roleName}
                onChange={(e) =>
                  setEdit((prev) => ({ ...prev, roleName: e.target.value }))
                }
              />
            </label>
          </section>

          {/* Actions */}
          <div className="flex justify-between items-center">
            {!isAddMode && (
              <button
                className="text-[var(--color-text)]font-medium hover:opacity-80 transition text-sm px-3 py-1"
                onClick={() => setShowDeleteModal(true)}
              >
                Delete Role
              </button>
            )}

            <button
              className={`px-4 py-2 rounded-xl font-medium text-[var(--color-text)] transition ${
                hasChanges
                  ? "bg-[var(--color-accent)] hover:opacity-90"
                  : "bg-[var(--color-secondary)] cursor-not-allowed"
              }`}
              onClick={handleSave}
              disabled={!hasChanges || saving}
            >
              {saving ? "Saving..." : isAddMode ? "Add Role" : "Save Changes"}
            </button>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <Modal title="Delete Role" size="sm">
          <p>Are you sure you want to delete the role "{edit.roleName}"?</p>
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
