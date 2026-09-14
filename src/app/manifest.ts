import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Nicole App",
    short_name: "Nicole App",
    description: "A simple personal finance tracker for Nicole.",
    start_url: "/",
    display: "standalone",
    background_color: "#FFB2D0",
    theme_color: "#FFB2D0",
    icons: [
      {
        src: "/icon.png",
        sizes: "1254x1254",
        type: "image/png",
      },
    ],
  };
}
