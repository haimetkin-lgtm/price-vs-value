"use client";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ReferenceLine, ResponsiveContainer, Legend,
} from "recharts";
import { HISTORICAL_DATA } from "@/lib/data/historical";
import { useState } from "react";

const METRICS = [
  { key: "pricePremiumVsFundamental", label: "חריגה מהשווי %", color: "#2563eb" },
  { key: "pir", label: "PIR (מכפיל)", color: "#7c3aed" },
  { key: "rentYield", label: "תשואת שכירות %", color: "#059669" },
  { key: "hhDebtToGDP", label: "חוב משקי בית / תמ״ג %", color: "#d97706" },
];

export function HistoricalChart() {
  const [activeMetric, setActiveMetric] = useState("pricePremiumVsFundamental");
  const metric = METRICS.find(m => m.key === activeMetric)!;

  const data = HISTORICAL_DATA.map(d => ({
    year: d.year,
    value: d[activeMetric as keyof typeof d] as number,
  }));

  const isOverZero = (v: number) => activeMetric === "pricePremiumVsFundamental" && v > 0;

  return (
    <div>
      <div className="flex gap-2 flex-wrap mb-4">
        {METRICS.map(m => (
          <button
            key={m.key}
            onClick={() => setActiveMetric(m.key)}
            className={`px-3 py-1 rounded-full text-xs border transition-colors
              ${activeMetric === m.key
                ? "bg-gray-900 text-white border-gray-900"
                : "border-gray-200 text-gray-500 hover:bg-gray-50"}`}
          >
            {m.label}
          </button>
        ))}
      </div>

      <ResponsiveContainer width="100%" height={220}>
        <AreaChart data={data} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="colorPos" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#ef4444" stopOpacity={0.2} />
              <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorNeg" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#22c55e" stopOpacity={0.2} />
              <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorBlue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={metric.color} stopOpacity={0.15} />
              <stop offset="95%" stopColor={metric.color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="year" tick={{ fontSize: 11 }} tickLine={false} />
          <YAxis tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
          <Tooltip
            contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #e5e7eb" }}
            formatter={(v) => [Number(v).toFixed(1), metric.label]}
            labelFormatter={(l) => `שנת ${l}`}
          />
          {activeMetric === "pricePremiumVsFundamental" && (
            <ReferenceLine y={0} stroke="#9ca3af" strokeDasharray="4 2" />
          )}
          <Area
            type="monotone"
            dataKey="value"
            stroke={metric.color}
            strokeWidth={2}
            fill={activeMetric === "pricePremiumVsFundamental" ? "url(#colorPos)" : "url(#colorBlue)"}
            dot={false}
            activeDot={{ r: 4 }}
          />
        </AreaChart>
      </ResponsiveContainer>

      {activeMetric === "pricePremiumVsFundamental" && (
        <div className="flex gap-4 justify-center mt-2 text-xs text-gray-400">
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 rounded-sm bg-green-100 inline-block"></span>
            2000–2009: מחירים מתחת לשווי
          </span>
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 rounded-sm bg-red-100 inline-block"></span>
            2010–2024: מחירים מעל השווי
          </span>
        </div>
      )}
    </div>
  );
}
