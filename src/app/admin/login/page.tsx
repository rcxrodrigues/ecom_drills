"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Label, Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { loginAdmin } from "@/app/actions/admin-auth";

export default function AdminLoginPage() {
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const form = new FormData(e.currentTarget);
    startTransition(async () => {
      const result = await loginAdmin({
        email: String(form.get("email") ?? ""),
        password: String(form.get("password") ?? ""),
      });
      if (!result.ok) {
        setError(result.error);
        return;
      }
      router.push("/admin");
      router.refresh();
    });
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-50 px-4">
      <div className="w-full max-w-sm rounded-button border border-border-subtle bg-white p-8">
        <h1 className="mb-1 text-xl font-semibold text-foreground-strong">Toolvo Drills Admin</h1>
        <p className="mb-6 text-sm text-foreground">Sign in to manage your store.</p>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <Label htmlFor="email">Email address</Label>
            <Input id="email" name="email" type="email" required />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input id="password" name="password" type="password" required />
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <Button type="submit" disabled={pending} className="mt-2 w-full">
            {pending ? "Signing in…" : "Sign in"}
          </Button>
        </form>
        <p className="mt-5 text-xs text-foreground/60">Demo admin: admin@toolvodrills.co.uk / ToolvoAdmin123!</p>
      </div>
    </div>
  );
}
