/* ===== 25/11 (Marie, D122) : le « + » demande d'abord « Quand ? » — CALENDRIER + RACCOURCIS =====
   Maquette qui fait foi : maquettes/plus-quand-3-2511.html (téléphone « 1+ »). Refusés avant : bande de jours (plus-quand-2511.html),
   liste des prochaines places et roue (plus-quand-2-2511.html, plus-quand-3-2511.html).
   Le « + » ne vient pas d'une heure de l'agenda : il ouvrait le jour regardé, à 9 h, et la date ne se touchait pas.
   Maintenant : 4 raccourcis (« Le plus tôt », « Cette semaine », « Un samedi », « Dans 3 sem. »), une phrase rose qui dit le choix,
   le calendrier du mois (point = de la place, complet barré, fermé/passé gris, aujourd'hui entouré), dessous les heures libres
   du jour (la 1re en rose). Une heure touchée → « Nouveau rendez-vous » habituel sur ce jour, à cette heure ;
   la pastille de la date ramène à « Quand ? ». Toucher une heure vide de l'agenda ne change pas (l'heure est déjà choisie).
   Chargé AVANT agenda-vues.js : sinon, en vue Semaine, son « Quel jour ? » passerait devant.
   Heures libres : pas de 30 min dans ses horaires, hors pause, place pour 1 h, sans chevauchement ; on ne lit que début, fin, état.
   27/11 (Marie : « le 28 j'ai quelqu'un de 10h à 13h, ça me met 8h, 8h30, 9h… ; pose américaine c'est 8h30, semi c'est 8h et 9h ») :
   des puces de prestation en haut (la même que « Mes dispos », retenue), et les heures se COLLENT aux rendez-vous pour sa durée
   (même calcul que colle() de mes-dispos.js). L'heure touchée ouvre « Nouveau rendez-vous » avec cette prestation déjà choisie.
   27/11 (Marie : « j'arrive pas à aller plus loin que février 2027 ») : 12 mois au lieu de 92 jours. On lit d'abord 92 jours
   (ou jusqu'au mois de départ), puis chaque mois quand elle y arrive avec « › » (et le suivant, à l'avance). Un jour pas encore lu
   reste gris : il n'est jamais montré libre par erreur. */
(function () {
  const HORIZON = 366, D_ABORD = 92, TRANCHE = 28, PAS = 30, PLACE = 60;
  const JC = ["dim.", "lun.", "mar.", "mer.", "jeu.", "ven.", "sam."], JL = ["dimanche", "lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi"];
  const MC = ["janv.", "févr.", "mars", "avr.", "mai", "juin", "juil.", "août", "sept.", "oct.", "nov.", "déc."], ML = ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"];
  const RACC = [["tot", "Le plus tôt"], ["sem", "Cette sem."], ["sam", "Un samedi"], ["s3", "Dans 3 sem."]];
  let Q = null;
  const CLE_P = "loginail-dispos-presta";
  /* les prestations, celles qu'elle fait le plus d'abord (comme « Mes dispos ») ; i = sa place dans prestasDispo() */
  function prestations() {
    const N = {}, depuis = Date.now() - 120 * 864e5;
    (S.tous || []).forEach(r => { if (r.cliente_id && r.titre && r.statut !== "annule" && +new Date(r.debut) > depuis) N[r.titre] = (N[r.titre] || 0) + 1; });
    return (typeof prestasDispo === "function" ? prestasDispo() : []).map((p, i) => ({ i, nom: String(p.nom), duree: +p.duree || 60, n: N[p.nom] || 0 })).sort((a, b) => b.n - a.n || a.i - b.i);
  }
  const laPresta = () => Q && Q.P && Q.P[Q.p] || null;
  const enMin = t => { const [h, m] = String(t).split(":").map(Number); return h * 60 + (m || 0); };
  const horaires = () => { try { return ((S.site && S.site.donnees) || (window.brouillon && brouillon()) || {}).horaires || []; } catch (e) { return []; } };
  const hx = m => Math.floor(m / 60) + ":" + String(m % 60).padStart(2, "0");
  const hDit = m => Math.floor(m / 60) + " h" + (m % 60 ? " " + String(m % 60).padStart(2, "0") : "");
  const auj0 = () => { const d = new Date(); d.setHours(0, 0, 0, 0); return d; };
  const court = d => `${JC[d.getDay()]} ${d.getDate()} ${MC[d.getMonth()]}`;
  const grand = s => s.charAt(0).toUpperCase() + s.slice(1);
  const fin = () => plusJours(auj0(), HORIZON);

  /* null = fermé ou passé ; [] = complet */
  function libres(jour) {
    if (jour < auj0() || jour >= fin() || !Q || !Q.lu || jour >= Q.lu) return null;   /* pas encore lu = pas montré */
    const hor = horaires(), h = hor[(jour.getDay() + 6) % 7];
    if (hor.length && !(h && h.d && h.f)) return null;
    const d0 = h && h.d ? enMin(h.d) : 9 * 60, f = h && h.f ? enMin(h.f) : 19 * 60;
    const pd = h && h.pd && h.pf ? enMin(h.pd) : null, pf = pd != null ? enMin(h.pf) : null;
    const now = new Date(), deja = memeJour(jour, now) ? now.getHours() * 60 + now.getMinutes() : -1, out = [];
    /* 27/11 : avec une prestation, les heures se collent aux rendez-vous (8h30 avant un 10h pour 1h30 ; 8h et 9h pour 1h) */
    const p = laPresta();
    if (p && window.colleDispos) {
      const murs = [], occ = (Q.occ || []).map(z => [(z[0] - jour) / 60000, (z[1] - jour) / 60000]);
      if (pd != null) murs.push([pd, pf]);
      if (deja > d0) murs.push([d0, deja]);
      return window.colleDispos(d0, f, Math.max(PAS, p.duree), murs, occ);
    }
    for (let t = d0; t + PLACE <= f; t += PAS) {
      if (pd != null && t < pf && t + PLACE > pd) continue;
      if (t < deja) continue;
      const a = new Date(jour); a.setHours(0, t, 0, 0); const b = +a + PLACE * 60000;
      if ((Q.occ || []).some(z => +a < z[1] && b > z[0])) continue;
      out.push(t);
    }
    return out;
  }
  /* par tranches, comme « Mes dispos » : au-delà de 1 000 lignes le serveur ne rend pas tout */
  const nbJours = (de, a) => Math.round((a - de) / 864e5);
  const finMois = m => { const f = new Date(m.getFullYear(), m.getMonth() + 1, 1); return f > fin() ? fin() : f; };
  async function lit(de, a) {
    const R = await Promise.all(Array.from({ length: Math.ceil(nbJours(de, a) / TRANCHE) }, (_, i) => { const t1 = plusJours(de, (i + 1) * TRANCHE);
      return sb.from("rendez_vous").select("debut,fin,statut").lt("debut", (t1 > a ? a : t1).toISOString()).gt("fin", plusJours(de, i * TRANCHE).toISOString()); }));
    if (R.some(r => r.error || !r.data)) throw new Error("agenda illisible");
    return R.flatMap(r => r.data).filter(r => r.statut !== "annule").map(r => [+new Date(r.debut), +new Date(r.fin)]);
  }
  /* lit la suite de l'agenda jusqu'à « a » (une lecture à la fois ; rien si la fenêtre a été refermée ou rouverte) */
  async function etend(a) {
    const q = Q; if (!q || !q.lu) return;
    if (a > fin()) a = fin();
    while (q.charge) await q.charge;
    if (a <= q.lu || Q !== q) return;
    const de = q.lu;
    q.charge = lit(de, a).then(o => { q.occ = q.occ.concat(o); q.lu = a; }, () => { if (Q === q && E.querySelector(".pq")) dit("Pas de connexion : réessaie"); });
    try { await q.charge; } finally { q.charge = null; }
    if (Q === q && E.querySelector(".pq")) dessine();
  }
  const finSemaine = () => plusJours(auj0(), 7 - (auj0().getDay() + 6) % 7);
  function garde(d) {
    const a = auj0();
    if (Q.rc === "sem") return d >= a && d < finSemaine();
    if (Q.rc === "sam") return d.getDay() === 6 && d >= a;
    if (Q.rc === "s3") return d >= plusJours(a, 19) && d <= plusJours(a, 25);
    return false;
  }
  function cherche(de, ok) { for (let i = 0; i < HORIZON; i++) { const x = plusJours(de, i), L = libres(x); if (L && L.length && ok(x)) return x; } return null; }
  const phrase = () => Q.jour ? `${grand(JL[Q.jour.getDay()])} ${Q.jour.getDate()} ${MC[Q.jour.getMonth()]}${Q.h != null ? " à " + hDit(Q.h) : ""}` : "";

  function calendrier() {
    const m = Q.mois, a = auj0(), p0 = (m.getDay() + 6) % 7, nb = new Date(m.getFullYear(), m.getMonth() + 1, 0).getDate();
    const avantOk = m > new Date(a.getFullYear(), a.getMonth(), 1), apresOk = new Date(m.getFullYear(), m.getMonth() + 1, 1) < fin();
    let g = `<div class="pq-g${Q.rc && Q.rc !== "tot" ? " filtre" : ""}">` + ["L", "M", "M", "J", "V", "S", "D"].map(x => `<div class="e">${x}</div>`).join("") + "<div></div>".repeat(p0);
    for (let i = 1; i <= nb; i++) {
      const d = new Date(m.getFullYear(), m.getMonth(), i), L = Q.occ ? libres(d) : null, gris = !L, complet = L && !L.length;
      g += `<button class="pq-d${gris ? " gris" : ""}${complet ? " complet" : ""}${L && L.length ? " libre" : ""}${memeJour(d, a) ? " auj" : ""}${Q.jour && memeJour(d, Q.jour) ? " choisi" : ""}${garde(d) ? " garde" : ""}" data-pq-d="${+d}"${gris || complet ? " disabled" : ""}>${i}</button>`;
    }
    return `<div class="pq-mois"><button data-pq-m="-1"${avantOk ? "" : " disabled"} aria-label="Mois d'avant">‹</button><b>${grand(ML[m.getMonth()])} ${m.getFullYear()}</b><button data-pq-m="1"${apresOk ? "" : " disabled"} aria-label="Mois d'après">›</button></div>${g}</div>`;
  }
  function heures() {
    if (!Q.occ) return `<div class="pq-vide">Un instant…</div>`;
    if (!Q.jour) return "";
    const L = libres(Q.jour) || [];
    return `<div class="pq-lab">Libre le ${court(Q.jour)}</div>` + (L.length ? `<div class="pq-h">${L.map(m => `<button data-pq-h="${m}"${m === Q.h ? ' class="sug"' : ""}>${hx(m)}</button>`).join("")}</div>` : `<div class="pq-vide">Plus rien de libre ce jour-là.</div>`)
      + `<button class="pq-autre" data-pq-autre>Une autre heure</button>`;
  }
  function dessine() {
    const y = (E.querySelector(".feuille") || {}).scrollTop || 0;
    const pr = Q.P.length ? `<div class="pq-pr" role="tablist" aria-label="Pour quelle prestation ?">${Q.P.map((p, k) => `<button role="tab" data-pq-p="${k}"${k === Q.p ? ' class="on" aria-selected="true"' : ' aria-selected="false"'}>${esc(p.nom)}<small>${duree(p.duree)}</small></button>`).join("")}</div>` : "";
    ouvre(`<div class="pq"><h3>Quand ?</h3>${pr}<div class="pq-racc">${RACC.map(([k, t]) => `<button data-pq-rc="${k}"${Q.rc === k ? ' class="on"' : ""}>${t}</button>`).join("")}</div>
      <div class="pq-phrase">${phrase()}</div>${calendrier()}<div id="pq-hz">${heures()}</div></div>`);
    const f = E.querySelector(".feuille"); if (f) f.scrollTop = y;
    const on = E.querySelector(".pq-pr .on"); if (on) { const r = on.parentElement; r.scrollLeft = on.offsetLeft - (r.clientWidth - on.offsetWidth) / 2; }   /* de côté seulement : la feuille ne bouge pas */
  }
  async function ouvrir(depart) {
    const a = auj0(); let d = new Date(depart || S.jour || a); d.setHours(0, 0, 0, 0); if (d < a) d = a;
    const P = prestations(); let g = ""; try { g = localStorage.getItem(CLE_P) || ""; } catch (e) {}
    Q = { jour: d, mois: new Date(d.getFullYear(), d.getMonth(), 1), occ: null, rc: null, h: null, P, p: Math.max(0, P.findIndex(p => p.nom === g)) };
    dessine();
    const q = Q, a0 = plusJours(a, D_ABORD), a1 = finMois(Q.mois), jusqua = a1 > a0 ? a1 : a0;
    try { q.occ = await lit(a, jusqua); q.lu = jusqua; }
    catch (e) { q.occ = (S.rdv || []).filter(r => r.statut !== "annule").map(r => [+new Date(r.debut), +new Date(r.fin)]); q.lu = plusJours(a, 7); }   /* sans connexion : seulement la semaine déjà en mémoire */
    if (Q !== q || !E.querySelector(".pq")) return;
    const L = libres(Q.jour); if (!(L && L.length)) Q.jour = cherche(Q.jour, () => true) || Q.jour;
    Q.mois = new Date(Q.jour.getFullYear(), Q.jour.getMonth(), 1); Q.h = (libres(Q.jour) || [])[0] ?? null;
    dessine();
  }
  window.plusQuand = ouvrir;
  async function vers(jour, m) {
    /* l'agenda se met sur ce jour (la semaine est relue : « déjà pris » et l'agenda après « Enregistrer » sont justes) */
    S.jour = new Date(jour); S.lundi = lundiDe(S.jour);
    try { await chargeSemaine(); rendu(); } catch (e) {}
    const p = laPresta();
    feuilleNouveau(m);
    /* 27/11 : la prestation choisie dans « Quand ? » est déjà cochée */
    if (p) setTimeout(() => { const b = E.querySelector(`.fc .chips [data-np="${p.i}"], .fc .pr-z [data-np="${p.i}"]`); if (b && !b.classList.contains("on")) b.click(); }, 0);
  }
  /* la pastille de la date de « Nouveau rendez-vous » : un vrai bouton, qui ramène à « Quand ? » */
  const obs = new MutationObserver(() => {
    const p = E.querySelector(".feuille .fc .n-tete .n-p:not(.n-ph-h):not([data-pq-date])"); if (!p) return;
    p.setAttribute("data-pq-date", ""); p.setAttribute("role", "button"); p.setAttribute("aria-label", "Changer de jour");
    p.insertAdjacentHTML("beforeend", '<svg class="pq-fl" viewBox="0 0 24 24"><path d="M6 9l6 6 6-6"/></svg>');
  });
  const lance = () => { if (typeof E !== "undefined" && E) obs.observe(E, { childList: true, subtree: true }); else setTimeout(lance, 200); };
  lance();

  const stop = e => { e.preventDefault(); e.stopImmediatePropagation(); };
  addEventListener("click", e => {
    const t = e.target; if (!t || !t.closest) return;
    const plus = t.closest('[data-a="nouveau"]');
    if (plus && !t.closest(".feuille")) {
      if (S.onglet === "ag" && localStorage.getItem("loginail-agenda-vue") === "mois") return;   /* vue Mois : « Touche d'abord le jour » reste */
      stop(e); ouvrir(S.jour); return;
    }
    if (t.closest("[data-pq-date]")) { stop(e); ouvrir(N && N.jour); return; }
    if (!Q || !t.closest(".pq")) return;
    const pp = t.closest("[data-pq-p]");
    if (pp) { stop(e); const k = +pp.dataset.pqP; if (k === Q.p) return; Q.p = k; try { localStorage.setItem(CLE_P, Q.P[k].nom); } catch (x) {}
      if (Q.occ) { const L = libres(Q.jour); if (!(L && L.length)) { const d = cherche(Q.jour, () => true); if (d) { Q.jour = d; Q.mois = new Date(d.getFullYear(), d.getMonth(), 1); } }
        Q.h = (libres(Q.jour) || [])[0] ?? null; }
      dessine(); return; }
    const rc = t.closest("[data-pq-rc]");
    if (rc) {
      stop(e); if (!Q.occ) return; const k = rc.dataset.pqRc; Q.rc = Q.rc === k ? null : k;
      const a = auj0(), d = Q.rc === "tot" ? cherche(a, () => true) : Q.rc === "sem" ? cherche(a, garde) : Q.rc === "sam" ? cherche(a, x => x.getDay() === 6) : Q.rc === "s3" ? cherche(plusJours(a, 21), () => true) : null;
      if (Q.rc && !d) dit(Q.rc === "sem" ? "Plus de place cette semaine" : "Plus de place");
      if (d) { Q.jour = d; Q.h = libres(d)[0]; Q.mois = new Date(d.getFullYear(), d.getMonth(), 1); }
      dessine(); return;
    }
    const mo = t.closest("[data-pq-m]");
    if (mo) { stop(e); if (mo.disabled) return; Q.mois = new Date(Q.mois.getFullYear(), Q.mois.getMonth() + +mo.dataset.pqM, 1); dessine();
      if (Q.occ) etend(finMois(new Date(Q.mois.getFullYear(), Q.mois.getMonth() + 1, 1)));   /* ce mois-ci + le suivant, à l'avance */
      return; }
    const j = t.closest("[data-pq-d]");
    if (j) { stop(e); if (j.disabled) return; Q.jour = new Date(+j.dataset.pqD); Q.h = null; dessine();
      const z = E.querySelector("#pq-hz"); if (z) z.scrollIntoView({ behavior: "smooth", block: "nearest" }); return; }
    const h = t.closest("[data-pq-h]");
    if (h) { stop(e); h.classList.add("on"); const d = Q.jour, m = +h.dataset.pqH; setTimeout(() => vers(d, m), 140); return; }
    if (t.closest("[data-pq-autre]")) {
      stop(e);
      const hor = horaires()[(Q.jour.getDay() + 6) % 7]; vers(Q.jour, hor && hor.d ? enMin(hor.d) : 9 * 60).then(() => {
        const i = document.getElementById("n-h"); if (i) { try { i.focus(); i.showPicker && i.showPicker(); } catch (x) {} } });
    }
  }, true);

  const st = document.createElement("style"); st.textContent = `
.pq h3{text-align:left;margin:0 44px 10px 0;font-size:26px}
.pq-pr{display:flex;gap:7px;overflow-x:auto;scrollbar-width:none;margin:0 -16px 10px;padding:2px 16px 4px;scroll-padding:0 16px}
.pq-pr::-webkit-scrollbar{display:none}
.pq-pr button{flex:none;display:flex;align-items:center;gap:5px;line-height:1;min-height:40px;padding:0 14px;border:0;border-radius:999px;background:#fff;box-shadow:0 0 0 1px rgba(30,28,27,.12);font:inherit;font-size:14px;color:var(--v-fonce,#1E1C1B);cursor:pointer;transition:background .18s,color .18s,transform .12s}
.pq-pr button small{font-size:12px;color:var(--gris);transition:color .18s}
.pq-pr button.on{background:var(--v-acc,#B5475E);color:#fff;box-shadow:none}
.pq-pr button.on small{color:rgba(255,255,255,.85)}
.pq-pr button:active{transform:scale(.96)}
.pq-racc{display:flex;gap:6px;overflow-x:auto;scrollbar-width:none;margin:0 -24px 10px;padding:0 24px}
.pq-racc::-webkit-scrollbar{display:none}
@media (max-width:359px){.pq-racc{flex-wrap:wrap;overflow:visible}}
.pq-racc button{flex:none;height:36px;padding:0 11px;border-radius:999px;border:1px solid rgba(30,28,27,.14);background:#fff;font:inherit;font-size:13.5px;color:inherit;white-space:nowrap;cursor:pointer;transition:background .15s,color .15s,transform .12s}
.pq-racc button:active{transform:scale(.95)}
.pq-racc button.on{background:var(--noir,#1E1C1B);color:#fff;border-color:transparent}
.pq-phrase{font-size:19px;font-weight:600;color:var(--v-acc,#B5475E);min-height:24px;margin:0 0 8px}
.pq-mois{display:flex;align-items:center;justify-content:space-between;margin:0 0 4px}
.pq-mois b{font-size:17px}
.pq-mois button{width:36px;height:36px;border-radius:50%;border:1px solid rgba(30,28,27,.12);background:#fff;font-size:18px;color:inherit;cursor:pointer;padding:0}
.pq-mois button[disabled]{opacity:.3;cursor:default}
.pq-g{display:grid;grid-template-columns:repeat(7,1fr);gap:2px;text-align:center}
.pq-g .e{font-size:11px;opacity:.55;padding:4px 0;font-weight:600}
.pq-d{width:42px;height:42px;margin:0 auto;border:0;border-radius:50%;background:none;font:inherit;font-size:16px;color:inherit;cursor:pointer;position:relative;padding:0;transition:background .15s,color .15s,transform .12s,opacity .15s}
.pq-d:active{transform:scale(.9)}
.pq-d.gris{opacity:.28;cursor:default}
.pq-d.complet{opacity:.5;text-decoration:line-through;cursor:default}
.pq-d.libre::after{content:"";position:absolute;bottom:5px;left:50%;width:5px;height:5px;margin-left:-2.5px;border-radius:50%;background:var(--v-acc,#B5475E)}
.pq-d.auj{box-shadow:inset 0 0 0 2px var(--v-acc,#B5475E)}
.pq-d.choisi{background:var(--noir,#1E1C1B);color:#fff;opacity:1}.pq-d.choisi::after{background:#fff}
.pq-g.filtre .pq-d:not(.garde):not(.choisi){opacity:.22}
.pq-g.filtre .pq-d.garde.libre{font-weight:700}
.pq-lab{font-size:12px;text-transform:uppercase;letter-spacing:.08em;opacity:.55;margin:14px 0 7px;font-weight:600}
.pq-h{display:grid;grid-template-columns:repeat(4,1fr);gap:6px}
.pq-h button{height:44px;border-radius:12px;background:#fff;border:1px solid rgba(30,28,27,.1);font:inherit;font-size:15px;color:inherit;cursor:pointer;transition:transform .12s,background .15s,color .15s;animation:pqh .2s ease both}
.pq-h button:active{transform:scale(.94)}
.pq-h button.sug,.pq-h button.on{background:var(--v-acc,#B5475E);color:#fff;border-color:transparent}
@keyframes pqh{from{opacity:0;transform:translateY(5px)}}
.pq-vide{font-size:14px;opacity:.6;padding:10px 0}
.pq-autre{display:block;margin:12px auto 0;background:none;border:0;font:inherit;font-size:14px;opacity:.7;text-decoration:underline;cursor:pointer;color:inherit}
[data-pq-date]{cursor:pointer;transition:transform .12s}[data-pq-date]:active{transform:scale(.95)}
.pq-fl{width:10px!important;height:10px!important;opacity:.5}`;
  document.head.appendChild(st);
})();
