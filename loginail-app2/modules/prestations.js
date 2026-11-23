/* ===== 22/11 (Marie) : « une barre de recherche », puis « tout simplement trois petits traits pour trier en tout, presta, nail art » =====
   Dans les deux listes : Mon site › Prestations et prix, et Réglages › Mes prestations.
   On ne refait jamais la liste : on cache les lignes, donc la case garde le clavier et chaque ligne garde son numéro.
   22/11 (Marie) : « Ajouter » est sous la recherche, plus tout en bas ; si elle tape un nom qu'elle n'a pas, il le reprend dans la fiche. */
(function () {
  /* la même règle que « Nail art » sur le site des salons (loginail-creer/pret.html, famille) : si elle change là-bas, la changer ici */
  /* 23/11 (D109) : deux familles, « Prestations » et « Petits plus » : la famille enregistrée, sinon la règle du nom (LOGI_PRESTA.estPlus) */
  const LP = window.LOGI_PRESTA;
  const FILTRES = [["tout", "Tout"], ["presta", "Prestations"], ["art", "Petits plus"]];
  const famDe = (l, nom) => { const z = l.closest("[data-cs-sec]"); if (z) return z.dataset.csSec === "plus" ? "art" : "presta"; return LP.estPlus({ nom }) ? "art" : "presta"; };
  const LISTE = '.btn[data-cs-p="-1"],.btn[data-a="presta"][data-id=""]', LIGNE = '.ligne[data-cs-p],.ligne[data-a="presta"]';
  /* sans accents, sans majuscules, tirets = espaces */
  const plat = s => String(s).toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/œ/g, "oe").replace(/[^\p{L}\p{N}]+/gu, " ").trim();

  const st = document.createElement("style");
  st.textContent = `#E .feuille:has(.pr-haut){height:100%}
#E .pr-haut{position:sticky;top:-12px;z-index:2;margin:4px -24px 0;padding:12px 24px 10px;background:var(--v-c,var(--creme))}
#E .pr-haut+.liste{margin-top:2px!important}
#E .pr-rang{position:relative;display:flex;align-items:center;gap:8px}
#E .pr-haut>.btn.pr-plus{display:block;width:100%!important;height:44px;min-height:44px;margin:8px 0 0!important;padding:0 16px;overflow:hidden;white-space:nowrap;text-overflow:ellipsis}
#E .pr-haut .cherche{flex:1;min-width:0;height:42px;margin:0}
#E .pr-rang .v-rondb{position:relative;width:40px;height:40px}
#E .pr-rang .v-rondb::after{content:"";position:absolute;inset:-3px}
#E .pr-haut input{flex:1;min-width:0;height:100%;border:0;outline:0;background:none;padding:0;font:inherit;font-size:16px;color:var(--noir);-webkit-appearance:none}
#E .pr-haut input::-webkit-search-cancel-button{display:none}
#E .pr-menu{position:absolute;right:0;top:50px;z-index:20;min-width:200px;padding:6px;background:#fff;border-radius:18px;box-shadow:0 18px 40px -16px rgba(0,0,0,.45);transform-origin:top right;animation:pr-menu .16s ease-out both}
#E .pr-menu button{display:flex;justify-content:space-between;align-items:center;width:100%;min-height:45px;border:0;background:none;border-radius:12px;padding:12px 14px;font:inherit;font-size:14.5px;color:inherit;text-align:left;cursor:pointer}
#E .pr-menu button.on{background:rgba(30,28,27,.06)}
#E .pr-menu button.on span::after{content:"✓"}
@keyframes pr-menu{from{opacity:0;transform:scale(.94)}}
@media (prefers-reduced-motion:reduce){#E .pr-menu{animation:none}}
#E .feuille .ligne.pr-non,#E .pr-haut [hidden],#E .pr-rien[hidden],#E .liste.pr-non,#E .cs-sec.pr-non,#E .cs-pill[hidden]{display:none!important}
#E .feuille .ligne.pr-fin{border-bottom:0}
#E .feuille .ligne .t{min-width:0;overflow-wrap:anywhere}
#E .feuille .ligne em{flex:none;white-space:nowrap}
#E .pr-rien{padding:26px 8px 10px;text-align:center;font-size:14px;line-height:1.45;color:var(--gris);overflow-wrap:anywhere}
#E .pr-rien button{display:block;min-height:44px;margin:4px auto 0;border:0;background:none;font:inherit;text-decoration:underline;color:var(--noir);cursor:pointer}`;
  document.head.appendChild(st);

  let q = "", choix = "tout", y = 0;
  const remet = () => { q = ""; choix = "tout"; y = 0; };
  const feuille = () => E.querySelector(".feuille");

  /* ce qu'elle a tapé, si elle ne l'a pas déjà mot pour mot */
  function aAjouter(lignes) {
    const nom = q.replace(/\s+/g, " ").trim(), p = plat(nom); if (!p) return "";
    return lignes.some(l => { const n = l.querySelector(".t")?.firstChild; return n && n.nodeType === 3 && plat(n.textContent) === p; }) ? "" : nom;
  }

  function trie() {
    const fc = E.querySelector(".feuille .fc"), haut = fc && fc.querySelector(".pr-haut"); if (!haut) return;
    const mots = plat(q).split(" ").filter(Boolean), lignes = [...fc.querySelectorAll(LIGNE)];
    let vues = 0, ailleurs = 0, fin = null;
    lignes.forEach(l => {
      const t = l.querySelector(".t"), nom = t && t.firstChild && t.firstChild.nodeType === 3 ? t.firstChild.textContent : "";
      const p = plat(nom), colle = p.replace(/ /g, ""), trouve = mots.every(m => p.includes(m) || colle.includes(m));
      const garde = trouve && (choix === "tout" || choix === famDe(l, nom));
      l.classList.toggle("pr-non", !garde); l.classList.remove("pr-fin");
      if (garde) { vues++; fin = l; } else if (trouve) ailleurs++;
    });
    if (fin) fin.classList.add("pr-fin");
    haut.querySelector("[data-pr-x]").hidden = !q;
    const plus = haut.querySelector(".pr-plus");
    if (plus) { const neuf = aAjouter(lignes), mot = neuf ? `+ Ajouter « ${neuf} »` : "+ Ajouter une prestation"; if (plus.textContent !== mot) plus.textContent = mot; }
    haut.querySelectorAll("[data-pr-f]").forEach(b => { const on = b.dataset.prF === choix; b.classList.toggle("on", on); b.setAttribute("aria-pressed", on); });
    /* le rond devient foncé quand la liste est triée, comme dans Clientes */
    haut.querySelector("[data-pr-tri]").classList.toggle("plein", choix !== "tout");
    const secs = [...fc.querySelectorAll("[data-cs-sec]")];
    if (!secs.length) haut.nextElementSibling.classList.toggle("pr-non", !vues);
    else {
      /* une section sans ligne à montrer se cache ; « Déjà écrits pour toi » suit aussi la recherche */
      let pills = 0;
      fc.querySelectorAll("[data-cs-pret]").forEach(b => { const p = plat(b.dataset.nom), c = p.replace(/ /g, ""), ok = choix !== "presta" && mots.every(m => p.includes(m) || c.includes(m)); b.hidden = !ok; if (ok) pills++; });
      secs.forEach(z => { const k = z.dataset.csSec;
        z.classList.toggle("pr-non", k === "prets" ? !pills : (choix !== "tout" || mots.length) ? !z.querySelector(".ligne[data-cs-p]:not(.pr-non)") : false); });
      vues += pills;
    }
    const rien = fc.querySelector(".pr-rien"); rien.hidden = !!vues; if (vues) return;
    const ou = choix === "art" ? " dans Petits plus" : choix === "presta" ? " dans Prestations" : "";
    rien.textContent = mots.length ? `Rien pour « ${q.trim()} »${ou}.` : choix === "art" ? "Pas encore de petit plus dans ta liste." : `Rien${ou}.`;
    if (mots.length && ailleurs) { const b = document.createElement("button"); b.dataset.prF = "tout"; b.textContent = ailleurs > 1 ? `Voir les ${ailleurs} dans Tout` : "La voir dans Tout"; rien.appendChild(b); }
  }

  function menu(ouvert) {
    const m = E.querySelector(".pr-menu"); if (!m) return;
    m.hidden = !ouvert; m.previousElementSibling.setAttribute("aria-expanded", ouvert);
  }

  function pose() {
    const fc = E.querySelector(".feuille .fc"); if (!fc || fc.querySelector(".pr-haut") || !fc.querySelector(LISTE) || !fc.querySelector(LIGNE)) return;
    const liste = fc.querySelector(".cs-sec") || fc.querySelector(".liste");
    /* « Mon site » refait la feuille sans sa croix après un enregistrement : on la remet */
    if (!fc.querySelector(".fe-x")) fc.insertAdjacentHTML("afterbegin", '<button class="fe-x" data-a="fermer" aria-label="Fermer">×</button>');
    liste.insertAdjacentHTML("beforebegin", `<div class="pr-haut"><div class="pr-rang"><label class="cherche">${I.lo}<input data-pr-q type="search" autocapitalize="sentences" enterkeyhint="search" autocomplete="off" autocorrect="off" spellcheck="false" aria-label="Rechercher une prestation" placeholder="Rechercher une prestation"><button type="button" class="cherche-x" data-pr-x aria-label="Effacer la recherche" hidden><svg viewBox="0 0 24 24" width="9" height="9"><path d="M7 7l10 10M17 7L7 17"/></svg></button></label><button type="button" class="v-rondb" data-pr-tri aria-label="Trier mes prestations" aria-expanded="false"><svg viewBox="0 0 24 24" width="20" height="20"><path d="M4 7h16M7 12h10M10 17h4" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg></button><div class="pr-menu tris" hidden>${FILTRES.map(f => `<button type="button" data-pr-f="${f[0]}">${f[1]}<span></span></button>`).join("")}</div></div></div>`);
    ([...fc.querySelectorAll(".cs-sec")].pop() || liste).insertAdjacentHTML("afterend", '<div class="pr-rien" role="status" hidden></div>');
    const plus = fc.querySelector(LISTE); plus.classList.add("pr-plus"); fc.querySelector(".pr-haut").appendChild(plus);
    fc.querySelector("[data-pr-q]").value = q; trie();
    feuille().scrollTop = y;   /* après une modification, elle retrouve sa place dans la liste */
  }
  new MutationObserver(pose).observe(E, { childList: true, subtree: true });

  /* sur window : passe avant contenu.js, qui remplace la feuille au toucher */
  addEventListener("click", e => {
    const t = e.target; if (!t.closest) return;
    /* menu ouvert : toucher à côté le referme, sans ouvrir la ligne qui est dessous */
    const m = E.classList.contains("fe") && E.querySelector(".pr-menu:not([hidden])");
    if (m && !t.closest(".pr-menu")) { e.preventDefault(); e.stopPropagation(); menu(false); return; }
    if (t.closest("[data-pr-tri]")) { e.preventDefault(); e.stopPropagation(); menu(true); return; }
    const f = t.closest(".feuille"); if (!f) { if (t.closest("[data-a]")) remet(); return; }
    const b = t.closest("[data-pr-f]"), x = t.closest("[data-pr-x]");
    if (b || x) {
      e.preventDefault(); e.stopPropagation();
      if (b) { choix = b.dataset.prF; menu(false); } else { q = ""; const i = f.querySelector("[data-pr-q]"); i.value = ""; i.focus({ preventScroll: true }); }
      y = 0; trie(); f.scrollTop = 0; return;
    }
    if (!f.querySelector(".pr-haut")) return;
    if (t.closest(LISTE)) {   /* une nouvelle prestation doit se voir au retour */
      const nom = aAjouter([...f.querySelectorAll(LIGNE)]); remet(); f.scrollTop = 0;
      /* la fiche s'ouvre juste après ce toucher : on y met ce qu'elle a tapé, elle n'a plus que le prix et la durée */
      if (nom) setTimeout(() => { const i = f.querySelector("[data-cs-nom],#p-n"); if (i && !i.value) { i.value = nom; i.dispatchEvent(new Event("input", { bubbles: true })); } });
    }
    else if (t.closest(LIGNE)) { y = f.scrollTop; f.scrollTop = 0; }
    else if (t.closest("[data-cs-pret]")) { remet(); f.scrollTop = 0; }
  }, true);
  document.addEventListener("input", e => { if (!e.target.matches("[data-pr-q]")) return; q = e.target.value; y = 0; trie(); feuille().scrollTop = 0; });
  document.addEventListener("keydown", e => { if (e.key === "Enter" && e.target.matches("[data-pr-q]")) { e.preventDefault(); e.target.blur(); } });
})();
