import { Link, useRouterState } from "@tanstack/react-router";
import {
  MessageSquare,
  LayoutDashboard,
  Network,
  Wallet,
  Map,
  PieChart,
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
import { useT, type DictKey } from "@/lib/i18n";
import { cn } from "@/lib/utils";

interface NavItem {
  to: string;
  labelKey: DictKey;
  icon: React.ComponentType<{ className?: string }>;
  roles?: Role[];
}

const NAV: NavItem[] = [
  { to: "/", labelKey: "chat", icon: MessageSquare },
  { to: "/dashboard", labelKey: "dashboard", icon: LayoutDashboard },
  { to: "/network", labelKey: "network", icon: Network, roles: ["Investigator", "Analyst", "Supervisor"] },
  { to: "/financial", labelKey: "financial", icon: Wallet, roles: ["Investigator", "Analyst", "Supervisor"] },
  { to: "/map", labelKey: "map", icon: Map },
  { to: "/sociological", labelKey: "sociological", icon: PieChart },
  { to: "/cases", labelKey: "cases", icon: FileSearch, roles: ["Investigator", "Analyst", "Supervisor"] },
  { to: "/offenders", labelKey: "offenders", icon: Users, roles: ["Investigator", "Analyst", "Supervisor"] },
  { to: "/alerts", labelKey: "alerts", icon: AlertTriangle },
  { to: "/audit", labelKey: "audit", icon: ClipboardList, roles: ["Supervisor"] },
  { to: "/settings", labelKey: "settings", icon: SettingsIcon },
];

export function Sidebar() {
  const role = useAuthStore((s) => s.user?.role);
  const { sidebarCollapsed, toggleSidebar } = usePrefs();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const t = useT();

  const items = NAV.filter((n) => !n.roles || (role && n.roles.includes(role)));

  return (
    <aside
      className={cn(
        "flex h-screen flex-col bg-background/80 backdrop-blur-xl text-sidebar-foreground transition-[width] duration-200 border-r border-white/10 relative z-20",
        sidebarCollapsed ? "w-16" : "w-64",
      )}
    >
      <div className="flex items-center gap-2 px-4 py-4 border-b border-white/10">
        <div className="flex h-9 w-9 items-center justify-center rounded bg-sidebar-primary text-sidebar-primary-foreground shrink-0">
          <Shield className="h-5 w-5" />
        </div>
        {!sidebarCollapsed && (
          <div className="min-w-0">
            <div className="text-[11px] uppercase tracking-widest text-sidebar-foreground/60">
              {t("brandLine1")}
            </div>
            <div className="text-sm font-semibold truncate">{t("brandLine2")}</div>
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
            const label = t(item.labelKey);
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
                  title={sidebarCollapsed ? label : undefined}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  {!sidebarCollapsed && <span className="truncate">{label}</span>}
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
        {!sidebarCollapsed && <span>{t("collapse")}</span>}
      </button>
    </aside>
  );
}
