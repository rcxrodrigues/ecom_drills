"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { logoutCustomer } from "@/app/actions/customer-auth";

export function LogoutButton() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  return (
    <Button
      variant="secondary"
      size="sm"
      disabled={pending}
      onClick={() =>
        startTransition(async () => {
          await logoutCustomer();
          router.push("/");
          router.refresh();
        })
      }
    >
      Sign out
    </Button>
  );
}
