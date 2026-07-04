import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { Sidebar } from "@/components/app/sidebar";
import { Topbar } from "@/components/app/topbar";
import { useAuthStore } from "@/stores/auth";

export const Route = createFileRoute("/_app")({
  ssr: false,
  beforeLoad: () => {
    if (typeof window === "undefined") return;
    const user = useAuthStore.getState().user;
    if (!user) throw redirect({ to: "/login" });
  },
  component: AppShell,
});

function AppShell() {
  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      <Sidebar />
      <div className="flex flex-1 flex-col min-w-0">
        <Topbar />
        <main className="flex-1 overflow-y-auto scrollbar-thin">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
