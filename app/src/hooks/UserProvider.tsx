import { useState, useCallback, useEffect } from "react";
import type { TUser } from "@/types/TUser";
import { UserContext } from "./UserContext";
import { useNavigate } from "react-router-dom";

const API_URL = "http://localhost:5005";

export const UserProvider = ({ children }: { children?: React.ReactNode }) => {
  const [currUser, setCurrUser] = useState<TUser | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const navigate = useNavigate();

  const hardLogout = useCallback(() => {
    setCurrUser(null);
    setIsAuthLoading(false);
    navigate("/login", { replace: true });
  }, [navigate]);

  const initialLoad = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}/auth/me`, {
        credentials: "include",
      });

      if (res.status === 401) {
        const refresh = await fetch(`${API_URL}/auth/refresh`, {
          method: "POST",
          credentials: "include",
        });

        if (refresh.status === 401) {
          hardLogout();
          return;
        }

        const retry = await fetch(`${API_URL}/auth/me`, {
          credentials: "include",
        });

        if (!retry.ok) {
          hardLogout();
          return;
        }

        const data: TUser = await retry.json();
        setCurrUser(data);
        setIsAuthLoading(false);
        return;
      }

      if (!res.ok) {
        hardLogout();
        return;
      }

      const user: TUser = await res.json();
      setCurrUser(user);
      setIsAuthLoading(false);
    } catch (err) {
      console.error("Initial user fetch failed:", err);
      hardLogout();
    }
  }, [hardLogout]);

  useEffect(() => {
    initialLoad();
  }, [initialLoad]);

  return (
    <UserContext.Provider
      value={{
        currUser,
        logoutUser: hardLogout,
        isAuthLoading,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
