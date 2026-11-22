/* ===== 22/11 (Marie : « j'ai passé la pose américaine à 1 h 30, le rendez-vous de Pamela est resté à 1 h ») =====
   Un rendez-vous garde sa propre heure de fin, et le site des clientes la lit pour savoir ce qui est libre.
   Après l'enregistrement d'une prestation, on montre les rendez-vous pas terminés qui n'ont plus la bonne durée : la pro choisit.
   Rien ne change sans son accord. Seule l'heure de fin bouge (ni le début, ni le prix, aucun message).
   Enregistrer une prestation sans la modifier montre aussi ceux restés en retard d'un changement plus ancien. */
(function () {
  const st = document.createElement("style");
  st.textContent = `.dr-l{display:flex;align-items:center;gap:12px;width:100%;margin-top:8px;padding:12px 14px;border:0;border-radius:18px;background:#fff;color:var(--noir);font:inherit;text-align:left;cursor:pointer}
.dr-l i{flex:none;box-sizing:border-box;width:22px;height:22px;border:1.5px solid rgba(30,28,27,.3);border-radius:50%;display:grid;place-items:center;font-style:normal;font-size:13px;color:transparent;transition:background .15s,color .15s}
.dr-l.on i{background:var(--noir);border-color:var(--noir);color:#fff}
.dr-l span{flex:1;min-width:0;overflow-wrap:anywhere}
.dr-l b{display:block;font-size:15px;font-weight:500}
.dr-l small{display:block;margin-top:2px;font-size:12.5px;line-height:1.35;color:var(--gris)}
.dr-l small strong{color:var(--noir);font-weight:500}
.dr-l[disabled]{cursor:default}.dr-l[disabled] i{opacity:.3}
.dr-l small.dr-non{color:#A04A4A}
.dr-info{margin:12px 4px 4px;font-size:12px;line-height:1.4;color:var(--gris);text-align:center}`;
  document.head.appendChild(st);

  let LISTE = [], tour = 0;
  const nomDe = v => String(v || "").trim();
  const photo = () => prestasDispo().map(p => ({ nom: nomDe(p.nom), duree: +p.duree || 60 }));
  const quand = d => `${JOURS[(d.getDay() + 6) % 7]} ${d.getDate()} ${MOIS[d.getMonth()]}`;

  /* « Pose + Nail art » → ses prestations. Un morceau inconnu ou un nom en double : on ne devine pas. */
  function prestasDuTitre(titre, noms) {
    const mots = nomDe(titre).split(" + "), out = [];
    for (let i = 0; i < mots.length;) {
      let n = mots.length;
      while (n > i && !noms.has(mots.slice(i, n).join(" + ").trim())) n--;
      if (n === i) return null;
      const p = noms.get(mots.slice(i, n).join(" + ").trim()); if (!p) return null;
      out.push(p); i = n;
    }
    return out;
  }

  /* change = [{ nom, avant }] : les prestations qu'elle vient d'enregistrer */
  async function enRetard(change) {
    const P = photo(), noms = new Map();
    P.forEach(p => noms.set(p.nom, noms.has(p.nom) ? null : p));
    change.forEach(c => { if (c.avant && !noms.has(c.avant)) noms.set(c.avant, noms.get(c.nom)); });   /* renommée en même temps */
    const { data, error } = await sb.from("rendez_vous").select("*, clientes(id,prenom,nom,telephone), prestations(id,nom)").gt("fin", new Date().toISOString()).order("debut");
    if (error) throw error;
    const tous = (data || []).filter(r => r.statut !== "annule" && !SUPP[r.id]), out = [];
    tous.forEach(r => {
      if (!r.cliente_id || r.statut !== "prevu") return;
      const l = prestasDuTitre(r.titre || r.prestations?.nom, noms);
      if (!l || !l.some(p => change.some(c => c.nom === p.nom))) return;
      const deb = new Date(r.debut), fin = new Date(r.fin), neuve = new Date(+deb + l.reduce((s, p) => s + p.duree, 0) * 60000);
      if (+neuve === +fin) return;
      const gene = neuve > fin ? tous.find(x => x.id !== r.id && new Date(x.debut) < neuve && new Date(x.fin) > deb) : null;
      out.push({ r, deb, fin, neuve, gene, on: !gene });
    });
    return out;
  }

  const bouton = () => {
    const b = E.querySelector('.fc [data-dr="ok"]'); if (!b) return;
    const n = LISTE.filter(x => x.on).length;
    b.disabled = !n; b.style.opacity = n ? "" : ".4";
    b.textContent = n > 1 ? `Mettre à jour les ${n} rendez-vous` : "Mettre à jour le rendez-vous";
  };

  function montre() {
    const n = LISTE.length, libres = LISTE.some(x => !x.gene);
    ouvre(`<h3>${n > 1 ? `${n} rendez-vous déjà pris` : "1 rendez-vous déjà pris"}</h3>
      <div class="sous">${n > 1 ? "Ils ont encore l’ancienne durée." : "Il a encore l’ancienne durée."}${!libres ? "" : n > 1 ? " On les change ?" : " On le change ?"}</div>
      ${LISTE.map((x, i) => `<button class="dr-l${x.on ? " on" : ""}" data-dr="choix" data-i="${i}" aria-pressed="${x.on}"${x.gene ? " disabled" : ""}><i>✓</i><span><b>${esc(nomRdv(x.r))}</b>
        <small>${quand(x.deb)} · ${esc(titreRdv(x.r))}</small>
        <small>${hm(x.deb)} – ${hm(x.fin)} → <strong>${hm(x.deb)} – ${hm(x.neuve)}</strong></small>
        ${x.gene ? `<small class="dr-non">Pas possible : ${esc(nomRdv(x.gene))} est à ${hm(new Date(x.gene.debut))}. Déplace d’abord l’un des deux.</small>` : ""}</span></button>`).join("")}
      ${libres ? `<div class="dr-info">L’heure d’arrivée et le prix ne changent pas. Aucun message ne part.</div>
        <button class="btn" data-dr="ok"></button><button class="btn clair" data-dr="non">Laisser comme avant</button>`
      : '<button class="btn" data-dr="non" style="margin-top:14px">J’ai compris</button>'}`);
    bouton();
  }

  async function verifie(change, n) {
    if (!change.length) return;
    const repere = E.querySelector(".fc h3");
    try {
      const l = await enRetard(change);
      /* elle est passée à autre chose pendant la lecture : on ne recouvre pas ce qu'elle fait */
      if (!l.length || n !== tour || (E.classList.contains("fe") && repere && !repere.isConnected)) return;
      LISTE = l; montre();
    } catch (e) { console.error(e); dit("Prestation enregistrée, mais je n’ai pas pu vérifier tes rendez-vous"); }
  }

  /* sur window, en premier : on note l'état d'avant, puis on laisse l'écran enregistrer comme d'habitude */
  addEventListener("click", e => {
    const b = e.target.closest && e.target.closest('[data-cs-ok="presta"],[data-a="presta-ok"],[data-lu="ok"]'); if (!b) return;
    const avant = photo(), anciennes = S.prestations, n = ++tour;
    if (b.dataset.csOk) {
      const i = +b.dataset.i, z = b.closest(".fc"), nom = nomDe(z && z.querySelector("[data-cs-nom]")?.value);
      if (i < 0 || !nom) return;
      /* D80 : la fiche envoie d'abord les photos ; on attend que ce soit vraiment enregistré */
      setTimeout(async () => { if (b.__envoi && !(await b.__envoi)) return; verifie([{ nom, avant: avant[i]?.nom }], n); });
    } else if (b.dataset.lu) {
      setTimeout(() => verifie(photo().filter((p, i) => avant[i] && avant[i].duree !== p.duree), n));
    } else {
      const p = anciennes.find(x => x.id === b.dataset.id), nom = nomDe(E.querySelector("#p-n")?.value); if (!p || !nom) return;
      let essais = 0;   /* ancien écran, sans site : il enregistre d'abord sur le serveur */
      const attend = () => { if (S.prestations !== anciennes) verifie([{ nom, avant: nomDe(p.nom) }], n); else if (++essais < 50) setTimeout(attend, 100); };
      setTimeout(attend, 100);
    }
  }, true);

  async function enregistre() {
    let faits = 0, rates = 0;
    for (const x of LISTE.filter(y => y.on)) {
      try {
        /* relu juste avant : une cliente a pu réserver en ligne pendant qu'elle choisissait */
        if (x.neuve > x.fin) {
          const { data, error } = await sb.from("rendez_vous").select("id,statut").lt("debut", x.neuve.toISOString()).gt("fin", x.r.debut);
          if (error || (data || []).some(y => y.id !== x.r.id && y.statut !== "annule")) { rates++; continue; }
        }
        const { data, error } = await sb.from("rendez_vous").update({ fin: x.neuve.toISOString() })
          .eq("id", x.r.id).eq("debut", x.r.debut).eq("fin", x.r.fin).eq("statut", "prevu").select("id");   /* seulement s'il n'a pas bougé entre-temps */
        if (error || !data || !data.length) rates++; else faits++;
      } catch (e) { console.error(e); rates++; }
    }
    LISTE = [];
    try { await chargeSemaine(); chargeVisites(); } catch (e) { console.error(e); }
    ferme(); rendu();
    dit(rates ? `${faits} mis à jour, ${rates} à revoir dans l’agenda` : faits > 1 ? `${faits} rendez-vous mis à jour ✓` : "Rendez-vous mis à jour ✓");
  }

  document.addEventListener("click", e => {
    const a = e.target.closest && e.target.closest("[data-dr]"); if (!a) return;
    e.stopPropagation(); e.preventDefault();
    if (a.disabled) return;
    if (a.dataset.dr === "choix") {
      const x = LISTE[+a.dataset.i]; if (!x) return;
      x.on = !x.on; a.classList.toggle("on", x.on); a.setAttribute("aria-pressed", x.on); bouton();
    } else if (a.dataset.dr === "non") { LISTE = []; ferme(); }
    else if (LISTE.length) { a.disabled = true; a.textContent = "Mise à jour…"; enregistre(); }
  }, true);
})();
