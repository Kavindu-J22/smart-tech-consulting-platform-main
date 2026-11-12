import { get } from "@vercel/blob";
import { notFound } from "next/navigation";
import { getDocument } from "@/features/knowledge/data";

// Opens an uploaded file. The store is private, so the browser can't use the Blob URL
// directly: this route checks the admin, then streams the file through.
export async function GET(
  _request: Request,
  { params }: RouteContext<"/api/documents/[documentId]">,
) {
  const { documentId } = await params;
  const document = await getDocument(documentId);

  const result = await get(document.blobUrl, { access: "private" });
  if (result?.statusCode !== 200) notFound();

  return new Response(result.stream, {
    headers: {
      "Content-Type": result.blob.contentType,
      // inline so PDFs and text open in the tab; the name is what a "Save as" suggests.
      "Content-Disposition": `inline; filename*=UTF-8''${encodeURIComponent(document.fileName)}`,
      "X-Content-Type-Options": "nosniff",
      "Cache-Control": "private, no-store",
    },
  });
}
