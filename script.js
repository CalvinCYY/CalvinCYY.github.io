(() => {
  "use strict";

  /* ---------- Year ---------- */
  const year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());

  /* ---------- Mobile menu ---------- */
  const bar = document.querySelector(".bar");
  const menuBtn = document.querySelector(".bar__menu");
  if (bar && menuBtn) {
    const setOpen = (open) => {
      bar.toggleAttribute("data-open", open);
      menuBtn.setAttribute("aria-expanded", String(open));
      menuBtn.querySelector(".bar__menu-label").textContent = open ? "Close" : "Menu";
      document.body.style.overflow = open ? "hidden" : "";
    };
    menuBtn.addEventListener("click", () => setOpen(!bar.hasAttribute("data-open")));
    bar.querySelectorAll(".bar__nav a").forEach((a) => a.addEventListener("click", () => setOpen(false)));
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && bar.hasAttribute("data-open")) { setOpen(false); menuBtn.focus(); }
    });
    window.matchMedia("(min-width: 861px)").addEventListener("change", (e) => { if (e.matches) setOpen(false); });
  }

  /* ---------- Nav: mark the section being read ---------- */
  const navLinks = [...document.querySelectorAll('.bar__nav a[href^="#"]')];
  if (navLinks.length) {
    const byId = new Map(navLinks.map((a) => [a.getAttribute("href").slice(1), a]));
    const secs = [...document.querySelectorAll("main > section")];
    let spyQueued = false;
    const spy = () => {
      spyQueued = false;
      const mid = window.innerHeight * 0.5;
      let current = null;
      for (const sec of secs) if (sec.getBoundingClientRect().top <= mid) current = sec;
      const link = current ? byId.get(current.id) : null;
      navLinks.forEach((a) => (a === link ? a.setAttribute("aria-current", "true") : a.removeAttribute("aria-current")));
    };
    window.addEventListener("scroll", () => { if (!spyQueued) { spyQueued = true; requestAnimationFrame(spy); } }, { passive: true });
    spy();
  }

  const root = document.documentElement;

  /* ---------- Paper stack: sheets stick, the next one slides over and the last one sinks ---------- */
  const sheets = [...document.querySelectorAll("main > section")];
  const stillMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  if (sheets.length > 1) {
    const barH = () => (bar ? bar.offsetHeight : 0);
    const measure = () => {
      const vh = window.innerHeight, top = barH();
      // a sheet taller than the screen scrolls through fully, then sticks by its bottom edge
      sheets.forEach((s) => s.style.setProperty("--stick", `${Math.min(top, vh - s.offsetHeight)}px`));
      placeSnaps();
    };

    // Spring catches: when a scroll comes to rest close to a sheet boundary, settle onto it with a
    // critically damped spring. Only a small zone around each boundary catches, so reading inside a
    // sheet is never pulled; any wheel, touch or key input cancels the settle immediately.
    let catches = [];
    const placeSnaps = () => {
      catches = [];
      if (!root.classList.contains("stack")) return;
      const vh = window.innerHeight, top = barH();
      const max = document.documentElement.scrollHeight - vh;
      let y = sheets[0].parentElement.offsetTop;
      sheets.forEach((s) => {
        const h = s.offsetHeight;
        catches.push(y - top); // settled: the sheet's top sits under the bar
        if (h > vh - top + 1) catches.push(y + h - vh); // read through: a tall sheet's bottom meets the screen's
        y += h;
      });
      catches = catches.map((c) => Math.round(Math.min(max, Math.max(0, c))));
    };
    let springing = 0, quietUntilInput = false, touching = false;
    const stopSpring = () => { if (springing) { cancelAnimationFrame(springing); springing = 0; } };
    const userInput = () => { stopSpring(); quietUntilInput = false; };
    ["wheel", "keydown", "pointerdown"].forEach((t) => window.addEventListener(t, userInput, { passive: true }));
    window.addEventListener("touchstart", () => { touching = true; userInput(); }, { passive: true });
    window.addEventListener("touchend", () => { touching = false; }, { passive: true });
    const settle = () => {
      if (!root.classList.contains("stack") || springing || quietUntilInput || touching || !catches.length) return;
      const y0 = window.scrollY;
      const zone = Math.min(140, window.innerHeight * 0.15);
      let target = null, best = zone;
      catches.forEach((c) => { const d = Math.abs(c - y0); if (d < best) { best = d; target = c; } });
      if (target === null || best < 2) return;
      const w = 16, t0 = performance.now(); // ω in rad/s: settles in about 350ms, no overshoot
      const step = (now) => {
        const t = (now - t0) / 1000;
        const x = target + (y0 - target) * (1 + w * t) * Math.exp(-w * t);
        window.scrollTo({ top: x, behavior: "instant" });
        if (Math.abs(x - target) < 0.5) { window.scrollTo({ top: target, behavior: "instant" }); springing = 0; return; }
        springing = requestAnimationFrame(step);
      };
      springing = requestAnimationFrame(step);
    };
    if ("onscrollend" in window) window.addEventListener("scrollend", settle);
    else {
      let idle = 0;
      window.addEventListener("scroll", () => { if (springing) return; clearTimeout(idle); idle = setTimeout(settle, 160); }, { passive: true });
    }

    let queued = false;
    const paint = () => {
      queued = false;
      const vh = window.innerHeight, span = vh - barH();
      sheets.forEach((s, i) => {
        const next = sheets[i + 1];
        let cover = 0;
        if (next) cover = Math.min(1, Math.max(0, (vh - next.getBoundingClientRect().top) / span));
        s.style.setProperty("--cover", cover.toFixed(3));
      });
    };
    const queue = () => { if (!queued) { queued = true; requestAnimationFrame(paint); } };
    const enable = () => {
      const on = !stillMotion.matches;
      root.classList.toggle("stack", on);
      if (on) { measure(); paint(); } else { sheets.forEach((s) => s.style.removeProperty("--cover")); placeSnaps(); }
    };
    enable();
    // heights change as images and fonts arrive: keep sticks and snap markers on the real flow
    if ("ResizeObserver" in window) {
      let rq = false;
      new ResizeObserver(() => {
        if (rq || !root.classList.contains("stack")) return;
        rq = true;
        requestAnimationFrame(() => { rq = false; measure(); });
      }).observe(sheets[0].parentElement);
    }
    window.addEventListener("scroll", () => { if (root.classList.contains("stack")) queue(); }, { passive: true });
    window.addEventListener("resize", () => { if (root.classList.contains("stack")) { measure(); queue(); } });
    window.addEventListener("load", () => { if (root.classList.contains("stack")) { measure(); paint(); } });
    stillMotion.addEventListener("change", enable);

    // Anchor jumps: sticky sheets report their stuck position, so scroll to the flow position instead
    const flowTop = (el) => {
      let y = 0, n = el;
      const sheet = el.closest("main > section");
      if (sheet && root.classList.contains("stack")) {
        // sum of the heights of all sheets before this one is its untouched flow position
        const main = sheet.parentElement;
        y = main.offsetTop;
        for (const s of sheets) { if (s === sheet) break; y += s.offsetHeight; }
        if (el !== sheet) { y += el.getBoundingClientRect().top - sheet.getBoundingClientRect().top; }
        return y - barH();
      }
      for (; n; n = n.offsetParent) y += n.offsetTop;
      return y - barH();
    };
    document.addEventListener("click", (e) => {
      const a = e.target.closest('a[href^="#"]');
      if (!a || !root.classList.contains("stack")) return;
      const id = a.getAttribute("href").slice(1);
      const target = id ? document.getElementById(id) : null;
      if (!target || target.closest(".bar")) return;
      e.preventDefault();
      quietUntilInput = true;
      history.pushState(null, "", `#${id}`);
      window.scrollTo({ top: Math.max(0, flowTop(target)), behavior: stillMotion.matches ? "auto" : "smooth" });
    });
    // deep link on arrival (e.g. /#az-02)
    window.addEventListener("load", () => {
      const id = location.hash.slice(1);
      const target = id ? document.getElementById(id) : null;
      if (target && root.classList.contains("stack") && !target.closest(".bar")) { quietUntilInput = true; window.scrollTo(0, Math.max(0, flowTop(target))); }
    });
  }
  const printing = root.classList.contains("print");
  if (printing) setTimeout(() => root.classList.remove("print"), 2600);
  const calm = window.matchMedia("(prefers-reduced-motion: reduce)");

  /* ---------- Aspirin: skeletal structure with illustrative 13C shifts ---------- */
  const svg = document.querySelector("svg.mol");
  if (!svg) return;

  const NS = "http://www.w3.org/2000/svg";
  const el = (name, attrs = {}, parent) => {
    const node = document.createElementNS(NS, name);
    for (const [k, v] of Object.entries(attrs)) node.setAttribute(k, v);
    if (parent) parent.appendChild(node);
    return node;
  };

  // Coordinates in a 600 x 340 space (viewBox cropped in HTML). Carbon shifts are illustrative literature-range values.
  // note: [dx, dy, anchor] places the pinned annotation relative to the atom.
  const atoms = {
    C1: { x: 392, y: 150, el: "C", shift: 122.3, note: [62, -14, "start"] },
    C2: { x: 331.4, y: 185, el: "C", shift: 151.2, note: [-41, -84, "end"] },
    C3: { x: 331.4, y: 255, el: "C", shift: 124.0, note: [-56, 56, "end"] },
    C4: { x: 392, y: 290, el: "C", shift: 134.9, note: [0, 44, "middle"] },
    C5: { x: 452.6, y: 255, el: "C", shift: 126.2, note: [40, 40, "start"] },
    C6: { x: 452.6, y: 185, el: "C", shift: 132.5, note: [48, -6, "start"] },
    C7: { x: 392, y: 80, el: "C", shift: 170.2, note: [56, 18, "start"] },
    O1: { x: 331.4, y: 45, el: "O" },
    O2: { x: 452.6, y: 45, el: "OH" },
    O3: { x: 270.8, y: 150, el: "O" },
    C8: { x: 210.2, y: 185, el: "C", shift: 169.7, note: [-44, 40, "end"] },
    O4: { x: 210.2, y: 255, el: "O" },
    C9: { x: 149.6, y: 150, el: "C", shift: 21.0, note: [-20, -44, "end"] },
  };

  // [a, b, order, inner?] inner = draw the second line inside the ring
  const bonds = [
    ["C1", "C2", 2, true], ["C2", "C3", 1], ["C3", "C4", 2, true],
    ["C4", "C5", 1], ["C5", "C6", 2, true], ["C6", "C1", 1],
    ["C1", "C7", 1], ["C7", "O1", 2], ["C7", "O2", 1],
    ["C2", "O3", 1], ["O3", "C8", 1], ["C8", "O4", 2], ["C8", "C9", 1],
  ];
  const ring = { x: 392, y: 220 };

  const gBonds = el("g", { "aria-hidden": "true" }, svg);
  const gHet = el("g", { "aria-hidden": "true" }, svg);
  const gNote = el("g", { "aria-hidden": "true" }, svg);
  const gAtoms = el("g", {}, svg);

  const shorten = (a, b, ta, tb) => {
    const dx = b.x - a.x, dy = b.y - a.y, len = Math.hypot(dx, dy);
    const ux = dx / len, uy = dy / len;
    return [a.x + ux * ta, a.y + uy * ta, b.x - ux * tb, b.y - uy * tb];
  };
  const trim = (id) => (atoms[id].el === "C" ? 0 : atoms[id].el === "OH" ? 15 : 13);

  const adj = {};
  Object.keys(atoms).forEach((k) => (adj[k] = []));
  const bondEls = [];

  bonds.forEach(([a, b, order, inner]) => {
    adj[a].push(b); adj[b].push(a);
    const A = atoms[a], B = atoms[b];
    const parts = [];
    const [x1, y1, x2, y2] = shorten(A, B, trim(a), trim(b));
    parts.push(el("line", { x1, y1, x2, y2, class: "bond" }, gBonds));
    if (order === 2) {
      const dx = x2 - x1, dy = y2 - y1, len = Math.hypot(dx, dy);
      let nx = -dy / len, ny = dx / len;
      if (inner) {
        // offset toward ring centre, shortened at both ends
        const mx = (x1 + x2) / 2, my = (y1 + y2) / 2;
        if ((ring.x - mx) * nx + (ring.y - my) * ny < 0) { nx = -nx; ny = -ny; }
        const off = 9, cut = 0.16;
        parts.push(el("line", {
          x1: x1 + dx * cut + nx * off, y1: y1 + dy * cut + ny * off,
          x2: x2 - dx * cut + nx * off, y2: y2 - dy * cut + ny * off, class: "bond",
        }, gBonds));
      } else {
        const off = 7;
        parts[0].setAttribute("x1", x1 - nx * off / 2); parts[0].setAttribute("y1", y1 - ny * off / 2);
        parts[0].setAttribute("x2", x2 - nx * off / 2); parts[0].setAttribute("y2", y2 - ny * off / 2);
        parts.push(el("line", {
          x1: x1 + nx * off / 2, y1: y1 + ny * off / 2, x2: x2 + nx * off / 2, y2: y2 + ny * off / 2, class: "bond",
        }, gBonds));
      }
    }
    bondEls.push({ a, b, parts });
  });

  // Heteroatom labels
  const hetEls = {};
  Object.entries(atoms).forEach(([id, A]) => {
    if (A.el === "C") return;
    const t = el("text", { x: A.x, y: A.y + 8.5, "text-anchor": "middle", class: "het" }, gHet);
    t.textContent = A.el;
    hetEls[id] = t;
  });

  const formula = el("text", { x: 548, y: 332, "text-anchor": "end", class: "formula", "aria-hidden": "true" }, svg);
  [["Aspirin · C"], ["9", 1], ["H"], ["8", 1], ["O"], ["4", 1]].forEach(([t, sub], i, arr) => {
    const prevSub = i > 0 && arr[i - 1][1];
    const span = el("tspan", sub ? { dy: 4, "font-size": 10 } : prevSub ? { dy: -4 } : {}, formula);
    span.textContent = t;
  });

  // Annotation (one, pinned to the active atom)
  const leader = el("path", { class: "leader" }, gNote);
  const noteId = el("text", { class: "note-id" }, gNote);
  const noteVal = el("text", { class: "note-val" }, gNote);

  // Carbon hit targets
  const atomEls = {};
  const carbons = Object.keys(atoms).filter((k) => atoms[k].el === "C");
  carbons.forEach((id) => {
    const A = atoms[id];
    const g = el("g", {
      class: "atom", tabindex: "0", role: "button",
      "aria-label": `Carbon ${id.slice(1)}, illustrative shift ${A.shift.toFixed(1)} ppm`,
      "data-id": id,
    }, gAtoms);
    el("circle", { cx: A.x, cy: A.y, r: 22, class: "hit" }, g);
    el("circle", { cx: A.x, cy: A.y, r: 15, class: "ring" }, g);
    el("circle", { cx: A.x, cy: A.y, r: 10, class: "ping", style: "transform-box: fill-box; transform-origin: center" }, g);
    el("circle", { cx: A.x, cy: A.y, class: "dot" }, g);
    atomEls[id] = g;
  });

  const hops = (start) => {
    const dist = { [start]: 0 };
    const q = [start];
    while (q.length) {
      const cur = q.shift();
      if (dist[cur] >= 2) continue;
      adj[cur].forEach((n) => { if (!(n in dist)) { dist[n] = dist[cur] + 1; q.push(n); } });
    }
    return dist;
  };

  // Pulse: messages leave the atom, strongest on its own bonds, then one hop out
  const pulse = (id) => {
    if (calm.matches || !Element.prototype.animate) return;
    const ping = atomEls[id].querySelector(".ping");
    ping.animate(
      [{ transform: "scale(1)", opacity: 0.9 }, { transform: "scale(3.2)", opacity: 0 }],
      { duration: 620, easing: "cubic-bezier(0.16, 1, 0.3, 1)" }
    );
    const d = hops(id);
    bondEls.forEach(({ a, b, parts }) => {
      const near = Math.min(d[a] ?? 9, d[b] ?? 9);
      if (near > 1) return;
      parts.forEach((p) => p.animate(
        near === 0
          ? [{ strokeWidth: 8, strokeOpacity: 1 }, { strokeWidth: 5, strokeOpacity: 1 }]
          : [{ strokeWidth: 6, strokeOpacity: 1 }, { strokeWidth: 3.8, strokeOpacity: 0.85 }],
        { duration: 460, delay: near * 120, easing: "cubic-bezier(0.16, 1, 0.3, 1)", fill: "backwards" }
      ));
    });
  };

  /* ---------- 13C spectrum: each carbon as a Lorentzian line on a 200 to 0 ppm axis ---------- */
  const nmr = document.querySelector("svg.nmr");
  const peakEls = {};
  let mark = null, gPeaks = null;
  const X0 = 16, X1 = 436, BASE = 78, TOP = 62;
  const xOf = (d) => X0 + ((200 - d) / 200) * (X1 - X0);
  // quaternary carbons print weaker than CH and CH3, as they do on a real 13C spectrum
  const height = { C1: 0.42, C2: 0.38, C3: 0.9, C4: 0.96, C5: 0.86, C6: 0.92, C7: 0.36, C8: 0.33, C9: 0.8 };
  if (nmr) {
    el("line", { x1: X0 - 8, y1: BASE, x2: X1 + 8, y2: BASE, class: "base" }, nmr);
    [200, 150, 100, 50, 0].forEach((d) => {
      el("line", { x1: xOf(d), y1: BASE + 6, x2: xOf(d), y2: BASE + 12, class: "tick" }, nmr);
      el("text", { x: xOf(d), y: BASE + 27, "text-anchor": "middle", class: "ax" }, nmr).textContent = String(d);
    });
    for (let d = 190; d > 0; d -= 10) if (d % 50) el("line", { x1: xOf(d), y1: BASE + 6, x2: xOf(d), y2: BASE + 9, class: "tick" }, nmr);
    const unit = el("text", { x: X0 - 8, y: 10, class: "ax" }, nmr);
    unit.textContent = "¹³C · δ / ppm";
    gPeaks = el("g", {}, nmr);
    carbons.forEach((id) => {
      const cx = xOf(atoms[id].shift), h = height[id] * TOP, g = 1.4;
      let d = `M${(cx - 14).toFixed(1)} ${BASE}`;
      for (let x = -14; x <= 14; x += 0.5) d += `L${(cx + x).toFixed(1)} ${(BASE - (h * g * g) / (x * x + g * g)).toFixed(2)}`;
      peakEls[id] = el("path", { d, class: "peak" }, gPeaks);
    });
    mark = el("path", { d: "M0 0l-5 8h10z", class: "mark" }, nmr);
    // pointer over the trace picks the nearest carbon line
    const hit = el("rect", { x: X0 - 8, y: 0, width: X1 - X0 + 16, height: BASE + 10, class: "hit" }, nmr);
    hit.addEventListener("pointermove", (e) => {
      const pt = new DOMPoint(e.clientX, e.clientY).matrixTransform(nmr.getScreenCTM().inverse());
      const d = 200 - ((pt.x - X0) / (X1 - X0)) * 200;
      let best = null, gap = 9;
      carbons.forEach((c) => { const g = Math.abs(atoms[c].shift - d); if (g < gap) { gap = g; best = c; } });
      if (best) activate(best);
    });
  }
  const showPeak = (id) => {
    if (!nmr) return;
    carbons.forEach((c) => peakEls[c].classList.toggle("on", c === id));
    gPeaks.appendChild(peakEls[id]);
    mark.style.transform = `translate(${xOf(atoms[id].shift)}px, ${BASE + 2}px)`;
  };

  let active = null;
  const activate = (id, quiet) => {
    if (active === id) return;
    active = id;
    if (!quiet) pulse(id);
    const A = atoms[id];
    carbons.forEach((c) => {
      atomEls[c].classList.toggle("is-active", c === id);
      atomEls[c].setAttribute("aria-pressed", String(c === id));
    });
    showPeak(id);

    // message passing: 1-hop bonds strong, 2-hop faint
    const d = hops(id);
    bondEls.forEach(({ a, b, parts }) => {
      const near = Math.min(d[a] ?? 9, d[b] ?? 9);
      const far = Math.max(d[a] ?? 9, d[b] ?? 9);
      const h1 = near === 0;
      const h2 = !h1 && near === 1 && far === 2;
      parts.forEach((p) => { p.classList.toggle("hop1", h1); p.classList.toggle("hop2", h2); });
    });

    const [dx, dy, anchor] = A.note;
    const tx = A.x + dx, ty = A.y + dy;
    const ex = anchor === "start" ? tx - 6 : anchor === "end" ? tx + 6 : tx;
    const ey = anchor === "middle" ? ty - 18 : ty - 5;
    leader.setAttribute("d", `M${A.x} ${A.y} L${ex} ${ey}`);
    [noteId, noteVal].forEach((t) => t.setAttribute("text-anchor", anchor));
    noteId.setAttribute("x", tx); noteId.setAttribute("y", ty);
    noteVal.setAttribute("x", tx); noteVal.setAttribute("y", ty + 19);
    noteId.textContent = `C${id.slice(1)}`;
    noteVal.textContent = `δ ${A.shift.toFixed(1)}`;
  };

  carbons.forEach((id) => {
    const g = atomEls[id];
    g.addEventListener("pointerenter", () => activate(id));
    g.addEventListener("focus", () => activate(id));
    g.addEventListener("click", () => activate(id));
    g.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); activate(id); }
    });
  });

  activate("C2", true);

  /* ---------- Contact: the same aspirin as a graph model reads it, atoms as nodes ---------- */
  const graph = document.querySelector("svg.graph");
  if (graph) {
    const gE = el("g", {}, graph), gN = el("g", {}, graph);
    bonds.forEach(([a, b, order]) => {
      const A = atoms[a], B = atoms[b];
      const dx = B.x - A.x, dy = B.y - A.y, len = Math.hypot(dx, dy);
      const nx = -dy / len, ny = dx / len;
      const offs = order === 2 ? [-4, 4] : [0];
      offs.forEach((o) => el("line", { x1: A.x + nx * o, y1: A.y + ny * o, x2: B.x + nx * o, y2: B.y + ny * o, class: "edge" }, gE));
    });
    Object.values(atoms).forEach((A) => {
      const het = A.el !== "C";
      el("circle", { cx: A.x, cy: A.y, r: 16, class: het ? "node het" : "node" }, gN);
      el("text", { x: A.x, y: A.y + 5.5, "text-anchor": "middle", class: het ? "el het" : "el" }, gN).textContent = A.el[0];
    });
  }

  // Signature load: bonds draw outward from C2 in message-passing order, then the note pins
  if (printing && Element.prototype.animate) {
    const start = 700, step = 120, draw = 380;
    const d0 = {};
    (function bfs() {
      d0.C2 = 0; const q = ["C2"];
      while (q.length) { const c = q.shift(); adj[c].forEach((n) => { if (!(n in d0)) { d0[n] = d0[c] + 1; q.push(n); } }); }
    })();
    let last = 0;
    bondEls.forEach(({ a, b, parts }) => {
      const near = Math.min(d0[a], d0[b]);
      const fromA = d0[a] <= d0[b];
      const delay = start + near * step;
      last = Math.max(last, delay);
      parts.forEach((p) => {
        const len = Math.hypot(p.x2.baseVal.value - p.x1.baseVal.value, p.y2.baseVal.value - p.y1.baseVal.value);
        p.style.strokeDasharray = `${len}`;
        const anim = p.animate(
          [{ strokeDashoffset: fromA ? len : -len }, { strokeDashoffset: 0 }],
          { duration: draw, delay, easing: "cubic-bezier(0.16, 1, 0.3, 1)", fill: "backwards" }
        );
        anim.onfinish = () => { p.style.strokeDasharray = ""; };
      });
    });
    Object.entries(hetEls).forEach(([id, t]) => {
      t.animate([{ opacity: 0 }, { opacity: 1 }],
        { duration: 300, delay: start + (d0[id] - 1) * step + draw * 0.6, fill: "backwards" });
    });
    const pinAt = last + draw;
    [leader, noteId, noteVal, formula].forEach((n, i) => n.animate(
      [{ opacity: 0 }, { opacity: 1 }], { duration: 360, delay: pinAt + i * 60, fill: "backwards" }
    ));
    setTimeout(() => { if (active === "C2") pulse("C2"); }, pinAt);
    // the spectrum sweeps in from 200 ppm to 0 as the structure finishes
    if (nmr) {
      [...nmr.children].filter((n) => n !== gPeaks).forEach((n) => n.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 400, delay: start, fill: "backwards" }));
      [...carbons].sort((a, b) => atoms[b].shift - atoms[a].shift).forEach((c, i) => peakEls[c].animate(
        [{ opacity: 0, transform: `translateY(${TOP * 0.25}px)` }, { opacity: 1, transform: "none" }],
        { duration: 340, delay: start + 200 + i * 70, easing: "cubic-bezier(0.16, 1, 0.3, 1)", fill: "backwards" }
      ));
    }
  }
})();
