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
  if (navLinks.length && "IntersectionObserver" in window) {
    const byId = new Map(navLinks.map((a) => [a.getAttribute("href").slice(1), a]));
    const spy = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        navLinks.forEach((a) => a.removeAttribute("aria-current"));
        const link = byId.get(en.target.id);
        if (link) link.setAttribute("aria-current", "true");
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    document.querySelectorAll("main > section").forEach((sec) => spy.observe(sec));
  }

  const root = document.documentElement;
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
  }
})();
