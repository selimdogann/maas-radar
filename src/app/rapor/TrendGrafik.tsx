"use client";

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
} from "recharts";

interface Props {
  data: { sektor: string; ortalama: number; adet: number }[];
}

const RENKLER = [
  "#3b82f6", "#8b5cf6", "#10b981", "#f59e0b", "#ef4444",
  "#06b6d4", "#ec4899", "#84cc16",
];

function fmt(n: number) {
  return new Intl.NumberFormat("tr-TR", { notation: "compact", maximumFractionDigits: 0 }).format(n) + " ₺";
}

export default function TrendGrafik({ data }: Props) {
  return (
    <div className="w-full h-72">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 0, right: 0, bottom: 60, left: 10 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
          <XAxis
            dataKey="sektor"
            tick={{ fontSize: 10, fill: "#94a3b8" }}
            angle={-35}
            textAnchor="end"
            interval={0}
          />
          <YAxis
            tickFormatter={fmt}
            tick={{ fontSize: 10, fill: "#94a3b8" }}
            width={65}
          />
          <Tooltip
            formatter={(value) => [
              new Intl.NumberFormat("tr-TR").format(Number(value)) + " ₺",
              "Ortalama maaş",
            ]}
            labelStyle={{ fontWeight: 600, color: "#0f172a" }}
            contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0", fontSize: 12 }}
          />
          <Bar dataKey="ortalama" radius={[6, 6, 0, 0]}>
            {data.map((_, i) => (
              <Cell key={i} fill={RENKLER[i % RENKLER.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
