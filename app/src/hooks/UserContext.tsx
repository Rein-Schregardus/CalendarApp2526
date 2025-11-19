import type { TUser } from '@/types/TUser';
import React, { createContext, useState } from 'react';

type TModUserContext = {
  getCurrUser: () => TUser | undefined,
  setCurrUserUndefined: () => void
}

const UserContext = createContext<TModUserContext>({
  getCurrUser: () => {
    throw new Error("User context not available access failure");
  },
  setCurrUserUndefined: () => {

  },
});

const UserProvider = ({ children }: { children?: React.ReactElement }) => {
  const [currUser, setCurrUser] = useState<TUser>();

  const getCurrUser = () => {
    if (currUser == undefined) {
      try {
        const update = async () => {
          const request = await fetch("http://localhost:5005/auth/me", {
            method: "GET",
            credentials: "include"
          });
          const userbody = await request.json();
          const user: TUser = { id: userbody.id, email: userbody.email, fullName: userbody.fullName, role: userbody.role };
          setCurrUser(user);
        }
        update();
      }
      catch (error) {
        console.log(error)
      }
    }
    return currUser;
  }
  const setCurrUserUndefined = () => {
    setCurrUser(undefined);
  }

  return (
    <UserContext.Provider value={{ getCurrUser, setCurrUserUndefined }}>
      {children}
    </UserContext.Provider>
  );
};

export { UserProvider, UserContext };