// Keep both video stages and the checkout destination configurable in one place.
// The main VSL unlocks the second video after 60 seconds of actual playback.
export const vslConfig: {
  videoUrl: string | undefined;
  secondVideoUrl: string | undefined;
  checkoutUrl: string | undefined;
  unlockAfterSeconds: number;
} = {
  videoUrl: "https://raw.githubusercontent.com/Uanjo/house-bali-gateway/main/WhatsApp%20Video%202026-10-08%20at%2021.19.50.mp4",
  secondVideoUrl: "https://raw.githubusercontent.com/Uanjo/house-bali-gateway/main/WhatsApp%20Video%202026-10-08%20at%2022.31.56.mp4",
  checkoutUrl: "https://go.ironpayapp.com.br/tnlocfz4se",
  unlockAfterSeconds: 60,
};
