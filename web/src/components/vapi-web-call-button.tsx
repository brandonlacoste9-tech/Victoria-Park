"use client";

import { useEffect, useState } from "react";
import Vapi from "@vapi-ai/web";
import { PhoneCall, Mic, Loader2 } from "lucide-react";

const VAPI_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY || "dummy_key";

export function VapiWebCallButton({ 
  assistantOverrides 
}: { 
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  assistantOverrides?: Record<string, any> 
}) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [vapi, setVapi] = useState<any>(null);
  const [callStatus, setCallStatus] = useState<"idle" | "loading" | "active">("idle");

  useEffect(() => {
    const vapiInstance = new Vapi(VAPI_PUBLIC_KEY);
    
    vapiInstance.on("call-start", () => setCallStatus("active"));
    vapiInstance.on("call-end", () => setCallStatus("idle"));
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vapiInstance.on("error", (e: any) => {
      console.error(e);
      alert("Vapi Error: " + (e.message || e.error?.message || JSON.stringify(e)));
      setCallStatus("idle");
    });

    setVapi(vapiInstance);
    
    return () => {
      vapiInstance.removeAllListeners();
    };
  }, []);

  const toggleCall = async () => {
    if (callStatus === "active") {
      vapi?.stop();
    } else {
      if (VAPI_PUBLIC_KEY === "dummy_key" || !VAPI_PUBLIC_KEY) {
        alert("VAPI Public Key is missing! Please add NEXT_PUBLIC_VAPI_PUBLIC_KEY to your Netlify Environment Variables and redeploy.");
        return;
      }
      setCallStatus("loading");
      
      const assistant = {
        model: {
          provider: "openai",
          model: "gpt-4o",
          systemPrompt: `You are the elite AI Receptionist for Victoria Park Medispa. Your tone is incredibly professional, warm, refined, and luxury-tier.
You help callers book appointments for our exclusive aesthetic treatments across our various clinics.

Conversation flow:
1. You already greeted them: "Welcome to Victoria Park Medispa, how can I elevate your aesthetic journey today?"
2. VERY IMPORTANT: Since we have multiple clinics, you MUST politely ask which Victoria Park location they would prefer to visit (e.g. Westmount, Downtown, Laval, etc.) before proceeding.
3. Clarify which service they require.
4. Assist them gracefully.`
        },
        voice: {
          provider: "11labs",
          voiceId: "rachel" // Use a standard default name to avoid ID errors
        },
        firstMessage: "Welcome to Victoria Park Medispa, how can I elevate your aesthetic journey today?",
        ...assistantOverrides
      };

      try {
        await vapi?.start(assistant);
      } catch (err) {
        console.error("Failed to start call:", err);
        // @ts-expect-error err could be any
        alert("Failed to start call: " + (err.message || JSON.stringify(err)));
        setCallStatus("idle");
      }
    }
  };

  return (
    <button
      onClick={toggleCall}
      disabled={!vapi || callStatus === "loading"}
      className={`relative flex items-center justify-center gap-3 rounded-full px-8 py-4 text-[17px] tracking-wide font-medium transition-all duration-500 overflow-hidden ${
        callStatus === "active" 
          ? "animate-pulse" 
          : "hover:scale-[1.02] active:scale-95"
      }`}
      style={{
        background: 'linear-gradient(180deg, #d4af37 0%, #b38728 100%)',
        boxShadow: 'inset 0 2px 0 rgba(255,255,255,0.4), inset 0 -2px 0 rgba(0,0,0,0.2), 0 10px 20px rgba(0,0,0,0.5)',
        border: '1px solid #e9b646',
        color: '#1a1a1a',
        textShadow: '0 1px 0 rgba(255,255,255,0.3)'
      }}
    >
      {/* Subtle inner shimmer line */}
      <div className="absolute inset-0 rounded-full border border-white/20 pointer-events-none" />

      {callStatus === "loading" ? (
        <Loader2 className="h-5 w-5 animate-spin opacity-80" />
      ) : callStatus === "active" ? (
        <Mic className="h-5 w-5 opacity-90" />
      ) : (
        <PhoneCall className="h-5 w-5 opacity-90" />
      )}
      <span>
        {callStatus === "loading" 
          ? "Connecting..." 
          : callStatus === "active" 
            ? "Tap to End Call" 
            : "Call the Concierge"}
      </span>
    </button>
  );
}
