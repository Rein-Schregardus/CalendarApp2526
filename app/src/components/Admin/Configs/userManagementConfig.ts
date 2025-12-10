import { useState, useEffect } from "react";
import { useApi } from "../../../hooks/useApi";

export type User = {
  id: number;
  email: string;
  fullName: string;
  userName: string;
  role: string;
  roleId: number;
  password?: string; // Only required when adding/updating
};

export type ColumnOption = {
  id: number;
  label: string;
  value: string;
};

export type ColumnConfig<T> = {
  header: string;
  key: keyof T;
  editable?: boolean;
  optionsKey?: string;
  options?: ColumnOption[];
};

export type UserManagementConfig = {
  columns: ColumnConfig<User>[];
  endpoints: {
    listUsers: string;
    addUser: string;
    updateUser: (id: number) => string;
    deleteUser: (id: number) => string;
    listRoles: string;
  };
  useUserManagement: () => {
    users: User[];
    roles: ColumnOption[];
    loading: boolean;
    error: Error | null;
    handleAddUser: (
      user: Partial<User> & { password: string }
    ) => Promise<void>;
    handleUpdateUser: (
      user: Partial<User> & { id: number; password?: string }
    ) => Promise<void>;
    handleDeleteUser: (user: User) => Promise<void>;
  };
};

export const userManagementConfig: UserManagementConfig = {
  columns: [
    { header: "ID", key: "id", editable: false },
    { header: "Full Name", key: "fullName", editable: true },
    { header: "User Name", key: "userName", editable: true },
    { header: "Email", key: "email", editable: true },
    { header: "Role", key: "role", editable: true, optionsKey: "roles" },
    { header: "Password", key: "password", editable: true },
  ],

  endpoints: {
    listUsers: "/admin/users",
    addUser: "/admin/users",
    updateUser: (id: number) => `/admin/users/${id}`,
    deleteUser: (id: number) => `/admin/users/${id}`,
    listRoles: "/admin/roles",
  },

  useUserManagement() {
    const { callApi } = useApi();
    const [users, setUsers] = useState<User[]>([]);
    const [roles, setRoles] = useState<ColumnOption[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const endpoints = userManagementConfig.endpoints;

    // Load users
    useEffect(() => {
      const fetchUsers = async () => {
        setLoading(true);
        const result = await callApi<User[]>({ endpoint: endpoints.listUsers });
        if (result.error) {
          setError(result.error);
          setLoading(false);
          return;
        }
        if (!result.data) {
          setLoading(false);
          return;
        }
        setUsers(result.data);
        setLoading(false);
      };
      fetchUsers();
    }, []);

    // Load roles
    useEffect(() => {
      const fetchRoles = async () => {
        const result = await callApi<{ id: number; roleName: string }[]>({
          endpoint: endpoints.listRoles,
        });

        if (!result.data) return;

        setRoles(
          result.data.map((r) => ({
            id: r.id,
            label: r.roleName,
            value: r.roleName,
          }))
        );
      };
      fetchRoles();
    }, []);

    // Add user
    const handleAddUser = async (
      user: Partial<User> & { password: string }
    ) => {
      if (
        !user.password ||
        !user.fullName ||
        !user.email ||
        !user.userName ||
        !user.roleId
      ) {
        setError(
          new Error(
            "Full name, username, email, password, and role are required"
          )
        );
        return;
      }

      const payload = {
        fullName: user.fullName,
        userName: user.userName,
        email: user.email,
        password: user.password,
        roleId: user.roleId,
      };

      const result = await callApi<User>({
        endpoint: endpoints.addUser,
        method: "POST",
        data: payload,
      });

      if (result.error) {
        setError(result.error);
        return;
      }
      if (!result.data) return;

      setUsers((prev) => [...prev, result.data!]);
    };

    // Update user
    const handleUpdateUser = async (
      user: Partial<User> & { id: number; password?: string }
    ) => {
      const payload: Partial<User> = {
        fullName: user.fullName,
        userName: user.userName,
        email: user.email,
        roleId: user.roleId,
      };
      if (user.password) payload.password = user.password;

      const result = await callApi<User>({
        endpoint: endpoints.updateUser(user.id),
        method: "PUT",
        data: payload,
      });

      if (result.error) {
        setError(result.error);
        return;
      }
      if (!result.data) return;

      setUsers((prev) =>
        prev.map((u) => (u.id === user.id ? { ...u, ...result.data! } : u))
      );
    };

    // Delete user
    const handleDeleteUser = async (user: User) => {
      const result = await callApi({
        endpoint: endpoints.deleteUser(user.id),
        method: "DELETE",
      });

      if (result.error) {
        setError(result.error);
        return;
      }

      setUsers((prev) => prev.filter((u) => u.id !== user.id));
    };

    return {
      users,
      roles,
      loading,
      error,
      handleAddUser,
      handleUpdateUser,
      handleDeleteUser,
    };
  },
};
