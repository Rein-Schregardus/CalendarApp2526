import type { TUser } from '@/types/TUser';
import React, {createContext, useState } from 'react';

type TModUserContext = {
  getCurrUser: () => TUser | undefined,
  setCurrUser: (user: TUser) => void
}

const UserContext = createContext<TModUserContext>(      {
        getCurrUser: () => {throw new Error("User context not available access failure");
        },
        setCurrUser: (user: TUser) => {throw new Error("User context not available assignment failure");}
      });

const UserProvider = ({children}: {children?: React.ReactElement}) => {
  const [currUser, setCurrUser] = useState<TUser>();

  return (
    <UserContext.Provider value={
      {
        getCurrUser: () => {return currUser},
        setCurrUser: (user: TUser) => {setCurrUser(user)}
      }}>
      {children}
    </UserContext.Provider>
  );
};

export { UserProvider, UserContext };