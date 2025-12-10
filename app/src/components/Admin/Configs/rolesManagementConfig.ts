import { useState, useEffect } from "react";
import { useApi } from "../../../hooks/useApi";

export type Role = {
  id: number;
  roleName: string;
};

export type ColumnConfig<T> = {
  header: string;
  key: keyof T;
  editable?: boolean;
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
    { header: "ID", key: "id", editable: false },
    { header: "Role Name", key: "roleName", editable: true },
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
        const result = await callApi<Role[]>({ endpoint: endpoints.listRoles });
        if (result.error) setError(result.error);
        if (result.data) setRoles(result.data);
        setLoading(false);
      };
      fetchRoles();
    }, []);

    const handleAddRole = async (role: Partial<Role>) => {
      if (!role.roleName) {
        setError(new Error("Role name is required"));
        return;
      }
      const result = await callApi<Role>({
        endpoint: endpoints.addRole,
        method: "POST",
        data: role,
      });
      if (result.error) setError(result.error);
      if (result.data) {
        const newRole: Role = {
          id: result.data.id,
          roleName: result.data.roleName,
        };
        setRoles((prev) => [...prev, newRole]);
      }
    };

    const handleUpdateRole = async (role: Partial<Role> & { id: number }) => {
      if (!role.roleName) {
        setError(new Error("Role name is required"));
        return;
      }
      const result = await callApi({
        endpoint: endpoints.updateRole(role.id),
        method: "PUT",
        data: { roleName: role.roleName },
      });
      if (result.error) setError(result.error);
      else
        setRoles((prev) =>
          prev.map((r) =>
            r.id === role.id ? { ...r, roleName: role.roleName! } : r
          )
        );
    };

    const handleDeleteRole = async (role: Role) => {
      const result = await callApi({
        endpoint: endpoints.deleteRole(role.id),
        method: "DELETE",
      });
      if (result.error) setError(result.error);
      else setRoles((prev) => prev.filter((r) => r.id !== role.id));
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
