# Portfolio v3 — single notebook + a fully visual world

## Context

After the last pass we shipped three variations (notebook, terminal, IDE) behind a design canvas, plus a hidden 6-page magazine in "world mode." Feedback after living with it:

1. **The terminal and IDE variations aren't carrying their weight.** Two extra surfaces to maintain, two extra ways for visitors to land in the wrong place. **Keep notebook only; delete terminal and IDE.**
2. **The "enter the world" pill should stay pinned in one place with a satisfying *left-to-right shine* animation inside it** so visitors notice it without it being loud.
3. **The world isn't visual enough — it's a second reading surface.** The notebook already covers "reading." The world should be the *opposite*: parallax scenes, animated illustrations, horizontal-swipe project carousel, scroll-revealed sections. Don't follow the notebook's typographic style.
4. **The bird / pot / plot / doodle triggers should go back to their original margin positions** (the negative offsets that peek off-canvas). The "first-visit pulse" and "idle glow" added in the last pass should be reverted too — back to the previous version only.

User-confirmed scope:
- index.html *becomes* the notebook (cleanest URL).
- World style: **parallax scroll** + **horizontal swipeable carousels** (touch swipe on mobile, click-drag on desktop) for projects and any other applicable strip.
- All four world sections kept: hero, projects, garden + skills, contact/postcard. (Bookshelf included with garden/skills section.)
- CTA shimmer: **light sweep / shine** sliding L→R across the pill.

## Goals

- One URL, one variation: `/` is the notebook.
- World mode feels like a different medium from the notebook — animated, illustrated, scrollable in two directions (down for the story, sideways for the carousels).
- The CTA into the world is unmissable but quiet — a sweeping shine, not a flashing badge.
- No regressions on the things the last pass got right: `live-pill` project links, agent-link footer, JSON-LD, `WORLD.enter/exit` API, `#world` deep-link.

---

## Changes

### 1. Collapse the site to a single notebook page

**Delete** (no longer used):
- `terminal.html`, `terminal.js`
- `ide.html`, `ide.js`
- `design-canvas.jsx`
- `chrome.js` (variation switcher is meaningless with one variation)
- `world-cta.js`'s "fallback link to notebook.html#world" branch — collapse to just the button form.

**Replace** the current `index.html` (the design canvas):
- Move all content of `notebook.html` into `index.html`.
- Delete `notebook.html` (or leave a one-line redirect for old links).
- Update `bio.js` `site:` field if needed (`https://vanchivikash.vercel.app` still works as root).
- Remove the jumpbar and `mobile-stack` block — they pointed at terminal/ide.
- Strip the `chrome.js` script tag. Keep `world-cta.js`.
- Keep the JSON-LD already injected by `agent-seo.js`; the Person block I added inline to the old index can be dropped (agent-seo.js already injects equivalent).

### 2. Revert bird / pot / plot / doodle triggers to the previous version

Touch `world.js` and `world.css`:

- **`world.js:36-39`** — restore the original negative offsets:
  - `pot`    → `top: 150px,    right: -12px`
  - `bird`   → `top: 16px,     right: 18px`
  - `plot`   → `bottom: 220px, right: -8px`
  - `doodle` → `bottom: 440px, left:  -22px`
- **`world.js`** — remove the `SEEN_KEY` / `w-first-visit` first-visit logic added last pass. Triggers go back to silent easter-eggs.
- **`world.css`** — remove `@keyframes w-first-halo`, `@keyframes w-first-hint`, `body.w-first-visit .w-trig` rules, and the idle `box-shadow` / `filter: drop-shadow` glow + scale-on-hover changes. Restore the original trigger block: just the hover hint tooltip + the per-kind drip/flap/wiggle animations.
- Keep `window.WORLD.{enter,exit,toggle,isOpen}` exposure and lazy magazine build — those are useful regardless.
- Keep the dev-only "WORLD_ART missing" badge.

### 3. "Enter the world" pill: pinned + light-sweep shimmer

The pill stays where it is today — in the notebook `.toolbar`, sticky at the top of the page (the toolbar is already `position: sticky`). That satisfies "stays in one place."

Update `world.css` so the pill has a *light sweep* animation traveling L→R across it, looping every ~3.2s:

```css
.toolbar .world-cta { position: relative; overflow: hidden; }
.toolbar .world-cta::before {
  content: ""; position: absolute; inset: 0;
  background: linear-gradient(115deg, transparent 25%, rgba(255,255,255,.45) 50%, transparent 75%);
  transform: translateX(-100%);
  animation: w-cta-sweep 3.2s ease-in-out infinite;
  animation-delay: 1.4s; /* first sweep after the page settles */
  pointer-events: none;
}
@keyframes w-cta-sweep {
  0%   { transform: translateX(-100%); }
  60%  { transform: translateX(100%); }
  100% { transform: translateX(100%); }
}
```

Pause the sweep on `:hover` and on `prefers-reduced-motion`. Replace the existing twinkle on `.world-cta-spark` with a still spark (the sweep is enough motion). In world mode (`.is-open`) suppress the sweep — the user has already engaged.

### 4. Fully visual world — parallax scroll + horizontal carousels

**This is a full revamp of world mode — not a re-skin.** Throw out the magazine entirely:

- Delete `buildMagazine()` and every page builder in `world.js` (cover, profile, projects, garden, shelf, postcard).
- Delete the entire `.w-magazine` / `.w-page` / `.w-cover` / `.w-profile` / `.w-projects` / `.w-garden` / `.w-shelf` / `.w-postcard` section of `world.css`.
- **Discard the existing SVG builders in `world-art.js`** (`coverArt`, `portrait`, `fortress`, `projChatflow`, `projGexplain`, `projMystream`, `gardenArt`, `bookshelf`, `stamp`, `postmark`, `checkmark`). They were drawn for the magazine's editorial/Riso aesthetic and shouldn't constrain the new visual language. The only things to keep from `world-art.js` are the `defs()` block (grain/halftone filters are reusable), the trigger SVGs (bird/pot/plot/doodle), `foldHandle()`, `splashOverlay()`, and `foldOverlay()` — anything tied to enter/exit, not content.
- Build a fresh illustration set for the new scenes. New aesthetic direction: less editorial-magazine, more **living scene** — soft gradients, layered shapes, ambient motion. Pick a new palette if it helps (the existing Riso palette is fine if it lands, but don't feel bound by it). The goal is that a visitor flipping from notebook to world feels they've stepped into a different *medium*, not turned a page.

The world is a scene-based parallax scroll experience.

**Structure of the new world** (top → bottom). All illustrations are *new* — built from scratch as part of this work; do not lift the magazine SVGs:

1. **Hero scene** (`#w-scene-hero`, ~110vh)
   - Layered gradient sky with 3+ parallax bands (mountains, clouds, foreground hill or city silhouette — designer's call).
   - A celestial element (sun/moon/orb) with ambient pulse + halo.
   - A creature/object animating across the hero on entry — could be a bird, a paper plane, an ink-trail, whatever the new visual language wants. (The trigger bird remains its own thing in paper mode; don't conflate.)
   - Oversized headline + tagline + animated underline / glyph.
   - Scroll indicator at the bottom that fades in after 1.2s.

2. **Profile scene** (`#w-scene-profile`)
   - A new portrait illustration (geometric / abstract / glyph — not the magazine's literal head-and-shoulders).
   - A new "ground I stand on" motif (could be a desk, a window, a fortress, a constellation — open). Subtle bob/drift animation.
   - Bio text revealed line-by-line via IntersectionObserver `in-view` class (CSS transitions only — no JS animation libs).
   - Background: a fresh ambient layer; grain filter (`url(#w-grain)`) may be reused from the kept `defs()`.

3. **Projects carousel** (`#w-scene-projects`) — *horizontal swipe/drag strip*
   - Three project cards side-by-side. Each card carries a *new* illustration representing its project (security/orchestration for Chatflow, explanation/AI for gExplain, video/streaming for MyStream). Style should match the new world aesthetic, not the magazine cards.
   - Mobile: native `scroll-snap-type: x mandatory` on the strip; cards are `scroll-snap-align: center`. Touch swipe works natively.
   - Desktop: small drag-to-scroll handler (~30 lines, vanilla) — `mousedown` → record `startX`/`scrollLeft`, `mousemove` translates to `scrollLeft -= dx`, `mouseup` releases. Also wire wheel-with-shift → horizontal scroll, and ←/→ arrow keys when focused.
   - Indicator dots below reflecting `scrollLeft / clientWidth`.
   - Each card uses the existing `.live-pill` for the "open live ↗" CTA (that pill style is shared site-wide).

4. **Garden & skills** (`#w-scene-garden`)
   - A new heatmap visualization rendered into the scene — could still be a calendar grid but composed visually (plants, dots in motion, isometric tiles, etc.), driven from `B.heatmap`. Don't import `gardenArt()`.
   - Skills as floating chips that drift in on view with staggered delays.
   - Stats row (solved / E·M·H / streak / rank) built fresh into the scene's layout.

5. **Reading shelf** (`#w-scene-shelf`) — *horizontal carousel of books*
   - New "shelf" visual treatment (cards, spines, floating tiles — whatever fits the world's language).
   - Books from `B.learning` as a horizontal strip of mini-cards (same swipe/drag mechanic as projects). Each card: title, author, kind chip, status badge.

6. **Postcard finale** (`#w-scene-postcard`)
   - A new closing scene. "Postcard" is the metaphor we shipped before — feel free to reinterpret it as a letter, a signpost, a constellation of contact points, etc.
   - Contact links as oversized targets: email / github / leetcode / linkedin / phone. Each gets the `.live-pill` style.
   - "Fold back to notebook" CTA pinned at the end (in addition to the corner fold handle).

**Scroll machinery** (new section at bottom of `world.js`):

```js
function wireScenes() {
  // Parallax: single rAF-throttled scroll listener writes --scroll-y to body
  let ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      document.body.style.setProperty("--scroll-y", String(window.scrollY));
      ticking = false;
    });
  }
  window.addEventListener("scroll", onScroll, { passive: true });

  // Reveal-on-view
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add("in-view"); });
  }, { threshold: 0.18 });
  document.querySelectorAll(".w-reveal").forEach(el => io.observe(el));

  // Carousel drag-to-scroll (projects + shelf)
  document.querySelectorAll(".w-carousel").forEach(setupDragScroll);
}
```

Parallax in CSS uses the `--scroll-y` custom property:
```css
.w-cloud-1 { transform: translateX(calc(var(--scroll-y, 0) * -.15px)); }
.w-cloud-2 { transform: translateX(calc(var(--scroll-y, 0) * -.30px)); }
.w-sun     { transform: translateY(calc(var(--scroll-y, 0) *  .25px)); }
```

`prefers-reduced-motion`: gate every keyframe and parallax transform behind `@media (prefers-reduced-motion: no-preference)`.

**Mobile**: every scene is `min-height: 100vh` and reflows to single-column. Carousels already swipe-native. No design-canvas style draggable surface — just normal vertical scroll with horizontal carousels embedded.

**Lazy build**: the world DOM stays lazy-built on first `enter()` (already done last pass). The hero scene runs its load animation when world mode flips, not on initial page load.

### 5. Trim what the last pass over-applied

- `chrome.js` — delete (variation switcher no longer makes sense).
- `world-cta.js` — simplify: drop the `hasWorld` branching since WORLD is always present on the only remaining page.
- `index.html` (new — copied from notebook.html) — remove anything that referenced terminal/ide.
- `world.css` — remove `.chrome-*` styles (they came from chrome.js's injected stylesheet, so just deleting chrome.js removes them). Remove the `world-cta-twinkle` keyframes; remove first-visit pulse keyframes.
- `agent-seo.js` — no change needed; already injects JSON-LD/alternate links.

---

## Files

**Delete**:
- `terminal.html`, `terminal.js`
- `ide.html`, `ide.js`
- `design-canvas.jsx`
- `chrome.js`
- `notebook.html` (replaced by new `index.html`)

**Rewrite from scratch**:
- `index.html` — content of current `notebook.html`, jumpbar/mobile-stack removed, chrome.js script tag removed.
- `world.js` — new scene builders (`sceneHero`, `sceneProfile`, `sceneProjects`, `sceneGarden`, `sceneShelf`, `scenePostcard`), drag-to-scroll, IntersectionObserver reveal, parallax `--scroll-y` writer. Keep `window.WORLD` API, `#world` deep-link, dev badge, lazy build. Restore original trigger offsets, remove first-visit logic.
- `world.css` — replace `.w-magazine` + `.w-page` + per-page sections with scene-based layout (`.w-scene`, `.w-scene-hero`, `.w-carousel`, `.w-reveal`, `.w-cloud-*`, etc.). Add CTA light-sweep keyframe. Remove first-visit / idle-glow / cta-twinkle rules.

**Edit**:
- `world-cta.js` — drop the cross-page link fallback; always a `<button>` that calls `WORLD.toggle()`. Stays pinned in the notebook toolbar.
- `world-art.js` — **substantially gutted**. Keep only: `defs()` (grain/halftone filters), the four `trigger(kind)` SVGs, `foldHandle()`, `splashOverlay()`, `foldOverlay()`. Delete all magazine illustrations (`coverArt`, `portrait`, `fortress`, `checkmark`, `projChatflow`, `projGexplain`, `projMystream`, `gardenArt`, `bookshelf`, `stamp`, `postmark`). Add new builders for each new scene (e.g. `sceneSky()`, `sceneClouds()`, `projectArt(slug)`, `gardenScene(data)`, `shelfCard(book)`, `postcardScene()`) drawn fresh in the new visual language.
- `notebook.js` (renamed conceptually but file path stays — still loaded by the new `index.html`) — no functional change beyond what's already there.
- `bio.js` — unchanged.

## Verification

1. `ls portfolio/` shows no `terminal.*`, no `ide.*`, no `chrome.js`, no `design-canvas.jsx`, no `notebook.html`. Only `index.html` for HTML.
2. `node --check` passes for `world.js`, `world-cta.js`, `world-art.js`, `notebook.js`, `bio.js`, `heatmap.js`, `ai-chat.js`, `agent-seo.js`.
3. Open `index.html` → notebook renders identically to before. The four margin triggers (bird/pot/plot/doodle) sit at their original negative-offset positions with the original hover-only hints — no halo, no first-visit pulse.
4. The toolbar `enter the world` pill shows a diagonal shine sweeping L→R every ~3s. Sweep pauses on hover and on `prefers-reduced-motion`.
5. Click the pill → splash overlay plays → page replaced by the hero scene (sky, sun, bird flying in). Scroll down → profile reveals line-by-line → projects appear as a horizontal strip.
6. Projects strip on desktop: click-drag scrolls horizontally; mouse-wheel + shift scrolls horizontally; arrow keys when focused scroll one card at a time. Indicator dots update.
7. Projects strip on mobile (resize to 375 px): swipe horizontally with snap; each card fills viewport width with margin.
8. Garden scene shows the `gardenArt` heatmap at full width; skills chips fade/slide in staggered; stats row reads correctly with `rank ?? 0` guard intact.
9. Reading shelf is a horizontal carousel of books; postcard finale shows contact pills (`.live-pill` styling, "open live ↗" arrows for external links).
10. Escape, the corner fold handle, or the toolbar pill (now showing `⤺ fold back`) all return to the notebook smoothly.
11. Lighthouse mobile pass: no horizontal page scroll outside the intended carousels; tap targets ≥ 44 px; no console errors.
12. Headless screenshot of `index.html` shows toolbar with shine sweep mid-frame; screenshot of `index.html#world` shows the hero scene rendered.
