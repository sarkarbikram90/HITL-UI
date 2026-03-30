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
import { Label } from "@/components/ui/label";

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
    <div className="flex flex-col gap-4 border-b border-[var(--color-border)] bg-[var(--color-card)] px-6 py-4 lg:flex-row lg:items-end lg:justify-between">
      <div className="grid w-full gap-4 sm:grid-cols-3 lg:max-w-3xl">
        <div className="space-y-1.5">
          <Label htmlFor="filter-severity">Severity</Label>
          <Select value={severity} onValueChange={onSeverityChange}>
            <SelectTrigger id="filter-severity" className="w-full">
              <SelectValue placeholder="All severities" />
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
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="filter-category">Category</Label>
          <Select value={category} onValueChange={onCategoryChange}>
            <SelectTrigger id="filter-category" className="w-full">
              <SelectValue placeholder="All categories" />
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
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="filter-resource">Resource</Label>
          <Select value={resource} onValueChange={onResourceChange}>
            <SelectTrigger id="filter-resource" className="w-full">
              <SelectValue placeholder="All resources" />
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
      </div>
      <div className="relative w-full lg:max-w-sm">
        <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-muted-foreground)]" />
        <Input
          className="pl-9"
          placeholder="Search incident ID or anomaly…"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          aria-label="Search by incident ID or anomaly name"
        />
      </div>
    </div>
  );
}
