import { useEffect, useState } from "react";
import { useApi } from "./useApi";

export type Role = {
  id: number;
  roleName: string;
};

export function useRoles() {
  const { callApi } = useApi();
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRoles() {
      const { data } = await callApi<Role[]>({ endpoint: "/roles" });
      if (data) setRoles(data);
      setLoading(false);
    }
    fetchRoles();
  }, [callApi]);

  return { roles, loading };
}
