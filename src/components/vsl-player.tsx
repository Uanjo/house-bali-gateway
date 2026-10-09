import { useEffect, useRef, useState } from "react";
import { Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import poster from "@/assets/bali-video-poster.jpg";
import { vslConfig } from "@/lib/vsl-config";
import { trackMetaEvent } from "@/lib/meta-tracking";

export function VslPlayer({ onUnlock }: { onUnlock: () => void }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const positionRef = useRef(0);
  const watchedRef = useRef(0);
  const lastTickRef = useRef<number | null>(null);
  const unlockedRef = useRef(false);
  const startedRef = useRef(false);
  const milestonesRef = useRef(new Set<number>());
  const milestones = [10, 25, 50, 75, 90, 100];
  const [needsPlay, setNeedsPlay] = useState(true);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !vslConfig.videoUrl) return;
    video.muted = false;
    video.volume = 1;
    void video.play().then(() => setNeedsPlay(false)).catch(() => setNeedsPlay(true));
  }, []);

  const startPlayback = () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = false;
    video.volume = 1;
    // Fullscreen APIs require a user gesture in most browsers. Keep playback
    // working even when fullscreen is unavailable or blocked by the browser.
    if (video.requestFullscreen) {
      void video.requestFullscreen().catch(() => undefined);
    } else {
      const legacyVideo = video as HTMLVideoElement & { webkitEnterFullscreen?: () => void };
      try { legacyVideo.webkitEnterFullscreen?.(); } catch { /* Browser does not support native fullscreen. */ }
    }
    void video.play().then(() => setNeedsPlay(false)).catch(() => setNeedsPlay(true));
  };

  const trackPlayback = () => {
    const video = videoRef.current;
    if (!video || video.seeking || video.paused) return;
    const now = performance.now();
    const delta = video.currentTime - positionRef.current;
    const elapsed = lastTickRef.current === null ? 0 : (now - lastTickRef.current) / 1000;
    if (delta >= 0 && delta <= Math.max(1.25, elapsed + 0.25)) {
      watchedRef.current += Math.min(delta, elapsed);
      positionRef.current = video.currentTime;
    } else {
      video.currentTime = positionRef.current;
    }
    lastTickRef.current = now;
    const duration = video.duration;
    if (Number.isFinite(duration) && duration > 0) {
      const percent = Math.min(100, Math.floor((watchedRef.current / duration) * 100));
      for (const milestone of milestones) {
        if (percent >= milestone && !milestonesRef.current.has(milestone)) {
          milestonesRef.current.add(milestone);
          trackMetaEvent("VideoProgress", { video_id: "house-bali-vsl", percent: milestone, duration_seconds: Math.round(duration), watched_seconds: Math.round(watchedRef.current), milestone: `${milestone}%` });
        }
      }
    }
    if (!unlockedRef.current && watchedRef.current >= vslConfig.unlockAfterSeconds) {
      unlockedRef.current = true;
      onUnlock();
    }
  };

  return (
    <div className="video-stage" aria-label="Vídeo exclusivo House Bali">
      {vslConfig.videoUrl ? (
        <video
          ref={videoRef}
          className="video-media"
          src={vslConfig.videoUrl}
          poster={poster}
          autoPlay
          playsInline
          preload="metadata"
          controls={false}
          controlsList="nodownload noplaybackrate noremoteplayback nofullscreen"
          disablePictureInPicture
          disableRemotePlayback
          onContextMenu={(event) => event.preventDefault()}
          onTimeUpdate={trackPlayback}
          onSeeking={() => {
            const video = videoRef.current;
            if (video && Math.abs(video.currentTime - positionRef.current) > 0.15) {
              video.currentTime = positionRef.current;
            }
            lastTickRef.current = null;
          }}
          onRateChange={() => {
            const video = videoRef.current;
            if (video && video.playbackRate !== 1) video.playbackRate = 1;
          }}
          onPlaying={() => {
            setNeedsPlay(false);
            lastTickRef.current = performance.now();
            if (!startedRef.current) {
              startedRef.current = true;
              trackMetaEvent("VideoStarted", { video_id: "house-bali-vsl" });
            }
          }}
          onPause={() => { setNeedsPlay(true); lastTickRef.current = null; }}
          onWaiting={() => { lastTickRef.current = null; }}
          onEnded={() => {
            setNeedsPlay(false);
            if (!milestonesRef.current.has(100) && videoRef.current && Number.isFinite(videoRef.current.duration) && watchedRef.current / videoRef.current.duration >= 0.99) {
              milestonesRef.current.add(100);
              trackMetaEvent("VideoProgress", { video_id: "house-bali-vsl", percent: 100, duration_seconds: Math.round(videoRef.current.duration), watched_seconds: Math.round(watchedRef.current), milestone: "100%" });
            }
          }}
          onError={() => setFailed(true)}
        />
      ) : (
        <img className="video-media" src={poster} alt="Villa tropical em Bali, com piscina e iluminação vermelha" width={1024} height={1024} fetchPriority="high" />
      )}
      {(needsPlay || !vslConfig.videoUrl || failed) && (
        <div className="video-overlay">
          {failed ? <p role="alert" className="video-failure">Não foi possível carregar o vídeo. Tente novamente em instantes.</p> : (
            <div className="video-prompt">
              <Button variant="video" aria-label={vslConfig.videoUrl ? "Assistir com áudio" : "Vídeo em breve"} disabled={!vslConfig.videoUrl} onClick={startPlayback}>
                <Play aria-hidden="true" />
              </Button>
              <span className="video-placeholder-caption">{vslConfig.videoUrl ? "Assistir com áudio" : "Seu acesso começa aqui"}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
