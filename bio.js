// Single source of truth for the portfolio. All variations read from here.
window.BIO = {
  name: "Vanchi Vikash P M",
  short: "Vanchi Vikash",
  handle: "vanjiivikash",
  role: "Software Engineer",
  trajectory: "Fullstack → ML/AI",
  location: "Chennai, India",
  email: "vikashvanchi@gmail.com",
  phone: "+91 6382285582",
  site: "https://vanchivikash.vercel.app",
  github: "https://github.com/vanchivikash",
  leetcode: "https://leetcode.com/u/vanjiivikash",
  linkedin: "https://www.linkedin.com/in/vanchivikash",
  tagline: "I ship web systems that pass security audits — and I'm teaching myself to build the next layer with ML.",

  bio: [
    "I'm a software engineer at C-DAC Chennai shipping production fullstack systems for the Government of India.",
    "Most of my work sits at the intersection of frontend craft and security: React/Next.js applications that survive CERT-In audits, VAPT, and adversarial penetration testing.",
    "Now I'm investing nights and weekends into the next chapter — math, deep learning, and applied LLM engineering — so the agents I build tomorrow are as well-engineered as the apps I ship today."
  ],

  experience: [
    {
      org: "C-DAC Chennai",
      orgFull: "Centre for Development of Advanced Computing",
      title: "Project Associate",
      start: "Jul 2024",
      end: "Present",
      stack: ["React.js", "Next.js", "Odoo 14", "Apache", "Burp Suite", "Jest"],
      bullets: [
        "Built and deployed two government portals (mail client + drafting system) for 500+ users using component-based React/Next.js with Jest unit tests.",
        "Led end-to-end production deployment of the Supply Order Monitoring Portal (SOMP) for the Government of India — 99.9% uptime, CERT-In 'Safe to Host' certification, CIRA security clearance.",
        "Resolved 15+ critical VAPT findings (XSS, CSRF, clickjacking) by implementing HSTS, CSP, and SSL/TLS hardening — reduced risk score by 85%."
      ]
    }
  ],

  projects: [
    {
      slug: "chatflow",
      name: "Chatflow",
      kind: "Red-Team Orchestration Platform",
      date: "Nov 2025",
      stack: ["TypeScript", "React", "Node.js", "Socket.IO", "Docker"],
      live: "https://chat-flow-app.vercel.app/",
      one: "A dual-mode VAPT platform: live terminal + visual flow builder for automated security testing.",
      bullets: [
        "Dual-mode security platform combining a real-time web terminal and visual flow builder for automated VAPT.",
        "Low-latency WebSocket backend orchestrating Nmap, Nuclei, and Gobuster scans, parsing raw stdout into structured findings for live dashboards."
      ]
    },
    {
      slug: "gexplain",
      name: "Text Explainer",
      kind: "Chrome Extension (AI)",
      date: "Oct – Nov 2025",
      stack: ["JS (ES6+)", "Gemini API", "Chrome APIs"],
      live: "https://gexplain.vercel.app/",
      one: "AI-powered text explanation for any webpage. Universal: Gmail, GitHub, even nested iframes.",
      bullets: [
        "AI-powered text explanation tool with universal site compatibility including Gmail, GitHub, and embedded iframes — 4.8/5 user rating.",
        "Content script injection with all-frames support + SPA navigation detection via webNavigation API; reduced page-load impact by 40%.",
        "Gemini API integration with error handling and rate limiting; processes 1000+ explanations daily at ~200ms average."
      ]
    },
    {
      slug: "mystream",
      name: "MyStream",
      kind: "Video Streaming Client",
      date: "Apr – May 2024",
      stack: ["React", "Redux Toolkit", "Tailwind", "React Router"],
      live: "https://mystream-sigma.vercel.app/",
      one: "YouTube Data API client with debounced search, cached autocomplete, and polling-based live chat.",
      bullets: [
        "Uses the YouTube Data API for fetching data; features a live chat demo using API polling.",
        "Efficient search autocomplete with debouncing and result caching for fast, real-time suggestions."
      ]
    }
  ],

  skills: {
    "Languages":          ["TypeScript", "JavaScript", "Python", "SQL"],
    "Frontend":           ["React", "Next.js", "Redux Toolkit", "Tailwind", "HTML5", "CSS3"],
    "Backend":            ["Node.js", "Socket.IO", "REST", "Odoo 14", "Firebase"],
    "Security · DevOps":  ["Linux", "Apache", "SSL/TLS", "Burp Suite", "VAPT", "CI/CD"],
    "Tools":              ["Git", "Postman", "Webpack", "VS Code", "Jest"]
  },

  learning: [
    { kind: "Book",   title: "Deep Learning",                 by: "Goodfellow, Bengio, Courville", status: "reading"   },
    { kind: "Course", title: "Neural Networks: Zero to Hero", by: "Andrej Karpathy",               status: "in progress"},
    { kind: "Book",   title: "Mathematics for Machine Learning", by: "Deisenroth, Faisal, Ong",    status: "queued"     },
    { kind: "Lib",    title: "PyTorch fundamentals",          by: "official tutorials",            status: "in progress"},
    { kind: "Lib",    title: "Hugging Face Transformers",     by: "official docs",                 status: "queued"     },
    { kind: "Paper",  title: "Attention Is All You Need",     by: "Vaswani et al., 2017",          status: "re-reading" }
  ],

  education: {
    school: "Amrita Vishwa Vidyapeetham",
    degree: "B.Tech, Computer Science and Engineering",
    years: "2020 – 2024"
  },

  // Mock LeetCode stats (representative — wire to leetcode-stats-api in prod).
  leet: {
    total: 312,
    easy:  148,
    medium: 142,
    hard:  22,
    streak: 47,
    rank: 84219,
    accepted: 1106,
    submissions: 1893
  }
};

// Generate a deterministic 365-day activity grid (last year of submissions).
// Seeded so it looks "real" without depending on the network.
window.BIO.heatmap = (() => {
  const days = 365;
  const out = [];
  let s = 1337;
  const rand = () => { s = (s * 1664525 + 1013904223) >>> 0; return (s & 0xffff) / 0xffff; };
  for (let i = 0; i < days; i++) {
    const r = rand();
    // Bias higher activity in last 90 days (the "grinding" period).
    const recencyBoost = i > days - 90 ? 0.35 : 0;
    const v = r + recencyBoost;
    let count = 0;
    if (v > 0.55) count = 1;
    if (v > 0.72) count = 2;
    if (v > 0.85) count = 4;
    if (v > 0.94) count = 7;
    // Occasional zero days even in recent stretch
    if (rand() < 0.18 && i < days - 14) count = 0;
    out.push(count);
  }
  return out;
})();
