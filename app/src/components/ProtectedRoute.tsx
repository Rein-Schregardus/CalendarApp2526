import { useContext, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { UserContext } from "@/hooks/UserContext";
import type { JSX } from "react";

interface ProtectedRouteProps {
  children: JSX.Element;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const userContext = useContext(UserContext);
  const [checked, setChecked] = useState(false);
  const [currUser, setCurrUser] = useState(userContext.getCurrUser());

  useEffect(() => {
    // fetch async user if not loaded
    if (!currUser) {
      userContext.getCurrUserAsync().then(user => {
        setCurrUser(user);
        setChecked(true);
      });
    } else {
      setChecked(true);
    }
  }, [currUser, userContext]);

  if (!checked || userContext.isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div
          className="h-8 w-8 animate-spin rounded-full border-2 border-current border-t-transparent"
          aria-label="Loading"
        />
      </div>
    );
  }

  if (!currUser) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
