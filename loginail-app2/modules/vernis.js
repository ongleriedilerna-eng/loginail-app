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

  /* 21/11 (Marie, D68) : le carré de bienvenue, version A. Seulement tant qu'elle n'a pas appuyé sur « C'est noté » :
     mémorisé dans son compte (user_metadata.bienvenue_vue, donc aussi sur un 2e appareil) + dans le téléphone pour aller vite. */
  const bvCle = () => "loginail-bienvenue-" + ((S.user && S.user.id) || "");
  const bvVue = () => !!(S.user && S.user.user_metadata && S.user.user_metadata.bienvenue_vue) || lit(bvCle(), "") === "vue";
  let bvAnime = false;
  const BV = [["moi", "Ta prochaine cliente", "l’appeler ou lui écrire en un geste"], ["horloge", "Tes heures encore libres", "un rendez-vous en un appui"],
    ["cadeau", "Les anniversaires de tes clientes", "un petit mot qui fait plaisir"], ["cloche", "Les réservations de ton site", "dès qu’une cliente réserve en ligne"]];
  const IC_BV = { moi: '<circle cx="12" cy="8" r="3.5"/><path d="M5 20c1-4 4-6 7-6s6 2 7 6"/>', horloge: '<circle cx="12" cy="12" r="8"/><path d="M12 8v4l3 2"/>',
    cadeau: '<path d="M5 11h14v9H5zM4 8h16v3H4zM12 8v12M12 8c-2-4-6-3-5 0M12 8c2-4 6-3 5 0"/>', cloche: '<path d="M6 16V11a6 6 0 0 1 12 0v5l1.5 2h-15zM10 20h4"/>' };
  const bienvenue = () => { if (!S.user || bvVue()) return ""; const calme = bvAnime; bvAnime = true;
    return `<div class="v-bv${calme ? " calme" : ""}" role="region" aria-label="Bienvenue"><div class="v-bv-t">Bienvenue chez <em>toi</em> ✦</div><p>Ici, c’est ta journée. Chaque fois que tu ouvres l’appli, tu trouves :</p>${BV.map(([i, t, s]) => `<div class="v-bv-it"><span class="v-ico">${svg(IC_BV[i], 17)}</span><div>${t}<small>${s}</small></div></div>`).join("")}<button class="v-bv-ok" data-v-bv>C’est noté</button></div>`; };
  document.addEventListener("click", e => { const b = e.target.closest && e.target.closest("[data-v-bv]"); if (!b) return; e.stopPropagation(); e.preventDefault();
    ecrit(bvCle(), "vue"); if (S.user) { S.user.user_metadata = Object.assign({}, S.user.user_metadata, { bienvenue_vue: true });
      try { if (sb.auth && sb.auth.updateUser) sb.auth.updateUser({ data: { bienvenue_vue: true } }).catch(() => {}); } catch (x) {} }
    const c = b.closest(".v-bv"); if (!c) return; c.style.maxHeight = c.offsetHeight + "px"; c.offsetHeight; c.classList.add("parti");
    setTimeout(() => c.remove(), 450); }, true);

  VUES.acc = () => { const f = dom(vAcc()), now = new Date(), prenom = S.profil.prenom || "", salon = (S.profil && S.profil.nom_salon) || "votre salon";
    const ai = f.querySelector(".ai-b"), dem = [...f.querySelectorAll(".k")].find(k => /Pour bien démarrer/.test(k.textContent));
    const notif = f.querySelector('[data-su="notif-oui"]'), caisse = f.querySelector('[data-su="acc-caisse"]'), vide = f.querySelector(".vide2");
    const libres = [...f.querySelectorAll('[data-su="libre"]')].map(b => ({ m: b.dataset.m, t: ((b.parentElement.querySelector("div") || {}).firstChild || {}).textContent || "" }));
    const auj = S.rdv.filter(r => memeJour(new Date(r.debut), now) && r.statut !== "annule").sort((a, b) => a.debut.localeCompare(b.debut)), cli = auj.filter(r => r.cliente_id);
    const ici = cli.find(r => new Date(r.debut) <= now && new Date(r.fin) > now && r.statut === "prevu");
    const proch = cli.find(r => r !== ici && new Date(r.fin) > now && new Date(r.debut) > now && r.statut === "prevu");
    const nouv = clocheListe(now), vu = clocheVu(), nonvu = nouv.filter(x => new Date(x.t) > vu).length;
    let h = `<div class="v-haut v-haut-acc">${etoiles("acc")}<div class="tete"><div><h1 style="--n:${(JOURS[(now.getDay() + 6) % 7] + " " + now.getDate() + " " + MOIS[now.getMonth()]).length}">${JOURS[(now.getDay() + 6) % 7]} <em>${now.getDate()} ${MOIS[now.getMonth()]}</em></h1></div><div class="v-btns"><button class="ai-b v-cloche${nonvu ? " sonne" : ""}" data-v-cloche aria-label="Réservations en ligne${nonvu ? " : " + nonvu + " nouvelle" + (nonvu > 1 ? "s" : "") : ""}">${CLOCHE}${nonvu ? `<span class="v-badge">${nonvu}</span>` : ""}</button>${ai ? ai.outerHTML : ""}</div></div>`;
    h += bienvenue();
    h += annivHaut(now, salon);
    if (proch) { const d = new Date(proch.debut), mn = Math.round((d - now) / 60000), tel = (proch.clientes && proch.clientes.telephone || "").replace(/\s/g, "");
      h += `<div class="v-prochain" data-rdv="${proch.id}"><div class="v-lab">Prochaine cliente</div><div class="v-grand"><b>${hh(d)}</b></div><div class="v-rond" data-debut="${esc(proch.debut)}" data-depuis="${new Date(Math.max(...cli.filter(r => r !== proch && r.statut !== "annule" && new Date(r.fin) <= d).map(r => +new Date(r.fin)), +d - 2 * 3600000)).toISOString()}" aria-label="dans ${mn >= 60 ? duree(mn) : mn + " min"}"><svg viewBox="0 0 100 100" aria-hidden="true"><g class="tr">${Array.from({ length: 24 }, (_, i) => { const a = i / 24 * 2 * Math.PI, s = Math.sin(a), c = Math.cos(a), r2 = i % 6 ? 41.5 : 39.8; return `<line class="${i % 6 ? "" : "g"}" x1="${(50 + 45 * s).toFixed(2)}" y1="${(50 - 45 * c).toFixed(2)}" x2="${(50 + r2 * s).toFixed(2)}" y2="${(50 - r2 * c).toFixed(2)}"/>`; }).join("")}</g><path class="p"/><circle class="bl" r="3.6"/></svg><div class="t"><b></b><small></small></div></div>
        <div class="v-cli"><span class="v-av">${esc(((proch.clientes && proch.clientes.prenom) || nomRdv(proch) || "?")[0].toUpperCase())}</span><div>${esc(nomRdv(proch))}<small>${esc(titreRdv(proch))}${proch.prix ? " · " + euros(proch.prix) : ""}</small></div></div>
        ${tel ? `<div class="v-actions"><button class="v-btn" data-href="tel:${esc(tel)}">Appeler</button><button class="v-btn plein" data-href="sms:${esc(tel)}">Message</button></div>` : ""}</div>`; }
    h += "</div>";
    if (cli.length) { const tot = cli.filter(r => r.statut !== "absente").reduce((s, r) => s + (+r.prix || 0), 0), fin = new Date(Math.max(...cli.map(r => +new Date(r.fin))));
      h += `<div class="v-chiffres"><div><b>${cli.length}</b><span>rendez-vous</span></div><div><b>${euros(Math.round(tot)) || "0 €"}</b><span>prévus</span></div><div><b>${hFin(fin)}</b><span>fin de journée</span></div></div>`; }
    if (dem) { const c = dem.nextElementSibling; h += dem.outerHTML + (c ? c.outerHTML : ""); }
    if (ici) h += `<div class="k">En ce moment au salon</div><div class="v-maint" data-rdv="${ici.id}"><span class="v-pulse"></span><div>${esc(nomRdv(ici))}<small>${esc(titreRdv(ici))}</small></div><div class="v-jq">jusqu’à<br>${hh(new Date(ici.fin))}</div></div>`;
    if (libres.length) h += `<div class="k">Encore libre aujourd’hui</div><div class="v-creneaux">${libres.map(l => `<button class="v-cr" data-su="libre" data-m="${l.m}"><b>${esc(l.t.replace(/(\d+)h(\d\d)/g, "$1:$2"))}</b><span>+ Rendez-vous</span></button>`).join("")}</div>`;
    /* 24/11 nuit (Marie : « une fois ma journée passée, ça sert plus à rien… écris "pour demain" ») : journée finie → les clientes de demain */
    let liste = auj, titre = "Toute la journée", videDemain = false;
    { const HO = ((S.site && S.site.donnees && S.site.donnees.horaires) || ((typeof brouillon === "function" && brouillon()) || {}).horaires || [])[(now.getDay() + 6) % 7],
        mnH = t => +String(t).slice(0, 2) * 60 + +String(t).slice(3, 5), nowM = now.getHours() * 60 + now.getMinutes(),
        ferme = HO && HO.f ? mnH(HO.f) : null, der = cli.length ? Math.max(...cli.map(r => +new Date(r.fin))) : null;
      const finie = (der == null || +now >= der) && (ferme != null ? nowM >= ferme : der != null || HO === null);
      if (finie) { const dm = plusJours(new Date(now.getFullYear(), now.getMonth(), now.getDate()), 1), vus = new Map();
        (S.tous || []).concat(S.rdv || []).forEach(r => vus.set(r.id, r));
        liste = [...vus.values()].filter(r => memeJour(new Date(r.debut), dm) && r.statut !== "annule" && !(window.__estVerrou && __estVerrou(r)))
          .map(r => r.clientes || !r.cliente_id ? r : Object.assign({}, r, { clientes: S.clientes.find(c => c.id === r.cliente_id) })).sort((x, y) => x.debut.localeCompare(y.debut));
        titre = `Demain · ${JOURS[(dm.getDay() + 6) % 7].toLowerCase()} ${dm.getDate()}`; videDemain = !liste.length; } }
    h += `<div class="k">${esc(titre)} <a data-go="ag">Agenda ›</a></div>`;
    if (videDemain) h += `<div class="blanche vide2"><div class="t"><b>Pas de rendez-vous demain</b><span>Les réservations de ton site arrivent ici toutes seules.</span></div></div>`;
    else if (liste.length) { const auj = liste, L = S.accTout ? auj : auj.slice(0, 5);
      h += `<div class="liste v-liste">${L.map(r => { const d = new Date(r.debut), passe = new Date(r.fin) <= now || r.statut === "fini" || r.statut === "absente";
        return `<div class="v-l${passe ? " passe" : ""}${r.cliente_id ? "" : " bloc"}" data-rdv="${r.id}"><span class="v-h">${hh(d)}</span><div class="v-t">${esc(nomRdv(r))}${r.source === "en_ligne" ? '<span class="v-pastille">en ligne</span>' : ""}<small>${esc(titreRdv(r)) || (r.cliente_id ? "" : "Créneau bloqué")}${r.statut === "absente" ? " · pas venue" : ""}</small></div>${r.prix ? `<span class="v-p">${euros(r.prix)}</span>` : ""}</div>`; }).join("")}
        ${auj.length > 5 ? `<button class="acc-plus" data-su="acc-plus">${S.accTout ? "Voir moins" : "Voir les " + (auj.length - 5) + " autres rendez-vous"}</button>` : ""}</div>`; }
    else if (vide) h += vide.outerHTML;
    /* 25/11 (Marie) : les anniversaires ne sont plus en bas, ils sont tout en haut, au-dessus de « Prochaine cliente » (voir annivHaut) */
    if (caisse) { const on = caisse.classList.contains("on");
      h += `<div class="k">Ma caisse</div><div class="liste v-liste"><div class="v-l"><div class="v-t">Noter ce que j’encaisse<small>${on ? "Pratique si on te paie en espèces" : "Arrêtée : active-la pour suivre tes encaissements"}</small></div><button class="sw${on ? " on" : ""}" data-su="acc-caisse" aria-label="Utiliser la caisse"></button><button class="v-x" data-su="acc-caisse-x" aria-label="Masquer">×</button></div></div>`; }
    if (notif) h += notif.closest(".acc-caisse").outerHTML;
    return h; };

  /* ---------- 5 · Agenda ---------- */
  const vAg = VUES.ag, MOIS_C = ["janv.", "févr.", "mars", "avr.", "mai", "juin", "juil.", "août", "sept.", "oct.", "nov.", "déc."];
  VUES.ag = () => { const f = dom(vAg()), te = f.querySelector(".tete"), j = S.jour, L = S.lundi, F = plusJours(L, 6);
    const zone = te && te.lastElementChild && te.lastElementChild.tagName === "DIV" && te.lastElementChild.querySelector("button") ? te.lastElementChild : null;
    if (zone) { zone.removeAttribute("style"); zone.className = "v-ronds";
      zone.querySelectorAll(":scope>button").forEach(b => { if (b.dataset.a === "nouveau") return b.remove(); if (b.classList.contains("su-auj2")) return; b.removeAttribute("style"); b.classList.add("v-rondb"); });
      const aj = zone.querySelector(".su-auj2"); if (aj) zone.prepend(aj);   /* « Aujourd’hui » à gauche des deux ronds (Marie, 17/11) */
      const cg = zone.querySelector('[data-su="conges"]'); if (cg) cg.setAttribute("aria-label", "Bloquer un moment (congés)");
      const mo = zone.querySelector('[data-a="mois"]'); if (mo) mo.setAttribute("aria-label", "Choisir une date"); }
    const sm = te && te.querySelector("small"); if (sm) sm.textContent = sm.textContent.replace(/^./, c => c.toUpperCase());
    const ns = f.querySelector(".nav-sem span"); if (ns) ns.textContent = L.getMonth() === F.getMonth() ? `Du ${L.getDate()} au ${F.getDate()} ${MOIS[F.getMonth()]}` : `Du ${L.getDate()} ${MOIS[L.getMonth()]} au ${F.getDate()} ${MOIS[F.getMonth()]}`;
    if (ns && ns.parentElement.hasAttribute("data-ferme")) {
      if (L.getMonth() !== F.getMonth()) { const court = d => `${d.getDate()} ${MOIS_C[d.getMonth()]}`; ns.textContent = `Du ${court(L)} au ${court(F)}`; }   /* à cheval sur 2 mois : en court, pour tenir sur une ligne */
      ns.insertAdjacentHTML("beforeend", '<em class="v-ferme"> · Fermé ce jour</em>'); }
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
  VUES.cl = () => { const tous = S.clientes, g = GARDE[S.tri]; let h;
    if (g) { S.clientes = tous.filter(g);
      if (S.tri === "anniv") S.clientes.sort((x, y) => String(x.anniversaire).slice(8, 10).localeCompare(String(y.anniversaire).slice(8, 10)));
      else S.clientes.sort((x, y) => (vis(x).der || "").localeCompare(vis(y).der || "")); }
    try { h = vCl(); } finally { S.clientes = tous; }
    const f = dom(h), te = f.querySelector(".tete");
    if (te) { const sm = te.querySelector("small"); if (sm) sm.textContent = `${tous.length} cliente${tous.length > 1 ? "s" : ""}`;
      const z = document.createElement("div"); z.className = "v-ronds"; const imp = te.querySelector('[data-s5="plusieurs"]'); if (imp) { imp.className = "v-rondb"; z.appendChild(imp); }
      z.insertAdjacentHTML("beforeend", `<button class="v-rondb plein" data-a="cli-nouv" aria-label="Ajouter une cliente">${svg(IC.plus, 20)}</button>`); te.appendChild(z); }
    [...f.children].filter(x => x.matches('.btn[data-a="cli-nouv"]')).forEach(b => b.remove());
    const lab = f.querySelector("label.cherche"), row = lab && lab.parentElement;
    if (row) { row.removeAttribute("style"); row.className = "v-cherche"; const tb = row.querySelector('[data-a="tri-menu"]'); if (tb) { tb.removeAttribute("style"); tb.className = "v-rondb" + (S.tri !== "az" ? " plein" : ""); }
      }
    if (g && !S.cherche.trim()) { const v = f.querySelector(".blanche.vide"); if (v) v.outerHTML = `<div class="blanche vide"><b>Personne pour l’instant</b><span>Aucune cliente dans « ${(TRIS.find(x => x[0] === S.tri) || [, ""])[1]} ».</span></div>`; }
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
      if (c && (S.tri === "az" || S.tri === "partie")) { const sp = r.querySelector(".t span"); if (sp) sp.textContent = info(c); }
      if (c && c.instagram) { const b = r.querySelector(".t b"); if (b && !b.querySelector(".v-ig")) { if (String(c.prenom || "")[0] === "@" && !c.nom) b.innerHTML = ""; /* 21/11 (Marie) : une cliente qui n'a que son Insta : pas de nom, juste « (@manon.nails) », comme les autres */
        b.insertAdjacentHTML("beforeend", `${b.innerHTML ? " " : ""}<span class="v-ig">(@${esc(c.instagram)})</span>`); } }
      if (c && S.tri === "anniv") { const sp = r.querySelector(".t span"), d = new Date(String(c.anniversaire).slice(0, 10) + "T12:00"); if (sp && !isNaN(d)) sp.textContent = "Anniversaire le " + d.getDate() + " " + MOIS[d.getMonth()]; } });
    /* 21/11 (Marie) : tout en bas, combien de clientes en tout, et combien ne sont pas revenues depuis plus de 2 mois */
    if (tous.length && !S.cherche.trim()) { const p = tous.filter(GARDE.partie).length, z = document.createElement("div"); z.className = "v-total";
      z.textContent = `Tu as ${tous.length} cliente${tous.length > 1 ? "s" : ""} au total` + (p ? `, dont ${p} pas venue${p > 1 ? "s" : ""} depuis plus de 2 mois.` : "."); f.appendChild(z); }
    enHaut(f, "cl", [te, row, f.querySelector(".v-filtres")]);
    return enTexte(f); };
  document.addEventListener("click", e => { const b = e.target.closest && e.target.closest("[data-v-f]"); if (!b) return; e.stopPropagation();
    const x = b.parentElement.scrollLeft; S.vFiltre = b.dataset.vF === "tout" ? null : b.dataset.vF; rendu(); const n = E.querySelector(".vue.on .v-filtres"); if (n) n.scrollLeft = x; }, true);
  /* les lettres sur le côté : seulement celles qui existent ; on glisse le doigt dessus */
  let IXV = null;
  /* 18/11 (Marie) : les lettres A-Z sont là dans TOUS les tris (A à Z, Vues récemment, Prochain rendez-vous…), toujours au milieu de l'écran.
     En A à Z, une lettre amène à son groupe ; dans les autres tris, à la 1re cliente de la liste dont le prénom commence par cette lettre. */
  const initiale = s => { const l = (String(s || "").trim().replace(/^@+/, "") || "#").normalize("NFD").replace(/[̀-ͯ]/g, "").charAt(0).toUpperCase(); return /[A-Z]/.test(l) ? l : "#"; };
  const cibles = () => { const v = E.querySelector('.vue.on[data-p="cl"]'); if (!v) return [];
    const gs = [...v.querySelectorAll(".v-groupe")]; if (gs.length) return gs.map(g => ({ el: g, l: g.id.slice(2) === "0" ? "#" : g.id.slice(2) }));
    return [...v.querySelectorAll(".cli[data-cli]")].map(el => { const c = S.clientes.find(x => x.id === el.dataset.cli); return { el, l: initiale(c ? c.prenom || c.nom : (el.querySelector(".t b") || el).textContent) }; }); };
  const brancheIdx = ix => { const va = y => { const sp = [...ix.children]; if (!sp.length) return; const r = ix.getBoundingClientRect(), i = Math.max(0, Math.min(sp.length - 1, Math.floor((y - r.top) / (r.height / sp.length))));
      const l = sp[i].dataset.l, cs = cibles(), cle = z => z === "#" ? "[" : z, vu = E.querySelector(".vue.on");
      const ci = cs.find(z => z.l === l) || (E.querySelector('.vue.on[data-p="cl"] .v-groupe') ? cs.find(z => cle(z.l) >= cle(l)) || cs[cs.length - 1] : null);
      if (ci && vu) vu.scrollTop += ci.el.getBoundingClientRect().top - vu.getBoundingClientRect().top - 70;
      sp.forEach((s, k) => s.classList.toggle("on", k === i)); };
    const fin = () => [...ix.children].forEach(s => s.classList.remove("on"));
    ix.addEventListener("touchstart", e => { e.preventDefault(); va(e.touches[0].clientY); }, { passive: false });
    ix.addEventListener("touchmove", e => { e.preventDefault(); va(e.touches[0].clientY); }, { passive: false });
    ix.addEventListener("touchend", fin); ix.addEventListener("touchcancel", fin);
    let bas = false; ix.addEventListener("mousedown", e => { bas = true; va(e.clientY); e.preventDefault(); });
    document.addEventListener("mousemove", e => { if (bas) va(e.clientY); }); document.addEventListener("mouseup", () => { if (bas) { bas = false; fin(); } }); };
  const indexLettres = () => { const v = E.querySelector('.vue.on[data-p="cl"]');
    if (!IXV || !IXV.isConnected) { if (!E.querySelector(".ong")) return; IXV = document.createElement("div"); IXV.className = "v-idx"; IXV.setAttribute("aria-hidden", "true"); E.appendChild(IXV); brancheIdx(IXV); }
    const cs = cibles(), on = !!v && cs.length > 0; IXV.hidden = !on; if (!on) return;
    const ls = [...new Set(cs.map(z => z.l))], tout = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").concat(ls.includes("#") ? ["#"] : []), cle = ls.sort().join("");
    if (IXV.dataset.k !== cle) { IXV.dataset.k = cle; IXV.innerHTML = tout.map(l => `<span data-l="${l}"${ls.includes(l) ? "" : ' class="x"'}>${l}</span>`).join(""); }
    /* 18/11 (Marie : « tout en haut, A et B sont sur “Anniversaire ce mois” ») : les lettres restent au milieu de la place libre
       entre les filtres (quand on est tout en haut) et la barre du bas ; elles ne bougent pas quand on fait défiler, et se serrent si l'écran est petit */
    const er = E.getBoundingClientRect(), fl = v.querySelector(".v-filtres"), o = E.querySelector(".ong");
    const haut = fl ? fl.getBoundingClientRect().bottom + v.scrollTop - er.top + 10 : 120, bas = (o ? o.getBoundingClientRect().top : er.bottom) - er.top - 10;
    const n = IXV.children.length || 1, lh = Math.max(9, Math.min(15, (bas - haut - 16) / n));
    IXV.style.top = Math.round((haut + bas) / 2) + "px"; IXV.style.setProperty("--lh", lh.toFixed(1) + "px"); };

  /* 18/11 : les visites du mois de son site (une lecture toutes les 5 minutes au plus) */
  let VIS = null, VIS_T = 0;
  const visites = () => { if (window.SB_DEMO) return { visite: 312, reserver: 48, src: { google: 140, instagram: 61 } };
    if (Date.now() - VIS_T > 300000) { VIS_T = Date.now(); const d = new Date(), de = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-01`;
      sb.rpc("mes_visites", { depuis: de }).then(({ data, error }) => { if (error || !Array.isArray(data)) return; const o = { visite: 0, reserver: 0, src: {} };
        data.forEach(x => { o[x.quoi] = (o[x.quoi] || 0) + +x.n; if (x.quoi === "visite") o.src[x.source] = (o.src[x.source] || 0) + +x.n; });
        const avant = JSON.stringify(VIS); VIS = o; if (avant !== JSON.stringify(o) && S.onglet === "si" && !E.classList.contains("fe")) rendu(); }).catch(() => {}); }
    return VIS; };
  /* ---------- 7 · Mon site ---------- */
  const LIG = { style: IC.style, perso: IC.perso, charms: IC.charms, "ms-presta": IC.presta, "ms-photos": IC.photos, "ms-salon": IC.salon, "ms-horaires": IC.horloge, "ms-adresse": IC.adresse, "ms-apropos": IC.apropos, "ms-photo": IC.moi, "ms-bon": IC.bon, "ms-legal": IC.bon, bio: IC.lien, site: IC.globe };
  const icones = () => E.querySelectorAll('.vue.on[data-p="si"] .ligne').forEach(l => { const k = l.dataset.v || l.dataset.a; if (LIG[k] && !l.querySelector(".v-ico")) l.insertAdjacentHTML("afterbegin", `<span class="v-ico">${svg(LIG[k])}</span>`); });
  new MutationObserver(() => { if (S.onglet === "si") icones(); }).observe(E, { childList: true, subtree: true });
  const vSi = VUES.si;
  VUES.si = () => { const f = dom(vSi()), b = brouillon() || {}, s = S.site, te = f.querySelector(".tete"), now = new Date();
    if (te) { const sm = te.querySelector("small"), h1 = te.querySelector("h1"); if (sm) sm.innerHTML = s && s.en_ligne ? `<span class="v-enligne">En ligne</span> · ${esc(s.slug)}` : "Pas encore en ligne"; if (h1) h1.textContent = "Mon site"; }
    const ap = f.querySelector(".ms2-apercu");
    if (ap) { const ph = (ap.querySelector(".ms2-photo") || { style: {} }).style.backgroundImage || "", nom = b.nom || S.profil.nom_salon || "Mon salon";
      const nv = dom(`<div class="v-apercu"><div class="v-img" data-ms2="voir" role="button" aria-label="Voir mon site"><div class="v-nomsite">${esc(nom)}</div></div><div class="v-bas"><div class="v-voir" data-ms2="voir">Voir mon site<small>Comme tes clientes le voient</small></div>${s && s.en_ligne ? '<button class="v-btn" data-v-partage>Partager</button>' : ""}</div></div>`);
      if (ph && !/url\(["']?["']?\)/.test(ph)) nv.querySelector(".v-img").style.backgroundImage = ph; else nv.querySelector(".v-img").classList.add("sans");
      ap.replaceWith(nv); }
    const pe = f.querySelector('.btn[data-ms2="nouveau"]'); if (pe) { pe.removeAttribute("style"); pe.classList.add("v-large"); }
    const chiffres = [], resa = (S.tous || []).filter(r => r.source === "en_ligne" && r.cree_le && new Date(r.cree_le).getMonth() === now.getMonth() && new Date(r.cree_le).getFullYear() === now.getFullYear()).length;
    if (s) chiffres.push([resa, "réservation" + (resa > 1 ? "s" : "") + " en ligne ce mois"]);
    if (b.note) chiffres.push([String(Math.round(b.note * 10) / 10).replace(".", ","), "sur Google" + (b.nbAvis ? " · " + b.nbAvis + " avis" : "")]);
    if (s && s.en_ligne && visites() && chiffres.length && /réservation/.test(chiffres[0][1])) chiffres.shift();   /* les réservations sont dans « Ce mois sur ton site » : pas deux fois */
    if (chiffres.length && pe) pe.insertAdjacentHTML("afterend", `<div class="v-chiffres v-c${chiffres.length}">${chiffres.map(c => `<div><b>${c[0]}</b><span>${c[1]}</span></div>`).join("")}</div>`);
    /* 18/11 (Marie : « Visites ce mois », version maison) : le chemin du mois — visites → « Réserver » → réservations, et d'où viennent les visites.
       Compté sans cookie par le site public (serveur/sql/22-visites.sql) ; ici on lit seulement les chiffres de SON site. */
    if (s && s.en_ligne && pe) { const V = visites(); const c = f.querySelector(".v-chiffres") || pe;
      if (V) { const src = [["google", "Google"], ["instagram", "Instagram"], ["tiktok", "TikTok"], ["facebook", "Facebook"]].map(x => [V.src[x[0]] || 0, x[1]]).filter(x => x[0]).sort((x, y) => y[0] - x[0]).slice(0, 2);
        c.insertAdjacentHTML("afterend", `<div class="v-chemin"><div class="v-ch-k">Ce mois sur ton site</div><div class="v-ch-l"><div><b>${V.visite}</b><span>visite${V.visite > 1 ? "s" : ""}</span></div><i>›</i><div><b>${V.reserver}</b><span>ont touché « Réserver »</span></div><i>›</i><div><b>${resa}</b><span>réservation${resa > 1 ? "s" : ""}</span></div></div>${V.visite ? (src.length ? `<div class="v-ch-s">dont ${src.map(x => x[0] + " venue" + (x[0] > 1 ? "s" : "") + (/^[AEIOU]/.test(x[1]) ? " d’" : " de ") + x[1]).join(" · ")}</div>` : "") : `<div class="v-ch-s">Les visites se comptent depuis le 18 novembre.</div>`}</div>`); } }
    f.querySelectorAll(".ligne").forEach(l => { const k = l.dataset.v || l.dataset.a; if (LIG[k] && !l.querySelector(".v-ico")) l.insertAdjacentHTML("afterbegin", `<span class="v-ico">${svg(LIG[k])}</span>`);
      if (k === "perso") { const sp = l.querySelector(".t span"); if (sp) sp.textContent = sp.textContent.replace(/^La forme, le fond, les couleurs, l’écriture · /, ""); } });
    enHaut(f, "si", [te, f.querySelector(".v-apercu"), pe]);
    return enTexte(f); };
  document.addEventListener("click", async e => { const p = e.target.closest && e.target.closest("[data-v-partage]"); if (!p) return; e.stopPropagation();
    const st = S.site; if (!st || !st.en_ligne || !st.slug) return dit("Mets d’abord ton site en ligne");
    const url = lienDuSite(st),   /* 18/11 : la page du salon (son nom et sa photo dans l'aperçu du lien) */ nom = (brouillon() || {}).nom || S.profil.nom_salon || "Mon site";
    if (navigator.share) { try { await navigator.share({ title: nom, url }); return; } catch (x) { if (x && x.name === "AbortError") return; } }
    try { await navigator.clipboard.writeText(url); dit("Lien copié ✓"); } catch (x) { dit("Impossible de copier, réessaie"); } }, true);

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
        <div class="v-fid-b">${fait} sur ${n} · encore ${reste} visite${reste > 1 ? "s" : ""} pour ${esc(cad)}</div></div><div class="v-fid-leg">Exemple : la carte que voit ta cliente</div></div>`); }
    enHaut(f, "re", [te]);
    return enTexte(f); };
  document.addEventListener("click", e => { const t = e.target.closest && e.target.closest("[data-v-t]");
    if (t) { e.stopPropagation(); if (t.dataset.vT === teinte().id) return; ecrit("loginail-appli-teinte", t.dataset.vT); poseTeinte(); rendu();
      try { E.animate([{ opacity: .55 }, { opacity: 1 }], { duration: 260, easing: "ease-out" }); } catch (x) {} return; }
    const bb = e.target.closest && e.target.closest("[data-v-ban]");
    if (bb) { e.stopPropagation(); const on = !ban(); ecrit("loginail-appli-bandeau", on ? "oui" : "non");
      if (on && !fondDuSite()) dit("Choisis d’abord un fond pour ton site, dans Mon site");
      else if (on) prepareFond().then(() => { if (FOND.nom !== fondDuSite()) dit("Ton fond ne peut pas encore s’afficher dans l’appli"); });
      rendu(); } }, true);

  /* ---------- 9 · après chaque dessin : le bouton « + » de l'agenda, le bandeau, les lettres ---------- */
  let FAB = null;
  const fab = () => { if (!E.querySelector(".ong")) return;
    if (!FAB || !FAB.isConnected) { FAB = document.createElement("button"); FAB.className = "v-fab"; FAB.dataset.a = "nouveau"; FAB.setAttribute("aria-label", "Nouveau rendez-vous"); FAB.innerHTML = svg(IC.plus, 20); E.appendChild(FAB); }
    FAB.hidden = S.onglet !== "ag"; };
  const r0 = rendu;
  /* 18/11 (Marie : « l'agenda ne doit bouger ni en haut ni en bas ») : le haut et la barre du bas restent en place, seules les heures défilent.
     On garde l'endroit où elle en était ; la 1re fois, on se place juste avant maintenant (ou avant le 1er rendez-vous). */
  E.addEventListener("scroll", e => { const p = e.target; if (p.classList && p.classList.contains("pap")) S.papY = p.scrollTop; }, true);
  /* 18/11 (Marie, version C « le mix », choisie après la table ronde) : la journée de la prothésiste remplit l'écran toute seule.
     Une heure fait entre 40 px (minimum lisible) et 60 px ; 9 h – 18 h tient sans glisser sur un iPhone. Un rendez-vous court tient sur une ligne
     (heure de début · prestation), et un espace en bas pour que le « + » ne cache jamais le dernier rendez-vous. */
  const ajuste = p => { if (p.dataset.k) return; const n = p.querySelectorAll(".pl").length / 2 || 1, place = p.clientHeight - (parseFloat(getComputedStyle(p).paddingBottom) || 50);   /* la place laissée sous le « + » */
    /* 22/11 : un jour avec un rendez-vous de moins de 30 min, une heure fait 72 px (15 min = une ligne lisible) */
    const prs = [...p.querySelectorAll(".pr")], debuts = prs.filter(x => !x.classList.contains("barre")).map(x => parseFloat(x.style.top)), court = prs.some(x => parseFloat(x.style.height) < R - .1);
    const k = court ? 72 / 60 : Math.max(40 / 60, Math.min(1, place / (n * 60))); p.dataset.k = k.toFixed(3); p.style.setProperty("--plh", (R * k).toFixed(2) + "px");
    p.querySelectorAll(".pr,.v-now").forEach(x => { const t0 = parseFloat(x.style.top), h0 = parseFloat(x.style.height);
      if (!isNaN(t0)) x.style.top = (t0 * k).toFixed(1) + "px";
      if (!isNaN(h0)) { const libre = Math.min(Infinity, ...debuts.filter(v => v > t0 + .1).map(v => (v - t0) * k));   /* 22/11 : jamais agrandi par-dessus le suivant */
        const h = Math.max(h0 * k, Math.min(24, libre)); x.classList.toggle("v-mini", h < 22); x.style.height = h.toFixed(1) + "px";
        if (x.classList.contains("pr") && h < 42) { x.classList.add("v-une"); const st = x.querySelector("strong"); if (st) st.textContent = st.textContent.replace(/^\s*(\d{1,2}:\d{2})\s*[–—-]\s*\d{1,2}:\d{2}/, "$1"); } } }); };
  window.__agAjuste = ajuste;   /* pour la journée voisine (jour-glisse.js) */
  const heures = () => { const p = E.querySelector('.vue.on[data-p="ag"] .pap'); if (!p) return; ajuste(p);
    if (S.papY == null) { const n = p.querySelector(".v-now"), r = p.querySelector(".pr"); S.papY = Math.max(0, (n ? n.offsetTop - 90 : r ? r.offsetTop - 30 : 0)); }
    p.scrollTop = S.papY; };
  rendu = function () { r0.apply(this, arguments); try { fab(); bandeau(); indexLettres(); heures(); } catch (e) { console.warn(e); } };

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
#E .v-ban{position:absolute;left:0;right:0;top:0;height:calc(max(42px,env(safe-area-inset-top) + 20px) + 96px);overflow:hidden;z-index:0;pointer-events:none;-webkit-mask-image:linear-gradient(180deg,#000 62%,transparent);mask-image:linear-gradient(180deg,#000 62%,transparent)}
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
#E .v-bv{position:relative;z-index:1;background:#fff;border-radius:24px;padding:20px 18px 16px;margin:18px 0 4px;box-shadow:0 18px 40px -26px color-mix(in srgb,var(--v-acc) 70%,#000);overflow:hidden;transition:opacity .22s ease,transform .22s ease,max-height .3s ease .12s,margin .3s ease .12s,padding .3s ease .12s;animation:vBvMonte .45s cubic-bezier(.2,.8,.2,1) .15s both}
#E .v-bv-t{font:500 26px/1.1 'Cormorant Garamond',Georgia,serif;color:var(--v-fonce)}#E .v-bv-t em{font-style:italic;color:var(--v-acc)}
#E .v-bv p{font-size:13.5px;color:#776D64;margin:6px 0 12px;line-height:1.45}
#E .v-bv-it{display:flex;align-items:center;gap:12px;padding:8px 0;font-size:14px;line-height:1.3;animation:vBvVient .35s ease both}
#E .v-bv-it small{display:block;font-size:12px;color:#776D64;margin-top:1px}#E .v-bv .v-ico{width:34px;height:34px;border-radius:11px}
#E .v-bv-it:nth-of-type(1){animation-delay:.45s}#E .v-bv-it:nth-of-type(2){animation-delay:.55s}#E .v-bv-it:nth-of-type(3){animation-delay:.65s}#E .v-bv-it:nth-of-type(4){animation-delay:.75s}
#E .v-bv-ok{display:block;width:100%;height:44px;border-radius:14px;border:0;background:var(--v-fonce);color:#fff;font:inherit;font-size:14px;margin-top:12px;cursor:pointer;transition:transform .12s}#E .v-bv-ok:active{transform:scale(.97)}
#E .v-bv.calme,#E .v-bv.calme .v-bv-it{animation:none}
#E .v-bv.parti{opacity:0;transform:scale(.96);max-height:0!important;margin:0;padding-top:0;padding-bottom:0}
@keyframes vBvMonte{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:none}}@keyframes vBvVient{from{opacity:0;transform:translateX(-8px)}to{opacity:1;transform:none}}
@media (prefers-reduced-motion:reduce){#E .v-bv,#E .v-bv-it{animation:none}}
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
#E .ong.o1{left:0!important;right:0!important;bottom:0!important;height:auto;min-height:84px;border-radius:0;padding:3px max(6px,calc((100% - 560px)/2)) calc(max(24px,env(safe-area-inset-bottom)) + 5px);background:color-mix(in srgb,var(--v-c) 88%,transparent)!important;-webkit-backdrop-filter:blur(18px) saturate(1.4);backdrop-filter:blur(18px) saturate(1.4);box-shadow:none;border-top:1px solid var(--v-trait);transform:none!important;opacity:1!important;align-items:flex-start}
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
#E .v-prochain{background:#fff;border-radius:24px;padding:20px;margin-top:20px;box-shadow:0 18px 40px -26px rgba(120,40,55,.45);cursor:pointer;position:relative}
/* 25/11 (Marie, idée A) : le grand rond du temps qui reste avant la prochaine cliente ; plein à 1 h ou plus, il se vide ; sous 10 min, rouge et il bat */
#E .v-rond{position:absolute;top:18px;right:18px;width:88px;height:88px;pointer-events:none}
#E .v-rond svg{width:100%;height:100%;overflow:visible}
#E .v-rond .tr line{stroke:color-mix(in srgb,var(--v-acc) 16%,#fff);stroke-width:2;stroke-linecap:round}#E .v-rond .tr line.g{stroke:color-mix(in srgb,var(--v-acc) 28%,#fff);stroke-width:2.6}
#E .v-rond .p{fill:none;stroke:color-mix(in srgb,var(--v-acc) 62%,#fff);stroke-width:4.5;stroke-linecap:round;transition:stroke .6s}
#E .v-rond .bl{fill:#fff;stroke:color-mix(in srgb,var(--v-acc) 62%,#fff);stroke-width:2.4;transition:stroke .6s}
#E .v-rond .t{position:absolute;inset:0;display:grid;place-content:center;text-align:center;line-height:1}
#E .v-rond .t b{font:500 29px/1 'Cormorant Garamond',Georgia,serif;font-variant-numeric:lining-nums}#E .v-rond .t b.h{font-size:23px}#E .v-rond .t small{display:block;font-size:11px;color:var(--gris);margin-top:2px}#E .v-rond .t small:empty{display:none}
#E .v-rond.vite .p,#E .v-rond.vite .bl{stroke:#E58A8A}#E .v-rond.vite{animation:vRond 2.4s ease-in-out infinite}
@keyframes vRond{50%{transform:scale(1.03)}}
@media (prefers-reduced-motion:reduce){#E .v-rond.vite{animation:none}}
#E .v-prochain .v-cli{padding-right:4px}
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
#E .v-chiffres.v-c2{grid-template-columns:repeat(2,1fr)}
#E .v-chemin{background:#fff;border:1px solid var(--v-trait);border-radius:18px;padding:12px 14px 11px;margin:4px 0 6px}
#E .v-ch-k{font-size:12px;color:var(--gris);margin-bottom:6px}
#E .v-ch-l{display:flex;align-items:flex-start;gap:6px}#E .v-ch-l>div{flex:1;min-width:0}
#E .v-ch-l b{display:block;font:500 22px/1.1 'Cormorant Garamond',Georgia,serif;font-variant-numeric:lining-nums;color:var(--v-encre)}#E .v-ch-l span{display:block;font-size:11.5px;color:var(--gris);line-height:1.3}
#E .v-ch-l i{font-style:normal;color:var(--v-acc);opacity:.6;padding-top:3px}
#E .v-ch-s{font-size:11.5px;color:var(--gris);margin-top:7px;border-top:1px solid var(--v-trait);padding-top:7px}#E .v-chiffres.v-c1{grid-template-columns:1fr}
#E .v-chiffres div{padding:0 4px;min-width:0}
#E .v-chiffres div+div{border-left:1px solid var(--v-trait);padding-left:16px}
#E .v-chiffres b{display:block;font:500 28px/1.1 'Cormorant Garamond',Georgia,serif;font-variant-numeric:lining-nums;white-space:nowrap}
#E .v-chiffres span{font-size:12.5px;color:var(--gris)}
#E .v-maint{display:flex;align-items:center;gap:12px;padding:14px 16px;border-radius:18px;background:#fff;border:1px solid var(--v-trait);font-size:15px;cursor:pointer}
#E .v-pulse{width:8px;height:8px;border-radius:50%;background:#3D8B66;box-shadow:0 0 0 4px rgba(61,139,102,.15);flex:none;animation:vPulse 2s ease-in-out infinite}
@keyframes vPulse{50%{box-shadow:0 0 0 7px rgba(61,139,102,.06)}}
#E .v-jq{margin-left:auto;font-size:12.5px;color:var(--gris);text-align:right}
#E .v-creneaux{display:flex;gap:8px;overflow-x:auto;scrollbar-width:none;margin:0 -22px;padding:0 22px 2px;scroll-snap-type:x proximity;scroll-padding-inline:22px}#E .v-creneaux::after{content:"";flex:none;width:14px}
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
#E .vue.on[data-p="ag"]{display:flex;flex-direction:column;overflow:hidden;padding-bottom:calc(env(safe-area-inset-bottom) + 96px)}
#E .vue[data-p="ag"]>*{flex:none}
#E .vue[data-p="ag"]>.pap{flex:1 1 auto;min-height:120px;overflow-y:auto;overscroll-behavior:contain;-webkit-overflow-scrolling:touch;scrollbar-width:none}
#E .vue[data-p="ag"]>.pap::-webkit-scrollbar{display:none}
/* 18/11 (Marie, version 1 « douce ») : Clientes et Mon site écrits un peu plus petit, titres à la taille de l'agenda.
   La case « Chercher » garde 16 px dans la saisie (en dessous, l'iPhone zoome tout l'écran quand on tape). */
#E .vue:is([data-p="cl"],[data-p="si"]) .tete h1{font-size:30px}
#E .vue:is([data-p="cl"],[data-p="si"]) .tete small,#E .vue[data-p="si"] .v-enligne{font-size:12px}
#E .vue:is([data-p="cl"],[data-p="si"]) .v-haut{padding-bottom:12px}
#E .vue[data-p="cl"] label.cherche{height:42px;font-size:14px}
#E .vue[data-p="cl"] .v-rondb,#E .vue[data-p="cl"] [data-a="tri-menu"]{width:40px!important;height:40px!important}
#E .vue[data-p="cl"] .v-filtres button{height:30px;font-size:12.5px;padding:0 13px}
#E .vue[data-p="cl"] .v-lettre{font-size:17px;height:auto;margin-bottom:4px}
#E .vue[data-p="cl"] .cli{padding-top:9px;padding-bottom:9px;min-height:0}
#E .vue[data-p="cl"] .cli .av{width:34px;height:34px;font-size:13px}
#E .vue[data-p="cl"] .cli .t b{font-size:14.5px}#E .vue[data-p="cl"] .cli .t span{font-size:12px}
#E .vue[data-p="cl"] .cli .fl{font-size:15px}
#E .vue[data-p="si"] .v-img{height:150px}#E .vue[data-p="si"] .v-nomsite{font-size:24px}
#E .vue[data-p="si"] .v-bas{padding-top:10px;padding-bottom:10px}#E .vue[data-p="si"] .v-voir{font-size:14px}
#E .vue[data-p="si"] .btn{height:44px;font-size:14.5px}
#E .vue[data-p="si"] .v-chiffres b,#E .vue[data-p="si"] .v-chiffres strong{font-size:24px}#E .vue[data-p="si"] .v-chiffres{font-size:12.5px}
#E .vue[data-p="si"] .ligne{padding-top:11px;padding-bottom:11px;min-height:0}
#E .vue[data-p="si"] .ligne .t{font-size:14.5px;height:auto;min-width:0}#E .vue[data-p="si"] .ligne .t span,#E .vue[data-p="si"] .ligne .t small{font-size:12px}
#E .vue[data-p="si"] .v-ico{width:32px;height:32px}
#E .vue[data-p="ag"] .pap{padding-bottom:50px}
#E .vue[data-p="ag"] .pap .pl{height:var(--plh,30px)}
#E .vue[data-p="ag"] .pap .pl span{font-size:11px}
#E .vue[data-p="ag"] .pap .pr{padding:4px 9px 4px 12px}
#E .vue[data-p="ag"] .pap .pr b{font-size:13px}#E .vue[data-p="ag"] .pap .pr span{font-size:11.5px}
#E .vue[data-p="ag"] .pap .pr.v-une{display:flex;flex-direction:row;align-items:center;gap:6px;white-space:nowrap;overflow:hidden;padding-top:1px;padding-bottom:1px}
#E .vue[data-p="ag"] .pap .pr.v-une b{flex:none}#E .vue[data-p="ag"] .pap .pr.v-une>span{overflow:hidden;text-overflow:ellipsis;min-width:0}
#E .vue[data-p="ag"] .pap .pr.v-mini{padding-top:0;padding-bottom:0;border-radius:7px;line-height:1;box-sizing:border-box}
#E .vue[data-p="ag"] .pap .pr.v-mini b{font-size:12px;line-height:1}#E .vue[data-p="ag"] .pap .pr.v-mini>span{font-size:11px;line-height:1}
#E .fc .chips.ch-dur{display:grid!important;grid-template-columns:repeat(4,minmax(0,1fr))!important}
#E .fc .chips.ch-dur .chip{align-items:center;text-align:center;padding:9px 2px;white-space:nowrap}
#E .vue[data-p="ag"] .tete h1{font-size:30px}
#E .vue[data-p="ag"] .tete small{font-size:12px}
#E .vue[data-p="ag"] .v-haut{padding-bottom:10px}
#E .vue[data-p="ag"] .nav-sem{margin:8px 0 4px;font-size:12px}
#E .vue[data-p="ag"] .nav-sem button{width:30px;height:30px;font-size:14px}
#E .vue[data-p="ag"] .semaine button{padding:5px 0 7px;border-radius:14px}
#E .vue[data-p="ag"] .semaine button b{font-size:19px}
#E .vue[data-p="ag"] .semaine button small{font-size:10.5px}
#E .vue[data-p="ag"] .v-haut+.k,#E .vue[data-p="ag"] .k{margin:8px 0 8px;font-size:12.5px}
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
/* 22/11 (Marie : « dans un rectangle arrondi, ça fait moche ») : en Jour, les heures vont d'un bord à l'autre et jusqu'à la barre du bas.
   L'ombre de 16 px remplit l'écart entre deux journées quand elle glisse (ECART de jour-glisse.js) : une seule longue bande. */
#E .vue[data-p="ag"]>.pap{margin:0 -22px calc(max(24px,env(safe-area-inset-bottom)) - env(safe-area-inset-bottom) - 35px);border:0;border-radius:0;padding-bottom:74px;box-shadow:0 -1px 0 #E9E5E2,16px 0 0 #fff,16px -1px 0 #E9E5E2}
/* le pouce posé sur un rendez-vous fait défiler les heures ; rester appuyée le déplace toujours (suite.js bloque alors le défilement) */
#E .vue[data-p="ag"]>.pap .pr{touch-action:pan-y}
@media (min-width:700px){html.plein #E .vue[data-p="ag"]>.pap{margin-left:0;margin-right:0;box-shadow:0 -1px 0 #E9E5E2}}
@media (min-width:1000px) and (orientation:landscape){html.plein #E .vue[data-p="ag"]>.pap{margin-left:-34px;margin-right:-34px;box-shadow:0 -1px 0 #E9E5E2,16px 0 0 #fff}}
#E .v-now{position:absolute;left:46px;right:0;height:0;border-top:1.5px solid var(--v-acc);z-index:1;pointer-events:none}
#E .v-now:before{content:"";position:absolute;left:-4px;top:-4.5px;width:7px;height:7px;border-radius:50%;background:var(--v-acc)}
#E .v-fab{position:absolute;z-index:69;right:max(20px,calc((100% - 560px)/2 + 20px));bottom:calc(max(24px,env(safe-area-inset-bottom)) + 78px);width:42px;height:42px;border-radius:50%;border:0;background:var(--v-fonce);color:#fff;display:grid;place-items:center;padding:0;cursor:pointer;box-shadow:0 14px 30px -12px rgba(42,27,30,.6);transition:transform .12s;animation:vFab .3s cubic-bezier(.3,1.4,.5,1)}
#E .v-fab[hidden]{display:none}
/* 22/11 (Marie) : le « + » à la taille des ronds du haut ; le doigt garde une zone plus large */
#E .v-fab:before{content:"";position:absolute;inset:-5px;border-radius:50%}
@media (max-width:350px){#E .v-fab{width:36px;height:36px}#E .v-fab:before{inset:-6px}}
#E .nav-sem span{white-space:nowrap}
#E .nav-sem .v-ferme{font-style:normal;font-weight:500;color:var(--v-acc)}
@media (max-width:350px){#E .vue[data-p="ag"] .nav-sem[data-ferme] span{font-size:11px}}
@keyframes vFab{from{transform:scale(.6);opacity:0}}
/* ----- Clientes ----- */
#E .v-cherche{display:flex;gap:8px;align-items:center;margin-top:18px;position:relative}
#E .cherche{height:46px;border-radius:14px;background:#fff;border:1px solid var(--v-trait);padding:0 14px;font-size:15px}
#E .v-cherche .v-rondb{width:46px;height:46px}
#E .v-filtres{display:flex;gap:8px;margin:14px -22px 0;padding:0 22px;overflow-x:auto;scrollbar-width:none}
#E .v-filtres::-webkit-scrollbar{display:none}
#E .v-ig{font-weight:400;font-size:.86em;color:var(--v-gris,#8A847E)}
#E .v-total{margin:22px 26px 8px 6px;text-align:center;font-size:13px;line-height:1.45;color:#8A847E}
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
#E .v-idx span{font-size:10px;font-weight:500;line-height:var(--lh,15px);width:16px;text-align:center;color:var(--v-acc);border-radius:50%;transition:transform .1s}
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

/* 25/11 (Marie, idée A, « un rond qui fait le temps », plus doux) : le cadran part de la fin de la cliente d'avant (sinon 2 h avant) et se vide jusqu'à la prochaine */
(function () {
  const pt = (r, f) => [50 + r * Math.sin(f * 2 * Math.PI), 50 - r * Math.cos(f * 2 * Math.PI)];
  const met = () => document.querySelectorAll("#E .v-rond[data-debut]").forEach(r => {
    const deb = +new Date(r.dataset.debut), dep = +new Date(r.dataset.depuis || deb - 7200000), now = Date.now(), mn = Math.max(0, Math.round((deb - now) / 60000));
    let f = Math.max(0, Math.min(1, (deb - now) / Math.max(60000, deb - dep))); if (f > .9999) f = .9999;
    const b = r.querySelector(".t b"), u = r.querySelector(".t small"), p = r.querySelector(".p"), bl = r.querySelector(".bl"), R = 43.2, [x, y] = pt(R, f);
    const t = mn >= 60 ? Math.floor(mn / 60) + "h" + (mn % 60 ? String(mn % 60).padStart(2, "0") : "") : String(mn);
    if (b.textContent !== t) b.textContent = t; b.classList.toggle("h", mn >= 60); u.textContent = mn >= 60 ? "" : "min";
    p.setAttribute("d", f > 0 ? `M50 ${50 - R} A${R} ${R} 0 ${f > .5 ? 1 : 0} 1 ${x.toFixed(2)} ${y.toFixed(2)}` : "");
    bl.setAttribute("cx", x.toFixed(2)); bl.setAttribute("cy", y.toFixed(2)); bl.style.display = f > 0 ? "" : "none";
    r.classList.toggle("vite", mn <= 10); r.setAttribute("aria-label", "dans " + (mn >= 60 ? t.replace("h", " h ") : mn + " min")); });
  new MutationObserver(() => { if (document.querySelector("#E .v-rond[data-debut] .t b:empty")) met(); }).observe(document.documentElement, { childList: true, subtree: true });
  setInterval(met, 20000); document.addEventListener("visibilitychange", () => { if (!document.hidden) met(); });
})();

/* 25/11 (Marie : « en bas on ne le voit pas ») : l'anniversaire du jour tout en haut de l'Accueil, au-dessus de « Prochaine cliente ».
   Une petite croix : « c'est bon, je l'ai vu » → la carte disparaît pour aujourd'hui (gardé dans le téléphone). Toucher la carte → réglages des SMS d'anniversaire. */
const ANV_CLE = "loginail-anniv-vu", anvJour = d => d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
function annivHaut(now, salon) {
  try { if (localStorage.getItem(ANV_CLE) === anvJour(now)) return ""; } catch (x) {}
  const md = anvJour(now).slice(5), anv = S.clientes.filter(c => c.anniversaire && String(c.anniversaire).slice(5, 10) === md); if (!anv.length) return "";
  const off = window.__annivCoupe && window.__annivCoupe(), sms = anv.filter(c => !off && c.ok_sms_anniv), noms = l => l.map(c => c.prenom || nomCli(c)).join(", ").replace(/, ([^,]*)$/, " et $1");
  const sous = off ? "SMS d’anniversaire coupés" : sms.length === anv.length ? (anv.length > 1 ? "Leur SMS part tout seul à 11 h" : "Son SMS part tout seul à 11 h") : sms.length ? `SMS à 11 h pour ${noms(sms)}` : (anv.length > 1 ? "Envoie-leur un petit mot" : "Envoie-lui un petit mot, elle va adorer");
  const ecrire = anv.filter(c => (off || !c.ok_sms_anniv) && (c.telephone || "").trim()).map(c => { const tel = c.telephone.replace(/\s/g, ""), txt = encodeURIComponent(`Joyeux anniversaire ${c.prenom || ""} ! Très belle journée de la part de ${salon}.`);
    return `<a class="anh-e" href="sms:${esc(tel)}&body=${txt}">Écrire${anv.length > 1 ? " à " + esc(c.prenom || nomCli(c)) : ""}</a>`; }).join("");
  return `<div class="anh" data-a="ms-anniv" role="button"><span class="anh-g" aria-hidden="true">🎂</span><div class="anh-t"><b>Aujourd’hui, c’est l’anniversaire de ${esc(noms(anv))}</b><small>${esc(sous)}</small>${ecrire ? `<div class="anh-es">${ecrire}</div>` : ""}</div><button type="button" class="anh-x" data-anh-x aria-label="C’est vu, enlever">×</button></div>`;
}
{ const st = document.createElement("style"); st.textContent = `
#E .anh{position:relative;display:flex;align-items:flex-start;gap:12px;margin-top:18px;padding:13px 40px 13px 13px;border-radius:20px;background:linear-gradient(135deg,#fff,color-mix(in srgb,var(--v-rose) 55%,#fff));box-shadow:0 14px 32px -26px rgba(120,40,55,.5);cursor:pointer;animation:anhIn .35s cubic-bezier(.2,.9,.3,1) both;transition:opacity .25s,transform .25s}
#E .anh-g{flex:none;width:42px;height:42px;border-radius:50%;background:#fff;display:grid;place-items:center;font-size:21px;box-shadow:0 4px 10px -6px rgba(120,40,55,.4)}
#E .anh-t{flex:1;min-width:0;padding-top:2px}#E .anh-t b{display:block;font-weight:500;font-size:15px;line-height:1.25;overflow-wrap:anywhere}#E .anh-t small{display:block;font-size:12.5px;color:#776D64;margin-top:3px}
#E .anh-es{display:flex;flex-wrap:wrap;gap:6px;margin-top:9px}
#E .anh-e{height:32px;padding:0 14px;border-radius:999px;background:var(--v-fonce,#1E1C1B);color:#fff;font-size:13px;display:inline-flex;align-items:center;text-decoration:none}
#E .anh-x{position:absolute;top:6px;right:6px;width:32px;height:32px;border:0;border-radius:50%;background:none;color:#9A9089;font-size:20px;line-height:1;padding:0;cursor:pointer;display:grid;place-items:center}
#E .anh-x:active{background:rgba(30,28,27,.06)}
#E .anh.part{opacity:0;transform:translateY(-6px) scale(.98)}
#E .anh+.v-prochain{margin-top:12px}
@keyframes anhIn{from{opacity:0;transform:translateY(6px)}}
@media (prefers-reduced-motion:reduce){#E .anh{animation:none;transition:none}}`; document.head.appendChild(st); }
document.addEventListener("click", e => { const x = e.target.closest && e.target.closest("[data-anh-x]"); if (!x) return; e.stopPropagation(); e.preventDefault();
  try { localStorage.setItem(ANV_CLE, anvJour(new Date())); } catch (z) {}
  const c = x.closest(".anh"); if (!c) return; c.style.height = c.offsetHeight + "px"; c.classList.add("part");
  setTimeout(() => { c.style.transition = "height .25s,margin .25s,padding .25s"; c.style.height = "0px"; c.style.marginTop = "0px"; c.style.paddingTop = c.style.paddingBottom = "0px"; c.style.overflow = "hidden"; }, 200);
  setTimeout(() => c.remove(), 480); }, true);
document.addEventListener("click", e => { const a = e.target.closest && e.target.closest(".anh-e"); if (a) e.stopPropagation(); }, true);
