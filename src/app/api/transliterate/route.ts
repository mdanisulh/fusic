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
      model: "gemini-3-flash-preview",
      safetySettings,
    });
    const prompt =
      "Transliterate the text present in any other language to English. Only use English alphabets and puncuation. If numbers not in Indo-Arabic convert it otherwise keep special symbols and numbers as it is.\n" +
      input;
    const result = await model.generateContent(prompt);
    const res = result.response.text();
    return new Response(JSON.stringify(res), { status: 200 });
  } catch (_) {
    return new Response("Couldn't transliterate", { status: 500 });
  }
};
