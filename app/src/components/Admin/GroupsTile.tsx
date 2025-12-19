import { useState } from "react";
import { type Group } from "./Configs/groupsManagementConfig";
import { groupsManagementConfig } from "./Configs/groupsManagementConfig";
import DataTable from "./DataTable";
import GroupDetailsDrawer from "./GroupDetailsDrawer";
import { useLogs } from "../../hooks/useLogs";

interface GroupsTileProps {
  adminId: number;
}

export default function GroupsTile({ adminId }: GroupsTileProps) {
  const { addLog } = useLogs();

  const {
    groups,
    loading,
    error,
    handleAddGroup,
    handleUpdateGroup,
    handleDeleteGroup,
  } = groupsManagementConfig.useGroupsManagement();

  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isAddMode, setIsAddMode] = useState(false);

  const openDrawerForEdit = (group: Group) => {
    setSelectedGroup(group);
    setIsAddMode(false);
    setDrawerOpen(true);
  };

  const openDrawerForAdd = () => {
    setSelectedGroup(null);
    setIsAddMode(true);
    setDrawerOpen(true);
  };

  return (
    <div className="flex-1 flex flex-col p-6 bg-background rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold text-text">Groups</h2>
        <button
          className="px-4 py-2 rounded-lg bg-accent text-primary hover:bg-accent/80 transition"
          onClick={openDrawerForAdd}
        >
          Add Group
        </button>
      </div>

      {loading && <p className="text-text">Loading groups...</p>}
      {error && <p className="text-red-500">{error.message}</p>}

      {!loading && !error && (
        <DataTable<Group>
          columns={groupsManagementConfig.columns}
          data={groups}
          onDelete={async (group) => {
            if (confirm(`Delete group "${group.groupName}"?`)) {
              await handleDeleteGroup(group);
              await addLog(`Deleted group '${group.groupName}'`, adminId);
            }
          }}
          onRowClick={openDrawerForEdit}
        />
      )}

      {drawerOpen && (
        <GroupDetailsDrawer
          group={
            selectedGroup ?? { id: 0, groupName: "", users: [] }
          }
          adminId={adminId}
          onClose={() => setDrawerOpen(false)}
          onSave={async (group) => {
            if (isAddMode) {
              await handleAddGroup(group);
              await addLog(`Added group '${group.groupName}'`, adminId);
            } else {
              await handleUpdateGroup(group);
              await addLog(`Updated group '${group.groupName}'`, adminId);
            }
            setDrawerOpen(false);
          }}
          onDelete={async (group) => {
            if (confirm(`Delete group "${group.groupName}"?`)) {
              await handleDeleteGroup(group);
              await addLog(`Deleted group '${group.groupName}'`, adminId);
              setDrawerOpen(false);
            }
          }}
        />
      )}
    </div>
  );
}
