import { NextRequest, NextResponse } from "next/server";
import { startAnalysisPrompt } from "@/utils/prompt";
import prisma from '@/lib/prisma';

export async function POST(request: NextRequest): Promise<NextResponse> {
  const formData = await request.formData();
  const transcribeFile = formData.get('transcribeFile') as Blob;
  const buffer = Buffer.from(await transcribeFile.arrayBuffer());
  
  try {
    const msgList = startAnalysisPrompt(formData.get('agenda') as string, buffer.toString());
    const result = await prisma.meeting.create({
      data: {
        title: formData.get('agenda') as string,
        transcribe: JSON.stringify(msgList),
      },
    });
    return NextResponse.json({ status: true, id: result?.id, message: "Meeting created successfully." });
  } catch (e) {
    console.error("Error while saving meeting\n", e);
    return NextResponse.json(
      { status: false, error: "Something went wrong." },
      { status: 500 }
    );
  }
}