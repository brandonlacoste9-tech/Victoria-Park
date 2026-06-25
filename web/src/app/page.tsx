"use client";

import { VapiWebCallButton } from "@/components/vapi-web-call-button";
import { Sparkles, ShieldCheck } from "lucide-react";

export default function VictoriaParkDemo() {
  return (
    <div className="min-h-screen bg-black text-[#FAFAFA] font-sans selection:bg-[#d4af37]/30 selection:text-white flex flex-col items-center justify-center p-4 relative overflow-hidden">
      
      {/* Massive golden sunlight glow behind the card */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] md:w-[700px] h-[500px] md:h-[700px] bg-[#d4af37] opacity-[0.25] blur-[100px] rounded-full pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-[#fff7d6] opacity-20 blur-[80px] rounded-full pointer-events-none" />

      {/* Main Content Card - Leather Texture & Gold Border */}
      <div className="relative z-10 w-full max-w-[420px] mx-auto rounded-[32px] p-10 md:p-12 shadow-[0_30px_60px_rgba(0,0,0,0.8)] flex flex-col items-center text-center overflow-hidden"
           style={{
             background: 'linear-gradient(180deg, #161616 0%, #0a0a0a 100%)',
             border: '1px solid rgba(212, 175, 55, 0.3)',
             boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.1), 0 20px 50px rgba(0,0,0,0.9), 0 0 40px rgba(212, 175, 55, 0.1)'
           }}>
        
        {/* Subtle leather noise overlay */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
             style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.85%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}></div>

        {/* Logo Area - Metallic Gold Coin */}
        <div className="relative flex h-[72px] w-[72px] items-center justify-center rounded-full mb-6 z-10 shadow-[0_10px_20px_rgba(0,0,0,0.5),inset_0_2px_4px_rgba(255,255,255,0.5),inset_0_-2px_4px_rgba(0,0,0,0.5)]"
             style={{
               background: 'linear-gradient(135deg, #f9d976 0%, #e9b646 50%, #b48529 100%)',
               border: '2px solid #fff3cd'
             }}>
          {/* Inner ring */}
          <div className="absolute inset-[3px] rounded-full border border-[rgba(0,0,0,0.1)] flex items-center justify-center">
            <Sparkles className="h-8 w-8 text-black/80 drop-shadow-[0_1px_0_rgba(255,255,255,0.4)]" />
          </div>
        </div>

        {/* Victoria Park Logo (with clip-path to slice off the screenshot artifacts on the edges) */}
        <img src="/logo.png" alt="Victoria Park Medispa" className="h-24 md:h-32 object-contain mb-4 mix-blend-screen [clip-path:inset(0_16px_0_16px)]" />

        {/* Subtitle - Metallic Gradient */}
        <p className="text-[11px] tracking-[0.35em] uppercase font-bold mb-8 z-10"
           style={{
             background: 'linear-gradient(90deg, #d4af37 0%, #fff2cd 50%, #d4af37 100%)',
             WebkitBackgroundClip: 'text',
             WebkitTextFillColor: 'transparent',
           }}>
          Digital Concierge
        </p>

        <p className="text-white/90 text-[15px] mx-auto mb-10 leading-[1.6] font-normal z-10 drop-shadow-sm">
          Experience our intelligent AI assistant. Trained on our clinical protocols, it is ready to answer questions and secure your consultation instantly.
        </p>

        {/* The Action Button Container */}
        <div className="w-full flex flex-col items-center gap-4 mb-8 z-10 relative">
           {/* Intense Outer Glow for the button */}
           <div className="absolute top-0 w-full h-[56px] bg-[#d4af37] blur-[30px] opacity-30 rounded-full pointer-events-none" />
           
           <div className="relative w-[280px]">
             <VapiWebCallButton />
           </div>

           {/* View Dashboard Button */}
           <a 
             href="/dashboard"
             className="relative w-[280px] flex items-center justify-center gap-2 rounded-full px-8 py-3 text-[14px] tracking-widest uppercase font-semibold border border-white/10 bg-white/5 hover:bg-white/10 text-white transition-all duration-300"
           >
             View Dashboard
           </a>
        </div>

        {/* Footer info inside card */}
        <div className="flex items-center gap-2 text-[11px] text-white/50 border-t border-white/5 pt-6 mt-2 w-full justify-center z-10 font-light">
          <ShieldCheck className="h-3.5 w-3.5 opacity-80" />
          <span>Available 24/7 in English & Français</span>
        </div>
      </div>
      
      {/* Secret Staff Login link at bottom */}
      <a href="/dashboard" className="absolute bottom-8 text-xs text-white/20 hover:text-white/50 transition-colors z-10">
        Staff Login
      </a>
    </div>
  );
}
