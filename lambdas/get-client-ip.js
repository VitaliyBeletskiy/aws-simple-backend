const ALLOWED_ORIGINS = [
  "http://127.0.0.1:5500",
  "https://app.beletskiy.com"
];

function getCorsHeaders(origin) {
  if (ALLOWED_ORIGINS.includes(origin)) {
    return {
      "Access-Control-Allow-Origin": origin,
      "Access-Control-Allow-Methods": "GET,OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type"
    };
  }

  return {};
}

export const handler = async (event) => {
  const method = event.requestContext?.http?.method || event.httpMethod;
  const origin = event.headers?.origin || event.headers?.Origin;

  const corsHeaders = getCorsHeaders(origin);

  if (method === "OPTIONS") {
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: ""
    };
  }

  if (method !== "GET") {
    return {
      statusCode: 405,
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ ok: false, message: "Method not allowed" })
    };
  }

  const ip =
    event.requestContext?.http?.sourceIp ||
    event.requestContext?.identity?.sourceIp ||
    event.headers?.["x-forwarded-for"]?.split(",")[0];

  return {
    statusCode: 200,
    headers: {
      ...corsHeaders,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ ok: true, ip })
  };
};
