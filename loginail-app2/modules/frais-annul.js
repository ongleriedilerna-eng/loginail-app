/* ===== 24/11 (Marie : « les annulations c'est 25 €… et si je l'annule et qu'elle me dit 2 minutes après "ah non c'est bon", je veux pouvoir le remettre ») =====
   Maquette maquettes/retours-2411/frais.html. Règle dans Réglages › Bon à savoir (regles.frais, legal.js) ; affichée sur le site avant de réserver (legal-site.js, resa-simu.js).
   · « C'est elle qui me l'a demandé » moins de [sa règle] avant, ou « Pas venue » → « Frais : 25 € ? » → Oui = ajouté à « À récupérer » (dettes.js, avec le rendez-vous).
   · Un rendez-vous annulé a « Remettre le rendez-vous » (si la place est encore libre) ; remis = ses frais s'enlèvent. Idem « Remettre comme prévu » après « Pas venue ». */
(function () {
  const st = document.createElement("style");
  st.textContent = `#E .fa-box{margin-top:12px;padding:13px 14px;border-radius:18px;background:#F7E9EC;text-align:left}
#E .fa-box b{display:block;font-weight:500;color:#9A5B62;font-size:15px}#E .fa-box small{display:block;font-size:12.5px;color:#776D64;margin-top:3px;line-height:1.4}`;
  document.head.appendChild(st);
  const MC = ["janv.", "févr.", "mars", "avr.", "mai", "juin", "juil.", "août", "sept.", "oct.", "nov.", "déc."];
  const court = d => `${d.getDate()} ${MC[d.getMonth()]}`;
  const regles = () => Object.assign({ annulation: "48 h avant", frais: "Rien" }, ((typeof brouillon === "function" && brouillon()) || {}).regles || (S.site && S.site.donnees && S.site.donnees.regles) || {});
  const fraisDe = () => { const m = String(regles().frais || "").match(/(\d+(?:[.,]\d+)?)/); return m ? +m[1].replace(",", ".") : 0; };
  const delaiH = () => { const m = String(regles().annulation || "").match(/(\d+)/); return m ? +m[1] : 48; };
  const eu = v => (Math.round(v * 100) % 100 ? (+v).toFixed(2).replace(".", ",") : String(Math.round(v))) + " €";
  const N = () => window.__notes;
  const rdvDe = id => (S.rdv || []).concat(S.tous || [], S.cloche || []).find(x => x.id === id);
  const cliDe = r => r && r.cliente_id && S.clientes.find(c => c.id === r.cliente_id);

  let ATT = null, Q = null;
  /* on note ce qu'elle touche ; app2.js fait l'annulation comme d'habitude, puis on pose la question */
  addEventListener("click", e => {
    const a = e.target.closest && e.target.closest('[data-a="statut"][data-id]'); if (!a) return;
    const r = rdvDe(a.dataset.id); if (!r) return;
    const s = a.dataset.s;
    if (s === "prevu") {
      /* remettre : seulement si la place est encore libre */
      if (r.statut === "annule") {
        const d = new Date(r.debut), f = new Date(r.fin);
        const pris = (S.rdv || []).some(x => x.id !== r.id && x.statut !== "annule" && !(window.__estVerrou && __estVerrou(x)) && new Date(x.debut) < f && new Date(x.fin) > d);
        if (pris) { e.stopPropagation(); e.preventDefault(); return dit("La place est prise maintenant : prends-lui un autre rendez-vous"); }
      }
      ATT = { id: r.id, s, t: Date.now() }; return;
    }
    if (s === "annule" && a.dataset.par !== "cliente_salon") return;
    if (s !== "annule" && s !== "absente") return;
    if (!fraisDe() || !r.cliente_id) return;
    const h = (new Date(r.debut) - Date.now()) / 36e5;
    if (s === "annule" && h >= delaiH()) return;   /* annulée à temps : pas de frais */
    ATT = { id: r.id, s, h, t: Date.now() };
  }, true);

  /* l'annulation est faite (la feuille est fermée, l'agenda relu) : on pose la question, ou on enlève les frais */
  setInterval(() => {
    if (!ATT) return;
    if (Date.now() - ATT.t > 8000) { ATT = null; return; }
    const r = (S.rdv || []).find(x => x.id === ATT.id);
    if (!r || r.statut !== ATT.s || E.classList.contains("fe")) return;
    const a = ATT; ATT = null;
    if (a.s === "prevu") return enleve(r);
    question(r, a);
  }, 150);

  function question(r, a) {
    const c = cliDe(r); if (!c) return;
    const m = fraisDe(), d = new Date(r.debut), qui = c.prenom || nomCli(c);
    Q = { id: r.id, c: c.id, m, q: a.s === "absente" ? `Pas venue le ${court(d)}` : `Annulation tardive du ${court(d)}` };
    const quand = a.s === "absente" ? `${qui} n’est pas venue` : a.h < 1 ? `${qui} annule moins d’1 h avant` : a.h < 24 ? `${qui} annule ${Math.round(a.h)} h avant` : `${qui} annule ${Math.round(a.h / 24)} jour${a.h >= 48 ? "s" : ""} avant`;
    ouvre(`<h3>${esc(quand)}</h3><div class="sous">Ta règle : annulation gratuite jusqu’à ${esc(regles().annulation)}</div>
      <div class="fa-box"><b>Frais : ${eu(m)}</b><small>Ils s’ajoutent à « À récupérer » : sur sa fiche, en haut de Clientes, et sur son prochain rendez-vous.</small></div>
      <button class="btn" data-fa="oui" style="margin-top:14px;width:100%">Oui, elle me doit ${eu(m)}</button>
      <button class="btn clair" data-fa="non" style="margin-top:8px;width:100%">Pas de frais cette fois</button>`);
  }
  async function enleve(r) {
    const c = cliDe(r); if (!c || !N()) return;
    const o = N().lit(c), avant = o.d.length; o.d = o.d.filter(x => x.rdv !== r.id); if (o.d.length === avant) return;
    if (await N().ecrit(c.id, o)) { rendu(); setTimeout(() => dit("Rendez-vous remis · les frais sont enlevés ✓"), 400); }
  }

  document.addEventListener("click", async e => {
    const b = e.target.closest && e.target.closest("[data-fa]"); if (!b) return;
    e.stopPropagation(); e.preventDefault();
    const q = Q; Q = null; if (!q) return ferme();
    if (b.dataset.fa === "non") { ferme(); return dit("Sans frais cette fois"); }
    const c = S.clientes.find(x => x.id === q.c); if (!c || !N()) return ferme();
    b.disabled = true;
    const o = N().lit(c); o.d = o.d.filter(x => x.rdv !== q.id).concat({ m: q.m, q: q.q, j: new Date().toISOString().slice(0, 10), rdv: q.id });
    if (!(await N().ecrit(c.id, o))) { b.disabled = false; Q = q; return; }
    ferme(); rendu(); dit(`Noté : ${c.prenom || nomCli(c)} te doit ${eu(q.m)}`);
  }, true);

  /* un rendez-vous annulé : « Remettre le rendez-vous » */
  const fr0 = feuilleRdv;
  feuilleRdv = function (id) {
    const v = fr0.apply(this, arguments);
    try { const r = rdvDe(id), s = E.querySelector(`.fc [data-a="rdv-suppr"][data-id="${id}"]`);
      if (r && r.statut === "annule" && s && !E.querySelector(".fc [data-fa-remet]")) {
        const p = s.closest(".petits") || s;
        p.insertAdjacentHTML("beforebegin", `<button class="btn" data-fa-remet data-a="statut" data-s="prevu" data-id="${esc(id)}" style="margin-top:14px;width:100%">Remettre le rendez-vous</button><div class="sous" style="margin-top:6px;font-size:12px">Elle a changé d’avis ? Le rendez-vous revient${(() => { const c = cliDe(r); return c && N() && N().lit(c).d.some(x => x.rdv === id) ? ", et les frais s’enlèvent" : ""; })()}.</div>`);
      } } catch (e) { console.error(e); }
    return v;
  };
})();
