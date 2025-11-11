import Groq from "groq-sdk";
import { getSystemPrompt } from "./prompts/systemPrompt.js";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function chat(message, selectedOption = "none") {
    

    const systemPrompt = getSystemPrompt(selectedOption);
   
    const chatCompletion = await getGroqChatCompletion(message, systemPrompt);
    return chatCompletion;
}

export async function getGroqChatCompletion(message, systemPrompt) {
    return groq.chat.completions.create({
        temperature: 0,
        response_format: { type: "json_object" },
        model: "llama-3.3-70b-versatile",
        messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: message },
        ],
        max_completion_tokens: 1000,
    });
}
