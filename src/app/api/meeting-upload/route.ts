import { join } from "path";
import { stat, mkdir, writeFile } from "fs/promises";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest): Promise<NextResponse> {
    const formData = await request.formData();
  
    console.log(formData.get('agenda'));
    console.log(formData.get('transcribeFile'));
    const transcribeFile = formData.get('transcribeFile') as Blob;

    const buffer = Buffer.from(await transcribeFile.arrayBuffer());
    const relativeUploadDir = `/uploads/${Date.now()}`;
    const uploadDir = join(process.cwd(), "public", relativeUploadDir);

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
        const filename = `${transcribeFile.name}`;
        await writeFile(`${uploadDir}/${filename}`, buffer);
        return NextResponse.json({ fileUrl: `${relativeUploadDir}/${filename}` });
    } catch (e) {
        console.error("Error while trying to upload a file\n", e);
        return NextResponse.json(
          { error: "Something went wrong." },
          { status: 500 }
        );
    }
  }