import { Navigate } from "@tanstack/react-router";
import type { PropsWithChildren } from "react";
import { authClient } from "@/lib/auth-client";

export function RequireAuth({ children }: PropsWithChildren) {
  const { data: session, isPending } = authClient.useSession();

  if (isPending) {
    return null;
  }

  if (!session) {
    return <Navigate to="/login" />;
  }

  return children;
}
