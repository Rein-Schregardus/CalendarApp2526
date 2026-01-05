import { useState, useEffect } from "react";
import { useApi } from "../../../hooks/useApi";
import { type ColumnConfig } from "../DataTable";
import { type User } from "./userManagementConfig";

export type Group = {
  id: number;
  groupName: string;
  users?: User[];
};

export const groupsManagementConfig = {
  columns: [
    { header: "ID", accessor: "id", editable: false },
    { header: "Group Name", accessor: "groupName", editable: true },
  ] as ColumnConfig<Group>[],

  endpoints: {
    listGroups: "/admin/groups",
    addGroup: "/admin/groups",
    updateGroup: (id: number) => `/admin/groups/${id}`,
    deleteGroup: (id: number) => `/admin/groups/${id}`,
  },

  useGroupsManagement() {
    const { callApi } = useApi();

    const [groups, setGroups] = useState<Group[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const endpoints = groupsManagementConfig.endpoints;

    useEffect(() => {
      const fetchGroups = async () => {
        setLoading(true);
        try {
          const result = await callApi<Group[]>({
            endpoint: endpoints.listGroups,
          });
          if (result.data) setGroups(result.data);
          setError(null);
        } catch (err: unknown) {
          setError(err instanceof Error ? err : new Error("Failed to load groups"));
        } finally {
          setLoading(false);
        }
      };
      fetchGroups();
    }, []);

    const handleAddGroup = async (group: Partial<Group>) => {
      const result = await callApi<Group>({
        endpoint: endpoints.addGroup,
        method: "POST",
        data: group,
      });

      const newGroup = result.data;
      if (newGroup) {
        setGroups((prev) => [...prev, newGroup]);
      }
    };

    const handleUpdateGroup = async (group: Partial<Group> & { id: number }) => {
      const result = await callApi<Group>({
        endpoint: endpoints.updateGroup(group.id),
        method: "PUT",
        data: group,
      });

      const updatedGroup = result.data;
      if (updatedGroup) {
        setGroups((prev) => prev.map((g) => (g.id === group.id ? updatedGroup : g)));
      }
    };

    const handleDeleteGroup = async (group: Group) => {
      await callApi({
        endpoint: endpoints.deleteGroup(group.id),
        method: "DELETE",
      });
      setGroups((prev) => prev.filter((g) => g.id !== group.id));
    };

    return {
      groups,
      loading,
      error,
      handleAddGroup,
      handleUpdateGroup,
      handleDeleteGroup,
    };
  },
};
