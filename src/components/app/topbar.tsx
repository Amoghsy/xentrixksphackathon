import { Bell, Search, Sun, Moon, LogOut } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";
import { useAuthStore } from "@/stores/auth";
import { usePrefs } from "@/stores/prefs";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

export function Topbar() {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const { lang, setLang, theme, toggleTheme } = usePrefs();
  const navigate = useNavigate();

  const initials = user?.name.split(" ").map((n) => n[0]).slice(-2).join("") ?? "?";

  const roleColor: Record<string, string> = {
    Supervisor: "bg-primary text-primary-foreground",
    Investigator: "bg-info text-info-foreground",
    Analyst: "bg-chart-2/20 text-chart-2",
    Policymaker: "bg-warning text-warning-foreground",
  };

  return (
    <header className="flex items-center gap-3 border-b border-border bg-card px-4 h-14 shrink-0">
      <div className="relative flex-1 max-w-xl">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search cases, FIRs, offenders, districts…"
          className="w-full h-9 rounded-md border border-input bg-background pl-9 pr-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/40"
        />
      </div>

      <div className="flex items-center gap-2">
        <div className="flex items-center h-9 rounded-md border border-input overflow-hidden text-xs">
          <button
            onClick={() => setLang("en")}
            className={cn(
              "h-full px-2.5 font-medium flex items-center",
              lang === "en" ? "bg-primary text-primary-foreground" : "hover:bg-accent",
            )}
          >
            EN
          </button>
          <button
            onClick={() => setLang("kn")}
            className={cn(
              "h-full px-2.5 font-medium flex items-center",
              lang === "kn" ? "bg-primary text-primary-foreground" : "hover:bg-accent",
            )}
          >
            KN
          </button>
        </div>

        <button
          onClick={toggleTheme}
          className="h-9 w-9 rounded-md hover:bg-accent flex items-center justify-center"
          title={theme === "light" ? "Switch to dark" : "Switch to light"}
        >
          {theme === "light" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
        </button>

        <button className="relative h-9 w-9 rounded-md hover:bg-accent flex items-center justify-center">
          <Bell className="h-4 w-4" />
          <span className="absolute top-1 right-1 h-4 min-w-4 rounded-full bg-destructive text-[10px] font-medium text-destructive-foreground flex items-center justify-center px-1">
            3
          </span>
        </button>

        <div className="hidden md:block h-6 w-px bg-border mx-1" />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 px-1.5 h-9 rounded-md hover:bg-accent">
              <Avatar className="h-7 w-7">
                <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="hidden md:flex flex-col text-left leading-tight">
                <span className="text-xs font-medium">{user?.name}</span>
                <span className="text-[10px] text-muted-foreground">{user?.badgeNo}</span>
              </div>
              <Badge className={cn("hidden md:inline-flex ml-1", roleColor[user?.role ?? ""])}>
                {user?.role}
              </Badge>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div className="text-sm font-medium">{user?.name}</div>
              <div className="text-xs text-muted-foreground">{user?.station}</div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate({ to: "/settings" })}>
              Settings
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                logout();
                navigate({ to: "/login" });
              }}
              className="text-destructive focus:text-destructive"
            >
              <LogOut className="h-4 w-4 mr-2" /> Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
