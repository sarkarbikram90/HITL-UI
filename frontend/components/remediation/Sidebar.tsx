"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import type { SidebarTab } from "@/types/incident-remediation";
import {
  CheckCircle2,
  ClipboardList,
  FileText,
  Inbox,
  ListTodo,
  ShieldAlert,
  ShieldCheck,
} from "lucide-react";

const NAV: { tab: SidebarTab; label: string; icon: typeof Inbox }[] = [
  { tab: "incoming", label: "Incoming", icon: Inbox },
  { tab: "approved", label: "Approved", icon: ShieldCheck },
  { tab: "rejected", label: "Rejected", icon: ShieldAlert },
  { tab: "modified", label: "Modified", icon: CheckCircle2 },
  { tab: "pending-task", label: "Pending Task", icon: ListTodo },
  { tab: "completed", label: "Completed", icon: ClipboardList },
  { tab: "audit-logs", label: "Audit Logs", icon: FileText },
];

export function Sidebar({
  counts,
}: {
  counts: Record<string, number> | undefined;
}) {
  const searchParams = useSearchParams();
  const current = (searchParams.get("tab") ?? "incoming") as SidebarTab;

  const labelFor = (tab: SidebarTab, base: string) => {
    const n = counts?.[tab];
    if (n === undefined) return base;
    return `${base} (${n})`;
  };

  const hrefFor = (tab: SidebarTab) => {
    const sp = new URLSearchParams(searchParams.toString());
    sp.set("tab", tab);
    sp.set("page", "1");
    return `/?${sp.toString()}`;
  };

  return (
    <aside className="flex w-56 shrink-0 flex-col border-r border-gray-200 bg-white">
      <div className="px-4 py-6">
        <p className="px-2 text-xs font-semibold uppercase tracking-wider text-gray-500">
          Navigation
        </p>
        <nav className="mt-4 flex flex-col gap-1" aria-label="Main">
          {NAV.map(({ tab, label, icon: Icon }) => {
            const active = current === tab;
            return (
              <Link
                key={tab}
                href={hrefFor(tab)}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  active
                    ? "bg-gray-100 text-gray-900 font-semibold"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                )}
                aria-current={active ? "page" : undefined}
              >
                <Icon className="h-4 w-4 shrink-0 flex-none" />
                <span className="truncate">{labelFor(tab, label)}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
