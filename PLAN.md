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

## Revamp mandate

**The world behind the notebook is being rebuilt from scratch — not re-skinned, not iterated on.** The current 6-page editorial magazine (cover, profile, projects, garden, shelf, postcard) is deleted in full: every page builder in `world.js`, every magazine illustration in `world-art.js`, and every `.w-magazine` / `.w-page` / per-page block in `world.css`. The replacement is a parallax-scrolling scene experience with horizontal swipe/drag carousels — a different *medium* from the notebook, not another reading surface. Anything in `world-*` that doesn't survive the explicit "keep" list below should be assumed deleted. The bar for new code is whether it serves that new medium; nothing carries over by inertia.

**Survives from world-***:
- `world-art.js`: `defs()`, `trigger(kind)`, `foldHandle()`, `splashOverlay()`, `foldOverlay()`.
- `world.js`: the `window.WORLD.{enter,exit,toggle,isOpen}` API, the `#world` deep-link, the dev "WORLD_ART missing" badge, lazy build-on-first-enter, the four margin trigger mounts (with original offsets restored).
- `world.css`: the `.live-pill` and `.agent-link` styles, the world-mode toolbar recolor block, the trigger block (hover hint + per-kind drip/flap/wiggle keyframes).

Everything else is up for replacement.

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
- Move all content of `notebook.html` into `index.html`. Do not carry over any styles or markup from the old `index.html` — none of the design-canvas page-level CSS, `body { overflow: hidden }`, `.topnote`, `.jumpbar`, `.dc-*` rules, or the mobile fallback stack. Start from `notebook.html` as-is.
- Delete `notebook.html` (or leave a one-line redirect for old links).
- Update `bio.js` `site:` field if needed (`https://vanchivikash.vercel.app` still works as root).
- Strip the `chrome.js` script tag. Keep `world-cta.js`.
- `agent-seo.js` injects JSON-LD + meta + alternate links on its own (called from `notebook.js:181`). No additional inline `<script type="application/ld+json">` block needs to be carried into the new `index.html`.

### 2. Revert bird / pot / plot / doodle triggers to the previous version

Touch `world.js` and `world.css`:

- **`world.js:47-50`** — the `mountTrigger` calls. Current source has positive offsets (e.g. `right: "14px"`) from the last pass; restore the originals so triggers peek off-canvas again:
  - `pot`    → `top: 150px,    right: -12px`
  - `bird`   → `top: 16px,     right:  18px`  (this one was always positive — leave it)
  - `plot`   → `bottom: 220px, right:  -8px`
  - `doodle` → `bottom: 440px, left:  -22px`
- **`world.js:52-64`** — delete the entire first-visit / `SEEN_KEY` / `w-first-visit` block (including the `markSeen` handler and the 7s timeout). Triggers go back to silent easter-eggs.
- **`world.js:80-81` + `456-502`** — delete the `buildTweaks()` call and the function itself. The dev "WORLD · TWEAKS" panel is dead weight once first-visit logic is gone; drop the `STORE = "vanchi.world.trig"` localStorage key with it (no migration needed — it's a debug toggle).
- **`world.css`** — remove `@keyframes w-first-halo`, `@keyframes w-first-hint`, `body.w-first-visit .w-trig` rules, and the idle `box-shadow` / `filter: drop-shadow` glow + scale-on-hover changes. Restore the original trigger block: just the hover hint tooltip + the per-kind drip/flap/wiggle animations. Also delete the entire `.w-tweaks` panel block.
- Keep `window.WORLD.{enter,exit,toggle,isOpen}` exposure and lazy build — those are useful regardless.
- Keep the dev-only "WORLD_ART missing" badge.

### 3. "Enter the world" pill: pinned + light-sweep shimmer

The pill stays where it is today — in the notebook `.toolbar`, sticky at the top of the page (the toolbar is already `position: sticky`). That satisfies "stays in one place."

Update `world.css` so the pill has a *light sweep* animation traveling L→R across it, looping every ~3.2s. Gate the animation behind reduced-motion:

```css
.toolbar .world-cta { position: relative; overflow: hidden; }
.toolbar .world-cta::before {
  content: ""; position: absolute; inset: 0;
  background: linear-gradient(115deg, transparent 25%, rgba(255,255,255,.45) 50%, transparent 75%);
  transform: translateX(-100%);
  pointer-events: none;
}
@media (prefers-reduced-motion: no-preference) {
  .toolbar .world-cta::before {
    animation: w-cta-sweep 3.2s ease-in-out infinite;
    animation-delay: 1.4s; /* first sweep after the page settles */
  }
  .toolbar .world-cta:hover::before,
  .toolbar .world-cta.is-open::before { animation-play-state: paused; }
}
@keyframes w-cta-sweep {
  0%   { transform: translateX(-100%); }
  60%  { transform: translateX(100%); }
  100% { transform: translateX(100%); }
}
```

Also delete `@keyframes w-cta-twinkle` and replace the animated `.world-cta-spark` with a still spark — the sweep is enough motion. In world mode (`.is-open`) suppress the sweep — the user has already engaged.

While in the CTA section of `world.css`, simplify the selector chains: the existing rules are written as `.toolbar .world-cta, .titlebar .world-cta, .title-bar .world-cta` across roughly a dozen rules (the `.titlebar` / `.title-bar` halves were for terminal/ide toolbars, both being deleted). Strip those halves throughout. Two of the chained rules are also malformed — the comma list runs past the hover/active selector at roughly `world.css:95`, `100`, `104`, `108-109` — fix while simplifying.

### 4. Fully visual world — parallax scroll + horizontal carousels

*See the Revamp mandate above for the keep/delete contract.* Delete the magazine — the section list below replaces it:

- Delete `buildMagazine()` and every page builder in `world.js` (cover, profile, projects, garden, shelf, postcard).
- Delete the entire `.w-magazine` / `.w-page` / `.w-cover` / `.w-profile` / `.w-projects` / `.w-garden` / `.w-shelf` / `.w-postcard` section of `world.css`.
- Discard the magazine SVG builders in `world-art.js` (`coverArt`, `portrait`, `fortress`, `projChatflow`, `projGexplain`, `projMystream`, `gardenArt`, `bookshelf`, `stamp`, `postmark`, `checkmark`) — they were drawn for the editorial/Riso aesthetic and shouldn't constrain the new visual language.
- Build a fresh illustration set for the new scenes. New aesthetic direction: less editorial-magazine, more **living scene** — soft gradients, layered shapes, ambient motion. Pick a new palette if it helps (the existing Riso palette is fine if it lands, but don't feel bound by it). The goal is that a visitor flipping from notebook to world feels they've stepped into a different *medium*, not turned a page.

The world is a scene-based parallax scroll experience.

**Structure of the new world** (top → bottom, exactly four scenes). All illustrations are *new* — built from scratch as part of this work; do not lift the magazine SVGs:

1. **Hero + bio** (`#w-scene-hero`, ~110vh on desktop; flows naturally on mobile)
   - Layered gradient sky with 3+ parallax bands (mountains, clouds, foreground hill or city silhouette — designer's call).
   - A celestial element (sun/moon/orb) with ambient pulse + halo.
   - A creature/object animating across the hero on entry — could be a bird, a paper plane, an ink-trail, whatever the new visual language wants. (The trigger bird remains its own thing in paper mode; don't conflate.)
   - Oversized headline + tagline + animated underline / glyph.
   - **Bio panel folded in** (this is what was a separate "profile" scene): a new portrait/avatar motif (geometric / abstract / glyph — not the magazine's literal head-and-shoulders) plus the three `B.bio` lines revealed line-by-line via IntersectionObserver `in-view` class (CSS transitions only — no JS animation libs). Grain filter (`url(#w-grain)` from the kept `defs()`) is fair game on the portrait.
   - Scroll indicator at the bottom that fades in after 1.2s.

2. **Projects carousel** (`#w-scene-projects`) — *horizontal swipe/drag strip*
   - Three project cards side-by-side. Each card carries a *new* illustration representing its project (security/orchestration for Chatflow, explanation/AI for gExplain, video/streaming for MyStream). Style should match the new world aesthetic, not the magazine cards.
   - Mobile: native `scroll-snap-type: x mandatory` on the strip; cards are `scroll-snap-align: center`. Touch swipe works natively.
   - Desktop: small drag-to-scroll handler (~30 lines, vanilla) — `mousedown` → record `startX`/`scrollLeft`, `mousemove` translates to `scrollLeft -= dx`, `mouseup` releases. Also wire wheel-with-shift → horizontal scroll, and ←/→ arrow keys when focused.
   - Indicator dots below reflecting `scrollLeft / clientWidth`.
   - Each card uses the existing `.live-pill` for the "open live ↗" CTA (that pill style is shared site-wide).

3. **Garden, skills & shelf** (`#w-scene-garden`)
   - A new heatmap visualization rendered into the scene — could still be a calendar grid but composed visually (plants, dots in motion, isometric tiles, etc.), driven from `B.heatmap`. Don't import `gardenArt()`; it's deleted.
   - Skills as floating chips that drift in on view with staggered delays.
   - Stats row (solved / E·M·H / streak / rank) built fresh into the scene's layout, with the `rank ?? 0` guard intact.
   - **Bookshelf as a horizontal carousel inside this same scene** (no separate shelf scene). Books from `B.learning` as a horizontal strip of mini-cards built by a fresh `shelfCard(book)` builder — title, author, kind chip, status badge. Same swipe/drag mechanic as projects (reuse the carousel handler), separate scroller from any horizontal element in the heatmap.

4. **Postcard finale** (`#w-scene-postcard`)
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

`prefers-reduced-motion`: gate every keyframe and parallax transform — including the hero ambient pulse, the CTA sweep (see §3), reveal-on-view transitions, and all `--scroll-y`-driven transforms — behind `@media (prefers-reduced-motion: no-preference)`.

**Scroll lifecycle**:
- Gate the `--scroll-y` writer to `document.body.dataset.mode === "world"`. Update inside the rAF callback so it doesn't fight the notebook's natural scroll position when world mode is closed.
- On `enter()`: capture `window.scrollY` into a closure-local `notebookScrollY` *before* flipping mode, then `scrollTo(0, 0)` so the hero starts at top. (Drop the existing `enter()`'s `setTimeout(scrollTo top, 520)`; the new lifecycle replaces it.)
- On `exit()`: restore with `scrollTo(0, notebookScrollY)` instead of the unconditional `scrollTo top` currently at `world.js:132-145`.
- IntersectionObserver setup runs once inside the renamed `ensureScenes()` (was `ensureMagazine()`), observing `.w-reveal` elements *after* the scenes are built — not on script load, because the scenes are lazy-built on first enter.

**Mobile**: every scene is `min-height: 100vh` and reflows to single-column. Carousels already swipe-native. No design-canvas style draggable surface — just normal vertical scroll with horizontal carousels embedded.

**Lazy build**: the world DOM stays lazy-built on first `enter()` (already done last pass). The hero scene runs its load animation when world mode flips, not on initial page load.

### 5. Trim what the last pass over-applied

- `chrome.js` — delete (variation switcher no longer makes sense). Note: `.chrome-*` styles were injected via `chrome.js`'s own `<style>` element, not added to `world.css`, so deleting the file removes them automatically.
- `world-cta.js` — simplify: drop the `hasWorld` branching since WORLD is always present on the only remaining page. Also change the toolbar selector at line 8 from `.toolbar, .titlebar, .title-bar` → `.toolbar` (the `.titlebar` / `.title-bar` halves were for terminal/ide).
- `world.css` — remove the `w-cta-twinkle` keyframes and the first-visit pulse keyframes. Strip `.titlebar` / `.title-bar` halves from every CTA selector chain (see §3). Delete the `.w-tweaks` panel block (see §2).
- `world.js` — the `buildTweaks()` call (line 81) and the function (lines 456-502) come out (see §2). The `enter()` `setTimeout(scrollTo top, 520)` (~line 122) comes out — replaced by the scene scroll lifecycle in §4.
- `index.html` (new — copied from notebook.html) — there is nothing in `notebook.html` that referenced terminal/ide, so this is a no-op once the copy is clean.
- `agent-seo.js` — no change needed; already injects JSON-LD/alternate links.

---

## Execution order

The rewrite touches files that load each other; doing it in the wrong order leaves the page broken between edits.

1. Delete `terminal.*`, `ide.*`, `design-canvas.jsx`, `chrome.js`, `notebook.html`.
2. Replace `index.html` with `notebook.html`'s content; remove the `chrome.js` `<script>` tag.
3. Gut `world-art.js` (keep `defs`, `trigger`, `foldHandle`, `splashOverlay`, `foldOverlay`).
4. Rewrite `world.js`: remove `buildMagazine` + the 6 page builders + `buildTweaks` + first-visit; add `ensureScenes` + scroll lifecycle + drag-to-scroll. Trigger offsets need no edit (already correct in source).
5. Add the 4 new scene builders to `world-art.js`.
6. Rewrite `world.css`: delete `.w-magazine` / per-page / `.w-tweaks` / first-visit / cta-twinkle blocks; simplify `.toolbar` / `.titlebar` / `.title-bar` chains; add scene + carousel + CTA-sweep blocks.
7. Simplify `world-cta.js`.
8. `node --check` every JS file; load `index.html` locally; walk the verification list.

---

## Files

**Delete**:
- `terminal.html`, `terminal.js`
- `ide.html`, `ide.js`
- `design-canvas.jsx`
- `chrome.js`
- `notebook.html` (replaced by new `index.html`)

**Rewrite from scratch**:
- `index.html` — content of current `notebook.html`, chrome.js script tag removed. No styles or markup carried over from the old (design-canvas) `index.html`.
- `world.js` — four scene builders (`sceneHero`, `sceneProjects`, `sceneGarden`, `scenePostcard`) replacing the six magazine page builders. `ensureScenes` lazy build, drag-to-scroll handler shared by projects + shelf carousels, IntersectionObserver reveal wired after scenes mount, parallax `--scroll-y` writer gated to world mode. Scroll lifecycle on enter/exit (save + restore notebook scroll). Keep `window.WORLD` API, `#world` deep-link, dev badge. Remove `buildTweaks` and first-visit logic.
- `world.css` — replace `.w-magazine` + `.w-page` + per-page sections with scene-based layout (`.w-scene`, `.w-scene-hero`, `.w-carousel`, `.w-reveal`, `.w-cloud-*`, etc.). Add CTA light-sweep keyframe (reduced-motion gated). Remove first-visit / idle-glow / cta-twinkle / `.w-tweaks` rules. Simplify `.titlebar` / `.title-bar` chains out of the CTA section.

**Edit**:
- `world-cta.js` — drop the cross-page link fallback; always a `<button>` that calls `WORLD.toggle()`. Change the toolbar selector to `.toolbar` only. Stays pinned in the notebook toolbar.
- `world-art.js` — **substantially gutted**. Keep only: `defs()` (grain/halftone filters), the four `trigger(kind)` SVGs, `foldHandle()`, `splashOverlay()`, `foldOverlay()`. Delete all magazine illustrations (`coverArt`, `portrait`, `fortress`, `checkmark`, `projChatflow`, `projGexplain`, `projMystream`, `gardenArt`, `bookshelf`, `stamp`, `postmark`). Add new builders for the four scenes — e.g. `sceneHero()` (sky/clouds/sun/portrait pieces), `projectArt(slug)`, `gardenScene(data)`, `shelfCard(book)`, `postcardScene()` — drawn fresh in the new visual language.
- `notebook.js` — no functional change; still loaded by the new `index.html`.
- `bio.js` — unchanged.

## Verification

1. `ls /home/user/repo/` (the repo root) shows no `terminal.*`, no `ide.*`, no `chrome.js`, no `design-canvas.jsx`, no `notebook.html`. Only `index.html` for HTML. No `.w-tweaks` panel renders on load.
2. `node --check` passes for `world.js`, `world-cta.js`, `world-art.js`, `notebook.js`, `bio.js`, `heatmap.js`, `ai-chat.js`, `agent-seo.js`.
3. Open `index.html` → notebook renders identically to before. The four margin triggers (bird/pot/plot/doodle) sit at their original margin positions with the original hover-only hints — no halo, no first-visit pulse.
4. The toolbar `enter the world` pill shows a diagonal shine sweeping L→R every ~3s. Sweep pauses on hover and on `prefers-reduced-motion`.
5. Click the pill → splash overlay plays → page replaced by the hero scene (sky, sun, bird flying in). Scroll down → bio reveals line-by-line → projects appear as a horizontal strip.
6. Projects strip on desktop: click-drag scrolls horizontally; mouse-wheel + shift scrolls horizontally; arrow keys when focused scroll one card at a time. Indicator dots update.
7. Projects strip on mobile (resize to 375 px): swipe horizontally with snap; each card fills viewport width with margin.
8. Garden scene shows a freshly-built heatmap composed from `B.heatmap`; skills chips fade/slide in staggered; stats row reads correctly with `rank ?? 0` guard intact; the bookshelf is a horizontal carousel inside the same scene (drag on desktop, swipe on mobile).
9. Postcard finale shows contact pills (`.live-pill` styling, "open live ↗" arrows for external links).
10. Escape, the corner fold handle, or the toolbar pill (now showing `⤺ fold back`) all return to the notebook smoothly.
11. Lighthouse mobile pass: no horizontal page scroll outside the intended carousels; tap targets ≥ 44 px; no console errors.
12. Headless screenshot of `index.html` shows toolbar with shine sweep mid-frame; screenshot of `index.html#world` shows the hero scene rendered.
13. Enter world → scroll halfway down → fold back → the notebook scroll position is restored to where you left it (not jumped to top).
