/* ===== 22/11 (Marie, D107) : « Mon site » plus court =====
   1 · « Ce mois sur ton site » (visites, « Réserver », réservations, note Google) monte en haut à droite, à côté du titre ;
       le toucher ouvre le détail. Sous le gros bouton « Personnaliser mon site », on arrive directement à « Mon contenu ».
   2 · « Changer de style », « Personnaliser » et « Mes charms » disparaissent : ils doublaient le gros bouton
       (appli-pont.html envoie déjà « style » sur la même page que « perso »).
   3 · Les charms ne sont pas perdus : quand elle enregistre « Personnaliser mon site », la pose des charms s'ouvre juste après
       (même page qu'avant, charms-presentoir.html), et la croix permet de passer. Aucune page du site n'est changée.
   Chargé après vernis.js et monsite.js. */
(function () {
  let resume = null;   /* le détail du mois, lu dans la page dessinée par vernis.js */

  const vSi = VUES.si;
  VUES.si = () => {
    const t = document.createElement("template"); t.innerHTML = vSi();
    const f = t.content, te = f.querySelector(".tete");
    /* 2 · les trois lignes en double, et leur titre « Mon style » */
    const style = f.querySelector('.liste .ligne[data-ms2="nouveau"]');
    if (style) { const l = style.closest(".liste"), k = l.previousElementSibling; if (k && k.classList.contains("k")) k.remove(); l.remove(); }
    /* 1 · les chiffres montent en haut à droite */
    const ch = f.querySelector(".v-chemin"), ci = f.querySelector(".v-chiffres");
    resume = ch || ci ? (ci ? ci.outerHTML : "") + (ch ? ch.outerHTML : "") : null;
    let gros = null, petit = "";
    if (ch) { const b = ch.querySelector(".v-ch-l b"), s = ch.querySelector(".v-ch-l span"); gros = b && b.textContent; petit = s ? s.textContent + " ce mois" : ""; }
    else if (ci) { const b = ci.querySelector("b"), s = ci.querySelector("span"); gros = b && b.textContent; petit = s ? s.textContent : ""; }
    if (ch) ch.remove();
    if (ci) ci.remove();
    if (te && gros != null) te.insertAdjacentHTML("beforeend", `<button class="msh" data-msh aria-label="${esc(gros + " " + petit)} : voir le détail"><b>${esc(gros)}</b><span>${esc(petit)}</span></button>`);
    const d = document.createElement("div"); d.appendChild(f); return d.innerHTML;
  };

  /* 3 · après « Personnaliser mon site », la pose des charms */
  let enchaine = false;
  addEventListener("click", e => {
    const b = e.target.closest && e.target.closest("[data-msh]");
    if (b) { e.preventDefault(); e.stopPropagation(); if (resume) ouvre(`<h3>Mon site ce mois</h3><div class="msh-detail">${resume}</div>`); return; }
    const p = e.target.closest && e.target.closest('[data-ms2="nouveau"]');
    if (p) enchaine = p.dataset.v === "perso";
  }, true);
  const suite = () => {
    if (!enchaine) return;
    enchaine = false;
    setTimeout(() => {   /* monsite.js vient de fermer la page et de redessiner « Mon site » */
      if (S.onglet !== "si" || E.querySelector(".ms2-grand")) return;
      const b = document.createElement("button"); b.hidden = true; b.dataset.ms2 = "nouveau"; b.dataset.v = "charms";
      E.appendChild(b); b.click(); b.remove();
      dit("Ton site est à jour ✓ Pose tes charms, ou ferme avec ×");
    }, 450);
  };
  /* seulement loginail.fr (ou ce serveur, en essai sur l'ordinateur), comme monsite.js */
  const SITEO = /^https?:$/.test(location.protocol) && location.hostname !== "app.loginail.fr" ? location.origin : "https://loginail.fr";
  addEventListener("message", m => {
    const d = m.data;
    if (d === "loginail-site-enregistre" || (m.origin === SITEO && d && typeof d === "object" && d.loginail === "enregistre" && d.br)) suite();
  });

  const st = document.createElement("style");
  st.textContent = `#E .vue[data-p="si"] .tete{align-items:flex-end}
#E .msh{flex:none;display:flex;flex-direction:column;align-items:flex-end;max-width:46%;min-height:44px;margin:0 0 2px;padding:6px 12px;border:1px solid var(--v-trait);border-radius:16px;background:#fff;color:inherit;font:inherit;text-align:right;cursor:pointer;transition:transform .12s}
#E .msh:active{transform:scale(.96)}
#E .msh b{font:500 22px/1.05 'Cormorant Garamond',Georgia,serif;font-variant-numeric:lining-nums;color:var(--v-encre)}
#E .msh span{font-size:11.5px;line-height:1.25;color:var(--gris)}
#E .msh-detail{margin-top:12px}
#E .msh-detail .v-chiffres{margin:0 0 10px}
@media (prefers-reduced-motion:reduce){#E .msh{transition:none}}`;
  document.head.appendChild(st);
})();
