/* Loginail · importer ses clientes (22/11, Marie : « Oui, corrige »).
   La fenêtre et les étapes par appli restent dans suite.js ; ici : lire les fichiers, ranger les numéros, éviter les doublons, dire ce qui est à vérifier.
   On écoute sur window (avant document) pour remplacer la lecture de suite.js sans modifier ce fichier.
   Tout est lu dans le téléphone : le fichier n'est envoyé nulle part. */
(function () {
  const BROUILLON = "loginail-import-brouillon";
  const plat = s => String(s ?? "").normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
  const net = s => String(s ?? "").replace(/\s+/g, " ").trim();
  const maj = s => net(s).replace(/(^|[\s'’-])(\p{Ll})/gu, (x, a, b) => a + b.toUpperCase());
  const pluriel = (n, mot) => `${n} ${mot}${n > 1 ? "s" : ""}`;

  /* ---- les numéros : toujours « 06 12 34 56 78 », comme sur le site, pour retrouver la cliente quand elle réserve ---- */
  const numero = v => {
    const brut = net(v).replace(/\.0$/, "");
    if (!brut || /\d[.,]?\d*e\+\d+/i.test(brut)) return null;
    let d = brut.replace(/\(0\)/g, "").replace(/\D/g, "").replace(/^00/, "");
    if (/^330\d{9}$/.test(d)) d = d.slice(2);
    else if (/^33[1-9]\d{8}$/.test(d) || /^(262|590|594|596)[1-9]\d{8}$/.test(d)) d = "0" + d.slice(-9);
    else if (/^[67]\d{8}$/.test(d) && !/^\+/.test(brut)) d = "0" + d;   /* Excel enlève le 0 du début */
    if (/^0[1-9]\d{8}$/.test(d)) return d.replace(/(\d\d)(?=\d)/g, "$1 ");
    return /^(\+|00)/.test(brut) && d.length >= 8 && d.length <= 15 ? "+" + d : d.length >= 8 && d.length <= 15 ? d : null;
  };
  const cle = v => (numero(v) || "").replace(/\D/g, "");
  const portable = v => /^0[67]\d{8}$/.test(cle(v));
  const choisit = liste => {   /* plusieurs numéros : le portable passe avant le fixe */
    const t = liste.flatMap(v => String(v ?? "").split(/\s*[/,;|\n]\s*/)).map(numero).filter(Boolean);
    return t.find(portable) || t[0] || null;
  };

  /* ---- les colonnes ---- */
  const DE = "(?: (?:du |de la |de l )?(?:client|cliente|customer|contact))?", AV = "(?:(?:client|cliente|customer|contact) )?";
  const COL = {
    prenom: new RegExp(`^${AV}(?:prenoms?|first ?name|given name)${DE}$`),
    nom: new RegExp(`^${AV}(?:nom|noms|nom de famille|last ?name|surname|family name)$`),
    nomPrenom: new RegExp(`^noms? (?:et )?prenoms?${DE}$`),
    entier: /^(nom complet|prenoms? (et )?noms?|nom (du |de la |de l )?(client|cliente|contact)|client|cliente|clients|clientes|customer|contact|name|full ?name|display name|(client|customer|contact) (full )?name)$/
  };
  const colTel = h => /\b(tel|tels|telephones?|phones?|telephone\d|mobiles?|portables?|gsm|cell|cellphone|whatsapp)\b/.test(h) && !/\b(pays|country|indicatif|prefixe|consent\w*|accord|opt|verifie|verified|type)\b/.test(h);
  const colonnes = ligne => {
    const h = ligne.map(plat), ou = r => h.findIndex(x => r.test(x));
    const c = { prenom: ou(COL.prenom), nom: ou(COL.nom), nomPrenom: ou(COL.nomPrenom), entier: ou(COL.entier), tels: h.map((x, i) => colTel(x) ? i : -1).filter(i => i >= 0) };
    const noms = [c.prenom, c.nom, c.nomPrenom, c.entier].filter(i => i >= 0).length;
    if (!noms || ligne.some(x => /\d{8}/.test(String(x ?? "").replace(/[ .-]/g, "")))) return null;
    c.score = noms + c.tels.length;
    return c.score > 1 || ligne.filter(x => net(x)).length === 1 || h.some(x => /mail/.test(x)) ? c : null;
  };
  const entete = L => {
    for (let i = 0; i < Math.min(L.length, 15); i++) { const c = colonnes(L[i]); if (c) return { i, c }; }
    return null;
  };

  /* un tableau : guillemets, virgules et retours à la ligne dans les cases */
  const tableau = (t, sep) => {
    const L = []; let l = [], x = "", q = false;
    for (let i = 0; i < t.length; i++) {
      const c = t[i];
      if (q) { if (c !== '"') x += c; else if (t[i + 1] === '"') { x += c; i++; } else q = false; }
      else if (c === '"' && !x.trim()) { q = true; x = ""; }
      else if (c === sep) { l.push(x); x = ""; }
      else if (c === "\n" || c === "\r") { if (c === "\r" && t[i + 1] === "\n") i++; l.push(x); L.push(l); l = []; x = ""; }
      else x += c;
    }
    l.push(x); L.push(l);
    return L.filter(r => r.some(v => net(v)));
  };

  const deLignes = L => {
    const e = entete(L);
    if (!e) {
      /* sans titres de colonnes, on lit seulement ce qui ressemble vraiment à « prénom, nom, numéro » */
      const estTel = v => /^[+()\d\s./-]+$/.test(net(v)) && !!numero(v);
      const avec = L.filter(r => r.some(estTel));
      if (L.every(r => r.filter(v => net(v)).length === 1)) return L.map(r => lisLigne(net(r.join(" ")))).filter(Boolean);
      if (avec.length !== L.length) return null;
      return L.map(r => {
        const mots = r.map(net).filter(v => v && !/[@\d]/.test(v)).slice(0, 2).join(" ").split(" ").filter(Boolean);
        return { prenom: maj(mots.shift()), nom: maj(mots.join(" ")) || null, telephone: choisit(r.filter(estTel)) };
      });
    }
    const c = e.c;
    return L.slice(e.i + 1).map(r => {
      const de = i => i >= 0 ? net(r[i]) : "";
      let prenom = de(c.prenom), nom = de(c.nom);
      if (!prenom) {
        const inverse = de(c.nomPrenom), mots = (inverse || de(c.entier) || nom).split(" ").filter(Boolean);
        prenom = (inverse ? mots.pop() : mots.shift()) || ""; nom = mots.join(" ");
      } else if (!nom && c.entier >= 0 && de(c.entier) !== prenom) {
        const t = de(c.entier); nom = t.startsWith(prenom + " ") ? t.slice(prenom.length + 1) : t;
      }
      const cases = c.tels.map(i => r[i]).filter(v => net(v)), tel = choisit(cases);
      return { prenom: maj(prenom), nom: maj(nom) || null, telephone: tel, illisible: cases.length > 0 && !tel };
    }).filter(x => (x.prenom || x.telephone) && !/^total\b/i.test(x.prenom));
  };

  const deTexte = t => {
    let mieux = null;
    for (const sep of [";", ",", "\t"]) { const L = tableau(t, sep), e = entete(L); if (e && (!mieux || e.c.score > mieux.s)) mieux = { L, s: e.c.score }; }
    if (mieux) return deLignes(mieux.L);
    const un = t.split(/\r?\n/).find(x => x.trim()) || "", sep = [";", "\t", ","].find(s => un.includes(s));
    return deLignes(tableau(t, sep || ";"));
  };

  const deVcf = t => t.replace(/=\r?\n(?==)/g, "").replace(/\r?\n[ \t]/g, "").split(/BEGIN:VCARD/i).slice(1).map(bloc => {
    const v = k => [...bloc.matchAll(new RegExp(`^(?:[\\w-]+\\.)?${k}((?:;[^:\\r\\n]*)?):([^\\r\\n]*)`, "gim"))].map(m => {
      let x = m[2];
      if (/quoted-printable/i.test(m[1])) try { x = decodeURIComponent(x.replace(/%/g, "%25").replace(/=([0-9a-f]{2})/gi, "%$1")); } catch (e) {}
      return x.trim();
    });
    const propre = s => net(String(s || "").replace(/\\([,;\\])/g, "$1")), n = (v("N")[0] || "").replace(/\\;/g, "\u0001").split(";").map(x => x.replace(/\u0001/g, ";"));
    let prenom = propre(n[1]), nom = propre(n[0]);
    if (!prenom) { const mots = (propre(v("FN")[0]) || nom).split(" ").filter(Boolean); prenom = mots.shift() || ""; nom = mots.join(" "); }
    const tels = v("TEL"), tel = choisit(tels.map(x => x.replace(/^tel:/i, "")));
    return { prenom: maj(prenom), nom: maj(nom) || null, telephone: tel, illisible: tels.length > 0 && !tel };
  }).filter(x => x.prenom || x.telephone);

  const decode = buf => {
    const o = new Uint8Array(buf);
    if (o[0] === 0xff && o[1] === 0xfe) return new TextDecoder("utf-16le").decode(o);
    if (o[0] === 0xfe && o[1] === 0xff) return new TextDecoder("utf-16be").decode(o);
    try { return new TextDecoder("utf-8", { fatal: true }).decode(o); } catch (e) { return new TextDecoder("windows-1252").decode(o); }   /* vieux fichiers Excel */
  };

  let lecteur = null;
  const excel = () => lecteur || (lecteur = new Promise((ok, ko) => {
    if (window.XLSX) return ok(window.XLSX);
    const s = document.createElement("script");
    s.src = "https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js";
    s.onload = () => ok(window.XLSX); s.onerror = () => { lecteur = null; s.remove(); ko(); };
    document.head.appendChild(s);
  }));
  const litFichier = async f => {
    const buf = await f.arrayBuffer(), o = new Uint8Array(buf.slice(0, 4));
    if ((o[0] === 0x50 && o[1] === 0x4b) || (o[0] === 0xd0 && o[1] === 0xcf)) {
      const X = await excel(), w = X.read(buf, { type: "array" });
      const feuilles = w.SheetNames.map(n => X.utils.sheet_to_json(w.Sheets[n], { header: 1, raw: true, defval: "", blankrows: false }).map(r => r.map(String))).filter(L => L.length);
      const L = feuilles.find(entete) || feuilles[0];
      return L ? deLignes(L) : [];
    }
    if (o[0] === 0x25 && o[1] === 0x50 && o[2] === 0x44 && o[3] === 0x46) return null;   /* un PDF */
    const t = decode(buf).replace(/^﻿/, "");
    return /BEGIN:VCARD/i.test(t) ? deVcf(t) : deTexte(t);
  };

  /* ---- la liste qu'elle relit : une cliente par ligne ---- */
  let lues = new Map();   /* ligne → colonnes d'origine, pour garder « Marie Claire » en prénom */
  function lisLigne(brute) {
    let l = net(brute), ig = null;
    if (lues.has(l)) return { ...lues.get(l) };
    l = net(l.replace(/(^|\s)@([\w.]{2,30})(?=\s|$)/, (x, a, p) => { ig = p.toLowerCase().replace(/\.+$/, ""); return " "; }));
    /* un vrai numéro français d'abord : « Léa 2 06… » garde son 2 dans le nom */
    const m = l.match(/(?:^|[\s;,:])((?:\+33|0033) ?(?:\(0\) ?)?[1-9](?:[ .-]?\d){8}|0[1-9](?:[ .-]?\d){8})$/) || l.match(/(?:^|[\s;,:])(\+?\d[\d .\-()/]{6,}\d)$/), tel = m ? choisit([m[1]]) : null;
    const mots = net((m ? l.slice(0, m.index) : l).replace(/[;,\t]+/g, " ")).split(" ").filter(Boolean);
    if (!mots.length && !ig && !m) return null;
    const c = { prenom: mots.length ? maj(mots[0]) : ig ? "@" + ig : "", nom: maj(mots.slice(1).join(" ")) || null, telephone: tel, illisible: !!m && !tel };
    if (ig) c.instagram = ig;
    return c;
  }
  const ecrit = c => {
    const l = net([c.prenom, c.nom, c.telephone].filter(Boolean).join(" "));
    lues.set(l, c); return l;
  };

  /* ---- doublons et points à vérifier ---- */
  const prepare = (texte, existantes) => {
    const noms = new Map(), tels = new Set(), insta = new Set(), ajouts = [], verif = [];
    let deja = 0;
    const connait = c => {
      const n = plat(nomCli(c)) || nomCli(c), t = cle(c.telephone);
      if (!noms.has(n)) noms.set(n, []);
      noms.get(n).push(t);
      if (t) tels.add(t + "|" + plat(c.prenom));
      if (c.instagram) insta.add(String(c.instagram).toLowerCase());
    };
    existantes.forEach(connait);
    const L = texte.split(/\n+/).map(lisLigne).filter(Boolean);
    [...L.filter(c => c.telephone), ...L.filter(c => !c.telephone)].forEach(c => {
      const t = cle(c.telephone);
      if (!c.prenom) { verif.push([c.telephone || "Une ligne sans nom", "pas de prénom, pas ajoutée"]); return; }
      if ((t && tels.has(t + "|" + plat(c.prenom))) || (c.instagram && insta.has(c.instagram))) { deja++; return; }
      const illisible = c.illisible, x = { ...c }; delete x.illisible;
      const n = plat(nomCli(x)) || nomCli(x), memes = noms.get(n);
      if (memes) {
        if (!t) { deja++; if (illisible) verif.push([nomCli(x), "numéro illisible, pas ajoutée"]); return; }
        if (memes.some(m => !m)) { deja++; verif.push([nomCli(x), `déjà là sans numéro : ajoute le ${x.telephone} dans sa fiche`]); return; }
        /* l'agenda retrouve une cliente par son nom : deux noms pareils enverraient le rappel à la mauvaise */
        x.nom = net(`${x.nom || ""} (${t.slice(-4)})`);
        verif.push([nomCli(x), "même nom qu’une autre : fin du numéro ajoutée"]);
        noms.get(n).push(t);
      } else if (illisible) verif.push([nomCli(x), "numéro illisible, pas de SMS"]);
      else if (!t) verif.push([nomCli(x), "sans numéro, pas de SMS"]);
      else if (/^0[1-589]/.test(t)) verif.push([nomCli(x), "numéro fixe, pas de SMS"]);
      else if (!portable(t) && !/^(262|269|590|594|596|687|689)/.test(t)) verif.push([nomCli(x), "numéro à relire, SMS pas garanti"]);
      connait(x); ajouts.push(x);
    });
    return { ajouts, verif, deja };
  };
  const liste = v => v.map(([qui, quoi]) => `<li><b>${esc(qui)}</b><span>${esc(quoi)}</span></li>`).join("");

  const st = document.createElement("style");
  st.textContent = `.imp-bilan:empty{display:none}.imp-bilan{margin-top:10px;font-size:13px;line-height:1.4;color:#6B625C;text-align:left}
.imp-bilan summary{cursor:pointer;padding:8px 0;color:#1E1C1B}
.imp-liste{list-style:none;margin:0;padding:0;text-align:left}
.imp-liste li{padding:9px 0;border-bottom:1px solid rgba(30,28,27,.08);font-size:14px;line-height:1.35;overflow-wrap:anywhere}
.imp-liste b{display:block;font-weight:500}.imp-liste span{color:#6B625C;font-size:13px}`;
  document.head.appendChild(st);

  addEventListener("input", e => {
    if (e.target.id !== "s5-liste") return;
    const b = E.querySelector('[data-s5="pl-ok"]'); if (!b) return;
    let z = E.querySelector(".imp-bilan");
    if (!z) { z = document.createElement("div"); z.className = "imp-bilan"; z.setAttribute("aria-live", "polite"); b.before(z); }
    const r = prepare(e.target.value, S.clientes), n = r.ajouts.length, ouvert = !!z.querySelector("details[open]");
    b.disabled = !e.target.value.trim();
    b.textContent = n ? `Ajouter ${pluriel(n, "cliente")}` : "Ajouter";
    z.innerHTML = (r.deja ? `<div>${r.deja} déjà dans ta liste ou en double</div>` : "")
      + (r.verif.length ? `<details${ouvert ? " open" : ""}><summary>${r.verif.length} à vérifier · voir</summary><ul class="imp-liste">${liste(r.verif)}</ul></details>` : "");
  });

  addEventListener("change", async e => {
    if (e.target.id !== "s5-fic") return;
    e.stopPropagation();
    const f = e.target.files && e.target.files[0]; if (!f) return;
    let L;
    try { L = await litFichier(f); }
    catch (x) { e.target.value = ""; return dit("Ce fichier ne s’ouvre pas. Vérifie ta connexion et réessaie."); }
    e.target.value = "";
    if (!L) return dit("Je n’arrive pas à lire ce fichier. Il me faut des colonnes Nom et Téléphone.");
    if (!L.length) return dit("Aucune cliente trouvée dans ce fichier");
    const z = E.querySelector("#s5-liste"); if (!z) return;
    z.value = (z.value.trim() ? z.value.trim() + "\n" : "") + L.map(ecrit).join("\n");
    z.dispatchEvent(new Event("input", { bubbles: true }));
    dit("Vérifie la liste, puis touche « Ajouter »");
  }, true);

  /* le serveur rend 1 000 fiches au plus à la fois */
  const toutes = async () => {
    let tout = [];
    for (let i = 0; ; i += 1000) {
      const q = sb.from("clientes").select("*").order("prenom");
      if (typeof q.range !== "function") { const { data, error } = await q; if (error) throw error; return data; }   /* salon d'essai */
      const { data, error } = await q.order("id").range(i, i + 999);
      if (error) throw error;
      tout = tout.concat(data);
      if (data.length < 1000) return tout;
    }
  };

  addEventListener("click", async e => {
    const b = e.target.closest && e.target.closest('[data-s5="pl-ok"]'); if (!b) return;
    e.stopPropagation(); e.preventDefault();
    if (b.disabled) return;
    const z = E.querySelector("#s5-liste"), avant = b.textContent, texte = z.value;
    b.disabled = true; b.textContent = "Un instant…";
    const rate = x => { if (x) console.error(x); b.disabled = false; b.textContent = avant; dit("Oups, ça n’a pas marché. Réessaie."); };
    try {
      const r = prepare(texte, await toutes()), n = r.ajouts.length;
      if (!n && !r.verif.length) { b.disabled = false; b.textContent = avant; return dit("Ces clientes sont déjà dans ta liste"); }
      if (n) {
        const { error } = await sb.from("clientes").insert(r.ajouts);   /* en un seul envoi : tout ou rien */
        if (error) return rate(error);
        try { localStorage.removeItem(BROUILLON); } catch (x) {}
        z.value = ""; lues = new Map();
        S.clientes = await toutes();
      }
      const titre = n ? `${pluriel(n, "cliente")} ajoutée${n > 1 ? "s" : ""}` : "Aucune cliente ajoutée";
      if (!r.verif.length && !r.deja) { ferme(); rendu(); return dit(titre + " ✓"); }
      rendu(); dit(n ? titre + " ✓" : titre);
      const sous = [r.deja && `${r.deja} déjà là ou en double`, r.verif.length && `${r.verif.length} à vérifier`].filter(Boolean).join(" · ");
      ouvre(`<h3>${titre}</h3><div class="sous">${sous}</div><ul class="imp-liste">${liste(r.verif)}</ul><button class="btn" data-a="fermer" style="margin-top:14px">C’est noté</button>`);
    } catch (x) { rate(x); }
  }, true);
})();
