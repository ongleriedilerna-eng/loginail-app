/* ===== 12/11 (Marie) La suite de l'appli : K l'accueil (ma journée, mes trous libres) · J « À relancer » (+ mon message, dans les Réglages) ·
   I mon bilan · H reprendre rendez-vous après « C'est fini » · G poser des congés · faire glisser un rendez-vous dans l'agenda. =====
   S.tous = tous les rendez-vous du salon (chargé par chargeVisites dans app2.js). */
(function () {
  const st = document.createElement("style");
  st.textContent = `.su-t3{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin:10px 0 0;text-align:left}.su-t3 div{background:#fff;border-radius:16px;padding:11px 12px}.su-t3 small{display:block;font-size:9.5px;font-weight:500;letter-spacing:.14em;text-transform:uppercase;color:#8A847E;margin-bottom:4px}.su-t3 b{font-size:17px;font-weight:500}.su-t3 b em{font-style:normal;font-size:12px;font-weight:400;color:#8A847E}
.su-carte{background:#fff;border-radius:20px;padding:4px 16px;text-align:left}.su-lg{display:flex;align-items:center;gap:10px;padding:12px 0;border-bottom:1px solid rgba(30,28,27,.08);font-size:14px}.su-lg:last-child{border-bottom:0}.su-lg>div{flex:1;min-width:0}.su-lg>div span{display:block;font-size:12px;color:#8A847E;margin-top:2px}
.su-b{flex:none;border:0;background:none;padding:8px 0 8px 8px;font:inherit;font-size:13px;font-weight:500;color:#1E1C1B;white-space:nowrap}
.su-puces{display:flex;gap:6px;flex-wrap:wrap;margin:14px 0 0}.su-puces button{border:0;border-radius:999px;background:#fff;padding:10px 14px;font:inherit;font-size:13px;color:#1E1C1B}.su-puces button.on{background:#1E1C1B;color:#fff}
/* 23/11 (Marie) : « Bloquer » = 6 choix, 3 et 3 */.su-puces.bl-3x3{display:grid;grid-template-columns:repeat(3,1fr)}.su-puces.bl-3x3 button{padding:10px 4px;white-space:nowrap}
.su-gros{font-size:32px;line-height:1;font-weight:400}.su-b2{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:8px;text-align:left}.su-b2 div{background:#fff;border-radius:18px;padding:14px}.su-b2 small{display:block;font-size:9.5px;font-weight:500;letter-spacing:.14em;text-transform:uppercase;color:#8A847E;margin-bottom:6px}.su-b2 b{font-size:20px;font-weight:500}
.su-rel{display:flex;align-items:center;justify-content:space-between;width:100%;margin-top:10px;border:0;border-radius:18px;background:#fff;padding:14px 16px;font:inherit;font-size:14px;text-align:left;color:#1E1C1B}.su-rel span{font-size:12px;color:#8A847E;display:block;margin-top:2px}
.su-champ{width:100%;min-width:0;box-sizing:border-box;-webkit-appearance:none;appearance:none;display:block;font-size:16px}
.pap .pr.su-tient{z-index:9;box-shadow:0 14px 28px -10px rgba(0,0,0,.45)!important;opacity:.95;transition:none}`;
  document.head.appendChild(st);
  const tel = t => String(t || "").replace(/[^\d+]/g, ""), p2 = n => String(n).padStart(2, "0"), hh = d => d.getHours() + "h" + p2(d.getMinutes());
  const tous = () => S.tous || [], bon = r => r.cliente_id && r.statut !== "annule";
  const brou = () => { try { return JSON.parse(localStorage.getItem("loginail-brouillon")) || {}; } catch (e) { return {}; } };
  /* les heures d'ouverture du jour (celles de son site, sinon 9h–18h) */
  const ouvert = d => { const h = (brou().horaires || [])[(d.getDay() + 6) % 7], m = t => +t.slice(0, 2) * 60 + +t.slice(3, 5); return h === null ? null : h && h.d && h.f ? [m(h.d), m(h.f)].concat(h.pd && h.pf ? [m(h.pd), m(h.pf)] : []) : [9 * 60, 18 * 60]; };
  const prisLe = (d, sauf) => S.rdv.concat(tous()).filter((r, i, l) => r.id !== sauf && r.statut !== "annule" && memeJour(new Date(r.debut), d) && l.findIndex(x => x.id === r.id) === i);
  const libre = (deb, fin, sauf) => !prisLe(deb, sauf).some(r => new Date(r.debut) < fin && new Date(r.fin) > deb);

  /* ---------- K · l'accueil : ma journée, mes trous libres ---------- */
  const acc0 = VUES.acc;
  VUES.acc = () => { let h = acc0(); const now = new Date(), auj = S.rdv.filter(r => memeJour(new Date(r.debut), now) && bon(r)).sort((a, b) => a.debut.localeCompare(b.debut)), o = ouvert(now);
    let bloc = "";
    { const pas = [["Ajouter mes prestations et mes prix", prestasDispo().length > 0, 'data-a="prestas"'], ["Créer mon site", !!S.site, 'data-go="si"'], ["Ajouter ma première cliente", S.clientes.length > 0, 'data-a="cli-nouv"'], ["Noter mon premier rendez-vous", tous().some(r => r.cliente_id) || S.rdv.some(r => r.cliente_id), 'data-a="nouveau"']], fait = pas.filter(x => x[1]).length;
      if (fait < pas.length) bloc += `<div class="k">Pour bien démarrer · ${fait} sur ${pas.length}</div><div class="su-carte">${pas.map(x => `<div class="su-lg" ${x[1] ? "" : x[2]} style="${x[1] ? "opacity:.45" : "cursor:pointer"}"><span style="flex:none;width:24px;height:24px;border-radius:50%;display:grid;place-items:center;font-size:12px;${x[1] ? "background:#1E1C1B;color:#fff" : "border:1.5px solid rgba(30,28,27,.3)"}">${x[1] ? "✓" : ""}</span><div>${x[0]}</div>${x[1] ? "" : '<span style="opacity:.5">›</span>'}</div>`).join("")}</div>`; }
    if (auj.length) { const tot = auj.filter(r => r.statut !== "absente").reduce((s, r) => s + (+r.prix || 0), 0), fin = new Date(Math.max(...auj.map(r => +new Date(r.fin))));
      bloc += `<div class="su-t3"><div><small>Aujourd’hui</small><b>${auj.length} <em>rdv</em></b></div><div><small>Prévu</small><b>${Math.round(tot)} <em>€</em></b></div><div><small>Fini à</small><b>${hh(fin)}</b></div></div>`; }
    if (o) { const mn = now.getHours() * 60 + now.getMinutes(), trous = []; let c = Math.max(o[0], Math.ceil(mn / 15) * 15);
      prisLe(now).map(r => [new Date(r.debut), new Date(r.fin)]).map(x => [x[0].getHours() * 60 + x[0].getMinutes(), x[1].getHours() * 60 + x[1].getMinutes()]).concat(o.length > 2 ? [[o[2], o[3]]] : []).sort((a, b) => a[0] - b[0]).forEach(x => { if (x[0] - c >= 30) trous.push([c, x[0]]); c = Math.max(c, x[1]); });
      if (o[1] - c >= 30) trous.push([c, o[1]]);
      const f = m => Math.floor(m / 60) + "h" + p2(m % 60), du = m => m >= 60 ? Math.floor(m / 60) + " h" + (m % 60 ? " " + p2(m % 60) : "") : m + " min";
      if (trous.length) bloc += `<div class="k">Encore libre aujourd’hui</div><div class="su-carte">${trous.slice(0, 4).map(t => `<div class="su-lg"><div>${f(t[0])} – ${f(t[1])}<span>${du(t[1] - t[0])}</span></div><button class="su-b" data-su="libre" data-m="${t[0]}">+ Rendez-vous</button></div>`).join("")}</div>`; }
    const rep = '<div class="k">Aujourd’hui'; return bloc && h.includes(rep) ? h.replace(rep, bloc + rep) : h + bloc; };

  /* ---------- J · à relancer ---------- */
  const MSG0 = "Bonjour {prénom}, ça fait un moment ! Envie de refaire vos ongles ? {lien}À très vite, {salon}";
  const litMsg = () => { try { return localStorage.getItem("loginail-msg-relance") || (S.site && S.site.donnees && S.site.donnees.msgRelance) || MSG0; } catch (e) { return MSG0; } };
  const lien = () => S.site && S.site.en_ligne && S.site.slug ? lienDuSite(S.site) : "";
  const texte = c => litMsg().replace(/\{prénom\}/g, c.prenom || "").replace(/\{salon\}/g, S.profil.nom_salon || S.profil.prenom || "").replace(/\{lien\}/g, lien() ? "Vous pouvez réserver ici : " + lien() + " " : "").replace(/\s+/g, " ").trim();
  const SEM = 6, aRelancer = () => { const V = S.vis || {}, lim = Date.now() - SEM * 7 * 864e5; return S.clientes.filter(c => { const v = V[c.id]; return v && v.n && !v.proch && v.der && +new Date(v.der) < lim; }).sort((a, b) => V[a.id].der.localeCompare(V[b.id].der)); };
  const depuis = d => { const s = Math.round((Date.now() - +new Date(d)) / (7 * 864e5)); return s >= 9 ? Math.round(s / 4.345) + " mois" : s + " semaines"; };
  const cl0 = VUES.cl;
  VUES.cl = () => { const h = cl0(), l = aRelancer(), rep = "Ajouter une cliente</button>"; if (!l.length || !h.includes(rep) || S.cherche.trim()) return h;
    return h.replace(rep, rep + `<button class="su-rel" data-su="relance"><div>À relancer<span>${l.length} cliente${l.length > 1 ? "s" : ""} pas revenue${l.length > 1 ? "s" : ""} depuis ${SEM} semaines</span></div><span style="font-size:16px;margin:0">›</span></button>`); };
  const feuilleRelance = () => { const l = aRelancer(), V = S.vis || {};
    ouvre(`<h3>À relancer</h3><div class="sous">Pas revenues depuis ${SEM} semaines, et sans rendez-vous prévu. « Lui écrire » ouvre tes Messages avec un texte tout prêt.</div>
      <div class="su-carte" style="margin-top:14px">${l.length ? l.map(c => `<div class="su-lg"><div data-cli="${c.id}">${esc(nomCli(c))}<span>Pas venue depuis ${depuis(V[c.id].der)}</span></div>${c.telephone ? `<button class="su-b" data-href="sms:${tel(c.telephone)}?&body=${encodeURIComponent(texte(c))}">Lui écrire</button>` : `<span style="font-size:12px;color:#8A847E">Pas de numéro</span>`}</div>`).join("") : `<div class="su-lg"><div>Personne à relancer<span>Toutes tes clientes sont revenues ou ont un rendez-vous.</span></div></div>`}</div>
      <button class="su-rel" data-su="msg" style="background:none;padding:14px 2px"><div>Changer mon message<span>Le texte envoyé quand tu touches « Lui écrire »</span></div><span style="font-size:16px;margin:0">›</span></button>`); };
  const feuilleMsg = () => ouvre(`<h3>Mon message de relance</h3><div class="sous">{prénom} devient le prénom de la cliente, {salon} le nom de ton salon, {lien} l’adresse de ton site.</div>
    <textarea class="msg" id="su-msg" style="height:150px;margin-top:12px">${esc(litMsg())}</textarea><button class="btn" data-su="msg-ok" style="margin-top:12px">Enregistrer</button><button class="lien-t" data-su="msg-def">Remettre le message d’origine</button>`);

  /* ---------- I · mon bilan ---------- */
  const feuilleBilan = () => { const now = new Date(), m0 = new Date(now.getFullYear(), now.getMonth(), 1), m1 = new Date(now.getFullYear(), now.getMonth() + 1, 1), p0 = new Date(now.getFullYear(), now.getMonth() - 1, 1), l0 = lundiDe(now), l1 = plusJours(l0, 7);
    const entre = (a, b) => tous().filter(r => bon(r) && new Date(r.debut) >= a && new Date(r.debut) < b), fait = l => l.filter(r => r.statut !== "absente" && new Date(r.fin) <= now), som = l => Math.round(l.reduce((s, r) => s + (+r.prix || 0), 0));
    const mois = entre(m0, m1), gm = som(fait(mois)), gp = som(fait(entre(p0, m0))), d = gm - gp;
    ouvre(`<h3>Mon bilan</h3><div class="sous" style="text-transform:capitalize">${MOIS[now.getMonth()]} ${now.getFullYear()}</div>
      <div class="su-carte" style="padding:18px 16px;margin-top:14px"><div class="su-gros">${gm} €</div><div style="font-size:13px;color:#8A847E;margin-top:8px">${fait(mois).length} rendez-vous faits ce mois-ci${gp ? " · " + Math.abs(d) + " € de " + (d >= 0 ? "plus" : "moins") + " que le mois dernier" : ""}</div></div>
      <div class="su-b2"><div><small>Cette semaine</small><b>${som(fait(entre(l0, l1)))} €</b></div><div><small>Encore prévu ce mois</small><b>${som(mois.filter(r => new Date(r.fin) > now && r.statut === "prevu"))} €</b></div>
        <div><small>Nouvelles clientes</small><b>${S.clientes.filter(c => c.cree_le && new Date(c.cree_le) >= m0).length}</b></div><div><small>Pas venues</small><b>${mois.filter(r => r.statut === "absente").length}</b></div>
        <div><small>Réservé en ligne</small><b>${mois.filter(r => r.source === "en_ligne").length}</b></div><div><small>À relancer</small><b>${aRelancer().length}</b></div></div>
      <div class="sous" style="margin-top:12px;font-size:12px">Compté d’après les prix de tes rendez-vous passés (sans les annulés ni les absentes).</div>`); };
  const re0 = VUES.re;
  VUES.re = () => { const h = re0(), rep = '<div class="k">Ma caisse</div>', L = (t, s, a) => `<div class="ligne" data-su="${a}"><div class="t">${t}<span>${s}</span></div><span class="fl">›</span></div>`;
    const bloc = `<div class="k">Mon activité</div><div class="liste">${L("Mon bilan", "Ce que j’ai gagné ce mois-ci", "bilan")}${L("Mon message de relance", "Pour les clientes pas revenues", "msg")}</div>`;
    return h.includes(rep) ? h.replace(rep, bloc + rep) : h + bloc; };

  /* ---------- H · reprendre rendez-vous après « C'est fini » ---------- */
  let REP = null;
  const creneaux = (r, sem) => { const d0 = new Date(r.debut), dur = new Date(r.fin) - d0, out = [];
    for (let j = 0; j < 6 && out.length < 3; j++) { const jour = plusJours(d0, sem * 7 + j), o = ouvert(jour); if (!o) continue;
      const base = d0.getHours() * 60 + d0.getMinutes(), essais = j ? [base, o[0], base - 60, base + 60] : [base, base - 30, base + 30, base - 60, base + 60, o[0]];
      for (const m of essais) { if (out.length >= 3) break; if (m < o[0] || m + dur / 60000 > o[1]) continue; const deb = new Date(jour); deb.setHours(0, m, 0, 0); const fin = new Date(+deb + dur);
        if (libre(deb, fin) && !out.some(x => +x === +deb)) out.push(deb); } }
    return out; };
  const feuilleReprendre = () => { const r = REP.r, cs = creneaux(r, REP.sem), d0 = new Date(r.debut);
    /* 14/11 (Marie) : elle a déjà ses prochains rendez-vous ? on ne lui demande rien, on les affiche */
    const fut = (S.tous || S.rdv || []).filter(x => x.cliente_id && x.cliente_id === r.cliente_id && x.id !== r.id && x.statut === "prevu" && new Date(x.debut) > new Date()).sort((a, b) => a.debut.localeCompare(b.debut));
    if (fut.length) return ouvre(`<h3>C’est fini ✓</h3><div class="sous">${esc(nomRdv(r))}${titreRdv(r) ? " · " + esc(titreRdv(r)) : ""}</div>
      <div class="k">${fut.length > 1 ? "Ses " + fut.length + " prochains rendez-vous" : "Son prochain rendez-vous"}</div><div class="su-carte">${fut.slice(0, 6).map(x => { const d = new Date(x.debut); return `<div class="su-lg"><div style="text-transform:capitalize">${JOURS[(d.getDay() + 6) % 7]} ${d.getDate()} ${MOIS[d.getMonth()]}<span style="text-transform:none">${hh(d)}${x.titre ? " · " + esc(x.titre) : ""}</span></div><span style="font-size:12px;opacity:.55">déjà pris ✓</span></div>`; }).join("")}</div>
      <button class="btn" data-su="rep-fin" style="margin-top:14px">Parfait</button>`);
    ouvre(`<h3>Son prochain rendez-vous ?</h3><div class="sous">${esc(nomRdv(r))}${titreRdv(r) ? " · " + esc(titreRdv(r)) : ""}</div>
      <div class="su-puces" style="flex-wrap:nowrap">${[2, 3, 4].map(n => `<button data-su="rep-sem" data-n="${n}" class="${REP.sem === n ? "on" : ""}" style="flex:1;padding-left:6px;padding-right:6px">${n} sem.</button>`).join("")}<button data-su="rep-sem" data-n="${REP.sem > 4 ? REP.sem + 1 : 5}" class="${REP.sem > 4 ? "on" : ""}" style="flex:1;padding-left:6px;padding-right:6px">${REP.sem > 4 ? REP.sem + " sem. +" : "+"}</button></div>
      <div class="k">Créneaux libres</div><div class="su-carte">${cs.length ? cs.map(c => `<div class="su-lg"><div style="text-transform:capitalize">${JOURS[(c.getDay() + 6) % 7]} ${c.getDate()} ${MOIS[c.getMonth()]}<span style="text-transform:none">${hh(c)}${c.getDay() === d0.getDay() && c.getHours() === d0.getHours() && c.getMinutes() === d0.getMinutes() ? " · comme aujourd’hui" : ""}</span></div><button class="su-b" data-su="rep-ok" data-d="${c.toISOString()}">Choisir</button></div>`).join("") : `<div class="su-lg"><div>Rien de libre cette semaine-là<span>Essaie une autre semaine.</span></div></div>`}</div>
      <button class="btn clair" data-su="plustard" style="margin-top:14px">Plus tard</button>`); };

  /* ---------- G · poser des congés ---------- */
  let CG = { raison: "Vacances" };
  const iso = d => `${d.getFullYear()}-${p2(d.getMonth() + 1)}-${p2(d.getDate())}`;
  const feuilleConges = () => { const j = S.jour, d = CG.du || iso(j), f = CG.au || d, n = Math.max(1, Math.round((new Date(f) - new Date(d)) / 864e5) + 1);
    ouvre(`<h3>Fermer mon salon</h3><div class="sous">Ces jours-là sont bloqués dans ton agenda.</div>
      <div class="su-puces">${["Vacances", "Jour off", "Formation"].map(x => `<button data-su="cg-r" data-r="${x}" class="${CG.raison === x ? "on" : ""}">${x}</button>`).join("")}</div>
      <div class="lab2">Du</div><input class="champ su-champ" id="cg-du" type="date" value="${d}"><div class="lab2">Au</div><input class="champ su-champ" id="cg-au" type="date" value="${f}">
      <button class="btn" data-su="cg-ok" style="margin-top:16px">Fermer ${n > 1 ? "ces " + n + " jours" : "ce jour"}</button>
      <div class="sous" style="margin-top:10px;font-size:12px">Pour rouvrir un jour : touche le bloc « Fermé » dans l’agenda, puis « Annuler le rendez-vous ».</div>`); };
  const ag0 = VUES.ag;
  VUES.ag = () => { const h = ag0().replace(/<strong>00:00 – 23:59<\/strong> /g, ""), rep = '<button data-a="mois"';
    return h.includes(rep) ? h.replace(rep, `<button data-su="conges" aria-label="Fermer mon salon (congés)" style="width:46px;height:46px;border-radius:50%;border:0;display:grid;place-items:center;padding:0;background:#fff"><svg viewBox="0 0 24 24" width="20" height="20"><circle cx="12" cy="12" r="8.5" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M6.5 17.5l11-11" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg></button>` + rep) : h; };

  document.addEventListener("loginail-reprendre", e => { REP = { r: e.detail, sem: 3 }; feuilleReprendre(); });
  /* ---------- les gestes ---------- */
  document.addEventListener("click", async e => { const t = e.target.closest ? e.target : null; if (!t) return;
    /* H : on retient le rendez-vous qu'elle vient de finir */
    const fini = t.closest('[data-a="statut"][data-s="fini"]'); if (fini) { const r = S.rdv.find(x => x.id === fini.dataset.id); if (r && r.cliente_id) setTimeout(() => { if (E.classList.contains("fe")) return; REP = { r, sem: 3 }; feuilleReprendre(); }, 900); return; }
    const a = t.closest("[data-su]"); if (!a) return; e.stopPropagation(); const k = a.dataset.su;
    if (k === "libre") { S.jour = new Date(); S.lundi = lundiDe(S.jour); feuilleNouveau(+a.dataset.m); libreDuo(); }
    else if (k === "relance") feuilleRelance();
    else if (k === "msg") feuilleMsg();
    else if (k === "msg-ok") { const v = ($("#su-msg", E).value || "").trim(); if (!v) return dit("Écris ton message"); try { localStorage.setItem("loginail-msg-relance", v); } catch (x) {} ferme(); dit("C’est enregistré ✓"); }
    else if (k === "msg-def") { try { localStorage.removeItem("loginail-msg-relance"); } catch (x) {} feuilleMsg(); }
    else if (k === "bilan") feuilleBilan();
    else if (k === "rep-sem") { REP.sem = Math.min(12, +a.dataset.n); feuilleReprendre(); }
    else if (k === "plustard") { ferme(); dit("D’accord : pense à la relancer plus tard"); }
    else if (k === "rep-fin") { ferme(); }
    else if (k === "rep-ok") { const r = REP.r, deb = new Date(a.dataset.d), fin = new Date(+deb + (new Date(r.fin) - new Date(r.debut))); a.disabled = true;
      const { error } = await sb.from("rendez_vous").insert({ cliente_id: r.cliente_id, prestation_id: r.prestation_id || null, titre: r.titre || titreRdv(r) || null, debut: deb.toISOString(), fin: fin.toISOString(), prix: r.prix ?? null });
      if (error) { a.disabled = false; return dit("Oups, ça n’a pas marché. Réessaie."); } await chargeSemaine(); chargeVisites(); ferme(); rendu(); dit("Rendez-vous pris ✓"); }
    else if (k === "conges") { CG = { raison: "Vacances" }; feuilleConges(); }
    else if (k === "cg-r") { CG.du = $("#cg-du", E).value; CG.au = $("#cg-au", E).value; CG.raison = a.dataset.r; feuilleConges(); }
    else if (k === "cg-ok") { const d = $("#cg-du", E).value, f = $("#cg-au", E).value; if (!d || !f || f < d) return dit("Vérifie les deux dates"); const n = Math.round((new Date(f) - new Date(d)) / 864e5) + 1; if (n > 60) return dit("60 jours au maximum");
      const jours = []; for (let i = 0; i < n; i++) { const x = new Date(d + "T00:00:00"); x.setDate(x.getDate() + i); const y = new Date(x); y.setHours(23, 59, 0, 0); jours.push({ cliente_id: null, prestation_id: null, titre: "Fermé · " + CG.raison, debut: x.toISOString(), fin: y.toISOString(), prix: null }); }
      const pris = jours.filter(x => prisLe(new Date(x.debut)).some(r => r.cliente_id)).length; if (pris) return dit(pris > 1 ? "Il y a déjà des rendez-vous ces jours-là : décale-les d’abord" : "Il y a déjà des rendez-vous ce jour-là : décale-les d’abord");
      a.disabled = true; const { error } = await sb.from("rendez_vous").insert(jours); if (error) { a.disabled = false; return dit("Oups, ça n’a pas marché. Réessaie."); }
      await chargeSemaine(); chargeVisites(); ferme(); rendu(); dit(n > 1 ? n + " jours fermés ✓" : "Jour fermé ✓"); }
  }, true);
  document.addEventListener("change", e => { if (e.target.id === "cg-du" || e.target.id === "cg-au") { CG.du = $("#cg-du", E).value; CG.au = $("#cg-au", E).value; if (CG.au < CG.du) CG.au = CG.du; feuilleConges(); } });

  /* ---------- la semaine coulisse : on glisse à gauche ou à droite sur les jours ---------- */
  /* 17/11 : un seul code pour le geste (plus bas, « la semaine suit le doigt ») ; ici on avale juste le clic qui suit un glissement */
  {
    document.addEventListener("click", e => { if (Date.now() - (window.__semAvale || 0) < 400 && e.target.closest && e.target.closest(".semaine")) { e.stopPropagation(); e.preventDefault(); } }, true); }
  let avale = 0;
  /* ---------- faire glisser un rendez-vous dans l'agenda (on reste appuyée, puis on monte ou on descend) ---------- */
  let G = null;
  const debutG = (el, y, x) => { const r = S.rdv.find(x => x.id === el.dataset.rdv); if (!r || r.statut !== "prevu") return; G = { el, r, x, y, dy: 0, on: false, t: setTimeout(() => { if (!G) return; G.on = true; el.classList.add("su-tient"); navigator.vibrate?.(12); /* 13/11 (iPhone) : on bloque le défilement de la page pendant qu'on tient le rendez-vous */ const sc = el.closest(".vue"); if (sc) { G.sc = sc; G.ov = sc.style.overflowY; sc.style.overflowY = "hidden"; } }, 380) }; };
  const bougeG = (y, ev) => { if (!G) return; if (!G.on) { if (Math.abs(y - G.y) > 8) { clearTimeout(G.t); G = null; } return; } ev.preventDefault(); /* 22/11 : le doigt suit l'échelle dessinée (vernis.js : data-k), sinon l'heure enregistrée n'était pas celle montrée */
    G.ech = R * (+((G.el.closest(".pap") || { dataset: {} }).dataset.k) || 1); const pas = G.ech / 2; G.dy = Math.round((y - G.y) / pas) * pas; G.el.style.transform = `translateY(${G.dy}px)`;
    const d = new Date(+new Date(G.r.debut) + Math.round(G.dy / G.ech * 30) * 60000); let b = G.el.querySelector("strong"); if (b) b.textContent = hm(d) + " – " + hm(new Date(+d + (new Date(G.r.fin) - new Date(G.r.debut)))); };
  /* 22/11 : partir de côté = glisser la journée (jour-glisse.js), pas déplacer le rendez-vous */
  const coteG = x => { if (G && !G.on && Math.abs(x - G.x) > 6) { clearTimeout(G.t); G = null; } };
  E.addEventListener("touchmove", e => coteG(e.touches[0].clientX), { capture: true, passive: true });
  document.addEventListener("mousemove", e => coteG(e.clientX), true);
  const finG = async () => { if (!G) return; clearTimeout(G.t); const g = G; G = null; if (g.sc) g.sc.style.overflowY = g.ov || ""; if (!g.on) return; avale = Date.now(); g.el.classList.remove("su-tient");
    const mn = Math.round(g.dy / (g.ech || R) * 30); if (!mn) { g.el.style.transform = ""; return; } const deb = new Date(+new Date(g.r.debut) + mn * 60000), fin = new Date(+new Date(g.r.fin) + mn * 60000);
    if (!memeJour(deb, new Date(g.r.debut)) || deb.getHours() * 60 + deb.getMinutes() < OUV || !libre(deb, fin, g.r.id)) { rendu(); return dit(libre(deb, fin, g.r.id) ? "Trop tôt ou trop tard" : "Ce créneau est déjà pris"); }
    const { error } = await sb.from("rendez_vous").update({ debut: deb.toISOString(), fin: fin.toISOString() }).eq("id", g.r.id); if (error) { rendu(); return dit("Oups, ça n’a pas marché. Réessaie."); }
    await chargeSemaine(); chargeVisites(); rendu(); dit("Décalé à " + hh(deb) + " ✓"); };
  E.addEventListener("touchstart", e => { const el = e.target.closest(".pap .pr[data-rdv]"); if (el && e.touches.length === 1) debutG(el, e.touches[0].clientY, e.touches[0].clientX); }, { passive: true });
  E.addEventListener("touchmove", e => bougeG(e.touches[0].clientY, e), { passive: false });
  document.addEventListener("touchmove", e => { if (G && G.on && e.cancelable) e.preventDefault(); }, { passive: false });
  E.addEventListener("touchend", finG); E.addEventListener("touchcancel", finG);
  E.addEventListener("mousedown", e => { const el = e.target.closest(".pap .pr[data-rdv]"); if (el) debutG(el, e.clientY, e.clientX); });
  document.addEventListener("mousemove", e => { if (G) bougeG(e.clientY, e); }); document.addEventListener("mouseup", finG);
  document.addEventListener("click", e => { if (Date.now() - avale < 500 && e.target.closest && e.target.closest(".pap")) { e.stopPropagation(); e.preventDefault(); } }, true);
  document.addEventListener("contextmenu", e => { if (e.target.closest && e.target.closest(".pap .pr")) e.preventDefault(); });
})();

/* ===== 12/11 nuit (Marie) : le mois et le tri se ferment en touchant ailleurs · un créneau propose « nouveau rendez-vous » ou « bloquer » ·
   un petit dessin devant chaque ligne des Réglages · ajouter plusieurs clientes d'un coup (une par ligne) ===== */
(function () {
  const p2 = n => String(n).padStart(2, "0"), hM = m => Math.floor(m / 60) + "h" + p2(m % 60);
  /* 1 · toucher ailleurs ferme le mois / le tri */
  document.addEventListener("click", e => { const t = e.target; if (!t.closest) return;
    /* seulement si le panneau est vraiment à l'écran (sinon l'état restait « ouvert » et tous les touchers étaient avalés) */
    if (S.moisOuvert && !E.querySelector(".vue.on .calm")) S.moisOuvert = false;
    if (S.triOuvert && !E.querySelector(".vue.on .tris")) S.triOuvert = false;
    if (S.moisOuvert && !t.closest(".calm,[data-a='mois']")) { S.moisOuvert = false; rendu(); e.stopPropagation(); e.preventDefault(); return; }
    if (S.triOuvert && !t.closest(".tris,[data-a='tri-menu']")) { S.triOuvert = false; rendu(); e.stopPropagation(); e.preventDefault(); } }, true);

  /* 2 · un créneau vide : nouveau rendez-vous, ou bloquer ce créneau */
  E.addEventListener("touchstart", e => { window.__s5t = e.target.closest ? e.target.closest(".pl") : null; window.__s5d = Date.now(); }, { passive: true, capture: true });
  let BL = { m: 0, d: 60 };
  /* 23/11 (Marie) : les rendez-vous tombent souvent à 10h15, 10h45. 1) Si la cliente d'avant finit dans la demi-heure touchée, on démarre juste après elle ;
     2) 4 boutons au quart d'heure (10h · 10h15 · 10h30 · 10h45) pour changer l'heure d'un seul geste (cases de 15 min = trop petites pour le doigt). */
  const hC = m => Math.floor(m / 60) + "h" + (m % 60 ? p2(m % 60) : "");
  const feuilleCreneau = m => { const j = S.jour;
    const avant = S.rdv.filter(r => r.statut !== "annule" && memeJour(new Date(r.debut), j)).map(r => { const f = new Date(r.fin); return { r, f: f.getHours() * 60 + f.getMinutes() }; })
      .filter(x => x.f > m && x.f < m + 30).sort((a, b) => b.f - a.f)[0];
    if (avant) m = avant.f;
    BL = { m, d: 60, base: Math.floor(m / 60) * 60, apM: m, apres: avant && avant.r.cliente_id ? String(nomRdv(avant.r)).split(" ")[0] : "" };
    /* 25/11 (Marie, maquette site/idees/idee-creneau-date.html, version C) : en haut, la date en grand ; l'heure n'est que dans les 4 boutons */
    ouvre(`<h3 id="s5-h" class="s5-date">${JOURS[(j.getDay() + 6) % 7]} ${j.getDate()} ${MOIS[j.getMonth()]}</h3><div id="s5-ap" class="s5-ap">${BL.apres ? "juste après " + esc(BL.apres) : ""}</div>
      <div class="s5-quarts">${[0, 15, 30, 45].map(q => `<button data-s5="quart" data-m="${BL.base + q}" class="${BL.base + q === m ? "on" : ""}">${hC(BL.base + q)}</button>`).join("")}</div>
      <button class="btn" data-s5="rdv" style="margin-top:16px">Nouveau rendez-vous</button><button class="btn clair" data-s5="bloquer" style="margin-top:8px">Bloquer ce créneau</button>
      <button class="btn clair s5-part" data-s5p style="margin-top:8px"><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 15V4M7.5 8.5 12 4l4.5 4.5"/><path d="M5 13v5a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-5"/></svg>Partager cette dispo</button>`); };
  { const st = document.createElement("style"); st.textContent = `
#E .feuille h3.s5-date{font-size:24px;margin:6px 0 0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
#E .feuille .s5-ap{text-align:center;font-size:13px;color:var(--gris);margin-top:2px}#E .feuille .s5-ap:empty{display:none}
.s5-quarts{display:flex;gap:7px;margin-top:14px}
.s5-quarts button{flex:1;min-width:0;height:42px;border-radius:999px;border:1px solid rgba(30,28,27,.14);background:#fff;font:inherit;font-size:15px;font-weight:500;color:#1E1C1B;padding:0;font-variant-numeric:tabular-nums;transition:transform .1s,background .15s,color .15s;-webkit-tap-highlight-color:transparent}
.s5-quarts button:active{transform:scale(.94)}
.s5-quarts button.on{background:var(--v-fonce,#1E1C1B);color:#fff;border-color:var(--v-fonce,#1E1C1B)}`; document.head.appendChild(st); }
  window.__feuilleCreneau = feuilleCreneau;   /* 22/11 : la même fenêtre quand on touche une heure en vue Semaine (agenda-vues.js) */
  /* 23/11 (Marie) : « jusqu'à la fin de la journée » = jusqu'à l'heure de fermeture du jour (ses horaires) ; sans horaires, ou si c'est déjà fermé : minuit */
  const finJour = () => { const hor = ((S.site && S.site.donnees && S.site.donnees.horaires) || (typeof brouillon === "function" && brouillon() || {}).horaires || [])[(S.jour.getDay() + 6) % 7], f = hor && hor.f ? +String(hor.f).slice(0, 2) * 60 + +String(hor.f).slice(3, 5) : 0; return f > BL.m ? f : 23 * 60 + 59; };
  const feuilleBloquer = () => ouvre(`<h3>Bloquer à partir de ${hM(BL.m)}</h3><div class="sous">Personne ne pourra réserver sur ce créneau.</div>
      <div class="su-puces bl-3x3">${[[30, "30 min"], [60, "1 h"], [90, "1 h 30"], [120, "2 h"]].map(x => `<button data-s5="bl-d" data-d="${x[0]}" class="${BL.d === x[0] && !BL.libre && !BL.fj ? "on" : ""}">${x[1]}</button>`).join("")}<button data-s5="bl-fj" class="${BL.fj ? "on" : ""}">${finJour() >= 23 * 60 + 59 ? "Jusqu’à minuit" : "Jusqu’à " + hM(finJour()).replace("h00", "h")}</button><button data-s5="bl-libre" class="${BL.libre ? "on" : ""}">Autre…</button></div>
      ${BL.libre ? `<div class="lab2">Jusqu’à</div><input class="champ" id="bl-fin" type="time" step="300" value="${hM(Math.min(23 * 60 + 55, BL.m + BL.d)).replace("h", ":").padStart(5, "0")}" style="font-size:16px;width:100%;box-sizing:border-box;-webkit-appearance:none;appearance:none;display:block">` : ""}
      <div class="lab2">Pourquoi ? <small style="text-transform:none;letter-spacing:0;opacity:.6">facultatif</small></div><input class="champ" id="bl-n" maxlength="40" placeholder="Pause, médecin, formation…" value="${esc(BL.n || "")}" style="font-size:16px;width:100%;box-sizing:border-box">
      <button class="btn" data-s5="bl-ok" style="margin-top:16px">Bloquer</button>`);

  /* 24/11 nuit (Marie) : « Partager cette dispo » → l'image « Nouvelle dispo · mardi 16 décembre · 10H30 » (dispos.js) */
  { const st = document.createElement("style"); st.textContent = `#E .s5-part{display:flex;align-items:center;justify-content:center;gap:8px}`; document.head.appendChild(st); }
  document.addEventListener("click", async e => { const b = e.target.closest && e.target.closest("[data-s5p]"); if (!b) return; e.stopPropagation(); e.preventDefault();
    if (b.disabled || !window.__dispoUne) return; const q = E.querySelector('.fc [data-s5="quart"].on'), m = q ? +q.dataset.m : BL.m, d = new Date(S.jour); d.setHours(0, m, 0, 0);
    const avant = b.innerHTML; b.disabled = true; b.textContent = "Un instant…";
    try { await __dispoUne.partage(d); } catch (x) { console.error(x); dit("Oups, l’image ne s’est pas faite. Réessaie."); }
    if (b.isConnected) { b.disabled = false; b.innerHTML = avant; } }, true);

  /* 3 · un petit dessin devant chaque ligne des Réglages */
  const sv = d => `<span class="s5-ic"><svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">${d}</svg></span>`;
  const IC = [["Mon appli à mes couleurs", '<path d="M12 3c4 5 6 8 6 11a6 6 0 0 1-12 0c0-3 2-6 6-11z"/>'], ["Afficher mon fond", '<rect x="3" y="5" width="18" height="14" rx="3"/><path d="M3 15l5-5 4 4 3-3 6 6"/>'],
    ["Mon salon", '<path d="M4 11l8-7 8 7v9H4z"/><path d="M10 20v-5h4v5"/>'], ["Mes prestations", '<path d="M5 7h14M5 12h14M5 17h9"/>'], ["Réservation en ligne", '<rect x="4" y="5.5" width="16" height="14" rx="3"/><path d="M4 10h16M8.5 3.5v4M15.5 3.5v4"/>'],
    ["Acompte", '<circle cx="12" cy="12" r="8.5"/><path d="M14.5 9.5a3 3 0 1 0 0 5M8.5 11h4M8.5 13h4"/>'], ["Carte de fidélité", '<path d="M12 20s-7-4.4-9-8.6C1.6 8.3 3.4 5 6.6 5c2 0 3.6 1.1 5.4 3.2C13.8 6.1 15.4 5 17.4 5c3.2 0 5 3.3 3.6 6.4-2 4.2-9 8.6-9 8.6z"/>'],
    ["Rappel la veille", '<path d="M4 5h16v11H9l-5 4z"/>'], ["SMS d’anniversaire", '<path d="M4 10h16v10H4zM12 10v10M3 10V7h18v3"/><path d="M12 7c-2-4-6-2-3 0M12 7c2-4 6-2 3 0"/>'],
    ["Mon bilan", '<path d="M5 20V11M12 20V5M19 20v-6"/>'], ["Mon message de relance", '<path d="M4 12a8 8 0 1 0 3-6"/><path d="M4 5v4h4"/>'], ["Ma caisse", '<rect x="3" y="6" width="18" height="12" rx="3"/><path d="M3 10h18"/>'],
    ["Télécharger mes données", '<path d="M12 4v11M7 11l5 5 5-5M5 20h14"/>'], ["Supprimer mon compte", '<path d="M5 7h14M9 7V5h6v2M7 7l1 13h8l1-13"/>'], ["Besoin d’aide", '<circle cx="12" cy="12" r="8.5"/><path d="M9.6 9.6a2.5 2.5 0 1 1 3.6 2.2c-.8.5-1.2 1-1.2 1.9M12 17h.01"/>'],
    ["Mentions légales", '<path d="M7 3h7l4 4v14H7z"/><path d="M14 3v4h4"/>'], ["Confidentialité", '<rect x="5" y="11" width="14" height="9" rx="2.5"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>'], ["Se déconnecter", '<path d="M10 4H5v16h5M9 12h11M16 8l4 4-4 4"/>']];
  const dessin = h => h.replace(/(<div class="ligne[^"]*"[^>]*>)(<div class="t">)([^<]+)/g, (tout, a, b, titre) => { const i = IC.find(x => titre.trim().indexOf(x[0]) === 0); return i ? a + sv(i[1]) + b + titre : tout; });
  const re1 = VUES.re; VUES.re = () => dessin(re1());
  const st = document.createElement("style");
  st.textContent = `.s5-ic{flex:none;width:34px;height:34px;border-radius:11px;background:#EDE7E0;display:grid;place-items:center;margin-right:12px;color:#1E1C1B}.vue[data-p="re"] .ligne{display:flex;align-items:center}.vue[data-p="re"] .ligne>.t{flex:1;min-width:0}
.s5-ou{margin:18px 0 8px;font-size:13px;color:#8A817A;text-align:center}
.s5-srcs{display:flex;justify-content:center;flex-wrap:wrap;gap:7px}
.s5-srcs button{display:flex;align-items:center;gap:7px;height:38px;padding:0 13px;border-radius:999px;background:#fff;border:1px solid rgba(30,28,27,.12);font:inherit;font-size:13.5px;color:#1E1C1B;transition:transform .12s,border-color .2s,background .2s,color .2s}
.s5-srcs button:active{transform:scale(.96)}.s5-srcs button.on{background:#1E1C1B;border-color:#1E1C1B;color:#fff}
.s5-srcs i{width:8px;height:8px;border-radius:50%;flex:none}.s5-srcs button.on i{background:#fff!important}.s5-srcs svg{width:13px;height:13px;flex:none}
.s5-aide.on{margin-top:12px;padding:6px;border-radius:18px;background:#F6F3EF}
.s5-gestes{margin:0;padding:0;list-style:none;display:flex;flex-direction:column;gap:2px;text-align:left}
.s5-gestes li{display:flex;gap:10px;align-items:flex-start;padding:9px 10px;border-radius:14px;font-size:14px;line-height:1.4;color:#1E1C1B;animation:s5In .28s cubic-bezier(.2,.8,.2,1) both}
.s5-gestes li b{font-weight:500}.s5-gestes li i{flex:none;width:22px;height:22px;border-radius:50%;background:#1E1C1B;color:#fff;display:grid;place-items:center;font-size:11px;font-weight:500;font-style:normal}
.s5-ecrire{display:block;width:calc(100% - 12px);margin:4px 6px 6px;height:42px;border-radius:999px;border:1px solid #1E1C1B;background:#fff;font:inherit;font-size:14px;color:#1E1C1B}
@keyframes s5In{from{opacity:0;transform:translateY(6px)}}
@media (prefers-reduced-motion:reduce){.s5-gestes li{animation:none}}
.s5-plus{display:block;width:100%;border:0;background:none;margin-top:8px;padding:6px;font:inherit;font-size:13px;color:#6B625C;text-decoration:underline;text-underline-offset:3px}`;
  document.head.appendChild(st);
  /* les lignes ajoutées après coup (SMS d'anniversaire) */
  new MutationObserver(() => document.querySelectorAll('.vue[data-p="re"] .ligne').forEach(l => { if (l.querySelector(".s5-ic")) return; const t = l.querySelector(".t"); if (!t || !t.firstChild) return; const i = IC.find(x => (t.firstChild.textContent || "").trim().indexOf(x[0]) === 0); if (i) l.insertAdjacentHTML("afterbegin", sv(i[1])); })).observe(document.body, { childList: true, subtree: true });

  /* 4 · ajouter plusieurs clientes d'un coup */
  /* 21/11 (Marie) : une majuscule au début de chaque mot, même si on l'a oubliée */
  const maj = s => String(s || "").replace(/(^|[\s'’-])(\p{Ll})/gu, (x, a, b) => a + b.toUpperCase());
  /* 21/11 (Marie) : « @lea.nails » sur une ligne = son Instagram ; une cliente avec seulement son Insta s'appelle « @lea.nails » (comme dans la fiche) */
  const lis = t => t.split(/\n+/).map(l => l.trim()).filter(Boolean).map(l => { let ig = null; l = l.replace(/(^|\s)@([\w.]{2,30})(?=\s|$)/, (x, a, p) => { ig = p.toLowerCase().replace(/\.+$/, ""); return " "; }).trim();
    const m = l.match(/(\+?\d[\d .\-]{7,}\d)\s*$/), tel = m ? m[1].replace(/[.\-]/g, " ").replace(/\s+/g, " ").trim() : null, nom = (m ? l.slice(0, m.index) : l).replace(/[;,\t]+/g, " ").trim().split(/\s+/).filter(Boolean);
    const c = nom.length ? { prenom: maj(nom[0]), nom: maj(nom.slice(1).join(" ")) || null, telephone: tel } : ig ? { prenom: "@" + ig, nom: null, telephone: tel } : null; if (c && ig) c.instagram = ig; return c; }).filter(Boolean);
  /* 21/11 (Marie) : texte copié depuis une capture d'écran (iPhone : Photos › reste appuyée sur le texte › Copier).
     On enlève ce qui n'est pas une cliente (boutons d'Insta, heure, nombre d'abonnées…) et on met chaque pseudo avec le prénom écrit juste en dessous. */
  const BOUTONS = /^(suivre( en retour)?|suivi(\(e\)|e)?|abonn[ée]+(\(e\))?s?|abonnements?|supprimer|retirer|message|[ée]crire|rechercher|voir tout|tout voir|suggestions?( pour (vous|toi))?|cat[ée]gories|follow( back)?|following|followers|remove|search|partager|ajouter|modifier|annuler|ok)$/i;
  const deColle = t => { const L = String(t || "").split(/\r?\n/).map(l => l.replace(/[\p{Extended_Pictographic}‍️•·✓✔|]+/gu, " ")
        .replace(/\s+(suivre( en retour)?|suivi\(e\)|suivie?|abonn[ée]+(\(e\))?|supprimer|retirer|message)\s*$/i, "").replace(/\s+/g, " ").trim())
      .filter(l => l && /\p{L}/u.test(l) && !BOUTONS.test(l) && !/^\d{1,2}[:h]\d{2}\b/.test(l) && !/^[\d\s.,]+\s*(k|m|mille)?\s*(abonn|publication|follow|post)/i.test(l) && !/^[<>‹›←…\s]+$/.test(l));
    const pseudo = l => /^@?[a-z0-9._]{2,30}$/.test(l) && (/^@/.test(l) || /[._\d]/.test(l)), sortie = [];
    for (let i = 0; i < L.length; i++) { const l = L[i];
      if (pseudo(l)) { const p = "@" + l.replace(/^@/, ""), s = L[i + 1]; if (s && !pseudo(s)) { sortie.push(s + " " + p); i++; } else sortie.push(p); }
      else sortie.push(l); }
    const avecNom = new Set(sortie.filter(l => !/^@/.test(l)).map(l => (l.match(/@[\w.]+$/) || [""])[0]).filter(Boolean));
    return sortie.filter((l, i) => !(/^@[\w.]+$/.test(l) && avecNom.has(l)) && sortie.indexOf(l) === i).join("\n"); };
  /* les fichiers : une fiche contact de l'iPhone (.vcf) ou un tableau (.csv, Excel « enregistrer en CSV ») */
  const deVcf = t => t.replace(/\r?\n[ \t]/g, "").split(/BEGIN:VCARD/i).slice(1).map(c => { const v = k => { const m = c.match(new RegExp("^" + k + "(?:;[^:\\n]*)?:(.*)$", "im")); return m ? m[1].trim() : ""; };
      const n = v("N").split(";"), fn = v("FN"), tel = v("TEL"); let prenom = (n[1] || "").trim(), nom = (n[0] || "").trim(); if (!prenom && fn) { const w = fn.split(/\s+/); prenom = w.shift(); nom = w.join(" "); }
      return prenom ? `${prenom} ${nom}`.trim() + (tel ? " " + tel : "") : ""; }).filter(Boolean).join("\n");
  const deCsv = t => { const L = t.split(/\r?\n/).filter(x => x.trim()), sep = (L[0] || "").split(";").length > (L[0] || "").split(",").length ? ";" : ",", cols = L.map(l => l.split(sep).map(x => x.replace(/^"|"$/g, "").trim()));
      const h = (cols[0] || []).map(x => x.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")), i = r => h.findIndex(x => r.test(x)), ip = i(/prenom|first/), inn = i(/^nom|last|family/), it = i(/tel|phone|mobile|portable/), entete = ip >= 0 || inn >= 0 || it >= 0;
      return (entete ? cols.slice(1) : cols).map(c => entete ? [c[ip] || "", c[inn] || "", c[it] || ""].join(" ").trim() : c.join(" ").trim()).filter(Boolean).join("\n"); };
  /* 21/11 (Marie) : ce qu'elle a écrit dans « Importer » est gardé (fenêtre fermée, appli quittée pour Insta…) jusqu'à « Ajouter » */
  const BR = "loginail-import-brouillon", brLit = () => { try { return localStorage.getItem(BR) || ""; } catch (e) { return ""; } }, brEcrit = v => { try { v ? localStorage.setItem(BR, v) : localStorage.removeItem(BR); } catch (e) {} };
  const feuillePlusieurs = () => { pl0(); const z = E.querySelector("#s5-liste"); if (z && brLit()) { z.value = brLit(); z.dispatchEvent(new Event("input", { bubbles: true })); } };
  /* 21/11 (Marie) : comme sur loginail.fr « Créer mon site » : une pastille par appli, « Touche la tienne », et les étapes VRAIES de chaque appli
     (vérifiées le 21/11 dans leurs pages d'aide : Planity et Booksy n'ont pas de bouton pour la pro, il faut leur écrire ; Treatwell et Fresha, oui) */
  const IMP = {
    planity: { n: "Planity", c: "#1E1C1B", mail: "contact@planity.com", t: ["Écris à <b>contact@planity.com</b> depuis l’adresse mail de ton compte Planity (pas par téléphone : Planity refuse, par sécurité).", "Demande ton <b>fichier clients</b>. Planity te l’envoie par mail, ou active pour toi le bouton <b>Clients › Fichier client › Gestion › Exporter</b>.", "Enregistre le fichier, reviens ici et touche <b>Choisir un fichier</b>."] },
    booksy: { n: "Booksy", c: "#2E7D74", mail: "info.fr@booksy.com", t: ["Écris à Booksy France : <b>info.fr@booksy.com</b>. Kiute, c’est maintenant Booksy : c’est pareil.", "Demande <b>la liste de tes clients en fichier CSV</b>. Booksy te l’envoie par mail.", "Enregistre le fichier, reviens ici et touche <b>Choisir un fichier</b>."] },
    treatwell: { n: "Treatwell", c: "#E5674A", t: ["Sur un <b>ordinateur</b>, connecte-toi à Treatwell Connect avec le compte <b>propriétaire</b>.", "Onglet <b>Clients</b> en haut, puis <b>Exporter</b> en bas à droite : le fichier se télécharge.", "Sur cet ordinateur, ouvre <b>app.loginail.fr</b>, puis Clientes › Importer › <b>Choisir un fichier</b>."] },
    fresha: { n: "Fresha", c: "#6B5CE7", t: ["Dans l’appli Fresha, touche <b>Clients</b> en bas.", "Touche les <b>3 points</b> en haut à droite, puis <b>CSV</b>.", "Enregistre-le dans Fichiers, reviens ici et touche <b>Choisir un fichier</b>."] },
    contacts: { n: "Mes contacts", ic: '<circle cx="8" cy="5.6" r="2.6"/><path d="M3 13.6c.6-2.6 2.6-3.9 5-3.9s4.4 1.3 5 3.9"/>', t: ["Ouvre <b>Contacts</b> sur ton iPhone et touche <b>Listes</b> en haut à gauche.", "Reste appuyée sur une liste (« Tous les contacts », ou une liste « Clientes »), puis touche <b>Exporter</b>.", "<b>Enregistrer dans Fichiers</b>, reviens ici et touche <b>Choisir un fichier</b>."] },
    autre: { n: "Autre appli", ic: '<path d="M6.5 9.5l3-3M7 4.5l1.2-1.2a2.8 2.8 0 0 1 4 4L11 8.5M9 11.5l-1.2 1.2a2.8 2.8 0 0 1-4-4L5 7.5"/>', t: ["Écris au <b>service client</b> de ton appli de réservation.", "Demande <b>l’export de ton fichier clients</b> (Excel ou CSV). Ce sont tes données : la loi (RGPD) l’oblige à te les donner.", "Enregistre le fichier, reviens ici et touche <b>Choisir un fichier</b>."] } };
  const MAILIMP = "Bonjour,%0A%0AJe souhaite récupérer mon fichier clients (prénoms, noms, téléphones) en fichier Excel ou CSV.%0A%0AMerci !";
  const impAide = k => { const A = IMP[k]; return `<ol class="s5-gestes">${A.t.map((x, i) => `<li style="animation-delay:${i * 60}ms"><i>${i + 1}</i><span>${x}</span></li>`).join("")}</ol>`
    + (A.mail ? `<button class="s5-ecrire" data-href="mailto:${A.mail}?subject=${encodeURIComponent("Mon fichier clients")}&body=${MAILIMP}">Écrire à ${A.n}</button>` : ""); };
  const pl0 = () => ouvre(`<h3>Importer mes clientes</h3><div class="sous">Pour ne pas tout retaper quand tu commences.</div>
      <p class="s5-ou">Touche la tienne pour voir où trouver le fichier :</p>
      <div class="s5-srcs">${Object.keys(IMP).map(k => `<button type="button" data-s5i="${k}">${IMP[k].ic ? `<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.3">${IMP[k].ic}</svg>` : `<i style="background:${IMP[k].c}"></i>`}${IMP[k].n}</button>`).join("")}</div>
      <div class="s5-aide" id="s5-aide"></div>
      <label class="btn" style="display:block;margin-top:14px;text-align:center;cursor:pointer">Choisir un fichier<input type="file" id="s5-fic" accept=".vcf,.csv,.txt,.xlsx,.xls,text/vcard,text/csv,text/plain,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel" hidden></label>
      <div class="lab2" style="margin-top:18px">Ou écris-les : une par ligne</div><div class="sous" style="text-align:left;margin:-2px 0 8px;font-size:12.5px">D’abord le prénom, puis le nom, puis le numéro. Le nom et le numéro ne sont pas obligatoires. Astuce : sur une capture d’écran, dans Photos, reste appuyée sur un mot, « Tout sélectionner », « Copier », puis colle ici.</div>
      <textarea class="msg" id="s5-liste" autocapitalize="words" style="height:150px" placeholder="Prénom Nom Téléphone&#10;&#10;Par exemple :&#10;Jade Martin 06 12 34 56 78&#10;Inès Moreau&#10;Sarah"></textarea>
      <button class="btn" data-s5="pl-ok" style="margin-top:12px" disabled>Ajouter</button>`);
  document.addEventListener("click", e => { const b = e.target.closest && e.target.closest("[data-s5i]"); if (!b) return; e.stopPropagation();
    const z = E.querySelector("#s5-aide"), on = !b.classList.contains("on"); E.querySelectorAll("[data-s5i]").forEach(x => x.classList.toggle("on", on && x === b));
    z.innerHTML = on ? impAide(b.dataset.s5i) : ""; z.classList.toggle("on", on); }, true);
  /* 21/11 : Planity et Treatwell donnent souvent un fichier Excel : on le lit aussi (le lecteur ne se charge que ce jour-là) */
  let XLP = null; const xlsx = () => XLP || (XLP = new Promise((ok, ko) => { if (window.XLSX) return ok(window.XLSX); const sc = document.createElement("script"); sc.src = "https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js"; sc.onload = () => ok(window.XLSX); sc.onerror = () => { XLP = null; ko(); }; document.head.appendChild(sc); }));
  document.addEventListener("change", async e => { if (e.target.id !== "s5-fic") return; const f = e.target.files && e.target.files[0]; if (!f) return; e.target.value = "";
    const met = t => { const l = /BEGIN:VCARD/i.test(t) ? deVcf(t) : deCsv(t), z = E.querySelector("#s5-liste"); if (!l || !z) return dit("Aucune cliente trouvée dans ce fichier"); z.value = (z.value.trim() ? z.value.trim() + "\n" : "") + l; z.dispatchEvent(new Event("input", { bubbles: true })); dit("Vérifie la liste, puis touche « Ajouter »"); };
    if (/\.xlsx?$/i.test(f.name) || /sheet|excel/i.test(f.type)) { try { const X = await xlsx(), w = X.read(await f.arrayBuffer(), { type: "array" }); met(X.utils.sheet_to_csv(w.Sheets[w.SheetNames[0]], { FS: ";", blankrows: false })); } catch (x) { dit("Ce fichier Excel ne s’ouvre pas. Réessaie avec Internet."); } return; }
    const r = new FileReader(); r.onload = () => met(String(r.result || "")); r.readAsText(f); });
  const cl1 = VUES.cl; VUES.cl = () => { const h = cl1(), rep = "Ajouter une cliente</button>"; return h.includes(rep) && S.clientes.length < 10 && !S.cherche.trim() ? h.replace(rep, rep + `<button class="s5-plus" data-s5="plusieurs">J’ai déjà des clientes : les importer</button>`) : h; };
  const re2 = VUES.re; VUES.re = () => { const h = re2(), rep = '<div class="k">Mes données</div><div class="liste">'; return h.includes(rep) ? h.replace(rep, rep + `<div class="ligne" data-s5="plusieurs">${sv('<path d="M12 20V9M7 13l5-5 5 5M5 4h14"/>')}<div class="t">Importer mes clientes<span>Depuis mes contacts, un fichier ou une photo</span></div><span class="fl">›</span></div>`) : h; };
  document.addEventListener("paste", e => { if (e.target.id !== "s5-liste") return; const t = e.clipboardData && e.clipboardData.getData("text/plain"); if (!t || !/\n/.test(t)) return; e.preventDefault();
    const z = e.target, propre = deColle(t), a = z.selectionStart, b = z.selectionEnd; z.value = z.value.slice(0, a) + propre + z.value.slice(b); z.selectionStart = z.selectionEnd = a + propre.length; z.dispatchEvent(new Event("input", { bubbles: true })); if (propre) dit("Vérifie la liste, puis touche « Ajouter »"); });
  document.addEventListener("input", e => { if (e.target.id !== "s5-liste") return; brEcrit(e.target.value); const n = lis(e.target.value).length, b = E.querySelector('[data-s5="pl-ok"]'); if (b) { b.disabled = !n; b.textContent = n ? `Ajouter ${n} cliente${n > 1 ? "s" : ""}` : "Ajouter"; } });

  document.addEventListener("click", async e => { const t = e.target; if (!t.closest) return;
    /* 13/11 (iPhone) : la fenêtre « 13h · nouveau rendez-vous · bloquer » ne s'ouvre que dans l'Agenda, sur la case vraiment touchée */
    const cr = t.closest('.vue.on .pap .pl[data-a="creneau"]'); if (cr && S.onglet === "ag" && !E.querySelector(".vue.on .calm") && (!window.__s5t || window.__s5t === cr || Date.now() - window.__s5d > 1500)) { e.stopPropagation(); e.preventDefault(); return feuilleCreneau(+cr.dataset.m); }
    const a = t.closest("[data-s5]"); if (!a) return; e.stopPropagation(); const k = a.dataset.s5;
    if (k === "quart") { BL.m = +a.dataset.m;
      E.querySelectorAll('[data-s5="quart"]').forEach(b => b.classList.toggle("on", b === a)); const ap = E.querySelector("#s5-ap"); if (ap) ap.textContent = BL.apres && BL.m === BL.apM ? "juste après " + BL.apres : ""; }
    else if (k === "rdv") feuilleNouveau(BL.m);
    else if (k === "bloquer") feuilleBloquer();
    else if (k === "bl-d") { BL.n = E.querySelector("#bl-n").value; BL.d = +a.dataset.d; BL.libre = false; BL.fj = false; feuilleBloquer(); }
    else if (k === "bl-fj") { BL.n = E.querySelector("#bl-n").value; BL.fj = true; BL.libre = false; feuilleBloquer(); }
    else if (k === "bl-libre") { BL.n = E.querySelector("#bl-n").value; BL.libre = true; BL.fj = false; feuilleBloquer(); }
    else if (k === "bl-ok") { if (BL.libre) { const v = (E.querySelector("#bl-fin").value || "").split(":").map(Number); const f = v[0] * 60 + (v[1] || 0); if (!(f > BL.m)) return dit("L’heure de fin doit être après " + hM(BL.m)); BL.d = f - BL.m; } else if (BL.fj) BL.d = finJour() - BL.m;
      const deb = new Date(S.jour); deb.setHours(0, BL.m, 0, 0); const fin = new Date(+deb + BL.d * 60000), note = (E.querySelector("#bl-n").value || "").trim();
      const genes = S.rdv.filter(r => r.statut !== "annule" && new Date(r.debut) < fin && new Date(r.fin) > deb).sort((x, y) => new Date(x.debut) - new Date(y.debut));
      /* 23/11 (Marie) : « jusqu'à la fin de journée » bloque tous les trous libres ; les rendez-vous déjà pris restent */
      let morceaux = [[deb, fin]];
      if (genes.length && !BL.fj) return dit("Il y a déjà un rendez-vous sur ce créneau");
      if (genes.length) { morceaux = []; let c = deb; genes.forEach(r => { const x = new Date(r.debut), y = new Date(r.fin); if (x > c) morceaux.push([c, x]); if (y > c) c = y; }); if (fin > c) morceaux.push([c, fin]); morceaux = morceaux.filter(m => m[1] - m[0] >= 5 * 60000); if (!morceaux.length) return dit("Ta journée est déjà pleine jusqu’au soir"); }
      a.disabled = true; const { error } = await sb.from("rendez_vous").insert(morceaux.map(m => ({ cliente_id: null, prestation_id: null, titre: note || "Bloqué", debut: m[0].toISOString(), fin: m[1].toISOString(), prix: null })));
      if (error) { a.disabled = false; return dit("Oups, ça n’a pas marché. Réessaie."); } await chargeSemaine(); chargeVisites(); ferme(); rendu(); dit(BL.fj ? (genes.length ? "Bloqué jusqu’au soir ✓ Tes rendez-vous restent" : "Bloqué jusqu’au soir ✓") : "Créneau bloqué ✓"); }
    else if (k === "plusieurs") feuillePlusieurs();
    else if (k === "pl-ok") { const deja = new Set(S.clientes.map(c => nomCli(c).toLowerCase())), igDeja = new Set(S.clientes.map(c => c.instagram).filter(Boolean)), l = lis(E.querySelector("#s5-liste").value).filter((c, i, t) => !deja.has(nomCli(c).toLowerCase()) && !(c.instagram && igDeja.has(c.instagram)) && t.findIndex(x => nomCli(x).toLowerCase() === nomCli(c).toLowerCase()) === i); if (!l.length) return dit("Ces clientes sont déjà dans ta liste"); a.disabled = true; a.textContent = "Un instant…";
      const { error } = await sb.from("clientes").insert(l); if (error) { a.disabled = false; a.textContent = "Ajouter"; return dit("Oups, ça n’a pas marché. Réessaie."); }
      const { data } = await sb.from("clientes").select("*").order("prenom"); S.clientes = data || []; brEcrit(""); ferme(); rendu(); dit(l.length > 1 ? l.length + " clientes ajoutées ✓" : "Cliente ajoutée ✓"); }
  }, true);
})();

/* ===== 13/11 (Marie, essai sur iPhone) : « Réservé en ligne » en noir · le mois se change en glissant · la barre du bas rétrécit quand on descend ===== */
(function () {
  const st = document.createElement("style");
  st.textContent = `.en-ligne{background:#1E1C1B!important;color:#fff!important}.pr.ligne-en{box-shadow:inset 3px 0 0 #1E1C1B!important}
.ong.o1{transition:transform .28s cubic-bezier(.2,.8,.2,1),opacity .28s;transform-origin:50% 100%}.ong.o1.mini{transform:scale(.8);opacity:.94}`;
  document.head.appendChild(st);
  /* le mois : glisser à gauche = mois d'après, à droite = mois d'avant.
     18/11 (Marie : « le swipe du calendrier n'est pas joli ») : comme la semaine, le mois suit le doigt et le mois voisin arrive collé à côté
     (les flèches ‹ › font le même glissement). */
  const GM = 18;
  const grilleDe = dt => { const v = S.moisVu; S.moisVu = dt; const h = calMois(); S.moisVu = v; const d = document.createElement("div"); d.innerHTML = h; return d.querySelector(".calm>div:nth-child(2)"); };
  const prepMois = c => { const g = c.querySelector(":scope>div:nth-child(2)"); if (!g || g.querySelector(":scope>.mo-v")) return g;
    c.style.overflow = "hidden"; g.style.position = "relative"; const v = S.moisVu;
    [-1, 1].forEach(d => { const n = grilleDe(new Date(v.getFullYear(), v.getMonth() + d, 1)); if (!n) return; n.classList.add("mo-v"); n.setAttribute("aria-hidden", "true");
      n.style.cssText += `;position:absolute;top:0;left:calc(${d * 100}% + ${d * GM}px);width:100%;pointer-events:none`; g.appendChild(n); });
    return g; };
  let moAnim = false;
  const glisseMois = async (d, g) => { if (moAnim) return; moAnim = true; g = g || prepMois(E.querySelector(".vue.on .calm")); if (!g) { moAnim = false; return; }
    g.style.transition = "transform .28s cubic-bezier(.2,.8,.2,1)"; g.style.transform = `translateX(calc(${-d * 100}% - ${d * GM}px))`;
    await new Promise(r => setTimeout(r, 280)); S.moisVu = new Date(S.moisVu.getFullYear(), S.moisVu.getMonth() + d, 1); moAnim = false; rendu(); };
  let mx = null, my = 0, mBouge = false;
  E.addEventListener("touchstart", e => { mx = e.target.closest && e.target.closest(".calm") && e.touches.length === 1 && !moAnim ? e.touches[0].clientX : null; my = e.touches[0].clientY; mBouge = false; }, { passive: true });
  E.addEventListener("touchmove", e => { if (mx == null) return; const dx = e.touches[0].clientX - mx, dy = e.touches[0].clientY - my;
    if (!mBouge) { if (Math.abs(dx) < 8 && Math.abs(dy) < 8) return; if (Math.abs(dy) >= Math.abs(dx)) { mx = null; return; } mBouge = true; }
    if (e.cancelable) e.preventDefault(); const g = prepMois(E.querySelector(".vue.on .calm")); if (g) { g.style.transition = "none"; g.style.transform = `translateX(${dx}px)`; } }, { passive: false });
  E.addEventListener("touchend", e => { if (mx == null || !mBouge) { mx = null; return; } const dx = e.changedTouches[0].clientX - mx; mx = null; mBouge = false; window.__moAvale = Date.now();
    const g = E.querySelector(".vue.on .calm>div:nth-child(2)"); if (!g) return;
    if (Math.abs(dx) < 45) { g.style.transition = "transform .25s cubic-bezier(.2,.8,.2,1)"; g.style.transform = ""; return; }
    glisseMois(dx < 0 ? 1 : -1, g); }, { passive: true });
  document.addEventListener("click", e => { const t = e.target.closest && e.target.closest(".calm"); if (!t) return;
    if (Date.now() - (window.__moAvale || 0) < 400) { e.stopPropagation(); e.preventDefault(); return; }
    const b = e.target.closest('[data-a="mois-nav"]'); if (b) { e.stopPropagation(); e.preventDefault(); glisseMois(+b.dataset.n); } }, true);
  /* la barre du bas : plus petite quand on descend, normale quand on remonte ou tout en haut */
  let dernier = 0;
  E.addEventListener("scroll", e => { const v = e.target; if (!v.classList || !v.classList.contains("vue")) return; const y = v.scrollTop, n = E.querySelector(".ong.o1"); if (!n) return;
    if (y < 20) n.classList.remove("mini"); else if (y > dernier + 6) n.classList.add("mini"); else if (y < dernier - 6) n.classList.remove("mini");
    dernier = y; }, true);
})();

/* ===== 13/11 (Marie, essai iPhone 2) : prestations alignées · bouton « Aujourd'hui » dans l'agenda · réglage « Mon agenda suit mes horaires » ===== */
(function () {
  const st = document.createElement("style");
  st.textContent = `.fc .chips{display:grid!important;grid-template-columns:1fr 1fr;gap:8px}
.fc .chips .chip{display:flex;flex-direction:column;align-items:flex-start;justify-content:center;gap:2px;text-align:left;min-height:52px;padding:9px 12px;border-radius:16px;font-size:13.5px;line-height:1.2;width:100%;box-sizing:border-box}
.fc .chips .chip span{font-size:11.5px;opacity:.6}
.su-auj2{height:42px;padding:0 15px 0 12px;display:inline-flex;align-items:center;gap:6px;border-radius:21px;border:0;background:#fff;color:var(--acc,#1E1C1B);font:400 14px Jost,sans-serif;white-space:nowrap;overflow:hidden;max-width:160px;cursor:pointer;flex:none;transition:transform .12s}.su-auj2 svg{flex:none}.su-auj2:active{transform:scale(.94)}.su-auj2.arrive{animation:suAuj .26s cubic-bezier(.2,.8,.2,1)}.su-auj2.part{animation:suAuj .2s cubic-bezier(.4,0,1,1) reverse forwards;pointer-events:none}@keyframes suAuj{from{opacity:0;transform:scale(.85);max-width:0;padding:0;margin-right:-8px}to{opacity:1;transform:none;max-width:160px;padding:0 15px 0 12px;margin-right:0}}@media (prefers-reduced-motion:reduce){.su-auj2.arrive{animation:none}.su-auj2.part{display:none}}`;
  document.head.appendChild(st);
  const auj = () => { const d = new Date(); d.setHours(0, 0, 0, 0); return d; };
  /* Marie, 17/11 (maquettes/agenda-aujourdhui.html, version A) : le mot « Aujourd’hui » en toutes lettres, seulement quand on regarde un autre jour ;
     il arrive en glissant et repart en glissant (une seule fois, pas à chaque redessin) */
  let loin0 = false;
  const ag0 = VUES.ag; VUES.ag = () => { const h = ag0(), loin = !memeJour(S.jour, new Date()), avant = loin0; loin0 = loin;
    if (!loin && !avant) return h;
    const cl = loin ? (avant ? "" : " arrive") : " part";
    return h.replace('<button data-a="mois"', `<button data-su="auj" aria-label="Revenir à aujourd’hui" class="su-auj2${cl}"${loin ? "" : ' tabindex="-1" aria-hidden="true"'}><svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 14 4 9l5-5"/><path d="M4 9h10.5a5.5 5.5 0 0 1 0 11H11"/></svg>Aujourd’hui</button><button data-a="mois"`); };
  const re0 = VUES.re; VUES.re = () => { const h = re0(), on = localStorage.getItem("loginail-agenda-horaires") === "oui";
    const l = `<div class="ligne"><div class="t">Veux-tu que ton agenda suive tes horaires ?<span>${on ? "Oui : comme sur ton site" : "Non : mes heures à moi"}</span></div><button class="sw${on ? " on" : ""}" data-su="ag-hor" aria-label="Mon agenda suit mes horaires"></button></div>`;
    for (const rep of ['<div class="k">Mes réservations</div><div class="liste">', '<div class="k">Mon salon</div><div class="liste">', '<div class="k">Mes données</div><div class="liste">']) if (h.includes(rep)) return h.replace(rep, rep + l);
    return h; };
  document.addEventListener("click", async e => { const t = e.target; if (!t.closest) return;
    if (t.closest('[data-su="auj"]')) { e.stopPropagation(); e.preventDefault(); const d = auj(); S.jour = d; S.lundi = plusJours(d, -((d.getDay() + 6) % 7)); await chargeSemaine(); rendu(); return; }
    if (t.closest('[data-su="ag-hor"]')) { e.stopPropagation(); e.preventDefault(); const on = localStorage.getItem("loginail-agenda-horaires") === "oui"; localStorage.setItem("loginail-agenda-horaires", on ? "non" : "oui"); rendu(); dit(on ? "L’agenda montre tes heures à toi" : "L’agenda suit tes horaires"); } }, true);
})();

/* ===== 13/11 (Marie, essai iPhone 3) : heures bien centrées · cliente qu'on retrouve en tapant la 1re lettre · accueil : 5 rendez-vous puis « voir les autres »,
   les anniversaires du jour · « Mon site » : un vrai écran d'attente et une croix propre ===== */
(function () {
  const st = document.createElement("style");
  st.textContent = `.ecran input[type=time],.ecran input[type=date]{-webkit-appearance:none!important;appearance:none!important;height:52px!important;min-height:52px;line-height:52px!important;padding-top:0!important;padding-bottom:0!important;box-sizing:border-box}
.ecran input[type=time]::-webkit-date-and-time-value,.ecran input[type=date]::-webkit-date-and-time-value{text-align:left;line-height:52px;margin:0;min-height:52px}
.n-sug{display:flex;flex-direction:column;gap:4px;margin-top:6px}.n-sug:empty{display:none}
.n-sug.n-sug-f{position:absolute;left:0;right:0;top:calc(100% + 6px);margin:0;z-index:8;background:#F6F3EF;border-radius:16px;padding:6px;box-shadow:0 18px 36px -14px rgba(30,20,22,.45);animation:nSug .16s ease-out}
.n-sug.n-sug-f button{box-shadow:0 1px 2px rgba(0,0,0,.05)}
.fc .n-sug.n-sug-f{margin:0!important;padding:6px!important;gap:6px!important}
@keyframes nSug{from{opacity:0;transform:translateY(-4px)}to{opacity:1;transform:none}}
.n-sug button{display:flex;align-items:center;gap:10px;width:100%;border:0;background:#fff;border-radius:12px;padding:7px 10px;font:inherit;font-size:14px;text-align:left;color:inherit}
.n-sug button i{flex:none;width:26px;height:26px;border-radius:50%;background:#EFE9E2;display:grid;place-items:center;font-style:normal;font-size:11px;font-weight:500}
.n-sug button span{margin-left:auto;font-size:12px;opacity:.5}
.acc-plus{display:block;width:100%;border:0;background:none;padding:12px 0 4px;font:inherit;font-size:13.5px;text-decoration:underline;text-underline-offset:3px;color:#6B625C}
.anv{display:flex;align-items:center;gap:12px;background:#fff;border-radius:20px;padding:12px 14px;margin:0 0 10px}
.anv .ic{flex:none;width:38px;height:38px;border-radius:50%;background:var(--acc,#1E1C1B);color:#fff;display:grid;place-items:center}
.anv .t{flex:1;min-width:0;font-size:14px;line-height:1.3}.anv .t span{display:block;font-size:12px;opacity:.6;margin-top:2px}
.anv a,.anv button{flex:none;border:0;background:var(--acc,#1E1C1B);color:#fff;border-radius:99px;padding:8px 13px;font:inherit;font-size:12.5px;text-decoration:none}
.ms2-grand{padding-top:env(safe-area-inset-top);box-sizing:border-box}
.ms2-x{top:calc(env(safe-area-inset-top) + 10px)!important;right:12px!important;width:40px!important;height:40px!important;background:#fff!important;color:#1E1C1B!important;box-shadow:0 8px 20px -8px rgba(0,0,0,.45);font-size:24px!important;line-height:40px!important;z-index:5!important}
.ms2-att{position:absolute;inset:0;z-index:4;background:#F6F3EF;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:14px;transition:opacity .35s}
.ms2-att.parti{opacity:0;pointer-events:none}
.ms2-att i{width:62px;height:62px;display:block;animation:ms2p 1.1s ease-in-out infinite}.ms2-att i svg{width:100%;height:100%;display:block}
.ms2-att span{font-size:12px;letter-spacing:.2em;text-transform:uppercase;color:#8C847D}
@keyframes ms2p{0%,100%{transform:scale(.92);opacity:.85}50%{transform:scale(1);opacity:1}}`;
  document.head.appendChild(st);
  const sansAcc = t => String(t || "").normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().trim();
  /* la cliente : on tape A → toutes celles dont le prénom ou le nom commence par A */
  /* 22/11 (Marie, iPhone : « quand je tape C, ça monte, puis ça redescend petit à petit ») : la liste des clientes FLOTTE sous la case,
     par-dessus les prestations ; la fenêtre garde toujours la même taille, quel que soit le nombre de clientes proposées */
  const propose = () => { const inp = E.querySelector("#n-cli"), z = E.querySelector("#n-sug"); if (!inp || !z) return; const q = sansAcc(inp.value);
    const rg = inp.parentElement; if (rg && z.parentElement !== rg) { rg.style.position = "relative"; rg.appendChild(z); z.classList.add("n-sug-f"); }
    if (!q) { z.innerHTML = ""; return; }
    /* 22/11 (Marie, iPhone : « une lettre au pif, ça m'a ouvert la page en super grand ») : avec UNE lettre, seulement les prénoms ;
       4 lignes au plus, petites, dans une boîte qui défile : la fenêtre ne grandit plus d'un coup */
    /* 23/11 (Marie : « quand j'ai que l'Insta, la recherche marche pas avec les premières lettres ») : une cliente venue par Insta
       s'appelle « @lea.nails » ; on oublie le « @ » des deux côtés et on cherche aussi dans son Instagram (« lea », « nails ») */
    const sa = t => sansAcc(t).replace(/^@+/, ""), qq = q.replace(/^@+/, "");
    if (!qq) { z.innerHTML = ""; return; }
    const mots = c => { const ig = sa(c.instagram); return [sa(c.prenom), sa(c.nom), sa(nomCli(c)), ig, ...ig.split(/[^a-z0-9]+/)].filter(Boolean); };
    const l = S.clientes.filter(c => qq.length < 2 ? [sa(c.prenom), sa(c.instagram)].some(m => m && m.startsWith(qq)) : mots(c).some(m => m.startsWith(qq)))
      .sort((a, b) => (sa(b.prenom).startsWith(qq) - sa(a.prenom).startsWith(qq)) || sa(nomCli(a)).localeCompare(sa(nomCli(b)), "fr"));
    if (l.length === 1 && sansAcc(nomCli(l[0])) === q) { z.innerHTML = ""; return; }
    z.innerHTML = l.slice(0, 4).map(c => `<button type="button" data-su="n-pick" data-n="${esc(nomCli(c))}"><i>${esc(((String(c.prenom || "").replace(/^@+/, ""))[0] || "") + ((c.nom || "")[0] || "")).toUpperCase()}</i>${esc(nomCli(c))}${c.telephone ? `<span>${esc(c.telephone)}</span>` : ""}</button>`).join("")
      + (l.length > 4 ? `<div class="sous" style="font-size:12px;margin:2px 0 0">+ ${l.length - 4} autre${l.length - 4 > 1 ? "s" : ""} : tape la suite du prénom</div>` : "")
      + (!l.length ? `<div class="sous" style="font-size:12.5px;text-align:left">Aucune cliente à ce nom : elle sera créée.</div>` : ""); };
  document.addEventListener("input", e => { if (e.target.id === "n-cli") propose(); });
  /* l'accueil : les anniversaires du jour, au-dessus de « Aujourd'hui » */
  const acc1 = VUES.acc; VUES.acc = () => { const h = acc1(), t = new Date(), md = String(t.getMonth() + 1).padStart(2, "0") + "-" + String(t.getDate()).padStart(2, "0");
    const l = S.clientes.filter(c => c.anniversaire && String(c.anniversaire).slice(5, 10) === md); if (!l.length) return h;
    const gateau = '<svg viewBox="0 0 24 24" width="19" height="19" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M4 20h16M5 20v-6a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v6M5 16c1.5 1 3 1 4.5 0s3-1 4.5 0 3 1 4.5 0M12 12V8M12 5.5c.8-.8.8-1.7 0-2.5-.8.8-.8 1.7 0 2.5z"/></svg>';
    const salon = (S.profil && S.profil.nom_salon) || "votre salon";
    const b = l.map(c => { const tel = (c.telephone || "").replace(/\s/g, ""), txt = encodeURIComponent(`Joyeux anniversaire ${c.prenom || ""} ! Très belle journée de la part de ${salon}.`);
      return `<div class="anv"><div class="ic">${gateau}</div><div class="t">C’est l’anniversaire de <b>${esc(nomCli(c))}</b><span>${c.ok_sms_anniv ? "Elle reçoit ton SMS d’anniversaire aujourd’hui ✓" : tel ? "Envoie-lui un petit mot, elle va adorer" : "Ajoute son numéro pour lui écrire"}</span></div>${!c.ok_sms_anniv && tel ? `<a href="sms:${esc(tel)}&body=${txt}">Lui écrire</a>` : ""}</div>`; }).join("");
    for (const rep of ['<div class="su-t3">', '<div class="k">Encore libre', '<div class="k">Aujourd’hui']) if (h.includes(rep)) return h.replace(rep, `<div style="margin-top:4px">${b}</div>` + rep); return h + b; };
  document.addEventListener("click", e => { const t = e.target; if (!t.closest) return;
    const pk = t.closest('[data-su="n-pick"]'); if (pk) { e.stopPropagation(); e.preventDefault(); const inp = E.querySelector("#n-cli"); if (inp) { inp.value = pk.dataset.n; inp.dispatchEvent(new Event("change", { bubbles: true })); } E.querySelector("#n-sug").innerHTML = ""; return; }
    if (t.closest('[data-su="acc-plus"]')) { e.stopPropagation(); e.preventDefault(); S.accTout = !S.accTout; rendu(); } }, true);
  /* « Mon site » : écran d'attente propre jusqu'à ce que la page soit prête */
  new MutationObserver(() => document.querySelectorAll(".ms2-grand").forEach(o => { if (o._att) return; o._att = 1; const f = o.querySelector("iframe"); if (!f) return;
    const a = document.createElement("div"); a.className = "ms2-att"; a.innerHTML = `<i><svg viewBox="0 0 200 200"><rect width="200" height="200" rx="44" fill="#1E1C1B"/><g transform="translate(26 70) scale(.52)"><rect x="0" y="5" width="225" height="120" rx="60" fill="#F3EEE8"/><g class="ongle"><path d="M172 21H215C254 21 282 42 282 65C282 88 254 109 215 109H172A44 44 0 0 1 172 21Z" fill="#F3EEE8"/><path d="M172 28H213C247 28 274 47 274 65C274 83 247 102 213 102H172A37 37 0 0 1 172 28Z" fill="#1E1C1B"/></g></g></svg></i><span>Un instant…</span>`; o.appendChild(a);
    const part = () => setTimeout(() => a.classList.add("parti"), 650); f.addEventListener("load", part); setTimeout(() => a.classList.add("parti"), 9000); }))
    .observe(document.body, { childList: true, subtree: true });
})();

/* ===== 13/11 (Marie) : le rappel de la veille se modifie (160 caractères au plus) · la caisse s'active ou s'arrête depuis l'accueil ===== */
(function () {
  const st = document.createElement("style");
  st.textContent = `.rp-t{width:100%;min-height:96px;box-sizing:border-box;border:1px solid rgba(30,28,27,.15);border-radius:16px;padding:12px 14px;font:inherit;font-size:16px;line-height:1.45;background:#fff;resize:none;-webkit-appearance:none}
.rp-tags{display:flex;flex-wrap:wrap;gap:6px;margin-top:8px}.rp-tags button{border:1px solid rgba(30,28,27,.15);background:#fff;border-radius:99px;padding:6px 11px;font:inherit;font-size:12.5px;color:inherit}
.rp-apercu{background:#E9F3EC;border-radius:18px 18px 18px 6px;padding:11px 14px;font-size:14px;line-height:1.45;text-align:left}
#E .rp-apercu{overflow-wrap:anywhere}
.rp-n{font-size:12px;text-align:right;margin-top:4px;opacity:.6}.rp-n.trop{color:#B3261E;opacity:1;font-weight:500}
.rp-alerte{background:#FFF4E5;color:#7A4E00;border-radius:14px;padding:10px 12px;font-size:13px;text-align:left;margin-top:10px}
.acc-caisse{display:flex;align-items:center;gap:12px;background:#fff;border-radius:20px;padding:14px 34px 14px 14px;margin:0 0 10px;position:relative}
.acc-caisse .t{flex:1;font-size:14px;line-height:1.3}.acc-caisse .t span{display:block;font-size:12px;opacity:.6;margin-top:2px}
.acc-caisse .x{position:absolute;top:4px;right:6px;border:0;background:none;font-size:17px;opacity:.4;padding:4px 6px;color:inherit}`;
  document.head.appendChild(st);
  const DEF = "Bonjour {prénom} ! RDV demain {heure} chez {salon}, {adresse}. Tél {tél}.", DEF0 = "Bonjour {prénom} ! RDV demain {heure}, {adresse}. Tél {tél}.";
  const adr = () => [S.profil.adresse, [S.profil.code_postal, S.profil.ville].filter(Boolean).join(" ")].filter(Boolean).join(" ");
  /* 22/11 : le SMS part au nom de « Loginail » : le nom du salon doit rester dans le texte (même règle dans la fonction « sms ») */
  const GSM = "@£$¥èéùìòÇ\nØø\rÅåΔ_ΦΓΛΩΠΨΣΘΞÆæßÉ !\"#¤%&'()*+,-./0123456789:;<=>?¡ABCDEFGHIJKLMNOPQRSTUVWXYZÄÖÑÜ§¿abcdefghijklmnopqrstuvwxyzäöñüà^{}\\[~]|€";
  const net = t => { let o = ""; for (const c of String(t || "").replace(/[’‘`´]/g, "'").replace(/[«»“”]/g, '"').replace(/[–—]/g, "-").replace(/…/g, "...").replace(/\s+/g, " ")) { if (GSM.includes(c)) { o += c; continue; } const d = c.normalize("NFD").replace(/[\u0300-\u036f]/g, ""); if ([...d].every(x => GSM.includes(x))) o += d; } return o.trim(); };
  const long = t => [...t].reduce((n, c) => n + ("^{}\\[~]|€".includes(c) ? 2 : 1), 0);
  const salonSms = () => net(S.profil.nom_salon);
  const rempli = m => { const s = salonSms(), r = corps(m);
    return r && s && !/\{salon\}/i.test(m) && !net(r).toLowerCase().includes(s.toLowerCase()) && long(`${r} - ${s}`) <= 160 ? `${r} - ${s}` : r; };
  const sansNom = m => { const s = salonSms(); return !!s && !!m.trim() && !net(rempli(m)).toLowerCase().includes(s.toLowerCase()); };
  const corps = m => m.replace(/\{salon\}/gi, () => salonSms() || "[ton salon]").replace(/\{pr[ée]nom\}/gi, "Jade").replace(/\{heure\}/gi, "9h00").replace(/\{adresse\}/gi, adr() || "[ton adresse]").replace(/\{t[ée]l\}/gi, S.profil.telephone || "[ton numéro]").replace(/\s+/g, " ").trim();
  const feuille = (val) => { const m = val != null ? val : (S.profil.msg_rappel || DEF), ex = rempli(m), n = long(ex), manque = [!adr() && "ton adresse", !S.profil.telephone && "ton numéro"].filter(Boolean);
    ouvre(`<h3>Rappel la veille</h3><div class="sous">La veille au soir, chaque cliente qui a rendez-vous le lendemain reçoit ce SMS. C’est automatique.</div>
      <div class="lab2">Ton message</div><textarea class="rp-t" id="rp-m" maxlength="200">${esc(m)}</textarea>
      <div class="rp-tags">${["{prénom}", "{heure}", "{salon}", "{adresse}", "{tél}"].map(t => `<button type="button" data-su="rp-tag" data-t="${t}">+ ${t.slice(1, -1)}</button>`).join("")}</div>
      <div class="sous" style="font-size:12px;text-align:left;margin-top:6px">Les mots entre { } changent pour chaque cliente : son prénom, l’heure de son rendez-vous, le nom de ton salon, ton adresse, ton numéro. Si tu oublies le nom de ton salon, il s’ajoute à la fin.</div><div class="rp-alerte" id="rp-nom"${sansNom(m) ? "" : " hidden"}>Pas de place pour le nom de ton salon : raccourcis, sinon ta cliente ne saura pas qui lui écrit.</div>
      <div class="lab2">Exemple : ce que reçoit Jade</div><div class="rp-apercu" id="rp-ap">${esc(ex)}</div><div class="rp-n${n > 160 ? " trop" : ""}" id="rp-n">${n} / 160 caractères${n > 160 ? " · trop long : raccourcis" : ""}</div>
      ${manque.length ? `<div class="rp-alerte">Il manque ${manque.join(" et ")} : ajoute-${manque.length > 1 ? "les" : "la"} dans Réglages › Mon salon, sinon tes clientes ne sauront pas où venir.</div>` : ""}
      <button class="btn" data-su="rp-ok" style="margin-top:14px"${n > 160 ? " disabled" : ""}>Enregistrer</button>
      <button class="lien-t" data-su="rp-def" style="display:block;margin:10px auto 0">Remettre le message de Loginail</button>
      <button class="btn clair" data-a="sms-test" style="margin-top:16px">M’envoyer un essai</button>
      <div class="sous" style="margin-top:8px;font-size:12px">L’essai arrive seulement sur <b>ton</b> téléphone${S.profil.telephone ? " (" + esc(S.profil.telephone) + ")" : ""}, pour voir le SMS. Tes clientes, elles, reçoivent le vrai rappel la veille de leur rendez-vous. 3 essais par jour au plus.</div>`); };
  const maj = () => { const t = E.querySelector("#rp-m"); if (!t) return; const ex = rempli(t.value), n = long(ex), ap = E.querySelector("#rp-ap"), nn = E.querySelector("#rp-n"), ok = E.querySelector('[data-su="rp-ok"]');
    ap.textContent = ex; nn.textContent = n + " / 160 caractères" + (n > 160 ? " · trop long : raccourcis" : ""); nn.classList.toggle("trop", n > 160); if (ok) ok.disabled = n > 160 || !t.value.trim(); const z = E.querySelector("#rp-nom"); if (z) z.hidden = !sansNom(t.value); };
  document.addEventListener("input", e => { if (e.target.id === "rp-m") maj(); });
  /* l'accueil : « Ma caisse » tant qu'elle n'a pas choisi */
  const choisi = () => { try { return localStorage.getItem("loginail-caisse-choisi") === "1"; } catch (e) { return true; } };
  const acc2 = VUES.acc; VUES.acc = () => { const h = acc2(); if (choisi() || !S.profil) return h; const on = !!S.profil.caisse_active;
    const b = `<div class="acc-caisse"><div class="t">Ma caisse<span>${on ? "Activée : tu notes ce que tu encaisses. Tu fais surtout des espèces ? Tu peux l’arrêter." : "Arrêtée. Active-la pour suivre ce que tu encaisses."}</span></div><button class="sw${on ? " on" : ""}" data-su="acc-caisse" aria-label="Utiliser la caisse"></button><button class="x" data-su="acc-caisse-x" aria-label="Masquer">×</button></div>`;
    for (const rep of ['<div class="su-t3">', '<div class="k">Encore libre', '<div class="k">Aujourd’hui']) if (h.includes(rep)) return h.replace(rep, b + rep); return h + b; };
  document.addEventListener("click", async e => { const t = e.target; if (!t.closest) return;
    if (t.closest('[data-a="sms-info"]')) { e.stopPropagation(); e.preventDefault(); return feuille(); }
    const tg = t.closest('[data-su="rp-tag"]'); if (tg) { e.stopPropagation(); const ta = E.querySelector("#rp-m"); const i = ta.selectionStart ?? ta.value.length; ta.value = ta.value.slice(0, i) + tg.dataset.t + ta.value.slice(ta.selectionEnd ?? i); maj(); return; }
    if (t.closest('[data-su="rp-def"]')) { e.stopPropagation(); return feuille(DEF); }
    const ok = t.closest('[data-su="rp-ok"]'); if (ok) { e.stopPropagation(); const v = E.querySelector("#rp-m").value.replace(/\s+/g, " ").trim(); ok.disabled = true;
      const { data, error } = await sb.from("profils").update({ msg_rappel: v === DEF || v === DEF0 ? null : v }).eq("id", S.user.id).select().single();
      if (error) { ok.disabled = false; return dit("Oups, ça n’a pas marché. Réessaie."); } S.profil = data; ferme(); return dit("Ton rappel est enregistré ✓"); }
    if (t.closest('[data-su="acc-caisse"]')) { e.stopPropagation(); e.preventDefault(); const on = !S.profil.caisse_active;
      const { data, error } = await sb.from("profils").update({ caisse_active: on }).eq("id", S.user.id).select().single(); if (error) return dit("Oups, ça n’a pas marché. Réessaie.");
      S.profil = data; try { localStorage.setItem("loginail-caisse-choisi", "1"); } catch (x) {} rendu(); return dit(on ? "Caisse activée · elle reste dans Réglages › Ma caisse" : "Caisse arrêtée · tu pourras la remettre dans Réglages › Ma caisse"); }
    if (t.closest('[data-su="acc-caisse-x"]')) { e.stopPropagation(); e.preventDefault(); try { localStorage.setItem("loginail-caisse-choisi", "1"); } catch (x) {} rendu(); } }, true);
})();

/* ===== 13/11 (Marie) : l'étiquette « lapin » (rendez-vous où elle n'est pas venue) · un message clair quand il n'y a pas de réseau ===== */
(function () {
  const st = document.createElement("style");
  st.textContent = `.lap{display:inline-flex;align-items:center;gap:4px;margin-left:7px;padding:2px 8px;border-radius:99px;background:#F6E3E1;color:#9A2E25;font-size:10.5px;font-weight:500;font-style:normal;letter-spacing:.02em;vertical-align:2px;white-space:nowrap}
h3 .lap{font-size:11px;vertical-align:4px}
.hors{position:absolute;left:50%;top:calc(env(safe-area-inset-top) + 34px);z-index:200;transform:translate(-50%,-60px);transition:transform .3s;display:flex;align-items:center;gap:7px;background:#fff;color:#1E1C1B;border-radius:99px;padding:6px 13px 6px 11px;font-size:12px;letter-spacing:.02em;white-space:nowrap;box-shadow:0 6px 18px -8px rgba(0,0,0,.35)}
.hors.on{transform:translate(-50%,0)}.hors i{flex:none;width:7px;height:7px;border-radius:50%;background:#E5484D}.ecran.horsl .toast{top:calc(env(safe-area-inset-top) + 72px)!important}.ecran.horsl .vue{padding-top:calc(max(62px, env(safe-area-inset-top) + 40px) + 34px)!important;transition:padding-top .3s}`;
  document.head.appendChild(st);
  /* combien de fois elle n'est pas venue */
  const lapins = id => (S.tous || S.rdv || []).filter(r => r.cliente_id === id && r.statut === "absente").length;
  const tag = n => `<em class="lap" title="Rendez-vous où elle n’est pas venue">${n > 1 ? n + " lapins" : "1 lapin"}</em>`;
  const pose = () => {
    E.querySelectorAll(".vue.on .cli[data-cli]").forEach(l => { if (l.dataset.lap) return; l.dataset.lap = "1"; const n = lapins(l.dataset.cli), b = l.querySelector(".t b"); if (n && b) b.insertAdjacentHTML("beforeend", tag(n)); });
    const fh = E.querySelector(".feuille .fi-haut h3"); if (fh && !fh.dataset.lap) { fh.dataset.lap = "1"; const id = (S.clientes.find(c => nomCli(c) === fh.textContent.trim()) || {}).id; const n = id ? lapins(id) : 0; if (n) fh.insertAdjacentHTML("beforeend", tag(n)); }
    const rh = E.querySelector(".feuille .fiche-t h3[data-cli]"); if (rh && !rh.dataset.lap) { rh.dataset.lap = "1"; const n = lapins(rh.dataset.cli); if (n) rh.insertAdjacentHTML("beforeend", tag(n)); } };
  new MutationObserver(pose).observe(E, { childList: true, subtree: true });
  /* pas de réseau : un bandeau en haut, et des messages qui disent vraiment pourquoi */
  const ban = document.createElement("div"); ban.className = "hors"; ban.innerHTML = "<i></i><span>Pas de connexion internet</span>";
  const montre = () => { if (!ban.isConnected) E.appendChild(ban); ban.classList.toggle("on", navigator.onLine === false); E.classList.toggle("horsl", navigator.onLine === false); };
  addEventListener("offline", montre); addEventListener("online", () => { montre(); if (S.user) { try { chargeSemaine().then(() => { chargeVisites(); rendu(); }); } catch (e) {} dit("La connexion est revenue ✓"); } });
  setTimeout(montre, 1500);
  const dit0 = dit; dit = t => dit0(navigator.onLine === false && /Oups|pas marché|Réessaie|Réessayez|Pas enregistré/i.test(t) ? "Pas de connexion : ce n’est pas enregistré. Réessaie quand le réseau revient." : t);
})();

/* ===== 13/11 (Marie) : les photos des ongles — après « C'est fini » et dans la fiche (privées : rangées dans photos-clientes/<sa pro>/<cliente>/) ===== */
(function () {
  const st = document.createElement("style");
  st.textContent = `.ph-bloc{background:#fff;border-radius:20px;padding:12px;margin:14px 0 0}
.ph-bloc .t{display:flex;align-items:center;justify-content:space-between;gap:10px;font-size:14px}
.ph-bloc .t button,.ph-plus{flex:none;border:0;background:var(--acc,#1E1C1B);color:#fff;border-radius:99px;padding:8px 13px;font:inherit;font-size:12.5px;display:inline-flex;align-items:center;gap:6px}
.ph-rang{display:flex;gap:8px;overflow-x:auto;scrollbar-width:none;margin-top:10px}.ph-rang::-webkit-scrollbar{display:none}.ph-rang:empty{display:none}
.ph-rang button{flex:none;width:76px;height:76px;border:0;padding:0;border-radius:14px;overflow:hidden;background:#EFE9E2}
.ph-rang img{width:100%;height:100%;object-fit:cover;display:block}
.ph-rang .att{display:grid;place-items:center;font-size:11px;opacity:.6}
.ph-vue{position:absolute;inset:0;z-index:300;background:rgb(15,14,13);overflow:hidden;touch-action:none;animation:pvIn .24s ease both}
@keyframes pvIn{from{opacity:0}to{opacity:1}}
.ph-vue .pv-piste{position:absolute;left:0;right:0;top:calc(env(safe-area-inset-top) + 64px);bottom:calc(env(safe-area-inset-bottom) + 132px);display:flex;will-change:transform}
.ph-vue .pv-p{flex:none;width:100%;height:100%;display:flex;align-items:center;justify-content:center;padding:0 16px;box-sizing:border-box;overflow:hidden}
.ph-vue .pv-p img{display:block;width:auto;height:auto;max-width:100%;max-height:100%;min-height:0;border-radius:16px;object-fit:contain;-webkit-user-select:none;user-select:none;-webkit-touch-callout:none}
.ph-vue .pv-bas{position:absolute;left:0;right:0;bottom:calc(env(safe-area-inset-bottom) + 18px);display:flex;flex-direction:column;align-items:center;gap:6px;transition:opacity .2s}
.ph-vue .pv-enr{display:flex;align-items:center;gap:8px;border:0;background:#fff;color:#1E1C1B;border-radius:99px;padding:12px 20px;font:inherit;font-size:14px;margin-top:6px;transition:transform .12s}.ph-vue .pv-enr:active{transform:scale(.96)}
.ph-vue .pv-pts{display:flex;gap:6px;justify-content:center;height:6px}.ph-vue .pv-pts i{width:6px;height:6px;border-radius:50%;background:rgba(255,255,255,.35);transition:background .2s,transform .2s}.ph-vue .pv-pts i.on{background:#fff;transform:scale(1.15)}
.ph-vue .x{position:absolute;top:calc(env(safe-area-inset-top) + 12px);right:14px;width:40px;height:40px;border-radius:50%;border:0;background:#fff;color:#1E1C1B;font-size:24px;line-height:40px;padding:0}
.ph-vue .d{font-size:12.5px;color:rgba(255,255,255,.7)}.ph-vue .n{position:absolute;top:calc(env(safe-area-inset-top) + 22px);left:50%;transform:translateX(-50%);color:#fff;font-size:13px;letter-spacing:.08em}
.ph-vue .sup{margin-top:2px;border:0;background:none;color:#F2A8A2;font:inherit;font-size:13.5px;text-decoration:underline;text-underline-offset:3px}`;
  document.head.appendChild(st);
  const ICO = '<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"><path d="M4 8h3l2-2.5h6L17 8h3v11H4z"/><circle cx="12" cy="13" r="3.5"/></svg>';
  const BUCKET = "photos-clientes";
  let CIBLE = null; /* { cliente_id, rendez_vous_id, rangee } */
  const inp = document.createElement("input"); inp.type = "file"; inp.accept = "image/*"; inp.multiple = true; inp.style.display = "none"; document.body.appendChild(inp);
  /* une photo plus légère (1600 px au plus), en JPEG */
  const allege = async f => { try { const bm = await createImageBitmap(f); const k = Math.min(1, 1600 / Math.max(bm.width, bm.height)), c = document.createElement("canvas"); c.width = Math.round(bm.width * k); c.height = Math.round(bm.height * k);
    c.getContext("2d").drawImage(bm, 0, 0, c.width, c.height); return await new Promise(r => c.toBlob(b => r(b || f), "image/jpeg", .85)); } catch (e) { return f; } };
  const liens = async chemins => { if (!chemins.length) return {}; const { data } = await sb.storage.from(BUCKET).createSignedUrls(chemins, 3600); const m = {}; (data || []).forEach(x => { if (x && x.signedUrl) m[x.path] = x.signedUrl; }); return m; };
  const charge = async (cliente_id, rangee) => { if (!rangee) return; const { data } = await sb.from("photos_clientes").select("*").eq("cliente_id", cliente_id).order("cree_le", { ascending: false }).limit(30);
    const l = data || [], u = await liens(l.map(p => p.chemin)); const ok = l.filter(p => u[p.chemin]);
    rangee.innerHTML = ok.map(p => `<button data-ph="voir" data-id="${p.id}" data-c="${esc(p.chemin)}" data-u="${esc(u[p.chemin])}" data-d="${p.cree_le}"><img src="${esc(u[p.chemin])}" alt="Photo de la pose" loading="lazy"></button>`).join("");
    const n = rangee.closest(".ph-bloc")?.querySelector(".nb"); if (n) n.textContent = ok.length ? ok.length + " photo" + (ok.length > 1 ? "s" : "") : "Aucune photo pour l’instant"; };
  inp.addEventListener("change", async () => { const fs = [...inp.files].slice(0, 10); inp.value = ""; if (!fs.length || !CIBLE) return; const c = CIBLE;
    if (navigator.onLine === false) return dit("Pas de connexion : la photo n’est pas enregistrée.");
    c.rangee && c.rangee.insertAdjacentHTML("afterbegin", fs.map(() => '<button class="att"><span>…</span></button>').join("")); let ok = 0;
    for (const f of fs) { const b = await allege(f), chemin = `${S.user.id}/${c.cliente_id}/${Date.now()}-${Math.random().toString(36).slice(2, 7)}.jpg`;
      const { error } = await sb.storage.from(BUCKET).upload(chemin, b, { contentType: "image/jpeg", upsert: false }); if (error) continue;
      const r = await sb.from("photos_clientes").insert({ cliente_id: c.cliente_id, rendez_vous_id: c.rendez_vous_id || null, chemin }); if (!r.error) ok++; }
    await charge(c.cliente_id, c.rangee); dit(ok ? (ok > 1 ? ok + " photos ajoutées ✓" : "Photo ajoutée ✓") : "Oups, la photo n’est pas passée. Réessaie."); });
  const bloc = (titre, cliente_id) => `<div class="ph-bloc" data-cli-ph="${cliente_id}"><div class="t"><div>${titre}<div class="nb" style="font-size:12px;opacity:.55;margin-top:2px">…</div></div><button data-ph="ajout">${ICO}Ajouter</button></div><div class="ph-rang"></div></div>`;
  /* 1 · juste après « C'est fini » : la feuille « Son prochain rendez-vous ? » propose la photo */
  let DERNIER = null; document.addEventListener("loginail-reprendre", e => { DERNIER = e.detail; });
  addEventListener("click", e => { const f = e.target.closest && e.target.closest('[data-s="fini"][data-id]'); if (f) DERNIER = S.rdv.find(x => x.id === f.dataset.id) || DERNIER; }, true);
  /* 2 · dans sa fiche, avant l'historique */
  new MutationObserver(() => {
    const h = E.querySelector(".feuille .fc h3"); if (!h) return;
    if (/Son prochain rendez-vous|C’est fini ✓/.test(h.textContent) && DERNIER && DERNIER.cliente_id && !E.querySelector(".fc .ph-bloc")) { const so = h.nextElementSibling;
      (so || h).insertAdjacentHTML("afterend", bloc("Une photo de la pose ?", DERNIER.cliente_id)); const z = E.querySelector(".fc .ph-bloc"); z.dataset.rdv = DERNIER.id; charge(DERNIER.cliente_id, z.querySelector(".ph-rang")); }
    const fh = E.querySelector(".feuille .fi-haut h3"), hist = [...E.querySelectorAll(".feuille .fi-k")].find(x => /Historique/.test(x.textContent));
    if (fh && hist && !E.querySelector(".fc .ph-bloc")) { const nom = fh.childNodes[0] ? fh.childNodes[0].textContent.trim() : fh.textContent.trim(), c = S.clientes.find(x => nomCli(x) === nom); if (!c) return;
      hist.insertAdjacentHTML("beforebegin", bloc("Ses poses en photo", c.id)); const z = E.querySelector(".fc .ph-bloc"); charge(c.id, z.querySelector(".ph-rang")); }
  }).observe(E, { childList: true, subtree: true });
  /* les clics : ajouter, voir en grand, supprimer */
  /* 22/11 (Marie : « il faut que ça fasse comme l'iPhone ») : les photos glissent sous le doigt (la voisine arrive collée),
     on descend avec le pouce pour fermer (le fond s'éclaircit), et « Enregistrer dans mon téléphone » */
  const vue = document.createElement("div"); vue.className = "ph-vue"; let LISTE = [], IDX = 0, piste = null;
  const MEDIA = () => { try { return Capacitor.isNativePlatform() && Capacitor.Plugins.Media && Capacitor.Plugins.Media.savePhoto ? Capacitor.Plugins.Media : null; } catch (e) { return null; } };
  const ICE = '<svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 4v11M7 10l5 5 5-5"/><path d="M5 20h14"/></svg>';
  const infos = () => { const p = LISTE[IDX]; if (!p) return; const d = new Date(p.d), n = vue.querySelector(".n"); if (n) n.textContent = `${IDX + 1} / ${LISTE.length}`;
    vue.querySelector(".d").textContent = `${d.getDate()} ${MOIS[d.getMonth()]} ${d.getFullYear()}`; const su = vue.querySelector(".sup"); su.dataset.id = p.id; su.dataset.c = p.c; su.dataset.ok = ""; su.textContent = "Supprimer cette photo";
    vue.querySelectorAll(".pv-pts i").forEach((x, i) => x.classList.toggle("on", i === IDX)); };
  const place = anim => { piste.style.transition = anim ? "transform .34s cubic-bezier(.22,1,.36,1)" : "none"; piste.style.transform = `translateX(${-IDX * 100}%)`; infos(); };
  const montreN = () => { vue.style.background = ""; vue.innerHTML = `<button class="x" data-ph="fermer" aria-label="Fermer">×</button>${LISTE.length > 1 ? '<div class="n"></div>' : ""}<div class="pv-piste">${LISTE.map(p => `<div class="pv-p"><img src="${p.u}" alt="Photo de la pose" draggable="false"></div>`).join("")}</div>
      <div class="pv-bas">${LISTE.length > 1 ? `<div class="pv-pts">${LISTE.map(() => "<i></i>").join("")}</div>` : ""}<div class="d"></div><button class="pv-enr" data-ph="enr">${ICE}Enregistrer dans mon téléphone</button><button class="sup" data-ph="sup">Supprimer cette photo</button></div>`;
    piste = vue.querySelector(".pv-piste"); place(false); };
  const fermeVue = (dy = 0) => { if (!piste) return vue.remove(); piste.style.transition = "transform .26s cubic-bezier(.4,0,1,1), opacity .26s"; piste.style.transform = `translateX(${-IDX * 100}%) translateY(${Math.max(dy, 0) + 260}px) scale(.85)`; piste.style.opacity = "0";
    vue.style.transition = "background .26s"; vue.style.background = "rgba(15,14,13,0)"; const b = vue.querySelector(".pv-bas"); if (b) b.style.opacity = "0"; setTimeout(() => { vue.remove(); vue.style.transition = ""; }, 270); };
  { let x0 = null, y0 = 0, t0 = 0, mode = null;
    vue.addEventListener("touchstart", e => { if (e.target.closest("button") || e.touches.length !== 1) { x0 = null; return; } x0 = e.touches[0].clientX; y0 = e.touches[0].clientY; t0 = Date.now(); mode = null; }, { passive: true });
    vue.addEventListener("touchmove", e => { if (x0 == null || !piste) return; let dx = e.touches[0].clientX - x0; const dy = e.touches[0].clientY - y0;
      if (!mode) { if (Math.abs(dx) < 8 && Math.abs(dy) < 8) return; mode = Math.abs(dx) > Math.abs(dy) ? "h" : "v"; }
      if (e.cancelable) e.preventDefault();
      if (mode === "h") { if ((IDX === 0 && dx > 0) || (IDX === LISTE.length - 1 && dx < 0)) dx *= .3; piste.style.transition = "none"; piste.style.transform = `translateX(calc(${-IDX * 100}% + ${dx}px))`; }
      else { const d = Math.max(0, dy) + Math.min(0, dy) * .2, k = Math.min(1, Math.abs(d) / 420); piste.style.transition = "none"; piste.style.transform = `translateX(${-IDX * 100}%) translateY(${d}px) scale(${1 - k * .25})`;
        vue.style.background = `rgba(15,14,13,${1 - k * .85})`; const b = vue.querySelector(".pv-bas"); if (b) b.style.opacity = String(1 - k * 2); } }, { passive: false });
    const fin = e => { if (x0 == null || !mode) { x0 = null; return; } const dx = e.changedTouches[0].clientX - x0, dy = e.changedTouches[0].clientY - y0, v = Math.abs(mode === "h" ? dx : dy) / Math.max(1, Date.now() - t0); x0 = null;
      if (mode === "h") { if (Math.abs(dx) > 60 || v > .45) IDX = Math.max(0, Math.min(LISTE.length - 1, IDX + (dx < 0 ? 1 : -1))); place(true); return; }
      if (dy > 110 || (dy > 30 && v > .5)) return fermeVue(dy);
      piste.style.transition = "transform .3s cubic-bezier(.22,1,.36,1)"; piste.style.transform = `translateX(${-IDX * 100}%)`; vue.style.transition = "background .3s"; vue.style.background = ""; const b = vue.querySelector(".pv-bas"); if (b) b.style.opacity = "";
      setTimeout(() => { vue.style.transition = ""; }, 320); };
    vue.addEventListener("touchend", fin, { passive: true }); vue.addEventListener("touchcancel", fin, { passive: true }); }
  const enregistre = async b => { const p = LISTE[IDX]; if (!p) return; b.disabled = true;
    try { const blob = await (await fetch(p.u)).blob(), d = new Date(p.d), nom = `pose-${d.getDate()}-${MOIS[d.getMonth()]}-${d.getFullYear()}.jpg`.normalize("NFD").replace(/[\u0300-\u036f]/g, ""), M = MEDIA();
      if (M) { const u = await new Promise((ok, ko) => { const f = new FileReader(); f.onload = () => ok(f.result); f.onerror = ko; f.readAsDataURL(blob); }); await M.savePhoto({ path: u, fileName: nom.replace(/\.jpg$/, "") }); dit("Photo enregistrée dans tes photos ✓"); }
      else await partageFichier(blob, nom, "Photo enregistrée ✓"); }
    catch (err) { const m = String((err && err.message) || err || ""); dit(/denied|refus|permission|authori/i.test(m) ? "Autorise Loginail dans Réglages › Loginail › Photos" : "Oups, la photo n’a pas pu s’enregistrer. Réessaie."); }
    finally { b.disabled = false; } };
  document.addEventListener("click", async e => { const t = e.target; if (!t.closest) return;
    const aj = t.closest('[data-ph="ajout"]'); if (aj) { e.stopPropagation(); e.preventDefault(); const z = aj.closest(".ph-bloc"); CIBLE = { cliente_id: z.dataset.cliPh, rendez_vous_id: z.dataset.rdv || null, rangee: z.querySelector(".ph-rang") }; inp.click(); return; }
    const vo = t.closest('[data-ph="voir"]'); if (vo) { e.stopPropagation(); e.preventDefault(); LISTE = [...vo.closest(".ph-rang").querySelectorAll('[data-ph="voir"]')].map(x => ({ ...x.dataset })); IDX = LISTE.findIndex(x => x.id === vo.dataset.id);
      vue.dataset.cli = vo.closest(".ph-bloc")?.dataset.cliPh || ""; montreN(); E.appendChild(vue); return; }
    const en = t.closest('[data-ph="enr"]'); if (en) { e.stopPropagation(); e.preventDefault(); enregistre(en); return; }
    if (t.closest('[data-ph="fermer"]')) { e.stopPropagation(); fermeVue(); return; }
    const su = t.closest('[data-ph="sup"]'); if (su) { e.stopPropagation(); if (su.dataset.ok !== "1") { su.dataset.ok = "1"; su.textContent = "Touche encore pour supprimer"; return; }
      await sb.storage.from(BUCKET).remove([su.dataset.c]); const { error } = await sb.from("photos_clientes").delete().eq("id", su.dataset.id); vue.remove();
      const z = E.querySelector(`.fc .ph-bloc[data-cli-ph="${vue.dataset.cli}"]`); if (z) charge(vue.dataset.cli, z.querySelector(".ph-rang")); dit(error ? "Oups, réessaie." : "Photo supprimée"); } }, true);
})();

/* ===== 13/11 (Marie) : dans l'agenda d'aujourd'hui, l'heure en cours (14h entre 14h00 et 14h59) en plus gras ===== */
(function () {
  const st = document.createElement("style"); st.textContent = `.pap .pl span.maint{font-weight:600;color:#1E1C1B;opacity:1}`; document.head.appendChild(st);
  const marque = () => { const v = E.querySelector('.vue.on[data-p="ag"]'); if (!v) return; const now = new Date(), m = now.getHours() * 60;
    v.querySelectorAll(".pap .pl span.maint").forEach(s => { if (!memeJour(S.jour, now) || +s.parentElement.dataset.m !== m) s.classList.remove("maint"); });
    if (!memeJour(S.jour, now)) return; const s = v.querySelector(`.pap .pl[data-m="${m}"] span`); if (s && !s.classList.contains("maint")) s.classList.add("maint"); };
  new MutationObserver(marque).observe(E, { childList: true, subtree: true }); setInterval(marque, 60000);
})();

/* ===== 13/11 (Marie) : « Nouvelle réservation » sur l'iPhone — seulement dans l'appli installée (pas sur le web), et seulement si elle accepte ===== */
(function () {
  const PN = () => window.Capacitor && Capacitor.isNativePlatform && Capacitor.isNativePlatform() && Capacitor.Plugins && Capacitor.Plugins.PushNotifications;
  const CLE = "loginail-notif"; const lit = () => { try { return localStorage.getItem(CLE); } catch (e) { return null; } }, ecrit = v => { try { localStorage.setItem(CLE, v); } catch (e) {} };
  let jeton = null, branche = false;
  const brancher = () => { const p = PN(); if (!p || branche) return; branche = true;
    p.addListener("registration", async t => { jeton = t.value; if (!S.user) return; await sb.from("appareils").upsert({ jeton: t.value, pro_id: S.user.id, plateforme: "ios", maj_le: new Date().toISOString() }); });
    p.addListener("registrationError", () => dit("Les notifications n’ont pas pu s’activer. Réessaie plus tard."));
    /* 18/11 : appli fermée → l'iPhone donne le toucher AVANT que l'appli ait fini de charger. Avant, on ouvrait tout de suite,
       puis le chargement du démarrage (semaine en cours, Accueil) passait par-dessus → mauvais jour, rendez-vous pas ouvert.
       Maintenant on garde le rendez-vous de côté et on l'ouvre seulement quand l'appli est prête. */
    p.addListener("pushNotificationActionPerformed", a => { const d = a && a.notification && a.notification.data; attente = (d && d.rdv) || "ag"; ouvreNotif(); }); };
  let attente = null, enCours = false;
  const ouvreNotif = async () => { if (!attente || enCours || !S.user || !S.pret) return; const id = attente === "ag" ? null : attente; attente = null; enCours = true;
    try { let info = null;
      if (id) { try { const { data } = await sb.from("rendez_vous").select("debut, statut").eq("id", id).maybeSingle(); info = data; } catch (e) {} }
      if (info) { const d = new Date(info.debut); d.setHours(0, 0, 0, 0); S.jour = d; S.lundi = plusJours(d, -((d.getDay() + 6) % 7)); }
      try { await chargeSemaine(); } catch (e) {}
      S.onglet = "ag"; ferme(); rendu();
      if (info && info.statut === "annule") { const h = new Date(info.debut), m = h.getMinutes(); return dit(`Le créneau de ${h.getHours()} h${m ? " " + String(m).padStart(2, "0") : ""} est libre`); }
      if (id && S.rdv.some(x => x.id === id)) feuilleRdv(id); /* marche dans les 3 styles d'agenda */
    } finally { enCours = false; if (attente) ouvreNotif(); } };
  document.addEventListener("loginail-pret", ouvreNotif);
  brancher(); /* on écoute le toucher dès le lancement (pas besoin de l'autorisation pour écouter) */
  const activer = async () => { const p = PN(); if (!p) return false; brancher(); let perm = await p.checkPermissions();
    if (perm.receive === "prompt" || perm.receive === "prompt-with-rationale") perm = await p.requestPermissions();
    if (perm.receive !== "granted") { ecrit("non"); dit("Tu pourras les activer dans Réglages › Notifications de l’iPhone"); return false; }
    await p.register(); ecrit("oui"); return true; };
  const arreter = async () => { const p = PN(); ecrit("non"); if (jeton) await sb.from("appareils").delete().eq("jeton", jeton); try { await p.unregister(); } catch (e) {} };
  /* au démarrage : si elle a dit oui, on redonne le jeton (il peut changer) */
  const t0 = setInterval(() => { if (!S.user || !PN()) return; clearInterval(t0); if (lit() === "oui") activer(); }, 1500);
  /* Réglages : l'interrupteur */
  const re0 = VUES.re; VUES.re = () => { const h = re0(); if (!PN()) return h; const on = lit() === "oui";
    const l = `<div class="ligne"><div class="t">Être prévenue des réservations<span>Une notification quand une cliente réserve sur ton site</span></div><button class="sw${on ? " on" : ""}" data-su="notif-sw" aria-label="Notifications de réservation"></button></div>`;
    for (const rep of ['<div class="k">Mes réservations</div><div class="liste">', '<div class="k">Mon salon</div><div class="liste">']) if (h.includes(rep)) return h.replace(rep, rep + l); return h; };
  /* l'accueil : une seule fois, on lui propose */
  const acc0 = VUES.acc; VUES.acc = () => { const h = acc0(); if (!PN() || lit()) return h;
    const b = `<div class="acc-caisse"><div class="t">Être prévenue quand une cliente réserve ?<span>Une notification sur ton iPhone à chaque réservation sur ton site.</span></div><button class="pil noir" data-su="notif-oui" style="flex:none;border:0;background:var(--acc,#1E1C1B);color:#fff;border-radius:99px;padding:8px 13px;font:inherit;font-size:12.5px">Activer</button><button class="x" data-su="notif-x" aria-label="Plus tard">×</button></div>`;
    for (const rep of ['<div class="su-t3">', '<div class="k">Encore libre', '<div class="k">Aujourd’hui']) if (h.includes(rep)) return h.replace(rep, b + rep); return h + b; };
  document.addEventListener("click", async e => { const t = e.target; if (!t.closest) return;
    if (t.closest('[data-su="notif-sw"]')) { e.stopPropagation(); e.preventDefault(); if (lit() === "oui") { await arreter(); dit("Notifications arrêtées"); } else if (await activer()) dit("C’est activé ✓ Tu seras prévenue à chaque réservation"); rendu(); return; }
    if (t.closest('[data-su="notif-oui"]')) { e.stopPropagation(); e.preventDefault(); if (await activer()) dit("C’est activé ✓ Tu seras prévenue à chaque réservation"); rendu(); return; }
    if (t.closest('[data-su="notif-x"]')) { e.stopPropagation(); e.preventDefault(); ecrit("plus-tard"); rendu(); } }, true);
})();

/* ===== 14/11 (Marie) : heure en noir · « + » nouvelle cliente · le point de fidélité bien visible au-dessus de « C'est fini » ·
   « Envoyer à … sa carte de fidélité » sous la photo · la semaine suit le doigt ===== */
(function () {
  const st = document.createElement("style");
  st.textContent = `.ecran input[type=time],.ecran input[type=date]{color:#1E1C1B!important;-webkit-text-fill-color:#1E1C1B}
.n-plus{flex:none;width:50px;height:50px;border-radius:50%;border:0;background:var(--acc,#1E1C1B);color:#fff;padding:0;display:grid;place-items:center}
.n-plus.on{background:#fff;color:var(--acc,#1E1C1B);box-shadow:inset 0 0 0 1.5px var(--acc,#1E1C1B)}
.rv-fid-n.gros{display:block;text-align:center;font-size:13px!important;opacity:1!important;color:#6B625C;margin:12px 0 0!important;line-height:1.35;text-wrap:balance;overflow-wrap:anywhere}
.rv-fid-n.gros b{font-weight:500;color:#1E1C1B}
.ph-carte{display:flex;align-items:center;justify-content:space-between;gap:10px;margin-top:10px;border-radius:20px;padding:10px 10px 10px 16px;background:#fff;font-size:14px}.ph-carte b{font-weight:500}
.ph-carte button{flex:none;border:0;border-radius:99px;background:var(--acc,#1E1C1B);color:#fff;padding:10px 16px;font:inherit;font-size:13px;display:flex;align-items:center;gap:6px}
.semaine,.nav-sem{touch-action:pan-y}.semaine.suit{transition:none!important}.semaine.glisse{transition:transform .34s cubic-bezier(.22,1,.36,1),opacity .34s}`;
  document.head.appendChild(st);
  const tel = t => String(t || "").replace(/\s/g, "");
  new MutationObserver(() => {
    /* le petit texte « C'est fini ajoute aussi 1 point » : en grand, juste au-dessus du bouton */
    const n = E.querySelector(".fc .rv-fid-n:not(.gros)"), fini = E.querySelector('.fc [data-s="fini"]');
    if (n && fini) { n.classList.add("gros"); n.innerHTML = "✦ En touchant « C’est fini », <b>1 point</b> de fidélité s’ajoute tout seul sur sa fiche";   /* 22/11 (Marie : « sinon, on ne comprend pas ») */ fini.parentNode.insertBefore(n, fini); }
    /* sous « Une photo de la pose ? » : envoyer sa carte de fidélité */
    const z = E.querySelector(".fc .ph-bloc[data-rdv]"); if (z && !E.querySelector(".fc .ph-carte") && window.__fid && __fid.on()) { const c = S.clientes.find(x => x.id === z.dataset.cliPh);
      if (c && c.telephone) { const v = __fid.etat(c); z.insertAdjacentHTML("afterend", `<div class="ph-carte"><span>Sa carte de fidélité · <b class="fp">${v.fait}</b>/${v.f.n}</span><button data-ph="carte" data-cli="${c.id}">Envoyer <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12l16-8-6 16-2.5-6.5z"/></svg></button></div>`);
        setTimeout(async () => { try { await chargeVisites(); } catch (x) {} const b = E.querySelector(".fc .ph-carte .fp"); if (b) b.textContent = __fid.etat(c).fait; }, 900); } }
  }).observe(E, { childList: true, subtree: true });
  document.addEventListener("click", async e => { const b = e.target.closest && e.target.closest('[data-ph="carte"]'); if (!b) return; e.stopPropagation(); e.preventDefault();
    try { await chargeVisites(); } catch (x) {} const c = S.clientes.find(x => x.id === b.dataset.cli); if (!c) return; const v = __fid.etat(c), salon = (S.profil && S.profil.nom_salon) || "";
    const txt = v.pret ? `Bonjour ${c.prenom || ""}, merci pour votre visite ! Votre carte de fidélité est complète : ${v.f.cadeau} à votre prochain rendez-vous. ${salon}` : `Bonjour ${c.prenom || ""}, merci pour votre visite ! Votre carte de fidélité : ${v.fait} sur ${v.f.n}. Encore ${v.reste} visite${v.reste > 1 ? "s" : ""} avant votre cadeau (${v.f.cadeau}). ${salon}`;
    location.href = `sms:${tel(c.telephone)}&body=${encodeURIComponent(txt.trim())}`; }, true);
  /* la semaine suit le doigt, puis la nouvelle arrive du bon côté.
     17/11 (Marie) : un seul code décide (avant, deux codes avec des règles différentes : la semaine pouvait partir sans être remplacée → chiffres invisibles) ;
     dès que le doigt part sur le côté, la page ne défile plus (avant, elle descendait jusqu'en bas de l'agenda). */
  /* 18/11 (Marie : « les chiffres se suppriment puis se remettent ») : la semaine d'avant et celle d'après sont collées de chaque côté,
     comme sur le calendrier de l'iPhone ; on glisse directement sur la vraie semaine voisine, il n'y a plus jamais de trou. */
  let x0 = null, y0 = 0, bouge = false, enCours = false;
  const ECART = 22;
  const posee = s => { s.classList.remove("suit", "glisse"); s.style.transition = ""; s.style.transform = ""; s.style.opacity = ""; s.querySelectorAll(":scope>.sem-v").forEach(v => v.remove()); };
  const voisine = (s, d) => { const v = document.createElement("div"); v.className = "sem-v"; v.setAttribute("aria-hidden", "true");
    v.style.cssText = `position:absolute;top:0;bottom:0;width:100%;left:calc(${d > 0 ? 100 : -100}% + ${d * ECART}px);display:grid;grid-template-columns:repeat(7,1fr);gap:inherit;pointer-events:none`;
    const tous = S.tous && S.tous.length ? S.tous : S.rdv, auj = new Date();
    s.querySelectorAll(":scope>button").forEach((b, i) => { const c = b.cloneNode(true), dt = plusJours(S.lundi, 7 * d + i);
      const n = tous.filter(r => memeJour(new Date(r.debut), dt) && r.statut !== "annule").length;
      c.classList.toggle("plein", !!n); c.removeAttribute("data-jour");
      const bb = c.querySelector("b"), sm = c.querySelector("small"); if (bb) bb.textContent = dt.getDate();
      if (sm) sm.textContent = memeJour(dt, auj) ? "auj." : COURT[i].toLowerCase() + ".";
      v.appendChild(c); });
    s.appendChild(v); };
  const prepare = s => { if (s.querySelector(":scope>.sem-v")) return; if (getComputedStyle(s).position === "static") s.style.position = "relative"; voisine(s, -1); voisine(s, 1); };
  /* 21/11 soir (Marie : « on peut faire plus joli pour la glissade ») : le texte « Du … au … » et la journée en dessous suivent aussi le doigt
     (plus doucement, ils s'effacent), puis la nouvelle semaine arrive du bon côté (gestes-2111.js) ; un petit coup rapide suffit. */
  let t0 = 0; const suiveurs = () => [E.querySelector(".vue.on .nav-sem span"), E.querySelector(".vue.on .pap")].filter(Boolean);
  E.addEventListener("touchstart", e => { const z = !enCours && e.target.closest && e.target.closest(".semaine,.nav-sem"); x0 = z && e.touches.length === 1 ? e.touches[0].clientX : null; y0 = e.touches[0].clientY; bouge = false; t0 = Date.now(); }, { passive: true });
  E.addEventListener("touchmove", e => { if (x0 == null) return; const dx = e.touches[0].clientX - x0, dy = e.touches[0].clientY - y0;
    if (!bouge) { if (Math.abs(dx) < 8 && Math.abs(dy) < 8) return; if (Math.abs(dy) >= Math.abs(dx)) { x0 = null; return; } bouge = true; }
    if (e.cancelable) e.preventDefault();
    const s = E.querySelector(".vue.on .semaine"); if (s) { prepare(s); s.classList.add("suit"); s.style.transform = `translateX(${dx}px)`; }
    suiveurs().forEach((el, i) => { el.style.transition = "none"; el.style.transform = `translateX(${dx * (i ? .12 : .45)}px)`; el.style.opacity = Math.max(i ? .35 : 0, 1 - Math.abs(dx) / (i ? 420 : 150)); }); }, { passive: false });
  const fin = async e => { if (x0 == null || !bouge) { x0 = null; return; } const dx = e.changedTouches[0].clientX - x0; x0 = null; bouge = false; window.__semAvale = Date.now();
    const s = E.querySelector(".vue.on .semaine"); if (!s) return;
    s.classList.remove("suit"); s.classList.add("glisse");
    const sv = suiveurs(), vite = Math.abs(dx) > 18 && Date.now() - t0 < 250;
    if (e.type === "touchcancel" || (Math.abs(dx) < 45 && !vite)) { s.style.transform = ""; sv.forEach(el => { el.style.transition = "transform .3s cubic-bezier(.22,1,.36,1),opacity .3s"; el.style.transform = ""; el.style.opacity = ""; }); setTimeout(() => posee(s), 340); return; }   /* pas assez loin : elle revient */
    const d = dx < 0 ? 1 : -1; enCours = true; s.style.transform = `translateX(calc(${-d * 100}% - ${d * ECART}px))`;
    sv.forEach((el, i) => { el.style.transition = "transform .22s cubic-bezier(.4,0,1,1),opacity .2s"; el.style.transform = `translateX(${-d * (i ? 30 : 60)}px)`; el.style.opacity = "0"; });
    window.__semArr = { t: Date.now(), d };
    S.lundi = plusJours(S.lundi, 7 * d); S.jour = plusJours(S.jour, 7 * d);
    try { await Promise.all([chargeSemaine(), new Promise(r => setTimeout(r, 340))]); } catch (x) {}
    rendu(); enCours = false; const n = E.querySelector(".vue.on .semaine"); if (n) posee(n); };
  E.addEventListener("touchend", fin, { passive: true }); E.addEventListener("touchcancel", fin, { passive: true });
})();

/* ===== 19/11 (Marie) : « Annuler le rendez-vous » demande d'abord « Voulez-vous vraiment annuler ? » (un toucher par erreur prévenait la cliente).
   La question remplace les petits boutons, dans la même fiche ; « Oui, annuler » fait exactement l'annulation d'avant.
   22/11 (Marie) : rendez-vous à venir avec une cliente → « Annuler le rendez-vous de X ? » + ce qui part, puis « Oui, c’est moi qui annule » / « Oui, c’est elle qui me l’a demandé » = elle a prévenu le salon (annule_par 'cliente_salon', sql/29) :
   son e-mail dit « à votre demande », plus « le salon a dû annuler ». ===== */
(function () {
  const st = document.createElement("style");
  st.textContent = `.an-conf{margin-top:14px;border-radius:20px;background:#fff;padding:16px 16px 14px;text-align:center;animation:anConf .22s cubic-bezier(.2,.8,.2,1)}
.an-conf b{display:block;font-weight:500;font-size:16px;color:#1E1C1B}.an-conf span{display:block;font-size:13px;color:#6B625C;margin-top:4px;line-height:1.4}
.an-conf .an-bts{display:flex;gap:8px;margin-top:14px}.an-conf .an-bts button{flex:1;border:0;border-radius:99px;padding:13px 10px;font:inherit;font-size:14px}
.an-conf .an-bts+.an-bts{margin-top:8px}
.an-conf .an-bts.an-col{flex-direction:column;gap:8px}.an-conf .an-bts.an-col button{flex:none;width:100%}
.an-conf span .an-sans{color:#A04A4A;font-weight:500}
.an-conf .an-oui{background:#A04A4A;color:#fff}.an-conf .an-non{background:#F3EEE9;color:#1E1C1B}
@keyframes anConf{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:none}}`;
  document.head.appendChild(st);
  document.addEventListener("click", e => { const t = e.target; if (!t.closest) return;
    const b = t.closest('.fc [data-a="statut"][data-s="annule"]:not([data-ok])');
    if (b) { e.stopPropagation(); e.preventDefault();
      const r = (S.rdv || []).concat(S.cloche || [], S.tous || []).find(x => x.id === b.dataset.id), c = r && r.cliente_id && (S.clientes || []).find(x => x.id === r.cliente_id);
      const d = r ? new Date(r.debut) : null, quand = d ? `${d.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" })} à ${hm(d)}` : "";
      const futur = d && d > new Date(), mail = c && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test((c.email || "").trim());
      const p = (c && String(c.prenom || "").trim()) || "", de = !p ? "de cette cliente" : /^[aeiouyhàâéèêëîïôöùûü]/i.test(p) ? `d’${p}` : `de ${p}`;
      const qui = c && futur, titre = c ? `Annuler le rendez-vous ${esc(de)}&nbsp;?` : "Rouvrir ce créneau ?";
      const info = !c ? esc(quand) : `${esc(quand)}${futur ? (mail ? "<br>Si tu l’annules, elle recevra un e-mail pour la prévenir." : '<br><strong class="an-sans">Pas d’e-mail dans sa fiche : préviens-la toi-même.</strong>') : ""}`;
      const oui = (mot, par) => `<button class="an-oui" data-a="statut" data-s="annule" data-ok="1" data-par="${par}" data-id="${b.dataset.id}">${mot}</button>`;
      const z = b.closest(".petits") || b; z.style.display = "none";
      z.insertAdjacentHTML("afterend", `<div class="an-conf"><b>${titre}</b><span>${info}</span>${qui
        ? `<div class="an-bts an-col">${oui("Oui, c’est moi qui annule", "pro")}${oui("Oui, c’est elle qui me l’a demandé", "cliente_salon")}</div><div class="an-bts"><button class="an-non" data-an="non">Non, le garder</button></div>`
        : `<div class="an-bts"><button class="an-non" data-an="non">Non, le garder</button>${oui("Oui, annuler", "pro")}</div>`}</div>`);
      /* petit iPhone : la fiche descend pour montrer la question en entier */
      const f = z.closest(".feuille"), q = z.nextElementSibling;
      if (f && q) { const bas = q.getBoundingClientRect().bottom + 16 - Math.min(f.getBoundingClientRect().bottom, innerHeight);
        if (bas > 0) f.scrollBy({ top: bas, behavior: "smooth" }); }
      return; }
    if (t.closest('.fc [data-an="non"]')) { e.stopPropagation(); e.preventDefault(); const q = t.closest(".an-conf"), z = q && q.previousElementSibling; if (z) z.style.display = ""; if (q) q.remove(); }
  }, true);
})();

/* ===== 25/11 (Marie) : un créneau de « Encore libre aujourd'hui » → sous « Enregistrer », « Proposer ce créneau » (message prêt) et « Partager en story » ===== */
function libreDuo() {
  const ok = document.querySelector('#E .fc [data-a="nouveau-ok"]'); if (!ok || document.querySelector("#E .fc .lb-duo")) return;
  const SV = d => `<svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${d}</svg>`;
  ok.insertAdjacentHTML("afterend", `<div class="lb-ou">ou, s’il n’y a encore personne</div><div class="lb-duo">
    <button type="button" data-lb="msg">${SV('<path d="M4 5h16v11H9l-5 4z"/>')}Proposer ce créneau</button>
    <button type="button" data-lb="story">${SV('<rect x="5" y="3" width="14" height="18" rx="4"/><circle cx="12" cy="12" r="3.2"/>')}Partager en story</button></div>`);
}
{ const st = document.createElement("style"); st.textContent = `
#E .lb-ou{margin:14px 0 8px;text-align:center;font-size:12px;color:#776D64}
#E .lb-duo{display:flex;gap:8px;animation:lbIn .25s ease-out both}
#E .lb-duo button{flex:1;min-width:0;height:46px;border-radius:999px;border:1px solid rgba(30,28,27,.14);background:#fff;color:#1E1C1B;font:inherit;font-size:13.5px;font-weight:500;display:flex;align-items:center;justify-content:center;gap:7px;padding:0 8px;white-space:nowrap;cursor:pointer;transition:transform .1s;-webkit-tap-highlight-color:transparent}
#E .lb-duo button:active{transform:scale(.95)}
@keyframes lbIn{from{opacity:0;transform:translateY(6px)}}`; document.head.appendChild(st); }
document.addEventListener("click", async e => { const b = e.target.closest && e.target.closest("[data-lb]"); if (!b) return; e.stopPropagation(); e.preventDefault();
  const i = document.getElementById("n-h"), [h, m] = ((i && i.value) || "09:00").split(":").map(Number), d = new Date(); d.setHours(h, m, 0, 0);
  if (b.dataset.lb === "msg") {
    /* aux clientes : on les vouvoie (D67) */
    const salon = (S.profil && S.profil.nom_salon) || "", t = `Bonjour ! Une place vient de se libérer aujourd’hui à ${h}h${m ? String(m).padStart(2, "0") : ""}${salon ? " chez " + salon : ""}. Elle vous intéresse ? 💅`;
    location.href = "sms:" + (/iPhone|iPad|Mac/.test(navigator.userAgent) ? "&" : "?") + "body=" + encodeURIComponent(t); return; }
  if (b.disabled || !window.__dispoUne) return; const avant = b.innerHTML; b.disabled = true; b.textContent = "Un instant…";
  try { await __dispoUne.partage(d); } catch (x) { console.error(x); dit("Oups, l’image ne s’est pas faite. Réessaie."); }
  if (b.isConnected) { b.disabled = false; b.innerHTML = avant; } }, true);
