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
*   **[v1.10.0]** - Personalization Enhancements: Re-colored the global ambient dust with Lavender, Bougainvillea, and Carnation hues. Wove subtle references to her cat and favorite flowers into the Journal copy, and embedded a secret cat signet within the wax seal of the Envelope intro, cementing this as a truly tailored experience.
*   **[v1.11.0]** - Celestial Curations: Sculpted a custom interactive Feline Constellation into the WebGL Skybox, triggering a secret message. Shifted the entire spatial color grading from a standard deep-space void to a warm, "Soft Girl Sunset" and dusky Lavender visual language, affecting scene backgrounds, fog, and bloom auras. Engraved the front Envelope with a faint, pressed line-art watermark of intertwined Bougainvillea and Carnation leaves, while amplifying the Global Dust particles to mimic larger, drifting petals.
*   **[v1.12.0]** - Lavender Resonance: Re-tuned the interactive "The Observatory" chimes from a simple Major Pentatonic to a warmer, dreamier C-Lydian scale. Added a visual feedback layer of soft lavender ripples that bloom from her cursor on every click, creating a more cohesive, multi-sensory "Golden Hour" experience.
*   **[v1.13.0]** - Feline Immersion: Redrew the Cat Constellation into a clear, recognizable seated profile. Enriched the click interaction to trigger a localized stellar glow, paired with a custom procedural sub-bass "purr" built natively with the Web Audio API using amplitude-modulated saw/sine oscillators and low-pass filtering.
*   **[v1.14.0]** - Enhanced Universe: Expanded the WebGL skybox from a static flat layer into a massive, fully encompassing 360° 3D sphere. Placed the camera at the absolute center, scaling up stars and constellations to massive proportions.
*   **[v1.15.0]** - Celestial Restoration: Removed experimental "Window to the Universe" gyroscope and pointer-drag controls to prioritize a serene, curated viewing experience. Restored the classic shooting star and wish trajectories to follow viewport-relative paths, ensuring the "Golden Hour" visual language remains clean and predictable while still navigating a vast 3D starfield.
*   **[v1.17.0]** - Autonomous Asset Pipeline: Eliminated the need for hardcoded media lists. Implemented a custom Vite Discovery Plugin that dynamically scans the `public/assets` directory at build/dev time and feeds a real-time manifest to the preloader. Any photo, video, or audio file dropped into the repository is now automatically detected, pre-cached, and integrated into the 0-100% preparation sequence without a single line of code change.
*   **[v1.18.0]** - Extreme Offline Stability: Upgraded the PWA service worker with an aggressive caching strategy. The maximum cacheable asset threshold has been raised to 100MB, ensuring that even high-bitrate cinematic reels and orchestral soundtracks are stored locally and remain playable indefinitely in zero-connectivity environments.
*   **[v1.19.0]** - Global Sandbox Authorship: Integrated a comprehensive Git-based CMS configuration (`.pages.yml` via Pages CMS). The emotional core of the site—every caption, coordinate, polaroid, memory, and media piece—is now entirely modular and non-destructively editable via structured JSON content collections, enabling friction-free curation without touching code.
*   **[v1.20.0]** - Holographic Video UI: Upgraded the global `AutoplayVideo` wrapper. Videos now interact with the background using `mix-blend-screen` and soft opacity to appear as projected holograms. Added a slow 3D spatial tilt, a pulsating light spill, and immersive CRT scanlines. Implemented scroll-linked "No Autonomy" playback—videos pause immediately when scrolled and spring life solely when perfectly centered.
*   *Exploration:* Investigating invisible, generative AI mechanics (Gemini) as a background "director" to orchestrate physics and asset curation without exposing obvious generated text.
*   *Planned:* Parallax memory carousels mapped to real-world star coordinates.

---
*Created with love and code.*
