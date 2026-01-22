import { GoogleGenAI } from "@google/genai";

/**
 * Uses Gemini to refine a rough draft of a booking inquiry into a professional message.
 */
export const refineMessageWithGemini = async (draftMessage: string, subject: string): Promise<string> => {
  if (!process.env.API_KEY) {
    console.warn("API Key not found. Returning original message.");
    return draftMessage;
  }

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const prompt = `
      You are a helpful assistant for "Mwabonje", a high-end photography business. 
      Refine the following user inquiry to be more professional, polite, and concise, while keeping the original intent.
      The inquiry is about: ${subject}.
      
      User's rough draft: "${draftMessage}"
      
      Return ONLY the refined message text. Do not add quotes or conversational filler.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });

    return response.text?.trim() || draftMessage;
  } catch (error) {
    console.error("Error refining message with Gemini:", error);
    // Fallback to original text if AI fails
    return draftMessage;
  }
};