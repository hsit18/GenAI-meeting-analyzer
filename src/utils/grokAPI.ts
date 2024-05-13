import Groq from 'groq-sdk';
import { ChatCompletionCreateParamsNonStreaming } from 'groq-sdk/resources/chat/completions';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function getChatResponse(bodyData: ChatCompletionCreateParamsNonStreaming) {
  const response = await groq.chat.completions.create({
    ...bodyData, 
    // response_format: bodyData.response_format ? {
    //   "type": "json_object"
    // } : {}
  });
  console.log(response);
  return response.choices[0].message.content;
}