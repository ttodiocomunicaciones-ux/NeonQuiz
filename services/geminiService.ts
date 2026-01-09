import { GoogleGenAI, Type } from "@google/genai";
import { Question } from '../types';
import { getQuestionsFromDB } from './questionsData';
import { THEMES } from '../constants';

export const generateQuestions = async (themeId: string, level: number): Promise<Question[]> => {
  const theme = THEMES.find(t => t.id === themeId);
  const themeName = theme ? theme.name : themeId;

  try {
    // Initialization using standard pattern from guidelines
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Genera exactamente 12 preguntas de opción múltiple en español sobre el tema "${themeName}" para un nivel de dificultad ${level} de 6.
      
      Reglas:
      1. Las opciones deben ser creíbles pero solo una debe ser correcta.
      2. El tono debe ser profesional y emocionante.
      3. Responde estrictamente con un objeto JSON siguiendo el esquema proporcionado.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              text: { 
                type: Type.STRING,
                description: "El enunciado de la pregunta."
              },
              options: { 
                type: Type.ARRAY, 
                items: { type: Type.STRING },
                description: "Cuatro opciones de respuesta."
              },
              correctIndex: { 
                type: Type.INTEGER,
                description: "Índice (0-3) de la respuesta correcta."
              }
            },
            required: ["text", "options", "correctIndex"]
          }
        }
      }
    });

    const jsonStr = response.text;
    if (jsonStr) {
      const questionsData = JSON.parse(jsonStr);
      return questionsData.map((q: any, i: number) => ({
        ...q,
        id: `ai-${themeId}-${level}-${i}-${Date.now()}`
      }));
    }
  } catch (error) {
    console.error("Gemini Generation failed, falling back to local DB:", error);
  }

  // Fallback to local DB if AI fails or apiKey is missing
  return getQuestionsFromDB(themeId, level);
};