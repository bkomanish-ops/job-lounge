"use client";

import { useState } from "react";

export default function LoungerDashboard() {
  const [expandedId, setExpandedId] = useState<number | null>(null);

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
      brief: "Looking for a senior leader to rebuild our risk framework ahead of new RBI mandates."
    }
  ];

  return (
    <main className="min-h-screen bg-gray-50 p-10 font-sans text-gray-900">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      <p className="mb-8">Your market pulse is &quot;High&quot;.</p>
      
      <div className="space-y-4">
        {circlingGladiators.map((glad) => (
          <div key={glad.id} className="bg-white p-6 border rounded-lg shadow-sm">
            <div 
              className="flex justify-between items-center cursor-pointer"
              onClick={() => setExpandedId(expandedId === glad.id ? null : glad.id)}
            >
              <h2 className="font-bold text-lg">{glad.name}</h2>
              <span className="text-sm text-gray-500">{glad.time}</span>
            </div>
            
            {expandedId === glad.id && (
              <div className="mt-4 pt-4 border-t text-gray-700">
                <p>{glad.brief}</p>
                <button className="mt-4 bg-blue-900 text-white px-6 py-2 rounded-md font-bold">
                  Raise Hand
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </main>
  );
}