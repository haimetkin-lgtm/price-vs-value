"use client";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  hint?: string;
  unit?: string;
  error?: string;
}

export function Input({ label, hint, unit, error, className = "", ...props }: InputProps) {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-1.5">
        <label className="text-sm font-medium text-gray-700">{label}</label>
        {hint && (
          <div className="relative group">
            <span className="w-4 h-4 rounded-full bg-gray-200 text-gray-500 text-xs flex items-center justify-center cursor-help leading-none">?</span>
            <div className="absolute bottom-full right-0 mb-1.5 w-52 bg-gray-800 text-white text-xs rounded-lg px-3 py-2 leading-relaxed
              opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 shadow-lg">
              {hint}
              <div className="absolute top-full right-3 border-4 border-transparent border-t-gray-800"/>
            </div>
          </div>
        )}
      </div>
      <div className="relative flex items-center">
        <input
          className={`w-full rounded-lg border border-gray-200 px-3 py-2 text-sm
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
            ${unit ? "pl-12" : ""} ${error ? "border-red-400" : ""} ${className}`}
          {...props}
        />
        {unit && (
          <span className="absolute left-3 text-sm text-gray-400 pointer-events-none">{unit}</span>
        )}
      </div>
      {error && <span className="text-xs text-red-500">{error}</span>}
    </div>
  );
}
