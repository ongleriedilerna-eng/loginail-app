/* ===== 12/11 (Marie) La suite de l'appli : K l'accueil (ma journée, mes trous libres) · J « À relancer » (+ mon message, dans les Réglages) ·
   I mon bilan · H reprendre rendez-vous après « C'est fini » · G poser des congés · faire glisser un rendez-vous dans l'agenda. =====
   S.tous = tous les rendez-vous du salon (chargé par chargeVisites dans app2.js). */
(function () {
  const st = document.createElement("style");
  st.textContent = `.su-t3{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin:10px 0 0;text-align:left}.su-t3 div{background:#fff;border-radius:16px;padding:11px 12px}.su-t3 small{display:block;font-size:9.5px;font-weight:500;letter-spacing:.14em;text-transform:uppercase;color:#8A847E;margin-bottom:4px}.su-t3 b{font-size:17px;font-weight:500}.su-t3 b em{font-style:normal;font-size:12px;font-weight:400;color:#8A847E}
.su-carte{background:#fff;border-radius:20px;padding:4px 16px;text-align:left}.su-lg{display:flex;align-items:center;gap:10px;padding:12px 0;border-bottom:1px solid rgba(30,28,27,.08);font-size:14px}.su-lg:last-child{border-bottom:0}.su-lg>div{flex:1;min-width:0}.su-lg>div span{display:block;font-size:12px;color:#8A847E;margin-top:2px}
.su-b{flex:none;border:0;background:none;padding:8px 0 8px 8px;font:inherit;font-size:13px;font-weight:500;color:#1E1C1B;white-space:nowrap}
.su-puces{display:flex;gap:6px;flex-wrap:wrap;margin:14px 0 0}.su-puces button{border:0;border-radius:999px;background:#fff;padding:10px 14px;font:inherit;font-size:13px;color:#1E1C1B}.su-puces button.on{background:#1E1C1B;color:#fff}
.su-gros{font-size:32px;line-height:1;font-weight:400}.su-b2{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:8px;text-align:left}.su-b2 div{background:#fff;border-radius:18px;padding:14px}.su-b2 small{display:block;font-size:9.5px;font-weight:500;letter-spacing:.14em;text-transform:uppercase;color:#8A847E;margin-bottom:6px}.su-b2 b{font-size:20px;font-weight:500}
.su-rel{display:flex;align-items:center;justify-content:space-between;width:100%;margin-top:10px;border:0;border-radius:18px;background:#fff;padding:14px 16px;font:inherit;font-size:14px;text-align:left;color:#1E1C1B}.su-rel span{font-size:12px;color:#8A847E;display:block;margin-top:2px}
.su-champ{width:100%;min-width:0;box-sizing:border-box;-webkit-appearance:none;appearance:none;display:block;font-size:16px}
.pap .pr.su-tient{z-index:9;box-shadow:0 14px 28px -10px rgba(0,0,0,.45)!important;opacity:.95;transition:none}`;
  document.head.appendChild(st);
  const tel = t => String(t || "").replace(/[^\d+]/g, ""), p2 = n => String(n).padStart(2, "0"), hh = d => d.getHours() + "h" + p2(d.getMinutes());
  const tous = () => S.tous || [], bon = r => r.cliente_id && r.statut !== "annule";
  const brou = () => { try { return JSON.parse(localStorage.getItem("loginail-brouillon")) || {}; } catch (e) { return {}; } };
  /* les heures d'ouverture du jour (celles de son site, sinon 9h–18h) */
  const ouvert = d => { const h = (brou().horaires || [])[(d.getDay() + 6) % 7], m = t => +t.slice(0, 2) * 60 + +t.slice(3, 5); return h === null ? null : h && h.d && h.f ? [m(h.d), m(h.f)] : [9 * 60, 18 * 60]; };
  const prisLe = (d, sauf) => S.rdv.concat(tous()).filter((r, i, l) => r.id !== sauf && r.statut !== "annule" && memeJour(new Date(r.debut), d) && l.findIndex(x => x.id === r.id) === i);
  const libre = (deb, fin, sauf) => !prisLe(deb, sauf).some(r => new Date(r.debut) < fin && new Date(r.fin) > deb);

  /* ---------- K · l'accueil : ma journée, mes trous libres ---------- */
  const acc0 = VUES.acc;
  VUES.acc = () => { let h = acc0(); const now = new Date(), auj = S.rdv.filter(r => memeJour(new Date(r.debut), now) && bon(r)).sort((a, b) => a.debut.localeCompare(b.debut)), o = ouvert(now);
    let bloc = "";
    { const pas = [["Ajouter mes prestations et mes prix", S.prestations.length > 0, 'data-a="prestas"'], ["Créer mon site", !!S.site, 'data-go="si"'], ["Ajouter ma première cliente", S.clientes.length > 0, 'data-a="cli-nouv"'], ["Noter mon premier rendez-vous", tous().some(r => r.cliente_id) || S.rdv.some(r => r.cliente_id), 'data-a="nouveau"']], fait = pas.filter(x => x[1]).length;
      if (fait < pas.length) bloc += `<div class="k">Pour bien démarrer · ${fait} sur ${pas.length}</div><div class="su-carte">${pas.map(x => `<div class="su-lg" ${x[1] ? "" : x[2]} style="${x[1] ? "opacity:.45" : "cursor:pointer"}"><span style="flex:none;width:24px;height:24px;border-radius:50%;display:grid;place-items:center;font-size:12px;${x[1] ? "background:#1E1C1B;color:#fff" : "border:1.5px solid rgba(30,28,27,.3)"}">${x[1] ? "✓" : ""}</span><div>${x[0]}</div>${x[1] ? "" : '<span style="opacity:.5">›</span>'}</div>`).join("")}</div>`; }
    if (auj.length) { const tot = auj.filter(r => r.statut !== "absente").reduce((s, r) => s + (+r.prix || 0), 0), fin = new Date(Math.max(...auj.map(r => +new Date(r.fin))));
      bloc += `<div class="su-t3"><div><small>Aujourd’hui</small><b>${auj.length} <em>rdv</em></b></div><div><small>Prévu</small><b>${Math.round(tot)} <em>€</em></b></div><div><small>Fini à</small><b>${hh(fin)}</b></div></div>`; }
    if (o) { const mn = now.getHours() * 60 + now.getMinutes(), trous = []; let c = Math.max(o[0], Math.ceil(mn / 15) * 15);
      prisLe(now).map(r => [new Date(r.debut), new Date(r.fin)]).map(x => [x[0].getHours() * 60 + x[0].getMinutes(), x[1].getHours() * 60 + x[1].getMinutes()]).sort((a, b) => a[0] - b[0]).forEach(x => { if (x[0] - c >= 30) trous.push([c, x[0]]); c = Math.max(c, x[1]); });
      if (o[1] - c >= 30) trous.push([c, o[1]]);
      const f = m => Math.floor(m / 60) + "h" + p2(m % 60), du = m => m >= 60 ? Math.floor(m / 60) + " h" + (m % 60 ? " " + p2(m % 60) : "") : m + " min";
      if (trous.length) bloc += `<div class="k">Encore libre aujourd’hui</div><div class="su-carte">${trous.slice(0, 4).map(t => `<div class="su-lg"><div>${f(t[0])} – ${f(t[1])}<span>${du(t[1] - t[0])}</span></div><button class="su-b" data-su="libre" data-m="${t[0]}">Ajouter</button></div>`).join("")}</div>`; }
    const rep = '<div class="k">Aujourd’hui'; return bloc && h.includes(rep) ? h.replace(rep, bloc + rep) : h + bloc; };

  /* ---------- J · à relancer ---------- */
  const MSG0 = "Bonjour {prénom}, ça fait un moment ! Envie de refaire vos ongles ? {lien}À très vite, {salon}";
  const litMsg = () => { try { return localStorage.getItem("loginail-msg-relance") || (S.site && S.site.donnees && S.site.donnees.msgRelance) || MSG0; } catch (e) { return MSG0; } };
  const lien = () => S.site && S.site.en_ligne && S.site.slug ? "https://loginail.fr/loginail-creer/pret.html?public&s=" + S.site.slug : "";
  const texte = c => litMsg().replace(/\{prénom\}/g, c.prenom || "").replace(/\{salon\}/g, S.profil.nom_salon || S.profil.prenom || "").replace(/\{lien\}/g, lien() ? "Vous pouvez réserver ici : " + lien() + " " : "").replace(/\s+/g, " ").trim();
  const SEM = 6, aRelancer = () => { const V = S.vis || {}, lim = Date.now() - SEM * 7 * 864e5; return S.clientes.filter(c => { const v = V[c.id]; return v && v.n && !v.proch && v.der && +new Date(v.der) < lim; }).sort((a, b) => V[a.id].der.localeCompare(V[b.id].der)); };
  const depuis = d => { const s = Math.round((Date.now() - +new Date(d)) / (7 * 864e5)); return s >= 9 ? Math.round(s / 4.345) + " mois" : s + " semaines"; };
  const cl0 = VUES.cl;
  VUES.cl = () => { const h = cl0(), l = aRelancer(), rep = "Ajouter une cliente</button>"; if (!l.length || !h.includes(rep) || S.cherche.trim()) return h;
    return h.replace(rep, rep + `<button class="su-rel" data-su="relance"><div>À relancer<span>${l.length} cliente${l.length > 1 ? "s" : ""} pas revenue${l.length > 1 ? "s" : ""} depuis ${SEM} semaines</span></div><span style="font-size:16px;margin:0">›</span></button>`); };
  const feuilleRelance = () => { const l = aRelancer(), V = S.vis || {};
    ouvre(`<h3>À relancer</h3><div class="sous">Pas revenues depuis ${SEM} semaines, et sans rendez-vous prévu. « Lui écrire » ouvre vos Messages avec un texte tout prêt.</div>
      <div class="su-carte" style="margin-top:14px">${l.length ? l.map(c => `<div class="su-lg"><div data-cli="${c.id}">${esc(nomCli(c))}<span>Pas venue depuis ${depuis(V[c.id].der)}</span></div>${c.telephone ? `<button class="su-b" data-href="sms:${tel(c.telephone)}?&body=${encodeURIComponent(texte(c))}">Lui écrire</button>` : `<span style="font-size:12px;color:#8A847E">Pas de numéro</span>`}</div>`).join("") : `<div class="su-lg"><div>Personne à relancer<span>Toutes vos clientes sont revenues ou ont un rendez-vous.</span></div></div>`}</div>
      <button class="su-rel" data-su="msg" style="background:none;padding:14px 2px"><div>Changer mon message<span>Le texte envoyé quand vous touchez « Lui écrire »</span></div><span style="font-size:16px;margin:0">›</span></button>`); };
  const feuilleMsg = () => ouvre(`<h3>Mon message de relance</h3><div class="sous">{prénom} devient le prénom de la cliente, {salon} le nom de votre salon, {lien} l’adresse de votre site.</div>
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
      <div class="sous" style="margin-top:12px;font-size:12px">Compté d’après les prix de vos rendez-vous passés (sans les annulés ni les absentes).</div>`); };
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
    ouvre(`<h3>Son prochain rendez-vous ?</h3><div class="sous">${esc(nomRdv(r))}${titreRdv(r) ? " · " + esc(titreRdv(r)) : ""}</div>
      <div class="su-puces">${[2, 3, 4, 5].map(n => `<button data-su="rep-sem" data-n="${n}" class="${REP.sem === n ? "on" : ""}">Dans ${n} sem.</button>`).join("")}</div>
      <div class="k">Créneaux libres</div><div class="su-carte">${cs.length ? cs.map(c => `<div class="su-lg"><div style="text-transform:capitalize">${JOURS[(c.getDay() + 6) % 7]} ${c.getDate()} ${MOIS[c.getMonth()]}<span style="text-transform:none">${hh(c)}${c.getDay() === d0.getDay() && c.getHours() === d0.getHours() && c.getMinutes() === d0.getMinutes() ? " · comme aujourd’hui" : ""}</span></div><button class="su-b" data-su="rep-ok" data-d="${c.toISOString()}">Choisir</button></div>`).join("") : `<div class="su-lg"><div>Rien de libre cette semaine-là<span>Essayez une autre semaine.</span></div></div>`}</div>
      <button class="btn clair" data-a="fermer" style="margin-top:14px">Plus tard</button>`); };

  /* ---------- G · poser des congés ---------- */
  let CG = { raison: "Vacances" };
  const iso = d => `${d.getFullYear()}-${p2(d.getMonth() + 1)}-${p2(d.getDate())}`;
  const feuilleConges = () => { const j = S.jour, d = CG.du || iso(j), f = CG.au || d, n = Math.max(1, Math.round((new Date(f) - new Date(d)) / 864e5) + 1);
    ouvre(`<h3>Fermer mon salon</h3><div class="sous">Ces jours-là sont bloqués dans votre agenda.</div>
      <div class="su-puces">${["Vacances", "Jour off", "Formation"].map(x => `<button data-su="cg-r" data-r="${x}" class="${CG.raison === x ? "on" : ""}">${x}</button>`).join("")}</div>
      <div class="lab2">Du</div><input class="champ su-champ" id="cg-du" type="date" value="${d}"><div class="lab2">Au</div><input class="champ su-champ" id="cg-au" type="date" value="${f}">
      <button class="btn" data-su="cg-ok" style="margin-top:16px">Fermer ${n > 1 ? "ces " + n + " jours" : "ce jour"}</button>
      <div class="sous" style="margin-top:10px;font-size:12px">Pour rouvrir un jour : touchez le bloc « Fermé » dans l’agenda, puis « Annuler le rendez-vous ».</div>`); };
  const ag0 = VUES.ag;
  VUES.ag = () => { const h = ag0().replace(/<strong>00:00 – 23:59<\/strong> /g, ""), rep = '<button data-a="mois"';
    return h.includes(rep) ? h.replace(rep, `<button data-su="conges" aria-label="Fermer mon salon (congés)" style="width:46px;height:46px;border-radius:50%;border:0;display:grid;place-items:center;padding:0;background:#fff"><svg viewBox="0 0 24 24" width="20" height="20"><circle cx="12" cy="12" r="8.5" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M6.5 17.5l11-11" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg></button>` + rep) : h; };

  /* ---------- les gestes ---------- */
  document.addEventListener("click", async e => { const t = e.target.closest ? e.target : null; if (!t) return;
    /* H : on retient le rendez-vous qu'elle vient de finir */
    const fini = t.closest('[data-a="statut"][data-s="fini"]'); if (fini) { const r = S.rdv.find(x => x.id === fini.dataset.id); if (r && r.cliente_id) setTimeout(() => { if (E.classList.contains("fe")) return; REP = { r, sem: 3 }; feuilleReprendre(); }, 900); return; }
    const a = t.closest("[data-su]"); if (!a) return; e.stopPropagation(); const k = a.dataset.su;
    if (k === "libre") { S.jour = new Date(); S.lundi = lundiDe(S.jour); feuilleNouveau(+a.dataset.m); }
    else if (k === "relance") feuilleRelance();
    else if (k === "msg") feuilleMsg();
    else if (k === "msg-ok") { const v = ($("#su-msg", E).value || "").trim(); if (!v) return dit("Écrivez votre message"); try { localStorage.setItem("loginail-msg-relance", v); } catch (x) {} ferme(); dit("C’est enregistré ✓"); }
    else if (k === "msg-def") { try { localStorage.removeItem("loginail-msg-relance"); } catch (x) {} feuilleMsg(); }
    else if (k === "bilan") feuilleBilan();
    else if (k === "rep-sem") { REP.sem = +a.dataset.n; feuilleReprendre(); }
    else if (k === "rep-ok") { const r = REP.r, deb = new Date(a.dataset.d), fin = new Date(+deb + (new Date(r.fin) - new Date(r.debut))); a.disabled = true;
      const { error } = await sb.from("rendez_vous").insert({ cliente_id: r.cliente_id, prestation_id: r.prestation_id || null, titre: r.titre || titreRdv(r) || null, debut: deb.toISOString(), fin: fin.toISOString(), prix: r.prix ?? null });
      if (error) { a.disabled = false; return dit("Oups, ça n’a pas marché. Réessayez."); } await chargeSemaine(); chargeVisites(); ferme(); rendu(); dit("Rendez-vous pris ✓"); }
    else if (k === "conges") { CG = { raison: "Vacances" }; feuilleConges(); }
    else if (k === "cg-r") { CG.du = $("#cg-du", E).value; CG.au = $("#cg-au", E).value; CG.raison = a.dataset.r; feuilleConges(); }
    else if (k === "cg-ok") { const d = $("#cg-du", E).value, f = $("#cg-au", E).value; if (!d || !f || f < d) return dit("Vérifiez les deux dates"); const n = Math.round((new Date(f) - new Date(d)) / 864e5) + 1; if (n > 60) return dit("60 jours au maximum");
      const jours = []; for (let i = 0; i < n; i++) { const x = new Date(d + "T00:00:00"); x.setDate(x.getDate() + i); const y = new Date(x); y.setHours(23, 59, 0, 0); jours.push({ cliente_id: null, prestation_id: null, titre: "Fermé · " + CG.raison, debut: x.toISOString(), fin: y.toISOString(), prix: null }); }
      const pris = jours.filter(x => prisLe(new Date(x.debut)).some(r => r.cliente_id)).length; if (pris) return dit(pris > 1 ? "Il y a déjà des rendez-vous ces jours-là : décalez-les d’abord" : "Il y a déjà des rendez-vous ce jour-là : décalez-les d’abord");
      a.disabled = true; const { error } = await sb.from("rendez_vous").insert(jours); if (error) { a.disabled = false; return dit("Oups, ça n’a pas marché. Réessayez."); }
      await chargeSemaine(); chargeVisites(); ferme(); rendu(); dit(n > 1 ? n + " jours fermés ✓" : "Jour fermé ✓"); }
  }, true);
  document.addEventListener("change", e => { if (e.target.id === "cg-du" || e.target.id === "cg-au") { CG.du = $("#cg-du", E).value; CG.au = $("#cg-au", E).value; if (CG.au < CG.du) CG.au = CG.du; feuilleConges(); } });

  /* ---------- la semaine coulisse : on glisse à gauche ou à droite sur les jours ---------- */
  { let sx = null, sy = 0; E.addEventListener("touchstart", e => { const z = e.target.closest(".semaine,.nav-sem"); sx = z && e.touches.length === 1 ? e.touches[0].clientX : null; sy = e.touches[0].clientY; }, { passive: true });
    E.addEventListener("touchend", async e => { if (sx == null) return; const t = e.changedTouches[0], dx = t.clientX - sx, dy = t.clientY - sy; sx = null; if (Math.abs(dx) < 45 || Math.abs(dx) < Math.abs(dy) * 1.5) return;
      const n = dx < 0 ? 7 : -7; S.lundi = plusJours(S.lundi, n); S.jour = plusJours(S.jour, n); avale = Date.now(); await chargeSemaine(); rendu(); }, { passive: true });
    document.addEventListener("click", e => { if (Date.now() - avale < 400 && e.target.closest && e.target.closest(".semaine")) { e.stopPropagation(); e.preventDefault(); } }, true); }
  let avale = 0;
  /* ---------- faire glisser un rendez-vous dans l'agenda (on reste appuyée, puis on monte ou on descend) ---------- */
  let G = null;
  const debutG = (el, y) => { const r = S.rdv.find(x => x.id === el.dataset.rdv); if (!r || r.statut !== "prevu") return; G = { el, r, y, dy: 0, on: false, t: setTimeout(() => { if (!G) return; G.on = true; el.classList.add("su-tient"); navigator.vibrate?.(12); }, 420) }; };
  const bougeG = (y, ev) => { if (!G) return; if (!G.on) { if (Math.abs(y - G.y) > 8) { clearTimeout(G.t); G = null; } return; } ev.preventDefault(); const pas = R / 2; G.dy = Math.round((y - G.y) / pas) * pas; G.el.style.transform = `translateY(${G.dy}px)`;
    const d = new Date(+new Date(G.r.debut) + G.dy / R * 30 * 60000); let b = G.el.querySelector("strong"); if (b) b.textContent = hm(d) + " – " + hm(new Date(+d + (new Date(G.r.fin) - new Date(G.r.debut)))); };
  const finG = async () => { if (!G) return; clearTimeout(G.t); const g = G; G = null; if (!g.on) return; avale = Date.now(); g.el.classList.remove("su-tient");
    const mn = g.dy / R * 30; if (!mn) { g.el.style.transform = ""; return; } const deb = new Date(+new Date(g.r.debut) + mn * 60000), fin = new Date(+new Date(g.r.fin) + mn * 60000);
    if (!memeJour(deb, new Date(g.r.debut)) || deb.getHours() * 60 + deb.getMinutes() < OUV || !libre(deb, fin, g.r.id)) { rendu(); return dit(libre(deb, fin, g.r.id) ? "Trop tôt ou trop tard" : "Ce créneau est déjà pris"); }
    const { error } = await sb.from("rendez_vous").update({ debut: deb.toISOString(), fin: fin.toISOString() }).eq("id", g.r.id); if (error) { rendu(); return dit("Oups, ça n’a pas marché. Réessayez."); }
    await chargeSemaine(); chargeVisites(); rendu(); dit("Décalé à " + hh(deb) + " ✓"); };
  E.addEventListener("touchstart", e => { const el = e.target.closest(".pap .pr[data-rdv]"); if (el && e.touches.length === 1) debutG(el, e.touches[0].clientY); }, { passive: true });
  E.addEventListener("touchmove", e => bougeG(e.touches[0].clientY, e), { passive: false });
  E.addEventListener("touchend", finG); E.addEventListener("touchcancel", finG);
  E.addEventListener("mousedown", e => { const el = e.target.closest(".pap .pr[data-rdv]"); if (el) debutG(el, e.clientY); });
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
    if (S.moisOuvert && !t.closest(".calm,[data-a='mois']")) { S.moisOuvert = false; rendu(); e.stopPropagation(); e.preventDefault(); return; }
    if (S.triOuvert && !t.closest(".tris,[data-a='tri-menu']")) { S.triOuvert = false; rendu(); e.stopPropagation(); e.preventDefault(); } }, true);

  /* 2 · un créneau vide : nouveau rendez-vous, ou bloquer ce créneau */
  let BL = { m: 0, d: 60 };
  const feuilleCreneau = m => { BL = { m, d: 60 }; const j = S.jour;
    ouvre(`<h3>${hM(m)}</h3><div class="sous" style="text-transform:capitalize">${JOURS[(j.getDay() + 6) % 7]} ${j.getDate()} ${MOIS[j.getMonth()]}</div>
      <button class="btn" data-s5="rdv" style="margin-top:16px">Nouveau rendez-vous</button><button class="btn clair" data-s5="bloquer" style="margin-top:8px">Bloquer ce créneau</button>`); };
  const feuilleBloquer = () => ouvre(`<h3>Bloquer à partir de ${hM(BL.m)}</h3><div class="sous">Personne ne pourra réserver sur ce créneau.</div>
      <div class="su-puces">${[[30, "30 min"], [60, "1 h"], [120, "2 h"], [240, "4 h"]].map(x => `<button data-s5="bl-d" data-d="${x[0]}" class="${BL.d === x[0] ? "on" : ""}">${x[1]}</button>`).join("")}</div>
      <div class="lab2">Pourquoi ? <small style="text-transform:none;letter-spacing:0;opacity:.6">facultatif</small></div><input class="champ" id="bl-n" maxlength="40" placeholder="Pause, médecin, formation…" value="${esc(BL.n || "")}" style="font-size:16px;width:100%;box-sizing:border-box">
      <button class="btn" data-s5="bl-ok" style="margin-top:16px">Bloquer</button>`);

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
.s5-plus{display:block;width:100%;border:0;background:none;margin-top:8px;padding:6px;font:inherit;font-size:13px;color:#6B625C;text-decoration:underline;text-underline-offset:3px}`;
  document.head.appendChild(st);
  /* les lignes ajoutées après coup (SMS d'anniversaire) */
  new MutationObserver(() => document.querySelectorAll('.vue[data-p="re"] .ligne').forEach(l => { if (l.querySelector(".s5-ic")) return; const t = l.querySelector(".t"); if (!t || !t.firstChild) return; const i = IC.find(x => (t.firstChild.textContent || "").trim().indexOf(x[0]) === 0); if (i) l.insertAdjacentHTML("afterbegin", sv(i[1])); })).observe(document.body, { childList: true, subtree: true });

  /* 4 · ajouter plusieurs clientes d'un coup */
  const lis = t => t.split(/\n+/).map(l => l.trim()).filter(Boolean).map(l => { const m = l.match(/(\+?\d[\d .\-]{7,}\d)\s*$/), tel = m ? m[1].replace(/[.\-]/g, " ").replace(/\s+/g, " ").trim() : null, nom = (m ? l.slice(0, m.index) : l).replace(/[;,\t]+/g, " ").trim().split(/\s+/).filter(Boolean);
    return nom.length ? { prenom: nom[0], nom: nom.slice(1).join(" ") || null, telephone: tel } : null; }).filter(Boolean);
  const feuillePlusieurs = () => ouvre(`<h3>Ajouter plusieurs clientes</h3><div class="sous">Une cliente par ligne : son prénom, son nom, puis son numéro si vous l’avez. Vous pouvez coller une liste copiée ailleurs.</div>
      <textarea class="msg" id="s5-liste" style="height:190px;margin-top:12px" placeholder="Jade Martin 06 12 34 56 78&#10;Inès Moreau&#10;Sarah Benali 0611223344"></textarea>
      <button class="btn" data-s5="pl-ok" style="margin-top:12px" disabled>Ajouter</button>`);
  const cl1 = VUES.cl; VUES.cl = () => { const h = cl1(), rep = "Ajouter une cliente</button>"; return h.includes(rep) ? h.replace(rep, rep + `<button class="s5-plus" data-s5="plusieurs">Ajouter plusieurs clientes d’un coup</button>`) : h; };
  document.addEventListener("input", e => { if (e.target.id !== "s5-liste") return; const n = lis(e.target.value).length, b = E.querySelector('[data-s5="pl-ok"]'); if (b) { b.disabled = !n; b.textContent = n ? `Ajouter ${n} cliente${n > 1 ? "s" : ""}` : "Ajouter"; } });

  document.addEventListener("click", async e => { const t = e.target; if (!t.closest) return;
    const cr = t.closest('.pap .pl[data-a="creneau"]'); if (cr && !S.moisOuvert) { e.stopPropagation(); e.preventDefault(); return feuilleCreneau(+cr.dataset.m); }
    const a = t.closest("[data-s5]"); if (!a) return; e.stopPropagation(); const k = a.dataset.s5;
    if (k === "rdv") feuilleNouveau(BL.m);
    else if (k === "bloquer") feuilleBloquer();
    else if (k === "bl-d") { BL.n = E.querySelector("#bl-n").value; BL.d = +a.dataset.d; feuilleBloquer(); }
    else if (k === "bl-ok") { const deb = new Date(S.jour); deb.setHours(0, BL.m, 0, 0); const fin = new Date(+deb + BL.d * 60000), note = (E.querySelector("#bl-n").value || "").trim();
      if (S.rdv.some(r => r.statut !== "annule" && new Date(r.debut) < fin && new Date(r.fin) > deb)) return dit("Il y a déjà un rendez-vous sur ce créneau");
      a.disabled = true; const { error } = await sb.from("rendez_vous").insert({ cliente_id: null, prestation_id: null, titre: note || "Bloqué", debut: deb.toISOString(), fin: fin.toISOString(), prix: null });
      if (error) { a.disabled = false; return dit("Oups, ça n’a pas marché. Réessayez."); } await chargeSemaine(); chargeVisites(); ferme(); rendu(); dit("Créneau bloqué ✓"); }
    else if (k === "plusieurs") feuillePlusieurs();
    else if (k === "pl-ok") { const l = lis(E.querySelector("#s5-liste").value); if (!l.length) return; a.disabled = true; a.textContent = "Un instant…";
      const { error } = await sb.from("clientes").insert(l); if (error) { a.disabled = false; a.textContent = "Ajouter"; return dit("Oups, ça n’a pas marché. Réessayez."); }
      const { data } = await sb.from("clientes").select("*").order("prenom"); S.clientes = data || []; ferme(); rendu(); dit(l.length > 1 ? l.length + " clientes ajoutées ✓" : "Cliente ajoutée ✓"); }
  }, true);
})();
