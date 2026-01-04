import type { TUser } from "@/types/TUser";
import { createContext } from "react";

export type TUserContext = {
  getCurrUser: () => TUser | undefined;        // sync getter
  getCurrUserAsync: () => Promise<TUser | undefined>; // async getter
  setCurrUserUndefined: () => void;           // logout
  isLoading: boolean;                         // fetch in progress
};

export const UserContext = createContext<TUserContext>({
  getCurrUser: () => undefined,
  getCurrUserAsync: async () => undefined,
  setCurrUserUndefined: () => {},
  isLoading: false,
});
