"use client";

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  hint?: string;
  options: { value: string; label: string }[];
}

export function Select({ label, hint, options, className = "", ...props }: SelectProps) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium text-gray-700">{label}</label>
      {hint && <span className="text-xs text-gray-400">{hint}</span>}
      <select
        className={`w-full rounded-lg border border-gray-200 px-3 py-2 text-sm bg-white
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${className}`}
        {...props}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    </div>
  );
}
