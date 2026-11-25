/* ===== 25/11 (Marie, version A : maquettes/plus-quand-2511.html) : le « + » demande d'abord « Quand ? » =====
   Le « + » ne vient pas d'une heure de l'agenda : il ouvrait le jour regardé, à 9 h, et la date ne se touchait pas.
   Maintenant : une bande de jours (aujourd'hui encadré, fermé / complet grisés), dessous les heures libres de ce jour ;
   une heure touchée → « Nouveau rendez-vous » habituel, sur ce jour, à cette heure. La pastille de la date ramène à « Quand ? ».
   Toucher une heure vide de l'agenda ne change pas (l'heure est déjà choisie).
   Chargé AVANT agenda-vues.js : sinon, en vue Semaine, son « Quel jour ? » passerait devant.
   Heures libres : pas de 30 min dans ses horaires, hors pause, place pour 1 h, sans chevauchement ; on ne lit que début, fin, état. */
(function () {
  const JOURS_VUS = 28, PAS = 30, PLACE = 60, JC = ["dim.", "lun.", "mar.", "mer.", "jeu.", "ven.", "sam."], MC = ["janv.", "févr.", "mars", "avr.", "mai", "juin", "juil.", "août", "sept.", "oct.", "nov.", "déc."];
  let Q = null;
  const enMin = t => { const [h, m] = String(t).split(":").map(Number); return h * 60 + (m || 0); };
  const horaires = () => { try { return ((S.site && S.site.donnees) || (window.brouillon && brouillon()) || {}).horaires || []; } catch (e) { return []; } };
  const hx = m => Math.floor(m / 60) + ":" + String(m % 60).padStart(2, "0");
  const auj0 = () => { const d = new Date(); d.setHours(0, 0, 0, 0); return d; };
  const court = d => `${JC[d.getDay()]} ${d.getDate()} ${MC[d.getMonth()]}`;
  function libres(jour) {
    const hor = horaires(), h = hor[(jour.getDay() + 6) % 7];
    if (hor.length && !(h && h.d && h.f)) return null;            /* fermé */
    const d0 = h && h.d ? enMin(h.d) : 9 * 60, fin = h && h.f ? enMin(h.f) : 19 * 60;
    const pd = h && h.pd && h.pf ? enMin(h.pd) : null, pf = pd != null ? enMin(h.pf) : null;
    const now = new Date(), deja = memeJour(jour, now) ? now.getHours() * 60 + now.getMinutes() : -1, out = [];
    for (let t = d0; t + PLACE <= fin; t += PAS) {
      if (pd != null && t < pf && t + PLACE > pd) continue;
      if (t < deja) continue;
      const a = new Date(jour); a.setHours(0, t, 0, 0); const b = +a + PLACE * 60000;
      if ((Q.occ || []).some(z => +a < z[1] && b > z[0])) continue;
      out.push(t);
    }
    return out;
  }
  async function lit() {
    const de = auj0();
    try {
      const { data, error } = await sb.from("rendez_vous").select("debut,fin,statut").lt("debut", plusJours(de, JOURS_VUS).toISOString()).gt("fin", de.toISOString());
      if (error || !data) throw error;
      return data.filter(r => r.statut !== "annule").map(r => [+new Date(r.debut), +new Date(r.fin)]);
    } catch (e) { return (S.rdv || []).filter(r => r.statut !== "annule").map(r => [+new Date(r.debut), +new Date(r.fin)]); }
  }
  function bande() {
    const a = auj0(); let h = "";
    for (let i = 0; i < JOURS_VUS; i++) {
      const d = plusJours(a, i), L = Q.occ ? libres(d) : [], ferme = L === null, complet = !ferme && Q.occ && !L.length;
      h += `<button class="pq-j${i === 0 ? " auj" : ""}${ferme ? " ferme" : ""}${complet ? " complet" : ""}${memeJour(d, Q.jour) ? " choisi" : ""}" data-pq-j="${+d}"${ferme ? " disabled" : ""}><small>${i === 0 ? "auj." : JC[d.getDay()]}</small><b>${d.getDate()}</b><i>${ferme ? "fermé" : complet ? "complet" : ""}</i></button>`;
    }
    return h;
  }
  function heures() {
    if (!Q.occ) return `<div class="pq-vide">Un instant…</div>`;
    const L = libres(Q.jour) || [];
    return L.length ? `<div class="pq-h">${L.map(m => `<button data-pq-h="${m}">${hx(m)}</button>`).join("")}</div>` : `<div class="pq-vide">Plus rien de libre ce jour-là.</div>`;
  }
  function dessine(defile) {
    const fc = E.querySelector(".feuille .fc"), z = fc && fc.querySelector(".pq");
    if (!z) {
      ouvre(`<div class="pq"><h3>Quand ?</h3><div class="pq-lab">Le jour</div><div class="pq-jours">${bande()}</div><div class="pq-lab" id="pq-lh">Libre le ${court(Q.jour)}</div><div id="pq-hz">${heures()}</div><button class="pq-autre" data-pq-autre>Une autre heure</button></div>`);
      const ch = E.querySelector(".pq-j.choisi"); if (ch && defile !== false) ch.scrollIntoView({ inline: "nearest", block: "nearest" });
      return;
    }
    z.querySelector(".pq-jours").querySelectorAll(".pq-j").forEach(b => b.classList.toggle("choisi", +b.dataset.pqJ === +Q.jour));
    z.querySelector("#pq-lh").textContent = "Libre le " + court(Q.jour);
    z.querySelector("#pq-hz").innerHTML = heures();
  }
  function premierJour(depart) {
    let d = new Date(depart); d.setHours(0, 0, 0, 0); if (d < auj0()) d = auj0();
    for (let i = 0; i < JOURS_VUS; i++) { const L = libres(d); if (L && L.length) return d; d = plusJours(d, 1); }
    return new Date(depart);
  }
  async function ouvrir(depart) {
    Q = { jour: new Date(depart || S.jour || new Date()), occ: null };
    Q.jour.setHours(0, 0, 0, 0); if (Q.jour < auj0()) Q.jour = auj0();
    dessine();
    Q.occ = await lit();
    const vu = E.querySelector(".pq"); if (!vu) return;
    Q.jour = premierJour(Q.jour);
    vu.querySelector(".pq-jours").innerHTML = bande(); dessine();
    const ch = E.querySelector(".pq-j.choisi"); if (ch) ch.scrollIntoView({ inline: "nearest", block: "nearest" });
  }
  window.plusQuand = ouvrir;
  async function vers(jour, m) {
    /* l'agenda se met sur ce jour (la semaine est relue : « déjà pris » et l'agenda après « Enregistrer » sont justes) */
    S.jour = new Date(jour); S.lundi = lundiDe(S.jour);
    try { await chargeSemaine(); rendu(); } catch (e) {}
    feuilleNouveau(m);
  }
  /* la pastille de la date de « Nouveau rendez-vous » : un vrai bouton, qui ramène à « Quand ? » */
  const obs = new MutationObserver(() => {
    const p = E && E.querySelector(".feuille .fc .n-tete .n-p:not(.n-ph-h):not([data-pq-date])"); if (!p) return;
    p.setAttribute("data-pq-date", ""); p.setAttribute("role", "button"); p.setAttribute("aria-label", "Changer de jour");
    p.insertAdjacentHTML("beforeend", '<svg class="pq-fl" viewBox="0 0 24 24"><path d="M6 9l6 6 6-6"/></svg>');
  });
  const lance = () => { if (typeof E !== "undefined" && E) obs.observe(E, { childList: true, subtree: true }); else setTimeout(lance, 200); };
  lance();

  addEventListener("click", e => {
    const t = e.target; if (!t || !t.closest) return;
    const plus = t.closest('[data-a="nouveau"]');
    if (plus && !t.closest(".feuille")) {
      if (S.onglet === "ag" && localStorage.getItem("loginail-agenda-vue") === "mois") return;   /* vue Mois : « Touche d'abord le jour » reste */
      e.preventDefault(); e.stopImmediatePropagation(); ouvrir(S.jour); return;
    }
    const dt = t.closest("[data-pq-date]");
    if (dt) { e.preventDefault(); e.stopImmediatePropagation(); ouvrir(N && N.jour); return; }
    const j = t.closest("[data-pq-j]");
    if (j) { e.preventDefault(); e.stopImmediatePropagation(); if (j.disabled) return; Q.jour = new Date(+j.dataset.pqJ); dessine(false); return; }
    const h = t.closest("[data-pq-h]");
    if (h) { e.preventDefault(); e.stopImmediatePropagation(); h.classList.add("on"); const d = Q.jour, m = +h.dataset.pqH; setTimeout(() => vers(d, m), 140); return; }
    if (t.closest("[data-pq-autre]")) {
      e.preventDefault(); e.stopImmediatePropagation();
      const hor = horaires()[(Q.jour.getDay() + 6) % 7]; vers(Q.jour, hor && hor.d ? enMin(hor.d) : 9 * 60).then(() => {
        const i = document.getElementById("n-h"); if (i) { try { i.focus(); i.showPicker && i.showPicker(); } catch (x) {} } });
    }
  }, true);

  const st = document.createElement("style"); st.textContent = `
.pq h3{text-align:left;margin:0 44px 6px 0;font-size:26px}
.pq-lab{font-size:12px;text-transform:uppercase;letter-spacing:.08em;opacity:.55;margin:14px 0 7px;font-weight:600}
.pq-jours{display:flex;gap:6px;overflow-x:auto;scrollbar-width:none;margin:0 -24px;padding:2px 24px;scroll-padding:0 24px;-webkit-overflow-scrolling:touch}
.pq-jours::-webkit-scrollbar{display:none}
.pq-j{flex:none;width:50px;height:64px;border-radius:16px;background:#fff;border:1px solid rgba(30,28,27,.1);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:1px;cursor:pointer;font:inherit;color:inherit;padding:0;transition:background .15s,color .15s,transform .12s}
.pq-j:active{transform:scale(.94)}
.pq-j small{font-size:11px;opacity:.6}.pq-j b{font-size:19px;line-height:1.1}.pq-j i{font-style:normal;font-size:10px;opacity:.6;height:12px}
.pq-j.auj{border:2px solid var(--v-acc,#B5475E)}
.pq-j.ferme{background:transparent;border-style:dashed;opacity:.45;cursor:default}
.pq-j.complet{opacity:.55}
.pq-j.choisi{background:var(--noir,#1E1C1B);color:#fff;border-color:var(--noir,#1E1C1B);opacity:1}
.pq-h{display:grid;grid-template-columns:repeat(4,1fr);gap:6px}
.pq-h button{height:44px;border-radius:12px;background:#fff;border:1px solid rgba(30,28,27,.1);font:inherit;font-size:15px;color:inherit;cursor:pointer;transition:transform .12s,background .15s,color .15s;animation:pqh .2s ease both}
.pq-h button:active{transform:scale(.94)}
.pq-h button.on{background:var(--v-acc,#B5475E);color:#fff;border-color:transparent}
@keyframes pqh{from{opacity:0;transform:translateY(5px)}}
.pq-vide{font-size:14px;opacity:.6;padding:10px 0}
.pq-autre{display:block;margin:12px auto 0;background:none;border:0;font:inherit;font-size:14px;opacity:.7;text-decoration:underline;cursor:pointer;color:inherit}
[data-pq-date]{cursor:pointer;transition:transform .12s}[data-pq-date]:active{transform:scale(.95)}
.pq-fl{width:10px!important;height:10px!important;opacity:.5}`;
  document.head.appendChild(st);
})();
