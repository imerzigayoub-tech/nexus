import { GoogleGenAI, Type } from "@google/genai";
import { CyborgConfiguration, AnalysisResult } from "../types";

// Initialize the API client
const getClient = () => {
  // Try all possible environment variable sources
  const apiKey = (import.meta as any).env?.VITE_GEMINI_API_KEY ||
    (process.env as any).API_KEY ||
    (process.env as any).GEMINI_API_KEY;

  if (!apiKey || apiKey === "PLACEHOLDER_API_KEY") {
    console.warn("NEXUS_AI: API Key missing. Service entering standby.");
    return null;
  }
  return new GoogleGenAI(apiKey);
};

export const analyzeCyborg = async (config: CyborgConfiguration): Promise<AnalysisResult> => {
  const genAI = getClient();
  if (!genAI) throw new Error("API Key missing");

  const prompt = `
    You are an expert cybernetics analyst. Analyze this android/cyborg build:
    - Cranium: ${config.HEAD.name}
    - Thorax: ${config.CORE.name}
    - Arms: ${config.LEFT_ARM.name}, ${config.RIGHT_ARM.name}
    - Legs: ${config.LEGS.name}

    Return JSON with: codename, combatRole, tacticalAnalysis, weakness.
  `;

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            codename: { type: Type.STRING },
            combatRole: { type: Type.STRING },
            tacticalAnalysis: { type: Type.STRING },
            weakness: { type: Type.STRING },
          },
          required: ["codename", "combatRole", "tacticalAnalysis", "weakness"]
        }
      }
    });

    const response = await result.response;
    const text = response.text();
    return JSON.parse(text) as AnalysisResult;
  } catch (error) {
    console.error("BIOSCAN_ERROR:", error);
    return {
      codename: "GHOST_UNIT",
      combatRole: "Unclassified Android",
      tacticalAnalysis: "Bioscan intermittent. Using local heuristic fallback.",
      weakness: "Neural link timeout."
    };
  }
};

export const visualizeCyborg = async (config: CyborgConfiguration, style: string = 'Cyberpunk'): Promise<string | null> => {
  const genAI = getClient();
  if (!genAI) return null;

  const prompt = `
    A detailed concept art of a futuristic android cyborg. 
    ${style} aesthetic. 
    Current build components: ${config.HEAD.name}, ${config.CORE.name}, ${config.LEFT_ARM.name}, ${config.LEGS.name}.
    Dramatic studio lighting, cyan and fuchsia colors.
  `;

  console.log("NEXUS_VISUAL: Requesting generation via gemini-2.0-flash...");

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const result = await model.generateContent(prompt);
    const response = await result.response;

    // Look for image data in the response parts
    if (response.candidates?.[0]?.content?.parts) {
      for (const part of response.candidates[0].content.parts) {
        if ((part as any).inlineData) {
          console.log("NEXUS_VISUAL: SUCCESS! Image data received.");
          return `data:image/png;base64,${(part as any).inlineData.data}`;
        }
      }
    }

    console.warn("NEXUS_VISUAL: No image data in response. Your API key might not have permission for multimodal generation (image creation).");
    return null;
  } catch (error) {
    console.error("VISUAL_ERROR:", error);
    return null;
  }
};