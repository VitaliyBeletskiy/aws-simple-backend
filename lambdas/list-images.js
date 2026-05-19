import { S3Client, ListObjectsV2Command } from "@aws-sdk/client-s3";

const s3 = new S3Client({ region: "eu-north-1" });
const BUCKET_NAME = "vibe-image-uploads";

const ALLOWED_ORIGINS = [
  "http://127.0.0.1:5500",
  "https://app.beletskiy.com",
];

function getCorsHeaders(origin) {
  if (!ALLOWED_ORIGINS.includes(origin)) {
    return {};
  }

  return {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Methods": "GET,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };
}

export const handler = async (event) => {
  const method = event.requestContext?.http?.method || event.httpMethod;
  const origin = event.headers?.origin || event.headers?.Origin;
  const corsHeaders = getCorsHeaders(origin);

  if (method === "OPTIONS") {
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: "",
    };
  }

  if (method !== "GET") {
    return {
      statusCode: 405,
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
        Allow: "GET,OPTIONS",
      },
      body: JSON.stringify({
        message: "Method not allowed",
      }),
    };
  }

  try {
    const command = new ListObjectsV2Command({
      Bucket: BUCKET_NAME,
      Prefix: "uploads/",
    });

    const result = await s3.send(command);

    const images = (result.Contents || [])
      .filter((obj) => obj.Key !== "uploads/")
      .map((obj) => ({
        key: obj.Key,
        size: obj.Size,
        lastModified: obj.LastModified,
      }));

    return {
      statusCode: 200,
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ images }),
    };
  } catch (error) {
    console.error("Error listing images:", error);

    return {
      statusCode: 500,
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: "Failed to list images",
      }),
    };
  }
};
