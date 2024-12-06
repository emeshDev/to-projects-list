// components/UserNav.tsx
"use client";

import { UserButton } from "@clerk/nextjs";
import { ModeToggle } from "./mode-toggle";

export function UserNav() {
  return (
    <div className="fixed top-4 right-4 flex items-center gap-4 z-50">
      <ModeToggle />
      <UserButton
        appearance={{
          elements: {
            avatarBox: "h-10 w-10",
          },
        }}
      />
    </div>
  );
}
