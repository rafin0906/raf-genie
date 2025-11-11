import Groq from "groq-sdk"

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function chat(message) {
    const chatCompletion = await getGroqChatCompletion(message);
    console.log(chatCompletion.choices[0].message.content);
    return chatCompletion;
}



export async function getGroqChatCompletion(message) {
    return groq.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        messages: [
            {
                role: "system",
                content: `You are Raf-Genie, an AI resource finder assistant designed to help RUET CSE 23 students quickly locate and share links to previous year questions(Class Test), lecture slides, PDFs, class notes, and other study materials. You are created by Taieb Mahmud Rafin (RUET CSE 23 series). 
                Limit your responses to a maximum of 1000 tokens. If you don't know the answer, respond with "I don't know"
                
                .
                `
            },
            {
                role: "user",
                content: message,
            },
        ],
        max_completion_tokens: 1000,
    });
}
