"use client";

import { useState } from "react";

export default function LoungerDashboard() {
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const circlingGladiators = [
    { id: 1, name: "Private Bank · Risk", role: "Head of Internal Audit", time: "2h ago", avatar: "PB", color: "#E6F1FB", textColor: "#0C447C" },
    { id: 2, name: "Big 4 · FS Advisory", role: "IT Risk Manager, D2", time: "1d ago", avatar: "B4", color: "#E1F5EE", textColor: "#085041" },
    { id: 3, name: "Insurance NBFC · Compliance", role: "VP Audit & Controls", time: "3d ago", avatar: "IN", color: "#FAEEDA", textColor: "#633806" },
  ];

  const matches = [
    { id: 1, pct: 91, title: "IT Audit Head · Private Bank", detail: "CISA req. Mumbai · 38–50L", color: "#185FA5" },
    { id: 2, pct: 84, title: "IT Risk Manager · Big 4", detail: "CISM / CISA Hybrid · 32–44L", color: "#639922" },
    { id: 3, pct: 78, title: "VP Audit & Controls · NBFC", detail: "CIA pref. Pune · 30–42L", color: "#7F77DD" },
  ];

  return (
    <main className="min-h-screen bg-white font-sans text-slate-900 px-6 py-5 max-w-4xl mx-auto">
      {/* Top Bar */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex flex-col gap-0.5">
          <span className="text-[13px] text-slate-500">Good morning</span>
          <span className="text-[18px] font-medium text-slate-900">CISA Audit Manager · Mumbai</span>
        </div>
        <div className="flex items-center gap-2 text-[12px] text-[#0C447C] bg-[#E6F1FB] border border-[#B5D4F4] rounded-full px-3 py-1.5">
          <div className="w-2 h-2 bg-[#0C447C] rounded-full"></div>
          Fully anonymous
        </div>
      </div>

      {/* Notification Banner */}
      <div className="flex items-center gap-3 bg-[#E1F5EE] border border-[#5DCAA5] rounded-lg p-3 mb-5 text-[13px] text-[#085041]">
        <div className="w-2 h-2 bg-[#0F6E56] rounded-full"></div>
        <span className="flex-1"><strong>New signal:</strong> A Corporate Gladiator in Banking viewed your profile 2 hrs ago.</span>
        <button className="text-[#0F6E56] font-medium underline">Details ↗</button>
      </div>

      {/* Market Pulse Card (The Trend Card) */}
      <div className="bg-[#042C53] rounded-2xl p-6 mb-5 flex items-center justify-between text-white">
        <div className="flex flex-col gap-1.5">
          <span className="text-[11px] uppercase tracking-wider text-[#85B7EB]">Your market pulse</span>
          <div className="text-[32px] font-medium flex items-center gap-2">
            High demand <span className="text-[#5DCAA5]">↑</span>
          </div>
          <p className="text-[13px] text-[#B5D4F4] max-w-[300px]">3 active requirements match your profile this week. Gladiator interest is up 40% vs last month.</p>
        </div>
        <div className="flex flex-col items-center gap-1.5">
          <div className="flex items-end gap-1.5 h-[52px]">
            {[22, 18, 30, 26, 34, 40, 52].map((h, i) => (
              <div key={i} className={`w-[10px] rounded-t-sm ${i === 6 ? 'bg-[#5DCAA5]' : 'bg-[#185FA5]'}`} style={{ height: `${h}px` }}></div>
            ))}
          </div>
          <span className="text-[11px] text-[#85B7EB]">7-week trend</span>
        </div>
      </div>

      {/* Metric Grid */}
      <div className="grid grid-cols-4 gap-2.5 mb-5">
        {[
          { l: "Gladiators circling", v: "4" },
          { l: "Profile views", v: "11" },
          { l: "Top match score", v: "91%" },
          { l: "Salary delta", v: "+18%" }
        ].map((m, i) => (
          <div key={i} className="bg-slate-50 rounded-lg p-3.5 border border-slate-100">
            <div className="text-[12px] text-slate-500 mb-1.5">{m.l}</div>
            <div className="text-[22px] font-medium text-slate-900">{m.v}</div>
          </div>
        ))}
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-2 gap-3 mb-5">
        {/* Who's Circling */}
        <div className="border border-slate-200 rounded-lg p-4">
          <div className="text-[13px] font-medium text-slate-500 mb-3 flex items-center gap-2">
             Who's circling (anonymous)
          </div>
          {circlingGladiators.map((g) => (
            <div key={g.id} className="flex items-center gap-3 py-2 border-b border-slate-100 last:border-none">
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-medium" style={{ backgroundColor: g.color, color: g.textColor }}>{g.avatar}</div>
              <div className="flex-1 min-w-0">
                <div className="text-[13px] font-medium text-slate-900 truncate">{g.name}</div>
                <div className="text-[11px] text-slate-500">{g.role}</div>
              </div>
              <div className="text-[11px] text-slate-400">{g.time}</div>
            </div>
          ))}
          <div className="text-center mt-3">
             <button className="text-[12px] text-slate-500 hover:text-slate-900">View all activity ↗</button>
          </div>
        </div>

        {/* Top Matches */}
        <div className="border border-slate-200 rounded-lg p-4">
          <div className="text-[13px] font-medium text-slate-500 mb-3 flex items-center gap-2">
            Your top 5 matches
          </div>
          {matches.map((m) => (
            <div key={m.id} className="flex items-center gap-3 py-2 border-b border-slate-100 cursor-pointer hover:opacity-80" onClick={() => setExpandedId(expandedId === m.id ? null : m.id)}>
              <span className="text-[14px] font-medium w-10" style={{ color: m.color }}>{m.pct}%</span>
              <div className="flex-1 min-w-0">
                <div className="text-[13px] text-slate-900 truncate">{m.title}</div>
                <div className="text-[11px] text-slate-500">{m.detail}</div>
              </div>
              <div className="w-14 h-1 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full" style={{ width: `${m.pct}%`, backgroundColor: m.color }}></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Salary Reflection Card */}
      <div className="border border-slate-200 rounded-lg p-4">
        <div className="text-[13px] font-medium text-slate-500 mb-3">Salary reflection — your skills vs live market</div>
        <div className="space-y-2.5">
          {[
            { l: "Your current", v: "₹28–32L", w: "52%", c: "#B5D4F4" },
            { l: "Market P50", v: "₹34–38L", w: "65%", c: "#5DCAA5" },
            { l: "Top matches", v: "₹38–50L", w: "80%", c: "#378ADD" }
          ].map((b, i) => (
            <div key={i} className="flex items-center gap-3">
              <span className="text-[12px] text-slate-500 w-20">{b.l}</span>
              <div className="flex-1 h-2.5 bg-slate-50 rounded-full relative">
                <div className="h-full rounded-full absolute left-0" style={{ width: b.w, backgroundColor: b.c }}></div>
              </div>
              <span className="text-[12px] font-medium text-slate-900 w-16 text-right">{b.v}</span>
            </div>
          ))}
        </div>
        <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between">
           <span className="text-[12px] text-slate-500">Based on 11 live requirements · BFSI + Big 4 · Mumbai / Pune</span>
           <button className="text-[12px] text-slate-500 hover:text-slate-900">What moves me up? ↗</button>
        </div>
      </div>
    </main>
  );
}