import { Droplets, Activity, Target, Shield } from "lucide-react";

const iconMap: Record<string, React.ElementType> = {
  Droplets,
  Activity,
  Target,
  Shield,
};

interface AnalogSensorProps {
  label: string;
  value: string;
  unit: string;
  badgeText: string;
  badgeType: "success" | "warning" | "danger";
  iconName: string;
}

export default function AnalogSensorCard({
  label,
  value,
  unit,
  badgeText,
  badgeType,
  iconName,
}: Readonly<AnalogSensorProps>) {
  const Icon = iconMap[iconName] || Droplets;

  const badgeStyles = {
    success:
      "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
    warning:
      "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
    danger: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  };

  return (
    <div className="flex flex-col p-5 bg-white border border-zinc-100 rounded-xl dark:bg-zinc-900 dark:border-zinc-800 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-zinc-500 dark:text-zinc-400">
          <Icon className="w-4 h-4" />
          <span className="text-xs font-semibold tracking-widest uppercase">
            {label}
          </span>
        </div>
        <span
          className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${badgeStyles[badgeType]}`}
        >
          {badgeText}
        </span>
      </div>
      <div className="flex items-baseline gap-1 mt-auto">
        <span className="text-4xl font-bold font-mono text-zinc-900 dark:text-zinc-50">
          {value}
        </span>
        {unit && (
          <span className="text-lg font-mono text-zinc-500 dark:text-zinc-400">
            {unit}
          </span>
        )}
      </div>
    </div>
  );
}
