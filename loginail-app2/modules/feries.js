/* ===== 25/11 (Marie) : les jours fériés dans l'agenda =====
   « Vendredi 25 décembre » → « · Noël » en tout petit, couleur du salon. Partout où on choisit un jour :
   titre de la vue Jour, en-têtes de la vue Semaine, cases de la vue Mois. Pour tous les salons, les 3 styles.
   Les 11 jours fériés de France (Pâques, Ascension et Pentecôte calculés chaque année). Pas les 2 jours en plus d'Alsace-Moselle. */
(() => {
  const st = document.createElement("style");
  st.textContent = `#E .fer-n{display:block;font-size:9.5px;line-height:1.15;font-weight:500;color:var(--v-acc,#B5475E);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:100%;margin-top:1px;letter-spacing:0}
#E .fer-k{color:var(--v-acc,#B5475E);font-weight:500;font-size:.9em}
#E .av-m button.fer-j i{color:var(--v-acc,#B5475E)}`;
  document.head.appendChild(st);

  const paques = an => { const a = an % 19, b = Math.floor(an / 100), c = an % 100, d = Math.floor(b / 4), e = b % 4, f = Math.floor((b + 8) / 25), g = Math.floor((b - f + 1) / 3),
    h = (19 * a + b - d - g + 15) % 30, i = Math.floor(c / 4), k = c % 4, l = (32 + 2 * e + 2 * i - h - k) % 7, m = Math.floor((a + 11 * h + 22 * l) / 451),
    mois = Math.floor((h + l - 7 * m + 114) / 31), jour = ((h + l - 7 * m + 114) % 31) + 1; return new Date(an, mois - 1, jour); };
  const cache = {};
  const liste = an => { if (cache[an]) return cache[an]; const P = paques(an), m = {}, cle = d => (d.getMonth() + 1) + "-" + d.getDate(), plus = n => plusJours(P, n);
    [[new Date(an, 0, 1), "Jour de l’an"], [plus(1), "Lundi de Pâques"], [new Date(an, 4, 1), "Fête du travail"], [new Date(an, 4, 8), "8 mai 1945"],
     [plus(39), "Ascension"], [plus(50), "Lundi de Pentecôte"], [new Date(an, 6, 14), "Fête nationale"], [new Date(an, 7, 15), "Assomption"],
     [new Date(an, 10, 1), "Toussaint"], [new Date(an, 10, 11), "Armistice"], [new Date(an, 11, 25), "Noël"]].forEach(([d, n]) => { m[cle(d)] = n; });
    return (cache[an] = m); };
  const ferie = d => { d = new Date(d); return liste(d.getFullYear())[(d.getMonth() + 1) + "-" + d.getDate()] || ""; };
  window.jourFerie = ferie;

  const ag0 = VUES.ag;
  VUES.ag = () => {
    const h = ag0(), f = document.createElement("div"); f.innerHTML = h;
    /* vue Semaine : sous le jour, dans l'en-tête de la colonne */
    f.querySelectorAll(".av-g .av-tj[data-av-j]").forEach(b => { const n = ferie(b.dataset.avJ); if (n) { b.insertAdjacentHTML("beforeend", `<span class="fer-n">${n}</span>`); b.setAttribute("aria-label", b.getAttribute("aria-label") + " (" + n + ", férié)"); } });
    /* vue Mois : le nom à la place du « 2 rdv » s'il n'y en a pas, sinon dans la bulle d'aide */
    f.querySelectorAll(".av-m button[data-av-j]").forEach(b => { const n = ferie(b.dataset.avJ); if (!n) return; b.classList.add("fer-j"); b.title = n; const i = b.querySelector("i"); if (i && !i.textContent.trim()) i.textContent = n; });
    /* vue Jour : à droite du titre du jour (« Vendredi 25 · Noël ») */
    if (f.querySelector(".pap") || !f.querySelector(".av-g,.av-m")) { const n = ferie(S.jour);
      if (n) { const k = [...f.querySelectorAll(".k")].find(x => new RegExp("\\b" + S.jour.getDate() + "\\b").test(x.textContent));
        if (k) { const tn = [...k.childNodes].find(x => x.nodeType === 3 && x.nodeValue.trim()); const sp = `<span class="fer-k"> · ${n}</span>`;
          if (tn) { const i = tn.nodeValue.indexOf(" · "), avant = i >= 0 ? tn.nodeValue.slice(0, i) : tn.nodeValue, apres = i >= 0 ? tn.nodeValue.slice(i) : "";
            const s = document.createElement("span"); s.innerHTML = esc(avant) + sp + esc(apres); tn.replaceWith(s); }   /* un seul morceau : le titre est en « flex », sinon les 3 bouts s'écartent */
          else k.insertAdjacentHTML("beforeend", sp); } } }
    return f.innerHTML;
  };
})();
