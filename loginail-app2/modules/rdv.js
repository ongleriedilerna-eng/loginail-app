/* ===== 13/11 (Marie) Les rendez-vous : plusieurs prestations, modifier (prestations, prix, note), remplacer un rendez-vous annulé,
   « Pas venue » visible dans l'agenda, le nom ouvre la fiche, rouvrir des jours fermés. =====
   Plusieurs prestations : la 1re dans prestation_id, toutes dans titre (« Pose gel + Nail art »), durée et prix additionnés.
   La note va dans la colonne « note » (fichier sql 14) ; si elle n'existe pas encore sur le serveur, le reste s'enregistre quand même. */
(function () {
  const st = document.createElement("style");
  st.textContent = `.pap .pr.abs{background:repeating-linear-gradient(135deg,#F1ECE6 0 6px,#E9E2DA 6px 12px)!important;opacity:.75}
.pap .pr .tagx{display:inline-block;margin-left:6px;border-radius:999px;background:#1E1C1B;color:#fff;padding:1px 7px;font-size:10px;font-weight:500;letter-spacing:.04em;vertical-align:1px}
.rv-tot{display:flex;justify-content:space-between;margin-top:10px;font-size:13px;color:#6B625C}
.rv-note{margin-top:12px;border-radius:14px;background:#fff;padding:10px 13px;font-size:13.5px;line-height:1.45;text-align:left}.rv-note b{display:block;font-size:10px;letter-spacing:.14em;text-transform:uppercase;color:#8A847E;font-weight:500;margin-bottom:3px}
#E .fc .rv-duo{display:flex;gap:8px;margin-top:12px}
#E .fc .rv-duo .btn{flex:1 1 0;width:auto;min-width:0;height:46px;margin:0;border-radius:999px;white-space:nowrap}
.fc .fiche-t h3[data-cli]{cursor:pointer;text-decoration:underline;text-decoration-thickness:1px;text-underline-offset:4px}
.rv-hor{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:11px 11px 11px 16px;border-radius:18px;background:#fff;border:1px solid rgba(30,28,27,.1)}
.rv-hor b{display:block;font:400 26px/1.1 'Italiana','Cormorant Garamond',Georgia,serif;white-space:nowrap}
.rv-hor b i{font-style:normal;opacity:.45;margin:0 3px}
.rv-hor b span{display:inline-block}.rv-hor b span.pop{animation:rvpop .28s ease-out}
@keyframes rvpop{0%{transform:translateY(6px);opacity:.2}}
.rv-hor small{display:block;margin-top:3px;color:var(--gris);font-size:12.5px}
.rv-hor small button{color:inherit;text-decoration:underline;font:inherit;padding:0;background:none;border:0}
.rv-pas{display:flex;gap:8px;flex:none}
.rv-pas button{width:46px;height:46px;border-radius:50%;background:#fff;border:1px solid rgba(30,28,27,.14);font-size:22px;line-height:1;color:inherit;transition:transform .12s,opacity .2s}
.rv-pas button:active{transform:scale(.9)}.rv-pas button:disabled{opacity:.3}
.rv-lim{margin:6px 0 0 4px;color:var(--gris);font-size:12.5px}
@media(prefers-reduced-motion:reduce){.rv-hor b span.pop{animation:none}}`;
  document.head.appendChild(st);
  const P = () => prestasDispo(), parTitre = r => { const t = (r.titre || (r.prestations && r.prestations.nom) || "").split(" + "); return P().map((p, i) => t.includes(p.nom) ? i : -1).filter(i => i >= 0); };
  const somme = l => ({ duree: l.reduce((s, i) => s + (P()[i].duree || 60), 0) || 60, prix: l.length && l.every(i => P()[i].prix == null) ? null : l.reduce((s, i) => s + (+P()[i].prix || 0), 0), nom: l.map(i => P()[i].nom).join(" + ") });

  /* 1 · nouveau rendez-vous : on peut toucher plusieurs prestations */
  let SEL = [];
  const majTot = () => { const z = document.querySelector(".fc .rv-tot"); if (!z) return; const t = somme(SEL); z.innerHTML = SEL.length ? `<span>${SEL.length > 1 ? SEL.length + " prestations · " : ""}${duree(t.duree)}</span><b>${euros(t.prix)}</b>` : ""; };
  new MutationObserver(() => { const c = document.querySelector(".fc .chips"); if (!c || c.dataset.multi || !c.querySelector("[data-np]")) return;   /* 22/11 : seulement les prestations, pas les pastilles de durée */ c.dataset.multi = "1"; SEL = []; c.insertAdjacentHTML("afterend", '<div class="rv-tot"></div>');
    const lab = c.previousElementSibling; if (lab && lab.classList.contains("lab2")) lab.innerHTML = 'Prestations <small style="text-transform:none;letter-spacing:0;opacity:.6">' + (c.classList.contains("n-glisse") ? "une ou plusieurs · glisse pour voir les autres" : "touches-en une ou plusieurs") + '</small>'; }).observe(document.body, { childList: true, subtree: true });
  document.addEventListener("click", e => { const b = e.target.closest && e.target.closest(".fc .chips[data-multi] [data-np]"); if (!b) return; e.stopPropagation(); const i = +b.dataset.np, k = SEL.indexOf(i);
    if (k >= 0) SEL.splice(k, 1); else SEL.push(i); b.classList.toggle("on", k < 0);
    const t = somme(SEL); N.presta = SEL.length ? { id: P()[SEL[0]].id, nom: t.nom, duree: t.duree, prix: t.prix } : null; majTot(); if (typeof nFin === "function") nFin(); }, true);

  /* 2 · le rendez-vous : Modifier, la note, le nom qui ouvre la fiche, remplacer s'il est annulé */
  new MutationObserver(() => { const z = document.querySelector(".fc .fiche-t"); if (!z || z.dataset.rvx) return; z.dataset.rvx = "1";
    const id = (document.querySelector('.fc [data-a="statut"]') || document.querySelector('.fc [data-a="decaler"]') || document.querySelector('.fc [data-a="rdv-suppr"]') || {}).dataset?.id; const r = id && (S.rdv.find(x => x.id === id) || (S.cloche || []).find(x => x.id === id)); if (!r) return;
    const h = z.querySelector("h3"); if (h && r.cliente_id) h.dataset.cli = r.cliente_id;   /* 25/11 (Marie) : plus de « Voir sa fiche › », toucher le nom suffit */
    let x = ""; if (r.note) x += `<div class="rv-note"><b>Note</b>${esc(r.note)}</div>`;
    if (r.statut === "annule" && r.cliente_id) x += `<button class="btn" data-rv="remplacer" data-id="${r.id}" style="margin-top:14px">Mettre une autre cliente à la place</button>`;
    /* 22/11 (Marie) : deux pilules sur la même ligne, « Modifier » et « Déplacer » */
    let duo = "";
    if (r.cliente_id && r.statut !== "annule") duo += `<button class="btn clair" data-rv="modifier" data-id="${r.id}" aria-label="Modifier le rendez-vous">Modifier</button>`;
    /* 13/11 (Marie) : Déplacer bien visible, à côté de Modifier (le petit « Décaler » du bas disparaît) */
    if (r.statut === "prevu") { duo += `<button class="btn clair" data-a="decaler" data-id="${r.id}" aria-label="Déplacer le rendez-vous">Déplacer</button>`; const pd = document.querySelector('.fc .petits [data-a="decaler"]'); if (pd) pd.remove(); }
    if (duo) x += `<div class="rv-duo">${duo}</div>`;
    { const c = r.cliente_id && S.clientes.find(y => y.id === r.cliente_id); if (c && window.__fid && __fid.on() && r.statut !== "annule") { const e = __fid.etat(c);
      x += `<div class="rv-fid"><span>Fidélité · <b>${e.fait}</b> sur ${e.f.n}${e.pret ? ` · carte complète : ${esc(e.f.cadeau)}` : ""}</span><button data-rv="fid-plus" data-id="${r.id}">+ 1 point</button></div>${r.statut === "prevu" ? `<div class="rv-fid-n">« C’est fini » ajoute aussi 1 point tout seul.</div>` : ""}`; } }
    z.insertAdjacentHTML("afterend", x); }).observe(document.body, { childList: true, subtree: true });

  /* 24/11 (Marie, D113) : « Horaire » 10:00 → 11:30 avec − / + (15 min) : une cliente plus lente garde son vrai temps.
     La durée part de la vraie durée du rendez-vous (avant, « Enregistrer » la remettait à celle de la prestation).
     Le + s'arrête au rendez-vous suivant ; changer de prestation remet la durée prévue. */
  let MD = null;
  const hh = d => d.getHours() + ":" + String(d.getMinutes()).padStart(2, "0");
  const prevue = () => MD.sel.length ? somme(MD.sel).duree + (window.plusCliente ? plusCliente(S.clientes.find(c => c.id === MD.r.cliente_id)) : 0) : MD.d0;   /* + le temps en plus de la cliente (D114) */
  const suivant = () => { const deb = new Date(MD.r.debut); return S.rdv.filter(x => x.id !== MD.r.id && x.statut !== "annule" && new Date(x.debut) >= deb && new Date(x.debut).toDateString() === deb.toDateString()).map(x => new Date(x.debut)).sort((a, b) => a - b)[0] || null; };
  const horaire = pop => { const z = document.querySelector("#rv-hor"); if (!z) return; const deb = new Date(MD.r.debut), fin = new Date(+deb + MD.dur * 60000), pv = prevue(), nx = suivant(), bloque = nx && +deb + (MD.dur + 15) * 60000 > +nx;
    z.innerHTML = `<div class="rv-hor"><div><b>${hh(deb)}<i>→</i><span${pop ? ' class="pop"' : ""}>${hh(fin)}</span></b>
      <small>${duree(MD.dur)}${MD.dur !== pv ? ` · prévu ${duree(pv)} · <button data-rv="dur" data-d="${pv}">remettre</button>` : " · comme prévu"}</small></div>
      <div class="rv-pas"><button data-rv="dur" data-d="${MD.dur - 15}" aria-label="15 minutes de moins"${MD.dur <= 15 ? " disabled" : ""}>−</button><button data-rv="dur" data-d="${MD.dur + 15}" aria-label="15 minutes de plus"${bloque ? " disabled" : ""}>+</button></div></div>
      ${bloque ? `<div class="rv-lim">${esc(nomRdv(S.rdv.find(x => +new Date(x.debut) === +nx && x.statut !== "annule" && x.id !== MD.r.id)) || "Le rendez-vous suivant")} arrive à ${hh(nx)}</div>` : ""}`; };
  const feuilleModif = r => { const d0 = Math.max(15, Math.round((new Date(r.fin) - new Date(r.debut)) / 60000) || 60); MD = { r, sel: parTitre(r), d0, dur: d0 }; const t = somme(MD.sel);
    ouvre(`<h3>Modifier le rendez-vous</h3><div class="sous">${esc(nomRdv(r))}</div>
      <div class="lab2">Prestations <small style="text-transform:none;letter-spacing:0;opacity:.6">touches-en une ou plusieurs</small></div>
      <div class="chips">${P().map((p, i) => `<button class="chip${MD.sel.includes(i) ? " on" : ""}" data-rvp="${i}">${esc(p.nom)}<span>${duree(p.duree || 60)}</span></button>`).join("")}</div>
      <div class="lab2">Horaire</div><div id="rv-hor"></div>
      <div class="lab2">Prix</div><input class="champ" id="rv-prix" inputmode="decimal" value="${r.prix ?? t.prix ?? ""}" style="font-size:16px;width:100%;box-sizing:border-box">
      <div class="lab2">Note <small style="text-transform:none;letter-spacing:0;opacity:.6">facultatif</small></div><textarea class="msg" id="rv-note" style="height:80px" placeholder="Par exemple : veut du rouge, 10 minutes de retard la dernière fois">${esc(r.note || "")}</textarea>
      <button class="btn" data-rv="ok" style="margin-top:14px">Enregistrer</button>`); horaire(); };

  document.addEventListener("click", async e => { const a = e.target.closest && e.target.closest("[data-rv],[data-rvp]"); if (!a) return; e.stopPropagation();
    if (a.dataset.rvp != null) { const i = +a.dataset.rvp, k = MD.sel.indexOf(i); if (k >= 0) MD.sel.splice(k, 1); else MD.sel.push(i); a.classList.toggle("on", k < 0); const p = document.querySelector("#rv-prix"); if (p && MD.sel.length) p.value = somme(MD.sel).prix; MD.dur = prevue(); horaire(true); return; }
    const k = a.dataset.rv, r = S.rdv.find(x => x.id === a.dataset.id) || (MD && MD.r);
    if (k === "dur") { if (a.disabled) return; MD.dur = Math.max(15, +a.dataset.d); horaire(true); return; }
    if (k === "modifier") feuilleModif(r);
    else if (k === "remplacer") { const d = new Date(r.debut); S.jour = new Date(d); S.jour.setHours(0, 0, 0, 0); feuilleNouveau(d.getHours() * 60 + d.getMinutes()); }
    else if (k === "ok") { const r0 = MD.r, t = MD.sel.length ? somme(MD.sel) : null, deb = new Date(r0.debut), prix = parseFloat(String(document.querySelector("#rv-prix").value).replace(",", ".")), note = document.querySelector("#rv-note").value.trim();
      const v = { prix: isNaN(prix) ? null : prix, fin: new Date(+deb + MD.dur * 60000).toISOString() }; if (t) Object.assign(v, { prestation_id: P()[MD.sel[0]].id, titre: t.nom });
      if (+new Date(v.fin) !== +new Date(r0.fin) && S.rdv.some(x => x.id !== r0.id && x.statut !== "annule" && new Date(x.debut) < new Date(v.fin) && new Date(x.fin) > deb)) return dit("La nouvelle durée déborde sur un autre rendez-vous");
      a.disabled = true; let { error } = await sb.from("rendez_vous").update(Object.assign({}, v, { note: note || null })).eq("id", r0.id);
      if (error && /note/.test(error.message || "")) { ({ error } = await sb.from("rendez_vous").update(v).eq("id", r0.id)); if (!error) dit("Enregistré (la note sera disponible bientôt)"); }
      if (error) { a.disabled = false; return dit("Oups, ça n’a pas marché. Réessaie."); }
      await chargeSemaine(); chargeVisites(); ferme(); rendu(); dit("Rendez-vous modifié ✓"); } }, true);

  /* 3 · l'agenda : « Pas venue » et « Annulé » écrits sur le rendez-vous ; la note en petit */
  const ag0 = VUES.ag;
  VUES.ag = () => { let h = ag0(); S.rdv.forEach(r => { const re = new RegExp(`(<div class="pr[^"]*)("[^>]*data-rdv="${r.id}"[^>]*>)([\\s\\S]*?)(</b>)`);
      if (r.statut === "absente") h = h.replace(re, (m, a, b, c, d) => a + ' abs' + b + c + '<em class="tagx">Pas venue</em>' + d);
      else if (r.statut === "annule" && r.cliente_id) h = h.replace(re, (m, a, b, c, d) => a + b + c + '<em class="tagx" style="background:#8A847E">Annulé</em>' + d);
      else if (r.statut === "fini") h = h.replace(re, (m, a, b, c, d) => a + b + c + '<em class="tagx" style="background:#E3DBD2;color:#1E1C1B">Fini</em>' + d); }); return h; };

  /* 4 · congés : rouvrir des jours fermés d'un coup */
  new MutationObserver(() => { const b = document.querySelector('.fc [data-su="cg-ok"]'); if (!b || document.querySelector(".fc .rv-ferm")) return;
    const now = new Date(); now.setHours(0, 0, 0, 0); const F = (S.tous || []).concat(S.rdv).filter((r, i, l) => !r.cliente_id && /^Fermé/.test(r.titre || "") && r.statut !== "annule" && new Date(r.debut) >= now && l.findIndex(x => x.id === r.id) === i).sort((x, y) => x.debut.localeCompare(y.debut));
    if (!F.length) return; const G = []; F.forEach(r => { const d = new Date(r.debut), g = G[G.length - 1]; if (g && (d - g.fin) <= 864e5 * 1.5 && g.t === r.titre) { g.fin = d; g.ids.push(r.id); } else G.push({ deb: d, fin: d, t: r.titre, ids: [r.id] }); });
    const j = d => `${d.getDate()} ${MOIS[d.getMonth()]}`;
    b.insertAdjacentHTML("afterend", `<div class="rv-ferm"><div class="lab2" style="margin-top:22px">Déjà fermé</div><div class="su-carte">${G.map(g => `<div class="su-lg"><div>${g.ids.length > 1 ? "Du " + j(g.deb) + " au " + j(g.fin) : j(g.deb)}<span>${esc(g.t.replace(/^Fermé · /, ""))}</span></div><button class="su-b" data-rvf="${g.ids.join(",")}">Rouvrir</button></div>`).join("")}</div></div>`); }).observe(document.body, { childList: true, subtree: true });
  document.addEventListener("click", async e => { const a = e.target.closest && e.target.closest("[data-rvf]"); if (!a) return; e.stopPropagation(); const ids = a.dataset.rvf.split(","); a.disabled = true;
    const { error } = await sb.from("rendez_vous").delete().in("id", ids); if (error) { a.disabled = false; return dit("Oups, ça n’a pas marché. Réessaie."); }
    await chargeSemaine(); chargeVisites(); ferme(); rendu(); dit(ids.length > 1 ? ids.length + " jours rouverts ✓" : "Jour rouvert ✓"); }, true);
})();

/* ===== 13/11 (Marie) : après « Encaisser », on propose le prochain rendez-vous ; les jours fermés sont grisés ===== */
(function () {
  const st = document.createElement("style");
  st.textContent = `.semaine button.fj{opacity:.38}.semaine button.fj b{text-decoration:line-through;text-decoration-thickness:1px}
.pap.pap-ferme{background:repeating-linear-gradient(135deg,rgba(30,28,27,.035) 0 7px,transparent 7px 14px)}`;
  document.head.appendChild(st);
  const hor = d => ((S.site && S.site.donnees && S.site.donnees.horaires) || (brouillon() || {}).horaires || [])[(d.getDay() + 6) % 7];
  const ag1 = VUES.ag;
  VUES.ag = () => { let h = ag1().replace(/(<button class=")([^"]*)(" data-jour="([^"]+)")/g, (m, a, c, b, iso) => hor(new Date(iso)) === null ? a + c + " fj" + b : m);
    if (hor(S.jour) === null) h = h.replace('<div class="pap">', '<div class="pap pap-ferme">'); return h; };
  /* encaisser : on retient le rendez-vous, puis on propose le suivant (comme après « C'est fini ») */
  let ENC = null;
  const propose = () => { const r = ENC && S.rdv.find(x => x.id === ENC); ENC = null; if (!r || !r.cliente_id) return; const b = document.querySelector('.fc [data-su="rep-ok"]'); if (b) return;
    const ev = new MouseEvent("click", { bubbles: true }), f = document.createElement("button"); f.dataset.a = "statut"; f.dataset.s = "fini"; f.dataset.id = r.id; f.style.display = "none";
    /* on réutilise la feuille « Son prochain rendez-vous ? » de suite.js, sans rien changer au rendez-vous */
    document.dispatchEvent(new CustomEvent("loginail-reprendre", { detail: r })); };
  document.addEventListener("click", e => { const t = e.target.closest ? e.target : null; if (!t) return;
    const en = t.closest('[data-a="encaisser"]'); if (en) { ENC = en.dataset.id; return; }
    if (t.closest('[data-a="encaisser-ok"]')) { setTimeout(() => { if (ENC && !E.classList.contains("fe")) propose(); }, 1400); return; }
    const ok = t.closest('.fc [data-a="fermer"]'); if (ok && ENC && /encaiss/i.test(ok.textContent)) setTimeout(propose, 350); }, true);
})();

/* ===== 13/11 (Marie, idée B) : « + 1 point » de fidélité dans le rendez-vous ===== */
(function () {
  const st = document.createElement("style");
  st.textContent = `.rv-fid{display:flex;align-items:center;justify-content:space-between;gap:10px;background:#fff;border-radius:16px;padding:11px 12px 11px 14px;font-size:14px;margin-top:12px}
.rv-fid b{font-weight:500}.rv-fid button{flex:none;border:0;background:var(--acc,#1E1C1B);color:#fff;border-radius:99px;padding:8px 13px;font:inherit;font-size:12.5px}
.rv-fid-n{font-size:12px;opacity:.6;margin:6px 2px 0;text-align:left}`;
  document.head.appendChild(st);
  document.addEventListener("click", async e => { const a = e.target.closest && e.target.closest('[data-rv="fid-plus"]'); if (!a) return; e.stopPropagation(); e.preventDefault();
    const r = S.rdv.find(x => x.id === a.dataset.id), c = r && S.clientes.find(y => y.id === r.cliente_id); if (!c) return; a.disabled = true;
    await __fid.plus(c); const ev = __fid.etat(c), z = a.closest(".rv-fid");
    if (z) z.querySelector("span").innerHTML = `Fidélité · <b>${ev.fait}</b> sur ${ev.f.n}${ev.pret ? ` · carte complète : ${esc(ev.f.cadeau)}` : ""}`;
    a.disabled = false; dit(ev.pret ? `Carte complète ! ${ev.f.cadeau} pour ${c.prenom || "elle"}` : `+1 point · ${ev.fait} sur ${ev.f.n}`); }, true);
})();
