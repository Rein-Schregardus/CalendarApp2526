import { useState, useEffect } from "react";
import { useApi } from "../../hooks/useApi";
import DataTable from "./DataTable";

type ApiUser = {
  id: number;
  email: string;
  fullName: string;
  userName: string;
  roleName: string;
};

type User = {
  id: number;
  email: string;
  fullName: string;
  userName: string;
  role: string;
};

const ManagementPanel = ({
  active,
  onBack,
}: {
  active: string;
  onBack: () => void;
}) => {
  const { callApi } = useApi();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (active === "users") {
      const fetchUsers = async () => {
        setLoading(true);
        setError(null);
        const result = await callApi<ApiUser[]>({ endpoint: "/auth/users" });
        if (result.error) setError(result.error);
        if (result.data) {
          const mappedUsers: User[] = result.data.map((u) => ({
            id: u.id,
            email: u.email,
            fullName: u.fullName,
            userName: u.userName,
            role: u.roleName,
          }));
          setUsers(mappedUsers);
        }
        setLoading(false);
      };
      fetchUsers();
    }
  }, [active]);

  const handleEditUser = (user: User) => alert(`Editing ${user.fullName}`);
  const handleDeleteUser = (user: User) => alert(`Deleting ${user.fullName}`);

  return (
    <div className="flex-1 flex flex-col p-6">
      <button
        className="mb-4 text-blue-600 font-medium hover:underline"
        onClick={onBack}
      >
        &larr; Back to Dashboard
      </button>

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">Error: {error.message}</p>}

      {!loading && !error && active === "users" && users.length > 0 && (
        <DataTable
          columns={[
            { header: "ID", key: "id" },
            { header: "Full Name", key: "fullName" },
            { header: "User Name", key: "userName" },
            { header: "Email", key: "email" },
            { header: "Role", key: "role" },
          ]}
          data={users}
          onEdit={handleEditUser}
          onDelete={handleDeleteUser}
        />
      )}

      {active === "roles" && <div>Role management table goes here</div>}
      {active === "groups" && <div>Group management table goes here</div>}
    </div>
  );
};

export default ManagementPanel;
