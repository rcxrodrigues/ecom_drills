"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Label, Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { loginCustomer, registerCustomer } from "@/app/actions/customer-auth";

export default function AccountLoginPage() {
  const [mode, setMode] = useState<"signin" | "register">("signin");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const form = new FormData(e.currentTarget);

    startTransition(async () => {
      const result =
        mode === "signin"
          ? await loginCustomer({
              email: String(form.get("email") ?? ""),
              password: String(form.get("password") ?? ""),
            })
          : await registerCustomer({
              firstName: String(form.get("firstName") ?? ""),
              lastName: String(form.get("lastName") ?? ""),
              email: String(form.get("email") ?? ""),
              password: String(form.get("password") ?? ""),
            });

      if (!result.ok) {
        setError(result.error);
        return;
      }
      router.push("/account");
      router.refresh();
    });
  }

  return (
    <div className="page-container flex max-w-md flex-col py-16">
      <div className="mb-6 flex gap-6 border-b border-border-subtle">
        <button
          type="button"
          onClick={() => setMode("signin")}
          className={`pb-3 text-sm font-semibold ${mode === "signin" ? "border-b-2 border-brand-black text-foreground-strong" : "text-foreground/50"}`}
        >
          Sign in
        </button>
        <button
          type="button"
          onClick={() => setMode("register")}
          className={`pb-3 text-sm font-semibold ${mode === "register" ? "border-b-2 border-brand-black text-foreground-strong" : "text-foreground/50"}`}
        >
          Create account
        </button>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {mode === "register" && (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="firstName">First name</Label>
              <Input id="firstName" name="firstName" required />
            </div>
            <div>
              <Label htmlFor="lastName">Last name</Label>
              <Input id="lastName" name="lastName" required />
            </div>
          </div>
        )}
        <div>
          <Label htmlFor="email">Email address</Label>
          <Input id="email" name="email" type="email" required />
        </div>
        <div>
          <Label htmlFor="password">Password</Label>
          <Input id="password" name="password" type="password" required minLength={mode === "register" ? 8 : undefined} />
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <Button type="submit" disabled={pending} className="mt-2 w-full">
          {pending ? "Please wait…" : mode === "signin" ? "Sign in" : "Create account"}
        </Button>
      </form>

      {mode === "signin" && (
        <p className="mt-4 text-xs text-foreground/60">
          Demo account: customer@example.co.uk / Customer123!
        </p>
      )}
    </div>
  );
}
