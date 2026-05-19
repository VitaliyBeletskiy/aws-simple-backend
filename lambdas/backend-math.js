const BACKEND_BASE_URL = "http://172.31.23.202:8080";

const ALLOWED_ORIGINS = [
  "http://127.0.0.1:5500",
  "https://app.beletskiy.com",
];

function getCorsHeaders(origin) {
  const allowedOrigin = ALLOWED_ORIGINS.includes(origin) ? origin : "";

  return {
    "Access-Control-Allow-Origin": allowedOrigin,
    "Access-Control-Allow-Headers": "Content-Type,Authorization",
    "Access-Control-Allow-Methods": "GET,OPTIONS",
  };
}

export const handler = async (event) => {
  const origin = event.headers?.origin || event.headers?.Origin || "";
  const corsHeaders = getCorsHeaders(origin);

  try {
    if (event.requestContext?.http?.method === "OPTIONS") {
      return {
        statusCode: 204,
        headers: corsHeaders,
        body: "",
      };
    }

    const routePath = event.rawPath || "";
    const query = event.rawQueryString
      ? `?${event.rawQueryString}`
      : "";

    let backendPath;

    if (routePath.endsWith("/backend/math/add")) {
      backendPath = "/math/add";
    } else if (routePath.endsWith("/backend/math/square")) {
      backendPath = "/math/square";
    } else {
      return {
        statusCode: 404,
        headers: corsHeaders,
        body: JSON.stringify({
          message: "Unsupported math route",
        }),
      };
    }

    const response = await fetch(
      `${BACKEND_BASE_URL}${backendPath}${query}`,
      {
        method: "GET",
      }
    );

    const data = await response.text();

    return {
      statusCode: response.status,
      headers: {
        ...corsHeaders,
        "Content-Type":
          response.headers.get("content-type") || "text/plain",
      },
      body: data,
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({
        message: "Error calling backend",
        error: error.message,
      }),
    };
  }
};
