import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { VslPlayer } from "@/components/vsl-player";
import { vslConfig } from "@/lib/vsl-config";

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
      <div className="brand" role="img" aria-label="House Bali Oficial">
        <svg className="brand-mark" viewBox="0 0 40 28" fill="none" aria-hidden="true">
          <path d="M3 14 20 3l17 11M8 12v13h24V12M16 25V15h8v10" stroke="currentColor" strokeWidth="2" strokeLinecap="square" />
        </svg>
        <span className="brand-name">HOUSE BALI</span>
        <span className="brand-official">O F I C I A L</span>
      </div>
      <div className="vsl-content">
        <h1 className="vsl-headline"><span className="headline-accent">Acesso Exclusivo Liberado:</span>{" "}Entre Agora na Área Privada House Bali</h1>
        <p className="vsl-subheadline">Conteúdo premium + acesso direto aos membros. Vagas limitadas.</p>
        <VslPlayer onUnlock={() => setUnlocked(true)} />
        {unlocked && (
          <div className="conversion-area" aria-live="polite">
            {vslConfig.checkoutUrl ? (
              <Button variant="checkout" asChild>
                <a href={vslConfig.checkoutUrl}>QUERO MEU ACESSO AGORA<ArrowRight aria-hidden="true" /></a>
              </Button>
            ) : (
              <Button variant="checkout" disabled title="Checkout ainda não configurado">QUERO MEU ACESSO AGORA<ArrowRight aria-hidden="true" /></Button>
            )}
            <p className="urgency">Oferta por tempo limitado. Esta página pode ser removida a qualquer momento.</p>
          </div>
        )}
      </div>
    </main>
  );
}
