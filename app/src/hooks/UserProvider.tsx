import { useState, useRef, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "./UserContext";
import type { TUser } from "@/types/TUser";

const API_URL = "http://localhost:5005";

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [currUser, setCurrUser] = useState<TUser | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const isFetchingRef = useRef(false);
  const navigate = useNavigate();

  const hardLogout = useCallback(() => {
    setCurrUser(undefined);
    navigate("/login", { replace: true });
  }, [navigate]);

  const fetchUser = useCallback(async (): Promise<TUser | undefined> => {
    if (isFetchingRef.current) return currUser; // prevent duplicate fetch
    isFetchingRef.current = true;
    setIsLoading(true);

    try {
      let res = await fetch(`${API_URL}/auth/me`, { credentials: "include" });

      if (res.status === 401) {
        // try refresh token
        const refresh = await fetch(`${API_URL}/auth/refresh`, {
          method: "POST",
          credentials: "include",
        });
        if (!refresh.ok) {
          hardLogout();
          return undefined;
        }
        res = await fetch(`${API_URL}/auth/me`, { credentials: "include" });
        if (!res.ok) {
          hardLogout();
          return undefined;
        }
      }

      if (!res.ok) return undefined;

      const user: TUser = await res.json();
      if (!user?.id) return undefined;

      setCurrUser(user);
      return user;
    } catch {
      return undefined;
    } finally {
      isFetchingRef.current = false;
      setIsLoading(false);
    }
  }, [currUser, hardLogout]);

  // sync getter
  const getCurrUser = useCallback(() => currUser, [currUser]);

  // async getter
  const getCurrUserAsync = useCallback(async () => {
    if (currUser) return currUser;
    return await fetchUser();
  }, [currUser, fetchUser]);

  const setCurrUserUndefined = useCallback(() => {
    hardLogout();
  }, [hardLogout]);

  // optional: fetch user once on mount
  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  return (
    <UserContext.Provider
      value={{
        getCurrUser,
        getCurrUserAsync,
        setCurrUserUndefined,
        isLoading,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
