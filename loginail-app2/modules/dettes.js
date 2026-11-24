/* ===== 24/11 (Marie : « parfois il y a des clientes qui doivent de l'argent… elle me dit je peux te payer la prochaine fois ») =====
   Version 2 en plus doux (maquettes/retours-2411/dette-3.html) :
   · sur sa fiche : « ＋ Elle me doit quelque chose » → combien, pour quoi → une ligne blanche « À récupérer : 20 € » avec « Payé » ;
   · en haut de Clientes : « À récupérer · 2 clientes · 45 € », touche pour voir la liste, « Payé » sur chaque ligne.
   Rangé avec ses notes (clientes.notes, champ d : [{ m: montant, q: pour quoi, j: date }]) : rien à changer sur le serveur, jamais sur le site. */
(function () {
  const st = document.createElement("style");
  st.textContent = `#E .dt-l{display:flex;align-items:center;gap:10px;margin-top:12px;padding:12px 14px;border-radius:18px;background:#fff;text-align:left}
#E .dt-l>div{flex:1;min-width:0}
#E .dt-l b{display:block;font-weight:400;font-size:14.5px;color:#9A5B62}
#E .dt-l small{display:block;font-size:12.5px;color:#776D64;margin-top:1px;overflow-wrap:anywhere}
#E .dt-p{flex:none;height:34px;padding:0 13px;border-radius:99px;border:1px solid rgba(30,28,27,.15);background:#fff;color:#4F4643;font:inherit;font-size:13px;cursor:pointer;transition:transform .12s}
#E .dt-p:active{transform:scale(.95)}
#E .dt-plus{display:flex;align-items:center;justify-content:center;gap:8px;width:100%;margin-top:12px;height:44px;border-radius:999px;border:1.5px dashed rgba(30,28,27,.22);background:none;color:#4F4643;font:inherit;font-size:14px;cursor:pointer}
#E .dt-plus.petit{height:auto;border:0;margin-top:6px;font-size:12.5px;color:#776D64;text-decoration:underline;text-underline-offset:3px}
#E .dt-qd{display:flex;align-items:center;gap:12px;width:100%;margin:10px 0 2px;padding:12px 14px;border:0;border-radius:18px;background:#fff;color:#4F4643;font:inherit;text-align:left;cursor:pointer}
#E .dt-qd::before{content:"";flex:none;width:8px;height:8px;border-radius:50%;background:#D9A3AE}
#E .dt-qd>div{flex:1}#E .dt-qd b{display:block;font-weight:500;font-size:15px;color:var(--noir,#1E1C1B)}#E .dt-qd small{font-size:12.5px;color:#8A817A}
#E .dt-qd em{font-style:normal;font-size:15px;color:#9A5B62}
#E .dt-li{margin-top:6px;border-radius:18px;background:#fff;animation:dt-in .22s ease-out}
#E .dt-li>div{display:flex;align-items:center;gap:11px;padding:11px 14px;border-bottom:1px solid #F1ECE7}
#E .dt-li>div:last-child{border:0}
#E .dt-li .av{flex:none;width:36px;height:36px;border-radius:50%;display:grid;place-items:center;background:var(--v-rose,#F5E6E4);color:var(--v-acc,#B5475E);font-weight:500;font-size:14px}
#E .dt-li .n{flex:1;min-width:0;border:0;background:none;padding:0;font:inherit;font-size:14.5px;color:inherit;text-align:left;cursor:pointer}
#E .dt-li .n small{display:block;font-size:12px;color:#776D64;overflow-wrap:anywhere}
#E .dt-li em{font-style:normal;color:#9A5B62;font-size:14px}
#E .dt-mt{display:flex;align-items:center;justify-content:center;gap:6px;margin:16px 0 4px}
#E .dt-mt input{width:150px;height:64px;border:0;border-bottom:2px solid var(--noir,#1E1C1B);border-radius:0;background:none;font:300 44px/1 Jost,sans-serif;text-align:center;outline:0;color:inherit}
#E .dt-mt span{font:300 36px/1 Jost,sans-serif;color:#776D64}
#E .dt-pq{display:flex;flex-wrap:wrap;gap:6px;justify-content:center;margin-top:12px}
#E .dt-pq button{min-height:38px;padding:6px 13px;border-radius:999px;border:1px solid rgba(30,28,27,.14);background:#fff;font:inherit;font-size:13px;color:inherit;cursor:pointer}
#E .dt-pq button.on{background:var(--v-fonce,#1E1C1B);color:#fff;border-color:transparent}
@keyframes dt-in{from{opacity:0;transform:translateY(-4px)}}
@media (prefers-reduced-motion:reduce){#E .dt-li{animation:none}}`;
  document.head.appendChild(st);

  const MC = ["janv.", "févr.", "mars", "avr.", "mai", "juin", "juil.", "août", "sept.", "oct.", "nov.", "déc."];
  const court = d => `${new Date(d).getDate()} ${MC[new Date(d).getMonth()]}`;
  const N = () => window.__notes;
  const dettes = c => (N() ? N().lit(c).d : []);
  const eu = v => (Math.round(v * 100) % 100 ? (+v).toFixed(2).replace(".", ",") : String(Math.round(v))) + " €";
  const total = l => l.reduce((s, x) => s + +x.m, 0);
  const prenom = c => c.prenom || nomCli(c);
  const montant = v => { const s = String(v || "").replace(/[\s€]/g, "").replace(",", "."); return /^\d+(\.\d{1,2})?$/.test(s) && +s > 0 ? Math.min(+s, 9999) : null; };
  /* sa dernière visite passée (pas annulée, pas absente) */
  const derniere = c => { const now = new Date().toISOString(); return (S.tous || []).concat(S.rdv || []).filter(r => r.cliente_id === c.id && r.debut < now && r.statut !== "annule" && r.statut !== "absente").sort((a, b) => b.debut.localeCompare(a.debut))[0]; };

  /* ---------- sur sa fiche ---------- */
  window.__detteFiche = c => {
    const l = dettes(c);
    return l.map((x, i) => `<div class="dt-l"><div><b>À récupérer : ${esc(eu(+x.m))}</b><small>${esc(x.q || "")}${x.j ? (x.q ? " · " : "") + "noté le " + court(x.j) : ""}</small></div><button class="dt-p" data-dt="paye" data-c="${esc(c.id)}" data-i="${i}">Payé</button></div>`).join("")
      + `<button class="dt-plus${l.length ? " petit" : ""}" data-dt="ajout" data-c="${esc(c.id)}">${l.length ? "Elle me doit autre chose" : "＋ Elle me doit quelque chose"}</button>`;
  };
  let SA = null;   /* la saisie : { c, pour, v } */
  function saisie() {
    const c = SA.c, r = derniere(c), d = r ? `${titreRdv(Object.assign({ clientes: c }, r)) || "Son rendez-vous"} du ${court(r.debut)}` : null;
    if (!SA.pour) SA.pour = d || "Autre chose";
    ouvre(`<h3>${esc(prenom(c))} te doit</h3><div class="dt-mt"><input data-dt-m inputmode="decimal" placeholder="0" value="${esc(SA.v || (r && prixDe(r.prix) != null && !SA.touche ? String(prixDe(r.prix)).replace(".", ",") : ""))}" aria-label="Montant en euros" autocomplete="off"><span>€</span></div>
      <div class="dt-pq">${[d, "Autre chose"].filter(Boolean).map(p => `<button data-dt="pour" data-p="${esc(p)}" class="${p === SA.pour ? "on" : ""}">${esc(p)}</button>`).join("")}</div>
      <button class="btn" data-dt="ok" style="margin-top:18px;width:100%">C’est noté</button><button class="dt-plus petit" data-dt="retour" style="margin:10px auto 0">Retour à sa fiche</button>`);
  }
  async function change(c, f) {
    const o = N().lit(c); o.d = f(o.d.slice()); const ok = await N().ecrit(c.id, o);
    return ok;
  }

  /* ---------- en haut de Clientes ---------- */
  let VOIR = false;
  const qui = () => S.clientes.map(c => ({ c, l: dettes(c) })).filter(x => x.l.length);
  const cl0 = VUES.cl;
  VUES.cl = () => {
    const h = cl0(), q = qui(); if (!q.length || (S.cherche || "").trim()) return h;
    const f = document.createElement("div"); f.innerHTML = h;
    const apres = f.querySelector(".v-cherche") || f.querySelector("label.cherche")?.parentElement; if (!apres) return h;
    const t = total(q.flatMap(x => x.l));
    apres.insertAdjacentHTML("afterend", `<button class="dt-qd" data-dt="voir" aria-expanded="${VOIR}"><div><b>À récupérer</b><small>${q.length} cliente${q.length > 1 ? "s" : ""} · ${VOIR ? "touche pour cacher" : "touche pour voir"}</small></div><em>${esc(eu(t))}</em></button>`
      + (VOIR ? `<div class="dt-li">${q.flatMap(x => x.l.map((d, i) => `<div><span class="av">${esc(String(prenom(x.c)).charAt(0).toUpperCase())}</span><button class="n" data-cli="${esc(x.c.id)}">${esc(nomCli(x.c))}<small>${esc(d.q || "")}</small></button><em>${esc(eu(+d.m))}</em><button class="dt-p" data-dt="paye" data-c="${esc(x.c.id)}" data-i="${i}">Payé</button></div>`)).join("")}</div>` : ""));
    return f.innerHTML;
  };

  document.addEventListener("click", async e => {
    const a = e.target.closest && e.target.closest("[data-dt]"); if (!a) return;
    e.stopPropagation(); e.preventDefault();
    const k = a.dataset.dt;
    if (k === "voir") { VOIR = !VOIR; return rendu(); }
    if (k === "ajout") { const c = S.clientes.find(x => x.id === a.dataset.c); if (!c) return; SA = { c }; return saisie(); }
    if (k === "pour" && SA) { SA.pour = a.dataset.p; SA.v = E.querySelector("[data-dt-m]")?.value || ""; SA.touche = true; return saisie(); }
    if (k === "retour" && SA) { const c = SA.c; SA = null; return feuilleCliente(c.id); }
    if (k === "ok" && SA) {
      const m = montant(E.querySelector("[data-dt-m]")?.value); if (m == null) { E.querySelector("[data-dt-m]")?.focus(); return dit("Écris combien elle te doit"); }
      const c = SA.c, pour = SA.pour === "Autre chose" ? "" : SA.pour; a.disabled = true;
      if (!(await change(c, l => l.concat({ m, q: pour, j: new Date().toISOString().slice(0, 10) })))) { a.disabled = false; return; }
      SA = null; feuilleCliente(c.id); rendu(); return dit(`Noté : ${prenom(c)} te doit ${eu(m)}`);
    }
    if (k === "paye") {
      const c = S.clientes.find(x => x.id === a.dataset.c); if (!c) return; const i = +a.dataset.i, x = dettes(c)[i]; if (!x) return;
      a.disabled = true;
      if (!(await change(c, l => { l.splice(i, 1); return l; }))) { a.disabled = false; return; }
      N().montre(); rendu(); dit(`${prenom(c)} t’a payé ${eu(+x.m)} ✓`);
    }
  }, true);
  document.addEventListener("input", e => { if (e.target.matches && e.target.matches("[data-dt-m]") && SA) { SA.v = e.target.value; SA.touche = true; } });
  document.addEventListener("keydown", e => { if (e.key === "Enter" && e.target.matches && e.target.matches("[data-dt-m]")) { e.preventDefault(); E.querySelector('[data-dt="ok"]')?.click(); } });
})();
