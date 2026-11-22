/* ===== 22/11 (Marie : « oui, une seule ») : UNE seule liste de prestations =====
   La liste du site (sites.donnees.prestations) fait foi : c'est celle que les clientes réservent. Réglages, l'agenda et Mon site la lisent (app2.js).
   L'ancienne liste de Réglages (table « prestations ») n'est plus modifiée et n'est jamais effacée : les anciens rendez-vous pointent dessus.
   Là où elle ne disait pas comme le site, on ne devine pas : la prothésiste choisit, une seule fois.
   donnees.listeUnique = les numéros des anciennes lignes déjà réglées (identiques, ou choisies). Rien n'est écrit tant qu'elle ne touche à rien. */
(function () {
  const nomDe = v => String(v || "Prestation").trim();
  const motsDe = v => nomDe(v).toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").split(/[^\p{L}\p{N}]+/u).filter(Boolean);
  const renommee = (t, p) => { const a = motsDe(t.nom), b = motsDe(p.nom); return !!a.length && !!b.length && (a.every(m => b.includes(m)) || b.every(m => a.includes(m))); };
  const pareil = (t, p) => (+t.duree_min || 60) === (+p.duree || 60) && (prixDe(t.prix) || 0) === (prixDe(p.prix) || 0);

  /* ce qui diffère : { ok : lignes identiques, diff : [{ t : ancienne ligne, i : sa place sur le site, -1 = absente du site }] } */
  function ecarts(b) {
    const site = (b && b.prestations) || [], faites = new Set((b && b.listeUnique) || []), pris = new Set(), ok = [], reste = [], diff = [];
    S.prestations.forEach(t => {
      const i = site.findIndex((p, k) => !pris.has(k) && nomDe(p.nom) === nomDe(t.nom) && pareil(t, p));
      if (i >= 0) { pris.add(i); ok.push(t.id); } else if (!faites.has(t.id)) reste.push(t);
    });
    const place = new Map();
    reste.forEach(t => {
      const i = site.findIndex((p, k) => !pris.has(k) && nomDe(p.nom) === nomDe(t.nom));
      if (i >= 0) { pris.add(i); place.set(t, i); }
    });
    /* ensuite seulement : renommée sur le site (même place, mêmes mots), sinon « L'ajouter » faisait un doublon */
    reste.forEach(t => {
      const k = t.ordre;
      if (!place.has(t) && site[k] && !pris.has(k) && renommee(t, site[k])) {
        pris.add(k);
        if (pareil(t, site[k])) { ok.push(t.id); return; }   /* seulement renommée, même prix, même durée : rien à demander */
        place.set(t, k);
      }
      diff.push({ t, i: place.has(t) ? place.get(t) : -1 });
    });
    return { ok, diff };
  }
  const courant = () => { if (!listeUnique()) return null; const b = brouillon(); return b && b.nom ? b : null; };
  const restants = () => { const b = courant(); return b ? ecarts(b).diff : []; };

  /* contenu.js l'appelle AVANT de changer ou d'enlever une prestation : ce qui était pareil ne reviendra jamais en « différence » */
  window.__listeUnique = { avant(b) { if (!listeUnique() || !S.prestations.length) return; b.listeUnique = [...new Set([...(b.listeUnique || []), ...ecarts(b).ok])]; } };

  const st = document.createElement("style");
  st.textContent = `#E .lu-info{display:flex;align-items:center;gap:12px;width:100%;margin:12px 0;border:0;border-radius:18px;background:var(--v-rose,#F5E6E4);color:inherit;padding:13px 14px;font:inherit;font-size:14px;line-height:1.3;text-align:left;cursor:pointer}
#E .lu-info span{flex:1;min-width:0}#E .lu-info small{display:block;font-size:12px;color:#776D64;margin-top:2px}
#E .lu-info b{flex:none;font-weight:500;color:var(--v-fonce,#1E1C1B)}
#E .lu-c{background:#fff;border-radius:18px;padding:12px;margin-top:10px;text-align:left}
#E .lu-n{font-size:14.5px;line-height:1.3;margin:0 2px 9px;overflow-wrap:anywhere}
#E .lu-n small{display:block;font-size:12px;color:#776D64;margin-top:2px}
#E .lu-ch{display:grid;grid-template-columns:1fr 1fr;gap:8px}
#E .lu-ch button{border:1px solid rgba(30,28,27,.12);border-radius:14px;background:#fff;color:inherit;padding:9px 8px;font:inherit;font-size:13.5px;line-height:1.3;text-align:center;transition:background .18s,color .18s,transform .12s}
#E .lu-ch button:active{transform:scale(.97)}
#E .lu-ch button small{display:block;font-size:11.5px;opacity:.65;margin-bottom:2px}
#E .lu-ch .lu-deux{grid-column:1/-1;min-height:44px;font-size:13px}
#E .lu-ch button.on{background:var(--v-fonce,#1E1C1B);color:#fff;border-color:transparent}`;
  document.head.appendChild(st);

  const bandeau = n => `<button class="lu-info" data-lu="voir"><span>${n} prestation${n > 1 ? "s" : ""} à vérifier<small>Tes deux anciennes listes ne disaient pas pareil</small></span><b>Choisir ›</b></button>`;

  const liste0 = MSF["ms-presta"];
  MSF["ms-presta"] = (...a) => {
    const h = liste0(...a), n = restants().length;
    return n ? h.replace('<div class="liste"', bandeau(n) + '<div class="liste"') : h;
  };
  const acc0 = VUES.acc;
  VUES.acc = () => {
    const h = acc0(), n = restants().length; if (!n) return h;
    const f = document.createElement("div"); f.innerHTML = h;
    const te = f.querySelector(".v-haut-acc .tete") || f.querySelector(".tete");
    if (te) te.insertAdjacentHTML("afterend", bandeau(n)); else f.insertAdjacentHTML("afterbegin", bandeau(n));
    return f.innerHTML;
  };

  function feuille() {
    const b = courant(); if (!b) return;
    const dit2 = (d, p) => `${duree(+d || 60)} · ${prixDe(p) == null ? "sans prix" : euros(prixDe(p))}`;
    ouvre(`<h3>Une seule liste</h3><div class="sous">Pour chacune, touche ce qui est juste. Ça vaudra pour ton agenda et pour ton site.</div>
      ${ecarts(b).diff.map(({ t, i }) => { const p = i >= 0 ? b.prestations[i] : null;
        return `<div class="lu-c" data-id="${esc(t.id)}"><div class="lu-n">${esc(nomDe(p ? p.nom : t.nom))}${p && nomDe(p.nom) !== nomDe(t.nom) ? `<small>Avant : ${esc(nomDe(t.nom))}</small>` : ""}</div><div class="lu-ch">
          <button class="on" data-lu="choix" data-v="site" aria-pressed="true"><small>${p ? "Sur ton site" : "Pas sur ton site"}</small>${p ? dit2(p.duree, p.prix) : "Ne pas l’ajouter"}</button>
          <button data-lu="choix" data-v="ancien" aria-pressed="false"><small>${p ? "Dans Réglages" : "L’ajouter"}</small>${dit2(t.duree_min, t.prix)}</button>${p && nomDe(p.nom) !== nomDe(t.nom) ? '<button class="lu-deux" data-lu="choix" data-v="deux" aria-pressed="false">Ce sont 2 prestations : garder les deux</button>' : ""}</div></div>`; }).join("")}
      <button class="btn" data-lu="ok" style="margin-top:16px">Garder ces choix</button>`);
  }

  document.addEventListener("click", e => {
    const a = e.target.closest && e.target.closest("[data-lu]"); if (!a) return;
    e.stopPropagation(); e.preventDefault();
    if (a.dataset.lu === "voir") {
      /* une recherche en cours s'efface : au retour, elle doit voir toute sa liste (prestations.js) */
      const q = E.querySelector(".fc [data-pr-q]"); if (q && q.value) { q.value = ""; q.dispatchEvent(new Event("input", { bubbles: true })); }
      return feuille();
    }
    if (a.dataset.lu === "choix") {
      a.parentElement.querySelectorAll("button").forEach(x => { x.classList.toggle("on", x === a); x.setAttribute("aria-pressed", x === a); });
      return;
    }
    const b = courant(); if (!b) return;
    /* seulement les lignes qu'elle a vues dans la feuille */
    const choix = new Map([...E.querySelectorAll(".fc .lu-c")].map(c => [c.dataset.id, c.querySelector(".on").dataset.v]));
    const { ok, diff } = ecarts(b);
    b.prestations = b.prestations || [];
    const reglees = [];
    diff.forEach(({ t, i }) => {
      const v = choix.get(String(t.id)); if (!v) return;
      reglees.push(t.id);
      if (v === "site") return;
      const neuf = { duree: +t.duree_min || 60, prix: prixDe(t.prix) };
      if (v === "ancien" && i >= 0) Object.assign(b.prestations[i], neuf);   /* à sa place : la réservation en ligne la retrouve par son numéro */
      else b.prestations.push(Object.assign({ nom: nomDe(t.nom) }, neuf));
    });
    b.listeUnique = [...new Set([...(b.listeUnique || []), ...ok, ...reglees])];
    localStorage.setItem("loginail-brouillon", JSON.stringify(b));   /* part dans le coffre tout seul (pousseSite) */
    rendu(); ouvre(MSF["ms-presta"]()); dit("Une seule liste ✓");
  }, true);
})();
