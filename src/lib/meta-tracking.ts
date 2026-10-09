declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
    _fbq?: (...args: unknown[]) => void;
  }
}

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
  const fbq = function (...args: unknown[]) {
    const fn = fbq as typeof fbq & { callMethod?: (...values: unknown[]) => void; queue: unknown[][]; loaded?: boolean; version: string };
    if (fn.callMethod) fn.callMethod(...args);
    else fn.queue.push(args);
  } as typeof window.fbq & { callMethod?: (...args: unknown[]) => void; queue: unknown[][]; push: (...args: unknown[]) => void; loaded?: boolean; version: string };
  fbq.queue = [];
  fbq.push = fbq;
  fbq.loaded = true;
  fbq.version = "2.0";
  window.fbq = fbq;
  window._fbq = fbq;
  const script = document.createElement("script");
  script.async = true;
  script.src = "https://connect.facebook.net/en_US/fbevents.js";
  document.head.appendChild(script);
  window.fbq("init", META_PIXEL_ID);
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
    // Browser Pixel tracking still works if the server endpoint is not configured.
  });
}
