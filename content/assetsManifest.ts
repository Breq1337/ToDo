/**
 * Assets manifest: every file in public/images and where it is used.
 * Ensures no relevant asset remains unused.
 */

export type AssetUsage = {
  path: string;
  usedIn: string[];
};

/** All image/assets in public/images with their usage (page/section). */
export const assetsManifest: AssetUsage[] = [
  { path: "/images/todo_logo-21.jpeg", usedIn: ["Navbar", "Footer"] },
  { path: "/images/home1-3-1024x577.jpg", usedIn: ["Hero (main)"] },
  { path: "/images/entregador-1340x1536.jpeg", usedIn: ["Drivers section"] },
  { path: "/images/valores-1536x863.jpg", usedIn: ["About / Values section"] },
  { path: "/images/co2.jpeg", usedIn: ["Solution / Impact section"] },
  { path: "/images/polaroid1.jpg", usedIn: ["About / Cases visual"] },
  { path: "/images/polaroid2.jpg", usedIn: ["About / Cases visual"] },
  { path: "/images/aaron-burden-dXYE1d08BiY-unsplash-scaled.jpg", usedIn: ["Contact page background"] },
  { path: "/images/amazon_logo_icon_169612-150x150.jpg", usedIn: ["Partners marquee"] },
  { path: "/images/natura-108-150x150.jpg", usedIn: ["Partners marquee"] },
  { path: "/images/raiadrogasil-e1588124943738-150x150.jpg", usedIn: ["Partners marquee"] },
  { path: "/images/shein-logo-0-150x150.jpg", usedIn: ["Partners marquee"] },
  { path: "/images/logo_mercado-diferente_hQZ97N-150x150.jpg", usedIn: ["Partners marquee"] },
  { path: "/images/channels4_profile-1-150x150.jpg", usedIn: ["Partners marquee (if applicable)"] },
  { path: "/images/WhatsApp-Image-2024-09-19-at-19.34.16-1024x575.jpg", usedIn: ["Service / For companies section"] },
  { path: "/images/Captura-de-tela-2024-09-19-162403.jpeg", usedIn: ["Cases / Proof section"] },
  { path: "/images/Captura-de-tela-2024-09-19-162945.jpeg", usedIn: ["Cases / Proof section"] },
  { path: "/images/default.svg", usedIn: ["Icons fallback / decorative"] },
  { path: "/images/default (1).svg", usedIn: ["Social / UI icon"] },
  { path: "/images/default (2).svg", usedIn: ["Social / UI icon"] },
  { path: "/images/default (3).svg", usedIn: ["Social / UI icon"] },
  { path: "/images/default (4).svg", usedIn: ["Social / UI icon"] },
  { path: "/images/default (5).svg", usedIn: ["Social / UI icon"] },
];

/** Checklist: paths that are intentionally unused (duplicates or low-res only). */
export const unusedAssetPaths: string[] = [
  "/images/home1-3.jpg",
  "/images/home1-3-300x169.jpg",
  "/images/home1-3-768x432.jpg",
  "/images/entregador-262x300.jpeg",
  "/images/entregador-893x1024.jpeg",
  "/images/entregador.jpeg",
  "/images/entregador-768x880.jpeg",
  "/images/valores-300x169.jpg",
  "/images/valores-768x431.jpg",
  "/images/valores.jpg",
  "/images/valores-1024x575.jpg",
  "/images/polaroid1-300x265.jpg",
  "/images/polaroid1-768x678.jpg",
  "/images/WhatsApp-Image-2024-09-19-at-19.34.16-300x169.jpg",
  "/images/WhatsApp-Image-2024-09-19-at-19.34.16-768x431.jpg",
  "/images/WhatsApp-Image-2024-09-19-at-19.34.16.jpg",
  "/images/Captura-de-tela-2024-09-19-160735.jpeg",
  "/images/Captura-de-tela-2024-09-19-160735-272x300.jpeg",
  "/images/Captura-de-tela-2024-09-19-162403-300x169.jpeg",
  "/images/Captura-de-tela-2024-09-19-162403-768x432.jpeg",
  "/images/Captura-de-tela-2024-09-19-162403-1024x576.jpeg",
  "/images/Captura-de-tela-2024-09-19-162945-300x169.jpeg",
  "/images/Captura-de-tela-2024-09-19-162945-768x432.jpeg",
  "/images/Captura-de-tela-2024-09-19-162945-1024x576.jpeg",
  "/images/Captura-de-tela-2024-09-20-013420.jpeg",
  "/images/Captura-de-tela-2024-09-20-013420-273x300.jpeg",
  "/images/Captura-de-tela-2024-10-29-205629.jpeg",
  "/images/Captura-de-tela-2024-10-29-211313.jpeg",
  "/images/Captura-de-tela-2024-10-29-211313-167x300.jpeg",
  "/images/Captura-de-tela-2024-10-29-211427.jpeg",
  "/images/Captura-de-tela-2024-10-29-211427-300x278.jpeg",
];
