//@ts-nocheck

import OpenAI from "openai";
import { ChatCompletionMessageParam } from "openai/resources";
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY as string, });
import fs from "fs";

// Function to send a message and get a response
export async function getChatResponse(messages: ChatCompletionMessageParam[], formatType?: string) {
    const response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo-0125',
        response_format: { type: formatType || "text" },
        messages: messages,
        temperature: 0.2,
    });
    console.log(response);
    return response.choices[0].message.content;
}

export const getMessages = async (threadId: string, message: string) => {
  const threadMessages = await openai.beta.threads.messages.create(threadId, {
    role: "user",
    content: message,
  });
  
  console.log(threadMessages);
  return threadMessages;
};

export const createThread = async () => {
  const res = await openai.beta.threads.create();
  console.log(res)
  return res.id;
};

export const createAssistant = async (message: string, agenda: string) => {
    const assistant = await openai.beta.assistants.create({
        instructions: "You need to analyze transcribe meeting notes and provide insights on the meeting.",
        name: agenda,
        tools: [{ type: "retrieval" }],
        model: "gpt-3.5-turbo",
      });
      return assistant.id;
}

export const getImages = async() => {
    const image = await openai.images.generate({ model: "dall-e-2", prompt: "A man on phone with angry mood" });
    console.log(image.data);
}

export const getEditImages = async() => {
  const image = await openai.images.edit({ model: "dall-e-2", prompt: "Sitting at home in a bad mood", image: fs.createReadStream("./avatar.png") });
  console.log(image.data);
}