import { useState, useEffect } from "react";
import { useApi } from "../../../hooks/useApi";
import { type ColumnConfig } from "./../DataTable";

export type Role = {
  id: number;
  roleName: string;
};

export type RolesManagementConfig = {
  columns: ColumnConfig<Role>[];
  endpoints: {
    listRoles: string;
    addRole: string;
    updateRole: (id: number) => string;
    deleteRole: (id: number) => string;
  };
  useRolesManagement: () => {
    roles: Role[];
    loading: boolean;
    error: Error | null;
    handleAddRole: (role: Partial<Role>) => Promise<void>;
    handleUpdateRole: (role: Partial<Role> & { id: number }) => Promise<void>;
    handleDeleteRole: (role: Role) => Promise<void>;
  };
};

export const rolesManagementConfig: RolesManagementConfig = {
  columns: [
    { header: "ID", accessor: "id", editable: false },
    { header: "Role Name", accessor: "roleName", editable: true },
  ],

  endpoints: {
    listRoles: "/roles",
    addRole: "/roles",
    updateRole: (id: number) => `/roles/${id}`,
    deleteRole: (id: number) => `/roles/${id}`,
  },

  useRolesManagement() {
    const { callApi } = useApi();
    const [roles, setRoles] = useState<Role[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const endpoints = rolesManagementConfig.endpoints;

    // Load roles
    useEffect(() => {
      const fetchRoles = async () => {
        setLoading(true);
        try {
          const result = await callApi<Role[]>({
            endpoint: endpoints.listRoles,
          });
          if (result.data) setRoles(result.data);
          setError(null);
        } catch (err: unknown) {
          setError(
            err instanceof Error ? err : new Error("Failed to load roles")
          );
        } finally {
          setLoading(false);
        }
      };
      fetchRoles();
    }, []);

    const handleAddRole = async (role: Partial<Role>) => {
      if (!role.roleName) {
        setError(new Error("Role name is required"));
        return;
      }
      try {
        const result = await callApi<Role>({
          endpoint: endpoints.addRole,
          method: "POST",
          data: role,
        });

        const newRole = result.data;
        if (newRole) {
          setRoles((prev) => [...prev, newRole]);
        }

        setError(null);
      } catch (err: unknown) {
        setError(err instanceof Error ? err : new Error("Failed to add role"));
      }
    };

    const handleUpdateRole = async (role: Partial<Role> & { id: number }) => {
      if (!role.roleName) {
        setError(new Error("Role name is required"));
        return;
      }
      try {
        await callApi({
          endpoint: endpoints.updateRole(role.id),
          method: "PUT",
          data: { roleName: role.roleName },
        });
        setRoles((prev) =>
          prev.map((r) =>
            r.id === role.id ? { ...r, roleName: role.roleName! } : r
          )
        );
        setError(null);
      } catch (err: unknown) {
        setError(
          err instanceof Error ? err : new Error("Failed to update role")
        );
      }
    };

    const handleDeleteRole = async (role: Role) => {
      try {
        await callApi({
          endpoint: endpoints.deleteRole(role.id),
          method: "DELETE",
        });
        setRoles((prev) => prev.filter((r) => r.id !== role.id));
        setError(null);
      } catch (err: unknown) {
        setError(
          err instanceof Error ? err : new Error("Failed to delete role")
        );
      }
    };

    return {
      roles,
      loading,
      error,
      handleAddRole,
      handleUpdateRole,
      handleDeleteRole,
    };
  },
};
