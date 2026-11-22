/* ===== 22/11 (Marie : « si je suis sur l'agenda et que je glisse, que ça passe au jour d'après ») =====
   Glisser dans les heures = jour d'après (vers la gauche) / jour d'avant (vers la droite). En haut, ça change toujours la semaine (suite.js).
   La journée suit le doigt, la voisine est collée à côté, et on peut la rattraper en route.
   Chargé APRÈS vernis.js et gestes-2111.js : il se sert de leur dessin (échelle des heures = window.__agAjuste). */
(function () {
  const ECART = 16, calme = matchMedia("(prefers-reduced-motion:reduce)"), VUE = '.vue.on[data-p="ag"]:not(.jg-voisine)';
  let D = null, pose = null, avale = 0, aRefaire = false, partiel = false, sur = null, demande = 0;
  const r0 = rendu;
  /* un rafraîchissement qui arrive pendant le geste attend la fin, sinon la journée disparaît sous le doigt */
  rendu = function () {
    if ((D && D.on) || pose) {
      if (S.onglet === "ag") { aRefaire = true; return; }
      if (pose) pose(true);
      D = null; range();
    }
    aRefaire = false; return r0.apply(this, arguments);
  };
  const range = () => E.querySelectorAll(".jg-voisine").forEach(x => x.remove());
  const corps = v => { const l = []; for (let x = [...v.children].find(e => e.classList.contains("k")); x; x = x.nextElementSibling) l.push(x); return l; };
  const deplace = (el, x, trans) => { el.style.animation = "none"; el.style.transition = trans || "none"; el.style.transform = `translateX(${x}px)`; };

  /* la journée voisine ; une autre semaine = dessinée avec ce que le téléphone connaît déjà, puis relue dans le coffre */
  const voisine = (v, d) => {
    const jour = plusJours(S.jour, d), lundi = lundiDe(jour), autre = +lundi !== +S.lundi, avant = { jour: S.jour, lundi: S.lundi, rdv: S.rdv }, h0 = [OUV, FERM];
    let rdv = S.rdv, h;
    if (autre) { const f = plusJours(lundi, 7); rdv = (S.tous || []).filter(r => new Date(r.debut) >= lundi && new Date(r.debut) < f).map(r => Object.assign({}, r, { clientes: S.clientes.find(c => c.id === r.cliente_id) })); }
    try { Object.assign(S, { jour, lundi, rdv }); h = VUES.ag(); }
    finally { Object.assign(S, avant); VUES.ag(); [OUV, FERM] = h0; }   /* le 2e dessin remet ce que l'agenda retient (« Aujourd’hui ») */
    const el = v.cloneNode(false); el.classList.add("jg-voisine"); el.setAttribute("aria-hidden", "true"); el.innerHTML = h; v.after(el);
    const p = el.querySelector(".pap"), p0 = v.querySelector(".pap");
    if (p) { p.style.animation = "none"; if (window.__agAjuste) window.__agAjuste(p); if (p0) p.scrollTop = p0.scrollTop; }
    return { el, jour, lundi, rdv, autre };
  };

  const demarre = () => {
    const p = D.vue.querySelector(".pap");
    /* sur ordinateur, le téléphone dessiné est réduit (zoom) : on compte le doigt à son échelle */
    D.ech = innerWidth >= 700 ? +getComputedStyle(document.documentElement).getPropertyValue("--z") || 1 : 1;
    D.on = true; D.corps = corps(D.vue); D.pas = p.offsetWidth + ECART;
  };
  const bouge = dx => {
    D.dx = dx; const d = dx < 0 ? 1 : -1;
    if (!D.v[d]) D.v[d] = voisine(D.vue, d);
    D.corps.forEach(x => deplace(x, dx));
    [1, -1].forEach(s => { const n = D.v[s]; if (!n) return; n.el.style.visibility = s === d ? "" : "hidden"; deplace(n.el, dx + s * D.pas); });
  };

  const debut = (x, y, cible) => {
    D = null; avale = 0;
    if (S.onglet !== "ag" || E.classList.contains("fe") || S.moisOuvert || !cible.closest) { if (pose) pose(); return; }
    let v = E.querySelector(VUE); if (!v) return;
    let reste = 0;
    if (pose) {
      const k = [...v.children].find(e => e.classList.contains("k")), p = v.querySelector(".pap");
      const bon = k && p && cible.closest('.vue[data-p="ag"]') && !cible.closest("button") && y >= k.getBoundingClientRect().top;
      const la = bon ? new DOMMatrix(getComputedStyle(p).transform).m41 : 0, but = pose();
      if (!bon) return;
      reste = la - but; v = E.querySelector(VUE); if (!v) return;
    } else {
      const z = cible.closest(".pap,.k,.blanche");
      if (!z || z.parentElement !== v || v.querySelector(".semaine.glisse")) return;
    }
    D = { x0: x, x1: x, t0: performance.now(), y, reste, vue: v, on: false, dx: 0, ech: 1, v: {}, pts: [[x, performance.now()]] };
    if (reste) { demarre(); bouge(reste); }
    /* la journée touchée vient d'être redessinée : ses touchers n'arrivent plus à la page, on les écoute sur elle */
    if (!cible.isConnected) {
      cible.addEventListener("touchmove", e => suit(e.touches[0].clientX, e.touches[0].clientY, e), { passive: false });
      cible.addEventListener("touchend", () => lache(false), { once: true });
      cible.addEventListener("touchcancel", () => lache(true), { once: true });
    }
  };
  const suit = (x, y, e) => {
    if (!D) return;
    const cote = Math.abs(x - D.x0), haut = Math.abs(y - D.y);
    if (!D.on) {
      if (E.querySelector(".su-tient") || !D.vue.querySelector(".pap")) { D = null; return; }   /* elle déplace un rendez-vous */
      if (cote < 8 && haut < 8) return;
      if (haut >= cote) { D = null; return; }   /* elle fait défiler les heures */
      if (!D.vue.isConnected || !D.vue.firstChild) { D = null; return; }
      demarre();
    }
    if (e.cancelable) e.preventDefault();
    D.pts.push([x, e.timeStamp || performance.now()]); if (D.pts.length > 6) D.pts.shift();
    D.x1 = x; bouge(D.reste + (x - D.x0) / D.ech);
  };
  const lache = annule => {
    if (!D) return;
    const g = D; D = null; if (!g.on) return;
    avale = Date.now();
    const t = performance.now(), pts = g.pts.filter(p => t - p[1] < 110), a = pts[0], b = pts[pts.length - 1];
    const vit = a && b && b[1] > a[1] ? (b[0] - a[0]) / g.ech / (b[1] - a[1]) : 0, loin = Math.abs(g.dx);
    /* rattrapée en route + nouveau coup de pouce = un jour de plus, même si elle n'était pas encore arrivée */
    const elan = !annule && g.reste && Math.abs(g.x1 - g.x0) > 40 && Math.abs(vit) > .4, d = (elan ? vit : g.dx) < 0 ? 1 : -1;
    if (elan && !g.v[d]) { g.v[d] = voisine(g.vue, d); deplace(g.v[d].el, g.dx + d * g.pas); g.v[d].el.offsetWidth; }
    if (elan) [1, -1].forEach(s => { if (g.v[s]) g.v[s].el.style.visibility = ""; });
    const va = !annule && !!g.v[d] && (elan || (loin > g.pas * .3 ? vit * d < .3 : loin > 18 && (-vit * d > .4 || (vit * d <= 0 && t - g.t0 < 250))));   /* même coup rapide que la semaine */
    const but = va ? -d * g.pas : 0, ms = calme.matches ? 1 : Math.max(150, Math.min(320, Math.abs(but - g.dx) / Math.max(Math.abs(vit), .9) * 2.4));
    const trans = `transform ${ms}ms cubic-bezier(.22,.8,.28,1)`;
    g.corps.forEach(x => deplace(x, but, trans));
    [1, -1].forEach(s => { if (g.v[s]) deplace(g.v[s].el, but + s * g.pas, trans); });
    let minuteur;
    pose = sansDessin => {
      clearTimeout(minuteur); pose = null; range();
      if (!va) {
        g.corps.forEach(x => { x.style.transition = ""; x.style.transform = ""; });
        const p = g.vue.querySelector(".pap"); if (p) S.papY = p.scrollTop;
        if (aRefaire && !sansDessin) rendu();
        return but;
      }
      const n = g.v[d], autre = +n.lundi !== +S.lundi;
      /* dernière semaine vraiment lue : on y revient s'il n'y a pas de réseau */
      if (autre && !partiel) sur = { jour: S.jour, lundi: S.lundi, rdv: S.rdv };
      S.jour = n.jour; S.lundi = n.lundi;
      if (autre) { S.rdv = n.rdv; partiel = true; }
      if (!sansDessin) {
        rendu();
        if (autre) E.querySelectorAll(`${VUE} .nav-sem,${VUE} .semaine`).forEach(x => x.classList.add(d > 0 ? "sa-d" : "sa-g"));
      }
      if (autre) recharge();
      return but;
    };
    minuteur = setTimeout(() => pose && pose(), ms);
  };
  const recharge = async () => {
    const moi = ++demande, lundi = +S.lundi;
    try { await chargeSemaine(); }
    catch (e) {
      if (moi !== demande || +S.lundi !== lundi || !sur) return;
      if (D) { D = null; range(); }
      if (pose) pose(true);
      range(); Object.assign(S, sur); partiel = false; rendu(); dit("Pas de réseau : réessaie dans un instant"); return;
    }
    if (moi !== demande) return;
    partiel = false;
    if (+S.lundi === lundi) rendu();
  };

  document.addEventListener("touchstart", e => { if (e.touches.length === 1) debut(e.touches[0].clientX, e.touches[0].clientY, e.target); else lache(true); }, { capture: true, passive: true });
  document.addEventListener("touchmove", e => suit(e.touches[0].clientX, e.touches[0].clientY, e), { capture: true, passive: false });
  document.addEventListener("touchend", () => lache(false), true);
  document.addEventListener("touchcancel", () => lache(true), true);
  document.addEventListener("pointerdown", e => { if (e.pointerType === "mouse" && !e.button) debut(e.clientX, e.clientY, e.target); }, true);
  document.addEventListener("pointermove", e => { if (e.pointerType === "mouse" && e.buttons) suit(e.clientX, e.clientY, e); }, { capture: true, passive: false });
  document.addEventListener("pointerup", e => { if (e.pointerType === "mouse") lache(false); }, true);
  /* sur window : avant « toucher une heure = nouveau rendez-vous » */
  window.addEventListener("click", e => {
    const t = e.target; if (!t.closest || !t.closest('.vue[data-p="ag"]')) return;
    if (Date.now() - avale < 400) { e.stopPropagation(); e.preventDefault(); return; }
    /* semaine pas encore relue : une fiche incomplète (sans acompte) ferait encaisser trop */
    if (partiel && t.closest("[data-rdv]") && +S.lundi !== +(sur && sur.lundi)) { e.stopPropagation(); e.preventDefault(); dit("Un instant, la semaine arrive…"); }
  }, true);

  const st = document.createElement("style");
  st.textContent = `#E .vue[data-p="ag"]>.pap,#E .vue[data-p="ag"]>.k,#E .vue[data-p="ag"]>.blanche{touch-action:pan-y;-webkit-user-select:none;user-select:none}
#E .vue.jg-voisine{background:none!important;pointer-events:none;animation:none!important;z-index:1}
#E .jg-voisine>*{visibility:hidden}
#E .jg-voisine>.k,#E .jg-voisine>.k~*{visibility:inherit;animation:none!important}`;
  document.head.appendChild(st);
})();
