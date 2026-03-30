import { cn } from "@/lib/utils";

function tier(confidence: number): "high" | "mid" | "low" {
  if (confidence >= 90) return "high";
  if (confidence >= 70) return "mid";
  return "low";
}

export function ConfidenceCell({ confidence }: { confidence: number }) {
  const t = tier(confidence);
  const label = t === "high" ? "Y" : t === "mid" ? "Y" : "N";
  return (
    <div className="flex items-center gap-2">
      <span className="tabular-nums text-sm font-medium">{confidence}%</span>
      <span
        className={cn(
          "flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold",
          t === "high" && "bg-emerald-100 text-emerald-800",
          t === "mid" && "bg-amber-100 text-amber-900",
          t === "low" && "bg-red-100 text-red-800"
        )}
        title={
          t === "high"
            ? "High confidence (≥90%)"
            : t === "mid"
              ? "Medium confidence (70–89%)"
              : "Low confidence (<70%)"
        }
      >
        {label}
      </span>
    </div>
  );
}
