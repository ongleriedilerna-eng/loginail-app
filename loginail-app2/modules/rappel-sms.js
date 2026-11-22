/* ===== 22/11 (alerte reçue par Marie : un rappel SMS pas arrivé, et la prothésiste ne le savait pas ; « Oui, prépare ») =====
   L'Accueil dit quels rappels ne sont pas arrivés (ou pas confirmés) et propose d'écrire à la cliente depuis son téléphone.
   La carte part toute seule si le SMS arrive, si le rendez-vous est passé, annulé ou déplacé, ou avec « C'est fait ».
   Rien n'est renvoyé automatiquement. Si le journal ne se lit pas, l'Accueil reste comme avant.
   À charger après rappel-legal.js : cette carte passe au-dessus. */
(function () {
  const st = document.createElement("style");
  st.textContent = `#E .rs{position:relative;z-index:1;box-sizing:border-box;width:100%;margin:16px 0 4px;padding:12px 14px;border-radius:20px;background:#fff;color:var(--v-fonce);text-align:left}
#E .rs-l+.rs-l{margin-top:12px;padding-top:12px;border-top:1px solid var(--v-rose)}
#E .rs b{display:block;margin-bottom:2px;font-size:14px;font-weight:400;overflow-wrap:anywhere}
#E .rs small{display:block;font-size:12.5px;line-height:1.35;color:var(--gris);overflow-wrap:anywhere}
#E .rs-b{display:flex;flex-wrap:wrap;gap:8px;margin-top:8px}
#E .rs-b>*{box-sizing:border-box;flex:1 1 auto;display:flex;align-items:center;justify-content:center;min-height:44px;padding:0 14px;border:0;border-radius:99px;background:var(--v-rose);color:var(--v-fonce);font:inherit;font-size:13px;text-decoration:none;white-space:nowrap;cursor:pointer}
#E .rs-b>a{background:var(--v-fonce);color:#fff}
#E .rs-b>*:active{opacity:.6}`;
  document.head.appendChild(st);

  let liste = [], qui = null;
  const cle = () => `loginail-rappels-vus-${S.user && S.user.id}`;
  const vus = () => { try { return JSON.parse(localStorage.getItem(cle()) || "[]"); } catch (e) { return []; } };
  async function lit() {
    if (!S.user) return;
    const u = S.user.id;
    try {
      const j = await sb.from("sms_envois").select("id,rdv_id,etat,pour").in("etat", ["echec", "incertain", "sans_numero"]).gt("envoye_le", new Date(Date.now() - 3 * 864e5).toISOString());
      if (j.error) return;
      const l = (j.data || []).filter(x => x.rdv_id); let neuf = [];
      if (l.length) {
        const r = await sb.from("rendez_vous").select("id,debut,statut,clientes(prenom,telephone)").in("id", l.map(x => x.rdv_id));
        if (r.error) return;
        neuf = l.map(x => ({ ...x, r: (r.data || []).find(y => y.id === x.rdv_id) }))
          .filter(x => x.r && x.r.statut === "prevu" && +new Date(x.r.debut) === +new Date(x.pour))
          .sort((a, b) => a.r.debut.localeCompare(b.r.debut));
      }
      if (!S.user || S.user.id !== u) return;
      const change = qui !== u || JSON.stringify(neuf) !== JSON.stringify(liste);
      liste = neuf; qui = u;
      if (change && S.onglet === "acc" && !E.classList.contains("fe") && E.querySelector(".vue.on")) {
        const v = E.querySelector(".vue.on"), y = v.scrollTop; rendu(); v.scrollTop = y;
      }
    } catch (e) {}
  }
  /* relu avec l'agenda : à l'ouverture, au retour dans l'appli, en tirant, et chaque minute (sans faire attendre l'agenda) */
  const charge0 = chargeSemaine;
  chargeSemaine = async function () { const r = await charge0.apply(this, arguments); lit(); return r; };

  const jour = d => {
    const n = new Date(), m = new Date(n); m.setDate(n.getDate() + 1);
    return memeJour(d, n) ? "aujourd’hui" : memeJour(d, m) ? "demain" : d.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" });
  };
  const ligne = x => {
    const d = new Date(x.r.debut), c = x.r.clientes || {}, p = String(c.prenom || "").trim(), salon = (S.profil && S.profil.nom_salon) || "";
    const titre = { echec: "Rappel pas arrivé", incertain: "Rappel pas confirmé", sans_numero: "Rappel pas parti" }[x.etat];
    const aide = { echec: "Préviens ta cliente toi-même.", incertain: "On ne sait pas si le SMS est arrivé : écris-lui.", sans_numero: "Son numéro n’est pas un portable : corrige sa fiche et préviens-la." }[x.etat];
    const tel = x.etat === "sans_numero" ? "" : String(c.telephone || "").replace(/[^\d+]/g, "");
    const mot = `Bonjour${p ? " " + p : ""}, petit rappel de votre rendez-vous ${jour(d)} à ${hm(d)}${salon ? " chez " + salon : ""}. À bientôt !`;
    return `<div class="rs-l"><b>${titre}${p ? " · " + esc(p) : ""}</b><small>Rendez-vous ${esc(jour(d))} à ${hm(d)}. ${aide}</small>
      <div class="rs-b">${tel ? `<a href="sms:${esc(tel)}&amp;body=${esc(encodeURIComponent(mot))}">Lui écrire</a>` : ""}<button type="button" data-rs="${esc(x.id)}">C’est fait</button></div></div>`;
  };
  const acc0 = VUES.acc;
  VUES.acc = () => {
    const h = acc0(); if (!S.user || qui !== S.user.id) return h;
    const v = vus(), l = liste.filter(x => new Date(x.r.debut) > new Date() && !v.includes(x.id + x.etat)); if (!l.length) return h;
    const f = document.createElement("div"); f.innerHTML = h;
    const t = f.querySelector(".tete"); if (!t) return h;
    t.insertAdjacentHTML("afterend", `<div class="rs" role="status">${l.map(ligne).join("")}</div>`);
    return f.innerHTML;
  };
  document.addEventListener("click", e => {
    const b = e.target.closest && e.target.closest("[data-rs]"); if (!b) return;
    e.stopPropagation(); e.preventDefault();
    const x = liste.find(y => y.id === b.dataset.rs); if (!x) return;
    try { localStorage.setItem(cle(), JSON.stringify([...vus(), x.id + x.etat].slice(-100))); } catch (er) {}
    liste = liste.filter(y => y !== x); rendu();
  }, true);
  lit();
})();
