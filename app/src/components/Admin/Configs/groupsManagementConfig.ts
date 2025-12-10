import { useState, useEffect } from "react";
import { useApi } from "../../../hooks/useApi";
import { type Column } from "../DataTable";
import { type User } from "./userManagementConfig";

export type Group = {
  id: number;
  groupName: string;
  users?: User[];
};

export const groupsManagementConfig = {
  columns: [
    { header: "ID", key: "id", editable: false },
    { header: "Group Name", key: "groupName", editable: true },
  ] as Column<Group>[],

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
    const [error] = useState<Error | null>(null);

    const endpoints = groupsManagementConfig.endpoints;

    useEffect(() => {
      const fetchGroups = async () => {
        setLoading(true);
        const result = await callApi<Group[]>({
          endpoint: endpoints.listGroups,
        });
        if (result.data) setGroups(result.data);
        setLoading(false);
      };
      fetchGroups();
    }, []);

    const handleAddGroup = async (group: Partial<Group>) => {
      const result = await callApi<Group>({
        endpoint: endpoints.addGroup,
        method: "POST",
        data: group,
      });
      if (result.data) setGroups((prev) => [...prev, result.data!]);
    };

    const handleUpdateGroup = async (group: Partial<Group> & { id: number }) => {
      const result = await callApi<Group>({
        endpoint: endpoints.updateGroup(group.id),
        method: "PUT",
        data: group,
      });
      if (result.data) {
        setGroups((prev) =>
          prev.map((g) => (g.id === group.id ? result.data! : g))
        );
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
