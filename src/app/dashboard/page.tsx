"use client";

import { useState } from "react";

export default function LoungerDashboard() {
  const [expandedId, setExpandedId] = useState<number | null>(null);

  // Mock data representing the anonymous bench pipeline, including the simulation match
  const circlingGladiators = [
    { 
      id: 4, 
      name: "Top-Tier Bank - Audit Dept", 
      tag: "NEW", 
      location: "Mumbai", 
      ctc: "40-55L range", 
      time: "Just now",
      brief: "Looking for an IT Audit leader to manage core system migration. Must be CISA certified."
    },
    { 
      id: 1, 
      name: "Private Bank - Risk & Audit division", 
      tag: "", 
      location: "Mumbai", 
      ctc: "38-50L range", 
      time: "2h ago",
      brief: "Looking for a senior leader to rebuild our risk framework ahead of new RBI mandates. Must have experience managing board-level reporting."
    },
    { 
      id: 2, 
      name: "Big 4 - FS Advisory practice", 
      tag: "", 
      location: "Hybrid", 
      ctc: "32-44L range", 
      time: "1d ago",
      brief: "Expanding our West India IT Audit practice. Need a seasoned Director who can lead client delivery and mentor junior audit managers."
    },
    { 
      id: 3, 
      name: "Insurance NBFC - Compliance & Controls", 
      tag: "", 
      location: "Pune", 
      ctc: "30-42L range", 
      time: "3d ago",
      brief: "Urgent requirement for a VP of Controls. You will build the SOX/IFC framework from scratch post-merger. Fast-paced environment."
    }
  ];

  return (
    <main className="min-h-screen bg-[#fafafa] font-sans text-gray-900 pb-20">
      
      {/* Header Section */}
      <header className="bg-white border-b border-gray-200 px-10 py-4 flex justify-between items-center sticky top-0 z-10 shadow-sm">
        <div className="font-bold text-xl tracking-tight text-blue-900">Job Lounge</div>
        <div className="flex items-center gap-4">
          <div className="text-sm font-medium text-green-700 bg-green-50 px-4 py-1.5 rounded-full border border-green-200 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            Fully anonymous
          </div>
          <div className="w-10 h-10 rounded-full bg-gray-200 border border-gray-300"></div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto p-10">
        
        {/* Market Pulse Banner */}
        <div className="bg-blue-900 text-white rounded-xl p-10 mb-10 shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-800 rounded-full opacity-50 -translate-y-1/2 translate-x-1/4 blur-3xl"></div>
          
          <div className="relative z-10">
            <h2 className="text-xs font-bold tracking-widest uppercase text-blue-300 mb-3">Your Market Pulse</h2>
            <div className="flex items-end justify-between">
              <div>
                <h1 className="text-5xl font-extrabold mb-3 tracking-tight">High demand</h1>
                <p className="text-blue-100 text-lg">
                  <strong className="text-white">11</strong> Corporate Gladiators viewed your profile this week.
                </p>
              </div>
              <div className="text-right bg-blue-800/50 p-4 rounded-lg border border-blue-700/50 backdrop-blur-sm">
                <div className="text-4xl font-bold text-green-400">+18%</div>
                <div className="text-blue-200 text-xs mt-1 uppercase tracking-wider font-semibold">Salary delta vs. current</div>
              </div>
            </div>
          </div>
        </div>

        {/* Who's Circling Section */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
          <div className="px-8 py-6 border-b border-gray-200 flex justify-between items-center bg-gray-50/50">
            <h3 className="text-xl font-semibold text-gray-800">Who's circling</h3>
            <span className="text-sm font-medium text-gray-500">Identities hidden until mutual opt-in</span>
          </div>
          
          <div className="divide-y divide-gray-100">
            {circlingGladiators.map((glad) => (
              <div key={glad.id} className="transition-all duration-200">
                
                {/* Clickable Row */}
                <div 
                  onClick={() => setExpandedId(expandedId === glad.id ? null : glad.id)}
                  className={`px-8 py-6 flex items-center justify-between cursor-pointer hover:bg-blue-50/30 transition-colors ${expandedId === glad.id ? 'bg-blue-50/50' : ''}`}
                >
                  <div className="flex items-center gap-5">
                    <div className="w-12 h-12 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-500 font-bold text-sm shadow-inner">
                      {glad.name.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900 flex items-center gap-3 text-lg">
                        {glad.name}
                        {glad.tag && (
                          <span className="bg-red-100 text-red-700 text-[10px] font-bold px-2 py-0.5 rounded-sm uppercase tracking-widest">
                            {glad.tag}
                          </span>
                        )}
                      </div>
                      <div className="text-sm font-medium text-gray-500 mt-1">
                        {glad.location} <span className="mx-2 text-gray-300">•</span> {glad.ctc}
                      </div>
                    </div>
                  </div>
                  <div className="text-sm font-medium text-gray-400 flex items-center gap-4">
                    {glad.time}
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center bg-gray-100 transition-transform duration-300 ${expandedId === glad.id ? 'rotate-180 bg-blue-100 text-blue-900' : ''}`}>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Inline Expandable Drawer */}
                {expandedId === glad.id && (
                  <div className="px-8 pb-8 pt-2 bg-blue-50/50 border-t border-blue-100/50 animate-in slide-in-from-top-2 duration-300 ease-out">
                    <div className="bg-white border border-blue-100 rounded-lg p-8 shadow-sm">
                      <div className="flex justify-between items-start mb-4">
                        <h4 className="font-bold text-gray-900 tracking-tight">Signal Received: Flash Brief</h4>
                        <span className="text-xs font-semibold text-blue-900 bg-blue-100 px-3 py-1 rounded-full">Match Score: 91%</span>
                      </div>
                      
                      <p className="text-gray-700 text-lg mb-8 max-w-3xl italic border-l-4 border-blue-300 pl-5 py-1 font-serif">
                        "{glad.brief}"
                      </p>
                      
                      <div className="flex gap-4">
                        <button className="bg-blue-900 text-white px-8 py-3 rounded-full text-sm font-bold hover:bg-blue-800 transition-colors shadow-md hover:shadow-lg transform hover:-translate-y-0.5 duration-200">
                          Raise Hand
                        </button>
                        <button className="border-2 border-gray-200 text-gray-600 px-8 py-3 rounded-full text-sm font-bold hover:bg-gray-50 hover:border-gray-300 transition-all">
                          Pass anonymously
                        </button>
                      </div>
                      
                      <div className="mt-6 flex items-start gap-2 text-xs text-gray-500 font-medium bg-gray-50 p-3 rounded-md">
                        <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                        <p>Privacy Contract: Raising your hand does not reveal your identity. It simply signals mutual interest. Your employer, full name, and details remain completely hidden until both parties formally agree to an Introduction.</p>
                      </div>
                    </div>
                  </div>
                )}

              </div>
            ))}
          </div>
        </div>
        
      </div>
    </main>
  );
}