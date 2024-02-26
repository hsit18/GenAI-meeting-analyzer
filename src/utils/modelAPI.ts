//@ts-nocheck

export const createThread = async (message: string) => {
    const res = await fetch(`http://127.0.0.1:1337/v1/threads`, {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            "object": "thread",
            "title": message,
            "assistants": [
                {
                    "assistant_id": "jan",
                    "assistant_name": "Jan",
                    "instructions": "string",
                    "model": {
                        "id": "llama2-chat-7b-q4",
                        "settings": {},
                        "parameters": {},
                        "engine": "nitro"
                    }
                }
            ],
            "metadata": {}
        })
    })
    const data = await res.json();
    return data.id;
}

export const getMessages = async (threadId: string, message: string) => {
    const res = await fetch(`http://127.0.0.1:1337/v1/threads/${threadId}/messages`, {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            "role": "user",
            "content": message
        })
    })
    const data = await res.json();
    return data.content;
}

export const chatCompletion = async (message: string) => {
    console.log(JSON.stringify({
        messages: [
            {
                "role": "user",
                "content": message
            }
        ],
        "model": "llama2-chat-7b-q4",
        "stream": true,
        "max_tokens": 2048,
        "stop": [
            "hello"
        ],
        "frequency_penalty": 0,
        "presence_penalty": 0,
        "temperature": 0.7,
        "top_p": 0.95
    }))
    const res = await fetch(`http://127.0.0.1:1337/v1/chat/completions`, {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            messages: [
                {
                    "role": "user",
                    "content": message
                }
            ],
            "model": "llama2-chat-7b-q4",
            "stream": true,
            "max_tokens": 2048,
            "stop": [
                "hello"
            ],
            "frequency_penalty": 0,
            "presence_penalty": 0,
            "temperature": 0.7,
            "top_p": 0.95
        })
    });

    const reader = res.body.getReader();
    let chunks = []; 
    while (true) {
        const { value, done } = await reader.read();
        if (done) {
            //console.log(JSON.parse(chunks.join('')));
          
            break;
        }
        const format= (new TextDecoder().decode(value, {stream: true})).replaceAll("data: ", "").trim();
        const jsonStrings = format.split('\n\n');
        const validJsonStrings = jsonStrings.filter(str => str.trim() !== '' && str !== '[DONE]');
        const jsonArray = validJsonStrings.map(str => JSON.parse(str));
        chunks = chunks.concat(jsonArray);
    }

    const data = chunks.reduce((acc, c) => acc+c.choices[0].delta.content, '');
    console.log(data);
    return data;
}

export async function getChatResponse(messages: string[], formatType?: string) {
    
    const res = await fetch(`http://127.0.0.1:1337/v1/chat/completions`, {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            messages: messages,
            "model": "llama2-chat-7b-q4",
            "stream": true,
            "max_tokens": 2048,
            "stop": [
                "stop"
            ],
            "frequency_penalty": 0,
            "presence_penalty": 0,
            "temperature": 0.7,
            "top_p": 0.95
        })
    });
    
    const reader = res.body.getReader();
    let chunks = []; 
    while (true) {
        const { value, done } = await reader.read();
        if (done) {
            //console.log(JSON.parse(chunks.join('')));
          
            break;
        }
        const format= (new TextDecoder().decode(value, {stream: true})).replaceAll("data: ", "").trim();
        const jsonStrings = format.split('\n\n');
        const validJsonStrings = jsonStrings.filter(str => str.trim() !== '' && str !== '[DONE]');
        const jsonArray = validJsonStrings.map(str => JSON.parse(str));
        chunks = chunks.concat(jsonArray);
    }

    const data = chunks.reduce((acc, c) => acc+c.choices[0].delta.content, '');
    console.log(data);

    return data;
}