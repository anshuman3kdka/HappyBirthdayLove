# Nemo 🌌

> **An awesome, deeply personal, and cinematic digital birthday experience created for my girlfriend.**

This repository houses "Nemo", a web-based, interactive storytelling experience disguised as an observatory of memories. It is built to be more than a website—it is a breathtaking, starry journey designed to celebrate her birthday in the most memorable and romantic way possible.

## 🎯 Objective
To serve as an indelible, beautiful birthday gift. This site abandons the typical layout of modern web experiences in favor of complete emotional immersion, wrapping our memories, words, and milestones within the fabric of a celestial cosmos.

## 🎨 Theme & Design Philosophy
**Theme: "The Observatory"**
The universe is vast, but it finds meaning in the constellations we draw. The cosmic theme represents deep, boundless romance, placing our journey alongside the stars.

**Design Principles:**
1. **Cinematic First, Web Second:** Standard UI elements (like text highlighting and drag-and-drop images) are entirely disabled (`user-select: none`). This prevents accidental blue-highlighting from breaking the immersion, making the website feel like a playable indie film.
2. **Forced Immersion:** There are no audio controls. The background ambient score is persistent and mandatory, ensuring the emotional cadence is exactly as intended, from the moment the "envelope" is opened until the end.
3. **Procedural Elegance:** Instead of relying on static assets for interactions, we use procedural generation. A prime example is the Web Audio API synthesis that triggers delicate, spatially-panned starlight chimes upon any click on the screen.
4. **Sophisticated Typography:** The contrast between stark tech-forward layouts and deep romance is balanced through typography. We utilize `Inter` for clean legibility, `JetBrains Mono` for structural clarity, and `Lora` to provide that deeply personal, editorial, and romantic edge.

## ✨ Core Features
*   **The Envelope Entry:** A physical-feeling onboarding process that requires a deliberate "click to open," granting the browser required permissions to autoplay the cinematic audio.
*   **Interactive WebGL Sky:** A dynamic `Three.js` background with starry particle systems. When navigating between memories, the camera seamlessly "hyperjumps" through the cosmos while the scene dynamically rotates.
*   **Generative Stardust Audio:** Clicking anywhere on the screen generates a unique, one-second twinkle. Using a procedural C-Major Pentatonic synth and stereo panning based on click coordinates, it feels like birthing stars directly into the void.
*   **Global Ambient Audio:** A continuous track scoring the website across all routes, heightening the emotional impact without interruption.
*   **Framed Memories:** Cinematic layout cards and journal entries to recount milestones with grace and fluid `framer-motion` animations.

## 🛠 Tech Stack
*   **Framework:** React 18 & Vite
*   **Styling:** Tailwind CSS
*   **Animation & Routing:** Framer Motion, React Router v6
*   **3D / WebGL:** Three.js (@react-three/fiber, @react-three/drei)
*   **Audio Synthesis:** Web Audio API (Native)

## 🚀 Getting Started

To run the observatory locally:

```bash
# Install the dependencies
npm install

# Start the development server
npm run dev

# Build for production
npm run build
```

## 📝 Update Log & Future Enhancements
*This section tracks the ongoing evolution of the project.*

*   **[v1.0.0]** - Initial concept: Three.js skybox and basic routing.
*   **[v1.1.0]** - Typographic overhaul (Lora, Inter, JetBrains Mono).
*   **[v1.2.0]** - Added procedural, reactive chime sounds on global click using Web Audio API. Disable UI-breaking text selection. Lock background audio to "always-on" for cinematic effect.
*   *Planned:* Hidden constellation Easter eggs upon specific click sequences.
*   *Planned:* Parallax memory carousels mapped to real-world star coordinates.

---
*Created with love and code.*
