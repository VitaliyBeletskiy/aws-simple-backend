import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import crypto from "crypto";

const s3 = new S3Client({ region: "eu-north-1" });
const BUCKET_NAME = "vibe-image-uploads";

const ALLOWED_ORIGINS = ["http://127.0.0.1:5500", "https://app.beletskiy.com"];

function getCorsHeaders(origin) {
  if (!ALLOWED_ORIGINS.includes(origin)) {
    return {};
  }

  return {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type,x-amz-meta-originalfilename",
  };
}

export const handler = async (event) => {
  const method = event.requestContext?.http?.method || event.httpMethod;
  const origin = event.headers?.origin || event.headers?.Origin;
  const corsHeaders = getCorsHeaders(origin);

  const jsonResponse = (statusCode, body, extraHeaders = {}) => ({
    statusCode,
    headers: {
      ...corsHeaders,
      "Content-Type": "application/json",
      ...extraHeaders,
    },
    body: JSON.stringify(body),
  });

  const emptyResponse = (statusCode, extraHeaders = {}) => ({
    statusCode,
    headers: {
      ...corsHeaders,
      ...extraHeaders,
    },
    body: "",
  });

  if (method === "OPTIONS") {
    return emptyResponse(200);
  }

  if (method !== "POST") {
    return jsonResponse(
      405,
      { message: "Method not allowed" },
      { Allow: "POST,OPTIONS" },
    );
  }

  try {
    const body = event.body ? JSON.parse(event.body) : {};

    const fileName = body.fileName;
    const contentType = body.contentType;

    if (!fileName || !contentType) {
      return jsonResponse(400, {
        message: "fileName and contentType are required",
      });
    }

    const allowedContentTypes = ["image/jpeg", "image/png"];
    if (!allowedContentTypes.includes(contentType)) {
      return jsonResponse(400, { message: "Only image uploads allowed" });
    }

    const extensionMap = { "image/jpeg": "jpg", "image/png": "png" };
    const expectedExtension = extensionMap[contentType];
    const actualExtension = fileName.split(".").pop().toLowerCase();

    if (actualExtension !== expectedExtension) {
      return jsonResponse(400, {
        message: "File extension does not match content type",
      });
    }

    const fileId = crypto.randomUUID();
    const key = `uploads/${fileId}.${expectedExtension}`;

    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
      ContentType: contentType,
      Metadata: {
        originalfilename: fileName,
      },
    });

    const uploadUrl = await getSignedUrl(s3, command, {
      expiresIn: 300, // 5 minutes
    });

    return jsonResponse(200, { uploadUrl, key });
  } catch (error) {
    console.error("Error generating upload URL:", error);
    return jsonResponse(500, { message: "Failed to generate upload URL" });
  }
};
