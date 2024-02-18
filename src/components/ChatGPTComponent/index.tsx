"use client";

import { ChatMessage } from "chatgpt";

export const ChatGPTComponent = ({data}: {data: string}) => {
    console.log(data);
    return (
        <div>{data}</div>
    )
}
