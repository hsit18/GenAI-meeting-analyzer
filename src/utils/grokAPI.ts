import Groq from 'groq-sdk';

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
});

export async function getChatResponse(messages: Groq.Chat.CompletionCreateParams.Message[], formatType?: string) {
  
  const chatCompletion = await groq.chat.completions.create({
    messages,
    model: "llama3-70b-8192",
    temperature: 0.3,
    stream: false,
    response_format: formatType ? {
        "type": "json_object"
    }: {}
  });   
  console.log(chatCompletion.choices[0].message.content);

  return chatCompletion.choices[0].message.content;
}