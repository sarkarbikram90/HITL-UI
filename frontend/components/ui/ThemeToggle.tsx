"use client";

import * as React from "react";
import { Menu } from "@headlessui/react";
import { Sun, Moon, Laptop } from "lucide-react";
import { useTheme } from "next-themes";

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const effective = resolvedTheme || theme || "system";

  return (
    <Menu as="div" className="relative inline-block text-left">
      <Menu.Button className="mr-3 flex items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-[var(--color-muted)]">
        {effective === "dark" ? <Moon className="h-4 w-4" /> : effective === "light" ? <Sun className="h-4 w-4" /> : <Laptop className="h-4 w-4" />}
      </Menu.Button>
      <Menu.Items className="absolute right-0 mt-2 w-36 origin-top-right rounded-md border border-[var(--color-border)] bg-[var(--color-card)] py-1 shadow-lg">
        <div className="px-2 py-1">
          <Menu.Item>
            {({ active }) => (
              <button
                onClick={() => setTheme("light")}
                className={`flex w-full items-center gap-2 rounded px-2 py-2 text-sm ${active ? "bg-[var(--color-muted)]" : ""}`}
              >
                <Sun className="h-4 w-4" /> Light
              </button>
            )}
          </Menu.Item>
          <Menu.Item>
            {({ active }) => (
              <button
                onClick={() => setTheme("dark")}
                className={`flex w-full items-center gap-2 rounded px-2 py-2 text-sm ${active ? "bg-[var(--color-muted)]" : ""}`}
              >
                <Moon className="h-4 w-4" /> Dark
              </button>
            )}
          </Menu.Item>
          <Menu.Item>
            {({ active }) => (
              <button
                onClick={() => setTheme("system")}
                className={`flex w-full items-center gap-2 rounded px-2 py-2 text-sm ${active ? "bg-[var(--color-muted)]" : ""}`}
              >
                <Laptop className="h-4 w-4" /> System
              </button>
            )}
          </Menu.Item>
        </div>
      </Menu.Items>
    </Menu>
  );
}
