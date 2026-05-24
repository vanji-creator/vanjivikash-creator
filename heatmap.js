// Reusable LeetCode-style heatmap SVG.
// Usage: renderHeatmap(container, { counts, cell, gap, palette, label, weekday })
window.renderHeatmap = function (mount, opts = {}) {
  const counts = opts.counts || window.BIO.heatmap;
  const cell   = opts.cell   || 11;
  const gap    = opts.gap    || 3;
  const palette = opts.palette || ["#161616", "#0e4429", "#006d32", "#26a641", "#39d353"];
  const showLabels = opts.labels !== false;

  // Find the most recent Saturday-aligned grid (53 weeks × 7 days).
  const today = new Date();
  const days = counts.length;
  // Build dates list: day[i] is (today - (days-1-i)) days ago.
  const dates = [];
  for (let i = 0; i < days; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() - (days - 1 - i));
    dates.push(d);
  }
  // Pad leading slots so column 0 starts on Sunday (getDay()===0).
  const leadPad = dates[0].getDay();
  const grid = Array(leadPad).fill(null).concat(counts.map((c, i) => ({ c, d: dates[i] })));
  while (grid.length % 7) grid.push(null);
  const weeks = grid.length / 7;

  const W = weeks * (cell + gap) + 40;
  const H = 7 * (cell + gap) + 30;

  const level = (c) => {
    if (!c || c === 0) return 0;
    if (c < 2) return 1;
    if (c < 4) return 2;
    if (c < 6) return 3;
    return 4;
  };

  const monthLabels = [];
  let lastMonth = -1;
  for (let w = 0; w < weeks; w++) {
    const slot = grid[w * 7];
    if (!slot) continue;
    const m = slot.d.getMonth();
    if (m !== lastMonth) {
      monthLabels.push({ w, label: ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][m] });
      lastMonth = m;
    }
  }

  let svg = `<svg viewBox="0 0 ${W} ${H}" width="100%" preserveAspectRatio="xMinYMid meet" style="display:block">`;
  if (showLabels) {
    for (const m of monthLabels) {
      svg += `<text x="${30 + m.w * (cell + gap)}" y="10" font-size="9" fill="currentColor" opacity=".55" font-family="ui-monospace,monospace">${m.label}</text>`;
    }
    ["Mon","Wed","Fri"].forEach((d, i) => {
      const y = 18 + (i * 2 + 1) * (cell + gap) + cell - 2;
      svg += `<text x="0" y="${y}" font-size="9" fill="currentColor" opacity=".55" font-family="ui-monospace,monospace">${d}</text>`;
    });
  }
  for (let i = 0; i < grid.length; i++) {
    const slot = grid[i];
    if (!slot) continue;
    const w = Math.floor(i / 7);
    const dow = i % 7;
    const x = 30 + w * (cell + gap);
    const y = 18 + dow * (cell + gap);
    const lv = level(slot.c);
    const c = palette[lv];
    const title = `${slot.d.toDateString()}: ${slot.c} submission${slot.c === 1 ? "" : "s"}`;
    svg += `<rect x="${x}" y="${y}" width="${cell}" height="${cell}" rx="2" fill="${c}"><title>${title}</title></rect>`;
  }
  svg += `</svg>`;
  mount.innerHTML = svg;
};
