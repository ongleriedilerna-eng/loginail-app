/* ===== 22/11 (Marie : « il te reste quoi comme dispo, là ? », puis « A, la liste », D106) : le rond « Mes dispos » =====
   Le rond calendrier de l'agenda devient calendrier + coche. Maquette : maquettes/dispos-rond-2211/a.html.
   RÈGLE : jamais une heure que le site refuserait. Le calcul suit loginail-creer/resa-simu.js (creneaux) et reserver() :
   pas de 30 min depuis l'ouverture, dans ses horaires, hors pause, 1 h de marge aujourd'hui, aucun chevauchement, 92 jours au plus.
   Si l'un des deux change, changer LIBRES ici. En plus, comme « Partager mes dispos » : deux heures proposées ne se chevauchent pas.
   On ne lit que début, fin et état des rendez-vous : jamais un prénom. */
(function () {
  const PAS = 30, MARGE = 60, HORIZON = 84, TRANCHE = 28, CLE = "loginail-dispos-presta";
  const MOMENTS = [["Tout", () => true], ["Matin", t => t < 720], ["Après-midi", t => t >= 720]];
  let D = null;   /* ce que montre la fenêtre */

  /* ---------- 1 · les heures libres ---------- */
  const enMin = t => { const [h, m] = String(t).split(":").map(Number); return h * 60 + (m || 0); };
  const horaires = () => ((S.site && S.site.donnees) || brouillon() || {}).horaires || [];
  function LIBRES(jour, dur, occ, hor, now) {
    const h = hor[(jour.getDay() + 6) % 7];
    if (!h || !h.d || !h.f) return [];
    const fin = enMin(h.f), pd = h.pd && h.pf ? enMin(h.pd) : null, pf = pd != null ? enMin(h.pf) : null;
    const deja = memeJour(jour, now) ? now.getHours() * 60 + now.getMinutes() + MARGE : -1, out = [];
    let apres = -1;
    for (let t = enMin(h.d); t + dur <= fin; t += PAS) {
      if (pd != null && t < pf && t + dur > pd) continue;
      if (t < deja || t < apres) continue;
      const a = new Date(jour); a.setHours(0, t, 0, 0);
      const b = +a + dur * 60000;
      if (occ.some(z => +a < z[1] && b > z[0])) continue;
      out.push(t); apres = t + dur;
    }
    return out;
  }
  function calcule() {
    const now = new Date(), auj = new Date(now), p = D.P[D.p], dur = (p && p.duree) || 60, hor = horaires();
    auj.setHours(0, 0, 0, 0);
    D.L = [];
    for (let i = 0; i < HORIZON; i++) { const d = plusJours(auj, i); D.L.push({ d, i, t: LIBRES(d, dur, D.occ, hor, now) }); }
  }
  const garde = t => MOMENTS[D.moment][1](t);
  const cle = (d, t) => +d + ":" + t;
  /* les 3 premiers jours qui ont de la place : une heure chacun */
  function premieres() {
    D.sel = new Map(); D.vus = 7;
    for (const j of D.L) {
      const t = j.t.find(garde);
      if (t === undefined) continue;
      D.sel.set(cle(j.d, t), { d: j.d, t });
      D.vus = Math.min(HORIZON, Math.max(D.vus, Math.ceil((j.i + 1) / 7) * 7));   /* une heure cochée est toujours à l'écran */
      if (D.sel.size === 3) break;
    }
  }
  /* ce qui est coché et qui n'est plus libre s'en va */
  function verifie() {
    const bon = new Set(); D.L.forEach(j => j.t.forEach(t => bon.add(cle(j.d, t))));
    let change = false;
    D.sel.forEach((v, k) => { if (!bon.has(k)) { D.sel.delete(k); change = true; } });
    return change;
  }
  /* par tranches : au-delà de 1 000 lignes, le serveur ne rend pas tout et une heure prise semblerait libre */
  async function lit() {
    const de = new Date(); de.setHours(0, 0, 0, 0);
    const R = await Promise.all(Array.from({ length: HORIZON / TRANCHE }, (_, i) => sb.from("rendez_vous").select("debut,fin,statut")
      .lt("debut", plusJours(de, (i + 1) * TRANCHE).toISOString()).gt("fin", plusJours(de, i * TRANCHE).toISOString())));
    if (R.some(r => r.error || !r.data || r.data.length >= 1000)) throw new Error("agenda illisible");
    return R.flatMap(r => r.data).filter(r => r.statut !== "annule").map(r => [+new Date(r.debut), +new Date(r.fin)]);
  }
  async function charge() {
    const d = D, n = ++d.lecture;
    d.etat = "charge"; dessine();
    try {
      const occ = await lit();
      if (D !== d || n !== d.lecture) return;
      d.occ = occ; d.etat = "ok"; calcule();
      if (!d.pret) { d.pret = true; premieres(); }
      else { verifie(); if (!d.sel.size) premieres(); }
    } catch (e) {
      if (D !== d || n !== d.lecture) return;
      console.error(e); d.etat = "erreur";   /* sans agenda à jour, on ne propose rien */
    }
    dessine();
  }

  /* ---------- 2 · les prestations : celles qu'elle fait le plus d'abord ---------- */
  function prestations() {
    const N = {}, depuis = Date.now() - 120 * 864e5;
    (S.tous || []).forEach(r => { if (r.cliente_id && r.titre && r.statut !== "annule" && +new Date(r.debut) > depuis) N[r.titre] = (N[r.titre] || 0) + 1; });
    return prestasDispo().map((p, i) => ({ i, nom: String(p.nom), duree: +p.duree || 60, n: N[p.nom] || 0 })).sort((a, b) => b.n - a.n || a.i - b.i);
  }

  /* ---------- 3 · le message (au « vous », D67) ---------- */
  const hMsg = t => Math.floor(t / 60) + "h" + (t % 60 ? String(t % 60).padStart(2, "0") : "");
  const hPil = t => String(Math.floor(t / 60)).padStart(2, "0") + ":" + String(t % 60).padStart(2, "0");
  const nomJour = d => `${JOURS[(d.getDay() + 6) % 7].toLowerCase()} ${d.getDate() === 1 ? "1er" : d.getDate()} ${MOIS[d.getMonth()]}`;
  function message() {
    const l = [...D.sel.values()].sort((a, b) => a.d - b.d || a.t - b.t), G = new Map(), p = D.P[D.p];
    if (!l.length) return "";
    l.forEach(({ d, t }) => { const k = nomJour(d); G.set(k, (G.get(k) || []).concat(hMsg(t))); });
    const lignes = [...G].map(([j, h]) => `• ${j} à ${h.length > 1 ? h.slice(0, -1).join(", ") + " ou " + h[h.length - 1] : h[0]}`);
    return `Bonjour ! ${p ? `Pour « ${p.nom} », il` : "Il"} me reste :\n${lignes.join("\n")}\n${l.length > 1 ? "Qu’est-ce qui vous arrange ?" : "Est-ce que ça vous va ?"}`;
  }

  /* ---------- 4 · la fenêtre ---------- */
  const z = q => E.querySelector(".fc .md " + q);
  const ouverte = () => !!(D && E.classList.contains("fe") && E.querySelector(".fc .md"));
  function liste() {
    if (D.etat === "charge" && !D.pret) return '<p class="md-vide" role="status">Je regarde ton agenda…</p>';
    if (D.etat === "erreur") return '<div class="md-vide" role="alert">Je n’arrive pas à lire ton agenda. Vérifie ta connexion.<button class="md-lien" data-md="encore">Réessayer</button></div>';
    const date = '<button class="md-lien" data-md="date">Aller à une date de l’agenda</button>';
    if (!horaires().some(h => h && h.d && h.f)) return '<p class="md-vide">Ajoute tes horaires dans Mon site : je te dirai ce qu’il te reste.</p>' + date;
    let h = "";
    D.L.slice(0, D.vus).forEach(j => {
      const T = j.t.filter(garde); if (!T.length) return;
      const nom = nomJour(j.d);
      h += `<div class="md-jour"><div class="md-nom">${nom[0].toUpperCase() + nom.slice(1)}<span>${j.i === 0 ? "aujourd’hui" : j.i === 1 ? "demain" : ""}</span></div><div class="md-heures">${T.map(t => {
        const on = D.sel.has(cle(j.d, t));
        return `<button data-md="heure" data-j="${j.i}" data-t="${t}" class="${on ? "on" : ""}" aria-pressed="${on}" aria-label="${nom} à ${hMsg(t)}">${hPil(t)}</button>`; }).join("")}</div></div>`;
    });
    if (!h) h = `<p class="md-vide">Rien de libre ${D.vus < HORIZON ? "sur ces jours-là" : "dans les 3 mois qui viennent"}.</p>`;
    return h + (D.vus < HORIZON ? '<button class="md-lien" data-md="plus">Voir la semaine d’après</button>' : "") + date;
  }
  function dessine() {
    if (!ouverte()) return;
    E.querySelectorAll(".fc .md [data-md=presta]").forEach(b => { const on = +b.dataset.i === D.p; b.classList.toggle("on", on); b.setAttribute("aria-pressed", on); });
    E.querySelectorAll(".fc .md [data-md=moment]").forEach(b => { const on = +b.dataset.i === D.moment; b.classList.toggle("on", on); b.setAttribute("aria-pressed", on); });
    const li = z(".md-liste"), y = li.scrollTop;
    li.innerHTML = liste(); li.scrollTop = y;
    const ok = D.etat === "ok", n = ok ? D.sel.size : 0;
    z(".md-msg").textContent = n ? message() : ok ? "Touche les heures que tu veux lui proposer." : "";
    z("[data-md=copie]").disabled = !n;
    z("[data-md=noter]").hidden = n !== 1;
  }
  function ouvrir() {
    const P = prestations();
    let garde0 = null; try { garde0 = localStorage.getItem(CLE); } catch (e) {}
    D = { P, p: Math.max(0, P.findIndex(p => p.nom === garde0)), moment: 0, sel: new Map(), L: [], occ: [], vus: 7, etat: "charge", pret: false, lecture: 0 };
    ouvre(`<div class="md"><h3>Mes dispos</h3>
      ${P.length ? `<div class="md-q">Elle vient pour quoi ?</div><div class="md-prest">${P.map((p, i) => `<button data-md="presta" data-i="${i}"><b>${esc(p.nom)}</b><span>${duree(p.duree)}</span></button>`).join("")}</div>` : '<div class="md-q">Des trous d’une heure (ajoute tes prestations pour être précise)</div>'}
      <div class="md-filtres">${MOMENTS.map((m, i) => `<button data-md="moment" data-i="${i}">${m[0]}</button>`).join("")}</div>
      <div class="md-liste"></div>
      <div class="md-bas"><div class="md-msg" aria-live="polite"></div><div class="md-actions"><button class="md-clair" data-md="noter" hidden>Noter le RDV</button><button data-md="copie" disabled>Copier le message</button></div></div></div>`);
    charge();
    /* la prestation retenue est visible (sans scrollIntoView : il décale l'écran sur iPhone) */
    const r = z(".md-prest"), b = r && r.children[D.p];
    if (b) r.scrollLeft = Math.max(0, b.offsetLeft - r.offsetLeft - 24);
  }

  function copier() {
    calcule();
    if (verifie()) { dessine(); return dit("Une heure n’est plus libre : relis le message"); }
    const txt = message(); if (!txt) return;
    const fait = () => dit("Message copié ✓ Colle-le dans Instagram ou par SMS");
    const secours = () => {
      const m = z(".md-msg"); if (!m) return;
      const r = document.createRange(); r.selectNodeContents(m);
      const s = getSelection(); s.removeAllRanges(); s.addRange(r);
      let ok = false; try { ok = document.execCommand("copy"); } catch (e) {}
      if (ok) { s.removeAllRanges(); fait(); } else dit("Reste appuyée sur le message pour le copier");
    };
    /* tout de suite : sur iPhone, après une attente, le toucher ne donne plus le droit de copier */
    try { navigator.clipboard.writeText(txt).then(fait, secours); } catch (e) { secours(); }
  }

  let pasDeux = 0;
  async function noter() {
    const x = [...D.sel.values()][0]; if (!x || D.noteEnCours) return;
    const d = D, p = d.P[d.p], avant = { jour: S.jour, lundi: S.lundi };
    d.noteEnCours = true;
    S.jour = new Date(x.d); S.lundi = lundiDe(x.d); S.papY = null;
    try { await chargeSemaine(); }   /* « Ce créneau est déjà pris » se vérifie dans la semaine de ce jour-là */
    catch (e) { console.error(e); S.jour = avant.jour; S.lundi = avant.lundi; d.noteEnCours = false; return dit("Pas de réseau : réessaie dans un instant"); }
    d.noteEnCours = false; rendu();
    if (D !== d || !ouverte()) return;
    pasDeux = Date.now();
    feuilleNouveau(x.t);
    if (p) setTimeout(() => { const b = E.querySelector(`.fc .chips [data-np="${p.i}"], .fc .pr-z [data-np="${p.i}"]`); if (b && !b.classList.contains("on")) b.click(); }, 0);
  }

  addEventListener("click", e => {
    if (!e.target.closest) return;
    /* un double toucher sur « Noter le RDV » tombait sur « Enregistrer » de la fenêtre suivante : créneau bloqué sans cliente */
    if (Date.now() - pasDeux < 700 && e.isTrusted && e.target.closest(".feuille")) { e.preventDefault(); e.stopPropagation(); return; }
    const b = e.target.closest("[data-md]"); if (!b) return;
    const k = b.dataset.md;
    if (k === "ouvre" && E.querySelector(".vue.on .calm,.av-menu")) return;   /* toucher ailleurs ferme d'abord le calendrier ou le menu */
    e.preventDefault(); e.stopPropagation();
    if (k === "ouvre") return ouvrir();
    if (!ouverte()) return;
    if (k === "encore") return charge();
    if (k === "copie") return copier();
    if (k === "noter") return noter();
    if (k === "date") {
      ferme(); S.moisOuvert = true; S.moisVu = new Date(S.jour.getFullYear(), S.jour.getMonth(), 1);
      return rendu();
    }
    if (k === "plus") D.vus = Math.min(HORIZON, D.vus + 7);
    if (k === "presta" || k === "moment") {
      if (k === "presta") { D.p = +b.dataset.i; try { localStorage.setItem(CLE, D.P[D.p].nom); } catch (x) {} }
      else D.moment = +b.dataset.i;
      if (D.etat === "ok") { calcule(); premieres(); z(".md-liste").scrollTop = 0; }
    }
    if (k === "heure") {
      const d = D.L[+b.dataset.j].d, t = +b.dataset.t, c = cle(d, t);
      if (D.sel.has(c)) D.sel.delete(c); else D.sel.set(c, { d, t });
    }
    dessine();
  }, true);
  /* elle revient d'Instagram : une cliente a pu réserver entre-temps */
  document.addEventListener("visibilitychange", () => { if (!document.hidden && ouverte()) charge(); });

  /* ---------- 5 · le rond, à la place du calendrier ---------- */
  const ROND = '<button class="v-rondb md-rond" data-md="ouvre" aria-label="Mes dispos"><svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="4" y="5.5" width="16" height="14" rx="3"/><path d="M4 10h16M8.5 3.5v4M15.5 3.5v4"/><path class="md-coche" d="M9 14.7l2.2 2.1 4-4"/></svg></button>';
  const ag0 = VUES.ag;
  VUES.ag = () => ag0().replace(/<button[^>]*\bdata-a="mois"[^>]*>[\s\S]*?<\/button>/, ROND);

  /* la fenêtre garde sa forme jusqu'à ce qu'une autre prenne sa place (sinon elle saute en se fermant) */
  new MutationObserver(() => {
    const f = E.querySelector(".feuille"); if (!f) return;
    const on = !!f.querySelector(".fc>.md");
    if (f.classList.contains("md-f") !== on) f.classList.toggle("md-f", on);
  }).observe(E, { childList: true, subtree: true });

  const st = document.createElement("style");
  st.textContent = `#E .md-rond .md-coche{stroke:var(--v-acc);stroke-width:2}
#E .feuille.md-f{height:88%;max-height:88%;overflow:hidden;padding:12px 0 0!important;display:flex;flex-direction:column}
#E .feuille.md-f>.poig{flex:none}
#E .feuille.md-f>.fc{flex:1;min-height:0;display:flex;flex-direction:column}
#E .md{flex:1;min-height:0;display:flex;flex-direction:column}
#E .md>:not(.md-liste){flex:none}
#E .md h3{margin:4px 58px 0 24px;font:400 30px/1.1 'Italiana','Cormorant Garamond',Georgia,serif;text-align:left}
#E .md-q{margin:5px 58px 9px 24px;font-size:13px;line-height:1.25;color:var(--gris)}
#E .md-prest{position:relative;display:flex;gap:6px;overflow-x:auto;overscroll-behavior-x:contain;scrollbar-width:none;padding:0 24px;touch-action:pan-x}
#E .md-prest::-webkit-scrollbar,#E .md-liste::-webkit-scrollbar{display:none}
#E .md-prest button{flex:none;max-width:190px;height:50px;padding:0 15px;border:1px solid var(--v-trait);border-radius:999px;background:#fff;color:inherit;font:inherit;text-align:center;cursor:pointer}
#E .md-prest b{display:block;overflow:hidden;white-space:nowrap;text-overflow:ellipsis;font-size:13.5px;font-weight:400;line-height:1.2}
#E .md-prest span{display:block;font-size:11.5px;opacity:.65}
#E .md-prest button.on{border-color:var(--v-fonce);background:var(--v-fonce);color:#fff}
#E .md-filtres{display:flex;gap:4px;margin:8px 24px 0;padding:3px;border-radius:999px;background:var(--v-rose)}
#E .md-filtres button{flex:1;min-width:0;height:36px;padding:0;border:0;border-radius:999px;background:none;color:inherit;font:inherit;font-size:13px;white-space:nowrap;cursor:pointer}
#E .md-filtres button.on{background:#fff;color:var(--v-fonce);font-weight:500}
#E .md-liste{flex:1;min-height:0;overflow-y:auto;overscroll-behavior:contain;-webkit-overflow-scrolling:touch;scrollbar-width:none;padding:4px 24px 12px;touch-action:pan-y}
#E .md-jour{margin-top:8px;padding:9px 12px;border-radius:18px;background:#fff}
#E .md-nom{display:flex;justify-content:space-between;align-items:baseline;gap:8px;margin-bottom:6px;font-size:15px;font-weight:500}
#E .md-nom span{font-size:12.5px;font-weight:400;color:var(--gris)}
#E .md-heures{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:6px}
#E .md-heures button{height:40px;padding:0;border:0;border-radius:999px;background:var(--v-rose);color:inherit;font:inherit;font-size:14px;cursor:pointer}
#E .md-heures button.on{background:var(--v-acc);color:#fff}
#E .md-vide{margin:0;padding:24px 8px 8px;color:var(--gris);font-size:14px;line-height:1.45;text-align:center}
#E .md-lien{display:block;width:100%;min-height:44px;margin-top:6px;padding:0;border:0;background:none;color:var(--gris);font:inherit;font-size:13.5px;text-decoration:underline;text-underline-offset:3px;cursor:pointer}
#E .md-bas{padding:9px 24px calc(env(safe-area-inset-bottom,0px) + 16px);border-top:1px solid var(--v-trait)}
#E .md-msg{max-height:96px;overflow-y:auto;margin-bottom:9px;padding:9px 12px;border-radius:14px;background:#fff;font-size:12.5px;line-height:1.3;white-space:pre-line;overflow-wrap:anywhere;-webkit-user-select:text;user-select:text;-webkit-touch-callout:default}
#E .md-msg:empty{display:none}
#E .md-actions{display:flex;gap:8px}
#E .md-actions button{flex:1 1 auto;min-width:0;height:48px;padding:0 8px;border:0;border-radius:999px;background:var(--v-fonce);color:#fff;font:inherit;font-size:14.5px;white-space:nowrap;cursor:pointer}
#E .md-actions .md-clair{background:var(--v-rose);color:var(--v-fonce)}
#E .md-actions button:disabled{opacity:.4;cursor:default}
#E .md-actions [hidden]{display:none}
#E .md :is(.md-prest,.md-filtres,.md-heures,.md-actions) button{transition:background .15s,color .15s,transform .12s}
#E .md :is(.md-prest,.md-filtres,.md-heures,.md-actions) button:active{transform:scale(.96)}
@media (max-height:700px){html.plein #E .feuille.md-f{height:calc(100% - 20px);max-height:calc(100% - env(safe-area-inset-top,0px) - 12px)}html.plein #E .md h3{font-size:26px}html.plein #E .md-msg{max-height:56px}html.plein #E .md-filtres button{height:32px}html.plein #E .md-prest button{height:46px}}
@media (max-width:350px){#E .md-heures{grid-template-columns:repeat(3,minmax(0,1fr))}#E .md-actions button{font-size:13.5px}}
@media (prefers-reduced-motion:reduce){#E .md button{transition:none!important}}`;
  document.head.appendChild(st);
})();
