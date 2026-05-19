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

const apiMetadata = {
  title: "API Endpoints",
  groups: [
    {
      title: "API Gateway",
      description: "Serverless routes handled directly by Lambda.",
      endpoints: [
        {
          method: "GET",
          path: "/",
          description: "Returns API metadata.",
        },
        {
          method: "ANY",
          path: "/myip",
          description: "Returns the client IP address via Lambda.",
        },
      ],
    },
    {
      title: "Spring Boot",
      description: "Stateless backend endpoints proxied through API Gateway.",
      endpoints: [
        {
          method: "GET",
          path: "/backend/math/square?a=5",
          description: "Returns the square of a number.",
        },
        {
          method: "GET",
          path: "/backend/math/add?a=5&b=17",
          description: "Adds two numbers.",
        },
      ],
    },
    {
      title: "Spring Boot with MySQL",
      description: "Stateful CRUD endpoints backed by MySQL.",
      endpoints: [
        {
          method: "GET",
          path: "/todos",
          description: "Returns all todos.",
        },
        {
          method: "GET",
          path: "/todos/{id}",
          description: "Returns a todo by ID.",
        },
        {
          method: "POST",
          path: "/todos",
          description: "Creates a todo.",
        },
        {
          method: "PUT",
          path: "/todos/{id}",
          description: "Updates a todo.",
        },
        {
          method: "DELETE",
          path: "/todos/{id}",
          description: "Deletes a todo.",
        },
      ],
    },
  ],
};

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
      },
      body: JSON.stringify({
        ok: false,
        message: "Method not allowed",
      }),
    };
  }

  return {
    statusCode: 200,
    headers: {
      ...corsHeaders,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(apiMetadata),
  };
};
