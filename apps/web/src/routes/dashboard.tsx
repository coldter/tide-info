import { createFileRoute } from "@tanstack/react-router";
import { RequireAuth } from "@/components/require-auth";

export const Route = createFileRoute("/dashboard")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <RequireAuth>
      <div className="grid min-h-svh place-items-center p-4">
        <div className="w-full max-w-2xl rounded-lg border p-6 shadow-sm">
          <h1 className="font-semibold text-2xl">Dashboard</h1>
          <p className="mt-2 text-muted-foreground">You're signed in.</p>
        </div>
      </div>
    </RequireAuth>
  );
}
