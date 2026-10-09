import { createFileRoute } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { VslPlayer } from "@/components/vsl-player";
import { vslConfig } from "@/lib/vsl-config";
import { trackMetaEvent } from "@/lib/meta-tracking";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Acesso Exclusivo | House Bali Oficial" },
      { name: "description", content: "Entre na área privada House Bali. Conteúdo premium e acesso direto aos membros. Vagas limitadas." },
      { property: "og:title", content: "Acesso Exclusivo | House Bali Oficial" },
      { property: "og:description", content: "Seu acesso à área privada House Bali. Conteúdo premium, acesso direto aos membros e vagas limitadas." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  const [unlocked, setUnlocked] = useState(false);
  const [secondVideoWatched, setSecondVideoWatched] = useState(false);
  const secondVideoRef = useRef<HTMLVideoElement>(null);
  const secondVideoPositionRef = useRef(0);
  const secondVideoWatchedSecondsRef = useRef(0);
  const secondVideoLastTickRef = useRef<number | null>(null);

  const trackSecondVideoPlayback = () => {
    const video = secondVideoRef.current;
    if (!video || video.seeking || video.paused) return;
    const now = performance.now();
    const delta = video.currentTime - secondVideoPositionRef.current;
    const elapsed = secondVideoLastTickRef.current === null ? 0 : (now - secondVideoLastTickRef.current) / 1000;
    if (delta >= 0 && delta <= Math.max(1.25, elapsed + 0.25)) {
      secondVideoWatchedSecondsRef.current += Math.min(delta, elapsed);
      secondVideoPositionRef.current = video.currentTime;
    } else {
      video.currentTime = secondVideoPositionRef.current;
    }
    secondVideoLastTickRef.current = now;
  };

  return (
    <main className="vsl-page">
      <div className="ambient ambient-one" aria-hidden="true" />
      <div className="ambient ambient-two" aria-hidden="true" />
      <div className="brand" role="img" aria-label="House Bali Oficial">
        <svg className="brand-mark" viewBox="0 0 40 28" fill="none" aria-hidden="true">
          <path d="M3 14 20 3l17 11M8 12v13h24V12M16 25V15h8v10" stroke="currentColor" strokeWidth="2" strokeLinecap="square" />
        </svg>
        <span className="brand-name">HOUSE BALI</span>
        <span className="brand-official">O F I C I A L</span>
      </div>
      <div className="vsl-content">
        <p className="intro-kicker"><span className="status-dot" /> ACESSO PRIVADO <span className="kicker-divider">/</span> HOUSE BALI</p>
        <h1 className="vsl-headline"><span className="headline-accent"><span className="headline-line">Acesso Privado</span> <span className="headline-line headline-glow">Liberado por Tempo Limitado</span></span></h1>
        <p className="vsl-subheadline">Só quem assiste o vídeo completo libera a entrada na área exclusiva House Bali. Vagas sendo preenchidas agora.</p>
        <p className="vsl-curiosity"><span className="curiosity-spark" aria-hidden="true">✦</span> O que você vai ver a seguir não fica disponível por muito tempo…</p>
        <VslPlayer onUnlock={() => setUnlocked(true)} />

        {unlocked && (
          <div className="conversion-area" aria-live="polite">
            {!secondVideoWatched ? (
              <section className="offer-frame" aria-label="Vídeo final House Bali">
                <p className="offer-eyebrow">ACESSO QUASE LIBERADO</p>
                <h2 className="offer-title">Antes de entrar, veja isso</h2>
                <p className="offer-description">Assista a esta última mensagem para conhecer melhor o acesso exclusivo House Bali.</p>
                {vslConfig.secondVideoUrl ? (
                  <div className="video-stage second-video-stage">
                    <video
                      ref={secondVideoRef}
                      className="video-media"
                      src={vslConfig.secondVideoUrl}
                      controls
                      playsInline
                      preload="metadata"
                      onPlaying={() => { secondVideoLastTickRef.current = performance.now(); }}
                      onWaiting={() => { secondVideoLastTickRef.current = null; }}
                      onPause={() => { secondVideoLastTickRef.current = null; }}
                      onTimeUpdate={trackSecondVideoPlayback}
                      onSeeking={() => {
                        const video = secondVideoRef.current;
                        if (video && Math.abs(video.currentTime - secondVideoPositionRef.current) > 0.15) {
                          video.currentTime = secondVideoPositionRef.current;
                        }
                        secondVideoLastTickRef.current = null;
                      }}
                      onEnded={() => {
                        const video = secondVideoRef.current;
                        if (video && Number.isFinite(video.duration) && video.duration > 0 &&
                          secondVideoWatchedSecondsRef.current / video.duration >= 0.98) {
                          setSecondVideoWatched(true);
                        }
                      }}
                      onContextMenu={(event) => event.preventDefault()}
                      aria-label="Vídeo final antes da oferta House Bali"
                    />
                  </div>
                ) : (
                  <p role="alert" className="video-failure">O vídeo final não está configurado no momento.</p>
                )}
                <p className="offer-note">A oferta será liberada ao terminar o vídeo.</p>
              </section>
            ) : (
              <>
                <section className="offer-frame" aria-label="Oferta de acesso exclusivo House Bali">
                  <p className="offer-eyebrow">CONVITE EXCLUSIVO</p>
                  <h2 className="offer-title">Garanta sua exclusividade</h2>
                  <p className="offer-description">Entre na área exclusiva House Bali por apenas</p>
                  <p className="offer-price"><span>R$</span> 9,99</p>
                  <p className="offer-note">Seu acesso começa aqui.</p>
                  <Button variant="checkout" asChild>
                    <a href={vslConfig.checkoutUrl} target="_blank" rel="noopener noreferrer" onClick={() => trackMetaEvent("InitiateCheckout", { content_name: "Acesso exclusivo House Bali", content_ids: "house-bali-access", content_type: "product", value: 9.99, currency: "BRL" }, true)}>QUERO MEU ACESSO AGORA<ArrowRight aria-hidden="true" /></a>
                  </Button>
                </section>
                <p className="urgency">Oferta por tempo limitado. Esta página pode ser removida a qualquer momento.</p>
              </>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
