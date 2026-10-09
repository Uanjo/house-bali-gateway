declare global {
  interface Window {
    fbq?: FbqFunction;
    _fbq?: FbqFunction;
  }
}

type FbqFunction = {
  (...args: unknown[]): void;
  callMethod?: (...args: unknown[]) => void;
  queue: unknown[][];
  push: (...args: unknown[]) => void;
  loaded: boolean;
  version: string;
};

export const META_PIXEL_ID = "1552429686559209";

type MetaParams = Record<string, string | number | boolean | undefined>;

function readCookie(name: string): string | undefined {
  if (typeof document === "undefined") return undefined;
  const prefix = name + "=";
  const item = document.cookie.split("; ").find((cookie) => cookie.startsWith(prefix));
  return item ? decodeURIComponent(item.slice(prefix.length)) : undefined;
}

export function initMetaPixel() {
  if (typeof window === "undefined" || window.fbq) return;

  const fbq: FbqFunction = Object.assign(
    (...args: unknown[]) => {
      if (fbq.callMethod) fbq.callMethod(...args);
      else fbq.queue.push(args);
    },
    { queue: [] as unknown[][], loaded: true, version: "2.0", push: (...args: unknown[]) => fbq(...args) },
  );

  window.fbq = fbq;
  window._fbq = fbq;
  const script = document.createElement("script");
  script.async = true;
  script.src = "https://connect.facebook.net/en_US/fbevents.js";
  document.head.appendChild(script);
  fbq("init", META_PIXEL_ID);
}

export function trackMetaEvent(eventName: string, params: MetaParams = {}, standard = false) {
  if (typeof window === "undefined") return;
  const eventId = globalThis.crypto?.randomUUID?.() ?? `hb-${Date.now()}-${Math.random().toString(36).slice(2)}`;
  const cleanParams = Object.fromEntries(Object.entries(params).filter(([, value]) => value !== undefined));
  window.fbq?.(standard ? "track" : "trackCustom", eventName, cleanParams, { eventID: eventId });

  const payload = {
    eventName,
    eventId,
    eventSourceUrl: window.location.href,
    customData: cleanParams,
    fbp: readCookie("_fbp"),
    fbc: readCookie("_fbc"),
    userAgent: navigator.userAgent,
  };
  void fetch("/api/meta-capi", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    keepalive: true,
    credentials: "same-origin",
  }).catch(() => {
    // Browser Pixel still works if server-side Conversions API is not configured.
  });
}
