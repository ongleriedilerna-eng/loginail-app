/* ===== 16/11 (Marie, décision D23) : « Partager mes dispos » =====
   En bas de l'Accueil, un bouton fabrique la story Instagram de la semaine (version « Carnet », maquettes/dispos-story.html) :
   le fond, l'écriture du nom et 2 charms de SON site, puis une ligne par jour ouvert avec ses places LIBRES.
   L'image (1080 × 1920) est dessinée dans le téléphone : aucun serveur, 0 €.
   Jamais un prénom ni une prestation de cliente : on ne lit que le début et la fin des rendez-vous.
   Ce fichier est chargé APRÈS vernis.js (il ajoute le bouton sous l'accueil déjà dessiné). */
(function () {
  const W = 1080, H = 1920, K = 3;                        /* la maquette est dessinée en 360 × 640 : tout × 3 */
  const SIGNATURE = ["✦ mon planning s'est fait tout seul · ", "loginail.fr"];
  const PAS = 30, MAX = 6;                                 /* les horaires du site de réservation tombent toutes les 30 min ; plus de 6 → « + N autres » */
  const lit = (k, d) => { try { const v = localStorage.getItem(k); return v == null ? d : v; } catch (e) { return d; } };
  const ecrit = (k, v) => { try { localStorage.setItem(k, v); } catch (e) {} };
  const mn = t => +String(t).slice(0, 2) * 60 + +String(t).slice(3, 5);
  const hTxt = m => Math.floor(m / 60) + "h" + (m % 60 ? String(m % 60).padStart(2, "0") : "");   /* 9h, 14h30 */
  const JC = ["Lun.", "Mar.", "Mer.", "Jeu.", "Ven.", "Sam.", "Dim."];

  /* ---------- 1 · les places libres (horaires d'ouverture − rendez-vous) ---------- */
  const donnees = () => (S.site && S.site.donnees) || brouillon() || {};
  const horaires = () => donnees().horaires || [];
  /* la prestation la plus courte (au moins 30 min : c'est le pas du site de réservation) */
  const dureeMin = () => { const l = (S.prestations.length ? S.prestations.map(p => +p.duree_min) : (donnees().prestations || []).map(p => +p.duree)).filter(x => x > 0);
    return Math.max(PAS, l.length ? Math.min(...l) : 60); };
  /* une période (une semaine ou un mois) : pour chaque jour, ouvert ou fermé, et ses places libres */
  async function periode(de, a) {
    /* on ne demande que l'heure de début, de fin, l'état et s'il y a une cliente (pour reconnaître les congés) : jamais le nom ni la prestation */
    const { data, error } = await sb.from("rendez_vous").select("debut,fin,statut,cliente_id").lt("debut", a.toISOString()).gt("fin", de.toISOString());
    if (error) throw error;
    const pris = (data || []).filter(r => r.statut !== "annule");
    const H = horaires(), dur = dureeMin(), now = new Date(), jours = [];
    for (let d = new Date(de); d < a; d = plusJours(d, 1)) {
      const i = (d.getDay() + 6) % 7, h = H[i], auj = memeJour(d, now);
      if (!h || !h.d || !h.f) { jours.push({ d, i, ferme: true, libres: [] }); continue; }
      const debut = mn(h.d), finJ = mn(h.f), pd = h.pd ? mn(h.pd) : null, pf = h.pf ? mn(h.pf) : null;
      const passe = d < now && !auj;                                       /* jours passés : plus rien à réserver */
      const deja = auj ? now.getHours() * 60 + now.getMinutes() + 60 : -1;   /* comme le site : pas dans l'heure qui vient */
      const occ = pris.map(r => [(new Date(r.debut) - d) / 60000, (new Date(r.fin) - d) / 60000, !r.cliente_id]);   /* en minutes depuis minuit de ce jour (marche aussi pour les congés de plusieurs jours) */
      /* congés : un moment bloqué (sans cliente) couvre toute la journée → comme fermé */
      if (occ.some(z => z[2] && z[0] <= debut && z[1] >= finJ)) { jours.push({ d, i, ferme: true, conges: true, libres: [] }); continue; }
      const libres = [];
      if (!passe) for (let t = debut; t + dur <= finJ; t += PAS) {
        if (pd != null && pf != null && t < pf && t + dur > pd) continue;
        if (t < deja) continue;
        if (occ.some(z => t < z[1] && t + dur > z[0])) continue;
        /* deux places proposées ne se chevauchent jamais (sinon 9h, 9h30, 10h… pour une seule cliente) */
        if (libres.length && t < libres[libres.length - 1] + Math.ceil(dur / PAS) * PAS) continue;
        libres.push(t);
      }
      jours.push({ d, i, passe, libres });
    }
    return jours;
  }
  /* une semaine : seulement les jours ouverts, à partir d'aujourd'hui */
  async function semaine(n) {
    const lun = plusJours(lundiDe(new Date()), 7 * n);
    return { lun, jours: (await periode(lun, plusJours(lun, 7))).filter(j => !j.ferme && !j.passe) };
  }
  /* le mois suivant : tous les jours (le calendrier montre aussi les jours fermés, très effacés) */
  async function mois() {
    const n = new Date(), de = new Date(n.getFullYear(), n.getMonth() + 1, 1), a = new Date(n.getFullYear(), n.getMonth() + 2, 1);
    return { mois: de.getMonth(), an: de.getFullYear(), jours: await periode(de, a) };
  }

  /* ---------- 2 · le site de la pro : fond, écriture du nom, couleur, charms ---------- */
  const COUL = { noir: "#1E1C1B", choco: "#4A3226", marine: "#24344F", taupe: "#5E5149", greige: "#5F574F", beige: "#6B5A43", peche: "#7A5444", sauge: "#4F5A45", sable: "#80633F", nude: "#8A6656", lin: "#6E6253", rose: "#9A5D6B", bleup: "#4F6F93", lilas: "#7B62A8", jaune: "#6A4E1C", menthe: "#3D7A66", abricot: "#B05E3A", ciel: "#2F7BA0", rosep: "#B4587A", poudre: "#9C6B66", framboise: "#A8325A", lavande: "#6A50B0", pechep: "#B8673E", corail: "#C0503A", cerise: "#A01C2E", bordeaux: "#6E1A2C", rougefonce: "#6A1016", rouille: "#8E3B1E", moutarde: "#8A6512", fuchsia: "#B3125F", kaki: "#5E5E3A", sapin: "#2F5A45", anthracite: "#3A3D42", cobalt: "#2F4FC0", bleunuit: "#1F2E5C", prune: "#5E2E54", terracotta: "#A24E2E", caramel: "#8E5A26", vanille: "#8A7230", olive: "#5C5E2A", emeraude: "#1A6648", turquoise: "#237A78", perle: "#55565E", verttendre: "#6B8560", vertdeau: "#4F8574", glycine: "#7A5A8C", lilaspoudre: "#8A6A86", nacre: "#9A6E70", cremedoree: "#8A6B3E", miel: "#8E6420", feuillage: "#6A6E45", mousse: "#5E7454" };
  /* les écritures du nom (les mêmes que loginail-site/options-site.js) : [famille, taille] */
  const POL = { elegante: ["Italiana", 1], manuscrite: ["'Great Vibes'", 1.15], ronde: ["'Bagel Fat One'", .8], retro: ["'Abril Fatface'", .82], calligraphie: ["'Pinyon Script'", 1.05], parisienne: ["Parisienne", 1.05], chic: ["'Playfair Display'", .88], luxe: ["Cinzel", .78], surf: ["Pacifico", .85], seventies: ["Shrikhand", .82], bulle: ["'Rubik Bubbles'", .85], bonbon: ["'Cherry Bomb One'", .85], y2k: ["Monoton", .72], gothique: ["UnifrakturMaguntia", .95], feutre: ["'Permanent Marker'", .85], moderne: ["Jost", .9] };
  const base = () => { const s = document.querySelector('script[src*="fonds-100.js"]'); return s ? s.src.replace(/[^/]*(\?.*)?$/, "") : new URL("loginail-site/", location.href).href; };
  const chargeFonds = () => new Promise(res => { if (window.F100) return res(); addEventListener("f100", () => res(), { once: true });
    if (!document.querySelector('script[src*="fonds-100.js"]')) { const sc = document.createElement("script"); sc.src = "https://loginail.fr/loginail-site/fonds-100.js"; sc.onerror = () => res(); document.head.appendChild(sc); }
    setTimeout(res, 6000); });
  let polOk = null;
  const chargePolices = () => polOk || (polOk = new Promise(res => { const l = document.createElement("link"); l.rel = "stylesheet"; l.href = "loginail-site/polices-sites.css";
    l.onload = l.onerror = () => res(); document.head.appendChild(l);
    const st = document.createElement("style"); st.textContent = ["BagelFatOne-400-latin|Bagel Fat One", "PermanentMarker-400-latin|Permanent Marker"].map(x => { const [f, n] = x.split("|"); return `@font-face{font-family:'${n}';font-display:swap;src:url(loginail-site/polices/${f}.woff2) format('woff2')}`; }).join("");
    document.head.appendChild(st); setTimeout(res, 3000); }));
  /* les fonds récents ne sont pas tous dans la copie rangée avec l'appli : on lit alors ceux du site (loginail.fr les autorise, gratuit) */
  const SITE = "https://loginail.fr/loginail-site/";
  let FD = null, FDok = null;
  const fondsDuSite = () => FD || (FD = fetch(SITE + "fonds-100.js").then(r => r.ok ? r.text() : Promise.reject(r.status)).then(t => {
      const l = t.split("\n").find(x => x.indexOf("window.FONDS100=") === 0), w = {};
      new Function("window", "document", l.replace("window.FONDS100=", "var FONDS100=window.FONDS100="))(w, { currentScript: { src: SITE + "fonds-100.js" } });
      return (FDok = w.FONDS100); }).catch(e => { console.warn("fonds du site", e); FD = null; return null; }));
  const leFond = nom => { if (!nom) return null;
    if (window.F100 && F100.idx[nom] != null) { const i = F100.idx[nom]; return { html: F100.tuile(i), base: base(), sombre: !!FONDS100.f[i][2] }; }
    const x = FDok && FDok.f.find(y => y[0] === nom); return x ? { html: x[1], base: SITE, sombre: !!x[2] } : null; };
  const site = () => { const b = donnees(), fd = leFond(b.fond);
    const sombre = b.mode === "nuit" || !!(fd && fd.sombre);
    const pol = POL[b.police] || POL.manuscrite, acc = COUL[b.nomc] || COUL[b.couleur] || getComputedStyle(document.documentElement).getPropertyValue("--v-acc").trim() || "#B5475E";
    const charms = [...new Set((b.stickers || []).map(c => c && c.n).filter(n => n && n !== "__etoile"))].slice(0, 2);
    return { nom: b.nom || S.profil.nom_salon || "Mon salon", fond: fd, sombre, pol, acc, charms }; };

  /* ---------- 3 · dessiner le fond de son site dans l'image (les fonds sont des couleurs, dégradés, motifs ou photos) ---------- */
  const img = src => new Promise((ok, ko) => { const i = new Image(); if (/^https?:/.test(src) && !src.startsWith(location.origin)) i.crossOrigin = "anonymous"; i.onload = () => ok(i); i.onerror = ko; i.src = src; });
  const coupe = (s, sep) => { const r = []; let n = 0, cur = ""; for (const c of s) { if (c === "(") n++; if (c === ")") n--; if (c === sep && !n) { r.push(cur.trim()); cur = ""; } else cur += c; } if (cur.trim()) r.push(cur.trim()); return r; };
  /* les arrêts de couleur d'un dégradé : [couleur, position (0-1 ou px)] */
  const arrets = (l, long) => { const out = [];
    l.forEach(a => { const m = a.match(/^(.*?)((?:\s+-?[\d.]+(?:%|px))*)$/); const c = m[1].trim(), ps = (m[2].match(/-?[\d.]+(?:%|px)/g) || []).map(p => p.endsWith("%") ? parseFloat(p) / 100 : parseFloat(p) * K / long);
      if (!ps.length) out.push([c, null]); ps.forEach(p => out.push([c, p])); });
    if (out.length && out[0][1] == null) out[0][1] = 0; if (out.length && out[out.length - 1][1] == null) out[out.length - 1][1] = 1;
    for (let i = 1; i < out.length; i++) if (out[i][1] == null) { let j = i; while (out[j][1] == null) j++; const a = out[i - 1][1], b = out[j][1]; for (let k = i; k < j; k++) out[k][1] = a + (b - a) * (k - i + 1) / (j - i + 1); }
    for (let i = 1; i < out.length; i++) out[i][1] = Math.max(out[i][1], out[i - 1][1]);
    return out; };
  const ajoute = (g, l, rep) => { const fin = l[l.length - 1][1]; if (!rep || fin <= 0) { l.forEach(([c, p]) => g.addColorStop(Math.min(1, Math.max(0, p)), c)); return; }
    for (let o = 0; o < 1; o += fin) l.forEach(([c, p]) => { const q = o + p; if (q <= 1) g.addColorStop(q, c); }); };
  function degrade(cx, txt, w, h) {
    const rep = txt.startsWith("repeating-"), rad = /radial/.test(txt), inn = txt.slice(txt.indexOf("(") + 1, txt.lastIndexOf(")")), parts = coupe(inn, ",");
    if (!rad) { let ang = 180; if (/^-?[\d.]+deg$/.test(parts[0])) ang = parseFloat(parts.shift()); else if (/^to /.test(parts[0])) ang = { "to top": 0, "to right": 90, "to bottom": 180, "to left": 270 }[parts.shift()] ?? 180;
      const a = ang * Math.PI / 180, dx = Math.sin(a), dy = -Math.cos(a), L = Math.abs(w * dx) + Math.abs(h * dy);
      const g = cx.createLinearGradient(w / 2 - dx * L / 2, h / 2 - dy * L / 2, w / 2 + dx * L / 2, h / 2 + dy * L / 2);
      ajoute(g, arrets(parts, L), rep); cx.fillStyle = g; cx.fillRect(0, 0, w, h); return; }
    let forme = "ellipse", px = .5, py = .5, taille = null;
    if (/(^|\s)(circle|ellipse|at)\b/.test(parts[0]) || /px/.test(parts[0]) && !/[#(]/.test(parts[0])) { const t = parts.shift(); if (/circle/.test(t)) forme = "circle";
      const at = t.split(" at ")[1]; if (at) { const v = at.trim().split(/\s+/); const val = (s, tot) => s.endsWith("%") ? parseFloat(s) / 100 : s.endsWith("px") ? parseFloat(s) * K / tot : { left: 0, top: 0, center: .5, right: 1, bottom: 1 }[s] ?? .5; px = val(v[0], w); py = val(v[1] || "center", h); }
      const sz = t.split(" at ")[0].match(/[\d.]+px/g); if (sz) taille = sz.map(x => parseFloat(x) * K); }
    const cxp = px * w, cyp = py * h, sx = Math.max(cxp, w - cxp), sy = Math.max(cyp, h - cyp);
    let rx, ry; if (taille) { rx = taille[0]; ry = taille[1] || taille[0]; } else if (forme === "circle") rx = ry = Math.hypot(sx, sy); else { rx = sx * Math.SQRT2; ry = sy * Math.SQRT2; }
    cx.save(); cx.translate(cxp, cyp); cx.scale(1, ry / rx); const g = cx.createRadialGradient(0, 0, 0, 0, 0, rx); ajoute(g, arrets(parts, rx), rep);
    cx.fillStyle = g; cx.fillRect(-cxp, -cyp * rx / ry, w, h * rx / ry); cx.restore(); }
  async function image(cx, url, taille, pos, w, h, b0) {
    let src = url.replace(/^url\((['"]?)(.*)\1\)$/, "$2"), vecto = src.startsWith("data:image/svg");
    if (!vecto && !/^(https?:|data:|blob:)/.test(src)) src = (b0 || base()) + src;
    if (vecto) { /* un motif dessiné : on le refait à la bonne taille pour qu'il reste net */
      let s = decodeURIComponent(src.slice(src.indexOf(",") + 1)); const tete = s.match(/<svg[^>]*>/)[0], lw = tete.match(/\swidth="([\d.]+)/), lh = tete.match(/\sheight="([\d.]+)/), vb = tete.match(/viewBox="[\d.\s-]*?\s([\d.]+)\s([\d.]+)"/);
      let tw, th; const iw = lw ? +lw[1] : vb ? +vb[1] : 100, ih = lh ? +lh[1] : vb ? +vb[2] : 100;
      if (taille === "cover" || (!lw && !lh)) { tw = w; th = h; } else { const m = (taille || "auto").match(/^([\d.]+)px/); tw = m ? +m[1] * K : iw * K; th = tw * ih / iw; }
      let t2 = tete.replace(/\s(width|height)="[^"]*"/g, ""); if (!vb) t2 = t2.replace("<svg", `<svg viewBox="0 0 ${iw} ${ih}"`); t2 = t2.replace("<svg", `<svg width="${Math.round(tw)}" height="${Math.round(th)}"`);
      s = s.replace(tete, t2); const im = await img("data:image/svg+xml;charset=utf-8," + encodeURIComponent(s));
      if (tw >= w && th >= h) { cx.drawImage(im, (w - tw) / 2, (h - th) / 2, tw, th); return; }
      const t = document.createElement("canvas"); t.width = Math.max(1, Math.round(tw)); t.height = Math.max(1, Math.round(th)); t.getContext("2d").drawImage(im, 0, 0, t.width, t.height);
      const p = cx.createPattern(t, "repeat"), ox = pos === "center" ? ((w - t.width) / 2) % t.width : 0, oy = pos === "center" ? ((h - t.height) / 2) % t.height : 0;
      cx.save(); cx.translate(ox, oy); cx.fillStyle = p; cx.fillRect(-ox, -oy, w, h); cx.restore(); return; }
    const im = await img(src);
    if (taille === "cover" || !taille || taille === "auto") { const k = taille === "cover" || !taille ? Math.max(w / im.naturalWidth, h / im.naturalHeight) : 1.5;
      if (taille === "cover" || !taille) { cx.drawImage(im, (w - im.naturalWidth * k) / 2, (h - im.naturalHeight * k) / 2, im.naturalWidth * k, im.naturalHeight * k); return; }
      const t = document.createElement("canvas"); t.width = im.naturalWidth * k; t.height = im.naturalHeight * k; t.getContext("2d").drawImage(im, 0, 0, t.width, t.height); cx.fillStyle = cx.createPattern(t, "repeat"); cx.fillRect(0, 0, w, h); return; }
    const m = taille.match(/^([\d.]+)px/), tw = m ? +m[1] * K : im.naturalWidth, th = tw * im.naturalHeight / im.naturalWidth, t = document.createElement("canvas"); t.width = tw; t.height = th; t.getContext("2d").drawImage(im, 0, 0, tw, th);
    cx.fillStyle = cx.createPattern(t, "repeat"); cx.fillRect(0, 0, w, h); }
  async function fond(cx, s) {
    const teinte = getComputedStyle(document.documentElement), h1 = teinte.getPropertyValue("--v-h1").trim() || "#F2D7D6", h2 = teinte.getPropertyValue("--v-h2").trim() || "#F7ECEA";
    const doux = () => { const g = cx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, h1); g.addColorStop(1, h2); cx.fillStyle = g; cx.fillRect(0, 0, W, H); };
    doux(); if (!s.fond) return;
    const html = s.fond.html, st = ((html.match(/class="tuile[^"]*"\s+style="([^"]*)"/) || [])[1] || "").replace(/&quot;/g, '"').replace(/&amp;/g, "&");
    const P = {}; coupe(st, ";").forEach(d => { const k = d.indexOf(":"); if (k > 0) P[d.slice(0, k).trim()] = d.slice(k + 1).trim(); });
    if (P.background && !P["background-image"]) { if (/^(#|rgb)/.test(P.background)) P["background-color"] = P.background; else P["background-image"] = P.background; }
    if (P["background-color"]) { cx.fillStyle = P["background-color"]; cx.fillRect(0, 0, W, H); }
    const couches = P["background-image"] && P["background-image"] !== "none" ? coupe(P["background-image"], ",").reverse() : [];
    const tailles = coupe(P["background-size"] || "auto", ",").reverse(), pos = (P["background-position"] || "").trim();
    for (let n = 0; n < couches.length; n++) { const c = couches[n], t = tailles[n] || tailles[0];
      try { if (/gradient\(/.test(c)) degrade(cx, c, W, H); else if (/^url\(/.test(c)) await image(cx, c, t, pos, W, H, s.fond.base); } catch (e) { console.warn("fond", e); } } }

  /* ---------- 4 · la story « Carnet » ---------- */
  const rond = (cx, x, y, w, h, r) => { cx.beginPath(); cx.moveTo(x + r, y); cx.arcTo(x + w, y, x + w, y + h, r); cx.arcTo(x + w, y + h, x, y + h, r); cx.arcTo(x, y + h, x, y, r); cx.arcTo(x, y, x + w, y, r); cx.closePath(); };
  const pilule = (cx, txt, cxm, y, gras) => { cx.font = `400 ${12 * K}px Jost, sans-serif`; let w = 0; txt.forEach((t, i) => { cx.font = `${i === txt.length - 1 && gras ? 500 : 400} ${12 * K}px Jost, sans-serif`; w += cx.measureText(t).width; });
    const pw = w + 26 * K, ph = 27 * K, x = cxm - pw / 2; cx.fillStyle = "rgba(30,20,22,.58)"; rond(cx, x, y, pw, ph, ph / 2); cx.fill();
    cx.fillStyle = "#fff"; cx.textBaseline = "middle"; let xx = x + 13 * K; txt.forEach((t, i) => { cx.font = `${i === txt.length - 1 && gras ? 500 : 400} ${12 * K}px Jost, sans-serif`; cx.textAlign = "left"; cx.fillText(t, xx, y + ph / 2 + 1); xx += cx.measureText(t).width; }); };
  const melange = (a, b, t) => { const p = c => { c = c.replace("#", ""); if (c.length === 3) c = c.replace(/./g, "$&$&"); return [0, 2, 4].map(i => parseInt(c.substr(i, 2), 16)); };
    try { const x = p(a), y = p(b); return "rgb(" + x.map((v, i) => Math.round(v + (y[i] - v) * t)).join(",") + ")"; } catch (e) { return a; } };
  /* ---------- 4 bis · la story du MOIS : même carte Carnet, un calendrier lundi → dimanche ---------- */
  const charmSur = async (cx, n, x, y, w, r) => { try { const im = await img(base() + "charms/" + n + ".png").catch(() => img(SITE + "charms/" + n + ".png")), h = w * im.naturalHeight / im.naturalWidth; cx.save(); cx.translate(x + w / 2, y + h / 2); cx.rotate(r * Math.PI / 180);
      cx.shadowColor = "rgba(0,0,0,.25)"; cx.shadowBlur = 8 * K; cx.shadowOffsetY = 6 * K; cx.drawImage(im, -w / 2, -h / 2, w, h); cx.restore(); return true; } catch (e) { return false; } };
  const etoileSur = (cx, x, y, sz) => { cx.save(); cx.font = `${sz}px 'Cormorant Garamond', serif`; cx.fillStyle = "#fff"; cx.textAlign = "center"; cx.textBaseline = "middle"; cx.shadowColor = "rgba(0,0,0,.3)"; cx.shadowBlur = 12; cx.fillText("✦", x, y); cx.restore(); };
  async function dessineMois(cx, c, s, per, col) {
    const { t, a, carte, pil } = col, TOP = 270, CB_MAX = 1250, X = 22 * K, CW = W - 2 * X, PX = 14 * K;
    const nomM = MOIS[per.mois], dec = (new Date(per.an, per.mois, 1).getDay() + 6) % 7, rangs = Math.ceil((dec + per.jours.length) / 7);
    const total = per.jours.reduce((n, j) => n + j.libres.length, 0);
    const astuce = !total ? "tout est déjà pris ce mois-ci ♡" : per.mois === 11 ? "les fêtes partent vite ♡" : "réserve vite ta place ♡";
    const police = fs => `400 ${fs}px ${s.pol[0]}, 'Great Vibes', cursive`;
    const nom = k => { const max = CW - 2 * PX; let fs = 32 * K * k * s.pol[1]; cx.font = police(fs); while (cx.measureText(s.nom).width > max && fs > 22 * K * k * s.pol[1]) { fs -= 2; cx.font = police(fs); }
      if (cx.measureText(s.nom).width <= max) return { l: [s.nom], fs };
      const m = s.nom.split(" "); let best = [s.nom], e = 1e9; for (let i = 1; i < m.length; i++) { const x = [m.slice(0, i).join(" "), m.slice(i).join(" ")], d = Math.max(...x.map(y => cx.measureText(y).width)); if (d < e) { e = d; best = x; } }
      while (Math.max(...best.map(y => cx.measureText(y).width)) > max && fs > 14 * K * k) { fs -= 2; cx.font = police(fs); } return { l: best, fs }; };
    const haut = k => { const N = nom(k); return { N, CH: 18 * K * k + N.l.length * N.fs * 1.05 + (6 + 32 + 14 + 14) * K * k + rangs * 38 * K * k + (12 + 13 + 8 + 18 + 14) * K * k }; };
    let k = 1, L = haut(1); for (let n = 0; n < 12 && TOP + L.CH > CB_MAX && k > .6; n++) { k = Math.max(.6, k * (CB_MAX - TOP) / L.CH - .005); L = haut(k); }
    const CH = L.CH, CB = TOP + CH;
    cx.save(); cx.shadowColor = "rgba(30,20,22,.28)"; cx.shadowBlur = 40; cx.shadowOffsetY = 18; cx.fillStyle = carte; rond(cx, X, TOP, CW, CH, 26 * K); cx.fill(); cx.restore();
    cx.textAlign = "center"; cx.textBaseline = "alphabetic"; let y = TOP + 18 * K * k; cx.font = police(L.N.fs); cx.fillStyle = a;
    L.N.l.forEach(l => { y += L.N.fs * 1.05; cx.fillText(l, W / 2, y - L.N.fs * .18); });
    y += 6 * K * k;
    /* « Mes dispos de » + le mois en italique, dans la couleur du site */
    const f1 = `500 ${32 * K * k}px 'Cormorant Garamond', Georgia, serif`, f2 = `italic 500 ${32 * K * k}px 'Cormorant Garamond', Georgia, serif`, p1 = "Mes dispos de ";
    cx.font = f1; const w1 = cx.measureText(p1).width; cx.font = f2; const w2 = cx.measureText(nomM).width, x0 = W / 2 - (w1 + w2) / 2;
    cx.textAlign = "left"; cx.font = f1; cx.fillStyle = t; cx.fillText(p1, x0, y + 26 * K * k); cx.font = f2; cx.fillStyle = a; cx.fillText(nomM, x0 + w1, y + 26 * K * k); y += (32 + 14) * K * k;
    /* le calendrier */
    const gx = 3 * K * k, cw = (CW - 2 * PX - 6 * gx) / 7, ch = 34 * K * k, xc = i => X + PX + i * (cw + gx);
    cx.textAlign = "center"; cx.textBaseline = "middle"; cx.fillStyle = t; cx.globalAlpha = .55; cx.font = `500 ${10.5 * K * k}px Jost, sans-serif`;
    ["L", "M", "M", "J", "V", "S", "D"].forEach((l, i) => cx.fillText(l, xc(i) + cw / 2, y + 6 * K * k)); cx.globalAlpha = 1; y += 14 * K * k;
    per.jours.forEach((j, n) => { const p = dec + n, cl = p % 7, rg = Math.floor(p / 7), x = xc(cl), yy = y + rg * (ch + 4 * K * k), mx = x + cw / 2, nb = j.libres.length;
      if (j.ferme) { cx.globalAlpha = .18; cx.fillStyle = t; cx.font = `400 ${15 * K * k}px Jost, sans-serif`; cx.fillText(String(j.d.getDate()), mx, yy + ch / 2); cx.globalAlpha = 1; return; }
      if (!nb) { cx.globalAlpha = .35; cx.fillStyle = t; cx.font = `400 ${15 * K * k}px Jost, sans-serif`; cx.fillText(String(j.d.getDate()), mx, yy + ch * .36);
        cx.font = `400 ${9 * K * k}px Jost, sans-serif`; cx.fillText("complet", mx, yy + ch * .74); cx.globalAlpha = 1; return; }
      cx.fillStyle = pil; rond(cx, x, yy, cw, ch, 12 * K * k); cx.fill();
      cx.fillStyle = t; cx.font = `500 ${15 * K * k}px Jost, sans-serif`; cx.fillText(String(j.d.getDate()), mx, yy + ch * .36);
      cx.fillStyle = a; cx.font = `500 ${9.5 * K * k}px Jost, sans-serif`; cx.fillText(nb + (nb > 1 ? " places" : " place"), mx, yy + ch * .75); });
    y += rangs * (ch + 4 * K * k) - 4 * K * k + 12 * K * k;
    /* la légende et la petite phrase */
    cx.fillStyle = t; cx.globalAlpha = .7; cx.font = `400 ${11 * K * k}px Jost, sans-serif`; cx.fillText("en couleur = il reste de la place   ·   pâle = complet", W / 2, y + 7 * K * k); cx.globalAlpha = 1; y += (13 + 8) * K * k;
    cx.globalAlpha = .75; cx.font = `italic 500 ${15 * K * k}px 'Cormorant Garamond', serif`; cx.fillText(astuce, W / 2, y + 9 * K * k); cx.globalAlpha = 1;
    /* les 2 charms (en haut, de chaque côté) ; sans charm, des étoiles ✦ */
    const c1 = s.charms[0] && await charmSur(cx, s.charms[0], 10 * K, TOP - 32 * K, 62 * K, -14), c2 = s.charms[1] && await charmSur(cx, s.charms[1], W - 10 * K - 52 * K, TOP - 22 * K, 52 * K, 12);
    if (!c1) { etoileSur(cx, X + 4 * K, TOP - 4 * K, 30 * K); etoileSur(cx, X + 22 * K, TOP - 22 * K, 14 * K); } if (!c2) { etoileSur(cx, W - X - 4 * K, TOP - 2 * K, 24 * K); etoileSur(cx, W - X - 22 * K, TOP - 20 * K, 12 * K); }
    pilule(cx, ["réserve ici ↓"], W / 2, 1272, false);
    pilule(cx, SIGNATURE, W / 2, 1575 - 27 * K, true);
    return c; }

  async function dessine(sem) {
    await Promise.all([chargeFonds(), chargePolices()]);
    { const nom = donnees().fond; if (nom && !(window.F100 && F100.idx[nom] != null)) await fondsDuSite(); }
    const s = site(), c = document.createElement("canvas"); c.width = W; c.height = H; const cx = c.getContext("2d");
    await Promise.all([`60px ${s.pol[0]}`, `500 40px 'Cormorant Garamond'`, `400 12px Jost`, `500 12px Jost`].map(f => document.fonts.load(f, s.nom + "Mes dispos 0123456789h♡").catch(() => {})));
    await fond(cx, s);
    /* les couleurs de la carte : claire sur un fond clair, sombre sur un fond foncé */
    const t = s.sombre ? "#F3F0EC" : melange(s.acc, "#1E1C1B", .45), a = s.sombre ? melange(s.acc, "#FFFFFF", .7) : s.acc,
      carte = s.sombre ? "rgba(18,18,20,.82)" : "rgba(255,250,248,.93)", pil = s.sombre ? "rgba(255,255,255,.13)" : melange(s.acc, "#FFFFFF", .85), trait = s.sombre ? "rgba(255,255,255,.14)" : "rgba(30,28,27,.10)";
    if (sem.mois != null) return dessineMois(cx, c, s, sem, { t, a, carte, pil });
    /* la mise en page (en px de l'image 1080 × 1920) : rien d'important dans les 250 px du haut ni les 340 px du bas (barres d'Instagram)
       carte de 270 à 1250 au plus · « réserve ici ↓ » à 1272 · place vide pour l'autocollant « Lien » · signature qui finit à 1575 */
    const TOP = 270, CB_MAX = 1250, Y_ICI = 1272, Y_SIG = 1575 - 27 * K;
    const X = 26 * K, CW = W - 2 * X, PADX = 22 * K;
    const police = (k, fs) => `400 ${fs}px ${s.pol[0]}, 'Great Vibes', cursive`;
    /* le nom : il rétrécit, puis passe sur 2 lignes s'il est très long */
    const nomLignes = k => { const max = CW - 2 * PADX; let fs = 34 * K * k * s.pol[1]; cx.font = police(k, fs);
      while (cx.measureText(s.nom).width > max && fs > 24 * K * k * s.pol[1]) { fs -= 2; cx.font = police(k, fs); }
      if (cx.measureText(s.nom).width <= max) return { l: [s.nom], fs };
      const m = s.nom.split(" "); let best = [s.nom], ecart = 1e9;
      for (let i = 1; i < m.length; i++) { const a = m.slice(0, i).join(" "), b = m.slice(i).join(" "), d = Math.max(cx.measureText(a).width, cx.measureText(b).width); if (d < ecart) { ecart = d; best = [a, b]; } }
      while (Math.max(...best.map(x => cx.measureText(x).width)) > max && fs > 14 * K * k) { fs -= 2; cx.font = police(k, fs); }
      return { l: best, fs }; };
    /* chaque jour tient sur UNE ligne : les premiers horaires, puis « + N autres » (jamais plus de 6 pastilles) */
    const pw = (txt, k) => { cx.font = `500 ${13 * K * k}px Jost, sans-serif`; return cx.measureText(txt).width + 20 * K * k; };
    const ligneJour = (j, k) => { const l = j.libres.map(hTxt), zone = CW - 2 * PADX - 66 * K * k - 8 * K * k, gap = 5 * K * k, larg = a => a.reduce((s2, t2) => s2 + pw(t2, k) + gap, -gap);
      if (l.length <= MAX && larg(l) <= zone) return l;
      for (let m = Math.min(l.length, MAX) - 1; m >= 1; m--) { const a = l.slice(0, m).concat("+ " + (l.length - m) + " autre" + (l.length - m > 1 ? "s" : "")); if (larg(a) <= zone) return a; }
      return [l[0], "+ " + (l.length - 1)]; };
    const mise = k => { const N = nomLignes(k), rangs = sem.jours.map(j => ({ lab: JC[j.i] + " " + j.d.getDate(), h: ligneJour(j, k) }));
      const tete = 26 * K * k + N.l.length * N.fs * 1.05 + (8 + 40 + 8 + 14 + 14) * K * k, corps = Math.max(1, rangs.length) * 44 * K * k + 12 * K * k; return { N, rangs, tete, CH: tete + corps }; };
    let k = 1, M = mise(1); for (let n = 0; n < 12 && TOP + M.CH > CB_MAX && k > .6; n++) { k = Math.max(.6, k * (CB_MAX - TOP) / M.CH - .005); M = mise(k); }
    const CH = M.CH, CB = TOP + CH;
    /* les 2 charms de son site, posés de travers comme sur la maquette (en haut à gauche, en bas à droite) */
    const charm = async (n, x, y, w, r) => { try { const im = await img(base() + "charms/" + n + ".png").catch(() => img(SITE + "charms/" + n + ".png")), h = w * im.naturalHeight / im.naturalWidth; cx.save(); cx.translate(x + w / 2, y + h / 2); cx.rotate(r * Math.PI / 180);
        cx.shadowColor = "rgba(0,0,0,.25)"; cx.shadowBlur = 8 * K; cx.shadowOffsetY = 6 * K; cx.drawImage(im, -w / 2, -h / 2, w, h); cx.restore(); return true; } catch (e) { return false; } };
    const etoile = (x, y, sz) => { cx.save(); cx.font = `${sz}px 'Cormorant Garamond', serif`; cx.fillStyle = "#fff"; cx.textAlign = "center"; cx.textBaseline = "middle"; cx.shadowColor = "rgba(0,0,0,.3)"; cx.shadowBlur = 12; cx.fillText("✦", x, y); cx.restore(); };
    /* le carnet */
    cx.save(); cx.shadowColor = "rgba(30,20,22,.28)"; cx.shadowBlur = 40; cx.shadowOffsetY = 18; cx.fillStyle = carte; rond(cx, X, TOP, CW, CH, 26 * K); cx.fill(); cx.restore();
    cx.textAlign = "center"; cx.textBaseline = "alphabetic";
    let y = TOP + 26 * K * k; cx.font = police(k, M.N.fs); cx.fillStyle = a;
    M.N.l.forEach(l => { y += M.N.fs * 1.05; cx.fillText(l, W / 2, y - M.N.fs * .18); });
    y += 8 * K * k; cx.fillStyle = t; cx.font = `500 ${40 * K * k}px 'Cormorant Garamond', Georgia, serif`; cx.fillText("Mes dispos", W / 2, y + 32 * K * k); y += (40 + 8) * K * k;
    const j0 = sem.jours[0], j1 = sem.jours[sem.jours.length - 1], quand = !j0 ? "" : j0.d.getMonth() === j1.d.getMonth() ? (j0 === j1 ? `le ${j0.d.getDate()} ${MOIS[j0.d.getMonth()]}` : `du ${j0.d.getDate()} au ${j1.d.getDate()} ${MOIS[j1.d.getMonth()]}`) : `du ${j0.d.getDate()} ${MOIS[j0.d.getMonth()]} au ${j1.d.getDate()} ${MOIS[j1.d.getMonth()]}`;
    cx.globalAlpha = .65; cx.font = `400 ${12 * K * k}px Jost, sans-serif`; if ("letterSpacing" in cx) cx.letterSpacing = `${.08 * 12 * K * k}px`; cx.fillText(quand.toUpperCase(), W / 2, y + 11 * K * k); if ("letterSpacing" in cx) cx.letterSpacing = "0px"; cx.globalAlpha = 1; y += 28 * K * k;
    if (!M.rangs.length) { cx.font = `italic 500 ${18 * K * k}px 'Cormorant Garamond', serif`; cx.globalAlpha = .6; cx.textBaseline = "middle"; cx.fillText("pas de dispo cette semaine ♡", W / 2, y + 22 * K * k); cx.globalAlpha = 1; }
    M.rangs.forEach(li => { cx.fillStyle = trait; cx.fillRect(X + PADX, y, CW - 2 * PADX, 3); const mil = y + 22 * K * k;
      cx.textAlign = "left"; cx.textBaseline = "middle"; cx.fillStyle = t; cx.font = `500 ${13.5 * K * k}px Jost, sans-serif`; cx.fillText(li.lab, X + PADX, mil);
      let x = X + PADX + 66 * K * k + 8 * K * k;
      if (!li.h.length) { cx.globalAlpha = .5; cx.font = `italic 500 ${16 * K * k}px 'Cormorant Garamond', serif`; cx.fillText("complet ♡", x, mil); cx.globalAlpha = 1; }
      li.h.forEach(txt => { const w = pw(txt, k), ph = 26 * K * k; cx.fillStyle = pil; rond(cx, x, mil - ph / 2, w, ph, ph / 2); cx.fill();
        cx.fillStyle = t; cx.textAlign = "center"; cx.font = `500 ${13 * K * k}px Jost, sans-serif`; cx.fillText(txt, x + w / 2, mil + 1); x += w + 5 * K * k; });
      y += 44 * K * k; });
    /* sans charm sur son site : de petites étoiles ✦ à la place */
    const c1 = s.charms[0] && await charm(s.charms[0], 12 * K, TOP - 30 * K, 62 * K, -14), c2 = s.charms[1] && await charm(s.charms[1], W - 12 * K - 56 * K, CB - 22 * K, 56 * K, 12);
    if (!c1) { etoile(X + 4 * K, TOP - 4 * K, 30 * K); etoile(X + 22 * K, TOP - 22 * K, 14 * K); } if (!c2) { etoile(W - X - 4 * K, CB + 2 * K, 24 * K); etoile(W - X + 12 * K, CB + 22 * K, 12 * K); }
    /* la pastille « réserve ici ↓ » au-dessus de la place vide pour l'autocollant « Lien », puis la signature (toujours là, non désactivable) */
    pilule(cx, ["réserve ici ↓"], W / 2, Y_ICI, false);
    pilule(cx, SIGNATURE, W / 2, Y_SIG, true);
    return c; }

  /* ---------- 5 · la feuille d'aperçu ---------- */
  const lien = () => S.site && S.site.en_ligne && S.site.slug ? lienDuSite(S.site) : "";
  const copie = () => { const u = lien(); if (!u) return Promise.resolve(false); try { return navigator.clipboard.writeText(u).then(() => true, () => false); } catch (e) { return Promise.resolve(false); } };
  let ETAT = { n: 0, blob: null, url: "", jeton: 0 };
  /* 19/11 (Marie : « le carré met du temps à s'afficher », « à chaque onglet ça se ferme, ça se rouvre ») :
     les 3 images (cette semaine, la suivante, le mois) sont préparées À L'AVANCE pendant qu'elle est sur l'Accueil.
     À l'ouverture et à chaque onglet, l'image est déjà là : tout s'affiche d'un coup, sans rond qui tourne.
     En même temps on relit ses rendez-vous : si une place a changé, l'image est redessinée et remplacée sans clignoter. */
  const CACHE = {}, EN_COURS = {};
  const signe = sem => JSON.stringify(sem.jours.map(j => [+j.d, j.ferme ? 1 : 0, j.libres])) + "|" + JSON.stringify(donnees());
  async function fabrique(n) { const k = String(n), sem = n === "M" ? await mois() : await semaine(n), s = signe(sem), avant = CACHE[k];
    if (avant && avant.sig === s) return avant;
    const c = await dessine(sem), blob = await new Promise((ok, ko) => { try { c.toBlob(b => b ? ok(b) : ko(new Error("vide")), "image/jpeg", .93); } catch (e) { ko(e); } });
    const v = { blob, url: URL.createObjectURL(blob), sig: s };
    if (avant) setTimeout(() => URL.revokeObjectURL(avant.url), 20000);
    return (CACHE[k] = v); }
  const obtenir = n => { const k = String(n); return EN_COURS[k] || (EN_COURS[k] = fabrique(n).finally(() => { delete EN_COURS[k]; })); };
  let dernierPrechauffe = 0;
  const prechauffe = (force) => { if (!S.user || (!force && Date.now() - dernierPrechauffe < 60000)) return; dernierPrechauffe = Date.now();
    obtenir(0).catch(() => {}).then(() => obtenir(1)).catch(() => {}).then(() => obtenir("M")).catch(() => {}); };
  const apercuHtml = v => `<img src="${v.url}" alt="Aperçu de ma story : mes dispos">`;
  async function prepare(n) {
    const j = ++ETAT.jeton, k = String(n), deja = CACHE[k];
    const montre = v => { ETAT.blob = v.blob; ETAT.url = v.url; const zz = E.querySelector(".dsp-apercu"); if (zz) { const im = zz.querySelector("img");
        if (im) { if (im.getAttribute("src") !== v.url) im.src = v.url; } else zz.innerHTML = apercuHtml(v); zz.classList.remove("charge"); }
      const b = E.querySelector('[data-dsp="partage"]'); if (b) b.disabled = false; };
    if (deja) montre(deja); else { const z = E.querySelector(".dsp-apercu"); if (z) z.classList.add("charge"); }
    try { const v = await obtenir(n); if (j === ETAT.jeton) montre(v); }
    catch (e) { console.error(e); if (j === ETAT.jeton && !deja) { const zz = E.querySelector(".dsp-apercu"); if (zz) { zz.classList.remove("charge"); zz.innerHTML = '<span class="dsp-oups">Oups, l’image n’a pas pu se faire.<br>Réessayez.</span>'; } } } }
  function feuille() {
    ecrit("loginail-dispos-vu", "1"); ETAT.n = 0; ETAT.blob = null;
    const u = lien(), c0 = CACHE["0"];
    ouvre(`<div class="dsp"><h3>Mes dispos</h3>
      <div class="dsp-bascule" role="tablist"><button role="tab" data-dsp="sem" data-n="0" class="on" aria-selected="true">Cette semaine</button><button role="tab" data-dsp="sem" data-n="1" aria-selected="false">La suivante</button><button role="tab" data-dsp="sem" data-n="M" aria-selected="false">${(m => m.charAt(0).toUpperCase() + m.slice(1))(MOIS[(new Date().getMonth() + 1) % 12])}</button></div>
      <div class="dsp-apercu${c0 ? "" : " charge"}">${c0 ? apercuHtml(c0) : ""}</div>
      <button class="btn dsp-btn" data-dsp="partage"${c0 ? "" : " disabled"}><svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M12 15V3M7 8l5-5 5 5"/><path d="M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-7"/></svg>Partager sur Instagram</button>
      <div class="dsp-copie${u ? "" : " non"}" aria-live="polite">${u ? "<i></i>Votre lien de réservation est copié" : "Mettez votre site en ligne pour avoir votre lien de réservation"}</div></div>`);
    E.querySelector(".feuille").classList.add("dsp-f");
    if (u) copie().then(ok => { const m = E.querySelector(".dsp-copie"); if (m && !ok) { m.classList.add("attend"); m.innerHTML = "<i></i>Votre lien sera copié quand vous partagerez"; } });
    prepare(0).then(() => { if (!CACHE["1"] || !CACHE.M) prechauffe(true); }); }
  /* l'appli ferme la feuille : on enlève notre marque */
  new MutationObserver(() => { if (!E.classList.contains("fe")) { const f = E.querySelector(".feuille.dsp-f"); if (f) f.classList.remove("dsp-f"); } }).observe(E, { attributes: true, attributeFilter: ["class"] });
  document.addEventListener("click", e => { const b = e.target.closest && e.target.closest("[data-dsp]"); if (!b) return; e.stopPropagation(); const k = b.dataset.dsp;
    if (k === "ouvre") return feuille();
    if (k === "sem") { const n = b.dataset.n === "M" ? "M" : +b.dataset.n; if (n === ETAT.n) return; ETAT.n = n; b.parentElement.querySelectorAll("button").forEach(x => { x.classList.toggle("on", x === b); x.setAttribute("aria-selected", x === b); });
      if (!CACHE[String(n)]) { const p = E.querySelector('[data-dsp="partage"]'); if (p) p.disabled = true; } return prepare(n); }
    if (k === "partage") { if (!ETAT.blob) return;
      /* le lien d'abord (pendant que le toucher compte encore), puis le menu Partager du téléphone avec l'image */
      copie().then(ok => { const m = E.querySelector(".dsp-copie"); if (m && ok) { m.classList.remove("attend"); m.innerHTML = "<i></i>Votre lien de réservation est copié"; } });
      const d = ETAT.n === "M" ? null : plusJours(lundiDe(new Date()), 7 * ETAT.n), nomF = d ? `${d.getDate()}-${MOIS[d.getMonth()]}` : MOIS[(new Date().getMonth() + 1) % 12];
      partageFichier(ETAT.blob, `mes-dispos-${nomF.normalize("NFD").replace(/[̀-ͯ]/g, "")}.jpg`, "Image enregistrée ✓"); } }, true);

  /* ---------- 6 · le bouton, tout en bas de l'Accueil (16/11, Marie : seulement dans l'Accueil, plus dans l'Agenda) ---------- */
  const vAcc = VUES.acc;
  VUES.acc = () => { const h = vAcc(); setTimeout(() => prechauffe(false), 1200);   /* 19/11 : les images se préparent pendant qu'elle regarde l'Accueil */
    const neuf = lit("loginail-dispos-vu", "") !== "1", s = (() => { try { return site(); } catch (e) { return { fond: null }; } })();
    const vig = s.fond ? `<span class="dsp-vig f100" aria-hidden="true">${s.fond.base === SITE ? s.fond.html.replace(/url\((?!['"]?(data:|https?:))(['"]?)/g, "url($2" + SITE) : s.fond.html}<i></i></span>` : '<span class="dsp-vig" aria-hidden="true"><i></i></span>';
    return h + `<button class="dsp-ouvre" data-dsp="ouvre">${neuf ? '<span class="dsp-neuf">nouveau</span>' : ""}${vig}<span class="dsp-t"><b>Partager mes dispos</b><small>Votre story de la semaine, prête en 1 clic</small></span><span class="dsp-fl" aria-hidden="true">›</span></button>`; };
  /* la vignette montre son fond : on charge les fonds une fois, puis on redessine l'accueil s'il est ouvert */
  chargeFonds().then(() => { if (S.onglet === "acc" && E.querySelector(".ong") && !E.classList.contains("fe")) try { rendu(); } catch (e) {} });

  const st = document.createElement("style");
  st.textContent = `
#E .dsp-ouvre{position:relative;display:flex;align-items:center;gap:12px;width:100%;margin:26px 0 8px;padding:12px 14px;border-radius:18px;background:#fff;border:1px solid color-mix(in srgb,var(--v-acc) 35%,transparent);box-shadow:0 14px 30px -20px rgba(120,40,55,.55);font:inherit;text-align:left;color:inherit;cursor:pointer;transition:transform .12s}
#E .dsp-ouvre:active{transform:scale(.98)}
#E .dsp-ouvre .dsp-t{flex:1;min-width:0}
#E .dsp-ouvre b{display:block;font-weight:500;font-size:15px;color:var(--v-encre,#1E1C1B)}
#E .dsp-ouvre small{display:block;font-size:12.5px;color:var(--gris);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
#E .dsp-fl{color:var(--v-acc);font-size:20px;flex:none}
#E .dsp-neuf{position:absolute;top:-9px;right:14px;font-size:10.5px;letter-spacing:.04em;background:var(--v-acc);color:#fff;border-radius:99px;padding:2px 8px;line-height:1.4}
#E .dsp-vig{position:relative;width:34px;height:52px;border-radius:8px;flex:none;overflow:hidden;background:linear-gradient(160deg,var(--v-h1,#F2D7D6),var(--v-acc,#B5475E));box-shadow:0 4px 10px -4px rgba(0,0,0,.35);animation:dspSouffle 2.6s ease-in-out infinite}
#E .dsp-vig>.tuile{position:absolute;inset:0;width:auto;height:auto;border-radius:0;background-size:cover}
#E .dsp-vig>i{position:absolute;inset:8px 5px;border-radius:4px;background:rgba(255,255,255,.85);z-index:2}
@keyframes dspSouffle{0%,100%{transform:rotate(-4deg)}50%{transform:rotate(3deg) translateY(-2px)}}
#E .feuille.dsp-f{max-height:calc(100% - 40px)}
#E .dsp h3{font:400 30px/1.1 'Italiana','Cormorant Garamond',Georgia,serif;margin:4px 0 0;text-align:center}
#E .dsp-bascule{display:flex;background:color-mix(in srgb,var(--v-rose,#F5E6E4) 70%,#E9E2DC);border-radius:99px;padding:3px;margin:12px 0 14px}
#E .dsp-bascule button{flex:1;min-width:0;padding:0 4px;white-space:nowrap;height:36px;border:0;border-radius:99px;background:transparent;font:inherit;font-size:13.5px;color:var(--gris);cursor:pointer;transition:background .2s,color .2s,box-shadow .2s}
#E .dsp-bascule button.on{background:#fff;color:var(--v-fonce);box-shadow:0 2px 8px -4px rgba(0,0,0,.3)}
#E .dsp-apercu{position:relative;width:min(206px,52vw);aspect-ratio:9/16;margin:0 auto 16px;border-radius:14px;overflow:hidden;background:linear-gradient(160deg,var(--v-h1,#F2D7D6),var(--v-h2,#F7ECEA));box-shadow:0 18px 34px -16px rgba(42,27,30,.5)}
#E .dsp-apercu img{display:block;width:100%;height:100%;animation:dspArrive .3s ease both}
#E .dsp-apercu.charge img{opacity:.45;transition:opacity .2s}
#E .dsp-apercu.charge::after{content:"";position:absolute;left:50%;top:50%;width:28px;height:28px;margin:-14px 0 0 -14px;border-radius:50%;border:2.5px solid rgba(255,255,255,.9);border-top-color:var(--v-acc);animation:dspTourne .8s linear infinite}
#E .dsp-oups{position:absolute;inset:0;display:grid;place-items:center;text-align:center;padding:16px;font-size:13px;color:var(--gris)}
@keyframes dspArrive{from{opacity:0;transform:scale(.97)}to{opacity:1;transform:none}}
@keyframes dspTourne{to{transform:rotate(360deg)}}
#E .dsp-btn{display:flex;align-items:center;justify-content:center;gap:10px;background:var(--v-fonce);transition:opacity .2s,transform .12s}
#E .dsp-btn:disabled{opacity:.55}
#E .dsp-copie{display:flex;align-items:center;justify-content:center;gap:8px;font-size:12.5px;color:#2E6B4F;margin-top:12px;text-align:center}
#E .dsp-copie i{width:7px;height:7px;border-radius:50%;background:#3D8B66;flex:none}
#E .dsp-copie.non,#E .dsp-copie.attend{color:var(--gris)}#E .dsp-copie.attend i{background:#C9BFB6}
@media (prefers-reduced-motion:reduce){#E .dsp-vig,#E .dsp-apercu img,#E .dsp-apercu.charge::after{animation:none}}`;
  document.head.appendChild(st);
})();
