import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Shield } from "lucide-react";
import { useState, useEffect } from "react";
import { useAuthStore, type Role } from "@/stores/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [{ title: "Sign In — Crime Intelligence Assistant" }],
  }),
  component: LoginPage,
});

const ROLES: Role[] = ["Investigator", "Analyst", "Supervisor", "Policymaker"];

function LoginPage() {
  const login = useAuthStore((s) => s.login);
  const user = useAuthStore((s) => s.user);
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<Role>("Investigator");

  useEffect(() => {
    if (user) navigate({ to: "/" });
  }, [user, navigate]);

  return (
    <div className="min-h-screen w-full flex flex-col bg-gradient-to-b from-primary/95 to-primary text-primary-foreground">
      <div className="flex-1 flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-md">
          <div className="flex flex-col items-center text-center mb-8">
            <div className="h-14 w-14 rounded-md bg-card text-primary flex items-center justify-center border border-border/40 shadow-sm">
              <Shield className="h-7 w-7" />
            </div>
            <div className="mt-4 text-xs uppercase tracking-[0.2em] text-primary-foreground/70">
              Karnataka State Police · SCRB
            </div>
            <h1 className="mt-1 text-2xl font-semibold">Crime Intelligence Assistant</h1>
            <p className="mt-2 text-sm text-primary-foreground/70">
              Authorised personnel only. All actions are audited.
            </p>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              login(username, role);
              navigate({ to: "/" });
            }}
            className="rounded-lg bg-card text-card-foreground border border-border shadow-lg p-6 space-y-4"
          >
            <div className="space-y-1.5">
              <Label htmlFor="u">Username / Badge No.</Label>
              <Input
                id="u"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="e.g. arjun.rao"
                autoComplete="username"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="p">Password</Label>
              <Input
                id="p"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="current-password"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="r">Role</Label>
              <Select value={role} onValueChange={(v) => setRole(v as Role)}>
                <SelectTrigger id="r">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ROLES.map((r) => (
                    <SelectItem key={r} value={r}>
                      {r}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-[11px] text-muted-foreground pt-0.5">
                Role selector shown because backend auth is not yet integrated.
              </p>
            </div>
            <Button type="submit" className="w-full">Sign In</Button>
          </form>
        </div>
      </div>
      <footer className="border-t border-primary-foreground/10 py-3 text-center text-[11px] text-primary-foreground/70">
        Confidential Government System — Unauthorised access is a punishable offence under IT Act, 2000.
      </footer>
    </div>
  );
}
