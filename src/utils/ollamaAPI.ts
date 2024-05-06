import { Ollama } from 'ollama';
const ollama = new Ollama({ host: process.env.OLLAMA_ORIGIN_HOST })


export async function getChatResponse() {

    const response = await ollama.chat({
        model: 'llama3',
        messages: [{ role: 'user', content: "What color is the sky at different times of the day? Respond using JSON" }],
        "format": "json",
        "stream": false
    })
    console.log(response.message.content)
}
export async function getEmbeddings() {
    const response = await ollama.embeddings({
        model: 'llama3',
        "prompt": "Here is an article about llamas..."
    });
    console.log(response);
}
