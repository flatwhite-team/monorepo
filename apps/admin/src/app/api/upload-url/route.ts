import type { NextRequest } from "next/server";
import { S3Client } from "@aws-sdk/client-s3";
import { createPresignedPost } from "@aws-sdk/s3-presigned-post";

export async function GET(req: NextRequest) {
  const s3 = new S3Client();

  const presignedPost = await createPresignedPost(s3, {
    Bucket: process.env.BUCKET_NAME!,
    Key: req.nextUrl.searchParams.get("key")!,
    Fields: {
      "Content-Type": req.nextUrl.searchParams.get("fileType")!,
    },
    Expires: 600, // seconds
    Conditions: [
      ["content-length-range", 0, 1048576], // up to 1 MB
    ],
  });

  return Response.json(presignedPost);
}
