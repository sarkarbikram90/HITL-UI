"use client";

import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { ChevronDown } from "lucide-react";
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
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-gray-200 bg-white px-6">
      <div>
        <h1 className="text-xl font-semibold text-gray-900">
          HITL Remediation Console
        </h1>
        <p className="text-xs text-gray-500 mt-0.5">AI-powered incident remediation for SRE teams</p>
      </div>
      <div className="flex items-center gap-3">
        <Menu as="div" className="relative">
          <MenuButton className="flex items-center gap-2 rounded-md px-3 py-2 text-left text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
            <span
              className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-xs font-semibold text-white"
              aria-hidden
            >
              {initials}
            </span>
            <span className="hidden sm:inline">{username}</span>
            <ChevronDown className="h-4 w-4 text-gray-400" />
          </MenuButton>
          <MenuItems
            transition
            anchor="bottom end"
            className={cn(
              "z-50 mt-1 w-48 origin-top-right rounded-lg border border-gray-200 bg-white py-1 shadow-lg outline-none",
              "transition data-[closed]:scale-95 data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75"
            )}
          >
            <MenuItem>
              <button
                type="button"
                className="group flex w-full items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
              >
                Profile
              </button>
            </MenuItem>
            <MenuItem>
              <button
                type="button"
                className="group flex w-full items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
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
        </Menu>
      </div>
    </header>
  );
}
