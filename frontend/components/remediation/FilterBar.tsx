"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function FilterBar({
  severity,
  category,
  resource,
  search,
  severities,
  categories,
  resources,
  onSeverityChange,
  onCategoryChange,
  onResourceChange,
  onSearchChange,
}: {
  severity: string;
  category: string;
  resource: string;
  search: string;
  severities: string[];
  categories: string[];
  resources: string[];
  onSeverityChange: (v: string) => void;
  onCategoryChange: (v: string) => void;
  onResourceChange: (v: string) => void;
  onSearchChange: (v: string) => void;
}) {
  return (
    <div className="flex items-center gap-3 border-b border-gray-200 bg-white px-6 py-4">
      {/* Search Bar */}
      <div className="relative flex-1 max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <Input
          className="pl-9 h-9 text-sm border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          placeholder="Search incident ID or anomaly…"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          aria-label="Search by incident ID or anomaly name"
        />
      </div>

      {/* Filter Dropdowns */}
      <Select value={severity} onValueChange={onSeverityChange}>
        <SelectTrigger className="w-32 h-9 text-sm border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500">
          <SelectValue placeholder="Severity" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All severities</SelectItem>
          {severities.map((s) => (
            <SelectItem key={s} value={s}>
              {s}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={category} onValueChange={onCategoryChange}>
        <SelectTrigger className="w-32 h-9 text-sm border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500">
          <SelectValue placeholder="Category" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All categories</SelectItem>
          {categories.map((c) => (
            <SelectItem key={c} value={c}>
              {c}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={resource} onValueChange={onResourceChange}>
        <SelectTrigger className="w-32 h-9 text-sm border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500">
          <SelectValue placeholder="Resource" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All resources</SelectItem>
          {resources.map((r) => (
            <SelectItem key={r} value={r}>
              {r}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
    </div>
  );
}
