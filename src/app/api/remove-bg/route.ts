import { NextRequest, NextResponse } from "next/server";
import { execFile } from "child_process";
import { writeFile, readFile, unlink, mkdir } from "fs/promises";
import { join } from "path";
import { randomUUID } from "crypto";
import { tmpdir } from "os";

const MAX_SIZE = 5 * 1024 * 1024;

function runRembg(inputPath: string, outputPath: string): Promise<void> {
  return new Promise((resolve, reject) => {
    execFile("rembg", ["i", inputPath, outputPath], { timeout: 60000 }, (error) => {
      if (error) reject(error);
      else resolve();
    });
  });
}

export async function POST(request: NextRequest) {
  const id = randomUUID();
  const tempDir = join(tmpdir(), "pro-converter");
  const inputPath = join(tempDir, `${id}-input.png`);
  const outputPath = join(tempDir, `${id}-output.png`);

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: "File too large (max 5MB)" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    await mkdir(tempDir, { recursive: true });
    await writeFile(inputPath, buffer);
    await runRembg(inputPath, outputPath);

    const output = await readFile(outputPath);

    return new NextResponse(new Uint8Array(output), {
      headers: {
        "Content-Type": "image/png",
        "Content-Length": output.length.toString(),
      },
    });
  } catch {
    return NextResponse.json({ error: "Failed to remove background" }, { status: 500 });
  } finally {
    await unlink(inputPath).catch(() => {});
    await unlink(outputPath).catch(() => {});
  }
}
