"use client";

import { VapiWebCallButton } from "@/components/vapi-web-call-button";
import Image from "next/image";
import { Sparkles, ArrowRight, ShieldCheck, Clock, MapPin } from "lucide-react";

export default function VictoriaParkHomepage() {
  return (
    <div className="min-h-screen bg-[#050505] text-[#FAFAFA] font-sans selection:bg-[#d4af37]/30 selection:text-white">
      
      {/* NATIVE HEADER */}
      <header className="fixed top-0 left-0 right-0 z-50 flex h-24 items-center justify-between px-8 lg:px-16 bg-[#050505]/80 backdrop-blur-md border-b border-white/5 transition-all">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-[#d4af37] to-[#8a7322] shadow-[0_0_15px_rgba(212,175,55,0.4)]">
            <Sparkles className="h-6 w-6 text-black" />
          </div>
          <div className="flex flex-col">
            <span className="text-2xl font-serif tracking-widest text-[#d4af37] uppercase leading-none">Victoria Park</span>
            <span className="text-xs tracking-[0.3em] text-white/50 uppercase mt-1">Medispa</span>
          </div>
        </div>
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium tracking-wide text-white/70">
          <a href="#treatments" className="hover:text-[#d4af37] transition-colors">Treatments</a>
          <a href="#clinics" className="hover:text-[#d4af37] transition-colors">Our Clinics</a>
          <a href="#about" className="hover:text-[#d4af37] transition-colors">The Philosophy</a>
          <a href="/dashboard" className="text-xs opacity-50 hover:opacity-100 transition-opacity">Staff Login</a>
        </nav>
      </header>

      <main>
        {/* HERO SECTION */}
        <section className="relative min-h-[100dvh] flex items-center pt-24 overflow-hidden">
          {/* Background Image with Overlay */}
          <div className="absolute inset-0 z-0">
            <Image 
              src="/med_spa_hero.png" 
              alt="Victoria Park Medispa Luxury Interior" 
              fill
              priority
              className="object-cover opacity-40 scale-105 animate-[slow-zoom_20s_ease-in-out_infinite_alternate]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/80 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#050505] via-transparent to-transparent" />
          </div>

          <div className="relative z-10 w-full px-8 lg:px-16 max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-16">
            <div className="flex-1 space-y-8">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#d4af37]/30 bg-[#d4af37]/10 px-4 py-1.5 text-sm font-medium text-[#d4af37] backdrop-blur-sm">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#d4af37] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#d4af37]"></span>
                </span>
                AI Concierge Available 24/7
              </div>
              
              <h1 className="font-serif text-6xl md:text-7xl lg:text-8xl leading-[1.1] tracking-tight">
                The Pinnacle of <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#d4af37] via-[#f3e5ab] to-[#a38020]">
                  Aesthetic Medicine.
                </span>
              </h1>
              
              <p className="text-xl md:text-2xl text-white/70 max-w-2xl font-light leading-relaxed">
                Experience world-class treatments in Westmount. Connect with our intelligent digital concierge to secure your consultation instantly, at any hour.
              </p>

              <div className="flex flex-col sm:flex-row items-center gap-6 pt-4">
                <div className="w-full sm:w-auto hover:scale-105 transition-transform duration-300">
                  <VapiWebCallButton />
                </div>
                <div className="flex items-center gap-4 text-sm text-white/50">
                  <div className="flex -space-x-3">
                    <img className="w-10 h-10 rounded-full border-2 border-[#050505]" src="https://i.pravatar.cc/100?img=1" alt="Patient" />
                    <img className="w-10 h-10 rounded-full border-2 border-[#050505]" src="https://i.pravatar.cc/100?img=5" alt="Patient" />
                    <img className="w-10 h-10 rounded-full border-2 border-[#050505]" src="https://i.pravatar.cc/100?img=9" alt="Patient" />
                  </div>
                  <p>Join 10,000+ <br/> satisfied clients.</p>
                </div>
              </div>
            </div>
            
            {/* Right side floating glass card */}
            <div className="hidden lg:flex w-full max-w-md flex-col gap-6 rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#d4af37]/20 blur-[50px] rounded-full" />
              
              <h3 className="text-2xl font-serif text-white">Why speak to our AI?</h3>
              <ul className="space-y-6 mt-4">
                <li className="flex gap-4">
                  <div className="h-10 w-10 shrink-0 rounded-full bg-[#d4af37]/10 flex items-center justify-center border border-[#d4af37]/20">
                    <Clock className="h-5 w-5 text-[#d4af37]" />
                  </div>
                  <div>
                    <h4 className="font-medium text-white text-lg">Zero Wait Time</h4>
                    <p className="text-white/60 text-sm mt-1">Skip the hold music. Get answers and book immediately, 24/7.</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="h-10 w-10 shrink-0 rounded-full bg-[#d4af37]/10 flex items-center justify-center border border-[#d4af37]/20">
                    <ShieldCheck className="h-5 w-5 text-[#d4af37]" />
                  </div>
                  <div>
                    <h4 className="font-medium text-white text-lg">Clinical Expertise</h4>
                    <p className="text-white/60 text-sm mt-1">Trained directly on our specialized laser and injectable protocols.</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* SERVICES SECTION */}
        <section id="treatments" className="py-32 px-8 lg:px-16 max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end gap-8 mb-16">
            <div>
              <p className="text-[#d4af37] tracking-widest uppercase text-sm font-semibold mb-4">Our Expertise</p>
              <h2 className="font-serif text-5xl text-white">Signature Treatments</h2>
            </div>
            <button className="flex items-center gap-2 text-white/70 hover:text-white transition-colors pb-2 border-b border-white/20 hover:border-white">
              View full catalog <ArrowRight className="h-4 w-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { title: "Botox & Dysport", desc: "Premium neuromodulators to soften fine lines and restore a youthful, rested appearance.", price: "From $500" },
              { title: "Fraxel Laser", desc: "Fractional skin resurfacing to correct pigmentation, texture, and stimulate collagen.", price: "From $800" },
              { title: "CoolSculpting", desc: "Non-invasive, targeted fat-freezing to permanently eliminate stubborn areas.", price: "From $1200" }
            ].map((service, i) => (
              <div key={i} className="group relative rounded-2xl bg-[#111] p-8 border border-white/5 hover:border-[#d4af37]/50 transition-all duration-500 overflow-hidden cursor-pointer">
                <div className="absolute inset-0 bg-gradient-to-br from-[#d4af37]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <h3 className="text-2xl font-serif text-white mb-3">{service.title}</h3>
                <p className="text-white/50 text-sm leading-relaxed mb-8 h-16">{service.desc}</p>
                <div className="flex justify-between items-center pt-6 border-t border-white/10">
                  <span className="text-[#d4af37] font-medium">{service.price}</span>
                  <span className="text-white/30 group-hover:text-white transition-colors">
                    <ArrowRight className="h-5 w-5" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* IMAGE BREAK SECTION */}
        <section className="relative h-[60vh] w-full border-y border-white/10">
           <Image 
              src="/med_spa_treatment.png" 
              alt="Victoria Park Treatment Room" 
              fill
              className="object-cover opacity-60"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#050505] to-transparent" />
        </section>
      </main>

      {/* FOOTER */}
      <footer className="py-12 px-8 lg:px-16 border-t border-white/5 text-center text-sm text-white/30">
        <p>© 2026 Victoria Park Medispa. Powered by Next-Gen AI.</p>
      </footer>
      
    </div>
  );
}
