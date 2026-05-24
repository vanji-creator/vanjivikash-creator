/* ───────────────────────────────────────────────────────────
   chrome.js — shared toolbar chrome injected into every
   variation. Adds: variation switcher, share button,
   back-to-canvas link. Loaded after each variation's own
   script so the toolbar already exists.
   ─────────────────────────────────────────────────────────── */
(function () {
  const VARIATIONS = [
    { id: "notebook", href: "notebook.html", label: "notebook" },
    { id: "terminal", href: "terminal.html", label: "terminal" },
    { id: "ide",      href: "ide.html",      label: "ide" }
  ];

  function currentId() {
    const path = location.pathname.split("/").pop() || "";
    const v = VARIATIONS.find(v => v.href === path);
    return v ? v.id : null;
  }

  function inject() {
    const bar = document.querySelector(".toolbar, .titlebar, .title-bar");
    if (!bar || bar.querySelector(".chrome-switcher")) return;

    const here = currentId();

    // Variation switcher (segmented)
    const switcher = document.createElement("div");
    switcher.className = "chrome-switcher";
    switcher.setAttribute("role", "tablist");
    switcher.setAttribute("aria-label", "Switch portfolio variation");
    switcher.innerHTML = VARIATIONS.map(v => {
      const active = v.id === here ? " is-active" : "";
      const tag = v.id === here ? "span" : "a";
      const href = v.id === here ? "" : ` href="${v.href}"`;
      return `<${tag} class="chrome-seg${active}"${href} role="tab" aria-selected="${v.id === here}">${v.label}</${tag}>`;
    }).join("");

    // Back-to-canvas
    const home = document.createElement("a");
    home.className = "chrome-home";
    home.href = "index.html";
    home.title = "Back to the design canvas";
    home.setAttribute("aria-label", "Back to the design canvas");
    home.innerHTML = `<span aria-hidden="true">⌂</span>`;

    // Share button
    const share = document.createElement("button");
    share.type = "button";
    share.className = "chrome-share";
    share.title = "Copy a shareable link";
    share.setAttribute("aria-label", "Copy a shareable link to this page");
    share.innerHTML = `<span class="chrome-share-icon" aria-hidden="true">↗</span><span class="chrome-share-label">share</span>`;
    share.addEventListener("click", async () => {
      const url = location.href;
      let ok = false;
      try {
        if (navigator.share) { await navigator.share({ url, title: document.title }); ok = true; }
      } catch {}
      if (!ok) {
        try { await navigator.clipboard.writeText(url); ok = true; } catch {}
      }
      if (!ok) {
        // Final fallback: a temporary input + execCommand
        const ta = document.createElement("textarea");
        ta.value = url; ta.style.position = "fixed"; ta.style.opacity = "0";
        document.body.appendChild(ta); ta.select();
        try { document.execCommand("copy"); ok = true; } catch {}
        ta.remove();
      }
      toast(ok ? "link copied ✓" : "couldn't copy — long-press the URL bar");
    });

    // Mount: anchor to the home + switcher + share in a wrapper.
    const wrap = document.createElement("div");
    wrap.className = "chrome-wrap";
    wrap.appendChild(home);
    wrap.appendChild(switcher);
    wrap.appendChild(share);

    // Prefer to sit just before the themes group; else append.
    const themes = bar.querySelector(".themes");
    if (themes) themes.parentNode.insertBefore(wrap, themes);
    else bar.appendChild(wrap);
  }

  function toast(msg) {
    const el = document.createElement("div");
    el.className = "chrome-toast";
    el.textContent = msg;
    document.body.appendChild(el);
    requestAnimationFrame(() => el.classList.add("in"));
    setTimeout(() => {
      el.classList.remove("in");
      setTimeout(() => el.remove(), 280);
    }, 1500);
  }

  // Inject styles once.
  function injectStyles() {
    if (document.getElementById("chrome-styles")) return;
    const s = document.createElement("style");
    s.id = "chrome-styles";
    s.textContent = `
      .chrome-wrap {
        display: inline-flex; align-items: center; gap: 8px;
        margin: 0 8px; font-family: "JetBrains Mono", ui-monospace, monospace; font-size: 11px;
      }
      .chrome-home {
        display: inline-flex; align-items: center; justify-content: center;
        width: 24px; height: 22px; border-radius: 5px;
        color: inherit; text-decoration: none; opacity: .65;
        border: 1px solid currentColor; line-height: 1;
        transition: opacity .12s, background .12s;
      }
      .chrome-home:hover { opacity: 1; background: rgba(232, 90, 28, .12); }
      .chrome-switcher {
        display: inline-flex; align-items: stretch;
        border: 1px solid currentColor; border-radius: 5px; overflow: hidden;
        opacity: .85;
      }
      .chrome-switcher .chrome-seg {
        padding: 3px 8px; color: inherit; text-decoration: none;
        border-right: 1px solid currentColor; opacity: .7;
        transition: background .12s, opacity .12s, color .12s;
        white-space: nowrap;
      }
      .chrome-switcher .chrome-seg:last-child { border-right: none; }
      .chrome-switcher .chrome-seg:hover { opacity: 1; background: rgba(232, 90, 28, .14); }
      .chrome-switcher .chrome-seg.is-active {
        background: #e85a1c; color: #f6f1e7; opacity: 1; cursor: default;
      }
      .chrome-share {
        all: unset; cursor: pointer;
        display: inline-flex; align-items: center; gap: 5px;
        padding: 3px 9px;
        border: 1px solid currentColor; border-radius: 999px;
        color: inherit; opacity: .8;
        transition: opacity .12s, background .12s;
      }
      .chrome-share:hover { opacity: 1; background: rgba(232, 90, 28, .14); }
      .chrome-share-icon { display: inline-block; transform: translateY(-1px); }
      @media (max-width: 720px) {
        .chrome-switcher .chrome-seg { padding: 3px 6px; font-size: 10px; }
        .chrome-share-label { display: none; }
        .chrome-share { padding: 3px 7px; }
      }
      .chrome-toast {
        position: fixed; bottom: 26px; left: 50%; transform: translate(-50%, 12px);
        z-index: 99999;
        background: #1d1b16; color: #f6f1e7;
        padding: 8px 14px; border-radius: 999px;
        font-family: "JetBrains Mono", monospace; font-size: 11.5px;
        box-shadow: 0 6px 18px rgba(0,0,0,.18);
        opacity: 0; transition: opacity .2s ease, transform .2s ease;
        pointer-events: none;
      }
      .chrome-toast.in { opacity: 1; transform: translate(-50%, 0); }
    `;
    document.head.appendChild(s);
  }

  function go() { injectStyles(); inject(); }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", go);
  else go();
})();
