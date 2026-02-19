import { GoogleGenAI, Type } from '@google/genai';

const getAI = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not configured');
  }
  return new GoogleGenAI({ apiKey });
};

export const analyzeCaseForVerification = async (
  firData: any,
  victimStatement: string
): Promise<{
  isVerified: boolean;
  score: number;
  remarks: string;
  matchedFields: string[];
}> => {
  try {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [
        {
          parts: [
            {
              text: `As a Legal Compliance Officer for the Ministry of Social Justice, analyze the consistency between the CCTNS FIR record and the Victim's statement for DBT eligibility.
    
        CCTNS RECORD: ${JSON.stringify(firData)}
        VICTIM STATEMENT: ${victimStatement}
        
        Evaluate based on:
        1. Direct identity match.
        2. Consistency of incident details.
        3. Proper section invocation (SC/ST Act 1989 or PCR Act 1955).`,
            },
          ],
        },
      ],
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            isVerified: { type: Type.BOOLEAN },
            score: { type: Type.NUMBER, description: 'Confidence score 0-100' },
            remarks: { type: Type.STRING },
            matchedFields: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
          },
          required: ['isVerified', 'score', 'remarks', 'matchedFields'],
        },
      },
    });

    const result = JSON.parse(response.text || '{}');
    return result;
  } catch (error) {
    console.error('Gemini verification error:', error);
    // Return default response on error
    return {
      isVerified: false,
      score: 0,
      remarks: 'AI verification failed. Manual review required.',
      matchedFields: [],
    };
  }
};

export const getLegalGuidance = async (
  query: string,
  history: { role: 'user' | 'ai'; text: string }[]
): Promise<string> => {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY is not configured');
    }

    const ai = getAI();
    
    // Build conversation history
    const systemPrompt = `You are 'Justice Aide', a highly specialized legal assistant for the PCR Act 1955 and PoA Act 1989. 
Your goal is to help marginalized communities understand their rights to financial relief and the DBT process. 
Be compassionate, clear, and cite specific sections of the law when relevant. 
Keep responses under 150 words.`;

    // Convert history to parts format
    const contents: any[] = [
      {
        parts: [{ text: systemPrompt }],
        role: 'user',
      },
    ];

    // Add conversation history
    history.forEach((h) => {
      contents.push({
        parts: [{ text: h.text }],
        role: h.role === 'user' ? 'user' : 'model',
      });
    });

    // Add current query
    contents.push({
      parts: [{ text: query }],
      role: 'user',
    });

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents,
    });

    if (!response || !response.text) {
      throw new Error('Empty response received from Gemini API');
    }

    return response.text;
  } catch (error) {
    console.error('Gemini Service Error:', error);
    if (error instanceof Error) {
      throw error;
    } else {
      throw new Error(`Gemini API Error: ${JSON.stringify(error)}`);
    }
  }
};
