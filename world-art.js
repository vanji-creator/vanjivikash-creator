/* ───────────────────────────────────────────────────────────
   world-art.js — full illustration library for world mode.
   window.WORLD_ART exposes builders for:
     defs() · trigger(k) · foldHandle() · splashOverlay({x,y}) · foldOverlay()
     coverArt() · portrait() · fortress() · checkmark(variant)
     projChatflow() · projGexplain() · projMystream()
     gardenArt(data) · bookshelf(books) · stamp() · postmark()
   ─────────────────────────────────────────────────────────── */
(function () {
  const C = {
    cream:  "#f6f1e7",
    bone:   "#ebe1c8",
    buff:   "#f3e6c8",
    ink:    "#1d1b16",
    orange: "#e85a1c",
    blue:   "#2a4ba8",
    coral:  "#ef8474",
    sage:   "#6f8f6a",
    dim:    "#7a7160",
  };

  function svg(html) {
    const tmpl = document.createElement("template");
    tmpl.innerHTML = html.trim();
    return tmpl.content.firstElementChild;
  }

  /* ───────────────── DEFS — grain, halftone, blob ───────────────── */
  function defs() {
    return svg(`
      <svg width="0" height="0" style="position:absolute;width:0;height:0;overflow:hidden" aria-hidden="true">
        <defs>
          <filter id="w-grain" x="0" y="0" width="100%" height="100%">
            <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed="7" result="n"/>
            <feColorMatrix in="n" type="matrix"
              values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 .22 0" result="a"/>
            <feComposite in="a" in2="SourceGraphic" operator="in" result="speckle"/>
            <feBlend in="SourceGraphic" in2="speckle" mode="multiply"/>
          </filter>
          <filter id="w-grain-heavy" x="0" y="0" width="100%" height="100%">
            <feTurbulence type="fractalNoise" baseFrequency="1.4" numOctaves="2" seed="3" result="n"/>
            <feColorMatrix in="n" type="matrix"
              values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 .42 0"/>
            <feComposite in2="SourceGraphic" operator="in"/>
          </filter>
          <pattern id="w-half-orange" x="0" y="0" width="6" height="6" patternUnits="userSpaceOnUse">
            <circle cx="3" cy="3" r="1.3" fill="${C.orange}"/>
          </pattern>
          <pattern id="w-half-blue" x="0" y="0" width="5" height="5" patternUnits="userSpaceOnUse">
            <circle cx="2.5" cy="2.5" r="1.1" fill="${C.blue}"/>
          </pattern>
          <pattern id="w-lines" x="0" y="0" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <line x1="0" y1="0" x2="0" y2="6" stroke="${C.ink}" stroke-width=".7"/>
          </pattern>
        </defs>
      </svg>`);
  }

  /* ─────────────────── TRIGGERS ─────────────────── */
  function trigger(kind) {
    if (kind === "pot") return svg(`
      <span class="w-trig w-trig-pot" data-kind="pot" role="button" tabindex="0"
            data-hint="↘ click — spill the ink" aria-label="Enter illustrated world">
        <svg class="w-art" width="56" height="72" viewBox="0 0 56 72" xmlns="http://www.w3.org/2000/svg">
          <circle class="drop" cx="28" cy="2" r="3" fill="${C.orange}"/>
          <ellipse cx="28" cy="22" rx="18" ry="3" fill="${C.ink}"/>
          <path d="M 12 23 Q 8 50, 14 64 Q 28 70, 42 64 Q 48 50, 44 23 Z" fill="${C.ink}"/>
          <ellipse cx="28" cy="22" rx="14" ry="2.4" fill="${C.orange}"/>
          <rect x="18" y="42" width="20" height="10" fill="${C.cream}"/>
          <text x="28" y="50" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="6" fill="${C.ink}" letter-spacing=".5">INK</text>
          <circle cx="6"  cy="68" r="1.4" fill="${C.orange}" opacity=".7"/>
          <circle cx="50" cy="66" r="1"   fill="${C.orange}" opacity=".5"/>
          <circle cx="48" cy="70" r=".7"  fill="${C.orange}" opacity=".5"/>
        </svg>
      </span>`);

    if (kind === "bird") return svg(`
      <span class="w-trig w-trig-bird" data-kind="bird" role="button" tabindex="0"
            data-hint="✦ click — fly into the world" aria-label="Enter illustrated world">
        <svg class="w-art" width="58" height="48" viewBox="0 0 58 48" xmlns="http://www.w3.org/2000/svg">
          <polygon points="6,28 50,12 38,28 44,38" fill="${C.coral}"/>
          <polygon points="14,22 38,4 30,24" fill="${C.orange}"/>
          <line x1="14" y1="22" x2="38" y2="28" stroke="${C.ink}" stroke-width=".8"/>
          <line x1="30" y1="24" x2="38" y2="28" stroke="${C.ink}" stroke-width=".8"/>
          <circle cx="49" cy="15" r="1.4" fill="${C.ink}"/>
          <path d="M 0 36 q 6 -4 12 -2" fill="none" stroke="${C.ink}" stroke-width=".8" stroke-dasharray="2 3" opacity=".6"/>
        </svg>
      </span>`);

    if (kind === "plot") return svg(`
      <span class="w-trig w-trig-plot" data-kind="plot" role="button" tabindex="0"
            data-hint="▸ click — let the plot escape" aria-label="Enter illustrated world">
        <svg class="w-art" width="92" height="56" viewBox="0 0 92 56" xmlns="http://www.w3.org/2000/svg">
          <rect x="0" y="0" width="92" height="56" fill="${C.cream}" stroke="${C.ink}"/>
          <line x1="6" y1="8"  x2="6"  y2="48" stroke="${C.dim}" stroke-width=".6"/>
          <line x1="6" y1="48" x2="86" y2="48" stroke="${C.dim}" stroke-width=".6"/>
          <g stroke="${C.dim}" stroke-width=".3" opacity=".5">
            <line x1="6" y1="38" x2="86" y2="38"/>
            <line x1="6" y1="28" x2="86" y2="28"/>
            <line x1="6" y1="18" x2="86" y2="18"/>
          </g>
          <path class="w-line" d="M 8 40 Q 18 14, 30 26 T 56 24 T 84 12" fill="none" stroke="${C.orange}" stroke-width="1.8" stroke-linecap="round"/>
          <circle class="w-glow" cx="84" cy="12" r="3" fill="${C.orange}"/>
          <text x="86" y="6" text-anchor="end" font-family="JetBrains Mono, monospace" font-size="6" fill="${C.dim}">live</text>
        </svg>
      </span>`);

    if (kind === "doodle") return svg(`
      <span class="w-trig w-trig-doodle" data-kind="doodle" role="button" tabindex="0"
            data-hint="✱ click — wake the doodle" aria-label="Enter illustrated world">
        <svg class="w-art" width="64" height="64" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
          <path d="M 32 32 m -2 0 a 2 2 0 1 1 4 0 a 5 5 0 1 1 -10 0 a 9 9 0 1 1 18 0 a 13 13 0 1 1 -26 0 a 17 17 0 1 1 34 0"
                fill="none" stroke="${C.ink}" stroke-width="1.4" stroke-linecap="round"/>
          <circle cx="26" cy="28" r="1.4" fill="${C.ink}"/>
          <circle cx="38" cy="28" r="1.4" fill="${C.ink}"/>
          <path d="M 26 36 q 6 5 12 0" fill="none" stroke="${C.orange}" stroke-width="1.4" stroke-linecap="round"/>
          <path d="M 50 50 q 8 0 10 -8" fill="none" stroke="${C.coral}" stroke-width="1.4" stroke-linecap="round"/>
        </svg>
      </span>`);
    return null;
  }

  /* ───────────── FOLD-BACK HANDLE ───────────── */
  function foldHandle() {
    const btn = document.createElement("button");
    btn.className = "w-fold-handle";
    btn.setAttribute("aria-label", "Fold back to paper");
    btn.innerHTML = `
      <span class="w-fold-hint">⤺ fold back to paper</span>
      <svg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <path d="M 100 0 L 100 100 L 0 100 Q 0 50, 42 30 Q 70 18, 100 0 Z" fill="${C.cream}" stroke="${C.ink}" stroke-width="1.4"/>
        <path d="M 100 0 Q 70 18, 42 30 Q 60 32, 72 24 Q 86 14, 100 0 Z" fill="${C.bone}" stroke="${C.ink}" stroke-width="1.1"/>
        <g transform="translate(58,60)">
          <path d="M 0 0 q -10 -4 -16 6 q -4 8 6 12" fill="none" stroke="${C.orange}" stroke-width="2.2" stroke-linecap="round"/>
          <polygon points="-12,16 -6,18 -10,22" fill="${C.orange}"/>
        </g>
      </svg>`;
    return btn;
  }

  /* ─────────────── COVER ART (hero) ─────────────── */
  function coverArt() {
    return svg(`
      <svg class="w-cover-art w-riso" viewBox="0 0 520 360" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <rect width="520" height="360" fill="${C.buff}"/>

        <!-- sky band -->
        <rect x="0" y="0" width="520" height="180" fill="${C.bone}"/>

        <!-- sun -->
        <circle cx="410" cy="80" r="40" fill="${C.orange}"/>
        <circle cx="410" cy="80" r="40" fill="url(#w-half-orange)" opacity=".25"/>
        <g stroke="${C.orange}" stroke-width="2">
          <line x1="410" y1="20" x2="410" y2="6"/>
          <line x1="450" y1="34" x2="464" y2="22"/>
          <line x1="466" y1="76" x2="482" y2="76"/>
          <line x1="450" y1="120" x2="464" y2="134"/>
          <line x1="370" y1="34" x2="356" y2="22"/>
          <line x1="354" y1="76" x2="338" y2="76"/>
        </g>

        <!-- distant mountains (blue overprint = ML peaks) -->
        <g style="mix-blend-mode:multiply">
          <polygon points="250,180 320,80 390,180" fill="${C.blue}"/>
          <polygon points="300,180 380,70 470,180" fill="${C.blue}" opacity=".75"/>
          <polygon points="380,180 450,110 520,180" fill="${C.blue}" opacity=".55"/>
          <!-- snow caps -->
          <polygon points="320,80 332,108 308,108" fill="${C.cream}"/>
          <polygon points="380,70 392,98 368,98" fill="${C.cream}"/>
        </g>

        <!-- peak labels -->
        <g font-family="JetBrains Mono, monospace" font-size="8" fill="${C.cream}" letter-spacing=".5">
          <text x="320" y="142" text-anchor="middle">TRANSFORMERS</text>
          <text x="380" y="120" text-anchor="middle">LLMs</text>
          <text x="450" y="148" text-anchor="middle">RL</text>
        </g>

        <!-- C-DAC building (start) -->
        <g transform="translate(40,108)" opacity=".95">
          <rect x="0"  y="20" width="46" height="52" fill="${C.ink}"/>
          <rect x="48" y="6"  width="18" height="66" fill="${C.ink}"/>
          <g fill="${C.cream}">
            <rect x="5"  y="28" width="5" height="5"/>
            <rect x="17" y="28" width="5" height="5"/>
            <rect x="29" y="28" width="5" height="5"/>
            <rect x="5"  y="42" width="5" height="5"/>
            <rect x="17" y="42" width="5" height="5"/>
            <rect x="29" y="42" width="5" height="5"/>
            <rect x="5"  y="56" width="5" height="5"/>
            <rect x="17" y="56" width="5" height="5"/>
            <rect x="29" y="56" width="5" height="5"/>
            <rect x="52" y="14" width="10" height="3"/>
            <rect x="52" y="24" width="10" height="3"/>
            <rect x="52" y="34" width="10" height="3"/>
            <rect x="52" y="44" width="10" height="3"/>
            <rect x="52" y="54" width="10" height="3"/>
          </g>
          <!-- antenna -->
          <line x1="57" y1="6" x2="57" y2="-12" stroke="${C.ink}" stroke-width="1.4"/>
          <circle cx="57" cy="-12" r="2.4" fill="${C.coral}"/>
        </g>

        <!-- ground -->
        <rect x="0" y="180" width="520" height="180" fill="${C.buff}"/>
        <line x1="0" y1="180" x2="520" y2="180" stroke="${C.ink}" stroke-width="1.6"/>

        <!-- the engineer (walking the path) -->
        <g transform="translate(122,200)">
          <!-- shadow -->
          <ellipse cx="14" cy="62" rx="20" ry="3" fill="${C.ink}" opacity=".25"/>
          <!-- legs -->
          <path d="M 6 42 L 4 60 L 12 60 L 14 44 Z" fill="${C.ink}"/>
          <path d="M 18 42 L 24 60 L 30 58 L 22 42 Z" fill="${C.ink}"/>
          <!-- torso -->
          <path d="M 0 22 q 0 -10 14 -10 q 14 0 14 10 l 4 22 l -36 0 Z" fill="${C.blue}"/>
          <!-- arm with backpack strap -->
          <line x1="6" y1="22" x2="6" y2="42" stroke="${C.blue}" stroke-width="5" stroke-linecap="round"/>
          <line x1="22" y1="22" x2="24" y2="40" stroke="${C.blue}" stroke-width="5" stroke-linecap="round"/>
          <!-- backpack -->
          <rect x="-4" y="20" width="8" height="16" fill="${C.coral}"/>
          <!-- head -->
          <circle cx="14" cy="4" r="9" fill="${C.ink}"/>
          <!-- glasses -->
          <circle cx="11" cy="4" r="2.3" fill="none" stroke="${C.cream}" stroke-width=".8"/>
          <circle cx="17" cy="4" r="2.3" fill="none" stroke="${C.cream}" stroke-width=".8"/>
          <line x1="13.3" y1="4" x2="14.7" y2="4" stroke="${C.cream}" stroke-width=".8"/>
          <!-- paper bird companion -->
          <g transform="translate(38,-8)">
            <polygon points="0,0 16,-4 12,4 14,8" fill="${C.coral}"/>
            <polygon points="4,-1 12,-7 10,1" fill="${C.orange}"/>
          </g>
        </g>

        <!-- dotted path -->
        <path class="w-stroke-draw" d="M 138 268 C 180 250, 220 240, 260 232 S 340 208, 380 178 S 442 138, 470 116"
              fill="none" stroke="${C.orange}" stroke-width="2.8" stroke-dasharray="3 6" stroke-linecap="round"/>

        <!-- a small "agent robot" greeting near the path -->
        <g transform="translate(296,196)">
          <rect x="0" y="0" width="22" height="18" rx="2" fill="${C.sage}" stroke="${C.ink}" stroke-width="1.2"/>
          <circle cx="7"  cy="9" r="2" fill="${C.cream}"/>
          <circle cx="15" cy="9" r="2" fill="${C.cream}"/>
          <line x1="11" y1="-4" x2="11" y2="-1" stroke="${C.ink}" stroke-width="1"/>
          <circle cx="11" cy="-5" r="1.4" fill="${C.orange}"/>
          <rect x="6" y="18" width="10" height="6" fill="${C.ink}"/>
          <!-- tiny hand wave -->
          <line x1="-2" y1="6" x2="-8" y2="2" stroke="${C.sage}" stroke-width="2" stroke-linecap="round"/>
        </g>

        <!-- foreground grass dots -->
        <g fill="${C.ink}" opacity=".5">
          <circle cx="20" cy="320" r="1"/>
          <circle cx="70" cy="340" r="1"/>
          <circle cx="110" cy="312" r="1"/>
          <circle cx="180" cy="330" r="1"/>
          <circle cx="240" cy="318" r="1"/>
          <circle cx="320" cy="332" r="1"/>
          <circle cx="400" cy="320" r="1"/>
          <circle cx="470" cy="338" r="1"/>
        </g>

        <!-- editorial label bottom-right -->
        <text x="510" y="350" text-anchor="end" font-family="Archivo Black, sans-serif"
              font-size="14" fill="${C.ink}" opacity=".55">FIG. 00 · MAP</text>
      </svg>`);
  }

  /* ───────────────── PORTRAIT (geometric, riso) ───────────────── */
  function portrait() {
    return svg(`
      <svg class="w-portrait w-riso" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <!-- background circle -->
        <rect width="200" height="200" fill="${C.bone}"/>
        <circle cx="100" cy="104" r="78" fill="${C.orange}"/>
        <circle cx="100" cy="104" r="78" fill="url(#w-half-orange)" opacity=".18"/>
        <!-- shoulders -->
        <path d="M 24 200 Q 30 142, 100 134 Q 170 142, 176 200 Z" fill="${C.blue}"/>
        <!-- collar -->
        <path d="M 84 138 L 100 158 L 116 138" fill="none" stroke="${C.ink}" stroke-width="1.6"/>
        <!-- neck -->
        <rect x="88" y="118" width="24" height="20" fill="${C.coral}"/>
        <!-- head -->
        <ellipse cx="100" cy="92" rx="40" ry="46" fill="${C.coral}"/>
        <!-- hair (ink scribble shape) -->
        <path d="M 60 76
                 Q 56 38, 100 32
                 Q 144 38, 140 76
                 L 138 86
                 Q 130 64, 100 60
                 Q 70 64, 62 86 Z" fill="${C.ink}"/>
        <!-- ear -->
        <ellipse cx="60" cy="96" rx="4" ry="6" fill="${C.coral}"/>
        <!-- glasses -->
        <circle cx="86"  cy="94" r="10" fill="${C.cream}" stroke="${C.ink}" stroke-width="2"/>
        <circle cx="114" cy="94" r="10" fill="${C.cream}" stroke="${C.ink}" stroke-width="2"/>
        <line x1="96" y1="94" x2="104" y2="94" stroke="${C.ink}" stroke-width="2"/>
        <circle cx="86"  cy="94" r="3" fill="${C.ink}"/>
        <circle cx="114" cy="94" r="3" fill="${C.ink}"/>
        <!-- nose -->
        <path d="M 100 100 L 96 112 L 104 112" fill="none" stroke="${C.ink}" stroke-width="1.4"/>
        <!-- mouth -->
        <path d="M 90 120 q 10 4 20 0" fill="none" stroke="${C.ink}" stroke-width="2" stroke-linecap="round"/>
        <!-- chin highlight -->
        <path d="M 92 124 q 8 2 16 0" fill="none" stroke="${C.coral}" stroke-width="3" opacity=".4"/>
        <!-- name badge -->
        <rect x="36" y="174" width="128" height="18" fill="${C.ink}"/>
        <text x="100" y="186" text-anchor="middle" font-family="Archivo Black, sans-serif"
              font-size="10" fill="${C.cream}" letter-spacing=".15em">VANCHI VIKASH</text>
      </svg>`);
  }

  /* ───────────────── FORTRESS (C-DAC SOMP scene) ─────────────────
     A horizontal "scene card" showing the production work as a
     fortified building with shields, audit stamps, uptime flag. */
  function fortress() {
    return svg(`
      <svg class="w-fortress w-riso" viewBox="0 0 520 220" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <rect width="520" height="220" fill="${C.cream}"/>
        <!-- ground -->
        <line x1="0" y1="186" x2="520" y2="186" stroke="${C.ink}" stroke-width="1.4"/>
        <line x1="0" y1="190" x2="520" y2="190" stroke="${C.ink}" stroke-width=".5" opacity=".4"/>

        <!-- sun halftone -->
        <circle cx="80" cy="34" r="20" fill="url(#w-half-orange)" opacity=".6"/>

        <!-- fortress body (isometric-leaning castle/portal) -->
        <g transform="translate(140,40)">
          <!-- base block -->
          <rect x="0"  y="62" width="220" height="124" fill="${C.ink}"/>
          <!-- portcullis / door -->
          <rect x="92" y="120" width="36" height="66" fill="${C.orange}"/>
          <g stroke="${C.cream}" stroke-width=".8" opacity=".6">
            <line x1="92"  y1="132" x2="128" y2="132"/>
            <line x1="92"  y1="146" x2="128" y2="146"/>
            <line x1="92"  y1="160" x2="128" y2="160"/>
            <line x1="100" y1="120" x2="100" y2="186"/>
            <line x1="110" y1="120" x2="110" y2="186"/>
            <line x1="120" y1="120" x2="120" y2="186"/>
          </g>
          <!-- battlements -->
          <g fill="${C.ink}">
            <rect x="-6"  y="50" width="16" height="14"/>
            <rect x="18"  y="50" width="16" height="14"/>
            <rect x="42"  y="50" width="16" height="14"/>
            <rect x="66"  y="50" width="16" height="14"/>
            <rect x="138" y="50" width="16" height="14"/>
            <rect x="162" y="50" width="16" height="14"/>
            <rect x="186" y="50" width="16" height="14"/>
            <rect x="210" y="50" width="16" height="14"/>
          </g>
          <!-- towers -->
          <rect x="-14" y="20" width="34" height="46" fill="${C.ink}"/>
          <rect x="200" y="20" width="34" height="46" fill="${C.ink}"/>
          <!-- tower windows -->
          <rect x="-4" y="32" width="6" height="10" fill="${C.coral}"/>
          <rect x="210" y="32" width="6" height="10" fill="${C.coral}"/>
          <!-- top spires + flags -->
          <polygon points="-14,20 3,4 20,20"   fill="${C.coral}"/>
          <polygon points="200,20 217,4 234,20" fill="${C.coral}"/>
          <line x1="3"   y1="4" x2="3"   y2="-8" stroke="${C.ink}" stroke-width="1.4"/>
          <line x1="217" y1="4" x2="217" y2="-8" stroke="${C.ink}" stroke-width="1.4"/>
          <polygon points="3,-8 22,-4 3,2"   fill="${C.orange}"/>
          <polygon points="217,-8 236,-4 217,2" fill="${C.orange}"/>

          <!-- "99.9%" banner on main wall -->
          <g transform="translate(40,82)">
            <rect x="0" y="0" width="60" height="22" fill="${C.cream}"/>
            <text x="30" y="16" text-anchor="middle" font-family="Archivo Black, sans-serif"
                  font-size="14" fill="${C.ink}">99.9%</text>
          </g>
          <text x="70" y="118" text-anchor="middle" font-family="JetBrains Mono, monospace"
                font-size="8" fill="${C.cream}" letter-spacing=".12em">UPTIME · SOMP</text>

          <!-- right-side window with code -->
          <g transform="translate(150,82)">
            <rect x="0" y="0" width="44" height="32" fill="${C.cream}"/>
            <line x1="3" y1="6"  x2="36" y2="6"  stroke="${C.orange}" stroke-width="1.4"/>
            <line x1="3" y1="12" x2="30" y2="12" stroke="${C.ink}"   stroke-width="1" opacity=".7"/>
            <line x1="3" y1="18" x2="34" y2="18" stroke="${C.blue}"  stroke-width="1"/>
            <line x1="3" y1="24" x2="28" y2="24" stroke="${C.ink}"   stroke-width="1" opacity=".7"/>
          </g>
        </g>

        <!-- shield: CERT-In Safe to Host -->
        <g transform="translate(40,90)">
          <path d="M 30 0
                   L 60 10
                   L 60 36
                   Q 60 58, 30 72
                   Q 0 58, 0 36
                   L 0 10 Z" fill="${C.blue}"/>
          <path d="M 30 0 L 60 10 L 60 36 Q 60 58, 30 72 Q 0 58, 0 36 L 0 10 Z"
                fill="url(#w-half-blue)" opacity=".2"/>
          <!-- check inside -->
          <polyline points="14,38 26,50 48,24" fill="none" stroke="${C.cream}" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
          <text x="30" y="98" text-anchor="middle" font-family="JetBrains Mono, monospace"
                font-size="8" fill="${C.ink}" letter-spacing=".1em">CERT-IN</text>
          <text x="30" y="108" text-anchor="middle" font-family="JetBrains Mono, monospace"
                font-size="8" fill="${C.ink}" letter-spacing=".1em">SAFE TO HOST</text>
        </g>

        <!-- audit stamp circle -->
        <g transform="translate(420,72)">
          <circle cx="40" cy="40" r="40" fill="none" stroke="${C.orange}" stroke-width="3"/>
          <circle cx="40" cy="40" r="32" fill="none" stroke="${C.orange}" stroke-width="1.2"/>
          <text x="40" y="34" text-anchor="middle" font-family="Archivo Black, sans-serif"
                font-size="13" fill="${C.orange}">VAPT</text>
          <text x="40" y="48" text-anchor="middle" font-family="JetBrains Mono, monospace"
                font-size="8" fill="${C.orange}" letter-spacing=".1em">15 ISSUES</text>
          <text x="40" y="60" text-anchor="middle" font-family="JetBrains Mono, monospace"
                font-size="8" fill="${C.orange}" letter-spacing=".1em">→ CLOSED</text>
        </g>

        <!-- ground people / users iconography -->
        <g transform="translate(110,184)" fill="${C.ink}">
          <circle cx="0" cy="-6" r="3"/>
          <path d="M -4 -2 q 0 -2 4 -2 q 4 0 4 2 l 1 6 l -10 0 Z"/>
        </g>
        <g transform="translate(126,184)" fill="${C.ink}">
          <circle cx="0" cy="-6" r="3"/>
          <path d="M -4 -2 q 0 -2 4 -2 q 4 0 4 2 l 1 6 l -10 0 Z"/>
        </g>
        <text x="140" y="184" font-family="JetBrains Mono, monospace" font-size="9" fill="${C.ink}">500+ users</text>

        <!-- caption corner -->
        <text x="510" y="212" text-anchor="end" font-family="Archivo Black, sans-serif"
              font-size="13" fill="${C.ink}" opacity=".55">FIG. 01 · C-DAC</text>
      </svg>`);
  }

  /* ───────── CHECK MARK (for field notes) ───────── */
  function checkmark(variant) {
    const colors = [C.orange, C.blue, C.coral, C.sage];
    const c = colors[variant % colors.length];
    return svg(`
      <svg class="w-check" viewBox="0 0 26 26" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <rect x="2" y="2" width="22" height="22" fill="${c}" transform="rotate(${(variant % 4) - 2} 13 13)"/>
        <polyline points="6,14 11,19 20,7" fill="none" stroke="${C.cream}" stroke-width="2.4"
                  stroke-linecap="round" stroke-linejoin="round"/>
      </svg>`);
  }

  /* ───────── PROJECT ART: CHATFLOW ───────── */
  function projChatflow() {
    return svg(`
      <svg class="w-proj-art w-riso" viewBox="0 0 260 180" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <rect width="260" height="180" fill="${C.cream}"/>
        <!-- room floor -->
        <polygon points="0,150 260,150 260,180 0,180" fill="${C.bone}"/>
        <!-- big CRT terminal -->
        <g transform="translate(54,32)">
          <rect x="-6" y="-6" width="156" height="124" fill="${C.ink}"/>
          <rect x="0"  y="0"  width="144" height="106" fill="${C.sage}"/>
          <!-- scanlines -->
          <g stroke="${C.ink}" stroke-width=".5" opacity=".25">
            <line x1="0" y1="10" x2="144" y2="10"/>
            <line x1="0" y1="20" x2="144" y2="20"/>
            <line x1="0" y1="30" x2="144" y2="30"/>
            <line x1="0" y1="40" x2="144" y2="40"/>
            <line x1="0" y1="50" x2="144" y2="50"/>
            <line x1="0" y1="60" x2="144" y2="60"/>
            <line x1="0" y1="70" x2="144" y2="70"/>
            <line x1="0" y1="80" x2="144" y2="80"/>
            <line x1="0" y1="90" x2="144" y2="90"/>
            <line x1="0" y1="100" x2="144" y2="100"/>
          </g>
          <!-- text -->
          <text x="8" y="22" font-family="JetBrains Mono, monospace" font-size="11" fill="${C.cream}">$ nmap -sV</text>
          <text x="8" y="38" font-family="JetBrains Mono, monospace" font-size="9" fill="${C.cream}" opacity=".7">scanning 192.168.1.0/24</text>
          <text x="8" y="54" font-family="JetBrains Mono, monospace" font-size="9" fill="${C.coral}">▸ 22/tcp open ssh</text>
          <text x="8" y="68" font-family="JetBrains Mono, monospace" font-size="9" fill="${C.coral}">▸ 80/tcp open http</text>
          <text x="8" y="82" font-family="JetBrains Mono, monospace" font-size="9" fill="${C.orange}">! CRITICAL ×3</text>
          <text x="8" y="98" font-family="JetBrains Mono, monospace" font-size="11" fill="${C.cream}">$ <tspan fill="${C.orange}">▮</tspan></text>
          <!-- screen bevel -->
          <rect x="56" y="118" width="32" height="6" fill="${C.ink}"/>
          <rect x="36" y="124" width="72" height="8" fill="${C.ink}"/>
        </g>
        <!-- flow nodes (visual builder) -->
        <g transform="translate(204,40)">
          <rect x="0"  y="0"  width="34" height="16" fill="${C.coral}" stroke="${C.ink}"/>
          <rect x="0"  y="30" width="34" height="16" fill="${C.orange}" stroke="${C.ink}"/>
          <rect x="0"  y="60" width="34" height="16" fill="${C.blue}" stroke="${C.ink}"/>
          <line x1="17" y1="16" x2="17" y2="30" stroke="${C.ink}" stroke-width="1.4"/>
          <line x1="17" y1="46" x2="17" y2="60" stroke="${C.ink}" stroke-width="1.4"/>
        </g>
        <!-- corner badge -->
        <g transform="translate(8,8)">
          <rect x="0" y="0" width="62" height="16" fill="${C.orange}"/>
          <text x="6" y="11" font-family="Archivo Black, sans-serif" font-size="9" fill="${C.cream}" letter-spacing=".1em">RED TEAM</text>
        </g>
      </svg>`);
  }

  /* ───────── PROJECT ART: GEXPLAIN (Text Explainer) ───────── */
  function projGexplain() {
    return svg(`
      <svg class="w-proj-art w-riso" viewBox="0 0 260 180" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <rect width="260" height="180" fill="${C.cream}"/>
        <!-- browser window -->
        <g transform="translate(20,24)">
          <rect x="0" y="0" width="220" height="138" fill="${C.cream}" stroke="${C.ink}" stroke-width="1.4"/>
          <rect x="0" y="0" width="220" height="20" fill="${C.bone}" stroke="${C.ink}" stroke-width="1.4"/>
          <circle cx="10" cy="10" r="3" fill="${C.orange}"/>
          <circle cx="20" cy="10" r="3" fill="${C.coral}"/>
          <circle cx="30" cy="10" r="3" fill="${C.sage}"/>
          <rect x="44" y="5" width="120" height="10" fill="${C.cream}" stroke="${C.ink}" stroke-width=".8"/>
          <text x="50" y="13" font-family="JetBrains Mono, monospace" font-size="6.5" fill="${C.dim}">gmail.com/inbox</text>
          <!-- puzzle piece (extension icon) -->
          <g transform="translate(196,4)">
            <path d="M 4 4 h 6 v -3 q 0 -2 3 -2 q 3 0 3 2 v 3 h 6 v 6 h 3 q 2 0 2 3 q 0 3 -2 3 h -3 v 6 h -6 v 3 q 0 2 -3 2 q -3 0 -3 -2 v -3 h -6 z"
                  fill="${C.orange}" stroke="${C.ink}" stroke-width=".8"/>
          </g>
          <!-- page content -->
          <line x1="14" y1="36" x2="180" y2="36" stroke="${C.ink}" stroke-width="1.4"/>
          <line x1="14" y1="46" x2="200" y2="46" stroke="${C.dim}" stroke-width="1"/>
          <line x1="14" y1="54" x2="180" y2="54" stroke="${C.dim}" stroke-width="1"/>
          <!-- highlighted text -->
          <rect x="14" y="62" width="78" height="10" fill="${C.coral}" opacity=".6"/>
          <line x1="14" y1="66" x2="92" y2="66" stroke="${C.ink}" stroke-width="1.4"/>
          <line x1="14" y1="78" x2="200" y2="78" stroke="${C.dim}" stroke-width="1"/>
          <line x1="14" y1="86" x2="160" y2="86" stroke="${C.dim}" stroke-width="1"/>
          <line x1="14" y1="94" x2="190" y2="94" stroke="${C.dim}" stroke-width="1"/>
        </g>
        <!-- speech bubble (the explanation) -->
        <g transform="translate(146,90)">
          <rect x="0" y="0" width="106" height="60" rx="4" fill="${C.blue}"/>
          <polygon points="14,60 18,72 26,60" fill="${C.blue}"/>
          <text x="8" y="18" font-family="Archivo Black, sans-serif" font-size="11" fill="${C.cream}">AI · EXPLAIN</text>
          <line x1="8" y1="26" x2="92" y2="26" stroke="${C.cream}" stroke-width=".8" opacity=".5"/>
          <line x1="8" y1="34" x2="96" y2="34" stroke="${C.cream}" stroke-width="1"/>
          <line x1="8" y1="42" x2="86" y2="42" stroke="${C.cream}" stroke-width="1"/>
          <line x1="8" y1="50" x2="92" y2="50" stroke="${C.cream}" stroke-width="1"/>
        </g>
        <!-- corner badge -->
        <g transform="translate(8,8)">
          <rect x="0" y="0" width="76" height="16" fill="${C.orange}"/>
          <text x="6" y="11" font-family="Archivo Black, sans-serif" font-size="9" fill="${C.cream}" letter-spacing=".1em">EXTENSION</text>
        </g>
      </svg>`);
  }

  /* ───────── PROJECT ART: MYSTREAM ───────── */
  function projMystream() {
    return svg(`
      <svg class="w-proj-art w-riso" viewBox="0 0 260 180" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <rect width="260" height="180" fill="${C.cream}"/>
        <!-- vintage TV body -->
        <g transform="translate(40,30)">
          <rect x="-8" y="-8" width="192" height="128" rx="8" fill="${C.coral}"/>
          <rect x="0"  y="0"  width="176" height="112" fill="${C.ink}"/>
          <rect x="8"  y="8"  width="160" height="96"  fill="${C.blue}"/>
          <!-- play button -->
          <polygon points="74,42 74,70 102,56" fill="${C.cream}"/>
          <!-- video thumbnails strip -->
          <g transform="translate(8,76)" opacity=".9">
            <rect x="0"  y="0" width="24" height="20" fill="${C.cream}"/>
            <rect x="30" y="0" width="24" height="20" fill="${C.coral}"/>
            <rect x="60" y="0" width="24" height="20" fill="${C.cream}"/>
            <rect x="90" y="0" width="24" height="20" fill="${C.orange}"/>
            <rect x="120" y="0" width="24" height="20" fill="${C.cream}"/>
          </g>
          <!-- antenna -->
          <line x1="60"  y1="-8" x2="40"  y2="-32" stroke="${C.ink}" stroke-width="2"/>
          <line x1="116" y1="-8" x2="136" y2="-32" stroke="${C.ink}" stroke-width="2"/>
          <circle cx="40"  cy="-32" r="3" fill="${C.orange}"/>
          <circle cx="136" cy="-32" r="3" fill="${C.orange}"/>
          <!-- dials -->
          <circle cx="20" cy="124" r="6" fill="${C.ink}"/>
          <circle cx="156" cy="124" r="6" fill="${C.ink}"/>
          <circle cx="20" cy="124" r="2" fill="${C.cream}"/>
          <circle cx="156" cy="124" r="2" fill="${C.cream}"/>
          <!-- legs -->
          <rect x="14"  y="128" width="6" height="14" fill="${C.ink}"/>
          <rect x="156" y="128" width="6" height="14" fill="${C.ink}"/>
        </g>
        <!-- search bar floating above -->
        <g transform="translate(86,8)">
          <rect x="0" y="0" width="120" height="18" fill="${C.cream}" stroke="${C.ink}" stroke-width="1.4"/>
          <circle cx="9" cy="9" r="4" fill="none" stroke="${C.ink}" stroke-width="1.4"/>
          <line x1="12" y1="12" x2="15" y2="15" stroke="${C.ink}" stroke-width="1.4"/>
          <line x1="22" y1="9" x2="92" y2="9" stroke="${C.dim}" stroke-width="1" stroke-dasharray="2 2"/>
        </g>
        <!-- corner badge -->
        <g transform="translate(8,8)">
          <rect x="0" y="0" width="62" height="16" fill="${C.orange}"/>
          <text x="6" y="11" font-family="Archivo Black, sans-serif" font-size="9" fill="${C.cream}" letter-spacing=".1em">STREAM</text>
        </g>
      </svg>`);
  }

  /* ───────── GARDEN ART (year of activity as plants) ───────── */
  function gardenArt(data) {
    const arr = (data || []).slice(-52); // 52 weeks
    const W = 1000, H = 280;
    const padL = 50, padR = 80;
    const cols = arr.length;
    const colW = (W - padL - padR) / cols;
    const groundY = H - 60;

    const plants = arr.map((v, i) => {
      const x = padL + colW * (i + 0.5);
      const h = 6 + Math.min(v, 8) * 13;
      const stemY = groundY - h;
      const col = v === 0 ? C.dim
                : v <= 1 ? C.sage
                : v <= 2 ? C.orange
                : v <= 4 ? C.coral
                : C.blue;
      const headR = 1.6 + Math.min(v, 7) * 0.5;
      // For taller plants add a couple of leaves
      const leaves = v >= 3 ? `
        <line x1="${x}" y1="${stemY + 8}" x2="${x - 5}" y2="${stemY + 4}" stroke="${col}" stroke-width="1.4" stroke-linecap="round"/>
        <line x1="${x}" y1="${stemY + 14}" x2="${x + 5}" y2="${stemY + 10}" stroke="${col}" stroke-width="1.4" stroke-linecap="round"/>
      ` : "";
      return `
        <line x1="${x}" y1="${groundY}" x2="${x}" y2="${stemY}" stroke="${col}" stroke-width="2"/>
        ${leaves}
        <circle cx="${x}" cy="${stemY}" r="${headR}" fill="${col}"/>`;
    }).join("");

    // month axis labels
    const months = ["JUN","JUL","AUG","SEP","OCT","NOV","DEC","JAN","FEB","MAR","APR","MAY"];
    const monthLabels = months.map((m, i) => `
      <text x="${padL + (i + 0.5) * (W - padL - padR) / 12}" y="${H - 30}"
            text-anchor="middle" font-family="JetBrains Mono, monospace"
            font-size="9" fill="${C.dim}" letter-spacing=".06em">${m}</text>`).join("");

    return svg(`
      <svg class="w-garden-art w-riso" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
        <rect width="${W}" height="${H}" fill="${C.bone}"/>

        <!-- sun -->
        <g transform="translate(900,50)">
          <circle r="32" fill="${C.orange}"/>
          <circle r="32" fill="url(#w-half-orange)" opacity=".25"/>
          <g stroke="${C.orange}" stroke-width="2">
            <line x1="0" y1="-44" x2="0" y2="-56"/>
            <line x1="34" y1="-24" x2="44" y2="-32"/>
            <line x1="44" y1="0" x2="56" y2="0"/>
            <line x1="34" y1="24" x2="44" y2="32"/>
            <line x1="-34" y1="-24" x2="-44" y2="-32"/>
            <line x1="-44" y1="0" x2="-56" y2="0"/>
          </g>
        </g>

        <!-- background hills -->
        <path d="M 0 ${groundY} Q 250 ${groundY - 40}, 500 ${groundY - 10} T 1000 ${groundY - 20} L 1000 ${H} L 0 ${H} Z"
              fill="${C.buff}" opacity=".55"/>

        <!-- ground -->
        <line x1="0" y1="${groundY}" x2="${W}" y2="${groundY}" stroke="${C.ink}" stroke-width="2"/>
        <line x1="0" y1="${groundY + 4}" x2="${W}" y2="${groundY + 4}" stroke="${C.ink}" stroke-width=".6" opacity=".4"/>

        <!-- gardener character (left) -->
        <g transform="translate(34,${groundY - 56})">
          <!-- shadow -->
          <ellipse cx="6" cy="58" rx="14" ry="3" fill="${C.ink}" opacity=".25"/>
          <!-- legs -->
          <rect x="-2" y="36" width="6" height="22" fill="${C.ink}"/>
          <rect x="8"  y="36" width="6" height="22" fill="${C.ink}"/>
          <!-- torso -->
          <path d="M -4 14 q 0 -8 10 -8 q 10 0 10 8 l 4 22 l -28 0 Z" fill="${C.blue}"/>
          <!-- hat -->
          <ellipse cx="6" cy="2" rx="14" ry="3" fill="${C.coral}"/>
          <path d="M -4 2 q 0 -10 10 -10 q 10 0 10 10 Z" fill="${C.coral}"/>
          <!-- head -->
          <circle cx="6" cy="6" r="6" fill="${C.ink}"/>
          <!-- watering can arm -->
          <line x1="20" y1="20" x2="32" y2="14" stroke="${C.blue}" stroke-width="5" stroke-linecap="round"/>
          <g transform="translate(28,8)">
            <rect x="0" y="0" width="14" height="10" fill="${C.orange}"/>
            <polygon points="14,2 22,0 22,8 14,8" fill="${C.orange}"/>
            <polygon points="-2,2 -6,-2 -2,-2" fill="${C.orange}"/>
            <!-- water drops -->
            <line x1="22" y1="6" x2="26" y2="14" stroke="${C.blue}" stroke-width="1.2"/>
            <line x1="20" y1="8" x2="24" y2="18" stroke="${C.blue}" stroke-width="1.2"/>
            <line x1="18" y1="8" x2="20" y2="20" stroke="${C.blue}" stroke-width="1.2"/>
          </g>
        </g>

        <!-- plants -->
        ${plants}

        <!-- month axis -->
        ${monthLabels}
        <line x1="${padL}" y1="${H - 50}" x2="${W - padR}" y2="${H - 50}" stroke="${C.ink}" stroke-width=".5" opacity=".4"/>

        <!-- title overlay -->
        <g transform="translate(80,30)">
          <text font-family="Archivo Black, sans-serif" font-size="14" fill="${C.ink}" letter-spacing=".06em">A YEAR OF SUBMISSIONS</text>
          <text y="14" font-family="JetBrains Mono, monospace" font-size="10" fill="${C.dim}" letter-spacing=".06em">each stem · one week</text>
        </g>

        <!-- legend -->
        <g transform="translate(${W - padR + 8},${groundY - 40})">
          <text font-family="JetBrains Mono, monospace" font-size="8" fill="${C.dim}" letter-spacing=".1em">QUIET</text>
          <line x1="0"  y1="6" x2="6" y2="6" stroke="${C.dim}" stroke-width="2"/>
          <line x1="0"  y1="12" x2="6" y2="12" stroke="${C.sage}" stroke-width="2"/>
          <line x1="0"  y1="18" x2="6" y2="18" stroke="${C.orange}" stroke-width="2"/>
          <line x1="0"  y1="24" x2="6" y2="24" stroke="${C.coral}" stroke-width="2"/>
          <line x1="0"  y1="30" x2="6" y2="30" stroke="${C.blue}" stroke-width="2"/>
          <text y="42" font-family="JetBrains Mono, monospace" font-size="8" fill="${C.dim}" letter-spacing=".1em">GRIND</text>
        </g>

        <!-- title corner -->
        <text x="${W - 10}" y="${H - 8}" text-anchor="end" font-family="Archivo Black, sans-serif"
              font-size="13" fill="${C.ink}" opacity=".55">FIG. 02 · GARDEN</text>
      </svg>`);
  }

  /* ───────── BOOKSHELF ─────────
     `books` is an array of {kind,title,by,status}. */
  function bookshelf(books) {
    const W = 540, H = 420;
    const items = books || [];

    // Layout: a single shelf at y=320, books standing in a row, plus
    // one stacked horizontally on top of the shelf.
    // Color rotation:
    const palette = [C.blue, C.orange, C.coral, C.sage, C.blue, C.coral];
    const standCount = Math.min(items.length, 5);
    let cursorX = 110;
    const shelves = [];

    // Standing books
    const standing = [];
    for (let i = 0; i < standCount; i++) {
      const b = items[i];
      const col = palette[i % palette.length];
      const w = 32 + (b.title.length > 22 ? 6 : 0);
      const h = 130 + (i % 3) * 10;
      const x = cursorX;
      const y = 320 - h;
      cursorX += w + 6;
      // bookmark for active items
      const active = /read|progress/.test(b.status);
      const bookmark = active ? `<rect x="${x + w - 8}" y="${y - 6}" width="6" height="22" fill="${C.coral}"/>` : "";
      // rotated title
      const titleX = x + w / 2;
      const titleY = y + 28;
      standing.push(`
        <g>
          <rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${col}"/>
          <rect x="${x}" y="${y + 6}" width="${w}" height="3" fill="${C.cream}" opacity=".55"/>
          <rect x="${x}" y="${y + h - 9}" width="${w}" height="3" fill="${C.cream}" opacity=".55"/>
          ${bookmark}
          <text transform="translate(${titleX},${titleY}) rotate(90)"
                font-family="Archivo Black, sans-serif" font-size="9"
                fill="${C.cream}" letter-spacing=".05em"
                text-anchor="start">${(b.title || "").toUpperCase().slice(0, 22)}</text>
        </g>`);
    }

    // Stacked book on top of shelf
    let stacked = "";
    if (items.length > 5) {
      const b = items[5];
      stacked = `
        <g transform="translate(${cursorX + 20},${320 - 22})">
          <rect x="0" y="0" width="120" height="20" fill="${palette[5 % palette.length]}"/>
          <rect x="0" y="3" width="120" height="2" fill="${C.cream}" opacity=".6"/>
          <text x="10" y="14" font-family="Archivo Black, sans-serif" font-size="10"
                fill="${C.cream}" letter-spacing=".05em">${(b.title || "").toUpperCase().slice(0, 22)}</text>
        </g>`;
    }

    return svg(`
      <svg class="w-shelf-art w-riso" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
        <rect width="${W}" height="${H}" fill="${C.cream}"/>

        <!-- wall behind shelf -->
        <rect x="0" y="0" width="${W}" height="${H}" fill="${C.buff}"/>

        <!-- desk lamp on the left -->
        <g transform="translate(48,8)">
          <line x1="22" y1="320" x2="22" y2="180" stroke="${C.ink}" stroke-width="3"/>
          <line x1="22" y1="180" x2="-18" y2="100" stroke="${C.ink}" stroke-width="3"/>
          <polygon points="-18,100 -56,40 8,42" fill="${C.ink}"/>
          <ellipse cx="-22" cy="100" rx="36" ry="6" fill="${C.orange}" opacity=".4"/>
          <polygon points="-50,100 6,100 50,320 -94,320" fill="${C.orange}" opacity=".12"/>
        </g>

        <!-- mug -->
        <g transform="translate(434,288)">
          <rect x="0" y="0" width="24" height="32" fill="${C.coral}"/>
          <rect x="0" y="0" width="24" height="5" fill="${C.ink}" opacity=".2"/>
          <ellipse cx="12" cy="0" rx="12" ry="3" fill="${C.coral}"/>
          <ellipse cx="12" cy="0" rx="9" ry="2" fill="${C.ink}" opacity=".6"/>
          <path d="M 24 6 q 8 2 7 10 q -1 6 -7 4" fill="none" stroke="${C.coral}" stroke-width="2.4"/>
          <!-- steam -->
          <path d="M 6 -8 q 4 -8 0 -16" fill="none" stroke="${C.dim}" stroke-width="1" opacity=".7"/>
          <path d="M 14 -10 q -4 -8 0 -16" fill="none" stroke="${C.dim}" stroke-width="1" opacity=".7"/>
        </g>

        <!-- shelf board -->
        <rect x="20" y="320" width="${W - 40}" height="14" fill="${C.ink}"/>
        <rect x="20" y="332" width="${W - 40}" height="3" fill="${C.ink}" opacity=".5"/>

        <!-- bookends -->
        <rect x="92"  y="200" width="14" height="120" fill="${C.ink}"/>

        <!-- standing books -->
        ${standing.join("")}

        ${stacked}

        <!-- dust motes -->
        <g fill="${C.dim}" opacity=".5">
          <circle cx="120" cy="80" r="1"/>
          <circle cx="200" cy="60" r="1"/>
          <circle cx="280" cy="100" r="1"/>
          <circle cx="360" cy="70" r="1"/>
          <circle cx="440" cy="120" r="1"/>
        </g>

        <!-- caption corner -->
        <text x="${W - 10}" y="${H - 10}" text-anchor="end" font-family="Archivo Black, sans-serif"
              font-size="13" fill="${C.ink}" opacity=".55">FIG. 03 · SHELF</text>
      </svg>`);
  }

  /* ───────── STAMP (mini portrait for postcard) ───────── */
  function stamp() {
    return svg(`
      <svg viewBox="0 0 80 70" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
        <rect width="80" height="70" fill="${C.bone}"/>
        <!-- mini portrait -->
        <circle cx="40" cy="36" r="22" fill="${C.orange}"/>
        <path d="M 18 70 Q 22 50, 40 48 Q 58 50, 62 70 Z" fill="${C.blue}"/>
        <ellipse cx="40" cy="30" rx="12" ry="14" fill="${C.coral}"/>
        <path d="M 26 22 Q 24 8, 40 6 Q 56 8, 54 22 L 53 26 Q 50 16, 40 14 Q 30 16, 27 26 Z" fill="${C.ink}"/>
        <circle cx="34" cy="30" r="3" fill="${C.cream}" stroke="${C.ink}" stroke-width="1"/>
        <circle cx="46" cy="30" r="3" fill="${C.cream}" stroke="${C.ink}" stroke-width="1"/>
        <circle cx="34" cy="30" r="1" fill="${C.ink}"/>
        <circle cx="46" cy="30" r="1" fill="${C.ink}"/>
        <line x1="37" y1="30" x2="43" y2="30" stroke="${C.ink}" stroke-width="1"/>
        <path d="M 35 40 q 5 2 10 0" fill="none" stroke="${C.ink}" stroke-width="1.2"/>
        <text x="6" y="68" font-family="JetBrains Mono, monospace" font-size="6" fill="${C.ink}">IN · ₹∞</text>
        <text x="74" y="10" text-anchor="end" font-family="JetBrains Mono, monospace" font-size="6" fill="${C.ink}">2026</text>
      </svg>`);
  }

  /* ───────── POSTMARK (circular stamp) ───────── */
  function postmark() {
    return svg(`
      <svg viewBox="0 0 96 96" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <g transform="rotate(-12 48 48)" opacity=".85">
          <circle cx="48" cy="48" r="42" fill="none" stroke="${C.orange}" stroke-width="2.5"/>
          <circle cx="48" cy="48" r="34" fill="none" stroke="${C.orange}" stroke-width="1.2"/>
          <text x="48" y="34" text-anchor="middle" font-family="Archivo Black, sans-serif"
                font-size="9" fill="${C.orange}" letter-spacing=".08em">OPEN TO</text>
          <text x="48" y="54" text-anchor="middle" font-family="Archivo Black, sans-serif"
                font-size="14" fill="${C.orange}" letter-spacing=".04em">ROLES</text>
          <text x="48" y="68" text-anchor="middle" font-family="JetBrains Mono, monospace"
                font-size="7" fill="${C.orange}" letter-spacing=".12em">2026 · MAY</text>
          <line x1="14" y1="48" x2="22" y2="48" stroke="${C.orange}" stroke-width="2"/>
          <line x1="74" y1="48" x2="82" y2="48" stroke="${C.orange}" stroke-width="2"/>
        </g>
      </svg>`);
  }

  /* ───────── SPLASH OVERLAY (enter transition) ───────── */
  function splashOverlay(at) {
    const cx = at.x, cy = at.y;
    const vw = window.innerWidth, vh = window.innerHeight;
    const R  = Math.hypot(Math.max(cx, vw - cx), Math.max(cy, vh - cy)) * 1.2;

    let parts = "";
    const N = 30;
    for (let i = 0; i < N; i++) {
      const ang = (i / N) * Math.PI * 2 + Math.random() * .3;
      const dist = 40 + Math.random() * (R * 0.55);
      const r = 4 + Math.random() * 10;
      const dx = Math.cos(ang) * dist;
      const dy = Math.sin(ang) * dist;
      const dur = 0.95 + Math.random() * 0.7;
      const delay = Math.random() * 0.22;
      const col = i % 5 === 0 ? C.blue : i % 7 === 0 ? C.coral : C.orange;
      parts += `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${col}"
        style="opacity:0;transform-box:fill-box;transform-origin:center;
               animation: w-part ${dur}s ${delay}s cubic-bezier(.2,.7,.2,1) forwards;
               --dx:${dx}px;--dy:${dy}px"/>`;
    }
    let tearPts = "";
    const T = 40;
    for (let i = 0; i < T; i++) {
      const ang = (i / T) * Math.PI * 2;
      const wob = 0.86 + Math.random() * 0.14;
      const x = cx + Math.cos(ang) * R * wob;
      const y = cy + Math.sin(ang) * R * wob;
      tearPts += (i ? " L " : "M ") + x.toFixed(1) + " " + y.toFixed(1);
    }
    tearPts += " Z";

    return svg(`
      <div class="w-transition" aria-hidden="true">
        <style>
          @keyframes w-expand {
            from { r: 0;    opacity: 1; }
            55%  {           opacity: 1; }
            to   { r: ${R}; opacity: 1; }
          }
          @keyframes w-fade-out { from { opacity: 1 } to { opacity: 0 } }
          @keyframes w-part {
            0%   { opacity: 1; transform: translate(0,0) scale(1) }
            70%  { opacity: 1 }
            100% { opacity: 0; transform: translate(var(--dx), var(--dy)) scale(.3) }
          }
          @keyframes w-tear {
            from { stroke-dashoffset: 2000 }
            to   { stroke-dashoffset: 0 }
          }
          .w-trans-splash {
            animation: w-expand 1.05s cubic-bezier(.2,.7,.2,1) forwards,
                       w-fade-out .55s 1.3s forwards;
          }
          .w-trans-tear {
            stroke-dasharray: 2000;
            stroke-dashoffset: 2000;
            animation: w-tear 1.1s .25s ease-out forwards,
                       w-fade-out .5s 1.3s forwards;
          }
        </style>
        <svg width="100%" height="100%">
          <circle class="w-trans-splash" cx="${cx}" cy="${cy}" r="0" fill="${C.orange}"
                  filter="url(#w-grain-heavy)"/>
          <circle class="w-trans-splash" cx="${cx + 6}" cy="${cy - 4}" r="0" fill="${C.blue}"
                  style="mix-blend-mode:multiply;opacity:.65;animation-delay:.06s"/>
          <circle class="w-trans-splash" cx="${cx - 5}" cy="${cy + 3}" r="0" fill="${C.coral}"
                  style="mix-blend-mode:multiply;opacity:.45;animation-delay:.12s"/>
          <path class="w-trans-tear" d="${tearPts}" fill="none"
                stroke="${C.ink}" stroke-width="2.4" stroke-linejoin="round"/>
          ${parts}
        </svg>
      </div>`);
  }

  /* ───────── FOLD OVERLAY (exit) ───────── */
  function foldOverlay() {
    const vw = window.innerWidth, vh = window.innerHeight;
    const cx = vw - 50, cy = vh - 50;
    const R  = Math.hypot(vw, vh) * 1.1;
    return svg(`
      <div class="w-transition" aria-hidden="true">
        <style>
          @keyframes w-shrink {
            from { r: ${R}; opacity: 1 }
            to   { r: 0;     opacity: 0 }
          }
          .w-trans-fold {
            animation: w-shrink .85s cubic-bezier(.5,.0,.7,.2) forwards;
          }
        </style>
        <svg width="100%" height="100%">
          <circle class="w-trans-fold" cx="${cx}" cy="${cy}" r="${R}" fill="${C.cream}"
                  filter="url(#w-grain)"/>
          <circle class="w-trans-fold" cx="${cx - 6}" cy="${cy + 4}" r="${R}" fill="${C.coral}"
                  style="mix-blend-mode:multiply;opacity:.4;animation-delay:.04s"/>
        </svg>
      </div>`);
  }

  window.WORLD_ART = {
    defs, trigger, foldHandle,
    coverArt, portrait, fortress, checkmark,
    projChatflow, projGexplain, projMystream,
    gardenArt, bookshelf, stamp, postmark,
    splashOverlay, foldOverlay, C
  };
})();
