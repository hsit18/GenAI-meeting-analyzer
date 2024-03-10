import { NextResponse } from "next/server";
import { data } from "@/data/fund";

export async function GET() {
  return NextResponse.json(data);
}
