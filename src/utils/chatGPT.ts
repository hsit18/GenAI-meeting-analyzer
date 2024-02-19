import { ChatGPTAPI, ChatMessage } from "chatgpt";
import OpenAI from "openai";
const api = new ChatGPTAPI({
    apiKey: process.env.OPENAI_API_KEY as string,
});

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY as string, });

export const getMessages = async(message: string) => {
    const res = await api.sendMessage(message);
    console.log(res);
    return res.text;
}


const messages = [
    { role: 'system', content: 'You are a helpful assistant.' },
    { role: 'user', content: 'Who won the world series in 2020?' },
    { role: 'assistant', content: 'The Los Angeles Dodgers won the World Series in 2020.' },
    { role: 'user', content: 'Who won the world series in 2022?' },
];

// Function to send a message and get a response
export async function getChatResponse(messages) {
    const response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: messages,
    });
    console.log(response);
    return response.choices[0].message.content;
}

// Run the function to get the assistant's response
export async function run() {
    const response = await getChatResponse(messages);
    console.log(response);
}
