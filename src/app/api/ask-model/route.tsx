import { NextRequest, NextResponse } from "next/server";
import { getChatResponse } from "@/utils/chatGPT";
import prisma from '@/lib/prisma';

export async function POST(request: NextRequest): Promise<NextResponse> {
    
    const data = await request.json();
    
    const meeting = await prisma.meeting.findUnique({
        where: {id: Number(data.id)}
    });
      
    
    if(!(meeting && meeting.transcribe)) {
        return NextResponse.json(false);
    }
    const result = await getChatResponse([...JSON.parse(meeting.transcribe), {role: 'user', content: data.query}], data.format);
    return NextResponse.json(result);
}