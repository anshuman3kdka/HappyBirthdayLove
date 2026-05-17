import { useState, useEffect } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import type { Engine } from "@tsparticles/engine";

export function GlobalDust() {
  const [init, setInit] = useState(false);

  useEffect(() => {
    initParticlesEngine(async (engine: Engine) => {
      await loadSlim(engine);
    }).then(() => {
      setInit(true);
    });
  }, []);

  if (!init) return null;

  return (
    <div className="fixed inset-0 z-[5] pointer-events-none mix-blend-screen opacity-40">
      <Particles
        id="tsparticles"
        options={{
          fullScreen: { enable: false, zIndex: 0 },
          fpsLimit: 60,
          interactivity: {
            events: {
              onHover: {
                enable: true,
                mode: "bubble",
                parallax: {
                  enable: true,
                  force: 60,
                  smooth: 10
                }
              },
            },
            modes: {
              bubble: {
                distance: 100,
                duration: 2,
                opacity: 0.8,
                size: 4,
              },
            },
          },
          particles: {
            color: {
              value: ["#ffffff", "#E6E6FA", "#D94689", "#FFB3BA"], // White, Lavender, Bougainvillea, Carnation
            },
            move: {
              direction: "none",
              enable: true,
              outModes: {
                default: "out",
              },
              random: true,
              speed: 0.3,
              straight: false,
            },
            number: {
              density: {
                enable: true,
                width: 1920,
                height: 1080
              },
              value: 150,
            },
            opacity: {
              value: { min: 0.1, max: 0.8 },
              animation: {
                enable: true,
                speed: 1,
                sync: false,
              },
            },
            shape: {
              type: "circle", // Keeping circle but scaling to mimic soft petals
            },
            size: {
              value: { min: 1, max: 3 }, // Slightly larger for out-of-focus petal effect
            },
          },
          detectRetina: true,
        }}
        className="w-full h-full pointer-events-none"
      />
    </div>
  );
}
