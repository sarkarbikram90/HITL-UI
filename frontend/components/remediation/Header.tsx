"use client";

import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { ChevronDown, Activity } from "lucide-react";
import { cn } from "@/lib/utils";

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
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-gray-200/80 bg-white/80 backdrop-blur-sm px-6">
      <div className="flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 shadow-sm">
          <Activity className="h-4 w-4 text-white" />
        </div>
        <div>
          <h1 className="text-sm font-semibold tracking-tight text-gray-900">
            HITL Console
          </h1>
          <p className="text-[11px] leading-none text-gray-400">
            Incident Remediation
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div className="mr-2 flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-medium text-emerald-700">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
          Live
        </div>

        <Menu as="div" className="relative">
          <MenuButton className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm text-gray-600 hover:bg-gray-50 transition-colors duration-150">
            <span
              className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-[11px] font-semibold text-white shadow-sm"
              aria-hidden
            >
              {initials}
            </span>
            <span className="hidden sm:inline text-sm font-medium text-gray-700">{username}</span>
            <ChevronDown className="h-3.5 w-3.5 text-gray-400" />
          </MenuButton>
          <MenuItems
            transition
            anchor="bottom end"
            className={cn(
              "z-50 mt-1.5 w-44 origin-top-right rounded-xl border border-gray-200/80 bg-white py-1 shadow-lg shadow-gray-200/50 outline-none",
              "transition data-[closed]:scale-95 data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75"
            )}
          >
            <MenuItem>
              <button
                type="button"
                className="flex w-full items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors duration-100"
              >
                Profile
              </button>
            </MenuItem>
            <MenuItem>
              <button
                type="button"
                className="flex w-full items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors duration-100"
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
