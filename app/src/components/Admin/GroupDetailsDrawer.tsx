import { useEffect, useState } from "react";
import { type Group } from "./Configs/groupsManagementConfig";
import { useLogs } from "../../hooks/useLogs";
import Modal from "../Modal/Modal";

interface GroupDetailsDrawerProps {
  group: Group;
  adminId: number;
  onClose: () => void;
  onSave: (group: Group) => Promise<void>;
  onDelete: (group: Group) => Promise<void>;
}

export default function GroupDetailsDrawer({
  group,
  adminId,
  onClose,
  onSave,
  onDelete,
}: GroupDetailsDrawerProps) {
  const { addLog } = useLogs();
  const [edit, setEdit] = useState<Group>({ ...group });
  const [saving, setSaving] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Track changes
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    setHasChanges(edit.groupName.trim() !== group.groupName.trim());
  }, [edit, group]);

  const handleSave = async () => {
    if (!hasChanges || saving) return;

    setSaving(true);
    try {
      await onSave(edit);
      await addLog(`Updated group '${edit.groupName}'`, adminId);
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
      await addLog(`Deleted group '${edit.groupName}'`, adminId);
      onClose();
    } catch (err) {
      console.error("Failed to delete group:", err);
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
            <h2 className="text-2xl font-bold">Edit Group</h2>
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
                  setEdit((prev) => ({ ...prev, groupName: e.target.value }))
                }
              />
            </label>
          </section>

          {/* Actions */}
          <div className="flex justify-between items-center">
            <button
              className="text-red-600 font-medium hover:opacity-80 transition text-sm px-3 py-1"
              onClick={() => setShowDeleteModal(true)}
            >
              Delete Group
            </button>

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
        <Modal setOpenModal={setShowDeleteModal} title="Delete Group" size="sm">
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
