/* ───────────────────────────────────────────────────────────
   world.js — mounts triggers + builds the full illustrated
   magazine (6 spreads) that replaces .paper in world mode.
   ─────────────────────────────────────────────────────────── */
(function () {
  const A = window.WORLD_ART;
  if (!A) {
    console.warn("WORLD_ART missing");
    if (location.hostname === "localhost" || location.hostname === "127.0.0.1") {
      const b = document.createElement("div");
      b.textContent = "⚠ WORLD_ART not loaded";
      Object.assign(b.style, { position: "fixed", bottom: "8px", left: "8px", zIndex: 9999,
        background: "#e85a1c", color: "#fff", font: "11px JetBrains Mono, monospace",
        padding: "4px 8px", borderRadius: "4px" });
      document.body.appendChild(b);
    }
    return;
  }
  const B = window.BIO || {};

  const paper = document.querySelector(".paper");
  if (!paper) return;

  /* ─── global defs ─── */
  document.body.appendChild(A.defs());

  /* ─── triggers (paper mode only) ─── */
  const trigContainer = document.createElement("div");
  trigContainer.className = "w-triggers";
  paper.appendChild(trigContainer);

  function mountTrigger(kind, pos) {
    const node = A.trigger(kind);
    Object.assign(node.style, pos);
    trigContainer.appendChild(node);
    const fire = () => {
      const r = node.getBoundingClientRect();
      enter({ x: r.left + r.width / 2, y: r.top + r.height / 2 });
    };
    node.addEventListener("click", fire);
    node.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); fire(); }
    });
    return node;
  }

  mountTrigger("pot",    { position: "absolute", top: "150px",     right: "14px"   });
  mountTrigger("bird",   { position: "absolute", top: "16px",      right: "18px"   });
  mountTrigger("plot",   { position: "absolute", bottom: "220px",  right: "12px"   });
  mountTrigger("doodle", { position: "absolute", bottom: "440px",  left:  "18px"   });

  /* ─── first-visit pulse: nudge the easter-egg triggers once ─── */
  const SEEN_KEY = "vv.seen";
  let seen = false;
  try { seen = !!localStorage.getItem(SEEN_KEY); } catch {}
  if (!seen) {
    document.body.classList.add("w-first-visit");
    const markSeen = () => {
      document.body.classList.remove("w-first-visit");
      try { localStorage.setItem(SEEN_KEY, "1"); } catch {}
    };
    trigContainer.addEventListener("click", markSeen, { once: true });
    setTimeout(markSeen, 7000);
  }

  /* ─── magazine: lazy-build on first enter ─── */
  let magazine = null;
  function ensureMagazine() {
    if (magazine) return magazine;
    magazine = buildMagazine();
    document.body.appendChild(magazine);
    return magazine;
  }

  /* ─── fold-back handle ─── */
  const fold = A.foldHandle();
  fold.addEventListener("click", exit);
  document.body.appendChild(fold);

  /* ─── tweaks panel ─── */
  buildTweaks();

  /* ─── keyboard ─── */
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && document.body.dataset.mode === "world") exit();
  });

  /* ─── public API (toolbar CTA, share links, etc.) ─── */
  window.WORLD = {
    enter: (origin) => enter(origin),
    exit: () => exit(),
    toggle: (origin) => {
      if (document.body.dataset.mode === "world") exit();
      else enter(origin);
    },
    isOpen: () => document.body.dataset.mode === "world"
  };
  document.dispatchEvent(new CustomEvent("world:ready"));

  /* ─── deep-link: notebook.html#world auto-enters ─── */
  if (location.hash === "#world") {
    setTimeout(() => enter(), 150);
  }

  /* ───────────────────── enter / exit ─────────────────────── */
  let transitioning = false;

  function enter(origin) {
    if (transitioning || document.body.dataset.mode === "world") return;
    ensureMagazine();
    if (!origin) {
      origin = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    }
    transitioning = true;
    document.body.classList.add("w-entering");
    const overlay = A.splashOverlay(origin);
    document.body.appendChild(overlay);

    // Flip mode about halfway through the splash
    setTimeout(() => {
      document.body.dataset.mode = "world";
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 520);

    setTimeout(() => {
      overlay.remove();
      document.body.classList.remove("w-entering");
      transitioning = false;
    }, 2500);
  }

  function exit() {
    if (transitioning || document.body.dataset.mode !== "world") return;
    transitioning = true;
    const overlay = A.foldOverlay();
    document.body.appendChild(overlay);
    setTimeout(() => {
      document.body.dataset.mode = "";
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 320);
    setTimeout(() => {
      overlay.remove();
      transitioning = false;
    }, 950);
  }

  /* ============================================================
     MAGAZINE BUILD
     ============================================================ */
  function buildMagazine() {
    const wrap = document.createElement("div");
    wrap.className = "w-magazine";
    wrap.appendChild(pageCover());
    wrap.appendChild(pageProfile());
    wrap.appendChild(pageProjects());
    wrap.appendChild(pageGarden());
    wrap.appendChild(pageShelf());
    wrap.appendChild(pagePostcard());
    return wrap;
  }

  /* ----- PAGE 1: COVER ----- */
  function pageCover() {
    const e = B.experience?.[0] || {};
    const node = document.createElement("section");
    node.className = "w-page w-cover";
    node.innerHTML = `
      <div class="w-tag-row">
        <b>VV</b>
        <span>NOTEBOOK · 01</span>
        <span>VOL II · ISSUE 05</span>
        <span>19 MAY 2026</span>
        <span>CHENNAI · IN</span>
        <span style="margin-left:auto">FIELD GUIDE · ED. 2026</span>
      </div>

      <div class="w-cover-grid">
        <div>
          <h1 class="w-headline">
            FROM <span class="pop">PRODUCTION</span><br/>
            FULL&shy;STACK&nbsp;<br/>
            TO <span class="blue">APPLIED ML.</span>
          </h1>
          <p class="w-deck">${B.tagline || "An engineer's working notebook — shipped systems on the left, the curriculum to the right, a route between them."}</p>
          <p class="w-byline">
            BY <b>${(B.name || "").toUpperCase()}</b> · ${(e.title || "").toUpperCase()}, ${(e.org || "").toUpperCase()}
          </p>
        </div>
        <div class="w-cover-art-slot"></div>
      </div>

      <div class="w-pullquote">
        <div class="w-pullquote-label">Abstract · the short version</div>
        ${ (B.bio || []).map(p => `<p style="margin:0 0 .6em">${p}</p>`).join("") }
        <p class="w-keywords"><b>Keywords —</b> software engineering · web security · VAPT · React · Next.js · LLM eng · machine learning</p>
      </div>
    `;
    node.querySelector(".w-cover-art-slot").appendChild(A.coverArt());
    return node;
  }

  /* ----- PAGE 2: PROFILE ----- */
  function pageProfile() {
    const e = B.experience?.[0] || {};
    const node = document.createElement("section");
    node.className = "w-page w-profile";
    node.innerHTML = `
      <div class="w-page-strip">
        <span class="w-num">§ 01</span>
        <span>WHO &amp; WHERE</span>
        <span class="spacer"></span>
        <span>PROFILE · ${(B.location || "").toUpperCase()}</span>
      </div>

      <div class="w-prof-head">
        <div class="w-portrait-slot"></div>
        <div>
          <h1 class="w-prof-name">${B.name || ""}</h1>
          <p class="w-prof-role">${B.role || ""} · <span style="color:${A.C.orange}">${B.trajectory || ""}</span></p>
          <div class="w-prof-chips">
            <span class="w-prof-chip live">in production</span>
            <span class="w-prof-chip">React · Next.js</span>
            <span class="w-prof-chip">VAPT · Security</span>
            <span class="w-prof-chip">learning ML</span>
            <span class="w-prof-chip">${B.location || ""}</span>
          </div>
        </div>
      </div>

      <div class="w-prof-body">
        <div class="w-prof-left">
          <div class="w-prof-label">Current post · ${e.start || ""} → ${e.end || ""}</div>
          <h2 class="w-prof-title">${e.title || ""}</h2>
          <p class="w-prof-org">${e.org || ""} — ${e.orgFull || ""}</p>
          <div class="w-prof-notes">
            ${ (e.bullets || []).map((b, i) => `
              <div class="w-prof-note">
                <span class="w-check-slot" data-i="${i}"></span>
                <span>${b}</span>
              </div>`).join("") }
          </div>
        </div>
        <div class="w-prof-right">
          <div class="w-prof-label">Field sketch — the production fortress</div>
          <div class="w-fortress-slot"></div>
          <p class="w-fortress-cap">SOMP, two govt portals, 500+ users. Bricks added one VAPT close at a time.</p>
        </div>
      </div>
    `;
    node.querySelector(".w-portrait-slot").appendChild(A.portrait());
    node.querySelector(".w-fortress-slot").appendChild(A.fortress());
    node.querySelectorAll(".w-check-slot").forEach((slot, i) => {
      slot.appendChild(A.checkmark(i));
    });
    return node;
  }

  /* ----- PAGE 3: PROJECTS ----- */
  function pageProjects() {
    const projs = B.projects || [];
    const artFns = [A.projChatflow, A.projGexplain, A.projMystream];
    const node = document.createElement("section");
    node.className = "w-page w-projects";

    const cards = projs.slice(0, 3).map((p, i) => `
      <article class="w-proj-card">
        <div class="w-proj-idx">[P${String(i + 1).padStart(2, "0")}] · ${(p.date || "").toUpperCase()}</div>
        <span class="w-proj-art-slot" data-i="${i}"></span>
        <h3 class="w-proj-name">${p.name}</h3>
        <p class="w-proj-kind">${p.kind}</p>
        <p class="w-proj-one">${p.one}</p>
        <ul class="w-proj-bullets">
          ${ (p.bullets || []).map(b => `<li>${b}</li>`).join("") }
        </ul>
        <div class="w-proj-stack">
          ${ (p.stack || []).map(s => `<span class="w-tag">${s}</span>`).join("") }
        </div>
        <a class="w-proj-link" href="${p.live}" target="_blank" rel="noopener">live · ${p.live.replace(/^https?:\/\//, "")}</a>
      </article>
    `).join("");

    node.innerHTML = `
      <div class="w-page-strip">
        <span class="w-num">§ 02</span>
        <span>RELEASED WORK</span>
        <span class="spacer"></span>
        <span>${projs.length} CARDS · IN PRODUCTION</span>
      </div>
      <div class="w-projects-title">
        <h2>SHIPPED · <span class="blue">IN THE WILD.</span></h2>
        <div class="w-projects-meta">three case studies<br/>open ports — all green</div>
      </div>
      <div class="w-projects-grid">${cards}</div>
    `;

    node.querySelectorAll(".w-proj-art-slot").forEach((slot, i) => {
      const fn = artFns[i];
      if (fn) slot.appendChild(fn());
    });
    return node;
  }

  /* ----- PAGE 4: ACTIVITY GARDEN + WORKSHOP ----- */
  function pageGarden() {
    const lc = B.leet || {};
    const totalAccepted = lc.accepted || (B.heatmap || []).reduce((a, b) => a + b, 0);
    const node = document.createElement("section");
    node.className = "w-page w-garden";
    node.innerHTML = `
      <div class="w-page-strip">
        <span class="w-num">§ 03</span>
        <span>STACK &amp; STREAK</span>
        <span class="spacer"></span>
        <span>365 DAYS · DAILY</span>
      </div>
      <div class="w-garden-head">
        <h2>STACK <span class="amp">&amp;</span> <span class="orange">STREAK</span>.</h2>
        <p class="w-garden-deck">The toolbox below, and how often the algorithm muscles get used above. Pulled live from leetcode.com/u/${B.handle || ""}.</p>
      </div>
      <div class="w-garden-art-slot"></div>
      <div class="w-garden-stats">
        <div class="w-stat"><div class="v">${lc.total || 0}</div><div class="k">SOLVED</div></div>
        <div class="w-stat"><div class="v">${lc.easy || 0} <span class="small">/ ${lc.medium || 0} / ${lc.hard || 0}</span></div><div class="k">EASY · MED · HARD</div></div>
        <div class="w-stat"><div class="v">${lc.streak || 0}d</div><div class="k">CURRENT STREAK</div></div>
        <div class="w-stat"><div class="v">#${(lc.rank || 0).toLocaleString()}</div><div class="k">GLOBAL RANK</div></div>
      </div>
      <div class="w-workshop">
        <h3>THE WORKSHOP — what's on the bench</h3>
        <div class="w-shop-grid">
          ${ Object.entries(B.skills || {}).map(([k, vs]) => `
            <div class="w-shop-label">${k}</div>
            <div class="w-shop-chips">${ vs.map(v => `<span class="w-tag">${v}</span>`).join("") }</div>
          `).join("") }
        </div>
      </div>
    `;
    node.querySelector(".w-garden-art-slot").appendChild(A.gardenArt(B.heatmap));
    return node;
  }

  /* ----- PAGE 5: READING SHELF ----- */
  function pageShelf() {
    const books = B.learning || [];
    const node = document.createElement("section");
    node.className = "w-page w-shelf";
    node.innerHTML = `
      <div class="w-page-strip">
        <span class="w-num">§ 04</span>
        <span>NOW READING</span>
        <span class="spacer"></span>
        <span>READING LIST · 2026</span>
      </div>
      <div class="w-shelf-head">
        <h2>BOOKS, <span class="coral">PAPERS,</span> <span class="blue">A LAMP.</span></h2>
        <p>The bibliography for moving from web apps to applied ML — in roughly the order I'm tackling it.</p>
      </div>
      <div class="w-shelf-body">
        <div class="w-shelf-art-wrap"></div>
        <div class="w-shelf-list">
          <div class="w-shelf-label">Annotated list — by hand</div>
          <ol>
            ${ books.map(b => {
              const active = /read|progress/.test(b.status);
              return `
                <li>
                  <div>
                    <div class="w-book-title">${b.title}</div>
                    <span class="w-book-by">${b.by} · ${b.kind}</span>
                  </div>
                  <span class="w-book-status ${active ? "active" : ""}">${b.status}</span>
                </li>`;
            }).join("") }
          </ol>
        </div>
      </div>
    `;
    node.querySelector(".w-shelf-art-wrap").appendChild(A.bookshelf(books));
    return node;
  }

  /* ----- PAGE 6: POSTCARD ----- */
  function pagePostcard() {
    const node = document.createElement("section");
    node.className = "w-page";
    node.innerHTML = `
      <div class="w-page-strip">
        <span class="w-num">§ 05</span>
        <span>GROUND TRUTH</span>
        <span class="spacer"></span>
        <span>REPRODUCIBILITY · CONTACT</span>
      </div>
      <div class="w-postcard-wrap">
        <h2 class="w-postcard-head">A <span class="orange">POSTCARD,</span> <span class="blue">NOT A FORM.</span></h2>
        <div class="w-postcard">
          <div class="w-pc-left">
            <div class="w-pc-msg-label">— message</div>
            <div class="w-pc-msg">
              <p>Hello — if you got here, you read the long way.</p>
              <p>I ship <b>fullstack web systems</b> for the government, and I'm spending nights learning to build the next layer with ML.</p>
              <p>The fastest channel for new conversations — roles, contracts, collaboration — is email. Or a paper bird.</p>
            </div>
            <div class="w-pc-sign">— Vanchi ↗</div>
          </div>
          <div class="w-pc-right">
            <div class="w-pc-stamp">
              <span class="w-pc-stamp-svg"></span>
              <div class="w-pc-stamp-label">INDIA · ₹∞</div>
            </div>
            <div class="w-pc-postmark"></div>
            <div class="w-pc-address">
              <div class="w-pc-line">
                <span>email</span>
                <a href="mailto:${B.email}">${B.email}</a>
              </div>
              <div class="w-pc-line">
                <span>phone</span>
                <a href="tel:${(B.phone || "").replace(/\s/g, "")}">${B.phone || ""}</a>
              </div>
              <div class="w-pc-line">
                <span>github</span>
                <a href="${B.github}" target="_blank" rel="noopener">github.com/vanchivikash</a>
              </div>
              <div class="w-pc-line">
                <span>leetcode</span>
                <a href="${B.leetcode}" target="_blank" rel="noopener">leetcode.com/u/${B.handle}</a>
              </div>
              <div class="w-pc-line">
                <span>linkedin</span>
                <a href="${B.linkedin}" target="_blank" rel="noopener">linkedin.com/in/vanchivikash</a>
              </div>
            </div>
          </div>
        </div>
        <pre class="w-postcard-cite">@misc{vikash2026notebook,
  author       = {Vanchi Vikash P M},
  title        = {From production fullstack to applied ML: one engineer's working notebook},
  year         = {2026},
  howpublished = {${B.site || ""}},
  note         = {Notebook 01, v2.0. Open to roles in fullstack and ML/AI engineering.},
  contact      = {${B.email || ""}}
}</pre>
        <div class="w-postcard-foot">
          © 2026 Vanchi Vikash P M · also served as <a href="llms.txt" target="_blank">/llms.txt</a> &amp; <a href="resume.txt" target="_blank">/resume.txt</a>
        </div>
      </div>
    `;
    // mount stamp + postmark
    node.querySelector(".w-pc-stamp-svg").replaceWith(A.stamp());
    node.querySelector(".w-pc-postmark").appendChild(A.postmark());
    return node;
  }

  /* ============================================================
     TWEAKS PANEL — paper mode only
     ============================================================ */
  function buildTweaks() {
    const STORE = "vanchi.world.trig";
    const state = { show: load() || "all" };
    const panel = document.createElement("div");
    panel.className = "w-tweaks";
    panel.innerHTML = `
      <header>
        <span>WORLD · TWEAKS</span>
        <span class="w-pin">EXPLORE</span>
      </header>
      <div class="w-tweak-body">
        <div class="w-tweak-row">
          <span class="w-tweak-label">Trigger visible in margins</span>
          <div class="w-seg" role="radiogroup">
            <button data-v="all"    aria-pressed="true">all</button>
            <button data-v="pot"    aria-pressed="false">pot</button>
            <button data-v="bird"   aria-pressed="false">bird</button>
            <button data-v="plot"   aria-pressed="false">plot</button>
            <button data-v="doodle" aria-pressed="false">doo</button>
          </div>
        </div>
        <div class="w-tweak-row">
          <span class="w-tweak-label">Click any trigger to break the page open ↗</span>
        </div>
      </div>`;
    document.body.appendChild(panel);

    const seg = panel.querySelector(".w-seg");
    function apply(v) {
      state.show = v;
      [...seg.querySelectorAll("button")].forEach(b => b.setAttribute("aria-pressed", b.dataset.v === v ? "true" : "false"));
      [...trigContainer.children].forEach(t => {
        const k = t.dataset.kind;
        t.style.display = (v === "all" || v === k) ? "" : "none";
      });
      try { localStorage.setItem(STORE, v); } catch {}
    }
    seg.addEventListener("click", (e) => {
      const b = e.target.closest("button[data-v]");
      if (b) apply(b.dataset.v);
    });
    panel.querySelector("header").addEventListener("click", () => {
      panel.classList.toggle("collapsed");
    });
    apply(state.show);
    function load() { try { return localStorage.getItem(STORE); } catch { return null; } }
  }
})();
