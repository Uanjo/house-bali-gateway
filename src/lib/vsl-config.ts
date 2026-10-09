// Supply the final video URL and checkout URL here when available.
// The CTA stays hidden until 60 seconds of actual playback, never a page timer.
export const vslConfig: { videoUrl: string | undefined; checkoutUrl: string | undefined; unlockAfterSeconds: number } = {
  videoUrl: undefined,
  checkoutUrl: undefined,
  unlockAfterSeconds: 60,
};