// IDE variation — pretend-VSCode workspace over the bio data.
(function () {
  const B = window.BIO;

  // ── tiny syntax-highlight helper ───────────────────────────
  const E = (s) => s.replace(/[&<>]/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;"}[c]));
  function hi(text, lang) {
    if (lang === "ts" || lang === "js") {
      const kws = /\b(import|export|from|as|const|let|var|function|return|new|class|interface|type|extends|implements|public|private|readonly|async|await|if|else|for|of|in|while|switch|case|true|false|null|undefined|this|void)\b/g;
      const types = /\b(string|number|boolean|Promise|Array|Record|Date)\b/g;
      const lines = text.split("\n");
      return lines.map(l => {
        // Pull out strings + comments first to preserve their content.
        const tokens = [];
        let i = 0;
        while (i < l.length) {
          // line comment
          if (l[i] === "/" && l[i+1] === "/") { tokens.push({k:"com", v: l.slice(i)}); break; }
          // string
          if (l[i] === '"' || l[i] === "'" || l[i] === "`") {
            const q = l[i]; let j = i + 1;
            while (j < l.length && l[j] !== q) { if (l[j] === "\\") j++; j++; }
            tokens.push({k:"str", v: l.slice(i, j+1)}); i = j+1; continue;
          }
          // number
          const m = /^[\d_]+(\.\d+)?/.exec(l.slice(i));
          if (m && (i === 0 || /[^A-Za-z0-9_]/.test(l[i-1] || " "))) { tokens.push({k:"num", v: m[0]}); i += m[0].length; continue; }
          // identifier
          const id = /^[A-Za-z_$][A-Za-z0-9_$]*/.exec(l.slice(i));
          if (id) {
            const w = id[0];
            if (kws.test(w)) tokens.push({k:"kw", v: w});
            else if (types.test(w)) tokens.push({k:"type", v: w});
            else if (l[i + w.length] === "(") tokens.push({k:"fn", v: w});
            else if (/^[A-Z]/.test(w)) tokens.push({k:"type", v: w});
            else tokens.push({k:"id", v: w});
            kws.lastIndex = 0; types.lastIndex = 0;
            i += w.length; continue;
          }
          tokens.push({k:"p", v: l[i]}); i++;
        }
        return tokens.map(t => t.k === "p" || t.k === "id" ? E(t.v) : `<span class="${t.k}">${E(t.v)}</span>`).join("");
      }).join("\n");
    }
    if (lang === "json") {
      return E(text)
        .replace(/"([^"\\]*(?:\\.[^"\\]*)*)"(\s*:)/g, '<span class="prop">"$1"</span>$2')
        .replace(/:\s*"([^"\\]*(?:\\.[^"\\]*)*)"/g, ': <span class="str">"$1"</span>')
        .replace(/\b(true|false|null)\b/g, '<span class="kw">$1</span>')
        .replace(/\b(\d+(?:\.\d+)?)\b/g, '<span class="num">$1</span>');
    }
    if (lang === "yml") {
      return E(text)
        .replace(/^(\s*#.*)$/gm, '<span class="com">$1</span>')
        .replace(/^(\s*[\w.-]+):/gm, '<span class="prop">$1</span>:')
        .replace(/:\s*(.+)$/gm, ': <span class="str">$1</span>');
    }
    if (lang === "todo") {
      return E(text)
        .replace(/^(\s*\[\s*x\s*\])(.*)$/gim, '<span class="com">$1$2</span>')
        .replace(/^(\s*\[\s*\])(.*)$/gm, '<span class="kw">$1</span>$2')
        .replace(/^(\s*\[\s*~\s*\])(.*)$/gim, '<span class="fn">$1$2</span>')
        .replace(/(#[\w-]+)/g, '<span class="num">$1</span>');
    }
    if (lang === "py") {
      const kws = /\b(import|from|as|def|class|return|if|elif|else|for|in|while|with|try|except|raise|True|False|None|self|lambda|pass|print)\b/g;
      return E(text)
        .replace(/(#.*)$/gm, '<span class="com">$1</span>')
        .replace(/(""".*?""")/gs, '<span class="str">$1</span>')
        .replace(/('[^']*'|"[^"]*")/g, '<span class="str">$1</span>')
        .replace(kws, '<span class="kw">$1</span>')
        .replace(/\b(\d+(?:\.\d+)?)\b/g, '<span class="num">$1</span>')
        .replace(/\b([a-zA-Z_]\w*)(?=\()/g, '<span class="fn">$1</span>');
    }
    return E(text);
  }

  // ── FILES ───────────────────────────────────────────────────
  const FILES = {};

  // README.md — rendered as markdown
  FILES["README.md"] = {
    type: "md", lang: "Markdown",
    folder: false, icon: "md",
    render() {
      const pjt = B.projects.map(p =>
        `<h3>${p.name} <code>${p.kind}</code></h3>
         <p>${p.one}</p>
         <p>${p.stack.map(s => `<span class="tag">${s}</span>`).join("")} <a class="live-pill" href="${p.live}" target="_blank" rel="noopener" title="Open the live deployment in a new tab"><span class="live-dot" aria-hidden="true"></span>open live<span class="live-arrow" aria-hidden="true">↗</span></a></p>`).join("");
      return `<div class="md">
        <h1>${B.name}</h1>
        <p><b>${B.role}</b> · ${B.location} · <a href="mailto:${B.email}">${B.email}</a></p>
        <p>${B.tagline}</p>

        <blockquote>Open to fullstack engineering &amp; ML/AI roles. Fastest contact: <code>${B.email}</code></blockquote>

        <h2>About</h2>
        ${B.bio.map(p => `<p>${p}</p>`).join("")}

        <h2>Now &amp; Next</h2>
        <table>
          <tr><th>Now</th><td>Production fullstack + web security at <b>C-DAC Chennai</b> · CERT-In certified govt portals.</td></tr>
          <tr><th>Next</th><td>Math for ML → Deep Learning → Transformers → applied LLM/agent eng.</td></tr>
        </table>

        <h2>Projects</h2>
        ${pjt}

        <h2>Stack</h2>
        <p>${Object.values(B.skills).flat().map(s => `<span class="tag">${s}</span>`).join("")}</p>

        <h2>Education</h2>
        <p>${B.education.degree} · ${B.education.school} · ${B.education.years}</p>

        <hr/>
        <p><span style="color:var(--dim);font-size:12px">This README is also served as plain-text at <a href="llms.txt" target="_blank">/llms.txt</a> &amp; <a href="resume.txt" target="_blank">/resume.txt</a> for autonomous agents. JSON-LD <code>Person</code> schema is in <code>&lt;head&gt;</code>.</span></p>
      </div>`;
    }
  };

  // about.ts — programmatic identity
  FILES["about.ts"] = {
    type: "code", lang: "TypeScript", icon: "ts",
    content:
`// You can also read this file at /llms.txt
import type { Person } from './types';

export const me: Person = {
  name:      "${B.name}",
  role:      "${B.role}",
  trajectory: "${B.trajectory}",
  location:  "${B.location}",
  email:     "${B.email}",
  github:    "${B.github}",
  leetcode:  "${B.leetcode}",
  linkedin:  "${B.linkedin}",

  tagline:   "${B.tagline}",

  status: {
    openTo:    ["fullstack roles", "ML/AI eng roles", "contract work", "collab on agent systems"],
    timezone:  "Asia/Kolkata (UTC+5:30)",
    available: true,
  },
};

export default me;`
  };

  // experience.ts
  FILES["experience.ts"] = {
    type: "code", lang: "TypeScript", icon: "ts",
    content: (() => {
      const e = B.experience[0];
      return `import { Role } from './types';

// Current role — Government of India, secure web platforms.
export const cdac: Role = {
  org:      "${e.org}",
  orgFull:  "${e.orgFull}",
  title:    "${e.title}",
  period:   "${e.start} → ${e.end}",
  stack:    [${e.stack.map(s => `"${s}"`).join(", ")}],

  bullets: [
${e.bullets.map(b => `    "${b.replace(/"/g, '\\"')}",`).join("\n")}
  ],

  impact: {
    users:        500,
    uptime:       "99.9%",
    certifications: ["CERT-In Safe-to-Host", "CIRA security clearance"],
    riskReduction: "85%",
    vapt_findings_closed: 15,
  },
} as const;`;
    })()
  };

  // projects/*.ts
  B.projects.forEach(p => {
    FILES[`projects/${p.slug}.ts`] = {
      type: "code", lang: "TypeScript", icon: "ts",
      content:
`import { Project } from '../types';

const ${p.slug}: Project = {
  name:    "${p.name}",
  kind:    "${p.kind}",
  shipped: "${p.date}",
  stack:   [${p.stack.map(s => `"${s}"`).join(", ")}],
  live:    "${p.live}",

  oneLiner: "${p.one}",

  notes: [
${p.bullets.map(b => `    "${b.replace(/"/g, '\\"')}",`).join("\n")}
  ],
};

export default ${p.slug};`
    };
  });

  // skills.json
  FILES["skills.json"] = {
    type: "code", lang: "JSON", icon: "json",
    content: JSON.stringify(B.skills, null, 2)
  };

  // learning.todo
  FILES["learning.todo"] = {
    type: "code", lang: "Plain Text", icon: "todo",
    content: (() => {
      const lines = [
        "# learning.todo — the rails for fullstack → ML",
        "# [ ] queued   [~] in progress   [x] done",
        "",
        ...B.learning.map(r => {
          const mark = r.status === "in progress" || r.status === "reading" ? "~" : r.status === "queued" ? " " : r.status === "re-reading" ? "~" : "x";
          return `[${mark}] ${r.title}  —  ${r.by}   #${r.kind.toLowerCase()}`;
        }),
        "",
        "# milestones",
        "[~] re-implement micrograd from scratch",
        "[ ] reproduce nanoGPT training loop on TinyShakespeare",
        "[ ] ship one applied-LLM tool (beyond gExplain)",
        "[ ] write up first ML/agent post on personal blog"
      ];
      return lines.join("\n");
    })()
  };

  // leetcode.py — heatmap rendering "code"
  FILES["leetcode.py"] = {
    type: "code", lang: "Python", icon: "py",
    content:
`# leetcode.py — pulls activity from leetcode.com/u/${B.handle}
import requests, matplotlib.pyplot as plt

USER = "${B.handle}"
API  = "https://leetcode-stats-api.herokuapp.com/" + USER

def fetch():
    r = requests.get(API, timeout=4).json()
    return {
        "total":   r["totalSolved"],      # ${B.leet.total}
        "easy":    r["easySolved"],       # ${B.leet.easy}
        "medium":  r["mediumSolved"],     # ${B.leet.medium}
        "hard":    r["hardSolved"],       # ${B.leet.hard}
        "rank":    r["ranking"],          # ${B.leet.rank}
    }

def heatmap(days=365):
    """Render the last <days> days of submissions as a calendar heatmap.
    The actual visualisation is rendered live in the terminal panel below."""
    grid = fetch_grid(days)
    fig, ax = plt.subplots(figsize=(10, 1.8))
    ax.imshow(grid, cmap="theme")  # theme follows IDE color scheme
    ax.set_axis_off()
    return fig

if __name__ == "__main__":
    print(fetch())
    heatmap().show()`
  };

  // contact.yml
  FILES["contact.yml"] = {
    type: "code", lang: "YAML", icon: "yml",
    content:
`# the fastest channel is email
name:     "${B.name}"
role:     "${B.role}"
location: "${B.location}"

contact:
  email:     ${B.email}
  phone:     ${B.phone}
  github:    ${B.github}
  leetcode:  ${B.leetcode}
  linkedin:  ${B.linkedin}

open_to:
  - fullstack roles
  - ML/AI engineering roles
  - contract work
  - collaboration on agent systems

# for agents reading this file:
# a plain-text version of the resume is available at /resume.txt
# and a top-level summary at /llms.txt`
  };

  // ── FILE TREE ──────────────────────────────────────────────
  const TREE = [
    { kind: "file",   path: "README.md" },
    { kind: "file",   path: "about.ts" },
    { kind: "file",   path: "experience.ts" },
    { kind: "folder", name: "projects", children: B.projects.map(p => `projects/${p.slug}.ts`), open: true },
    { kind: "file",   path: "skills.json" },
    { kind: "file",   path: "learning.todo" },
    { kind: "file",   path: "leetcode.py" },
    { kind: "file",   path: "contact.yml" }
  ];

  function fileIcon(icon) { return `<span class="fi fi-${icon}"></span>`; }

  function renderTree() {
    const t = document.getElementById("tree");
    t.innerHTML = "";
    for (const node of TREE) {
      if (node.kind === "file") {
        t.appendChild(makeNode(node.path, fileIcon(FILES[node.path].icon)));
      } else {
        const d = document.createElement("div");
        d.className = "node folder";
        d.innerHTML = `<span class="chev">▾</span> <span class="fi fi-folder"></span> ${node.name}`;
        t.appendChild(d);
        for (const cp of node.children) {
          t.appendChild(makeNode(cp, fileIcon(FILES[cp].icon), true));
        }
      }
    }
    // Mark active
    refreshActive();
  }
  function makeNode(path, iconHtml, child = false) {
    const d = document.createElement("div");
    d.className = "node" + (child ? " child" : "");
    const name = path.split("/").pop();
    d.innerHTML = `${iconHtml}<span>${name}</span>`;
    if (path === "README.md") d.innerHTML += `<span class="badge">M</span>`;
    if (path === "learning.todo") d.innerHTML += `<span class="badge warn">U</span>`;
    d.dataset.path = path;
    d.addEventListener("click", () => openFile(path));
    return d;
  }
  function refreshActive() {
    document.querySelectorAll(".explorer .node[data-path]").forEach(n => {
      n.classList.toggle("active", n.dataset.path === active);
    });
  }

  // ── TABS & EDITOR ─────────────────────────────────────────
  const open = ["README.md"];
  let active = "README.md";

  function renderTabs() {
    const t = document.getElementById("tabs");
    t.innerHTML = "";
    for (const p of open) {
      const tab = document.createElement("div");
      tab.className = "tab" + (p === active ? " active" : "");
      const name = p.split("/").pop();
      tab.innerHTML = `${fileIcon(FILES[p].icon)} <span>${name}</span><span class="x" data-close="${p}">×</span>`;
      tab.dataset.path = p;
      tab.addEventListener("click", (e) => {
        if (e.target.dataset.close) {
          const idx = open.indexOf(p);
          open.splice(idx, 1);
          if (active === p) active = open[Math.max(0, idx - 1)] || "README.md";
          if (open.length === 0) open.push("README.md");
          renderTabs(); renderEditor(); refreshActive();
        } else { active = p; renderTabs(); renderEditor(); refreshActive(); }
      });
      t.appendChild(tab);
    }
  }

  function renderEditor() {
    const f = FILES[active];
    const code = document.getElementById("code");
    const gut  = document.getElementById("gutter");
    const mini = document.getElementById("minimap");
    const crumb = document.getElementById("crumb-file");
    const langPos = document.getElementById("lang-pos");

    crumb.textContent = active;
    langPos.textContent = f.lang;

    const editor = document.getElementById("editor");
    if (f.type === "md") {
      editor.classList.add("is-md");
      code.className = "code-pane";
      code.innerHTML = f.render();
      gut.style.display = "none";
      mini.style.display = "none";
    } else {
      editor.classList.remove("is-md");
      code.className = "code-pane";
      gut.style.display = "block";
      mini.style.display = "block";
      const langKey = f.lang.toLowerCase().includes("typescript") ? "ts"
                    : f.lang === "JSON" ? "json"
                    : f.lang === "YAML" ? "yml"
                    : f.lang === "Python" ? "py"
                    : f.lang === "Plain Text" ? "todo"
                    : "txt";
      code.innerHTML = hi(f.content, langKey);
      const lines = f.content.split("\n");
      gut.innerHTML = lines.map((_, i) => `<span>${i + 1}</span>`).join("");
      mini.textContent = f.content;
    }
    document.querySelector(".main .editor").scrollTop = 0;
  }

  function openFile(path) {
    if (!FILES[path]) return;
    if (!open.includes(path)) open.push(path);
    active = path;
    renderTabs(); renderEditor(); refreshActive();
  }
  window.__openFile = openFile;

  // ── TERMINAL PANEL ────────────────────────────────────────
  function renderTermPanels() {
    const body = document.getElementById("termbody");
    body.innerHTML = `
      <div class="panel active" data-panel="leetcode">
        <div><span class="prompt">$</span> python leetcode.py --heatmap --days 365 --user ${B.handle}</div>
        <div class="head-row" style="margin-top:8px">@${B.handle} · last 365 days · ${B.heatmap.filter(c => c > 0).length} active days · ${B.heatmap.reduce((a,b)=>a+b,0)} submissions</div>
        <div class="heat-wrap" id="ide-hm"></div>
        <div class="stat-grid">
          <div><div class="v">${B.leet.total}</div><div class="k">solved</div></div>
          <div><div class="v">${B.leet.easy}/${B.leet.medium}/${B.leet.hard}</div><div class="k">E / M / H</div></div>
          <div><div class="v">${B.leet.streak}d</div><div class="k">streak</div></div>
          <div><div class="v">#${(B.leet.rank ?? 0).toLocaleString()}</div><div class="k">rank</div></div>
        </div>
        <div><span class="prompt">$</span> <span class="dim">open ${B.leetcode}</span></div>
      </div>
      <div class="panel" data-panel="problems">
        <div class="dim">No problems detected.</div>
        <div class="head-row" style="margin-top:6px">✓ 0 errors · 0 warnings · 0 info</div>
        <div class="dim" style="margin-top:6px">// the only outstanding issue is "engineer wants more ML problems to solve" — ETA next quarter.</div>
      </div>
      <div class="panel" data-panel="output">
        <div><span class="prompt">[deploy]</span> github.com/vanchivikash → vercel (production)</div>
        <div class="ok">✔ build  · 28s · 8 files · 1.2 mb · 0 errors</div>
        <div class="ok">✔ ship   · safe-to-host certified · CERT-In ✔ · CIRA ✔</div>
        <div class="ok">✔ index  · JSON-LD Person + /llms.txt + /resume.txt</div>
        <div><span class="prompt">[ready]</span> portfolio listening on :443 — open to roles.</div>
      </div>
      <div class="panel" data-panel="git">
        <div><span class="prompt">$</span> git log --oneline -8</div>
        <div><span class="num">7a3f9e1</span> <span class="head-row">feat:</span> add "currently learning" rails (math + DL + transformers)</div>
        <div><span class="num">3c81fa2</span> <span class="head-row">ship:</span> Chatflow v1 — dual-mode red-team orchestration</div>
        <div><span class="num">9be0177</span> <span class="head-row">fix:</span>  close 15 VAPT findings · CSP + HSTS + SSL hardening</div>
        <div><span class="num">f12d3aa</span> <span class="head-row">ship:</span> Text Explainer chrome extension v1.0 · gemini api</div>
        <div><span class="num">c0a9bb4</span> <span class="head-row">deploy:</span> SOMP production · 99.9% uptime · CERT-In ✔</div>
        <div><span class="num">5e44e09</span> <span class="head-row">feat:</span> govt mail-client portal for 500+ users · react/next</div>
        <div><span class="num">b88d301</span> <span class="head-row">ship:</span> MyStream — debounced search · cached autocomplete</div>
        <div><span class="num">0d18c4f</span> <span class="head-row">init:</span> joined C-DAC Chennai as Project Associate</div>
      </div>`;
    // Mount heatmap
    const cs = getComputedStyle(document.documentElement);
    const palette = ["hm-0","hm-1","hm-2","hm-3","hm-4"].map(k => cs.getPropertyValue("--" + k).trim());
    window.renderHeatmap(document.getElementById("ide-hm"), { palette });

    // Wire panel tabs
    document.querySelectorAll(".terminal .head .tab2").forEach(t => {
      t.addEventListener("click", () => {
        const p = t.dataset.panel;
        document.querySelectorAll(".terminal .head .tab2").forEach(x => x.classList.toggle("active", x === t));
        document.querySelectorAll(".terminal .body .panel").forEach(x => x.classList.toggle("active", x.dataset.panel === p));
      });
    });
  }

  // ── THEME SWITCHING ───────────────────────────────────────
  function applyTheme(t) {
    document.documentElement.setAttribute("data-theme", t);
    document.querySelectorAll(".themes button").forEach(b => b.setAttribute("aria-pressed", b.dataset.t === t ? "true" : "false"));
    try { localStorage.setItem("vanchi.theme", t); } catch {}
    renderTermPanels(); // re-render to pick up new heatmap palette
  }
  document.querySelectorAll(".themes button").forEach(b => b.addEventListener("click", () => applyTheme(b.dataset.t)));
  try { const saved = localStorage.getItem("vanchi.theme"); if (["one-dark","github-dark","tokyo-night","light"].includes(saved)) applyTheme(saved); } catch {}

  // ── BOOT ──────────────────────────────────────────────────
  renderTree();
  renderTabs();
  renderEditor();
  renderTermPanels();

  // AI chat
  const cs = getComputedStyle(document.documentElement);
  window.mountAskChat(document.body, {
    label: "ask vanchi",
    placement: { bottom: 240, right: 20 },
    palette: {
      surface: cs.getPropertyValue("--panel").trim() || "#21252b",
      text:    cs.getPropertyValue("--fg").trim()    || "#d7dae0",
      dim:     cs.getPropertyValue("--dim").trim()   || "#5c6370",
      accent:  cs.getPropertyValue("--accent").trim()|| "#61afef",
      border:  cs.getPropertyValue("--rule").trim()  || "#181a1f",
      userBg:  "rgba(97,175,239,.18)"
    }
  });

  window.installAgentMeta();
})();
