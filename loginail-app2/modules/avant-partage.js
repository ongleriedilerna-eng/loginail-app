/* ===== 22/11 (Marie : « Oui, code-la », maquette maquettes/idee-avant-de-partager-2211.html, D94) =====
   Avant de donner son lien la 1re fois : « As-tu encore des rendez-vous ailleurs ? »
   Non = ça partage, plus jamais demandé. Oui = couper l'ancienne réservation puis recopier, avec un rappel dans l'agenda jusqu'à « J'ai fini ».
   C'est un rappel, pas un verrou : son site prend des réservations dès sa création.
   Sa réponse est rangée dans son COMPTE (user_metadata.avant_partage) + dans le téléphone (si le réseau manque).
   À charger après vernis.js : le bandeau se pose sous le titre de la journée, agenda-vues.js le garde en semaine et en mois. */
(function () {
  const PARTAGES = '[data-v-partage],[data-a="bio"],[data-dsp="ouvre"]';
  const RANG = { encours: 1, non: 2, fini: 2 };
  const cle = () => "loginail-avant-partage-" + S.user.id;
  const demo = () => !!window.SB_DEMO;   /* le salon de démonstration ne garde rien */
  const duCompte = () => (S.user.user_metadata || {}).avant_partage || "";
  const duTel = () => { if (demo()) return ""; try { return localStorage.getItem(cle()) || ""; } catch (e) { return ""; } };
  const etat = () => { if (!S.user) return ""; const c = duCompte(), t = duTel(); return (RANG[t] || 0) > (RANG[c] || 0) ? t : c; };
  const envoie = v => { try { sb.auth.updateUser({ data: { avant_partage: v } }).then(r => { if (r && r.error) console.warn(r.error); }, e => console.warn(e)); } catch (e) { console.warn(e); } };
  const range = v => {
    S.user.user_metadata = Object.assign({}, S.user.user_metadata, { avant_partage: v });
    if (demo()) return;
    try { localStorage.setItem(cle(), v); } catch (e) {}
    envoie(v);
  };
  /* une réponse donnée sans réseau rejoint le compte à l'ouverture suivante */
  document.addEventListener("loginail-pret", () => { if (S.user && !demo() && (RANG[duTel()] || 0) > (RANG[duCompte()] || 0)) range(duTel()); });

  const st = document.createElement("style");
  st.textContent = `#E .feuille .ap .sous{padding:0 8px;text-wrap:balance}
#E .feuille .ap .btn{width:100%;margin-top:18px}
#E .feuille .ap .btn.ap-2{margin-top:10px!important;background:#fff!important;color:#2A1B1E!important;border:1px solid rgba(30,28,27,.22)!important}
#E .feuille .ap .s5-gestes{text-align:left}
#E .feuille .ap .s5-gestes li b{font-weight:600!important;color:#BE4A60!important}
#E .ap-rappel{display:flex;align-items:center;gap:10px;box-sizing:border-box;margin:0 0 10px;padding:9px 10px 9px 14px;border-radius:16px;background:#F7E6E4;font-size:14px;line-height:1.3;color:#2A1B1E;text-align:left}
#E .ap-rappel p{flex:1;min-width:0;margin:0}
#E .ap-rappel b{display:block;font-weight:500}
#E .ap-rappel small{display:block;margin-top:2px;font-size:12.5px;color:#6B5559}
#E .ap-rappel button{flex:none;min-height:44px;padding:0 16px;border:0;border-radius:999px;background:#fff;font:inherit;color:inherit;cursor:pointer}`;
  document.head.appendChild(st);

  let voulu = null, reprise = null, pretA = 0, tour = 0;
  /* on ne répond qu'à une fenêtre qu'elle a eu le temps de voir : 0,4 s après son affichage, même si le téléphone rame */
  const montre = h => {
    ouvre(`<div class="ap">${h}</div>`);
    const n = ++tour; pretA = Infinity;
    const vue = () => { if (n === tour && pretA === Infinity) pretA = performance.now() + 400; };
    requestAnimationFrame(() => setTimeout(vue, 0)); setTimeout(vue, 1000);
  };
  const question = () => montre(`<h3>Avant de partager</h3><div class="sous">As-tu encore des rendez-vous sur une autre appli ou sur papier ?</div>
<button class="btn" data-ap="oui">Oui, j’en ai</button><button class="btn ap-2" data-ap="non">Non, je partage</button>`);
  /* iara ne documente pas de réglage pour couper : d'où « ou bloque tes heures libres » */
  const gestes = () => montre(`<h3>D’abord, 2 gestes</h3><div class="sous">Pour ne jamais avoir deux clientes à la même heure.</div>
<ol class="s5-gestes"><li><i>1</i><span><b>Coupe la réservation en ligne</b> de ton ancienne appli (ou bloque tes heures libres), mais garde ton compte le temps de recopier.</span></li>
<li><i>2</i><span><b>Recopie tes rendez-vous à venir</b> dans ton agenda Loginail. Ces heures se ferment toutes seules sur ton site.</span></li></ol>
<button class="btn" data-ap="noter">Les noter maintenant</button><button class="btn ap-2" data-ap="fait">C’est déjà fait, je partage</button>`);

  /* on rejoue le bouton qu'elle avait touché, dans le même toucher : sinon l'iPhone refuse de copier et de partager */
  const partage = () => {
    if (!voulu) return;
    const b = document.createElement("button");
    b.hidden = true; b.setAttribute(voulu[0], voulu[1]);
    E.appendChild(b); reprise = b;
    try { b.click(); } finally { b.remove(); reprise = null; voulu = null; }
  };

  addEventListener("click", e => {
    const t = e.target; if (!t.closest || (reprise && t === reprise) || !S.user) return;
    const stop = () => { e.preventDefault(); e.stopPropagation(); };
    const r = t.closest("[data-ap]");
    if (r) {
      stop();
      const k = r.dataset.ap;
      if (k === "fini") { range("fini"); rendu(); return dit("C’est noté, tu peux partager ton lien ✓"); }
      const quand = e.timeStamp > 0 ? e.timeStamp : performance.now();
      if (quand < pretA) { pretA = Math.max(pretA, quand + 400); return; }   /* des touchers qui s'enchaînent ne répondent pas à sa place */
      if (k === "oui") { range("encours"); if (S.onglet === "ag") rendu(); return gestes(); }
      if (k === "non" || k === "fait") { range(k === "non" ? "non" : "fini"); ferme(); return partage(); }
      if (k === "noter") {
        voulu = null; ferme();
        const o = E.querySelector('.ong [data-go="ag"]');
        if (o) o.click(); else { S.onglet = "ag"; rendu(); }
      }
      return;
    }
    const p = t.closest(PARTAGES); if (!p) return;
    if (!S.site || !S.site.en_ligne || !S.site.slug) return;   /* pas de lien : le bouton le dit déjà */
    const v = etat();
    if (RANG[v] === 2) return;
    stop();
    const a = p.matches("[data-v-partage]") ? "data-v-partage" : p.matches('[data-a="bio"]') ? "data-a" : "data-dsp";
    voulu = [a, p.getAttribute(a)];
    if (v === "encours") gestes(); else question();
  }, true);

  /* le rappel dans l'agenda : juste sous « … rendez-vous », en jour, semaine et mois */
  const ag0 = VUES.ag;
  VUES.ag = () => {
    const h = ag0();
    if (etat() !== "encours") return h;
    const f = document.createElement("div"); f.innerHTML = h;
    const z = f.querySelector(".pap,[data-av-z]"); if (!z) return h;
    let k = z.previousElementSibling;
    while (k && !k.classList.contains("k")) k = k.previousElementSibling;
    const bandeau = '<div class="ap-rappel"><p><b>Recopie tes rendez-vous</b><small>Touche + pour chacun</small></p><button data-ap="fini">J’ai fini</button></div>';
    if (k) k.insertAdjacentHTML("afterend", bandeau); else z.insertAdjacentHTML("beforebegin", bandeau);
    return f.innerHTML;
  };
})();
