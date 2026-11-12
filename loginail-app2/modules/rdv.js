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
.fc .fiche-t h3[data-cli]{cursor:pointer;text-decoration:underline;text-decoration-thickness:1px;text-underline-offset:4px}`;
  document.head.appendChild(st);
  const P = () => prestasDispo(), parTitre = r => { const t = (r.titre || (r.prestations && r.prestations.nom) || "").split(" + "); return P().map((p, i) => t.includes(p.nom) ? i : -1).filter(i => i >= 0); };
  const somme = l => ({ duree: l.reduce((s, i) => s + (P()[i].duree || 60), 0) || 60, prix: l.reduce((s, i) => s + (+P()[i].prix || 0), 0), nom: l.map(i => P()[i].nom).join(" + ") });

  /* 1 · nouveau rendez-vous : on peut toucher plusieurs prestations */
  let SEL = [];
  const majTot = () => { const z = document.querySelector(".fc .rv-tot"); if (!z) return; const t = somme(SEL); z.innerHTML = SEL.length ? `<span>${SEL.length > 1 ? SEL.length + " prestations · " : ""}${duree(t.duree)}</span><b>${euros(t.prix)}</b>` : ""; };
  new MutationObserver(() => { const c = document.querySelector(".fc .chips"); if (!c || c.dataset.multi) return; c.dataset.multi = "1"; SEL = []; c.insertAdjacentHTML("afterend", '<div class="rv-tot"></div>');
    const lab = c.previousElementSibling; if (lab && lab.classList.contains("lab2")) lab.innerHTML = 'Prestations <small style="text-transform:none;letter-spacing:0;opacity:.6">touchez-en une ou plusieurs</small>'; }).observe(document.body, { childList: true, subtree: true });
  document.addEventListener("click", e => { const b = e.target.closest && e.target.closest(".fc .chips[data-multi] [data-np]"); if (!b) return; e.stopPropagation(); const i = +b.dataset.np, k = SEL.indexOf(i);
    if (k >= 0) SEL.splice(k, 1); else SEL.push(i); b.classList.toggle("on", k < 0);
    const t = somme(SEL); N.presta = SEL.length ? { id: P()[SEL[0]].id, nom: t.nom, duree: t.duree, prix: t.prix } : null; majTot(); }, true);

  /* 2 · le rendez-vous : Modifier, la note, le nom qui ouvre la fiche, remplacer s'il est annulé */
  new MutationObserver(() => { const z = document.querySelector(".fc .fiche-t"); if (!z || z.dataset.rvx) return; z.dataset.rvx = "1";
    const id = (document.querySelector('.fc [data-a="statut"]') || document.querySelector('.fc [data-a="decaler"]') || {}).dataset?.id; const r = id && S.rdv.find(x => x.id === id); if (!r) return;
    const h = z.querySelector("h3"); if (h && r.cliente_id) { h.dataset.cli = r.cliente_id; const so = h.nextElementSibling; (so || h).insertAdjacentHTML("afterend", `<button class="lien-t" data-cli="${r.cliente_id}" style="display:block;margin:4px 0 0;padding:2px 0;text-align:left;font-size:13px">Voir sa fiche ›</button>`); }
    let x = ""; if (r.note) x += `<div class="rv-note"><b>Note</b>${esc(r.note)}</div>`;
    if (r.statut === "annule" && r.cliente_id) x += `<button class="btn" data-rv="remplacer" data-id="${r.id}" style="margin-top:14px">Mettre une autre cliente à la place</button>`;
    if (r.cliente_id && r.statut !== "annule") x += `<button class="btn clair" data-rv="modifier" data-id="${r.id}" style="margin-top:12px">Modifier le rendez-vous</button>`;
    z.insertAdjacentHTML("afterend", x); }).observe(document.body, { childList: true, subtree: true });

  let MD = null;
  const feuilleModif = r => { MD = { r, sel: parTitre(r) }; const t = somme(MD.sel);
    ouvre(`<h3>Modifier le rendez-vous</h3><div class="sous">${esc(nomRdv(r))}</div>
      <div class="lab2">Prestations <small style="text-transform:none;letter-spacing:0;opacity:.6">touchez-en une ou plusieurs</small></div>
      <div class="chips">${P().map((p, i) => `<button class="chip${MD.sel.includes(i) ? " on" : ""}" data-rvp="${i}">${esc(p.nom)}<span>${duree(p.duree || 60)}</span></button>`).join("")}</div>
      <div class="lab2">Prix</div><input class="champ" id="rv-prix" inputmode="decimal" value="${r.prix ?? t.prix ?? ""}" style="font-size:16px;width:100%;box-sizing:border-box">
      <div class="lab2">Note <small style="text-transform:none;letter-spacing:0;opacity:.6">facultatif</small></div><textarea class="msg" id="rv-note" style="height:80px" placeholder="Par exemple : veut du rouge, 10 minutes de retard la dernière fois">${esc(r.note || "")}</textarea>
      <button class="btn" data-rv="ok" style="margin-top:14px">Enregistrer</button>`); };

  document.addEventListener("click", async e => { const a = e.target.closest && e.target.closest("[data-rv],[data-rvp]"); if (!a) return; e.stopPropagation();
    if (a.dataset.rvp != null) { const i = +a.dataset.rvp, k = MD.sel.indexOf(i); if (k >= 0) MD.sel.splice(k, 1); else MD.sel.push(i); a.classList.toggle("on", k < 0); const p = document.querySelector("#rv-prix"); if (p && MD.sel.length) p.value = somme(MD.sel).prix; return; }
    const k = a.dataset.rv, r = S.rdv.find(x => x.id === a.dataset.id) || (MD && MD.r);
    if (k === "modifier") feuilleModif(r);
    else if (k === "remplacer") { const d = new Date(r.debut); S.jour = new Date(d); S.jour.setHours(0, 0, 0, 0); feuilleNouveau(d.getHours() * 60 + d.getMinutes()); }
    else if (k === "ok") { const r0 = MD.r, t = MD.sel.length ? somme(MD.sel) : null, deb = new Date(r0.debut), prix = parseFloat(String(document.querySelector("#rv-prix").value).replace(",", ".")), note = document.querySelector("#rv-note").value.trim();
      const v = { prix: isNaN(prix) ? null : prix }; if (t) Object.assign(v, { prestation_id: P()[MD.sel[0]].id, titre: t.nom, fin: new Date(+deb + t.duree * 60000).toISOString() });
      if (t && S.rdv.some(x => x.id !== r0.id && x.statut !== "annule" && new Date(x.debut) < new Date(v.fin) && new Date(x.fin) > deb)) return dit("La nouvelle durée déborde sur un autre rendez-vous");
      a.disabled = true; let { error } = await sb.from("rendez_vous").update(Object.assign({}, v, { note: note || null })).eq("id", r0.id);
      if (error && /note/.test(error.message || "")) { ({ error } = await sb.from("rendez_vous").update(v).eq("id", r0.id)); if (!error) dit("Enregistré (la note sera disponible bientôt)"); }
      if (error) { a.disabled = false; return dit("Oups, ça n’a pas marché. Réessayez."); }
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
    const { error } = await sb.from("rendez_vous").delete().in("id", ids); if (error) { a.disabled = false; return dit("Oups, ça n’a pas marché. Réessayez."); }
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
