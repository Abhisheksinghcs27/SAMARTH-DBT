
import { GoogleGenAI, Type } from "@google/genai";

const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const analyzeCaseForVerification = async (firData: any, victimStatement: string) => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `As a Legal Compliance Officer for the Ministry of Social Justice, analyze the consistency between the CCTNS FIR record and the Victim's statement for DBT eligibility.
    
    CCTNS RECORD: ${JSON.stringify(firData)}
    VICTIM STATEMENT: ${victimStatement}
    
    Evaluate based on:
    1. Direct identity match.
    2. Consistency of incident details.
    3. Proper section invocation (SC/ST Act 1989 or PCR Act 1955).`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          isVerified: { type: Type.BOOLEAN },
          score: { type: Type.NUMBER, description: "Confidence score 0-100" },
          remarks: { type: Type.STRING },
          matchedFields: { 
            type: Type.ARRAY, 
            items: { type: Type.STRING } 
          }
        },
        required: ["isVerified", "score", "remarks", "matchedFields"]
      }
    }
  });
  return JSON.parse(response.text || '{}');
};

export const getLegalGuidance = async (query: string, history: {role: 'user' | 'ai', text: string}[]) => {
  const ai = getAI();
  const chatHistory = history.map(h => ({
    role: h.role === 'user' ? 'user' : 'model',
    parts: [{ text: h.text }]
  }));

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: {
      parts: [
        { text: `System: You are 'Justice Aide', a highly specialized legal assistant for the PCR Act 1955 and PoA Act 1989. 
        Your goal is to help marginalized communities understand their rights to financial relief and the DBT process. 
        Be compassionate, clear, and cite specific sections of the law when relevant. 
        Keep responses under 150 words.
        
        User Query: ${query}` }
      ]
    }
  });
  return response.text;
};
