
import { GoogleGenAI } from "@google/genai";
import { DrawnNumber } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzeNumbers = async (numbers: DrawnNumber[]): Promise<string> => {
  const whiteNumbers = numbers.filter(n => n.type === 'WHITE').map(n => n.value).join(', ');
  const powerball = numbers.find(n => n.type === 'POWERBALL')?.value;

  const prompt = `
    I just drew these Powerball numbers: White balls [${whiteNumbers}] and Powerball [${powerball}].
    The numbers were generated using high-precision millisecond timestamps of my clicks.
    Act as a mystical fortune teller and lottery expert. Give me a short (2-3 sentence) "Destiny Reading" for this specific set of numbers. 
    Tell me about the "vibe" of these numbers. Be encouraging and mysterious.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text || "The stars are silent on these numbers, but your journey is just beginning.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "The cosmic energies are turbulent right now. Your luck remains your own to command.";
  }
};
