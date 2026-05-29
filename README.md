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
3. **Memory-First Framing:** Every archive reveal must respect the photograph before the interface around it. Opened memories are treated like hand-held prints: lifted into the visible viewport, protected from browser chrome, and allowed to breathe without being cropped by the surrounding darkness.
4. **Procedural Elegance:** Instead of relying on static assets for interactions, we use procedural generation. A prime example is the Web Audio API synthesis that triggers delicate, spatially-panned starlight chimes upon any click on the screen.
5. **Sophisticated Typography:** The contrast between stark tech-forward layouts and deep romance is balanced through typography. We utilize `Inter` for clean legibility, `JetBrains Mono` for structural clarity, and `Lora` to provide that deeply personal, editorial, and romantic edge.
6. **Launch-Night Stability:** Final polish favors invisible reliability over flashy changes: dependency installation is verified, TypeScript must pass, production builds must complete cleanly, and cinematic details like hidden scrollbars are kept standards-compliant so the birthday observatory feels effortless on opening night.
7. **Editable Emotional Script:** All visible words now live in carefully categorized Pages CMS content files, so the birthday story can be rewritten like a film script—headings, journal entries, timestamps, captions, buttons, loading copy, hidden notes, and accessibility labels—without opening the application code.
8. **Human-Readable CMS Editing:** Pages CMS repeatable memory rooms are shaped as named, collapsible cards instead of raw objects, so each editable constellation photo, journal entry, polaroid, film frame, and navigation link announces itself clearly before anyone opens it.
9. **Fresh Premiere on Every Reload:** A browser refresh is treated like raising the curtain again, not resuming a half-watched scene. The observatory intentionally resets to the envelope so the birthday experience always starts from the beginning.
10. **Single-URL Memory Stage:** Navigation now behaves like lighting cues on one continuous stage instead of sending the visitor to separate webpages. The Journal, Archive, and Sky swap in place at the same address, preserving the illusion that this is one cinematic birthday observatory rather than a traditional website; the Projection Room remains built backstage but is not currently exposed to guests.
11. **Layered Memory Audio:** Special memory artifacts can now speak above the score without stealing the room from it. The Archive video is allowed to carry its own sound at a defined 70% volume while the ambient soundtrack continues underneath at whatever volume the scene had already established.
12. **Future-Proof AI Stage Door:** A secure server-side AI gateway now sits behind the observatory curtain. Any future on-screen AI moment can call a local helper that talks to a private Vercel API route, so the NVIDIA NIM key stays hidden in environment variables and never appears in browser code.

## ✨ Core Features
*   **The Envelope Entry:** A physical-feeling onboarding process that requires a deliberate "click to open," granting the browser required permissions to autoplay the cinematic audio. Reloading the site now returns here every time, even if the last scene was the Journal, Archive, or Projection Room.
*   **Offline-Ready Seamless Preloader:** A rigorous initialization sequence that caches every image, video, memory, and musical note before the curtain rises. Using a Service Worker and immediate memory preloading, the entire digital birthday gift can be experienced offline with absolute zero buffering.
*   **Interactive WebGL Sky:** A dynamic `Three.js` background with starry particle systems. When navigating between memories, the camera seamlessly "hyperjumps" through the cosmos while the scene dynamically rotates.
*   **Same-Address Scene Navigation:** The top tabs are now in-place scene switches, not route links. Clicking Journal, Archive, or Sky changes the visible room, lets the soundtrack breathe through a two-second fader, and triggers the cosmic background transition while the browser stays on the same URL. The Projection Room code remains intact behind the curtain, but its visible entry points are temporarily removed.
*   **Archive Memory Constellation:** The Archive room now pins each uploaded `archive-photo-#.png` into its matching constellation memory node, so the scattered star map opens real personal photographs instead of placeholder light.
*   **The "Make a Wish" Mechanic:** Holding the Spacebar (or a long-press on mobile) triggers a hidden global event. The entire UI softens and blurs into the background as the ambient soundtrack drops, allowing a breathtaking cinematic orchestral swell to rise while a massive, brilliantly glowing shooting star streaks across the WebGL skybox.
*   **Generative Stardust Audio:** Clicking anywhere on the screen generates a unique, one-second twinkle. Using a procedural C-Major Pentatonic synth and stereo panning based on click coordinates, it feels like birthing stars directly into the void.
*   **Stateful, Contextual Soundtracks:** Rather than a single looping track, the website behaves like an immersive video game world. As you navigate from 'The Sky' to 'The Journal' and 'The Archive', the background audio glides through a deliberate two-second crossfade between distinct, theme-fitting ambient pieces. Crucially, each track remembers its playback time—meaning returning to a page seamlessly resumes its exact atmospheric moment, creating an uninterrupted, persistent emotional cadence while remaining quiet enough to let the procedural chimes shine.
*   **Audible Archive Video:** The Archive's central video memory now plays with its own audio at 70% volume, layered over the existing nostalgic background score instead of muting or ducking it. If a browser asks for one more direct interaction before allowing video sound, the player is prepared to retry with sound on the next tap or click while the moment is in view, and that pause/resume tap now works reliably through keyboard and pointer controls.
*   **Framed Memories:** Cinematic layout cards and journal entries recount milestones with grace and fluid `framer-motion` animations. Journal memories now carry their own misted photographic backdrops, and each photo is bound to the touch-to-illuminate lantern so the image emerges with the writing instead of sitting awkwardly in full view.
*   **Cinematic Parallax Scrolls:** In the Archive, the vintage film strip images gracefully slide within their frames at differing speeds as the user scrolls, creating an immersive, multi-layered sense of depth.
*   **Resilient Archive Placeholders:** The Archive constellation and film strip now remain theatrical even when a CMS image field is empty or an uploaded file is missing. Instead of a broken tab or shattered image icon, each memory frame falls back to a glowing starlit placeholder so the birthday reel never drops out of character.
*   **Launch-Ready Visual Polish:** Global scrollbar hiding is scoped to the page root for cleaner browser parsing, preserving the full-screen observatory illusion while keeping the production build calm and predictable.
*   **Full Pages CMS Text Control:** The content model is now divided into broad editing rooms—global interface/navigation/envelope text and page-specific memories—so non-coders can adjust virtually every word in the experience from Pages CMS, including journals, headings, titles, timestamps, captions, film labels, hidden constellation messages, and button labels.
*   **Reliable Pages CMS Editing Rooms:** The CMS map now follows Pages CMS' current `content` and `path` structure, separating Core Text from Page Text while giving photos, videos, and voice notes real media pickers. Editors can step into the birthday observatory, choose the room they want, and safely swap memories without touching code.
*   **Readable Pages CMS Memory Cards:** Repeatable CMS areas now use Pages CMS' supported object-list pattern with collapsed summaries, replacing confusing `[object Object]` rows with recognizable captions, dates, coordinates, frame codes, and route labels.
*   **AI-Ready NIM Gateway:** A Vercel serverless endpoint (`/api/nim-chat`) and matching browser helper (`askNim`) are now in place so future AI-powered birthday interactions can be added quickly while keeping the private NVIDIA NIM key locked safely on the server side.

## 🛠 Tech Stack
*   **Framework:** React 19 & Vite
*   **Styling:** Tailwind CSS
*   **Animation & Routing:** Framer Motion, React Router v7
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
*   **[v1.21.0]** - Launch-Night Readiness: Installed the full dependency constellation, refreshed the lockfile, verified TypeScript and production build health, and corrected the global hidden-scrollbar rule so the final cinematic birthday run-up is quieter, cleaner, and ready for opening night.
*   **[v1.22.0]** - Pages CMS Full Text Wiring: Rebuilt the CMS structure into clear content categories and added a dedicated global interface script file. The digital birthday observatory can now be copy-edited from Pages CMS across visible page copy, journal passages, headings, dates, captions, hidden star messages, loading language, interaction buttons, and accessibility labels without touching React code.
*   **[v1.23.0]** - Pages CMS Restoration: Repaired the Pages CMS configuration to use the current `content`/`path` schema and cinematic group menus, then upgraded memory fields to dedicated image, video, and audio pickers. Uploaded files now keep their exact extensions at runtime, so new CMS-selected media can appear inside the observatory without breaking the illusion.
*   **[v1.24.0]** - Pages CMS Readability Rescue: Converted every repeatable CMS memory row from an ambiguous object display into a collapsible, labeled editing card. The observatory's editor now surfaces captions, dates, coordinates, frame codes, and route names up front, making the birthday script practical to revise without decoding developer-shaped data.
*   **[v1.25.0]** - Fresh Premiere Reloads: Removed the feeling of sticky browser tabs by resetting every page reload to `/`, clearing the old entry marker, and forcing the birthday observatory to boot from the preloader and envelope instead of reopening the last visited scene.
*   **[v1.26.0]** - Single-URL Observatory Navigation: Replaced separate route-based tabs with in-memory scene switching, so Journal, Archive, Projection, and Sky now unfold on the same browser address without accidental restarts. The WebGL sky, audio crossfades, and Journal's archive handoff now listen to the active scene cue instead of changing webpages, preserving the digital birthday experience as one uninterrupted cinematic room.
*   **[v1.27.0]** - Gentle Soundtrack Faders: Re-timed the three global ambient scores to move through a full two-second fade whenever the Sky, Journal, or Archive takes the spotlight, softening every musical handoff so the birthday observatory feels like one continuous film score instead of separate tracks.
*   **[v1.28.0]** - Audible Archive Reel: Unmuted the Archive's holographic video moment, set it to play at 70% volume, and kept the nostalgic background music untouched beneath it so the personal clip can breathe without breaking the continuous birthday soundtrack.
*   **[v1.29.0]** - Archive Fallback Constellations: Hardened the Archive tab against missing CMS image fields and missing uploaded files. Constellation nodes, lightboxes, and film frames now fade into intentional starlit placeholders instead of crashing the cinematic birthday experience.
*   **[v1.30.0]** - Interactive Archive Playback Polish: Refined the archive reel's tap/click pause control to immediately satisfy browser interaction rules for audible playback, hardened rapid toggle reliability, and exposed keyboard-accessible play/pause interaction while preserving the no-UI cinematic look.
*   **[v1.31.0]** - NIM Stargate Foundation: Added a secure Vercel serverless route for NVIDIA NIM chat completions and a reusable browser-side helper so future AI scenes can be summoned without ever exposing the private API key in front-end code.
*   **[v1.32.0]** - Projection Room Intermission: Temporarily removed the visible Projection tab and disabled its clickable sky constellation handoff, keeping the cinematic screening room preserved in code while preventing birthday guests from entering it until the moment is ready.
*   **[v1.33.0]** - Journal Lantern Calibration: Wired the Journal entries to their dedicated background photos, softened wheel and arrow travel to half-speed pacing, and lifted the custom up/down controls above the finale call-to-action layer so the return climb works even at the absolute bottom of the birthday scroll.
*   **[v1.34.0]** - Journal Photo Lantern Rescue: Rebalanced the Journal image layers so memory photos are no longer buried at near-invisible opacity. Each photograph now waits inside the same touch-to-illuminate lantern as the writing, then blooms softly during the full-page reveal instead of appearing awkwardly all at once.
*   **[v1.35.0]** - Archive PNG Memory Wiring: Connected the five uploaded Archive PNGs to their matching constellation memories and corrected the media guide so the birthday archive now displays the real scattered photo stars instead of intentional fallback placeholders.
*   **[v1.36.0]** - Archive Memory Lift: Re-centered opened constellation memories through a dedicated viewport overlay, locked background scrolling while a print is open, and resized the photo frame so mobile browser bars no longer crop the 70% image reveal or leave a long black runway before the birthday photograph.
*   *Exploration:* Investigating invisible, generative AI mechanics (Gemini) as a background "director" to orchestrate physics and asset curation without exposing obvious generated text.
*   *Planned:* Parallax memory carousels mapped to real-world star coordinates.

---
*Created with love and code.*
