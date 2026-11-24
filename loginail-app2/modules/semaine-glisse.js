/* ===== 24/11 (Marie : « en vue semaine, je veux pouvoir déplacer les rendez-vous comme sur agenda jour, en restant appuyée ») =====
   Comme en mode Jour (suite.js) : on reste appuyée sur un rendez-vous, il se soulève, puis on le glisse.
   En semaine, il peut aussi changer de jour : vers la gauche ou la droite, il passe dans la colonne d'à côté.
   L'heure suit le doigt au quart d'heure, et s'écrit dans la case pendant qu'on glisse. Rien n'est envoyé à la cliente (comme en mode Jour).
   Les heures de la semaine n'ont pas toutes la même hauteur (agenda-vues.js, repartit) : on lit la place réelle des traits. */
(function () {
  const TENIR = 380, BOUGE = 8, QUART = 15;
  const st = document.createElement("style");
  st.textContent = `#E .av-b{-webkit-touch-callout:none}
#E .av-b.sg-tient{z-index:9;box-shadow:0 12px 24px -8px rgba(0,0,0,.45);transform-origin:center;transition:none;outline:1.5px solid var(--v-fonce,#1E1C1B);outline-offset:-1px}
#E .av-b.sg-tient.sg-non{outline-color:#B03A3A;background:#F6DADA}
#E .av-col.sg-ici{background:color-mix(in srgb,var(--v-acc,#B5475E) 8%,#fff)}
#E .av-b.sg-pose{transition:transform .18s cubic-bezier(.22,.8,.28,1)}
@media (prefers-reduced-motion:reduce){#E .av-b.sg-pose{transition:none}}`;
  document.head.appendChild(st);

  let G = null, avale = 0;
  const minDe = d => d.getHours() * 60 + d.getMinutes();
  const COLS = () => [...E.querySelectorAll(".vue.on .av-col")];
  const JOURS3 = ["dim.", "lun.", "mar.", "mer.", "jeu.", "ven.", "sam."];

  /* y (à l'écran) → minute, d'après les traits des heures de cette colonne */
  function minuteA(col, y) {
    const z = col.parentElement, A = +z.dataset.debut, B = +z.dataset.fin, r = col.getBoundingClientRect();
    const pts = [[r.top, A]].concat([...col.querySelectorAll("u[data-m]")].map(u => [u.getBoundingClientRect().top, +u.dataset.m]), [[r.bottom, B]]);
    for (let i = 1; i < pts.length; i++) {
      const [y0, m0] = pts[i - 1], [y1, m1] = pts[i];
      if (y <= y1 || i === pts.length - 1) return m0 + (m1 - m0) * Math.max(0, Math.min(1, (y - y0) / ((y1 - y0) || 1)));
    }
    return A;
  }
  /* minute → y dans la colonne (pour poser la case pendant qu'on glisse) */
  function yDe(col, m) {
    const z = col.parentElement, A = +z.dataset.debut, B = +z.dataset.fin, r = col.getBoundingClientRect();
    const pts = [[r.top, A]].concat([...col.querySelectorAll("u[data-m]")].map(u => [u.getBoundingClientRect().top, +u.dataset.m]), [[r.bottom, B]]);
    for (let i = 1; i < pts.length; i++) {
      const [y0, m0] = pts[i - 1], [y1, m1] = pts[i];
      if (m <= m1 || i === pts.length - 1) return y0 + (y1 - y0) * ((m - m0) / ((m1 - m0) || 1));
    }
    return r.top;
  }
  const colSous = x => { const l = COLS(); let best = null, d = Infinity; l.forEach(c => { const r = c.getBoundingClientRect(), e = x < r.left ? r.left - x : x > r.right ? x - r.right : 0; if (e < d) { d = e; best = c; } }); return best; };
  const occupe = (deb, fin, id) => S.rdv.some(r => r.id !== id && r.statut !== "annule" && new Date(r.debut) < fin && new Date(r.fin) > deb);

  function debut(el, x, y) {
    if (G) fin(true);
    const r = S.rdv.find(v => v.id === el.dataset.rdv), col = el.closest(".av-col");
    if (!r || r.statut !== "prevu" || !col || el.hasAttribute("data-entier")) return;
    G = { el, r, col, x, y, on: false, t: setTimeout(() => {
      if (!G || !el.isConnected) { G = null; return; }
      G.on = true; G.dur = new Date(r.fin) - new Date(r.debut);
      G.m0 = minDe(new Date(r.debut)); G.y0 = el.getBoundingClientRect().top; G.dy0 = y - G.y0;
      el.classList.add("sg-tient"); navigator.vibrate?.(12);
      const z = el.closest(".av-g"); if (z) { G.z = z; G.ov = z.style.overflowY; z.style.overflowY = "hidden"; }
      bouge(x, y);
    }, TENIR) };
  }
  function bouge(x, y) {
    if (!G) return;
    if (!G.on) { if (Math.hypot(x - G.x, y - G.y) > BOUGE) { clearTimeout(G.t); G = null; } return; }
    const col = colSous(x) || G.col, z = col.parentElement, A = +z.dataset.debut, B = +z.dataset.fin, dm = G.dur / 60000;
    /* le haut de la case suit le doigt (là où elle l'a attrapée), au quart d'heure */
    let m = Math.round(minuteA(col, y - G.dy0) / QUART) * QUART;
    m = Math.max(A, Math.min(B - Math.min(dm, B - A), m));
    const jour = new Date(col.dataset.avJ), deb = new Date(jour); deb.setHours(0, m, 0, 0);
    const finD = new Date(+deb + G.dur);
    G.cible = { col, deb, fin: finD, non: occupe(deb, finD, G.r.id) };
    const rc = col.getBoundingClientRect(), r0 = G.col.getBoundingClientRect();
    const tx = rc.left - r0.left, ty = yDe(col, m) - G.y0;
    G.el.style.transform = `translate(${tx}px,${ty}px)`;
    G.el.classList.toggle("sg-non", G.cible.non);
    COLS().forEach(c => c.classList.toggle("sg-ici", c === col && c !== G.col));
    const h = G.el.querySelector(".av-h"); if (h) h.textContent = hm(deb);
  }
  async function fin(annule) {
    if (!G) return;
    clearTimeout(G.t); const g = G; G = null;
    if (g.z) g.z.style.overflowY = g.ov || "";
    if (!g.on) return;
    avale = Date.now();
    COLS().forEach(c => c.classList.remove("sg-ici"));
    const c = g.cible, retour = msg => { g.el.classList.add("sg-pose"); g.el.classList.remove("sg-tient", "sg-non"); g.el.style.transform = ""; const h = g.el.querySelector(".av-h"); if (h) h.textContent = hm(new Date(g.r.debut)); setTimeout(() => g.el.classList.remove("sg-pose"), 200); if (msg) dit(msg); };
    if (annule || !c || +c.deb === +new Date(g.r.debut)) return retour();
    if (c.non) return retour("Ce créneau est déjà pris");
    g.el.classList.remove("sg-tient");
    try {
      /* relu juste avant : une cliente a pu réserver en ligne pendant qu'elle glissait */
      const { data: pris, error: e1 } = await sb.from("rendez_vous").select("id,statut").lt("debut", c.fin.toISOString()).gt("fin", c.deb.toISOString());
      if (e1) throw e1;
      if ((pris || []).some(x => x.id !== g.r.id && x.statut !== "annule")) { await chargeSemaine(); rendu(); return dit("Ce créneau vient d’être pris"); }
      const { data, error } = await sb.from("rendez_vous").update({ debut: c.deb.toISOString(), fin: c.fin.toISOString() })
        .eq("id", g.r.id).eq("debut", g.r.debut).eq("statut", "prevu").select("id");   /* seulement s'il n'a pas bougé entre-temps */
      if (error || !data || !data.length) throw error || new Error("pas trouvé");
    } catch (e) { console.error(e); rendu(); return dit("Oups, ça n’a pas marché. Réessaie."); }
    await chargeSemaine(); chargeVisites(); rendu();
    const autreJour = !memeJour(c.deb, new Date(g.r.debut));
    dit(autreJour ? `Déplacé ${JOURS3[c.deb.getDay()]} ${c.deb.getDate()} à ${hm(c.deb)} ✓` : `Décalé à ${hm(c.deb)} ✓`);
  }

  /* sur window, en premier : tant qu'elle tient un rendez-vous, la semaine ne glisse pas et la grille ne défile pas */
  addEventListener("touchstart", e => {
    if (S.onglet !== "ag" || E.classList.contains("fe") || e.touches.length !== 1 || !e.target.closest) { if (G) fin(true); return; }
    const el = e.target.closest(".vue.on .av-g .av-b[data-rdv]"); if (el) debut(el, e.touches[0].clientX, e.touches[0].clientY);
  }, { capture: true, passive: true });
  addEventListener("touchmove", e => {
    if (!G) return;
    bouge(e.touches[0].clientX, e.touches[0].clientY);
    if (G && G.on) { if (e.cancelable) e.preventDefault(); e.stopPropagation(); }
  }, { capture: true, passive: false });
  addEventListener("touchend", e => { if (G && G.on) e.stopPropagation(); fin(false); }, true);
  addEventListener("touchcancel", () => fin(true), true);
  /* sur ordinateur, à la souris */
  addEventListener("mousedown", e => { if (e.button || S.onglet !== "ag" || E.classList.contains("fe") || !e.target.closest) return; const el = e.target.closest(".vue.on .av-g .av-b[data-rdv]"); if (el) debut(el, e.clientX, e.clientY); }, true);
  addEventListener("mousemove", e => { if (G) { bouge(e.clientX, e.clientY); if (G && G.on) e.preventDefault(); } }, true);
  addEventListener("mouseup", () => fin(false), true);
  /* le toucher qui suit le dépôt n'ouvre pas le rendez-vous */
  addEventListener("click", e => { if (Date.now() - avale < 500 && e.target.closest && e.target.closest(".av-g")) { e.stopPropagation(); e.preventDefault(); } }, true);
  addEventListener("contextmenu", e => { if (e.target.closest && e.target.closest(".av-g .av-b")) e.preventDefault(); }, true);
  window.__semGlisse = { minuteA };
})();
