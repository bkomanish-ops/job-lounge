"use client";

import { useState } from "react";

const industryData: Record<string, { domains: string[]; certs: string[] }> = {
  Banking: {
    domains: ["IT Audit Head", "Retail Banking", "Credit Analysis", "Risk Management", "AML/KYC", "Treasury", "Financial Analysis"],
    certs: ["CISA", "CFA", "FRM", "CAIIB", "CPA"],
  },
  NBFC: {
    domains: ["Lending Operations", "Collections", "Credit Underwriting", "RBI Compliance", "Risk Assessment", "Loan Management"],
    certs: ["CFA", "FRM", "CPA", "CS"],
  },
  Insurance: {
    domains: ["Underwriting", "Claims Management", "Actuarial Analysis", "Risk Modeling", "Compliance"],
    certs: ["LOMA", "CPCU", "Actuarial (FSA/FCAS)", "ARM"],
  },
  Technology: {
    domains: ["Software Development", "Cloud", "DevOps", "Cybersecurity", "Data Privacy", "Project Delivery"],
    certs: ["AWS Solutions Architect", "ITIL", "PMP", "Scrum Master", "TOGAF"],
  },
  Manufacturing: {
    domains: ["Production Planning", "Lean", "Six Sigma", "Quality", "Operations Management", "Process Optimization"],
    certs: ["Six Sigma Black Belt", "PMP", "APICS CPIM"],
  },
  Healthcare: {
    domains: ["Clinical Operations", "Healthcare IT", "Compliance", "Regulatory Knowledge", "Patient Care Processes"],
    certs: ["FACHE", "RHIA", "CPHIMS", "HIPAA Certified"],
  },
  "Real Estate": {
    domains: ["Property Management", "Sales", "Legal", "Negotiation", "Asset Valuation"],
    certs: ["LEED AP", "CPM", "CCIM", "RICS"],
  },
  Consulting: {
    domains: ["Problem Solving", "Strategy", "Analysis", "Stakeholder Management", "Advisory"],
    certs: ["PMP", "CMC", "CFA", "CPA"],
  },
  "Data & AI": {
    domains: ["Machine Learning", "Data Engineering", "Analytics", "Model Development", "Data Science"],
    certs: ["AWS Machine Learning", "Google Cloud Data Engineer", "CAP"],
  },
  FinTech: {
    domains: ["Payments", "APIs", "Digital Lending", "Innovation", "Financial Technology"],
    certs: ["CFA", "FRM", "CISA", "CISSP"],
  },
};

const CITIES = ["Mumbai", "Pune", "Bangalore", "Delhi / NCR", "Chennai", "Hyderabad", "Other"];
const LEVELS = ["Analyst / Associate", "Senior Associate", "Manager", "Senior Manager", "VP / Director", "C-suite / Head"];
const OPEN_TO = ["Mumbai", "Pune", "Bangalore", "Delhi / NCR", "Hybrid anywhere", "Remote only"];
const OPENNESS = ["Actively looking", "Open if right role", "Just exploring", "Not open — just benchmarking"];
const MATTERS = ["Better pay", "Senior title", "Brand name", "Team leadership", "Work-life balance", "Stability / PSU"];

export default function OnboardingPage() {
  const [step, setStep] = useState(1);

  // Step 1
  const [sector, setSector] = useState("");
  const [domain, setDomain] = useState("");
  const [customDomain, setCustomDomain] = useState("");
  const [city, setCity] = useState("");
  const [customCity, setCustomCity] = useState("");

  // Step 2 — certs auto-populate from sector
  const [certs, setCerts] = useState<string[]>([]);
  const [customCert, setCustomCert] = useState("");

  // Step 3
  const [expYears, setExpYears] = useState(9);
  const [level, setLevel] = useState("");
  const [openTo, setOpenTo] = useState<string[]>([]);

  // Step 4
  const [currentCtc, setCurrentCtc] = useState(28);
  const [minExpectation, setMinExpectation] = useState(36);
  const [openness, setOpenness] = useState("");
  const [matters, setMatters] = useState<string[]>([]);

  const progress = (step / 5) * 100;
  const availableDomains = sector ? industryData[sector]?.domains ?? [] : [];
  const availableCerts = sector ? industryData[sector]?.certs ?? [] : [];

  const step1Valid = sector && (domain || customDomain) && (city || customCity);
  const step2Valid = certs.length > 0 || customCert.trim().length > 0;
  const step3Valid = level && openTo.length > 0;
  const step4Valid = openness && matters.length > 0;

  const toggleMulti = (val: string, arr: string[], setArr: (a: string[]) => void) => {
    setArr(arr.includes(val) ? arr.filter((x) => x !== val) : [...arr, val]);
  };

  const handleSectorChange = (s: string) => {
    setSector(s);
    setDomain("");
    setCustomDomain("");
    setCerts([]);
    setCustomCert("");
  };

  return (
    <main style={{ fontFamily: "'Inter', sans-serif", minHeight: "100vh", background: "#fff", color: "#0F172A" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap');
        @import url('https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@latest/tabler-icons.min.css');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        .chip {
          font-size: 13px; padding: 7px 16px; border-radius: 20px;
          border: 0.5px solid #E2E8F0; cursor: pointer;
          background: transparent; color: #64748B;
          font-family: 'Inter', sans-serif; transition: all 0.15s;
        }
        .chip:hover { background: #F8FAFC; }
        .chip.selected { background: #E6F1FB; color: #0C447C; border-color: #85B7EB; }
        .cert-row {
          display: flex; align-items: center; gap: 10px;
          padding: 10px 12px; border-radius: 8px;
          border: 0.5px solid #E2E8F0; cursor: pointer; margin-bottom: 8px;
          transition: all 0.15s; background: #fff;
        }
        .cert-row:hover { background: #F8FAFC; }
        .cert-row.selected { background: #E6F1FB; border-color: #85B7EB; }
        .cert-box {
          width: 16px; height: 16px; border-radius: 3px;
          border: 0.5px solid #CBD5E1; display: flex;
          align-items: center; justify-content: center;
          flex-shrink: 0; font-size: 10px; color: #fff;
          background: transparent;
        }
        .cert-row.selected .cert-box { background: #185FA5; border-color: #185FA5; }
        input[type=range] {
          -webkit-appearance: none; flex: 1; height: 4px;
          border-radius: 2px; background: #E2E8F0; outline: none; cursor: pointer;
        }
        input[type=range]::-webkit-slider-thumb {
          -webkit-appearance: none; width: 18px; height: 18px;
          border-radius: 50%; background: #042C53; cursor: pointer;
          border: 2px solid #fff; box-shadow: 0 0 0 1px #042C53;
        }
        .text-input {
          width: 100%; font-size: 13px; padding: 9px 14px;
          border-radius: 8px; border: 0.5px solid #E2E8F0;
          font-family: 'Inter', sans-serif; outline: none; color: #0F172A;
          margin-top: 8px;
        }
        .text-input:focus { border-color: #85B7EB; }
        .btn-next {
          font-size: 13px; padding: 9px 24px; border-radius: 20px;
          border: none; cursor: pointer;
          background: #042C53; color: #B5D4F4;
          font-family: 'Inter', sans-serif;
        }
        .btn-next:hover { background: #0C447C; }
        .btn-next:disabled { background: #E2E8F0; color: #94A3B8; cursor: not-allowed; }
        .btn-back {
          font-size: 13px; color: #64748B; cursor: pointer;
          background: none; border: none; font-family: 'Inter', sans-serif;
          padding: 0;
        }
        .btn-back:hover { color: #0F172A; }
        .field-label { font-size: 12px; color: #64748B; margin-bottom: 8px; display: block; }
        .field-group { margin-bottom: 20px; }
        .chip-group { display: flex; flex-wrap: wrap; gap: 8px; }
        .anon-note {
          display: flex; align-items: flex-start; gap: 8px;
          background: #F8FAFC; border-radius: 8px;
          padding: 10px 12px; margin-bottom: 20px;
        }
      `}</style>

      <div style={{ maxWidth: 640, margin: "0 auto", padding: "32px 24px" }}>

        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 28 }}>
          <div style={{ width: 28, height: 28, background: "linear-gradient(135deg,#f59e0b,#f97316)", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <i className="ti ti-radar" style={{ fontSize: 13, color: "#fff" }} />
          </div>
          <span style={{ fontSize: 16, fontWeight: 600 }}>Job Lounge</span>
        </div>

        {/* Progress bar */}
        <div style={{ height: 3, background: "#F1F5F9", borderRadius: 2, marginBottom: 24 }}>
          <div style={{ height: 3, borderRadius: 2, background: "#185FA5", width: `${progress}%`, transition: "width 0.3s" }} />
        </div>

        {/* Stepper */}
        <div style={{ display: "flex", marginBottom: 28 }}>
          {["Your role", "Certifications", "Experience", "Expectations", "Done"].map((label, i) => {
            const n = i + 1;
            const isDone = step > n;
            const isActive = step === n;
            return (
              <div key={n} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", position: "relative" }}>
                {i < 4 && <div style={{ position: "absolute", top: 14, left: "50%", width: "100%", height: 1, background: "#E2E8F0", zIndex: 0 }} />}
                <div style={{
                  width: 28, height: 28, borderRadius: "50%", display: "flex", alignItems: "center",
                  justifyContent: "center", fontSize: 12, fontWeight: 500, zIndex: 1, position: "relative",
                  background: isDone ? "#E1F5EE" : isActive ? "#042C53" : "#F8FAFC",
                  color: isDone ? "#085041" : isActive ? "#B5D4F4" : "#94A3B8",
                  border: isDone ? "0.5px solid #5DCAA5" : isActive ? "0.5px solid #042C53" : "0.5px solid #E2E8F0",
                }}>
                  {isDone ? "✓" : n}
                </div>
                <div style={{ fontSize: 11, color: isActive ? "#0F172A" : "#94A3B8", marginTop: 5, fontWeight: isActive ? 500 : 400, textAlign: "center" }}>{label}</div>
              </div>
            );
          })}
        </div>

        {/* Panel */}
        <div style={{ background: "#fff", border: "0.5px solid #E2E8F0", borderRadius: 14, padding: "24px 24px 20px" }}>

          {/* ── STEP 1 ── */}
          {step === 1 && (
            <div>
              <div style={{ fontSize: 17, fontWeight: 500, marginBottom: 4 }}>What do you do?</div>
              <div style={{ fontSize: 13, color: "#64748B", marginBottom: 18, lineHeight: 1.5 }}>No name, no resume, no employer. Pick what fits you closest — you can refine later.</div>

              <div className="anon-note">
                <i className="ti ti-shield-lock" style={{ fontSize: 15, color: "#94A3B8", flexShrink: 0, marginTop: 1 }} />
                <span style={{ fontSize: 12, color: "#64748B", lineHeight: 1.5 }}>Nothing here is visible to your employer. We never ask for your name, company, or LinkedIn. Your identity stays yours.</span>
              </div>

              {/* Sector */}
              <div className="field-group">
                <span className="field-label">Industry / Sector you work in</span>
                <div className="chip-group">
                  {Object.keys(industryData).map((s) => (
                    <button key={s} className={`chip${sector === s ? " selected" : ""}`} onClick={() => handleSectorChange(s)}>{s}</button>
                  ))}
                  <button className={`chip${sector === "Other" ? " selected" : ""}`} onClick={() => handleSectorChange("Other")}>Other</button>
                </div>
              </div>

              {/* Domain — auto-populates from sector */}
              {sector && sector !== "Other" && (
                <div className="field-group">
                  <span className="field-label">Your primary domain / role</span>
                  <div className="chip-group">
                    {availableDomains.map((d) => (
                      <button key={d} className={`chip${domain === d ? " selected" : ""}`} onClick={() => { setDomain(d); setCustomDomain(""); }}>{d}</button>
                    ))}
                    <button className={`chip${domain === "Other" ? " selected" : ""}`} onClick={() => { setDomain("Other"); setCustomDomain(""); }}>Other</button>
                  </div>
                  {domain === "Other" && (
                    <input className="text-input" type="text" placeholder="Type your domain / role..." value={customDomain} onChange={(e) => setCustomDomain(e.target.value)} />
                  )}
                </div>
              )}

              {/* If sector is Other, free-text domain */}
              {sector === "Other" && (
                <div className="field-group">
                  <span className="field-label">Your primary domain / role</span>
                  <input className="text-input" type="text" placeholder="e.g. Supply Chain, Legal, Operations..." value={customDomain} onChange={(e) => setCustomDomain(e.target.value)} />
                </div>
              )}

              {/* City */}
              <div className="field-group">
                <span className="field-label">Current city</span>
                <div className="chip-group">
                  {CITIES.map((c) => (
                    <button key={c} className={`chip${city === c ? " selected" : ""}`} onClick={() => { setCity(c); setCustomCity(""); }}>{c}</button>
                  ))}
                </div>
                {city === "Other" && (
                  <input className="text-input" type="text" placeholder="Enter your city..." value={customCity} onChange={(e) => setCustomCity(e.target.value)} />
                )}
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <button className="btn-next" disabled={!step1Valid} onClick={() => setStep(2)}>Next →</button>
              </div>
            </div>
          )}

          {/* ── STEP 2 ── */}
          {step === 2 && (
            <div>
              <div style={{ fontSize: 17, fontWeight: 500, marginBottom: 4 }}>Which certifications do you hold?</div>
              <div style={{ fontSize: 13, color: "#64748B", marginBottom: 20, lineHeight: 1.5 }}>These are the first thing Gladiators filter on. Tick what you actually hold — in-progress counts separately.</div>

              {availableCerts.length > 0 ? (
                availableCerts.map((c) => (
                  <div key={c} className={`cert-row${certs.includes(c) ? " selected" : ""}`} onClick={() => toggleMulti(c, certs, setCerts)}>
                    <div className="cert-box">{certs.includes(c) && "✓"}</div>
                    <span style={{ fontSize: 13, color: "#0F172A", flex: 1 }}>{c}</span>
                  </div>
                ))
              ) : (
                <div style={{ fontSize: 13, color: "#94A3B8", marginBottom: 12 }}>No standard certifications for your sector — add yours below.</div>
              )}

              {/* Other cert free-text */}
              <div style={{ marginTop: 12 }}>
                <span className="field-label">Any other certification? (optional)</span>
                <input className="text-input" type="text" placeholder="e.g. CISSP, Prince2, CMA..." value={customCert} onChange={(e) => setCustomCert(e.target.value)} />
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 20 }}>
                <button className="btn-back" onClick={() => setStep(1)}>← Back</button>
                <button className="btn-next" disabled={!step2Valid} onClick={() => setStep(3)}>Next →</button>
              </div>
            </div>
          )}

          {/* ── STEP 3 ── */}
          {step === 3 && (
            <div>
              <div style={{ fontSize: 17, fontWeight: 500, marginBottom: 4 }}>Your experience</div>
              <div style={{ fontSize: 13, color: "#64748B", marginBottom: 20, lineHeight: 1.5 }}>Approximate ranges only — this is not a resume. No dates, no company names.</div>

              <div className="field-group">
                <span className="field-label">Total years in your domain</span>
                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <input type="range" min={1} max={25} value={expYears} step={1} onChange={(e) => setExpYears(Number(e.target.value))} />
                  <span style={{ fontSize: 13, fontWeight: 500, minWidth: 52 }}>{expYears} yrs</span>
                </div>
              </div>

              <div className="field-group">
                <span className="field-label">Current seniority level</span>
                <div className="chip-group">
                  {LEVELS.map((l) => (
                    <button key={l} className={`chip${level === l ? " selected" : ""}`} onClick={() => setLevel(l)}>{l}</button>
                  ))}
                </div>
              </div>

              <div className="field-group">
                <span className="field-label">Locations open to <span style={{ color: "#94A3B8", fontWeight: 400 }}>(select all that apply)</span></span>
                <div className="chip-group">
                  {OPEN_TO.map((o) => (
                    <button key={o} className={`chip${openTo.includes(o) ? " selected" : ""}`} onClick={() => toggleMulti(o, openTo, setOpenTo)}>{o}</button>
                  ))}
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 20 }}>
                <button className="btn-back" onClick={() => setStep(2)}>← Back</button>
                <button className="btn-next" disabled={!step3Valid} onClick={() => setStep(4)}>Next →</button>
              </div>
            </div>
          )}

          {/* ── STEP 4 ── */}
          {step === 4 && (
            <div>
              <div style={{ fontSize: 17, fontWeight: 500, marginBottom: 4 }}>What does the right move look like?</div>
              <div style={{ fontSize: 13, color: "#64748B", marginBottom: 20, lineHeight: 1.5 }}>This is what Gladiators see when they match with you — anonymously. Be honest; it&apos;s only used for matching.</div>

              <div className="field-group">
                <span className="field-label">Your current CTC (approximate)</span>
                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <input type="range" min={10} max={100} value={currentCtc} step={2} onChange={(e) => setCurrentCtc(Number(e.target.value))} />
                  <span style={{ fontSize: 13, fontWeight: 500, minWidth: 52 }}>₹{currentCtc}L</span>
                </div>
              </div>

              <div className="field-group">
                <span className="field-label">Minimum expectation to move</span>
                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <input type="range" min={10} max={100} value={minExpectation} step={2} onChange={(e) => setMinExpectation(Number(e.target.value))} />
                  <span style={{ fontSize: 13, fontWeight: 500, minWidth: 52 }}>₹{minExpectation}L</span>
                </div>
              </div>

              <div className="field-group">
                <span className="field-label">Openness to move right now</span>
                <div className="chip-group">
                  {OPENNESS.map((o) => (
                    <button key={o} className={`chip${openness === o ? " selected" : ""}`} onClick={() => setOpenness(o)}>{o}</button>
                  ))}
                </div>
              </div>

              <div className="field-group">
                <span className="field-label">What matters most in the next role? <span style={{ color: "#94A3B8", fontWeight: 400 }}>(select all that apply)</span></span>
                <div className="chip-group">
                  {MATTERS.map((m) => (
                    <button key={m} className={`chip${matters.includes(m) ? " selected" : ""}`} onClick={() => toggleMulti(m, matters, setMatters)}>{m}</button>
                  ))}
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 20 }}>
                <button className="btn-back" onClick={() => setStep(3)}>← Back</button>
                <button className="btn-next" disabled={!step4Valid} onClick={() => setStep(5)}>See my pulse →</button>
              </div>
            </div>
          )}

          {/* ── STEP 5 — Completion ── */}
          {step === 5 && (
            <div style={{ textAlign: "center", padding: "12px 0" }}>
              <div style={{ width: 52, height: 52, borderRadius: "50%", background: "#E1F5EE", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", fontSize: 24, color: "#0F6E56" }}>
                <i className="ti ti-radar" />
              </div>
              <div style={{ fontSize: 18, fontWeight: 500, marginBottom: 8 }}>Your market pulse is live</div>
              <div style={{ fontSize: 13, color: "#64748B", lineHeight: 1.6, maxWidth: 420, margin: "0 auto 20px" }}>
                Your anonymous profile is now visible to matched Gladiators. No name, no employer, no exposure. You&apos;ll be notified the moment someone circles.
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10, marginBottom: 24 }}>
                {[
                  { val: "3", label: "Open roles matched", color: "#185FA5" },
                  { val: "91%", label: "Top match score", color: "#0F6E56" },
                  { val: "+₹8L", label: "Market uplift visible", color: "#854F0B" },
                ].map((s) => (
                  <div key={s.label} style={{ background: "#F8FAFC", borderRadius: 10, padding: 14 }}>
                    <div style={{ fontSize: 20, fontWeight: 500, color: s.color }}>{s.val}</div>
                    <div style={{ fontSize: 11, color: "#64748B", marginTop: 3 }}>{s.label}</div>
                  </div>
                ))}
              </div>

              <a href="/dashboard">
                <button className="btn-next">Go to my dashboard →</button>
              </a>
            </div>
          )}

        </div>
      </div>
    </main>
  );
}