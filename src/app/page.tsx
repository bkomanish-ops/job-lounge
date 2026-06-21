'use client'

import { useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'

const TICKER_ITEMS = [
  "📰 India's Job Portal — Your CV was downloaded 3 times this week. By whom? Unknown. Forwarded where? Unknown.",
  "🔗 Professional Networking Platform — \"1 person from banking viewed your profile.\" No name. No company. No reason.",
  "📞 The referral you didn't start — A colleague mentioned your name. Now 3 people know you're looking, including someone who knows your manager.",
  "📰 India's Job Portal — Their job was done the moment you uploaded. What happens after — that's your problem.",
  "🔗 Professional Networking Platform — You were evaluated, shortlisted or passed over. The platform decided that's none of your business.",
  "📞 The referral you didn't start — You didn't start this. You can't stop it. That's how it works everywhere. Until now.",
]

const ID_LAYERS = [
  { label: 'Step 1 — You stay anonymous', labelColor: '#93c5fd', who: 'Join with just your professional profile', desc: 'No resume. No name. No employer. Domain, experience, location — that\'s enough for the matching engine to surface your market.', tags: [{ t: 'Domain ✓', g: true }, { t: 'Experience ✓', g: true }, { t: 'Location ✓', g: true }, { t: 'Name hidden', g: false }, { t: 'Employer hidden', g: false }] },
  { label: 'Step 2 — Opportunities come to you', labelColor: '#6ee7b7', who: 'See who\'s hiring before they see you', desc: 'Peers and Recruiters post verified briefs. You see the role, salary band, and company type. They see your anonymous profile. No names cross — yet.', tags: [{ t: 'Role visible ✓', g: true }, { t: 'Salary visible ✓', g: true }, { t: 'Your name hidden', g: false }, { t: 'No CV sent', g: false }] },
  { label: 'Step 3 — You choose when to connect', labelColor: '#93c5fd', who: 'Request a company reveal before engaging', desc: 'Before responding to any requirement, you can ask Job Lounge to confirm the company. If it\'s your own employer — you simply don\'t engage. No trace left. No one notified.', tags: [{ t: 'Company reveal on request', g: true }, { t: 'Mutual consent required', g: true }, { t: 'Your employer never knows', g: false }] },
]

const SIGNALS = [
  { icon: '🏦', org: 'Mid-size private bank', desc: 'Digital lending expansion — team formation next month.', time: '2 min ago' },
  { icon: '🏢', org: 'Large Fintech', desc: 'Risk Analytics — internal referrals now open.', time: '7 min ago' },
  { icon: '🌐', org: 'Global Capability Centre', desc: 'GRC transformation approved. Phased hiring begins.', time: '14 min ago' },
  { icon: '📈', org: 'NBFC — Risk team', desc: 'IT Audit Head — peer confirmed urgency. 22 days open.', time: '19 min ago' },
]

export default function HomePage() {
  const router = useRouter()
  const trackRef = useRef<HTMLDivElement>(null)
  const ip0 = useRef<HTMLDivElement>(null)
  const ip1 = useRef<HTMLDivElement>(null)
  const ip2 = useRef<HTMLDivElement>(null)

  const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })

  useEffect(() => {
    const H = 180
    let cur = 0
    const ips = [ip0.current, ip1.current, ip2.current]
    const goTo = (i: number) => {
      cur = i
      if (trackRef.current) trackRef.current.style.transform = `translateY(-${i * H}px)`
      ips.forEach((d, j) => {
        if (d) { d.style.background = j === i ? '#93c5fd' : 'rgba(255,255,255,0.12)'; d.style.flex = j === i ? '2' : '1' }
      })
    }
    const t = setInterval(() => goTo((cur + 1) % ID_LAYERS.length), 8000)
    return () => clearInterval(t)
  }, [])

  return (
    <>
      {/* STOCK TICKER */}
      <div style={{background:'#0d0f16',borderBottom:'1px solid rgba(255,255,255,0.08)',height:36,overflow:'hidden',display:'flex',alignItems:'center'}}>
        <div style={{flexShrink:0,padding:'0 18px',fontSize:10,fontWeight:800,letterSpacing:'2px',textTransform:'uppercase',color:'#fbbf24',borderRight:'1px solid rgba(255,255,255,0.1)',height:'100%',display:'flex',alignItems:'center',whiteSpace:'nowrap',background:'#0d0f16',zIndex:2,position:'relative',gap:8}}>
          <span style={{display:'inline-block',width:6,height:6,borderRadius:'50%',background:'#fbbf24',animation:'dotPulse 1.4s ease-in-out infinite',flexShrink:0}}/>
          WHAT THEY DON&apos;T TELL YOU
        </div>
        <div style={{overflow:'hidden',flex:1}}>
          <div style={{display:'flex',animation:'tickerScroll 50s linear infinite',width:'max-content'}}>
            {[...TICKER_ITEMS,...TICKER_ITEMS].map((item,i) => (
              <span key={i} style={{fontSize:12.5,color:'#cbd5e1',whiteSpace:'nowrap',padding:'0 36px',borderRight:'1px solid rgba(255,255,255,0.07)'}}>
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* NAV */}
      <nav style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'0 48px',height:56,background:'rgba(26,29,39,0.97)',backdropFilter:'blur(16px)',borderBottom:'1px solid rgba(255,255,255,0.08)',position:'sticky',top:0,zIndex:100}}>
        <div style={{display:'flex',alignItems:'center',gap:10,fontSize:16,fontWeight:700,color:'#fff'}}>
          <div style={{width:30,height:30,background:'linear-gradient(135deg,#3b82f6,#1d4ed8)',borderRadius:8,display:'flex',alignItems:'center',justifyContent:'center',fontSize:12,fontWeight:800,color:'#fff'}}>JL</div>
          Job Lounge
        </div>
        <div style={{display:'flex',alignItems:'center',gap:2}}>
          {['How it works','For Loungers','For Peers','For Recruiters'].map((l,i) => (
            <button key={l} onClick={() => scrollTo(i===0?'how':'personas')} style={{fontSize:13,color:'#94a3b8',padding:'6px 12px',borderRadius:7,background:'none',border:'none',fontFamily:'inherit'}}>{l}</button>
          ))}
        </div>
        <div style={{display:'flex',gap:8}}>
          <button onClick={() => router.push('/login')} style={{fontSize:13,padding:'7px 18px',borderRadius:20,background:'rgba(52,211,153,0.15)',color:'#6ee7b7',border:'1px solid rgba(52,211,153,0.3)',fontFamily:'inherit',fontWeight:500}}>Log in</button>
          <button onClick={() => router.push('/request-access')}
 style={{fontSize:13,padding:'8px 22px',borderRadius:20,background:'linear-gradient(135deg,#3b82f6,#1d4ed8)',color:'#fff',border:'none',fontFamily:'inherit',fontWeight:600}}>Request access →</button>
        </div>
      </nav>

      {/* HERO */}
      <section style={{padding:'48px 48px 52px',display:'grid',gridTemplateColumns:'1fr 400px',gap:48,alignItems:'start',background:'#1e2235'}}>
        <div>
          <div style={{display:'inline-flex',alignItems:'center',gap:8,background:'rgba(147,197,253,0.1)',border:'1px solid rgba(147,197,253,0.25)',borderRadius:20,padding:'5px 16px',marginBottom:22}}>
            <div style={{width:6,height:6,borderRadius:'50%',background:'#93c5fd',animation:'pulse 1.8s ease-in-out infinite',flexShrink:0}}/>
            <span style={{fontSize:11,fontWeight:700,color:'#93c5fd',letterSpacing:'1.5px',textTransform:'uppercase'}}>Opportunity First. Identity Later.</span>
          </div>

          <h1 style={{marginBottom:22}}>
            <span className="serif" style={{display:'block',fontSize:36,fontWeight:400,lineHeight:1.22,color:'#f1f5f9',marginBottom:2}}>Verified by us.</span>
            <span className="serif" style={{display:'block',fontSize:36,fontWeight:400,lineHeight:1.22,color:'#f1f5f9',marginBottom:2}}>Hidden from everyone else.</span>
            <span style={{display:'block',lineHeight:1.22}}><span className="serif" style={{fontSize:36,fontWeight:400,fontStyle:'italic',background:'linear-gradient(90deg,#93c5fd,#c4b5fd)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',backgroundClip:'text'}}>Until you choose otherwise.</span></span>
          </h1>

          <p style={{fontSize:15,color:'#94a3b8',lineHeight:1.75,marginBottom:24,maxWidth:460}}>Job Lounge is a verified opportunity network. See live opportunities and recruiter intent — before sharing your name, resume, or employer. Identity reveals only when you choose.</p>

          <div style={{display:'flex',flexWrap:'wrap',gap:8,marginBottom:28}}>
            {['Identity protected','Everyone verified','No CVs without consent','No employer alerts'].map(t => (
              <div key={t} style={{display:'inline-flex',alignItems:'center',gap:6,fontSize:12,fontWeight:500,color:'#f1f5f9',background:'rgba(110,231,183,0.1)',border:'1px solid rgba(110,231,183,0.25)',borderRadius:20,padding:'5px 14px'}}>
                <span style={{color:'#6ee7b7',fontWeight:700}}>✓</span>{t}
              </div>
            ))}
          </div>

          <div style={{display:'flex',gap:10,alignItems:'center',marginBottom:22}}>
            <button onClick={() => router.push('/request-access')}
 style={{fontSize:14,padding:'11px 28px',borderRadius:22,background:'linear-gradient(135deg,#3b82f6,#1d4ed8)',color:'#fff',border:'none',fontFamily:'inherit',fontWeight:600}}>Request access →</button>
            <button onClick={() => scrollTo('how')} style={{fontSize:14,padding:'11px 18px',borderRadius:22,background:'transparent',color:'#94a3b8',border:'1px solid rgba(255,255,255,0.15)',fontFamily:'inherit',display:'flex',alignItems:'center',gap:6}}>▶ See how it works</button>
          </div>

          <div style={{display:'flex',alignItems:'center',gap:10}}>
            <div style={{display:'flex'}}>
              {[['#1e3a8a','#93c5fd','SA'],['#14532d','#86efac','RK'],['#78350f','#fde68a','PM'],['#3b0764','#d8b4fe','VN']].map(([bg,col,init]) => (
                <div key={init} style={{width:24,height:24,borderRadius:'50%',border:'2px solid #1e2235',fontSize:8,fontWeight:700,display:'flex',alignItems:'center',justifyContent:'center',marginLeft:-7,background:bg,color:col}}>{init}</div>
              ))}
            </div>
            <span style={{fontSize:12,color:'#94a3b8'}}>Invite-only. <strong style={{color:'#f1f5f9',fontWeight:600}}>Currently accepting requests.</strong></span>
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div style={{display:'flex',flexDirection:'column',gap:12}}>
          <div style={{background:'rgba(255,255,255,0.05)',border:'1px solid rgba(255,255,255,0.12)',borderRadius:14,overflow:'hidden'}}>
            <div style={{padding:'10px 16px',borderBottom:'1px solid rgba(255,255,255,0.08)',display:'flex',alignItems:'center',justifyContent:'space-between',background:'rgba(255,255,255,0.04)'}}>
              <span style={{fontSize:10,fontWeight:700,letterSpacing:'1.5px',textTransform:'uppercase',color:'#cbd5e1'}}>How your identity is protected</span>
              <span style={{fontSize:10,padding:'2px 8px',borderRadius:20,background:'rgba(147,197,253,0.15)',color:'#93c5fd',border:'1px solid rgba(147,197,253,0.3)',fontWeight:600}}>3 steps</span>
            </div>
            <div style={{height:180,overflow:'hidden'}}>
              <div ref={trackRef} style={{display:'flex',flexDirection:'column',transition:'transform 0.7s cubic-bezier(.4,0,.2,1)'}}>
                {ID_LAYERS.map((layer,i) => (
                  <div key={i} style={{flexShrink:0,padding:'14px 16px 12px',height:180}}>
                    <div style={{fontSize:10,fontWeight:700,letterSpacing:'1px',textTransform:'uppercase',marginBottom:5,color:layer.labelColor}}>{layer.label}</div>
                    <div style={{fontSize:13,fontWeight:600,color:'#f1f5f9',marginBottom:4}}>{layer.who}</div>
                    <div style={{fontSize:11.5,color:'#94a3b8',lineHeight:1.55,marginBottom:8}}>{layer.desc}</div>
                    <div style={{display:'flex',flexWrap:'wrap',gap:4}}>
                      {layer.tags.map(tag => (
                        <span key={tag.t} style={{fontSize:10,padding:'2px 8px',borderRadius:20,fontWeight:500,
                          background: tag.g ? 'rgba(110,231,183,0.12)' : 'rgba(148,163,184,0.12)',
                          color: tag.g ? '#6ee7b7' : '#94a3b8',
                          border: `1px solid ${tag.g ? 'rgba(110,231,183,0.25)' : 'rgba(148,163,184,0.2)'}`}}>{tag.t}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div style={{display:'flex',gap:4,padding:'7px 16px 12px',background:'rgba(255,255,255,0.04)',borderTop:'1px solid rgba(255,255,255,0.08)'}}>
              {[ip0,ip1,ip2].map((r,i) => (
                <div key={i} ref={r} style={{height:3,flex:i===0?2:1,borderRadius:2,background:i===0?'#93c5fd':'rgba(255,255,255,0.12)',transition:'all .3s'}}/>
              ))}
            </div>
          </div>

          {/* Live signals */}
          <div style={{background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.12)',borderRadius:14,padding:'14px 16px'}}>
            <div style={{display:'flex',alignItems:'center',gap:7,marginBottom:12}}>
              <div style={{width:7,height:7,borderRadius:'50%',background:'#6ee7b7',flexShrink:0,animation:'lpulse 2s ease-in-out infinite'}}/>
              <span style={{fontSize:10,fontWeight:700,letterSpacing:'1.5px',textTransform:'uppercase',color:'#cbd5e1',flex:1}}>Live opportunity signals</span>
              <span onClick={() => router.push('/request-access')}
 style={{fontSize:11,color:'#93c5fd',fontWeight:600,cursor:'pointer'}}>View all →</span>
            </div>
            {SIGNALS.map((sig,i) => (
              <div key={i} style={{display:'flex',alignItems:'flex-start',gap:8,padding:'7px 0',borderBottom:i<SIGNALS.length-1?'1px solid rgba(255,255,255,0.07)':'none'}}>
                <div style={{width:26,height:26,borderRadius:6,background:'rgba(255,255,255,0.07)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:13,flexShrink:0}}>{sig.icon}</div>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{fontSize:12.5,fontWeight:600,color:'#f1f5f9'}}>{sig.org}</div>
                  <div style={{fontSize:11.5,color:'#94a3b8',marginTop:2,lineHeight:1.4}}>{sig.desc}</div>
                  <div style={{display:'flex',alignItems:'center',gap:4,fontSize:10,color:'#64748b',marginTop:3}}>
                    <div style={{width:4,height:4,borderRadius:'50%',background:'#6ee7b7',flexShrink:0}}/>{sig.time}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how" style={{background:'#13151f',padding:'56px 48px'}}>
        <div style={{textAlign:'center',marginBottom:40}}>
          <div style={{fontSize:10,fontWeight:700,letterSpacing:'2px',textTransform:'uppercase',color:'#93c5fd',marginBottom:10}}>The difference</div>
          <h2 className="serif" style={{fontSize:32,fontWeight:400,color:'#f1f5f9',marginBottom:12,lineHeight:1.25}}>Why the order of information changes everything</h2>
          <p style={{fontSize:15,color:'#94a3b8',lineHeight:1.75,maxWidth:540,margin:'0 auto'}}>On every other platform, you reveal yourself first. Here, the opportunity appears first.</p>
        </div>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:20}}>
          {[
            {label:'Every other platform',dot:'#94a3b8',vbg:'rgba(148,163,184,0.08)',vc:'#cbd5e1',vb:'rgba(148,163,184,0.15)',verdict:'Everything about you is known before anything about the opportunity.',steps:[['You reveal yourself first','Upload resume, share name, phone and email — before knowing anything.'],['You become visible to everyone','Your employer, colleagues, any recruiter with a subscription can see you.'],['Screening happens without you','Rejected or shortlisted by people you cannot identify.'],['Opportunity — if you are lucky','After passing filters you did not know existed.']]},
            {label:'Job Lounge',dot:'#6ee7b7',vbg:'rgba(110,231,183,0.08)',vc:'#6ee7b7',vb:'rgba(110,231,183,0.2)',verdict:'Everything about the opportunity is known before anything about you.',steps:[['Opportunity appears first','You see the role, salary band, and peer signal. Anonymously.'],['Evaluate with full context','Peer signals. Recruiter intent. Verified company. Salary benchmark.'],['Express interest — still protected','Raise your hand. No CV sent. No name shared.'],['Reveal identity — when you choose','Mutual consent. Both parties agree before names cross.']]},
          ].map(col => (
            <div key={col.label} style={{borderRadius:14,padding:24,background:'rgba(255,255,255,0.03)',border:'1px solid rgba(255,255,255,0.09)'}}>
              <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:16}}>
                <div style={{width:8,height:8,borderRadius:'50%',background:col.dot}}/>
                <span style={{fontSize:12,fontWeight:700,color:'#f1f5f9'}}>{col.label}</span>
              </div>
              {col.steps.map(([t,d],i) => (
                <div key={i} style={{display:'flex',alignItems:'flex-start',gap:10,padding:'8px 0',borderBottom:'1px solid rgba(255,255,255,0.07)'}}>
                  <div style={{width:18,height:18,borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',fontSize:9,fontWeight:700,flexShrink:0,marginTop:2,background:col.vbg,color:col.vc}}>{i+1}</div>
                  <div>
                    <span style={{fontSize:12.5,fontWeight:600,color:'#f1f5f9',display:'block',marginBottom:2}}>{t}</span>
                    <span style={{fontSize:11.5,color:'#94a3b8',lineHeight:1.5}}>{d}</span>
                  </div>
                </div>
              ))}
              <div style={{marginTop:12,fontSize:12,padding:'9px 13px',borderRadius:7,fontWeight:500,background:col.vbg,color:col.vc,border:`1px solid ${col.vb}`}}>{col.verdict}</div>
            </div>
          ))}
        </div>
      </section>

      {/* PERSONAS */}
      <section id="personas" style={{background:'#1e2235',padding:'56px 48px'}}>
        <div style={{textAlign:'center',marginBottom:8}}>
          <div style={{fontSize:10,fontWeight:700,letterSpacing:'2px',textTransform:'uppercase',color:'#93c5fd',marginBottom:10}}>Who is this for</div>
          <h2 className="serif" style={{fontSize:32,fontWeight:400,color:'#f1f5f9',marginBottom:10,lineHeight:1.25}}>Which door is yours?</h2>
          <p style={{fontSize:15,color:'#94a3b8',lineHeight:1.75,maxWidth:480,margin:'0 auto 32px'}}>Everyone on Job Lounge is here for a reason. Tell us yours.</p>
        </div>
        <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:18}}>
          {[
            {icon:'🔍',eyebrow:'Lounger',ec:'#93c5fd',title:"Show me what I'm worth",desc:"You're employed. Not applying anywhere. But you want to know what the market is paying for your exact profile — right now, without anyone knowing you looked.",points:['See live opportunities before revealing anything','Your employer is never notified — by design','Raise your hand only when you choose to'],cta:'Request access →',cb:'rgba(147,197,253,0.12)',cc:'#93c5fd'},
            {icon:'🤝',eyebrow:'Peer',ec:'#fcd34d',title:'Help me find my missing piece',desc:"In your organisation, you know a seat is open — or you have the power to refer. The right person is not on any job board. They are here, quietly available. Your referral could change someone's career.",points:['Post a 220-character flash brief in 4 minutes','Matched Loungers surface — identity hidden until both consent','Be the connection that changes someone\'s trajectory'],cta:'Request access →',cb:'rgba(252,211,77,0.12)',cc:'#fcd34d'},
            {icon:'🎯',eyebrow:'Recruiter',ec:'#c4b5fd',title:'Take me to the hidden talent',desc:"The professionals you need are not missing — they just do not surface on open platforms. They are here, verified, and quietly open.",points:['Verified access — every brief reviewed before matches shown','Pre-scored anonymous profiles matched to your brief','No CV changes hands without mutual consent'],cta:'Request verified access →',cb:'rgba(196,181,253,0.12)',cc:'#c4b5fd'},
          ].map(p => (
            <div key={p.eyebrow} onClick={() => router.push('/onboarding')}
              style={{borderRadius:14,padding:'24px 20px',border:'1px solid rgba(255,255,255,0.09)',background:'rgba(255,255,255,0.03)',cursor:'pointer',transition:'border-color .2s,background .2s'}}
              onMouseEnter={e => { const el = e.currentTarget as HTMLDivElement; el.style.background='rgba(255,255,255,0.06)'; el.style.borderColor='rgba(255,255,255,0.16)' }}
              onMouseLeave={e => { const el = e.currentTarget as HTMLDivElement; el.style.background='rgba(255,255,255,0.03)'; el.style.borderColor='rgba(255,255,255,0.09)' }}>
              <div style={{fontSize:24,marginBottom:10}}>{p.icon}</div>
              <div style={{fontSize:10,fontWeight:700,letterSpacing:'2px',textTransform:'uppercase',color:p.ec,marginBottom:5}}>{p.eyebrow}</div>
              <div className="serif" style={{fontSize:18,fontWeight:400,color:'#f1f5f9',marginBottom:7,lineHeight:1.25}}>{p.title}</div>
              <div style={{fontSize:12,color:'#94a3b8',lineHeight:1.65,marginBottom:14}}>{p.desc}</div>
              <div style={{display:'flex',flexDirection:'column',gap:5,marginBottom:18}}>
                {p.points.map(pt => <div key={pt} style={{display:'flex',alignItems:'flex-start',gap:6,fontSize:12,color:'#cbd5e1'}}><span style={{color:p.ec,fontWeight:700,flexShrink:0}}>✓</span>{pt}</div>)}
              </div>
              <button style={{fontSize:12,padding:'6px 16px',borderRadius:20,border:'none',fontFamily:'inherit',fontWeight:600,background:p.cb,color:p.cc}}>{p.cta}</button>
            </div>
          ))}
        </div>
      </section>

      {/* VERIFY */}
      <section style={{background:'#13151f',padding:'56px 48px'}}>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:48,alignItems:'start'}}>
          <div>
            <div style={{fontSize:10,fontWeight:700,letterSpacing:'2px',textTransform:'uppercase',color:'#93c5fd',marginBottom:10}}>Why you can trust what you see</div>
            <h2 className="serif" style={{fontSize:30,fontWeight:400,color:'#f1f5f9',marginBottom:12,lineHeight:1.25}}>Every signal is real.<br/>Every company is genuine.</h2>
            <p style={{fontSize:14,color:'#94a3b8',lineHeight:1.75,marginBottom:18}}>Job Lounge is not an open platform. Every Lounger, Peer, and Recruiter is verified before they can participate.</p>
            <div style={{fontSize:13,padding:'12px 16px',borderRadius:8,fontWeight:500,background:'rgba(110,231,183,0.08)',color:'#6ee7b7',border:'1px solid rgba(110,231,183,0.2)',lineHeight:1.6}}>&ldquo;Verified by Job Lounge. Hidden from everyone else — until you choose otherwise.&rdquo;</div>
          </div>
          <div style={{display:'flex',flexDirection:'column',gap:10}}>
            {[
              {icon:'🔍',title:'Loungers join anonymously',desc:'No resume, no name, no employer needed. Domain, experience, location — that is enough. Everything else stays hidden until you choose otherwise.'},
              {icon:'🤝',title:'Peers are verified employees',desc:'Company email confirmed before posting. Their company is verified but shown as "Large Private Bank" unless they choose to disclose. Real signals, controlled visibility.'},
              {icon:'🎯',title:'Recruiters are founder-reviewed',desc:'Every recruiter brief is reviewed before matches are shown. Company verified internally. No bulk access. No ghost recruiters.'},
              {icon:'🛡️',title:'A Lounger is never exposed to their own company',desc:'Before engaging with any requirement, a Lounger can request a verified company reveal. If it matches their employer, they simply do not engage — no one is notified, no trace left.'},
            ].map(v => (
              <div key={v.title} style={{background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.09)',borderRadius:10,padding:'12px 14px',display:'flex',alignItems:'flex-start',gap:10}}>
                <span style={{fontSize:16,flexShrink:0,marginTop:2}}>{v.icon}</span>
                <div>
                  <span style={{fontSize:12.5,fontWeight:600,color:'#f1f5f9',display:'block',marginBottom:3}}>{v.title}</span>
                  <span style={{fontSize:11.5,color:'#94a3b8',lineHeight:1.6}}>{v.desc}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOUNDER */}
      <section style={{background:'#1e2235',padding:'56px 48px'}}>
        <div style={{maxWidth:700,margin:'0 auto',background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.09)',borderRadius:16,padding:'36px 40px'}}>
          <div style={{fontSize:52,color:'rgba(147,197,253,0.2)',lineHeight:.8,marginBottom:16,fontFamily:'Georgia,serif'}}>&ldquo;</div>
          <p style={{fontSize:15,color:'#94a3b8',lineHeight:1.9}}>
            I spent two decades watching talented professionals get exposed before they were ready. A resume forwarded without permission. A LinkedIn view that reached their manager&apos;s desk. A referral that became a rumour.<br/><br/>
            <strong style={{color:'#f1f5f9',fontWeight:600}}>I built Job Lounge because I wanted a platform where the professional is always in control — and where that control is not a toggle in settings, but a fact of how the system is built.</strong><br/><br/>
            Everyone on this platform is verified. No fake companies. No ghost recruiters. But your identity, your company, your resume — those belong to you. They travel only with your consent. That&apos;s not a feature. That&apos;s the architecture.
          </p>
          <div style={{marginTop:20,paddingTop:16,borderTop:'1px solid rgba(255,255,255,0.08)',fontSize:12,color:'#64748b',fontStyle:'italic'}}>Founder, Job Lounge &middot; 20 years in the industry</div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{background:'#0d0f16',padding:'24px 48px',display:'flex',alignItems:'center',justifyContent:'space-between',borderTop:'1px solid rgba(255,255,255,0.07)'}}>
        <div style={{fontSize:14,fontWeight:700,color:'#64748b'}}>Job Lounge</div>
        <div style={{fontSize:12,color:'#475569',fontStyle:'italic'}}>&ldquo;Opportunity First. Identity Later.&rdquo;</div>
        <button onClick={() => router.push('/request-access')}
 style={{fontSize:13,padding:'7px 18px',borderRadius:20,background:'linear-gradient(135deg,#3b82f6,#1d4ed8)',color:'#fff',border:'none',fontFamily:'inherit',fontWeight:600}}>Request access →</button>
      </footer>
    </>
  )
}