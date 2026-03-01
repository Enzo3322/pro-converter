import { NextRequest, NextResponse } from "next/server";
import sharp from "sharp";

const MAX_SIZE = 5 * 1024 * 1024;
const VALID_FORMATS = ["png", "jpg", "jpeg", "webp", "avif"] as const;
type Format = (typeof VALID_FORMATS)[number];

const MIME_MAP: Record<string, string> = {
  png: "image/png",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  webp: "image/webp",
  avif: "image/avif",
};

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const format = (formData.get("format") as string || "png").toLowerCase() as Format;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: "File too large (max 5MB)" }, { status: 400 });
    }

    if (!VALID_FORMATS.includes(format)) {
      return NextResponse.json({ error: `Invalid format. Use: ${VALID_FORMATS.join(", ")}` }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const output = await sharp(buffer).toFormat(format === "jpg" ? "jpeg" : format).toBuffer();

    return new NextResponse(new Uint8Array(output), {
      headers: {
        "Content-Type": MIME_MAP[format],
        "Content-Length": output.length.toString(),
      },
    });
  } catch {
    return NextResponse.json({ error: "Failed to convert image" }, { status: 500 });
  }
}
