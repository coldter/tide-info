import { RiGithubFill } from "@remixicon/react";
import { createFileRoute, Navigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";

export const Route = createFileRoute("/login")({
  component: RouteComponent,
});

function RouteComponent() {
  const { data: session, isPending } = authClient.useSession();

  if (isPending) {
    return null;
  }

  if (session) {
    return <Navigate to="/dashboard" />;
  }

  const handleGithubLogin = () => {
    authClient.signIn.social({
      provider: "github",
      callbackURL: `${window.location.origin}/dashboard`,
    });
  };

  return (
    <div className="grid min-h-svh place-items-center p-4">
      <div className="w-full max-w-sm rounded-lg border p-6 shadow-sm">
        <h1 className="font-semibold text-xl">Log in</h1>
        <p className="mt-1 text-muted-foreground text-sm">
          Use GitHub to continue
        </p>

        <Button
          className="mt-6 w-full gap-2"
          onClick={handleGithubLogin}
          type="button"
        >
          <RiGithubFill aria-hidden="true" />
          Continue with GitHub
        </Button>
      </div>
    </div>
  );
}
