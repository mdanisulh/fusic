import {
  GoogleGenerativeAI,
  HarmBlockThreshold,
  HarmCategory,
} from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });
const API_KEY = process.env.GEMINI_API_KEY || "";

const genAI = new GoogleGenerativeAI(API_KEY);
const safetySettings = [
  {
    category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
    threshold: HarmBlockThreshold.BLOCK_NONE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
    threshold: HarmBlockThreshold.BLOCK_NONE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
    threshold: HarmBlockThreshold.BLOCK_NONE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
    threshold: HarmBlockThreshold.BLOCK_NONE,
  },
];

export const POST = async (request: Request) => {
  const { input } = await request.json();
  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      safetySettings,
    });
    const prompt =
      "Transliterate the text in English as it is and just output the text\n" +
      input;
    const result = await model.generateContent(prompt);
    const res = result.response.text();
    return new Response(JSON.stringify(res), { status: 200 });
  } catch (error) {
    return new Response("Couldn't transliterate", { status: 500 });
  }
};
