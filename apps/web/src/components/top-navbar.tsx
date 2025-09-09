import { useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate } from "@tanstack/react-router";
import { LogOut, Moon, Sun, User, Waves } from "lucide-react";
import { useTheme } from "next-themes";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { authClient } from "@/lib/auth-client";

export function TopNavbar() {
  const { data: session, isPending } = authClient.useSession();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { theme, setTheme } = useTheme();

  if (isPending) {
    return <Skeleton className="h-16 w-full" />;
  }

  if (!session) {
    return null;
  }

  const user = session.user;

  return (
    <nav className="border-b bg-card shadow-lg">
      <div className="flex h-16 items-center px-6">
        <div className="flex items-center gap-3">
          <Link className="inline-flex items-center gap-2" to="/dashboard">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 text-white">
              <Waves className="h-6 w-6" />
            </div>
            <span className="font-semibold text-lg">Tide Info</span>
          </Link>
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Right side - Theme toggle and User avatar */}
        <div className="flex flex-1 items-center justify-end gap-3">
          <Button
            className="h-9 w-9 rounded-lg border border-border bg-background/60 transition-all duration-200 hover:bg-accent"
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            size="icon"
            variant="ghost"
          >
            <Sun className="dark:-rotate-90 h-4 w-4 rotate-0 scale-100 text-foreground transition-all dark:scale-0" />
            <Moon className="absolute h-4 w-4 rotate-90 scale-0 text-foreground transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                className="relative h-9 w-9 rounded-lg border border-border bg-background/60 transition-all duration-200 hover:bg-accent"
                variant="ghost"
              >
                <Avatar className="h-7 w-7">
                  <AvatarImage
                    alt={user.name}
                    src={user.image ?? "/placeholder.svg"}
                  />
                  <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                    <User className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-56 border-border bg-card backdrop-blur-md"
              forceMount
            >
              <DropdownMenuItem
                className="cursor-pointer text-foreground hover:bg-accent focus:bg-accent"
                onClick={() => {
                  queryClient.clear();
                  authClient.signOut({
                    fetchOptions: {
                      onSuccess: () => {
                        navigate({
                          to: "/",
                        });
                      },
                    },
                  });
                }}
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  );
}
