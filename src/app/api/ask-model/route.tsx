import { NextRequest, NextResponse } from "next/server";
import { getChatResponse } from "@/utils/chatGPT";

import { getCache, init } from "@/utils/cacheUtil";

export async function POST(request: NextRequest): Promise<NextResponse> {
    await init();
    const data = await request.json();

    const parsedPrompt = await getCache('meeting');
    
    if(!parsedPrompt) {
        return NextResponse.json(false);
    }
    const result = await getChatResponse([...parsedPrompt, {role: 'user', content: data.query}], data.format);
    return NextResponse.json(result);
}