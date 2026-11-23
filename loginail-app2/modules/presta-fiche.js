/* ===== 22/11 (Marie, D80) : la fiche d'une prestation =====
   Son prix (à partir de / fixe / sur devis), « C'est quoi ? » avec un texte proposé, et des photos si elle veut.
   contenu.js garde l'enregistrement de la liste (D79) et appelle __prestaFiche. Les photos ne partent qu'au moment d'enregistrer. */
(function () {
  const K = window.LOGI_PRESTA, SEAU = "photos-sites";
  let F = null;   /* la fiche ouverte */
  const st = document.createElement("style");
  st.textContent = `#E .pf-types{display:flex;gap:6px}
#E .pf-types button{flex:1;min-width:0;height:44px;padding:0 4px;border:1px solid rgba(30,28,27,.12);border-radius:99px;background:#fff;color:inherit;font:inherit;font-size:13px;white-space:nowrap;cursor:pointer;transition:background .18s,color .18s,transform .12s}
#E .pf-types button:active{transform:scale(.97)}
#E .pf-types button.on{background:var(--v-fonce,#1E1C1B);color:#fff;border-color:transparent}
#E .pf-prix{margin-top:10px}
#E .pf-prix[hidden],#E .pf-propose[hidden],#E .pf-plus[hidden]{display:none!important}
#E .pf-lab{display:flex;justify-content:space-between;align-items:baseline;gap:10px;margin:14px 0 5px;font-size:12px;color:#776D64;text-align:left}
#E .pf-lab em{font-style:normal}
#E textarea.pf-texte{display:block;box-sizing:border-box;width:100%;height:96px;margin:0;padding:10px 13px;border:1px solid rgba(30,28,27,.12);border-radius:14px;background:#fff;color:inherit;font:inherit;font-size:16px;line-height:1.35;resize:none;outline:0}
#E .pf-propose{display:block;width:100%;margin-top:6px;padding:9px 12px;border:0;border-radius:14px;background:var(--v-rose,#F5E6E4);color:inherit;font:inherit;font-size:12.5px;line-height:1.35;text-align:left;cursor:pointer}
#E .pf-propose b{display:block;font-weight:500;margin-bottom:2px}
#E .pf-photos{display:flex;flex-wrap:wrap;gap:10px;padding-top:6px}
#E .pf-ph,#E .pf-plus{position:relative;flex:none;width:64px;height:64px;box-sizing:border-box}
#E .pf-ph img{width:100%;height:100%;object-fit:cover;border-radius:13px}
#E .pf-ph button{position:absolute;right:-13px;top:-13px;width:38px;height:38px;border:0;padding:0;background:none;display:grid;place-items:center;cursor:pointer}
#E .pf-ph button i{width:22px;height:22px;border-radius:50%;background:var(--v-fonce,#1E1C1B);color:#fff;font:normal 400 14px/22px Jost,sans-serif;text-align:center}
#E .pf-plus{border:1.5px dashed rgba(30,28,27,.3);border-radius:13px;background:none;color:inherit;font:inherit;font-size:24px;cursor:pointer}
#E .pf-vu{margin-top:14px;padding:11px 13px;border-radius:16px;background:var(--v-rose,#F5E6E4);text-align:left}
#E .pf-vu>small{display:block;font-size:11.5px;color:#776D64;margin-bottom:4px}
#E .pf-vu>b{display:block;font-weight:500;font-size:14px;overflow-wrap:anywhere}
#E .pf-vu>span{display:block;font-size:13px;margin-top:2px}
#E .pf-vu>div{display:flex;gap:10px;margin-top:5px}
#E .pf-vu p{flex:1;min-width:0;margin:0;font-size:12.5px;line-height:1.4;color:#5d4a4d;overflow-wrap:anywhere}
#E .pf-vu img{flex:none;width:50px;height:50px;object-fit:cover;border-radius:11px}
#E .pf-vu img[hidden]{display:none}
/* 23/11 (Marie, D108) : la fiche tient sur l'écran, « Enregistrer » se voit sans descendre (maquettes/presta-enregistrer-2311) */
#E .fc:has(.pf-ligne) h3{font-size:22px;margin:0 0 2px}
#E .fc:has(.pf-ligne) .form{margin-top:8px!important;gap:0}
#E .fc:has(.pf-ligne) .form input{height:42px}
#E .fc:has(.pf-ligne) .pf-lab,#E .fc:has(.pf-ligne) .lab{margin:10px 0 5px!important}
#E .pf-ligne{display:flex;gap:8px;align-items:stretch}
#E .pf-ligne .pf-types{flex:1;min-width:0;gap:0;padding:3px;border:1px solid rgba(30,28,27,.12);border-radius:14px;background:#fff;box-sizing:border-box;height:44px}
#E .pf-ligne .pf-types button{height:36px;border:0;border-radius:11px;font-size:12.5px;background:none}
#E .pf-ligne .pf-types button.on{background:var(--v-fonce,#1E1C1B)}
#E .pf-ligne .pf-prix{margin:0;flex:none;width:104px;position:relative}
#E .pf-ligne .pf-prix input{width:100%;height:44px;box-sizing:border-box;padding:0 26px 0 12px;border:1px solid rgba(30,28,27,.12);border-radius:14px;background:#fff;color:inherit;font:inherit;font-size:16px}
#E .pf-ligne .pf-prix span{position:absolute;right:11px;top:50%;transform:translateY(-50%);font-size:15px;color:#776D64;pointer-events:none}
#E .fc:has(.pf-ligne) .chips.ch-dur{gap:6px!important}
#E .fc:has(.pf-ligne) .chips.ch-dur .chip{min-height:0!important;height:38px;padding:0 2px!important;border-radius:12px!important;font-size:13px!important;justify-content:center}
#E .fc:has(.pf-ligne) textarea.pf-texte{height:62px;padding:8px 12px}
#E .pf-magie{display:inline-flex;align-items:center;gap:6px;margin-top:7px;height:32px;padding:0 13px 0 10px;border:0;border-radius:16px;background:var(--v-rose,#F5E6E4);color:#8a2f50;font:inherit;font-size:13px;cursor:pointer;transition:transform .12s}
#E .pf-magie:active{transform:scale(.96)}
#E .pf-magie i{font-style:normal;color:#B03562;font-size:14px;display:inline-block;transition:transform .25s}
#E .pf-magie.tourne i{transform:rotate(72deg) scale(1.15)}
#E textarea.pf-texte.ecrit{animation:pf-ecrit .35s ease-out}
@keyframes pf-ecrit{from{color:transparent}}
#E .pf-phl{display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:8px;margin-top:8px}
#E .pf-phl .pf-lab{margin:0!important}
#E .pf-phl .pf-photos{padding:0;gap:8px}
#E .pf-phl .pf-ph,#E .pf-phl .pf-plus{width:42px;height:42px;font-size:20px}
#E .pf-vu1{margin-top:12px;font-size:12px;color:#776D64;text-align:center;line-height:1.4;overflow-wrap:anywhere}
#E .pf-vu1 b{color:var(--noir,#1E1C1B);font-weight:500}
#E .fc:has(.pf-ligne) [data-cs-ok="presta"]{margin-top:12px!important}
@media (prefers-reduced-motion:reduce){#E textarea.pf-texte.ecrit,#E .pf-magie i{animation:none;transition:none}}`;
  document.head.appendChild(st);

  const montantDe = v => { const s = String(v || "").replace(/[\s€]/g, "").replace(",", "."); return /^\d+(\.\d{1,2})?$/.test(s) ? +s : null; };
  const q = s => E.querySelector(".fc " + s);

  function haut(p, i) {
    const nouvelle = i < 0;
    F = { i, nom: p.nom, type: nouvelle ? p.typePrix || "des" : K.type(p), choisi: !nouvelle || !!p.typePrix,   /* 23/11 : un petit plus « Déjà écrit » arrive en prix fixe */
      texteTouche: !nouvelle, avant: K.photos(p), photos: K.photos(p).map(url => ({ url })) };
    const t = (id, mot) => `<button type="button" data-pf-t="${id}" class="${F.type === id ? "on" : ""}" aria-pressed="${F.type === id}">${mot}</button>`;
    return `<div class="pf-lab"><span>Ton prix</span></div><div class="pf-ligne"><div class="pf-types">${t("des", "À partir de")}${t("fixe", "Fixe")}${t("devis", "Sur devis")}</div>
      <label class="pf-prix"${F.type === "devis" ? " hidden" : ""}><input data-cs-prix value="${p.prix == null ? "" : K.esc(String(p.prix).replace(".", ","))}" placeholder="55" inputmode="decimal" aria-label="Prix en euros"><span>€</span></label></div>`;
  }
  function bas(p) {
    const d = String(p.detail || "").slice(0, K.MAX);
    return `<div class="pf-lab"><span>C’est quoi ? · facultatif</span><em data-pf-n>${d.length} / ${K.MAX}</em></div>
      <textarea class="pf-texte" data-pf-texte maxlength="${K.MAX}" placeholder="En une phrase, ce que ta cliente va avoir.">${K.esc(d)}</textarea>
      <button type="button" class="pf-magie" data-pf-prop><i>✦</i><span>${d.trim() ? "Une autre idée" : "Écris-le pour moi"}</span></button>
      <div class="pf-phl"><div class="pf-lab"><span>Photos · facultatif, ${K.MAX_PHOTOS} au plus</span></div><div class="pf-photos">${vignettes()}</div></div><input type="file" accept="image/*" multiple hidden data-pf-file>
      <div class="pf-vu1">Ta cliente verra : <b data-pf-vn>${K.esc(p.nom || "Ta prestation")}</b> · <span data-pf-vp>${K.esc(p.nom ? K.meta({ ...p, duree: +p.duree || 60 }) : "")}</span></div>`;
  }
  function vignettes() {
    return F.photos.map((p, k) => `<div class="pf-ph"><img src="${K.esc(p.url)}" alt=""><button type="button" data-pf-x="${k}" aria-label="Retirer la photo"><i>×</i></button></div>`).join("")
      + `<button type="button" class="pf-plus" data-pf-plus aria-label="Ajouter une photo"${F.photos.length >= K.MAX_PHOTOS ? " hidden" : ""}>+</button>`;
  }
  function maj() {
    if (!F || !q("[data-pf-texte]")) return;
    const nom = q("[data-cs-nom]").value.trim(), zone = q("[data-pf-texte]"), prop = (K.proposeTous ? K.proposeTous(nom)[0] : K.propose(nom)) || "";
    if (!F.choisi && nom) F.type = K.typeConseille(nom);
    if (!F.texteTouche) zone.value = prop;   /* nouvelle prestation : le texte s'écrit tout seul */
    E.querySelectorAll(".fc [data-pf-t]").forEach(b => { const on = b.dataset.pfT === F.type; b.classList.toggle("on", on); b.setAttribute("aria-pressed", on); });
    q(".pf-prix").hidden = F.type === "devis";
    const m = montantDe(q("[data-cs-prix]").value), d = q("[data-cs-d].on");
    q("[data-pf-n]").textContent = `${zone.value.length} / ${K.MAX}`;
    q("[data-pf-prop] span").textContent = zone.value.trim() ? "Une autre idée" : "Écris-le pour moi";
    q("[data-pf-vn]").textContent = nom || "Ta prestation";
    q("[data-pf-vp]").textContent = F.type !== "devis" && m == null ? "Il manque le prix"
      : K.meta({ duree: d ? +d.dataset.csD : 60, prix: F.type === "devis" ? null : m, typePrix: F.type });
  }

  addEventListener("click", e => {
    if (!F || !e.target.closest || !q("[data-pf-texte]")) return;
    const t = e.target.closest("[data-pf-t],[data-pf-prop],[data-pf-x],[data-pf-plus]");
    if (!t) { if (e.target.closest("[data-cs-d]")) setTimeout(maj); return; }
    e.preventDefault(); e.stopPropagation();
    if (t.dataset.pfT) { F.type = t.dataset.pfT; F.choisi = true; }
    else if (t.hasAttribute("data-pf-prop")) {
      const z = q("[data-pf-texte]"), l = K.proposeTous ? K.proposeTous(q("[data-cs-nom]").value) : [K.propose(q("[data-cs-nom]").value)].filter(Boolean);
      if (l.length) { const k = l.indexOf(z.value.trim()); z.value = l[k < 0 && !z.value.trim() ? 0 : (k + 1) % l.length]; }
      F.texteTouche = true; z.classList.remove("ecrit"); void z.offsetWidth; z.classList.add("ecrit");
      t.classList.add("tourne"); setTimeout(() => t.classList.remove("tourne"), 260);
    }
    else if (t.hasAttribute("data-pf-plus")) return q("[data-pf-file]").click();
    else { F.photos.splice(+t.dataset.pfX, 1); q(".pf-photos").innerHTML = vignettes(); }
    maj();
  }, true);
  document.addEventListener("input", e => {
    if (!F || !e.target.matches("[data-cs-nom],[data-cs-prix],[data-pf-texte]")) return;
    if (e.target.matches("[data-pf-texte]")) F.texteTouche = true;
    maj();
  });
  document.addEventListener("change", async e => {
    if (!F || !e.target.matches("[data-pf-file]")) return;
    const fiche = F, fs = [...e.target.files].slice(0, K.MAX_PHOTOS - F.photos.length); e.target.value = "";
    let rate = 0;
    for (const f of fs) {
      try { const d = await K.reduit(f, 1000, 330000); if (fiche.photos.length < K.MAX_PHOTOS) fiche.photos.push({ url: d, neuve: true }); } catch (err) { rate++; }
    }
    if (fiche !== F || !q(".pf-photos")) return;
    q(".pf-photos").innerHTML = vignettes(); maj();
    if (rate) dit("Cette photo ne s’ouvre pas, essaies-en une autre");
  });

  /* le chemin d'une photo à elle dans le coffre (rien d'autre ne peut être effacé) */
  const chemin = u => { const m = String(u).match(/\/photos-sites\/([^?#]+)/); return m && S.user && m[1].startsWith(S.user.id + "/") ? m[1] : null; };
  async function efface(urls) {
    const l = (urls || []).map(chemin).filter(Boolean); if (!l.length) return;
    try { await sb.storage.from(SEAU).remove(l); } catch (e) { console.warn(e); }
  }
  /* → { erreur } ou { champs, menage } ; contenu.js écrit la liste, puis appelle menage() */
  async function prepare() {
    const f = F; if (!f || !q("[data-pf-texte]")) return { erreur: "Rouvre la prestation" };
    const prix = f.type === "devis" ? null : montantDe(q("[data-cs-prix]").value), detail = q("[data-pf-texte]").value.trim().slice(0, K.MAX);
    if (f.type !== "devis" && prix == null) return { erreur: "Écris ton prix, ou touche « Sur devis »" };
    const gardees = f.photos.slice(), neuves = gardees.filter(p => p.neuve), envoyees = [], urls = [];
    if (neuves.length && navigator.onLine === false) return { erreur: "Pas de connexion : réessaie avec internet" };
    try {
      for (const p of gardees) {
        if (!p.neuve) { urls.push(p.url); continue; }
        const ch = `${S.user.id}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.jpg`, seau = sb.storage.from(SEAU);
        const { error } = await seau.upload(ch, K.enBlob(p.url), { contentType: "image/jpeg", cacheControl: "31536000", upsert: false });
        if (error) throw error;
        const u = seau.getPublicUrl(ch).data.publicUrl; envoyees.push(u); urls.push(u);
      }
    } catch (err) { console.error(err); await efface(envoyees); return { erreur: "La photo n’est pas passée, réessaie" }; }
    return { champs: { prix, typePrix: f.type === "devis" ? null : f.type, detail, photosPresta: urls },
      menage: () => efface(f.avant.filter(u => !urls.includes(u))), annule: () => efface(envoyees) };
  }
  /* supprimer son compte : toutes ses photos partent avec (RGPD) — celles du site, et celles de ses clientes
     rangées dans photos-clientes/<elle>/<cliente>/ (les lignes partent toutes seules, pas les fichiers) */
  async function effaceClientes() {
    const seau = sb.storage.from("photos-clientes"), moi = S.user.id, dossiers = [];
    for (let de = 0; de < 10000; de += 100) {
      const { data, error } = await seau.list(moi, { limit: 100, offset: de }); if (error) throw error;
      (data || []).forEach(x => dossiers.push(x));
      if (!data || data.length < 100) break;
    }
    for (const d of dossiers) {
      const base = `${moi}/${d.name}`;
      if (d.id) { const { error } = await seau.remove([base]); if (error) throw error; continue; }   /* un fichier */
      for (let n = 0; n < 100; n++) {
        const { data, error } = await seau.list(base, { limit: 100 }); if (error) throw error;
        if (!data || !data.length) break;
        const r = await seau.remove(data.map(x => `${base}/${x.name}`)); if (r.error) throw r.error;
      }
    }
  }
  async function effaceTout() {
    try { await effaceClientes(); } catch (e) { console.warn(e); return false; }
    try {
      const seau = sb.storage.from(SEAU);
      for (let n = 0; n < 10; n++) {
        const { data, error } = await seau.list(S.user.id, { limit: 100 }); if (error) return false; if (!data || !data.length) return true;
        const r = await seau.remove(data.map(x => `${S.user.id}/${x.name}`)); if (r.error) return false;
      }
      return true;
    } catch (e) { console.warn(e); return false; }
  }
  window.__prestaFiche = { haut, bas, prepare, efface, effaceTout };
})();
