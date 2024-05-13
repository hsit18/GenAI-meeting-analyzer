import { GROQ_MODELS, GPT_MODELS } from "@/constants"
import { getChatResponse as openAIGetChatResponse } from "@/utils/chatGPT";
import { getChatResponse as groqGetChatResponse } from "@/utils/grokAPI"


export const resolveModel = async (model: string) => {
    
    if(GROQ_MODELS.includes(model)) {
        return groqGetChatResponse
    }

    if(GPT_MODELS.includes(model)) {
        return openAIGetChatResponse
    }
}