import { useEffect } from "react";
import { initMetaPixel, trackMetaEvent } from "@/lib/meta-tracking";

export function MetaPixel() {
  useEffect(() => {
    initMetaPixel();
    trackMetaEvent("PageView", {}, true);
  }, []);
  return null;
}
