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
  Zap,
  XCircle,
} from "lucide-react";

const NAV: { tab: SidebarTab; label: string; icon: typeof Inbox }[] = [
  { tab: "incoming", label: "Incoming", icon: Inbox },
  { tab: "approved", label: "Approved", icon: ShieldCheck },
  { tab: "rejected", label: "Rejected", icon: ShieldAlert },
  { tab: "modified", label: "Modified", icon: CheckCircle2 },
  { tab: "pending-task", label: "Pending", icon: ListTodo },
  { tab: "executing", label: "Executing", icon: Zap },
  { tab: "completed", label: "Completed", icon: ClipboardList },
  { tab: "failed", label: "Failed", icon: XCircle },
  { tab: "audit-logs", label: "Audit Logs", icon: FileText },
];

export function Sidebar({
  counts,
}: {
  counts: Record<string, number> | undefined;
}) {
  const searchParams = useSearchParams();
  const current = (searchParams.get("tab") ?? "incoming") as SidebarTab;

  const hrefFor = (tab: SidebarTab) => {
    const sp = new URLSearchParams(searchParams.toString());
    sp.set("tab", tab);
    sp.set("page", "1");
    return `/?${sp.toString()}`;
  };

  return (
    <aside className="flex w-52 shrink-0 flex-col border-r border-gray-100 bg-gray-50/50">
      <div className="px-3 py-5">
        <p className="px-3 text-[10px] font-semibold uppercase tracking-widest text-gray-400">
          Workflows
        </p>
        <nav className="mt-3 flex flex-col gap-0.5" aria-label="Main">
          {NAV.map(({ tab, label, icon: Icon }) => {
            const active = current === tab;
            const count = counts?.[tab];
            return (
              <Link
                key={tab}
                href={hrefFor(tab)}
                className={cn(
                  "group flex items-center gap-2.5 rounded-lg px-3 py-2 text-[13px] transition-colors duration-100",
                  active
                    ? "bg-white text-gray-900 font-medium shadow-sm shadow-gray-200/50"
                    : "text-gray-500 hover:bg-white/60 hover:text-gray-700"
                )}
                aria-current={active ? "page" : undefined}
              >
                <Icon
                  className={cn(
                    "h-4 w-4 shrink-0",
                    active ? "text-blue-600" : "text-gray-400 group-hover:text-gray-500"
                  )}
                />
                <span className="flex-1 truncate">{label}</span>
                {count !== undefined && count > 0 && (
                  <span
                    className={cn(
                      "min-w-[20px] rounded-full px-1.5 py-0.5 text-center text-[10px] font-semibold leading-none",
                      active
                        ? "bg-blue-50 text-blue-600"
                        : "bg-gray-100 text-gray-500"
                    )}
                  >
                    {count > 99 ? "99+" : count}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
