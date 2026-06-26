import { Power, AlertTriangle, RotateCcw, Zap } from "lucide-react";

const iconMap: Record<string, React.ElementType> = {
  Power,
  AlertTriangle,
  RotateCcw,
  Zap,
};

interface DigitalInputProps {
  label: string;
  state: string;
  active: boolean;
  iconName: string;
}

export default function DigitalInputCard({
  label,
  state,
  active,
  iconName,
}: Readonly<DigitalInputProps>) {
  const Icon = iconMap[iconName] || Power;

  return (
    <div
      className={`flex items-center justify-between p-4 rounded-xl border ${
        !active
          ? "bg-emerald-50/50 border-emerald-100 dark:bg-emerald-950/20 dark:border-emerald-900/50"
          : "bg-white border-zinc-100 dark:bg-zinc-900 dark:border-zinc-800"
      }`}
    >
      <div className="flex items-center gap-3">
        <Icon
          className={`w-5 h-5 ${!active ? "text-emerald-600" : "text-zinc-500 dark:text-zinc-400"}`}
        />
        <span className="font-medium text-zinc-900 dark:text-zinc-100">
          {label}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <div
          className={`w-2 h-2 rounded-full ${!active ? "bg-emerald-500" : "bg-zinc-300 dark:bg-zinc-600"}`}
        />
        <span
          className={`text-sm font-semibold tracking-wider ${!active ? "text-emerald-600" : "text-zinc-500 dark:text-zinc-400"}`}
        >
          {state}
        </span>
      </div>
    </div>
  );
}
