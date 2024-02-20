import { ChatGPTAPI, ChatMessage } from "chatgpt";
import OpenAI from "openai";
import { ChatCompletionMessageParam } from "openai/resources";
const api = new ChatGPTAPI({
    apiKey: process.env.OPENAI_API_KEY as string,
});

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY as string, });

export const getMessages = async(message: string) => {
    const res = await api.sendMessage(message);
    console.log(res);
    return res.text;
}

// Function to send a message and get a response
export async function getChatResponse(messages: ChatCompletionMessageParam[], instanceId?: string) {
    const response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: messages
    });
    console.log(response);
    return response.choices[0].message.content;
}
