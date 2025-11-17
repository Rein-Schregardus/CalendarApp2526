import type { TUser } from "@/types/TUser";
import React, { createContext, useState, useCallback } from "react";

type TModUserContext = {
  getCurrUser: () => Promise<TUser | undefined>;
  setCurrUserUndefined: () => void;
};

const UserContext = createContext<TModUserContext>({
  getCurrUser: async () => {
    throw new Error("User context not initialized");
  },
  setCurrUserUndefined: () => {},
});

const API_URL = "http://localhost:5005";

export const UserProvider = ({ children }: { children?: React.ReactElement }) => {
  const [currUser, setCurrUser] = useState<TUser>();

  const fetchCurrUser = useCallback(async (): Promise<TUser | undefined> => {
    try {
      const res = await fetch(`${API_URL}/auth/me`, {
        method: "GET",
        credentials: "include",
      });

      // If unauthorized try to refresh
      if (res.status === 401) {
        const refreshed = await fetch(`${API_URL}/auth/refresh`, {
          method: "POST",
          credentials: "include",
        });

        if (!refreshed.ok) {
          // Refresh failed, no user
          setCurrUser(undefined);
          return undefined;
        }

        // Try /auth/me again after refresh
        const retry = await fetch(`${API_URL}/auth/me`, {
          method: "GET",
          credentials: "include",
        });

        if (!retry.ok) {
          setCurrUser(undefined);
          return undefined;
        }

        const data: TUser = await retry.json();
        setCurrUser(data);
        return data;
      }

      if (!res.ok) {
        setCurrUser(undefined);
        return undefined;
      }

      const user: TUser = await res.json();
      setCurrUser(user);
      return user;
    } catch (err) {
      console.error("User fetch error:", err);
      setCurrUser(undefined);
      return undefined;
    }
  }, []);

  const getCurrUser = useCallback(async (): Promise<TUser | undefined> => {
    if (currUser !== undefined) return currUser;

    return await fetchCurrUser();
  }, [currUser, fetchCurrUser]);

  const setCurrUserUndefined = () => setCurrUser(undefined);

  return (
    <UserContext.Provider value={{ getCurrUser, setCurrUserUndefined }}>
      {children}
    </UserContext.Provider>
  );
};

export { UserContext };
