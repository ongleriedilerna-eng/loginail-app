/* ===== 22/11 (Marie, D80) : chaque prestation s'explique =====
   Le petit texte, la durée à côté du prix, « à partir de », et des photos si elle en veut (version A « petite photo »).
   Un seul fichier pour le site, la réservation, la création et l'appli (copie identique dans loginail-app/loginail-creer).
   Dans sites.donnees.prestations (D79) : detail (140 signes) · typePrix "des" ou "fixe" · photosPresta (3 adresses au plus).
   Sans prix = « Sur devis ». Sans typePrix = prix fixe : rien ne change pour les salons déjà en ligne tant que la pro n'y touche pas. */
(function () {
  const MAX = 140, MAX_PHOTOS = 3;
  const MOTS = { fr: ["à partir de", "Sur devis"], en: ["from", "Price on request"], it: ["a partire da", "Su preventivo"], es: ["desde", "A consultar"], de: ["ab", "Preis auf Anfrage"] };
  const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const sansPrix = p => p.prix == null || String(p.prix).trim() === "";
  const type = p => sansPrix(p) ? "devis" : p.typePrix === "des" ? "des" : "fixe";
  const mots = l => MOTS[l] || MOTS.fr;
  const montant = v => { const n = +String(v).replace(",", "."); return (isNaN(n) ? String(v) : String(Math.round(n * 100) / 100).replace(".", ",")) + "\u00a0€"; };
  const prix = (p, l) => { const t = type(p); return t === "devis" ? mots(l)[1] : (t === "des" ? mots(l)[0] + "\u00a0" : "") + montant(p.prix); };
  const duree = m => m < 60 ? `${m}\u00a0min` : `${Math.floor(m / 60)}\u00a0h${m % 60 ? "\u00a0" + String(m % 60).padStart(2, "0") : ""}`;
  const meta = (p, l) => (+p.duree ? duree(+p.duree) + " · " : "") + prix(p, l);
  const metaHtml = (p, l) => {
    const t = type(p), d = +p.duree ? `<span class="prd-m">${duree(+p.duree)} · </span>` : "";
    return d + (t === "devis" ? esc(mots(l)[1]) : (t === "des" ? `<span class="prd-d">${esc(mots(l)[0])}&nbsp;</span>` : "") + esc(montant(p.prix)));
  };
  /* seulement de vraies adresses d'images : jamais de code glissé dans une adresse */
  const bonne = u => typeof u === "string" && (/^https:\/\/[^\s"'<>]+$/.test(u) || /^(\.\.)?\/(?!\/)[^\s"'<>]+$/.test(u) || /^data:image\/(jpeg|png|webp);base64,[A-Za-z0-9+/=]+$/.test(u));
  const photos = p => (Array.isArray(p.photosPresta) ? p.photosPresta : []).filter(bonne).slice(0, MAX_PHOTOS);
  const corps = p => {
    const d = String(p.detail || "").trim().slice(0, MAX), ph = photos(p); if (!d && !ph.length) return "";
    return `<span class="prd-c"><span class="prd-x">${esc(d)}</span>${ph.length ? `<span class="prd-f" role="button" tabindex="0" aria-label="Voir les photos : ${esc(p.nom)}" data-prd-nom="${esc(p.nom)}" data-prd-u="${esc(JSON.stringify(ph))}">${ph.slice(0, 2).map(u => `<img src="${esc(u)}" alt="" loading="lazy">`).join("")}${ph.length > 1 ? `<i>${ph.length}</i>` : ""}</span>` : ""}</span>`;
  };
  const note = p => type(p) === "fixe" ? "" : "Le prix final dépend du modèle. Il vous est confirmé avant de commencer.";

  /* ---------- les textes proposés : écrits à l'avance, sans IA, rien ne sort du téléphone ---------- */
  const plat = s => String(s || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[-–—_/]+/g, " ").replace(/\s+/g, " ").trim();
  function propose(nom) {
    const n = plat(nom), a = r => r.test(n);
    const pieds = a(/\bpieds?\b|pedicure/), depose = a(/depose|retrait/) && !a(/sans depose/);
    const repose = a(/repose/) && !a(/sans repose/), rempl = a(/remplissage|entretien|retouche/);
    const renfo = a(/semi.*renfor/), semi = a(/\bsemi\b|semi permanent/), gain = a(/gainage|\bbiab\b/), amer = a(/americaine|gel ?x\b|capsule/);
    if (a(/cils|sourcil|epilation|massage|maquillage/)) return "";
    if (depose && repose) return "On retire votre ancienne pose, puis on en refait une nouvelle.";
    if (depose) return renfo ? "On retire votre semi renforcé en douceur, sans refaire de pose."
      : semi ? "On retire votre vernis semi-permanent en douceur, sans en remettre."
      : gain ? "On retire le gel, sans refaire de pose. Vous repartez avec vos ongles naturels."
      : amer ? "On retire vos capsules en douceur, sans refaire de pose."
      : "On retire votre pose en douceur, sans en refaire une.";
    if (rempl) return gain ? "Vous avez déjà un gainage : on comble la repousse et on remet le gel à niveau."
      : renfo ? "Vous avez déjà un semi renforcé : on comble la repousse et on refait le vernis."
      : "Vous avez déjà une pose : on comble la repousse et on la remet à neuf.";
    if (a(/carte blanche|freestyle/)) return "Vous me laissez imaginer vos ongles de A à Z, selon vos goûts.";
    if (a(/reparation|ongle casse/)) return "On refait un ongle cassé ou abîmé, assorti au reste de votre pose.";
    if (renfo) return "Un gel souple sous le vernis semi-permanent, pour des ongles naturels plus solides.";
    if (semi) return pieds ? "Un vernis séché sous lampe sur les ongles de pieds, qui tient plusieurs semaines."
      : "Un vernis séché sous lampe sur vos ongles naturels, qui tient plusieurs semaines. Sans rallongement.";
    if (gain) return "Une couche de gel sur vos ongles naturels, pour les solidifier sans les rallonger.";
    if (amer) return "Des capsules souples qui couvrent tout l’ongle, pour le rallonger et lui donner la forme de votre choix.";
    if (a(/chablon/)) return "Un rallongement sculpté à la main sur un gabarit, à la forme et à la longueur de votre choix.";
    if (a(/acryl|resine|poly ?gel|acry ?gel/)) return "Une matière solide modelée sur l’ongle, pour le renforcer ou le rallonger.";
    if (a(/baby ?boomer/)) return "Un dégradé doux du rose au blanc, pour un effet naturel et chic.";
    if (a(/french/)) return a(/pose/) ? "Une pose avec le bout de l’ongle dessiné en blanc ou en couleur." : "Le bout de l’ongle dessiné en blanc ou en couleur, en plus de votre pose.";
    if (a(/nail ?art|\bdeco|strass|charms?\b|paillette|chrome/)) return "Un décor en plus de votre pose : dessins, strass, charms… Le prix dépend du modèle.";
    if (a(/extension|rallongement/)) return "On rallonge vos ongles, à la forme et à la longueur de votre choix.";
    if (a(/pose/) && a(/\bgel\b/)) return "Du gel posé sur l’ongle, pour le renforcer ou le rallonger, avec la couleur de votre choix.";
    if (pieds) return "Le soin de vos pieds : ongles mis en forme et cuticules soignées.";
    if (a(/manucure|beaute des mains|soin des mains/)) return "Le soin de vos mains : ongles mis en forme et cuticules soignées.";
    if (a(/vernis/)) return "Une couleur de votre choix, posée avec soin sur vos ongles naturels.";
    return "";
  }
  /* « en général c'est à partir de » (Marie) : proposé partout, sauf déposes et soins, qui ont un prix fixe */
  const typeConseille = nom => { const n = plat(nom);
    return (/depose|retrait/.test(n) && !/ repose/.test(n.replace("sans repose", ""))) || /manucure|beaute des|soin des/.test(n) ? "fixe" : "des"; };

  /* ---------- les photos : réduites ici, et le lieu où elles ont été prises ne part pas avec (l'image est redessinée) ---------- */
  const reduit = (fichier, cote, limite) => new Promise((ok, ko) => {
    const u = URL.createObjectURL(fichier), im = new Image();
    im.onerror = () => { URL.revokeObjectURL(u); ko(new Error("image")); };
    im.onload = () => {
      URL.revokeObjectURL(u);
      for (let c = cote; c >= 120; c = Math.round(c * .8)) {
        const k = Math.min(1, c / Math.max(im.width, im.height)), cv = document.createElement("canvas");
        cv.width = Math.max(1, Math.round(im.width * k)); cv.height = Math.max(1, Math.round(im.height * k));
        const x = cv.getContext("2d"); x.fillStyle = "#fff"; x.fillRect(0, 0, cv.width, cv.height); x.drawImage(im, 0, 0, cv.width, cv.height);
        for (const q of [.82, .7, .58]) { const d = cv.toDataURL("image/jpeg", q); if (d.length <= limite) return ok(d); }
      }
      ko(new Error("lourde"));
    };
    im.src = u;
  });
  const enBlob = d => { const b = atob(d.split(",")[1]), o = new Uint8Array(b.length); for (let i = 0; i < b.length; i++) o[i] = b.charCodeAt(i); return new Blob([o], { type: "image/jpeg" }); };

  /* ---------- le dessin ---------- */
  const st = document.createElement("style");
  st.textContent = `
.ecran .pk .pk-t.prd-t,.ecran.ecrin .e-presta .pk .pk-t.prd-t{display:block!important;padding:14px 2px!important;text-align:left}
.ecran .pf-l.prd-t{display:block!important;text-align:left}
.ecran .prd-t>b,.ecran .prd-t>.pp{display:block!important;width:auto!important;text-transform:none!important;letter-spacing:0!important;overflow-wrap:anywhere}
.ecran .pf-l.prd-t>b{font-weight:400;font-size:14.5px;line-height:1.3}
.ecran .prd-t>.pp{margin:4px 0 0!important;text-align:left;white-space:normal!important;font-size:15px!important}
.ecran .prd-t>.x-trait{display:none!important}
.prd-m,.prd-d{font-weight:400;font-size:12.5px;text-transform:none!important;letter-spacing:0!important}
.prd-m{opacity:.85}
.prd-c{display:flex;gap:10px;align-items:flex-start;min-width:0;margin-top:6px}
.prd-x{flex:1;min-width:0;font:400 13px/1.42 Jost,sans-serif;color:inherit;opacity:.88;text-align:left;text-transform:none!important;letter-spacing:0!important;overflow-wrap:anywhere}
.prd-f{position:relative;isolation:isolate;flex:none;display:block;width:60px;height:60px;margin:0 6px 4px 0;cursor:zoom-in;transition:transform .14s}
.prd-f:active{transform:scale(.94)}
html body .prd-f img,html body .ecran .defile .sec .prd-f img{display:block!important;position:absolute!important;inset:0!important;width:100%!important;height:100%!important;min-height:0!important;max-height:100%!important;max-width:100%!important;margin:0!important;object-fit:cover!important;border-radius:13px!important;box-shadow:0 0 0 2px rgba(255,255,255,.85)}
html body .prd-f img+img{transform:rotate(7deg) translate(3px,-1px);z-index:-1}
.prd-f i{position:absolute;right:-5px;bottom:-5px;min-width:22px;height:22px;border-radius:11px;display:grid;place-items:center;background:#fff;color:#1E1C1B!important;font:normal 500 12px Jost,sans-serif;box-shadow:0 2px 6px rgba(0,0,0,.2)}
.prd-v{position:absolute;inset:0;z-index:120;display:flex;flex-direction:column;justify-content:center;background:rgba(18,12,13,.96);color:#fff;font:400 14px Jost,sans-serif;opacity:0;pointer-events:none;transition:opacity .2s}
.prd-v.on{opacity:1;pointer-events:auto}
.prd-v .prd-g{display:flex;width:100%;overflow-x:auto;scroll-snap-type:x mandatory;scrollbar-width:none}
.prd-v .prd-g img{flex:none;width:100%;height:62vh;object-fit:contain;scroll-snap-align:center}
.prd-v p{margin:18px 24px 0;text-align:center;line-height:1.45;overflow-wrap:anywhere}
.prd-v button{position:absolute;top:calc(env(safe-area-inset-top) + 18px);right:16px;width:44px;height:44px;border:0;border-radius:50%;background:rgba(255,255,255,.16);color:#fff;font:300 26px Jost,sans-serif;cursor:pointer}
@media (prefers-reduced-motion:reduce){.prd-f,.prd-v{transition:none}}`;
  document.head.appendChild(st);

  /* ---------- toucher une photo l'agrandit, ça ne réserve pas ---------- */
  let vue = null, depart = null;
  const ferme = () => vue && vue.classList.remove("on");
  function montre(f) {
    let l = []; try { l = JSON.parse(f.dataset.prdU).filter(bonne); } catch (e) { return; }
    if (!vue || !vue.isConnected) {
      vue = document.createElement("div"); vue.className = "prd-v"; vue.setAttribute("role", "dialog"); vue.setAttribute("aria-label", "Photos de la prestation");
      (document.querySelector(".tel") || document.body).appendChild(vue);
      /* descendre le doigt referme, comme sur iPhone */
      vue.addEventListener("touchstart", e => { depart = [e.touches[0].clientX, e.touches[0].clientY]; }, { passive: true });
      vue.addEventListener("touchend", e => { if (!depart) return; const x = e.changedTouches[0].clientX - depart[0], y = e.changedTouches[0].clientY - depart[1]; depart = null; if (y > 70 && y > Math.abs(x)) ferme(); }, { passive: true });
    }
    vue.innerHTML = `<div class="prd-g">${l.map(u => `<img src="${esc(u)}" alt="">`).join("")}</div><p>${esc(f.dataset.prdNom)}${l.length > 1 ? " · glissez pour voir les autres" : ""}</p><button type="button" aria-label="Fermer">×</button>`;
    vue.classList.add("on");
  }
  addEventListener("click", e => {
    const t = e.target; if (!t.closest) return;
    if (t.closest(".prd-v")) { e.preventDefault(); e.stopPropagation(); if (!t.closest("img")) ferme(); return; }
    const f = t.closest(".prd-f"); if (f) { e.preventDefault(); e.stopPropagation(); montre(f); }
  }, true);
  addEventListener("keydown", e => {
    if (e.key === "Escape") return ferme();
    const f = (e.key === "Enter" || e.key === " ") && e.target.closest && e.target.closest(".prd-f"); if (f) { e.preventDefault(); e.stopPropagation(); montre(f); }
  }, true);

  window.LOGI_PRESTA = { MAX, MAX_PHOTOS, esc, type, prix, duree, meta, metaHtml, photos, corps, note, propose, typeConseille, reduit, enBlob, mots };
})();
