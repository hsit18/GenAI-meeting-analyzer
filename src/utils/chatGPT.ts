import { ChatGPTAPI, ChatMessage } from "chatgpt";

const api = new ChatGPTAPI({
    apiKey: process.env.OPENAI_API_KEY as string,
});

export const getMessages = async(message: string) => {
    const res = await api.sendMessage(message);
    console.log(res);
    return res.text;
}