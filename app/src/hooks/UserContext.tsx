import type { TUser } from "@/types/TUser";
import { createContext } from "react";

export type TModUserContext = {
  currUser: TUser | null;
  logoutUser: () => void;
  isAuthLoading: boolean;
};

export const UserContext = createContext<TModUserContext>({
  currUser: null,
  logoutUser: () => {},
  isAuthLoading: true,
});
