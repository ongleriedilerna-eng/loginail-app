/* ===== 22/11 (Marie) : à l'ouverture, l'Accueil dit doucement ce qui manque dans ses infos légales (nom, SIRET).
   Marie : « ça me ferait peur » → jamais de « ! », de contour ni de « obligatoire » ici ; le médiateur se rappelle dans la fiche.
   Toucher la carte ouvre « Mes infos légales ». Elle part toute seule quand le nom et le SIRET sont enregistrés.
   À charger en dernier : la carte passe au-dessus de « Vérifie ton site » et de la bienvenue. ===== */
(function () {
  const st = document.createElement("style");
  st.textContent = `#E .rl{position:relative;z-index:1;display:flex;align-items:center;gap:12px;box-sizing:border-box;width:100%;margin:16px 0 4px;padding:12px 14px;border:0;border-radius:20px;background:#fff;color:var(--v-fonce);font:inherit;text-align:left;cursor:pointer}
#E .rl>i{flex:none;display:grid;place-items:center;width:30px;height:30px;border-radius:50%;background:var(--v-rose);color:var(--v-acc)}
#E .rl>span{flex:1;min-width:0;font-size:12.5px;line-height:1.35}
#E .rl b{display:block;margin-bottom:2px;font-size:14px;font-weight:400;text-wrap:balance}
#E .rl small{display:block;font-size:12.5px;color:var(--gris)}
#E .rl>u{flex:none;text-decoration:none;color:var(--v-acc);font-size:20px}
#E .lg-med{margin:12px 0 0;padding:10px 12px;border-radius:14px;background:var(--v-h2);color:var(--gris);font-size:12.5px;line-height:1.4;text-align:left}
#E .lg-med b{font-weight:500}`;
  document.head.appendChild(st);
  const acc0 = VUES.acc;
  VUES.acc = () => {
    const h = acc0(); if (!S.site || !window.__legalManque) return h;
    const m = window.__legalManque(); if (!m.length) return h;
    const f = document.createElement("div"); f.innerHTML = h;
    const t = f.querySelector(".tete"); if (!t) return h;
    t.insertAdjacentHTML("afterend", `<button class="rl" data-a="ms-legal"><i aria-hidden="true"><svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M4 20l1-4L16 5l3 3L8 19z"/></svg></i><span><b>Il manque juste ${m.join(" et ")}</b><small>À ajouter quand tu as 2 minutes</small></span><u aria-hidden="true">›</u></button>`);
    return f.innerHTML;
  };
})();
