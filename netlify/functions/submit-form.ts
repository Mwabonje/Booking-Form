import { z } from "zod";

const formSchema = z.object({
  firstName: z.string().min(1).max(50),
  lastName: z.string().min(1).max(50),
  email: z.string().email(),
  confirmEmail: z.string().email().optional(), // Or whatever logic you like
  phone: z.string().min(5).max(20),
  socialHandle: z.string().max(100).optional(),
  subject: z.string().min(1).max(100),
  typeOfShoot: z.array(z.string()).optional(),
  date: z.string().optional(),
  preferredContact: z.string().optional(),
  budget: z.string().max(100).optional(),
  message: z.string().min(1).max(2000),
}).catchall(z.unknown()); // allow extra formspree fields if necessary, or just strip them.

const ALLOWED_ORIGINS = [
  "https://mwabonjebooking.netlify.app",
  "https://mwabonje.netlify.app",
  "http://localhost:3000",
  "http://127.0.0.1:3000"
];

// Determine if the origin is allowed (or if it's a direct API call without origin)
const getCorsOrigin = (origin: string | null) => {
  const isAllowedOrigin = !origin || ALLOWED_ORIGINS.includes(origin) || origin.endsWith('.run.app');
  return isAllowedOrigin && origin ? origin : ALLOWED_ORIGINS[0];
};

export default async (req: Request) => {
  const origin = req.headers.get("origin") || "";
  const corsOrigin = getCorsOrigin(origin);

  const headers = {
    "Access-Control-Allow-Origin": corsOrigin,
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "X-Content-Type-Options": "nosniff",
    "Strict-Transport-Security": "max-age=31536000; includeSubDomains"
  };

  const isAllowedOrigin = !origin || ALLOWED_ORIGINS.includes(origin) || origin.endsWith('.run.app');

  if (!isAllowedOrigin && origin) {
    return new Response("Forbidden", { status: 403, headers });
  }

  // Handle preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers });
  }

  if (req.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405, headers });
  }

  try {
    const bodyText = await req.text();
    
    // Protect against massive payloads
    if (bodyText.length > 20480) {
      return new Response(JSON.stringify({ error: "Payload too large" }), {
        status: 413,
        headers: { ...headers, "Content-Type": "application/json" }
      });
    }

    const payload = JSON.parse(bodyText);
    
    // Validate structural integrity of payload
    const validation = formSchema.safeParse(payload);
    if (!validation.success) {
      return new Response(JSON.stringify({ error: "Invalid form data", details: validation.error.issues }), {
        status: 400,
        headers: { ...headers, "Content-Type": "application/json" }
      });
    }
    
    // Server-to-server forward (hides the destination URL from frontend clients)
    const response = await fetch("https://formspree.io/f/mqeerdnk", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify(payload)
    });

    if (response.ok) {
      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { ...headers, "Content-Type": "application/json" }
      });
    } else {
      const data = await response.json();
      return new Response(JSON.stringify(data), {
        status: response.status,
        headers: { ...headers, "Content-Type": "application/json" }
      });
    }

  } catch (error) {
    console.error("Error submitting form:", error);
    return new Response(JSON.stringify({ error: "Failed to submit form" }), {
      status: 500,
      headers: { ...headers, "Content-Type": "application/json" }
    });
  }
};

export const config = {
  path: "/.netlify/functions/submit-form"
};
