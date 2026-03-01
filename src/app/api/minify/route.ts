import { NextRequest, NextResponse } from "next/server";
import sharp from "sharp";

const MAX_SIZE = 5 * 1024 * 1024; // 5MB

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const quality = Number(formData.get("quality") || 80);

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: "File too large (max 5MB)" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const image = sharp(buffer);
    const metadata = await image.metadata();
    const format = metadata.format || "jpeg";

    let output: Buffer;

    switch (format) {
      case "png":
        output = await image.png({ quality, compressionLevel: Math.round((100 - quality) / 10) }).toBuffer();
        break;
      case "webp":
        output = await image.webp({ quality }).toBuffer();
        break;
      case "avif":
        output = await image.avif({ quality }).toBuffer();
        break;
      default:
        output = await image.jpeg({ quality }).toBuffer();
        break;
    }

    return new NextResponse(new Uint8Array(output), {
      headers: {
        "Content-Type": `image/${format === "jpg" ? "jpeg" : format}`,
        "Content-Length": output.length.toString(),
        "X-Original-Size": buffer.length.toString(),
        "X-Compressed-Size": output.length.toString(),
      },
    });
  } catch {
    return NextResponse.json({ error: "Failed to process image" }, { status: 500 });
  }
}
