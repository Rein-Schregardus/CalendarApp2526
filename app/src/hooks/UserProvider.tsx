import { useState, useRef, useCallback, useEffect } from "react";
import { UserContext } from "./UserContext";
import type { TUser } from "@/types/TUser";

const API_URL = "http://localhost:5005";

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [currUser, setCurrUser] = useState<TUser | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const isFetchingRef = useRef(false);
  const [hasCheckedAuth, setHasCheckedAuth] = useState(false);


  const hardLogout = useCallback(() => {
    setCurrUser(undefined);
  }, []);

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
      setHasCheckedAuth(true); 
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

  const setCurrUserDirect = useCallback((user: TUser) => {
    setCurrUser(user);
    setHasCheckedAuth(true);
  }, []);


  // optional: fetch user once on mount
  useEffect(() => {
  if (!currUser) {
    fetchUser();
  }
}, [fetchUser, currUser]);

  return (
    <UserContext.Provider
      value={{
        setCurrUser: setCurrUserDirect,
        getCurrUser,
        getCurrUserAsync,
        setCurrUserUndefined,
        isLoading,
        hasCheckedAuth,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
