/* ===== 16/11 (Marie, décision D19) : le dessin « Vernis » de toute l'appli =====
   Haut rosé avec étoiles ✦, Cormorant pour les titres, heures et prix, une couleur d'accent au choix (7 teintes, ronds « Duos »),
   un seul bouton foncé par zone, barre du bas collée en bas, plus aucun petit titre en majuscules espacées.
   Ce fichier est chargé EN DERNIER : il reprend ce que dessinent les autres modules et ne change que le dessin
   (les mêmes boutons, les mêmes gestes, les mêmes données). Il remplace « Mon appli à mes couleurs » (couleurs.js, supprimé). */
(function () {
  const p2 = n => String(n).padStart(2, "0");
  const hh = d => d.getHours() + ":" + p2(d.getMinutes());                       /* 9:00, 15:30 */
  const hFin = d => d.getHours() + " h" + (d.getMinutes() ? " " + p2(d.getMinutes()) : "");   /* 18 h, 18 h 30 */
  const lit = (k, d) => { try { const v = localStorage.getItem(k); return v == null ? d : v; } catch (e) { return d; } };
  const ecrit = (k, v) => { try { localStorage.setItem(k, v); } catch (e) {} };
  const dom = h => { const t = document.createElement("template"); t.innerHTML = h; return t.content; };
  const enTexte = f => { const d = document.createElement("div"); d.appendChild(f); return d.innerHTML; };
  const svg = (d, w) => `<svg viewBox="0 0 24 24" width="${w || 18}" height="${w || 18}" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">${d}</svg>`;
  const IC = {
    goutte: '<path d="M12 3c4 5 6 8 6 11a6 6 0 0 1-12 0c0-3 2-6 6-11z"/>', fond: '<rect x="3" y="5" width="18" height="14" rx="3"/><path d="M3 15l5-5 4 4 3-3 6 6"/>',
    horloge: '<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>', cloche: '<path d="M6 16V11a6 6 0 0 1 12 0v5l1.5 2h-15z"/><path d="M10 20.5a2 2 0 0 0 4 0"/>',
    style: '<path d="M12 3a9 9 0 1 0 0 18c1.2 0 1.6-.9 1.2-1.8-.5-1-.1-2.2 1.3-2.2H17a4 4 0 0 0 4-4c0-5.5-4-10-9-10z"/><circle cx="7.5" cy="11" r="1"/><circle cx="10" cy="7" r="1"/><circle cx="15" cy="7.5" r="1"/>',
    perso: '<path d="M4 7h10M18 7h2M4 17h4M12 17h8"/><circle cx="16" cy="7" r="2"/><circle cx="10" cy="17" r="2"/>', charms: '<path d="M12 3l2.2 5.6L20 9l-4.5 3.8L17 19l-5-3.2L7 19l1.5-6.2L4 9l5.8-.4z"/>',
    presta: '<path d="M5 7h14M5 12h14M5 17h9"/>', photos: '<rect x="3.5" y="5" width="17" height="14" rx="3"/><circle cx="9" cy="10" r="1.6"/><path d="M4 17l5-4 4 3 3-2 4 3"/>',
    salon: '<path d="M4 11l8-7 8 7v9H4z"/><path d="M10 20v-5h4v5"/>', adresse: '<path d="M12 21s7-6.2 7-11.5A7 7 0 0 0 5 9.5C5 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/>',
    apropos: '<path d="M5 5h14v10H9l-4 4z"/><path d="M9 9h6M9 12h4"/>', moi: '<circle cx="12" cy="9" r="3.5"/><path d="M5 20c1.2-3.6 4-5 7-5s5.8 1.4 7 5"/>',
    bon: '<circle cx="12" cy="12" r="8.5"/><path d="M12 11v5M12 8h.01"/>', lien: '<path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1"/><path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"/>',
    globe: '<circle cx="12" cy="12" r="8.5"/><path d="M3.5 12h17M12 3.5c2.5 2.7 2.5 14.3 0 17M12 3.5c-2.5 2.7-2.5 14.3 0 17"/>', plus: '<path d="M12 5v14M5 12h14"/>' };

  /* ---------- 1 · les 7 couleurs de l'appli (ronds « Duos ») ---------- */
  const T = [
    { id: "rose", nom: "Rose vernis", c: "#FBF8F5", rose: "#F5E6E4", acc: "#B5475E", fonce: "#2A1B1E", h1: "#F2D7D6", h2: "#F7ECEA" },
    { id: "graphite", nom: "Graphite", c: "#F7F7F8", rose: "#E6E7EA", acc: "#4A4E55", fonce: "#1B1D21", h1: "#D9DBE0", h2: "#EEEFF2" },
    { id: "nude", nom: "Nude", c: "#FAF7F3", rose: "#F0E6DC", acc: "#8C5F45", fonce: "#2B2420", h1: "#EADBCB", h2: "#F5EDE4" },
    { id: "sauge", nom: "Sauge", c: "#F7F8F4", rose: "#E4EBE1", acc: "#4F6E55", fonce: "#1F2A22", h1: "#D6E2D3", h2: "#EEF2EB" },
    { id: "lavande", nom: "Lavande", c: "#F9F8FB", rose: "#ECE6F3", acc: "#76589A", fonce: "#241E2C", h1: "#DED3EC", h2: "#F2EDF7" },
    { id: "terracotta", nom: "Terracotta", c: "#FBF7F4", rose: "#F4E3DA", acc: "#A4502F", fonce: "#2E1C15", h1: "#EFD3C4", h2: "#F7EAE2" },
    { id: "bleunuit", nom: "Bleu nuit", c: "#F7F8FA", rose: "#E3E8F1", acc: "#3B5583", fonce: "#161E2E", h1: "#D3DCEB", h2: "#EDF1F7" }];
  const teinte = () => T.find(t => t.id === lit("loginail-appli-teinte", "rose")) || T[0];
  /* les anciennes règles des modules (boutons noirs, var(--acc), var(--noir)) prennent le brun foncé de la teinte */
  const poseTeinte = () => { const t = teinte(), s = document.documentElement.style;
    ["c", "rose", "acc", "fonce", "h1", "h2"].forEach(k => s.setProperty("--v-" + k, t[k]));
    s.setProperty("--noir", t.fonce); s.setProperty("--creme", t.c); s.setProperty("--acc", t.fonce); s.setProperty("--gris", "#776D64");
    const m = document.querySelector('meta[name="theme-color"]'); if (m) m.content = t.h2; };
  poseTeinte();

  /* ---------- 2 · « Afficher mon fond en haut » : le fond de son site en bandeau, en haut des écrans (jamais derrière l'agenda) ---------- */
  /* avant le 16/11 ce réglage n'existait qu'avec « Mon appli à mes couleurs » allumé : on garde le choix de celles qui l'avaient */
  const ban = () => { const v = lit("loginail-appli-bandeau", null); return v === "oui" || (v !== "non" && lit("loginail-appli-couleurs", "") === "oui"); };
  const fondDuSite = () => { const b = brouillon() || {}; return b.fond || (S.site && S.site.donnees && S.site.donnees.fond) || ""; };
  let FOND = { nom: "", html: "" }, FP = null;
  const prepareFond = () => { const f = fondDuSite(); if (!f) return Promise.resolve(); if (FOND.nom === f) return Promise.resolve(); if (FP) return FP;
    FP = new Promise(res => { const go = () => { try { const i = F100.idx[f]; if (i != null) { FOND = { nom: f, html: '<div class="f100">' + F100.tuile(i) + "</div>" };
          if (!document.getElementById("mcCss") && window.FONDS100) { const c = document.createElement("style"); c.id = "mcCss"; c.textContent = FONDS100.css; document.head.appendChild(c); } } } catch (e) {} FP = null; res(); };
      if (window.F100) return go(); addEventListener("f100", go, { once: true });
      if (!document.querySelector('script[src*="fonds-100.js"]')) { const sc = document.createElement("script"); sc.src = "https://loginail.fr/loginail-site/fonds-100.js"; sc.onerror = () => { FP = null; res(); }; document.head.appendChild(sc); } });
    return FP; };
  const bandeau = () => { const v = E.querySelector(".vue.on"); if (!v) return; let bd = v.querySelector(":scope>.v-ban");
    const voulu = ban() && !!fondDuSite(), pret = voulu && FOND.nom === fondDuSite() && FOND.html;
    v.classList.toggle("v-avecban", !!pret);
    if (!pret) { if (bd) bd.remove(); if (voulu) prepareFond().then(() => { if (FOND.nom === fondDuSite()) bandeau(); }); return; }
    if (!bd) { bd = document.createElement("div"); bd.className = "v-ban"; bd.setAttribute("aria-hidden", "true"); v.prepend(bd); }
    if (bd.dataset.f !== FOND.nom) { bd.innerHTML = FOND.html; bd.dataset.f = FOND.nom; } };
  /* « Mon site » n'a plus le fond du site derrière tout l'écran : c'est le haut rosé partout (ou le bandeau ci-dessus) */
  msFond = function () { E.classList.remove("ms-f"); };

  /* ---------- 3 · le haut de chaque écran : quelques étoiles ✦ ---------- */
  const ET = { acc: [[-6, 58, 13], [58, 52, 9], [70, 8, 11]], ag: [[2, 150, 10]], cl: [[-4, 104, 10], [26, 150, 7]], si: [[0, 40, 14], [38, 84, 9]], re: [[0, 40, 14], [36, 84, 9]] };
  const etoiles = p => (ET[p] || []).map(([t, r, s]) => `<span class="v-et" aria-hidden="true" style="top:${t}px;right:${r}px;font-size:${s}px">✦</span>`).join("");
  const enHaut = (f, p, noeuds) => { const w = document.createElement("div"); w.className = "v-haut v-haut-" + p; const l = noeuds.filter(Boolean); if (!l.length) return;
    l[0].before(w); w.insertAdjacentHTML("beforeend", etoiles(p)); l.forEach(n => w.appendChild(n)); };

  /* ---------- 4 · Accueil ---------- */
  const vAcc = VUES.acc;
  /* 16/11 (Marie) : la cloche de l'accueil remplace le bandeau « X réservations en ligne depuis hier » */
  const CLOCHE = `<svg viewBox="0 0 24 24" width="21" height="21" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M6 16.5V11a6 6 0 0 1 12 0v5.5l1.5 1.5h-15z"/><path d="M10 20.5a2.1 2.1 0 0 0 4 0"/></svg>`;
  /* 16/11 (Marie) : la cloche montre aussi les rendez-vous annulés par les clientes (lien de l'e-mail de confirmation).
     Elle lit S.cloche (chargé à part, toutes semaines confondues) + S.rdv. Chaque ligne = un évènement { r, t (sa date), annul }. */
  const clocheListe = now => { const h = plusJours(now, -1), m = new Map(); [...S.rdv, ...(S.cloche || [])].forEach(r => m.set(r.id, r)); const L = [];
    m.forEach(r => { if (r.statut === "annule" && r.annule_par === "cliente" && r.annule_le && new Date(r.annule_le) > h) L.push({ r, t: r.annule_le, annul: true });
      else if (r.source === "en_ligne" && r.cree_le && new Date(r.cree_le) > h) L.push({ r, t: r.cree_le, annul: false }); });
    return L.sort((a, b) => String(b.t).localeCompare(String(a.t))); };
  const clocheVu = () => { try { return new Date(localStorage.getItem("loginail-cloche-vu") || 0); } catch (x) { return new Date(0); } };
  const ilya = d => { const m = Math.max(1, Math.round((Date.now() - d) / 60000)); return m < 60 ? `il y a ${m} min` : `il y a ${Math.round(m / 60)} h`; };
  document.addEventListener("click", e => { const b = e.target.closest && e.target.closest("[data-v-cloche]"); if (!b) return; e.stopPropagation();
    try { localStorage.setItem("loginail-cloche-vu", new Date().toISOString()); } catch (x) {}
    b.classList.remove("sonne"); const bd = b.querySelector(".v-badge"); if (bd) bd.remove(); b.setAttribute("aria-label", "Réservations en ligne");
    const L = clocheListe(new Date());
    ouvre(`<h3>Réservations en ligne</h3><div class="sous">Depuis hier</div>` + (L.length
      ? `<div class="liste v-liste v-cl-liste">${L.map(({ r, t, annul }) => { const d = new Date(r.debut);
          return `<div class="v-l${annul ? " v-annul" : ""}" data-rdv="${r.id}"><span class="v-h">${JOURS[(d.getDay() + 6) % 7].slice(0, 3).toLowerCase()}. ${d.getDate()}<br>${hh(d)}</span><div class="v-t">${esc(nomRdv(r))}<small>${annul ? `a annulé ${ilya(new Date(t))}${titreRdv(r) ? " · " + esc(titreRdv(r)) : ""}` : `${esc(titreRdv(r))}${titreRdv(r) ? " · " : ""}réservé ${ilya(new Date(t))}`}</small></div>${annul ? `<span class="v-p v-annule">Annulé</span>` : r.prix ? `<span class="v-p">${euros(r.prix)}</span>` : ""}</div>`; }).join("")}</div>`
      : `<div class="blanche vide"><b>Rien de nouveau</b><span>Aucune réservation ni annulation depuis hier.</span></div>`)); }, true);

  VUES.acc = () => { const f = dom(vAcc()), now = new Date(), prenom = S.profil.prenom || "", salon = (S.profil && S.profil.nom_salon) || "votre salon";
    const ai = f.querySelector(".ai-b"), dem = [...f.querySelectorAll(".k")].find(k => /Pour bien démarrer/.test(k.textContent));
    const notif = f.querySelector('[data-su="notif-oui"]'), caisse = f.querySelector('[data-su="acc-caisse"]'), vide = f.querySelector(".vide2");
    const libres = [...f.querySelectorAll('[data-su="libre"]')].map(b => ({ m: b.dataset.m, t: ((b.parentElement.querySelector("div") || {}).firstChild || {}).textContent || "" }));
    const auj = S.rdv.filter(r => memeJour(new Date(r.debut), now) && r.statut !== "annule").sort((a, b) => a.debut.localeCompare(b.debut)), cli = auj.filter(r => r.cliente_id);
    const ici = cli.find(r => new Date(r.debut) <= now && new Date(r.fin) > now && r.statut === "prevu");
    const proch = cli.find(r => r !== ici && new Date(r.fin) > now && new Date(r.debut) > now && r.statut === "prevu");
    const nouv = clocheListe(now), vu = clocheVu(), nonvu = nouv.filter(x => new Date(x.t) > vu).length;
    let h = `<div class="v-haut v-haut-acc">${etoiles("acc")}<div class="tete"><div><h1 style="--n:${(JOURS[(now.getDay() + 6) % 7] + " " + now.getDate() + " " + MOIS[now.getMonth()]).length}">${JOURS[(now.getDay() + 6) % 7]} <em>${now.getDate()} ${MOIS[now.getMonth()]}</em></h1></div><div class="v-btns"><button class="ai-b v-cloche${nonvu ? " sonne" : ""}" data-v-cloche aria-label="Réservations en ligne${nonvu ? " : " + nonvu + " nouvelle" + (nonvu > 1 ? "s" : "") : ""}">${CLOCHE}${nonvu ? `<span class="v-badge">${nonvu}</span>` : ""}</button>${ai ? ai.outerHTML : ""}</div></div>`;
    if (proch) { const d = new Date(proch.debut), mn = Math.round((d - now) / 60000), tel = (proch.clientes && proch.clientes.telephone || "").replace(/\s/g, "");
      h += `<div class="v-prochain" data-rdv="${proch.id}"><div class="v-lab">Prochaine cliente</div><div class="v-grand"><b>${hh(d)}</b><span>dans ${mn >= 60 ? duree(mn) : mn + " min"}</span></div>
        <div class="v-cli"><span class="v-av">${esc(((proch.clientes && proch.clientes.prenom) || nomRdv(proch) || "?")[0].toUpperCase())}</span><div>${esc(nomRdv(proch))}<small>${esc(titreRdv(proch))}${proch.prix ? " · " + euros(proch.prix) : ""}</small></div></div>
        ${tel ? `<div class="v-actions"><button class="v-btn" data-href="tel:${esc(tel)}">Appeler</button><button class="v-btn plein" data-href="sms:${esc(tel)}">Message</button></div>` : ""}</div>`; }
    h += "</div>";
    if (cli.length) { const tot = cli.filter(r => r.statut !== "absente").reduce((s, r) => s + (+r.prix || 0), 0), fin = new Date(Math.max(...cli.map(r => +new Date(r.fin))));
      h += `<div class="v-chiffres"><div><b>${cli.length}</b><span>rendez-vous</span></div><div><b>${euros(Math.round(tot)) || "0 €"}</b><span>prévus</span></div><div><b>${hFin(fin)}</b><span>fin de journée</span></div></div>`; }
    if (dem) { const c = dem.nextElementSibling; h += dem.outerHTML + (c ? c.outerHTML : ""); }
    if (ici) h += `<div class="k">En ce moment au salon</div><div class="v-maint" data-rdv="${ici.id}"><span class="v-pulse"></span><div>${esc(nomRdv(ici))}<small>${esc(titreRdv(ici))}</small></div><div class="v-jq">jusqu’à<br>${hh(new Date(ici.fin))}</div></div>`;
    if (libres.length) h += `<div class="k">Encore libre aujourd’hui</div><div class="v-creneaux">${libres.map(l => `<button class="v-cr" data-su="libre" data-m="${l.m}"><b>${esc(l.t.replace(/(\d+)h(\d\d)/g, "$1:$2"))}</b><span>+ Rendez-vous</span></button>`).join("")}</div>`;
    h += `<div class="k">Toute la journée <a data-go="ag">Agenda ›</a></div>`;
    if (auj.length) { const L = S.accTout ? auj : auj.slice(0, 5);
      h += `<div class="liste v-liste">${L.map(r => { const d = new Date(r.debut), passe = new Date(r.fin) <= now || r.statut === "fini" || r.statut === "absente";
        return `<div class="v-l${passe ? " passe" : ""}${r.cliente_id ? "" : " bloc"}" data-rdv="${r.id}"><span class="v-h">${hh(d)}</span><div class="v-t">${esc(nomRdv(r))}${r.source === "en_ligne" ? '<span class="v-pastille">en ligne</span>' : ""}<small>${esc(titreRdv(r)) || (r.cliente_id ? "" : "Créneau bloqué")}${r.statut === "absente" ? " · pas venue" : ""}</small></div>${r.prix ? `<span class="v-p">${euros(r.prix)}</span>` : ""}</div>`; }).join("")}
        ${auj.length > 5 ? `<button class="acc-plus" data-su="acc-plus">${S.accTout ? "Voir moins" : "Voir les " + (auj.length - 5) + " autres rendez-vous"}</button>` : ""}</div>`; }
    else if (vide) h += vide.outerHTML;
    const md = p2(now.getMonth() + 1) + "-" + p2(now.getDate()), anv = S.clientes.filter(c => c.anniversaire && String(c.anniversaire).slice(5, 10) === md);
    if (anv.length) h += `<div class="k">Anniversaires</div><div class="liste v-liste">${anv.map(c => { const tel = (c.telephone || "").replace(/\s/g, ""), txt = encodeURIComponent(`Joyeux anniversaire ${c.prenom || ""} ! Très belle journée de la part de ${salon}.`);
      return `<div class="v-l"><span class="v-av petit">${esc((c.prenom || "?")[0].toUpperCase())}</span><div class="v-t">${esc(nomCli(c))}<small>${c.ok_sms_anniv ? "Elle reçoit votre SMS aujourd’hui ✓" : tel ? "Un petit mot lui fera plaisir" : "Ajoutez son numéro pour lui écrire"}</small></div>${!c.ok_sms_anniv && tel ? `<a class="v-btn plein petit" href="sms:${esc(tel)}&body=${txt}">Écrire</a>` : ""}</div>`; }).join("")}</div>`;
    if (caisse) { const on = caisse.classList.contains("on");
      h += `<div class="k">Ma caisse</div><div class="liste v-liste"><div class="v-l"><div class="v-t">Noter ce que j’encaisse<small>${on ? "Pratique si on vous paie en espèces" : "Arrêtée : activez-la pour suivre vos encaissements"}</small></div><button class="sw${on ? " on" : ""}" data-su="acc-caisse" aria-label="Utiliser la caisse"></button><button class="v-x" data-su="acc-caisse-x" aria-label="Masquer">×</button></div></div>`; }
    if (notif) h += notif.closest(".acc-caisse").outerHTML;
    return h; };

  /* ---------- 5 · Agenda ---------- */
  const vAg = VUES.ag;
  VUES.ag = () => { const f = dom(vAg()), te = f.querySelector(".tete"), j = S.jour, L = S.lundi, F = plusJours(L, 6);
    const zone = te && te.lastElementChild && te.lastElementChild.tagName === "DIV" && te.lastElementChild.querySelector("button") ? te.lastElementChild : null;
    if (zone) { zone.removeAttribute("style"); zone.className = "v-ronds";
      zone.querySelectorAll(":scope>button").forEach(b => { if (b.dataset.a === "nouveau") return b.remove(); if (b.classList.contains("su-auj2")) return; b.removeAttribute("style"); b.classList.add("v-rondb"); });
      const aj = zone.querySelector(".su-auj2"); if (aj) zone.prepend(aj);   /* « Aujourd’hui » à gauche des deux ronds (Marie, 17/11) */
      const cg = zone.querySelector('[data-su="conges"]'); if (cg) cg.setAttribute("aria-label", "Bloquer un moment (congés)");
      const mo = zone.querySelector('[data-a="mois"]'); if (mo) mo.setAttribute("aria-label", "Choisir une date"); }
    const sm = te && te.querySelector("small"); if (sm) sm.textContent = sm.textContent.replace(/^./, c => c.toUpperCase());
    const ns = f.querySelector(".nav-sem span"); if (ns) ns.textContent = L.getMonth() === F.getMonth() ? `Du ${L.getDate()} au ${F.getDate()} ${MOIS[F.getMonth()]}` : `Du ${L.getDate()} ${MOIS[L.getMonth()]} au ${F.getDate()} ${MOIS[F.getMonth()]}`;
    f.querySelectorAll(".semaine button small").forEach(s => { if (s.textContent !== "auj.") s.textContent = s.textContent.toLowerCase() + "."; });
    const du = S.rdv.filter(r => memeJour(new Date(r.debut), j) && r.statut !== "annule" && r.cliente_id), tot = du.filter(r => r.statut !== "absente").reduce((s, r) => s + (+r.prix || 0), 0);
    const k = [...f.children].filter(x => x.classList.contains("k")).find(x => /rendez-vous/.test(x.textContent));
    if (k) k.textContent = `${JOURS[(j.getDay() + 6) % 7]} ${j.getDate()} · ${du.length} rendez-vous${tot ? " · " + euros(Math.round(tot)) : ""}`;
    f.querySelectorAll(".pap .pr[data-rdv]").forEach(el => { const r = S.rdv.find(x => x.id === el.dataset.rdv), st = el.querySelector("b strong"), sp = el.querySelector(":scope>span");
      if (st && sp) { const vide = !sp.textContent.trim(); st.textContent = st.textContent.replace(/\b0(\d):/g, "$1:"); if (vide) sp.prepend(st); else sp.prepend(st, " · "); }
      el.querySelectorAll(".en-ligne").forEach(x => { x.textContent = "en ligne"; });
      const tg = el.querySelector(".tagx"); if (tg && /^Fini$/.test(tg.textContent.trim())) { tg.remove(); el.classList.add("v-fini"); }
      if (r && !r.cliente_id) el.classList.add("v-bloc"); });
    const pap = f.querySelector(".pap"), now = new Date();
    if (pap && memeJour(j, now)) { const m = now.getHours() * 60 + now.getMinutes(); if (m >= OUV && m <= FERM) pap.insertAdjacentHTML("beforeend", `<div class="v-now" style="top:${(m - OUV) / 30 * R}px" aria-hidden="true"></div>`); }
    enHaut(f, "ag", [te, f.querySelector(".nav-sem"), f.querySelector(".semaine")]);
    return enTexte(f); };

  /* ---------- 6 · Clientes ---------- */
  const FILTRES = [["tout", "Toutes"], ["fid", "Fidèles"], ["partie", "Pas revenues depuis 2 mois"], ["anniv", "Anniversaire ce mois"]];
  const FIDELE = 3, DEUXMOIS = 61 * 864e5;
  const vis = c => (S.vis || {})[c.id] || { n: 0, der: "", proch: "" };
  const GARDE = { fid: c => vis(c).n >= FIDELE, partie: c => { const v = vis(c); return v.n > 0 && !v.proch && v.der && Date.now() - +new Date(v.der) > DEUXMOIS; },
    anniv: c => !!c.anniversaire && +String(c.anniversaire).slice(5, 7) === new Date().getMonth() + 1 };
  const info = c => { const v = vis(c), now = new Date(), n = v.n ? v.n + " visite" + (v.n > 1 ? "s" : "") : "";
    if (v.proch) { const d = new Date(v.proch), q = memeJour(d, now) ? "aujourd’hui " + hh(d) : "prochain rendez-vous le " + jourCourt(v.proch); return n ? n + " · " + q : q.charAt(0).toUpperCase() + q.slice(1); }
    if (!v.n) return "Pas encore venue";
    const mois = Math.floor((now - new Date(v.der)) / (30.44 * 864e5)); if (mois >= 2) return `Dernière visite il y a ${mois} mois`;
    return n + (v.n >= FIDELE ? " · fidèle ✦" : ""); };
  const vCl = VUES.cl;
  VUES.cl = () => { const tous = S.clientes, g = S.vFiltre && GARDE[S.vFiltre]; let h;
    if (g) S.clientes = tous.filter(g); try { h = vCl(); } finally { S.clientes = tous; }
    const f = dom(h), te = f.querySelector(".tete");
    if (te) { const sm = te.querySelector("small"); if (sm) sm.textContent = `${tous.length} cliente${tous.length > 1 ? "s" : ""}`;
      const z = document.createElement("div"); z.className = "v-ronds"; const imp = te.querySelector('[data-s5="plusieurs"]'); if (imp) { imp.className = "v-rondb"; z.appendChild(imp); }
      z.insertAdjacentHTML("beforeend", `<button class="v-rondb plein" data-a="cli-nouv" aria-label="Ajouter une cliente">${svg(IC.plus, 20)}</button>`); te.appendChild(z); }
    [...f.children].filter(x => x.matches('.btn[data-a="cli-nouv"]')).forEach(b => b.remove());
    const lab = f.querySelector("label.cherche"), row = lab && lab.parentElement;
    if (row) { row.removeAttribute("style"); row.className = "v-cherche"; const tb = row.querySelector('[data-a="tri-menu"]'); if (tb) { tb.removeAttribute("style"); tb.className = "v-rondb" + (S.tri !== "az" ? " plein" : ""); }
      row.insertAdjacentHTML("afterend", `<div class="v-filtres" role="tablist">${FILTRES.map(x => `<button role="tab" data-v-f="${x[0]}" aria-selected="${(S.vFiltre || "tout") === x[0]}" class="${(S.vFiltre || "tout") === x[0] ? "on" : ""}">${x[1]}</button>`).join("")}</div>`); }
    if (g && !S.cherche.trim()) { const v = f.querySelector(".blanche.vide"); if (v) v.outerHTML = `<div class="blanche vide"><b>Personne pour l’instant</b><span>Aucune cliente dans « ${(FILTRES.find(x => x[0] === S.vFiltre) || [, ""])[1]} ».</span></div>`; }
    const carte = f.querySelector(".carte");
    if (carte && S.tri === "az" && !S.cherche.trim()) { const k = carte.previousElementSibling; if (k && k.classList.contains("k")) k.remove();
      const frag = document.createDocumentFragment(); let cur = null;
      [...carte.children].forEach(r => { if (r.id && r.id.indexOf("L-") === 0 || !cur) { const l = r.id && r.id.indexOf("L-") === 0 ? r.id.slice(2) : "0", gr = document.createElement("div");
          gr.className = "v-groupe"; gr.id = "L-" + l; r.removeAttribute("id"); gr.innerHTML = `<div class="v-lettre">${l === "0" ? "#" : l}</div><div class="liste v-liste"></div>`; frag.appendChild(gr); cur = gr.lastChild; }
        cur.appendChild(r); });
      carte.replaceWith(frag); }
    else if (carte) { carte.classList.add("liste", "v-liste"); carte.removeAttribute("style"); }
    f.querySelectorAll(".cli[data-cli]").forEach(r => { const c = S.clientes.find(x => x.id === r.dataset.cli), em = r.querySelector(":scope>em");
      if (em) { em.className = "fl"; em.removeAttribute("style"); em.textContent = "›"; }
      if (c && S.tri === "az") { const sp = r.querySelector(".t span"); if (sp) sp.textContent = info(c); } });
    enHaut(f, "cl", [te, row, f.querySelector(".v-filtres")]);
    return enTexte(f); };
  document.addEventListener("click", e => { const b = e.target.closest && e.target.closest("[data-v-f]"); if (!b) return; e.stopPropagation();
    const x = b.parentElement.scrollLeft; S.vFiltre = b.dataset.vF === "tout" ? null : b.dataset.vF; rendu(); const n = E.querySelector(".vue.on .v-filtres"); if (n) n.scrollLeft = x; }, true);
  /* les lettres sur le côté : seulement celles qui existent ; on glisse le doigt dessus */
  let IXV = null;
  const brancheIdx = ix => { const va = y => { const sp = [...ix.children]; if (!sp.length) return; const r = ix.getBoundingClientRect(), i = Math.max(0, Math.min(sp.length - 1, Math.floor((y - r.top) / (r.height / sp.length))));
      const l = sp[i].dataset.l, gs = [...E.querySelectorAll('.vue.on [id^="L-"]')], cle = z => z === "0" || z === "#" ? "[" : z, gr = gs.find(z => cle(z.id.slice(2)) >= cle(l)) || gs[gs.length - 1], vu = E.querySelector(".vue.on"); if (gr && vu) vu.scrollTop += gr.getBoundingClientRect().top - vu.getBoundingClientRect().top - 70;
      sp.forEach((s, k) => s.classList.toggle("on", k === i)); };
    const fin = () => [...ix.children].forEach(s => s.classList.remove("on"));
    ix.addEventListener("touchstart", e => { e.preventDefault(); va(e.touches[0].clientY); }, { passive: false });
    ix.addEventListener("touchmove", e => { e.preventDefault(); va(e.touches[0].clientY); }, { passive: false });
    ix.addEventListener("touchend", fin); ix.addEventListener("touchcancel", fin);
    let bas = false; ix.addEventListener("mousedown", e => { bas = true; va(e.clientY); e.preventDefault(); });
    document.addEventListener("mousemove", e => { if (bas) va(e.clientY); }); document.addEventListener("mouseup", () => { if (bas) { bas = false; fin(); } }); };
  const indexLettres = () => { const v = E.querySelector('.vue.on[data-p="cl"]'), gs = v ? [...v.querySelectorAll(".v-groupe")] : [];
    if (!IXV || !IXV.isConnected) { if (!E.querySelector(".ong")) return; IXV = document.createElement("div"); IXV.className = "v-idx"; IXV.setAttribute("aria-hidden", "true"); E.appendChild(IXV); brancheIdx(IXV); }
    /* 18/11 (Marie : « je l'aimais bien, pourquoi tu l'as enlevé ») : avant, les lettres n'apparaissaient qu'à partir de 4 lettres différentes ;
       maintenant tout l'alphabet est toujours là, comme les contacts de l'iPhone (les lettres sans cliente en plus clair) */
    const on = !!v && gs.length > 0; IXV.hidden = !on; if (!on) return;
    const ls = gs.map(x => x.id.slice(2)).map(x => x === "0" ? "#" : x), tout = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").concat(ls.includes("#") ? ["#"] : []), cle = ls.join("");
    if (IXV.dataset.k !== cle) { IXV.dataset.k = cle; IXV.innerHTML = tout.map(l => `<span data-l="${l}"${ls.includes(l) ? "" : ' class="x"'}>${l}</span>`).join(""); } };

  /* ---------- 7 · Mon site ---------- */
  const LIG = { style: IC.style, perso: IC.perso, charms: IC.charms, "ms-presta": IC.presta, "ms-photos": IC.photos, "ms-salon": IC.salon, "ms-horaires": IC.horloge, "ms-adresse": IC.adresse, "ms-apropos": IC.apropos, "ms-photo": IC.moi, "ms-bon": IC.bon, "ms-legal": IC.bon, bio: IC.lien, site: IC.globe };
  const icones = () => E.querySelectorAll('.vue.on[data-p="si"] .ligne').forEach(l => { const k = l.dataset.v || l.dataset.a; if (LIG[k] && !l.querySelector(".v-ico")) l.insertAdjacentHTML("afterbegin", `<span class="v-ico">${svg(LIG[k])}</span>`); });
  new MutationObserver(() => { if (S.onglet === "si") icones(); }).observe(E, { childList: true, subtree: true });
  const vSi = VUES.si;
  VUES.si = () => { const f = dom(vSi()), b = brouillon() || {}, s = S.site, te = f.querySelector(".tete"), now = new Date();
    if (te) { const sm = te.querySelector("small"), h1 = te.querySelector("h1"); if (sm) sm.innerHTML = s && s.en_ligne ? `<span class="v-enligne">En ligne</span> · ${esc(s.slug)}` : "Pas encore en ligne"; if (h1) h1.textContent = "Mon site"; }
    const ap = f.querySelector(".ms2-apercu");
    if (ap) { const ph = (ap.querySelector(".ms2-photo") || { style: {} }).style.backgroundImage || "", nom = b.nom || S.profil.nom_salon || "Mon salon";
      const nv = dom(`<div class="v-apercu"><div class="v-img" data-ms2="voir" role="button" aria-label="Voir mon site"><div class="v-nomsite">${esc(nom)}</div></div><div class="v-bas"><div class="v-voir" data-ms2="voir">Voir mon site<small>Comme vos clientes le voient</small></div>${s && s.en_ligne ? '<button class="v-btn" data-v-partage>Partager</button>' : ""}</div></div>`);
      if (ph && !/url\(["']?["']?\)/.test(ph)) nv.querySelector(".v-img").style.backgroundImage = ph; else nv.querySelector(".v-img").classList.add("sans");
      ap.replaceWith(nv); }
    const pe = f.querySelector('.btn[data-ms2="nouveau"]'); if (pe) { pe.removeAttribute("style"); pe.classList.add("v-large"); }
    const chiffres = [], resa = (S.tous || []).filter(r => r.source === "en_ligne" && r.cree_le && new Date(r.cree_le).getMonth() === now.getMonth() && new Date(r.cree_le).getFullYear() === now.getFullYear()).length;
    if (s) chiffres.push([resa, "réservation" + (resa > 1 ? "s" : "") + " en ligne ce mois"]);
    if (b.note) chiffres.push([String(Math.round(b.note * 10) / 10).replace(".", ","), "sur Google" + (b.nbAvis ? " · " + b.nbAvis + " avis" : "")]);
    if (chiffres.length && pe) pe.insertAdjacentHTML("afterend", `<div class="v-chiffres v-c${chiffres.length}">${chiffres.map(c => `<div><b>${c[0]}</b><span>${c[1]}</span></div>`).join("")}</div>`);
    f.querySelectorAll(".ligne").forEach(l => { const k = l.dataset.v || l.dataset.a; if (LIG[k] && !l.querySelector(".v-ico")) l.insertAdjacentHTML("afterbegin", `<span class="v-ico">${svg(LIG[k])}</span>`);
      if (k === "perso") { const sp = l.querySelector(".t span"); if (sp) sp.textContent = sp.textContent.replace(/^La forme, le fond, les couleurs, l’écriture · /, ""); } });
    const lp = f.querySelector('.ligne[data-a="ms-photos"]'), ph = (b.photos || []).filter((p, i) => i !== b.salon && p && p.url).slice(0, 3);
    if (lp && ph.length) { lp.classList.add("v-avecvign"); lp.insertAdjacentHTML("beforeend", `<div class="v-vign">${ph.map(p => `<i style="background-image:url('${String(p.url).replace(/^\.\.\//, "").replace(/'/g, "%27")}')"></i>`).join("")}</div>`); }
    enHaut(f, "si", [te, f.querySelector(".v-apercu"), pe]);
    return enTexte(f); };
  document.addEventListener("click", async e => { const p = e.target.closest && e.target.closest("[data-v-partage]"); if (!p) return; e.stopPropagation();
    const st = S.site; if (!st || !st.en_ligne || !st.slug) return dit("Mettez d’abord votre site en ligne");
    const url = "https://loginail.fr/loginail-creer/pret.html?public&s=" + st.slug, nom = (brouillon() || {}).nom || S.profil.nom_salon || "Mon site";
    if (navigator.share) { try { await navigator.share({ title: nom, url }); return; } catch (x) { if (x && x.name === "AbortError") return; } }
    try { await navigator.clipboard.writeText(url); dit("Lien copié ✓"); } catch (x) { dit("Impossible de copier, réessayez"); } }, true);

  /* ---------- 8 · Réglages : seul le dessin change (mêmes rubriques, même ordre, mêmes mots) ---------- */
  const vRe = VUES.re;
  VUES.re = () => { const f = dom(vRe()), t = teinte(), te = f.querySelector(".tete");
    const premier = [...f.children].find(x => x.classList.contains("k"));
    const mon = dom(`<div class="k">Mon appli</div><div class="liste"><div class="ligne v-teinte"><span class="s5-ic">${svg(IC.goutte, 17)}</span><div class="t">Couleur de mon appli<span>${t.nom}</span></div>
      <div class="v-ronds-t" role="radiogroup" aria-label="Couleur de mon appli">${T.map(x => `<button role="radio" data-v-t="${x.id}" aria-checked="${x.id === t.id}" aria-label="${x.nom}" title="${x.nom}" class="${x.id === t.id ? "on" : ""}" style="background:linear-gradient(135deg,${x.rose} 50%,${x.acc} 50%)"></button>`).join("")}</div></div>
      <div class="ligne"><span class="s5-ic">${svg(IC.fond, 17)}</span><div class="t">Afficher mon fond en haut<span>Le fond de mon site au-dessus de l’agenda</span></div><button class="sw${ban() ? " on" : ""}" data-v-ban aria-label="Afficher mon fond en haut"></button></div></div>`);
    if (premier) premier.before(mon); else f.appendChild(mon);
    const ajIc = (sel, d) => { const b = f.querySelector(sel), l = b && b.closest(".ligne"); if (l && !l.querySelector(".s5-ic")) l.insertAdjacentHTML("afterbegin", `<span class="s5-ic">${svg(d, 17)}</span>`); };
    ajIc('[data-su="ag-hor"]', IC.horloge); ajIc('[data-su="notif-sw"]', IC.cloche);
    const sup = f.querySelector('.ligne[data-a="suppr"]'); if (sup) sup.classList.add("v-danger");
    const fsw = f.querySelector('[data-fi="fid-on"]');
    if (fsw && fsw.classList.contains("on")) { const n = Math.max(1, +((f.querySelector(".fi-pas b") || {}).textContent || 10)), perso = ((f.querySelector("#fi-cad") || {}).value || "").trim();
      const cad = perso || ((f.querySelector(".fi-puces .on") || {}).textContent || "votre cadeau"), fait = Math.max(1, Math.min(6, n - 1)), reste = n - fait;
      const salon = S.profil.nom_salon || (brouillon() || {}).nom || "Mon salon";
      fsw.closest(".ligne").insertAdjacentHTML("afterend", `<div class="v-fid"><div class="v-fid-carte"><div class="v-fid-t"><span>${esc(salon)}</span><span aria-hidden="true">✦</span></div>
        <div class="v-fid-p${n > 12 ? " serre" : ""}" style="grid-template-columns:repeat(${n},1fr)">${Array.from({ length: n }, (_, i) => `<i${i < fait ? ' class="ok"' : ""}></i>`).join("")}</div>
        <div class="v-fid-b">${fait} sur ${n} · encore ${reste} visite${reste > 1 ? "s" : ""} pour ${esc(cad)}</div></div><div class="v-fid-leg">Exemple : la carte que voit votre cliente</div></div>`); }
    enHaut(f, "re", [te]);
    return enTexte(f); };
  document.addEventListener("click", e => { const t = e.target.closest && e.target.closest("[data-v-t]");
    if (t) { e.stopPropagation(); if (t.dataset.vT === teinte().id) return; ecrit("loginail-appli-teinte", t.dataset.vT); poseTeinte(); rendu();
      try { E.animate([{ opacity: .55 }, { opacity: 1 }], { duration: 260, easing: "ease-out" }); } catch (x) {} return; }
    const bb = e.target.closest && e.target.closest("[data-v-ban]");
    if (bb) { e.stopPropagation(); const on = !ban(); ecrit("loginail-appli-bandeau", on ? "oui" : "non");
      if (on && !fondDuSite()) dit("Choisissez d’abord un fond pour votre site, dans Mon site");
      else if (on) prepareFond().then(() => { if (FOND.nom !== fondDuSite()) dit("Votre fond ne peut pas encore s’afficher dans l’appli"); });
      rendu(); } }, true);

  /* ---------- 9 · après chaque dessin : le bouton « + » de l'agenda, le bandeau, les lettres ---------- */
  let FAB = null;
  const fab = () => { if (!E.querySelector(".ong")) return;
    if (!FAB || !FAB.isConnected) { FAB = document.createElement("button"); FAB.className = "v-fab"; FAB.dataset.a = "nouveau"; FAB.setAttribute("aria-label", "Nouveau rendez-vous"); FAB.innerHTML = svg(IC.plus, 26); E.appendChild(FAB); }
    FAB.hidden = S.onglet !== "ag"; };
  const r0 = rendu;
  rendu = function () { r0.apply(this, arguments); try { fab(); bandeau(); indexLettres(); } catch (e) { console.warn(e); } };

  /* ---------- 10 · le dessin ---------- */
  const st = document.createElement("style");
  st.textContent = `
:root{--v-trait:rgba(30,28,27,.09);--v-encre:#1E1C1B}
.ecran#E{background:var(--v-c)}
/* le haut rosé : peint sur la page elle-même, il défile avec elle */
#E .vue{background:radial-gradient(470px 330px at 88% 0,var(--v-h1),transparent 70%) no-repeat,linear-gradient(180deg,var(--v-h2) 0,var(--v-c) 380px) 0 0/100% 380px no-repeat;background-color:var(--v-c);background-attachment:local,local}
#E .v-haut{position:relative;padding-bottom:24px}
#E .v-haut+.k{margin-top:8px}
#E .hors:not(.on){visibility:hidden}
#E .v-et{position:absolute;color:var(--v-acc);opacity:.55;line-height:1;pointer-events:none;z-index:0}
#E .v-haut>*:not(.v-et){position:relative;z-index:1}
#E .v-ban{position:absolute;left:0;right:0;top:0;height:calc(max(62px,env(safe-area-inset-top) + 40px) + 96px);overflow:hidden;z-index:0;pointer-events:none;-webkit-mask-image:linear-gradient(180deg,#000 62%,transparent);mask-image:linear-gradient(180deg,#000 62%,transparent)}
#E .v-ban .f100,#E .v-ban .tuile{position:absolute!important;inset:0;width:100%!important;height:100%!important;border-radius:0!important}
#E .v-avecban>*:not(.v-ban){position:relative;z-index:1}
#E .v-avecban>.v-haut{z-index:5}   /* 18/11 (bug de Marie) : avec le fond en haut, le mois et le menu de tri passaient sous la liste des heures */
#E .v-avecban .v-et{display:none}
#E .v-avecban .tete>div:first-child{background:rgba(255,255,255,.78);-webkit-backdrop-filter:blur(10px);backdrop-filter:blur(10px);border-radius:16px;padding:8px 14px 6px;margin-left:-6px}
/* les titres : écrits normalement, Cormorant pour le grand titre */
#E .tete{align-items:flex-end;margin-bottom:0;gap:10px}
#E .tete small{font-size:13px;letter-spacing:0;text-transform:none;color:var(--gris)}
#E .tete h1{font:400 38px/1.05 'Italiana','Cormorant Garamond',Georgia,serif;margin:2px 0 0;letter-spacing:.01em;color:var(--v-encre)}   /* 16/11 (Marie) : Italiana pour tous les titres */
#E .tete h1 em{font-style:normal;color:var(--v-acc)}
#E .v-btns{display:flex;gap:8px;flex:none}#E .v-cloche{position:relative}#E .v-cloche svg{transform-origin:50% 12%}
#E .v-badge{position:absolute;top:-4px;right:-4px;min-width:19px;height:19px;padding:0 5px;border-radius:10px;background:var(--v-acc);color:#fff;font:500 11px/19px Jost,sans-serif;text-align:center;box-shadow:0 0 0 2px #fff}
#E .v-cloche.sonne svg{animation:v-sonne .9s .35s ease-in-out 2}
@keyframes v-sonne{0%,100%{transform:rotate(0)}15%{transform:rotate(14deg)}30%{transform:rotate(-11deg)}45%{transform:rotate(7deg)}60%{transform:rotate(-4deg)}75%{transform:rotate(2deg)}}
@media (prefers-reduced-motion:reduce){#E .v-cloche.sonne svg{animation:none}}
#E .v-cl-liste .v-h{line-height:1.3;font-size:12.5px;white-space:nowrap;width:auto;min-width:54px}
#E .v-cl-liste .v-annul .v-h{text-decoration:line-through;opacity:.55}#E .v-cl-liste .v-annule{font-size:12.5px;color:#A04A4A}
#E .v-haut-acc .tete{container-type:inline-size}#E .v-haut-acc .tete h1{white-space:nowrap;font-size:min(38px,calc((100cqw - 112px) / (var(--n, 21) * .48)))}
#E :is(.k,.lab,.lab2,.fi-k,.form label,.noire small,.fi-noire small,.fi-t3 small,.su-t3 small,.su-b2 small,.k-tot span,.rv-note b,.su-auj2 small,.fi-fid .ht small,.abo small,.deco,.btn,.semaine button small,.tete small){text-transform:none!important;letter-spacing:0!important}
#E .k{font-size:13px;font-weight:400;color:var(--gris);margin:26px 0 10px}
#E .k a{font-size:13px;color:var(--v-fonce);text-decoration:none}
#E :is(.lab,.lab2,.fi-k){font-size:13px;color:var(--gris)}
#E :is(.su-t3 small,.su-b2 small,.noire small,.fi-noire small,.fi-t3 small){font-size:12.5px;font-weight:400}
/* listes blanches arrondies 20 px, trait fin */
#E :is(.liste,.carte,.su-carte){background:#fff;border-radius:20px;border:1px solid var(--v-trait);padding:2px 16px;box-shadow:none}
#E .ligne{min-height:56px;font-size:15px;border-bottom-color:var(--v-trait)}
#E .ligne .t span{font-size:12.5px;color:var(--gris);margin-top:1px}
#E .ligne .fl{color:#C4BAB1}
#E .s5-ic,#E .v-ico{flex:none;width:36px;height:36px;border-radius:12px;background:var(--v-rose);color:var(--v-acc);display:grid;place-items:center;margin-right:0}
#E .s5-ic svg,#E .v-ico svg{width:18px;height:18px}
#E .blanche{border-radius:20px;border:1px solid var(--v-trait)}
/* boutons : un seul foncé par zone, arrondis 14 px, écrits normalement */
#E .btn{height:48px;border-radius:14px;background:var(--v-fonce);color:#fff;font-size:15px;font-weight:400}
#E .btn.clair{background:var(--v-rose);color:var(--v-fonce)}
#E .sw{background:#D9D2CB}#E .sw.on{background:var(--v-fonce)}
#E .v-btn{height:44px;border-radius:14px;border:0;background:var(--v-rose);color:var(--v-fonce);font:inherit;font-size:14px;padding:0 16px;cursor:pointer;display:inline-flex;align-items:center;justify-content:center;text-decoration:none;transition:transform .12s}
#E .v-btn.plein{background:var(--v-fonce);color:#fff}
#E .v-btn.petit{height:36px;padding:0 14px;font-size:13px;margin-left:auto;flex:none}
#E :is(.v-btn,.btn,.v-rondb,.v-cr,.v-fab,.v-filtres button,.v-ronds-t button):active{transform:scale(.96)}
#E .v-rondb{width:42px;height:42px;border-radius:50%;border:0;background:#fff;display:grid;place-items:center;padding:0;flex:none;color:var(--v-fonce);box-shadow:0 6px 16px -10px rgba(120,40,55,.5);cursor:pointer;transition:transform .12s}
#E .v-rondb.plein{background:var(--v-fonce);color:#fff}
#E .v-rondb svg{width:20px;height:20px}
#E .v-ronds{display:flex;gap:8px;position:relative;flex:none}
#E .ai-b{width:42px;height:42px;box-shadow:0 6px 16px -10px rgba(120,40,55,.5);color:var(--v-fonce)}
/* la barre du bas : collée en bas, fond flouté, l'onglet choisi en brun foncé */
#E .ong.o1{left:0!important;right:0!important;bottom:0!important;height:auto;min-height:84px;border-radius:0;padding:8px max(6px,calc((100% - 560px)/2)) max(24px,env(safe-area-inset-bottom));background:color-mix(in srgb,var(--v-c) 88%,transparent)!important;-webkit-backdrop-filter:blur(18px) saturate(1.4);backdrop-filter:blur(18px) saturate(1.4);box-shadow:none;border-top:1px solid var(--v-trait);transform:none!important;opacity:1!important;align-items:flex-start}
#E .ong.o1 button{height:52px;border-radius:12px;background:none!important;color:var(--gris);font-size:10.5px;letter-spacing:0;gap:4px;transition:color .2s}
#E .ong.o1 button.on{color:var(--v-fonce)}
#E .ong.o1 svg{width:24px;height:24px;stroke-width:1.5}
#E .ong.o1 button.on svg{stroke-width:1.9}
#E .toast{background:var(--v-fonce);border-radius:14px}
#E .feuille{background:var(--v-c)}
#E .feuille:has(.fi-sw){height:100%}   /* 18/11 (Marie) : la fiche d'une cliente s'ouvre tout de suite en grand (avant : petite, puis elle grandissait quand l'historique arrivait) */
#E .feuille h3{font:500 28px/1.1 'Cormorant Garamond',Georgia,serif;letter-spacing:0}
#E .chip.on,#E .su-puces button.on,#E .fi-puces button.on{background:var(--v-fonce)!important;color:#fff!important}
/* les pastilles « en ligne » : texte un peu plus foncé pour bien se lire */
#E .en-ligne,#E .v-pastille{display:inline-block;margin-left:6px;padding:1px 8px;border-radius:99px;background:var(--v-rose)!important;color:color-mix(in srgb,var(--v-acc) 74%,#000)!important;font-size:11px;font-style:normal;font-weight:400;vertical-align:1px}
#E .noire{border-radius:24px}

/* ----- Accueil ----- */
#E .v-prochain{background:#fff;border-radius:24px;padding:20px;margin-top:20px;box-shadow:0 18px 40px -26px rgba(120,40,55,.45);cursor:pointer}
#E .v-lab{font-size:12.5px;color:var(--gris)}
#E .v-grand{display:flex;align-items:baseline;gap:10px;margin:2px 0 12px}
#E .v-grand b{font:500 52px/1 'Cormorant Garamond',Georgia,serif;font-variant-numeric:lining-nums}
#E .v-grand span{font-size:13px;color:var(--v-acc)}
#E .v-cli{display:flex;align-items:center;gap:12px;font-size:15px}
#E .v-cli small,#E .v-maint small{display:block;font-size:13px;color:var(--gris)}
#E .v-av{width:42px;height:42px;border-radius:50%;background:var(--v-rose);color:var(--v-acc);display:grid;place-items:center;font:500 18px 'Cormorant Garamond',Georgia,serif;flex:none}
#E .v-av.petit{width:34px;height:34px;font-size:15px}
#E .v-actions{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:16px}
#E .v-annonce{background:var(--v-rose);border-radius:16px;padding:12px 14px;margin:0 0 22px;font-size:14px}
#E .v-annonce>i{width:7px;height:7px;background:var(--v-acc)}
#E .v-annonce .fl{margin-left:auto;color:var(--v-acc);font-size:13px;white-space:nowrap}
#E .v-chiffres{display:grid;grid-template-columns:repeat(3,1fr);margin:0 0 6px}
#E .v-chiffres.v-c2{grid-template-columns:repeat(2,1fr)}#E .v-chiffres.v-c1{grid-template-columns:1fr}
#E .v-chiffres div{padding:0 4px;min-width:0}
#E .v-chiffres div+div{border-left:1px solid var(--v-trait);padding-left:16px}
#E .v-chiffres b{display:block;font:500 28px/1.1 'Cormorant Garamond',Georgia,serif;font-variant-numeric:lining-nums;white-space:nowrap}
#E .v-chiffres span{font-size:12.5px;color:var(--gris)}
#E .v-maint{display:flex;align-items:center;gap:12px;padding:14px 16px;border-radius:18px;background:#fff;border:1px solid var(--v-trait);font-size:15px;cursor:pointer}
#E .v-pulse{width:8px;height:8px;border-radius:50%;background:#3D8B66;box-shadow:0 0 0 4px rgba(61,139,102,.15);flex:none;animation:vPulse 2s ease-in-out infinite}
@keyframes vPulse{50%{box-shadow:0 0 0 7px rgba(61,139,102,.06)}}
#E .v-jq{margin-left:auto;font-size:12.5px;color:var(--gris);text-align:right}
#E .v-creneaux{display:flex;gap:8px;overflow-x:auto;scrollbar-width:none;margin:0 -22px;padding:0 22px 2px;scroll-snap-type:x proximity}
#E .v-creneaux::-webkit-scrollbar{display:none}
#E .v-cr{flex:none;border-radius:16px;padding:12px 14px;border:1px dashed color-mix(in srgb,var(--v-acc) 45%,transparent);background:color-mix(in srgb,var(--v-rose) 40%,transparent);font:inherit;text-align:left;color:inherit;cursor:pointer;scroll-snap-align:start;transition:transform .12s}
#E .v-cr b{display:block;font-weight:500;font-size:14.5px;font-variant-numeric:lining-nums}
#E .v-cr span{font-size:12.5px;color:var(--v-acc)}
#E .v-l{display:flex;align-items:center;gap:12px;padding:13px 0;font-size:15px;cursor:pointer}
#E .v-l+.v-l{border-top:1px solid var(--v-trait)}
#E .v-l .v-h{width:44px;flex:none;font-variant-numeric:tabular-nums;font-size:14px;color:var(--gris)}
#E .v-l .v-t{min-width:0}
#E .v-l small{display:block;font-size:12.5px;color:var(--gris);margin-top:1px}
#E .v-l .v-p{margin-left:auto;font-size:13.5px;white-space:nowrap}
#E .v-l.passe{opacity:.4}
#E .v-l.bloc .v-t{color:var(--gris)}
#E .v-l .sw{margin-left:auto}
#E .v-x{flex:none;border:0;background:none;color:var(--gris);font-size:18px;padding:4px 0 4px 6px;cursor:pointer;opacity:.7}
#E .acc-plus{color:var(--gris);text-decoration:none;padding:10px 0 12px;border-top:1px solid var(--v-trait)}
#E .acc-caisse{background:#fff;border:1px solid var(--v-trait);border-radius:20px;margin-top:26px}
#E .acc-caisse .pil.noir{background:var(--v-fonce)!important;border-radius:12px!important}
#E .vide2{display:flex;align-items:center;gap:12px}
/* ----- Agenda ----- */
#E .nav-sem{margin:18px 0 12px;font-size:13px;color:var(--gris)}
#E .nav-sem button{width:34px;height:34px;background:rgba(255,255,255,.7);color:var(--v-fonce);font-size:16px}
#E .su-auj2{color:var(--v-fonce);box-shadow:0 6px 16px -10px rgba(120,40,55,.5)}
#E .semaine{display:grid;grid-template-columns:repeat(7,1fr);gap:4px;margin:0}
#E .semaine button{width:auto;height:auto;padding:8px 0 10px;border-radius:16px;gap:2px;background:none;color:inherit;transition:background .2s}
#E .semaine button small{font-size:11.5px;color:var(--gris)}
#E .semaine button b{font:500 22px/1.1 'Cormorant Garamond',Georgia,serif;font-variant-numeric:lining-nums;color:var(--v-encre)}
#E .semaine button i{width:4px;height:4px;margin-top:3px;background:transparent}
#E .semaine button.plein i{background:var(--v-acc);opacity:.6}
#E .semaine button.on{background:var(--v-fonce)}
#E .semaine button.on small{color:rgba(255,255,255,.7)}#E .semaine button.on b{color:#fff}#E .semaine button.on i{background:#fff;opacity:1}
#E .semaine button.fj{opacity:1}#E .semaine button.fj b{color:#C9BFB6;text-decoration:none}
#E .pap{background:#fff;border-radius:22px;border:1px solid var(--v-trait);box-shadow:none;margin-top:0;padding-left:52px}
#E .pap:before{display:none}
#E .pap .pl{border-bottom-color:transparent}
#E .pap .pl:not(.plein){border-bottom-color:var(--v-trait)}
#E .pap .pl span{top:-7px;left:-46px;width:36px;font-size:11.5px;color:var(--gris)!important;font-variant-numeric:tabular-nums;background:#fff}
#E .pap .pl span.maint{color:var(--v-acc)!important;font-weight:500}
#E .pap .pr{left:56px;right:12px;border-radius:12px;background:var(--v-rose);box-shadow:inset 3px 0 0 var(--v-acc)!important;padding:6px 10px 6px 13px;z-index:2}
#E .pap .pr b{font-size:13.5px;font-weight:500;line-height:1.25}
#E .pap .pr span{font-size:11.5px;color:var(--gris)}
#E .pap .pr span strong{font-weight:400;font-size:11.5px;margin:0;color:var(--gris);font-variant-numeric:tabular-nums}
#E .pap .pr.ligne-en{background:#fff;border:1px solid color-mix(in srgb,var(--v-acc) 40%,transparent)}
#E .pap .pr.v-fini{opacity:.45}
#E .pap .pr.v-bloc{background:repeating-linear-gradient(135deg,#F3EFEB 0 7px,#EEE9E4 7px 14px);box-shadow:inset 3px 0 0 #C9BFB6!important}
#E .pap .pr.v-bloc b{font-weight:400;color:var(--gris)}
#E .pap .pr.su-tient{background:#fff}
#E .v-now{position:absolute;left:46px;right:0;height:0;border-top:1.5px solid var(--v-acc);z-index:1;pointer-events:none}
#E .v-now:before{content:"";position:absolute;left:-4px;top:-4.5px;width:7px;height:7px;border-radius:50%;background:var(--v-acc)}
#E .v-fab{position:absolute;z-index:69;right:max(20px,calc((100% - 560px)/2 + 20px));bottom:calc(max(24px,env(safe-area-inset-bottom)) + 78px);width:56px;height:56px;border-radius:50%;border:0;background:var(--v-fonce);color:#fff;display:grid;place-items:center;padding:0;cursor:pointer;box-shadow:0 14px 30px -12px rgba(42,27,30,.6);transition:transform .12s;animation:vFab .3s cubic-bezier(.3,1.4,.5,1)}
#E .v-fab[hidden]{display:none}
@keyframes vFab{from{transform:scale(.6);opacity:0}}
/* ----- Clientes ----- */
#E .v-cherche{display:flex;gap:8px;align-items:center;margin-top:18px;position:relative}
#E .cherche{height:46px;border-radius:14px;background:#fff;border:1px solid var(--v-trait);padding:0 14px;font-size:15px}
#E .v-cherche .v-rondb{width:46px;height:46px}
#E .v-filtres{display:flex;gap:8px;margin:14px -22px 0;padding:0 22px;overflow-x:auto;scrollbar-width:none}
#E .v-filtres::-webkit-scrollbar{display:none}
/* 17/11 (Marie) : le calendrier du mois et le menu de tri passaient SOUS la bande des jours, les rendez-vous et les filtres (ils étaient enfermés au niveau 1) ; le mois n'est plus transparent */
#E .v-haut>.tete,#E .v-haut>.v-cherche{z-index:40!important}#E .calm{background:#fff!important;-webkit-backdrop-filter:none!important;backdrop-filter:none!important;box-shadow:0 24px 60px -18px rgba(30,28,27,.45)!important}
#E .v-filtres button{flex:none;height:34px;padding:0 14px;border-radius:99px;background:rgba(255,255,255,.75);border:1px solid var(--v-trait);font:inherit;font-size:13px;color:inherit;cursor:pointer;transition:background .2s,color .2s}
#E .v-filtres button.on{background:var(--v-fonce);color:#fff;border-color:var(--v-fonce)}
#E .vue[data-p="cl"] .v-groupe{margin-right:14px}
#E .v-lettre{font:500 20px 'Cormorant Garamond',Georgia,serif;color:var(--v-acc);margin:14px 0 6px 2px}
#E .v-groupe:first-of-type .v-lettre{margin-top:4px}
#E .v-liste{padding:2px 16px}
#E .cli{border-bottom-color:var(--v-trait);font-size:15px}
#E .cli .av{background:var(--v-rose);color:var(--v-acc);font:500 16px 'Cormorant Garamond',Georgia,serif}
#E .cli b{font-size:15px}
#E .cli span{font-size:12.5px;color:var(--gris)}
#E .cli .fl{margin-left:auto;color:#C4BAB1;font-size:18px;font-style:normal}
#E .su-rel{background:var(--v-rose);border-radius:16px;margin-top:16px}
#E .su-rel span{color:#6d5a58}
#E .tris{border-radius:18px!important}
#E .idx2{display:none!important}
#E .v-idx{position:absolute;right:4px;top:50%;transform:translateY(-50%);z-index:12;display:flex;flex-direction:column;align-items:center;padding:8px 3px;touch-action:none;-webkit-user-select:none;user-select:none;cursor:pointer}
#E .v-idx[hidden]{display:none}
#E .v-idx span{font-size:10px;font-weight:500;line-height:15px;width:16px;text-align:center;color:var(--v-acc);border-radius:50%;transition:transform .1s}
#E .v-idx span.on{transform:scale(1.5)}#E .v-idx span.x{opacity:.35}
/* ----- Mon site ----- */
#E .v-enligne{display:inline-flex;align-items:center;gap:6px;color:#2E6B4F}
#E .v-enligne:before{content:"";width:7px;height:7px;border-radius:50%;background:#3D8B66}
#E .v-apercu{border-radius:24px;overflow:hidden;background:#fff;box-shadow:0 18px 40px -26px rgba(120,40,55,.45);margin-top:18px}
#E .v-img{height:190px;background:var(--v-rose) center/cover;position:relative;cursor:pointer}
#E .v-img:after{content:"";position:absolute;inset:0;background:linear-gradient(180deg,rgba(0,0,0,0) 38%,rgba(0,0,0,.5))}
#E .v-img.sans:after{display:none}
#E .v-nomsite{position:absolute;left:16px;right:16px;bottom:12px;z-index:2;color:#fff;font:600 30px/1.05 'Cormorant Garamond',Georgia,serif;text-shadow:0 1px 12px rgba(0,0,0,.25);overflow:hidden;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical}
#E .v-img.sans .v-nomsite{color:var(--v-fonce);text-shadow:none}
#E .v-bas{display:flex;align-items:center;gap:10px;padding:14px 16px;font-size:15px}
#E .v-voir{cursor:pointer;flex:1;min-width:0}
#E .v-bas small{display:block;font-size:12.5px;color:var(--gris)}
#E .v-bas .v-btn{height:38px;font-size:13px;flex:none}
#E .btn.v-large{width:100%;height:50px;margin:14px 0 0}
#E .vue[data-p="si"] .v-chiffres{margin-top:0}
#E .ligne.v-avecvign{flex-wrap:wrap}
#E .v-vign{display:grid;grid-template-columns:repeat(3,1fr);gap:6px;width:100%;padding:0 0 14px}
#E .v-vign i{aspect-ratio:1;border-radius:12px;background:var(--v-rose) center/cover}
/* ----- Réglages ----- */
#E .v-teinte{flex-wrap:wrap;padding-bottom:12px}
#E .v-ronds-t{display:flex;justify-content:space-between;width:100%;padding:4px 2px 2px}
#E .v-ronds-t button{width:32px;height:32px;flex:none;border-radius:50%;border:0;padding:0;cursor:pointer;box-shadow:0 0 0 1px rgba(0,0,0,.06);transition:box-shadow .2s,transform .12s}
#E .v-ronds-t button.on{box-shadow:0 0 0 2px #fff,0 0 0 3.5px var(--v-fonce)}
#E .v-danger .t{color:#A04A4A}
#E .fi-pas b{font:500 22px 'Cormorant Garamond',Georgia,serif;font-variant-numeric:lining-nums tabular-nums;min-width:24px;text-align:center}
#E .fi-pas button{background:var(--v-rose)!important;color:var(--v-fonce)!important;border:0!important}
#E .fi-puces button{border-radius:99px;border:1px solid var(--v-trait);background:#fff;height:34px;padding:0 14px;font-size:13px}
#E .fi-in{border:1px solid var(--v-trait);border-radius:14px;background:#fff;padding:10px 14px}
#E .vue[data-p="re"] .ligne:is([data-s5="plusieurs"],[data-a="export"],[data-a="suppr"],[data-a="lien"],[data-a="lien2"],[data-a="deco"]) .s5-ic{display:none}
#E .v-fid{padding:2px 0 14px}
#E .v-fid-carte{border-radius:18px;padding:14px 16px;background:linear-gradient(135deg,var(--v-fonce),color-mix(in srgb,var(--v-fonce) 70%,var(--v-acc)));color:#fff}
#E .v-fid-t{display:flex;justify-content:space-between;gap:10px;font:500 17px 'Cormorant Garamond',Georgia,serif}
#E .v-fid-p{display:grid;gap:6px;margin:12px 0 10px}#E .v-fid-p.serre{gap:3px}
#E .v-fid-p i{aspect-ratio:1;border-radius:50%;border:1px solid rgba(255,255,255,.45);transition:background .2s}
#E .v-fid-p i.ok{background:var(--v-rose);border-color:var(--v-rose)}
#E .v-fid-b{font-size:12px;opacity:.85;font-variant-numeric:lining-nums}
#E .v-fid-leg{font-size:12px;color:var(--gris);margin:8px 2px 0}
@media (prefers-reduced-motion:reduce){#E .v-pulse,#E .v-fab{animation:none}}
`;
  document.head.appendChild(st);
})();
