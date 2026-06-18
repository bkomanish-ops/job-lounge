"use client";
import { useState } from "react";

// The complete data source from your Industry_Skills_Matrix
const industryData: Record<string, { domains: string[], certs: string[] }> = {
  'Banking': { 
    domains: ['IT Audit Head', 'Retail Banking', 'Credit Analysis', 'Risk Management', 'AML/KYC', 'Treasury', 'Financial Analysis'],
    certs: ['CISA', 'CFA', 'FRM', 'CAIIB', 'CPA'] 
  },
  'NBFC': { 
    domains: ['Lending Operations', 'Collections', 'Credit Underwriting', 'RBI Compliance', 'Risk Assessment', 'Loan Management'],
    certs: ['CFA', 'FRM', 'CPA', 'CS'] 
  },
  'Insurance': {
    domains: ['Underwriting', 'Claims Management', 'Actuarial Analysis', 'Risk Modeling', 'Compliance'],
    certs: ['LOMA', 'CPCU', 'Actuarial (FSA/FCAS)', 'ARM']
  },
  'Technology': {
    domains: ['Software Development', 'Cloud', 'DevOps', 'Cybersecurity', 'Data Privacy', 'Project Delivery'],
    certs: ['AWS Solutions Architect', 'ITIL', 'PMP', 'Scrum Master', 'TOGAF']
  },
  'Manufacturing': {
    domains: ['Production Planning', 'Lean', 'Six Sigma', 'Quality', 'Operations Management', 'Process Optimization'],
    certs: ['Six Sigma Black Belt', 'PMP', 'APICS CPIM']
  },
  'Healthcare': {
    domains: ['Clinical Operations', 'Healthcare IT', 'Compliance', 'Regulatory Knowledge', 'Patient Care Processes'],
    certs: ['FACHE', 'RHIA', 'CPHIMS', 'HIPAA Certified']
  },
  'Real Estate': {
    domains: ['Property Management', 'Sales', 'Legal', 'Negotiation', 'Asset Valuation'],
    certs: ['LEED AP', 'CPM', 'CCIM', 'RICS']
  },
  'Consulting': {
    domains: ['Problem Solving', 'Strategy', 'Analysis', 'Stakeholder Management', 'Advisory'],
    certs: ['PMP', 'CMC', 'CFA', 'CPA']
  },
  'Data & AI': {
    domains: ['Machine Learning', 'Data Engineering', 'Analytics', 'Model Development', 'Data Science'],
    certs: ['AWS Machine Learning', 'Google Cloud Data Engineer', 'CAP']
  },
  'FinTech': {
    domains: ['Payments', 'APIs', 'Digital Lending', 'Innovation', 'Financial Technology'],
    certs: ['CFA', 'FRM', 'CISA', 'CISSP']
  }
};

const cities = ['Mumbai', 'Pune', 'Bangalore', 'Delhi / NCR', 'Chennai', 'Hyderabad'];
const modes = ['Remote', 'In-Office', 'Hybrid', 'Client-Site'];

export default function GladiatorPostRequirement() {
  const [step, setStep] = useState(1);
  
  // Form State
  const [sector, setSector] = useState("");
  const [role, setRole] = useState("");
  const [customRole, setCustomRole] = useState("");
  const [certs, setCerts] = useState<string[]>([]);
  const [city, setCity] = useState("");
  const [customCity, setCustomCity] = useState("");
  const [mode, setMode] = useState("");
  const [flashBrief, setFlashBrief] = useState("");

  // Validation
  const isStep1Valid = sector && (role || customRole) && (certs.length > 0) && (city || customCity) && mode;

  return (
    <main className="min-h-screen bg-gray-50 p-10 font-sans">
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-xl border border-gray-200 shadow-sm">
        <h1 className="text-2xl font-bold mb-8 text-blue-900">Post a Requirement</h1>
        
        {step === 1 && (
          <div className="space-y-6">
            {/* Sector */}
            <div>
              <label className="block text-sm font-bold mb-2">Industry / Sector</label>
              <select onChange={(e) => { setSector(e.target.value); setRole(""); }} className="w-full p-3 border rounded-md">
                <option value="">Select Sector</option>
                {Object.keys(industryData).map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            {/* Role */}
            {sector && (
              <div>
                <label className="block text-sm font-bold mb-2">Target Role / Domain</label>
                <select onChange={(e) => setRole(e.target.value)} className="w-full p-3 border rounded-md">
                  <option value="">Select Role</option>
                  {industryData[sector].domains.map(r => <option key={r} value={r}>{r}</option>)}
                  <option value="Other">Other</option>
                </select>
                {role === 'Other' && <input type="text" onChange={(e) => setCustomRole(e.target.value)} placeholder="Type role..." className="w-full mt-2 p-3 border rounded-md" />}
              </div>
            )}

            {/* Certifications */}
            {sector && (
              <div>
                <label className="block text-sm font-bold mb-2">Certifications</label>
                <div className="flex flex-wrap gap-2">
                  {industryData[sector].certs.map(c => (
                    <button key={c} onClick={() => setCerts(prev => prev.includes(c) ? prev.filter(x => x !== c) : [...prev, c])} className={`px-3 py-1 text-sm border rounded-full ${certs.includes(c) ? 'bg-blue-900 text-white' : ''}`}>{c}</button>
                  ))}
                </div>
              </div>
            )}

            {/* Location & Mode */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold mb-2">City</label>
                <select onChange={(e) => setCity(e.target.value)} className="w-full p-3 border rounded-md">
                   <option value="">Select City</option>
                   {cities.map(c => <option key={c} value={c}>{c}</option>)}
                   <option value="Other">Other</option>
                </select>
                {city === 'Other' && <input type="text" onChange={(e) => setCustomCity(e.target.value)} placeholder="Enter City" className="w-full mt-2 p-3 border rounded-md" />}
              </div>
              <div>
                <label className="block text-sm font-bold mb-2">Mode</label>
                <select onChange={(e) => setMode(e.target.value)} className="w-full p-3 border rounded-md">
                   <option value="">Select Mode</option>
                   {modes.map(m => <option key={m} value={m}>{m}</option>)}
                </select>
              </div>
            </div>

            <button onClick={() => setStep(2)} disabled={!isStep1Valid} className="w-full bg-blue-900 text-white py-3 rounded-md font-bold disabled:bg-gray-300">Next</button>
          </div>
        )}

        {/* Step 2 (Flash Brief) */}
        {step === 2 && (
          <div>
            <label className="block text-sm font-bold mb-2">Flash Brief (Max 220 chars)</label>
            <textarea maxLength={220} onChange={(e) => setFlashBrief(e.target.value)} className="w-full h-32 p-3 border rounded-md"></textarea>
            <div className="text-right text-xs text-gray-500 mt-1">{flashBrief.length}/220</div>
            <button onClick={() => setStep(3)} disabled={flashBrief.length < 10} className="mt-6 w-full bg-blue-900 text-white py-3 rounded-md font-bold">Preview</button>
          </div>
        )}

        {/* Step 3 (Confirmation) */}
        {step === 3 && (
            <div className="text-center py-10">
                <p className="text-green-600 font-bold mb-6">Requirement Previewed Successfully!</p>
                <button onClick={() => window.location.href='/dashboard'} className="w-full bg-red-900 text-white py-3 rounded-md font-bold">Publish to Bench</button>
            </div>
        )}
      </div>
    </main>
  );
}