/* ===== 22/11 (Marie : « si je veux juste supprimer un rendez-vous, je fais comment ? », puis « Oui, code-le ») =====
   Annuler = prévenir la cliente. Supprimer = effacer une erreur de saisie, sans message pour elle.
   Tout est relu dans le coffre au moment de la question, puis au moment du « Oui » :
   - encaissé : jamais (ticket de caisse), même annulé ensuite ;
   - acompte payé : à venir → annuler d'abord ; passé → on le garde (preuve) ;
   - réservé en ligne, à venir → annuler d'abord ;
   - le reste → effacé après une question (SMS de rappel déjà parti et liste d'attente : on le dit).
   Un rendez-vous annulé garde son « Supprimer le créneau ». Les blocs et vacances ont leur fiche (gestes-2111.js). */
(function () {
  const st = document.createElement("style");
  st.textContent = `#E .fc .petits.sr-p{flex-wrap:wrap;row-gap:4px}
#E .fc .petits .sr-b{flex-basis:100%;min-height:44px;text-decoration:none;color:#A04A4A;font-size:14px}
#E .fc .petits .sr-b:active{opacity:.55}
@media (prefers-reduced-motion:reduce){#E .sr-conf{animation:none}}`;
  document.head.appendChild(st);

  new MutationObserver(() => {
    const s = E.querySelector('.fc .petits [data-a="statut"]'); if (!s) return;
    const z = s.closest(".petits"); if (z.querySelector(".sr-b")) return;
    z.classList.add("sr-p");
    z.insertAdjacentHTML("beforeend", `<button class="sr-b" data-sr="demande" data-id="${esc(s.dataset.id)}">Supprimer le rendez-vous</button>`);
  }).observe(document.body, { childList: true, subtree: true });

  const rate = () => dit("Oups, ça n’a pas marché. Réessaie.");
  const lit = async id => {
    const [a, b] = await Promise.all([sb.from("rendez_vous").select("*").eq("id", id), sb.from("tickets").select("id").eq("rendez_vous_id", id).limit(1)]);
    if (a.error || b.error || !a.data) throw a.error || b.error || new Error("lecture");
    return { r: a.data[0], ticket: !!(b.data && b.data.length) };
  };
  const regle = ({ r, ticket }) => {
    const futur = new Date(r.debut) > new Date();
    if (ticket) return "ticket";
    if (r.acompte_paye) return futur ? "acompte" : "acompte-passe";
    return futur && r.source === "en_ligne" ? "en-ligne" : "oui";
  };
  /* facultatif : si la liste ne se lit pas, la suppression reste possible */
  const attendue = async r => {
    if (new Date(r.debut) - Date.now() <= 36e5) return false;
    try {
      const jour = new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Paris" }).format(new Date(r.debut));
      const { data } = await sb.from("liste_attente").select("id").eq("jour", jour).limit(1);
      return !!(data && data.length);
    } catch (e) { return false; }
  };
  const question = (z, r, cas, attente) => {
    const c = (S.clientes || []).find(x => x.id === r.cliente_id), p = esc(String((c && c.prenom) || "").trim()), elle = p || "Ta cliente";
    const de = !p ? "de cette cliente" : /^[aeiouyhàâéèêëîïôöùûü]/i.test(p) ? `d’${p}` : `de ${p}`;
    const d = new Date(r.debut), futur = d > new Date();
    const quand = esc(`${d.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" })} à ${hm(d)}`);
    const fort = t => `<br><strong class="an-sans">${t}</strong>`;
    let titre, info, oui = "", non = "Non, le garder";
    if (cas === "oui") {
      titre = `Supprimer le rendez-vous ${de}&nbsp;?`;
      info = "Il disparaît de ton agenda et de sa fiche.";
      if (futur) info += fort(r.rappel_envoye ? "Le SMS de rappel est déjà parti : préviens-la toi-même." : `${elle} ne reçoit aucun message.`);
      if (attente) info += "<br>Ta liste d’attente sera prévenue qu’une place se libère.";
      oui = `<button class="an-oui" data-sr="oui" data-id="${esc(r.id)}">Oui, supprimer</button>`;
    } else if (cas === "en-ligne" || cas === "acompte") {
      titre = cas === "acompte" ? `${elle} a payé un acompte` : `${elle} a réservé en ligne`;
      info = (cas === "acompte" ? "Annule d’abord le rendez-vous, pour appliquer ta règle d’acompte." : `Si tu le supprimes sans rien dire, ${elle} risque de venir. Annule-le d’abord.`) + " Tu pourras le supprimer ensuite.";
      oui = `<button class="an-oui" data-sr="annuler" data-id="${esc(r.id)}">Annuler le rendez-vous</button>`;
    } else {
      titre = cas === "ticket" ? "Ce rendez-vous est encaissé" : "Un acompte a été payé";
      info = cas === "ticket" ? "Il a un ticket de caisse : il ne peut pas être supprimé." : "On garde ce rendez-vous : c’est la trace de l’acompte.";
      non = "D’accord";
    }
    const avant = z.parentElement.querySelector(".sr-conf"); if (avant) avant.remove();
    z.style.display = "none";
    z.insertAdjacentHTML("afterend", `<div class="an-conf sr-conf" role="alert"><b>${titre}</b><span>${quand}<br>${info}</span><div class="an-bts an-col">${oui}<button class="an-non" data-sr="non">${non}</button></div></div>`);
    const f = z.closest(".feuille"), q = z.nextElementSibling;
    const bas = q.getBoundingClientRect().bottom + 16 - Math.min(f.getBoundingClientRect().bottom, innerHeight);
    if (bas > 0) f.scrollBy({ top: bas, behavior: matchMedia("(prefers-reduced-motion:reduce)").matches ? "auto" : "smooth" });
  };

  let enCours = false;
  document.addEventListener("click", async e => {
    if (!e.target.closest) return;
    const creneau = e.target.closest('.fc [data-a="rdv-suppr"]:not([data-sr-ok])'), a = creneau || e.target.closest(".fc [data-sr]");
    if (!a) return;
    e.stopPropagation(); e.preventDefault();
    const k = creneau ? "creneau" : a.dataset.sr, id = a.dataset.id, q = a.closest(".sr-conf"), z = q ? q.previousElementSibling : a.closest(".petits");
    if (k === "non") { z.style.display = ""; q.remove(); return; }
    if (k === "annuler") {   /* la question « Annuler » de D83 (suite.js), même si le rendez-vous était marqué fini */
      z.style.display = ""; q.remove();
      let b = z.querySelector('[data-s="annule"]');
      if (!b) { b = document.createElement("button"); b.hidden = true; Object.assign(b.dataset, { a: "statut", s: "annule", id }); z.appendChild(b); }
      b.click(); return;
    }
    if (enCours) return;
    enCours = true; a.disabled = true;
    const mot = a.textContent; if (k === "oui") a.textContent = "Suppression…";
    const la = () => a.isConnected && E.classList.contains("fe");   /* la fiche a pu être fermée pendant la lecture */
    try {
      const lu = await lit(id), r = lu.r;
      if (!r) { ferme(); await chargeSemaine(); await chargeVisites(); rendu(); return dit("Ce rendez-vous était déjà supprimé"); }
      if (k === "creneau") {
        if (!la()) return;
        if (lu.ticket) return question(z, r, "ticket");
        a.disabled = false; a.dataset.srOk = "1"; a.click(); delete a.dataset.srOk; return;
      }
      const cas = regle(lu);
      if (k === "demande" || cas !== "oui") {
        const attente = cas === "oui" && await attendue(r);
        if (la()) question(z, r, cas, attente);
        return;
      }
      /* seulement s'il n'a pas changé depuis la lecture (annulé par la cliente, déplacé sur un autre appareil) */
      const { data, error } = await sb.from("rendez_vous").delete().eq("id", id).eq("statut", r.statut).eq("debut", r.debut).select("id");
      if (error) return rate();
      if (!data || !data.length) { ferme(); await chargeSemaine(); rendu(); return dit("Ce rendez-vous vient de changer : regarde-le avant"); }
      for (const l of ["rdv", "tous", "cloche"]) if (S[l]) S[l] = S[l].filter(x => x.id !== id);
      ferme(); rendu(); dit("Rendez-vous supprimé ✓");
      try { await chargeSemaine(); await chargeVisites(); rendu(); } catch (x) {}   /* effacé : un réseau coupé ici n'est pas un échec */
    } catch (x) { rate(); }
    finally { enCours = false; if (a.isConnected) { a.disabled = false; if (k === "oui") a.textContent = mot; } }
  }, true);
})();
