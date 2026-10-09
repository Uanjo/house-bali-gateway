# Meta Pixel and Conversions API setup

The browser Pixel is initialized with the public Pixel ID in `src/lib/meta-tracking.ts`.
The server endpoint at `/api/meta-capi` forwards an allowlisted set of events to Meta's Conversions API.

## Required deployment secrets

Configure these variables in the hosting provider's server-side environment settings (not in frontend variables, source files, or committed `.env` files):

- `META_PIXEL_ID=1552429686559209`
- `META_ACCESS_TOKEN=<new token generated in Meta Events Manager>`

Redeploy after saving the variables. The endpoint intentionally returns HTTP 503 until `META_ACCESS_TOKEN` is configured.

**Never commit a real access token.** If a token has been pasted into chat, source control, logs, or a public frontend, revoke it and create a replacement before enabling the integration.

## Events

- `PageView`: page visit.
- `VideoStarted`: first playback start.
- `VideoProgress`: first time the viewer reaches 10%, 25%, 50%, 75%, 90%, and 100% of tracked playback.
- `InitiateCheckout`: click on the checkout button. This does not mean a purchase was completed.

Browser and server copies share an event ID to support Meta event deduplication. Actual `Purchase` events must only be sent after a verified payment confirmation from IronPay (for example, a signed webhook or trusted success callback).

## Verify before using ads

Use Meta Events Manager's Test Events and Diagnostics, test the browser Pixel and server events, and verify that duplicate browser/server events are deduplicated. The website alone cannot confirm payment completion or configure hosting secrets automatically.
