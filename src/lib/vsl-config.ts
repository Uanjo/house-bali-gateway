// Keep the VSL media and checkout destination configurable in one place.
// The CTA unlocks after 60 seconds of actual playback, never a page timer.
export const vslConfig: { videoUrl: string | undefined; checkoutUrl: string | undefined; unlockAfterSeconds: number } = {
  videoUrl: "/WhatsApp%20Video%202026-10-08%20at%2021.19.50.mp4",
  checkoutUrl: undefined,
  unlockAfterSeconds: 60,
};
