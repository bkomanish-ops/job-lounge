"use client";

import React, { useState, useEffect } from 'react';

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);

  // Handle the sticky navbar shadow on scroll
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <main className="min-h-screen bg-[#fafafa] text-gray-900 font-sans overflow-x-hidden selection:bg-blue-100">
      
      {/* ─── STICKY NAV ─── */}
      <nav 
        className={`fixed top-0 left-0 right-0 z-50 h-[72px] flex items-center justify-between px-6 md:px-12 transition-all duration-300 ${
          scrolled 
            ? 'bg-white/90 backdrop-blur-md shadow-sm border-b border-gray-200' 
            : 'bg-[#fafafa]'
        }`}
      >
        <div className="font-extrabold text-2xl tracking-tight flex items-center gap-3 text-blue-900">
          <div className="w-9 h-9 bg-blue-900 rounded-lg flex items-center justify-center text-white text-sm shadow-sm">
            JL
          </div>
          Job Lounge
        </div>
        <div className="hidden md:flex items-center gap-8">
          <a href="/gladiator" className="text-sm font-medium text-gray-600 hover:text-blue-900 transition-colors">
            For Hiring Teams
          </a>
          <a href="/" className="text-sm font-medium text-gray-600 hover:text-blue-900 transition-colors">
            Sign In
          </a>
          <a href="/" className="bg-blue-900 text-white border-none rounded-full px-6 py-2.5 text-sm font-bold shadow-sm hover:bg-blue-800 hover:shadow-md transition-all flex items-center gap-2">
            Start Anonymous Test
          </a>
        </div>
      </nav>

      {/* ─── HERO ─── */}
      <section className="relative min-h-[85vh] flex flex-col justify-center pt-24 pb-12">
        <div className="relative z-10 max-w-5xl mx-auto px-6 md:px-12 text-center">
          
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-blue-800 text-[11.5px] font-bold tracking-[2.5px] uppercase mb-8">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
            Private Market Intelligence
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 tracking-tight leading-[1.1] mb-6">
            Know what you're worth.<br />
            <span className="text-blue-900">
              Without anyone knowing you looked.
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed mb-10">
            The private, anonymous market intelligence platform connecting senior professionals with top-tier hiring teams. No resumes, no LinkedIn exposure, zero recruiter fees.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a href="/" className="bg-blue-900 text-white px-8 py-4 rounded-full text-base font-bold shadow-md hover:-translate-y-0.5 hover:shadow-lg hover:bg-blue-800 transition-all">
              Take the 14-Day Market Test
            </a>
            <a href="/gladiator" className="bg-white text-gray-800 border-2 border-gray-200 px-8 py-4 rounded-full text-base font-bold hover:bg-gray-50 hover:border-gray-300 transition-all">
              Post a Flash Brief (Hiring)
            </a>
          </div>

        </div>
      </section>

      {/* ─── SPLIT SECTION ─── */}
      <section className="bg-white border-y border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-gray-200">
          
          {/* For Loungers */}
          <div className="flex-1 p-10 md:p-20 hover:bg-blue-50/30 transition-colors">
            <div className="w-14 h-14 bg-blue-100 text-blue-900 rounded-2xl flex items-center justify-center mb-8 shadow-sm border border-blue-200">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
            </div>
            <h2 className="text-3xl font-extrabold text-gray-900 mb-4 tracking-tight">For Senior Professionals</h2>
            <p className="text-gray-600 mb-8 text-base leading-relaxed">
              You aren't looking for a job, but you need to know your market value. Build an anonymous profile in 3 minutes and receive your Market Pulse.
            </p>
            <ul className="space-y-4 mb-8">
              <li className="flex items-center gap-3 text-gray-800 font-medium">
                <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center text-green-700 flex-shrink-0">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7"/></svg>
                </div>
                100% Identity Protection
              </li>
              <li className="flex items-center gap-3 text-gray-800 font-medium">
                <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center text-green-700 flex-shrink-0">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7"/></svg>
                </div>
                Blocked from current employer
              </li>
              <li className="flex items-center gap-3 text-gray-800 font-medium">
                <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center text-green-700 flex-shrink-0">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7"/></svg>
                </div>
                Mutual opt-in introductions only
              </li>
            </ul>
          </div>

          {/* For Gladiators */}
          <div className="flex-1 p-10 md:p-20 hover:bg-red-50/30 transition-colors">
            <div className="w-14 h-14 bg-red-100 text-red-900 rounded-2xl flex items-center justify-center mb-8 shadow-sm border border-red-200">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
            </div>
            <h2 className="text-3xl font-extrabold text-gray-900 mb-4 tracking-tight">For Hiring Teams</h2>
            <p className="text-gray-600 mb-8 text-base leading-relaxed">
              Stop paying 20% recruiter fees for senior talent. Access a pre-qualified bench of passive candidates who are quietly open to the right signal.
            </p>
            <ul className="space-y-4 mb-8">
              <li className="flex items-center gap-3 text-gray-800 font-medium">
                <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center text-green-700 flex-shrink-0">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7"/></svg>
                </div>
                Zero placement fees
              </li>
              <li className="flex items-center gap-3 text-gray-800 font-medium">
                <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center text-green-700 flex-shrink-0">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7"/></svg>
                </div>
                Reach passive, top-tier talent
              </li>
              <li className="flex items-center gap-3 text-gray-800 font-medium">
                <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center text-green-700 flex-shrink-0">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7"/></svg>
                </div>
                220-character Flash Briefs
              </li>
            </ul>
          </div>

        </div>
      </section>

      {/* ─── TESTIMONIALS ─── */}
      <section className="max-w-5xl mx-auto px-6 py-24">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-16 tracking-tight">The Market is Quietly Shifting</h2>
        <div className="grid md:grid-cols-2 gap-8">
          
          <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex gap-1 text-yellow-400 mb-6">
              {[1, 2, 3, 4, 5].map(star => (
                <svg key={star} className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
              ))}
            </div>
            <p className="text-gray-700 italic mb-6 leading-relaxed">
              "I didn't want to update my LinkedIn and tip off my current employer. Job Lounge gave me exactly what I needed—I received a High Pulse and two signals within 48 hours without exposing my identity."
            </p>
            <div className="font-bold text-gray-900">— Director of IT Audit, Big 4</div>
          </div>

          <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex gap-1 text-yellow-400 mb-6">
              {[1, 2, 3, 4, 5].map(star => (
                <svg key={star} className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
              ))}
            </div>
            <p className="text-gray-700 italic mb-6 leading-relaxed">
              "We were paying external recruiters 20% to find risk specialists who were perfectly happy where they were. The Flash Brief system forces our hiring managers to be clear, and we get matched directly with pre-qualified talent."
            </p>
            <div className="font-bold text-gray-900">— Head of Talent, Fintech</div>
          </div>

        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="bg-white border-t border-gray-200 text-gray-500 py-12 text-sm text-center">
        <div className="max-w-7xl mx-auto px-6 flex flex-col items-center">
          <div className="font-extrabold text-xl tracking-tight text-blue-900 mb-4 flex items-center gap-2">
            <div className="w-6 h-6 bg-blue-900 rounded-md flex items-center justify-center text-white text-xs shadow-sm">
              JL
            </div>
            Job Lounge
          </div>
          <p className="mb-6 max-w-md text-gray-500">The private, dual-blind market intelligence platform for top-tier professionals and hiring teams.</p>
          <div className="flex gap-6 mb-8">
            <a href="#" className="hover:text-blue-900 transition-colors font-medium">Privacy Architecture</a>
            <a href="#" className="hover:text-blue-900 transition-colors font-medium">Manifesto</a>
            <a href="#" className="hover:text-blue-900 transition-colors font-medium">Support</a>
          </div>
          <div className="text-gray-400 font-medium">© 2026 Job Lounge. All rights reserved. Built for corporate India.</div>
        </div>
      </footer>

    </main>
  );
}