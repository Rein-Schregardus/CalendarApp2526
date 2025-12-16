import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { UserContext } from "@/hooks/UserContext";
import type { JSX } from "react";

interface ProtectedRouteProps {
  children: JSX.Element;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { currUser, isAuthLoading } = useContext(UserContext);

  if (isAuthLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div
          className="h-8 w-8 animate-spin rounded-full border-2 border-current border-t-transparent"
          aria-label="Loading"
        />
      </div>
    );
  }

  // Not authenticated
  if (!currUser) {
    return <Navigate to="/login" replace />;
  }

  // Authenticated
  return children;
}
