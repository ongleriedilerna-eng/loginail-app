/* ===== 24/11 (Marie : « dans sa fiche, mettre le nombre de fois où elle a annulé au dernier moment ») =====
   Maquette maquettes/retours-2411/dette-annul.html (téléphone 2). Compté avec ce que l'appli garde déjà (rien à changer sur le serveur) :
   · « au dernier moment » = annulé moins de [sa règle d'annulation, 48 h par défaut] avant, par la cliente (lien du SMS) ou par la pro POUR elle
     (annule_par « cliente » ou « cliente_salon ») ; les annulations de la pro (« pro ») ne comptent pas ;
   · « pas venue » = statut absente. Touche la ligne pour voir les dates. */
(function () {
  const st = document.createElement("style");
  st.textContent = `#E .an-l{display:flex;align-items:center;gap:12px;width:100%;margin-top:10px;padding:12px 14px;border:0;border-radius:18px;background:#fff;color:inherit;font:inherit;text-align:left;cursor:pointer}
#E .an-l .n{flex:none;min-width:34px;height:34px;padding:0 8px;box-sizing:border-box;border-radius:99px;display:grid;place-items:center;font-weight:500;font-size:15px;background:#F3ECEA;color:#9A5B62}
#E .an-l>div{flex:1;min-width:0}#E .an-l b{display:block;font-weight:500;font-size:14.5px;line-height:1.3}#E .an-l small{display:block;font-size:12.5px;color:#776D64;margin-top:1px}
#E .an-l .fl{flex:none;color:#B5AEA8;transition:transform .2s}#E .an-l[aria-expanded=true] .fl{transform:rotate(90deg)}
#E .an-det{display:grid;grid-template-rows:0fr;transition:grid-template-rows .26s cubic-bezier(.2,.8,.2,1)}#E .an-det.on{grid-template-rows:1fr}#E .an-det>div{overflow:hidden}
#E .an-det p{display:flex;justify-content:space-between;gap:10px;margin:6px 4px 0;padding:9px 12px;border-radius:12px;background:#FBF8F5;font-size:13px}
#E .an-det em{font-style:normal;color:#9A5B62;text-align:right}
#E .an-ok{margin-top:10px;padding:11px 14px;border-radius:18px;background:#fff;font-size:13.5px;color:#4F6B4A;text-align:left}
@media (prefers-reduced-motion:reduce){#E .an-det,#E .an-l .fl{transition:none}}`;
  document.head.appendChild(st);

  const JC = ["dim.", "lun.", "mar.", "mer.", "jeu.", "ven.", "sam."], MC = ["janv.", "févr.", "mars", "avr.", "mai", "juin", "juil.", "août", "sept.", "oct.", "nov.", "déc."];
  const jour = d => `${JC[d.getDay()]} ${d.getDate()} ${MC[d.getMonth()]}`;
  const delai = () => { const t = String(((S.site && S.site.donnees && S.site.donnees.regles) || (typeof brouillon === "function" && (brouillon() || {}).regles) || {}).annulation || ""), m = t.match(/(\d+)/); return (m ? +m[1] : 48) || 48; };
  const avant = h => h < 1 ? "annulé moins d’1 h avant" : h < 24 ? `annulé ${Math.round(h)} h avant` : "annulé la veille";
  let OUV = null;

  window.__annulFiche = (c, RDV) => {
    if (!RDV) return "";
    const lim = delai(), now = Date.now();
    const an = RDV.filter(r => r.statut === "annule" && (r.annule_par === "cliente" || r.annule_par === "cliente_salon") && r.annule_le)
      .map(r => ({ r, h: (new Date(r.debut) - new Date(r.annule_le)) / 36e5 })).filter(x => x.h < lim);
    const abs = RDV.filter(r => r.statut === "absente");
    if (!an.length && !abs.length) return RDV.some(r => r.statut !== "annule") ? `<div class="an-ok">✓ Aucune annulation au dernier moment</div>` : "";
    const l = an.map(x => ({ d: new Date(x.r.debut), t: avant(Math.max(0, x.h)) })).concat(abs.map(r => ({ d: new Date(r.debut), t: "pas venue" }))).sort((a, b) => b.d - a.d);
    const ouvert = OUV === c.id;
    return `<button class="an-l" data-anl="${esc(c.id)}" aria-expanded="${ouvert}"><span class="n">${l.length}</span><div><b>${[an.length ? `Annulé au dernier moment : ${an.length} fois` : "", abs.length ? `Pas venue : ${abs.length} fois` : ""].filter(Boolean).join(" · ")}</b><small>${an.length ? `Moins de ${lim} h avant (ta règle d’annulation)` : "Touche pour voir les dates"}</small></div><span class="fl">›</span></button>
      <div class="an-det${ouvert ? " on" : ""}"><div>${l.slice(0, 12).map(x => `<p><span>${jour(x.d)} ${x.d.getFullYear() !== new Date().getFullYear() ? x.d.getFullYear() : ""}</span><em>${x.t}</em></p>`).join("")}</div></div>`;
  };
  document.addEventListener("click", e => {
    const b = e.target.closest && e.target.closest("[data-anl]"); if (!b) return;
    e.stopPropagation(); e.preventDefault();
    OUV = OUV === b.dataset.anl ? null : b.dataset.anl;
    const on = OUV === b.dataset.anl, det = b.nextElementSibling;
    b.setAttribute("aria-expanded", on); if (det && det.classList.contains("an-det")) det.classList.toggle("on", on);
  }, true);
})();
