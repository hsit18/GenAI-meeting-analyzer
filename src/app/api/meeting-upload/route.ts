import { join } from "path";

import { stat, mkdir, writeFile } from "fs/promises";
import { NextRequest, NextResponse } from "next/server";
import { startAnalysisPrompt } from "@/utils/prompt";
import { setCache } from "@/utils/cacheUtil";

export async function POST(request: NextRequest): Promise<NextResponse> {
    const formData = await request.formData();
  
    console.log(formData.get('agenda'));
    console.log(formData.get('transcribeFile'));
    const transcribeFile = formData.get('transcribeFile') as Blob;

    const buffer = Buffer.from(await transcribeFile.arrayBuffer());
    const uploadDir = join(process.cwd(), "public", "uploads");

    try {
        await stat(uploadDir);
    } catch (e: any) {
        if (e.code === "ENOENT") {
          await mkdir(uploadDir, { recursive: true });
        } else {
          console.error(
            "Error while trying to create directory when uploading a file\n",
            e
          );
          return NextResponse.json(
            { error: "Something went wrong." },
            { status: 500 }
          );
        }
    }

    try {
        const filename = 'meeting.json'  //`${transcribeFile.name}`;
       // await writeFile(`${uploadDir}/${filename}`, buffer);
        const msgList = startAnalysisPrompt(formData.get('agenda') as string, buffer.toString());
        await writeFile(`${uploadDir}/${filename}`, JSON.stringify(msgList))
        setCache('meeting', JSON.stringify(msgList));
        return NextResponse.json({ fileUrl: `http://localhost:3000/uploads/${filename}` });
    } catch (e) {
        console.error("Error while trying to upload a file\n", e);
        return NextResponse.json(
          { error: "Something went wrong." },
          { status: 500 }
        );
    }
  }