import { useCallback } from "react";
import Particles from "react-tsparticles";
import { loadSlim } from "tsparticles-slim";
import type { Engine } from "tsparticles-engine";

export function GlobalDust() {
  const particlesInit = useCallback(async (engine: Engine) => {
    await loadSlim(engine);
  }, []);

  return (
    <div className="fixed inset-0 z-[5] pointer-events-none mix-blend-screen opacity-40">
      <Particles
        id="tsparticles"
        init={particlesInit}
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
              value: "#ffffff",
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
                area: 800,
              },
              value: 150,
            },
            opacity: {
              value: { min: 0.1, max: 0.5 },
              animation: {
                enable: true,
                speed: 0.5,
                minimumValue: 0.1,
                sync: false,
              },
            },
            shape: {
              type: "circle",
            },
            size: {
              value: { min: 0.5, max: 2 },
            },
          },
          detectRetina: true,
        }}
        className="w-full h-full pointer-events-none"
      />
    </div>
  );
}
