const ALLOWED_ORIGINS = ["http://127.0.0.1:5500", "https://app.beletskiy.com"];

function getCorsHeaders(origin) {
  if (!ALLOWED_ORIGINS.includes(origin)) {
    return {};
  }

  return {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };
}

function log(type, payload = {}, event) {
  console.log(
    JSON.stringify({
      type,
      timestamp: new Date().toISOString(),
      requestId: event?.requestContext?.requestId,
      ...payload,
    }),
  );
}

export const handler = async (event) => {
  const method = event.requestContext?.http?.method || event.httpMethod;

  const path = event.rawPath || event.path;

  const origin = event.headers?.origin || event.headers?.Origin;
  const corsHeaders = getCorsHeaders(origin);

  log("request",{method, path, query: event.rawQueryString || "", origin,}, event,);

  if (method === "OPTIONS") {
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: "",
    };
  }

  try {
    const baseUrl = "http://172.31.23.202:8080";
    const query = event.rawQueryString ? `?${event.rawQueryString}` : "";
    const url = `${baseUrl}${path}${query}`;

    log("proxying", { method, url }, event);

    const response = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: method === "GET" || method === "DELETE" ? undefined : event.body,
    });

    const data = await response.text();

    log("backend_response", { status: response.status, ok: response.ok }, event,);

    return {
      statusCode: response.status,
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
      },
      body: data,
    };
  } catch (error) {
    log("error", {message: error.message, path,}, event,);

    return {
      statusCode: 500,
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: "Error calling backend",
        error: error.message,
      }),
    };
  }
};
