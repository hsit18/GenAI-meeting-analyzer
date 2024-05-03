import { NextRequest, NextResponse } from "next/server";
import { getChatResponse } from "@/utils/grokAPI";
import prisma from '@/lib/prisma';

export async function POST(request: NextRequest): Promise<NextResponse> {
    
    const data = await request.json();
    
    const meeting = await prisma.meeting.findUnique({
        where: {id: Number(data.id)}
    });

    if (!(meeting && meeting.transcribe)) {
        return NextResponse.json(false);
    }
    
    const meetingResponse = await prisma.meeting_response.findUnique({
        where: {meetingId: Number(data.id)}
    });
    
    // if (meetingResponse && meetingResponse[data.responseKey as keyof typeof meetingResponse]) {
    //     console.log(`Cached Meeting found for meeting Id: ${meetingResponse.meetingId} for reponseKey: ${data.responseKey}`);
    //     return NextResponse.json(meetingResponse[data.responseKey as keyof typeof meetingResponse]);
    // }
   
    const result = await getChatResponse([...JSON.parse(meeting.transcribe), { role: 'user', content: data.query }], data.format);

    // if (meetingResponse?.id) {
    //     await prisma.meeting_response.update({
    //         where: { id: Number(meetingResponse?.id) },
    //         data: { [data.responseKey]: result, meetingId: Number(data.id) }
    //     });
    //     console.log(`Meeting response cached for meeting Id: ${meetingResponse.meetingId} for reponseKey: ${data.responseKey}`);
    // }
    return NextResponse.json(result);
}