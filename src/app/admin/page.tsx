"use client";

import { useState } from "react";

export default function AdminDashboard() {
  // Mock data for unverified Gladiators
  const [pendingGladiators, setPendingGladiators] = useState([
    { id: 1, email: "vikram.s@hdfcbank.com", domain: "hdfcbank.com", role: "VP Audit", status: "Pending" },
    { id: 2, email: "n.desai@kpmg.com", domain: "kpmg.com", role: "Director FS", status: "Pending" }
  ]);

  const verifyGladiator = (id: number) => {
    setPendingGladiators(prev => prev.filter(g => g.id !== id));
    alert("Gladiator Verified and Activated!");
  };

  return (
    <main className="min-h-screen bg-gray-50 p-10 font-sans text-gray-900">
      <div className="max-w-6xl mx-auto">
        
        <header className="mb-10 flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Founder Control Center</h1>
            <p className="text-gray-500 mt-1">Phase 1 Seeding & Verification</p>
          </div>
          <div className="text-sm bg-white border border-gray-200 px-4 py-2 rounded-md font-medium text-gray-600 shadow-sm">
            Total Saved on Recruiter Fees: <span className="text-green-600 font-bold font-mono">₹ 0.00</span>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Funnel Metrics */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm">
              <h2 className="text-lg font-bold mb-6 border-b pb-4">Activation Funnel (Phase 1 Targets)</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                  <div className="text-gray-500 text-sm font-medium">Invited Loungers</div>
                  <div className="text-3xl font-bold mt-1">24</div>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                  <div className="text-blue-800 text-sm font-medium">Onboarded (Target: 10)</div>
                  <div className="text-3xl font-bold text-blue-900 mt-1">8</div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                  <div className="text-gray-500 text-sm font-medium">Live Pulses</div>
                  <div className="text-3xl font-bold mt-1">8</div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                  <div className="text-gray-500 text-sm font-medium">Signals Sent (Target: 1)</div>
                  <div className="text-3xl font-bold mt-1">0</div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                  <div className="text-gray-500 text-sm font-medium">Raise Hands</div>
                  <div className="text-3xl font-bold mt-1">0</div>
                </div>
                <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                  <div className="text-green-800 text-sm font-medium">Introductions Made</div>
                  <div className="text-3xl font-bold text-green-900 mt-1">0</div>
                </div>
              </div>
            </div>

            {/* Gladiator Verification Queue */}
            <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm">
              <div className="flex justify-between items-center mb-6 border-b pb-4">
                <h2 className="text-lg font-bold">Gladiator Verification Queue</h2>
                <span className="bg-red-100 text-red-800 text-xs font-bold px-3 py-1 rounded-full">{pendingGladiators.length} Pending</span>
              </div>
              
              {pendingGladiators.length === 0 ? (
                <p className="text-gray-500 italic">No pending Gladiators to verify.</p>
              ) : (
                <div className="space-y-4">
                  {pendingGladiators.map(g => (
                    <div key={g.id} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <div>
                        <div className="font-bold text-gray-900">{g.email}</div>
                        <div className="text-sm text-gray-500 mt-1">Domain: {g.domain} <span className="mx-2">•</span> Role: {g.role}</div>
                      </div>
                      <button 
                        onClick={() => verifyGladiator(g.id)}
                        className="bg-gray-900 text-white px-6 py-2 rounded-md text-sm font-bold hover:bg-gray-800 transition-colors"
                      >
                        Verify & Activate
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Alerts Panel */}
          <div className="space-y-8">
            <div className="bg-white p-6 rounded-xl border border-red-200 shadow-sm">
              <h2 className="text-lg font-bold mb-4 text-red-900 flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                System Alerts
              </h2>
              <ul className="space-y-4 text-sm">
                <li className="p-3 bg-red-50 text-red-800 rounded border border-red-100">
                  <strong>Lounger #104:</strong> No live pulse after 21 days.
                </li>
                <li className="p-3 bg-yellow-50 text-yellow-800 rounded border border-yellow-100">
                  <strong>Gladiator HDFC:</strong> No matches found after 48 hours. Check flash brief constraints.
                </li>
              </ul>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}