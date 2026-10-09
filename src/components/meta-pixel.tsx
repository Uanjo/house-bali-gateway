import { useEffect } from "react";
import { initMetaPixel, trackMetaEvent } from "@/lib/meta-tracking";

const META_PIXEL_ID = "1552429686559209";

export function MetaPixel() {
  useEffect(() => {
    initMetaPixel();
    trackMetaEvent("PageView", {}, true);
  }, []);

  return (
    <noscript>
      <img
        height="1"
        width="1"
        style={{ display: "none" }}
        src={`https://www.facebook.com/tr?id=${META_PIXEL_ID}&ev=PageView&noscript=1`}
        alt=""
      />
    </noscript>
  );
}
