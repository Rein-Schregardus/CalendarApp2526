import { useState, useEffect } from "react";
import { useApi } from "../../../hooks/useApi";

export type User = {
  id: number;
  email: string;
  fullName: string;
  userName: string;
  roleName: string;
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
    handleAddUser: (user: Partial<User> & { password: string }) => Promise<void>;
    handleUpdateUser: (user: Partial<User> & { id: number; password?: string }) => Promise<void>;
    handleDeleteUser: (user: User) => Promise<void>;
  };
};

export const userManagementConfig: UserManagementConfig = {
  columns: [
    { header: "ID", key: "id", editable: false },
    { header: "Full Name", key: "fullName", editable: true },
    { header: "User Name", key: "userName", editable: true },
    { header: "Email", key: "email", editable: true },
    { header: "Role", key: "roleName", editable: true, optionsKey: "roles" },
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

    // Fetch users
    useEffect(() => {
      const fetchUsers = async () => {
        setLoading(true);
        const res = await callApi<User[]>({ endpoint: endpoints.listUsers });
        if (res.error) return setError(res.error);
        if (!res.data) return;
        setUsers(res.data);
        setLoading(false);
      };
      fetchUsers();
    }, []);

    // Fetch roles
    useEffect(() => {
      const fetchRoles = async () => {
        const res = await callApi<{ id: number; roleName: string }[]>({
          endpoint: endpoints.listRoles,
        });
        if (!res.data) return;
        setRoles(res.data.map((r) => ({ id: r.id, label: r.roleName, value: r.roleName })));
      };
      fetchRoles();
    }, []);

    // Map role names to role IDs for existing users
    useEffect(() => {
      if (users.length === 0 || roles.length === 0) return;
      setUsers((prev) =>
        prev.map((u) => ({
          ...u,
          roleId: u.roleId ?? roles.find((r) => r.value === u.roleName)?.id ?? 0,
        }))
      );
    }, [roles]);

    // Add user
    const handleAddUser = async (user: Partial<User> & { password: string }) => {
      if (!user.password || !user.fullName || !user.email || !user.userName || !user.roleId) {
        setError(new Error("Full name, username, email, password, and role are required"));
        return;
      }
      const payload = {
        fullName: user.fullName,
        userName: user.userName,
        email: user.email,
        password: user.password,
        roleId: user.roleId,
      };
      const res = await callApi<User>({ endpoint: endpoints.addUser, method: "POST", data: payload });
      if (res.error) return setError(res.error);
      if (!res.data) return;
      setUsers((prev) => [...prev, res.data!]);
    };

    // Update user
    const handleUpdateUser = async (user: Partial<User> & { id: number; password?: string }) => {
      const existingUser = users.find((u) => u.id === user.id);
      if (!existingUser) return;

      const payload: Partial<User> & { roleId: number; password?: string } = {
        fullName: user.fullName ?? existingUser.fullName,
        userName: user.userName ?? existingUser.userName,
        email: user.email ?? existingUser.email,
        roleId: user.roleId ?? existingUser.roleId,
      };
      if (user.password) payload.password = user.password;

      const res = await callApi<User>({ endpoint: endpoints.updateUser(user.id), method: "PUT", data: payload });
      if (res.error) return setError(res.error);
      if (!res.data) return;

      setUsers((prev) => prev.map((u) => (u.id === user.id ? res.data! : u)));
    };

    const handleDeleteUser = async (user: User) => {
      const res = await callApi({ endpoint: endpoints.deleteUser(user.id), method: "DELETE" });
      if (res.error) return setError(res.error);
      setUsers((prev) => prev.filter((u) => u.id !== user.id));
    };

    return { users, roles, loading, error, handleAddUser, handleUpdateUser, handleDeleteUser };
  },
};
