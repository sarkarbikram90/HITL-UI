"use client";

import { Search, SlidersHorizontal } from "lucide-react";
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
    <div className="flex items-center gap-3 border-b border-gray-100 bg-white px-6 py-3">
      {/* Search */}
      <div className="relative flex-1 max-w-xs">
        <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-400" />
        <Input
          className="h-9 pl-9 text-sm bg-gray-50/80 border-gray-200/80 rounded-lg placeholder:text-gray-400 focus:bg-white focus:border-blue-400 focus:ring-1 focus:ring-blue-400/20 transition-all duration-150"
          placeholder="Search incidents…"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          aria-label="Search by incident ID or anomaly name"
        />
      </div>

      {/* Divider */}
      <div className="h-5 w-px bg-gray-200" />

      {/* Filter icon label */}
      <div className="flex items-center gap-1.5 text-gray-400">
        <SlidersHorizontal className="h-3.5 w-3.5" />
        <span className="text-[11px] font-medium uppercase tracking-wide">Filters</span>
      </div>

      {/* Filter Dropdowns */}
      <Select value={severity} onValueChange={onSeverityChange}>
        <SelectTrigger className="w-[130px] h-9 text-sm bg-gray-50/80 border-gray-200/80 rounded-lg hover:bg-gray-100/80 transition-colors duration-100">
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
        <SelectTrigger className="w-[130px] h-9 text-sm bg-gray-50/80 border-gray-200/80 rounded-lg hover:bg-gray-100/80 transition-colors duration-100">
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
        <SelectTrigger className="w-[130px] h-9 text-sm bg-gray-50/80 border-gray-200/80 rounded-lg hover:bg-gray-100/80 transition-colors duration-100">
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
