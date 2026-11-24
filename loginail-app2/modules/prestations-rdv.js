/* ===== 23/11 (Marie, D109-D110) : les prestations du rendez-vous, en deux familles =====
   Maquette qui fait foi : maquettes/idee-prestations-rdv-2311.html (« Nouveau rendez-vous en grand » et « Fin du rendez-vous »).
   1 · Nouveau rendez-vous : « Comme la dernière fois », « Quelle prestation ? » (une pose et/ou une dépose, une seule de chaque),
       puis « Et avec ça ? » dès qu'une pose est choisie (4 petits plus les plus pris, « Voir les X autres » + recherche),
       « par ongle » = − n + dans la case ; le total en bas saute quand il change.
   2 · Fin du rendez-vous : « Elle a pris autre chose ? » au-dessus des boutons ; le détail (prévu, petits plus, acompte, reste)
       et [C'est fini] [Encaisser · reste] collés en bas ; le ticket détaille chaque petit plus (note détaillée obligatoire).
   La famille vient de LOGI_PRESTA.estPlus (loginail-creer/prestations-detail.js), la même règle que le site des clientes.
   Titre d'un rendez-vous : « Pose américaine + Chrome + Strass et bijoux ×3 » (LOGI_PRESTA.morceaux le relit). */
(function () {
  const LP = window.LOGI_PRESTA; if (!LP || !LP.estPlus) return;   /* K = la caisse (app2.js) */
  const P = () => prestasDispo();
  const st = document.createElement("style");
  st.textContent = `
#E .pr-z{text-align:left}
#E .pr-lab{display:flex;justify-content:space-between;align-items:baseline;gap:10px;margin:14px 2px 8px;font-size:12.5px;color:#776D64;text-transform:none;letter-spacing:0}
#E .pr-lab b{font-weight:500;font-size:15px;color:var(--noir,#1E1C1B)}
#E .pr-cases{display:grid;grid-template-columns:1fr 1fr;gap:8px}
#E .pr-ca{position:relative;display:flex;flex-direction:column;justify-content:space-between;gap:6px;min-width:0;min-height:78px;box-sizing:border-box;margin:0;padding:12px;border:1px solid rgba(30,28,27,.12);border-radius:18px;background:#fff;color:inherit;font:inherit;text-align:left;cursor:pointer;transition:background .18s,color .18s,border-color .18s,transform .12s;-webkit-user-select:none;user-select:none}
#E .pr-ca.sans{min-height:66px;justify-content:center}
#E .pr-ca:active{transform:scale(.96)}
#E .pr-ca .em{font-size:20px;line-height:1}
#E .pr-ca b{display:block;font-weight:400;font-size:14.5px;line-height:1.2;overflow-wrap:anywhere}
#E .pr-ca small{display:block;margin-top:2px;font-size:12px;color:#776D64}
#E .pr-ca.on{background:var(--v-fonce,#1E1C1B);border-color:var(--v-fonce,#1E1C1B);color:#fff}
#E .pr-ca.on small{color:rgba(255,255,255,.7)}
#E .pr-cpt{display:none;position:absolute;right:7px;top:7px;align-items:center;gap:2px}
#E .pr-ca.on .pr-cpt{display:flex}
#E .pr-cpt em{min-width:16px;font-style:normal;font-size:14px;text-align:center}
#E .pr-cpt u{width:30px;height:30px;border-radius:50%;background:rgba(255,255,255,.2);display:grid;place-items:center;text-decoration:none;font-size:17px}
#E .pr-cases .pr-ca.autre{display:none}
#E .pr-cases.tout .pr-ca.autre{display:flex;animation:pr-ap .25s ease both}
#E .pr-cases .pr-ca.cache-r{display:none!important}
@keyframes pr-ap{from{opacity:0;transform:scale(.92)}}
#E .pr-voir{display:block;min-height:44px;margin:4px auto 0;padding:0 12px;border:0;background:none;color:var(--noir,#1E1C1B);font:inherit;font-size:13.5px;text-decoration:underline;text-underline-offset:3px;cursor:pointer}
#E .pr-cases.tout+.pr-voir{display:none}
#E .pr-cherche{display:none;box-sizing:border-box;width:100%;height:42px;margin:2px 0 10px;padding:0 12px;border:1px solid rgba(30,28,27,.12);border-radius:12px;background:#fff;color:inherit;font:inherit;font-size:16px;outline:0}
#E .pr-cherche:focus{border-color:var(--v-fonce,#1E1C1B)}
#E .pr-ouvert .pr-cherche{display:block}
#E .pr-note{margin:10px 2px 0;font-size:12px;line-height:1.4;color:#776D64}
#E .pr-ap{display:grid;grid-template-rows:0fr;opacity:0;transition:grid-template-rows .4s cubic-bezier(.2,.85,.25,1),opacity .3s}
#E .pr-ap.vu{grid-template-rows:1fr;opacity:1}
#E .pr-ap>div{overflow:hidden;min-height:0}
#E .pr-ap:not(.vu) .pr-ca{visibility:hidden}
#E .pr-der{display:flex;align-items:center;gap:12px;width:100%;margin:0 0 4px;padding:11px 14px;border:0;border-radius:18px;background:var(--v-rose,#F5E6E4);color:inherit;font:inherit;text-align:left;cursor:pointer;transition:transform .12s,box-shadow .2s;animation:pr-ap .25s ease both}
#E .pr-der[hidden]{display:none}
#E .pr-der:active{transform:scale(.98)}
#E .pr-der i{flex:none;width:34px;height:34px;border-radius:50%;background:#fff;display:grid;place-items:center;font-style:normal;font-size:16px}
#E .pr-der b{display:block;font-weight:500;font-size:14.5px}
#E .pr-der small{display:block;font-size:12.5px;color:#776D64;overflow-wrap:anywhere}
#E .pr-der.fait{box-shadow:0 0 0 2px var(--v-fonce,#1E1C1B)}
/* le total et le bouton restent collés en bas */
#E .pr-bas{position:sticky;bottom:calc(-1 * (env(safe-area-inset-bottom,0px) + 22px));z-index:3;margin:14px -24px 0;padding:12px 24px calc(env(safe-area-inset-bottom,0px) + 22px);background:var(--v-c,#FBF8F5);border-top:1px solid rgba(30,28,27,.08)}
#E .pr-bas .btn{margin:0!important;width:100%}
#E .pr-tot{display:flex;justify-content:space-between;align-items:baseline;gap:10px;min-height:20px;margin-bottom:8px;font-size:13.5px;color:#776D64}
#E .pr-tot:empty{display:none}
#E .pr-tot span{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
#E .pr-tot b{flex:none;display:inline-block;font-weight:500;font-size:16px;color:var(--noir,#1E1C1B);transition:transform .2s}
#E .pr-tot b.saute,#E .fr-bas .btn.saute{transform:scale(1.15)}
#E .feuille:has(.pr-bas){padding-bottom:0!important}
/* fin du rendez-vous */
#E .fr-box{margin-top:14px;padding:12px;border-radius:20px;background:#fff;text-align:left}
#E .fr-box .pr-lab{margin-top:2px}
#E .fr-box .pr-ca{background:var(--v-c,#FBF8F5)}
#E .fr-box .pr-ca.on{background:var(--v-fonce,#1E1C1B)}
#E .fr-bas{position:sticky;bottom:calc(-1 * (env(safe-area-inset-bottom,0px) + 22px));z-index:3;margin:14px -24px 0;padding:10px 24px calc(env(safe-area-inset-bottom,0px) + 22px);background:var(--v-c,#FBF8F5);box-shadow:0 -10px 20px -14px rgba(30,28,27,.25)}
#E .feuille:has(.fr-bas){padding-bottom:0!important}
#E .fr-l{display:flex;justify-content:space-between;gap:10px;padding:3px 4px;font-size:13.5px;color:#776D64}
#E .fr-l span{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
#E .fr-l b{flex:none;font-weight:500}
#E .fr-l.plus{color:var(--noir,#1E1C1B)}
#E .fr-l.tot{margin-top:4px;padding-top:7px;border-top:1px solid rgba(30,28,27,.12);font-weight:500;color:var(--noir,#1E1C1B)}
#E .fr-btns{display:flex;gap:8px;margin-top:8px}
#E .fr-btns .btn{flex:1 1 0;min-width:0;width:auto!important;margin:0!important;white-space:nowrap;transition:transform .2s}
#E .fr-btns .btn.clair{flex:0 0 38%}
#E .fr-btns .btn:only-child{flex:1 1 auto}
@media (prefers-reduced-motion:reduce){#E .pr-ap,#E .pr-cases.tout .pr-ca.autre,#E .pr-der,#E .pr-tot b,#E .fr-btns .btn{transition:none;animation:none}}`;
  document.head.appendChild(st);

  /* ---------- les morceaux communs ---------- */
  const montant = n => String(Math.round(n * 100) / 100).replace(".", ",") + " €";
  const prixPlus = (p, n, on) => { const t = LP.type(p); if (t === "devis") return "sur devis";
    return (t === "des" ? "dès " : "+") + montant(+p.prix * (n || 1)) + (LP.parOngle(p) && !on ? " / ongle" : ""); };
  const dureeDe = (p, n) => (+p.duree || (LP.estPlus(p) ? 10 : 60)) * (LP.parOngle(p) ? Math.ceil((n || 1) / 2) : 1);
  const plat = LP.plat;
  /* combien de fois chaque prestation a été prise (pour les 4 petits plus « les plus pris ») */
  function usages() {
    const l = P(), c = l.map(() => 0), idx = new Map(l.map((p, i) => [p.nom, i]));
    const vus = new Set(); (S.tous || []).concat(S.rdv || []).forEach(r => { if (vus.has(r.id) || r.statut === "annule") return; vus.add(r.id);
      LP.morceaux(r.titre).forEach(m => { const i = idx.get(m.nom); if (i != null) c[i]++; }); });
    return c;
  }
  const casePlus = (p, i, autre) => `<button type="button" class="pr-ca${autre ? " autre" : ""}" data-pr="${i}"><span class="em" aria-hidden="true">${esc(LP.emo(p))}</span>${LP.parOngle(p) ? `<span class="pr-cpt"><u data-prm="-1" aria-label="Un ongle de moins">−</u><em>1</em><u data-prm="1" aria-label="Un ongle de plus">+</u></span>` : ""}<span><b>${esc(p.nom)}</b><small class="px"></small></span></button>`;
  /* les petits plus : les 4 plus pris d'abord, « Voir les X autres » ouvre le reste et une recherche */
  function blocPlus(titre, sous, id) {
    const l = P(), u = usages(), I = l.map((p, i) => i).filter(i => LP.estPlus(l[i])).sort((a, b) => u[b] - u[a] || a - b);
    if (!I.length) return "";
    return `<div class="pr-lab"><b>${titre}</b><span>${sous}</span></div><input class="pr-cherche" type="search" placeholder="Chercher : foil, perles, ombré…" aria-label="Chercher un petit plus" autocomplete="off" enterkeyhint="search">
      <div class="pr-cases" id="${id}">${I.map((i, k) => casePlus(l[i], i, k > 3)).join("")}</div>${I.length > 4 ? `<button type="button" class="pr-voir">Voir les ${I.length - 4} autre${I.length - 4 > 1 ? "s" : ""}</button>` : ""}
      ${I.some(i => LP.parOngle(l[i])) ? `<p class="pr-note">« / ongle » : touche, puis + ou − pour le nombre d’ongles.</p>` : ""}`;
  }
  /* l'état des cases : SEL = { i: nombre } */
  function majCases(z, SEL) {
    const l = P();
    z.querySelectorAll(".pr-ca[data-pr]").forEach(b => { const i = +b.dataset.pr, p = l[i]; if (!p) return; const on = i in SEL;
      b.classList.toggle("on", on); b.setAttribute("aria-pressed", on);
      const em = b.querySelector(".pr-cpt em"); if (em) em.textContent = SEL[i] || 1;
      const px = b.querySelector(".px"); if (!px) return;
      px.textContent = LP.estPlus(p) ? prixPlus(p, SEL[i], on) : [duree(+p.duree || 60), p.prix == null ? "sur devis" : (LP.type(p) === "des" ? "dès " : "") + montant(p.prix)].join(" · "); });
  }
  const saute = b => { if (!b) return; b.classList.remove("saute"); void b.offsetWidth; b.classList.add("saute"); setTimeout(() => b.classList.remove("saute"), 220); };
  /* le geste sur une case de petit plus ; vrai si quelque chose a changé */
  function touchePlus(t, SEL, ordre) {
    const c = t.closest(".pr-ca[data-pr]"); if (!c) return false; const i = +c.dataset.pr, m = t.closest("[data-prm]");
    if (m && i in SEL) { SEL[i] = Math.max(0, SEL[i] + +m.dataset.prm); if (!SEL[i]) { delete SEL[i]; ordre.splice(ordre.indexOf(i), 1); } return true; }
    if (i in SEL) { delete SEL[i]; ordre.splice(ordre.indexOf(i), 1); } else { SEL[i] = 1; ordre.push(i); }
    return true;
  }
  /* « Voir les autres » et la recherche, dans les deux écrans */
  addEventListener("click", e => { const v = e.target.closest && e.target.closest("#E .pr-voir"); if (!v) return; e.stopPropagation();
    const z = v.parentNode; z.querySelector(".pr-cases").classList.add("tout"); z.classList.add("pr-ouvert"); }, true);
  document.addEventListener("input", e => { if (!e.target.classList || !e.target.classList.contains("pr-cherche")) return;
    const q = plat(e.target.value), l = P(); e.target.nextElementSibling.querySelectorAll(".pr-ca[data-pr]").forEach(b => b.classList.toggle("cache-r", !!q && !plat(l[+b.dataset.pr]?.nom).includes(q))); });
  document.addEventListener("keydown", e => { if (e.key === "Enter" && e.target.classList && e.target.classList.contains("pr-cherche")) { e.preventDefault(); e.target.blur(); } });

  /* ===================== 1 · NOUVEAU RENDEZ-VOUS ===================== */
  let NS = null;   /* { base: {i:1}, plus: {i:n}, ordre: [i…], der: [[i,n]…] } */
  const estDep = i => LP.estDepose(P()[i]);
  const choisis = () => { const l = []; for (const i in NS.base) if (!estDep(+i)) l.push([+i, 1]); for (const i in NS.base) if (estDep(+i)) l.push([+i, 1]); NS.ordre.forEach(i => l.push([i, NS.plus[i]])); return l; };
  function totalDe(items) {
    const l = P(); if (!items.length) return null;
    const ps = items.map(([i, n]) => [l[i], n]);
    return { id: (ps.find(([p]) => !LP.estPlus(p)) || ps[0])[0].id, nom: ps.map(([p, n]) => p.nom + (n > 1 ? " ×" + n : "")).join(" + "),
      duree: ps.reduce((s, [p, n]) => s + dureeDe(p, n), 0) || 60,
      prix: ps.every(([p]) => p.prix == null) ? null : ps.reduce((s, [p, n]) => s + (+p.prix || 0) * n, 0) };
  }
  const aPose = () => Object.keys(NS.base).some(i => !estDep(+i)) || !P().some(p => !LP.estPlus(p));
  function majNouveau(fc, auto) {
    const z = fc.querySelector(".pr-z"); if (!z || !NS) return;
    const ap = z.querySelector(".pr-ap"), avant = ap && ap.classList.contains("vu");
    if (!aPose()) { NS.plus = {}; NS.ordre = []; }
    majCases(z, Object.assign({}, NS.base, NS.plus));
    if (ap) ap.classList.toggle("vu", aPose());
    const t = totalDe(choisis()); N.presta = t;
    const tot = fc.querySelector(".pr-tot"), b0 = tot.querySelector("b")?.textContent;
    tot.innerHTML = t ? `<span>${esc(duree(t.duree))} · ${esc(t.nom)}</span><b>${esc(t.prix == null ? "sur devis" : montant(t.prix))}</b>` : "";
    const b = tot.querySelector("b"); if (b && b0 && b0 !== b.textContent) saute(b);
    const de = fc.querySelector(".pr-der"); if (de) de.classList.toggle("fait", !!NS.der && JSON.stringify(NS.der) === JSON.stringify(choisis()));
    if (typeof nFin === "function") nFin();
    /* la pose choisie : on descend un peu pour montrer « Et avec ça ? » */
    /* 24/11 (Marie : « je dois appuyer 2 fois sur Enregistrer ») : sur iPhone, toucher pendant que la feuille défile ne fait qu'arrêter le défilement.
       Si elle touche avant, on ne descend plus ; pendant la descente, « Enregistrer » marche du premier coup (voir plus bas). */
    if (auto && ap && !avant && ap.classList.contains("vu")) { clearTimeout(DEF.t); DEF.t = setTimeout(() => { const f = E.querySelector(".feuille"); if (!f) return; DEF.fin = Date.now() + 700; f.scrollBy({ top: 150, behavior: "smooth" }); }, 250); }
  }
  function poseNouveau() {
    const fc = E.querySelector(".feuille .fc"), chips = fc && fc.querySelector(".chips.n-glisse"); if (!chips) return;
    const l = P(); NS = { base: {}, plus: {}, ordre: [], der: null };
    const lab = chips.previousElementSibling, ok = fc.querySelector('[data-a="nouveau-ok"]');
    if (!l.length) return;
    const B = l.map((p, i) => i).filter(i => !LP.estPlus(l[i])), poses = B.filter(i => !estDep(i)), deps = B.filter(i => estDep(i));
    const z = document.createElement("div"); z.className = "pr-z";
    z.innerHTML = `<button type="button" class="pr-der" hidden><i aria-hidden="true">↺</i><span><b>Comme la dernière fois</b><small></small></span></button>`
      + (B.length ? `<div class="pr-lab"><b>Quelle prestation ?</b><span>${deps.length && poses.length ? "une pose et/ou une dépose" : "touche-la"}</span></div>
      <div class="pr-cases">${poses.concat(deps).map(i => `<button type="button" class="pr-ca sans" data-pr="${i}" data-np="${i}"><span><b>${esc(l[i].nom)}</b><small class="px"></small></span></button>`).join("")}</div>` : "")
      + `<div class="pr-ap${B.length ? "" : " vu"}"><div>${blocPlus("Et avec ça ?", "facultatif", "pr-plus-n").replace('class="pr-lab"', 'class="pr-lab" style="margin-top:20px"')}</div></div>`;
    if (lab && lab.classList.contains("lab2")) lab.remove();
    chips.replaceWith(z);
    if (ok) { const bas = document.createElement("div"); bas.className = "pr-bas"; bas.innerHTML = '<div class="pr-tot" aria-live="polite"></div>'; ok.replaceWith(bas); bas.appendChild(ok); }
    majNouveau(fc); pourCliente();
  }
  /* « Comme la dernière fois » : ce qu'elle a pris la fois d'avant, en un geste */
  let tourD = 0;
  async function pourCliente() {
    const fc = E.querySelector(".feuille .fc"), de = fc && fc.querySelector(".pr-der"), i = E.querySelector("#n-cli"); if (!de || !i) return;
    const q = i.value.trim().toLowerCase(), cli = q && S.clientes.find(x => nomCli(x).toLowerCase() === q), n = ++tourD;
    if (!cli) { NS.der = null; de.hidden = true; return; }
    let l = (S.tous || []).concat(S.rdv || []).filter(r => r.cliente_id === cli.id);
    if (!(S.tous || []).length || (S.tous || []).length >= 1000) { try { const { data } = await sb.from("rendez_vous").select("id,titre,debut,statut,prix").eq("cliente_id", cli.id).lt("debut", new Date().toISOString()).order("debut", { ascending: false }).limit(5); if (data) l = l.concat(data); } catch (e) {} }
    if (n !== tourD || !de.isConnected) return;
    const maint = new Date().toISOString(), r = l.filter(x => x.debut < maint && x.statut !== "annule" && x.statut !== "absente").sort((a, b) => b.debut.localeCompare(a.debut))[0];
    const P0 = P(), idx = new Map(P0.map((p, k) => [p.nom, k])), items = [];
    if (r) LP.morceaux(r.titre).forEach(m => { const k = idx.get(m.nom); if (k != null && !items.some(x => x[0] === k)) items.push([k, m.n]); });
    /* même ordre que choisis() : la pose, la dépose, puis les petits plus */
    const rang = ([k]) => LP.estPlus(P0[k]) ? 2 : estDep(k) ? 1 : 0; items.sort((a, b) => rang(a) - rang(b));
    if (!items.length) { NS.der = null; de.hidden = true; return; }
    NS.der = items; const t = totalDe(items);
    de.querySelector("small").textContent = items.map(([k, m]) => P0[k].nom + (m > 1 ? " ×" + m : "")).map((s, k) => k ? s.charAt(0).toLowerCase() + s.slice(1) : s).join(" + ") + (t.prix == null ? "" : " · " + montant(t.prix));
    de.hidden = false; majNouveau(fc);
  }
  ["input", "change"].forEach(t => document.addEventListener(t, e => { if (e.target.id === "n-cli") pourCliente(); }));
  document.addEventListener("click", e => { if (e.target.closest && e.target.closest("#n-sug")) setTimeout(pourCliente, 0); });

  /* 24/11 : la descente automatique vers « Et avec ça ? ». Un doigt posé l'annule ; un toucher sur un bouton pendant la descente compte quand même. */
  const DEF = { t: 0, fin: 0 };
  addEventListener("touchstart", e => { if (e.target.closest && e.target.closest(".feuille")) clearTimeout(DEF.t); }, { capture: true, passive: true });
  addEventListener("touchend", e => {
    if (Date.now() > DEF.fin || e.changedTouches.length !== 1) return;
    const b = e.target.closest && e.target.closest('.feuille .fc [data-a="nouveau-ok"]'); if (!b || b.disabled) return;
    const p = e.changedTouches[0], r = b.getBoundingClientRect(); if (p.clientX < r.left || p.clientX > r.right || p.clientY < r.top || p.clientY > r.bottom) return;
    DEF.fin = 0; e.preventDefault(); b.click();   /* preventDefault : pas de 2e clic si l'iPhone l'envoie quand même */
  }, { capture: true, passive: false });
  addEventListener("scrollend", e => { if (e.target.classList && e.target.classList.contains("feuille")) DEF.fin = 0; }, true);

  /* les gestes ; sur window, avant app2.js (qui ne garderait qu'une prestation) et rdv.js */
  addEventListener("click", e => {
    const t = e.target; if (!t.closest || !NS) return; const fc = t.closest(".feuille .fc"), z = fc && t.closest(".pr-z"); if (!z) return;
    const de = t.closest(".pr-der");
    if (de) { e.stopPropagation(); NS.base = {}; NS.plus = {}; NS.ordre = []; NS.der.forEach(([i, n]) => { if (LP.estPlus(P()[i])) { NS.plus[i] = n; NS.ordre.push(i); } else NS.base[i] = 1; }); return majNouveau(fc, true); }
    const c = t.closest(".pr-ca[data-pr]"); if (!c) return; e.stopPropagation(); e.preventDefault();
    const i = +c.dataset.pr, p = P()[i]; if (!p) return;
    if (LP.estPlus(p)) { touchePlus(t, NS.plus, NS.ordre); return majNouveau(fc); }
    /* une pose et/ou une dépose : une seule de chaque */
    const dep = estDep(i), deja = i in NS.base;
    Object.keys(NS.base).forEach(k => { if (estDep(+k) === dep) delete NS.base[k]; });
    if (!deja) NS.base[i] = 1;
    majNouveau(fc, true);
  }, true);

  /* on remplace la ligne de pastilles de feuilleNouveau (app2.js) */
  const fn0 = window.feuilleNouveau;
  if (typeof fn0 === "function") window.feuilleNouveau = feuilleNouveau = function (m) { const r = fn0.apply(this, arguments); try { poseNouveau(); } catch (x) { console.error(x); } return r; };

  /* ===================== 2 · FIN DU RENDEZ-VOUS : « Elle a pris autre chose ? » ===================== */
  let FX = null;   /* { r, plus: {i:n}, ordre: [] } */
  const baseDe = r => { if (!r._d109) r._d109 = { prix: r.prix, titre: r.titre }; return r._d109; };
  function extras() { const l = P(); return FX.ordre.map(i => [l[i], FX.plus[i]]).filter(([p]) => p); }
  const sommeExtras = () => { const x = extras(); return x.every(([p]) => prixDe(p.prix) == null) ? (x.length ? null : 0) : x.reduce((s, [p, n]) => s + (+p.prix || 0) * n, 0); };
  const titreAvec = r => { const b = baseDe(r), x = extras(); return [b.titre || titreRdv(r)].concat(x.map(([p, n]) => p.nom + (n > 1 ? " ×" + n : ""))).filter(Boolean).join(" + "); };
  const acompteDe = r => r.acompte_paye ? +r.acompte || 0 : 0;
  function majFin() {
    const fc = E.querySelector(".feuille .fc"); if (!FX || !fc || !fc.querySelector(".fr-box")) return;
    majCases(fc.querySelector(".fr-box"), FX.plus);
    const r = FX.r, b = baseDe(r), p0 = prixDe(b.prix), x = extras(), sx = sommeExtras(), ac = acompteDe(r), connu = p0 != null && sx != null && !prixBouge(Object.assign({}, r, { prix: b.prix, titre: b.titre }));
    const total = connu ? p0 + sx : null, reste = total == null ? null : Math.max(0, total - ac);
    fc.querySelector(".fr-lignes").innerHTML = `<div class="fr-l"><span>Prévu · ${esc(b.titre || titreRdv(r) || "Rendez-vous")}</span><b>${p0 == null ? "" : esc(montant(p0))}</b></div>`
      + (x.length ? `<div class="fr-l plus"><span>+ ${esc(x.map(([p, n]) => p.nom + (n > 1 ? " ×" + n : "")).join(", "))}</span><b>${sx == null ? "" : esc(montant(sx))}</b></div>` : "")
      + (ac ? `<div class="fr-l"><span>Acompte déjà payé</span><b>− ${esc(montant(ac))}</b></div>` : "")
      + (reste != null && (x.length || ac) ? `<div class="fr-l tot"><span>Reste à payer</span><b>${esc(montant(reste))}</b></div>` : "");
    const en = fc.querySelector('.fr-bas [data-a="encaisser"]');
    if (en) { const mot = "Encaisser" + (reste == null ? "" : " · " + montant(reste)); if (en.textContent !== mot) { const av = en.textContent; en.textContent = mot; if (av) saute(en); } }
  }
  function poseFin(id) {
    FX = null; const fc = E.querySelector(".feuille .fc"); if (!fc) return;
    const r = S.rdv.find(x => x.id === id) || (S.cloche || []).find(x => x.id === id); if (!r || !r.cliente_id || r.statut !== "prevu") return;
    const en = fc.querySelector('[data-a="encaisser"][data-id]'), fini = fc.querySelector('[data-a="statut"][data-s="fini"]'); if (!fini && !en) return;
    const box = blocPlus("Elle a pris autre chose ?", "sur place", "pr-plus-f"); if (!box) return;
    FX = { r, plus: {}, ordre: [] }; baseDe(r);
    const z = document.createElement("div"); z.className = "fr-box"; z.innerHTML = box;
    (en || fini).before(z);
    const bas = document.createElement("div"); bas.className = "fr-bas"; bas.innerHTML = '<div class="fr-lignes" aria-live="polite"></div><div class="fr-btns"></div>';
    fc.appendChild(bas);
    const btns = bas.querySelector(".fr-btns");
    if (fini) { fini.classList.add("clair"); fini.style.marginTop = ""; btns.appendChild(fini); }
    if (en) { en.style.marginTop = ""; btns.appendChild(en); }
    majFin();
  }
  const fr0 = window.feuilleRdv;
  if (typeof fr0 === "function") window.feuilleRdv = feuilleRdv = function (id) {
    /* elle avait ouvert « Encaisser » puis fermé sans encaisser : le rendez-vous redevient comme prévu */
    const r0 = S.rdv.find(x => x.id === id); if (r0 && r0._neuf && r0._d109) { r0.titre = r0._d109.titre; r0.prix = r0._d109.prix; delete r0._neuf; }
    const v = fr0.apply(this, arguments); try { poseFin(id); } catch (x) { console.error(x); } return v; };
  /* le petit texte de fidélité (suite.js le met au-dessus de « C'est fini ») reste dans la page, pas dans la barre du bas */
  new MutationObserver(() => { const n = E.querySelector(".fr-bas .rv-fid-n"), b = n && E.querySelector(".fr-bas"); if (b) b.before(n); }).observe(E, { childList: true, subtree: true });

  /* toucher un petit plus ; « Encaisser » et « C'est fini » emportent les petits plus (sur window : avant app2.js, rdv.js et suite.js) */
  let rejoue = false;
  addEventListener("click", async e => {
    const t = e.target; if (!t.closest || !FX) return; const fc = t.closest(".feuille .fc"); if (!fc || !fc.querySelector(".fr-box")) return;
    if (t.closest(".fr-box .pr-ca[data-pr]")) { e.stopPropagation(); e.preventDefault(); touchePlus(t, FX.plus, FX.ordre); return majFin(); }
    const r = FX.r, b = baseDe(r);
    if (t.closest('[data-a="encaisser"]')) {   /* la caisse s'ouvre avec le prix et les lignes à jour ; rien n'est écrit tant qu'elle n'encaisse pas */
      if (FX.ordre.length) { const sx = sommeExtras(), p0 = prixDe(b.prix); r.titre = titreAvec(r); r.prix = p0 == null ? b.prix : p0 + (sx || 0); r._neuf = true; }
      else { r.titre = b.titre; r.prix = b.prix; delete r._neuf; }
      return;
    }
    const fini = t.closest('[data-a="statut"][data-s="fini"]');
    if (fini && FX.ordre.length && !rejoue) {
      e.stopImmediatePropagation(); e.stopPropagation(); e.preventDefault(); if (fini.disabled) return; fini.disabled = true;
      const sx = sommeExtras(), p0 = prixDe(b.prix), v = { titre: titreAvec(r), prix: p0 == null ? b.prix : p0 + (sx || 0) };
      const { error } = await sb.from("rendez_vous").update(v).eq("id", r.id);
      fini.disabled = false; if (error) return oups(error);
      Object.assign(r, v); r._d109 = { prix: v.prix, titre: v.titre }; FX.plus = {}; FX.ordre = [];
      rejoue = true; try { fini.click(); } finally { rejoue = false; }
    }
  }, true);

  /* ===================== 3 · LE TICKET : une ligne par prestation et par petit plus ===================== */
  /* → [{ nom, prix (à l'unité), qte }] ; la 1re prestation prend la différence quand le prix final a changé (« à partir de ») */
  window.__lignesTicket = (r, total) => {
    const l = P(), m = LP.morceaux(titreRdv(r)), seul = [{ nom: titreRdv(r) || "Prestation", prix: total, qte: 1 }];
    if (m.length < 2) return seul;
    const L = m.map(x => { const p = l.find(y => y.nom === x.nom); return { nom: x.nom, prix: p ? prixDe(p.prix) : null, qte: x.n }; });
    if (L.slice(1).some(x => x.prix == null)) return seul;
    const reste = Math.round((total - L.slice(1).reduce((s, x) => s + x.prix * x.qte, 0)) * 100) / 100;
    if (reste < 0 || L[0].qte !== 1) return seul;
    L[0].prix = reste; return L;
  };
  /* l'aperçu du ticket dans « Encaisser » montre les mêmes lignes, et suit le prix final */
  const mf0 = window.majFinal;
  function lignesApercu() {
    const pap = E.querySelector(".fc #k-pap"), r = K && K.r; if (!pap || !r) return;
    const f = finalDe(), L = window.__lignesTicket(r, f == null ? 0 : f), l1 = pap.querySelector(".nt-l"); if (!l1) return;
    pap.querySelectorAll(".nt-l.pr-tk").forEach(x => x.remove());
    if (L.length < 2) { l1.style.display = ""; return; }
    l1.style.display = "none";   /* « hidden » ne suffit pas : .nt-l est en display:flex */
    l1.insertAdjacentHTML("beforebegin", L.map(x => `<div class="nt-l pr-tk"><span>${esc(x.nom)} · ${x.qte}</span><b>${esc(ecritEuros(x.prix * x.qte))}</b></div>`).join(""));
  }
  if (typeof mf0 === "function") window.majFinal = majFinal = function () { const v = mf0.apply(this, arguments); try { lignesApercu(); } catch (x) { console.error(x); } return v; };
  const fe0 = window.feuilleEncaisser;
  if (typeof fe0 === "function") window.feuilleEncaisser = feuilleEncaisser = function () { const v = fe0.apply(this, arguments); try { lignesApercu(); } catch (x) { console.error(x); } return v; };
})();
