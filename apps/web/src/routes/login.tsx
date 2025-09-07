import { RiGithubLine } from "@remixicon/react";
import { createFileRoute, Navigate } from "@tanstack/react-router";
import { LogoDark, LogoLight } from "@/components/logo";
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
        <div className="mb-4 flex items-center justify-center gap-3">
          <LogoLight className="block dark:hidden" height={48} width={256} />
          <LogoDark className="hidden dark:block" height={48} width={256} />
        </div>
        <h1 className="text-center font-semibold text-xl">
          Log in to Tide Info
        </h1>

        <Button
          className="mt-6 w-full gap-2"
          onClick={handleGithubLogin}
          type="button"
        >
          <RiGithubLine aria-hidden="true" />
          Continue with GitHub
        </Button>
      </div>
    </div>
  );
}
