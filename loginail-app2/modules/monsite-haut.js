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

  /* 26/11 : les 4 lignes de « Personnaliser mon site » (les mêmes écritures que monsite.js) */
  const POLN = { elegante: ["Élégante", "Italiana"], manuscrite: ["Manuscrite", "'Great Vibes'"], ronde: ["Ronde", "'Bagel Fat One'"], retro: ["Rétro", "'Abril Fatface'"], calligraphie: ["Calligraphie", "'Pinyon Script'"], parisienne: ["Parisienne", "Parisienne"], chic: ["Chic", "'Playfair Display'"], luxe: ["Luxe", "Cinzel"], surf: ["Surf", "Pacifico"], seventies: ["Seventies", "Shrikhand"], bulle: ["Bulle", "'Rubik Bubbles'"], bonbon: ["Bonbon", "'Cherry Bomb One'"], y2k: ["Y2K", "Monoton"], gothique: ["Gothique", "UnifrakturMaguntia"], feutre: ["Feutre", "'Permanent Marker'"], moderne: ["Moderne", "Jost"], relief: ["Relief", "'Bungee Shade'"], pixel: ["Pixel", "Silkscreen"], artdeco: ["Art déco", "Fascinate"], graffiti: ["Graffiti", "'Sedgwick Ave Display'"], fondue: ["Fondue", "'Climate Crisis'"], cinema: ["Cinéma", "Limelight"], feminine: ["Féminine", "'Yeseva One'"], pinup: ["Pin-up", "'Lily Script One'"], couture: ["Couture", "Gloock"], arrondie: ["Arrondie", "Righteous"], douce: ["Douce", "Corben"], gala: ["Gala", "Playball"] };
  function perso() {
    let b = {}; try { b = brouillon() || {}; } catch (e) {}
    const pol = POLN[b.police] || POLN.elegante, ch = [...new Set((b.stickers || []).map(c => c && c.n).filter(n => n && n !== "__etoile"))];
    /* 26/11 (Marie, maquettes/icones-perso-2611) : 4 icônes dessinées, du même trait que « Mon contenu » : Vitrine, Pot de peinture, Aa chic, Diamant */
    const sv = d => `<svg viewBox="0 0 24 24" width="21" height="21" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${d}</svg>`;
    const L = [
      ["entete", `<span class="v-ico psi-ic">${sv('<path d="M4 9l1.5-5h13L20 9"/><path d="M4 9c0 1.4 1.1 2.5 2.7 2.5S9.3 10.4 9.3 9c0 1.4 1.2 2.5 2.7 2.5s2.7-1.1 2.7-2.5c0 1.4 1.1 2.5 2.6 2.5S20 10.4 20 9"/><path d="M5.5 11.5V20h13v-8.5"/><path d="M10 20v-4.5h4V20"/>')}</span>`, "En-tête", "Le haut de ton site, ta photo"],
      ["fond", `<span class="v-ico psi-ic">${sv('<path d="M6 10l6-6 6 6-6 6z"/><path d="M19 14c0 1.5-1 2.5-1 3.5a1 1 0 0 0 2 0c0-1-1-2-1-3.5z"/><path d="M4 20h10"/>')}</span>`, "Fond", b.fond ? esc(b.fond) : "Tes couleurs suivent ton fond"],
      ["ecriture", `<span class="v-ico psi-ic psi-p" aria-hidden="true">Aa</span>`, "Typographie", `<span style="font-family:${pol[1]},serif">${pol[0]}</span>`],
      ["charms", `<span class="v-ico psi-ic">${sv('<path d="M6.5 4h11L21 9l-9 11L3 9z"/><path d="M3 9h18M9.5 4L8 9l4 11 4-11-1.5-5"/>')}</span>`, "Charms", ch.length ? ch.length + (ch.length > 1 ? " charms posés" : " charm posé") : "Pose-les où tu veux"]];
    /* 28/11 (Marie choisit la version C, maquette appli-verre/mon-site-4.html : « juste un bouton en grand Personnaliser mon site, c'est mieux ») :
       en Safari ou sur un petit iPhone, « Charms » était caché sous la barre du bas. Un seul grand bouton, les 4 icônes dedans :
       il ouvre Personnaliser (les 4 onglets sont en haut), puis la pose des charms après « Enregistrer » (comme D107). */
    const ics = L.map(([, ic]) => ic.replace('class="v-ico psi-ic psi-p"', 'class="psi-mi psi-p"').replace('class="v-ico psi-ic"', 'class="psi-mi"').replace(/width="21" height="21"/, 'width="13" height="13"')).join("");
    return `<button class="psi-gros" data-ms2="nouveau" data-v="perso"><span class="psi-ics" aria-hidden="true">${ics}</span><span class="psi-gt"><b>Personnaliser mon site</b><small>En-tête · Fond · Typographie · Charms</small></span><span class="psi-fl" aria-hidden="true">›</span></button>`;
  }

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
    /* 4 · 26/11 (Marie) : le gros bouton devient « Personnaliser mon site », rangé comme « Mon contenu » : 4 lignes,
       chacune ouvre directement SA partie (appli-pont.html ?p=entete|fond|ecriture → le bon onglet de Personnaliser ; charms → la pose des charms) */
    const gb = f.querySelector('.btn[data-ms2="nouveau"]');
    if (gb) { const t2 = document.createElement("template"); t2.innerHTML = perso(); gb.replaceWith(t2.content); }
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
#E .psi-gros{display:flex;align-items:center;gap:14px;width:100%;margin:16px 0 0;border:0;border-radius:24px;padding:18px;background:var(--v-fonce,#2A1F1F);color:#fff;text-align:left;font:inherit;cursor:pointer;box-shadow:0 18px 34px -20px rgba(60,20,30,.6);transition:transform .12s;-webkit-tap-highlight-color:transparent}
#E .psi-gros:active{transform:scale(.97)}
#E .psi-ics{flex:none;display:grid;grid-template-columns:repeat(2,22px);gap:4px}
#E .psi-mi{width:22px;height:22px;border-radius:7px;display:grid;place-items:center;background:rgba(255,255,255,.14);color:#fff}
#E .psi-mi.psi-p{font:italic 500 13px/1 'Cormorant Garamond',Georgia,serif}
#E .psi-gt{min-width:0}
#E .psi-gt b{display:block;font:500 17px/1.2 Jost,sans-serif}
#E .psi-gt small{display:block;margin-top:3px;font-size:12.5px;opacity:.75;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
#E .psi-fl{margin-left:auto;font-size:22px;opacity:.8}
@media (max-width:340px){#E .psi-gros{gap:10px;padding:16px 14px}#E .psi-gt b{font-size:16px}#E .psi-gt small{font-size:11.5px;white-space:normal}}
#E .k.psi-k{margin-top:14px}   /* 27/11 (Marie) : « Charms » entier au-dessus de la barre du bas, même avec le fond en haut */
#E .psi .ligne{gap:12px}
#E .psi .ligne .t span{white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
#E .psi .ligne .t{min-width:0}
#E .psi-ic{position:relative;flex:none;width:36px;height:36px;border-radius:10px;overflow:hidden;display:grid;place-items:center;background:var(--v-rose,#F5E6E4) center/cover;color:var(--v-acc);font-size:16px;box-shadow:inset 0 0 0 1px rgba(30,28,27,.06)}
#E .psi-p{font:italic 500 21px/1 'Cormorant Garamond',Georgia,serif}
@media (prefers-reduced-motion:reduce){#E .msh{transition:none}}`;
  document.head.appendChild(st);
})();
