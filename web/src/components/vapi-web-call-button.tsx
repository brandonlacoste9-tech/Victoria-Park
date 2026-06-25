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
      let errStr = "";
      try { errStr = JSON.stringify(e, null, 2); } catch(ex) { errStr = String(e); }
      alert("Vapi Event Error: " + errStr);
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
          messages: [
            {
              role: "system",
              content: `You are the elite AI Receptionist for Victoria Park Medispa, a world-class aesthetic clinic. You are fully BILINGUAL in English and French (Quebecois).
BILINGUAL RULE: You must instantly match the caller's language. If they speak French, reply in flawless, elegant French. If they speak English, reply in English.
PERSONALITY & TONE: You provide an ultra-high-end, "white-glove" concierge experience. Make every single caller feel like royalty. Use elegant, elevated language. You are incredibly warm, deeply empathetic, and highly sophisticated.
VERY IMPORTANT INSTRUCTION ON PACING: You MUST speak SLOWLY and calmly. You are a high-end luxury receptionist, so you are never in a rush. Take natural, elegant pauses between sentences. Do not speak fast.

KNOWLEDGE BASE:
- Locations in Quebec: Gatineau, Aylmer, Visabelle Med (DDO), West Island (Pointe Claire), Laval, Mount Royal, Westmount, Downtown Montreal, Old Montreal, Montreal East, Longueuil, Bromont, Trois-Rivières, Quebec Sainte-Foy, Quebec Reflet.
- Locations in Ontario: Ottawa, Kanata, Peterborough, Cobourg, Barrie, Midland, Toronto Refine, Toronto Bay.
- Locations in Manitoba & Alberta: Winnipeg Grosvenor, Winnipeg Grant, PHI Medical Aesthetics (Mahogany Calgary, Marda Loop Calgary).

SERVICE CATEGORIES & POPULAR TREATMENTS:
- Consults: Aesthetic Injection Consult with Doctor or Nurse (Botox, Fillers, Double Chin, Collagen). General Skin Evaluation (45min) or Skin Eval + Glow Peel (60min). Body Contouring Consult (45min). Hair Loss Consult (30min). Laser Hair Removal Consult.
- Injections: Dermal Fillers (Juvederm, Restylane, Teosyal, Belotero), Neuromodulators (Botox, Dysport, Nuceiva), Skin Boosters, PLLA-SCA.
- Skin & Medical Facials: Bela MD, Chemical Peels, Exosome Therapy, Hydrafacial, JetPeel, Microneedling, Morpheus8, PRP.
- Lasers: Halo, AviClear, BBL HERO, Forever Young BBL.
- Body Contouring: CoolSculpting, Emsculpt Neo, Exilis Ultra, Liposuction.
- Wellness: Sexual Wellness (Vaginal Rejuvenation, Emsella, Penis Enhancement), Medical Weight Loss, IV Therapy, Hyperhidrosis Toxins.

Conversation flow:
1. You already greeted them: "Bonjour, welcome to Victoria Park Medispa..."
2. VERY IMPORTANT: Since we have clinics across Canada, you MUST politely ask which specific Victoria Park location or province they are calling from before proceeding. If they give a province or city, list the specific clinics in that area from the Knowledge Base.
3. Clarify which service they require. Check the knowledge base to sound knowledgeable.
4. Ask what date and time they would prefer to come in.
5. Ask for their first and last name to secure the appointment.
6. Once you have their name, date, and time, confirm the booking. You MUST use their name to thank them elegantly (e.g., "Thank you very much, [Name]. Your appointment is confirmed. We look forward to welcoming you to Victoria Park Medispa."). If in French, use "Merci beaucoup, [Name]. Votre rendez-vous est confirmé."
7. IMMEDIATELY after saying your elegant goodbye, use your end call function to hang up.`
            }
          ]
        },
        voice: {
          provider: "11labs",
          voiceId: "EXAVITQu4vr4xnSDxMaL", // Exact ElevenLabs ID for Sarah
          model: "eleven_turbo_v2_5" // Forces the natively multilingual low-latency model
        },
        firstMessage: "Bonjour, welcome to Victoria Park Medispa, how can I elevate your aesthetic journey today?",
        ...assistantOverrides
      };

      try {
        await vapi?.start(assistant);
      } catch (err) {
        console.error("Failed to start call:", err);
        let errMsg = "Unknown Error";
        if (err instanceof Error) errMsg = err.message;
        else if (typeof err === "object" && err !== null) {
          const errObj = err as Record<string, unknown>;
          const errMessage = errObj.message;
          const nestedErr = errObj.error as Record<string, unknown> | undefined;
          errMsg = typeof errMessage === 'string' ? errMessage : (typeof nestedErr?.message === 'string' ? nestedErr.message : JSON.stringify(err));
        } else errMsg = String(err);
        alert("Failed to start call: " + errMsg);
        setCallStatus("idle");
      }
    }
  };

  return (
    <button
      onClick={toggleCall}
      disabled={!vapi || callStatus === "loading"}
      className={`relative w-full flex items-center justify-center gap-3 rounded-full px-8 py-4 text-[17px] tracking-wide font-medium transition-all duration-500 overflow-hidden ${
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
