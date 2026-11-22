import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

// App icon when someone adds the site to their phone's home screen.
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: site.name,
    short_name: "Novus",
    description: site.oneLiner,
    start_url: "/",
    display: "browser",
    background_color: "#FFFFF8",
    theme_color: "#FFFFF8",
    icons: [
      { src: "/brand/icon/android-chrome-192.png", sizes: "192x192", type: "image/png" },
      { src: "/brand/icon/android-chrome-512.png", sizes: "512x512", type: "image/png" },
    ],
  };
}
