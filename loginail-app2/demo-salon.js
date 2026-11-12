/* Loginail · le salon de démonstration (12/11, pour l'examen de l'App Store et pour montrer l'appli sans compte).
   On y entre en tapant l'adresse demo@loginail.fr sur l'écran de connexion (aucun e-mail n'est envoyé), on en sort par « Se déconnecter ».
   Tout est fictif et reste dans le téléphone : ce fichier remplace le coffre (Supabase) par une petite base en mémoire, remise à neuf à chaque ouverture. */
(function () {
  let on = false;
  try { on = localStorage.getItem("loginail-demo") === "1" || /[?&]salon-essai\b/.test(location.search); if (on) localStorage.setItem("loginail-demo", "1"); } catch (e) {}
  if (!on) return;
  const U = { id: "demo", email: "demo@loginail.fr" }, now = new Date(), iso = d => d.toISOString();
  const jour = (dj, h, m) => new Date(now.getFullYear(), now.getMonth(), now.getDate() + dj, h, m || 0);
  const P = "https://loginail.fr/loginail-site/univers-photos/cerise/";

  const prestations = [["Pose gel - Première pose", 55, 90], ["Pose gel - Remplissage", 45, 75], ["Semi-permanent mains", 30, 45], ["French", 10, 15], ["Nail art (par ongle)", 3, 10], ["Dépose", 15, 20], ["Beauté des mains", 25, 30], ["Semi-permanent pieds", 30, 45]]
    .map((p, i) => ({ id: "p" + (i + 1), nom: p[0], prix: p[1], duree_min: p[2], ordre: i, cree_le: iso(jour(-60, 9)) }));
  const clientes = [["Inès", "Moreau", "03-14", "Aime les cerises et le rouge."], ["Sarah", "Benali", "07-02", ""], ["Lina", "Rossi", "11-20", "French verte, ongles courts."], ["Jade", "Martin", "01-09", ""], ["Camille", "Leroy", "05-27", "Vient toutes les trois semaines."], ["Manon", "Garcia", "09-15", ""], ["Emma", "Petit", "12-03", "Préfère le matin."], ["Léa", "Dubois", "04-18", ""]]
    .map((c, i) => ({ id: "c" + (i + 1), prenom: c[0], nom: c[1], telephone: "06 00 00 00 0" + (i + 1), email: null, anniversaire: "1998-" + c[2], notes: c[3] || null, cree_le: iso(jour(-40 + i, 10)) }));
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
  const donnees = { source: "exemple", nom: "les Ongles de Cerise", prenom: "Chloé", rue: "12 rue Paradis", cp: "13006", ville: "Marseille", telephone: "06 00 00 00 00", placeId: "", lienGoogle: "",
    horaires: [{ d: "09:00", f: "18:00" }, { d: "09:00", f: "18:00" }, { d: "09:00", f: "18:00" }, { d: "09:00", f: "18:00" }, { d: "09:00", f: "18:00" }, { d: "09:00", f: "13:00" }, null],
    note: 5, nbAvis: 3, avis: [{ auteur: "Inès (exemple)", note: 5, texte: "Mes cerises disco brillent à chaque mouvement, je suis amoureuse !", quand: "exemple" }, { auteur: "Sarah (exemple)", note: 5, texte: "Le salon est trop beau, Chloé est adorable et super précise.", quand: "exemple" }, { auteur: "Lina (exemple)", note: 5, texte: "La french verte avec les cerises, c’est juste parfait.", quand: "exemple" }],
    photos: ["haut", "1", "2", "3", "4", "5", "salon"].map(n => ({ url: P + n + ".webp", auteurs: [] })),
    prestations: prestations.map((p, i) => ({ nom: p.nom, prix: p.prix, duree: p.duree_min, photo: P + (i % 5 + 1) + ".webp" })),
    apropos: { toilettes: false, parking: { freeParkingLot: true }, paiement: { acceptsCashOnly: true }, accessibilite: {}, animaux: null, enfants: false },
    site: "", prestationsTrouvees: true, tarifsVerifies: true, insta: "", presentation: "Moi, c’est Chloé ! Prothésiste ongulaire à Marseille, j’adore les cerises, le rouge et les ongles qui brillent. Je vous reçois dans mon petit salon, sur rendez-vous.",
    principale: 0, salon: 6, style: 1, couleur: "cerise", mode: "jour", exempleFictif: true, quiPhoto: P + "portrait.webp", adresseCachee: true, police: "seventies", nomc: "rougefonce", vif: "cerise" };
  let DB = { profils: [{ id: U.id, prenom: "Chloé", nom_salon: "les Ongles de Cerise", telephone: "06 00 00 00 00", ville: "Marseille", caisse_active: true }], prestations, clientes, rendez_vous, tickets: [],
    sites: [{ pro_id: U.id, slug: "les-ongles-de-cerise", en_ligne: true, maj: iso(jour(-1, 18)), donnees }] };

  /* ce qu'on ajoute dans la démonstration est gardé dans le téléphone jusqu'au lendemain (ou jusqu'à « Se déconnecter ») */
  const AUJ = now.toDateString(), garde = () => { try { localStorage.setItem("loginail-demo-db", JSON.stringify({ j: AUJ, DB })); } catch (e) {} };
  try { const g = JSON.parse(localStorage.getItem("loginail-demo-db") || "null"); if (g && g.j === AUJ && g.DB && g.DB.clientes) DB = g.DB; } catch (e) {}
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
  const sortir = () => { try { localStorage.removeItem("loginail-demo"); localStorage.removeItem("loginail-demo-db"); localStorage.removeItem("loginail-brouillon"); } catch (e) {} setTimeout(() => location.replace(location.pathname), 50); };
  window.SB_DEMO = {
    from: t => new Q(t),
    rpc: async n => n === "prochain_numero" ? { data: ++numero, error: null } : { data: null, error: null },
    auth: { getSession: async () => ({ data: { session: { user: U } }, error: null }), onAuthStateChange: () => ({ data: { subscription: { unsubscribe() {} } } }),
      signOut: async () => { sortir(); return { error: null }; }, signInWithOtp: async () => ({ error: null }), verifyOtp: async () => ({ data: { session: { user: U } }, error: null }) }
  };
})();
