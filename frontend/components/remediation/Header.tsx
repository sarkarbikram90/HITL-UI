"use client";

import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

export function Header({
  username = "Bikram Sarkar",
}: {
  username?: string;
}) {
  const initials = username
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-[var(--color-border)] bg-[var(--color-card)] px-6">
      <h1 className="text-lg font-semibold tracking-tight text-[var(--color-foreground)]">
        HITL Remediation Console
      </h1>
      <div className="flex items-center gap-2">
        <ThemeToggle />
        <Menu as="div" className="relative">
          <MenuButton className="flex items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm font-medium text-[var(--color-foreground)] outline-none ring-[var(--color-primary)] transition hover:bg-[var(--color-muted)] focus-visible:ring-2">
          <span
            className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--color-primary)] text-xs font-semibold text-[var(--color-primary-foreground)]"
            aria-hidden
          >
            {initials}
          </span>
          <span className="hidden sm:inline">{username}</span>
          <ChevronDown className="h-4 w-4 text-[var(--color-muted-foreground)]" />
        </MenuButton>
        <MenuItems
          transition
          anchor="bottom end"
          className={cn(
            "z-50 mt-1 w-48 origin-top-right rounded-md border border-[var(--color-border)] bg-[var(--color-card)] py-1 shadow-lg outline-none",
            "transition data-[closed]:scale-95 data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75"
          )}
        >
          <MenuItem>
            <button
              type="button"
              className="group flex w-full items-center gap-2 px-3 py-2 text-sm text-[var(--color-foreground)] data-[focus]:bg-[var(--color-muted)]"
            >
              Profile
            </button>
          </MenuItem>
          <MenuItem>
            <button
              type="button"
              className="group flex w-full items-center gap-2 px-3 py-2 text-sm text-[var(--color-foreground)] data-[focus]:bg-[var(--color-muted)]"
            >
              Sign out
            </button>
          </MenuItem>
        </MenuItems>
        </Menu>
      </div>
    </header>
  );
}
