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
      setCallStatus("loading");
      
      const assistant = {
        model: {
          provider: "openai",
          model: "gpt-4o",
          systemPrompt: assistantOverrides?.voiceGreeting || "Hello, how can I help?"
        },
        voice: {
          provider: "openai",
          voiceId: "alloy"
        },
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
