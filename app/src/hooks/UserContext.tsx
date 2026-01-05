import type { TUser } from "@/types/TUser";
import { createContext } from "react";

export type TUserContext = {
  setCurrUser: (user: TUser) => void;
  getCurrUser: () => TUser | undefined;        // sync getter
  getCurrUserAsync: () => Promise<TUser | undefined>; // async getter
  setCurrUserUndefined: () => void;           // logout
  isLoading: boolean;                         // fetch in progress
  hasCheckedAuth: boolean;                   // whether auth check has been performed
};

export const UserContext = createContext<TUserContext>({
  setCurrUser: () => {},
  getCurrUser: () => undefined,
  getCurrUserAsync: async () => undefined,
  setCurrUserUndefined: () => {},
  isLoading: false,
  hasCheckedAuth: false,
});
