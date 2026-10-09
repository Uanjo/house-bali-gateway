import { createFileRoute } from "@tanstack/react-router";

declare const process: { env: Record<string, string | undefined> };

const ALLOWED_EVENTS = new Set(["PageView", "VideoStarted", "VideoProgress", "InitiateCheckout"]);

type IncomingEvent = {
  eventName?: string;
  eventId?: string;
  eventSourceUrl?: string;
  customData?: Record<string, unknown>;
  fbp?: string;
  fbc?: string;
  userAgent?: string;
};

export const Route = createFileRoute("/api/meta-capi")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const pixelId = process.env.META_PIXEL_ID || "1552429686559209";
        const accessToken = process.env.META_ACCESS_TOKEN;
        if (!accessToken) {
          return Response.json({ ok: false, error: "Meta CAPI is not configured on the server" }, { status: 503 });
        }

        let body: IncomingEvent;
        try {
          body = await request.json() as IncomingEvent;
        } catch {
          return Response.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
        }

        if (!body.eventName || !ALLOWED_EVENTS.has(body.eventName) || !body.eventId || body.eventId.length > 120) {
          return Response.json({ ok: false, error: "Unsupported event" }, { status: 400 });
        }

        let sourceUrl = "https://example.com/";
        try {
          const parsed = new URL(body.eventSourceUrl || request.headers.get("origin") || "https://example.com/");
          sourceUrl = parsed.toString();
        } catch {
          return Response.json({ ok: false, error: "Invalid event source URL" }, { status: 400 });
        }

        const customData = body.customData && typeof body.customData === "object" ? body.customData : {};
        const event = {
          event_name: body.eventName,
          event_time: Math.floor(Date.now() / 1000),
          event_id: body.eventId,
          action_source: "website",
          event_source_url: sourceUrl,
          user_data: {
            ...(typeof body.fbp === "string" && body.fbp.length < 300 ? { fbp: body.fbp } : {}),
            ...(typeof body.fbc === "string" && body.fbc.length < 300 ? { fbc: body.fbc } : {}),
            ...(typeof body.userAgent === "string" && body.userAgent.length < 1000 ? { client_user_agent: body.userAgent } : {}),
          },
          custom_data: customData,
        };

        try {
          const response = await fetch(`https://graph.facebook.com/v22.0/${encodeURIComponent(pixelId)}/events?access_token=${encodeURIComponent(accessToken)}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ data: [event] }),
          });
          const result = await response.json() as { events_received?: number; error?: { message?: string } };
          if (!response.ok) {
            console.error("Meta CAPI rejected an event:", result.error?.message || response.status);
            return Response.json({ ok: false, error: "Meta rejected event" }, { status: 502 });
          }
          return Response.json({ ok: true, eventsReceived: result.events_received ?? 0 });
        } catch {
          return Response.json({ ok: false, error: "Meta CAPI request failed" }, { status: 502 });
        }
      },
    },
  },
});
