import InfiniteGallery from "./ui/3d-gallery-photography";
import { heroImages } from "../data/hero-images";
import { TextGlitch } from "./ui/text-glitch-effect";

// ─────────────────────────────────────────────────────────────────────────────
// 🎛  GALLERY SPEED — how fast the images fly past. 0.2 = slow drift, 3.0 = fast
// 🎛  GALLERY_COUNT — how many images are visible in the tunnel at once
//     Lower = fewer, more spread out. Higher = denser tunnel.
//     Suggested range: 6 (sparse) → 20 (dense)
// ─────────────────────────────────────────────────────────────────────────────
const GALLERY_SPEED = 0.5;
const GALLERY_COUNT = 10;

export function LandingHero() {
  return (
    <main className="min-h-screen h-full w-full bg-black relative">
      <div className="absolute inset-0 pointer-events-none opacity-70 z-0 bg-black">
        <InfiniteGallery
          images={heroImages}
          speed={GALLERY_SPEED}
          zSpacing={3}
          visibleCount={GALLERY_COUNT}
          falloff={{ near: 0.8, far: 14 }}
          className="h-screen w-full overflow-hidden"
        />
      </div>

      <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center text-center px-6 text-white z-10">
        <h1 className="font-sans text-6xl md:text-8xl lg:text-9xl tracking-tight font-bold mb-6 drop-shadow-[0_0_30px_rgba(0,0,0,0.9)] uppercase">
          HEMLO
        </h1>
        <p className="pointer-events-auto text-lg md:text-2xl text-white opacity-90 max-w-3xl font-medium tracking-wide drop-shadow-[0_0_20px_rgba(0,0,0,0.9)] mb-10 leading-relaxed text-balance">
          HEMLO is an AI automation agent and algorithmic market simulation platform that allows users to predict future scenarios.
        </p>
        <a
          href="https://app.hemloai.com"
          rel="noopener noreferrer"
          className="pointer-events-auto bg-white text-black px-10 py-4 rounded-full font-semibold tracking-wide shadow-[0_0_40px_rgba(255,255,255,0.2)] hover:bg-slate-200 transition-colors hover:scale-105 duration-200 inline-block"
        >
          Start Analysing
        </a>
      </div>


    </main>
  );
}
