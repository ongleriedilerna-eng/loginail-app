/* ===== 24/11 (Marie, version 1 : maquettes/retours-2411/rapide-1.html) : l'ajout rapide =====
   Sous « Bloquer ce créneau », les clientes qui devraient revenir bientôt, d'après leur rythme (celle qui vient toutes les 3 semaines…).
   Toucher une cliente → « Ajouter Camille à 10h » → le rendez-vous est posé comme d'habitude : même prestation, même durée, même prix que sa dernière visite.
   Pas proposées : celles qui ont déjà un rendez-vous à venir, celles venues moins de 2 fois, celles qui ne sont pas revenues depuis plus de 4 mois.
   Aucun message ne part (comme « Nouveau rendez-vous »). On ne lit que ce que l'appli a déjà (S.tous, S.rdv, S.clientes). */
(function () {
  const MIN_VISITES = 2, OUBLIEE = 120, MONTRE = 3, MAX = 6;
  const st = document.createElement("style");
  st.textContent = `#E .ar-t{display:flex;align-items:baseline;justify-content:space-between;margin:20px 2px 8px}
#E .ar-t b{font-size:11.5px;letter-spacing:.12em;text-transform:uppercase;color:#776D64;font-weight:400}
#E .ar-t small{font-size:12px;color:#9A918A}
#E .ar{display:flex;flex-direction:column;gap:8px}
#E .ar-c{display:flex;align-items:center;gap:12px;width:100%;padding:10px 12px;border-radius:18px;background:#fff;border:1px solid transparent;color:inherit;font:inherit;text-align:left;cursor:pointer;transition:border-color .2s,transform .12s}
#E .ar-c:active{transform:scale(.98)}
#E .ar-c .av{flex:none;width:40px;height:40px;border-radius:50%;display:grid;place-items:center;background:var(--v-rose,#F5E6E4);color:var(--v-acc,#B5475E);font-weight:500;font-size:16px}
#E .ar-c .tx{flex:1;min-width:0}
#E .ar-c .tx b{display:block;font-weight:500;font-size:15px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
#E .ar-c .tx span{display:block;font-size:12.5px;line-height:1.3;color:#776D64;margin-top:1px;overflow-wrap:anywhere}
#E .ar-c .tx em{font-style:normal;color:var(--v-acc,#B5475E)}
#E .ar-c .plus{flex:none;width:34px;height:34px;border-radius:50%;background:var(--v-fonce,#1E1C1B);color:#fff;display:grid;place-items:center;font-size:20px;line-height:1;transition:transform .2s,background .2s}
#E .ar-c.on{border-color:var(--v-fonce,#1E1C1B)}
#E .ar-c.on .plus{transform:rotate(45deg);background:var(--v-acc,#B5475E)}
#E .ar-c.non{opacity:.55}
#E .ar-ok{display:grid;grid-template-rows:0fr;transition:grid-template-rows .26s cubic-bezier(.2,.8,.2,1)}
#E .ar-ok>div{overflow:hidden}
#E .ar-ok.on{grid-template-rows:1fr}
#E .ar-ok p{margin:2px 4px 0;padding:10px 12px;border-radius:14px;background:var(--v-rose,#F5E6E4);font-size:13px;line-height:1.4;text-align:left}
#E .ar-ok .btn{height:46px;margin:8px 0 4px;font-size:14.5px;width:100%}
#E .ar-voir{display:block;margin:10px auto 0;border:0;background:none;font:inherit;font-size:13px;color:#6B625C;text-decoration:underline;text-underline-offset:3px;cursor:pointer}
#E .ar-note{margin:12px 4px 0;font-size:12px;line-height:1.4;color:#8A817A;text-align:center}
@media (prefers-reduced-motion:reduce){#E .ar-ok,#E .ar-c .plus{transition:none}}`;
  document.head.appendChild(st);

  const J = 864e5;
  const du = m => m < 60 ? m + " min" : Math.floor(m / 60) + " h" + (m % 60 ? " " + String(m % 60).padStart(2, "0") : "");
  const hC = m => Math.floor(m / 60) + "h" + (m % 60 ? String(m % 60).padStart(2, "0") : "");
  const rythme = j => j % 7 === 0 && j <= 70 ? (j === 7 ? "toutes les semaines" : `toutes les ${j / 7} semaines`) : j >= 28 && j <= 32 ? "tous les mois" : `tous les ${j} jours`;
  const MC = ["janv.", "févr.", "mars", "avr.", "mai", "juin", "juil.", "août", "sept.", "oct.", "nov.", "déc."];
  const date = d => `${d.getDate() === 1 ? "1er" : d.getDate()} ${MC[d.getMonth()]}`;
  /* une vraie date, pas « dans 2 jours » (2 jours après quoi ?) */
  const quand = x => { const auj = new Date(new Date().toDateString()); return x.attendu < auj ? `Elle aurait dû revenir <em>le ${date(x.attendu)}</em>` : x.ecart === 0 ? "Elle devrait revenir <em>ce jour-là</em>" : `Elle devrait revenir <em>vers le ${date(x.attendu)}</em>`; };

  let L = [], ouvert = -1, tous = false;

  /* les clientes qui devraient revenir, la plus proche du jour touché en premier */
  function liste(jour) {
    const now = new Date(), tout = new Map();
    (S.tous || []).concat(S.rdv || []).forEach(r => tout.set(r.id, r));
    const par = new Map();
    tout.forEach(r => { if (!r.cliente_id || r.statut === "annule") return; (par.get(r.cliente_id) || par.set(r.cliente_id, []).get(r.cliente_id)).push(r); });
    const out = [];
    par.forEach((l, id) => {
      if (l.some(r => r.statut === "prevu" && new Date(r.fin) > now)) return;   /* elle a déjà son rendez-vous */
      const v = l.filter(r => r.statut !== "absente" && new Date(r.debut) < now).sort((a, b) => a.debut.localeCompare(b.debut));
      if (v.length < MIN_VISITES) return;
      const c = S.clientes.find(x => x.id === id); if (!c) return;
      const ecarts = v.slice(1).map((r, i) => Math.round((new Date(r.debut) - new Date(v[i].debut)) / J)).filter(x => x >= 5).slice(-4).sort((a, b) => a - b);
      if (!ecarts.length) return;
      const ry = ecarts[Math.floor(ecarts.length / 2)], der = v[v.length - 1], depuis = Math.round((now - new Date(der.debut)) / J);
      if (depuis > Math.max(OUBLIEE, ry * 2.5)) return;
      const attendu = new Date(+new Date(new Date(der.debut).toDateString()) + ry * J), ecart = Math.round((attendu - jour) / J);
      out.push({ c, der, ry, ecart, attendu, dur: Math.max(15, Math.round((new Date(der.fin) - new Date(der.debut)) / 60000)) });
    });
    return out.sort((a, b) => Math.abs(a.ecart) - Math.abs(b.ecart) || a.ecart - b.ecart).slice(0, MAX);
  }
  const libre = (deb, fin) => !(S.rdv || []).some(r => r.statut !== "annule" && new Date(r.debut) < fin && new Date(r.fin) > deb);
  const minute = () => { const q = E.querySelector('.fc [data-s5="quart"].on'); return q ? +q.dataset.m : null; };
  const debutDe = m => { const d = new Date(S.jour); d.setHours(0, m, 0, 0); return d; };

  function bloc() {
    const m = minute(); if (m == null) return "";
    const vus = tous ? L : L.slice(0, MONTRE);
    return `<div class="ar-t"><b>Ajout rapide</b><small>elles devraient revenir</small></div><div class="ar">${vus.map((x, i) => {
      const deb = debutDe(m), fin = new Date(+deb + x.dur * 60000), ok = libre(deb, fin), p = prixDe(x.der.prix), titre = x.der.titre || titreRdv(x.der) || ((S.prestations || []).find(p => p.id === x.der.prestation_id) || {}).nom || "Comme d’habitude";
      return `<div><button type="button" class="ar-c${ouvert === i ? " on" : ""}${ok ? "" : " non"}" data-ar="${i}" aria-expanded="${ouvert === i}"><span class="av">${esc(String(x.c.prenom || nomCli(x.c) || "?").charAt(0).toUpperCase())}</span>
        <span class="tx"><b>${esc(nomCli(x.c))}</b><span>${ok ? quand(x) : `Pas assez de place : il lui faut ${du(x.dur)}`}</span><span>${esc(titre)} · ${rythme(x.ry)}</span></span><span class="plus" aria-hidden="true">+</span></button>
        <div class="ar-ok${ouvert === i ? " on" : ""}"><div><p>${esc(x.c.prenom || nomCli(x.c))} ${esc(JOURS[(S.jour.getDay() + 6) % 7].toLowerCase())} à <b>${hC(m)}</b> · ${esc(titre)}<br>${hC(m)} – ${hC(m + x.dur)}${p == null ? "" : " · " + euros(p)}</p>
        ${ok ? `<button type="button" class="btn" data-ar-ok="${i}"${ouvert === i ? "" : ' tabindex="-1" aria-hidden="true"'}>Ajouter ${esc(x.c.prenom || nomCli(x.c))} à ${hC(m)}</button>` : ""}</div></div></div>`; }).join("")}</div>
      ${!tous && L.length > MONTRE ? `<button type="button" class="ar-voir" data-ar-tous>Voir les autres</button>` : ""}
      <div class="ar-note">D’après le rythme de chaque cliente. Celles qui ont déjà un rendez-vous ne sont pas proposées.</div>`;
  }
  const redessine = () => { const z = E.querySelector(".fc .ar-z"); if (z) z.innerHTML = bloc(); };

  /* la fenêtre « 10h · Nouveau rendez-vous · Bloquer » vient de s'ouvrir : on ajoute la liste dessous */
  new MutationObserver(() => {
    const fc = E.querySelector(".feuille .fc"); if (!fc || fc.querySelector(".ar-z") || !fc.querySelector("#s5-h") || !fc.querySelector('[data-s5="bloquer"]')) return;
    const j = new Date(S.jour); j.setHours(0, 0, 0, 0);
    L = liste(j); ouvert = -1; tous = false;
    if (!L.length) return;
    (fc.querySelector("[data-s5p]") || fc.querySelector('[data-s5="bloquer"]')).insertAdjacentHTML("afterend", '<div class="ar-z"></div>');
    redessine();
  }).observe(E, { childList: true, subtree: true });

  let envoi = false;
  document.addEventListener("click", async e => {
    const t = e.target; if (!t.closest || !t.closest(".fc")) return;
    if (t.closest('[data-s5="quart"]')) return setTimeout(redessine);   /* l'heure change : la fin et la place aussi */
    const c = t.closest("[data-ar]"); if (c) { e.stopPropagation(); ouvert = ouvert === +c.dataset.ar ? -1 : +c.dataset.ar; return redessine(); }
    if (t.closest("[data-ar-tous]")) { e.stopPropagation(); tous = true; return redessine(); }
    const ok = t.closest("[data-ar-ok]"); if (!ok) return;
    e.stopPropagation(); if (envoi) return;
    const x = L[+ok.dataset.arOk], m = minute(); if (!x || m == null) return;
    const deb = debutDe(m), fin = new Date(+deb + x.dur * 60000);
    if (!libre(deb, fin)) return dit("Ce créneau est déjà pris");
    envoi = true; ok.disabled = true; ok.textContent = "Un instant…";
    try {
      /* relu juste avant : une cliente a pu réserver en ligne pendant ce temps */
      const { data: pris, error: e1 } = await sb.from("rendez_vous").select("id,statut,titre,cliente_id").lt("debut", fin.toISOString()).gt("fin", deb.toISOString());
      if (e1) throw e1;
      if ((pris || []).some(r => r.statut !== "annule" && !(window.__estVerrou && __estVerrou(r)))) { await chargeSemaine(); ferme(); rendu(); return dit("Ce créneau vient d’être pris"); }
      const { error } = await sb.from("rendez_vous").insert({ cliente_id: x.c.id, prestation_id: x.der.prestation_id || null, titre: x.der.titre || null, debut: deb.toISOString(), fin: fin.toISOString(), prix: x.der.prix ?? null });
      if (error) throw error;
      ferme(); await chargeSemaine(); chargeVisites(); rendu();
      dit(`${x.c.prenom || nomCli(x.c)} ajoutée à ${hC(m)} ✓`);
    } catch (err) { console.error(err); ok.disabled = false; ok.textContent = `Ajouter ${x.c.prenom || nomCli(x.c)} à ${hC(m)}`; dit("Oups, ça n’a pas marché. Réessaie."); }
    finally { envoi = false; }
  }, true);
})();
