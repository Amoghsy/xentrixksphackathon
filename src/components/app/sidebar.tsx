import { Link, useRouterState } from "@tanstack/react-router";
import {
  MessageSquare,
  LayoutDashboard,
  Network,
  Map,
  FileSearch,
  Users,
  AlertTriangle,
  ClipboardList,
  Settings as SettingsIcon,
  Shield,
  ChevronLeft,
} from "lucide-react";
import { useAuthStore, type Role } from "@/stores/auth";
import { usePrefs } from "@/stores/prefs";
import { cn } from "@/lib/utils";

interface NavItem {
  to: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  roles?: Role[]; // undefined = all
}

const NAV: NavItem[] = [
  { to: "/", label: "Chat Assistant", icon: MessageSquare },
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/network", label: "Criminal Network", icon: Network, roles: ["Investigator", "Analyst", "Supervisor"] },
  { to: "/map", label: "Crime Map", icon: Map },
  { to: "/cases", label: "Case Search", icon: FileSearch, roles: ["Investigator", "Analyst", "Supervisor"] },
  { to: "/offenders", label: "Offender Profiles", icon: Users, roles: ["Investigator", "Analyst", "Supervisor"] },
  { to: "/alerts", label: "Alerts", icon: AlertTriangle },
  { to: "/audit", label: "Audit Log", icon: ClipboardList, roles: ["Supervisor"] },
  { to: "/settings", label: "Settings", icon: SettingsIcon },
];

export function Sidebar() {
  const role = useAuthStore((s) => s.user?.role);
  const { sidebarCollapsed, toggleSidebar } = usePrefs();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  const items = NAV.filter((n) => !n.roles || (role && n.roles.includes(role)));

  return (
    <aside
      className={cn(
        "flex h-screen flex-col bg-sidebar text-sidebar-foreground transition-[width] duration-200 border-r border-sidebar-border",
        sidebarCollapsed ? "w-16" : "w-64",
      )}
    >
      <div className="flex items-center gap-2 px-4 py-4 border-b border-sidebar-border">
        <div className="flex h-9 w-9 items-center justify-center rounded bg-sidebar-primary text-sidebar-primary-foreground shrink-0">
          <Shield className="h-5 w-5" />
        </div>
        {!sidebarCollapsed && (
          <div className="min-w-0">
            <div className="text-[11px] uppercase tracking-widest text-sidebar-foreground/60">
              Karnataka SCRB
            </div>
            <div className="text-sm font-semibold truncate">Crime Intelligence</div>
          </div>
        )}
      </div>

      <nav className="flex-1 overflow-y-auto py-3 scrollbar-thin">
        <ul className="space-y-0.5 px-2">
          {items.map((item) => {
            const active =
              item.to === "/"
                ? pathname === "/"
                : pathname === item.to || pathname.startsWith(item.to + "/");
            const Icon = item.icon;
            return (
              <li key={item.to}>
                <Link
                  to={item.to}
                  className={cn(
                    "group flex items-center gap-3 rounded px-3 py-2 text-sm transition-colors",
                    active
                      ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                      : "text-sidebar-foreground/80 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground",
                  )}
                  title={sidebarCollapsed ? item.label : undefined}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  {!sidebarCollapsed && <span className="truncate">{item.label}</span>}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <button
        onClick={toggleSidebar}
        className="flex items-center justify-center gap-2 border-t border-sidebar-border py-2 text-xs text-sidebar-foreground/70 hover:text-sidebar-foreground"
      >
        <ChevronLeft className={cn("h-4 w-4 transition-transform", sidebarCollapsed && "rotate-180")} />
        {!sidebarCollapsed && <span>Collapse</span>}
      </button>
    </aside>
  );
}
