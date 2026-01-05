import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { UserContext } from "@/hooks/UserContext";
import type { JSX } from "react";

export default function ProtectedRoute({ children }: { children: JSX.Element }) {
  const { getCurrUser, isLoading, hasCheckedAuth } = useContext(UserContext); 
  const user = getCurrUser();

  if (!hasCheckedAuth || isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-current border-t-transparent" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
