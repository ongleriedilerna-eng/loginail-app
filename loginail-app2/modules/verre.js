/* Loginail · « le verre » pour « Fermer mon salon » et « Mes dispos » (Marie, 28/11 :
   « j'aime beaucoup quand on clique sur novembre, ça fait un carré et l'arrière est flouté ; la même chose pour fermer le salon et mes dispos »).
   Au lieu de monter du bas, la feuille s'ouvre en carré au milieu de l'écran, l'agenda derrière est flouté (comme le panneau des mois).
   Rien ne change dans ce qu'il y a dedans : on reconnaît ces feuilles à leur contenu et on ne change que leur dessin. */
(function () {
  if (typeof E === "undefined" || !E) return;
  const CSS = `
#E.fe-verre .voile{background:rgba(246,238,236,.55);-webkit-backdrop-filter:blur(6px);backdrop-filter:blur(6px);transition:opacity .22s ease-out}
#E.fe-verre .feuille{left:14px;right:14px;bottom:auto;top:calc(50% + (env(safe-area-inset-top,0px) - env(safe-area-inset-bottom,0px)) / 2);
  max-height:calc(100% - env(safe-area-inset-top,0px) - env(safe-area-inset-bottom,0px) - 32px);
  border-radius:28px;padding:18px 20px 22px!important;background:var(--v-c,#FBF6F4);border:1px solid rgba(255,255,255,.95);box-shadow:0 30px 60px -28px rgba(80,30,40,.45);
  transform:translateY(-50%) scale(.96);opacity:0;pointer-events:none;transition:opacity .18s ease-in,transform .18s ease-in}
#E.fe.fe-verre .feuille{transform:translateY(-50%);opacity:1;pointer-events:auto;transition:none;animation:fe-verre .22s cubic-bezier(.2,.9,.25,1) backwards}
#E.fe-verre .feuille>.poig{display:none}
#E.fe-verre .feuille .fe-x{top:12px;right:12px;background:rgba(30,28,27,.06)}
#E.fe-verre .feuille.md-f{height:min(86%,calc(100% - env(safe-area-inset-top,0px) - env(safe-area-inset-bottom,0px) - 32px));max-height:none;padding:14px 0 6px!important}
@keyframes fe-verre{from{opacity:0;transform:translateY(calc(-50% - 8px)) scale(.96)}}
@media (prefers-reduced-motion:reduce){#E.fe.fe-verre .feuille{animation:none}#E.fe-verre .feuille{transition:none}}`;
  document.head.insertAdjacentHTML("beforeend", `<style id="verre-feuilles">${CSS}</style>`);

  /* La feuille est refabriquée quand l'appli démarre : on la cherche à chaque fois. « ouvre() » remplit la feuille puis met la classe « fe » sur E :
     on regarde donc la classe de E (même image, avant que l'écran ne se redessine). */
  /* Fermer mon salon (bouton « Fermer ce jour ») · Mes dispos du rond de l'Agenda (.md) · Partager mes dispos (.dsp) */
  const VERRE = '[data-su="cg-ok"],.md,.dsp';
  let tard = 0;
  /* redevenir une feuille du bas sans qu'on la voie traverser l'écran */
  const normale = () => { const f = E.querySelector(".feuille"); if (f) f.style.transition = "none"; E.classList.remove("fe-verre"); if (f) { f.getBoundingClientRect(); f.style.transition = ""; } };
  new MutationObserver(() => {
    clearTimeout(tard);
    /* fermée : le carré s'efface (0,18 s), puis la feuille redevient normale pour les suivantes */
    if (!E.classList.contains("fe")) { if (E.classList.contains("fe-verre")) tard = setTimeout(() => { if (!E.classList.contains("fe")) normale(); }, 260); return; }
    const f = E.querySelector(".feuille"); if (!f) return;
    const verre = !!f.querySelector(VERRE);
    if (verre === E.classList.contains("fe-verre")) return;
    if (verre) return E.classList.add("fe-verre");
    /* une autre feuille prend la place (ex. « Noter le RDV » depuis Mes dispos) : elle se pose en bas tout de suite, sans glisser de travers */
    normale();
  }).observe(E, { attributes: true, attributeFilter: ["class"] });
})();
