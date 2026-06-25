/** Azure neural voices tuned for Quebec service-business reception. */
export function getReceptionistVoice(defaultLanguage: "fr" | "en") {
  if (defaultLanguage === "en") {
    return { provider: "azure" as const, voiceId: "en-CA-ClaraNeural" };
  }
  return { provider: "azure" as const, voiceId: "fr-CA-SylvieNeural" };
}

export function endCallMessage(defaultLanguage: "fr" | "en"): string {
  if (defaultLanguage === "en") {
    return "Thanks for calling. Have a wonderful day!";
  }
  return "Merci d'avoir appelé. Bonne journée!";
}

export function transferMessage(defaultLanguage: "fr" | "en"): string {
  if (defaultLanguage === "en") {
    return "I'll connect you with the team — one moment please.";
  }
  return "Je vous transfère à l'équipe — un instant.";
}