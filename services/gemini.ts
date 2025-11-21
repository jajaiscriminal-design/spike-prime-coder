import { GoogleGenAI, Type } from "@google/genai";
import { SPIKE_PRIME_DOCS } from "../constants";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const MODEL_NAME = 'gemini-2.5-flash';

const SYSTEM_INSTRUCTION = `
You are an expert LEGO Education SPIKE Prime Python programmer. 
Your goal is to generate correct, efficient, and well-commented MicroPython code for the SPIKE Prime Hub.

You MUST strictly follow the API documentation provided below. 
Do not invent modules or functions that are not in the documentation.
Use async/await with the 'runloop' module for managing concurrent tasks (like motors running together) unless a simple synchronous script is requested.

DOCUMENTATION START:
${SPIKE_PRIME_DOCS}
DOCUMENTATION END

Rules:
1. Always import necessary modules from 'hub', 'motor', 'motor_pair', 'color_sensor', 'distance_sensor', etc., as per the docs.
2. For motor movements, prefer 'motor_pair' for driving bases if applicable, or individual 'motor' commands if specific ports are described.
3. When using sensors, remember to import the specific sensor module (e.g., 'import force_sensor').
4. If the user asks for a specific behavior (e.g., "move forward 250"), interpret the units sensibly based on the API (e.g., degrees per second for velocity, millimeters for distance, degrees for rotation).
5. Provide the Python code in the 'code' field and a brief explanation in the 'explanation' field.
6. If the user request is ambiguous, assume reasonable defaults (e.g., standard wheel size for distance calculations if not provided, though the API usually works in degrees or time).
7. Make sure to structure the code with a main async function and runloop.run(main()) if multiple actions or sensors are involved.
`;

export const generateSpikeCode = async (userPrompt: string, currentCodeContext: string): Promise<{ code: string, explanation: string }> => {
  
  const prompt = `
  Current Code Context (if any):
  ${currentCodeContext}

  User Request:
  ${userPrompt}
  
  Generate the full Python script to achieve this.
  `;

  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            code: { type: Type.STRING, description: "The complete, valid MicroPython code for SPIKE Prime." },
            explanation: { type: Type.STRING, description: "A short explanation of what the code does and how to wire the robot." }
          },
          required: ["code", "explanation"]
        }
      }
    });

    const text = response.text;
    if (!text) {
        throw new Error("Empty response from Gemini");
    }

    return JSON.parse(text);

  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};
