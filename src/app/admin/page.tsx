"use client";
import { useState } from "react";

export default function AdminDashboard() {
  const [gladiators, setGladiators] = useState([
    { id: 1, name: "Top-Tier Bank", email: "hiring@bank.com", verified: false },
    { id: 2, name: "Big 4 Advisory", email: "recruit@big4.com", verified: true },
  ]);

  return (
    <main className="min-h-screen bg-gray-50 p-10 font-sans">
      <h1 className="text-2xl font-bold mb-8 text-blue-900">Founder Control Center</h1>
      
      {/* Funnel Overview */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-4 border rounded shadow-sm">
          <div className="text-sm text-gray-500">Invited</div>
          <div className="text-2xl font-bold">12</div>
        </div>
        <div className="bg-white p-4 border rounded shadow-sm">
          <div className="text-sm text-gray-500">Onboarded</div>
          <div className="text-2xl font-bold">8</div>
        </div>
        <div className="bg-white p-4 border rounded shadow-sm">
          <div className="text-sm text-gray-500">Pulse Live</div>
          <div className="text-2xl font-bold">5</div>
        </div>
        <div className="bg-white p-4 border rounded shadow-sm">
          <div className="text-sm text-gray-500">First Signal</div>
          <div className="text-2xl font-bold text-green-600">1</div>
        </div>
      </div>

      {/* Gladiator Verification Queue */}
      <div className="bg-white border rounded-lg shadow-sm p-6">
        <h2 className="font-bold text-lg mb-4">Gladiator Verification Queue</h2>
        <table className="w-full text-left">
          <thead>
            <tr className="border-b">
              <th className="pb-3">Name</th>
              <th className="pb-3">Email</th>
              <th className="pb-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {gladiators.map(g => (
              <tr key={g.id} className="border-b">
                <td className="py-3">{g.name}</td>
                <td className="py-3">{g.email}</td>
                <td className="py-3">
                  <button 
                    onClick={() => setGladiators(prev => prev.map(item => item.id === g.id ? {...item, verified: !item.verified} : item))}
                    className={`px-3 py-1 text-xs font-bold rounded-full ${g.verified ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}
                  >
                    {g.verified ? "Verified" : "Verify & Activate"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}