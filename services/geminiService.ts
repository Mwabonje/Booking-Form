
/**
 * Uses Gemini to refine a rough draft of a booking inquiry into a professional message.
 */
export const refineMessageWithGemini = async (draftMessage: string, subject: string): Promise<string> => {
  try {
    const response = await fetch('/api/refine-message', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ draftMessage, subject }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        console.warn("Rate limit exceeded.");
        return draftMessage; // Fallback to original
      }
      throw new Error(`Server error: ${response.status}`);
    }

    const data = await response.json();
    return data.refinedMessage || draftMessage;
  } catch (error) {
    console.error("Error refining message with Gemini:", error);
    // Fallback to original text if API fails
    return draftMessage;
  }
};