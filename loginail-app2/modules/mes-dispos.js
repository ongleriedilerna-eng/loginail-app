/* ===== 24/11 (Marie, D111 : « pour l'instant, on met la version G ») : le rond « Mes dispos », refait en SEMAINE =====
   Remplace la liste du 22/11 (D106). Maquette qui fait foi : maquettes/dispos-refonte-2311/g.html.
   La semaine comme l'agenda : colonnes de jours, heures libres en blocs à leur vraie place, ‹ › pour changer de semaine,
   filtres Matin / Après-midi / Sur mesure (on retouche pour enlever), rien de coché d'avance,
   UN bouton « Envoyer toute la semaine » ou « Envoyer N heures » → menu Partager du téléphone (SMS, WhatsApp, Instagram).
   RÈGLE : jamais une heure que le site refuserait. Le calcul suit loginail-creer/resa-simu.js (creneaux) et reserver() :
   pas de 30 min depuis l'ouverture, dans ses horaires, hors pause, 1 h de marge aujourd'hui, aucun chevauchement, 84 jours (le site en accepte 92).
   Si l'un des deux change, changer LIBRES ici. En plus, comme « Partager mes dispos » : deux heures proposées ne se chevauchent pas,
   et (27/11) elles se collent aux rendez-vous déjà pris (voir colle).
   26/11 (Marie : « fais voir aussi les créneaux qui sont pas libres, voir qui y a ») : les rendez-vous pris sont dessinés dans la grille
   (« Léa D. », comme l'agenda ; « Bloqué » pour un créneau bloqué), pour elle seule : jamais un prénom dans le message ni dans la story. */
(function () {
  const PAS = 30, MARGE = 60, HORIZON = 84, TRANCHE = 28, CLE = "loginail-dispos-presta", H = 38;
  const JR = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"], JC = ["lun.", "mar.", "mer.", "jeu.", "ven.", "sam.", "dim."];
  let D = null;   /* ce que montre la fenêtre */

  /* ---------- 1 · les heures libres (inchangé depuis D106) ---------- */
  const enMin = t => { const [h, m] = String(t).split(":").map(Number); return h * 60 + (m || 0); };
  const horaires = () => ((S.site && S.site.donnees) || brouillon() || {}).horaires || [];
  const ouvert = h => !!(h && h.d && h.f);
  /* 27/11 (Marie : « quelqu'un de 10h à midi, pose américaine 1h30 : ça me met 8h, alors que le mieux c'est 8h30 ») :
     les heures libres se COLLENT aux rendez-vous, pour ne pas laisser de trou. Dans chaque moment libre :
     un rendez-vous juste APRÈS (et rien de pris juste avant) → les heures finissent pile quand il commence (8h30 → 10h) ;
     sinon → elles commencent pile à la fin de ce qui précède (12h → 13h30). Toujours sur le pas de 30 min depuis l'ouverture :
     le site accepte donc chaque heure. Même calcul dans dispos.js (la story) : si l'un change, changer l'autre. */
  function colle(ouv, fin, dur, murs, rdv) {
    const B = murs.map(z => [z[0], z[1], 0]).concat(rdv.map(z => [z[0], z[1], 1])).filter(z => z[1] > ouv && z[0] < fin).sort((x, y) => x[0] - y[0]);
    const pas = Math.ceil(dur / PAS) * PAS, out = [];
    const range = (a, b, g, d) => {
      const s0 = ouv + Math.ceil((a - ouv) / PAS) * PAS, sN = ouv + Math.floor((b - dur - ouv) / PAS) * PAS;
      if (sN < s0) return;
      const n = Math.floor((sN - s0) / pas) + 1;
      for (let k = 0; k < n; k++) out.push(d && !g ? sN - (n - 1 - k) * pas : s0 + k * pas);
    };
    let cur = ouv, g = 0;
    B.forEach(z => { if (z[0] > cur) range(cur, z[0], g, z[2]); if (z[1] > cur) { cur = z[1]; g = z[2]; } else if (z[1] === cur && z[2]) g = 1; });
    if (fin > cur) range(cur, fin, g, 0);
    return out;
  }
  window.colleDispos = colle;   /* 27/11 : le « + » › « Quand ? » (plus-quand.js) colle ses heures de la même façon */
  function LIBRES(jour, dur, occ, hor, now) {
    const h = hor[(jour.getDay() + 6) % 7];
    if (!ouvert(h)) return [];
    const ouv = enMin(h.d), fin = enMin(h.f), pd = h.pd && h.pf ? enMin(h.pd) : null, pf = pd != null ? enMin(h.pf) : null;
    const deja = memeJour(jour, now) ? now.getHours() * 60 + now.getMinutes() + MARGE : -1;
    const murs = [];
    if (pd != null) murs.push([pd, pf]);
    if (deja > ouv) murs.push([ouv, deja]);
    return colle(ouv, fin, dur, murs, occ.map(z => [(z[0] - +jour) / 60000, (z[1] - +jour) / 60000]));
  }
  const dur = () => { const p = D.P[D.p]; return (p && p.duree) || 60; };
  function calcule() {
    const now = new Date(), auj = new Date(now), hor = horaires();
    auj.setHours(0, 0, 0, 0);
    D.auj = auj; D.L = [];
    for (let i = 0; i < HORIZON; i++) { const d = plusJours(auj, i); D.L.push({ d, i, t: LIBRES(d, dur(), D.occ, hor, now) }); }
  }
  const cle = (d, t) => +d + ":" + t;
  /* par tranches : au-delà de 1 000 lignes, le serveur ne rend pas tout et une heure prise semblerait libre */
  async function lit() {
    const de = new Date(); de.setHours(0, 0, 0, 0);
    const R = await Promise.all(Array.from({ length: Math.ceil(HORIZON / TRANCHE) }, (_, i) => sb.from("rendez_vous").select("id,debut,fin,statut,titre,cliente_id,clientes(prenom,nom)")
      .lt("debut", plusJours(de, (i + 1) * TRANCHE).toISOString()).gt("fin", plusJours(de, i * TRANCHE).toISOString())));
    if (R.some(r => r.error || !r.data || r.data.length >= 1000)) throw new Error("agenda illisible");
    const L = R.flatMap(r => r.data).filter(r => r.statut !== "annule"), vus = new Set();
    /* une fois chacun (un rendez-vous à cheval sur deux tranches revient deux fois) */
    return L.filter(r => { const k = r.id; if (vus.has(k)) return false; vus.add(k); return true; })
      .map(r => [+new Date(r.debut), +new Date(r.fin), r]);
  }
  /* ce qui est coché et qui n'est plus libre s'en va */
  function verifie() {
    const bon = new Set(); D.L.forEach(j => j.t.forEach(t => bon.add(cle(j.d, t))));
    let change = false;
    D.sel.forEach((v, k) => { if (!bon.has(k)) { D.sel.delete(k); change = true; } });
    return change;
  }
  async function charge() {
    const d = D, n = ++d.lecture;
    d.etat = "charge"; dessine();
    try {
      const occ = await lit();
      if (D !== d || n !== d.lecture) return;
      d.occ = occ; d.etat = "ok"; calcule(); verifie();
      /* à l'ouverture : si plus rien de libre cette semaine, on montre la suivante */
      if (!d.pret) { d.pret = true; if (!semaine().length && d.L.some(j => j.i >= 7 - (d.auj.getDay() + 6) % 7 && j.t.length)) d.wk = 1; }
    } catch (e) {
      if (D !== d || n !== d.lecture) return;
      console.error(e); d.etat = "erreur";   /* sans agenda à jour, on ne propose rien */
    }
    dessine();
  }

  /* ---------- 2 · les filtres : Matin, Après-midi, Sur mesure (« Quand est-elle libre ? ») ---------- */
  const dansReg = (t, d) => D.reg.some(r => r.j.includes((d.getDay() + 6) % 7) && t >= r.a && t + dur() <= r.b);   /* l'heure tient ENTIÈRE dans un moment */
  const garde = (t, d) => !D.f || (D.f === 1 ? t < 720 : D.f === 2 ? t >= 720 : dansReg(t, d));
  const hh = m => Math.floor(m / 60) + "h" + (m % 60 ? String(m % 60).padStart(2, "0") : "");
  const nomsJours = l => { const t = [...l].sort((a, b) => a - b); return t.length > 2 && t[t.length - 1] - t[0] === t.length - 1 ? `${JR[t[0]]}–${JR[t[t.length - 1]]}` : t.map(i => JR[i]).join(", "); };
  const resume = () => D.reg.filter(r => r.j.length).map(r => `${nomsJours(r.j)} ${hh(r.a)}–${hh(r.b)}`).join(" · ") || "rien de noté";
  const momentNeuf = () => ({ j: horaires().map((h, i) => ouvert(h) ? i : -1).filter(i => i >= 0), a: 540, b: 1140 });

  /* ---------- 3 · la semaine affichée ---------- */
  const lundi0 = () => plusJours(D.auj, -((D.auj.getDay() + 6) % 7));
  const lundi = () => plusJours(lundi0(), 7 * D.wk);
  const derniere = () => Math.floor((HORIZON - 1 + (D.auj.getDay() + 6) % 7) / 7);
  const dimanche = () => ouvert(horaires()[6]);
  const colonnes = () => { const L = [], l = lundi(); for (let i = 0; i < (dimanche() ? 7 : 6); i++) L.push(plusJours(l, i)); return L; };
  const jourL = d => D.L[Math.round((d - D.auj) / 864e5)];
  /* toutes les heures libres de la semaine affichée, filtre compris */
  const semaine = () => colonnes().flatMap(d => { const j = jourL(d); return j ? j.t.filter(t => garde(t, d)).map(t => ({ d: j.d, t })) : []; });
  const plage = () => {
    const H0 = [], H1 = []; horaires().forEach(h => { if (ouvert(h)) { H0.push(Math.floor(enMin(h.d) / 60)); H1.push(Math.ceil(enMin(h.f) / 60)); } });
    return H0.length ? [Math.min(...H0), Math.max(...H1)] : [9, 19];
  };

  /* ---------- 4 · les prestations : celles qu'elle fait le plus d'abord ---------- */
  function prestations() {
    const N = {}, depuis = Date.now() - 120 * 864e5;
    (S.tous || []).forEach(r => { if (r.cliente_id && r.titre && r.statut !== "annule" && +new Date(r.debut) > depuis) N[r.titre] = (N[r.titre] || 0) + 1; });
    return prestasDispo().map((p, i) => ({ i, nom: String(p.nom), duree: +p.duree || 60, n: N[p.nom] || 0 })).sort((a, b) => b.n - a.n || a.i - b.i);
  }

  /* ---------- 5 · le message (au « vous », D67) ---------- */
  const nomJour = d => `${JOURS[(d.getDay() + 6) % 7].toLowerCase()} ${d.getDate() === 1 ? "1er" : d.getDate()} ${MOIS[d.getMonth()]}`;
  const choisies = () => [...D.sel.values()].sort((a, b) => a.d - b.d || a.t - b.t);
  function message() {
    const l = D.sel.size ? choisies() : semaine(), G = new Map(), p = D.P[D.p];
    if (!l.length) return "";
    l.forEach(({ d, t }) => { const k = nomJour(d); G.set(k, (G.get(k) || []).concat(hh(t))); });
    const lignes = [...G].map(([j, h]) => `• ${j} à ${h.length > 1 ? h.slice(0, -1).join(", ") + " ou " + h[h.length - 1] : h[0]}`);
    return `Bonjour ! ${p ? `Pour « ${p.nom} », il` : "Il"} me reste :\n${lignes.join("\n")}\n${l.length > 1 ? "Qu’est-ce qui vous arrange ?" : "Est-ce que ça vous va ?"}`;
  }

  /* ---------- 6 · la fenêtre ---------- */
  const z = q => E.querySelector(".fc .md " + q);
  const ouverte = () => !!(D && E.classList.contains("fe") && E.querySelector(".fc .md"));
  const IC = {
    chev: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" aria-hidden="true"><path d="M4 6l4 4 4-4"/></svg>',
    env: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 15V4M7.5 8.5L12 4l4.5 4.5"/><path d="M6 12v6.5A1.5 1.5 0 0 0 7.5 20h9a1.5 1.5 0 0 0 1.5-1.5V12"/></svg>',
    sol: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2.5v2.2M12 19.3v2.2M2.5 12h2.2M19.3 12h2.2M5.3 5.3l1.6 1.6M17.1 17.1l1.6 1.6M5.3 18.7l1.6-1.6M17.1 6.9l1.6-1.6"/></svg>',
    lune: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 17h18M6.5 17a5.5 5.5 0 0 1 11 0M12 6.5v2M5 9.5l1.4 1.4M19 9.5l-1.4 1.4"/></svg>',
    story: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="6" y="2.5" width="12" height="19" rx="3"/><circle cx="12" cy="12" r="3.2"/></svg>',
    crayon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 20h4L19 9l-4-4L4 16v4z"/><path d="M13.5 6.5l4 4"/></svg>' };
  const FILTRES = [[1, "Matin", IC.sol], [2, "Après-midi", IC.lune], [3, "Sur mesure", IC.crayon]];
  const ab = d => MOISC[d.getMonth()];
  /* 26/11 : les rendez-vous de ce jour, à leur vraie place, sous les heures libres (qui ne les chevauchent jamais) */
  const quiC = r => (r.clientes ? (r.clientes.prenom ? r.clientes.prenom + ((r.clientes.nom || "").trim() ? " " + r.clientes.nom.trim()[0].toUpperCase() + "." : "") : nomCli(r.clientes)) : "") || (r.cliente_id ? "Cliente" : (r.titre || "Bloqué"));
  function pris(d, H0, H1) {
    const a0 = +d, b0 = a0 + 864e5, A = H0 * 60, B = H1 * 60;
    return D.occ.filter(o => o[2] && o[0] < b0 && o[1] > a0).map(([a, b, r]) => {
      const de = Math.max(A, (a - a0) / 6e4), fi = Math.min(B, (b - a0) / 6e4);
      if (fi <= de) return "";
      const h = (fi - de) / 60 * H - 2, nom = quiC(r), bloc = !r.cliente_id, court = !bloc && r.clientes && r.clientes.prenom ? r.clientes.prenom : nom;   /* la colonne est étroite : le prénom seul */
      return `<div class="md-pr${bloc ? " bloc" : ""}${h < 30 ? " bas" : ""}" aria-label="${esc(`Pris : ${nom}, ${hh(Math.round((a - a0) / 6e4))} – ${hh(Math.round((b - a0) / 6e4))}`)}" style="top:${(de / 60 - H0) * H}px;height:${Math.max(h, 15)}px"><b>${esc(court)}</b>${h >= 30 ? `<small>${hh(Math.round((a - a0) / 6e4))}</small>` : ""}</div>`;
    }).join("");
  }
  function grille() {
    if (D.etat === "charge" && !D.pret) return '<p class="md-vide" role="status">Je regarde ton agenda…</p>';
    if (D.etat === "erreur") return '<div class="md-vide" role="alert">Je n’arrive pas à lire ton agenda. Vérifie ta connexion.<button class="md-lien" data-md="encore">Réessayer</button></div>';
    if (!horaires().some(ouvert)) return '<p class="md-vide">Ajoute tes horaires dans Mon site : je te dirai ce qu’il te reste.</p>';
    const C = colonnes(), l = C[0], f = plusJours(lundi(), 6), [H0, H1] = plage(), hor = horaires(), dm = dur();
    const titre = l.getMonth() === f.getMonth() ? `${l.getDate()} – ${f.getDate()} ${MOIS[f.getMonth()]}` : `${l.getDate()} ${ab(l)} – ${f.getDate()} ${ab(f)}`;
    let g = `<div class="md-st"><button class="md-fl" data-md="sav" ${D.wk <= 0 ? "disabled" : ""} aria-label="Semaine d’avant">‹</button><div><b>${titre}</b><small>${D.wk === 0 ? "cette semaine" : D.wk === 1 ? "semaine prochaine" : "dans " + D.wk + " semaines"}</small></div><button class="md-fl" data-md="sap" ${D.wk >= derniere() ? "disabled" : ""} aria-label="Semaine d’après">›</button></div>`;
    g += `<div class="md-sg"><div class="md-ax">${Array.from({ length: H1 - H0 + 1 }, (_, i) => `<span style="top:${i * H}px">${H0 + i}h</span>`).join("")}</div>`;
    g += C.map(d => {
      const j = jourL(d), ferme = !j || !ouvert(hor[(d.getDay() + 6) % 7]), auj = memeJour(d, D.auj);
      const T = j ? j.t.filter(t => garde(t, d)) : [];
      return `<div class="md-cj${ferme ? " gris" : ""}"><div class="md-cjt${auj ? " auj" : ""}">${auj ? "auj." : JC[(d.getDay() + 6) % 7]}<b>${d.getDate()}</b></div><div class="md-cjc" style="height:${(H1 - H0) * H}px">${Array.from({ length: H1 - H0 }, (_, i) => `<i style="top:${i * H}px"></i>`).join("")}${pris(d, H0, H1)}${T.map(t => {
        const on = D.sel.has(cle(j.d, t));
        return `<button data-md="heure" data-j="${j.i}" data-t="${t}" class="md-bl${on ? " on" : ""}" aria-pressed="${on}" aria-label="${nomJour(d)} à ${hh(t)}" style="top:${(t / 60 - H0) * H}px;height:${Math.max(dm, PAS) / 60 * H - 2}px">${hh(t)}${dm >= 60 ? `<small>${duree(dm)}</small>` : ""}</button>`; }).join("")}</div></div>`;
    }).join("") + "</div>";
    return g;
  }
  function dessine() {
    if (!ouverte()) return;
    /* 26/11 (Marie : « sur mesure, pose américaine… faudrait plutôt mettre ça en avant ») : les prestations en puces, toujours visibles */
    const pu = z(".md-puces");
    if (pu && pu.dataset.p !== String(D.p)) { pu.dataset.p = D.p;
      pu.innerHTML = D.P.length ? D.P.map((x, i) => `<button role="tab" data-md="choix" data-i="${i}" class="${i === D.p ? "on" : ""}" aria-selected="${i === D.p}">${esc(x.nom)}<small>${duree(x.duree)}</small></button>`).join("") : '<span class="md-pt">Pour un trou d’une heure</span>';
      const on = pu.querySelector(".on"); if (on) on.scrollIntoView({ block: "nearest", inline: "center" }); }
    z(".md-filtres").innerHTML = FILTRES.map(([i, t, ic]) => `<button data-md="filtre" data-i="${i}" class="${i === D.f ? "on" : ""}" aria-pressed="${i === D.f}">${ic}<span>${t}</span></button>`).join("");
    z(".md-resume").innerHTML = D.f === 3 ? `<span>Elle est libre : ${resume()}</span><button data-md="regles">Modifier</button>` : "";
    const li = z(".md-liste"), y = li.scrollTop;
    li.innerHTML = grille(); li.scrollTop = y;
    const ok = D.etat === "ok", n = ok ? D.sel.size : 0, T = ok ? semaine().length : 0;
    z(".md-choisi").textContent = n ? choisies().map(x => `${JR[(x.d.getDay() + 6) % 7]} ${x.d.getDate()} à ${hh(x.t)}`).join("  ·  ") : !ok ? "" : T ? "Touche une heure pour choisir, ou envoie tout" : "Plus rien de libre cette semaine";
    const e = z("[data-md=envoie]");
    e.innerHTML = IC.env + (n ? `Envoyer ${n > 1 ? n + " heures" : "cette heure"}` : "Envoyer toute la semaine");
    e.disabled = !n && !T;
    z("[data-md=noter]").hidden = n !== 1;
    if (z(".md-regles.on")) regles();
  }
  /* « Quand est-elle libre ? » : les jours, puis les heures ; plusieurs moments possibles */
  function regles() {
    const opt = v => { let o = ""; for (let t = 420; t <= 1320; t += 30) o += `<option value="${t}"${t === v ? " selected" : ""}>${hh(t)}</option>`; return o; };
    z(".md-rl").innerHTML = D.reg.map((r, n) => `<div class="md-regle"><div class="md-jj">${JR.map((t, i) => `<button data-md="rj" data-n="${n}" data-i="${i}" class="${r.j.includes(i) ? "on" : ""}" aria-pressed="${r.j.includes(i)}" aria-label="${JOURS[i]}">${t[0]}</button>`).join("")}</div>
      <div class="md-hh">de <select data-n="${n}" data-c="a" aria-label="à partir de">${opt(r.a)}</select> à <select data-n="${n}" data-c="b" aria-label="jusqu’à">${opt(r.b)}</select>${D.reg.length > 1 ? `<button class="md-suppr" data-md="rx" data-n="${n}" aria-label="Enlever ce moment">×</button>` : ""}</div></div>`).join("")
      + '<button class="md-ajout" data-md="ajout">+ Ajouter un autre moment</button>';
  }
  /* 23/11 : aussi depuis la fiche d'une cliente (fiche.js, bouton « Prendre un rendez-vous ») : UNE heure (toucher une autre la remplace), « Noter le RDV » */
  window.mesDispos = un => { ouvrir(); if (un && D) D.un = true; };
  function ouvrir() {
    const P = prestations();
    let garde0 = null; try { garde0 = localStorage.getItem(CLE); } catch (e) {}
    D = { P, p: P.length ? Math.max(0, P.findIndex(p => p.nom === garde0)) : -1, f: 0, reg: [momentNeuf()], wk: 0, sel: new Map(), L: [], occ: [], auj: new Date(new Date().setHours(0, 0, 0, 0)), etat: "charge", pret: false, lecture: 0 };
    ouvre(`<div class="md"><h3>Mes dispos</h3>
      <div class="md-puces" role="tablist" aria-label="Pour quelle prestation ?"></div>
      <div class="md-filtres"></div><div class="md-resume"></div>
      <div class="md-liste"></div>
      <div class="md-bas"><p class="md-choisi" aria-live="polite"></p><button class="md-envoi" data-md="envoie"></button><button class="md-story" data-md="story">${IC.story}Partager en story</button><button class="md-noter" data-md="noter" hidden>Elle a dit oui ? Noter le RDV</button></div>
      <div class="md-regles" role="dialog" aria-label="Quand est-elle libre ?"><div class="md-rh"><h4>Quand est-elle libre ?</h4><p>Note ce qu’elle t’a dit : les jours, puis les heures.</p></div><div class="md-rl md-liste"></div><div class="md-rb"><button class="md-envoi" data-md="voir">Voir ses créneaux</button></div></div></div>`);
    charge();
  }

  function envoyer() {
    calcule();
    if (verifie()) { dessine(); return dit("Une heure n’est plus libre : regarde à nouveau"); }
    const txt = message(); if (!txt) return;
    const copie = () => {
      const fait = () => dit("Message copié ✓ Colle-le dans Instagram ou par SMS");
      try { navigator.clipboard.writeText(txt).then(fait, () => dit("Je n’arrive pas à copier le message")); } catch (e) { dit("Je n’arrive pas à copier le message"); }
    };
    /* tout de suite, dans le toucher : sur iPhone, après une attente, on n'a plus le droit d'ouvrir le menu Partager */
    if (navigator.share) { try { navigator.share({ text: txt }).catch(x => { if (!x || x.name !== "AbortError") copie(); }); return; } catch (e) {} }
    copie();
  }

  /* 26/11 (Marie : « si je swipe à gauche ou à droite ça change la semaine ») : la semaine suit le doigt, puis la suivante arrive de l'autre côté */
  function versSemaine(sens) {
    const n = Math.max(0, Math.min(derniere(), D.wk + sens)), sg = z(".md-sg");
    if (n === D.wk) { if (sg) { sg.style.transition = "transform .25s cubic-bezier(.2,.8,.2,1)"; sg.style.transform = ""; } return; }
    D.wk = n; D.sel.clear(); z(".md-liste").scrollTop = 0; dessine();
    const s2 = z(".md-sg"); if (!s2 || matchMedia("(prefers-reduced-motion:reduce)").matches) return;
    s2.style.transition = "none"; s2.style.transform = `translateX(${sens * 40}%)`; s2.style.opacity = "0"; s2.getBoundingClientRect();
    s2.style.transition = "transform .3s cubic-bezier(.2,.8,.2,1),opacity .22s"; s2.style.transform = ""; s2.style.opacity = "";
  }
  { let x0 = null, y0 = 0, dx = 0, hor = null, pid = null;
    E.addEventListener("pointerdown", e => { if (!ouverte() || !e.target.closest || !e.target.closest(".md .md-liste") || e.target.closest(".md-regles")) return; x0 = e.clientX; y0 = e.clientY; dx = 0; hor = null; pid = e.pointerId; }, true);
    E.addEventListener("pointermove", e => { if (x0 == null || e.pointerId !== pid) return; dx = e.clientX - x0; const dy = e.clientY - y0;
      if (hor == null && (Math.abs(dx) > 10 || Math.abs(dy) > 10)) hor = Math.abs(dx) > Math.abs(dy) * 1.2;
      if (!hor) return; e.preventDefault(); const sg = z(".md-sg"), bord = (D.wk <= 0 && dx > 0) || (D.wk >= derniere() && dx < 0) ? .3 : 1;
      if (sg) { sg.style.transition = "none"; sg.style.transform = `translateX(${dx * bord}px)`; } }, { capture: true, passive: false });
    const fin = e => { if (x0 == null || e.pointerId !== pid) return; const d = dx, h = hor; x0 = null; if (!h) return;
      glisse = Date.now(); versSemaine(d < -50 ? 1 : d > 50 ? -1 : 0); };
    E.addEventListener("pointerup", fin, true); E.addEventListener("pointercancel", fin, true); }
  let glisse = 0;   /* après un glisser, le « clic » qui suit ne choisit pas une heure */

  let pasDeux = 0;
  async function noter() {
    const x = choisies()[0]; if (!x || D.noteEnCours) return;
    const d = D, p = d.P[d.p], avant = { jour: S.jour, lundi: S.lundi };
    d.noteEnCours = true;
    S.jour = new Date(x.d); S.lundi = lundiDe(x.d); S.papY = null;
    try { await chargeSemaine(); }   /* « Ce créneau est déjà pris » se vérifie dans la semaine de ce jour-là */
    catch (e) { console.error(e); S.jour = avant.jour; S.lundi = avant.lundi; d.noteEnCours = false; return dit("Pas de réseau : réessaie dans un instant"); }
    d.noteEnCours = false; rendu();
    if (D !== d || !ouverte()) return;
    pasDeux = Date.now();
    feuilleNouveau(x.t);
    if (p) setTimeout(() => { const b = E.querySelector(`.fc .chips [data-np="${p.i}"], .fc .pr-z [data-np="${p.i}"]`); if (b && !b.classList.contains("on")) b.click(); }, 0);
  }

  const menu = on => { const m = z(".md-menu"); if (m) m.classList.toggle("on", on); };
  addEventListener("click", e => {
    if (!e.target.closest) return;
    /* un double toucher sur « Noter le RDV » tombait sur « Enregistrer » de la fenêtre suivante : créneau bloqué sans cliente */
    if (Date.now() - pasDeux < 700 && e.isTrusted && e.target.closest(".feuille")) { e.preventDefault(); e.stopPropagation(); return; }
    const b = e.target.closest("[data-md]");
    if (!b) { if (ouverte() && !e.target.closest(".md-menu")) menu(false); return; }
    const k = b.dataset.md;
    if (k === "ouvre" && E.querySelector(".vue.on .calm,.av-menu")) return;   /* toucher ailleurs ferme d'abord le calendrier ou le menu */
    e.preventDefault(); e.stopPropagation();
    if (k === "ouvre") return ouvrir();
    if (!ouverte()) return;
    if (k === "presta") return menu(!z(".md-menu.on"));
    menu(false);
    if (k === "encore") return charge();
    if (k === "envoie") return envoyer();
    if (k === "story") { const p = D.P[D.p]; if (window.__dispoStory) window.__dispoStory(D.wk, p && p.nom); return; }
    if (k === "noter") return noter();
    if (k === "regles") { regles(); return z(".md-regles").classList.add("on"); }
    if (k === "choix") { if (+b.dataset.i === D.p) return; D.p = +b.dataset.i; D.sel.clear(); try { localStorage.setItem(CLE, D.P[D.p].nom); } catch (x) {} if (D.etat === "ok") calcule(); }
    if (k === "filtre") {
      const i = +b.dataset.i; D.f = D.f === i ? 0 : i; D.sel.clear();
      if (D.f === 3) { dessine(); regles(); return z(".md-regles").classList.add("on"); }
    }
    if (k === "voir") { z(".md-regles").classList.remove("on"); D.sel.clear(); }
    if (k === "ajout") { D.reg.push(momentNeuf()); regles(); const l = z(".md-rl"); l.scrollTop = l.scrollHeight; return; }
    if (k === "rj") { const r = D.reg[+b.dataset.n], i = +b.dataset.i; r.j = r.j.includes(i) ? r.j.filter(x => x !== i) : r.j.concat(i); return regles(); }
    if (k === "rx") { D.reg.splice(+b.dataset.n, 1); return regles(); }
    if (k === "sav" || k === "sap") return versSemaine(k === "sap" ? 1 : -1);
    if (k === "heure") { if (Date.now() - glisse < 350) return;
      const d = D.L[+b.dataset.j].d, t = +b.dataset.t, c = cle(d, t);
      if (D.sel.has(c)) D.sel.delete(c); else { if (D.un) D.sel.clear(); D.sel.set(c, { d, t }); }
    }
    dessine();
  }, true);
  addEventListener("change", e => {
    const s = e.target.closest && e.target.closest(".md-regle select"); if (!s || !ouverte()) return;
    const r = D.reg[+s.dataset.n]; r[s.dataset.c] = +s.value;
    if (r.b <= r.a) { if (s.dataset.c === "a") r.b = Math.min(1320, r.a + 60); else r.a = Math.max(420, r.b - 60); regles(); }
  }, true);
  /* elle revient d'Instagram : une cliente a pu réserver entre-temps */
  document.addEventListener("visibilitychange", () => { if (!document.hidden && ouverte()) charge(); });

  /* ---------- 7 · le rond, à la place du calendrier ---------- */
  const ROND = '<button class="v-rondb md-rond" data-md="ouvre" aria-label="Mes dispos"><svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="4" y="5.5" width="16" height="14" rx="3"/><path d="M4 10h16M8.5 3.5v4M15.5 3.5v4"/><path class="md-coche" d="M9 14.7l2.2 2.1 4-4"/></svg></button>';
  const ag0 = VUES.ag;
  VUES.ag = () => ag0().replace(/<button[^>]*\bdata-a="mois"[^>]*>[\s\S]*?<\/button>/, ROND);

  /* la fenêtre garde sa forme jusqu'à ce qu'une autre prenne sa place (sinon elle saute en se fermant) */
  new MutationObserver(() => {
    const f = E.querySelector(".feuille"); if (!f) return;
    const on = !!f.querySelector(".fc>.md");
    if (f.classList.contains("md-f") !== on) f.classList.toggle("md-f", on);
  }).observe(E, { childList: true, subtree: true });

  const st = document.createElement("style");
  st.textContent = `#E .md-rond .md-coche{stroke:var(--v-acc);stroke-width:2}
#E .feuille.md-f{height:88%;max-height:88%;overflow:hidden;padding:12px 0 0!important;display:flex;flex-direction:column}
#E .feuille.md-f>.poig{flex:none}
#E .feuille.md-f>.fc{flex:1;min-height:0;display:flex;flex-direction:column}
#E .md{position:relative;flex:1;min-height:0;display:flex;flex-direction:column}
#E .md>:not(.md-liste){flex:none}
#E .md h3{margin:4px 58px 0 20px;font:400 30px/1.1 'Italiana','Cormorant Garamond',Georgia,serif;text-align:left}
#E .md button{font:inherit;color:inherit;border:0;background:none;padding:0;cursor:pointer;-webkit-tap-highlight-color:transparent}
#E .md-presta{display:flex;align-items:center;gap:6px;width:calc(100% - 40px);min-height:50px;margin:8px 20px 0;padding:6px 0 10px!important;border-bottom:1px solid var(--v-fonce)!important;text-align:left;font-size:17.5px!important;color:var(--gris)!important}
#E .md-presta b{font-weight:500;color:var(--v-fonce);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;min-width:0}
#E .md-presta i{font-style:normal;font-size:16px;color:var(--v-acc);white-space:nowrap}
#E .md-presta svg{flex:none;width:16px;height:16px;margin-left:auto;color:var(--v-fonce)}
#E .md-presta:disabled{cursor:default}
#E .md-menu{position:absolute;left:14px;right:14px;top:104px;z-index:5;max-height:60%;overflow-y:auto;padding:6px;border-radius:18px;background:#fff;box-shadow:0 12px 32px rgba(42,27,30,.18);opacity:0;transform:translateY(-6px);pointer-events:none;transition:opacity .18s,transform .18s}
#E .md-menu.on{opacity:1;transform:none;pointer-events:auto}
#E .md-menu button{display:flex;justify-content:space-between;align-items:center;gap:10px;width:100%;min-height:48px;padding:0 12px;border-radius:12px;font-size:15px;text-align:left}
#E .md-menu button span{flex:none;color:var(--gris);font-size:13.5px}
#E .md-menu .on{background:var(--v-rose);font-weight:500}
#E .md-puces{display:flex;gap:7px;overflow-x:auto;scrollbar-width:none;margin:10px 0 0;padding:2px 20px 4px;scroll-padding:0 20px}
#E .md-puces::-webkit-scrollbar{display:none}
#E .md-puces button{flex:none;display:flex;align-items:center;gap:5px;line-height:1;min-height:42px;padding:0 15px!important;border-radius:99px;background:#fff!important;box-shadow:0 0 0 1px rgba(30,28,27,.12);font-size:15px!important;color:var(--v-fonce)!important;white-space:nowrap;transition:background .18s,color .18s,transform .12s}
#E .md-puces button small{font-size:12.5px;color:var(--gris);transition:color .18s}
#E .md-puces button.on{background:var(--v-acc)!important;color:#fff!important;box-shadow:none}
#E .md-puces button.on small{color:rgba(255,255,255,.85)}
#E .md-puces button:active{transform:scale(.96)}
#E .md-pt{font-size:15px;color:var(--gris);padding:10px 0}
#E .md-bl{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:1px}
#E .md-bl small{font-size:10.5px;font-weight:400;opacity:.75;line-height:1}
#E .md-story{display:flex;align-items:center;justify-content:center;gap:8px;width:100%;min-height:46px;margin-top:6px;font-size:16px!important;font-weight:500!important;color:var(--v-fonce)!important}
#E .md-story svg{width:19px;height:19px}
#E .md-sg{will-change:transform}
#E .md-filtres{display:flex;gap:22px;margin:4px 20px 0}
#E .md-filtres button{display:flex;align-items:center;gap:6px;height:44px;font-size:15.5px;color:var(--gris);white-space:nowrap}
#E .md-filtres svg{width:18px;height:18px;flex:none}
#E .md-filtres .on{color:var(--v-acc);font-weight:500}
#E .md-filtres .on span{text-decoration:underline;text-decoration-thickness:1.5px;text-underline-offset:5px}
#E .md-resume{display:flex;align-items:center;gap:8px;margin:0 20px;font-size:14.5px;color:#4F4643;line-height:1.3}
#E .md-resume:empty{display:none}
#E .md-resume span{flex:1;min-width:0}
#E .md-resume button{flex:none;height:44px;padding:0 4px;color:var(--v-acc);font-weight:500;text-decoration:underline;text-underline-offset:3px}
#E .md-liste{flex:1;min-height:0;overflow-y:auto;overscroll-behavior:contain;-webkit-overflow-scrolling:touch;scrollbar-width:none;padding:0 12px 10px;border-top:1px solid var(--v-trait);touch-action:pan-y}
#E .md-liste::-webkit-scrollbar{display:none}
#E .md-st{display:flex;align-items:center;justify-content:space-between;padding:6px 0 2px}
#E .md-st div{text-align:center;line-height:1.15}
#E .md-st b{display:block;font-size:17px;font-weight:500}
#E .md-st small{color:var(--v-acc);font-size:13px}
#E .md-fl{width:44px;height:44px;border-radius:50%;font-size:26px!important;line-height:1}
#E .md-fl:disabled{opacity:.25;cursor:default}
#E .md-sg{display:flex;padding-top:4px}
#E .md-ax{position:relative;flex:none;width:28px;margin-top:44px}
#E .md-ax span{position:absolute;right:4px;transform:translateY(-50%);font-size:11px;color:#9A8F88}
#E .md-cj{flex:1;min-width:0}
#E .md-cjt{height:44px;text-align:center;font-size:12px;color:var(--gris);line-height:1.1}
#E .md-cjt b{display:block;font-size:17px;font-weight:500;color:var(--v-fonce)}
#E .md-cjt.auj,#E .md-cjt.auj b{color:var(--v-acc)}
#E .md-cj.gris .md-cjt b{color:#C9BFB9}
#E .md-cjc{position:relative;border-left:1px solid var(--v-trait)}
#E .md-cjc i{position:absolute;left:0;right:0;border-top:1px solid rgba(30,28,27,.05)}
#E .md-cj.gris .md-cjc{background:repeating-linear-gradient(135deg,rgba(30,28,27,.035) 0 6px,transparent 6px 12px)}
#E .md-bl{position:absolute;left:2px;right:2px;min-height:17px;border-radius:8px;background:var(--v-h1)!important;color:var(--v-acc)!important;font-size:13px!important;font-weight:500!important;font-variant-numeric:tabular-nums;line-height:1;overflow:hidden;transition:background .18s,color .18s,transform .12s}
#E .md-pr{position:absolute;left:2px;right:2px;display:flex;flex-direction:column;justify-content:center;gap:1px;padding:0 4px;border-radius:8px;background:#fff;box-shadow:inset 0 0 0 1px rgba(30,28,27,.10);color:var(--gris);overflow:hidden;pointer-events:none;line-height:1.05}
#E .md-pr b{font-size:11.5px;font-weight:500;color:var(--v-fonce);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
#E .md-pr small{font-size:10.5px;font-variant-numeric:tabular-nums;white-space:nowrap}
#E .md-pr.bloc{background:repeating-linear-gradient(135deg,rgba(30,28,27,.06) 0 5px,rgba(255,255,255,.7) 5px 10px);box-shadow:none}
#E .md-pr.bloc b{font-weight:400;color:var(--gris)}
#E .md-pr.bas{flex-direction:row;align-items:center}
#E .md-bl.on{background:var(--v-acc)!important;color:#fff!important}
#E .md-bl:active{transform:scale(.96)}
#E .md-vide{margin:0;padding:28px 8px 8px;color:var(--gris);font-size:14.5px;line-height:1.45;text-align:center}
#E .md-lien{display:block;width:100%;min-height:44px;margin-top:6px;color:var(--gris)!important;font-size:14px!important;text-decoration:underline;text-underline-offset:3px}
#E .md-bas{padding:10px 20px calc(env(safe-area-inset-bottom,0px) + 14px);border-top:1px solid var(--v-trait)}
#E .md-choisi{min-height:20px;margin:0 0 9px;text-align:center;font-size:14.5px;line-height:1.3;color:var(--gris)}
#E .md-envoi{display:block;width:100%;height:56px;border-radius:999px;background:var(--v-fonce)!important;color:#fff!important;font-size:17px!important}
#E .md-envoi svg{width:18px;height:18px;vertical-align:-3px;margin-right:8px}
#E .md-envoi:disabled{opacity:.35;cursor:default}
#E .md-noter{display:block;min-height:44px;margin:2px auto -8px;font-size:15px!important;color:var(--gris)!important;text-decoration:underline;text-underline-offset:3px}
#E .md-noter[hidden]{display:none}
#E .md-regles{position:absolute;inset:0;z-index:7;display:flex;flex-direction:column;border-radius:28px 28px 0 0;background:var(--v-c);transform:translateY(102%);visibility:hidden;transition:transform .32s cubic-bezier(.2,.7,.2,1),visibility 0s .32s}
#E .md-regles.on{transform:none;visibility:visible;transition:transform .32s cubic-bezier(.2,.7,.2,1)}
#E .feuille.md-f .fe-x{z-index:8}
#E .md-pour{margin:3px 58px 0 20px!important}
#E .md-rh{flex:none;padding:8px 58px 6px 20px}
#E .md-rh h4{margin:0;font:400 28px/1.05 'Italiana','Cormorant Garamond',Georgia,serif}
#E .md-rh p{margin:6px 0 0;color:var(--gris);font-size:14.5px}
#E .md-rl{padding:4px 20px;border-top:0}
#E .md-regle{padding:14px 0;border-bottom:1px solid var(--v-trait)}
#E .md-jj{display:grid;grid-template-columns:repeat(7,minmax(0,1fr));gap:4px}
#E .md-jj button{height:44px;border-radius:12px;border:1px solid rgba(30,28,27,.14)!important;font-size:16px!important;font-weight:500!important;color:var(--gris)!important;transition:background .18s,color .18s}
#E .md-jj button.on{background:var(--v-fonce)!important;border-color:var(--v-fonce)!important;color:#fff!important}
#E .md-hh{display:flex;align-items:center;gap:8px;margin-top:10px;font-size:16px}
#E .md-hh select{height:44px;padding:0 10px;border:1px solid rgba(30,28,27,.14);border-radius:12px;background:#fff;font:500 17px Jost,sans-serif;color:var(--v-fonce);-webkit-appearance:none;appearance:none}
#E .md-suppr{width:44px;height:44px;margin-left:auto;border-radius:50%;font-size:22px!important;color:var(--gris)!important}
#E .md-ajout{display:block;width:100%;height:50px;margin-top:6px;font-size:16px!important;font-weight:500!important;color:var(--v-acc)!important;text-align:left}
#E .md-rb{flex:none;padding:12px 20px calc(env(safe-area-inset-bottom,0px) + 14px);border-top:1px solid var(--v-trait)}
#E .md :is(.md-filtres button,.md-envoi,.md-fl,.md-jj button,.md-menu button):active{transform:scale(.96)}
#E .md :is(.md-filtres button,.md-envoi,.md-fl,.md-menu button){transition:color .15s,background .15s,transform .12s}
@media (max-height:700px){html.plein #E .feuille.md-f{height:calc(100% - 20px);max-height:calc(100% - env(safe-area-inset-top,0px) - 12px)}html.plein #E .md h3{font-size:26px}html.plein #E .md-presta{min-height:46px}html.plein #E .md-envoi{height:52px}}
@media (max-height:640px){#E .md-story{min-height:40px;margin-top:2px;font-size:15px!important}#E .md-choisi{min-height:0;margin-bottom:6px;font-size:13px}#E .md-bas{padding-top:8px}#E .md-puces{margin-top:6px}#E .md-puces button{min-height:38px}#E .md-filtres button{height:38px}}
@media (max-width:360px){#E .md-filtres{gap:14px}#E .md-filtres button{font-size:14.5px}}
@media (prefers-reduced-motion:reduce){#E .md button,#E .md-regles,#E .md-menu{transition:none!important}}`;
  document.head.appendChild(st);
})();
