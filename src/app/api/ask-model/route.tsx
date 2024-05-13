import { NextRequest, NextResponse } from "next/server";
import { getChatResponse } from "@/utils/chatGPT";
import prisma from '@/lib/prisma';
import { GPT_MODELS } from "@/constants";
import { resolveModel } from "@/AIModels";

export async function POST(request: NextRequest): Promise<NextResponse> {

    const selectedModel = request.headers.get('ai-model') || GPT_MODELS[0];
    const data = await request.json();

    const meeting = await prisma.meeting.findUnique({
        where: { id: Number(data.id) }
    });

    if (!(meeting && meeting.transcribe)) {
        return NextResponse.json(false);
    }

    const meetingResponse = await prisma.meeting_response.findUnique({
        where: { meetingId: Number(data.id) }
    });

    // if (meetingResponse && meetingResponse[data.responseKey as keyof typeof meetingResponse]) {
    //     console.log(`Cached Meeting found for meeting Id: ${meetingResponse.meetingId} for reponseKey: ${data.responseKey}`);
    //     return NextResponse.json(meetingResponse[data.responseKey as keyof typeof meetingResponse]);
    // }

    const resolvedChatResponse = await resolveModel(selectedModel);

    if (resolvedChatResponse) {
        const result = await resolvedChatResponse({
            model: selectedModel,
            response_format: { type: data?.format || "text" },
            messages: [...JSON.parse(meeting.transcribe), { role: 'user', content: data.query }],
            temperature: 0.2,
            stream: false
        });
        // if (meetingResponse?.id) {
        //     await prisma.meeting_response.update({
        //         where: { id: Number(meetingResponse?.id) },
        //         data: { [data.responseKey]: result, meetingId: Number(data.id) }
        //     });
        //     console.log(`Meeting response cached for meeting Id: ${meetingResponse.meetingId} for reponseKey: ${data.responseKey}`);
        // }
        return NextResponse.json(result);
    } else {
        return NextResponse.json({ error: `Unsupported Model provided ${selectedModel}` }, { status: 400 });
    }




}