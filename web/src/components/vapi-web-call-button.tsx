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
          provider: "openai",
          voiceId: "alloy"
        },
        firstMessage: "Welcome to Victoria Park Medispa, how can I elevate your aesthetic journey today?",
        ...assistantOverrides
      };

      try {
        await vapi?.start(assistant);
      } catch (err) {
        console.error("Failed to start call:", err);
        setCallStatus("idle");
      }
    }
  };

  return (
    <button
      onClick={toggleCall}
      disabled={!vapi || callStatus === "loading"}
      className={`flex items-center justify-center gap-3 rounded-full px-8 py-4 text-lg font-semibold transition-all shadow-xl ${
        callStatus === "active" 
          ? "bg-red-500 text-white hover:bg-red-600 animate-pulse" 
          : "bg-gradient-to-r from-[#d4af37] to-[#a38020] text-black hover:scale-105"
      }`}
    >
      {callStatus === "loading" && <Loader2 className="h-6 w-6 animate-spin" />}
      {callStatus === "idle" && <PhoneCall className="h-6 w-6" />}
      {callStatus === "active" && <Mic className="h-6 w-6" />}
      
      {callStatus === "loading" ? "Connecting..." : callStatus === "active" ? "End Call" : "Call the Concierge"}
    </button>
  );
}
