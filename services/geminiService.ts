import { GoogleGenAI, Type } from "@google/genai";
import { Song } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const fetchSongDetails = async (query: string): Promise<Omit<Song, 'id'>> => {
  const model = "gemini-3-flash-preview";
  
  const prompt = `
    Você é um diretor de música de igreja experiente.
    O usuário quer a cifra e letra da música: "${query}".
    
    Retorne um objeto JSON com:
    - title: Título da música
    - artist: Nome do artista/banda
    - key: Tom original (ex: G, Cm)
    - bpm: BPM aproximado (apenas número, ex: 72)
    - content: A letra completa com cifras colocadas acima das sílabas corretas. Use formatação padrão de cifras.
  `;

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            artist: { type: Type.STRING },
            key: { type: Type.STRING },
            bpm: { type: Type.STRING },
            content: { type: Type.STRING },
          },
          required: ["title", "artist", "key", "bpm", "content"],
        },
      },
    });

    const text = response.text;
    if (!text) throw new Error("Sem resposta do Gemini");

    return JSON.parse(text);
  } catch (error) {
    console.error("Erro ao buscar música:", error);
    throw new Error("Falha ao gerar cifra. Tente novamente.");
  }
};

export const suggestSetlist = async (theme: string): Promise<string[]> => {
    const model = "gemini-3-flash-preview";
    const prompt = `Sugira 5 músicas de louvor populares no Brasil com o tema: "${theme}". Retorne apenas uma lista JSON de strings com "Título - Artista".`;

    try {
        const response = await ai.models.generateContent({
            model: model,
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING }
                }
            }
        });
        const text = response.text;
        return text ? JSON.parse(text) : [];
    } catch (e) {
        return [];
    }
}