/* ===== 24/11 (Marie, D118, version B : maquettes/auj-agenda-2411/index.html) : on voit AUJOURD'HUI d'un coup d'œil dans l'agenda =====
   (1) bande de la semaine : la case d'aujourd'hui (quand ce n'est pas le jour ouvert) = cadre fin + fond très pâle, couleur du salon, « auj. » en gras ;
   (2) la pilule « ↺ Aujourd'hui » (déjà là depuis le 17/11, suite.js) prend la couleur du salon et sa flèche ; un appui ramène aussi à l'heure qu'il est ;
   (3) sur aujourd'hui, le titre au-dessus des heures : « Aujourd'hui · mardi 24 novembre · N rendez-vous », couleur du salon. Pour tous les salons, les 3 styles. */
(function () {
  const st = document.createElement("style");
  st.textContent = `#E .semaine button.d118-auj:not(.on){box-shadow:inset 0 0 0 1.5px var(--v-acc,#B5475E);background:color-mix(in srgb,var(--v-acc,#B5475E) 8%,transparent)}
#E .semaine button.d118-auj:not(.on) small,#E .semaine button.d118-auj:not(.on) b{color:var(--v-acc,#B5475E)}
#E .semaine button.d118-auj small{font-weight:600}
#E .su-auj2,#E .av-tete .su-auj2{background:var(--v-acc,#B5475E)!important;color:#fff!important;font-weight:500}
#E .av-tete .su-auj2 svg,#E .su-auj2 svg{display:block!important;width:15px;height:15px}
#E .av-tete .su-auj2{gap:4px;padding:0 12px 0 9px!important}
#E .k.d118-k{color:var(--v-acc,#B5475E)!important;font-weight:600}
@media (max-width:380px){#E .av-tete .su-auj2{padding:0 9px 0 7px!important;font-size:12.5px!important}#E .av-tete .su-auj2 svg{width:13px;height:13px}}
@media (max-width:350px){#E .av-tete .su-auj2{padding:0 10px!important}#E .av-tete .su-auj2 svg{display:none!important}}`;
  document.head.appendChild(st);
  const MOISL = ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"];

  const ag0 = VUES.ag;
  VUES.ag = () => {
    const h = ag0(), f = document.createElement("div"); f.innerHTML = h;
    const now = new Date();
    /* (1) la case d'aujourd'hui */
    f.querySelectorAll(".semaine button[data-jour]").forEach(b => { if (memeJour(new Date(b.dataset.jour), now)) b.classList.add("d118-auj"); });
    /* (3) le titre, seulement en vue Jour sur aujourd'hui */
    if (f.querySelector(".pap") && memeJour(S.jour, now)) {
      const k = [...f.querySelectorAll(".k")].find(x => /rendez-vous/.test(x.textContent));
      const tn = k && [...k.childNodes].find(n => n.nodeType === 3 && n.nodeValue.trim());
      if (tn) {
        const jour = JOURS[(now.getDay() + 6) % 7].toLowerCase(), i = tn.nodeValue.indexOf(" · ");
        tn.nodeValue = `Aujourd’hui · ${jour} ${now.getDate()} ${MOISL[now.getMonth()]}` + (i >= 0 ? tn.nodeValue.slice(i) : "");
        k.classList.add("d118-k");
      }
    }
    return f.innerHTML;
  };
  /* (2) un appui sur « ↺ Aujourd'hui » ramène aussi à l'heure qu'il est (suite.js fait le reste : jour, semaine, relecture) */
  addEventListener("click", e => { if (e.target.closest && e.target.closest('[data-su="auj"]')) S.papY = null; }, true);
})();
