/* Loginail · le salon de démonstration (12/11, pour l'examen de l'App Store et pour montrer l'appli sans compte).
   On y entre en tapant l'adresse demo@loginail.fr sur l'écran de connexion (aucun e-mail n'est envoyé), on en sort par « Se déconnecter ».
   Tout est fictif et reste dans le téléphone : ce fichier remplace le coffre (Supabase) par une petite base en mémoire, remise à neuf à chaque ouverture. */
(function () {
  let on = false;
  const PARCOURS = /[?&]parcours/.test(location.search);   /* une nouvelle prothésiste, depuis le tout début */
  try { on = PARCOURS || localStorage.getItem("loginail-demo") === "1" || /[?&]salon-essai\b/.test(location.search); if (on && !PARCOURS) localStorage.setItem("loginail-demo", "1"); } catch (e) {}
  if (!on) return;
  const U = { id: "demo", email: "demo@loginail.fr" }, now = new Date(), iso = d => d.toISOString();
  const jour = (dj, h, m) => new Date(now.getFullYear(), now.getMonth(), now.getDate() + dj, h, m || 0);
  const P = "https://loginail.fr/loginail-site/univers-photos/cerise/";

  const prestations = [["Pose gel - Première pose", 55, 90], ["Pose gel - Remplissage", 45, 75], ["Semi-permanent mains", 30, 45], ["French", 10, 15], ["Nail art (par ongle)", 3, 10], ["Dépose", 15, 20], ["Beauté des mains", 25, 30], ["Semi-permanent pieds", 30, 45]]
    .map((p, i) => ({ id: "p" + (i + 1), nom: p[0], prix: p[1], duree_min: p[2], ordre: i, cree_le: iso(jour(-60, 9)) }));
  const clientes = [["Inès", "Moreau", "03-14", "Aime les cerises et le rouge."], ["Sarah", "Benali", "07-02", ""], ["Lina", "Rossi", "11-20", "French verte, ongles courts."], ["Jade", "Martin", "01-09", ""], ["Camille", "Leroy", "05-27", "Vient toutes les trois semaines."], ["Manon", "Garcia", "09-15", ""], ["Emma", "Petit", "12-03", "Préfère le matin."], ["Léa", "Dubois", "04-18", ""], ["Alice", "Bernard", "01-01", ""], ["Anaïs", "Roux", "02-08", ""], ["Chloé", "Fournier", "03-15", ""], ["Clara", "Girard", "04-22", ""], ["Diane", "Bonnet", "05-02", ""], ["Elsa", "Lambert", "06-09", ""], ["Eva", "Fontaine", "07-16", ""], ["Fanny", "Mercier", "08-23", ""], ["Gaëlle", "Blanc", "09-03", ""], ["Hélène", "Guerin", "10-10", ""], ["Inaya", "Faure", "11-17", ""], ["Julie", "Andre", "12-24", ""], ["Kenza", "Chevalier", "01-04", ""], ["Laura", "Robin", "02-11", ""], ["Louise", "Masson", "03-18", ""], ["Maëlys", "Sanchez", "04-25", ""], ["Marine", "Henry", "05-05", ""], ["Mila", "Perrin", "06-12", ""], ["Nina", "Morin", "07-19", ""], ["Océane", "Mathieu", "08-26", ""], ["Pauline", "Clement", "09-06", ""], ["Rose", "Gauthier", "10-13", ""], ["Salomé", "Dumont", "11-20", ""], ["Sofia", "Lopez", "12-27", ""], ["Tess", "Fontaine", "01-07", ""], ["Victoire", "Muller", "02-14", ""], ["Yasmine", "Lefevre", "03-21", ""], ["Zoé", "Roussel", "04-01", ""], ["Agathe", "Nicolas", "05-08", ""], ["Bérénice", "Brun", "06-15", ""], ["Céline", "Picard", "07-22", ""], ["Ophélie", "Lucas", "08-02", ""]]
    .map((c, i) => ({ id: "c" + (i + 1), ok_sms_anniv: i === 2, prenom: c[0], nom: c[1], telephone: "06 00 00 " + String(10 + i).padStart(2, "0") + " " + String(31 + i).padStart(2, "0"), email: null, anniversaire: "1998-" + c[2], notes: c[3] || null, cree_le: iso(jour(-40 + i, 10)) }));
  /* 13/11 : dans le salon d'essai, 2 clientes ont leur anniversaire aujourd'hui (Lina a dit oui au SMS, Manon non) */
  { const t = new Date(), md = String(t.getMonth() + 1).padStart(2, "0") + "-" + String(t.getDate()).padStart(2, "0"); clientes[2].anniversaire = "1998-" + md; clientes[5].anniversaire = "1995-" + md; }
  const rendez_vous = []; let k = 0;
  for (let dj = -3; dj <= 5; dj++) {
    if (jour(dj, 12).getDay() === 0) continue;   /* fermé le dimanche */
    [[9, 0], [10, 45], [14, 0], [15, 30], [17, 15]].forEach((h, n) => {
      if ((dj + n + 30) % 4 === 0) return;   /* quelques trous dans la journée */
      const c = clientes[k % clientes.length], p = prestations[(k * 3 + n) % 4], deb = jour(dj, h[0], h[1]), fin = new Date(deb.getTime() + p.duree_min * 60000), enLigne = k % 5 === 2;
      rendez_vous.push({ id: "r" + (++k), cliente_id: c.id, prestation_id: p.id, titre: p.nom, debut: iso(deb), fin: iso(fin), prix: p.prix,
        statut: fin < now ? (k % 11 === 0 ? "absente" : "fini") : "prevu", source: enLigne ? "en_ligne" : null, acompte: enLigne ? 10 : null, acompte_paye: false,
        cree_le: iso(enLigne && deb > now ? new Date(now.getTime() - 5 * 3600000) : jour(dj - 6, 11)) });
    });
  }
  /* deux clientes pas revenues depuis longtemps (pour « À relancer ») et quelques rendez-vous du mois dernier (pour le bilan) */
  [["Chloé", "Bernard", 52], ["Nina", "Lopez", 75]].forEach((c, i) => { const id = "c" + (9 + i); clientes.push({ id, prenom: c[0], nom: c[1], telephone: "06 00 00 00 1" + i, email: null, anniversaire: null, notes: null, cree_le: iso(jour(-120, 10)) });
    [c[2], c[2] + 24].forEach(j => { const p = prestations[1], deb = jour(-j, 10, 0); rendez_vous.push({ id: "r" + (++k), cliente_id: id, prestation_id: p.id, titre: p.nom, debut: iso(deb), fin: iso(new Date(deb.getTime() + p.duree_min * 60000)), prix: p.prix, statut: "fini", source: null, acompte: null, acompte_paye: false, cree_le: iso(jour(-j - 7, 11)) }); }); });
  for (let j = 20; j <= 40; j += 4) { const c = clientes[j % 8], p = prestations[j % 3], deb = jour(-j, 14, 0); rendez_vous.push({ id: "r" + (++k), cliente_id: c.id, prestation_id: p.id, titre: p.nom, debut: iso(deb), fin: iso(new Date(deb.getTime() + p.duree_min * 60000)), prix: p.prix, statut: "fini", source: null, acompte: null, acompte_paye: false, cree_le: iso(jour(-j - 5, 11)) }); }
  const donnees = { fidelite: { on: true, n: 10, cadeau: "−10 €" }, source: "exemple", nom: "les Ongles de Cerise", prenom: "Chloé", rue: "12 rue Paradis", cp: "13006", ville: "Marseille", telephone: "06 00 00 00 00", placeId: "", lienGoogle: "",
    horaires: [{ d: "09:00", f: "18:00" }, { d: "09:00", f: "18:00" }, { d: "09:00", f: "18:00" }, { d: "09:00", f: "18:00" }, { d: "09:00", f: "18:00" }, { d: "09:00", f: "13:00" }, null],
    note: 5, nbAvis: 3, avis: [{ auteur: "Inès (exemple)", note: 5, texte: "Mes cerises disco brillent à chaque mouvement, je suis amoureuse !", quand: "exemple" }, { auteur: "Sarah (exemple)", note: 5, texte: "Le salon est trop beau, Chloé est adorable et super précise.", quand: "exemple" }, { auteur: "Lina (exemple)", note: 5, texte: "La french verte avec les cerises, c’est juste parfait.", quand: "exemple" }],
    photos: ["haut", "1", "2", "3", "4", "5", "salon"].map(n => ({ url: P + n + ".webp", auteurs: [] })),
    prestations: prestations.map((p, i) => ({ nom: p.nom, prix: p.prix, duree: p.duree_min, photo: P + (i % 5 + 1) + ".webp" })),
    apropos: { toilettes: false, parking: { freeParkingLot: true }, paiement: { acceptsCashOnly: true }, accessibilite: {}, animaux: null, enfants: false },
    site: "", prestationsTrouvees: true, tarifsVerifies: true, insta: "", presentation: "Moi, c’est Chloé ! Prothésiste ongulaire à Marseille, j’adore les cerises, le rouge et les ongles qui brillent. Je vous reçois dans mon petit salon, sur rendez-vous.",
    principale: 0, salon: 6, style: 1, couleur: "cerise", mode: "jour", exempleFictif: true, quiPhoto: P + "portrait.webp", adresseCachee: true, police: "seventies", nomc: "rougefonce", vif: "cerise", fond: "Cœurs chrome rubis sur fond ivoire" };
  /* ?dix : pour voir l'accueil avec beaucoup de rendez-vous aujourd'hui */
  if (/[?&]dix/.test(location.search)) [[11, 30], [12, 15], [13, 0], [13, 45], [16, 30], [18, 0], [8, 30]].forEach((h, n) => { const c = clientes[10 + n], p = prestations[n % 4], deb = jour(0, h[0], h[1]); rendez_vous.push({ id: "r" + (++k), cliente_id: c.id, prestation_id: p.id, titre: p.nom, debut: iso(deb), fin: iso(new Date(deb.getTime() + p.duree_min * 60000)), prix: p.prix, statut: "prevu", source: "appli", acompte: null, cree_le: iso(jour(-2, 10)) }); });
  let DB = { profils: [{ id: U.id, prenom: "Chloé", nom_salon: "les Ongles de Cerise", telephone: "06 00 00 00 00", ville: "Marseille", caisse_active: true }], prestations, clientes, rendez_vous, tickets: [],
    sites: [{ pro_id: U.id, slug: "les-ongles-de-cerise", en_ligne: true, maj: iso(jour(-1, 18)), donnees }] };

  /* ce qu'on ajoute dans la démonstration est gardé dans le téléphone jusqu'au lendemain (ou jusqu'à « Se déconnecter ») */
  const AUJ = now.toDateString(), garde = () => { if (PARCOURS || /[?&]salon-neuf/.test(location.search)) return; try { localStorage.setItem("loginail-demo-db5", JSON.stringify({ j: AUJ, DB })); } catch (e) {} };
  const NEUF = PARCOURS || /[?&]salon-neuf/.test(location.search); if (NEUF) { DB.prestations = []; DB.clientes = []; DB.rendez_vous = []; DB.sites = []; DB.profils[0].nom_salon = ""; if (PARCOURS) { DB.profils[0].prenom = ""; DB.profils[0].ville = ""; DB.profils[0].telephone = ""; } try { localStorage.removeItem("loginail-brouillon"); } catch (e) {} }
  try { const g = NEUF ? null : JSON.parse(localStorage.getItem("loginail-demo-db5") || "null"); if (g && g.j === AUJ && g.DB && g.DB.clientes && !/[?&]dix/.test(location.search)) DB = g.DB; } catch (e) {}
  let nid = 1000 + Math.floor(Math.random() * 9e5), numero = 12; const uid = () => "d" + (++nid), copie = o => JSON.parse(JSON.stringify(o));
  const joint = (t, r) => { const o = copie(r); if (t === "rendez_vous") { const c = DB.clientes.find(x => x.id === r.cliente_id), p = DB.prestations.find(x => x.id === r.prestation_id);
    o.clientes = c ? { id: c.id, prenom: c.prenom, nom: c.nom, telephone: c.telephone } : null; o.prestations = p ? { id: p.id, nom: p.nom } : null; } return o; };
  function Q(t) { this.t = t; this.f = []; this.o = []; this.op = "select"; this.v = null; this.un = 0; }
  Q.prototype = {
    select() { return this; }, insert(v) { this.op = "insert"; this.v = v; return this; }, update(v) { this.op = "update"; this.v = v; return this; }, upsert(v) { this.op = "upsert"; this.v = v; return this; }, delete() { this.op = "delete"; return this; },
    eq(c, v) { this.f.push(r => String(r[c]) === String(v)); return this; }, neq(c, v) { this.f.push(r => String(r[c]) !== String(v)); return this; },
    gte(c, v) { this.f.push(r => r[c] >= v); return this; }, gt(c, v) { this.f.push(r => r[c] > v); return this; }, lte(c, v) { this.f.push(r => r[c] <= v); return this; }, lt(c, v) { this.f.push(r => r[c] < v); return this; },
    in(c, l) { this.f.push(r => l.includes(r[c])); return this; }, is(c, v) { this.f.push(r => (r[c] ?? null) === v); return this; },
    order(c, o) { this.o.push([c, !(o && o.ascending === false)]); return this; }, limit(n) { this.lim = n; return this; }, single() { this.un = 1; return this; }, maybeSingle() { this.un = 2; return this; },
    then(ok, ko) { let r; try { r = this.run(); } catch (e) { r = { data: null, error: { message: String(e) } }; } return Promise.resolve(r).then(ok, ko); },
    run() { const T = DB[this.t] || (DB[this.t] = []); let rows;
      if (this.op === "insert") { rows = [].concat(this.v).map(v => Object.assign({ id: uid(), cree_le: iso(new Date()) }, this.t === "rendez_vous" ? { statut: "prevu" } : {}, v)); T.push(...rows); }
      else if (this.op === "upsert") { const cle = this.t === "sites" ? "pro_id" : "id"; rows = [].concat(this.v).map(v => { const a = T.find(r => r[cle] === v[cle]); if (a) return Object.assign(a, v); const n = Object.assign({ id: uid() }, v); T.push(n); return n; }); }
      else { rows = T.filter(r => this.f.every(f => f(r))); if (this.op === "update") rows.forEach(r => Object.assign(r, this.v)); if (this.op === "delete") DB[this.t] = T.filter(r => !rows.includes(r)); }
      if (this.op !== "select") garde();
      rows = rows.map(r => joint(this.t, r));
      this.o.slice().reverse().forEach(([c, asc]) => rows.sort((a, b) => { const x = a[c] ?? "", y = b[c] ?? ""; return (x > y ? 1 : x < y ? -1 : 0) * (asc ? 1 : -1); }));
      if (this.lim) rows = rows.slice(0, this.lim);
      return { data: this.un ? rows[0] || null : rows, error: null }; }
  };
  const sortir = () => { try { localStorage.removeItem("loginail-demo"); localStorage.removeItem("loginail-demo-db5"); localStorage.removeItem("loginail-brouillon"); } catch (e) {} setTimeout(() => location.replace(location.pathname), 50); };
  const FICH = {};
  window.SB_DEMO = {
    from: t => new Q(t),
    /* 13/11 : les photos des ongles, gardées en mémoire le temps de l'essai */
    storage: { from: () => ({
      upload: async (p, b) => { FICH[p] = await new Promise(r => { const f = new FileReader(); f.onload = () => r(f.result); f.readAsDataURL(b); }); return { data: { path: p }, error: null }; },
      createSignedUrls: async ps => ({ data: ps.map(p => ({ path: p, signedUrl: FICH[p] || null })), error: null }),
      createSignedUrl: async p => ({ data: { signedUrl: FICH[p] || null }, error: null }),
      remove: async ps => { ps.forEach(p => delete FICH[p]); return { data: null, error: null }; } }) },
    functions: { invoke: async () => ({ data: { demo: true }, error: null }) },
    rpc: async n => n === "prochain_numero" ? { data: ++numero, error: null } : { data: null, error: null },
    auth: { /* on attend que toute la page soit chargée (sinon l'appli démarre avant ses modules, puisqu'ici rien ne passe par internet) */
      getSession: () => new Promise(r => { const go = () => setTimeout(() => r({ data: { session: PARCOURS ? null : { user: U } }, error: null }), PARCOURS ? 2200 : 0); document.readyState === "complete" ? go() : addEventListener("load", go); }), onAuthStateChange: () => ({ data: { subscription: { unsubscribe() {} } } }),
      signOut: async () => { if (PARCOURS) setTimeout(() => location.reload(), 50); else sortir(); return { error: null }; }, signInWithOtp: async () => ({ error: null }), verifyOtp: async () => ({ data: { session: { user: U } }, error: null }) }
  };
})();
