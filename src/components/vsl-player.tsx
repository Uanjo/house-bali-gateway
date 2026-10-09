import { useEffect, useRef, useState } from "react";
import { Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import poster from "@/assets/bali-video-poster.jpg";
import { vslConfig } from "@/lib/vsl-config";

export function VslPlayer({ onUnlock }: { onUnlock: () => void }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const positionRef = useRef(0);
  const watchedRef = useRef(0);
  const lastTickRef = useRef<number | null>(null);
  const unlockedRef = useRef(false);
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
          onPlaying={() => { setNeedsPlay(false); lastTickRef.current = performance.now(); }}
          onPause={() => { setNeedsPlay(true); lastTickRef.current = null; }}
          onWaiting={() => { lastTickRef.current = null; }}
          onEnded={() => { setNeedsPlay(false); }}
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