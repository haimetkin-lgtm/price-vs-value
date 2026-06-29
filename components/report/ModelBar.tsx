"use client";

interface ModelBarProps {
  label: string;
  value: number;
  marketPrice: number;
  vL: number;
  vU: number;
}

function fmt(n: number) {
  if (n >= 1_000_000) return "₪" + (n / 1_000_000).toFixed(2) + "M";
  return "₪" + new Intl.NumberFormat("he-IL").format(Math.round(n));
}

export function ModelBar({ label, value, marketPrice, vL, vU }: ModelBarProps) {
  const min = vL * 0.7;
  const max = marketPrice * 1.15;
  const range = max - min;

  const toX = (v: number) => Math.max(0, Math.min(100, ((v - min) / range) * 100));

  const xValue = toX(value);
  const xMarket = toX(marketPrice);
  const xVL = toX(vL);
  const xVU = toX(vU);

  const deviation = ((marketPrice - value) / value) * 100;
  const isOver = deviation > 5;
  const isUnder = deviation < -5;

  return (
    <div className="flex items-center gap-3 py-2 border-b border-gray-50 last:border-0">
      <div className="w-16 text-xs text-gray-500 text-left flex-shrink-0">{label}</div>

      <div className="flex-1 relative h-6">
        {/* רצועת טווח */}
        <div
          className="absolute top-2 h-2 bg-green-100 rounded-full"
          style={{ left: `${xVL}%`, width: `${xVU - xVL}%` }}
        />
        {/* אומדן המודל */}
        <div
          className="absolute top-1 w-3 h-4 rounded-sm bg-blue-400"
          style={{ left: `${xValue - 1}%` }}
          title={fmt(value)}
        />
        {/* מחיר שוק */}
        <div
          className="absolute top-0 w-0.5 h-6 bg-red-500"
          style={{ left: `${xMarket}%` }}
        />
      </div>

      <div className="w-20 text-xs text-gray-600 text-left flex-shrink-0">{fmt(value)}</div>
      <div className={`w-12 text-xs font-medium text-left flex-shrink-0
        ${isOver ? "text-red-600" : isUnder ? "text-green-600" : "text-amber-600"}`}>
        {deviation >= 0 ? "+" : ""}{deviation.toFixed(0)}%
      </div>
    </div>
  );
}
