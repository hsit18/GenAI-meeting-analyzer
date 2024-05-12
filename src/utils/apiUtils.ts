import { GPT_MODELS } from "@/constants";

export const askModel = async (bodyData: {model: string, id: number, query: string, responseKey: string, format?: string}) => {
  const res = await fetch(`/api/ask-model`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "ai-model": bodyData?.model || GPT_MODELS[0] 
    },
    body: JSON.stringify({...bodyData, format: bodyData.format || "text"}),
  });
  return await res.json();
};
