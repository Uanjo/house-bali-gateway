// Keep the VSL media and checkout destination configurable in one place.
// The CTA unlocks after 60 seconds of actual playback, never a page timer.
export const vslConfig: { videoUrl: string | undefined; checkoutUrl: string | undefined; unlockAfterSeconds: number } = {
  videoUrl: "https://raw.githubusercontent.com/Uanjo/house-bali-gateway/main/WhatsApp%20Video%202026-10-08%20at%2021.19.50.mp4",
  checkoutUrl: "https://go.ironpayapp.com.br/tnlocfz4se",
  unlockAfterSeconds: 60,
};
