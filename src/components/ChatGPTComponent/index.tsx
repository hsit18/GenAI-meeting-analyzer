"use client";

import { ChatMessage } from "chatgpt";

export const ChatGPTComponent = ({data}: {data: ChatMessage}) => {
    console.log(data);
    return (
        <div>{data?.text}</div>
    )
}
