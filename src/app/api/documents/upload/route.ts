import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/dal";
import { FILE_TYPES, MAX_FILE_MB } from "@/features/knowledge/options";

// Hands the admin's browser a short-lived token to upload one file straight to Vercel Blob.
export async function POST(request: Request) {
  // Outside the try, so the 404 from notFound() and the login redirect aren't caught as a 400.
  // Checked here rather than in onBeforeGenerateToken because we don't use onUploadCompleted,
  // so every request to this route comes from a browser, never from Vercel.
  await requireAdmin();
  const body = (await request.json()) as HandleUploadBody;

  try {
    const json = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async () => ({
        allowedContentTypes: Object.values(FILE_TYPES),
        maximumSizeInBytes: MAX_FILE_MB * 1024 * 1024,
        addRandomSuffix: true,
      }),
    });
    return NextResponse.json(json);
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 400 });
  }
}
