import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

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
        "Allow": "GET,OPTIONS",
      },
      body: JSON.stringify({ message: "Method not allowed" }),
    };
  }

  try {
    const key = event.queryStringParameters?.key;

    if (!key) {
      return {
        statusCode: 400,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: "Missing key parameter" }),
      };
    }

    const command = new GetObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
    });

    const downloadUrl = await getSignedUrl(s3, command, {
      expiresIn: 300, // 5 minutes
    });

    return {
      statusCode: 200,
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        downloadUrl,
      }),
    };
  } catch (error) {
    console.error("Error generating download URL:", error);

    return {
      statusCode: 500,
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: "Failed to generate download URL",
      }),
    };
  }
};
