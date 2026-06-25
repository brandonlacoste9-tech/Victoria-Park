"use client";

import { VapiWebCallButton } from "@/components/vapi-web-call-button";
import { Sparkles, ShieldCheck } from "lucide-react";

export default function VictoriaParkDemo() {
  return (
    <div className="min-h-screen bg-[#050505] text-[#FAFAFA] font-sans selection:bg-[#d4af37]/30 selection:text-white flex flex-col items-center justify-center p-4 relative overflow-hidden">
      
      {/* Subtle Background Glows */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-[#d4af37]/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-[#d4af37]/5 rounded-full blur-[100px] pointer-events-none" />

      {/* Main Content Card */}
      <div className="relative z-10 w-full max-w-2xl mx-auto rounded-3xl border border-white/10 bg-white/5 p-8 md:p-12 backdrop-blur-xl shadow-2xl flex flex-col items-center text-center">
        
        {/* Logo Area */}
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-[#d4af37] to-[#8a7322] shadow-[0_0_30px_rgba(212,175,55,0.3)] mb-8">
          <Sparkles className="h-8 w-8 text-black" />
        </div>

        <h1 className="text-3xl md:text-5xl font-serif tracking-tight text-white mb-2">
          Victoria Park
        </h1>
        <p className="text-sm tracking-[0.3em] text-[#d4af37] uppercase font-semibold mb-8">
          Digital Concierge
        </p>

        <p className="text-white/70 max-w-md mx-auto mb-10 leading-relaxed font-light">
          Experience our intelligent AI assistant. Trained on our clinical protocols, it is ready to answer questions and secure your consultation instantly.
        </p>

        {/* The Action Button */}
        <div className="w-full flex justify-center mb-8 hover:scale-105 transition-transform duration-300">
          <VapiWebCallButton />
        </div>

        {/* Footer info inside card */}
        <div className="flex items-center gap-2 text-xs text-white/40 border-t border-white/10 pt-6 mt-2 w-full justify-center">
          <ShieldCheck className="h-4 w-4" />
          <span>Available 24/7 in English & Français</span>
        </div>
      </div>
      
      {/* Secret Staff Login link at bottom */}
      <a href="/dashboard" className="absolute bottom-8 text-xs text-white/20 hover:text-white/50 transition-colors">
        Staff Login
      </a>
    </div>
  );
}
