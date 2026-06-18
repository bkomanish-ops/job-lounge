"use client";

import { useState } from "react";

// Comprehensive map merging "Key Skills Needed" and "Skills Commonly Generated"
const industryDomainMap: Record<string, string[]> = {
  'Banking': ['Retail Banking', 'Credit Analysis', 'Risk Management', 'AML/KYC', 'Treasury', 'Financial Analysis', 'Regulatory Compliance', 'Credit Risk'],
  'NBFC': ['Lending Operations', 'Collections', 'Credit Underwriting', 'RBI Compliance', 'Risk Assessment', 'Loan Management', 'Analytics'],
  'Insurance': ['Underwriting', 'Claims Management', 'Actuarial Analysis', 'Risk Modeling', 'Compliance', 'Customer Service'],
  'IT Services': ['Software Development', 'Cloud', 'DevOps', 'Cybersecurity', 'Programming', 'Automation', 'Project Delivery'],
  'Cybersecurity': ['SOC', 'VAPT', 'IAM', 'SIEM', 'GRC', 'Threat Analysis', 'Security Governance'],
  'Manufacturing': ['Production Planning', 'Lean', 'Six Sigma', 'Quality', 'Process Optimization', 'Operations Management'],
  'Healthcare': ['Clinical Operations', 'Healthcare IT', 'Compliance', 'Patient Care Processes', 'Regulatory Knowledge'],
  'E-commerce': ['Digital Marketing', 'Supply Chain', 'Data Analytics', 'Customer Analytics', 'Growth Management'],
  'Real Estate': ['Property Management', 'Sales', 'Legal', 'Negotiation', 'Asset Valuation'],
  'Consulting': ['Problem Solving', 'Strategy', 'Analysis', 'Stakeholder Management', 'Advisory Skills'],
  'Data & AI': ['Machine Learning', 'Data Engineering', 'Analytics', 'Model Development', 'Data Science'],
  'FinTech': ['Payments', 'APIs', 'Digital Lending', 'Innovation', 'Financial Technology']
};

// Dynamic Certification Map based on Industry Standards
const industryCertMap: Record<string, string[]> = {
  'Banking': ['CFA', 'FRM', 'CAIIB', 'CISA', 'CPA / CA', 'AML/KYC Certified'],
  'NBFC': ['CFA', 'FRM', 'CPA / CA', 'CS', 'CISA'],
  'Insurance': ['LOMA', 'CPCU', 'Actuarial (FSA/FCAS)', 'ARM', 'CISA'],
  'IT Services': ['AWS Solutions Architect', 'ITIL', 'PMP', 'Scrum Master', 'TOGAF', 'CISA'],
  'Cybersecurity': ['CISSP', 'CISM', 'CEH', 'CompTIA Security+', 'CISA', 'CRISC'],
  'Manufacturing': ['Six Sigma Black Belt', 'PMP', 'APICS CPIM', 'Lean Certification', 'ISO 9001 Lead Auditor'],
  'Healthcare': ['FACHE', 'RHIA', 'CPHIMS', 'HIPAA Certified', 'CISA'],
  'E-commerce': ['Google Analytics Certified', 'AWS Certified', 'PMP', 'CSM', 'Supply Chain (CSCP)'],
  'Real Estate': ['LEED AP', 'CPM', 'CCIM', 'RICS'],
  'Consulting': ['PMP', 'CMC', 'CFA', 'CPA / CA', 'Six Sigma'],
  'Data & AI': ['AWS Machine Learning', 'Google Cloud Data Engineer', 'CAP', 'CDP', 'Azure Data Scientist'],
  'FinTech': ['CFA', 'FRM', 'CISA', 'CISSP', 'CBAP']
};

const defaultSectors = Object.keys(industryDomainMap);
const defaultDomains = ['Risk Management', 'Compliance', 'Operations', 'Analysis', 'Strategy'];
const defaultCerts = ['CISA', 'CISM', 'CIA', 'DISA', 'FRM', 'CRISC', 'CISSP', 'CPA / CA'];
const cities = ['Mumbai', 'Pune', 'Bangalore', 'Delhi / NCR', 'Chennai', 'Hyderabad'];

export default function AnonymousOnboarding() {
  const [step, setStep] = useState(1);

  // Step 1 State: Sector & Domain
  const [selectedSector, setSelectedSector] = useState<string | null>(null);
  const [customSector, setCustomSector] = useState("");
  const [selectedDomain, setSelectedDomain] = useState<string | null>(null);
  const [customDomain, setCustomDomain] = useState("");

  // Step 2 State: Certifications
  const [selectedCerts, setSelectedCerts] = useState<string[]>([]);

  // Step 3 State: Experience & Location
  const [experienceYears, setExperienceYears] = useState("");
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [customCity, setCustomCity] = useState("");

  // Step 4 State: Expectations
  const [expectedLPA, setExpectedLPA] = useState("");

  const toggleCert = (cert: string) => {
    setSelectedCerts(prev =>
      prev.includes(cert) ? prev.filter(c => c !== cert) : [...prev, cert]
    );
  };

  const availableDomains = selectedSector && selectedSector !== 'Other' && industryDomainMap[selectedSector]
    ? industryDomainMap[selectedSector]
    : defaultDomains;

  const availableCerts = selectedSector && selectedSector !== 'Other' && industryCertMap[selectedSector]
    ? industryCertMap[selectedSector]
    : defaultCerts;

  // Validation Booleans
  const isStep1Valid = 
    (selectedSector === 'Other' ? customSector.trim() !== "" : selectedSector !== null) &&
    (selectedDomain === 'Other' ? customDomain.trim() !== "" : selectedDomain !== null);
    
  const isStep3Valid = 
    experienceYears.trim() !== "" && 
    !isNaN(Number(experienceYears)) && 
    (selectedCity === 'Other' ? customCity.trim() !== "" : selectedCity !== null);

  const isStep4Valid = 
    expectedLPA.trim() !== "" && !isNaN(Number(expectedLPA));

  const handleSectorChange = (sector: string) => {
    setSelectedSector(sector);
    setSelectedDomain(null);
    setCustomDomain("");
    setSelectedCerts([]); 
  };

  return (
    <main className="min-h-screen bg-[#fafafa] p-10 font-sans text-gray-900">
      <div className="max-w-4xl mx-auto bg-white p-12 border border-gray-200 shadow-sm rounded-md">
        
        {/* Header Section */}
        <div className="mb-10">
          <h1 className="text-2xl font-bold mb-2">
            Anonymous onboarding flow for Job Lounger
          </h1>
          <p className="text-gray-500">
            — no resume required, five steps to market pulse
          </p>
        </div>

        {/* Dynamic Progress Indicator */}
        <div className="flex space-x-12 border-b border-gray-200 pb-4 mb-10 text-sm">
          {[1, 2, 3, 4, 5].map((num) => {
            const labels = ["Your role", "Certifications", "Experience", "Expectations", "Done"];
            return (
              <span key={num} className={`pb-4 -mb-[18px] transition-colors duration-300 ${step >= num ? 'font-bold text-blue-900 border-b-2 border-blue-900' : 'text-gray-400 font-normal'}`}>
                {num} <span className="ml-1">{labels[num-1]}</span>
              </span>
            );
          })}
        </div>

        {/* STEP 1: YOUR ROLE */}
        {step === 1 && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="mb-10">
              <h2 className="text-xl font-semibold mb-2">What do you do?</h2>
              <p className="text-gray-600 mb-2">No name, no resume, no employer. Pick what fits you closest — you can refine later.</p>
              <p className="text-gray-500 text-sm">Nothing here is visible to your employer. We never ask for your name, company, or LinkedIn. Your identity stays yours.</p>
            </div>

            <div className="mb-12">
              <h3 className="text-sm font-medium text-gray-700 mb-4">Sector you work in</h3>
              <div className="flex flex-wrap gap-4 mb-4">
                {defaultSectors.map((sector) => (
                  <button key={sector} onClick={() => handleSectorChange(sector)} className={`px-5 py-2 border rounded-full text-sm font-medium transition-colors ${selectedSector === sector ? "bg-blue-900 text-white border-blue-900" : "border-gray-300 text-gray-700 hover:border-blue-900 hover:text-blue-900"}`}>{sector}</button>
                ))}
                <button onClick={() => handleSectorChange('Other')} className={`px-5 py-2 border rounded-full text-sm font-medium transition-colors ${selectedSector === 'Other' ? "bg-blue-900 text-white border-blue-900" : "border-gray-300 text-gray-700 hover:border-blue-900 hover:text-blue-900"}`}>Other</button>
              </div>
              {selectedSector === 'Other' && (
                <input type="text" placeholder="Type your sector..." value={customSector} onChange={(e) => setCustomSector(e.target.value)} className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent animate-in fade-in duration-300" />
              )}
            </div>

            <div className={`mb-12 transition-opacity duration-300 ${!selectedSector ? 'opacity-40 pointer-events-none' : 'opacity-100'}`}>
              <h3 className="text-sm font-medium text-gray-700 mb-4">Your primary domain</h3>
              <div className="flex flex-wrap gap-4 mb-4">
                {availableDomains.map((domain) => (
                  <button key={domain} onClick={() => setSelectedDomain(domain)} className={`px-5 py-2 border rounded-full text-sm font-medium transition-colors ${selectedDomain === domain ? "bg-blue-900 text-white border-blue-900" : "border-gray-300 text-gray-700 hover:border-blue-900 hover:text-blue-900"}`}>{domain}</button>
                ))}
                <button onClick={() => setSelectedDomain('Other')} className={`px-5 py-2 border rounded-full text-sm font-medium transition-colors ${selectedDomain === 'Other' ? "bg-blue-900 text-white border-blue-900" : "border-gray-300 text-gray-700 hover:border-blue-900 hover:text-blue-900"}`}>Other</button>
              </div>
              {selectedDomain === 'Other' && (
                <input type="text" placeholder="Type your primary domain..." value={customDomain} onChange={(e) => setCustomDomain(e.target.value)} className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent animate-in fade-in duration-300" />
              )}
            </div>

            <div className="flex justify-end mt-8">
              <button onClick={() => setStep(2)} disabled={!isStep1Valid} className={`px-8 py-3 rounded-full font-medium transition-colors ${isStep1Valid ? "bg-blue-900 text-white hover:bg-blue-800" : "bg-gray-300 text-gray-500 cursor-not-allowed"}`}>Next →</button>
            </div>
          </div>
        )}

        {/* STEP 2: CERTIFICATIONS */}
        {step === 2 && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="mb-10">
              <h2 className="text-xl font-semibold mb-2">What certifications do you hold?</h2>
              <p className="text-gray-600 mb-2">This accounts for a significant portion of your market value. Select all that apply.</p>
              {selectedSector && selectedSector !== 'Other' && <p className="text-sm font-medium text-blue-900 mt-2">Showing standards for: {selectedSector}</p>}
            </div>

            <div className="mb-12">
              <h3 className="text-sm font-medium text-gray-700 mb-4">Must-have certifications</h3>
              <div className="flex flex-wrap gap-4 mb-4">
                {availableCerts.map((cert) => (
                  <button key={cert} onClick={() => toggleCert(cert)} className={`px-5 py-2 border rounded-full text-sm font-medium transition-colors ${selectedCerts.includes(cert) ? "bg-blue-900 text-white border-blue-900" : "border-gray-300 text-gray-700 hover:border-blue-900 hover:text-blue-900"}`}>{cert}</button>
                ))}
              </div>
            </div>

            <div className="flex justify-between mt-8">
              <button onClick={() => setStep(1)} className="text-gray-500 font-medium hover:text-gray-800 transition-colors">← Back</button>
              <button onClick={() => setStep(3)} disabled={selectedCerts.length === 0} className={`px-8 py-3 rounded-full font-medium transition-colors ${selectedCerts.length > 0 ? "bg-blue-900 text-white hover:bg-blue-800" : "bg-gray-300 text-gray-500 cursor-not-allowed"}`}>Next →</button>
            </div>
          </div>
        )}

        {/* STEP 3: EXPERIENCE */}
        {step === 3 && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="mb-10">
              <h2 className="text-xl font-semibold mb-2">Where are you based?</h2>
              <p className="text-gray-600 mb-2">Location compatibility and seniority dictate your match accuracy.</p>
            </div>

            <div className="mb-12">
              <h3 className="text-sm font-medium text-gray-700 mb-4">Years of experience</h3>
              <div className="flex items-center gap-3">
                <input type="number" min="0" max="50" placeholder="e.g. 8" value={experienceYears} onChange={(e) => setExperienceYears(e.target.value)} className="w-24 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent text-center" />
                <span className="text-gray-600">years</span>
              </div>
            </div>

            <div className="mb-12">
              <h3 className="text-sm font-medium text-gray-700 mb-4">Current city</h3>
              <div className="flex flex-wrap gap-4 mb-4">
                {cities.map((city) => (
                  <button key={city} onClick={() => setSelectedCity(city)} className={`px-5 py-2 border rounded-full text-sm font-medium transition-colors ${selectedCity === city ? "bg-blue-900 text-white border-blue-900" : "border-gray-300 text-gray-700 hover:border-blue-900 hover:text-blue-900"}`}>{city}</button>
                ))}
                <button onClick={() => setSelectedCity('Other')} className={`px-5 py-2 border rounded-full text-sm font-medium transition-colors ${selectedCity === 'Other' ? "bg-blue-900 text-white border-blue-900" : "border-gray-300 text-gray-700 hover:border-blue-900 hover:text-blue-900"}`}>Other</button>
              </div>
              {selectedCity === 'Other' && (
                <input type="text" placeholder="Type your city..." value={customCity} onChange={(e) => setCustomCity(e.target.value)} className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent animate-in fade-in duration-300" />
              )}
            </div>

            <div className="flex justify-between mt-8">
              <button onClick={() => setStep(2)} className="text-gray-500 font-medium hover:text-gray-800 transition-colors">← Back</button>
              <button onClick={() => setStep(4)} disabled={!isStep3Valid} className={`px-8 py-3 rounded-full font-medium transition-colors ${isStep3Valid ? "bg-blue-900 text-white hover:bg-blue-800" : "bg-gray-300 text-gray-500 cursor-not-allowed"}`}>Next →</button>
            </div>
          </div>
        )}

        {/* STEP 4: EXPECTATIONS */}
        {step === 4 && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="mb-10">
              <h2 className="text-xl font-semibold mb-2">What is your minimum expectation?</h2>
              <p className="text-gray-600 mb-2">If a Gladiator's maximum budget is lower than this number, we automatically cap the match to protect your time.</p>
            </div>

            <div className="mb-12">
              <h3 className="text-sm font-medium text-gray-700 mb-4">Minimum expected CTC (₹ Lakhs)</h3>
              <div className="flex items-center gap-3">
                <span className="text-gray-600 font-medium">₹</span>
                <input type="number" min="0" placeholder="e.g. 24" value={expectedLPA} onChange={(e) => setExpectedLPA(e.target.value)} className="w-32 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent text-center text-lg" />
                <span className="text-gray-600">LPA</span>
              </div>
              <p className="text-xs text-gray-500 italic mt-4 max-w-lg">
                Privacy Note: This value is stored securely as an integer in paise in our database to ensure perfect match accuracy without float rounding errors.
              </p>
            </div>

            <div className="flex justify-between mt-8">
              <button onClick={() => setStep(3)} className="text-gray-500 font-medium hover:text-gray-800 transition-colors">← Back</button>
              <button onClick={() => setStep(5)} disabled={!isStep4Valid} className={`px-8 py-3 rounded-full font-medium transition-colors ${isStep4Valid ? "bg-blue-900 text-white hover:bg-blue-800" : "bg-gray-300 text-gray-500 cursor-not-allowed"}`}>Complete Profile</button>
            </div>
          </div>
        )}

        {/* STEP 5: DONE */}
        {step === 5 && (
          <div className="animate-in fade-in zoom-in-95 duration-700 text-center py-10">
            <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold mb-4 text-gray-900">Your anonymous profile is live.</h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto text-lg">
              You will receive your first <strong>Market Pulse (High, Medium, or Low)</strong> within 14 days. 
            </p>
            <div className="bg-blue-50 text-blue-900 p-6 rounded-lg max-w-lg mx-auto mb-8 border border-blue-100 text-left">
              <h3 className="font-semibold mb-2">What happens next?</h3>
              <ul className="list-disc pl-5 space-y-2 text-sm">
                <li>We will match your profile against live Gladiator requirements tonight.</li>
                <li>When a Gladiator sends a signal, you remain 100% anonymous.</li>
                <li>Your real name and company are only shared if you explicitly "Raise Hand" and approve an Introduction.</li>
              </ul>
            </div>
            <button onClick={() => window.location.reload()} className="text-blue-900 font-medium hover:underline">
              Start over (for testing)
            </button>
          </div>
        )}

      </div>
    </main>
  );
}