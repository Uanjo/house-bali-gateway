import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
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
          </div>
        )}
      </div>
    </main>
  );
}
