/* ===== 22/11 (Marie) : à l'ouverture, l'Accueil dit ce qui manque dans ses infos légales (nom, SIRET) et rappelle le médiateur.
   Toucher la carte ouvre « Mes infos légales ». Elle part toute seule quand le nom et le SIRET sont enregistrés.
   À charger en dernier : la carte passe au-dessus de « Vérifie ton site » et de la bienvenue. ===== */
(function () {
  const st = document.createElement("style");
  st.textContent = `#E .rl{position:relative;z-index:1;display:flex;align-items:center;gap:12px;box-sizing:border-box;width:100%;margin:16px 0 4px;padding:13px 14px;border:1.5px solid var(--v-acc);border-radius:20px;background:#fff;color:var(--v-fonce);font:inherit;text-align:left;cursor:pointer}
#E .rl>i{flex:none;display:grid;place-items:center;width:30px;height:30px;border-radius:50%;background:var(--v-acc);color:#fff;font:500 17px Jost,sans-serif}
#E .rl>span{flex:1;min-width:0;font-size:12.5px;line-height:1.35}
#E .rl b{display:block;margin-bottom:3px;font-size:14.5px;font-weight:500}
#E .rl em{display:block;margin-top:4px;font-style:normal;color:var(--v-acc);font-weight:500}
#E .rl>u{flex:none;text-decoration:none;color:var(--v-acc);font-size:20px}
#E .lg-med{margin:12px 0 0;padding:10px 12px;border-radius:14px;background:var(--v-rose);color:var(--v-fonce);font-size:12.5px;line-height:1.4;text-align:left}
#E .lg-med b{font-weight:500}`;
  document.head.appendChild(st);
  const acc0 = VUES.acc;
  VUES.acc = () => {
    const h = acc0(); if (!S.site || !window.__legalManque) return h;
    const m = window.__legalManque(); if (!m.length) return h;
    const f = document.createElement("div"); f.innerHTML = h;
    const t = f.querySelector(".tete"); if (!t) return h;
    t.insertAdjacentHTML("afterend", `<button class="rl" data-a="ms-legal"><i aria-hidden="true">!</i><span><b>Il manque ${m.join(" et ")}</b>C’est obligatoire sur ton site, tout comme le nom de ton médiateur de la consommation.<em>Compléter mes infos légales</em></span><u aria-hidden="true">›</u></button>`);
    return f.innerHTML;
  };
})();
