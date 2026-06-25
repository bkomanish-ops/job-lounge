'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

// ─── Static data ──────────────────────────────────────────────────────────────

const INDUSTRY_SKILLS: Record<string, { needed: string[]; developed: string[] }> = {
  'Banking': { needed: ['Retail Banking','Credit Analysis','Risk Management','AML/KYC','Treasury'], developed: ['Financial Analysis','Regulatory Compliance','Credit Risk'] },
  'NBFC': { needed: ['Lending Operations','Collections','Credit Underwriting','RBI Compliance'], developed: ['Risk Assessment','Loan Management','Analytics'] },
  'Insurance': { needed: ['Underwriting','Claims Management','Actuarial Analysis'], developed: ['Risk Modeling','Compliance','Customer Service'] },
  'IT Services': { needed: ['Software Development','Cloud','DevOps','Cybersecurity'], developed: ['Programming','Automation','Project Delivery'] },
  'Software Product': { needed: ['Product Management','Agile','Engineering'], developed: ['Product Thinking','UX','Scalable Architecture'] },
  'Cybersecurity': { needed: ['SOC','VAPT','IAM','SIEM','GRC'], developed: ['Threat Analysis','Security Governance'] },
  'Manufacturing': { needed: ['Production Planning','Lean','Six Sigma','Quality'], developed: ['Process Optimization','Operations Management'] },
  'Automotive': { needed: ['Supply Chain','Production Engineering','Quality Control'], developed: ['Manufacturing Excellence','Vendor Management'] },
  'Healthcare': { needed: ['Clinical Operations','Healthcare IT','Compliance'], developed: ['Patient Care Processes','Regulatory Knowledge'] },
  'Pharmaceuticals': { needed: ['GxP','Validation','Quality Assurance','R&D'], developed: ['Regulatory Documentation','Research Skills'] },
  'Shipping & Logistics': { needed: ['Fleet Management','Customs','SCM'], developed: ['Logistics Planning','International Trade'] },
  'E-commerce': { needed: ['Digital Marketing','Supply Chain','Data Analytics'], developed: ['Customer Analytics','Growth Management'] },
  'Retail': { needed: ['Merchandising','Inventory Management','Sales'], developed: ['Customer Engagement','Category Management'] },
  'Telecom': { needed: ['Network Engineering','OSS/BSS','RF Planning'], developed: ['Network Operations','Service Delivery'] },
  'Energy & Utilities': { needed: ['Power Systems','Asset Management','Safety'], developed: ['Infrastructure Management'] },
  'Oil & Gas': { needed: ['Process Engineering','HSE','Exploration'], developed: ['Operational Risk','Asset Reliability'] },
  'Construction': { needed: ['Project Management','Estimation','Contracts'], developed: ['Vendor Coordination','Site Management'] },
  'Real Estate': { needed: ['Property Management','Sales','Legal'], developed: ['Negotiation','Asset Valuation'] },
  'Education': { needed: ['Curriculum Design','EdTech','Training'], developed: ['Teaching','Content Development'] },
  'Media & Entertainment': { needed: ['Content Production','Marketing','Creative Design'], developed: ['Storytelling','Brand Building'] },
  'Hospitality': { needed: ['Hotel Operations','Guest Services'], developed: ['Customer Experience','Service Management'] },
  'Consulting': { needed: ['Problem Solving','Strategy','Analysis'], developed: ['Stakeholder Management','Advisory Skills'] },
  'BPO / KPO': { needed: ['Process Management','Customer Support'], developed: ['Communication','Process Excellence'] },
  'Data & AI': { needed: ['Machine Learning','Data Engineering','Analytics'], developed: ['Model Development','Data Science'] },
  'FinTech': { needed: ['Payments','APIs','Digital Lending'], developed: ['Innovation','Financial Technology'] },
  'Government / Public Sector': { needed: ['Policy','Governance','Procurement'], developed: ['Public Administration','Compliance'] },
  'Aviation': { needed: ['Flight Operations','Safety','Maintenance'], developed: ['Operational Discipline','Compliance'] },
  'Agriculture': { needed: ['Agri-Tech','Farm Management','Supply Chain'], developed: ['Resource Planning','Sustainability'] },
  'Mining & Metals': { needed: ['Geology','Extraction','Safety'], developed: ['Industrial Operations'] },
  'Travel & Tourism': { needed: ['Travel Planning','Reservation Systems'], developed: ['Relationship Management'] },
}

const INDUSTRY_CERTIFICATIONS: Record<string, string[]> = {
  'Banking': ['CAIIB','JAIIB','CFP','CFA','FRM','CAMS'],
  'NBFC': ['CAIIB','FRM','CFP','CAMS'],
  'Insurance': ['FIII','AIII','Licentiate','ACII','FLMI','CFP'],
  'IT Services': ['AWS','Azure','GCP','PMP','ITIL','CISSP'],
  'Software Product': ['AWS','Azure','Agile/Scrum','PMP','CAPM'],
  'Cybersecurity': ['CISSP','CISM','CEH','OSCP','CompTIA Security+','CISA'],
  'Manufacturing': ['Six Sigma Green Belt','Six Sigma Black Belt','PMP','ISO 9001 Lead Auditor'],
  'Automotive': ['Six Sigma','PMP','IATF 16949 Auditor'],
  'Healthcare': ['CPHQ','NABH Auditor','PMP','HIPAA Certification'],
  'Pharmaceuticals': ['GxP','RAC','ASQ CQA','ISO 13485 Auditor'],
  'Shipping & Logistics': ['CHA','IATA DGR','PMP','Six Sigma'],
  'E-commerce': ['Google Analytics','Meta Blueprint','AWS','PMP'],
  'Retail': ['CPM','Google Analytics','Six Sigma'],
  'Telecom': ['CCNA','CCNP','ITIL','PMP'],
  'Energy & Utilities': ['PMP','PE License','NEBOSH','ISO 50001'],
  'Oil & Gas': ['PMP','NEBOSH','HAZOP','API Certifications'],
  'Construction': ['PMP','CAPM','NICMAR','PMI-RMP'],
  'Real Estate': ['RERA','PMP','CFP'],
  'Education': ['B.Ed','CTET','PMP','Google Certified Educator'],
  'Consulting': ['PMP','CFA','MBA','Six Sigma'],
  'Data & AI': ['AWS ML Specialty','Google ML','Azure AI','Databricks','TensorFlow Developer'],
  'FinTech': ['CFA','FRM','AWS','PMP','CAMS'],
  'Government / Public Sector': ['CSS','IAS','UPSC','PMP'],
  'BPO / KPO': ['Six Sigma','ITIL','PMP','COPC'],
}

const CONTRIBUTION_TYPES = [
  { id: 'ic', label: 'Individual Contributor', desc: 'I deliver work independently — no direct reports' },
  { id: 'team', label: 'Team Handling', desc: 'I lead a small team (2–10 people)' },
  { id: 'management', label: 'Management Role', desc: 'I manage managers and multiple teams' },
  { id: 'strategic', label: 'Strategic Role', desc: 'I set direction and own outcomes at org level' },
  { id: 'consulting', label: 'Consulting / Advisory', desc: 'I advise organisations without being on payroll' },
]

const EXP_BANDS = ['0–3 yrs','3–6 yrs','6–10 yrs','10–15 yrs','15–20 yrs','20+ yrs']

const CITIES = [
  'Mumbai','Delhi NCR','Bangalore','Pune','Chennai',
  'Hyderabad','Kolkata','Ahmedabad','Surat','Jaipur',
  'Lucknow','Chandigarh','Bhopal','Nagpur','Indore',
  'Kochi','Coimbatore','Visakhapatnam','Other',
]

const STEPS = ['Welcome','Industry','Skills','Certifications','Contribution','Exp & Salary','Done']

function generateJLId(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let id = 'JL-'
  for (let i = 0; i < 6; i++) id += chars[Math.floor(Math.random() * chars.length)]
  return id
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function ProgressBar({ step, total }: { step: number; total: number }) {
  return (
    <div style={{ height: 3, background: '#f1f5f9', borderRadius: 2, marginBottom: 24 }}>
      <div style={{ height: 3, borderRadius: 2, background: '#185FA5', width: `${(step / total) * 100}%`, transition: 'width 0.3s' }} />
    </div>
  )
}

function StepDots({ current, total }: { current: number; total: number }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 24 }}>
      {Array.from({ length: total }).map((_, i) => (
        <div key={i} style={{
          height: 3, borderRadius: 2, transition: 'all 0.3s',
          background: i < current ? '#5DCAA5' : i === current ? '#185FA5' : '#e2e8f0',
          flex: i === current ? 2 : 1,
        }} />
      ))}
    </div>
  )
}

function PrivacyBadge() {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, background: '#E6F1FB', border: '0.5px solid #B5D4F4', borderRadius: 10, padding: '12px 14px', marginBottom: 20 }}>
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#0C447C" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 1 }}>
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
      <span style={{ fontSize: 12, color: '#0C447C', lineHeight: 1.6 }}>
        <strong>Nothing here can identify you.</strong> No name, no employer, no LinkedIn. Job Lounge uses this only for matching. You are known by your unique ID until you choose otherwise.
      </span>
    </div>
  )
}

function Chip({ label, selected, onClick }: { label: string; selected: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick} style={{
      fontSize: 12, padding: '6px 14px', borderRadius: 20, cursor: 'pointer',
      border: selected ? '1px solid #B5D4F4' : '0.5px solid #e2e8f0',
      background: selected ? '#E6F1FB' : '#fff',
      color: selected ? '#0C447C' : '#475569',
      fontFamily: 'Inter, sans-serif', fontWeight: selected ? 600 : 400,
      transition: 'all 0.15s',
    }}>
      {label}
    </button>
  )
}

function CustomAdder({ placeholder, onAdd, category }: { placeholder: string; onAdd: (val: string) => void; category: string }) {
  const [val, setVal] = useState('')

  async function handleAdd() {
    const trimmed = val.trim()
    if (!trimmed) return
    onAdd(trimmed)
    setVal('')
    await supabase.from('custom_options').upsert({ category, value: trimmed }, { onConflict: 'category,value' })
  }

  return (
    <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
      <input
        type="text"
        value={val}
        onChange={e => setVal(e.target.value)}
        onKeyDown={e => e.key === 'Enter' && handleAdd()}
        placeholder={placeholder}
        style={{ ...inputStyle, flex: 1, marginBottom: 0 }}
      />
      <button onClick={handleAdd} style={{ fontSize: 12, fontWeight: 600, padding: '8px 16px', borderRadius: 8, border: 'none', cursor: 'pointer', background: '#185FA5', color: '#fff', fontFamily: 'Inter, sans-serif', whiteSpace: 'nowrap' as const }}>
        + Add
      </button>
    </div>
  )
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function LoungerOnboardingPage() {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [jlId, setJlId] = useState('')

  const [extraIndustries, setExtraIndustries] = useState<string[]>([])
  const [extraSkills, setExtraSkills] = useState<string[]>([])
  const [extraCerts, setExtraCerts] = useState<string[]>([])

  const [industry, setIndustry] = useState('')
  const [skills, setSkills] = useState<string[]>([])
  const [certifications, setCertifications] = useState<string[]>([])
  const [contribution, setContribution] = useState('')
  const [expBand, setExpBand] = useState('')
  const [city, setCity] = useState('')
  const [currentSalary, setCurrentSalary] = useState('')
  const [expectedSalary, setExpectedSalary] = useState('')

  useEffect(() => {
    checkAuth()
    loadCustomOptions()
  }, [])

  async function checkAuth() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) router.push('/login')
  }

  async function loadCustomOptions() {
    const { data } = await supabase
      .from('custom_options')
      .select('category, value')
      .eq('approved', true)

    if (data) {
      setExtraIndustries(data.filter(d => d.category === 'industry').map(d => d.value))
      setExtraSkills(data.filter(d => d.category === 'skill').map(d => d.value))
      setExtraCerts(data.filter(d => d.category === 'certification').map(d => d.value))
    }
  }

  const staticIndustries = Object.keys(INDUSTRY_SKILLS)
  const allIndustries = [...new Set([...staticIndustries, ...extraIndustries])]

  const staticSkills = industry
    ? [...(INDUSTRY_SKILLS[industry]?.needed ?? []), ...(INDUSTRY_SKILLS[industry]?.developed ?? [])]
    : []
  const allSkills = [...new Set([...staticSkills, ...extraSkills])]

  const staticCerts = industry ? (INDUSTRY_CERTIFICATIONS[industry] ?? []) : []
  const allCerts = [...new Set([...staticCerts, ...extraCerts])]

  function toggleItem(list: string[], setList: (v: string[]) => void, item: string) {
    setList(list.includes(item) ? list.filter(x => x !== item) : [...list, item])
  }

  async function handleFinish() {
    const curL = parseFloat(currentSalary)
    const expL = parseFloat(expectedSalary)

    if (!curL || !expL || curL <= 0 || expL <= 0) {
      setError('Please enter valid salary figures.')
      return
    }

    if (!city) {
      setError('Please select your current city.')
      return
    }

    setSaving(true)
    setError('')

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push('/login'); return }

    const uniqueId = generateJLId()

    const { error: profileErr } = await supabase
      .from('lounger_profiles')
      .upsert({
        user_id: user.id,
        domain: [industry],
        skills,
        certifications,
        contribution_type: contribution,
        experience_years: expBand,
        salary_min_paise: Math.round(curL * 100000 * 100),
        salary_max_paise: Math.round(expL * 100000 * 100),
        jl_id: uniqueId,
        current_city: city,
      }, { onConflict: 'user_id' })

    if (profileErr) {
      setError(`Failed to save: ${profileErr.message}`)
      setSaving(false)
      return
    }

    await supabase.from('users').update({ onboarding_done: true }).eq('id', user.id)

    setJlId(uniqueId)
    setSaving(false)
    setStep(6)
  }

  const totalSteps = STEPS.length

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', fontFamily: 'Inter, sans-serif' }}>

      <nav style={{ background: '#fff', borderBottom: '0.5px solid #e2e8f0', padding: '0 24px', height: 52, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: 15, fontWeight: 600, color: '#0f172a' }}>Job Lounge</span>
        {step < 6 && (
          <span style={{ fontSize: 11, color: '#64748b' }}>Step {step + 1} of {totalSteps}</span>
        )}
      </nav>

      <div style={{ maxWidth: 580, margin: '0 auto', padding: '32px 20px 48px' }}>

        {step > 0 && step < 6 && (
          <>
            <ProgressBar step={step + 1} total={totalSteps} />
            <StepDots current={step} total={totalSteps} />
          </>
        )}

        {/* ── Step 0: Welcome ── */}
        {step === 0 && (
          <div style={card}>
            <div style={{ textAlign: 'center', marginBottom: 24 }}>
              <div style={{ fontSize: 28, marginBottom: 12 }}>👋</div>
              <div style={{ fontSize: 18, fontWeight: 600, color: '#0f172a', marginBottom: 6 }}>Welcome to Job Lounge</div>
              <div style={{ fontSize: 13, color: '#64748b', lineHeight: 1.6 }}>Let's set up your anonymous profile. This takes about 2 minutes.</div>
            </div>

            <div style={{ background: '#042C53', borderRadius: 12, padding: '18px 20px', marginBottom: 24 }}>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase' as const, color: '#85B7EB', marginBottom: 10 }}>
                Your privacy commitment
              </div>
              <p style={{ fontSize: 13, color: '#B5D4F4', lineHeight: 1.7, margin: '0 0 12px' }}>
                Job Lounge does not collect your name, employer, LinkedIn, or resume at any point during setup. The information you share — industry, skills, experience, and salary — is used <strong style={{ color: '#fff' }}>only</strong> by our matching engine to surface relevant opportunities.
              </p>
              <div style={{ paddingTop: 12, borderTop: '0.5px solid rgba(255,255,255,0.1)' }}>
                <p style={{ fontSize: 13, color: '#B5D4F4', lineHeight: 1.7, margin: 0 }}>
                  On this platform, you will be known exclusively by a <strong style={{ color: '#5DCAA5' }}>unique Job Lounge ID</strong> — for example, <strong style={{ color: '#5DCAA5' }}>JL-X7KR4M</strong>. No one can identify you from this ID. Your real identity is shared only when <strong style={{ color: '#fff' }}>you</strong> choose to reveal it, with explicit consent.
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 24 }}>
              {[
                'No name or employer ever collected during setup',
                'Your unique ID replaces your identity on the platform',
                'Salary and skills visible only to the Job Lounge matching engine',
                'Identity revealed only with your explicit, mutual consent',
              ].map(pt => (
                <div key={pt} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 12, color: '#475569' }}>
                  <span style={{ color: '#5DCAA5', fontWeight: 700, flexShrink: 0, marginTop: 1 }}>✓</span>
                  {pt}
                </div>
              ))}
            </div>

            <button
              onClick={() => setStep(1)}
              style={{ ...nextBtn, width: '100%', padding: '12px 0', fontSize: 14, background: '#185FA5' }}
            >
              I understand — let's begin →
            </button>
          </div>
        )}

        {/* ── Step 1: Industry ── */}
        {step === 1 && (
          <div style={card}>
            <div style={title}>Which industry do you work in?</div>
            <div style={sub}>Select the sector that best describes your current organisation.</div>
            <PrivacyBadge />

            <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: 8, marginBottom: 16 }}>
              {allIndustries.map(ind => (
                <Chip key={ind} label={ind} selected={industry === ind} onClick={() => { setIndustry(ind); setSkills([]); setCertifications([]) }} />
              ))}
            </div>

            <CustomAdder
              placeholder="Don't see your industry? Add it here"
              category="industry"
              onAdd={val => {
                setExtraIndustries(prev => [...new Set([...prev, val])])
                setIndustry(val)
                setSkills([])
                setCertifications([])
              }}
            />

            <div style={{ ...btnRow, marginTop: 20 }}>
              <button onClick={() => setStep(0)} style={backBtn}>← Back</button>
              <button
                onClick={() => industry && setStep(2)}
                disabled={!industry}
                style={{ ...nextBtn, background: !industry ? '#cbd5e1' : '#185FA5' }}
              >
                Next →
              </button>
            </div>
          </div>
        )}

        {/* ── Step 2: Skills ── */}
        {step === 2 && (
          <div style={card}>
            <div style={title}>What are your key skills?</div>
            <div style={sub}>Based on <strong style={{ color: '#0f172a' }}>{industry}</strong>. Select all that apply.</div>
            <PrivacyBadge />

            {allSkills.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: 8, marginBottom: 12 }}>
                {allSkills.map(s => (
                  <Chip key={s} label={s} selected={skills.includes(s)} onClick={() => toggleItem(skills, setSkills, s)} />
                ))}
              </div>
            )}

            <CustomAdder
              placeholder="Add a skill not in the list"
              category="skill"
              onAdd={val => {
                setExtraSkills(prev => [...new Set([...prev, val])])
                setSkills(prev => [...new Set([...prev, val])])
              }}
            />

            {skills.length > 0 && (
              <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 10 }}>
                {skills.length} skill{skills.length > 1 ? 's' : ''} selected
              </div>
            )}

            <div style={{ ...btnRow, marginTop: 20 }}>
              <button onClick={() => setStep(1)} style={backBtn}>← Back</button>
              <button
                onClick={() => skills.length > 0 && setStep(3)}
                disabled={skills.length === 0}
                style={{ ...nextBtn, background: skills.length === 0 ? '#cbd5e1' : '#185FA5' }}
              >
                Next →
              </button>
            </div>
          </div>
        )}

        {/* ── Step 3: Certifications ── */}
        {step === 3 && (
          <div style={card}>
            <div style={title}>Any certifications?</div>
            <div style={sub}>Based on <strong style={{ color: '#0f172a' }}>{industry}</strong>. Select what you hold. You can skip this step.</div>
            <PrivacyBadge />

            {allCerts.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: 8, marginBottom: 12 }}>
                {allCerts.map(c => (
                  <Chip key={c} label={c} selected={certifications.includes(c)} onClick={() => toggleItem(certifications, setCertifications, c)} />
                ))}
              </div>
            )}

            <CustomAdder
              placeholder="Add a certification not in the list"
              category="certification"
              onAdd={val => {
                setExtraCerts(prev => [...new Set([...prev, val])])
                setCertifications(prev => [...new Set([...prev, val])])
              }}
            />

            {certifications.length > 0 && (
              <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 10 }}>
                {certifications.length} certification{certifications.length > 1 ? 's' : ''} selected
              </div>
            )}

            <div style={{ ...btnRow, marginTop: 20 }}>
              <button onClick={() => setStep(2)} style={backBtn}>← Back</button>
              <div style={{ display: 'flex', gap: 10 }}>
                <button onClick={() => setStep(4)} style={{ ...backBtn, color: '#94a3b8' }}>Skip</button>
                <button onClick={() => setStep(4)} style={{ ...nextBtn, background: '#185FA5' }}>
                  Next →
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── Step 4: Contribution ── */}
        {step === 4 && (
          <div style={card}>
            <div style={title}>How do you contribute?</div>
            <div style={sub}>Select the option that best describes your current role structure.</div>
            <PrivacyBadge />

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 24 }}>
              {CONTRIBUTION_TYPES.map(c => (
                <div
                  key={c.id}
                  onClick={() => setContribution(c.id)}
                  style={{
                    padding: '12px 14px', borderRadius: 8, cursor: 'pointer',
                    border: contribution === c.id ? '1.5px solid #185FA5' : '0.5px solid #e2e8f0',
                    background: contribution === c.id ? '#E6F1FB' : '#fff',
                    display: 'flex', alignItems: 'center', gap: 12,
                  }}
                >
                  <div style={{
                    width: 16, height: 16, borderRadius: '50%', flexShrink: 0,
                    border: contribution === c.id ? '5px solid #185FA5' : '1.5px solid #cbd5e1',
                    transition: 'all 0.15s',
                  }} />
                  <div>
                    <div style={{ fontSize: 13, fontWeight: contribution === c.id ? 600 : 400, color: contribution === c.id ? '#0C447C' : '#0f172a' }}>{c.label}</div>
                    <div style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>{c.desc}</div>
                  </div>
                </div>
              ))}
            </div>

            <div style={btnRow}>
              <button onClick={() => setStep(3)} style={backBtn}>← Back</button>
              <button
                onClick={() => contribution && setStep(5)}
                disabled={!contribution}
                style={{ ...nextBtn, background: !contribution ? '#cbd5e1' : '#185FA5' }}
              >
                Next →
              </button>
            </div>
          </div>
        )}

        {/* ── Step 5: Experience & Salary ── */}
        {step === 5 && (
          <div style={card}>
            <div style={title}>Experience, location & salary</div>
            <div style={sub}>Helps calibrate your market pulse. Salary is never shown to anyone on the platform.</div>
            <PrivacyBadge />

            <label style={labelStyle}>Current city</label>
            <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: 8, marginBottom: 20 }}>
              {CITIES.map(c => (
                <Chip key={c} label={c} selected={city === c} onClick={() => setCity(c)} />
              ))}
            </div>

            <label style={labelStyle}>Total years of experience</label>
            <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: 8, marginBottom: 20 }}>
              {EXP_BANDS.map(b => (
                <Chip key={b} label={b} selected={expBand === b} onClick={() => setExpBand(b)} />
              ))}
            </div>

            <label style={labelStyle}>Current annual salary (₹ in Lakhs)</label>
            <div style={{ position: 'relative', marginBottom: 16 }}>
              <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', fontSize: 13, color: '#64748b' }}>₹</span>
              <input
                type="number"
                value={currentSalary}
                onChange={e => { setCurrentSalary(e.target.value); setError('') }}
                placeholder="e.g. 24"
                style={{ ...inputStyle, paddingLeft: 28, paddingRight: 70, marginBottom: 0 }}
              />
              <span style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', fontSize: 12, color: '#94a3b8' }}>Lakhs/yr</span>
            </div>

            <label style={labelStyle}>Expected annual salary (₹ in Lakhs)</label>
            <div style={{ position: 'relative', marginBottom: error ? 8 : 16 }}>
              <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', fontSize: 13, color: '#64748b' }}>₹</span>
              <input
                type="number"
                value={expectedSalary}
                onChange={e => { setExpectedSalary(e.target.value); setError('') }}
                placeholder="e.g. 32"
                style={{ ...inputStyle, paddingLeft: 28, paddingRight: 70, marginBottom: 0 }}
              />
              <span style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', fontSize: 12, color: '#94a3b8' }}>Lakhs/yr</span>
            </div>

            {error && <p style={{ fontSize: 12, color: '#e24b4a', margin: '0 0 12px' }}>{error}</p>}

            <div style={{ fontSize: 12, color: '#94a3b8', lineHeight: 1.6, marginBottom: 20, padding: '10px 12px', background: '#f8fafc', borderRadius: 8 }}>
              Salary figures are used only by the Job Lounge matching engine. They are never visible to any Peer, Recruiter, or other Lounger.
            </div>

            <div style={btnRow}>
              <button onClick={() => setStep(4)} style={backBtn}>← Back</button>
              <button
                onClick={handleFinish}
                disabled={saving || !expBand || !city || !currentSalary || !expectedSalary}
                style={{ ...nextBtn, background: saving || !expBand || !city || !currentSalary || !expectedSalary ? '#cbd5e1' : '#185FA5', opacity: saving ? 0.7 : 1 }}
              >
                {saving ? 'Saving…' : 'Complete setup →'}
              </button>
            </div>
          </div>
        )}

        {/* ── Step 6: Done ── */}
        {step === 6 && (
          <div style={{ ...card, textAlign: 'center' as const }}>
            <div style={{ width: 56, height: 56, borderRadius: '50%', background: '#E1F5EE', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#0F6E56" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <div style={{ fontSize: 18, fontWeight: 600, color: '#0f172a', marginBottom: 6 }}>You're on the platform</div>
            <div style={{ fontSize: 13, color: '#64748b', lineHeight: 1.6, marginBottom: 20 }}>Your anonymous profile is live. Here is your platform identity:</div>

            <div style={{ background: '#042C53', borderRadius: 12, padding: '20px 24px', marginBottom: 20 }}>
              <div style={{ fontSize: 11, color: '#85B7EB', letterSpacing: '1px', textTransform: 'uppercase' as const, marginBottom: 8 }}>Your Job Lounge ID</div>
              <div style={{ fontSize: 32, fontWeight: 700, color: '#5DCAA5', letterSpacing: 6, marginBottom: 8 }}>{jlId}</div>
              <div style={{ fontSize: 12, color: '#B5D4F4', lineHeight: 1.6 }}>
                This is the only identity anyone on this platform will ever see — until you choose to reveal yourself.
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 24, textAlign: 'left' as const }}>
              {[
                { label: 'Industry', value: industry },
                { label: 'Location', value: city },
                { label: 'Skills', value: `${skills.length} selected` },
                { label: 'Experience', value: expBand },
                { label: 'Certifications', value: certifications.length > 0 ? `${certifications.length} selected` : 'None' },
                { label: 'Salary band', value: `₹${currentSalary}L – ₹${expectedSalary}L` },
              ].map(stat => (
                <div key={stat.label} style={{ background: '#f8fafc', borderRadius: 8, padding: '10px 14px' }}>
                  <div style={{ fontSize: 11, color: '#94a3b8', marginBottom: 2 }}>{stat.label}</div>
                  <div style={{ fontSize: 13, fontWeight: 500, color: '#0f172a' }}>{stat.value}</div>
                </div>
              ))}
            </div>

            <button
              onClick={() => router.push('/dashboard/lounger')}
              style={{ ...nextBtn, width: '100%', padding: '12px 0', fontSize: 14, background: '#185FA5' }}
            >
              Go to my dashboard →
            </button>
          </div>
        )}

      </div>
    </div>
  )
}

// ─── Shared styles ────────────────────────────────────────────────────────────

const card: React.CSSProperties = { background: '#fff', border: '0.5px solid #e2e8f0', borderRadius: 14, padding: '24px 24px 20px' }
const title: React.CSSProperties = { fontSize: 16, fontWeight: 600, color: '#0f172a', marginBottom: 4 }
const sub: React.CSSProperties = { fontSize: 13, color: '#64748b', marginBottom: 20, lineHeight: 1.5 }
const labelStyle: React.CSSProperties = { fontSize: 12, fontWeight: 500, color: '#475569', display: 'block', marginBottom: 8 }
const inputStyle: React.CSSProperties = { width: '100%', padding: '10px 14px', fontSize: 14, border: '0.5px solid #e2e8f0', borderRadius: 8, outline: 'none', fontFamily: 'Inter, sans-serif', color: '#0f172a', boxSizing: 'border-box' as const, display: 'block', marginBottom: 16 }
const btnRow: React.CSSProperties = { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 4 }
const backBtn: React.CSSProperties = { fontSize: 13, color: '#64748b', background: 'none', border: 'none', cursor: 'pointer', padding: '6px 0', fontFamily: 'Inter, sans-serif' }
const nextBtn: React.CSSProperties = { fontSize: 13, fontWeight: 600, padding: '8px 24px', borderRadius: 20, border: 'none', cursor: 'pointer', color: '#fff', fontFamily: 'Inter, sans-serif', transition: 'background 0.15s' }