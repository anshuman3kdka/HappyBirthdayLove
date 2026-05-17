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
*   **Offline-Ready Seamless Preloader:** A rigorous initialization sequence that caches every image, video, memory, and musical note before the curtain rises. Using a Service Worker and immediate memory preloading, the entire digital birthday gift can be experienced offline with absolute zero buffering.
*   **Interactive WebGL Sky:** A dynamic `Three.js` background with starry particle systems. When navigating between memories, the camera seamlessly "hyperjumps" through the cosmos while the scene dynamically rotates.
*   **The "Make a Wish" Mechanic:** Holding the Spacebar (or a long-press on mobile) triggers a hidden global event. The entire UI softens and blurs into the background as the ambient soundtrack drops, allowing a breathtaking cinematic orchestral swell to rise while a massive, brilliantly glowing shooting star streaks across the WebGL skybox.
*   **Generative Stardust Audio:** Clicking anywhere on the screen generates a unique, one-second twinkle. Using a procedural C-Major Pentatonic synth and stereo panning based on click coordinates, it feels like birthing stars directly into the void.
*   **Stateful, Contextual Soundtracks:** Rather than a single looping track, the website behaves like an immersive video game world. As you navigate from 'The Sky' to 'The Journal' and 'The Archive', the background audio seamlessly crossfades between distinct, theme-fitting ambient pieces. Crucially, each track remembers its playback time—meaning returning to a page seamlessly resumes its exact atmospheric moment, creating an uninterrupted, persistent emotional cadence while remaining quiet enough to let the procedural chimes shine.
*   **Framed Memories:** Cinematic layout cards and journal entries to recount milestones with grace and fluid `framer-motion` animations.
*   **Cinematic Parallax Scrolls:** In the Archive, the vintage film strip images gracefully slide within their frames at differing speeds as the user scrolls, creating an immersive, multi-layered sense of depth.

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
*   **[v1.3.0]** - Added interactive Easter Eggs: A 3-tap wax seal confetti knock to open the envelope, and a hidden clickable Heart Constellation that zooms the camera and reveals a secret note.
*   **[v1.4.0]** - Implemented a comprehensive cinematic Preloader and PWA Service Worker. The site rigorously caches all assets upfront ensuring zero buffering and absolute seamless offline availability forever.
*   **[v1.5.0]** - "Searchlight" Journal Feature: Subverted standard scrolling on the journal page, replacing it with a tactile exploratory mechanic. Journal entries are shrouded in a heavy blur, requiring the user to touch/hover coordinates to illuminate the text underneath, creating an intimate, active reading experience controlled by custom spatial navigation arrows.
*   **[v1.6.0]** - The Orchestral Update: Replaced the static background audio with a stateful, three-part adaptive soundtrack. Uses smooth crossfading on route changes and persistent playback tracking so returning to a view feels like stepping right back into a paused moment in space.
*   **[v1.7.0]** - Cinematic Parallax Integration: Added `framer-motion` scroll hooks to the Archive page's vintage film strip photos, enabling a subtle, multi-layered parallax effect for enhanced depth-of-field during navigation.
*   **[v1.8.0]** - The "Make a Wish" Mechanic: Added a hidden, global interaction triggered by a 1.5s long-press (or Spacebar). The UI gentle-shakes to indicate the wish building, followed by a transformational event: the interface enters a dreamlike blur, ambient audio softens, a cinematic orchestral swell ascends, and a massive, brilliant shooting star streaks across the WebGL skybox, while a "Make a wish." text appears.
*   **[v1.9.0]** - "The Projection Room" Update: Added a volumetric cinematic screening room in deep space. Utilizing a custom raw WebGL shader (`AmbilightMesh`) processing a `THREE.VideoTexture`, it extracts colors frame-by-frame from playing video and dynamically projects a real-time reactive ambient glow across the screen. The existing stars and music naturally dim to a pristine void for focus, simulating real light bouncing off the walls of a dark room.
*   *Exploration:* Investigating invisible, generative AI mechanics (Gemini) as a background "director" to orchestrate physics and asset curation without exposing obvious generated text.
*   *Planned:* Parallax memory carousels mapped to real-world star coordinates.

---
*Created with love and code.*
